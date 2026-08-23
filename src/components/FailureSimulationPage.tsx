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
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Failure Simulation Studio</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            "Show the audit trail and one failure handled gracefully." Verify autonomous edge-case containment.
          </p>
        </div>
      </div>

      {/* Scenarios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Scenario 1: Stockout & Graceful Alternative */}
        <div
          onClick={() => setSelectedScenario('OUT_OF_STOCK')}
          className={`fintech-card p-6 flex flex-col justify-between space-y-4 cursor-pointer transition-all ${
            selectedScenario === 'OUT_OF_STOCK' ? 'border-[#0c83ff]/60 bg-[#111728]' : ''
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <PackageX className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/20">
                Graceful Alternative
              </span>
            </div>

            <h3 className="text-sm font-bold text-white mb-1.5">
              1. Product Out of Stock
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Target item goes out of stock during checkout. AgentPay autonomously searches catalog, finds an equivalent in-stock item within budget, and requests approval.
            </p>

            <div className="p-3 rounded-lg bg-[#090d16] border border-white/[0.04] text-[11px] font-mono space-y-1 text-slate-300">
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
            className="w-full py-2 px-3 rounded-lg bg-[#0c83ff] hover:bg-[#0270e0] text-white text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all disabled:opacity-50"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Simulate Stockout Flow</span>
          </button>
        </div>

        {/* Scenario 2: Price Surge / Limit Exceeded */}
        <div
          onClick={() => setSelectedScenario('PRICE_SURGE')}
          className={`fintech-card p-6 flex flex-col justify-between space-y-4 cursor-pointer transition-all ${
            selectedScenario === 'PRICE_SURGE' ? 'border-[#0c83ff]/60 bg-[#111728]' : ''
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <TrendingUp className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/20">
                Step-Up Gate
              </span>
            </div>

            <h3 className="text-sm font-bold text-white mb-1.5">
              2. Price Surge / Limit Exceeded
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Price changes mid-flight from ₹1,899 to ₹2,499. Because ₹2,499 exceeds the ₹2,000 autonomous threshold, the payment is strictly gated for user authorization.
            </p>

            <div className="p-3 rounded-lg bg-[#090d16] border border-white/[0.04] text-[11px] font-mono space-y-1 text-slate-300">
              <div className="text-slate-400">Original: ₹1,899 ≤ ₹2,000</div>
              <div className="text-amber-400">Surge: ₹2,499 &gt; ₹2,000 (Gated)</div>
            </div>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={(e) => {
              e.stopPropagation();
              onRunFailureScenario('PRICE_SURGE');
            }}
            className="w-full py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold flex items-center justify-center space-x-1.5 transition-all disabled:opacity-50"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Simulate Price Surge</span>
          </button>
        </div>

        {/* Scenario 3: Daily Spending Ceiling Breach */}
        <div
          onClick={() => setSelectedScenario('BUDGET_BREACH')}
          className={`fintech-card p-6 flex flex-col justify-between space-y-4 cursor-pointer transition-all ${
            selectedScenario === 'BUDGET_BREACH' ? 'border-[#0c83ff]/60 bg-[#111728]' : ''
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <Ban className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-500/15 text-rose-300 border border-rose-500/20">
                Ceiling Block
              </span>
            </div>

            <h3 className="text-sm font-bold text-white mb-1.5">
              3. Cumulative Ceiling Breach
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              An agent attempts an expensive enterprise cluster purchase (₹99,999) that violates the daily cumulative ceiling. The Enclave halts checkout before any order is generated.
            </p>

            <div className="p-3 rounded-lg bg-[#090d16] border border-white/[0.04] text-[11px] font-mono space-y-1 text-slate-300">
              <div className="text-slate-400">Daily Ceiling: ₹15,000</div>
              <div className="text-rose-400">Attempted: ₹99,999 (Blocked ✗)</div>
            </div>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={(e) => {
              e.stopPropagation();
              onRunFailureScenario('BUDGET_BREACH');
            }}
            className="w-full py-2 px-3 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-200 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all disabled:opacity-50"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Simulate Ceiling Breach</span>
          </button>
        </div>

      </div>

    </div>
  );
};
