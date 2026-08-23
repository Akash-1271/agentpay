import crypto from 'crypto';
import { UAPCatalogEngine, ProductItem } from '../protocols/uap.js';

export interface AbandonedCartRecord {
  cartId: string;
  customerName: string;
  customerPhone: string;
  item: ProductItem;
  originalPrice: number;
  discountedPrice: number;
  discountPct: number;
  paymentLink: string;
  recoveryMessage: string;
  abandonedAt: string;
  recoveredAt?: string;
  status: 'PENDING_RECOVERY' | 'RECOVERED' | 'EXPIRED';
}

export interface GrowthMetrics {
  baselineGmv: number;
  growthGmv: number;
  aovLiftPct: number; // e.g. +18.4%
  conversionRatePct: number; // e.g. 68.2%
  abandonedCartsCount: number;
  recoveredCartsCount: number;
  recoveryRatePct: number; // e.g. 42.1%
  upsellAcceptanceRatePct: number; // e.g. 34.5%
}

export class RevenueGrowthEngine {
  private static abandonedCarts: AbandonedCartRecord[] = [
    {
      cartId: 'cart_abn_01',
      customerName: 'Rohit S',
      customerPhone: '+919876543210',
      item: UAPCatalogEngine.getProductById('prod_shoe_07') || {
        id: 'prod_shoe_07',
        name: 'Nike Air Zoom Pegasus 40 Running Shoes',
        category: 'Athletics & Apparel',
        description: 'Road running shoes',
        price: 1899,
        currency: 'INR',
        stock: 12,
        rating: 4.8,
        merchantId: 'merch_nike_india',
        merchantName: 'Nike India',
        tags: ['shoes'],
        specifications: {},
        bundleDeals: []
      },
      originalPrice: 1899,
      discountedPrice: 1614,
      discountPct: 15,
      paymentLink: 'https://rzp.io/i/nike_pegasus_rec_881',
      recoveryMessage: 'Hey Rohit! We noticed you left the Nike Pegasus 40 in your cart. We held your size and applied a 15% VIP discount (₹1,614). Complete your order here: https://rzp.io/i/nike_pegasus_rec_881',
      abandonedAt: new Date(Date.now() - 35 * 60000).toISOString(),
      recoveredAt: new Date(Date.now() - 10 * 60000).toISOString(),
      status: 'RECOVERED',
    },
    {
      cartId: 'cart_abn_02',
      customerName: 'Priya K',
      customerPhone: '+919812345678',
      item: UAPCatalogEngine.getProductById('prod_key_01') || {
        id: 'prod_key_01',
        name: 'Keychron Q1 Pro Custom Keyboard',
        category: 'Electronics & Peripherals',
        description: 'Mechanical Keyboard',
        price: 3899,
        currency: 'INR',
        stock: 8,
        rating: 4.9,
        merchantId: 'merch_apex_gear',
        merchantName: 'Apex Gear',
        tags: ['keyboard'],
        specifications: {},
        bundleDeals: []
      },
      originalPrice: 3899,
      discountedPrice: 3314,
      discountPct: 15,
      paymentLink: 'https://rzp.io/i/keychron_q1_rec_912',
      recoveryMessage: 'Hi Priya! Your Keychron Q1 Pro custom keyboard is waiting at Apex Gear. Enjoy 15% off for the next 2 hours: https://rzp.io/i/keychron_q1_rec_912',
      abandonedAt: new Date(Date.now() - 15 * 60000).toISOString(),
      status: 'PENDING_RECOVERY',
    }
  ];

  public static getGrowthMetrics(): GrowthMetrics {
    return {
      baselineGmv: 142800,
      growthGmv: 169075,
      aovLiftPct: 18.4,
      conversionRatePct: 68.2,
      abandonedCartsCount: this.abandonedCarts.length,
      recoveredCartsCount: this.abandonedCarts.filter(c => c.status === 'RECOVERED').length,
      recoveryRatePct: 42.1,
      upsellAcceptanceRatePct: 34.5,
    };
  }

  public static getAbandonedCarts(): AbandonedCartRecord[] {
    return this.abandonedCarts;
  }

  public static triggerCartRecovery(cartId: string): AbandonedCartRecord {
    const cart = this.abandonedCarts.find(c => c.cartId === cartId);
    if (!cart) throw new Error('Abandoned cart not found');
    cart.status = 'RECOVERED';
    cart.recoveredAt = new Date().toISOString();
    return cart;
  }

  public static createAbandonedCart(params: {
    customerName: string;
    customerPhone: string;
    product: ProductItem;
    discountPct?: number;
  }): AbandonedCartRecord {
    const cartId = `cart_abn_${crypto.randomBytes(4).toString('hex')}`;
    const discount = params.discountPct || 15;
    const discountedPrice = Math.round(params.product.price * (1 - discount / 100));
    const linkId = crypto.randomBytes(4).toString('hex');
    const paymentLink = `https://rzp.io/i/rec_${linkId}`;
    const recoveryMessage = `Hey ${params.customerName}! We noticed you left ${params.product.name} in your cart. We held inventory and activated a special ${discount}% discount (₹${discountedPrice.toLocaleString()}). Complete checkout: ${paymentLink}`;

    const record: AbandonedCartRecord = {
      cartId,
      customerName: params.customerName,
      customerPhone: params.customerPhone,
      item: params.product,
      originalPrice: params.product.price,
      discountedPrice,
      discountPct: discount,
      paymentLink,
      recoveryMessage,
      abandonedAt: new Date().toISOString(),
      status: 'PENDING_RECOVERY',
    };

    this.abandonedCarts.unshift(record);
    return record;
  }
}
