import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ChevronRight,
  ShoppingBag,
} from 'lucide-react';
import { DisplayTransaction, TransactionDetailModal } from './TransactionDetailModal';
import { AuditRecord } from '../types';

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

  return (
    <div className="space-y-8 animate-in fade-in duration-200 max-w-5xl">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white">Purchase History</h1>
        <p className="text-sm text-slate-400 mt-1">
          Review all orders, payments, and approvals.
        </p>
      </div>

      {/* Filters & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex space-x-2 text-xs">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              filter === 'ALL'
                ? 'bg-[#0c83ff] text-white'
                : 'bg-[#090d16] text-slate-400 hover:text-white border border-white/[0.06]'
            }`}
          >
            All Purchases
          </button>
          <button
            onClick={() => setFilter('COMPLETED')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              filter === 'COMPLETED'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-[#090d16] text-slate-400 hover:text-white border border-white/[0.06]'
            }`}
          >
            Paid
          </button>
          <button
            onClick={() => setFilter('STEP_UP_REQUIRED')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              filter === 'STEP_UP_REQUIRED'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'bg-[#090d16] text-slate-400 hover:text-white border border-white/[0.06]'
            }`}
          >
            Needs Approval
          </button>
          <button
            onClick={() => setFilter('BLOCKED')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              filter === 'BLOCKED'
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                : 'bg-[#090d16] text-slate-400 hover:text-white border border-white/[0.06]'
            }`}
          >
            Blocked
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search items or stores..."
            className="w-full pl-9 pr-3 py-2 bg-[#090d16] border border-white/[0.08] rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#0c83ff]"
          />
        </div>
      </div>

      {/* Purchases List */}
      <div className="fintech-card overflow-hidden">
        <div className="divide-y divide-white/[0.05]">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedTx(item)}
              className="p-4 flex items-center justify-between gap-4 hover:bg-white/[0.02] cursor-pointer transition-colors"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#090d16] border border-white/[0.06] flex items-center justify-center text-slate-400 flex-shrink-0">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{item.productName}</div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {item.merchantName} · {new Date(item.timestamp).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm font-bold text-white font-mono">
                    ₹{item.amount.toLocaleString()}
                  </div>
                </div>

                {item.status === 'COMPLETED' && (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 font-bold text-xs flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Paid</span>
                  </span>
                )}

                {item.status === 'STEP_UP_REQUIRED' && (
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-400 font-bold text-xs flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>Needs approval</span>
                  </span>
                )}

                {item.status === 'BLOCKED' && (
                  <span className="px-2.5 py-1 rounded-full bg-rose-500/15 text-rose-400 font-bold text-xs flex items-center space-x-1">
                    <XCircle className="w-3 h-3" />
                    <span>Blocked</span>
                  </span>
                )}

                <ChevronRight className="w-4 h-4 text-slate-600" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedTx && (
        <TransactionDetailModal
          tx={selectedTx}
          onClose={() => setSelectedTx(null)}
        />
      )}

    </div>
  );
};
