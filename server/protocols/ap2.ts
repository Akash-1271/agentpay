import crypto from 'crypto';
import { CONFIG } from '../config.js';

export interface AP2DelegationMandate {
  mandateId: string;
  principalUser: string;
  authorizedAgent: string;
  maxPerTransaction: number; // e.g. 2000 INR
  dailyCeiling: number;      // e.g. 10000 INR
  currency: string;
  allowedMerchantCategories: string[];
  whitelistedMerchants: string[];
  validUntil: string;
  requiresStepUpAbove: number;
  cryptographicSignature: string;
}

export interface AP2SignedQuote {
  quoteId: string;
  merchantId: string;
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    unitPrice: number;
    appliedDiscount: number;
  }>;
  grossAmount: number;
  discountAmount: number;
  netAmount: number;
  currency: string;
  nonce: string;
  expiresAt: string;
  inventoryLockId: string;
  merchantSignature: string;
}

export interface AP2TransactionReceipt {
  transactionId: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  quoteId: string;
  amount: number;
  currency: string;
  status: 'SETTLED' | 'PENDING_APPROVAL' | 'REJECTED' | 'FAILED_RETRYING';
  enclaveVerificationHash: string;
  timestamp: string;
  reasoningSteps: string[];
}

export class AP2ProtocolEngine {
  public static generateMandate(
    principalUser: string,
    authorizedAgent: string,
    options: Partial<AP2DelegationMandate> = {}
  ): AP2DelegationMandate {
    const mandateId = `ap2_man_${crypto.randomBytes(6).toString('hex')}`;
    const validUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    
    const mandate: AP2DelegationMandate = {
      mandateId,
      principalUser,
      authorizedAgent,
      maxPerTransaction: options.maxPerTransaction ?? 2000,
      dailyCeiling: options.dailyCeiling ?? 15000,
      currency: options.currency ?? 'INR',
      allowedMerchantCategories: options.allowedMerchantCategories ?? [
        'Electronics & Peripherals',
        'Audio',
        'Cloud & AI Infrastructure',
        'Wearables & Health'
      ],
      whitelistedMerchants: options.whitelistedMerchants ?? ['merch_apex_gear', 'merch_nebulacloud', 'merch_biowear'],
      validUntil: options.validUntil ?? validUntil,
      requiresStepUpAbove: options.requiresStepUpAbove ?? 2000,
      cryptographicSignature: ''
    };

    const payload = `${mandate.mandateId}:${mandate.principalUser}:${mandate.maxPerTransaction}:${mandate.dailyCeiling}:${mandate.validUntil}`;
    mandate.cryptographicSignature = crypto
      .createHmac('sha256', CONFIG.ENCLAVE_SECRET_SALT)
      .update(payload)
      .digest('hex');

    return mandate;
  }

  public static signQuote(quoteData: Omit<AP2SignedQuote, 'merchantSignature' | 'nonce' | 'quoteId' | 'expiresAt'>): AP2SignedQuote {
    const quoteId = `ap2_q_${crypto.randomBytes(8).toString('hex')}`;
    const nonce = crypto.randomBytes(4).toString('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 mins TTL

    const unsignedQuote = {
      ...quoteData,
      quoteId,
      nonce,
      expiresAt,
    };

    const payload = `${unsignedQuote.quoteId}:${unsignedQuote.merchantId}:${unsignedQuote.netAmount}:${unsignedQuote.nonce}:${unsignedQuote.expiresAt}`;
    const merchantSignature = crypto
      .createHmac('sha256', CONFIG.RAZORPAY_KEY_SECRET)
      .update(payload)
      .digest('hex');

    return {
      ...unsignedQuote,
      merchantSignature,
    };
  }

  public static verifyQuoteSignature(quote: AP2SignedQuote): boolean {
    const payload = `${quote.quoteId}:${quote.merchantId}:${quote.netAmount}:${quote.nonce}:${quote.expiresAt}`;
    const expected = crypto
      .createHmac('sha256', CONFIG.RAZORPAY_KEY_SECRET)
      .update(payload)
      .digest('hex');
    return expected === quote.merchantSignature;
  }
}
