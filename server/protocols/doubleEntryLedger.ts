import crypto from 'crypto';
import { AgentPayDatabase, JournalEntryRecord, JournalLineRecord } from '../db/database.js';
import { CONFIG } from '../config.js';

export interface JournalLine {
  account: 'PRINCIPAL_SPENDABLE_WALLET' | 'MERCHANT_SETTLEMENT_ACCOUNT' | 'RAZORPAY_ESCROW_CLEARING';
  type: 'DEBIT' | 'CREDIT';
  amount: number;
  currency: string;
}

export interface DoubleEntryTransaction {
  id: string;
  transactionId: string;
  razorpayOrderId: string;
  timestamp: string;
  description: string;
  idempotencyKey: string;
  lines: JournalLine[];
  balanced: boolean;
  hmacSignature: string;
}

export class DoubleEntryLedgerEngine {
  private static idempotencyRegistry: Map<string, { outcome: any; hash: string }> = new Map();

  public static checkIdempotency(key: string, payload: any): { isDuplicate: boolean; cachedOutcome?: any } {
    if (!key) return { isDuplicate: false };
    const hash = crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex');
    const existing = this.idempotencyRegistry.get(key);
    if (existing) {
      if (existing.hash === hash) {
        return { isDuplicate: true, cachedOutcome: existing.outcome };
      }
      throw new Error(`Idempotency conflict: key ${key} was previously submitted with a different payload.`);
    }
    return { isDuplicate: false };
  }

  public static saveIdempotency(key: string, payload: any, outcome: any) {
    if (!key) return;
    const hash = crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex');
    this.idempotencyRegistry.set(key, { outcome, hash });
  }

  public static recordTransaction(params: {
    transactionId: string;
    razorpayOrderId: string;
    amount: number;
    currency?: string;
    description: string;
    idempotencyKey?: string;
  }): DoubleEntryTransaction {
    const idempKey = params.idempotencyKey || `idemp_${params.transactionId}`;
    const record = AgentPayDatabase.recordDoubleEntryTransaction({
      transactionId: params.transactionId,
      razorpayOrderId: params.razorpayOrderId,
      description: params.description,
      idempotencyKey: idempKey,
      amount: params.amount,
      currency: params.currency || 'INR'
    });

    const lines: JournalLine[] = (record.lines || []).map((l: JournalLineRecord) => ({
      account: l.account_id as JournalLine['account'],
      type: l.type as JournalLine['type'],
      amount: l.amount,
      currency: l.currency
    }));

    return {
      id: record.id,
      transactionId: record.transaction_id,
      razorpayOrderId: record.razorpay_order_id,
      timestamp: record.created_at,
      description: record.description,
      idempotencyKey: record.idempotency_key,
      lines,
      balanced: record.balanced === 1,
      hmacSignature: record.hmac_signature
    };
  }

  public static getJournal(): DoubleEntryTransaction[] {
    const entries = AgentPayDatabase.getJournalEntries(100);
    return entries.map(e => ({
      id: e.id,
      transactionId: e.transaction_id,
      razorpayOrderId: e.razorpay_order_id,
      timestamp: e.created_at,
      description: e.description,
      idempotencyKey: e.idempotency_key,
      lines: (e.lines || []).map((l: JournalLineRecord) => ({
        account: l.account_id as JournalLine['account'],
        type: l.type as JournalLine['type'],
        amount: l.amount,
        currency: l.currency
      })),
      balanced: e.balanced === 1,
      hmacSignature: e.hmac_signature
    }));
  }

  public static getBalances(): Record<string, number> {
    return AgentPayDatabase.getBalances();
  }

  public static verifyLedgerIntegrity(): {
    totalEntries: number;
    totalDebits: number;
    totalCredits: number;
    isBalanced: boolean;
    validSignaturesCount: number;
  } {
    const journal = this.getJournal();
    let totalDebits = 0;
    let totalCredits = 0;
    let validSignatures = 0;

    for (const entry of journal) {
      for (const line of entry.lines) {
        if (line.type === 'DEBIT') totalDebits += line.amount;
        if (line.type === 'CREDIT') totalCredits += line.amount;
      }

      // Verify HMAC Signature
      const sigPayload = `${entry.id}:${entry.transactionId}:${entry.lines.find(l => l.type === 'DEBIT')?.amount || 0}:${entry.timestamp}`;
      const expected = crypto.createHmac('sha256', CONFIG.ENCLAVE_SECRET_SALT).update(sigPayload).digest('hex');
      if (expected === entry.hmacSignature) {
        validSignatures++;
      }
    }

    return {
      totalEntries: journal.length,
      totalDebits: Math.round(totalDebits * 100) / 100,
      totalCredits: Math.round(totalCredits * 100) / 100,
      isBalanced: Math.round(totalDebits * 100) === Math.round(totalCredits * 100),
      validSignaturesCount: validSignatures
    };
  }
}
