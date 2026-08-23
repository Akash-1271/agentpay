import crypto from 'crypto';
import { AP2ProtocolEngine, AP2SignedQuote } from '../protocols/ap2.js';
import { UAPCatalogEngine, ProductItem } from '../protocols/uap.js';
import { BoundedSpendingEnclave } from '../protocols/guardEnclave.js';

export interface DynamicBundleOffer {
  addonId: string;
  addonName: string;
  originalPrice: number;
  discountedPrice: number;
  discountPct: number;
  upsellPitch: string;
}

export class MerchantAgent {
  public static readonly AGENT_ID = 'agent_merchant_yield_maximizer';

  public static evaluateAndGenerateQuote(params: {
    productId: string;
    quantity?: number;
    acceptBundles?: string[];
    customDiscountCoupon?: string;
  }): {
    quote: AP2SignedQuote | null;
    upsellSuggestions: DynamicBundleOffer[];
    status: 'QUOTE_ISSUED' | 'OUT_OF_STOCK' | 'PRODUCT_NOT_FOUND';
    error?: string;
  } {
    const product = UAPCatalogEngine.getProductById(params.productId);
    const qty = params.quantity || 1;

    if (!product) {
      return {
        quote: null,
        upsellSuggestions: [],
        status: 'PRODUCT_NOT_FOUND',
        error: `Product with ID '${params.productId}' does not exist in the merchant registry.`,
      };
    }

    if (product.stock <= 0) {
      BoundedSpendingEnclave.recordAudit({
        agentId: this.AGENT_ID,
        principalUser: 'user_akash_ai_shopper',
        action: 'FAILURE_HANDLED',
        currency: 'INR',
        details: { productId: product.id, stock: product.stock },
        reasoning: `Merchant Agent detected Out-of-Stock for '${product.name}'. Graceful stockout notification triggered.`,
      });

      return {
        quote: null,
        upsellSuggestions: [],
        status: 'OUT_OF_STOCK',
        error: `Item '${product.name}' is currently out of stock (0 units remaining).`,
      };
    }

    // Build Upsell suggestions dynamically based on merchant's yield algorithm
    const upsellSuggestions: DynamicBundleOffer[] = (product.bundleDeals || []).map((deal) => {
      const discounted = Math.round(deal.addonPrice * (1 - deal.bundleDiscountPct / 100));
      return {
        addonId: deal.addonId,
        addonName: deal.addonName,
        originalPrice: deal.addonPrice,
        discountedPrice: discounted,
        discountPct: deal.bundleDiscountPct,
        upsellPitch: `Save ${deal.bundleDiscountPct}% when bundled with ${product.name}!`,
      };
    });

    // Calculate Items and Pricing
    const items = [
      {
        productId: product.id,
        name: product.name,
        quantity: qty,
        unitPrice: product.price,
        appliedDiscount: 0,
      },
    ];

    let grossAmount = product.price * qty;
    let discountAmount = 0;

    // Apply bundle addons if accepted
    if (params.acceptBundles && params.acceptBundles.length > 0) {
      params.acceptBundles.forEach((addonId) => {
        const deal = upsellSuggestions.find((d) => d.addonId === addonId);
        if (deal) {
          const discountForThis = deal.originalPrice - deal.discountedPrice;
          items.push({
            productId: deal.addonId,
            name: deal.addonName,
            quantity: 1,
            unitPrice: deal.originalPrice,
            appliedDiscount: discountForThis,
          });
          grossAmount += deal.originalPrice;
          discountAmount += discountForThis;
        }
      });
    }

    // Optional AI coupon
    if (params.customDiscountCoupon === 'AGENTIC10') {
      const extraDiscount = Math.round((grossAmount - discountAmount) * 0.1);
      discountAmount += extraDiscount;
    }

    const netAmount = Math.max(0, grossAmount - discountAmount);
    const inventoryLockId = `lock_${crypto.randomBytes(6).toString('hex')}`;

    // Cryptographically sign the quote via AP2
    const quote = AP2ProtocolEngine.signQuote({
      merchantId: product.merchantId,
      items,
      grossAmount,
      discountAmount,
      netAmount,
      currency: product.currency,
      inventoryLockId,
    });

    BoundedSpendingEnclave.recordAudit({
      agentId: this.AGENT_ID,
      principalUser: 'user_akash_ai_shopper',
      action: 'QUOTE_NEGOTIATION',
      amount: netAmount,
      currency: quote.currency,
      details: {
        quoteId: quote.quoteId,
        itemsCount: quote.items.length,
        bundleSavings: discountAmount,
        inventoryLock: inventoryLockId,
      },
      reasoning: `Merchant Agent created signed AP2 Quote for '${product.name}' with ₹${discountAmount} dynamic bundle savings.`,
    });

    return {
      quote,
      upsellSuggestions,
      status: 'QUOTE_ISSUED',
    };
  }
}
