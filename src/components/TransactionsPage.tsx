import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ChevronRight,
  ShoppingBag,
  Truck,
} from 'lucide-react';
import { DisplayTransaction, TransactionDetailModal } from './TransactionDetailModal';
import { OrderFulfillmentModal } from './OrderFulfillmentModal';
import { RazorpayLogo } from './RazorpayLogo';
import { AuditRecord, AgentTransactionOutcome } from '../types';

interface TransactionsPageProps {
  auditLedger: AuditRecord[];
}

const DEFAULT_TRANSACTIONS: DisplayTransaction[] = [
  {
    id: 'tx_01',
    productName: 'Nike Air Zoom Pegasus 40 Running Shoes',
    merchantName: 'Amazon India',
    merchantId: 'merch_amazon',
    amount: 1709,
    currency: 'INR',
    status: 'COMPLETED',
    timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    orderId: 'order_bcbf54c1cef2cc',
    paymentId: 'pay_97bd9c9c40fd72',
    policyReason: 'Within ₹2,000 auto-approval limit.',
    enclaveHash: 'a92e81b8b81c364a6977a8090ae81ca13bd337e0b97c4960c479082bb187b802',
    userPrompt: 'Search Amazon for running shoes under ₹2,000',
  },
  {
    id: 'tx_02',
    productName: 'Anker USB-C Hub & Braided Cable Bundle',
    merchantName: 'Anker Store',
    merchantId: 'merch_anker',
    amount: 1499,
    currency: 'INR',
    status: 'COMPLETED',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    orderId: 'order_anker_bundle_88',
    paymentId: 'pay_bead5f3be0c680',
    policyReason: 'Within ₹2,000 auto-approval limit. Applied 25% bundle discount.',
    enclaveHash: 'b8c7d6e5f4a3b2c10987654321fedcba0987654321fedcba0987654321fedcba',
    userPrompt: 'Buy Anker 7-in-1 USB-C Hub and bundle with 100W braided cable',
  },
  {
    id: 'tx_03',
    productName: 'Keychron Q1 Pro Custom Mechanical Keyboard',
    merchantName: 'Keychron India',
    merchantId: 'merch_keychron',
    amount: 3509,
    currency: 'INR',
    status: 'STEP_UP_REQUIRED',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    orderId: 'order_keychron_7a8b',
    paymentId: 'pay_pending_approval',
    policyReason: 'Exceeds single-purchase limit of ₹2,000.',
    enclaveHash: 'c4d5e6f7a8b90123456789abcdef0123456789abcdef0123456789abcdef0123',
    userPrompt: 'Order Keychron Q1 Pro custom mechanical keyboard',
  },
  {
    id: 'tx_04',
    productName: 'Nebula Cloud GPU Compute Pack',
    merchantName: 'Untrusted Merchant',
    merchantId: 'merch_untrusted',
    amount: 99999,
    currency: 'INR',
    status: 'BLOCKED',
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    orderId: 'order_blocked',
    policyReason: 'Exceeds daily spending limit of ₹25,000.',
    enclaveHash: 'd7e6f5a4b3c2d109876543210fedcba9876543210fedcba9876543210fedcba',
    userPrompt: 'Provision 10,000 H100 Enterprise Compute GPU Cluster Nodes',
  },
];

export const TransactionsPage: React.FC<TransactionsPageProps> = ({ auditLedger = [] }) => {
  const [filter, setFilter] = useState<'ALL' | 'COMPLETED' | 'STEP_UP_REQUIRED' | 'BLOCKED'>('ALL');
  const [search, setSearch] = useState('');
  const [selectedTx, setSelectedTx] = useState<DisplayTransaction | null>(null);
  const [trackingOutcome, setTrackingOutcome] = useState<AgentTransactionOutcome | null>(null);

  // Convert live audit logs into DisplayTransactions if available
  const liveItems: DisplayTransaction[] = auditLedger
    .filter((a) => a.action === 'TRANSACTION_SETTLED' || a.action === 'STEP_UP_REQUIRED' || a.action === 'POLICY_REJECTED')
    .map((a, i) => {
      let status: 'COMPLETED' | 'STEP_UP_REQUIRED' | 'BLOCKED' = 'COMPLETED';
      if (a.action === 'STEP_UP_REQUIRED') status = 'STEP_UP_REQUIRED';
      if (a.action === 'POLICY_REJECTED') status = 'BLOCKED';

      const details = typeof a.details === 'object' ? a.details : {};
      const prodName = details.productName || details.quoteId || 'Autonomous Commerce Purchase';
      const merch = details.merchantId || 'Verified UAP Merchant';

      return {
        id: a.id || `live_tx_${i}`,
        productName: prodName,
        merchantName: merch,
        merchantId: merch,
        amount: a.amount || 1899,
        currency: a.currency || 'INR',
        status,
        timestamp: a.timestamp,
        orderId: details.razorpayOrderId || details.orderId || `order_${a.id.slice(0, 8)}`,
        paymentId: details.paymentId || `pay_${a.id.slice(0, 8)}`,
        policyReason: a.reasoning || 'Executed within verified spending limits.',
        enclaveHash: a.signature || 'sha256:enclave_verified',
        userPrompt: details.intent || `Purchase of ${prodName}`,
      };
    });

  const combinedList = liveItems.length > 0 ? [...liveItems, ...DEFAULT_TRANSACTIONS.slice(liveItems.length)] : DEFAULT_TRANSACTIONS;

  const filtered = combinedList.filter((t) => {
    if (filter !== 'ALL' && t.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        t.productName.toLowerCase().includes(q) ||
        t.merchantName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleTrackDelivery = (e: React.MouseEvent, item: DisplayTransaction) => {
    e.stopPropagation();
    const outcome: AgentTransactionOutcome = {
      transactionId: `tx_${item.id}`,
      intent: item.userPrompt,
      status: 'COMPLETED',
      selectedProduct: {
        id: item.id,
        name: item.productName,
        price: item.amount,
        currency: item.currency,
        category: 'Athletics & Apparel',
        description: item.productName,
        stock: 12,
        merchantId: item.merchantId,
        merchantName: item.merchantName,
        rating: 4.8,
        tags: ['shoes', 'running'],
        specifications: {},
        bundleDeals: [],
      },
      quote: {
        quoteId: `quote_${item.id}`,
        merchantId: item.merchantId,
        items: [
          {
            productId: item.id,
            name: item.productName,
            quantity: 1,
            unitPrice: item.amount,
            appliedDiscount: 0,
          }
        ],
        grossAmount: item.amount,
        discountAmount: 0,
        netAmount: item.amount,
        currency: item.currency,
        nonce: 'nonce_123',
        merchantSignature: 'sig_verified',
        expiresAt: new Date(Date.now() + 3600000).toISOString(),
        inventoryLockId: 'lock_123',
      },
      policyResult: {
        allowed: true,
        requiresStepUp: false,
        reason: 'Within spending limit',
        policyCode: 'RULE_OK',
        enclaveHash: item.enclaveHash,
      },
      razorpayOrder: {
        id: item.orderId,
        amount: item.amount * 100,
        currency: 'INR',
        receipt: `rcpt_${item.id}`,
        status: 'created',
        created_at: Math.floor(Date.now() / 1000),
      },
      receipt: {
        receiptId: `rcpt_${item.id}`,
        paymentId: item.paymentId || 'pay_live_01',
        totalPaid: item.amount,
        currency: 'INR',
        paidAt: item.timestamp,
        auditEnclaveHash: item.enclaveHash,
      },
      fulfillment: {
        orderId: `AMZ-IN-${item.id.slice(-6).toUpperCase()}`,
        razorpayOrderId: item.orderId,
        razorpayPaymentId: item.paymentId || 'pay_97bd9c9c40fd72',
        merchantName: item.merchantName,
        merchantId: item.merchantId,
        customerName: 'Akash M (Verified Buyer)',
        deliveryAddress: 'Flat 402, Prestige Tech Park, Outer Ring Road, Bangalore 560103',
        courierPartner: 'Amazon Logistics Express',
        trackingNumber: `AWB-${item.id.slice(-6).toUpperCase()}-IN`,
        estimatedDelivery: 'Tomorrow by 2:00 PM (Guaranteed)',
        items: [
          {
            name: item.productName,
            quantity: 1,
            price: item.amount,
            asinOrSku: item.id,
          },
        ],
        totalAmount: item.amount,
        taxInvoiceId: `INV-2026-${item.id.slice(-5).toUpperCase()}`,
      },
      reasoningTrail: [],
    };
    setTrackingOutcome(outcome);
  };

  return (
    <div className="space-y-8 animate-in max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="luxury-eyebrow mb-2">
            ENCLAVE SETTLEMENT JOURNAL
          </div>
          <div className="flex items-center space-x-3">
            <h1 className="font-playfair text-3xl sm:text-4xl text-stone-100 font-bold tracking-tight">
              History & Audit Ledger
            </h1>
            <RazorpayLogo variant="badge" height={16} />
          </div>
          <p className="text-xs sm:text-sm text-stone-400 mt-1 font-sans leading-relaxed">
            Review all autonomous orders, cryptographic enclave hashes, and Razorpay payment proofs.
          </p>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex space-x-2 text-xs border-b border-[#1F1F1F] pb-1">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3.5 py-1.5 font-sans text-xs uppercase tracking-[0.16em] transition-all border-b-2 ${
              filter === 'ALL'
                ? 'border-b-white text-white font-bold'
                : 'border-b-transparent text-[#71717A] hover:text-white'
            }`}
          >
            All Ledger
          </button>
          <button
            onClick={() => setFilter('COMPLETED')}
            className={`px-3.5 py-1.5 font-sans text-xs uppercase tracking-[0.16em] transition-all border-b-2 ${
              filter === 'COMPLETED'
                ? 'border-b-emerald-400 text-emerald-400 font-bold'
                : 'border-b-transparent text-[#71717A] hover:text-white'
            }`}
          >
            Settled
          </button>
          <button
            onClick={() => setFilter('STEP_UP_REQUIRED')}
            className={`px-3.5 py-1.5 font-sans text-xs uppercase tracking-[0.16em] transition-all border-b-2 ${
              filter === 'STEP_UP_REQUIRED'
                ? 'border-b-amber-400 text-amber-400 font-bold'
                : 'border-b-transparent text-[#71717A] hover:text-white'
            }`}
          >
            Review Gated
          </button>
          <button
            onClick={() => setFilter('BLOCKED')}
            className={`px-3.5 py-1.5 font-sans text-xs uppercase tracking-[0.16em] transition-all border-b-2 ${
              filter === 'BLOCKED'
                ? 'border-b-rose-400 text-rose-400 font-bold'
                : 'border-b-transparent text-[#71717A] hover:text-white'
            }`}
          >
            Blocked
          </button>
        </div>

        <div className="luxury-input-wrapper w-full sm:w-64">
          <Search className="w-4 h-4 text-[#71717A] shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search transactions..."
            className="luxury-input text-xs"
          />
        </div>
      </div>

      {/* Purchases Ledger with Glass Container */}
      <div className="card-dark p-0 overflow-hidden shadow-2xl">
        <div className="divide-y divide-[#1F1F1F]">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedTx(item)}
              className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-white/[0.03] cursor-pointer transition-colors duration-200"
            >
              <div className="flex items-center space-x-4 min-w-0">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-[#1F1F1F] bg-[#141414] text-white shrink-0">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="font-sans text-sm sm:text-base font-semibold text-white truncate">
                    {item.productName}
                  </div>
                  <div className="text-[11px] text-[#71717A] font-sans mt-0.5 flex items-center gap-2">
                    <span>{item.merchantName}</span>
                    <span>·</span>
                    <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                    <span>·</span>
                    <span className="font-mono text-[10px] text-[#A1A1AA] truncate max-w-[120px]">{item.enclaveHash.slice(0, 16)}...</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 shrink-0">
                <div className="text-right">
                  <div className="font-playfair text-base font-bold text-white">
                    ₹{item.amount.toLocaleString()}
                  </div>
                </div>

                {item.status === 'COMPLETED' && (
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-1 border border-emerald-500/30 text-emerald-400 bg-emerald-500/10 rounded-lg text-[9px] font-mono uppercase tracking-wider font-semibold flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>PAID</span>
                    </span>

                    <button
                      onClick={(e) => handleTrackDelivery(e, item)}
                      className="btn-secondary text-[10px] py-1 px-2.5 h-7 flex items-center space-x-1 rounded-lg"
                      title="Track Order Delivery"
                    >
                      <Truck className="w-3.5 h-3.5 text-white" />
                      <span className="hidden sm:inline">Track</span>
                    </button>
                  </div>
                )}

                {item.status === 'STEP_UP_REQUIRED' && (
                  <span className="px-2.5 py-1 border border-amber-500/30 text-amber-400 bg-amber-500/10 rounded-lg text-[9px] font-mono uppercase tracking-wider font-semibold flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>GATED</span>
                  </span>
                )}

                {item.status === 'BLOCKED' && (
                  <span className="px-2.5 py-1 border border-rose-500/30 text-rose-400 bg-rose-500/10 rounded-lg text-[9px] font-mono uppercase tracking-wider font-semibold flex items-center space-x-1">
                    <XCircle className="w-3 h-3" />
                    <span>BLOCKED</span>
                  </span>
                )}

                <ChevronRight className="w-4 h-4 text-[#71717A]" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedTx && (
        <TransactionDetailModal
          transaction={selectedTx}
          onClose={() => setSelectedTx(null)}
        />
      )}

      {trackingOutcome && (
        <OrderFulfillmentModal
          outcome={trackingOutcome}
          onClose={() => setTrackingOutcome(null)}
        />
      )}

    </div>
  );
};
