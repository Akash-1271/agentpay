import React, { useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  LockKeyhole,
  Package,
  Play,
  Search,
  ShieldCheck,
  ShoppingBag,
  TrendingUp,
} from 'lucide-react';
import { NavSection } from './Sidebar';

interface LandingPageProps {
  onNavigate: (section: NavSection) => void;
  onRunLiveDemo: (prompt: string) => void;
}

interface FlowStep {
  label: string;
  title: string;
  detail: string;
  value: string;
  status: string;
  icon: LucideIcon;
}

const flowSteps: FlowStep[] = [
  {
    label: '01 · Intent',
    title: 'Parse Order Query',
    detail: 'Autonomous buyer extracts structured product parameters and maximum price limits.',
    value: 'Nike Pegasus 40 · Under ₹2,000',
    status: 'Query Parsed',
    icon: Search,
  },
  {
    label: '02 · Discovery',
    title: 'Query Semantic Catalog',
    detail: 'Canonical UAP Catalog identifies in-stock inventory and requests AP2 signed quotes.',
    value: 'Nike Pegasus 40 · ₹1,709 (15% VIP)',
    status: 'Quote Verified',
    icon: Package,
  },
  {
    label: '03 · Guardrail',
    title: 'Validate Enclave Bounds',
    detail: 'Spending Enclave verifies single-tx limit (≤ ₹2,000) and authorized merchant whitelist.',
    value: '5 policy conditions verified',
    status: 'Enclave Authorized',
    icon: ShieldCheck,
  },
  {
    label: '04 · Settlement',
    title: 'Razorpay Test Settlement',
    detail: 'Generates Razorpay Order, confirms webhook settlement, and dispatches courier tracking.',
    value: 'Order Captured · AWB Dispatched',
    status: 'Settled',
    icon: CreditCard,
  },
];

const pillars: Array<{ title: string; detail: string; icon: LucideIcon }> = [
  {
    title: 'Discover',
    detail: 'Machine-readable UAP 1.0 JSON-LD schemas and Amazon catalog adapters.',
    icon: Search,
  },
  {
    title: 'Negotiate',
    detail: 'AP2 cryptographic quotes with dynamic bundle and yield optimization.',
    icon: TrendingUp,
  },
  {
    title: 'Control',
    detail: 'Cryptographic Spending Enclave enforcing hard daily ceilings and step-ups.',
    icon: ShieldCheck,
  },
  {
    title: 'Settle',
    detail: 'Razorpay test-mode settlement, double-entry FinOps ledger, and courier dispatch.',
    icon: CreditCard,
  },
];

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onRunLiveDemo }) => {
  const [activeStep, setActiveStep] = useState(0);
  const activeFlow = flowSteps[activeStep];

  return (
    <div className="mx-auto max-w-6xl space-y-12 pb-8 animate-in fade-in duration-200">
      
      {/* Hero Section */}
      <section className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 pt-4">
        <div className="space-y-5 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0c83ff]" />
            <span>Razorpay AI Buildathon 2026 · Track 01</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-[1.1]">
            Autonomous commerce,
            <span className="block text-[#0c83ff]">
              mathematically bounded.
            </span>
          </h1>

          <p className="text-sm sm:text-base leading-relaxed text-slate-400 max-w-xl">
            AgentPay is the financial operating infrastructure for agentic commerce—connecting merchant catalogs to autonomous buyers with enclave governance and Razorpay test-mode settlement.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={() => onRunLiveDemo('Search Amazon for running shoes under ₹2,000')}
              className="px-5 py-3 bg-[#0c83ff] hover:bg-[#0270e0] text-white text-xs font-bold rounded-lg shadow-sm flex items-center justify-center space-x-2 transition-all"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Run Guided Order Demo</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('overview')}
              className="px-5 py-3 bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 text-xs font-bold rounded-lg border border-white/[0.08] flex items-center justify-center space-x-2 transition-all"
            >
              <span>Open Console</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-xs text-slate-500 font-mono">
            <span className="flex items-center gap-1.5 text-slate-400">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              No plaintext payment credentials exposed
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              Every action HMAC signed & auditable
            </span>
          </div>
        </div>

        {/* Right Side: Posture Card */}
        <div className="fintech-card p-6 space-y-5 bg-[#090d16]">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.07]">
            <div>
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">Security Enclave Posture</div>
              <h3 className="text-sm font-bold text-white mt-0.5">Enclave Guard Active</h3>
            </div>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <LockKeyhole className="w-4 h-4" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-lg bg-[#080b11] border border-white/[0.05] space-y-1">
              <div className="text-[10px] font-mono uppercase text-slate-500">Auto-Approve Bound</div>
              <div className="text-lg font-bold text-white font-mono">≤ ₹2,000</div>
              <div className="text-[10px] text-emerald-400 font-mono">Enclave Protected</div>
            </div>
            <div className="p-3.5 rounded-lg bg-[#080b11] border border-white/[0.05] space-y-1">
              <div className="text-[10px] font-mono uppercase text-slate-500">Daily Spending Cap</div>
              <div className="text-lg font-bold text-white font-mono">₹25,000</div>
              <div className="text-[10px] text-[#38bdf8] font-mono">Cumulative Limit</div>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-[#080b11] border border-blue-500/20 text-xs text-slate-400 space-y-1">
            <div className="text-white font-bold flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Razorpay Test Engine Active</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400">
              Orders created via `/v1/orders`, verified with HMAC-SHA256 signatures, and settled in real-time.
            </p>
          </div>
        </div>
      </section>

      {/* 4-Step Purchase Visualizer */}
      <section className="fintech-card overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border-b border-white/[0.07] gap-3">
          <div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0c83ff]">Execution Pipeline</div>
            <h2 className="text-base font-bold text-white mt-0.5">Four Visible Gates for Every Money Action</h2>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('agent')}
            className="text-xs font-bold text-[#0c83ff] hover:text-[#38bdf8] flex items-center space-x-1"
          >
            <span>Open Commerce Console</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid lg:grid-cols-[1fr_1.3fr]">
          {/* Stepper Buttons */}
          <div className="divide-y divide-white/[0.05] border-r border-white/[0.05] bg-[#080b11]">
            {flowSteps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === activeStep;

              return (
                <button
                  key={step.label}
                  type="button"
                  onClick={() => setActiveStep(index)}
                  className={`w-full p-4 text-left transition-all flex items-start space-x-3.5 ${
                    isActive ? 'bg-[#0c83ff]/10 border-l-2 border-l-[#0c83ff]' : 'hover:bg-white/[0.02]'
                  }`}
                >
                  <div className={`p-2 rounded-lg mt-0.5 ${isActive ? 'bg-[#0c83ff]/20 text-[#38bdf8]' : 'bg-white/5 text-slate-500'}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${isActive ? 'text-white' : 'text-slate-300'}`}>{step.title}</span>
                      <span className="text-[10px] font-mono text-slate-500">{step.label}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate max-w-[200px]">{step.status}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Stepper Detail View */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-[#090d16]">
            <div className="space-y-3">
              <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-400 font-mono">
                <CheckCircle2 className="h-4 w-4" />
                <span>{activeFlow.status}</span>
              </div>
              <h3 className="text-xl font-bold text-white">{activeFlow.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-lg">{activeFlow.detail}</p>
              
              <div className="mt-4 p-3.5 rounded-lg bg-[#080b11] border border-white/[0.06] space-y-1 font-mono">
                <div className="text-[10px] uppercase text-slate-500">Output Payload Trace</div>
                <div className="text-xs font-semibold text-slate-200">{activeFlow.value}</div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
              <span className="text-xs text-slate-500 font-mono">Step {activeStep + 1} of 4</span>
              <button
                type="button"
                onClick={() => onRunLiveDemo('Search Amazon for running shoes under ₹2,000')}
                className="text-xs font-bold text-[#0c83ff] hover:text-[#38bdf8] flex items-center space-x-1.5"
              >
                <span>Test this flow in console</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars Grid */}
      <section className="space-y-4">
        <div>
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">Core Architecture</div>
          <h2 className="text-lg font-bold text-white mt-0.5">Built on Open Protocols & Controlled Execution</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {pillars.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.title} className="fintech-card p-5 space-y-2 bg-[#090d16]">
                <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-[#0c83ff]">
                  <Icon className="h-4 w-4" />
                </div>
                <h3 className="text-xs font-bold text-white mt-3">{p.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{p.detail}</p>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};
