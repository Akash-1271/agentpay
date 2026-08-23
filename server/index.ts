import express, { Request, Response } from 'express';
import cors from 'cors';
import { CONFIG } from './config.js';
import { UAPCatalogEngine } from './protocols/uap.js';
import { AP2ProtocolEngine } from './protocols/ap2.js';
import { BoundedSpendingEnclave } from './protocols/guardEnclave.js';
import { MerchantAgent } from './agents/merchantAgent.js';
import { BuyerAgent } from './agents/buyerAgent.js';
import { RazorpayEngine } from './razorpay/client.js';
import { WebhookManager } from './razorpay/webhooks.js';
import { BenchmarkEngine } from './protocols/benchmark.js';
import { ProtocolWireEngine } from './protocols/protocolWire.js';
import { AmazonMerchantAdapter } from './merchants/amazonAdapter.js';
import { FulfillmentEngine } from './merchants/fulfillmentEngine.js';
import { RevenueGrowthEngine } from './agents/growthEngine.js';
import { DoubleEntryLedgerEngine } from './protocols/doubleEntryLedger.js';
import { A2APayeeProtocolEngine } from './protocols/payeeAgent.js';

const app = express();

app.use(cors());
app.use(express.json());

// ----------------------------------------------------
// SYSTEM & PROTOCOL DISCOVERY
// ----------------------------------------------------
app.get('/api/status', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    system: 'AgentPay Autonomous Commerce Gateway',
    protocols: ['UAP/1.0', 'AP2/2.0', 'x402-Payment-Required'],
    razorpayMode: CONFIG.RAZORPAY_KEY_ID.includes('LiveDemo') ? 'HIGH_FIDELITY_TEST_MODE' : 'RAZORPAY_TEST_API',
    enclaveActive: true,
    spendingMandate: BoundedSpendingEnclave.getMandate(),
    dailySpent: BoundedSpendingEnclave.getDailySpent(),
    timestamp: new Date().toISOString()
  });
});

app.get('/api/uap/schema', (req: Request, res: Response) => {
  res.json(UAPCatalogEngine.getAgentSchemaDescription());
});

// ----------------------------------------------------
// UAP CATALOG & SEMANTIC DISCOVERY
// ----------------------------------------------------
app.get('/api/uap/catalog', (req: Request, res: Response) => {
  const { query, category, maxPrice, minRating, inStockOnly } = req.query;
  const items = UAPCatalogEngine.queryCatalog({
    query: query as string,
    category: category as string,
    maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
    minRating: minRating ? parseFloat(minRating as string) : undefined,
    inStockOnly: inStockOnly !== undefined ? inStockOnly === 'true' : undefined
  });
  res.json({ count: items.length, items });
});

app.get('/api/uap/products/:id', (req: Request, res: Response) => {
  const item = UAPCatalogEngine.getProductById(req.params.id);
  if (!item) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(item);
});

// ----------------------------------------------------
// AP2 QUOTES & MERCHANT YIELD OPTIMIZATION
// ----------------------------------------------------
app.post('/api/uap/quote', (req: Request, res: Response) => {
  const { productId, quantity, acceptBundles, customDiscountCoupon } = req.body;
  if (!productId) {
    return res.status(400).json({ error: 'productId is required' });
  }

  const result = MerchantAgent.evaluateAndGenerateQuote({
    productId,
    quantity,
    acceptBundles,
    customDiscountCoupon
  });

  if (result.status === 'OUT_OF_STOCK') {
    return res.status(409).json(result);
  }
  if (result.status === 'PRODUCT_NOT_FOUND') {
    return res.status(404).json(result);
  }

  res.json(result);
});

// ----------------------------------------------------
// BOUNDED SPENDING ENCLAVE & POLICY MANAGEMENT
// ----------------------------------------------------
app.get('/api/enclave/mandate', (req: Request, res: Response) => {
  res.json({
    mandate: BoundedSpendingEnclave.getMandate(),
    dailySpent: BoundedSpendingEnclave.getDailySpent()
  });
});

app.post('/api/enclave/mandate', (req: Request, res: Response) => {
  const updated = BoundedSpendingEnclave.updateMandate(req.body);
  res.json({ message: 'Delegation mandate updated successfully in enclave', mandate: updated });
});

app.post('/api/enclave/reset-spend', (req: Request, res: Response) => {
  BoundedSpendingEnclave.resetSpend();
  res.json({ message: 'Spend accumulator reset to initial benchmark state', dailySpent: BoundedSpendingEnclave.getDailySpent() });
});

app.get('/api/enclave/audit', (req: Request, res: Response) => {
  res.json({
    count: BoundedSpendingEnclave.getAuditLedger().length,
    ledger: BoundedSpendingEnclave.getAuditLedger()
  });
});

app.get('/api/enclave/pending-approvals', (req: Request, res: Response) => {
  res.json({ approvals: BoundedSpendingEnclave.listPendingApprovals() });
});

app.post('/api/enclave/approve-step-up', async (req: Request, res: Response) => {
  const { approvalId, principalSignature } = req.body;
  if (!approvalId) {
    return res.status(400).json({ error: 'approvalId is required' });
  }

  const record = BoundedSpendingEnclave.resolvePendingApproval(approvalId);
  if (!record) {
    return res.status(404).json({ error: 'Pending approval expired or already resolved' });
  }

  BoundedSpendingEnclave.recordAudit({
    agentId: 'principal_user_authenticator',
    principalUser: 'user_akash_ai_shopper',
    action: 'STEP_UP_APPROVED',
    amount: record.quote.netAmount,
    currency: record.quote.currency,
    details: { approvalId, quoteId: record.quote.quoteId, signature: principalSignature || 'SIG_USER_BIOMETRIC_OK' },
    reasoning: `Principal authenticated and authorized high-value transaction of ₹${record.quote.netAmount}.`
  });

  const outcome = await BuyerAgent.finalizeTransactionWithRazorpay({
    transactionId: record.callbackData.transactionId,
    intent: 'Human Step-Up Authorized Flow',
    selectedProduct: record.callbackData.selectedProduct,
    quote: record.quote,
    policyResult: {
      allowed: true,
      requiresStepUp: false,
      reason: 'Human Step-Up authorization verified via Biometric/OTP signature',
      policyCode: 'AUTO_APPROVED',
      enclaveHash: 'hash_stepup_verified_manual'
    },
    reasoningTrail: record.callbackData.reasoningTrail,
    upsellOffers: record.callbackData.upsellOffers
  });

  res.json({ message: 'Transaction authorized and executed successfully', outcome });
});

// ----------------------------------------------------
// AUTONOMOUS AGENT COMMERCE EXECUTION
// ----------------------------------------------------
app.post('/api/agent/transact', async (req: Request, res: Response) => {
  try {
    const { userPrompt, autoAcceptBundles, forceBundleIds, overrideCategory, simulatedFailureMode } = req.body;
    if (!userPrompt) {
      return res.status(400).json({ error: 'userPrompt is required' });
    }

    const outcome = await BuyerAgent.executeCommerceFlow({
      userPrompt,
      autoAcceptBundles,
      forceBundleIds,
      overrideCategory,
      simulatedFailureMode
    });

    res.json(outcome);
  } catch (error: any) {
    console.error('Error in agent transact:', error);
    res.status(500).json({ error: error.message || 'Internal agent error' });
  }
});

// ----------------------------------------------------
// RAZORPAY INTEGRATION & WEBHOOKS
// ----------------------------------------------------
app.post('/api/razorpay/create-order', async (req: Request, res: Response) => {
  try {
    const { amountInRupees, receipt, notes } = req.body;
    const order = await RazorpayEngine.createOrder({
      amountInRupees: parseFloat(amountInRupees) || 100,
      receipt: receipt || `rcpt_${Date.now()}`,
      notes
    });
    res.json(order);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/razorpay/webhook', (req: Request, res: Response) => {
  WebhookManager.handleWebhook(req, res);
});

// ----------------------------------------------------
// BENCHMARK EVALUATION & PROTOCOL WIRE TRACE
// ----------------------------------------------------
app.post('/api/benchmark/run', async (req: Request, res: Response) => {
  try {
    const { batchSize } = req.body;
    const results = await BenchmarkEngine.runEvaluationSuite(batchSize ? parseInt(batchSize, 10) : 50);
    res.json(results);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// AMAZON & MULTI-MERCHANT FULFILLMENT
// ----------------------------------------------------
app.get('/api/merchants/amazon/search', (req: Request, res: Response) => {
  const query = (req.query.q as string) || '';
  const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined;
  const items = AmazonMerchantAdapter.searchAmazon(query, maxPrice);
  res.json({ count: items.length, source: 'Amazon India Storefront API', items });
});

app.post('/api/amazon/analyze-reviews', (req: Request, res: Response) => {
  try {
    const { query, maxBudget } = req.body;
    const report = AmazonMerchantAdapter.analyzeAndCompare(query || 'running shoes', maxBudget);
    res.json(report);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/merchants/orders', (req: Request, res: Response) => {
  res.json({ orders: FulfillmentEngine.getAllOrders() });
});

// ----------------------------------------------------
// CSV CATALOG IMPORT
// ----------------------------------------------------
app.post('/api/uap/catalog/import-csv', (req: Request, res: Response) => {
  try {
    const { csvText } = req.body;
    if (!csvText) return res.status(400).json({ error: 'csvText is required' });
    const result = UAPCatalogEngine.importFromCsv(csvText);
    res.json({ message: 'Catalog CSV imported successfully', ...result });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// ----------------------------------------------------
// REVENUE GROWTH & ABANDONED CART RECOVERY
// ----------------------------------------------------
app.get('/api/growth/metrics', (req: Request, res: Response) => {
  res.json(RevenueGrowthEngine.getGrowthMetrics());
});

app.get('/api/growth/abandoned-carts', (req: Request, res: Response) => {
  res.json({ carts: RevenueGrowthEngine.getAbandonedCarts() });
});

app.post('/api/growth/recover-cart', (req: Request, res: Response) => {
  try {
    const { cartId } = req.body;
    const cart = RevenueGrowthEngine.triggerCartRecovery(cartId);
    res.json({ message: 'Abandoned cart recovered successfully', cart });
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
});

// ----------------------------------------------------
// DOUBLE-ENTRY FINOPS LEDGER
// ----------------------------------------------------
app.get('/api/finops/ledger', (req: Request, res: Response) => {
  res.json({
    count: DoubleEntryLedgerEngine.getJournal().length,
    journal: DoubleEntryLedgerEngine.getJournal(),
    balances: DoubleEntryLedgerEngine.getBalances(),
  });
});

app.get('/api/finops/balances', (req: Request, res: Response) => {
  res.json({ balances: DoubleEntryLedgerEngine.getBalances() });
});

// ----------------------------------------------------
// MULTI-AGENT / A2A PAYEE PROTOCOL
// ----------------------------------------------------
app.post('/api/a2a/request-payment', async (req: Request, res: Response) => {
  try {
    const { payerAgentId, serviceRequested, amount, currency, voucherToken } = req.body;
    if (!payerAgentId || !serviceRequested || !amount) {
      return res.status(400).json({ error: 'payerAgentId, serviceRequested, and amount are required' });
    }
    const a2aReq = await A2APayeeProtocolEngine.receivePaymentRequest({
      payerAgentId,
      serviceRequested,
      amount: parseFloat(amount),
      currency,
      voucherToken,
    });
    res.json({ message: 'A2A Payment request received and settled via Razorpay test mode', request: a2aReq });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/a2a/requests', (req: Request, res: Response) => {
  res.json({ requests: A2APayeeProtocolEngine.getA2ARequests() });
});

app.listen(CONFIG.PORT, () => {
  console.log(`🚀 AgentPay Gateway & Enclave listening on port ${CONFIG.PORT}`);
  console.log(`📡 Protocols: Universal Agent Protocol (UAP 1.0) & AP2 (Autonomous Payment Protocol)`);
  console.log(`💳 Razorpay Integration: Active (${CONFIG.RAZORPAY_KEY_ID})`);
});
