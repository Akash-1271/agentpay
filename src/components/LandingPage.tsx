import React from 'react';
import {
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  CreditCard,
  Lock,
} from 'lucide-react';
import { NavSection } from './Sidebar';

interface LandingPageProps {
  onNavigate: (section: NavSection) => void;
  onRunLiveDemo: (prompt: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onRunLiveDemo }) => {
  return (
    <div className="mx-auto max-w-4xl space-y-12 py-8 animate-in fade-in duration-200">
      
      {/* Hero Header */}
      <div className="text-center space-y-5 max-w-2xl mx-auto pt-6">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs text-slate-300">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0c83ff]" />
          <span>Simple, safe automated purchases</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Set spending limits.
          <span className="block text-[#0c83ff]">
            Let purchases happen safely.
          </span>
        </h1>

        <p className="text-base text-slate-400 max-w-lg mx-auto">
          AgentPay finds products, checks your rules, and pays securely through Razorpay. You stay in control of every rupee.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => onRunLiveDemo('Search Amazon for running shoes under ₹2,000')}
            className="w-full sm:w-auto px-6 py-3.5 bg-[#0c83ff] hover:bg-[#0270e0] text-white text-sm font-bold rounded-xl shadow-sm flex items-center justify-center space-x-2 transition-all"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Try a purchase</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('overview')}
            className="w-full sm:w-auto px-6 py-3.5 bg-white/[0.05] hover:bg-white/[0.08] text-slate-200 text-sm font-bold rounded-xl border border-white/[0.08] flex items-center justify-center space-x-2 transition-all"
          >
            <span>Open dashboard</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* How it works (Simple 4-Step Card) */}
      <div className="fintech-card p-6 sm:p-8 space-y-6">
        <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider text-center">
          How it works
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-4 rounded-xl bg-[#090d16] border border-white/[0.04] space-y-2">
            <div className="text-xs font-bold text-[#0c83ff]">01 · You ask</div>
            <div className="text-sm font-bold text-white">Tell it what you need</div>
            <p className="text-xs text-slate-400">e.g. "Running shoes under ₹2,000".</p>
          </div>

          <div className="p-4 rounded-xl bg-[#090d16] border border-white/[0.04] space-y-2">
            <div className="text-xs font-bold text-[#0c83ff]">02 · We find</div>
            <div className="text-sm font-bold text-white">Finds in-stock items</div>
            <p className="text-xs text-slate-400">Checks verified stores and discounts.</p>
          </div>

          <div className="p-4 rounded-xl bg-[#090d16] border border-white/[0.04] space-y-2">
            <div className="text-xs font-bold text-[#0c83ff]">03 · Limit check</div>
            <div className="text-sm font-bold text-white">Checks your rules</div>
            <p className="text-xs text-slate-400">Auto-approves within budget or asks you.</p>
          </div>

          <div className="p-4 rounded-xl bg-[#090d16] border border-white/[0.04] space-y-2">
            <div className="text-xs font-bold text-emerald-400">04 · Paid</div>
            <div className="text-sm font-bold text-white">Paid with Razorpay</div>
            <p className="text-xs text-slate-400">Instant receipt and tracking number.</p>
          </div>

        </div>
      </div>

      {/* Safety Guarantees */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div className="p-4 rounded-xl bg-[#090d16] border border-white/[0.04] space-y-1">
          <ShieldCheck className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
          <div className="text-xs font-bold text-white">Protected limits</div>
          <div className="text-xs text-slate-400">Never spends more than you allow.</div>
        </div>

        <div className="p-4 rounded-xl bg-[#090d16] border border-white/[0.04] space-y-1">
          <Lock className="w-5 h-5 text-[#0c83ff] mx-auto mb-2" />
          <div className="text-xs font-bold text-white">Zero card exposure</div>
          <div className="text-xs text-slate-400">Your card details are never shared.</div>
        </div>

        <div className="p-4 rounded-xl bg-[#090d16] border border-white/[0.04] space-y-1">
          <CheckCircle2 className="w-5 h-5 text-purple-400 mx-auto mb-2" />
          <div className="text-xs font-bold text-white">Clear history</div>
          <div className="text-xs text-slate-400">Every purchase has a clear receipt.</div>
        </div>
      </div>

    </div>
  );
};
