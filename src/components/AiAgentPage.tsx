import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  Truck,
  FileText,
  Search,
  Zap,
} from 'lucide-react';
import { AgentTransactionOutcome, AgentReasoningStep } from '../types';
import { RazorpayCheckoutWidget } from './RazorpayCheckoutWidget';
import { OrderFulfillmentModal } from './OrderFulfillmentModal';

interface AiAgentPageProps {
  onRunTransaction: (prompt: string, options?: any) => Promise<AgentTransactionOutcome>;
  lastOutcome: AgentTransactionOutcome | null;
  loading: boolean;
  onOpenStepUpModal: () => void;
}

const PRESET_ORDERS = [
  {
    label: 'Nike Pegasus 40 Running Shoes (Auto-Approved)',
    desc: 'Amazon Prime Express listing under ₹2,000 threshold',
    prompt: 'Search Amazon for running shoes under ₹2,000',
    type: 'AUTO_APPROVED',
  },
  {
    label: 'Keychron Q1 Pro Mechanical Keyboard (Step-Up)',
    desc: 'High-value order exceeding ₹2,000 limit (Requires Step-Up)',
    prompt: 'Order Keychron Q1 Pro custom mechanical keyboard',
    type: 'REQUIRES_STEP_UP',
  },
  {
    label: 'Anker USB-C Hub + Cable Bundle (Dynamic Yield)',
    desc: 'Applies dynamic 25% multi-item bundle discount',
    prompt: 'Buy Anker 7-in-1 USB-C Hub and bundle with 100W braided cable',
    type: 'BUNDLE_UPSELL',
  },
  {
    label: 'Stockout Fallback Exception',
    desc: 'Simulates zero inventory with autonomous alternative routing',
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

  const handlePresetSelect = (p: typeof PRESET_ORDERS[0]) => {
    setPrompt(p.prompt);
    onRunTransaction(p.prompt, {
      autoAcceptBundles: allowBundles,
      simulatedFailureMode: p.type === 'OUT_OF_STOCK' ? 'OUT_OF_STOCK' : 'NONE',
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Header & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-2xl font-extrabold text-white">Commerce</h1>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#0c83ff]/15 text-[#38bdf8] border border-[#0c83ff]/20 flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Gateway Active · UAP 1.0 / AP2</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Execute purchase orders with automated quote verification, enclave governance, and Razorpay settlement.
          </p>
        </div>
      </div>

      {/* Main Order Runner Card */}
      <section className="fintech-card p-6 space-y-6">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 font-mono">
            Purchase Order Execution
          </label>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. Search Amazon for running shoes under ₹2,000"
                className="w-full pl-10 pr-4 py-2.5 bg-[#090d16] border border-white/[0.08] rounded-lg text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-[#0c83ff]"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="px-5 py-2.5 bg-[#0c83ff] hover:bg-[#0270e0] text-white text-xs font-bold rounded-lg shadow-sm flex items-center space-x-2 transition-all disabled:opacity-50"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{loading ? 'Executing Order...' : 'Execute Order'}</span>
            </button>
          </form>

          <div className="mt-3 flex items-center space-x-2 text-xs text-slate-400">
            <input
              type="checkbox"
              id="bundlesCheck"
              checked={allowBundles}
              onChange={(e) => setAllowBundles(e.target.checked)}
              className="h-3.5 w-3.5 rounded border-slate-700 bg-[#090d16] accent-[#0c83ff]"
            />
            <label htmlFor="bundlesCheck" className="cursor-pointer select-none">
              Apply dynamic merchant bundle discounts when available
            </label>
          </div>
        </div>

        {/* Quick Order Presets */}
        <div>
          <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
            Quick Orders
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {PRESET_ORDERS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handlePresetSelect(p)}
                disabled={loading}
                className="p-3 text-left rounded-lg bg-[#090d16] border border-white/[0.05] hover:border-white/[0.12] hover:bg-white/[0.02] transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 group-hover:text-white">{p.label}</span>
                  <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-slate-300 transition-colors" />
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">{p.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Decision Ledger (8 cols) */}
        <section className="lg:col-span-8 fintech-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.07]">
            <div>
              <h3 className="text-sm font-bold text-white">Decision Ledger</h3>
              <p className="text-xs text-slate-400">Verifiable trace of catalog discovery, quote signing, and enclave checks</p>
            </div>
            <span className="text-xs font-mono text-slate-500">
              {lastOutcome ? `${lastOutcome.reasoningTrail.length} steps recorded` : 'Idle'}
            </span>
          </div>

          {lastOutcome && lastOutcome.reasoningTrail.length > 0 ? (
            <div className="space-y-3">
              {lastOutcome.reasoningTrail.map((step: AgentReasoningStep) => {
                const isExpanded = expandedStep === step.step;

                return (
                  <div
                    key={step.step}
                    className="p-3.5 rounded-lg bg-[#090d16] border border-white/[0.04] space-y-2 text-xs transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start space-x-2.5">
                        <span className="font-mono text-[11px] font-bold text-slate-500 mt-0.5">
                          0{step.step}
                        </span>
                        <div className="space-y-0.5">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-white">{step.action}</span>
                            <span className="font-mono text-[10px] text-slate-500 uppercase">{step.agent}</span>
                          </div>
                          <p className="text-slate-300 text-[11px] leading-relaxed">{step.detail}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <span
                          className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                            step.status === 'SUCCESS'
                              ? 'bg-emerald-500/15 text-emerald-400'
                              : step.status === 'GATED'
                              ? 'bg-amber-500/15 text-amber-300'
                              : 'bg-rose-500/15 text-rose-300'
                          }`}
                        >
                          {step.status}
                        </span>
                        {step.payload && (
                          <button
                            onClick={() => setExpandedStep(isExpanded ? null : step.step)}
                            className="p-1 rounded text-slate-500 hover:text-white"
                          >
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        )}
                      </div>
                    </div>

                    {isExpanded && step.payload && (
                      <div className="mt-2 p-2.5 rounded bg-black/60 border border-white/[0.05] overflow-x-auto text-[11px] font-mono text-slate-300">
                        <pre>{JSON.stringify(step.payload, null, 2)}</pre>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-slate-500 font-mono space-y-2">
              <ShoppingBag className="w-8 h-8 text-slate-600 mx-auto opacity-50" />
              <p>Ready to process orders. Execute a purchase query above to populate the ledger.</p>
            </div>
          )}
        </section>

        {/* Right Column: Execution Boundaries & Settlement Outcome (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Execution Boundaries Matrix */}
          <section className="fintech-card p-5 space-y-3">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              Execution Boundaries
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#090d16] border border-white/[0.04]">
                <span className="text-slate-300">Semantic Discovery</span>
                <span className="text-emerald-400 font-mono text-[11px]">✓ Allowed</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#090d16] border border-white/[0.04]">
                <span className="text-slate-300">Dynamic Bundling</span>
                <span className="text-emerald-400 font-mono text-[11px]">✓ Allowed</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#090d16] border border-white/[0.04]">
                <span className="text-slate-300">Autonomous Settlement</span>
                <span className="text-amber-400 font-mono text-[11px]">≤ ₹2,000 Bound</span>
              </div>
            </div>
          </section>

          {/* Settlement Outcome Card */}
          {lastOutcome && (
            <section className="fintech-card p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider">
                  Settlement Result
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
                  <div className="font-bold text-amber-300">Step-Up Verification Required</div>
                  <p className="text-amber-200/80 text-[11px]">
                    Transaction exceeds single-order auto-threshold (₹2,000).
                  </p>
                  <button
                    onClick={onOpenStepUpModal}
                    className="w-full py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg text-xs transition-all"
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
