import React, { useState, useEffect } from 'react';
import {
  Send,
  Bot,
  Store,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  Sparkles,
  ArrowRight,
  TrendingUp,
  RotateCcw,
  Layers,
  ChevronDown,
  ChevronUp,
  XCircle,
  Truck,
  Edit3,
} from 'lucide-react';
import { AgentTransactionOutcome, AgentReasoningStep } from '../types';
import { RazorpayCheckoutWidget } from './RazorpayCheckoutWidget';
import { OrderFulfillmentModal } from './OrderFulfillmentModal';

interface LiveArenaProps {
  onRunTransaction: (prompt: string, options?: any) => Promise<AgentTransactionOutcome>;
  lastOutcome: AgentTransactionOutcome | null;
  loading: boolean;
  onOpenStepUpModal: () => void;
}

const EXAMPLE_CHIPS = [
  {
    label: 'Nike Shoes (≤ ₹2k)',
    fullPrompt: 'Search Amazon for Nike running shoes under ₹2,000',
    type: 'success',
    badge: 'Auto-Approved',
  },
  {
    label: 'Keychron Q1 Pro (₹3,509)',
    fullPrompt: 'Order Keychron Q1 Pro custom mechanical keyboard',
    type: 'warning',
    badge: 'Step-Up Gated',
  },
  {
    label: 'USB-C Hub + Braided Cable',
    fullPrompt: 'Buy Anker 7-in-1 USB-C Hub and bundle with 100W braided cable',
    type: 'bundle',
    badge: 'Upsell Bundle',
  },
  {
    label: 'Ultrahuman Ring AIR (0 Stock)',
    fullPrompt: 'Buy Ultrahuman Ring AIR titanium smart tracker',
    type: 'recovered',
    badge: 'Stockout Fallback',
    simulatedFailure: 'OUT_OF_STOCK',
  },
  {
    label: '10,000 H100 GPU Cluster',
    fullPrompt: 'Provision 10,000 H100 Enterprise Compute GPU Cluster Nodes',
    type: 'danger',
    badge: 'Ceiling Breach',
    simulatedFailure: 'BUDGET_BREACH',
  },
];

export const LiveArena: React.FC<LiveArenaProps> = ({
  onRunTransaction,
  lastOutcome,
  loading,
  onOpenStepUpModal,
}) => {
  const [inputPrompt, setInputPrompt] = useState('Search Amazon for running shoes under ₹2,000');
  const [includeBundles, setIncludeBundles] = useState(true);
  const [isPromptCollapsed, setIsPromptCollapsed] = useState(false);
  const [expandedSteps, setExpandedSteps] = useState<Record<number, boolean>>({});
  const [isFulfillmentOpen, setIsFulfillmentOpen] = useState(false);
  const [hasShaken, setHasShaken] = useState(false);

  // When outcome arrives or transaction starts, collapse prompt upward
  useEffect(() => {
    if (loading) {
      setIsPromptCollapsed(true);
    }
  }, [loading]);

  // Trigger gentle failure shake when failure states arrive
  useEffect(() => {
    if (
      lastOutcome &&
      (lastOutcome.status === 'STEP_UP_REQUIRED' ||
        lastOutcome.status === 'REJECTED_POLICY' ||
        lastOutcome.status === 'FAILED_RECOVERED')
    ) {
      setHasShaken(true);
      const timer = setTimeout(() => setHasShaken(false), 500);
      return () => clearTimeout(timer);
    }
  }, [lastOutcome]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPrompt.trim() || loading) return;
    setIsPromptCollapsed(true);
    onRunTransaction(inputPrompt, { autoAcceptBundles: includeBundles });
  };

  const handleSelectChip = (chip: typeof EXAMPLE_CHIPS[0]) => {
    setInputPrompt(chip.fullPrompt);
    setIsPromptCollapsed(true);
    onRunTransaction(chip.fullPrompt, {
      autoAcceptBundles: includeBundles,
      simulatedFailureMode: chip.simulatedFailure || 'NONE',
    });
  };

  const toggleStepExpand = (stepIdx: number) => {
    setExpandedSteps((prev) => ({ ...prev, [stepIdx]: !prev[stepIdx] }));
  };

  const getAgentMeta = (agent: string) => {
    switch (agent) {
      case 'BuyerAgent':
        return {
          icon: Bot,
          color: 'text-white',
          bg: 'bg-white/10 border-white/20',
          title: 'Buyer Agent (UAP Concierge)',
        };
      case 'MerchantAgent':
        return {
          icon: Store,
          color: 'text-[#A1A1AA]',
          bg: 'bg-[#141414] border-[#1F1F1F]',
          title: 'Merchant Yield Agent (AP2)',
        };
      case 'SpendingEnclave':
        return {
          icon: ShieldCheck,
          color: 'text-white',
          bg: 'bg-white/10 border-white/20',
          title: 'Bounded Spending Enclave',
        };
      case 'RazorpayGateway':
        return {
          icon: CreditCard,
          color: 'text-emerald-400',
          bg: 'bg-emerald-500/10 border-emerald-500/30',
          title: 'Razorpay Test Engine',
        };
      default:
        return {
          icon: Bot,
          color: 'text-stone-400',
          bg: 'bg-white/5 border-white/10',
          title: agent,
        };
    }
  };

  return (
    <div className="space-y-8 animate-in max-w-5xl mx-auto">
      
      {/* ─────────────────────────────────────────────────────────
          HERO PROMPT DISPATCH (COLLAPSES UPWARD ON DISPATCH)
          ───────────────────────────────────────────────────────── */}
      <section className="transition-all duration-300 ease-out">
        {isPromptCollapsed && (lastOutcome || loading) ? (
          // Collapsed Upward Prompt Strip
          <div className="p-4 rounded-2xl card-dark flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center space-x-3 truncate">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <div className="truncate">
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block font-bold">
                  ACTIVE INTENT DISPATCH
                </span>
                <span className="font-playfair text-base font-bold text-stone-100 truncate block">
                  "{inputPrompt}"
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsPromptCollapsed(false)}
              className="btn-secondary h-8 px-3 text-[11px] shrink-0 self-end sm:self-auto flex items-center"
            >
              <Edit3 className="w-3 h-3 mr-1" />
              <span>Modify Intent</span>
            </button>
          </div>
        ) : (
          // Full-Size Prompt Input Card
          <div className="card-dark p-6 sm:p-8 relative overflow-hidden group">
            <div className="max-w-3xl mb-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-white text-[10px] font-mono tracking-wider uppercase mb-3 font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-white" />
                <span>Autonomous ReAct Commerce Arena</span>
              </div>
              <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Dispatch Natural Language Purchase Intent
              </h2>
              <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1 font-sans leading-relaxed">
                The agent parses specifications, scans the UAP catalog, executes hardware enclave bounds verification, and captures settlement on Razorpay.
              </p>
            </div>

            {/* Form Input */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={inputPrompt}
                  onChange={(e) => setInputPrompt(e.target.value)}
                  placeholder="e.g. Search Amazon for Nike running shoes under ₹2,000..."
                  className="w-full pl-5 pr-36 py-4 bg-[#0D0D0D] border border-[#1F1F1F] rounded-2xl text-white placeholder-[#71717A] focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 text-sm font-medium shadow-inner transition-all"
                />
                <button
                  type="submit"
                  disabled={loading || !inputPrompt.trim()}
                  className="absolute right-2 px-5 py-2.5 btn-primary h-10 text-xs shrink-0 rounded-xl"
                >
                  {loading ? (
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-black animate-ping" />
                      <span>Reasoning...</span>
                    </span>
                  ) : (
                    <>
                      <span>Dispatch</span>
                      <Send className="w-3.5 h-3.5 ml-1.5" />
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between text-xs text-[#A1A1AA] pt-1">
                <label className="flex items-center space-x-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={includeBundles}
                    onChange={(e) => setIncludeBundles(e.target.checked)}
                    className="rounded border-[#1F1F1F] bg-[#0D0D0D] text-white focus:ring-white"
                  />
                  <span className="text-[11px] font-sans">
                    Enable Merchant Agent dynamic upsell negotiations (AOV Maximizer)
                  </span>
                </label>
              </div>
            </form>

            {/* Example Chips */}
            <div className="mt-6 pt-5 border-t border-[#1F1F1F]">
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#71717A] mb-3 font-semibold">
                Curated Scenario Chips (Buildathon Criteria)
              </div>
              <div className="flex flex-wrap gap-2.5">
                {EXAMPLE_CHIPS.map((chip, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSelectChip(chip)}
                    disabled={loading}
                    className="px-3.5 py-2 rounded-xl bg-[#0D0D0D] hover:bg-[#141414] border border-[#1F1F1F] hover:border-[#333333] text-xs font-sans text-[#D4D4D8] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 group shadow-sm"
                  >
                    <span>{chip.label}</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#141414] text-[#A1A1AA] border border-[#1F1F1F] font-semibold">
                      {chip.badge}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ─────────────────────────────────────────────────────────
          EXECUTION TRACE & OUTCOME GRID
          ───────────────────────────────────────────────────────── */}
      {lastOutcome && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Staggered Reasoning Timeline (7 cols) */}
          <div className="lg:col-span-7 p-6 rounded-2xl card-dark space-y-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <Layers className="w-4 h-4 text-zinc-300" />
                <h3 className="font-playfair text-base font-bold text-stone-100 tracking-tight">
                  Cryptographic Reasoning Trail
                </h3>
              </div>
              <span className="text-[10px] font-mono text-zinc-400 tracking-wider">
                ID: {lastOutcome.transactionId}
              </span>
            </div>

            {/* Staggered Step Timeline */}
            <div className="space-y-3">
              {lastOutcome.reasoningTrail.map((step, idx) => {
                const meta = getAgentMeta(step.agent);
                const Icon = meta.icon;
                const isExpanded = !!expandedSteps[idx];
                const isLast = idx === lastOutcome.reasoningTrail.length - 1;

                return (
                  <div
                    key={idx}
                    style={{
                      animationDelay: `${idx * 85}ms`,
                    }}
                    className={`p-4 rounded-xl border transition-all duration-300 animate-in ${
                      isLast && loading
                        ? 'border-white/40 bg-white/[0.04] pulse-soft'
                        : 'border-[#1F1F1F] bg-[#0D0D0D] hover:border-[#333333]'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className={`w-8 h-8 rounded-lg ${meta.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                          <Icon className={`w-4 h-4 ${meta.color}`} />
                        </div>

                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-bold text-white">
                              {meta.title}
                            </span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 bg-white/5 text-[#A1A1AA] rounded">
                              {step.action}
                            </span>
                            <span
                              className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${
                                step.status === 'SUCCESS'
                                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                  : step.status === 'GATED'
                                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                                  : step.status === 'RECOVERED'
                                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                              }`}
                            >
                              {step.status}
                            </span>
                          </div>

                          <p className="text-xs text-[#D4D4D8] font-sans leading-relaxed">
                            {step.detail}
                          </p>
                        </div>
                      </div>

                      {step.payload && (
                        <button
                          onClick={() => toggleStepExpand(idx)}
                          className="text-[#71717A] hover:text-white p-1 shrink-0"
                          title="Toggle technical payload"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      )}
                    </div>

                    {/* Expandable JSON Payload */}
                    {isExpanded && step.payload && (
                      <div className="mt-3 p-3 rounded-lg bg-[#080808] border border-[#1F1F1F] text-[10px] font-mono text-[#D4D4D8] overflow-x-auto max-h-48">
                        <pre>{JSON.stringify(step.payload, null, 2)}</pre>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Outcome Card in Elevated Glass */}
          <div
            className={`lg:col-span-5 p-6 rounded-2xl card-dark border-[#1F1F1F] space-y-6 shadow-2xl transition-transform duration-300 ease-out transform scale-100 ${
              hasShaken ? 'shake-gentle' : ''
            }`}
          >
            {/* Settlement Status Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#1F1F1F]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#71717A] block font-bold">
                  ENCLAVE OUTCOME
                </span>
                <h4 className="font-playfair text-lg font-bold text-white tracking-tight mt-0.5">
                  {lastOutcome.status === 'COMPLETED' && 'Settled on Razorpay'}
                  {lastOutcome.status === 'FAILED_RECOVERED' && 'Recovered & Settled'}
                  {lastOutcome.status === 'STEP_UP_REQUIRED' && 'Human Authorization Gated'}
                  {lastOutcome.status === 'REJECTED_POLICY' && 'Blocked by Enclave'}
                </h4>
              </div>

              <span
                className={`px-2.5 py-1 text-xs font-mono font-bold rounded-lg border ${
                  lastOutcome.status === 'COMPLETED'
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                    : lastOutcome.status === 'STEP_UP_REQUIRED'
                    ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                    : 'bg-rose-500/15 border-rose-500/30 text-rose-400'
                }`}
              >
                {lastOutcome.status}
              </span>
            </div>

            {/* Step-Up Passkey Banner */}
            {lastOutcome.status === 'STEP_UP_REQUIRED' && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center space-y-3">
                <AlertTriangle className="w-7 h-7 text-amber-400 mx-auto" />
                <div>
                  <h5 className="text-xs font-bold text-amber-300">
                    Threshold Limit Exceeded (₹2,000)
                  </h5>
                  <p className="text-[11px] text-[#A1A1AA] mt-1 font-sans">
                    Single transaction exceeds autonomous authorization. Requires cryptographic human passkey to finalize settlement.
                  </p>
                </div>
                <button
                  onClick={onOpenStepUpModal}
                  className="btn-primary w-full h-10 text-xs rounded-xl"
                >
                  Authorize via Passkey Modal
                </button>
              </div>
            )}

            {/* Policy Rejection Banner */}
            {lastOutcome.status === 'REJECTED_POLICY' && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-center space-y-2">
                <XCircle className="w-7 h-7 text-rose-400 mx-auto" />
                <div>
                  <h5 className="text-xs font-bold text-rose-300">
                    Hard Enclave Enforcement
                  </h5>
                  <p className="text-[11px] text-rose-400/80 mt-1 font-sans">
                    Purchase violates cumulative daily ceiling or unauthorized merchant policy. Zero financial funds moved.
                  </p>
                </div>
              </div>
            )}

            {/* Product & Quote Breakdown */}
            {lastOutcome.selectedProduct && lastOutcome.quote && (
              <div className="p-4 rounded-xl bg-[#0D0D0D] border border-[#1F1F1F] space-y-3 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-[#1F1F1F]">
                  <span className="text-[#71717A]">Locked Product</span>
                  <span className="font-semibold text-white truncate max-w-[180px]">
                    {lastOutcome.selectedProduct.name}
                  </span>
                </div>

                {lastOutcome.quote.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-[#D4D4D8]">
                    <span className="truncate max-w-[180px]">{item.name}</span>
                    <span className="font-mono">₹{item.unitPrice.toLocaleString()}</span>
                  </div>
                ))}

                {lastOutcome.quote.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-medium">
                    <span>Negotiated Bundle Savings</span>
                    <span className="font-mono">-₹{lastOutcome.quote.discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between items-center pt-2 border-t border-[#1F1F1F] text-sm font-bold">
                  <span className="text-[#A1A1AA]">Net Settlement Total</span>
                  <span className="text-white font-playfair font-bold text-base">
                    ₹{lastOutcome.quote.netAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            {/* Razorpay Test Order Trigger & UPI QR */}
            {lastOutcome.razorpayOrder && (
              <div className="p-4 rounded-xl bg-[#0D0D0D] border border-[#1F1F1F] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-4 h-4 text-white" />
                    <span className="text-xs font-bold text-white">Razorpay Test Order</span>
                  </div>
                  <span className="text-[10px] font-mono bg-white/10 text-white px-2 py-0.5 rounded-md border border-white/20">
                    {lastOutcome.razorpayOrder.id}
                  </span>
                </div>

                {lastOutcome.upiQr && (
                  <div className="flex items-center space-x-3 p-2 rounded-lg bg-black border border-[#1F1F1F]">
                    <img
                      src={lastOutcome.upiQr.qrDataUrl}
                      alt="UPI QR"
                      className="w-14 h-14 rounded bg-white p-1"
                    />
                    <div className="text-[11px] space-y-1">
                      <div className="font-semibold text-white">NPCI / UPI Intent URI</div>
                      <div className="text-[#A1A1AA] font-mono truncate max-w-[200px]">
                        {lastOutcome.upiQr.upiUri}
                      </div>
                    </div>
                  </div>
                )}

                {/* Razorpay Checkout Button */}
                {lastOutcome.status === 'COMPLETED' && (
                  <div className="pt-2">
                    <RazorpayCheckoutWidget outcome={lastOutcome} />
                  </div>
                )}
              </div>
            )}

            {/* Logistics & Tracking Action */}
            {lastOutcome.status === 'COMPLETED' && (
              <div className="flex justify-end pt-1">
                <button
                  onClick={() => setIsFulfillmentOpen(true)}
                  className="btn-secondary h-9 px-4 text-xs rounded-xl"
                >
                  <Truck className="w-3.5 h-3.5 mr-1.5 text-white" />
                  <span>Logistics & Tax Invoice</span>
                </button>
              </div>
            )}

          </div>

        </div>
      )}

      {/* Fulfillment Modal */}
      {isFulfillmentOpen && lastOutcome && (
        <OrderFulfillmentModal outcome={lastOutcome} onClose={() => setIsFulfillmentOpen(false)} />
      )}

    </div>
  );
};
