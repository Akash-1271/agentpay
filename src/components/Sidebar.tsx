import React from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  ArrowUpRight,
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

export type NavSection =
  | 'landing'
  | 'overview'
  | 'agent'
  | 'growth'
  | 'transactions'
  | 'policies'
  | 'catalog'
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

const navigationGroups: Array<{ label: string; items: NavigationItem[] }> = [
  {
    label: 'Platform',
    items: [
      { id: 'overview', label: 'Overview', icon: Home },
      { id: 'agent', label: 'Commerce', icon: ShoppingBag },
      { id: 'growth', label: 'Merchant Yield', icon: TrendingUp },
      { id: 'transactions', label: 'Transactions', icon: CreditCard },
    ],
  },
  {
    label: 'Governance & Infrastructure',
    items: [
      { id: 'policies', label: 'Policies', icon: ShieldCheck },
      { id: 'catalog', label: 'Catalog', icon: Package },
      { id: 'audit', label: 'Audit Ledger', icon: History },
      { id: 'benchmark', label: 'Benchmark', icon: Activity },
      { id: 'failures', label: 'Exception Studio', icon: Layers },
    ],
  },
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
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/[0.07] bg-[#090d16] transition-transform duration-200 ease-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0 shadow-2xl shadow-black/80' : '-translate-x-full'
        }`}
      >
        {/* Console Header */}
        <div className="flex h-16 items-center justify-between border-b border-white/[0.07] px-5">
          <button
            type="button"
            onClick={() => selectSection('overview')}
            className="flex items-center gap-3 text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#0c83ff] flex items-center justify-center text-white shadow-sm font-bold text-sm">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-sm font-bold tracking-tight text-white">AgentPay</span>
              <span className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider">Payments Console</span>
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

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6" aria-label="Primary navigation">
          {navigationGroups.map((group) => (
            <div key={group.label} className="space-y-1">
              <p className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                {group.label}
              </p>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentSection === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => selectSection(item.id)}
                    className={`group flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#0c83ff]/10 text-white border border-[#0c83ff]/30 shadow-sm'
                        : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200 border border-transparent'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? 'text-[#0c83ff]' : 'text-slate-500 group-hover:text-slate-300'}`} />
                    <span className="flex-1">{item.label}</span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0c83ff]" />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer Info: Spend Today & Protocol Wire */}
        <div className="border-t border-white/[0.07] p-3.5 space-y-3 bg-[#080b11]/50">
          <div className="rounded-lg border border-white/[0.06] bg-[#090d16] p-3 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400 font-medium">Spend today</span>
              <span className="font-mono text-white font-bold">₹{dailySpent.toLocaleString()}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  spendPercent > 85 ? 'bg-rose-500' : spendPercent > 60 ? 'bg-amber-400' : 'bg-[#0c83ff]'
                }`}
                style={{ width: `${spendPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span>Policy Cap</span>
              <span>₹{dailyCeiling.toLocaleString()}</span>
            </div>
          </div>

          <div className="space-y-1">
            <button
              type="button"
              onClick={onOpenWireTrace}
              className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs font-mono text-slate-400 hover:bg-white/[0.04] hover:text-slate-200 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <Zap className="h-3.5 w-3.5 text-[#0c83ff]" />
                <span>Protocol Wire Trace</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/5 text-slate-500">RFC</span>
            </button>

            <button
              type="button"
              onClick={onOpenApiDocs}
              className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs text-slate-400 hover:bg-white/[0.04] hover:text-slate-200 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <FileCode className="h-3.5 w-3.5 text-slate-500" />
                <span>API Reference</span>
              </div>
              <ArrowUpRight className="h-3.5 w-3.5 text-slate-600" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
