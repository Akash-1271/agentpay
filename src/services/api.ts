import {
  ProductItem,
  AP2DelegationMandate,
  AP2SignedQuote,
  AgentTransactionOutcome,
  AuditRecord,
} from '../types';

const API_BASE = '/api';

export const api = {
  async getStatus() {
    const res = await fetch(`${API_BASE}/status`);
    if (!res.ok) throw new Error('Failed to fetch gateway status');
    return res.json();
  },

  async getCatalog(params?: { query?: string; category?: string; inStockOnly?: boolean }): Promise<{ count: number; items: ProductItem[] }> {
    const searchParams = new URLSearchParams();
    if (params?.query) searchParams.set('query', params.query);
    if (params?.category) searchParams.set('category', params.category);
    if (params?.inStockOnly !== undefined) searchParams.set('inStockOnly', String(params.inStockOnly));

    const res = await fetch(`${API_BASE}/uap/catalog?${searchParams.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch catalog');
    return res.json();
  },

  async getMandate(): Promise<{ mandate: AP2DelegationMandate; dailySpent: number }> {
    const res = await fetch(`${API_BASE}/enclave/mandate`);
    if (!res.ok) throw new Error('Failed to fetch spending mandate');
    return res.json();
  },

  async updateMandate(updates: Partial<AP2DelegationMandate>): Promise<{ message: string; mandate: AP2DelegationMandate }> {
    const res = await fetch(`${API_BASE}/enclave/mandate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update mandate');
    return res.json();
  },

  async getAuditLedger(): Promise<{ count: number; ledger: AuditRecord[] }> {
    const res = await fetch(`${API_BASE}/enclave/audit`);
    if (!res.ok) throw new Error('Failed to fetch audit ledger');
    return res.json();
  },

  async runAgentTransaction(payload: {
    userPrompt: string;
    autoAcceptBundles?: boolean;
    forceBundleIds?: string[];
    overrideCategory?: string;
    simulatedFailureMode?: 'OUT_OF_STOCK' | 'BUDGET_BREACH' | 'PRICE_SURGE' | 'GATEWAY_TIMEOUT' | 'NONE';
  }): Promise<AgentTransactionOutcome> {
    const res = await fetch(`${API_BASE}/agent/transact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Agent transaction failed');
    }
    return res.json();
  },

  async approveStepUp(approvalId: string, signature?: string): Promise<{ message: string; outcome: AgentTransactionOutcome }> {
    const res = await fetch(`${API_BASE}/enclave/approve-step-up`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approvalId, principalSignature: signature || 'SIG_USER_BIOMETRIC_PASS' }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Step-up approval failed');
    }
    return res.json();
  },

  async runBenchmarkSuite(batchSize: number = 50) {
    const res = await fetch(`${API_BASE}/benchmark/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ batchSize }),
    });
    if (!res.ok) throw new Error('Benchmark suite execution failed');
    return res.json();
  },

  async getProtocolWireTrace(txId: string) {
    const res = await fetch(`${API_BASE}/protocol/wire-trace/${txId}`);
    if (!res.ok) throw new Error('Failed to fetch protocol wire trace');
    return res.json();
  },

  async resetSpend() {
    const res = await fetch(`${API_BASE}/enclave/reset-spend`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to reset spend');
    return res.json();
  },

  async getGrowthMetrics() {
    const res = await fetch(`${API_BASE}/growth/metrics`);
    if (!res.ok) throw new Error('Failed to fetch growth metrics');
    return res.json();
  },

  async getAbandonedCarts() {
    const res = await fetch(`${API_BASE}/growth/abandoned-carts`);
    if (!res.ok) throw new Error('Failed to fetch abandoned carts');
    return res.json();
  },

  async recoverCart(cartId: string) {
    const res = await fetch(`${API_BASE}/growth/recover-cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cartId }),
    });
    if (!res.ok) throw new Error('Failed to recover cart');
    return res.json();
  },

  async getFinOpsLedger() {
    const res = await fetch(`${API_BASE}/finops/ledger`);
    if (!res.ok) throw new Error('Failed to fetch FinOps ledger');
    return res.json();
  },

  async importCatalogCsv(csvText: string) {
    const res = await fetch(`${API_BASE}/uap/catalog/import-csv`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ csvText }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to import CSV');
    }
    return res.json();
  },

  async sendA2APayment(payerAgentId: string, serviceRequested: string, amount: number) {
    const res = await fetch(`${API_BASE}/a2a/request-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ payerAgentId, serviceRequested, amount }),
    });
    if (!res.ok) throw new Error('Failed to execute A2A payment');
    return res.json();
  },

  async analyzeAmazonReviews(query: string, maxBudget?: number) {
    const res = await fetch(`${API_BASE}/amazon/analyze-reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, maxBudget }),
    });
    if (!res.ok) throw new Error('Failed to analyze Amazon reviews');
    return res.json();
  },
};
