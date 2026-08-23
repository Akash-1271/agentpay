import React, { useState } from 'react';
import {
  CreditCard,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  Search,
  CheckCircle2,
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
  const spentPct = Math.min(100, Math.round((dailySpent / ceiling) * 100));

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPrompt.trim() || loading) return;
    onRunPrompt(quickPrompt);
  };

  const displayTimeline = auditLedger.length > 0 ? auditLedger.slice(0, 6) : [
    {
      id: 'aud_sample_1',
      timestamp: new Date().toISOString(),
      action: 'PAYMENT_CAPTURED',
      agentId: 'RazorpayGateway',
      amount: 1709,
      reasoning: 'Razorpay webhook verified (HMAC SHA-256). Payment captured for Nike Air Zoom Pegasus 40.',
    },
    {
      id: 'aud_sample_2',
      timestamp: new Date(Date.now() - 5000).toISOString(),
      action: 'RAZORPAY_ORDER_CREATED',
      agentId: 'RazorpayGateway',
      amount: 1709,
      reasoning: 'Created Razorpay Order order_bcbf54c1cef2cc for ₹1,709 with Amazon Logistics dispatch.',
    },
    {
      id: 'aud_sample_3',
      timestamp: new Date(Date.now() - 7000).toISOString(),
      action: 'POLICY_EVALUATION',
      agentId: 'SpendingEnclave',
      amount: 1709,
      reasoning: 'Transaction (₹1,709) is within bounded enclave auto-authorization limits (<= ₹2,000).',
    },
    {
      id: 'aud_sample_4',
      timestamp: new Date(Date.now() - 9000).toISOString(),
      action: 'QUOTE_NEGOTIATION',
      agentId: 'MerchantAgent',
      amount: 1709,
      reasoning: 'Merchant Agent issued signed AP2 Quote with 15% dynamic bundle discount.',
    },
    {
      id: 'aud_sample_5',
      timestamp: new Date(Date.now() - 12000).toISOString(),
      action: 'CATALOG_DISCOVERY',
      agentId: 'BuyerAgent',
      reasoning: 'Queried UAP Catalog standard. Candidate matched: Nike Pegasus 40 Running Shoes.',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-2xl font-extrabold text-white">Overview</h1>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Operational · Policy Guard Active</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Payment infrastructure is operating normally. All money movements bounded and auditable.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Spend Today */}
        <div className="fintech-card p-5 space-y-2">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
            Spend Today
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">
            ₹{dailySpent.toLocaleString()}
          </div>
          <div className="space-y-1">
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${spentPct > 80 ? 'bg-amber-400' : 'bg-[#0c83ff]'}`}
                style={{ width: `${spentPct}%` }}
              />
            </div>
            <div className="text-[10px] text-slate-500 font-mono flex justify-between">
              <span>Cap: ₹{ceiling.toLocaleString()}</span>
              <span>{spentPct}%</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Total Transactions */}
        <div className="fintech-card p-5 space-y-2">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
            Transactions
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">
            {auditLedger.length + 14}
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            +18.4% volume growth
          </div>
        </div>

        {/* Metric 3: Settlement Rate */}
        <div className="fintech-card p-5 space-y-2">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
            Settlement Rate
          </div>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono">
            98.4%
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            Razorpay HMAC verified
          </div>
        </div>

        {/* Metric 4: Policy Exceptions */}
        <div className="fintech-card p-5 space-y-2">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
            Policy Exceptions
          </div>
          <div className="text-2xl font-extrabold text-slate-200 font-mono">
            3
          </div>
          <div className="text-[11px] text-amber-400 font-mono">
            1 Step-Up Gated
          </div>
        </div>

      </div>

      {/* Quick Order Execution Bar */}
      <section className="fintech-card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-white flex items-center space-x-2">
            <ShoppingBag className="w-4 h-4 text-[#0c83ff]" />
            <span>Run Purchase Order</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">
            Auto-limit: ≤ ₹{mandate?.requiresStepUpAbove || 2000}
          </span>
        </div>

        <form onSubmit={handleQuickSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={quickPrompt}
              onChange={(e) => setQuickPrompt(e.target.value)}
              placeholder="e.g. Search Amazon for running shoes under ₹2,000"
              className="w-full pl-10 pr-4 py-2.5 bg-[#090d16] border border-white/[0.08] rounded-lg text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-[#0c83ff]"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !quickPrompt.trim()}
            className="px-5 py-2.5 bg-[#0c83ff] hover:bg-[#0270e0] text-white text-xs font-bold rounded-lg shadow-sm flex items-center space-x-2 transition-all disabled:opacity-50"
          >
            <span>Execute</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      </section>

      {/* Activity Ledger */}
      <section className="fintech-card p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.07]">
          <div>
            <h3 className="text-sm font-bold text-white">Activity Ledger</h3>
            <p className="text-xs text-slate-400">Chronological stream of quote negotiations, enclave bounds, and settlements</p>
          </div>

          <button
            onClick={() => onNavigate('audit')}
            className="text-xs text-[#0c83ff] hover:text-[#38bdf8] font-bold flex items-center space-x-1"
          >
            <span>Full Ledger</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2.5">
          {displayTimeline.map((item, idx) => (
            <div
              key={item.id || idx}
              className="p-3.5 rounded-lg bg-[#090d16] border border-white/[0.04] flex items-start justify-between gap-3 text-xs"
            >
              <div className="flex items-start space-x-3">
                <div className="font-mono text-[10px] text-slate-500 mt-0.5">
                  0{idx + 1}
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-200">{item.action}</span>
                    <span className="font-mono text-[10px] text-slate-500 uppercase">{item.agentId}</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">{item.reasoning}</p>
                </div>
              </div>

              <div className="text-right flex-shrink-0 font-mono text-[11px]">
                <div className="text-slate-500">{new Date(item.timestamp).toLocaleTimeString()}</div>
                {item.amount && (
                  <div className="text-white font-bold mt-0.5">₹{item.amount.toLocaleString()}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
