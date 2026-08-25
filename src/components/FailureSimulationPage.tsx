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
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#1A1A1A]/12 pb-6">
        <div>
          <div className="luxury-eyebrow mb-2">Resilience Testing</div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1A1A1A] tracking-tight">
            Failure Simulation & Edge Cases
          </h1>
          <p className="text-xs sm:text-sm text-[#6C6863] mt-1.5 font-sans leading-relaxed">
            "Show the audit trail and one failure handled gracefully." Verify autonomous edge-case containment.
          </p>
        </div>
      </div>

      {/* Scenarios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Scenario 1: Stockout & Graceful Alternative */}
        <div
          onClick={() => setSelectedScenario('OUT_OF_STOCK')}
          className={`luxury-card flex flex-col justify-between space-y-4 cursor-pointer transition-all duration-300 ${
            selectedScenario === 'OUT_OF_STOCK' ? 'border-t-2 border-t-[#1A1A1A] shadow-[0_6px_20px_rgba(0,0,0,0.08)]' : ''
          }`}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 border border-[#1A1A1A]/20 bg-[#FAF8F5] flex items-center justify-center text-[#1A1A1A]">
                <PackageX className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <span className="text-[9px] font-sans uppercase font-bold px-2 py-0.5 border border-[#1A1A1A]/20 bg-[#FAF8F5] text-[#1A1A1A]">
                Graceful Alternative
              </span>
            </div>

            <h3 className="font-serif text-base font-bold text-[#1A1A1A]">
              1. Product Out of Stock
            </h3>
            <p className="text-xs text-[#6C6863] leading-relaxed font-sans">
              Target item goes out of stock during checkout. AgentPay autonomously searches catalog, finds an equivalent in-stock item within budget, and requests approval.
            </p>

            <div className="p-3 bg-[#FAF8F5] border border-[#1A1A1A]/10 text-[11px] font-mono space-y-1 text-[#1A1A1A]">
              <div className="text-rose-700">✗ Nike Running Shoes (0 stock)</div>
              <div className="text-emerald-700">✓ Alternative: Adidas Ultraboost (₹1,799)</div>
            </div>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={(e) => {
              e.stopPropagation();
              onRunFailureScenario('OUT_OF_STOCK');
            }}
            className="luxury-btn-primary w-full text-xs h-10 flex items-center justify-center space-x-1.5"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Simulate Stockout Flow</span>
          </button>
        </div>

        {/* Scenario 2: Price Surge / Limit Exceeded */}
        <div
          onClick={() => setSelectedScenario('PRICE_SURGE')}
          className={`luxury-card flex flex-col justify-between space-y-4 cursor-pointer transition-all duration-300 ${
            selectedScenario === 'PRICE_SURGE' ? 'border-t-2 border-t-[#D4AF37] shadow-[0_6px_20px_rgba(0,0,0,0.08)]' : ''
          }`}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 border border-amber-600/30 bg-amber-50 flex items-center justify-center text-amber-800">
                <TrendingUp className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-sans uppercase font-bold px-2 py-0.5 border border-amber-600/30 bg-amber-50 text-amber-800">
                Step-Up Gate
              </span>
            </div>

            <h3 className="font-serif text-base font-bold text-[#1A1A1A]">
              2. Price Surge / Limit Exceeded
            </h3>
            <p className="text-xs text-[#6C6863] leading-relaxed font-sans">
              Price changes mid-flight from ₹1,899 to ₹2,499. Because ₹2,499 exceeds the ₹2,000 autonomous threshold, the payment is strictly gated for user authorization.
            </p>

            <div className="p-3 bg-[#FAF8F5] border border-[#1A1A1A]/10 text-[11px] font-mono space-y-1 text-[#1A1A1A]">
              <div className="text-[#6C6863]">Original: ₹1,899 ≤ ₹2,000</div>
              <div className="text-amber-800 font-bold">Surge: ₹2,499 &gt; ₹2,000 (Gated)</div>
            </div>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={(e) => {
              e.stopPropagation();
              onRunFailureScenario('PRICE_SURGE');
            }}
            className="luxury-btn-secondary w-full text-xs h-10 flex items-center justify-center space-x-1.5"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Simulate Price Surge</span>
          </button>
        </div>

        {/* Scenario 3: Daily Spending Ceiling Breach */}
        <div
          onClick={() => setSelectedScenario('BUDGET_BREACH')}
          className={`luxury-card flex flex-col justify-between space-y-4 cursor-pointer transition-all duration-300 ${
            selectedScenario === 'BUDGET_BREACH' ? 'border-t-2 border-t-rose-800 shadow-[0_6px_20px_rgba(0,0,0,0.08)]' : ''
          }`}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 border border-rose-600/30 bg-rose-50 flex items-center justify-center text-rose-800">
                <Ban className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-sans uppercase font-bold px-2 py-0.5 border border-rose-600/30 bg-rose-50 text-rose-800">
                Ceiling Block
              </span>
            </div>

            <h3 className="font-serif text-base font-bold text-[#1A1A1A]">
              3. Cumulative Ceiling Breach
            </h3>
            <p className="text-xs text-[#6C6863] leading-relaxed font-sans">
              An agent attempts an expensive enterprise cluster purchase (₹99,999) that violates the daily cumulative ceiling. The Enclave halts checkout before any order is generated.
            </p>

            <div className="p-3 bg-[#FAF8F5] border border-[#1A1A1A]/10 text-[11px] font-mono space-y-1 text-[#1A1A1A]">
              <div className="text-[#6C6863]">Daily Ceiling: ₹15,000</div>
              <div className="text-rose-800 font-bold">Attempted: ₹99,999 (Blocked ✗)</div>
            </div>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={(e) => {
              e.stopPropagation();
              onRunFailureScenario('BUDGET_BREACH');
            }}
            className="border border-rose-600/30 text-rose-800 hover:bg-rose-50 w-full text-xs h-10 flex items-center justify-center space-x-1.5 transition-colors font-sans uppercase tracking-[0.15em] font-semibold"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Simulate Ceiling Breach</span>
          </button>
        </div>

      </div>

    </div>
  );
};

