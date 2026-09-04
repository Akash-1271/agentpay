import React, { useState } from 'react';
import {
  AlertOctagon,
  ShieldAlert,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  PackageX,
  TrendingUp,
  Ban,
  Sparkles,
} from 'lucide-react';
import { AgentTransactionOutcome } from '../types';

interface FailureSimulationPageProps {
  onRunFailureScenario: (type: 'OUT_OF_STOCK' | 'PRICE_SURGE' | 'BUDGET_BREACH' | 'PROHIBITED_MERCHANT') => void;
  lastOutcome: AgentTransactionOutcome | null;
  loading: boolean;
}

export const FailureSimulationPage: React.FC<FailureSimulationPageProps> = ({
  onRunFailureScenario,
  lastOutcome,
  loading,
}) => {
  const [selectedScenario, setSelectedScenario] = useState<string>('OUT_OF_STOCK');

  return (
    <div className="space-y-10 animate-in max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#c9b8a0] mb-2 flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#a78b71] animate-pulse"></span>
            <span>Resilience Testing</span>
          </div>
          <h1 className="font-playfair italic text-3xl sm:text-4xl text-white tracking-tight">
            Failure Simulation & Edge Cases
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1.5 font-sans leading-relaxed">
            Show the audit trail and one failure handled gracefully. Verify autonomous edge-case containment.
          </p>
        </div>
      </div>

      {/* Scenarios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Scenario 1: Stockout & Graceful Alternative */}
        <div
          onClick={() => setSelectedScenario('OUT_OF_STOCK')}
          className={`glass-gold p-6 flex flex-col justify-between space-y-4 cursor-pointer transition-all duration-300 ${
            selectedScenario === 'OUT_OF_STOCK' ? 'border-t-2 border-t-[#c9b8a0] shadow-[0_0_40px_rgba(167,139,113,0.15)]' : 'hover:border-[#a78b71]/40'
          }`}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl border border-white/10 bg-white/[0.04] flex items-center justify-center text-[#c9b8a0]">
                <PackageX className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-mono uppercase font-bold px-2 py-0.5 border border-white/15 bg-white/[0.04] text-[#e8d5b7] rounded">
                Graceful Alternative
              </span>
            </div>

            <h3 className="font-playfair italic text-base font-bold text-white">
              1. Product Out of Stock
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed font-sans">
              Target item goes out of stock during checkout. AgentPay autonomously searches catalog, finds an equivalent in-stock item within budget, and requests approval.
            </p>

            <div className="p-3 bg-black/40 border border-white/10 rounded-xl text-[11px] font-mono space-y-1">
              <div className="text-rose-400">✗ Nike Running Shoes (0 stock)</div>
              <div className="text-emerald-400">✓ Alternative: Adidas Ultraboost (₹1,799)</div>
            </div>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={(e) => {
              e.stopPropagation();
              onRunFailureScenario('OUT_OF_STOCK');
            }}
            className="btn-gold-primary w-full text-xs h-10 flex items-center justify-center space-x-1.5"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Simulate Stockout Flow</span>
          </button>
        </div>

        {/* Scenario 2: Price Surge / Limit Exceeded */}
        <div
          onClick={() => setSelectedScenario('PRICE_SURGE')}
          className={`glass-gold p-6 flex flex-col justify-between space-y-4 cursor-pointer transition-all duration-300 ${
            selectedScenario === 'PRICE_SURGE' ? 'border-t-2 border-t-[#c9b8a0] shadow-[0_0_40px_rgba(167,139,113,0.15)]' : 'hover:border-[#a78b71]/40'
          }`}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-center justify-center text-amber-300">
                <TrendingUp className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-mono uppercase font-bold px-2 py-0.5 border border-amber-500/30 bg-amber-500/10 text-amber-300 rounded">
                Step-Up Gate
              </span>
            </div>

            <h3 className="font-playfair italic text-base font-bold text-white">
              2. Price Surge / Limit Exceeded
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed font-sans">
              Price changes mid-flight from ₹1,899 to ₹2,499. Because ₹2,499 exceeds the ₹2,000 autonomous threshold, the payment is strictly gated for user authorization.
            </p>

            <div className="p-3 bg-black/40 border border-white/10 rounded-xl text-[11px] font-mono space-y-1">
              <div className="text-stone-400">Original: ₹1,899 ≤ ₹2,000</div>
              <div className="text-amber-300 font-bold">Surge: ₹2,499 &gt; ₹2,000 (Gated)</div>
            </div>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={(e) => {
              e.stopPropagation();
              onRunFailureScenario('PRICE_SURGE');
            }}
            className="btn-gold-secondary w-full text-xs h-10 flex items-center justify-center space-x-1.5"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Simulate Price Surge</span>
          </button>
        </div>

        {/* Scenario 3: Daily Spending Ceiling Breach */}
        <div
          onClick={() => setSelectedScenario('BUDGET_BREACH')}
          className={`glass-gold p-6 flex flex-col justify-between space-y-4 cursor-pointer transition-all duration-300 ${
            selectedScenario === 'BUDGET_BREACH' ? 'border-t-2 border-t-rose-500/60 shadow-[0_0_40px_rgba(244,63,94,0.15)]' : 'hover:border-rose-500/30'
          }`}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl border border-rose-500/30 bg-rose-500/10 flex items-center justify-center text-rose-400">
                <Ban className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-mono uppercase font-bold px-2 py-0.5 border border-rose-500/30 bg-rose-500/10 text-rose-300 rounded">
                Ceiling Block
              </span>
            </div>

            <h3 className="font-playfair italic text-base font-bold text-white">
              3. Cumulative Ceiling Breach
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed font-sans">
              An agent attempts an expensive enterprise cluster purchase (₹99,999) that violates the daily cumulative ceiling. The Enclave halts checkout before any order is generated.
            </p>

            <div className="p-3 bg-black/40 border border-white/10 rounded-xl text-[11px] font-mono space-y-1">
              <div className="text-stone-400">Daily Ceiling: ₹25,000</div>
              <div className="text-rose-400 font-bold">Attempted: ₹99,999 (Blocked ✗)</div>
            </div>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={(e) => {
              e.stopPropagation();
              onRunFailureScenario('BUDGET_BREACH');
            }}
            className="border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 w-full text-xs h-10 flex items-center justify-center space-x-1.5 transition-colors font-mono uppercase tracking-wider rounded-xl font-semibold"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Simulate Ceiling Breach</span>
          </button>
        </div>
      </div>
    </div>
  );
};

