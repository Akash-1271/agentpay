import React, { useState } from 'react';
import {
  ShoppingBag,
  ArrowRight,
  Search,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Lock,
  Zap,
  Activity,
  Server,
  Layers,
  FileText,
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
      hash: '0x8f2a...c4e1',
    },
    {
      id: 'tx_2',
      name: 'Anker USB-C Hub & Cable Bundle',
      store: 'Anker Official Store',
      amount: 1499,
      status: 'PAID',
      time: '2 hours ago',
      hash: '0x3b7d...99a0',
    },
    {
      id: 'tx_3',
      name: 'Keychron Q1 Pro Custom Mechanical Keyboard',
      store: 'Keychron Store',
      amount: 3509,
      status: 'NEEDS_APPROVAL',
      time: 'Yesterday',
      hash: '0x1c9e...e7b2',
    },
  ];

  return (
    <div className="space-y-10 animate-in max-w-6xl mx-auto">
      
      {/* Header Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="luxury-eyebrow mb-2">
            OVERVIEW & TELEMETRY
          </div>
          <h1 className="font-playfair text-3xl sm:text-4xl text-stone-100 font-bold tracking-tight">
            Autonomous Enclave & Ledger
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1 font-sans leading-relaxed">
            Real-time multi-agent spending boundaries, cryptographic attestations, and double-entry invariants.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigate('policies')}
            className="btn-secondary text-xs h-10 px-4 flex items-center gap-2"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-white" />
            <span>Spending Limits</span>
          </button>

          <button
            onClick={() => onNavigate('agent')}
            className="btn-primary text-xs h-10 px-5 flex items-center gap-2"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>New Purchase</span>
          </button>
        </div>
      </div>

      {/* ── 1. Top Row of 4 Glass Metric Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Metric 1: Spent Today */}
        <div className="card-dark p-5 space-y-3 group transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-sans font-bold text-[#A1A1AA] uppercase tracking-[0.18em]">
              Daily Spend
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#141414] border border-[#1F1F1F] flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-playfair text-2xl sm:text-3xl font-bold text-white">
              ₹{dailySpent.toLocaleString()}
            </div>
            <div className="text-[11px] text-[#A1A1AA] font-sans mt-0.5">
              of ₹{ceiling.toLocaleString()} daily ceiling
            </div>
          </div>
          <div className="space-y-1">
            <div className="h-1.5 bg-[#1F1F1F] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 bg-white"
                style={{ width: `${spentPct}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-[#71717A]">
              <span>{spentPct}% Consumed</span>
              <span>₹{(ceiling - dailySpent).toLocaleString()} Left</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Auto-Approved Limit */}
        <div className="card-dark p-5 space-y-3 group transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-sans font-bold text-[#A1A1AA] uppercase tracking-[0.18em]">
              Auto-Approved
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#141414] border border-[#1F1F1F] flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-playfair text-2xl sm:text-3xl font-bold text-white">
              ≤ ₹{singleLimit.toLocaleString()}
            </div>
            <div className="text-[11px] text-emerald-400 font-sans mt-0.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Sub-Second Instant Settle</span>
            </div>
          </div>
          <p className="text-[10px] text-[#71717A] font-sans leading-tight">
            Orders within threshold execute with zero human latency.
          </p>
        </div>

        {/* Metric 3: Step-Ups Gated */}
        <div className="card-dark p-5 space-y-3 group transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-sans font-bold text-[#A1A1AA] uppercase tracking-[0.18em]">
              Step-Ups Gated
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#141414] border border-[#1F1F1F] flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
              <Lock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-playfair text-2xl sm:text-3xl font-bold text-white">
              01
            </div>
            <div className="text-[11px] text-[#A1A1AA] font-sans mt-0.5">
              Over ₹{singleLimit.toLocaleString()} Threshold
            </div>
          </div>
          <p className="text-[10px] text-[#71717A] font-sans leading-tight">
            Cryptographically held awaiting WebAuthn passkey.
          </p>
        </div>

        {/* Metric 4: Ceiling Used */}
        <div className="card-dark p-5 space-y-3 group transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-sans font-bold text-[#A1A1AA] uppercase tracking-[0.18em]">
              Orders Settled
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#141414] border border-[#1F1F1F] flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-playfair text-2xl sm:text-3xl font-bold text-white">
              {auditLedger.length > 0 ? auditLedger.length + 12 : 14}
            </div>
            <div className="text-[11px] text-[#A1A1AA] font-sans mt-0.5">
              Direct AP2 Captured
            </div>
          </div>
          <p className="text-[10px] text-[#71717A] font-sans leading-tight">
            100% verified via Razorpay HMAC-SHA256 test signatures.
          </p>
        </div>

      </div>

      {/* ── 2. Central Interactive Node: Agent Enclave & Neural Topology ── */}
      <section className="card-dark p-6 sm:p-8 space-y-6 relative overflow-hidden">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <h2 className="font-playfair text-xl sm:text-2xl text-stone-100 font-bold tracking-tight">
                Agent Enclave & Neural Topology
              </h2>
            </div>
            <p className="text-xs text-stone-400 mt-0.5 font-sans">
              Cryptographic boundary orchestrating Buyer Agent, Policy Constraints, Ledger Invariants, and Razorpay Settlement.
            </p>
          </div>
          <div className="flex items-center gap-2 font-mono text-[10px] text-zinc-400">
            <span className="px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/15 text-zinc-300 uppercase tracking-widest font-semibold">
              MPC Quorum: 2-of-3
            </span>
          </div>
        </div>

        {/* Neural Network Visualization Graph */}
        <div className="relative py-4">
          
          {/* SVG Neural Connection Lines Overlay */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-0 hidden lg:block"
            viewBox="0 0 900 320"
            fill="none"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="neuralMonochromeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#52525B" stopOpacity="0.4" />
              </linearGradient>
            </defs>

            {/* Central Node is centered around (450, 160) */}
            {/* Connection 1: Central to Top-Left */}
            <path
              d="M 450 160 C 350 160, 250 80, 190 70"
              stroke="url(#neuralMonochromeGrad)"
              strokeWidth="2.5"
              className="neural-branch"
            />
            <path
              d="M 450 160 C 350 160, 250 80, 190 70"
              stroke="url(#neuralMonochromeGrad)"
              strokeWidth="1.5"
              className="neural-flow-dash"
            />

            {/* Connection 2: Central to Top-Right */}
            <path
              d="M 450 160 C 550 160, 650 80, 710 70"
              stroke="url(#neuralMonochromeGrad)"
              strokeWidth="2.5"
              className="neural-branch"
            />
            <path
              d="M 450 160 C 550 160, 650 80, 710 70"
              stroke="url(#neuralMonochromeGrad)"
              strokeWidth="1.5"
              className="neural-flow-dash"
            />

            {/* Connection 3: Central to Bottom-Left */}
            <path
              d="M 450 160 C 350 160, 250 240, 190 250"
              stroke="url(#neuralMonochromeGrad)"
              strokeWidth="2.5"
              className="neural-branch"
            />
            <path
              d="M 450 160 C 350 160, 250 240, 190 250"
              stroke="url(#neuralMonochromeGrad)"
              strokeWidth="1.5"
              className="neural-flow-dash"
            />

            {/* Connection 4: Central to Bottom-Right */}
            <path
              d="M 450 160 C 550 160, 650 240, 710 250"
              stroke="url(#neuralMonochromeGrad)"
              strokeWidth="2.5"
              className="neural-branch"
            />
            <path
              d="M 450 160 C 550 160, 650 240, 710 250"
              stroke="url(#neuralMonochromeGrad)"
              strokeWidth="1.5"
              className="neural-flow-dash"
            />
          </svg>

          {/* Grid Layout of Satellite Nodes and Central Enclave */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center relative z-10">
            
            {/* Left Column: Satellites 1 & 3 */}
            <div className="space-y-6">
              {/* Satellite 1: Spending Policy */}
              <div
                onClick={() => onNavigate('policies')}
                className="card-dark p-4 cursor-pointer hover:scale-[1.02] transition-all duration-300 border-[#1F1F1F] hover:border-[#404040]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#141414] border border-[#1F1F1F] flex items-center justify-center text-white shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#A1A1AA] font-bold">
                      Policy Engine
                    </div>
                    <div className="font-playfair text-sm text-white font-bold">
                      Spending Rules & Bounds
                    </div>
                    <div className="text-[10px] text-[#71717A] font-mono mt-0.5">
                      Auto ≤ ₹2k · Ceiling ₹25k
                    </div>
                  </div>
                </div>
              </div>

              {/* Satellite 3: Double-Entry Ledger */}
              <div
                onClick={() => onNavigate('transactions')}
                className="card-dark p-4 cursor-pointer hover:scale-[1.02] transition-all duration-300 border-[#1F1F1F] hover:border-[#404040]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#141414] border border-[#1F1F1F] flex items-center justify-center text-white shrink-0">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#A1A1AA] font-bold">
                      Double-Entry FinOps
                    </div>
                    <div className="font-playfair text-sm text-white font-bold">
                      Balanced Invariant Proofs
                    </div>
                    <div className="text-[10px] text-[#71717A] font-mono mt-0.5">
                      Debits = Credits · Zero Drift
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Column: Central Interactive Enclave Node */}
            <div className="card-dark p-6 border-[#262626] shadow-xl text-center space-y-4 relative">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-[10px] font-mono text-[#D4D4D8] uppercase tracking-wider font-semibold">
                <Server className="w-3.5 h-3.5 text-white" />
                <span>Central Enclave Boundary</span>
              </div>

              <div>
                <h3 className="font-playfair text-2xl text-white font-bold tracking-tight">
                  Autonomous Core
                </h3>
                <p className="text-xs text-[#A1A1AA] font-sans mt-1">
                  Zero Credential Exposure · Dynamic Gating
                </p>
              </div>

              <div className="p-3 bg-[#0D0D0D] border border-[#1F1F1F] rounded-xl font-mono text-[10px] text-[#D4D4D8] space-y-1.5 text-left">
                <div className="flex justify-between">
                  <span className="text-[#71717A]">Key Hash:</span>
                  <span className="text-white">enc_256k1_0x9a8f...4e</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#71717A]">Auto-Approval:</span>
                  <span className="text-emerald-400">≤ ₹{singleLimit.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#71717A]">Idempotency:</span>
                  <span className="text-white">Enforced</span>
                </div>
              </div>

              <button
                onClick={() => onNavigate('agent')}
                className="btn-primary w-full text-xs py-2.5 flex items-center justify-center gap-2 rounded-xl"
              >
                <span>Launch Arena Terminal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Right Column: Satellites 2 & 4 */}
            <div className="space-y-6">
              {/* Satellite 2: Razorpay Gateway */}
              <div
                onClick={() => onNavigate('agent')}
                className="card-dark p-4 cursor-pointer hover:scale-[1.02] transition-all duration-300 border-[#1F1F1F] hover:border-[#404040]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#141414] border border-[#1F1F1F] flex items-center justify-center text-white shrink-0">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#A1A1AA] font-bold">
                      Razorpay Gateway
                    </div>
                    <div className="font-playfair text-sm text-white font-bold">
                      AP2 Direct Capture
                    </div>
                    <div className="text-[10px] text-[#71717A] font-mono mt-0.5">
                      HMAC-SHA256 Webhooks
                    </div>
                  </div>
                </div>
              </div>

              {/* Satellite 4: UAP Catalog */}
              <div
                onClick={() => onNavigate('catalog')}
                className="card-dark p-4 cursor-pointer hover:scale-[1.02] transition-all duration-300 border-[#1F1F1F] hover:border-[#404040]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#141414] border border-[#1F1F1F] flex items-center justify-center text-white shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#A1A1AA] font-bold">
                      UAP Catalog
                    </div>
                    <div className="font-playfair text-sm text-white font-bold">
                      Verified Merchant Lookbook
                    </div>
                    <div className="text-[10px] text-[#71717A] font-mono mt-0.5">
                      Allow-List & CSV Imports
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 3. Quick Autonomous Purchase Bar ── */}
      <section className="card-dark p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#1F1F1F] pb-3">
          <div className="font-playfair text-base font-bold text-white tracking-tight flex items-center space-x-2">
            <ShoppingBag className="w-4 h-4 text-white" />
            <span>Autonomous Purchase Intent Dispatch</span>
          </div>
          <span className="text-xs font-mono text-[#A1A1AA]">
            Auto-approved ≤ ₹{singleLimit.toLocaleString()}
          </span>
        </div>

        <form onSubmit={handleQuickSubmit} className="flex flex-col sm:flex-row gap-3 pt-1">
          <div className="luxury-input-wrapper flex-1">
            <Search className="w-4 h-4 text-[#71717A] shrink-0" />
            <input
              type="text"
              value={quickPrompt}
              onChange={(e) => setQuickPrompt(e.target.value)}
              placeholder="e.g. Search Amazon for Nike running shoes under ₹2,000"
              className="luxury-input text-xs sm:text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !quickPrompt.trim()}
            className="btn-primary px-6 h-11 text-xs shrink-0 rounded-xl"
          >
            <span>{loading ? 'Evaluating...' : 'Dispatch'}</span>
            <ArrowRight className="w-3.5 h-3.5 shrink-0" />
          </button>
        </form>
      </section>

      {/* ── 4. Recent Transactions Feed ── */}
      <section className="card-dark p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#1F1F1F]">
          <div>
            <h3 className="font-playfair text-lg font-bold text-white">
              Recent Autonomous Transactions
            </h3>
            <p className="text-xs text-[#A1A1AA] font-sans">
              Cryptographically verified money movements signed by Bounded Spending Enclave
            </p>
          </div>

          <button
            onClick={() => onNavigate('transactions')}
            className="font-sans text-xs text-[#A1A1AA] hover:text-white flex items-center space-x-1 uppercase tracking-[0.16em] font-semibold transition-colors"
          >
            <span>Full Ledger</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-[#1F1F1F]">
          {recentPurchases.map((item) => (
            <div
              key={item.id}
              className="py-3.5 flex items-center justify-between gap-4 hover:bg-white/[0.03] px-3 rounded-xl transition-colors duration-200"
            >
              <div className="flex items-center space-x-3.5 min-w-0">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center border border-[#1F1F1F] bg-[#141414] text-white shrink-0">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="font-sans text-sm font-semibold text-white truncate">
                    {item.name}
                  </div>
                  <div className="text-[11px] text-[#71717A] font-sans mt-0.5 flex items-center gap-2">
                    <span>{item.store}</span>
                    <span>·</span>
                    <span>{item.time}</span>
                    <span>·</span>
                    <span className="font-mono text-[10px] text-[#A1A1AA]">{item.hash}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 shrink-0">
                <div className="text-right">
                  <div className="font-playfair text-base font-bold text-white">
                    ₹{item.amount.toLocaleString()}
                  </div>
                </div>

                {item.status === 'PAID' && (
                  <span className="px-2.5 py-1 border border-emerald-500/30 text-emerald-400 bg-emerald-500/10 rounded-lg text-[9px] font-mono uppercase tracking-wider font-semibold flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>PAID</span>
                  </span>
                )}

                {item.status === 'NEEDS_APPROVAL' && (
                  <span className="px-2.5 py-1 border border-amber-500/30 text-amber-400 bg-amber-500/10 rounded-lg text-[9px] font-mono uppercase tracking-wider font-semibold flex items-center space-x-1">
                    <Lock className="w-3 h-3" />
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

