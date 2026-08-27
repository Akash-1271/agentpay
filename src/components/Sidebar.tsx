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
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-[#1A1A1A]/10 bg-[#F9F8F6] transition-transform duration-300 ease-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0 shadow-[0_16px_48px_rgba(0,0,0,0.18)]' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-20 items-center justify-between border-b border-[#1A1A1A]/10 px-6 bg-[#F9F8F6]">
          <button
            type="button"
            onClick={() => selectSection('landing')}
            className="flex items-center gap-3 text-left group"
          >
            <div className="w-9 h-9 shrink-0 flex items-center justify-center border border-[#1A1A1A]/15 bg-[#FFFFFF] rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.03)] group-hover:border-[#D4AF37] transition-colors">
              <RazorpayLogo variant="icon" height={18} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-lg font-bold text-[#1A1A1A] tracking-tight">
                  <span className="italic text-[#D4AF37] font-normal">Agent</span>Pay
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20" />
              </div>
              <span className="block text-[9px] font-mono tracking-wider text-[#6C6863] uppercase">
                Autonomous Commerce
              </span>
            </div>
          </button>

          <button
            type="button"
            aria-label="Close navigation"
            onClick={onToggleMobile}
            className="p-2 text-[#1A1A1A] hover:bg-[#EBE5DE] rounded-lg lg:hidden shrink-0 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Primary Navigation Container with Custom Minimal Scrollbar */}
        <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-6" aria-label="Primary navigation">
          
          {/* Landing Editorial Shortcut */}
          <button
            type="button"
            onClick={() => selectSection('landing')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-xs font-sans transition-all duration-200 border ${
              currentSection === 'landing'
                ? 'bg-[#FFFFFF] text-[#1A1A1A] border-[#1A1A1A]/20 shadow-[0_2px_12px_rgba(0,0,0,0.04)]'
                : 'bg-transparent text-[#6C6863] border-transparent hover:text-[#1A1A1A] hover:bg-[#FFFFFF]/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-1.5 rounded-lg ${currentSection === 'landing' ? 'bg-[#D4AF37]/15 text-[#D4AF37]' : 'bg-[#EBE5DE]/60 text-[#6C6863]'}`}>
                <BookOpen className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="font-semibold block text-xs">Editorial Overview</span>
                <span className="text-[10px] text-[#6C6863] font-sans">Landing Lookbook</span>
              </div>
            </div>
            <span className="text-[10px] font-mono text-[#D4AF37] font-semibold tracking-wider">VOL. 01</span>
          </button>

          {/* Core Protocol Section */}
          <div className="space-y-1">
            <div className="px-3 pb-2 flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-[#D4AF37] uppercase tracking-[0.2em] flex items-center gap-1.5">
                <span className="w-2 h-px bg-[#D4AF37]" />
                CORE PROTOCOL
              </span>
              <span className="text-[9px] font-mono text-[#6C6863]">01–06</span>
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
                      ? 'bg-[#FFFFFF] text-[#1A1A1A] border-[#1A1A1A]/20 shadow-[0_4px_16px_rgba(0,0,0,0.05)]'
                      : 'bg-transparent text-[#6C6863] border-transparent hover:text-[#1A1A1A] hover:bg-[#FFFFFF]/60'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-1.5 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-[#1A1A1A] text-[#D4AF37]'
                          : 'bg-[#EBE5DE]/50 text-[#6C6863] group-hover:text-[#1A1A1A] group-hover:bg-[#EBE5DE]'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0" />
                    </div>

                    <div className="min-w-0">
                      <span className={`block font-semibold text-xs tracking-tight truncate ${isActive ? 'text-[#1A1A1A]' : 'text-[#2D2A26]'}`}>
                        {item.label}
                      </span>
                      {item.sublabel && (
                        <span className="block text-[10px] text-[#6C6863] truncate font-sans">
                          {item.sublabel}
                        </span>
                      )}
                    </div>
                  </div>

                  <span
                    className={`font-serif text-[11px] font-bold px-2 py-0.5 rounded-md border shrink-0 transition-colors ${
                      isActive
                        ? 'bg-[#FAF8F5] text-[#D4AF37] border-[#D4AF37]/30'
                        : 'bg-transparent text-[#6C6863]/60 border-transparent group-hover:text-[#6C6863]'
                    }`}
                  >
                    {item.numeral}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Architecture Section */}
          <div className="pt-3 border-t border-[#1A1A1A]/10 space-y-1">
            <div className="px-3 pb-2 flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-[#D4AF37] uppercase tracking-[0.2em] flex items-center gap-1.5">
                <span className="w-2 h-px bg-[#D4AF37]" />
                ARCHITECTURE
              </span>
              <span className="text-[9px] font-mono text-[#6C6863]">07–09</span>
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
                      ? 'bg-[#FFFFFF] text-[#1A1A1A] border-[#1A1A1A]/20 shadow-[0_4px_16px_rgba(0,0,0,0.05)]'
                      : 'bg-transparent text-[#6C6863] border-transparent hover:text-[#1A1A1A] hover:bg-[#FFFFFF]/60'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-1.5 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-[#1A1A1A] text-[#D4AF37]'
                          : 'bg-[#EBE5DE]/50 text-[#6C6863] group-hover:text-[#1A1A1A] group-hover:bg-[#EBE5DE]'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0" />
                    </div>

                    <div className="min-w-0">
                      <span className={`block font-semibold text-xs tracking-tight truncate ${isActive ? 'text-[#1A1A1A]' : 'text-[#2D2A26]'}`}>
                        {item.label}
                      </span>
                      {item.sublabel && (
                        <span className="block text-[10px] text-[#6C6863] truncate font-sans">
                          {item.sublabel}
                        </span>
                      )}
                    </div>
                  </div>

                  <span
                    className={`font-serif text-[11px] font-bold px-2 py-0.5 rounded-md border shrink-0 transition-colors ${
                      isActive
                        ? 'bg-[#FAF8F5] text-[#D4AF37] border-[#D4AF37]/30'
                        : 'bg-transparent text-[#6C6863]/60 border-transparent group-hover:text-[#6C6863]'
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
        <div className="border-t border-[#1A1A1A]/10 p-4 space-y-3 bg-[#FAF8F5]/80">
          
          <div className="p-3 bg-[#FFFFFF] border border-[#1A1A1A]/10 rounded-xl space-y-2 shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-[10px] text-[#6C6863] uppercase tracking-wider font-semibold">Enclave Budget</span>
              <span className="text-[#1A1A1A] font-bold font-mono text-xs">₹{dailySpent.toLocaleString()}</span>
            </div>

            <div className="h-1.5 bg-[#EBE5DE] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  spendPercent > 85 ? 'bg-rose-600' : spendPercent > 60 ? 'bg-amber-500' : 'bg-[#D4AF37]'
                }`}
                style={{ width: `${spendPercent}%` }}
              />
            </div>

            <div className="text-[9px] font-mono text-[#6C6863] flex justify-between tracking-wider">
              <span>Cap: ₹{dailyCeiling.toLocaleString()}</span>
              <span className="font-semibold text-[#1A1A1A]">{spendPercent}% Used</span>
            </div>
          </div>

          <div className="flex items-center justify-between px-1 text-[11px] font-mono text-[#6C6863]">
            <button
              onClick={onOpenWireTrace}
              className="hover:text-[#1A1A1A] hover:underline flex items-center gap-1 transition-colors"
            >
              <Zap className="w-3 h-3 text-[#D4AF37]" />
              <span>Wire Trace</span>
            </button>
            <span className="text-[#D4AF37]">·</span>
            <button
              onClick={onOpenApiDocs}
              className="hover:text-[#1A1A1A] hover:underline transition-colors"
            >
              API Docs
            </button>
          </div>

        </div>

      </aside>
    </>
  );
};
