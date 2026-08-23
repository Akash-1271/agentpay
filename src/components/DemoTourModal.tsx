import React, { useState } from 'react';
import {
  X,
  Play,
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
  Activity,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import { NavSection } from './Sidebar';
import { RazorpayLogo } from './RazorpayLogo';

interface DemoTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (section: NavSection) => void;
  onRunTransaction: (prompt: string, options?: any) => void;
}

const TOUR_STEPS = [
  {
    step: 1,
    title: '1. Instant Auto-Approved Purchase (≤ ₹2,000)',
    badge: 'Core Track 01 Flow',
    description:
      'Watch the buyer agent parse natural language intent ("Search Amazon for running shoes under ₹2,000"), query the UAP Catalog, verify spending limits, and settle via Razorpay test mode in milliseconds.',
    prompt: 'Search Amazon for running shoes under ₹2,000',
    targetSection: 'agent' as NavSection,
    actionLabel: 'Execute Auto-Approved Order',
  },
  {
    step: 2,
    title: '2. High-Value Step-Up Gating (> ₹2,000)',
    badge: 'Human-in-the-Loop Governance',
    description:
      'Every high-value transaction (e.g. ₹3,509 Keychron custom keyboard) triggers a Biometric Passkey / OTP Step-Up authorization modal. Money never leaves without permission.',
    prompt: 'Order Keychron Q1 Pro custom mechanical keyboard',
    targetSection: 'agent' as NavSection,
    actionLabel: 'Trigger Step-Up Gated Order',
  },
  {
    step: 3,
    title: '3. Merchant Yield & Cart Recovery Hub',
    badge: 'AI Growth Engine',
    description:
      'Grow merchant revenue via +18.4% AOV bundle lifts, automated AI SMS/WhatsApp abandoned cart recovery payment links, and a strict double-entry FinOps ledger.',
    targetSection: 'growth' as NavSection,
    actionLabel: 'Open Merchant Yield Hub',
  },
  {
    step: 4,
    title: '4. 50-Transaction Benchmark Stress Suite',
    badge: 'Judge Evaluation Suite',
    description:
      'Stress-test 50 synthetic transactions across stockout fallbacks, rogue merchants, and budget breaches in ~380ms with 100.0% policy adherence.',
    targetSection: 'benchmark' as NavSection,
    actionLabel: 'Open Benchmark Suite',
  },
];

export const DemoTourModal: React.FC<DemoTourModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onRunTransaction,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!isOpen) return null;

  const currentTour = TOUR_STEPS[currentStepIndex];

  const handleRunCurrentAction = () => {
    onNavigate(currentTour.targetSection);
    if (currentTour.prompt) {
      onRunTransaction(currentTour.prompt, { autoAcceptBundles: true });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-[#0a0f1d] border border-[#0c83ff]/40 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0c83ff] text-white flex items-center justify-center font-bold">
              <Play className="w-4 h-4 fill-current ml-0.5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center space-x-2">
                <span>Judge & Evaluator Interactive Tour</span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#0c83ff]/20 text-[#38bdf8] font-bold">
                  2 MIN
                </span>
              </div>
              <p className="text-xs text-slate-400">Step {currentStepIndex + 1} of {TOUR_STEPS.length}</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="grid grid-cols-4 gap-2">
          {TOUR_STEPS.map((s, idx) => (
            <div
              key={s.step}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentStepIndex
                  ? 'bg-[#0c83ff]'
                  : idx < currentStepIndex
                  ? 'bg-emerald-400'
                  : 'bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* Tour Step Body */}
        <div className="p-5 rounded-xl bg-[#090d16] border border-white/[0.06] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 text-[#38bdf8] border border-white/5">
              {currentTour.badge}
            </span>
          </div>

          <h3 className="text-base font-bold text-white leading-snug">{currentTour.title}</h3>
          <p className="text-xs text-slate-300 leading-relaxed">{currentTour.description}</p>
        </div>

        {/* Primary Action Button */}
        <button
          onClick={handleRunCurrentAction}
          className="w-full py-3 bg-[#0c83ff] hover:bg-[#0270e0] text-white text-xs font-bold rounded-xl shadow-lg flex items-center justify-center space-x-2 transition-all"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>{currentTour.actionLabel}</span>
        </button>

        {/* Footer Navigation Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-xs">
          <button
            onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))}
            disabled={currentStepIndex === 0}
            className="text-slate-400 hover:text-white disabled:opacity-30 flex items-center space-x-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            onClick={() => setCurrentStepIndex(Math.min(TOUR_STEPS.length - 1, currentStepIndex + 1))}
            disabled={currentStepIndex === TOUR_STEPS.length - 1}
            className="text-[#38bdf8] font-bold hover:text-white disabled:opacity-30 flex items-center space-x-1"
          >
            <span>Next Stage</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
