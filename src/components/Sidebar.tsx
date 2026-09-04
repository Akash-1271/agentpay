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
          className="fixed inset-0 z-40 bg-[#1A1A1A]/60 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/10 bg-[#0A0E17] transition-transform duration-300 ease-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0 shadow-[0_16px_48px_rgba(0,0,0,0.5)]' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6 bg-[#0A0E17]">
          <button
            type="button"
            onClick={() => selectSection('landing')}
            className="flex items-center gap-3 text-left group"
          >
            <div className="w-9 h-9 shrink-0 flex items-center justify-center border border-white/15 bg-[#131929] rounded-xl shadow-[0_2px_8px_rgba(12,131,255,0.1)] group-hover:border-[#0C83FF] transition-colors">
              <RazorpayLogo variant="icon" height={18} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold text-slate-100 tracking-tight">
                  <span className="text-[#38BDF8] font-normal">Agent</span>Pay
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ring-2 ring-emerald-400/20 animate-pulse" />
              </div>
              <span className="block text-[9px] font-mono tracking-wider text-slate-400 uppercase">
                Autonomous Commerce
              </span>
            </div>
          </button>

          <button
            type="button"
            aria-label="Close navigation"
            onClick={onToggleMobile}
            className="p-2 text-slate-400 hover:text-slate-100 hover:bg-white/5 rounded-lg lg:hidden shrink-0 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Primary Navigation Container with Custom Minimal Scrollbar */}
        <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-6" aria-label="Primary navigation">
          
          {/* Cinematic Landing Switcher */}
          <button
            type="button"
            onClick={() => selectSection('landing')}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-left text-xs font-sans transition-all duration-200 border group hover:scale-[1.01] ${
              currentSection === 'landing'
                ? 'bg-[#0C83FF]/15 text-[#38BDF8] border-[#0C83FF]/40 shadow-[0_2px_12px_rgba(12,131,255,0.15)]'
                : 'bg-white/[0.02] text-slate-300 border-white/10 hover:text-white hover:bg-white/5 hover:border-white/20'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${currentSection === 'landing' ? 'bg-[#0C83FF] text-white' : 'bg-white/5 text-slate-400 group-hover:text-slate-200'}`}>
                <Sparkles className="w-3.5 h-3.5 text-[#0C83FF] group-hover:animate-spin" />
              </div>
              <div>
                <span className="font-display font-bold block text-xs tracking-tight">Cinematic Film</span>
                <span className="text-[10px] text-slate-400 font-mono">Portal · Iris · Field</span>
              </div>
            </div>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-[#38BDF8] border border-white/10 font-semibold tracking-wider">
              4 STAGES
            </span>
          </button>

          {/* Core Protocol Section */}
          <div className="space-y-1">
            <div className="px-3 pb-2 flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-[#38BDF8] uppercase tracking-[0.2em] flex items-center gap-1.5">
                <span className="w-2 h-px bg-[#0C83FF]" />
                CORE PROTOCOL
              </span>
              <span className="text-[9px] font-mono text-slate-400">01–06</span>
            </div>

            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentSection === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectSection(item.id)}
                  className={`group w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-xs font-sans transition-all duration-200 border ${
                    isActive
                      ? 'bg-[#0C83FF]/15 text-[#38BDF8] border-[#0C83FF]/40 shadow-[0_4px_16px_rgba(12,131,255,0.15)]'
                      : 'bg-transparent text-slate-400 border-transparent hover:text-slate-100 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-1.5 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-[#0C83FF] text-white shadow-[0_0_12px_rgba(12,131,255,0.4)]'
                          : 'bg-white/5 text-slate-400 group-hover:text-slate-200 group-hover:bg-white/10'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0" />
                    </div>

                    <div className="min-w-0">
                      <span className={`block font-semibold text-xs tracking-tight truncate ${isActive ? 'text-slate-100' : 'text-slate-300'}`}>
                        {item.label}
                      </span>
                      {item.sublabel && (
                        <span className="block text-[10px] text-slate-400 truncate font-sans">
                          {item.sublabel}
                        </span>
                      )}
                    </div>
                  </div>

                  <span
                    className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded-md border shrink-0 transition-colors ${
                      isActive
                        ? 'bg-[#0C83FF]/20 text-[#38BDF8] border-[#0C83FF]/30'
                        : 'bg-transparent text-slate-400/60 border-transparent group-hover:text-slate-300'
                    }`}
                  >
                    {item.numeral}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Architecture Section */}
          <div className="pt-3 border-t border-white/10 space-y-1">
            <div className="px-3 pb-2 flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-[#38BDF8] uppercase tracking-[0.2em] flex items-center gap-1.5">
                <span className="w-2 h-px bg-[#0C83FF]" />
                ARCHITECTURE
              </span>
              <span className="text-[9px] font-mono text-slate-400">07–09</span>
            </div>

            {advancedNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentSection === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectSection(item.id)}
                  className={`group w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-xs font-sans transition-all duration-200 border ${
                    isActive
                      ? 'bg-[#0C83FF]/15 text-[#38BDF8] border-[#0C83FF]/40 shadow-[0_4px_16px_rgba(12,131,255,0.15)]'
                      : 'bg-transparent text-slate-400 border-transparent hover:text-slate-100 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-1.5 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-[#0C83FF] text-white shadow-[0_0_12px_rgba(12,131,255,0.4)]'
                          : 'bg-white/5 text-slate-400 group-hover:text-slate-200 group-hover:bg-white/10'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0" />
                    </div>

                    <div className="min-w-0">
                      <span className={`block font-semibold text-xs tracking-tight truncate ${isActive ? 'text-slate-100' : 'text-slate-300'}`}>
                        {item.label}
                      </span>
                      {item.sublabel && (
                        <span className="block text-[10px] text-slate-400 truncate font-sans">
                          {item.sublabel}
                        </span>
                      )}
                    </div>
                  </div>

                  <span
                    className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded-md border shrink-0 transition-colors ${
                      isActive
                        ? 'bg-[#0C83FF]/20 text-[#38BDF8] border-[#0C83FF]/30'
                        : 'bg-transparent text-slate-400/60 border-transparent group-hover:text-slate-300'
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
        <div className="border-t border-white/10 p-4 space-y-3 bg-[#080B11]/90">
          
          <div className="p-3 bg-[#0E131F] border border-white/10 rounded-xl space-y-2 shadow-[0_2px_8px_rgba(0,0,0,0.2)]">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Enclave Budget</span>
              <span className="text-slate-100 font-bold font-mono text-xs">₹{dailySpent.toLocaleString()}</span>
            </div>

            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  spendPercent > 85 ? 'bg-rose-500' : spendPercent > 60 ? 'bg-amber-400' : 'bg-[#0C83FF]'
                }`}
                style={{ width: `${spendPercent}%` }}
              />
            </div>

            <div className="text-[9px] font-mono text-slate-400 flex justify-between tracking-wider">
              <span>Cap: ₹{dailyCeiling.toLocaleString()}</span>
              <span className="font-semibold text-slate-200">{spendPercent}% Used</span>
            </div>
          </div>

          <div className="flex items-center justify-between px-1 text-[11px] font-mono text-slate-400">
            <button
              onClick={onOpenWireTrace}
              className="hover:text-[#38BDF8] hover:underline flex items-center gap-1 transition-colors"
            >
              <Zap className="w-3 h-3 text-[#0C83FF]" />
              <span>Wire Trace</span>
            </button>
            <span className="text-white/20">·</span>
            <button
              onClick={onOpenApiDocs}
              className="hover:text-[#38BDF8] hover:underline transition-colors"
            >
              API Docs
            </button>
          </div>

        </div>

      </aside>
    </>
  );
};
