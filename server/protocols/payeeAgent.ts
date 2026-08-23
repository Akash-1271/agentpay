import crypto from 'crypto';
import { RazorpayEngine } from '../razorpay/client.js';
import { BoundedSpendingEnclave } from './guardEnclave.js';

export interface A2APaymentRequest {
  requestId: string;
  payerAgentId: string;
  payeeAgentId: string;
  serviceRequested: string;
  amount: number;
  currency: string;
  voucherToken: string;
  timestamp: string;
  status: 'PENDING' | 'SETTLED' | 'REJECTED';
  razorpayOrderId?: string;
  receiptSignature?: string;
}

export class A2APayeeProtocolEngine {
  private static requests: A2APaymentRequest[] = [];
  public static readonly PAYEE_AGENT_ID = 'agent_payee_concierge_node_01';

  public static async receivePaymentRequest(params: {
    payerAgentId: string;
    serviceRequested: string;
    amount: number;
    currency?: string;
    voucherToken?: string;
  }): Promise<A2APaymentRequest> {
    const requestId = `a2a_req_${crypto.randomBytes(6).toString('hex')}`;
    const timestamp = new Date().toISOString();
    const currency = params.currency || 'INR';

    // 1. Create Razorpay Test Order for Payee Settlement
    const razorpayOrder = await RazorpayEngine.createOrder({
      amountInRupees: params.amount,
      receipt: `rcpt_${requestId}`,
      notes: {
        protocol: 'A2A-Payee-Protocol-x402',
        payerAgent: params.payerAgentId,
        payeeAgent: this.PAYEE_AGENT_ID,
        service: params.serviceRequested,
      },
    });

    const receiptSignature = crypto
      .createHmac('sha256', 'A2A_PAYEE_PROTOCOL_SECRET')
      .update(`${requestId}:${params.amount}:${razorpayOrder.id}`)
      .digest('hex');

    const request: A2APaymentRequest = {
      requestId,
      payerAgentId: params.payerAgentId,
      payeeAgentId: this.PAYEE_AGENT_ID,
      serviceRequested: params.serviceRequested,
      amount: params.amount,
      currency,
      voucherToken: params.voucherToken || `vch_${crypto.randomBytes(8).toString('hex')}`,
      timestamp,
      status: 'SETTLED',
      razorpayOrderId: razorpayOrder.id,
      receiptSignature,
    };

    this.requests.unshift(request);
    return request;
  }

  public static getA2ARequests(): A2APaymentRequest[] {
    return this.requests;
  }
}
