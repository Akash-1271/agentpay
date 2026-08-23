import React, { useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  LockKeyhole,
  Play,
  Search,
  ShieldCheck,
  Sparkles,
  Zap,
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
    title: 'Understand the request',
    detail: 'The buyer agent turns a natural-language ask into a bounded shopping intent.',
    value: 'Running shoes · under ₹2,000',
    status: 'Intent captured',
    icon: Sparkles,
  },
  {
    label: '02 · Discovery',
    title: 'Find the best eligible option',
    detail: 'Machine-readable catalogs surface inventory, merchant details, and dynamic bundle options.',
    value: 'Nike Pegasus 40 · ₹1,899',
    status: 'In stock',
    icon: Search,
  },
  {
    label: '03 · Guardrail',
    title: 'Enforce the policy',
    detail: 'The enclave checks the merchant, budget, and single-transaction limit before payment.',
    value: '3 policy checks passed',
    status: 'Approved',
    icon: ShieldCheck,
  },
  {
    label: '04 · Payment',
    title: 'Create a verifiable transaction',
    detail: 'Razorpay creates the order while the audit trail records exactly why it was allowed.',
    value: 'Razorpay order · signed',
    status: 'Settled',
    icon: CreditCard,
  },
];

const principles: Array<{ title: string; detail: string; icon: LucideIcon; tone: string }> = [
  {
    title: 'Discover',
    detail: 'Catalogs that agents can actually reason over.',
    icon: Search,
    tone: 'text-blue-200 bg-blue-400/10 border-blue-300/15',
  },
  {
    title: 'Decide',
    detail: 'Negotiation and bundles, kept visible and explainable.',
    icon: Bot,
    tone: 'text-violet-200 bg-violet-400/10 border-violet-300/15',
  },
  {
    title: 'Control',
    detail: 'Limits, allowlists, and step-up approval where it matters.',
    icon: ShieldCheck,
    tone: 'text-amber-100 bg-amber-300/10 border-amber-200/15',
  },
  {
    title: 'Verify',
    detail: 'Payments and audit records that can be independently checked.',
    icon: CheckCircle2,
    tone: 'text-teal-100 bg-teal-300/10 border-teal-200/15',
  },
];

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onRunLiveDemo }) => {
  const [activeStep, setActiveStep] = useState(0);
  const activeFlow = flowSteps[activeStep];

  return (
    <div className="mx-auto max-w-6xl space-y-10 pb-6 pt-2 sm:space-y-14 sm:pt-6 animate-in">
      <section className="grid items-center gap-8 lg:grid-cols-[1.12fr_0.88fr] lg:gap-12">
        <div className="max-w-2xl">
          <div className="eyebrow">Autonomous commerce, intentionally bounded</div>
          <h1 className="mt-5 text-4xl font-extrabold tracking-[-0.055em] text-white sm:text-5xl lg:text-[4.1rem] lg:leading-[1.02]">
            Let agents move fast.
            <span className="block bg-gradient-to-r from-blue-200 via-cyan-100 to-teal-200 bg-clip-text text-transparent">
              Keep every rupee in control.
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
            AgentPay is the operating layer for trusted AI purchases—discovery, policy checks, and payment orchestration in one explainable flow.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => onRunLiveDemo('Buy running shoes under ₹2,000')}
              className="premium-button px-5 py-3 text-sm font-semibold"
            >
              <Play className="h-4 w-4 fill-current" />
              Run guided demo
            </button>
            <button
              type="button"
              onClick={() => onNavigate('overview')}
              className="premium-button-secondary px-5 py-3 text-sm font-semibold"
            >
              Open command center
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-400">
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-teal-300" />
              No card details exposed to agents
            </span>
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-teal-300" />
              Every decision is auditable
            </span>
          </div>
        </div>

        <aside className="fintech-card overflow-hidden p-1.5">
          <div className="rounded-[0.9rem] border border-white/[0.045] bg-slate-950/20 p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="eyebrow">Live policy posture</div>
                <h2 className="mt-3 text-xl font-bold tracking-[-0.035em] text-white">Ready for safe autonomous spend</h2>
              </div>
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-teal-200/15 bg-teal-300/10 text-teal-200">
                <LockKeyhole className="h-4 w-4" />
              </span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-400/[0.12] bg-white/[0.035] p-3.5">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Auto-approve</p>
                <p className="mt-2 text-lg font-bold tracking-[-0.04em] text-white">≤ ₹2,000</p>
                <p className="mt-1 text-[11px] text-teal-200">Policy protected</p>
              </div>
              <div className="rounded-xl border border-slate-400/[0.12] bg-white/[0.035] p-3.5">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Daily ceiling</p>
                <p className="mt-2 text-lg font-bold tracking-[-0.04em] text-white">₹25,000</p>
                <p className="mt-1 text-[11px] text-blue-200">Enclave enforced</p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-blue-300/[0.14] bg-gradient-to-r from-blue-400/[0.11] to-cyan-300/[0.05] p-3.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-100">
                <span className="status-dot-active" />
                Buyer agent is standing by
              </div>
              <p className="mt-1.5 text-xs leading-5 text-slate-400">
                Give it an intent and it will explain the quote, apply your rules, and create a verifiable payment.
              </p>
            </div>
          </div>
        </aside>
      </section>

      <section className="fintech-card overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-slate-400/[0.12] px-5 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-7">
          <div>
            <div className="eyebrow">A clear path from intent to payment</div>
            <h2 className="mt-2 text-xl font-bold tracking-[-0.035em] text-white sm:text-2xl">One purchase. Four visible gates.</h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('agent')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-200 transition hover:text-white"
          >
            Explore the live agent <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="grid grid-cols-2 gap-px bg-slate-400/[0.1] lg:grid-cols-1">
            {flowSteps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === activeStep;

              return (
                <button
                  key={step.label}
                  type="button"
                  onClick={() => setActiveStep(index)}
                  className={`group min-h-[8.1rem] p-4 text-left transition sm:p-5 ${
                    isActive ? 'bg-blue-400/[0.11]' : 'bg-[#0a1829] hover:bg-white/[0.035]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className={`grid h-8 w-8 place-items-center rounded-lg border ${
                      isActive ? 'border-blue-200/25 bg-blue-300/15 text-blue-100' : 'border-slate-400/[0.12] bg-white/[0.035] text-slate-400'
                    }`}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-[0.13em] ${isActive ? 'text-blue-200' : 'text-slate-500'}`}>
                      {step.label}
                    </span>
                  </div>
                  <p className={`mt-3 text-sm font-semibold ${isActive ? 'text-white' : 'text-slate-300'}`}>{step.title}</p>
                  <p className="mt-1 line-clamp-2 text-[11px] leading-5 text-slate-500">{step.status}</p>
                </button>
              );
            })}
          </div>

          <div className="flex min-h-[22rem] flex-col justify-between p-6 sm:p-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-teal-200">
                <CheckCircle2 className="h-4 w-4" />
                {activeFlow.status}
              </div>
              <h3 className="mt-4 max-w-md text-2xl font-bold tracking-[-0.045em] text-white">{activeFlow.title}</h3>
              <p className="mt-3 max-w-lg text-sm leading-6 text-slate-400">{activeFlow.detail}</p>
              <div className="mt-6 rounded-xl border border-slate-400/[0.12] bg-slate-950/30 p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500">Bounded transaction state</p>
                <p className="mt-2 text-sm font-semibold text-slate-100">{activeFlow.value}</p>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-slate-400/[0.12] pt-4">
              <p className="text-xs text-slate-500">Select a stage to inspect the flow.</p>
              <button
                type="button"
                onClick={() => onRunLiveDemo('Buy running shoes under ₹2,000')}
                className="inline-flex items-center gap-2 text-xs font-semibold text-blue-200 transition hover:text-white"
              >
                Try this flow <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="max-w-xl">
          <div className="eyebrow">Designed for trustworthy automation</div>
          <h2 className="mt-2 text-2xl font-bold tracking-[-0.04em] text-white">Everything an agent does remains legible to the person in charge.</h2>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {principles.map((principle) => {
            const Icon = principle.icon;

            return (
              <article key={principle.title} className="fintech-card-interactive p-5">
                <span className={`grid h-9 w-9 place-items-center rounded-xl border ${principle.tone}`}>
                  <Icon className="h-4 w-4" />
                </span>
                <h3 className="mt-4 text-sm font-semibold text-white">{principle.title}</h3>
                <p className="mt-2 text-xs leading-5 text-slate-400">{principle.detail}</p>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
};
