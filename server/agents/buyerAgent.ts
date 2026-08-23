import crypto from 'crypto';
import { UAPCatalogEngine, ProductItem } from '../protocols/uap.js';
import { MerchantAgent, DynamicBundleOffer } from './merchantAgent.js';
import { BoundedSpendingEnclave, PolicyValidationResult } from '../protocols/guardEnclave.js';
import { RazorpayEngine, RazorpayOrderResponse } from '../razorpay/client.js';
import { WebhookManager } from '../razorpay/webhooks.js';
import { AP2SignedQuote } from '../protocols/ap2.js';
import { AmazonMerchantAdapter } from '../merchants/amazonAdapter.js';
import { FulfillmentEngine, FulfillmentOrder } from '../merchants/fulfillmentEngine.js';

export interface AgentReasoningStep {
  step: number;
  agent: 'BuyerAgent' | 'MerchantAgent' | 'SpendingEnclave' | 'RazorpayGateway' | 'AmazonFulfillment';
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
    // STEP 1: Parse Natural Language Intent
    // ----------------------------------------------------
    reasoningTrail.push({
      step: 1,
      agent: 'BuyerAgent',
      action: 'PARSE_INTENT',
      detail: `Deconstructing user natural language intent: "${params.userPrompt}"`,
      status: 'SUCCESS',
      timestamp: timestamp(),
      payload: { rawPrompt: params.userPrompt }
    });

    BoundedSpendingEnclave.recordAudit({
      agentId: this.AGENT_ID,
      principalUser: 'user_akash_ai_shopper',
      action: 'CATALOG_DISCOVERY',
      currency: 'INR',
      details: { prompt: params.userPrompt },
      reasoning: `Buyer Agent parsed shopping intent from prompt: '${params.userPrompt}'.`
    });

    // ----------------------------------------------------
    // STEP 2: Query Semantic Catalog via UAP Protocol
    // ----------------------------------------------------
    let queryKeyword = '';
    const lowerPrompt = params.userPrompt.toLowerCase();

    if (lowerPrompt.includes('shoe') || lowerPrompt.includes('running') || lowerPrompt.includes('nike') || lowerPrompt.includes('adidas') || lowerPrompt.includes('sneaker')) {
      queryKeyword = 'shoe';
    } else if (lowerPrompt.includes('keyboard') || lowerPrompt.includes('keychron')) {
      queryKeyword = 'keyboard';
    } else if (lowerPrompt.includes('headphone') || lowerPrompt.includes('sony') || lowerPrompt.includes('audio')) {
      queryKeyword = 'headphones';
    } else if (lowerPrompt.includes('mouse') || lowerPrompt.includes('logitech') || lowerPrompt.includes('mx master')) {
      queryKeyword = 'mouse';
    } else if (lowerPrompt.includes('gpu') || lowerPrompt.includes('compute') || lowerPrompt.includes('h100') || lowerPrompt.includes('cloud')) {
      queryKeyword = 'gpu';
    } else if (lowerPrompt.includes('ring') || lowerPrompt.includes('ultrahuman') || lowerPrompt.includes('sleep')) {
      queryKeyword = 'ring';
    } else if (lowerPrompt.includes('hub') || lowerPrompt.includes('usb-c') || lowerPrompt.includes('adapter') || lowerPrompt.includes('anker')) {
      queryKeyword = 'hub';
    }

    const matches = UAPCatalogEngine.queryCatalog({ query: queryKeyword });
    let selectedProduct = matches[0] || UAPCatalogEngine.queryCatalog({})[0];

    reasoningTrail.push({
      step: 2,
      agent: 'BuyerAgent',
      action: 'QUERY_UAP_CATALOG',
      detail: `Queried UAP Catalog standard. Located candidate: "${selectedProduct.name}" (₹${selectedProduct.price}) with ${selectedProduct.stock} units in stock.`,
      status: 'SUCCESS',
      timestamp: timestamp(),
      payload: {
        matchesFound: matches.length,
        candidateSelected: selectedProduct.id,
        specs: selectedProduct.specifications
      }
    });

    // ----------------------------------------------------
    // STEP 3: Handle Out of Stock Scenario / Simulated Stockout
    // ----------------------------------------------------
    if (selectedProduct.stock <= 0 || params.simulatedFailureMode === 'OUT_OF_STOCK') {
      reasoningTrail.push({
        step: 3,
        agent: 'MerchantAgent',
        action: 'STOCK_CHECK_FAILED',
        detail: `Item "${selectedProduct.name}" has 0 stock remaining. Triggering Graceful Recovery Fallback.`,
        status: 'WARNING',
        timestamp: timestamp(),
        payload: { outOfStockItem: selectedProduct.id }
      });

      // Graceful Autonomous Recovery: Search for in-stock alternative in related or popular category
      const fallbackList = UAPCatalogEngine.queryCatalog({ inStockOnly: true });
      const alternative = fallbackList.find((p) => p.id !== selectedProduct.id) || fallbackList[0];

      reasoningTrail.push({
        step: 4,
        agent: 'BuyerAgent',
        action: 'AUTONOMOUS_FALLBACK_RECOVERY',
        detail: `Gracefully rerouted to verified in-stock equivalent: "${alternative.name}" (₹${alternative.price}). Initiating quote negotiation.`,
        status: 'RECOVERED',
        timestamp: timestamp(),
        payload: { substitutedProduct: alternative.id }
      });

      selectedProduct = alternative;
    }

    // ----------------------------------------------------
    // STEP 4: Negotiate with Merchant Agent (AP2 Quote & Upsells)
    // ----------------------------------------------------
    const bundlesToAccept: string[] = params.forceBundleIds || [];
    if (params.autoAcceptBundles && selectedProduct.bundleDeals && selectedProduct.bundleDeals.length > 0) {
      bundlesToAccept.push(selectedProduct.bundleDeals[0].addonId);
    }

    const merchantResponse = MerchantAgent.evaluateAndGenerateQuote({
      productId: selectedProduct.id,
      quantity: 1,
      acceptBundles: bundlesToAccept,
      customDiscountCoupon: 'AGENTIC10'
    });

    if (!merchantResponse.quote) {
      return {
        transactionId,
        intent: params.userPrompt,
        status: 'FAILED_OUT_OF_STOCK',
        reasoningTrail,
        selectedProduct,
        quote: null
      };
    }

    const quote = merchantResponse.quote;

    reasoningTrail.push({
      step: 5,
      agent: 'MerchantAgent',
      action: 'ISSUE_SIGNED_AP2_QUOTE',
      detail: `Merchant Agent generated signed AP2 quote (Quote ID: ${quote.quoteId}). Gross: ₹${quote.grossAmount}, Bundle/Coupon Discount: ₹${quote.discountAmount}, Net Payable: ₹${quote.netAmount}.`,
      status: 'SUCCESS',
      timestamp: timestamp(),
      payload: {
        quoteId: quote.quoteId,
        netAmount: quote.netAmount,
        discountAmount: quote.discountAmount,
        merchantSignature: quote.merchantSignature.slice(0, 16) + '...'
      }
    });

    // ----------------------------------------------------
    // STEP 5: Policy Evaluation in Bounded Spending Enclave
    // ----------------------------------------------------
    // If testing budget breach simulation, artificially elevate amount
    if (params.simulatedFailureMode === 'BUDGET_BREACH') {
      quote.netAmount = 99999;
    }

    const policyCheck = BoundedSpendingEnclave.evaluateQuote(
      quote,
      params.overrideCategory || selectedProduct.category
    );

    reasoningTrail.push({
      step: 6,
      agent: 'SpendingEnclave',
      action: 'EVALUATE_BOUNDED_POLICY',
      detail: `Enclave evaluated transaction rules. Policy code: ${policyCheck.policyCode}. (${policyCheck.reason})`,
      status: policyCheck.allowed ? (policyCheck.requiresStepUp ? 'GATED' : 'SUCCESS') : 'FAILED',
      timestamp: timestamp(),
      payload: policyCheck
    });

    // If strictly disallowed (e.g. Daily ceiling breached, untrusted merchant)
    if (!policyCheck.allowed) {
      BoundedSpendingEnclave.recordAudit({
        agentId: this.AGENT_ID,
        principalUser: 'user_akash_ai_shopper',
        action: 'EXECUTION_REJECTED',
        amount: quote.netAmount,
        currency: quote.currency,
        details: { quoteId: quote.quoteId, policyCode: policyCheck.policyCode, reason: policyCheck.reason },
        reasoning: `Transaction halted by Bounded Spending Enclave: ${policyCheck.reason}`
      });

      return {
        transactionId,
        intent: params.userPrompt,
        status: 'REJECTED_POLICY',
        reasoningTrail,
        selectedProduct,
        quote,
        policyResult: policyCheck,
        upsellOffers: merchantResponse.upsellSuggestions
      };
    }

    // ----------------------------------------------------
    // STEP 6: Gated Step-Up Approval Required (> Threshold)
    // ----------------------------------------------------
    if (policyCheck.requiresStepUp) {
      const approvalId = `appr_${crypto.randomBytes(6).toString('hex')}`;
      BoundedSpendingEnclave.registerPendingApproval(approvalId, quote, {
        transactionId,
        selectedProduct,
        reasoningTrail,
        upsellOffers: merchantResponse.upsellSuggestions
      });

      BoundedSpendingEnclave.recordAudit({
        agentId: this.AGENT_ID,
        principalUser: 'user_akash_ai_shopper',
        action: 'STEP_UP_REQUESTED',
        amount: quote.netAmount,
        currency: quote.currency,
        details: { approvalId, quoteId: quote.quoteId, threshold: BoundedSpendingEnclave.getMandate().requiresStepUpAbove },
        reasoning: `Transaction of ₹${quote.netAmount} exceeds auto-threshold. Human Step-Up signature requested.`
      });

      reasoningTrail.push({
        step: 7,
        agent: 'SpendingEnclave',
        action: 'STEP_UP_DISPATCH',
        detail: `Amount ₹${quote.netAmount} exceeds single-transaction autonomous delegation threshold (₹${BoundedSpendingEnclave.getMandate().requiresStepUpAbove}). Dispatched Step-Up Approval Modal to Principal User.`,
        status: 'GATED',
        timestamp: timestamp(),
        payload: { approvalId }
      });

      return {
        transactionId,
        intent: params.userPrompt,
        status: 'STEP_UP_REQUIRED',
        reasoningTrail,
        selectedProduct,
        quote,
        policyResult: policyCheck,
        stepUpApprovalId: approvalId,
        upsellOffers: merchantResponse.upsellSuggestions
      };
    }

    // ----------------------------------------------------
    // STEP 7: Autonomous Execution via Razorpay Test API
    // ----------------------------------------------------
    return await this.finalizeTransactionWithRazorpay({
      transactionId,
      intent: params.userPrompt,
      selectedProduct,
      quote,
      policyResult: policyCheck,
      reasoningTrail,
      upsellOffers: merchantResponse.upsellSuggestions
    });
  }

  public static async finalizeTransactionWithRazorpay(params: {
    transactionId: string;
    intent: string;
    selectedProduct: ProductItem;
    quote: AP2SignedQuote;
    policyResult: PolicyValidationResult;
    reasoningTrail: AgentReasoningStep[];
    upsellOffers: DynamicBundleOffer[];
  }): Promise<AgentTransactionOutcome> {
    const timestamp = () => new Date().toISOString();

    // 1. Create Razorpay Order
    const razorpayOrder = await RazorpayEngine.createOrder({
      amountInRupees: params.quote.netAmount,
      receipt: `rcpt_${params.transactionId}`,
      notes: {
        buyerAgent: this.AGENT_ID,
        merchantId: params.quote.merchantId,
        quoteId: params.quote.quoteId,
        enclaveHash: params.policyResult.enclaveHash
      }
    });

    params.reasoningTrail.push({
      step: params.reasoningTrail.length + 1,
      agent: 'RazorpayGateway',
      action: 'CREATE_RAZORPAY_ORDER',
      detail: `Created Razorpay Order ${razorpayOrder.id} for ₹${params.quote.netAmount}. Status: ${razorpayOrder.status}.`,
      status: 'SUCCESS',
      timestamp: timestamp(),
      payload: razorpayOrder
    });

    // 2. Generate UPI QR Intent
    const upiQr = RazorpayEngine.generateUpiQrIntent(razorpayOrder.id, params.quote.netAmount);

    // 3. Simulate Gateway Webhook & Settlement
    const simulatedWebhook = WebhookManager.emitSimulatedWebhookEvent('payment.captured', razorpayOrder.id, params.quote.netAmount);

    // 4. Decrement Stock & Commit Spend in Enclave
    UAPCatalogEngine.updateStock(params.selectedProduct.id, -1);
    BoundedSpendingEnclave.commitSpend(params.quote.netAmount);

    params.reasoningTrail.push({
      step: params.reasoningTrail.length + 1,
      agent: 'RazorpayGateway',
      action: 'CAPTURE_WEBHOOK_SETTLEMENT',
      detail: `Razorpay webhook verified (HMAC SHA-256). Payment captured: ${simulatedWebhook.payload.payment?.entity.id}. Enclave state settled.`,
      status: 'SUCCESS',
      timestamp: timestamp(),
      payload: {
        paymentId: simulatedWebhook.payload.payment?.entity.id,
        orderId: razorpayOrder.id,
        status: 'CAPTURED'
      }
    });

    // 5. Dispatch Merchant Fulfillment & Courier AWB
    const fulfillment = FulfillmentEngine.createOrder({
      razorpayOrderId: razorpayOrder.id,
      razorpayPaymentId: simulatedWebhook.payload.payment?.entity.id,
      merchantId: params.quote.merchantId,
      merchantName: params.selectedProduct.merchantName,
      productName: params.selectedProduct.name,
      amount: params.quote.netAmount,
      asinOrSku: params.selectedProduct.id,
    });

    params.reasoningTrail.push({
      step: params.reasoningTrail.length + 1,
      agent: 'AmazonFulfillment',
      action: 'DISPATCH_MERCHANT_FULFILLMENT',
      detail: `Fulfillment Order ${fulfillment.orderId} created with ${fulfillment.courierPartner}. Tracking AWB: ${fulfillment.trackingNumber}. Estimated: ${fulfillment.estimatedDelivery}.`,
      status: 'SUCCESS',
      timestamp: timestamp(),
      payload: {
        orderId: fulfillment.orderId,
        trackingNumber: fulfillment.trackingNumber,
        courier: fulfillment.courierPartner,
        taxInvoiceId: fulfillment.taxInvoiceId,
        cryptoSeal: fulfillment.cryptoSealHash
      }
    });

    const receipt = {
      receiptId: `rcpt_${crypto.randomBytes(6).toString('hex')}`,
      totalPaid: params.quote.netAmount,
      currency: params.quote.currency,
      paidAt: timestamp(),
      auditEnclaveHash: params.policyResult.enclaveHash
    };

    return {
      transactionId: params.transactionId,
      intent: params.intent,
      status: 'COMPLETED',
      reasoningTrail: params.reasoningTrail,
      selectedProduct: params.selectedProduct,
      quote: params.quote,
      policyResult: params.policyResult,
      razorpayOrder,
      upiQr,
      upsellOffers: params.upsellOffers,
      fulfillment,
      receipt
    };
  }
}
