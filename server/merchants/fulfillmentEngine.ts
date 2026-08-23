import crypto from 'crypto';

export interface FulfillmentOrder {
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  merchantName: string;
  merchantId: string;
  customerName: string;
  deliveryAddress: string;
  courierPartner: 'Amazon Logistics' | 'Delhivery Express' | 'BlueDart Air';
  trackingNumber: string;
  estimatedDelivery: string;
  status: 'CONFIRMED' | 'WAREHOUSE_PICKED' | 'DISPATCHED' | 'OUT_FOR_DELIVERY' | 'DELIVERED';
  timeline: Array<{
    stage: string;
    description: string;
    timestamp: string;
    completed: boolean;
  }>;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    asinOrSku: string;
  }>;
  totalAmount: number;
  taxInvoiceId: string;
  cryptoSealHash: string;
}

export class FulfillmentEngine {
  private static orders: Map<string, FulfillmentOrder> = new Map();

  public static createOrder(params: {
    razorpayOrderId: string;
    razorpayPaymentId?: string;
    merchantId: string;
    merchantName: string;
    productName: string;
    amount: number;
    asinOrSku?: string;
    customerName?: string;
    deliveryAddress?: string;
  }): FulfillmentOrder {
    const orderId = `AMZ-IN-${Math.floor(100000 + Math.random() * 900000)}`;
    const trackingNumber = `AWB-${crypto.randomBytes(4).toString('hex').toUpperCase()}-IN`;
    const taxInvoiceId = `INV-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const sealHash = crypto.createHash('sha256').update(`${orderId}:${params.razorpayOrderId}:${params.amount}`).digest('hex');

    const now = new Date();
    const order: FulfillmentOrder = {
      orderId,
      razorpayOrderId: params.razorpayOrderId,
      razorpayPaymentId: params.razorpayPaymentId || `pay_${crypto.randomBytes(6).toString('hex')}`,
      merchantName: params.merchantName,
      merchantId: params.merchantId,
      customerName: params.customerName || 'Akash M (AI Shopper)',
      deliveryAddress: params.deliveryAddress || 'Flat 402, Prestige Tech Park, Outer Ring Road, Bangalore 560103',
      courierPartner: params.merchantId.includes('amazon') ? 'Amazon Logistics' : 'Delhivery Express',
      trackingNumber,
      estimatedDelivery: 'Tomorrow, Priority Express (Guaranteed)',
      status: 'CONFIRMED',
      timeline: [
        {
          stage: 'Payment Confirmed & Verified',
          description: `Razorpay Order ${params.razorpayOrderId} settled via AgentPay Bounded Enclave.`,
          timestamp: now.toISOString(),
          completed: true,
        },
        {
          stage: 'Warehouse Picking & Inspection',
          description: `Automated inventory allocation at ${params.merchantName} Fulfillment Hub.`,
          timestamp: new Date(now.getTime() + 15 * 60000).toISOString(),
          completed: true,
        },
        {
          stage: 'Handed Over to Courier',
          description: `Dispatched via ${params.merchantId.includes('amazon') ? 'Amazon Logistics' : 'Delhivery'} (${trackingNumber}).`,
          timestamp: new Date(now.getTime() + 45 * 60000).toISOString(),
          completed: false,
        },
        {
          stage: 'Out for Delivery',
          description: 'Courier agent assigned for final mile delivery to Bangalore address.',
          timestamp: new Date(now.getTime() + 12 * 3600000).toISOString(),
          completed: false,
        },
      ],
      items: [
        {
          name: params.productName,
          quantity: 1,
          price: params.amount,
          asinOrSku: params.asinOrSku || 'SKU-IN-DEFAULT',
        },
      ],
      totalAmount: params.amount,
      taxInvoiceId,
      cryptoSealHash: sealHash,
    };

    this.orders.set(orderId, order);
    this.orders.set(params.razorpayOrderId, order);
    return order;
  }

  public static getOrder(id: string): FulfillmentOrder | undefined {
    return this.orders.get(id);
  }

  public static getAllOrders(): FulfillmentOrder[] {
    return Array.from(new Set(this.orders.values()));
  }
}
