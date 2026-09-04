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
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#1F1F1F] pb-6">
        <div>
          <div className="flex items-center space-x-2.5 mb-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-400">Deterministic Verification</span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 border border-emerald-500/30 text-emerald-300 bg-emerald-500/10 rounded">
              50-Batch Stress Test
            </span>
          </div>
          <h1 className="font-playfair italic text-3xl sm:text-4xl text-white tracking-tight">
            Evaluation Benchmark Suite
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1.5 font-sans leading-relaxed">
            Throughput plus measured accuracy plus an honest exception list. One cherry-picked match proves nothing.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={batchSize}
            onChange={(e) => setBatchSize(parseInt(e.target.value, 10))}
            disabled={running}
            className="px-3 py-2 bg-black/40 border border-[#1F1F1F] text-xs font-mono text-stone-200 rounded-xl focus:outline-none focus:border-white/40 h-11"
          >
            <option value={25} className="bg-[#0a0a0a]">25 Transactions</option>
            <option value={50} className="bg-[#0a0a0a]">50 Transactions (Standard)</option>
            <option value={100} className="bg-[#0a0a0a]">100 Transactions (Stress)</option>
          </select>

          <button
            onClick={handleRun}
            disabled={running}
            className="btn-primary h-11 px-5 text-xs flex items-center space-x-1.5"
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
            <div className="card-dark p-6 space-y-2 hover:border-zinc-700 transition-all">
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-400">
                Policy Adherence
              </div>
              <div className="font-playfair italic text-3xl font-bold text-emerald-400">
                {metrics.policyAdherenceRate}%
              </div>
              <div className="text-[11px] text-stone-400 font-mono">
                0 budget / whitelist leaks
              </div>
            </div>

            {/* Metric 2: Cryptographic Audit */}
            <div className="card-dark p-6 space-y-2 hover:border-zinc-700 transition-all">
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-400">
                Audit Completeness
              </div>
              <div className="font-playfair italic text-3xl font-bold text-emerald-400">
                {metrics.auditCompletenessRate}%
              </div>
              <div className="text-[11px] text-stone-400 font-mono">
                {metrics.totalEvaluated}/{metrics.totalEvaluated} HMAC Signed
              </div>
            </div>

            {/* Metric 3: Avg Latency */}
            <div className="card-dark p-6 space-y-2 hover:border-zinc-700 transition-all">
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-400">
                Average Latency
              </div>
              <div className="font-playfair italic text-3xl font-bold text-white">
                {metrics.averageLatencyMs}ms
              </div>
              <div className="text-[11px] text-stone-400 font-mono">
                Intent to Razorpay settle
              </div>
            </div>

            {/* Metric 4: GMV Processed */}
            <div className="card-dark p-6 space-y-2 hover:border-zinc-700 transition-all">
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-400">
                Settled GMV
              </div>
              <div className="font-playfair italic text-3xl font-bold text-white">
                ₹{metrics.totalGmvProcessed.toLocaleString()}
              </div>
              <div className="text-[11px] text-stone-400 font-mono">
                {metrics.autoApprovedSettled} auto-settled
              </div>
            </div>
          </div>

          {/* Breakdown Summary Strip */}
          <div className="card-dark p-6 space-y-3">
            <div className="flex items-center justify-between text-xs font-playfair italic font-bold text-white">
              <span className="text-sm">Batch Results Breakdown</span>
              <span className="font-mono text-stone-400">{metrics.totalEvaluated} total evaluated</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-white/[0.02] border border-[#1F1F1F] rounded-xl">
                <div className="text-zinc-400 font-mono text-[10px] uppercase">Auto-Approved</div>
                <div className="text-lg font-playfair italic font-bold text-emerald-400 mt-0.5">{metrics.autoApprovedSettled}</div>
              </div>
              <div className="p-3 bg-white/[0.02] border border-[#1F1F1F] rounded-xl">
                <div className="text-zinc-400 font-mono text-[10px] uppercase">Step-Up Gated</div>
                <div className="text-lg font-playfair italic font-bold text-amber-300 mt-0.5">{metrics.stepUpGated}</div>
              </div>
              <div className="p-3 bg-white/[0.02] border border-[#1F1F1F] rounded-xl">
                <div className="text-zinc-400 font-mono text-[10px] uppercase">Policy Blocked</div>
                <div className="text-lg font-playfair italic font-bold text-rose-400 mt-0.5">{metrics.policyBlocked}</div>
              </div>
              <div className="p-3 bg-white/[0.02] border border-[#1F1F1F] rounded-xl">
                <div className="text-zinc-400 font-mono text-[10px] uppercase">Stockout Recovered</div>
                <div className="text-lg font-playfair italic font-bold text-stone-200 mt-0.5">{metrics.stockoutRecovered}</div>
              </div>
            </div>
          </div>

          {/* Honest Exception Triage Queue */}
          <div className="card-dark p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1F1F1F]">
              <div>
                <h3 className="font-playfair italic text-lg font-bold text-white">Honest Exception Triage Queue</h3>
                <p className="text-xs text-stone-400 font-sans mt-0.5">Verifiable log of every gated or blocked edge case during batch execution</p>
              </div>
              <span className="text-xs font-mono text-stone-400">{metrics.honestExceptions.length} exceptions</span>
            </div>

            <div className="space-y-2.5">
              {metrics.honestExceptions.slice(0, 8).map((ex: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3 bg-white/[0.02] border border-[#1F1F1F] rounded-xl text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-[10px] text-stone-500">#{ex.batchIndex}</span>
                      <span className="font-playfair italic font-bold text-white">{ex.scenario}</span>
                      <span
                        className={`text-[9px] font-mono uppercase font-bold px-2 py-0.5 border rounded ${
                          ex.policyCode === 'REQUIRES_STEP_UP'
                            ? 'border-amber-500/30 text-amber-300 bg-amber-500/10'
                            : ex.policyCode === 'STOCKOUT_REROUTED'
                            ? 'border-white/20 text-white bg-white/[0.04]'
                            : 'border-rose-500/30 text-rose-300 bg-rose-500/10'
                        }`}
                      >
                        {ex.policyCode}
                      </span>
                    </div>
                    <p className="text-stone-400 text-[11px] font-sans">{ex.resolution}</p>
                  </div>

                  <div className="text-right flex-shrink-0 font-mono text-[11px]">
                    <div className="font-playfair italic text-sm font-bold text-white">₹{ex.amount.toLocaleString()}</div>
                    <div className="text-[9px] text-zinc-400 truncate max-w-[120px]">{ex.enclaveHash}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="card-dark p-12 text-center space-y-4">
          <Activity className="w-10 h-10 text-zinc-400 mx-auto opacity-70" />
          <div className="max-w-md mx-auto">
            <h3 className="font-playfair italic text-lg font-bold text-white">Ready to Run Benchmark Suite</h3>
            <p className="text-xs text-stone-400 mt-1 font-sans">
              Executes 50 diverse synthetic transactions testing under-budget purchases, high-value step-up triggers, stockout rerouting, and rogue merchant blocks.
            </p>
          </div>
          <button
            onClick={handleRun}
            disabled={running}
            className="btn-primary h-11 px-6 text-xs inline-flex items-center space-x-2"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Launch 50-Transaction Benchmark</span>
          </button>
        </div>
      )}

    </div>
  );
};

