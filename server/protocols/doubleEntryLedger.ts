import crypto from 'crypto';

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
  private static journal: DoubleEntryTransaction[] = [];
  private static idempotencyRegistry: Map<string, { outcome: any; hash: string }> = new Map();
  private static balances: Record<string, number> = {
    'PRINCIPAL_SPENDABLE_WALLET': 50000, // Initial user budget
    'MERCHANT_SETTLEMENT_ACCOUNT': 0,
    'RAZORPAY_ESCROW_CLEARING': 0,
  };

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
    currency: string;
    description: string;
    idempotencyKey?: string;
  }): DoubleEntryTransaction {
    const id = `jrn_${crypto.randomBytes(6).toString('hex')}`;
    const timestamp = new Date().toISOString();
    const idempKey = params.idempotencyKey || `idemp_${params.transactionId}`;

    const lines: JournalLine[] = [
      {
        account: 'PRINCIPAL_SPENDABLE_WALLET',
        type: 'DEBIT',
        amount: params.amount,
        currency: params.currency,
      },
      {
        account: 'MERCHANT_SETTLEMENT_ACCOUNT',
        type: 'CREDIT',
        amount: params.amount,
        currency: params.currency,
      },
    ];

    // Update balances
    this.balances['PRINCIPAL_SPENDABLE_WALLET'] -= params.amount;
    this.balances['MERCHANT_SETTLEMENT_ACCOUNT'] += params.amount;

    const totalDebits = lines.filter(l => l.type === 'DEBIT').reduce((acc, l) => acc + l.amount, 0);
    const totalCredits = lines.filter(l => l.type === 'CREDIT').reduce((acc, l) => acc + l.amount, 0);
    const balanced = totalDebits === totalCredits;

    const signaturePayload = `${id}:${params.transactionId}:${params.amount}:${timestamp}`;
    const hmacSignature = crypto.createHmac('sha256', 'SECRET_DOUBLE_ENTRY_SALT').update(signaturePayload).digest('hex');

    const entry: DoubleEntryTransaction = {
      id,
      transactionId: params.transactionId,
      razorpayOrderId: params.razorpayOrderId,
      timestamp,
      description: params.description,
      idempotencyKey: idempKey,
      lines,
      balanced,
      hmacSignature,
    };

    this.journal.unshift(entry);
    return entry;
  }

  public static getJournal(): DoubleEntryTransaction[] {
    return this.journal;
  }

  public static getBalances(): Record<string, number> {
    return { ...this.balances };
  }
}
