import React, { useState } from 'react';
import { AlertOctagon, ShieldAlert, RotateCcw, CheckCircle2, ArrowRight, Zap, Ban, PackageX } from 'lucide-react';
import { AgentTransactionOutcome } from '../types';

interface FailureSimulatorProps {
  onRunFailureTest: (type: 'OUT_OF_STOCK' | 'BUDGET_BREACH' | 'PROHIBITED_MERCHANT' | 'CATEGORY_DISALLOWED') => void;
  lastOutcome: AgentTransactionOutcome | null;
  loading: boolean;
}

export const FailureSimulator: React.FC<FailureSimulatorProps> = ({
  onRunFailureTest,
  lastOutcome,
  loading,
}) => {
  const [selectedFailure, setSelectedFailure] = useState<string>('OUT_OF_STOCK');

  const FAILURE_SCENARIOS = [
    {
      id: 'OUT_OF_STOCK',
      title: 'Scenario 1: Out-of-Stock Fallback & Graceful Recovery',
      tag: 'Graceful Fallback',
      tagColor: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
      icon: PackageX,
      description:
        'The Buyer Agent attempts to purchase the Ultrahuman Ring AIR (0 stock). The Merchant Agent signals stockout, and the Buyer Agent autonomously discovers and re-negotiates an in-stock equivalent without crashing.',
      expectedBehavior: 'Autonomous alternative discovery + zero financial leakage.',
    },
    {
      id: 'BUDGET_BREACH',
      title: 'Scenario 2: Cumulative Daily Spending Ceiling Breach',
      tag: 'Bounded Enclave Block',
      tagColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      icon: ShieldAlert,
      description:
        'An agent attempts an expensive enterprise cluster purchase (₹99,999) that violates the daily cumulative ceiling. The Bounded Enclave halts checkout before any payment order is generated.',
      expectedBehavior: 'Rejection with mathematical reason + Immutable audit trail.',
    },
    {
      id: 'PROHIBITED_MERCHANT',
      title: 'Scenario 3: Untrusted / Unwhitelisted Merchant Detection',
      tag: 'Security Containment',
      tagColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      icon: Ban,
      description:
        'An external agent tries to route funds to an unknown rogue merchant ID ("merch_untrusted_node"). The Spending Enclave rejects the mandate signature immediately.',
      expectedBehavior: 'Strict merchant whitelist defense.',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-rose-500/20">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold mb-3">
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>Razorpay Hackathon Criteria Validator</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            Failure Containment & Graceful Recovery Studio
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            "Show the audit trail and one failure handled gracefully." Test how AgentPay prevents hallucinations and safely handles edge cases.
          </p>
        </div>
      </div>

      {/* Scenario Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {FAILURE_SCENARIOS.map((scen) => {
          const Icon = scen.icon;
          const isSelected = selectedFailure === scen.id;

          return (
            <div
              key={scen.id}
              onClick={() => setSelectedFailure(scen.id)}
              className={`glass-panel-interactive p-6 flex flex-col justify-between cursor-pointer ${
                isSelected ? 'border-rose-500/60 ring-2 ring-rose-500/20' : ''
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${scen.tagColor}`}>
                    {scen.tag}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white mb-2">
                  {scen.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {scen.description}
                </p>
              </div>

              <div>
                <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 text-[11px] text-slate-300 mb-4">
                  <span className="text-slate-500 font-mono">Expected: </span>
                  {scen.expectedBehavior}
                </div>

                <button
                  type="button"
                  disabled={loading}
                  onClick={(e) => {
                    e.stopPropagation();
                    onRunFailureTest(scen.id as any);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-200 text-xs font-bold flex items-center justify-center space-x-2 transition-all"
                >
                  <RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span>Trigger Simulation</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
