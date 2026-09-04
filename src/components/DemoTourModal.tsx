import React, { useState } from 'react';
import {
  X,
  Play,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { NavSection } from './Sidebar';

interface DemoTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (section: NavSection) => void;
  onRunTransaction: (prompt: string, options?: any) => void;
}

const TOUR_STEPS = [
  {
    step: 1,
    numeral: 'I',
    title: 'Auto-Approved Purchase Flow (≤ ₹2,000)',
    badge: 'Core Track 01 Flow',
    description:
      'The buyer agent parses your intent ("Search Amazon for running shoes under ₹2,000"), checks enclave limits, and settles via Razorpay in milliseconds.',
    prompt: 'Search Amazon for running shoes under ₹2,000',
    targetSection: 'agent' as NavSection,
    actionLabel: 'Execute Order I',
  },
  {
    step: 2,
    numeral: 'II',
    title: 'High-Value Passkey Gating (> ₹2,000)',
    badge: 'Human-in-the-Loop Enclave',
    description:
      'High-value transactions (e.g. ₹3,509 Keychron custom keyboard) trigger biometric passkey verification. Money never moves without authorization.',
    prompt: 'Order Keychron Q1 Pro custom mechanical keyboard',
    targetSection: 'agent' as NavSection,
    actionLabel: 'Trigger Gated Order II',
  },
  {
    step: 3,
    numeral: 'III',
    title: 'Merchant Yield & Cart Recovery Hub',
    badge: 'AI Growth Engine',
    description:
      'Grow merchant revenue via +18.4% AOV bundle lifts, automated AI SMS/WhatsApp abandoned cart recovery payment links, and double-entry FinOps.',
    targetSection: 'growth' as NavSection,
    actionLabel: 'Open Yield Hub III',
  },
  {
    step: 4,
    numeral: 'IV',
    title: '50-Transaction Benchmark Stress Suite',
    badge: 'Evaluation Suite',
    description:
      'Stress-test synthetic transactions across stockout fallbacks, rogue merchants, and budget breaches with live measured latencies and non-bypassable policy gating.',
    targetSection: 'benchmark' as NavSection,
    actionLabel: 'Open Benchmark IV',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in">
      <div className="relative w-full max-w-lg bg-[#0A0A0A] border border-[#1F1F1F] p-7 space-y-6 shadow-[0_24px_64px_rgba(0,0,0,0.9)] rounded-2xl">
        
        {/* Top Monochrome Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 rounded-t-2xl" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1F1F1F] pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 border border-[#1F1F1F] bg-[#141414] flex items-center justify-center text-white rounded-lg">
              <Play className="w-3.5 h-3.5 fill-white text-white" />
            </div>
            <div>
              <div className="font-playfair text-base font-bold text-white">
                Guided System Walkthrough
              </div>
              <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.2em] text-[#71717A]">
                Stage {currentTour.numeral} of IV
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1 text-[#71717A] hover:text-white rounded-lg hover:bg-white/5 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bars */}
        <div className="grid grid-cols-4 gap-2">
          {TOUR_STEPS.map((s, idx) => (
            <div
              key={s.step}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentStepIndex
                  ? 'bg-white'
                  : idx < currentStepIndex
                  ? 'bg-emerald-500'
                  : 'bg-[#1F1F1F]'
              }`}
            />
          ))}
        </div>

        {/* Tour Step Body */}
        <div className="p-5 bg-[#0D0D0D] border border-[#1F1F1F] rounded-xl space-y-2">
          <span className="text-[10px] font-sans font-semibold text-[#71717A] uppercase tracking-[0.2em] block">
            ◆ {currentTour.badge} ◆
          </span>

          <h3 className="font-sans text-lg font-bold text-white leading-snug">
            {currentTour.title}
          </h3>
          <p className="text-xs text-[#A1A1AA] font-sans leading-relaxed">
            {currentTour.description}
          </p>
        </div>

        {/* Primary Action Button */}
        <button
          onClick={handleRunCurrentAction}
          className="btn-primary w-full h-11 text-xs flex items-center justify-center space-x-2 rounded-xl"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{currentTour.actionLabel}</span>
        </button>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-2 border-t border-[#1F1F1F] text-xs font-sans uppercase tracking-[0.15em] font-semibold text-[#A1A1AA]">
          <button
            onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))}
            disabled={currentStepIndex === 0}
            className="hover:text-white disabled:opacity-30 flex items-center space-x-1 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            onClick={() => setCurrentStepIndex(Math.min(TOUR_STEPS.length - 1, currentStepIndex + 1))}
            disabled={currentStepIndex === TOUR_STEPS.length - 1}
            className="hover:text-white disabled:opacity-30 flex items-center space-x-1 transition-colors"
          >
            <span>Next Stage</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
