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
  numeral: string;
  icon: LucideIcon;
}

const mainNavItems: NavigationItem[] = [
  { id: 'overview', label: 'Overview', numeral: 'I', icon: Home },
  { id: 'agent', label: 'Purchase & Order', numeral: 'II', icon: ShoppingBag },
  { id: 'amazon', label: 'Advisor & Reviews', numeral: 'III', icon: Star },
  { id: 'transactions', label: 'History & Ledger', numeral: 'IV', icon: History },
  { id: 'policies', label: 'Spending Limits', numeral: 'V', icon: ShieldCheck },
  { id: 'catalog', label: 'Merchant Catalog', numeral: 'VI', icon: Package },
];

const advancedNavItems: NavigationItem[] = [
  { id: 'growth', label: 'Merchant Yield', numeral: 'VII', icon: TrendingUp },
  { id: 'benchmark', label: 'Stress Benchmark', numeral: 'VIII', icon: Zap },
  { id: 'failures', label: 'Test Exceptions', numeral: 'IX', icon: Layers },
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
          className="fixed inset-0 z-40 bg-[#1A1A1A]/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-[#1A1A1A]/12 bg-[#F9F8F6] transition-transform duration-500 cubic-bezier(0.25, 0.46, 0.45, 0.94) lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0 shadow-[0_12px_40px_rgba(0,0,0,0.25)]' : '-translate-x-full'
        }`}
      >
        {/* Editorial Brand Header */}
        <div className="flex h-20 items-center justify-between border-b border-[#1A1A1A]/12 px-6 bg-[#F9F8F6]">
          <button
            type="button"
            onClick={() => selectSection('overview')}
            className="flex items-center gap-3 text-left group"
          >
            <div className="w-8 h-8 shrink-0 flex items-center justify-center border border-[#1A1A1A]/20 bg-[#FFFFFF] shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
              <RazorpayLogo variant="icon" height={16} />
            </div>
            <div>
              <span className="block font-serif text-base font-bold tracking-[0.15em] text-[#1A1A1A] uppercase">
                <span className="italic text-[#D4AF37] font-normal">Agent</span>Pay
              </span>
              <span className="block text-[8px] font-sans tracking-[0.25em] text-[#6C6863] uppercase">
                Autonomous Commerce
              </span>
            </div>
          </button>

          <button
            type="button"
            aria-label="Close navigation"
            onClick={onToggleMobile}
            className="p-1.5 text-[#1A1A1A] hover:bg-[#EBE5DE] lg:hidden shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Primary Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-6" aria-label="Primary navigation">
          <div className="space-y-1">
            <p className="px-3 pb-2 text-[9px] font-sans font-semibold text-[#6C6863] uppercase tracking-[0.25em] flex items-center gap-2">
              <span className="w-3 h-px bg-[#D4AF37]" />
              <span>Core Protocol</span>
            </p>
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentSection === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectSection(item.id)}
                  className={`group flex w-full items-center justify-between px-3.5 py-2.5 text-left text-xs font-sans uppercase tracking-[0.18em] transition-all duration-500 ${
                    isActive
                      ? 'bg-[#1A1A1A] text-[#FFFFFF] font-medium border-l-2 border-l-[#D4AF37] shadow-[0_2px_8px_rgba(0,0,0,0.08)]'
                      : 'text-[#6C6863] hover:text-[#1A1A1A] hover:bg-[#EBE5DE]/60 border-l-2 border-l-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`h-3.5 w-3.5 shrink-0 transition-colors duration-500 ${isActive ? 'text-[#D4AF37]' : 'text-[#6C6863] group-hover:text-[#1A1A1A]'}`} />
                    <span className="truncate text-xs">{item.label}</span>
                  </div>
                  <span className={`font-serif text-[10px] shrink-0 ml-1.5 ${isActive ? 'text-[#D4AF37]' : 'text-[#6C6863]/60'}`}>
                    {item.numeral}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Architecture Navigation */}
          <div className="pt-4 border-t border-[#1A1A1A]/10 space-y-1">
            <p className="px-3 pb-2 text-[9px] font-sans font-semibold text-[#6C6863] uppercase tracking-[0.25em] flex items-center gap-2">
              <span className="w-3 h-px bg-[#D4AF37]" />
              <span>Architecture</span>
            </p>
            {advancedNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentSection === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectSection(item.id)}
                  className={`group flex w-full items-center justify-between px-3.5 py-2 text-left text-xs font-sans uppercase tracking-[0.18em] transition-all duration-500 ${
                    isActive
                      ? 'bg-[#1A1A1A] text-[#FFFFFF] font-medium border-l-2 border-l-[#D4AF37] shadow-[0_2px_8px_rgba(0,0,0,0.08)]'
                      : 'text-[#6C6863] hover:text-[#1A1A1A] hover:bg-[#EBE5DE]/60 border-l-2 border-l-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`h-3.5 w-3.5 shrink-0 transition-colors duration-500 ${isActive ? 'text-[#D4AF37]' : 'text-[#6C6863] group-hover:text-[#1A1A1A]'}`} />
                    <span className="truncate text-xs">{item.label}</span>
                  </div>
                  <span className={`font-serif text-[10px] shrink-0 ml-1.5 ${isActive ? 'text-[#D4AF37]' : 'text-[#6C6863]/60'}`}>
                    {item.numeral}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Footer: Editorial Spending Meter */}
        <div className="border-t border-[#1A1A1A]/12 p-4 space-y-3 bg-[#FAF8F5]">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-sans text-[10px] text-[#6C6863] uppercase tracking-[0.2em] font-semibold">Spent Today</span>
              <span className="text-[#1A1A1A] font-semibold font-mono text-xs">₹{dailySpent.toLocaleString()}</span>
            </div>
            <div className="h-1 bg-[#EBE5DE] p-0 overflow-hidden">
              <div
                className={`h-full transition-all duration-700 ${
                  spendPercent > 85 ? 'bg-rose-600' : spendPercent > 60 ? 'bg-amber-500' : 'bg-[#1A1A1A]'
                }`}
                style={{ width: `${spendPercent}%` }}
              />
            </div>
            <div className="text-[9px] font-mono text-[#6C6863] flex justify-between tracking-wider">
              <span>Limit: ₹{dailyCeiling.toLocaleString()}</span>
              <span>{spendPercent}% USED</span>
            </div>
          </div>

          <div className="pt-2.5 border-t border-[#1A1A1A]/10 flex items-center justify-between text-[10px] font-sans uppercase tracking-[0.2em] text-[#6C6863]">
            <button
              onClick={onOpenWireTrace}
              className="hover:text-[#1A1A1A] hover:underline transition-colors"
            >
              Wire Trace
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
