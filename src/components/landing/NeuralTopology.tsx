import React, { useState } from 'react';
import { Bot, Store, ShieldCheck, Landmark, CheckCircle2, ArrowRight } from 'lucide-react';

interface NodeData {
  id: string;
  title: string;
  protocol: string;
  badge: string;
  desc: string;
  icon: typeof Bot;
  color: string;
  bgGlow: string;
}

const NODES: NodeData[] = [
  {
    id: 'buyer',
    title: 'Autonomous Buyer Agent',
    protocol: 'UAP 1.0 Client',
    badge: 'ReAct Engine',
    desc: 'Translates natural language intents into structured tool executions. Performs inventory verification and negotiates pricing.',
    icon: Bot,
    color: 'text-[#38BDF8]',
    bgGlow: 'from-[#0C83FF]/20',
  },
  {
    id: 'merchant',
    title: 'Merchant Yield Agent',
    protocol: 'AP2 v2.0 Protocol',
    badge: 'Upsell Engine',
    desc: 'Analyzes basket affinity to deliver dynamic bundles and recovers abandoned sessions with personalized payment links.',
    icon: Store,
    color: 'text-purple-400',
    bgGlow: 'from-purple-500/20',
  },
  {
    id: 'enclave',
    title: 'Bounded Spending Enclave',
    protocol: 'Security Guardrail',
    badge: 'Hardware-Grade',
    desc: 'Enforces non-bypassable spending ceilings (₹2,000 auto-approval, ₹25,000 daily limit) and merchant allow-lists with zero card exposure.',
    icon: ShieldCheck,
    color: 'text-amber-400',
    bgGlow: 'from-amber-500/20',
  },
  {
    id: 'settlement',
    title: 'Razorpay & FinOps Ledger',
    protocol: 'Payment Rail',
    badge: 'Double-Entry',
    desc: 'Settles verified orders via Razorpay test mode, generates UPI QR codes, and records balanced debits and credits in SQLite.',
    icon: Landmark,
    color: 'text-emerald-400',
    bgGlow: 'from-emerald-500/20',
  },
];

export const NeuralTopology: React.FC = () => {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center space-x-2 text-[10px] font-mono tracking-[0.25em] text-[#38BDF8] uppercase font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0C83FF]" />
          <span>Connective Trust Architecture</span>
        </div>
        <h3 className="font-display text-2xl sm:text-4xl text-slate-100 font-bold tracking-tight">
          Neural-Calibrated Agent Protocol
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed">
          Four autonomous micro-services operating across strict cryptographic trust boundaries. Hover any actor to trace execution flow.
        </p>
      </div>

      {/* Interactive Topology Container */}
      <div className="relative p-6 sm:p-10 rounded-2xl border border-white/10 bg-[#0E131F]/80 backdrop-blur-xl shadow-2xl overflow-hidden">
        
        {/* SVG Connective Bezier Web (Background) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="connectiveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0C83FF" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Desktop Connective Lines */}
          <path
            d="M 250 120 C 350 120, 450 120, 650 120"
            fill="none"
            stroke="url(#connectiveGradient)"
            strokeWidth="1.5"
            className="connective-flow"
          />
          <path
            d="M 250 120 C 250 240, 250 280, 250 360"
            fill="none"
            stroke="rgba(12, 131, 255, 0.4)"
            strokeWidth="1.5"
            className="connective-flow"
          />
          <path
            d="M 650 120 C 650 240, 650 280, 650 360"
            fill="none"
            stroke="rgba(168, 85, 247, 0.4)"
            strokeWidth="1.5"
            className="connective-flow"
          />
          <path
            d="M 250 360 C 400 360, 500 360, 650 360"
            fill="none"
            stroke="rgba(16, 185, 129, 0.4)"
            strokeWidth="1.5"
            className="connective-flow"
          />
          <path
            d="M 250 120 C 450 240, 450 240, 650 360"
            fill="none"
            stroke="rgba(232, 145, 60, 0.3)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        </svg>

        {/* 4 Node Grid */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {NODES.map((node) => {
            const Icon = node.icon;
            const isHovered = activeNode === node.id;

            return (
              <div
                key={node.id}
                onMouseEnter={() => setActiveNode(node.id)}
                onMouseLeave={() => setActiveNode(null)}
                className={`p-6 rounded-xl border transition-all duration-300 relative group cursor-pointer ${
                  isHovered
                    ? 'border-[#0C83FF] bg-[#131929] shadow-[0_0_30px_rgba(12,131,255,0.15)] scale-[1.01]'
                    : 'border-white/10 bg-black/30 hover:border-white/20'
                }`}
              >
                {/* Subtle radial glow */}
                <div
                  className={`absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br ${node.bgGlow} to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                />

                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                      <Icon className={`w-5 h-5 ${node.color}`} />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono tracking-widest uppercase text-slate-400">
                        {node.protocol}
                      </span>
                      <h4 className="font-display text-base font-bold text-white tracking-tight">
                        {node.title}
                      </h4>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold bg-white/5 border border-white/10 text-slate-300">
                    {node.badge}
                  </span>
                </div>

                <p className="text-xs text-slate-400 mt-4 leading-relaxed font-sans">
                  {node.desc}
                </p>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-500 group-hover:text-slate-300 transition-colors">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Cryptographically Bound</span>
                  </span>
                  <span className="text-[#0C83FF] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Inspect</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
