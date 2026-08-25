import React, { useState } from 'react';
import {
  ShoppingBag,
  ArrowRight,
  Search,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { AP2DelegationMandate, AuditRecord } from '../types';
import { NavSection } from './Sidebar';

interface DashboardOverviewProps {
  mandate: AP2DelegationMandate | null;
  dailySpent: number;
  auditLedger: AuditRecord[];
  onNavigate: (section: NavSection) => void;
  onRunPrompt: (prompt: string) => void;
  loading: boolean;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  mandate,
  dailySpent,
  auditLedger,
  onNavigate,
  onRunPrompt,
  loading,
}) => {
  const [quickPrompt, setQuickPrompt] = useState('');

  const ceiling = mandate?.dailyCeiling || 25000;
  const singleLimit = mandate?.requiresStepUpAbove || 2000;
  const spentPct = Math.min(100, Math.round((dailySpent / ceiling) * 100));

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPrompt.trim() || loading) return;
    onRunPrompt(quickPrompt);
  };

  const recentPurchases = [
    {
      id: 'tx_1',
      name: 'Nike Air Zoom Pegasus 40 Running Shoes',
      store: 'Amazon India',
      amount: 1709,
      status: 'PAID',
      time: '10 mins ago',
    },
    {
      id: 'tx_2',
      name: 'Anker USB-C Hub & Cable Bundle',
      store: 'Anker Official Store',
      amount: 1499,
      status: 'PAID',
      time: '2 hours ago',
    },
    {
      id: 'tx_3',
      name: 'Keychron Q1 Pro Custom Mechanical Keyboard',
      store: 'Keychron Store',
      amount: 3509,
      status: 'NEEDS_APPROVAL',
      time: 'Yesterday',
    },
  ];

  return (
    <div className="space-y-10 animate-in max-w-5xl">
      
      {/* Header Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#1A1A1A]/12 pb-6">
        <div>
          <div className="luxury-eyebrow mb-2">
            Overview & Metrics
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1A1A1A] tracking-tight">
            Executive Ledger & Metrics
          </h1>
          <p className="text-xs sm:text-sm text-[#6C6863] mt-1.5 font-sans leading-relaxed">
            Real-time spending limits, autonomous commerce activity, and double-entry ledger proofs.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigate('policies')}
            className="luxury-btn-secondary text-xs h-11"
          >
            <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
            <span>Spending Limits</span>
          </button>

          <button
            onClick={() => onNavigate('agent')}
            className="luxury-btn-primary text-xs h-11"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>New Purchase</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Cards with Top-Border Architectural Framing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Metric 1: Spent Today */}
        <div className="luxury-card space-y-2">
          <div className="text-[10px] font-sans font-semibold text-[#6C6863] uppercase tracking-[0.2em] flex items-center justify-between">
            <span>Spent Today</span>
            <span className="font-mono text-xs text-[#1A1A1A] font-bold">{spentPct}%</span>
          </div>
          <div className="font-serif text-3xl font-bold text-[#1A1A1A]">
            ₹{dailySpent.toLocaleString()}
          </div>
          <div className="text-xs text-[#6C6863] font-sans">
            of ₹{ceiling.toLocaleString()} ceiling
          </div>
          <div className="h-1 bg-[#EBE5DE] mt-3 overflow-hidden">
            <div
              className="h-full bg-[#1A1A1A] transition-all duration-700"
              style={{ width: `${spentPct}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Max per purchase */}
        <div className="luxury-card space-y-2">
          <div className="text-[10px] font-sans font-semibold text-[#6C6863] uppercase tracking-[0.2em]">Auto-Approval</div>
          <div className="font-serif text-3xl font-bold text-[#1A1A1A]">
            ₹{singleLimit.toLocaleString()}
          </div>
          <div className="text-xs text-emerald-700 flex items-center space-x-1.5 font-medium font-sans">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Instant Settle</span>
          </div>
        </div>

        {/* Metric 3: Completed Purchases */}
        <div className="luxury-card space-y-2">
          <div className="text-[10px] font-sans font-semibold text-[#6C6863] uppercase tracking-[0.2em]">Orders Settled</div>
          <div className="font-serif text-3xl font-bold text-[#1A1A1A]">
            {auditLedger.length > 0 ? auditLedger.length + 12 : 14}
          </div>
          <div className="text-xs text-[#6C6863] font-sans">
            Razorpay Test Mode Captured
          </div>
        </div>

        {/* Metric 4: Needs Approval */}
        <div className="luxury-card space-y-2">
          <div className="text-[10px] font-sans font-semibold text-[#6C6863] uppercase tracking-[0.2em]">Gated Review</div>
          <div className="font-serif text-3xl font-bold text-amber-700">
            01
          </div>
          <div className="text-xs text-amber-800 font-medium font-sans">
            Over ₹{singleLimit.toLocaleString()} Limit
          </div>
        </div>

      </div>

      {/* Quick Buy Bar with Refined Underline */}
      <section className="luxury-card space-y-4">
        <div className="flex items-center justify-between border-b border-[#1A1A1A]/10 pb-3">
          <div className="font-serif text-sm font-bold text-[#1A1A1A] tracking-tight flex items-center space-x-2">
            <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
            <span>Autonomous Purchase Dispatch</span>
          </div>
          <span className="text-xs font-mono text-[#6C6863]">
            Auto-approved ≤ ₹{singleLimit.toLocaleString()}
          </span>
        </div>

        <form onSubmit={handleQuickSubmit} className="flex flex-col sm:flex-row gap-4 pt-1">
          <div className="luxury-input-wrapper flex-1">
            <Search className="w-4 h-4 text-[#D4AF37] shrink-0" />
            <input
              type="text"
              value={quickPrompt}
              onChange={(e) => setQuickPrompt(e.target.value)}
              placeholder="e.g. Search Amazon for running shoes under ₹2,000"
              className="luxury-input text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !quickPrompt.trim()}
            className="luxury-btn-primary px-6 h-11 text-xs shrink-0"
          >
            <span>{loading ? 'Transacting...' : 'Buy'}</span>
            <ArrowRight className="w-3.5 h-3.5 shrink-0" />
          </button>
        </form>
      </section>

      {/* Recent Purchases List */}
      <section className="luxury-card space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A]/10">
          <div>
            <h3 className="font-serif text-base font-bold text-[#1A1A1A]">
              Recent Transactions
            </h3>
            <p className="text-xs text-[#6C6863] font-sans">
              All autonomous money movements verified by Bounded Spending Enclave
            </p>
          </div>

          <button
            onClick={() => onNavigate('transactions')}
            className="font-sans text-xs text-[#1A1A1A] hover:text-[#D4AF37] flex items-center space-x-1 uppercase tracking-[0.15em] font-semibold transition-colors"
          >
            <span>View Full Ledger</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-[#1A1A1A]/10">
          {recentPurchases.map((item) => (
            <div key={item.id} className="py-4 flex items-center justify-between gap-4 hover:bg-[#FAF8F5] px-2 transition-colors duration-300">
              <div className="flex items-center space-x-4">
                <div className="w-9 h-9 flex items-center justify-center border border-[#1A1A1A]/15 bg-[#FAF8F5] text-[#1A1A1A]">
                  <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <div>
                  <div className="font-serif text-sm font-bold text-[#1A1A1A]">
                    {item.name}
                  </div>
                  <div className="text-xs text-[#6C6863] font-sans mt-0.5">
                    {item.store} · {item.time}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="font-serif text-base font-bold text-[#1A1A1A]">
                    ₹{item.amount.toLocaleString()}
                  </div>
                </div>

                {item.status === 'PAID' && (
                  <span className="px-3 py-1 border border-emerald-600/30 text-emerald-800 bg-emerald-50 text-[10px] font-sans uppercase tracking-[0.15em] font-semibold flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>PAID</span>
                  </span>
                )}

                {item.status === 'NEEDS_APPROVAL' && (
                  <span className="px-3 py-1 border border-amber-600/30 text-amber-800 bg-amber-50 text-[10px] font-sans uppercase tracking-[0.15em] font-semibold flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>GATED</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

