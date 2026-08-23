import React from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  CreditCard,
  FileCode,
  History,
  Home,
  Layers,
  Package,
  ShieldCheck,
  ShoppingBag,
  TrendingUp,
  X,
  Zap,
} from 'lucide-react';
import { AP2DelegationMandate } from '../types';

import { RazorpayLogo } from './RazorpayLogo';

export type NavSection =
  | 'landing'
  | 'overview'
  | 'agent'
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
  icon: LucideIcon;
}

const mainNavItems: NavigationItem[] = [
  { id: 'overview', label: 'Overview', icon: Home },
  { id: 'agent', label: 'Buy', icon: ShoppingBag },
  { id: 'transactions', label: 'History', icon: History },
  { id: 'policies', label: 'Limits', icon: ShieldCheck },
  { id: 'catalog', label: 'Catalog', icon: Package },
];

const advancedNavItems: NavigationItem[] = [
  { id: 'growth', label: 'Merchant Yield', icon: TrendingUp },
  { id: 'benchmark', label: 'Benchmark', icon: Zap },
  { id: 'failures', label: 'Test Exceptions', icon: Layers },
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
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-white/[0.07] bg-[#090d16] transition-transform duration-200 ease-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0 shadow-2xl shadow-black/80' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-white/[0.07] px-5">
          <button
            type="button"
            onClick={() => selectSection('overview')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#02042b] border border-[#0c83ff]/30 flex items-center justify-center p-1 shadow-sm">
              <RazorpayLogo variant="icon" height={18} />
            </div>
            <div>
              <span className="block text-sm font-bold tracking-tight text-white flex items-center">
                AgentPay
              </span>
              <span className="block text-[10px] font-mono text-[#38bdf8]">on Razorpay</span>
            </div>
          </button>

          <button
            type="button"
            aria-label="Close navigation"
            onClick={onToggleMobile}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/[0.05] hover:text-white lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Primary Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6" aria-label="Primary navigation">
          <div className="space-y-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentSection === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectSection(item.id)}
                  className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#0c83ff] text-white shadow-sm font-bold'
                      : 'text-slate-400 hover:bg-white/[0.04] hover:text-white'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />
                  <span className="flex-1">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Advanced Section (Subtle) */}
          <div className="pt-4 border-t border-white/[0.06] space-y-1">
            <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Advanced
            </p>
            {advancedNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentSection === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectSection(item.id)}
                  className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-xs transition-all ${
                    isActive
                      ? 'bg-white/[0.08] text-white font-bold'
                      : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-[#0c83ff]' : 'text-slate-500 group-hover:text-slate-400'}`} />
                  <span className="flex-1">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Footer: Simple Spending Bar */}
        <div className="border-t border-white/[0.07] p-4 space-y-3 bg-[#080b11]/60">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Spent today</span>
              <span className="text-white font-bold font-mono">₹{dailySpent.toLocaleString()}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  spendPercent > 85 ? 'bg-rose-500' : spendPercent > 60 ? 'bg-amber-400' : 'bg-[#0c83ff]'
                }`}
                style={{ width: `${spendPercent}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-500 flex justify-between">
              <span>Limit: ₹{dailyCeiling.toLocaleString()}</span>
              <span>{spendPercent}% used</span>
            </div>
          </div>

          <div className="pt-2 border-t border-white/[0.05] flex items-center justify-between text-[11px] text-slate-500">
            <button
              onClick={onOpenWireTrace}
              className="hover:text-slate-300 transition-colors"
            >
              Wire trace
            </button>
            <button
              onClick={onOpenApiDocs}
              className="hover:text-slate-300 transition-colors flex items-center space-x-1"
            >
              <span>API docs</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
