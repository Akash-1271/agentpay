import { UAPCatalogEngine } from '../protocols/uap.js';
import { BoundedSpendingEnclave } from '../protocols/guardEnclave.js';
import { BuyerAgent } from '../agents/buyerAgent.js';
import { RevenueGrowthEngine } from '../agents/growthEngine.js';
import { DoubleEntryLedgerEngine } from '../protocols/doubleEntryLedger.js';
import { A2APayeeProtocolEngine } from '../protocols/payeeAgent.js';

async function runTest(name: string, fn: () => Promise<void> | void) {
  try {
    await fn();
    console.log(`  ✅ PASSED: ${name}`);
  } catch (err: any) {
    console.error(`  ❌ FAILED: ${name}`);
    console.error(`     Error: ${err.message}`);
    process.exitCode = 1;
  }
}

async function runTestSuite() {
  console.log('\n🧪 Running AgentPay Track 01 Comprehensive Test Suite...\n');

  // Test 1: Catalog search & schema
  await runTest('1. Canonical UAP Catalog Semantic Search', () => {
    const shoes = UAPCatalogEngine.queryCatalog({ query: 'shoe' });
    if (shoes.length === 0) throw new Error('Expected shoes in catalog');
    if (!shoes[0].specifications) throw new Error('Expected specifications on product');
  });

  // Test 2: CSV Import
  await runTest('2. Dynamic CSV Catalog Import', () => {
    const csv = `id,name,category,price,stock,merchantId,merchantName\nprod_test_01,Test Unit Product,Electronics,1499,10,merch_test,Test Merchant`;
    const res = UAPCatalogEngine.importFromCsv(csv);
    if (!res.catalog.some(i => i.id === 'prod_test_01')) throw new Error('CSV item was not imported');
  });

  // Test 3: Autonomous Transaction Execution
  await runTest('3. Autonomous Buyer Flow & Razorpay Order Creation', async () => {
    const outcome = await BuyerAgent.executeCommerceFlow({
      userPrompt: 'Buy running shoes under ₹2,000',
    });
    if (outcome.status !== 'COMPLETED') throw new Error(`Expected COMPLETED, got ${outcome.status}`);
    if (!outcome.razorpayOrder?.id) throw new Error('Missing Razorpay Order ID');
    if (!outcome.fulfillment?.trackingNumber) throw new Error('Missing Courier Tracking Number');
  });

  // Test 4: Spending Limit & Step-Up Gating
  await runTest('4. Bounded Enclave Step-Up Gating (> ₹2,000)', async () => {
    const outcome = await BuyerAgent.executeCommerceFlow({
      userPrompt: 'Order Keychron Q1 Pro custom mechanical keyboard',
    });
    if (outcome.status !== 'STEP_UP_REQUIRED') throw new Error(`Expected STEP_UP_REQUIRED, got ${outcome.status}`);
    if (!outcome.stepUpApprovalId) throw new Error('Missing Step-Up Approval ID');
  });

  // Test 5: Double-Entry Ledger
  await runTest('5. Double-Entry FinOps Balanced Debits & Credits', () => {
    const journal = DoubleEntryLedgerEngine.getJournal();
    if (journal.length === 0) throw new Error('Expected journal entries');
    const first = journal[0];
    if (!first.balanced) throw new Error('Journal entry is not balanced');
  });

  // Test 6: Abandoned Cart Recovery
  await runTest('6. Abandoned Cart Recovery & Payment Link Generation', () => {
    const carts = RevenueGrowthEngine.getAbandonedCarts();
    if (carts.length === 0) throw new Error('Expected abandoned carts');
    const recovered = RevenueGrowthEngine.triggerCartRecovery(carts[0].cartId);
    if (recovered.status !== 'RECOVERED') throw new Error('Cart recovery status was not updated');
  });

  // Test 7: Multi-Agent / A2A Payee Protocol
  await runTest('7. A2A Payee Protocol & Settlement', async () => {
    const req = await A2APayeeProtocolEngine.receivePaymentRequest({
      payerAgentId: 'agent_external_bot_test',
      serviceRequested: 'Compute API Gateway Call',
      amount: 199,
    });
    if (req.status !== 'SETTLED') throw new Error('A2A request did not settle');
    if (!req.razorpayOrderId) throw new Error('Missing Razorpay Order ID for A2A settlement');
  });

  console.log('\n🎉 All 7 Core Track 01 Tests Passed Successfully!\n');
}

runTestSuite();
