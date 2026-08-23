import React, { useState } from 'react';
import {
  ShieldCheck,
  Zap,
  TrendingUp,
  CreditCard,
  Ban,
  Clock,
  ArrowRight,
  Send,
  Sparkles,
  Bot,
  Store,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { AP2DelegationMandate, AuditRecord, AgentTransactionOutcome } from '../types';
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

  const ceiling = mandate?.dailyCeiling || 15000;
  const spentPct = Math.min(100, Math.round((dailySpent / ceiling) * 100));

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPrompt.trim() || loading) return;
    onRunPrompt(quickPrompt);
  };

  // Mock initial events if ledger is clean, or use real ledger
  const displayTimeline = auditLedger.length > 0 ? auditLedger.slice(0, 7) : [
    {
      id: 'aud_sample_1',
      timestamp: new Date().toISOString(),
      action: 'PAYMENT_CAPTURED',
      agentId: 'razorpay_webhook_listener',
      principalUser: 'user_akash_ai_shopper',
      amount: 1899,
      currency: 'INR',
      details: {},
      reasoning: 'Razorpay payment verified (HMAC SHA-256). Payment captured: pay_97bd9c9c40fd72.',
      signature: 'sig_f9a8b7',
    },
    {
      id: 'aud_sample_2',
      timestamp: new Date(Date.now() - 5000).toISOString(),
      action: 'RAZORPAY_ORDER_CREATED',
      agentId: 'RazorpayGateway',
      principalUser: 'user_akash_ai_shopper',
      amount: 1899,
      currency: 'INR',
      details: {},
      reasoning: 'Created Razorpay Order order_f85487efd29375 for ₹1,899.',
      signature: 'sig_e8d7c6',
    },
    {
      id: 'aud_sample_3',
      timestamp: new Date(Date.now() - 7000).toISOString(),
      action: 'POLICY_EVALUATION',
      agentId: 'SpendingEnclave',
      principalUser: 'user_akash_ai_shopper',
      amount: 1899,
      currency: 'INR',
      details: {},
      reasoning: 'Transaction (₹1,899) is within bounded enclave auto-authorization limits (<= ₹2,000).',
      signature: 'sig_c5b4a3',
    },
    {
      id: 'aud_sample_4',
      timestamp: new Date(Date.now() - 9000).toISOString(),
      action: 'QUOTE_NEGOTIATION',
      agentId: 'MerchantAgent',
      principalUser: 'user_akash_ai_shopper',
      amount: 1899,
      currency: 'INR',
      details: {},
      reasoning: 'Merchant Agent issued signed AP2 Quote with dynamic inventory lock.',
      signature: 'sig_b4a392',
    },
    {
      id: 'aud_sample_5',
      timestamp: new Date(Date.now() - 12000).toISOString(),
      action: 'CATALOG_DISCOVERY',
      agentId: 'BuyerAgent',
      principalUser: 'user_akash_ai_shopper',
      currency: 'INR',
      details: {},
      reasoning: 'Buyer Agent queried UAP Catalog. Candidate matched: Nike Pegasus 40 Running Shoes.',
      signature: 'sig_a39281',
    },
  ];

  return (
    <div className="space-y-9 animate-in">
      
      {/* Header Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="eyebrow">Command center</div>
          <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.045em] text-white sm:text-4xl">
            Today, you’re in control.
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Your AI commerce gateway is online, bounded, and ready to act on your behalf.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-teal-200/15 bg-teal-300/[0.07] px-3 py-2">
          <span className="status-dot-active" />
          <span className="text-xs font-medium text-teal-100">Policy guard active</span>
        </div>
      </div>

      {/* Metrics Row (Restrained, high-signal) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Autonomous Spend */}
        <div className="fintech-card p-5 space-y-2.5">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Autonomous Spend
          </div>
          <div className="text-xl font-extrabold text-white font-mono">
            ₹{dailySpent.toLocaleString()} <span className="text-xs text-slate-500 font-normal">/ ₹{ceiling.toLocaleString()}</span>
          </div>
          <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${spentPct > 80 ? 'bg-amber-400' : 'bg-emerald-400'}`}
              style={{ width: `${spentPct}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Total Transactions */}
        <div className="fintech-card p-5 space-y-2.5">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Transactions
          </div>
          <div className="text-xl font-extrabold text-white font-mono">
            {auditLedger.length + 18}
          </div>
          <div className="text-[11px] text-slate-400 flex items-center space-x-1">
            <span className="text-emerald-400 font-medium">↑ 12%</span>
            <span>vs previous 24h</span>
          </div>
        </div>

        {/* Metric 3: Payment Success */}
        <div className="fintech-card p-5 space-y-2.5">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Successful Payments
          </div>
          <div className="text-xl font-extrabold text-emerald-400 font-mono">
            98.4%
          </div>
          <div className="text-[11px] text-slate-400">
            Razorpay HMAC verified
          </div>
        </div>

        {/* Metric 4: Blocked & Gated */}
        <div className="fintech-card p-5 space-y-2.5">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Blocked Transactions
          </div>
          <div className="text-xl font-extrabold text-slate-200 font-mono">
            3
          </div>
          <div className="text-[11px] text-amber-400">
            1 Step-Up Gated
          </div>
        </div>

      </div>

      {/* Quick Autonomous Action Bar */}
      <section className="fintech-card overflow-hidden p-1.5">
        <div className="rounded-[0.9rem] border border-white/[0.04] bg-slate-950/15 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-white flex items-center space-x-2">
            <Zap className="w-4 h-4 text-blue-200" />
            <span>Dispatch an intent to your AI buyer</span>
          </div>
          <span className="rounded-full bg-blue-400/[0.1] px-2 py-1 text-[10px] font-mono text-blue-100">Auto-approve under ₹{mandate?.requiresStepUpAbove || 2000}</span>
        </div>

        <form onSubmit={handleQuickSubmit} className="flex gap-2">
          <input
            type="text"
            value={quickPrompt}
            onChange={(e) => setQuickPrompt(e.target.value)}
            placeholder="e.g. Buy running shoes under ₹2,000"
            className="premium-input flex-1 px-4 py-3 text-xs sm:text-sm"
          />
          <button
            type="submit"
            disabled={loading || !quickPrompt.trim()}
            className="premium-button px-4 py-3 text-xs font-semibold disabled:opacity-50"
          >
            <span>Execute</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
        </div>
      </section>

      {/* Live Agent Activity Timeline */}
      <section className="fintech-card p-6 space-y-5 sm:p-7">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.07]">
          <div>
            <div className="eyebrow">Recent decisions</div>
            <h3 className="mt-2 text-base font-bold tracking-[-0.025em] text-white">Live agent activity</h3>
            <p className="mt-1 text-xs text-slate-400">A readable timeline of every decision your agent has made.</p>
          </div>

          <button
            onClick={() => onNavigate('audit')}
            className="text-xs text-[#0c83ff] hover:text-[#38bdf8] font-medium flex items-center space-x-1"
          >
            <span>View Full Audit Trail</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Timeline Items */}
        <div className="space-y-3">
          {displayTimeline.map((item, idx) => (
            <div
              key={item.id || idx}
              className="flex items-start justify-between rounded-xl border border-slate-400/[0.1] bg-slate-950/25 p-3.5 transition hover:border-slate-300/[0.2] hover:bg-white/[0.035]"
            >
              <div className="flex items-start space-x-3">
                <div className="w-7 h-7 rounded-md bg-white/[0.04] border border-white/5 flex items-center justify-center text-slate-400 font-mono text-[10px] mt-0.5">
                  {idx + 1}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-200">{item.action}</span>
                    <span className="text-[10px] font-mono text-slate-500">{item.agentId}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{item.reasoning}</p>
                </div>
              </div>

              <div className="text-right flex-shrink-0 ml-3">
                <div className="text-[11px] font-mono text-slate-400">
                  {new Date(item.timestamp).toLocaleTimeString()}
                </div>
                {item.amount && (
                  <div className="text-xs font-mono font-bold text-white mt-0.5">
                    ₹{item.amount.toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
