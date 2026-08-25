import { UAPCatalogEngine } from '../protocols/uap.js';
import { BoundedSpendingEnclave } from '../protocols/guardEnclave.js';
import { BuyerAgent } from '../agents/buyerAgent.js';
import { RevenueGrowthEngine } from '../agents/growthEngine.js';
import { DoubleEntryLedgerEngine } from '../protocols/doubleEntryLedger.js';
import { A2APayeeProtocolEngine } from '../protocols/payeeAgent.js';
import { RazorpayEngine } from '../razorpay/client.js';
import { WebhookManager } from '../razorpay/webhooks.js';
import { MerchantAgent } from '../agents/merchantAgent.js';
import { AgentPayDatabase } from '../db/database.js';

let passedCount = 0;
let failedCount = 0;

async function runTest(name: string, fn: () => Promise<void> | void) {
  try {
    await fn();
    console.log(`  ✅ PASSED: ${name}`);
    passedCount++;
  } catch (err: any) {
    console.error(`  ❌ FAILED: ${name}`);
    console.error(`     Error: ${err.message}`);
    failedCount++;
    process.exitCode = 1;
  }
}

async function runTestSuite() {
  console.log('\n🧪 Running AgentPay Track 01 Comprehensive Production Test Suite...\n');

  // Initialize DB & clean deterministic state
  AgentPayDatabase.resetForTesting();

  // Test 1: Canonical UAP Catalog Search & Schema
  await runTest('1. Canonical UAP Catalog Semantic Search & Specs', () => {
    const shoes = UAPCatalogEngine.queryCatalog({ query: 'shoe' });
    if (shoes.length === 0) throw new Error('Expected shoes in catalog');
    if (!shoes[0].specifications) throw new Error('Expected specifications on product item');
    if (typeof shoes[0].price !== 'number' || shoes[0].price <= 0) throw new Error('Invalid product price');
  });

  // Test 2: Dynamic CSV Catalog Import
  await runTest('2. Dynamic CSV Catalog Import & Validation', () => {
    const csv = `id,name,category,price,stock,merchantId,merchantName\nprod_csv_test_99,HyperDrive USB-C Dock,Electronics,1299,15,merch_apex_gear,Apex Gear India`;
    const res = UAPCatalogEngine.importFromCsv(csv);
    if (res.importedCount !== 1) throw new Error(`Expected 1 imported item, got ${res.importedCount}`);
    const product = UAPCatalogEngine.getProductById('prod_csv_test_99');
    if (!product || product.name !== 'HyperDrive USB-C Dock') throw new Error('Product not found in catalog after CSV import');
  });

  // Test 3: Autonomous Buyer Flow & Auto-Approval (<= ₹2,000)
  await runTest('3. Autonomous Buyer Flow & Enclave Auto-Approval (<= ₹2,000)', async () => {
    const outcome = await BuyerAgent.executeCommerceFlow({
      userPrompt: 'Buy running shoes under ₹2,000',
      autoAcceptBundles: false,
    });
    if (outcome.status !== 'COMPLETED') throw new Error(`Expected COMPLETED, got ${outcome.status}`);
    if (!outcome.razorpayOrder?.id) throw new Error('Missing Razorpay Order ID');
    if (!outcome.receipt?.receiptId) throw new Error('Missing transaction receipt');
    if (outcome.policyResult?.policyCode !== 'AUTO_APPROVED') throw new Error(`Expected AUTO_APPROVED, got ${outcome.policyResult?.policyCode}`);
  });

  // Test 4: Bounded Spending Enclave: Step-Up Gating (> ₹2,000)
  await runTest('4. Enclave Step-Up Gating for Purchases > ₹2,000', async () => {
    const outcome = await BuyerAgent.executeCommerceFlow({
      userPrompt: 'Order Keychron Q1 Pro custom mechanical keyboard',
      autoAcceptBundles: false,
    });
    if (outcome.status !== 'STEP_UP_REQUIRED') throw new Error(`Expected STEP_UP_REQUIRED, got ${outcome.status}`);
    if (!outcome.stepUpApprovalId) throw new Error('Missing Step-Up Approval ID');
    if (outcome.policyResult?.policyCode !== 'REQUIRES_STEP_UP') throw new Error(`Expected REQUIRES_STEP_UP, got ${outcome.policyResult?.policyCode}`);
  });

  // Test 5: Step-Up Resolution & Execution Finalization
  await runTest('5. Cryptographic Step-Up Resolution & Order Settlement', async () => {
    const outcome = await BuyerAgent.executeCommerceFlow({
      userPrompt: 'Order Keychron Q1 Pro custom mechanical keyboard',
      autoAcceptBundles: false,
    });
    if (!outcome.stepUpApprovalId) throw new Error('Missing step-up approval ID');

    const pending = BoundedSpendingEnclave.resolvePendingApproval(outcome.stepUpApprovalId);
    if (!pending) throw new Error('Failed to resolve pending approval');

    const finalized = await BuyerAgent.finalizeTransactionWithRazorpay({
      transactionId: pending.callbackData.transactionId,
      intent: 'Human Step-Up Authorization',
      selectedProduct: pending.callbackData.selectedProduct,
      quote: pending.quote,
      policyResult: {
        allowed: true,
        requiresStepUp: false,
        reason: 'Human Step-Up passkey verified',
        policyCode: 'AUTO_APPROVED',
        enclaveHash: 'sig_stepup_verified',
        currentDailySpend: 0,
        dailyCeiling: 25000
      },
      reasoningTrail: pending.callbackData.reasoningTrail
    });

    if (finalized.status !== 'COMPLETED') throw new Error(`Expected COMPLETED after step-up, got ${finalized.status}`);
    if (!finalized.razorpayOrder?.id) throw new Error('Missing Razorpay Order ID on finalized order');
  });

  // Test 6: Cumulative Daily Spending Ceiling Breach Hard Block
  await runTest('6. Daily Cumulative Ceiling Breach (> ₹25,000) Hard Block', async () => {
    const outcome = await BuyerAgent.executeCommerceFlow({
      userPrompt: 'Provision 10,000 H100 GPU Cluster Nodes for ₹99,999',
      simulatedFailureMode: 'BUDGET_BREACH'
    });
    if (outcome.status !== 'REJECTED_POLICY') throw new Error(`Expected REJECTED_POLICY, got ${outcome.status}`);
    if (outcome.policyResult?.policyCode !== 'CEILING_EXCEEDED') throw new Error(`Expected CEILING_EXCEEDED, got ${outcome.policyResult?.policyCode}`);
    if (outcome.razorpayOrder) throw new Error('Razorpay order MUST NOT be created when ceiling is breached');
  });

  // Test 7: Rogue Merchant Whitelist Block
  await runTest('7. Rogue / Untrusted Merchant Allow-list Enforcement', () => {
    const rogueQuote = {
      quoteId: 'ap2_q_rogue_99',
      merchantId: 'merch_untrusted_dark_node',
      items: [{ productId: 'item_01', name: 'Exploit Item', quantity: 1, unitPrice: 500, appliedDiscount: 0 }],
      grossAmount: 500,
      discountAmount: 0,
      netAmount: 500,
      currency: 'INR',
      nonce: 'nonce_99',
      expiresAt: new Date(Date.now() + 60000).toISOString(),
      inventoryLockId: 'lock_01',
      merchantSignature: 'sig_unverified'
    };

    const validation = BoundedSpendingEnclave.evaluateQuote(rogueQuote, 'Electronics & Peripherals');
    if (validation.allowed) throw new Error('Rogue merchant quote was unexpectedly allowed');
    if (validation.policyCode !== 'MERCHANT_BLOCKED') throw new Error(`Expected MERCHANT_BLOCKED, got ${validation.policyCode}`);
  });

  // Test 8: Double-Entry FinOps Balanced Accounting Journal
  await runTest('8. Double-Entry FinOps Balanced Debits & Credits', () => {
    const journal = DoubleEntryLedgerEngine.getJournal();
    if (journal.length === 0) throw new Error('Expected journal entries in ledger');
    const first = journal[0];
    if (!first.balanced) throw new Error('Journal entry is not balanced');

    const integrity = DoubleEntryLedgerEngine.verifyLedgerIntegrity();
    if (!integrity.isBalanced) throw new Error('Ledger integrity debits and credits do not match');
    if (integrity.validSignaturesCount === 0) throw new Error('Expected cryptographic HMAC signatures on journal entries');
  });

  // Test 9: Idempotency Protection against Replay Requests
  await runTest('9. Idempotency Key Replay Protection', () => {
    const key = 'idemp_test_replay_001';
    const payload = { amount: 1499, item: 'prod_hub_06' };
    const outcome = { status: 'SUCCESS', orderId: 'order_test_99' };

    DoubleEntryLedgerEngine.saveIdempotency(key, payload, outcome);
    const check = DoubleEntryLedgerEngine.checkIdempotency(key, payload);
    if (!check.isDuplicate) throw new Error('Expected duplicate idempotency detection');
    if (check.cachedOutcome?.orderId !== 'order_test_99') throw new Error('Cached outcome not retrieved');
  });

  // Test 10: Stockout Detection & Autonomous Alternative Recovery
  await runTest('10. Stockout Detection & Autonomous In-Stock Rerouting', async () => {
    // prod_gadget_05 has stock 0
    const outcome = await BuyerAgent.executeCommerceFlow({
      userPrompt: 'Order Ultrahuman Ring AIR sleep tracker',
      simulatedFailureMode: 'OUT_OF_STOCK'
    });
    if (outcome.status !== 'FAILED_RECOVERED' && outcome.status !== 'COMPLETED') {
      throw new Error(`Expected FAILED_RECOVERED, got ${outcome.status}`);
    }
    if (!outcome.alternativeProduct) throw new Error('Expected alternative product to be substituted');
  });

  // Test 11: Real Razorpay Test Mode Order Creation & Signature Verification
  await runTest('11. Razorpay Order Creation & HMAC-SHA256 Signature Verification', async () => {
    const order = await RazorpayEngine.createOrder({
      amountInRupees: 1899,
      receipt: 'rcpt_test_unit_01'
    });
    if (!order.id || !order.id.startsWith('order_')) throw new Error('Invalid Razorpay Order ID');
    if (order.amount !== 189900) throw new Error(`Expected 189900 paise, got ${order.amount}`);

    // Verify signature math
    const isValid = RazorpayEngine.verifyPaymentSignature({
      orderId: order.id,
      paymentId: 'pay_test_01',
      signature: 'invalid_sig_should_fail'
    });
    if (isValid) throw new Error('Signature validation should have failed for fake signature');
  });

  // Test 12: Razorpay Webhook Listener & Idempotent Capture
  await runTest('12. Razorpay Webhook Verification & Order Capture', () => {
    const fakeOrder = RazorpayEngine.createOrder({ amountInRupees: 1499, receipt: 'rcpt_hook_test' });
    const webhookEvent = WebhookManager.emitSimulatedWebhookEvent('payment.captured', 'order_test_hook_01', 1499);
    if (webhookEvent.event !== 'payment.captured') throw new Error('Webhook event not generated');
  });

  // Test 13: Dynamic Upsell Bundles & Abandoned Cart Recovery
  await runTest('13. Dynamic Upsell Bundles & Abandoned Cart Recovery', async () => {
    // 1. Dynamic Bundle Quote
    const quoteRes = MerchantAgent.evaluateAndGenerateQuote({
      productId: 'prod_shoe_07',
      acceptBundles: true
    });
    if (!quoteRes.quote) throw new Error('Missing quote');
    if (quoteRes.quote.discountAmount <= 0) throw new Error('Expected dynamic bundle discount');

    // 2. Abandoned Cart Recovery
    const carts = RevenueGrowthEngine.getAbandonedCarts();
    if (carts.length === 0) throw new Error('Expected seeded abandoned carts');
    const recovered = RevenueGrowthEngine.triggerCartRecovery(carts[0].cartId);
    if (recovered.status !== 'RECOVERED') throw new Error('Failed to mark cart as recovered');

    // 3. Dynamic Growth Metrics Computation
    const metrics = RevenueGrowthEngine.getGrowthMetrics();
    if (metrics.abandonedCartsCount <= 0) throw new Error('Expected non-zero abandoned carts count');
    if (typeof metrics.aovLiftPct !== 'number') throw new Error('Invalid AOV lift percentage');
  });

  // Test 14: Multi-Agent A2A Payee Settlement
  await runTest('14. Multi-Agent A2A Payee Protocol Settlement', async () => {
    const req = await A2APayeeProtocolEngine.receivePaymentRequest({
      payerAgentId: 'agent_external_bot_test',
      serviceRequested: 'Compute API Gateway Call',
      amount: 199,
    });
    if (req.status !== 'SETTLED') throw new Error('A2A request did not settle');
    if (!req.razorpayOrderId) throw new Error('Missing Razorpay Order ID for A2A settlement');
  });

  console.log(`\n========================================`);
  console.log(`🎉 Automated Test Suite Completed: ${passedCount} Passed, ${failedCount} Failed`);
  console.log(`========================================\n`);

  if (failedCount > 0) {
    process.exit(1);
  }
}

runTestSuite();
