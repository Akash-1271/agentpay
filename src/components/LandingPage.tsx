import React from 'react';
import {
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { NavSection } from './Sidebar';
import { VerticalTabs } from './ui/vertical-tabs';

interface LandingPageProps {
  onNavigate: (section: NavSection) => void;
  onRunLiveDemo: (prompt: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onRunLiveDemo }) => {
  return (
    <div className="space-y-24 py-6 animate-in text-white">
      
      {/* ── Editorial Hero Section (Asymmetric 12-Column Grid) ── */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center pt-4">
        
        {/* Left Column (7 Columns): Typographic Masthead & Intention */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Volume & Issue Overline */}
          <div className="flex items-center space-x-3 text-xs tracking-[0.25em] uppercase text-zinc-400 font-sans font-semibold">
            <span className="w-8 h-px bg-zinc-600" />
            <span>Vol. 01 · Autonomous Commerce Architecture</span>
          </div>

          {/* Imposing Playfair Display Headline with Mixed Italic Cadence */}
          <h1 className="font-playfair text-5xl sm:text-7xl lg:text-8xl font-normal text-white leading-[0.92] tracking-tight">
            Mathematical <span className="italic font-normal text-zinc-300">Limits</span>.
            <br />
            Absolute <span className="italic font-normal text-white">Control</span>.
          </h1>

          {/* Intro Narrative with Editorial Drop Cap */}
          <p className="text-zinc-300 text-base sm:text-lg leading-relaxed font-sans max-w-xl">
            AgentPay empowers autonomous AI agents to explore canonical merchant catalogs, evaluate hardware-grade financial boundaries, and settle via Razorpay with cryptographic proof. Pure elegance meets deterministic mathematical safety.
          </p>

          {/* Key Architectural Metric Badges */}
          <div className="grid grid-cols-3 gap-4 pt-2 border-t border-b border-[#1F1F1F] py-4 max-w-lg">
            <div>
              <div className="font-playfair text-2xl sm:text-3xl font-bold text-white">₹0</div>
              <div className="text-[10px] font-sans uppercase tracking-[0.2em] text-zinc-400 mt-0.5">Card Exposure</div>
            </div>
            <div className="border-l border-[#1F1F1F] pl-4">
              <div className="font-playfair text-2xl sm:text-3xl font-bold text-white">&lt;80ms</div>
              <div className="text-[10px] font-sans uppercase tracking-[0.2em] text-zinc-400 mt-0.5">Enclave Settle</div>
            </div>
            <div className="border-l border-[#1F1F1F] pl-4">
              <div className="font-playfair text-2xl sm:text-3xl font-bold text-white">100%</div>
              <div className="text-[10px] font-sans uppercase tracking-[0.2em] text-zinc-400 mt-0.5">Deterministic</div>
            </div>
          </div>

          {/* Luxury Action Triggers */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
            <button
              type="button"
              onClick={() => onRunLiveDemo('Search Amazon for running shoes under ₹2,000')}
              className="btn-primary h-14 px-8 text-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Execute Purchase</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('overview')}
              className="btn-secondary h-14 px-8 text-sm"
            >
              <span>Open Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column (5 Columns): Image Showcase */}
        <div className="lg:col-span-5 relative group">
          
          {/* Vertical Editorial Side Tag (Desktop Only) */}
          <div className="hidden lg:block absolute -left-10 top-1/2 -translate-y-1/2 writing-mode-vertical text-[10px] font-mono tracking-[0.3em] uppercase text-zinc-500 font-semibold select-none">
            SPECIFICATION // AP2-RAZORPAY-AUTONOMOUS
          </div>

          {/* Editorial Frame with Grayscale-to-Color Image */}
          <div className="relative p-2 border border-[#1F1F1F] bg-[#0A0A0A] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
            <div className="relative aspect-[4/5] overflow-hidden bg-[#0D0D0D] rounded-xl">
              <img
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop"
                alt="Nike Air Zoom Pegasus Luxury Lookbook"
                className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-500"
              />
              <div className="absolute inset-0 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)] pointer-events-none" />
              
              {/* Floating Architectural Badge */}
              <div className="absolute bottom-4 left-4 right-4 bg-[#0A0A0A]/95 text-white p-4 backdrop-blur-md border border-[#1F1F1F] rounded-xl space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-400">
                  <span>Live Autonomous Target</span>
                  <span className="font-mono text-white font-bold">₹1,899</span>
                </div>
                <div className="font-playfair italic text-sm font-semibold tracking-wide text-white">
                  Nike Air Zoom Pegasus 40 Running Shoes
                </div>
                <div className="text-[11px] font-sans text-zinc-400 flex items-center justify-between pt-1">
                  <span>Auto-approved within ₹2,000 threshold</span>
                  <span className="text-emerald-400 font-mono">Verified ✓</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* ── Protocol Workflow: Interactive VerticalTabs Section ── */}
      <section className="pt-4 border-t border-[#1F1F1F]">
        <VerticalTabs />
      </section>

      {/* ── Dark Section: The Architecture of Trust ── */}
      <section className="card-dark p-8 sm:p-14 space-y-10 shadow-[0_12px_40px_rgba(0,0,0,0.4)]">
        <div className="max-w-2xl space-y-3">
          <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-400 font-semibold flex items-center gap-2">
            <span className="w-3 h-px bg-zinc-600" />
            <span>Mathematical Guarantees</span>
          </div>
          <h2 className="font-playfair text-3xl sm:text-5xl text-white font-normal leading-tight">
            The Architecture of <span className="font-playfair italic text-zinc-300">Trust</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
            Autonomous systems must operate within immutable financial perimeters. AgentPay combines Razorpay's trusted payment rail with cryptographic enclave validation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
          
          <div className="border border-[#1F1F1F] p-6 space-y-3 bg-[#0D0D0D] rounded-2xl">
            <div className="w-8 h-8 flex items-center justify-center border border-white/15 bg-white/[0.04] text-white rounded-lg">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h4 className="font-playfair italic text-base font-semibold text-white">
              Bounded Enclave
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Hardware-grade policy rules guarantee the buyer agent can never breach financial mandates or authorized merchants.
            </p>
          </div>

          <div className="border border-[#1F1F1F] p-6 space-y-3 bg-[#0D0D0D] rounded-2xl">
            <div className="w-8 h-8 flex items-center justify-center border border-white/15 bg-white/[0.04] text-white rounded-lg">
              <Lock className="w-4 h-4" />
            </div>
            <h4 className="font-playfair italic text-base font-semibold text-white">
              Zero Card Exposure
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Payments execute through signed delegation mandates and Razorpay orders, eliminating raw credential leakage.
            </p>
          </div>

          <div className="border border-[#1F1F1F] p-6 space-y-3 bg-[#0D0D0D] rounded-2xl">
            <div className="w-8 h-8 flex items-center justify-center border border-white/15 bg-white/[0.04] text-white rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h4 className="font-playfair italic text-base font-semibold text-white">
              Cryptographic Audit
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Every intention, quote hash, and Razorpay payment receipt is immutably recorded in a double-entry ledger.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
};
