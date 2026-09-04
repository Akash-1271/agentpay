import React from 'react';
import {
  Home,
  ShoppingBag,
  History,
  ShieldCheck,
  Package,
  Layers,
  TrendingUp,
  X,
  Zap,
  Star,
  Sparkles,
  BookOpen,
  type LucideIcon,
} from 'lucide-react';
import { RazorpayLogo } from './RazorpayLogo';
import { AP2DelegationMandate } from '../types';

export type NavSection =
  | 'landing'
  | 'overview'
  | 'agent'
  | 'amazon'
  | 'transactions'
  | 'policies'
  | 'catalog'
  | 'growth'
  | 'audit'
  | 'failures'
  | 'benchmark';

interface SidebarProps {
  currentSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  mandate: AP2DelegationMandate | null;
  dailySpent: number;
  onOpenApiDocs: () => void;
  onOpenWireTrace: () => void;
  isOpenMobile: boolean;
  onToggleMobile: () => void;
}

interface NavigationItem {
  id: NavSection;
  label: string;
  sublabel?: string;
  numeral: string;
  icon: LucideIcon;
}

const mainNavItems: NavigationItem[] = [
  { id: 'overview', label: 'Overview', sublabel: 'Executive Metrics', numeral: 'I', icon: Home },
  { id: 'agent', label: 'Purchase & Order', sublabel: 'Autonomous Terminal', numeral: 'II', icon: ShoppingBag },
  { id: 'amazon', label: 'Advisor & Reviews', sublabel: 'Multi-Merchant AI', numeral: 'III', icon: Star },
  { id: 'transactions', label: 'History & Ledger', sublabel: 'Cryptographic Audit', numeral: 'IV', icon: History },
  { id: 'policies', label: 'Spending Limits', sublabel: 'Enclave Boundaries', numeral: 'V', icon: ShieldCheck },
  { id: 'catalog', label: 'Merchant Catalog', sublabel: 'Verified UAP Lookbook', numeral: 'VI', icon: Package },
];

const advancedNavItems: NavigationItem[] = [
  { id: 'growth', label: 'Merchant Yield', sublabel: 'Cart Recovery & AOV', numeral: 'VII', icon: TrendingUp },
  { id: 'benchmark', label: 'Stress Benchmark', sublabel: '50-Batch Evaluation', numeral: 'VIII', icon: Zap },
  { id: 'failures', label: 'Test Exceptions', sublabel: 'Edge-Case Containment', numeral: 'IX', icon: Layers },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentSection,
  onSelectSection,
  mandate,
  dailySpent,
  onOpenApiDocs,
  onOpenWireTrace,
  isOpenMobile,
  onToggleMobile,
}) => {
  const dailyCeiling = mandate?.dailyCeiling ?? 25000;
  const spendPercent = Math.min(100, Math.round((dailySpent / dailyCeiling) * 100));

  const selectSection = (section: NavSection) => {
    onSelectSection(section);
    if (isOpenMobile) onToggleMobile();
  };

  return (
    <>
      {isOpenMobile && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onToggleMobile}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/10 bg-[#0a0a0a]/90 backdrop-blur-xl transition-transform duration-300 ease-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0 shadow-[0_16px_48px_rgba(0,0,0,0.8)]' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-5 bg-transparent">
          <button
            type="button"
            onClick={() => selectSection('landing')}
            className="flex items-center gap-3 text-left group"
          >
            <div className="w-9 h-9 shrink-0 flex items-center justify-center border border-[#a78b71]/30 bg-[#a78b71]/10 rounded-xl shadow-[0_0_15px_rgba(167,139,113,0.15)] group-hover:border-[#c9b8a0] transition-colors">
              <RazorpayLogo variant="icon" height={16} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-playfair text-xl font-bold tracking-tight text-stone-100">
                  Agent<span className="text-[#c9b8a0] italic">Pay</span>
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ring-2 ring-emerald-400/20 animate-pulse" />
              </div>
              <span className="block text-[9px] font-mono tracking-[0.18em] text-[#a78b71] uppercase">
                Autonomous Commerce
              </span>
            </div>
          </button>

          <button
            type="button"
            aria-label="Close navigation"
            onClick={onToggleMobile}
            className="p-1.5 text-stone-400 hover:text-stone-100 hover:bg-white/5 rounded-lg lg:hidden shrink-0 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Primary Navigation Container with Custom Minimal Scrollbar */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5" aria-label="Primary navigation">
          
          {/* Cinematic Landing Switcher */}
          <button
            type="button"
            onClick={() => selectSection('landing')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs transition-all duration-200 border group ${
              currentSection === 'landing'
                ? 'bg-[#a78b71]/15 text-[#e8d5b7] border-[#a78b71]/40 shadow-[0_2px_16px_rgba(167,139,113,0.18)]'
                : 'bg-white/[0.02] text-stone-300 border-white/10 hover:text-white hover:bg-white/5 hover:border-white/20'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className={`p-1.5 rounded-lg ${currentSection === 'landing' ? 'bg-[#a78b71] text-black' : 'bg-white/5 text-[#c9b8a0] group-hover:text-stone-100'}`}>
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="font-playfair text-xs tracking-tight block text-stone-100 font-bold">Cinematic Film</span>
                <span className="text-[9px] text-stone-400 font-mono">Portal · Iris · Field</span>
              </div>
            </div>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#a78b71]/10 text-[#c9b8a0] border border-[#a78b71]/20 font-semibold tracking-wider">
              FILM
            </span>
          </button>

          {/* Core Protocol Section */}
          <div className="space-y-1">
            <div className="px-3 pb-1.5 flex items-center justify-between">
              <span className="text-[9px] font-mono font-bold text-[#c9b8a0] uppercase tracking-[0.2em] flex items-center gap-1.5">
                <span className="w-1.5 h-px bg-[#a78b71]" />
                CORE MODULES
              </span>
              <span className="text-[9px] font-mono text-stone-500">01–06</span>
            </div>

            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentSection === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectSection(item.id)}
                  className={`group w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-all duration-200 border ${
                    isActive
                      ? 'border-l-2 border-l-[#a78b71] border-t-white/5 border-r-white/5 border-b-white/5 bg-[#a78b71]/10 text-[#e8d5b7] shadow-[0_2px_16px_rgba(167,139,113,0.12)]'
                      : 'border-transparent text-stone-400 hover:text-stone-100 hover:bg-white/[0.03]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`p-1.5 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-[#a78b71] text-black shadow-[0_0_12px_rgba(167,139,113,0.4)]'
                          : 'bg-white/5 text-[#a78b71] group-hover:text-stone-200 group-hover:bg-white/10'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0" />
                    </div>

                    <div className="min-w-0">
                      <span className={`block text-[11px] font-medium tracking-wide uppercase truncate ${isActive ? 'text-stone-100 font-semibold' : 'text-stone-300'}`}>
                        {item.label}
                      </span>
                      {item.sublabel && (
                        <span className="block text-[9px] text-stone-500 truncate font-sans">
                          {item.sublabel}
                        </span>
                      )}
                    </div>
                  </div>

                  <span
                    className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border shrink-0 transition-colors ${
                      isActive
                        ? 'bg-[#a78b71]/20 text-[#e8d5b7] border-[#a78b71]/30'
                        : 'bg-transparent text-stone-500 border-transparent group-hover:text-stone-400'
                    }`}
                  >
                    {item.numeral}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Architecture Section */}
          <div className="pt-2 border-t border-white/10 space-y-1">
            <div className="px-3 pb-1.5 flex items-center justify-between">
              <span className="text-[9px] font-mono font-bold text-[#c9b8a0] uppercase tracking-[0.2em] flex items-center gap-1.5">
                <span className="w-1.5 h-px bg-[#a78b71]" />
                AUDIT & BENCHMARKS
              </span>
              <span className="text-[9px] font-mono text-stone-500">07–09</span>
            </div>

            {advancedNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentSection === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectSection(item.id)}
                  className={`group w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-all duration-200 border ${
                    isActive
                      ? 'border-l-2 border-l-[#a78b71] border-t-white/5 border-r-white/5 border-b-white/5 bg-[#a78b71]/10 text-[#e8d5b7] shadow-[0_2px_16px_rgba(167,139,113,0.12)]'
                      : 'border-transparent text-stone-400 hover:text-stone-100 hover:bg-white/[0.03]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`p-1.5 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-[#a78b71] text-black shadow-[0_0_12px_rgba(167,139,113,0.4)]'
                          : 'bg-white/5 text-[#a78b71] group-hover:text-stone-200 group-hover:bg-white/10'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0" />
                    </div>

                    <div className="min-w-0">
                      <span className={`block text-[11px] font-medium tracking-wide uppercase truncate ${isActive ? 'text-stone-100 font-semibold' : 'text-stone-300'}`}>
                        {item.label}
                      </span>
                      {item.sublabel && (
                        <span className="block text-[9px] text-stone-500 truncate font-sans">
                          {item.sublabel}
                        </span>
                      )}
                    </div>
                  </div>

                  <span
                    className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border shrink-0 transition-colors ${
                      isActive
                        ? 'bg-[#a78b71]/20 text-[#e8d5b7] border-[#a78b71]/30'
                        : 'bg-transparent text-stone-500 border-transparent group-hover:text-stone-400'
                    }`}
                  >
                    {item.numeral}
                  </span>
                </button>
              );
            })}
          </div>

        </nav>

        {/* Spending Meter & Protocol Utilities */}
        <div className="border-t border-white/10 p-3.5 space-y-3 bg-[#0a0a0a]/95">
          
          <div className="p-3 bg-white/[0.03] border border-white/10 rounded-2xl space-y-2 shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-[9px] text-[#c9b8a0] uppercase tracking-wider font-semibold">Enclave Budget</span>
              <span className="text-stone-100 font-bold font-mono text-xs">₹{dailySpent.toLocaleString()}</span>
            </div>

            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-[#a78b71] to-[#e8d5b7]"
                style={{ width: `${spendPercent}%` }}
              />
            </div>

            <div className="text-[9px] font-mono text-stone-400 flex justify-between tracking-wider">
              <span>Cap: ₹{dailyCeiling.toLocaleString()}</span>
              <span className="font-semibold text-[#e8d5b7]">{spendPercent}% Used</span>
            </div>
          </div>

          <div className="flex items-center justify-between px-1 text-[11px] font-mono text-stone-400">
            <button
              onClick={onOpenWireTrace}
              className="hover:text-[#e8d5b7] flex items-center gap-1.5 transition-colors"
            >
              <Zap className="w-3 h-3 text-[#c9b8a0]" />
              <span className="text-[10px] uppercase tracking-wider">Wire Trace</span>
            </button>
            <span className="text-white/20">·</span>
            <button
              onClick={onOpenApiDocs}
              className="hover:text-[#e8d5b7] text-[10px] uppercase tracking-wider transition-colors"
            >
              API Docs
            </button>
          </div>

        </div>

      </aside>
    </>
  );
};
