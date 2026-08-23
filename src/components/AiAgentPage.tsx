import React, { useState } from 'react';
import {
  ShoppingBag,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Truck,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { AgentTransactionOutcome } from '../types';
import { RazorpayCheckoutWidget } from './RazorpayCheckoutWidget';
import { OrderFulfillmentModal } from './OrderFulfillmentModal';

interface AiAgentPageProps {
  onRunTransaction: (prompt: string, options?: any) => Promise<AgentTransactionOutcome>;
  lastOutcome: AgentTransactionOutcome | null;
  loading: boolean;
  onOpenStepUpModal: () => void;
}

const QUICK_ITEMS = [
  {
    label: 'Nike Running Shoes (under ₹2,000)',
    desc: 'Auto-approved instantly within your ₹2,000 limit',
    prompt: 'Search Amazon for running shoes under ₹2,000',
  },
  {
    label: 'Keychron Mechanical Keyboard (₹3,509)',
    desc: 'Over ₹2,000 limit — will ask for your approval',
    prompt: 'Order Keychron Q1 Pro custom mechanical keyboard',
  },
  {
    label: 'USB-C Hub + Cable Bundle (25% Discount)',
    desc: 'Finds verified multi-item bundle deals',
    prompt: 'Buy Anker 7-in-1 USB-C Hub and bundle with 100W braided cable',
  },
];

export const AiAgentPage: React.FC<AiAgentPageProps> = ({
  onRunTransaction,
  lastOutcome,
  loading,
  onOpenStepUpModal,
}) => {
  const [prompt, setPrompt] = useState('Search Amazon for running shoes under ₹2,000');
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const [isFulfillmentOpen, setIsFulfillmentOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;
    onRunTransaction(prompt, { autoAcceptBundles: true });
  };

  const handleSelectQuick = (p: typeof QUICK_ITEMS[0]) => {
    setPrompt(p.prompt);
    onRunTransaction(p.prompt, { autoAcceptBundles: true });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200 max-w-4xl">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white">Buy</h1>
        <p className="text-sm text-slate-400 mt-1">
          Tell us what to buy. We will check your spending rules and complete the payment safely.
        </p>
      </div>

      {/* Main Buy Input Card */}
      <section className="fintech-card p-6 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block text-xs font-bold text-slate-300">
            What would you like to buy?
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. Running shoes under ₹2,000"
                className="w-full pl-10 pr-4 py-3 bg-[#090d16] border border-white/[0.08] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#0c83ff]"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="px-8 py-3 bg-[#0c83ff] hover:bg-[#0270e0] text-white text-sm font-bold rounded-xl shadow-sm flex items-center space-x-2 transition-all disabled:opacity-50"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{loading ? 'Finding & Paying...' : 'Buy'}</span>
            </button>
          </div>
        </form>

        {/* Quick Suggestions */}
        <div className="space-y-2">
          <div className="text-xs text-slate-400 font-medium">Or try an example:</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {QUICK_ITEMS.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectQuick(item)}
                disabled={loading}
                className="p-3 text-left rounded-xl bg-[#090d16] border border-white/[0.05] hover:border-white/[0.12] hover:bg-white/[0.02] transition-all group"
              >
                <div className="text-xs font-bold text-slate-200 group-hover:text-white">{item.label}</div>
                <div className="text-[11px] text-slate-400 mt-1">{item.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Result Card */}
      {lastOutcome && (
        <section className="fintech-card p-6 space-y-5 animate-in fade-in">
          
          {/* Status Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.07]">
            <div className="flex items-center space-x-3">
              {lastOutcome.status === 'COMPLETED' && (
                <div className="w-9 h-9 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              )}
              {lastOutcome.status === 'STEP_UP_REQUIRED' && (
                <div className="w-9 h-9 rounded-full bg-amber-500/15 text-amber-400 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5" />
                </div>
              )}
              {lastOutcome.status === 'POLICY_BLOCKED' && (
                <div className="w-9 h-9 rounded-full bg-rose-500/15 text-rose-400 flex items-center justify-center">
                  <XCircle className="w-5 h-5" />
                </div>
              )}

              <div>
                <h3 className="text-base font-bold text-white">
                  {lastOutcome.status === 'COMPLETED' && 'Paid successfully with Razorpay'}
                  {lastOutcome.status === 'STEP_UP_REQUIRED' && 'Needs your approval to complete'}
                  {lastOutcome.status === 'POLICY_BLOCKED' && 'Blocked by your spending limits'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {lastOutcome.status === 'COMPLETED' && 'Order confirmed and dispatched for courier delivery.'}
                  {lastOutcome.status === 'STEP_UP_REQUIRED' && 'This item is over your ₹2,000 auto-approval limit.'}
                  {lastOutcome.status === 'POLICY_BLOCKED' && 'The requested item exceeds your daily budget.'}
                </p>
              </div>
            </div>

            <div className="text-right">
              {lastOutcome.quote && (
                <div className="text-xl font-bold text-white font-mono">
                  ₹{lastOutcome.quote.netAmount.toLocaleString()}
                </div>
              )}
            </div>
          </div>

          {/* Product Details Box */}
          {lastOutcome.selectedProduct && (
            <div className="p-4 rounded-xl bg-[#090d16] border border-white/[0.05] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-xs text-slate-400">Item found</div>
                <div className="text-sm font-bold text-white">{lastOutcome.selectedProduct.name}</div>
                <div className="text-xs text-slate-400">
                  Store: <strong className="text-slate-300">{lastOutcome.selectedProduct.merchantName || 'Amazon India'}</strong>
                </div>
              </div>

              {lastOutcome.status === 'COMPLETED' && (
                <button
                  onClick={() => setIsFulfillmentOpen(true)}
                  className="px-4 py-2.5 bg-white/[0.06] hover:bg-white/[0.1] text-white text-xs font-bold rounded-lg border border-white/[0.08] flex items-center space-x-2 transition-all self-start sm:self-auto"
                >
                  <Truck className="w-4 h-4 text-emerald-400" />
                  <span>Track package</span>
                </button>
              )}

              {lastOutcome.status === 'STEP_UP_REQUIRED' && (
                <button
                  onClick={onOpenStepUpModal}
                  className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-lg transition-all self-start sm:self-auto"
                >
                  Approve purchase
                </button>
              )}
            </div>
          )}

          {/* Razorpay Test Modal Trigger */}
          {lastOutcome.status === 'COMPLETED' && (
            <RazorpayCheckoutWidget outcome={lastOutcome} />
          )}

          {/* Progressive Disclosure: Technical Verification Details */}
          <div className="pt-2">
            <button
              onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center space-x-1.5 transition-colors"
            >
              <span>{showTechnicalDetails ? 'Hide technical details' : 'Why was this allowed? (Technical details)'}</span>
              {showTechnicalDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showTechnicalDetails && (
              <div className="mt-3 p-4 rounded-xl bg-[#090d16] border border-white/[0.05] space-y-2 text-xs font-mono text-slate-300 animate-in fade-in">
                <div className="text-slate-500 uppercase text-[10px] font-bold">Verification Steps</div>
                {lastOutcome.reasoningTrail.map((step) => (
                  <div key={step.step} className="flex items-start space-x-2 py-1 border-b border-white/[0.03] last:border-0">
                    <span className="text-[#0c83ff] font-bold">✓</span>
                    <div>
                      <strong className="text-white">{step.action}:</strong> {step.detail}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </section>
      )}

      {isFulfillmentOpen && lastOutcome && (
        <OrderFulfillmentModal outcome={lastOutcome} onClose={() => setIsFulfillmentOpen(false)} />
      )}

    </div>
  );
};
