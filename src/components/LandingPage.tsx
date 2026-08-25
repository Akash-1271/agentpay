import React from 'react';
import {
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Zap,
  Sparkles,
  Layers,
  Fingerprint,
} from 'lucide-react';
import { NavSection } from './Sidebar';

interface LandingPageProps {
  onNavigate: (section: NavSection) => void;
  onRunLiveDemo: (prompt: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onRunLiveDemo }) => {
  return (
    <div className="space-y-24 py-6 animate-in">
      
      {/* ── Editorial Hero Section (Asymmetric 12-Column Grid) ── */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center pt-4">
        
        {/* Left Column (7 Columns): Typographic Masthead & Intention */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Volume & Issue Overline */}
          <div className="flex items-center space-x-3 text-xs tracking-[0.25em] uppercase text-[#6C6863] font-sans font-semibold">
            <span className="w-8 h-px bg-[#D4AF37]" />
            <span>Vol. 01 · Autonomous Commerce Architecture</span>
          </div>

          {/* Imposing Playfair Display Headline with Mixed Italic Cadence */}
          <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-normal text-[#1A1A1A] leading-[0.92] tracking-tight">
            Mathematical <span className="font-serif italic font-normal text-[#D4AF37]">Limits</span>.
            <br />
            Absolute <span className="font-serif italic font-normal text-[#1A1A1A]">Opulence</span>.
          </h1>

          {/* Intro Narrative with Editorial Drop Cap */}
          <p className="drop-cap text-[#1A1A1A] text-base sm:text-lg leading-relaxed font-sans max-w-xl">
            AgentPay empowers autonomous AI agents to explore canonical merchant catalogs, evaluate hardware-grade financial boundaries, and settle via Razorpay with cryptographic proof. Pure elegance meets deterministic mathematical safety.
          </p>

          {/* Key Architectural Metric Badges */}
          <div className="grid grid-cols-3 gap-4 pt-2 border-t border-b border-[#1A1A1A]/10 py-4 max-w-lg">
            <div>
              <div className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A]">₹0</div>
              <div className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#6C6863] mt-0.5">Card Exposure</div>
            </div>
            <div className="border-l border-[#1A1A1A]/10 pl-4">
              <div className="font-serif text-2xl sm:text-3xl font-bold text-[#D4AF37]">&lt;80ms</div>
              <div className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#6C6863] mt-0.5">Enclave Settle</div>
            </div>
            <div className="border-l border-[#1A1A1A]/10 pl-4">
              <div className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A]">100%</div>
              <div className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#6C6863] mt-0.5">Deterministic</div>
            </div>
          </div>

          {/* Luxury Action Triggers */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
            <button
              type="button"
              onClick={() => onRunLiveDemo('Search Amazon for running shoes under ₹2,000')}
              className="luxury-btn-primary h-14"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Execute Purchase</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('overview')}
              className="luxury-btn-secondary h-14"
            >
              <span>Open Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column (5 Columns): Editorial Image Showcase with Cinematic Hover & Vertical Spine */}
        <div className="lg:col-span-5 relative group">
          
          {/* Vertical Editorial Side Tag (Desktop Only) */}
          <div className="hidden lg:block absolute -left-10 top-1/2 -translate-y-1/2 writing-mode-vertical text-[10px] font-sans tracking-[0.3em] uppercase text-[#6C6863] font-semibold select-none">
            SPECIFICATION // AP2-RAZORPAY-AUTONOMOUS
          </div>

          {/* Editorial Frame with Grayscale-to-Color Image */}
          <div className="relative p-2 border border-[#1A1A1A]/15 bg-[#FFFFFF] shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
            <div className="relative aspect-[4/5] overflow-hidden bg-[#EBE5DE]">
              <img
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop"
                alt="Nike Air Zoom Pegasus Luxury Lookbook"
                className="luxury-image w-full h-full object-cover"
              />
              <div className="absolute inset-0 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)] pointer-events-none" />
              
              {/* Floating Architectural Badge */}
              <div className="absolute bottom-4 left-4 right-4 bg-[#1A1A1A]/95 text-[#FFFFFF] p-4 backdrop-blur-md border-t-2 border-t-[#D4AF37] space-y-1">
                <div className="flex items-center justify-between text-[10px] font-sans uppercase tracking-[0.2em] text-[#D4AF37]">
                  <span>Live Autonomous Target</span>
                  <span className="font-mono">₹1,899</span>
                </div>
                <div className="font-serif text-sm font-semibold tracking-wide text-[#FFFFFF]">
                  Nike Air Zoom Pegasus 40 Running Shoes
                </div>
                <div className="text-[11px] font-sans text-[#EBE5DE]/80 flex items-center justify-between pt-1">
                  <span>Auto-approved within ₹2,000 threshold</span>
                  <span className="text-[#D4AF37]">Verified ✓</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* ── Protocol Workflow (Numbered Editorial Pillars I - IV) ── */}
      <section className="space-y-10 pt-8 border-t border-[#1A1A1A]/15">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-[#6C6863] font-semibold flex items-center gap-2">
              <span className="w-3 h-px bg-[#D4AF37]" />
              <span>Architectural Execution Flow</span>
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#1A1A1A] mt-1.5">
              How Autonomous Commerce Settles
            </h2>
          </div>
          <span className="text-xs font-mono text-[#1A1A1A] px-3 py-1.5 border border-[#1A1A1A]/20 bg-[#FFFFFF] self-start md:self-auto">
            AP2 PROTOCOL SPECIFICATION
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Step 01 */}
          <div className="luxury-card space-y-4">
            <div className="flex items-center justify-between border-b border-[#1A1A1A]/10 pb-3">
              <span className="font-serif text-3xl font-normal text-[#1A1A1A]">01</span>
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <h3 className="font-serif text-lg font-semibold text-[#1A1A1A] tracking-tight">
              Natural Intent
            </h3>
            <p className="text-xs text-[#6C6863] leading-relaxed font-sans">
              Buyer prompt parsed into canonical merchant query (e.g. "Running shoes under ₹2,000" or custom mechanical keyboards).
            </p>
          </div>

          {/* Step 02 */}
          <div className="luxury-card space-y-4">
            <div className="flex items-center justify-between border-b border-[#1A1A1A]/10 pb-3">
              <span className="font-serif text-3xl font-normal text-[#1A1A1A]">02</span>
              <Layers className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <h3 className="font-serif text-lg font-semibold text-[#1A1A1A] tracking-tight">
              UAP Discovery
            </h3>
            <p className="text-xs text-[#6C6863] leading-relaxed font-sans">
              Real-time merchant inventory lock, automatic dynamic bundle discounts, and cryptographically signed quotes.
            </p>
          </div>

          {/* Step 03 */}
          <div className="luxury-card space-y-4">
            <div className="flex items-center justify-between border-b border-[#1A1A1A]/10 pb-3">
              <span className="font-serif text-3xl font-normal text-[#1A1A1A]">03</span>
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <h3 className="font-serif text-lg font-semibold text-[#1A1A1A] tracking-tight">
              Enclave Gating
            </h3>
            <p className="text-xs text-[#6C6863] leading-relaxed font-sans">
              Deterministic verification against spending policies; triggers biometric passkey step-up when limits are exceeded.
            </p>
          </div>

          {/* Step 04 */}
          <div className="luxury-card space-y-4">
            <div className="flex items-center justify-between border-b border-[#1A1A1A]/10 pb-3">
              <span className="font-serif text-3xl font-normal text-[#1A1A1A]">04</span>
              <Zap className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <h3 className="font-serif text-lg font-semibold text-[#1A1A1A] tracking-tight">
              Razorpay Settle
            </h3>
            <p className="text-xs text-[#6C6863] leading-relaxed font-sans">
              Test mode capture, GST-compliant tax invoice generation, and real-time courier tracking assignment.
            </p>
          </div>

        </div>
      </section>

      {/* ── Inverted Dark Section: The Architecture of Trust ── */}
      <section className="luxury-dark-panel p-8 sm:p-14 space-y-10 shadow-[0_12px_40px_rgba(0,0,0,0.15)]">
        <div className="max-w-2xl space-y-3">
          <div className="text-[10px] font-sans uppercase tracking-[0.25em] text-[#D4AF37] font-semibold flex items-center gap-2">
            <span className="w-3 h-px bg-[#D4AF37]" />
            <span>Mathematical Guarantees</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#F9F8F6] font-normal leading-tight">
            The Architecture of <span className="font-serif italic text-[#D4AF37]">Trust</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#EBE5DE]/80 leading-relaxed font-sans">
            Autonomous systems must operate within immutable financial perimeters. AgentPay combines Razorpay's trusted payment rail with cryptographic enclave validation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
          
          <div className="border border-white/10 p-6 space-y-3 bg-white/[0.02]">
            <div className="w-8 h-8 flex items-center justify-center border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h4 className="font-serif text-base font-semibold text-[#F9F8F6]">
              Bounded Enclave
            </h4>
            <p className="text-xs text-[#EBE5DE]/70 leading-relaxed">
              Hardware-grade policy rules guarantee the buyer agent can never breach financial mandates or authorized merchants.
            </p>
          </div>

          <div className="border border-white/10 p-6 space-y-3 bg-white/[0.02]">
            <div className="w-8 h-8 flex items-center justify-center border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37]">
              <Lock className="w-4 h-4" />
            </div>
            <h4 className="font-serif text-base font-semibold text-[#F9F8F6]">
              Zero Card Exposure
            </h4>
            <p className="text-xs text-[#EBE5DE]/70 leading-relaxed">
              Payments execute through signed delegation mandates and Razorpay orders, eliminating raw credential leakage.
            </p>
          </div>

          <div className="border border-white/10 p-6 space-y-3 bg-white/[0.02]">
            <div className="w-8 h-8 flex items-center justify-center border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37]">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h4 className="font-serif text-base font-semibold text-[#F9F8F6]">
              Cryptographic Audit
            </h4>
            <p className="text-xs text-[#EBE5DE]/70 leading-relaxed">
              Every intention, quote hash, and Razorpay payment receipt is immutably recorded in a double-entry ledger.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
};

