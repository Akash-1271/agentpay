import crypto from 'crypto';
import { CONFIG } from '../config.js';
import { AP2SignedQuote } from './ap2.js';

export interface ProtocolWireFrame {
  transactionId: string;
  protocol: 'UAP/1.0' | 'AP2/2.0' | 'x402-Payment-Required';
  timestamp: string;
  clientRequest: {
    method: string;
    path: string;
    headers: Record<string, string>;
    body: Record<string, any>;
  };
  enclaveInterception: {
    status: number;
    statusText: string;
    headers: Record<string, string>;
    policyVerification: {
      enclaveHash: string;
      delegationMandateId: string;
      ruleEvaluationTimeMs: number;
    };
  };
  merchantQuoteResponse: {
    status: number;
    headers: Record<string, string>;
    signedQuote: Partial<AP2SignedQuote>;
  };
  razorpaySettlement: {
    status: number;
    headers: Record<string, string>;
    orderId: string;
    webhookSignature: string;
    settled: boolean;
  };
}

export class ProtocolWireEngine {
  public static generateWireTrace(txId: string, quote?: AP2SignedQuote | null, prompt?: string): ProtocolWireFrame {
    const timestamp = new Date().toISOString();
    const mockHash = crypto.createHmac('sha256', CONFIG.ENCLAVE_SECRET_SALT).update(txId).digest('hex');
    const orderId = `order_${txId.replace('tx_', '')}`;
    const webhookSig = crypto.createHmac('sha256', CONFIG.WEBHOOK_SECRET).update(`${orderId}|captured`).digest('hex');

    return {
      transactionId: txId,
      protocol: 'UAP/1.0',
      timestamp,
      clientRequest: {
        method: 'POST',
        path: '/api/uap/transact',
        headers: {
          'Host': 'gateway.agentpay.network',
          'Content-Type': 'application/json; charset=utf-8',
          'User-Agent': 'AgentPay-AutonomousBuyer/2.0 (NPCI-UAP Compliant)',
          'X-Agent-Protocol': 'UAP/1.0',
          'X-AP2-Mandate-ID': 'ap2_man_default_guard',
          'X-Idempotency-Key': `idemp_${txId}`,
        },
        body: {
          intent: prompt || 'Buy running shoes under ₹2,000',
          maxBudget: 2000,
          currency: 'INR',
          targetMerchantCategory: 'Athletics & Apparel',
        },
      },
      enclaveInterception: {
        status: 200,
        statusText: 'BOUNDED_POLICY_VERIFIED',
        headers: {
          'X-Enclave-Status': 'AUTHORIZED',
          'X-Enclave-Hash': mockHash,
          'X-Spending-Ceiling-Remaining': 'INR 23,291.00',
          'X-Step-Up-Required': quote && quote.netAmount > 2000 ? 'TRUE' : 'FALSE',
        },
        policyVerification: {
          enclaveHash: mockHash,
          delegationMandateId: 'ap2_man_default_guard',
          ruleEvaluationTimeMs: 14,
        },
      },
      merchantQuoteResponse: {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'X-Merchant-Signature': quote?.merchantSignature || `sig_${mockHash.slice(0, 16)}`,
          'X-AP2-Quote-TTL': '900s',
        },
        signedQuote: quote || {
          quoteId: `ap2_q_${txId.slice(-6)}`,
          merchantId: 'merch_nike_india',
          netAmount: 1899,
          currency: 'INR',
          inventoryLockId: `lock_${txId.slice(-6)}`,
        },
      },
      razorpaySettlement: {
        status: 201,
        headers: {
          'X-Razorpay-Order-ID': orderId,
          'X-Razorpay-Signature': webhookSig,
          'X-Gateway-Engine': 'Razorpay-TestMode-HighFidelity',
        },
        orderId,
        webhookSignature: webhookSig,
        settled: true,
      },
    };
  }
}
