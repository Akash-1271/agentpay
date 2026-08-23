import crypto from 'crypto';
import { AP2DelegationMandate, AP2SignedQuote } from './ap2.js';
import { CONFIG } from '../config.js';

export interface PolicyValidationResult {
  allowed: boolean;
  requiresStepUp: boolean;
  reason: string;
  policyCode: 'AUTO_APPROVED' | 'REQUIRES_STEP_UP' | 'CEILING_EXCEEDED' | 'MERCHANT_BLOCKED' | 'CATEGORY_DISALLOWED' | 'INVALID_QUOTE_SIGNATURE';
  enclaveHash: string;
}

export interface AuditRecord {
  id: string;
  timestamp: string;
  agentId: string;
  principalUser: string;
  action: 'CATALOG_DISCOVERY' | 'QUOTE_NEGOTIATION' | 'POLICY_EVALUATION' | 'STEP_UP_REQUESTED' | 'STEP_UP_APPROVED' | 'RAZORPAY_ORDER_CREATED' | 'PAYMENT_CAPTURED' | 'EXECUTION_REJECTED' | 'FAILURE_HANDLED';
  amount?: number;
  currency: string;
  details: Record<string, any>;
  reasoning: string;
  signature: string;
}

export class BoundedSpendingEnclave {
  private static activeMandate: AP2DelegationMandate = {
    mandateId: 'ap2_man_default_guard',
    principalUser: 'user_akash_ai_shopper',
    authorizedAgent: 'agent_buyer_concierge',
    maxPerTransaction: 2000,
    dailyCeiling: 25000,
    currency: 'INR',
    allowedMerchantCategories: [
      'Athletics & Apparel',
      'Electronics & Peripherals',
      'Audio',
      'Cloud & AI Infrastructure',
      'Wearables & Health'
    ],
    whitelistedMerchants: [
      'merch_nike_india',
      'merch_adidas_store',
      'merch_apex_gear',
      'merch_amazon',
      'merch_razorpay_store',
      'merch_nebulacloud',
      'merch_biowear'
    ],
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    requiresStepUpAbove: 2000,
    cryptographicSignature: 'sig_enclave_verified_09a8f'
  };

  private static dailySpentAccumulator = 1250; // Initialized to ₹1,250
  private static auditLedger: AuditRecord[] = [];
  private static pendingApprovals: Map<string, { quote: AP2SignedQuote; createdAt: number; callbackData: any }> = new Map();

  public static resetSpend() {
    this.dailySpentAccumulator = 1250;
  }

  public static getMandate(): AP2DelegationMandate {
    return { ...this.activeMandate };
  }

  public static updateMandate(newLimits: Partial<AP2DelegationMandate>): AP2DelegationMandate {
    this.activeMandate = {
      ...this.activeMandate,
      ...newLimits,
    };
    this.recordAudit({
      agentId: 'system_enclave_admin',
      principalUser: this.activeMandate.principalUser,
      action: 'POLICY_EVALUATION',
      currency: this.activeMandate.currency,
      details: { updatedMandate: this.activeMandate },
      reasoning: 'Principal updated spending policy guardrails in real-time enclave.'
    });
    return this.activeMandate;
  }

  public static getDailySpent(): number {
    return this.dailySpentAccumulator;
  }

  public static evaluateQuote(quote: AP2SignedQuote, category: string): PolicyValidationResult {
    const hashPayload = `${quote.quoteId}:${quote.netAmount}:${this.dailySpentAccumulator}:${Date.now()}`;
    const enclaveHash = crypto.createHmac('sha256', CONFIG.ENCLAVE_SECRET_SALT).update(hashPayload).digest('hex');

    // 1. Check merchant whitelist
    if (!this.activeMandate.whitelistedMerchants.includes(quote.merchantId)) {
      return {
        allowed: false,
        requiresStepUp: false,
        reason: `Merchant '${quote.merchantId}' is not in the principal's authorized whitelist.`,
        policyCode: 'MERCHANT_BLOCKED',
        enclaveHash
      };
    }

    // 2. Check category
    if (category && !this.activeMandate.allowedMerchantCategories.includes(category)) {
      return {
        allowed: false,
        requiresStepUp: false,
        reason: `Category '${category}' is outside the authorized scope.`,
        policyCode: 'CATEGORY_DISALLOWED',
        enclaveHash
      };
    }

    // 3. Check Daily Ceiling
    if (this.dailySpentAccumulator + quote.netAmount > this.activeMandate.dailyCeiling) {
      return {
        allowed: false,
        requiresStepUp: false,
        reason: `Transaction amount (₹${quote.netAmount}) exceeds daily spending ceiling (Current: ₹${this.dailySpentAccumulator} / Max: ₹${this.activeMandate.dailyCeiling}).`,
        policyCode: 'CEILING_EXCEEDED',
        enclaveHash
      };
    }

    // 4. Check Step-Up Threshold
    if (quote.netAmount > this.activeMandate.requiresStepUpAbove) {
      return {
        allowed: true,
        requiresStepUp: true,
        reason: `Amount (₹${quote.netAmount}) exceeds single-tx auto-approval limit of ₹${this.activeMandate.requiresStepUpAbove}. Human Step-Up signature required.`,
        policyCode: 'REQUIRES_STEP_UP',
        enclaveHash
      };
    }

    // 5. Auto Approved within bounds
    return {
      allowed: true,
      requiresStepUp: false,
      reason: `Transaction (₹${quote.netAmount}) is within bounded enclave auto-authorization limits (<= ₹${this.activeMandate.requiresStepUpAbove}).`,
      policyCode: 'AUTO_APPROVED',
      enclaveHash
    };
  }

  public static recordAudit(data: Omit<AuditRecord, 'id' | 'timestamp' | 'signature'>): AuditRecord {
    const id = `aud_${crypto.randomBytes(6).toString('hex')}`;
    const timestamp = new Date().toISOString();
    const payload = `${id}:${timestamp}:${data.agentId}:${data.action}:${data.amount || 0}`;
    const signature = crypto.createHmac('sha256', CONFIG.ENCLAVE_SECRET_SALT).update(payload).digest('hex');

    const record: AuditRecord = {
      id,
      timestamp,
      signature,
      ...data
    };

    this.auditLedger.unshift(record);
    if (this.auditLedger.length > 200) {
      this.auditLedger.pop();
    }
    return record;
  }

  public static commitSpend(amount: number) {
    this.dailySpentAccumulator += amount;
  }

  public static getAuditLedger(): AuditRecord[] {
    return this.auditLedger;
  }

  public static registerPendingApproval(approvalId: string, quote: AP2SignedQuote, callbackData: any) {
    this.pendingApprovals.set(approvalId, { quote, createdAt: Date.now(), callbackData });
  }

  public static resolvePendingApproval(approvalId: string): { quote: AP2SignedQuote; callbackData: any } | null {
    const found = this.pendingApprovals.get(approvalId);
    if (found) {
      this.pendingApprovals.delete(approvalId);
      return found;
    }
    return null;
  }

  public static listPendingApprovals() {
    const list: any[] = [];
    this.pendingApprovals.forEach((val, key) => {
      list.push({ approvalId: key, quote: val.quote, createdAt: val.createdAt, callbackData: val.callbackData });
    });
    return list;
  }
}
