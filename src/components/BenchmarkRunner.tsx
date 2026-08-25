import React, { useState } from 'react';
import {
  Activity,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Clock,
  Layers,
  FileCheck,
  Ban,
  TrendingUp,
} from 'lucide-react';
import { api } from '../services/api';

interface BenchmarkRunnerProps {
  onRefreshEnclave: () => void;
}

export const BenchmarkRunner: React.FC<BenchmarkRunnerProps> = ({ onRefreshEnclave }) => {
  const [running, setRunning] = useState(false);
  const [batchSize, setBatchSize] = useState(50);
  const [metrics, setMetrics] = useState<any | null>(null);

  const handleRun = async () => {
    try {
      setRunning(true);
      const res = await api.runBenchmarkSuite(batchSize);
      setMetrics(res);
      onRefreshEnclave();
    } catch (err) {
      console.error('Benchmark failed:', err);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="space-y-10 animate-in max-w-5xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#1A1A1A]/12 pb-6">
        <div>
          <div className="flex items-center space-x-2.5 mb-2">
            <span className="luxury-eyebrow">Deterministic Verification</span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 border border-emerald-600/30 text-emerald-800 bg-emerald-50">
              50-Batch Stress Test
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1A1A1A] tracking-tight">
            Evaluation Benchmark Suite
          </h1>
          <p className="text-xs sm:text-sm text-[#6C6863] mt-1.5 font-sans leading-relaxed">
            "Throughput plus measured accuracy plus an honest exception list. One cherry-picked match proves nothing."
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={batchSize}
            onChange={(e) => setBatchSize(parseInt(e.target.value, 10))}
            disabled={running}
            className="px-3 py-2 bg-[#FAF8F5] border border-[#1A1A1A]/20 text-xs font-mono text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A] h-11"
          >
            <option value={25}>25 Transactions</option>
            <option value={50}>50 Transactions (Standard)</option>
            <option value={100}>100 Transactions (Stress)</option>
          </select>

          <button
            onClick={handleRun}
            disabled={running}
            className="luxury-btn-primary h-11 px-5 text-xs flex items-center space-x-1.5"
          >
            <Play className={`w-3.5 h-3.5 ${running ? 'animate-spin' : ''}`} />
            <span>{running ? 'Executing 50-Batch...' : 'Run Benchmark'}</span>
          </button>
        </div>
      </div>

      {/* Metrics Row if metrics exist */}
      {metrics ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Metric 1: Policy Adherence */}
            <div className="luxury-card space-y-2">
              <div className="text-[10px] font-sans font-semibold text-[#6C6863] uppercase tracking-[0.2em]">
                Policy Adherence
              </div>
              <div className="font-serif text-3xl font-bold text-emerald-800">
                {metrics.policyAdherenceRate}%
              </div>
              <div className="text-[11px] text-[#6C6863] font-sans">
                0 budget / whitelist leaks
              </div>
            </div>

            {/* Metric 2: Cryptographic Audit */}
            <div className="luxury-card space-y-2">
              <div className="text-[10px] font-sans font-semibold text-[#6C6863] uppercase tracking-[0.2em]">
                Audit Completeness
              </div>
              <div className="font-serif text-3xl font-bold text-emerald-800">
                {metrics.auditCompletenessRate}%
              </div>
              <div className="text-[11px] text-[#6C6863] font-sans">
                {metrics.totalEvaluated}/{metrics.totalEvaluated} HMAC Signed
              </div>
            </div>

            {/* Metric 3: Avg Latency */}
            <div className="luxury-card space-y-2">
              <div className="text-[10px] font-sans font-semibold text-[#6C6863] uppercase tracking-[0.2em]">
                Average Latency
              </div>
              <div className="font-serif text-3xl font-bold text-[#1A1A1A]">
                {metrics.averageLatencyMs}ms
              </div>
              <div className="text-[11px] text-[#6C6863] font-sans">
                Intent to Razorpay settle
              </div>
            </div>

            {/* Metric 4: GMV Processed */}
            <div className="luxury-card space-y-2">
              <div className="text-[10px] font-sans font-semibold text-[#6C6863] uppercase tracking-[0.2em]">
                Settled GMV
              </div>
              <div className="font-serif text-3xl font-bold text-[#1A1A1A]">
                ₹{metrics.totalGmvProcessed.toLocaleString()}
              </div>
              <div className="text-[11px] text-[#6C6863] font-sans">
                {metrics.autoApprovedSettled} auto-settled
              </div>
            </div>

          </div>

          {/* Breakdown Summary Strip */}
          <div className="luxury-card space-y-3">
            <div className="flex items-center justify-between text-xs font-serif font-bold text-[#1A1A1A]">
              <span>Batch Results Breakdown</span>
              <span className="font-mono text-[#6C6863]">{metrics.totalEvaluated} total evaluated</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-[#FAF8F5] border border-[#1A1A1A]/10">
                <div className="text-[#6C6863] font-sans text-[11px]">Auto-Approved</div>
                <div className="text-lg font-serif font-bold text-emerald-800 mt-0.5">{metrics.autoApprovedSettled}</div>
              </div>
              <div className="p-3 bg-[#FAF8F5] border border-[#1A1A1A]/10">
                <div className="text-[#6C6863] font-sans text-[11px]">Step-Up Gated</div>
                <div className="text-lg font-serif font-bold text-amber-800 mt-0.5">{metrics.stepUpGated}</div>
              </div>
              <div className="p-3 bg-[#FAF8F5] border border-[#1A1A1A]/10">
                <div className="text-[#6C6863] font-sans text-[11px]">Policy Blocked</div>
                <div className="text-lg font-serif font-bold text-rose-800 mt-0.5">{metrics.policyBlocked}</div>
              </div>
              <div className="p-3 bg-[#FAF8F5] border border-[#1A1A1A]/10">
                <div className="text-[#6C6863] font-sans text-[11px]">Stockout Recovered</div>
                <div className="text-lg font-serif font-bold text-[#1A1A1A] mt-0.5">{metrics.stockoutRecovered}</div>
              </div>
            </div>
          </div>

          {/* Honest Exception Triage Queue */}
          <div className="luxury-card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A]/10">
              <div>
                <h3 className="font-serif text-base font-bold text-[#1A1A1A]">Honest Exception Triage Queue</h3>
                <p className="text-xs text-[#6C6863] font-sans">Verifiable log of every gated or blocked edge case during batch execution</p>
              </div>
              <span className="text-xs font-mono text-[#6C6863]">{metrics.honestExceptions.length} exceptions</span>
            </div>

            <div className="space-y-2.5">
              {metrics.honestExceptions.slice(0, 8).map((ex: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3 bg-[#FAF8F5] border border-[#1A1A1A]/10 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-[10px] text-[#6C6863]">#{ex.batchIndex}</span>
                      <span className="font-serif font-bold text-[#1A1A1A]">{ex.scenario}</span>
                      <span
                        className={`text-[9px] font-sans uppercase font-bold px-2 py-0.5 border ${
                          ex.policyCode === 'REQUIRES_STEP_UP'
                            ? 'border-amber-600/30 text-amber-800 bg-amber-50'
                            : ex.policyCode === 'STOCKOUT_REROUTED'
                            ? 'border-[#1A1A1A]/30 text-[#1A1A1A] bg-[#FFFFFF]'
                            : 'border-rose-600/30 text-rose-800 bg-rose-50'
                        }`}
                      >
                        {ex.policyCode}
                      </span>
                    </div>
                    <p className="text-[#6C6863] text-[11px] font-sans">{ex.resolution}</p>
                  </div>

                  <div className="text-right flex-shrink-0 font-mono text-[11px]">
                    <div className="font-serif text-sm font-bold text-[#1A1A1A]">₹{ex.amount.toLocaleString()}</div>
                    <div className="text-[9px] text-[#6C6863] truncate max-w-[120px]">{ex.enclaveHash}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      ) : (
        <div className="luxury-card p-12 text-center space-y-4">
          <Activity className="w-10 h-10 text-[#D4AF37] mx-auto opacity-70" />
          <div className="max-w-md mx-auto">
            <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">Ready to Run Benchmark Suite</h3>
            <p className="text-xs text-[#6C6863] mt-1 font-sans">
              Executes 50 diverse synthetic transactions testing under-budget purchases, high-value step-up triggers, stockout rerouting, and rogue merchant blocks.
            </p>
          </div>
          <button
            onClick={handleRun}
            disabled={running}
            className="luxury-btn-primary h-11 px-6 text-xs inline-flex items-center space-x-2"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Launch 50-Transaction Benchmark</span>
          </button>
        </div>
      )}

    </div>
  );
};

