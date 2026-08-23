import React, { useState } from 'react';
import {
  ShoppingBag,
  ArrowRight,
  Search,
  CheckCircle2,
  AlertCircle,
  XCircle,
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

  // Plain-English mock transactions for clear customer view
  const recentPurchases = [
    {
      id: 'tx_1',
      name: 'Nike Air Zoom Pegasus 40',
      store: 'Amazon India',
      amount: 1709,
      status: 'PAID',
      time: '10 mins ago',
    },
    {
      id: 'tx_2',
      name: 'Anker USB-C Hub & Cable',
      store: 'Anker Official Store',
      amount: 1499,
      status: 'PAID',
      time: '2 hours ago',
    },
    {
      id: 'tx_3',
      name: 'Keychron Q1 Pro Mechanical Keyboard',
      store: 'Keychron Store',
      amount: 3509,
      status: 'NEEDS_APPROVAL',
      time: 'Yesterday',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200 max-w-5xl">
      
      {/* Header Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Overview</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Your purchases and spending limits at a glance.
          </p>
        </div>
      </div>

      {/* 4 Simple Numbers */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Spent Today */}
        <div className="fintech-card p-5 space-y-1.5">
          <div className="text-xs text-slate-400 font-medium">Spent today</div>
          <div className="text-2xl font-extrabold text-white font-mono">
            ₹{dailySpent.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500">
            of ₹{ceiling.toLocaleString()} daily limit
          </div>
        </div>

        {/* Metric 2: Max per purchase */}
        <div className="fintech-card p-5 space-y-1.5">
          <div className="text-xs text-slate-400 font-medium">Max per purchase</div>
          <div className="text-2xl font-extrabold text-white font-mono">
            ₹{singleLimit.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500">
            Auto-approved
          </div>
        </div>

        {/* Metric 3: Successful Purchases */}
        <div className="fintech-card p-5 space-y-1.5">
          <div className="text-xs text-slate-400 font-medium">Completed purchases</div>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono">
            {auditLedger.length > 0 ? auditLedger.length + 12 : 14}
          </div>
          <div className="text-xs text-slate-500">
            Paid with Razorpay
          </div>
        </div>

        {/* Metric 4: Needs Approval */}
        <div className="fintech-card p-5 space-y-1.5">
          <div className="text-xs text-slate-400 font-medium">Needs approval</div>
          <div className="text-2xl font-extrabold text-amber-400 font-mono">
            1
          </div>
          <div className="text-xs text-slate-500">
            Over ₹{singleLimit.toLocaleString()} limit
          </div>
        </div>

      </div>

      {/* Quick Buy Bar */}
      <section className="fintech-card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-white flex items-center space-x-2">
            <ShoppingBag className="w-4 h-4 text-[#0c83ff]" />
            <span>Make a purchase</span>
          </div>
          <span className="text-xs text-slate-400">
            Auto-approved up to ₹{singleLimit.toLocaleString()}
          </span>
        </div>

        <form onSubmit={handleQuickSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={quickPrompt}
              onChange={(e) => setQuickPrompt(e.target.value)}
              placeholder="e.g. Running shoes under ₹2,000"
              className="w-full pl-10 pr-4 py-2.5 bg-[#090d16] border border-white/[0.08] rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#0c83ff]"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !quickPrompt.trim()}
            className="px-6 py-2.5 bg-[#0c83ff] hover:bg-[#0270e0] text-white text-xs font-bold rounded-lg shadow-sm flex items-center space-x-2 transition-all disabled:opacity-50"
          >
            <span>{loading ? 'Finding...' : 'Buy'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      </section>

      {/* Recent Purchases List */}
      <section className="fintech-card p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.07]">
          <div>
            <h3 className="text-sm font-bold text-white">Recent purchases</h3>
            <p className="text-xs text-slate-400">All payments made according to your limits</p>
          </div>

          <button
            onClick={() => onNavigate('transactions')}
            className="text-xs text-[#0c83ff] hover:text-[#38bdf8] font-bold flex items-center space-x-1"
          >
            <span>See all history</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-white/[0.05]">
          {recentPurchases.map((item) => (
            <div key={item.id} className="py-3.5 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-slate-400">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white text-sm">{item.name}</div>
                  <div className="text-slate-400 text-xs">{item.store} · {item.time}</div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="font-bold text-white font-mono text-sm">₹{item.amount.toLocaleString()}</div>
                </div>

                {item.status === 'PAID' && (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 font-bold text-xs flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Paid</span>
                  </span>
                )}

                {item.status === 'NEEDS_APPROVAL' && (
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-400 font-bold text-xs flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>Needs approval</span>
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
