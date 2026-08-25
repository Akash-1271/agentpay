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

export const TransactionsPage: React.FC<TransactionsPageProps> = () => {
  const [filter, setFilter] = useState<'ALL' | 'COMPLETED' | 'STEP_UP_REQUIRED' | 'BLOCKED'>('ALL');
  const [search, setSearch] = useState('');
  const [selectedTx, setSelectedTx] = useState<DisplayTransaction | null>(null);
  const [trackingOutcome, setTrackingOutcome] = useState<AgentTransactionOutcome | null>(null);

  const filtered = DEFAULT_TRANSACTIONS.filter((t) => {
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
    <div className="space-y-10 animate-in max-w-5xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#1A1A1A]/12 pb-6">
        <div>
          <div className="luxury-eyebrow mb-2">
            Cryptographic Enclave Proofs
          </div>
          <div className="flex items-center space-x-3">
            <h1 className="font-serif text-3xl sm:text-4xl text-[#1A1A1A] tracking-tight">
              History & Audit Ledger
            </h1>
            <RazorpayLogo variant="badge" height={16} />
          </div>
          <p className="text-xs sm:text-sm text-[#6C6863] mt-1.5 font-sans leading-relaxed">
            Review all autonomous orders, cryptographic enclave hashes, and Razorpay payment proofs.
          </p>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex space-x-2 text-xs border-b border-[#1A1A1A]/15 pb-1">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3.5 py-1.5 font-sans text-xs uppercase tracking-[0.15em] transition-all border-b-2 ${
              filter === 'ALL'
                ? 'border-b-[#1A1A1A] text-[#1A1A1A] font-bold'
                : 'border-b-transparent text-[#6C6863] hover:text-[#1A1A1A]'
            }`}
          >
            All Ledger
          </button>
          <button
            onClick={() => setFilter('COMPLETED')}
            className={`px-3.5 py-1.5 font-sans text-xs uppercase tracking-[0.15em] transition-all border-b-2 ${
              filter === 'COMPLETED'
                ? 'border-b-emerald-700 text-emerald-800 font-bold'
                : 'border-b-transparent text-[#6C6863] hover:text-[#1A1A1A]'
            }`}
          >
            Settled
          </button>
          <button
            onClick={() => setFilter('STEP_UP_REQUIRED')}
            className={`px-3.5 py-1.5 font-sans text-xs uppercase tracking-[0.15em] transition-all border-b-2 ${
              filter === 'STEP_UP_REQUIRED'
                ? 'border-b-amber-700 text-amber-800 font-bold'
                : 'border-b-transparent text-[#6C6863] hover:text-[#1A1A1A]'
            }`}
          >
            Review Gated
          </button>
          <button
            onClick={() => setFilter('BLOCKED')}
            className={`px-3.5 py-1.5 font-sans text-xs uppercase tracking-[0.15em] transition-all border-b-2 ${
              filter === 'BLOCKED'
                ? 'border-b-rose-700 text-rose-800 font-bold'
                : 'border-b-transparent text-[#6C6863] hover:text-[#1A1A1A]'
            }`}
          >
            Blocked
          </button>
        </div>

        <div className="luxury-input-wrapper w-full sm:w-64">
          <Search className="w-4 h-4 text-[#D4AF37] shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search transactions..."
            className="luxury-input text-xs"
          />
        </div>
      </div>

      {/* Purchases Ledger with Editorial Top-Border Style */}
      <div className="luxury-card p-0 overflow-hidden">
        <div className="divide-y divide-[#1A1A1A]/10">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedTx(item)}
              className="p-5 flex items-center justify-between gap-4 hover:bg-[#FAF8F5] cursor-pointer transition-colors duration-300"
            >
              <div className="flex items-center space-x-4">
                <div className="w-9 h-9 flex items-center justify-center border border-[#1A1A1A]/15 bg-[#FAF8F5] text-[#1A1A1A] shrink-0">
                  <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <div>
                  <div className="font-serif text-sm font-bold text-[#1A1A1A]">
                    {item.productName}
                  </div>
                  <div className="text-xs text-[#6C6863] font-sans mt-0.5">
                    {item.merchantName} · {new Date(item.timestamp).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="font-serif text-base font-bold text-[#1A1A1A]">
                    ₹{item.amount.toLocaleString()}
                  </div>
                </div>

                {item.status === 'COMPLETED' && (
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 border border-emerald-600/30 text-emerald-800 bg-emerald-50 text-[10px] font-sans uppercase tracking-[0.15em] font-semibold flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>PAID</span>
                    </span>

                    <button
                      onClick={(e) => handleTrackDelivery(e, item)}
                      className="luxury-btn-secondary text-[10px] py-1 px-3 h-8 flex items-center space-x-1"
                      title="Track Order Delivery"
                    >
                      <Truck className="w-3 h-3 text-[#D4AF37]" />
                      <span className="hidden sm:inline">Track</span>
                    </button>
                  </div>
                )}

                {item.status === 'STEP_UP_REQUIRED' && (
                  <span className="px-3 py-1 border border-amber-600/30 text-amber-800 bg-amber-50 text-[10px] font-sans uppercase tracking-[0.15em] font-semibold flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>GATED</span>
                  </span>
                )}

                {item.status === 'BLOCKED' && (
                  <span className="px-3 py-1 border border-rose-600/30 text-rose-800 bg-rose-50 text-[10px] font-sans uppercase tracking-[0.15em] font-semibold flex items-center space-x-1">
                    <XCircle className="w-3 h-3" />
                    <span>BLOCKED</span>
                  </span>
                )}

                <ChevronRight className="w-4 h-4 text-[#1A1A1A]/40" />
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
