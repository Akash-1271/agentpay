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
  Search,
  Sparkles,
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
    label: 'Nike Running Shoes (≤ ₹2,000)',
    desc: 'Auto-approved instantly within your ₹2,000 threshold',
    prompt: 'Search Amazon for running shoes under ₹2,000',
  },
  {
    label: 'Keychron Mechanical Keyboard (₹3,509)',
    desc: 'Over ₹2,000 threshold — triggers Biometric Passkey gating',
    prompt: 'Order Keychron Q1 Pro custom mechanical keyboard',
  },
  {
    label: 'USB-C Hub + Cable Bundle (25% Off)',
    desc: 'AI merchant engine applies automatic multi-item bundle deals',
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
    <div className="space-y-10 animate-in max-w-4xl">
      
      {/* Header */}
      <div>
        <div className="luxury-eyebrow mb-2">
          Autonomous Buyer
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#1A1A1A] tracking-tight">
          Purchase & Order Execution
        </h1>
        <p className="text-xs sm:text-sm text-[#6C6863] mt-1.5 font-sans leading-relaxed">
          Specify your shopping intent in natural language. The agent searches canonical catalogs, evaluates spending enclaves, and settles via Razorpay.
        </p>
      </div>

      {/* Main Buy Input Card with Refined Underline Form */}
      <section className="luxury-card space-y-6">
        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block text-[11px] font-sans font-semibold text-[#1A1A1A] uppercase tracking-[0.2em]">
            What item would you like to purchase?
          </label>
          <div className="flex flex-col sm:flex-row gap-4 pt-1">
            <div className="luxury-input-wrapper flex-1">
              <Search className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. Search Amazon for running shoes under ₹2,000"
                className="luxury-input text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="luxury-btn-primary px-8 h-12 text-xs shrink-0"
            >
              <ShoppingBag className="w-4 h-4 shrink-0" />
              <span>{loading ? 'Transacting...' : 'Buy'}</span>
            </button>
          </div>
        </form>

        {/* Quick Suggestions */}
        <div className="space-y-3 pt-3 border-t border-[#1A1A1A]/10">
          <div className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#6C6863] font-semibold">
            Curated Example Intents:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {QUICK_ITEMS.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectQuick(item)}
                disabled={loading}
                className="p-4 text-left border border-[#1A1A1A]/12 hover:border-[#1A1A1A] bg-[#FAF8F5] hover:bg-[#FFFFFF] transition-all duration-500 group shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
              >
                <div className="font-serif text-xs font-bold text-[#1A1A1A] group-hover:text-[#D4AF37] transition-colors duration-300">
                  {item.label}
                </div>
                <div className="text-[11px] text-[#6C6863] mt-1.5 leading-snug font-sans">
                  {item.desc}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Result Card with Editorial Geometry */}
      {lastOutcome && (
        <section className="luxury-card space-y-6 animate-in">
          
          {/* Status Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#1A1A1A]/12">
            <div className="flex items-center space-x-4">
              {lastOutcome.status === 'COMPLETED' && (
                <div className="w-9 h-9 flex items-center justify-center border border-emerald-600/40 bg-emerald-50 text-emerald-700">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              )}
              {lastOutcome.status === 'STEP_UP_REQUIRED' && (
                <div className="w-9 h-9 flex items-center justify-center border border-amber-600/40 bg-amber-50 text-amber-700">
                  <AlertCircle className="w-4 h-4" />
                </div>
              )}
              {lastOutcome.status === 'REJECTED_POLICY' && (
                <div className="w-9 h-9 flex items-center justify-center border border-rose-600/40 bg-rose-50 text-rose-700">
                  <XCircle className="w-4 h-4" />
                </div>
              )}

              <div>
                <h3 className="font-serif text-lg text-[#1A1A1A] font-semibold tracking-tight">
                  {lastOutcome.status === 'COMPLETED' && 'Settled Successfully via Razorpay'}
                  {lastOutcome.status === 'FAILED_RECOVERED' && 'Recovered & Settled with In-Stock Alternative'}
                  {lastOutcome.status === 'STEP_UP_REQUIRED' && 'Human Authorization Required'}
                  {lastOutcome.status === 'REJECTED_POLICY' && 'Blocked by Spending Mandate'}
                </h3>
                <p className="text-xs text-[#6C6863] mt-0.5 font-sans">
                  {lastOutcome.status === 'COMPLETED' && 'Order confirmed and registered for courier logistics.'}
                  {lastOutcome.status === 'FAILED_RECOVERED' && 'Original item was out-of-stock; agent autonomously substituted verified in-stock equivalent.'}
                  {lastOutcome.status === 'STEP_UP_REQUIRED' && 'Transaction exceeds single-purchase autonomous limit.'}
                  {lastOutcome.status === 'REJECTED_POLICY' && 'Exceeds authorized daily ceiling or merchant policy.'}
                </p>
              </div>
            </div>

            <div className="text-right">
              {lastOutcome.quote && (
                <div className="font-serif text-3xl font-bold text-[#1A1A1A]">
                  ₹{lastOutcome.quote.netAmount.toLocaleString()}
                </div>
              )}
            </div>
          </div>

          {/* Product Details Frame */}
          {lastOutcome.selectedProduct && (
            <div className="p-5 border border-[#1A1A1A]/12 bg-[#FAF8F5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-[10px] font-sans font-semibold text-[#6C6863] uppercase tracking-[0.2em]">Item Selected & Locked</div>
                <div className="font-serif text-base font-bold text-[#1A1A1A]">{lastOutcome.selectedProduct.name}</div>
                <div className="text-xs text-[#6C6863] font-sans">
                  Store: <strong className="text-[#1A1A1A]">{lastOutcome.selectedProduct.merchantName || 'Amazon India'}</strong>
                </div>
              </div>

              {lastOutcome.status === 'COMPLETED' && (
                <button
                  onClick={() => setIsFulfillmentOpen(true)}
                  className="luxury-btn-secondary text-xs h-10 px-5 self-start sm:self-auto"
                >
                  <Truck className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Track Package</span>
                </button>
              )}

              {lastOutcome.status === 'STEP_UP_REQUIRED' && (
                <button
                  onClick={onOpenStepUpModal}
                  className="luxury-btn-primary text-xs h-10 px-6 self-start sm:self-auto"
                >
                  Authorize Order
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
              className="font-sans text-xs text-[#1A1A1A] hover:text-[#D4AF37] flex items-center space-x-1.5 tracking-wider uppercase font-semibold transition-colors"
            >
              <span>{showTechnicalDetails ? 'Hide Verification Trail' : 'Why was this allowed? (Audit Trail)'}</span>
              {showTechnicalDetails ? <ChevronUp className="w-3.5 h-3.5 text-[#D4AF37]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#D4AF37]" />}
            </button>

            {showTechnicalDetails && (
              <div className="mt-3 p-5 border border-[#1A1A1A]/15 bg-[#1A1A1A] text-[#F9F8F6] space-y-2 text-xs font-mono animate-in shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
                <div className="text-[#D4AF37] uppercase text-[10px] font-bold tracking-widest pb-1 border-b border-white/10">
                  AP2 Protocol Cryptographic Reasoning Steps
                </div>
                {lastOutcome.reasoningTrail.map((step) => (
                  <div key={step.step} className="flex items-start space-x-2 py-1.5 border-b border-white/[0.06] last:border-0">
                    <span className="text-[#D4AF37] font-bold">◆</span>
                    <div>
                      <strong className="text-[#D4AF37]">{step.action}:</strong> {step.detail}
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

