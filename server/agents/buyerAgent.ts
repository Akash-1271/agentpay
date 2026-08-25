import crypto from 'crypto';
import { UAPCatalogEngine, ProductItem } from '../protocols/uap.js';
import { MerchantAgent, DynamicBundleOffer, AP2QuoteResult } from './merchantAgent.js';
import { BoundedSpendingEnclave, PolicyValidationResult } from '../protocols/guardEnclave.js';
import { RazorpayEngine, RazorpayOrderResponse } from '../razorpay/client.js';
import { WebhookManager } from '../razorpay/webhooks.js';
import { AP2SignedQuote } from '../protocols/ap2.js';
import { AmazonMerchantAdapter } from '../merchants/amazonAdapter.js';
import { FulfillmentEngine, FulfillmentOrder } from '../merchants/fulfillmentEngine.js';
import { DoubleEntryLedgerEngine } from '../protocols/doubleEntryLedger.js';
import { AgentToolExecutor } from './tools.js';
import { AgentPayDatabase } from '../db/database.js';

export interface AgentReasoningStep {
  step: number;
  agent: 'BuyerAgent' | 'MerchantAgent' | 'SpendingEnclave' | 'RazorpayGateway' | 'AmazonFulfillment' | 'FinOpsLedger';
  action: string;
  detail: string;
  status: 'SUCCESS' | 'WARNING' | 'GATED' | 'FAILED' | 'RECOVERED';
  timestamp: string;
  payload?: any;
}

export interface AgentTransactionOutcome {
  transactionId: string;
  intent: string;
  status: 'COMPLETED' | 'STEP_UP_REQUIRED' | 'REJECTED_POLICY' | 'FAILED_RECOVERED' | 'FAILED_OUT_OF_STOCK';
  reasoningTrail: AgentReasoningStep[];
  selectedProduct?: ProductItem;
  quote?: AP2SignedQuote | null;
  policyResult?: PolicyValidationResult;
  razorpayOrder?: RazorpayOrderResponse;
  upiQr?: { upiUri: string; qrDataUrl: string };
  upsellOffers?: DynamicBundleOffer[];
  stepUpApprovalId?: string;
  alternativeProduct?: ProductItem;
  fulfillment?: FulfillmentOrder;
  receipt?: {
    receiptId: string;
    totalPaid: number;
    currency: string;
    paidAt: string;
    auditEnclaveHash: string;
  };
}

export class BuyerAgent {
  public static readonly AGENT_ID = 'agent_buyer_concierge';

  public static async executeCommerceFlow(params: {
    userPrompt: string;
    autoAcceptBundles?: boolean;
    forceBundleIds?: string[];
    overrideCategory?: string;
    simulatedFailureMode?: 'OUT_OF_STOCK' | 'BUDGET_BREACH' | 'PRICE_SURGE' | 'GATEWAY_TIMEOUT' | 'NONE';
  }): Promise<AgentTransactionOutcome> {
    const transactionId = `tx_${crypto.randomBytes(6).toString('hex')}`;
    const reasoningTrail: AgentReasoningStep[] = [];
    const timestamp = () => new Date().toISOString();

    // ----------------------------------------------------
    // STEP 1: Parse Natural Language Intent (ReAct Step 1)
    // ----------------------------------------------------
    const parsedIntent = this.extractIntentFromPrompt(params.userPrompt);

    reasoningTrail.push({
      step: 1,
      agent: 'BuyerAgent',
      action: 'PARSE_INTENT',
      detail: `Deconstructing user natural language intent: "${params.userPrompt}". Target: ${parsedIntent.keyword || 'General'}, Max Budget: ${parsedIntent.maxBudget ? '₹' + parsedIntent.maxBudget : 'Unbounded'}.`,
      status: 'SUCCESS',
      timestamp: timestamp(),
      payload: { rawPrompt: params.userPrompt, parsed: parsedIntent }
    });

    BoundedSpendingEnclave.recordAudit({
      agentId: this.AGENT_ID,
      principalUser: 'user_akash_ai_shopper',
      action: 'CATALOG_DISCOVERY',
      currency: 'INR',
      details: { prompt: params.userPrompt, parsed: parsedIntent },
      reasoning: `Buyer Agent parsed shopping intent from prompt: '${params.userPrompt}'.`
    });

    // ----------------------------------------------------
    // STEP 2: Query Canonical Catalog via Tool (ReAct Step 2)
    // ----------------------------------------------------
    const searchRes = await AgentToolExecutor.executeTool('search_products', {
      query: parsedIntent.keyword,
      category: params.overrideCategory || parsedIntent.category,
      maxPrice: parsedIntent.maxBudget
    });

    let matches: ProductItem[] = searchRes.products || [];
    if (matches.length === 0) {
      matches = UAPCatalogEngine.queryCatalog({});
    }

    let selectedProduct: ProductItem = matches[0];

    reasoningTrail.push({
      step: 2,
      agent: 'BuyerAgent',
      action: 'QUERY_UAP_CATALOG',
      detail: `Discovered candidate product: "${selectedProduct.name}" (₹${selectedProduct.price}) from merchant '${selectedProduct.merchantName}'. Available stock: ${selectedProduct.stock} units.`,
      status: 'SUCCESS',
      timestamp: timestamp(),
      payload: {
        matchesFound: matches.length,
        candidateSelected: selectedProduct.id,
        specs: selectedProduct.specifications
      }
    });

    // ----------------------------------------------------
    // STEP 3: Check Stock & Graceful Failure Recovery (ReAct Step 3)
    // ----------------------------------------------------
    let wasStockoutRecovered = false;
    let alternativeProduct: ProductItem | undefined;

    if (selectedProduct.stock <= 0 || params.simulatedFailureMode === 'OUT_OF_STOCK') {
      reasoningTrail.push({
        step: 3,
        agent: 'MerchantAgent',
        action: 'STOCK_CHECK_FAILED',
        detail: `Item "${selectedProduct.name}" has 0 stock remaining. Initiating Autonomous Alternative Recovery.`,
        status: 'WARNING',
        timestamp: timestamp(),
        payload: { outOfStockItem: selectedProduct.id, stock: 0 }
      });

      // Gracefully search for in-stock alternative in same or related category
      const fallbackItems = UAPCatalogEngine.queryCatalog({
        category: selectedProduct.category,
        inStockOnly: true
      });

      const alternative = fallbackItems.find(p => p.id !== selectedProduct.id) || UAPCatalogEngine.queryCatalog({ inStockOnly: true })[0];

      if (!alternative) {
        return {
          transactionId,
          intent: params.userPrompt,
          status: 'FAILED_OUT_OF_STOCK',
          reasoningTrail,
          selectedProduct
        };
      }

      reasoningTrail.push({
        step: 4,
        agent: 'BuyerAgent',
        action: 'AUTONOMOUS_FALLBACK_RECOVERY',
        detail: `Gracefully rerouted to verified in-stock equivalent: "${alternative.name}" (₹${alternative.price}). Initiating quote negotiation.`,
        status: 'RECOVERED',
        timestamp: timestamp(),
        payload: { outOfStockItem: selectedProduct.id, substitutedProduct: alternative.id }
      });

      alternativeProduct = alternative;
      selectedProduct = alternative;
      wasStockoutRecovered = true;
    }

    // ----------------------------------------------------
    // STEP 4: Request Signed AP2 Quote with Dynamic Bundles (ReAct Step 4)
    // ----------------------------------------------------
    const quoteResult: AP2QuoteResult = await AgentToolExecutor.executeTool('request_signed_quote', {
      productId: selectedProduct.id,
      quantity: 1,
      acceptBundles: params.autoAcceptBundles,
      forceBundleIds: params.forceBundleIds
    });

    if (!quoteResult.quote) {
      reasoningTrail.push({
        step: 5,
        agent: 'MerchantAgent',
        action: 'QUOTE_REJECTED',
        detail: `Merchant failed to issue signed quote: ${quoteResult.error || 'Unknown merchant error'}`,
        status: 'FAILED',
        timestamp: timestamp()
      });

      return {
        transactionId,
        intent: params.userPrompt,
        status: 'REJECTED_POLICY',
        reasoningTrail,
        selectedProduct
      };
    }

    let quote = quoteResult.quote;

    // Simulate price surge if requested
    if (params.simulatedFailureMode === 'PRICE_SURGE') {
      quote = {
        ...quote,
        grossAmount: 3899,
        netAmount: 3899,
      };
    }

    // Simulate budget breach if requested
    if (params.simulatedFailureMode === 'BUDGET_BREACH') {
      quote = {
        ...quote,
        grossAmount: 99999,
        netAmount: 99999,
      };
    }

    reasoningTrail.push({
      step: 5,
      agent: 'MerchantAgent',
      action: 'GENERATE_SIGNED_QUOTE',
      detail: `Issued AP2 signed quote #${quote.quoteId.slice(0, 10)}. Gross: ₹${quote.grossAmount}, Discount: ₹${quote.discountAmount}, Net: ₹${quote.netAmount}. HMAC: ${quote.merchantSignature.slice(0, 12)}...`,
      status: 'SUCCESS',
      timestamp: timestamp(),
      payload: {
        quoteId: quote.quoteId,
        gross: quote.grossAmount,
        discount: quote.discountAmount,
        net: quote.netAmount,
        expiresAt: quote.expiresAt
      }
    });

    // ----------------------------------------------------
    // STEP 5: Server-side Non-Bypassable Policy Enclave (ReAct Step 5)
    // ----------------------------------------------------
    const category = params.overrideCategory || selectedProduct.category;
    const policyResult: PolicyValidationResult = await AgentToolExecutor.executeTool('evaluate_enclave_policy', {
      quote,
      category
    });

    // Handle Policy Block (Ceiling Exceeded or Whitelist Rejection)
    if (!policyResult.allowed) {
      reasoningTrail.push({
        step: 6,
        agent: 'SpendingEnclave',
        action: 'POLICY_REJECTION',
        detail: `Enclave halted transaction: ${policyResult.reason} (Policy Code: ${policyResult.policyCode}).`,
        status: 'FAILED',
        timestamp: timestamp(),
        payload: {
          policyCode: policyResult.policyCode,
          enclaveHash: policyResult.enclaveHash,
          currentDailySpend: policyResult.currentDailySpend,
          dailyCeiling: policyResult.dailyCeiling
        }
      });

      return {
        transactionId,
        intent: params.userPrompt,
        status: 'REJECTED_POLICY',
        reasoningTrail,
        selectedProduct,
        quote,
        policyResult
      };
    }

    // Handle Step-Up Gating (> ₹2,000 threshold)
    if (policyResult.requiresStepUp) {
      const approvalId = `stepup_${crypto.randomBytes(6).toString('hex')}`;
      BoundedSpendingEnclave.registerPendingApproval(approvalId, quote, {
        transactionId,
        selectedProduct,
        reasoningTrail,
        upsellOffers: quoteResult.upsellSuggestions
      });

      reasoningTrail.push({
        step: 6,
        agent: 'SpendingEnclave',
        action: 'STEP_UP_GATED',
        detail: `Amount (₹${quote.netAmount}) exceeds single-tx auto-approval ceiling of ₹2,000. Dispatched biometric step-up authorization challenge.`,
        status: 'GATED',
        timestamp: timestamp(),
        payload: {
          approvalId,
          amount: quote.netAmount,
          threshold: 2000,
          policyCode: policyResult.policyCode,
          enclaveHash: policyResult.enclaveHash
        }
      });

      return {
        transactionId,
        intent: params.userPrompt,
        status: 'STEP_UP_REQUIRED',
        reasoningTrail,
        selectedProduct,
        quote,
        policyResult,
        stepUpApprovalId: approvalId,
        upsellOffers: quoteResult.upsellSuggestions
      };
    }

    // ----------------------------------------------------
    // STEP 6: Policy Auto-Approved -> Execute Settlement (ReAct Step 6)
    // ----------------------------------------------------
    reasoningTrail.push({
      step: 6,
      agent: 'SpendingEnclave',
      action: 'POLICY_APPROVED',
      detail: `Enclave auto-approved transaction within safe limits (₹${quote.netAmount} <= ₹2,000). Enclave attestation hash: ${policyResult.enclaveHash.slice(0, 12)}...`,
      status: 'SUCCESS',
      timestamp: timestamp(),
      payload: { enclaveHash: policyResult.enclaveHash, policyCode: policyResult.policyCode }
    });

    return await this.finalizeTransactionWithRazorpay({
      transactionId,
      intent: params.userPrompt,
      selectedProduct,
      quote,
      policyResult,
      reasoningTrail,
      upsellOffers: quoteResult.upsellSuggestions,
      wasStockoutRecovered,
      alternativeProduct
    });
  }

  public static async finalizeTransactionWithRazorpay(params: {
    transactionId: string;
    intent: string;
    selectedProduct: ProductItem;
    quote: AP2SignedQuote;
    policyResult: PolicyValidationResult;
    reasoningTrail: AgentReasoningStep[];
    upsellOffers?: DynamicBundleOffer[];
    wasStockoutRecovered?: boolean;
    alternativeProduct?: ProductItem;
  }): Promise<AgentTransactionOutcome> {
    const timestamp = () => new Date().toISOString();

    // 1. Create Razorpay Order
    const receiptRef = `rcpt_${params.transactionId}`;
    const razorpayOrder: RazorpayOrderResponse = await AgentToolExecutor.executeTool('create_razorpay_order', {
      amountInRupees: params.quote.netAmount,
      receipt: receiptRef,
      notes: {
        transactionId: params.transactionId,
        quoteId: params.quote.quoteId,
        productId: params.selectedProduct.id,
        merchantId: params.quote.merchantId
      }
    });

    params.reasoningTrail.push({
      step: 7,
      agent: 'RazorpayGateway',
      action: 'CREATE_RAZORPAY_ORDER',
      detail: `Created Razorpay test order ${razorpayOrder.id} for ₹${params.quote.netAmount} (Status: ${razorpayOrder.status}).`,
      status: 'SUCCESS',
      timestamp: timestamp(),
      payload: {
        orderId: razorpayOrder.id,
        amountPaise: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        receipt: razorpayOrder.receipt
      }
    });

    // 2. Generate UPI QR Intent
    const upiQr = RazorpayEngine.generateUpiQrIntent(razorpayOrder.id, params.quote.netAmount);

    // 3. Post Double-Entry FinOps Accounting Journal
    const ledgerEntry = await AgentToolExecutor.executeTool('record_finops_ledger', {
      transactionId: params.transactionId,
      razorpayOrderId: razorpayOrder.id,
      amount: params.quote.netAmount,
      description: `Autonomous agent purchase of ${params.selectedProduct.name} via AP2 quote ${params.quote.quoteId}`,
      idempotencyKey: `idemp_${params.transactionId}`
    });

    params.reasoningTrail.push({
      step: 8,
      agent: 'FinOpsLedger',
      action: 'POST_DOUBLE_ENTRY_JOURNAL',
      detail: `Posted balanced double-entry journal entry #${ledgerEntry.id}. Debited Principal Wallet: ₹${params.quote.netAmount}, Credited Merchant Settlement: ₹${params.quote.netAmount}. HMAC: ${ledgerEntry.hmacSignature.slice(0, 12)}...`,
      status: 'SUCCESS',
      timestamp: timestamp(),
      payload: {
        journalId: ledgerEntry.id,
        balanced: ledgerEntry.balanced,
        hmacSignature: ledgerEntry.hmacSignature,
        lines: ledgerEntry.lines
      }
    });

    // 4. Fulfillment & Courier Logistics
    const fulfillment = FulfillmentEngine.createOrder({
      razorpayOrderId: razorpayOrder.id,
      item: params.selectedProduct,
      amountPaid: params.quote.netAmount,
      customerName: 'Akash Sharma',
      shippingAddress: '42 UB City Luxury Boulevard, Bangalore 560001'
    });

    params.reasoningTrail.push({
      step: 9,
      agent: 'AmazonFulfillment',
      action: 'DISPATCH_LOGISTICS',
      detail: `Logistics order dispatched via ${fulfillment.courierPartner}. Tracking AWB: ${fulfillment.trackingNumber}. Estimated Delivery: ${fulfillment.estimatedDelivery}.`,
      status: 'SUCCESS',
      timestamp: timestamp(),
      payload: {
        courier: fulfillment.courierPartner,
        awb: fulfillment.trackingNumber,
        eta: fulfillment.estimatedDelivery
      }
    });

    // 5. Decrement Inventory & Record Order in DB
    UAPCatalogEngine.decrementInventory(params.selectedProduct.id, 1);

    AgentPayDatabase.insertOrder({
      id: `ord_${crypto.randomBytes(6).toString('hex')}`,
      razorpayOrderId: razorpayOrder.id,
      razorpayPaymentId: `pay_${crypto.randomBytes(6).toString('hex')}`,
      productId: params.selectedProduct.id,
      productName: params.selectedProduct.name,
      merchantId: params.quote.merchantId,
      merchantName: params.selectedProduct.merchantName,
      amount: params.quote.netAmount,
      currency: 'INR',
      status: 'CAPTURED',
      idempotencyKey: `idemp_${params.transactionId}`,
      reasoningTrailJson: JSON.stringify(params.reasoningTrail),
      courierPartner: fulfillment.courierPartner,
      trackingAwb: fulfillment.trackingNumber,
      estimatedDelivery: fulfillment.estimatedDelivery,
      taxInvoiceId: `INV-${Date.now().toString().slice(-6)}`
    });

    // 6. Record Audit Log for successful payment capture
    BoundedSpendingEnclave.recordAudit({
      agentId: this.AGENT_ID,
      principalUser: 'user_akash_ai_shopper',
      action: 'PAYMENT_CAPTURED',
      amount: params.quote.netAmount,
      currency: params.quote.currency,
      details: {
        transactionId: params.transactionId,
        razorpayOrderId: razorpayOrder.id,
        quoteId: params.quote.quoteId,
        productId: params.selectedProduct.id,
        enclaveHash: params.policyResult.enclaveHash,
        trackingNumber: fulfillment.trackingNumber
      },
      reasoning: `Payment captured and settled for ₹${params.quote.netAmount} with verified double-entry accounting.`
    });

    return {
      transactionId: params.transactionId,
      intent: params.intent,
      status: params.wasStockoutRecovered ? 'FAILED_RECOVERED' : 'COMPLETED',
      reasoningTrail: params.reasoningTrail,
      selectedProduct: params.selectedProduct,
      quote: params.quote,
      policyResult: params.policyResult,
      razorpayOrder,
      upiQr,
      upsellOffers: params.upsellOffers,
      alternativeProduct: params.alternativeProduct,
      fulfillment,
      receipt: {
        receiptId: receiptRef,
        totalPaid: params.quote.netAmount,
        currency: params.quote.currency,
        paidAt: timestamp(),
        auditEnclaveHash: params.policyResult.enclaveHash
      }
    };
  }

  private static extractIntentFromPrompt(prompt: string): {
    keyword: string;
    category?: string;
    maxBudget?: number;
  } {
    const lower = prompt.toLowerCase();
    let keyword = '';
    let category: string | undefined;
    let maxBudget: number | undefined;

    // Extract price constraint (e.g. "under 2000", "under ₹2,000", "below 1500", "max 3000")
    const priceMatch = lower.match(/(?:under|below|max|budget|within)\s*(?:₹|rs\.?|inr)?\s*([0-9,]+)/i);
    if (priceMatch && priceMatch[1]) {
      maxBudget = parseFloat(priceMatch[1].replace(/,/g, ''));
    }

    if (lower.includes('shoe') || lower.includes('running') || lower.includes('nike') || lower.includes('adidas') || lower.includes('sneaker') || lower.includes('puma') || lower.includes('asics')) {
      keyword = 'shoe';
      category = 'Athletics & Apparel';
    } else if (lower.includes('keyboard') || lower.includes('keychron') || lower.includes('mechanical')) {
      keyword = 'keyboard';
      category = 'Electronics & Peripherals';
    } else if (lower.includes('headphone') || lower.includes('sony') || lower.includes('audio') || lower.includes('earphone')) {
      keyword = 'headphones';
      category = 'Audio';
    } else if (lower.includes('mouse') || lower.includes('logitech') || lower.includes('mx master')) {
      keyword = 'mouse';
      category = 'Electronics & Peripherals';
    } else if (lower.includes('gpu') || lower.includes('compute') || lower.includes('h100') || lower.includes('cloud') || lower.includes('nebula')) {
      keyword = 'gpu';
      category = 'Cloud & AI Infrastructure';
    } else if (lower.includes('ring') || lower.includes('ultrahuman') || lower.includes('sleep') || lower.includes('tracker')) {
      keyword = 'ring';
      category = 'Wearables & Health';
    } else if (lower.includes('hub') || lower.includes('usb-c') || lower.includes('adapter') || lower.includes('anker')) {
      keyword = 'hub';
      category = 'Electronics & Peripherals';
    } else if (lower.includes('rogue') || lower.includes('untrusted')) {
      keyword = 'untrusted';
    }

    return { keyword, category, maxBudget };
  }
}
