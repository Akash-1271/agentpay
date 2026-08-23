import React, { useState } from 'react';
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
} from 'lucide-react';
import { AgentTransactionOutcome, AgentReasoningStep } from '../types';

interface LiveArenaProps {
  onRunTransaction: (prompt: string, options?: any) => Promise<AgentTransactionOutcome>;
  lastOutcome: AgentTransactionOutcome | null;
  loading: boolean;
  onOpenStepUpModal: () => void;
}

const PRESET_PROMPTS = [
  {
    title: 'Autonomous Quick Buy (< ₹2k)',
    desc: 'Logitech MX Master 3S within auto-approval threshold',
    prompt: 'Buy Logitech MX Master 3S wireless mouse with priority delivery',
    badge: 'Auto-Approved',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  },
  {
    title: 'High-Value Gated Step-Up (> ₹2k)',
    desc: 'Keychron Q1 Pro mechanical keyboard triggering human authorization',
    prompt: 'Order Keychron Q1 Pro custom mechanical keyboard with brown switches',
    badge: 'Step-Up Required',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  },
  {
    title: 'Dynamic Upsell & Bundle Deal',
    desc: 'Anker USB-C Hub with dynamic 25% bundled cable discount',
    prompt: 'Get Anker 7-in-1 USB-C Hub and bundle with 100W braided cable',
    badge: 'Revenue Growth',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    autoBundle: true,
  },
  {
    title: 'Out-of-Stock Fallback Recovery',
    desc: 'Ultrahuman Smart Ring (0 stock) auto-rerouting to in-stock item',
    prompt: 'Buy Ultrahuman Ring AIR titanium smart tracker',
    badge: 'Graceful Recovery',
    badgeColor: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
    simulatedFailure: 'OUT_OF_STOCK',
  },
];

export const LiveArena: React.FC<LiveArenaProps> = ({
  onRunTransaction,
  lastOutcome,
  loading,
  onOpenStepUpModal,
}) => {
  const [inputPrompt, setInputPrompt] = useState('');
  const [includeBundles, setIncludeBundles] = useState(true);
  const [expandedSteps, setExpandedSteps] = useState<Record<number, boolean>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPrompt.trim() || loading) return;
    onRunTransaction(inputPrompt, { autoAcceptBundles: includeBundles });
  };

  const handlePresetClick = (preset: typeof PRESET_PROMPTS[0]) => {
    setInputPrompt(preset.prompt);
    onRunTransaction(preset.prompt, {
      autoAcceptBundles: preset.autoBundle || includeBundles,
      simulatedFailureMode: preset.simulatedFailure || 'NONE',
    });
  };

  const toggleStepExpand = (stepIdx: number) => {
    setExpandedSteps((prev) => ({ ...prev, [stepIdx]: !prev[stepIdx] }));
  };

  const getAgentBadge = (agent: string) => {
    switch (agent) {
      case 'BuyerAgent':
        return {
          icon: Bot,
          color: 'text-blue-400',
          bg: 'bg-blue-500/10 border-blue-500/20',
          name: 'Buyer Agent (UAP Concierge)',
        };
      case 'MerchantAgent':
        return {
          icon: Store,
          color: 'text-purple-400',
          bg: 'bg-purple-500/10 border-purple-500/20',
          name: 'Merchant Agent (Yield & Upsell)',
        };
      case 'SpendingEnclave':
        return {
          icon: ShieldCheck,
          color: 'text-amber-400',
          bg: 'bg-amber-500/10 border-amber-500/20',
          name: 'Bounded Spending Enclave',
        };
      case 'RazorpayGateway':
        return {
          icon: CreditCard,
          color: 'text-emerald-400',
          bg: 'bg-emerald-500/10 border-emerald-500/20',
          name: 'Razorpay Test Engine',
        };
      default:
        return {
          icon: Bot,
          color: 'text-slate-400',
          bg: 'bg-slate-500/10 border-slate-500/20',
          name: agent,
        };
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Interactive Prompt & Action Bar */}
      <div className="glass-panel p-6 sm:p-8 relative overflow-hidden border-[#0c83ff]/30 shadow-2xl shadow-[#0c83ff]/5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0c83ff]/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-3xl mb-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#0c83ff]/10 border border-[#0c83ff]/20 text-[#38bdf8] text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Autonomous Commerce Stream</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Tell the AI Agent what to purchase
          </h2>
          <p className="text-sm text-slate-400 mt-1.5">
            The Buyer Agent will query the machine-readable UAP catalog, negotiate discounts with the Merchant Agent, check the Bounded Spending Enclave, and execute checkout via Razorpay.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="relative mb-6">
          <div className="relative flex items-center">
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="e.g. Find me a mechanical keyboard under 4000 INR with quick Bangalore shipping..."
              className="w-full pl-5 pr-32 py-4 bg-[#090b10] border border-white/10 rounded-2xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#0c83ff] focus:ring-2 focus:ring-[#0c83ff]/20 text-sm sm:text-base font-medium shadow-inner transition-all"
            />
            <button
              type="submit"
              disabled={loading || !inputPrompt.trim()}
              className="absolute right-2 px-5 py-2.5 bg-gradient-to-r from-[#0c83ff] to-[#2563eb] hover:from-[#2563eb] hover:to-[#1d4ed8] text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-[#0c83ff]/30 flex items-center space-x-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <span>Reasoning...</span>
              ) : (
                <>
                  <span>Execute</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          <div className="flex items-center space-x-2 mt-3 text-xs text-slate-400">
            <label className="flex items-center space-x-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeBundles}
                onChange={(e) => setIncludeBundles(e.target.checked)}
                className="rounded border-slate-700 bg-slate-900 text-[#0c83ff] focus:ring-[#0c83ff]"
              />
              <span>Allow Merchant Agent to negotiate dynamic upsell bundle discounts (AOV Maximizer)</span>
            </label>
          </div>
        </form>

        {/* Quick-Fire Presets */}
        <div>
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            One-Click Test Scenarios (Buildathon Criteria Demos)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {PRESET_PROMPTS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handlePresetClick(preset)}
                className="text-left p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-[#0c83ff]/40 transition-all duration-200 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-0.5 text-[10px] font-mono font-semibold rounded-md border ${preset.badgeColor}`}>
                      {preset.badge}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-200 group-hover:text-[#38bdf8] transition-colors">
                    {preset.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                    {preset.desc}
                  </p>
                </div>
                <div className="mt-3 flex items-center text-[10px] font-bold text-[#0c83ff] space-x-1">
                  <span>Run Scenario</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Live Agent Reasoning Stream & Outcome Grid */}
      {lastOutcome && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Agent Reasoning Graph (7 cols) */}
          <div className="lg:col-span-7 glass-panel p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <Layers className="w-5 h-5 text-[#0c83ff]" />
                <h3 className="text-base font-bold text-white">Agent-to-Agent Execution Trace</h3>
              </div>
              <span className="text-xs font-mono text-slate-400">
                Tx: {lastOutcome.transactionId}
              </span>
            </div>

            {/* Steps Timeline */}
            <div className="space-y-3 pt-2">
              {lastOutcome.reasoningTrail.map((step, idx) => {
                const agentMeta = getAgentBadge(step.agent);
                const Icon = agentMeta.icon;
                const isExpanded = !!expandedSteps[idx];

                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#090b10]/90 border border-white/5 transition-all hover:border-white/10"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className={`w-8 h-8 rounded-lg ${agentMeta.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                          <Icon className={`w-4 h-4 ${agentMeta.color}`} />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-bold text-slate-300">
                              {agentMeta.name}
                            </span>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 bg-white/5 text-slate-400 rounded">
                              {step.action}
                            </span>
                            <span
                              className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded uppercase ${
                                step.status === 'SUCCESS'
                                  ? 'bg-emerald-500/20 text-emerald-300'
                                  : step.status === 'GATED'
                                  ? 'bg-amber-500/20 text-amber-300'
                                  : step.status === 'RECOVERED'
                                  ? 'bg-violet-500/20 text-violet-300'
                                  : 'bg-rose-500/20 text-rose-300'
                              }`}
                            >
                              {step.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 mt-1 font-sans leading-relaxed">
                            {step.detail}
                          </p>
                        </div>
                      </div>

                      {step.payload && (
                        <button
                          onClick={() => toggleStepExpand(idx)}
                          className="text-slate-500 hover:text-slate-300 p-1"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      )}
                    </div>

                    {/* Expandable JSON Payload */}
                    {isExpanded && step.payload && (
                      <div className="mt-3 p-2.5 rounded-lg bg-black/60 border border-white/5 text-[11px] font-mono text-emerald-400/90 overflow-x-auto max-h-48">
                        <pre>{JSON.stringify(step.payload, null, 2)}</pre>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Transaction Outcome & Razorpay Receipt (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Status Card */}
            <div className="glass-panel p-6 space-y-4 border-[#0c83ff]/30">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Settlement Status
                </span>
                <span
                  className={`px-2.5 py-1 text-xs font-mono font-bold rounded-lg border ${
                    lastOutcome.status === 'COMPLETED'
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                      : lastOutcome.status === 'STEP_UP_REQUIRED'
                      ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                      : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                  }`}
                >
                  {lastOutcome.status}
                </span>
              </div>

              {/* Step-Up Trigger Banner */}
              {lastOutcome.status === 'STEP_UP_REQUIRED' && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center space-y-3">
                  <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
                  <div>
                    <h4 className="text-sm font-bold text-amber-200">
                      Step-Up Authorization Gated
                    </h4>
                    <p className="text-xs text-amber-300/80 mt-1">
                      Transaction requires your biometric/OTP signature to proceed.
                    </p>
                  </div>
                  <button
                    onClick={onOpenStepUpModal}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black text-xs font-extrabold shadow-lg shadow-amber-500/20 transition-all"
                  >
                    Open Authorization Modal
                  </button>
                </div>
              )}

              {/* Product & Pricing Summary */}
              {lastOutcome.selectedProduct && lastOutcome.quote && (
                <div className="p-4 rounded-xl bg-[#090b10] border border-white/5 space-y-2.5 text-xs">
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <span className="text-slate-400">Selected Product</span>
                    <span className="font-semibold text-white truncate max-w-[180px]">
                      {lastOutcome.selectedProduct.name}
                    </span>
                  </div>
                  
                  {lastOutcome.quote.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-slate-300">
                      <span className="truncate max-w-[180px]">{item.name}</span>
                      <span className="font-mono">₹{item.unitPrice}</span>
                    </div>
                  ))}

                  {lastOutcome.quote.discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-400 font-medium">
                      <span>Negotiated Agent Savings</span>
                      <span className="font-mono">-₹{lastOutcome.quote.discountAmount}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-2 border-t border-white/10 text-sm font-bold">
                    <span className="text-white">Total Settled</span>
                    <span className="text-[#38bdf8] font-mono text-base">
                      ₹{lastOutcome.quote.netAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              {/* Razorpay Order & UPI Intent */}
              {lastOutcome.razorpayOrder && (
                <div className="p-4 rounded-xl bg-gradient-to-b from-[#0c83ff]/10 to-transparent border border-[#0c83ff]/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="w-4 h-4 text-[#0c83ff]" />
                      <span className="text-xs font-bold text-slate-200">Razorpay Test Order</span>
                    </div>
                    <span className="text-[10px] font-mono bg-[#0c83ff]/20 text-[#38bdf8] px-2 py-0.5 rounded">
                      {lastOutcome.razorpayOrder.id}
                    </span>
                  </div>

                  {lastOutcome.upiQr && (
                    <div className="flex items-center space-x-3 p-2 rounded-lg bg-black/40 border border-white/5">
                      <img
                        src={lastOutcome.upiQr.qrDataUrl}
                        alt="UPI QR"
                        className="w-14 h-14 rounded bg-white p-1"
                      />
                      <div className="text-[11px] space-y-1">
                        <div className="font-semibold text-slate-200">NPCI / UPI Intent URI</div>
                        <div className="text-slate-400 font-mono truncate max-w-[200px]">
                          {lastOutcome.upiQr.upiUri}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Cryptographic AP2 Receipt */}
              {lastOutcome.receipt && (
                <div className="p-3.5 rounded-xl bg-[#090b10] border border-emerald-500/20 text-[11px] font-mono space-y-1">
                  <div className="flex items-center space-x-1.5 text-emerald-400 font-bold mb-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>AP2 Cryptographic Settlement Confirmed</span>
                  </div>
                  <div className="text-slate-400 truncate">
                    <span className="text-slate-500">Receipt:</span> {lastOutcome.receipt.receiptId}
                  </div>
                  <div className="text-slate-400 truncate">
                    <span className="text-slate-500">Enclave Hash:</span> {lastOutcome.receipt.auditEnclaveHash.slice(0, 24)}...
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      )}

    </div>
  );
};
