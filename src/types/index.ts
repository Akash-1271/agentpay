export interface ProductItem {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  currency: string;
  stock: number;
  rating: number;
  merchantId: string;
  merchantName: string;
  tags: string[];
  specifications: Record<string, string>;
  bundleDeals: Array<{
    addonId: string;
    addonName: string;
    addonPrice: number;
    bundleDiscountPct: number;
  }>;
}

export interface DynamicBundleOffer {
  addonId: string;
  addonName: string;
  originalPrice: number;
  discountedPrice: number;
  discountPct: number;
  upsellPitch: string;
}

export interface AP2DelegationMandate {
  mandateId: string;
  principalUser: string;
  authorizedAgent: string;
  maxPerTransaction: number;
  dailyCeiling: number;
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

export interface AgentReasoningStep {
  step: number;
  agent: 'BuyerAgent' | 'MerchantAgent' | 'SpendingEnclave' | 'RazorpayGateway';
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
  policyResult?: {
    allowed: boolean;
    requiresStepUp: boolean;
    reason: string;
    policyCode: string;
    enclaveHash: string;
  };
  razorpayOrder?: {
    id: string;
    amount: number;
    currency: string;
    receipt: string;
    status: string;
    created_at: number;
    notes?: Record<string, string>;
  };
  upiQr?: {
    upiUri: string;
    qrDataUrl: string;
  };
  upsellOffers?: DynamicBundleOffer[];
  stepUpApprovalId?: string;
  alternativeProduct?: ProductItem;
  receipt?: {
    receiptId: string;
    paymentId?: string;
    totalPaid: number;
    currency: string;
    paidAt: string;
    auditEnclaveHash: string;
  };
  fulfillment?: {
    orderId: string;
    razorpayOrderId: string;
    razorpayPaymentId?: string;
    merchantName: string;
    merchantId?: string;
    customerName: string;
    deliveryAddress: string;
    courierPartner: string;
    trackingNumber: string;
    estimatedDelivery: string;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
      asinOrSku?: string;
    }>;
    totalAmount: number;
    taxInvoiceId?: string;
  };
}

export interface AuditRecord {
  id: string;
  timestamp: string;
  agentId: string;
  principalUser: string;
  action: string;
  amount?: number;
  currency: string;
  details: Record<string, any>;
  reasoning: string;
  signature: string;
}
