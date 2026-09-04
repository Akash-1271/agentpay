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
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-[#1F1F1F] bg-[#000000] backdrop-blur-xl transition-transform duration-300 ease-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0 shadow-[0_16px_48px_rgba(0,0,0,0.9)]' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-20 items-center justify-between border-b border-[#1F1F1F] px-5 bg-transparent">
          <button
            type="button"
            onClick={() => selectSection('landing')}
            className="flex items-center gap-3 text-left group"
          >
            <div className="w-9 h-9 shrink-0 flex items-center justify-center border border-[#1F1F1F] bg-[#141414] rounded-xl group-hover:border-[#404040] transition-colors">
              <RazorpayLogo variant="icon" height={16} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-playfair text-xl font-bold tracking-tight text-white">
                  Agent<span className="text-[#A1A1AA] italic">Pay</span>
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ring-2 ring-emerald-400/20 animate-pulse" />
              </div>
              <span className="block text-[9px] font-mono tracking-[0.18em] text-[#71717A] uppercase">
                Autonomous Commerce
              </span>
            </div>
          </button>

          <button
            type="button"
            aria-label="Close navigation"
            onClick={onToggleMobile}
            className="p-1.5 text-[#A1A1AA] hover:text-white hover:bg-white/5 rounded-lg lg:hidden shrink-0 transition-colors"
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
                ? 'bg-white/[0.08] text-white border-white/20'
                : 'bg-white/[0.02] text-[#A1A1AA] border-[#1F1F1F] hover:text-white hover:bg-white/5 hover:border-[#333333]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className={`p-1.5 rounded-lg ${currentSection === 'landing' ? 'bg-white text-black' : 'bg-white/5 text-[#A1A1AA] group-hover:text-white'}`}>
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="font-playfair text-xs tracking-tight block text-white font-bold">Cinematic Film</span>
                <span className="text-[9px] text-[#71717A] font-mono">Portal · Iris · Field</span>
              </div>
            </div>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-white border border-white/20 font-semibold tracking-wider">
              FILM
            </span>
          </button>

          {/* Core Protocol Section */}
          <div className="space-y-1">
            <div className="px-3 pb-1.5 flex items-center justify-between">
              <span className="text-[9px] font-mono font-bold text-[#71717A] uppercase tracking-[0.2em] flex items-center gap-1.5">
                <span className="w-1.5 h-px bg-[#404040]" />
                CORE MODULES
              </span>
              <span className="text-[9px] font-mono text-[#52525B]">01–06</span>
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
                      ? 'border-l-2 border-l-white border-t-[#1F1F1F] border-r-[#1F1F1F] border-b-[#1F1F1F] bg-white/[0.06] text-white'
                      : 'border-transparent text-[#A1A1AA] hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`p-1.5 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-white text-black shadow-sm'
                          : 'bg-white/5 text-[#A1A1AA] group-hover:text-white group-hover:bg-white/10'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0" />
                    </div>

                    <div className="min-w-0">
                      <span className={`block text-[11px] font-medium tracking-wide uppercase truncate ${isActive ? 'text-white font-semibold' : 'text-[#D4D4D8]'}`}>
                        {item.label}
                      </span>
                      {item.sublabel && (
                        <span className="block text-[9px] text-[#71717A] truncate font-sans">
                          {item.sublabel}
                        </span>
                      )}
                    </div>
                  </div>

                  <span
                    className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border shrink-0 transition-colors ${
                      isActive
                        ? 'bg-white/10 text-white border-white/20'
                        : 'bg-transparent text-[#52525B] border-transparent group-hover:text-[#A1A1AA]'
                    }`}
                  >
                    {item.numeral}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Architecture Section */}
          <div className="pt-2 border-t border-[#1F1F1F] space-y-1">
            <div className="px-3 pb-1.5 flex items-center justify-between">
              <span className="text-[9px] font-mono font-bold text-[#71717A] uppercase tracking-[0.2em] flex items-center gap-1.5">
                <span className="w-1.5 h-px bg-[#404040]" />
                AUDIT & BENCHMARKS
              </span>
              <span className="text-[9px] font-mono text-[#52525B]">07–09</span>
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
                      ? 'border-l-2 border-l-white border-t-[#1F1F1F] border-r-[#1F1F1F] border-b-[#1F1F1F] bg-white/[0.06] text-white'
                      : 'border-transparent text-[#A1A1AA] hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`p-1.5 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-white text-black shadow-sm'
                          : 'bg-white/5 text-[#A1A1AA] group-hover:text-white group-hover:bg-white/10'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0" />
                    </div>

                    <div className="min-w-0">
                      <span className={`block text-[11px] font-medium tracking-wide uppercase truncate ${isActive ? 'text-white font-semibold' : 'text-[#D4D4D8]'}`}>
                        {item.label}
                      </span>
                      {item.sublabel && (
                        <span className="block text-[9px] text-[#71717A] truncate font-sans">
                          {item.sublabel}
                        </span>
                      )}
                    </div>
                  </div>

                  <span
                    className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border shrink-0 transition-colors ${
                      isActive
                        ? 'bg-white/10 text-white border-white/20'
                        : 'bg-transparent text-[#52525B] border-transparent group-hover:text-[#A1A1AA]'
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
        <div className="border-t border-[#1F1F1F] p-3.5 space-y-3 bg-[#000000]">
          
          <div className="p-3 bg-[#0D0D0D] border border-[#1F1F1F] rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-[9px] text-[#A1A1AA] uppercase tracking-wider font-semibold">Enclave Budget</span>
              <span className="text-white font-bold font-mono text-xs">₹{dailySpent.toLocaleString()}</span>
            </div>

            <div className="h-1.5 bg-[#1F1F1F] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 bg-white"
                style={{ width: `${spendPercent}%` }}
              />
            </div>

            <div className="text-[9px] font-mono text-[#71717A] flex justify-between tracking-wider">
              <span>Cap: ₹{dailyCeiling.toLocaleString()}</span>
              <span className="font-semibold text-white">{spendPercent}% Used</span>
            </div>
          </div>

          <div className="flex items-center justify-between px-1 text-[11px] font-mono text-[#71717A]">
            <button
              onClick={onOpenWireTrace}
              className="hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <Zap className="w-3 h-3 text-[#A1A1AA]" />
              <span className="text-[10px] uppercase tracking-wider">Wire Trace</span>
            </button>
            <span className="text-[#333333]">·</span>
            <button
              onClick={onOpenApiDocs}
              className="hover:text-white text-[10px] uppercase tracking-wider transition-colors"
            >
              API Docs
            </button>
          </div>

        </div>

      </aside>
    </>
  );
};
