import React, { useState } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ChevronDown,
  ChevronUp,
  QrCode,
  ArrowRight,
  Sliders,
  RotateCcw,
  Tag,
  Key,
} from 'lucide-react';
import { AgentTransactionOutcome, AgentReasoningStep } from '../types';
import { RazorpayCheckoutWidget } from './RazorpayCheckoutWidget';
import { OrderFulfillmentModal } from './OrderFulfillmentModal';
import { Truck, FileText } from 'lucide-react';

interface AiAgentPageProps {
  onRunTransaction: (prompt: string, options?: any) => Promise<AgentTransactionOutcome>;
  lastOutcome: AgentTransactionOutcome | null;
  loading: boolean;
  onOpenStepUpModal: () => void;
}

const PRESET_TASKS = [
  {
    label: 'Search Amazon for running shoes under ₹2,000',
    desc: 'Nike Air Zoom Pegasus 40 Prime Express via Amazon India',
    prompt: 'Search Amazon for running shoes under ₹2,000',
    type: 'AUTO_APPROVED',
  },
  {
    label: 'Order Keychron Q1 Pro custom keyboard',
    desc: 'High-value item triggering Step-Up Biometric Authorization',
    prompt: 'Order Keychron Q1 Pro custom mechanical keyboard',
    type: 'REQUIRES_STEP_UP',
  },
  {
    label: 'Bundle Anker USB-C Hub with 100W Cable',
    desc: 'Merchant Agent provides dynamic 25% bundle discount',
    prompt: 'Buy Anker 7-in-1 USB-C Hub and bundle with 100W braided cable',
    type: 'BUNDLE_UPSELL',
  },
  {
    label: 'Simulate Amazon Out-of-Stock Fallback',
    desc: 'Simulate stockout and test autonomous alternative routing',
    prompt: 'Order Ultrahuman Ring AIR titanium smart tracker',
    type: 'OUT_OF_STOCK',
  },
];

export const AiAgentPage: React.FC<AiAgentPageProps> = ({
  onRunTransaction,
  lastOutcome,
  loading,
  onOpenStepUpModal,
}) => {
  const [prompt, setPrompt] = useState('Search Amazon for running shoes under ₹2,000');
  const [allowBundles, setAllowBundles] = useState(true);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [isFulfillmentOpen, setIsFulfillmentOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;
    onRunTransaction(prompt, { autoAcceptBundles: allowBundles });
  };

  const handlePresetSelect = (p: typeof PRESET_TASKS[0]) => {
    setPrompt(p.prompt);
    onRunTransaction(p.prompt, {
      autoAcceptBundles: allowBundles,
      simulatedFailureMode: p.type === 'OUT_OF_STOCK' ? 'OUT_OF_STOCK' : 'NONE',
    });
  };

  return (
    <div className="space-y-9 animate-in">
      
      {/* Header & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="eyebrow">Autonomous buyer workspace</div>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-extrabold tracking-[-0.045em] text-white sm:text-4xl">AI buyer agent</h1>
            <span className="inline-flex items-center gap-2 rounded-full border border-teal-200/15 bg-teal-300/[0.08] px-2.5 py-1 text-[11px] font-medium text-teal-100">
              <span className="status-dot-active" />
              <span>Online · UAP 1.0 / AP2</span>
            </span>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Delegate the intent. Keep the authority, constraints, and payment trail entirely visible.
          </p>
        </div>
      </div>

      {/* Main Execution Box */}
      <section className="fintech-card p-5 space-y-6 sm:p-7">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-[0.13em] text-slate-400 mb-2">
            What should your agent handle?
          </label>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Buy running shoes under ₹2,000"
              className="premium-input flex-1 px-4 py-3 text-sm"
            />
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="premium-button px-5 py-3 text-xs font-bold disabled:opacity-50"
            >
              {loading ? (
                <span>Executing...</span>
              ) : (
                <>
                  <span>Run Task</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-3 flex items-center space-x-2 text-xs text-slate-400">
            <input
              type="checkbox"
              id="bundlesCheck"
              checked={allowBundles}
              onChange={(e) => setAllowBundles(e.target.checked)}
              className="h-4 w-4 rounded border-slate-600 bg-slate-900 accent-blue-400"
            />
            <label htmlFor="bundlesCheck" className="cursor-pointer select-none">
              Allow dynamic bundle discount negotiation with Merchant Agent
            </label>
          </div>
        </div>

        {/* Task Presets */}
        <div>
          <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.13em] text-slate-500">
            Try a guided scenario
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {PRESET_TASKS.map((task, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handlePresetSelect(task)}
                className="flex min-h-[7.75rem] flex-col justify-between rounded-xl border border-slate-400/[0.1] bg-slate-950/25 p-3.5 text-left transition hover:-translate-y-0.5 hover:border-blue-200/25 hover:bg-blue-400/[0.06]"
              >
                <div>
                  <div className="text-xs font-bold text-slate-200 line-clamp-1">{task.label}</div>
                  <div className="mt-1 text-[11px] leading-5 text-slate-400 line-clamp-2">{task.desc}</div>
                </div>
                <div className="mt-2 flex items-center space-x-1 text-[10px] font-semibold text-blue-200">
                  <span>Execute</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Action Pipeline & Permissions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Action & Reasoning Pipeline (8 cols) */}
        <section className="lg:col-span-8 fintech-card p-5 space-y-5 sm:p-7">
          <div className="flex items-center justify-between border-b border-slate-400/[0.12] pb-4">
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-blue-200" />
              <h3 className="text-sm font-bold text-white">Decision pipeline</h3>
            </div>
            {lastOutcome && (
              <span className="text-[11px] font-mono text-slate-400">
                Tx: {lastOutcome.transactionId}
              </span>
            )}
          </div>

          {/* Reasoning Steps Stream */}
          {lastOutcome ? (
            <div className="space-y-3">
              {lastOutcome.reasoningTrail.map((step, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-400/[0.1] bg-slate-950/25 p-3.5 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-lg border border-slate-400/[0.1] bg-white/[0.04] font-mono text-[10px] text-slate-400">
                        {step.step}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-slate-200">{step.agent}</span>
                          <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-1.5 py-0.2 rounded">
                            {step.action}
                          </span>
                          <span
                            className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded uppercase ${
                              step.status === 'SUCCESS'
                                ? 'bg-emerald-500/15 text-emerald-400'
                                : step.status === 'GATED'
                                ? 'bg-amber-500/15 text-amber-400'
                                : step.status === 'RECOVERED'
                                ? 'bg-purple-500/15 text-purple-400'
                                : 'bg-rose-500/15 text-rose-400'
                            }`}
                          >
                            {step.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                          {step.detail}
                        </p>
                      </div>
                    </div>

                    {step.payload && (
                      <button
                        onClick={() => setExpandedStep(expandedStep === idx ? null : idx)}
                        className="text-slate-500 hover:text-slate-300 p-1"
                      >
                        {expandedStep === idx ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    )}
                  </div>

                  {expandedStep === idx && step.payload && (
                    <div className="mt-3 p-2.5 rounded bg-black/60 border border-white/5 font-mono text-[10px] text-emerald-400 overflow-x-auto max-h-40">
                      <pre>{JSON.stringify(step.payload, null, 2)}</pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-slate-500">
              <Bot className="mx-auto mb-3 h-5 w-5 text-slate-600" />
              Ready when you are. Start with an intent or one of the guided scenarios.
            </div>
          )}
        </section>

        {/* Right Column: Agent Permissions & Outcome Card (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Agent Permissions Matrix */}
          <section className="fintech-card p-5 space-y-3.5">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.13em] text-slate-400">
              Financial permissions
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between rounded-lg border border-slate-400/[0.1] bg-slate-950/25 p-2.5">
                <span className="text-slate-300">Product Discovery</span>
                <span className="text-emerald-400 font-mono text-[11px]">✓ Authorized</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-slate-400/[0.1] bg-slate-950/25 p-2.5">
                <span className="text-slate-300">Price Negotiation</span>
                <span className="text-emerald-400 font-mono text-[11px]">✓ Authorized</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-slate-400/[0.1] bg-slate-950/25 p-2.5">
                <span className="text-slate-300">Dynamic Upselling</span>
                <span className="text-emerald-400 font-mono text-[11px]">✓ Authorized</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-slate-400/[0.1] bg-slate-950/25 p-2.5">
                <span className="text-slate-300">Payment Authorization</span>
                <span className="text-amber-400 font-mono text-[11px]">Bounded (≤ ₹2,000)</span>
              </div>
            </div>
          </section>

          {/* Outcome & Step-Up Banner if Gated */}
          {lastOutcome && (
            <section className="fintech-card p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Result
                </span>
                <span
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                    lastOutcome.status === 'COMPLETED'
                      ? 'bg-emerald-500/15 text-emerald-400'
                      : lastOutcome.status === 'STEP_UP_REQUIRED'
                      ? 'bg-amber-500/15 text-amber-400'
                      : 'bg-rose-500/15 text-rose-400'
                  }`}
                >
                  {lastOutcome.status}
                </span>
              </div>

              {lastOutcome.status === 'STEP_UP_REQUIRED' && (
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs space-y-2">
                  <div className="font-bold text-amber-300">Step-Up Authorization Required</div>
                  <p className="text-amber-200/80 text-[11px]">
                    Transaction exceeds ₹2,000 threshold.
                  </p>
                  <button
                    onClick={onOpenStepUpModal}
                    className="w-full rounded-lg bg-amber-300 py-2.5 text-xs font-bold text-slate-950 transition hover:bg-amber-200"
                  >
                    Open Authorization Modal
                  </button>
                </div>
              )}

              {lastOutcome.quote && (
                <div className="p-3 rounded-lg bg-[#090d16] border border-white/[0.04] space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Product:</span>
                    <span className="text-slate-200 font-semibold truncate max-w-[140px]">
                      {lastOutcome.selectedProduct?.name}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Net Amount:</span>
                    <span className="text-[#38bdf8] font-mono font-bold">
                      ₹{lastOutcome.quote.netAmount.toLocaleString()}
                    </span>
                  </div>
                  {lastOutcome.razorpayOrder && (
                    <div className="flex justify-between text-slate-400 text-[11px]">
                      <span>Razorpay Order:</span>
                      <span className="font-mono text-slate-300">{lastOutcome.razorpayOrder.id}</span>
                    </div>
                  )}
                </div>
              )}

              {lastOutcome.status === 'COMPLETED' && (
                <div className="space-y-3">
                  <button
                    onClick={() => setIsFulfillmentOpen(true)}
                    className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-slate-950 text-xs font-bold rounded-lg shadow-sm flex items-center justify-center space-x-2 transition-all"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Track Merchant Order & Courier</span>
                  </button>

                  <RazorpayCheckoutWidget outcome={lastOutcome} />
                </div>
              )}
            </section>
          )}

        </div>

      </div>

      {isFulfillmentOpen && lastOutcome && (
        <OrderFulfillmentModal outcome={lastOutcome} onClose={() => setIsFulfillmentOpen(false)} />
      )}

    </div>
  );
};
