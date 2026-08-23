import React, { useState } from 'react';
import {
  ReceiptText,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Ban,
  ArrowRight,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { DisplayTransaction, TransactionDetailModal } from './TransactionDetailModal';
import { AuditRecord } from '../types';

interface TransactionsPageProps {
  auditLedger: AuditRecord[];
}

const DEFAULT_TRANSACTIONS: DisplayTransaction[] = [
  {
    id: 'tx_pegasus_40_01',
    productName: 'Nike Air Zoom Pegasus 40 Running Shoes',
    merchantName: 'Nike India',
    merchantId: 'merch_nike_india',
    amount: 1899,
    currency: 'INR',
    status: 'COMPLETED',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    orderId: 'order_pegasus_09a8f',
    paymentId: 'pay_97bd9c9c40fd72',
    policyReason: 'Transaction (₹1,899) is within bounded enclave auto-authorization limits (<= ₹2,000).',
    enclaveHash: 'a92e81b8b81c364a6977a8090ae81ca13bd337e0b97c4960c479082bb187b802',
    userPrompt: 'Buy running shoes under ₹2,000',
  },
  {
    id: 'tx_keychron_02',
    productName: 'Keychron Q1 Pro Custom Mechanical Keyboard',
    merchantName: 'Apex Gear India',
    merchantId: 'merch_apex_gear',
    amount: 3899,
    currency: 'INR',
    status: 'STEP_UP_REQUIRED',
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    orderId: 'order_keychron_7a8b',
    paymentId: 'pay_stepup_verified',
    policyReason: 'Amount (₹3,899) exceeds single-tx auto-approval limit of ₹2,000. Human Step-Up signature required.',
    enclaveHash: 'c4d5e6f7a8b90123456789abcdef0123456789abcdef0123456789abcdef0123',
    userPrompt: 'Order Keychron Q1 Pro custom mechanical keyboard with brown switches',
  },
  {
    id: 'tx_mxmaster_03',
    productName: 'Logitech MX Master 3S Wireless Mouse',
    merchantName: 'Apex Gear India',
    merchantId: 'merch_apex_gear',
    amount: 1899,
    currency: 'INR',
    status: 'COMPLETED',
    timestamp: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
    orderId: 'order_f85487efd29375',
    paymentId: 'pay_bead5f3be0c680',
    policyReason: 'Transaction (₹1,899) is within bounded enclave auto-authorization limits (<= ₹2,000).',
    enclaveHash: 'b8c7d6e5f4a3b2c10987654321fedcba0987654321fedcba0987654321fedcba',
    userPrompt: 'Buy Logitech MX Master 3S wireless mouse',
  },
  {
    id: 'tx_h100_cluster_04',
    productName: 'NebulaGPU 1000 H100 Cloud Compute Hours Pack',
    merchantName: 'Nebula Cloud Computing',
    merchantId: 'merch_nebulacloud',
    amount: 99999,
    currency: 'INR',
    status: 'BLOCKED',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    orderId: 'order_rejected_ceiling',
    policyReason: 'Transaction amount (₹99,999) exceeds daily spending ceiling (Max: ₹15,000).',
    enclaveHash: 'd7e6f5a4b3c2d109876543210fedcba9876543210fedcba9876543210fedcba',
    userPrompt: 'Provision 10,000 H100 Enterprise Compute GPU Cluster Nodes',
  },
];

export const TransactionsPage: React.FC<TransactionsPageProps> = ({ auditLedger }) => {
  const [filter, setFilter] = useState<'ALL' | 'COMPLETED' | 'STEP_UP_REQUIRED' | 'BLOCKED'>('ALL');
  const [search, setSearch] = useState('');
  const [selectedTx, setSelectedTx] = useState<DisplayTransaction | null>(null);

  const transactions = DEFAULT_TRANSACTIONS;

  const filtered = transactions.filter((t) => {
    if (filter !== 'ALL' && t.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        t.productName.toLowerCase().includes(q) ||
        t.merchantName.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q) ||
        t.orderId.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-9 animate-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="eyebrow">Decision ledger</div>
          <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.045em] text-white sm:text-4xl">Transactions</h1>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            A clear, inspectable history of every autonomous checkout and policy decision.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product, merchant, order ID..."
            className="premium-input w-full py-3 pl-10 pr-4 text-xs sm:text-sm"
          />
        </div>

        <div className="flex space-x-1.5 overflow-x-auto rounded-xl border border-slate-400/[0.12] bg-slate-950/25 p-1">
          {(['ALL', 'COMPLETED', 'STEP_UP_REQUIRED', 'BLOCKED'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${
                filter === status
                  ? 'bg-blue-400/20 text-blue-50 shadow-[inset_0_0_0_1px_rgba(147,197,253,0.2)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {status === 'ALL' ? 'All' : status === 'STEP_UP_REQUIRED' ? 'Step-Up Gated' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="fintech-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-400/[0.12] bg-slate-950/30 font-mono text-slate-500">
              <tr>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Merchant</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Razorpay Order</th>
                <th className="py-3 px-4 text-right">Explainability</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-400/[0.08] text-slate-300">
              {filtered.map((tx) => (
                <tr
                  key={tx.id}
                  onClick={() => setSelectedTx(tx)}
                  className="cursor-pointer transition-colors hover:bg-blue-300/[0.045]"
                >
                  <td className="py-3.5 px-4 font-semibold text-white max-w-xs truncate">
                    {tx.productName}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">{tx.merchantName}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-white">
                    ₹{tx.amount.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded ${
                        tx.status === 'COMPLETED'
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : tx.status === 'STEP_UP_REQUIRED'
                          ? 'bg-amber-500/15 text-amber-400'
                          : 'bg-rose-500/15 text-rose-400'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-400 whitespace-nowrap">
                    {new Date(tx.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400 truncate max-w-[120px]">
                    {tx.orderId}
                  </td>
                  <td className="py-3.5 px-4 text-right text-[#0c83ff] font-medium">
                    <span className="inline-flex items-center space-x-1 hover:underline">
                      <span>Inspect</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Detail Modal */}
      {selectedTx && (
        <TransactionDetailModal
          transaction={selectedTx}
          onClose={() => setSelectedTx(null)}
        />
      )}

    </div>
  );
};
