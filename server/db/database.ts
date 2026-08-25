import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { CONFIG } from '../config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface AccountRecord {
  id: string;
  name: string;
  type: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';
  balance: number;
  currency: string;
  updated_at: string;
}

export interface JournalLineRecord {
  id: string;
  journal_entry_id: string;
  account_id: string;
  type: 'DEBIT' | 'CREDIT';
  amount: number;
  currency: string;
  created_at: string;
}

export interface JournalEntryRecord {
  id: string;
  transaction_id: string;
  razorpay_order_id: string;
  description: string;
  idempotency_key: string;
  total_amount: number;
  currency: string;
  balanced: number;
  hmac_signature: string;
  created_at: string;
  lines?: JournalLineRecord[];
}

export interface AuditLogRecord {
  id: string;
  timestamp: string;
  agent_id: string;
  principal_user: string;
  action: string;
  amount: number | null;
  currency: string;
  details_json: string;
  reasoning: string;
  signature: string;
}

export interface SpendingMandateRecord {
  id: string;
  principal_user: string;
  authorized_agent: string;
  max_per_transaction: number;
  daily_ceiling: number;
  currency: string;
  allowed_categories_json: string;
  whitelisted_merchants_json: string;
  requires_step_up_above: number;
  valid_until: string;
  signature: string;
  updated_at: string;
}

export interface PendingStepUpRecord {
  id: string;
  transaction_id: string;
  quote_id: string;
  quote_json: string;
  callback_data_json: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';
  created_at: string;
  resolved_at: string | null;
  signature: string | null;
}

export interface CatalogProductRecord {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  currency: string;
  stock: number;
  rating: number;
  merchant_id: string;
  merchant_name: string;
  tags_json: string;
  specifications_json: string;
  bundle_deals_json: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface AbandonedCartDbRecord {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  product_id: string;
  original_price: number;
  discounted_price: number;
  discount_pct: number;
  payment_link_id: string;
  payment_link_url: string;
  recovery_message: string;
  status: 'PENDING_RECOVERY' | 'RECOVERED' | 'EXPIRED';
  created_at: string;
  recovered_at: string | null;
}

export interface OrderDbRecord {
  id: string;
  razorpay_order_id: string;
  razorpay_payment_id: string | null;
  product_id: string;
  product_name: string;
  merchant_id: string;
  merchant_name: string;
  amount: number;
  currency: string;
  status: 'CREATED' | 'CAPTURED' | 'FAILED' | 'REFUNDED';
  idempotency_key: string;
  reasoning_trail_json: string;
  courier_partner: string;
  tracking_awb: string;
  estimated_delivery: string;
  tax_invoice_id: string;
  created_at: string;
}

export interface A2ARequestDbRecord {
  id: string;
  payer_agent_id: string;
  service_requested: string;
  amount: number;
  currency: string;
  voucher_token: string | null;
  status: 'PENDING' | 'SETTLED' | 'REJECTED';
  razorpay_order_id: string | null;
  created_at: string;
}

export class AgentPayDatabase {
  private static db: Database.Database | null = null;

  public static getDb(): Database.Database {
    if (!this.db) {
      const dataDir = path.dirname(CONFIG.DB_PATH);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      this.db = new Database(CONFIG.DB_PATH);
      this.db.pragma('journal_mode = WAL');
      this.db.pragma('foreign_keys = ON');
      this.initSchema();
      this.seedInitialData();
    }
    return this.db;
  }

  private static initSchema() {
    const db = this.db!;
    db.exec(`
      CREATE TABLE IF NOT EXISTS accounts (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        balance REAL NOT NULL DEFAULT 0,
        currency TEXT NOT NULL DEFAULT 'INR',
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS journal_entries (
        id TEXT PRIMARY KEY,
        transaction_id TEXT NOT NULL,
        razorpay_order_id TEXT NOT NULL,
        description TEXT NOT NULL,
        idempotency_key TEXT UNIQUE NOT NULL,
        total_amount REAL NOT NULL,
        currency TEXT NOT NULL DEFAULT 'INR',
        balanced INTEGER NOT NULL DEFAULT 1,
        hmac_signature TEXT NOT NULL,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS journal_lines (
        id TEXT PRIMARY KEY,
        journal_entry_id TEXT NOT NULL,
        account_id TEXT NOT NULL,
        type TEXT NOT NULL CHECK(type IN ('DEBIT', 'CREDIT')),
        amount REAL NOT NULL,
        currency TEXT NOT NULL DEFAULT 'INR',
        created_at TEXT NOT NULL,
        FOREIGN KEY (journal_entry_id) REFERENCES journal_entries(id) ON DELETE CASCADE,
        FOREIGN KEY (account_id) REFERENCES accounts(id)
      );

      CREATE TABLE IF NOT EXISTS audit_logs (
        id TEXT PRIMARY KEY,
        timestamp TEXT NOT NULL,
        agent_id TEXT NOT NULL,
        principal_user TEXT NOT NULL,
        action TEXT NOT NULL,
        amount REAL,
        currency TEXT NOT NULL DEFAULT 'INR',
        details_json TEXT NOT NULL,
        reasoning TEXT NOT NULL,
        signature TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS spending_mandates (
        id TEXT PRIMARY KEY,
        principal_user TEXT NOT NULL,
        authorized_agent TEXT NOT NULL,
        max_per_transaction REAL NOT NULL DEFAULT 2000,
        daily_ceiling REAL NOT NULL DEFAULT 25000,
        currency TEXT NOT NULL DEFAULT 'INR',
        allowed_categories_json TEXT NOT NULL,
        whitelisted_merchants_json TEXT NOT NULL,
        requires_step_up_above REAL NOT NULL DEFAULT 2000,
        valid_until TEXT NOT NULL,
        signature TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS pending_step_ups (
        id TEXT PRIMARY KEY,
        transaction_id TEXT NOT NULL,
        quote_id TEXT NOT NULL,
        quote_json TEXT NOT NULL,
        callback_data_json TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'PENDING',
        created_at TEXT NOT NULL,
        resolved_at TEXT,
        signature TEXT
      );

      CREATE TABLE IF NOT EXISTS catalog_products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT NOT NULL,
        price REAL NOT NULL,
        currency TEXT NOT NULL DEFAULT 'INR',
        stock INTEGER NOT NULL DEFAULT 0,
        rating REAL NOT NULL DEFAULT 4.5,
        merchant_id TEXT NOT NULL,
        merchant_name TEXT NOT NULL,
        tags_json TEXT NOT NULL DEFAULT '[]',
        specifications_json TEXT NOT NULL DEFAULT '{}',
        bundle_deals_json TEXT NOT NULL DEFAULT '[]',
        image_url TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS abandoned_carts (
        id TEXT PRIMARY KEY,
        customer_name TEXT NOT NULL,
        customer_phone TEXT NOT NULL,
        customer_email TEXT NOT NULL,
        product_id TEXT NOT NULL,
        original_price REAL NOT NULL,
        discounted_price REAL NOT NULL,
        discount_pct REAL NOT NULL,
        payment_link_id TEXT NOT NULL,
        payment_link_url TEXT NOT NULL,
        recovery_message TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'PENDING_RECOVERY',
        created_at TEXT NOT NULL,
        recovered_at TEXT
      );

      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        razorpay_order_id TEXT NOT NULL,
        razorpay_payment_id TEXT,
        product_id TEXT NOT NULL,
        product_name TEXT NOT NULL,
        merchant_id TEXT NOT NULL,
        merchant_name TEXT NOT NULL,
        amount REAL NOT NULL,
        currency TEXT NOT NULL DEFAULT 'INR',
        status TEXT NOT NULL DEFAULT 'CREATED',
        idempotency_key TEXT UNIQUE NOT NULL,
        reasoning_trail_json TEXT NOT NULL,
        courier_partner TEXT NOT NULL,
        tracking_awb TEXT NOT NULL,
        estimated_delivery TEXT NOT NULL,
        tax_invoice_id TEXT NOT NULL,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS a2a_requests (
        id TEXT PRIMARY KEY,
        payer_agent_id TEXT NOT NULL,
        service_requested TEXT NOT NULL,
        amount REAL NOT NULL,
        currency TEXT NOT NULL DEFAULT 'INR',
        voucher_token TEXT,
        status TEXT NOT NULL DEFAULT 'PENDING',
        razorpay_order_id TEXT,
        created_at TEXT NOT NULL
      );
    `);
  }

  private static seedInitialData() {
    const db = this.db!;
    const now = new Date().toISOString();

    // 1. Seed Accounts if empty
    const accountCount = db.prepare('SELECT COUNT(*) as count FROM accounts').get() as { count: number };
    if (accountCount.count === 0) {
      const insertAccount = db.prepare(`
        INSERT INTO accounts (id, name, type, balance, currency, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      insertAccount.run('PRINCIPAL_SPENDABLE_WALLET', 'Principal Autonomous Spendable Budget', 'ASSET', 50000, 'INR', now);
      insertAccount.run('MERCHANT_SETTLEMENT_ACCOUNT', 'Merchant Settlement Clearing Account', 'LIABILITY', 0, 'INR', now);
      insertAccount.run('RAZORPAY_ESCROW_CLEARING', 'Razorpay Gateway In-Flight Escrow', 'ASSET', 0, 'INR', now);
    }

    // 2. Seed Spending Mandate if empty
    const mandateCount = db.prepare('SELECT COUNT(*) as count FROM spending_mandates').get() as { count: number };
    if (mandateCount.count === 0) {
      const allowedCategories = JSON.stringify([
        'Athletics & Apparel',
        'Electronics & Peripherals',
        'Audio',
        'Cloud & AI Infrastructure',
        'Wearables & Health',
        'Electronics',
      ]);
      const whitelistedMerchants = JSON.stringify([
        'merch_nike_india',
        'merch_adidas_store',
        'merch_apex_gear',
        'merch_amazon',
        'merch_razorpay_store',
        'merch_nebulacloud',
        'merch_biowear',
        'merch_puma_store',
        'merch_asics_india',
        'merch_test',
      ]);
      const validUntil = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString();
      const sig = crypto.createHmac('sha256', CONFIG.ENCLAVE_SECRET_SALT).update(`mandate_main_001:${validUntil}:2000:25000`).digest('hex');

      db.prepare(`
        INSERT INTO spending_mandates (
          id, principal_user, authorized_agent, max_per_transaction, daily_ceiling,
          currency, allowed_categories_json, whitelisted_merchants_json, requires_step_up_above,
          valid_until, signature, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        'mandate_main_001',
        CONFIG.DEFAULT_BUYER_ID,
        'agent_buyer_concierge',
        2000,
        25000,
        'INR',
        allowedCategories,
        whitelistedMerchants,
        2000,
        validUntil,
        sig,
        now
      );
    }

    // 3. Seed Catalog Products from catalog.json if empty
    const productCount = db.prepare('SELECT COUNT(*) as count FROM catalog_products').get() as { count: number };
    if (productCount.count === 0) {
      const catalogPath = path.join(__dirname, '..', 'data', 'catalog.json');
      if (fs.existsSync(catalogPath)) {
        try {
          const raw = fs.readFileSync(catalogPath, 'utf8');
          const products = JSON.parse(raw);
          const insertProduct = db.prepare(`
            INSERT INTO catalog_products (
              id, name, category, description, price, currency, stock, rating,
              merchant_id, merchant_name, tags_json, specifications_json, bundle_deals_json,
              image_url, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `);

          const insertMany = db.transaction((items: any[]) => {
            for (const item of items) {
              insertProduct.run(
                item.id,
                item.name,
                item.category || 'General',
                item.description || '',
                item.price,
                item.currency || 'INR',
                item.stock !== undefined ? item.stock : 10,
                item.rating || 4.8,
                item.merchantId || 'merch_apex_gear',
                item.merchantName || 'Apex Gear',
                JSON.stringify(item.tags || []),
                JSON.stringify(item.specifications || {}),
                JSON.stringify(item.bundleDeals || []),
                item.imageUrl || null,
                now,
                now
              );
            }
          });
          insertMany(products);
        } catch (err) {
          console.warn('Failed to seed catalog from JSON:', err);
        }
      }
    }

    // 4. Seed Abandoned Carts if empty
    const cartCount = db.prepare('SELECT COUNT(*) as count FROM abandoned_carts').get() as { count: number };
    if (cartCount.count === 0) {
      const insertCart = db.prepare(`
        INSERT INTO abandoned_carts (
          id, customer_name, customer_phone, customer_email, product_id,
          original_price, discounted_price, discount_pct, payment_link_id,
          payment_link_url, recovery_message, status, created_at, recovered_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      insertCart.run(
        'cart_abn_01',
        'Rohit Sharma',
        '+919876543210',
        'rohit@agentpay.network',
        'prod_shoe_07',
        1899,
        1614,
        15,
        'plink_998124_nike',
        'https://rzp.io/i/nike_pegasus_rec_881',
        'Hey Rohit! We noticed you left the Nike Pegasus 40 in your cart. We held inventory and activated a 15% VIP discount (₹1,614). Complete checkout: https://rzp.io/i/nike_pegasus_rec_881',
        'RECOVERED',
        new Date(Date.now() - 45 * 60000).toISOString(),
        new Date(Date.now() - 15 * 60000).toISOString()
      );

      insertCart.run(
        'cart_abn_02',
        'Priya Kumar',
        '+919812345678',
        'priya@agentpay.network',
        'prod_kb_01',
        3899,
        3314,
        15,
        'plink_998125_keychron',
        'https://rzp.io/i/keychron_q1_rec_912',
        'Hi Priya! Your Keychron Q1 Pro custom keyboard is reserved at Apex Gear with 15% savings: https://rzp.io/i/keychron_q1_rec_912',
        'PENDING_RECOVERY',
        new Date(Date.now() - 25 * 60000).toISOString(),
        null
      );
    }
  }

  // ----------------------------------------------------
  // REPOSITORY: ACCOUNTS & JOURNAL (FINOPS LEDGER)
  // ----------------------------------------------------

  public static getAccounts(): AccountRecord[] {
    const db = this.getDb();
    return db.prepare('SELECT * FROM accounts ORDER BY id ASC').all() as AccountRecord[];
  }

  public static getBalances(): Record<string, number> {
    const accounts = this.getAccounts();
    const map: Record<string, number> = {};
    for (const acc of accounts) {
      map[acc.id] = acc.balance;
    }
    return map;
  }

  public static getJournalEntries(limit: number = 100): JournalEntryRecord[] {
    const db = this.getDb();
    const entries = db.prepare('SELECT * FROM journal_entries ORDER BY created_at DESC LIMIT ?').all(limit) as JournalEntryRecord[];
    const linesStmt = db.prepare('SELECT * FROM journal_lines WHERE journal_entry_id = ? ORDER BY id ASC');

    for (const entry of entries) {
      entry.lines = linesStmt.all(entry.id) as JournalLineRecord[];
    }
    return entries;
  }

  public static recordDoubleEntryTransaction(params: {
    transactionId: string;
    razorpayOrderId: string;
    description: string;
    idempotencyKey: string;
    amount: number;
    currency?: string;
  }): JournalEntryRecord {
    const db = this.getDb();
    const currency = params.currency || 'INR';
    const now = new Date().toISOString();
    const entryId = `jrn_${crypto.randomBytes(6).toString('hex')}`;

    // Check existing idempotency
    const existing = db.prepare('SELECT * FROM journal_entries WHERE idempotency_key = ?').get(params.idempotencyKey) as JournalEntryRecord | undefined;
    if (existing) {
      const lines = db.prepare('SELECT * FROM journal_lines WHERE journal_entry_id = ?').all(existing.id) as JournalLineRecord[];
      existing.lines = lines;
      return existing;
    }

    const sigPayload = `${entryId}:${params.transactionId}:${params.amount}:${now}`;
    const hmacSig = crypto.createHmac('sha256', CONFIG.ENCLAVE_SECRET_SALT).update(sigPayload).digest('hex');

    const executeTx = db.transaction(() => {
      // 1. Insert Journal Entry
      db.prepare(`
        INSERT INTO journal_entries (
          id, transaction_id, razorpay_order_id, description, idempotency_key,
          total_amount, currency, balanced, hmac_signature, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
      `).run(
        entryId,
        params.transactionId,
        params.razorpayOrderId,
        params.description,
        params.idempotencyKey,
        params.amount,
        currency,
        hmacSig,
        now
      );

      // 2. Insert Lines (Debit User Wallet, Credit Merchant Settlement)
      const debitLineId = `line_${crypto.randomBytes(6).toString('hex')}`;
      const creditLineId = `line_${crypto.randomBytes(6).toString('hex')}`;

      db.prepare(`
        INSERT INTO journal_lines (id, journal_entry_id, account_id, type, amount, currency, created_at)
        VALUES (?, ?, 'PRINCIPAL_SPENDABLE_WALLET', 'DEBIT', ?, ?, ?)
      `).run(debitLineId, entryId, params.amount, currency, now);

      db.prepare(`
        INSERT INTO journal_lines (id, journal_entry_id, account_id, type, amount, currency, created_at)
        VALUES (?, ?, 'MERCHANT_SETTLEMENT_ACCOUNT', 'CREDIT', ?, ?, ?)
      `).run(creditLineId, entryId, params.amount, currency, now);

      // 3. Update Account Balances atomically
      db.prepare('UPDATE accounts SET balance = balance - ?, updated_at = ? WHERE id = ?').run(params.amount, now, 'PRINCIPAL_SPENDABLE_WALLET');
      db.prepare('UPDATE accounts SET balance = balance + ?, updated_at = ? WHERE id = ?').run(params.amount, now, 'MERCHANT_SETTLEMENT_ACCOUNT');
    });

    executeTx();

    const created = db.prepare('SELECT * FROM journal_entries WHERE id = ?').get(entryId) as JournalEntryRecord;
    created.lines = db.prepare('SELECT * FROM journal_lines WHERE journal_entry_id = ?').all(entryId) as JournalLineRecord[];
    return created;
  }

  // ----------------------------------------------------
  // REPOSITORY: AUDIT LOGS
  // ----------------------------------------------------

  public static insertAuditLog(data: {
    agentId: string;
    principalUser: string;
    action: string;
    amount?: number | null;
    currency?: string;
    details: Record<string, any>;
    reasoning: string;
  }): AuditLogRecord {
    const db = this.getDb();
    const id = `aud_${crypto.randomBytes(6).toString('hex')}`;
    const timestamp = new Date().toISOString();
    const currency = data.currency || 'INR';
    const amount = data.amount !== undefined ? data.amount : null;
    const detailsJson = JSON.stringify(data.details);

    const sigPayload = `${id}:${timestamp}:${data.agentId}:${data.action}:${amount || 0}`;
    const signature = crypto.createHmac('sha256', CONFIG.ENCLAVE_SECRET_SALT).update(sigPayload).digest('hex');

    db.prepare(`
      INSERT INTO audit_logs (id, timestamp, agent_id, principal_user, action, amount, currency, details_json, reasoning, signature)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      timestamp,
      data.agentId,
      data.principalUser,
      data.action,
      amount,
      currency,
      detailsJson,
      data.reasoning,
      signature
    );

    return {
      id,
      timestamp,
      agent_id: data.agentId,
      principal_user: data.principalUser,
      action: data.action,
      amount,
      currency,
      details_json: detailsJson,
      reasoning: data.reasoning,
      signature
    };
  }

  public static getAuditLogs(limit: number = 200): AuditLogRecord[] {
    const db = this.getDb();
    return db.prepare('SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT ?').all(limit) as AuditLogRecord[];
  }

  // ----------------------------------------------------
  // REPOSITORY: SPENDING MANDATES & STEP-UP
  // ----------------------------------------------------

  public static getActiveMandate(): SpendingMandateRecord {
    const db = this.getDb();
    const mandate = db.prepare('SELECT * FROM spending_mandates ORDER BY updated_at DESC LIMIT 1').get() as SpendingMandateRecord | undefined;
    if (!mandate) {
      throw new Error('No active spending mandate found');
    }
    return mandate;
  }

  public static updateMandate(updates: Partial<SpendingMandateRecord>): SpendingMandateRecord {
    const db = this.getDb();
    const current = this.getActiveMandate();
    const now = new Date().toISOString();

    const merged = {
      ...current,
      ...updates,
      updated_at: now
    };

    const sigPayload = `${merged.id}:${merged.valid_until}:${merged.max_per_transaction}:${merged.daily_ceiling}`;
    merged.signature = crypto.createHmac('sha256', CONFIG.ENCLAVE_SECRET_SALT).update(sigPayload).digest('hex');

    db.prepare(`
      UPDATE spending_mandates SET
        max_per_transaction = ?,
        daily_ceiling = ?,
        requires_step_up_above = ?,
        allowed_categories_json = ?,
        whitelisted_merchants_json = ?,
        valid_until = ?,
        signature = ?,
        updated_at = ?
      WHERE id = ?
    `).run(
      merged.max_per_transaction,
      merged.daily_ceiling,
      merged.requires_step_up_above,
      merged.allowed_categories_json,
      merged.whitelisted_merchants_json,
      merged.valid_until,
      merged.signature,
      now,
      merged.id
    );

    this.insertAuditLog({
      agentId: 'system_enclave_admin',
      principalUser: merged.principal_user,
      action: 'POLICY_EVALUATION',
      currency: merged.currency,
      details: { updatedMandate: merged },
      reasoning: 'Principal updated spending policy guardrails in persistent enclave.'
    });

    return merged;
  }

  public static computeTodayCumulativeSpend(userId?: string): number {
    const db = this.getDb();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayIso = todayStart.toISOString();

    const row = db.prepare(`
      SELECT COALESCE(SUM(total_amount), 0) as total
      FROM journal_entries
      WHERE created_at >= ?
    `).get(todayIso) as { total: number };

    return row ? row.total : 0;
  }

  public static insertPendingStepUp(record: {
    id: string;
    transactionId: string;
    quoteId: string;
    quoteJson: string;
    callbackDataJson: string;
  }): PendingStepUpRecord {
    const db = this.getDb();
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO pending_step_ups (id, transaction_id, quote_id, quote_json, callback_data_json, status, created_at)
      VALUES (?, ?, ?, ?, ?, 'PENDING', ?)
    `).run(record.id, record.transactionId, record.quoteId, record.quoteJson, record.callbackDataJson, now);

    return {
      id: record.id,
      transaction_id: record.transactionId,
      quote_id: record.quoteId,
      quote_json: record.quoteJson,
      callback_data_json: record.callbackDataJson,
      status: 'PENDING',
      created_at: now,
      resolved_at: null,
      signature: null
    };
  }

  public static resolvePendingStepUp(id: string, signature: string, status: 'APPROVED' | 'REJECTED' = 'APPROVED'): PendingStepUpRecord | null {
    const db = this.getDb();
    const now = new Date().toISOString();

    const existing = db.prepare('SELECT * FROM pending_step_ups WHERE id = ? AND status = ?').get(id, 'PENDING') as PendingStepUpRecord | undefined;
    if (!existing) return null;

    db.prepare(`
      UPDATE pending_step_ups SET status = ?, resolved_at = ?, signature = ? WHERE id = ?
    `).run(status, now, signature, id);

    existing.status = status;
    existing.resolved_at = now;
    existing.signature = signature;
    return existing;
  }

  public static getPendingStepUps(): PendingStepUpRecord[] {
    const db = this.getDb();
    return db.prepare('SELECT * FROM pending_step_ups WHERE status = ? ORDER BY created_at DESC').all('PENDING') as PendingStepUpRecord[];
  }

  // ----------------------------------------------------
  // REPOSITORY: CATALOG PRODUCTS
  // ----------------------------------------------------

  public static getCatalogProducts(): CatalogProductRecord[] {
    const db = this.getDb();
    return db.prepare('SELECT * FROM catalog_products ORDER BY price ASC').all() as CatalogProductRecord[];
  }

  public static getProductById(id: string): CatalogProductRecord | null {
    const db = this.getDb();
    const product = db.prepare('SELECT * FROM catalog_products WHERE id = ?').get(id) as CatalogProductRecord | undefined;
    return product || null;
  }

  public static upsertProduct(product: {
    id: string;
    name: string;
    category: string;
    description: string;
    price: number;
    currency?: string;
    stock?: number;
    rating?: number;
    merchantId: string;
    merchantName: string;
    tags?: string[];
    specifications?: Record<string, any>;
    bundleDeals?: any[];
    imageUrl?: string | null;
  }): CatalogProductRecord {
    const db = this.getDb();
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO catalog_products (
        id, name, category, description, price, currency, stock, rating,
        merchant_id, merchant_name, tags_json, specifications_json, bundle_deals_json,
        image_url, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        description = excluded.description,
        price = excluded.price,
        currency = excluded.currency,
        stock = excluded.stock,
        rating = excluded.rating,
        merchant_id = excluded.merchant_id,
        merchant_name = excluded.merchant_name,
        tags_json = excluded.tags_json,
        specifications_json = excluded.specifications_json,
        bundle_deals_json = excluded.bundle_deals_json,
        image_url = excluded.image_url,
        updated_at = excluded.updated_at
    `).run(
      product.id,
      product.name,
      product.category,
      product.description || '',
      product.price,
      product.currency || 'INR',
      product.stock !== undefined ? product.stock : 10,
      product.rating || 4.8,
      product.merchantId,
      product.merchantName,
      JSON.stringify(product.tags || []),
      JSON.stringify(product.specifications || {}),
      JSON.stringify(product.bundleDeals || []),
      product.imageUrl || null,
      now,
      now
    );

    return this.getProductById(product.id)!;
  }

  public static decrementStock(productId: string, quantity: number = 1): boolean {
    const db = this.getDb();
    const product = this.getProductById(productId);
    if (!product || product.stock < quantity) return false;

    db.prepare('UPDATE catalog_products SET stock = stock - ?, updated_at = ? WHERE id = ?').run(quantity, new Date().toISOString(), productId);
    return true;
  }

  // ----------------------------------------------------
  // REPOSITORY: ABANDONED CARTS & GROWTH
  // ----------------------------------------------------

  public static getAbandonedCarts(): AbandonedCartDbRecord[] {
    const db = this.getDb();
    return db.prepare('SELECT * FROM abandoned_carts ORDER BY created_at DESC').all() as AbandonedCartDbRecord[];
  }

  public static insertAbandonedCart(cart: {
    id: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    productId: string;
    originalPrice: number;
    discountedPrice: number;
    discountPct: number;
    paymentLinkId: string;
    paymentLinkUrl: string;
    recoveryMessage: string;
  }): AbandonedCartDbRecord {
    const db = this.getDb();
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO abandoned_carts (
        id, customer_name, customer_phone, customer_email, product_id,
        original_price, discounted_price, discount_pct, payment_link_id,
        payment_link_url, recovery_message, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING_RECOVERY', ?)
    `).run(
      cart.id,
      cart.customerName,
      cart.customerPhone,
      cart.customerEmail,
      cart.productId,
      cart.originalPrice,
      cart.discountedPrice,
      cart.discountPct,
      cart.paymentLinkId,
      cart.paymentLinkUrl,
      cart.recoveryMessage,
      now
    );

    return db.prepare('SELECT * FROM abandoned_carts WHERE id = ?').get(cart.id) as AbandonedCartDbRecord;
  }

  public static markCartRecovered(cartId: string): AbandonedCartDbRecord | null {
    const db = this.getDb();
    const now = new Date().toISOString();

    const existing = db.prepare('SELECT * FROM abandoned_carts WHERE id = ?').get(cartId) as AbandonedCartDbRecord | undefined;
    if (!existing) return null;

    db.prepare('UPDATE abandoned_carts SET status = ?, recovered_at = ? WHERE id = ?').run('RECOVERED', now, cartId);
    existing.status = 'RECOVERED';
    existing.recovered_at = now;
    return existing;
  }

  // ----------------------------------------------------
  // REPOSITORY: ORDERS & FULFILLMENT
  // ----------------------------------------------------

  public static insertOrder(order: {
    id: string;
    razorpayOrderId: string;
    razorpayPaymentId?: string | null;
    productId: string;
    productName: string;
    merchantId: string;
    merchantName: string;
    amount: number;
    currency?: string;
    status?: 'CREATED' | 'CAPTURED' | 'FAILED';
    idempotencyKey: string;
    reasoningTrailJson: string;
    courierPartner: string;
    trackingAwb: string;
    estimatedDelivery: string;
    taxInvoiceId: string;
  }): OrderDbRecord {
    const db = this.getDb();
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO orders (
        id, razorpay_order_id, razorpay_payment_id, product_id, product_name,
        merchant_id, merchant_name, amount, currency, status, idempotency_key,
        reasoning_trail_json, courier_partner, tracking_awb, estimated_delivery,
        tax_invoice_id, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      order.id,
      order.razorpayOrderId,
      order.razorpayPaymentId || null,
      order.productId,
      order.productName,
      order.merchantId,
      order.merchantName,
      order.amount,
      order.currency || 'INR',
      order.status || 'CREATED',
      order.idempotencyKey,
      order.reasoningTrailJson,
      order.courierPartner,
      order.trackingAwb,
      order.estimatedDelivery,
      order.taxInvoiceId,
      now
    );

    return db.prepare('SELECT * FROM orders WHERE id = ?').get(order.id) as OrderDbRecord;
  }

  public static getOrders(limit: number = 50): OrderDbRecord[] {
    const db = this.getDb();
    return db.prepare('SELECT * FROM orders ORDER BY created_at DESC LIMIT ?').all(limit) as OrderDbRecord[];
  }

  public static markOrderCaptured(razorpayOrderId: string, paymentId: string): OrderDbRecord | null {
    const db = this.getDb();
    const order = db.prepare('SELECT * FROM orders WHERE razorpay_order_id = ?').get(razorpayOrderId) as OrderDbRecord | undefined;
    if (!order) return null;

    db.prepare('UPDATE orders SET status = ?, razorpay_payment_id = ? WHERE id = ?').run('CAPTURED', paymentId, order.id);
    order.status = 'CAPTURED';
    order.razorpay_payment_id = paymentId;
    return order;
  }
}
