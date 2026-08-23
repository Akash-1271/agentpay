import React from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  AlertOctagon,
  ArrowUpRight,
  Bot,
  FileCode,
  History,
  Home,
  Package,
  ReceiptText,
  ShieldCheck,
  Sparkles,
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
    label: 'Workspace',
    items: [
      { id: 'landing', label: 'Explore & Flow', icon: Sparkles },
      { id: 'overview', label: 'Overview', icon: Home },
      { id: 'agent', label: 'AI Agent', icon: Bot },
      { id: 'growth', label: 'Revenue Growth', icon: TrendingUp },
      { id: 'benchmark', label: 'Evaluation Suite', icon: Zap },
    ],
  },
  {
    label: 'Control center',
    items: [
      { id: 'transactions', label: 'Transactions', icon: ReceiptText },
      { id: 'policies', label: 'Financial Policies', icon: ShieldCheck },
      { id: 'catalog', label: 'Catalog', icon: Package },
      { id: 'audit', label: 'Audit Trail', icon: History },
      { id: 'failures', label: 'Failure Studio', icon: AlertOctagon },
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
  const dailyCeiling = mandate?.dailyCeiling ?? 15000;
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
          className="fixed inset-0 z-40 bg-slate-950/72 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[17.25rem] flex-col border-r border-slate-400/[0.13] bg-[#081525]/94 backdrop-blur-2xl transition-transform duration-300 ease-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0 shadow-2xl shadow-black/40' : '-translate-x-full'
        }`}
      >
        <div className="flex h-[4.75rem] items-center justify-between border-b border-slate-400/[0.12] px-5">
          <button
            type="button"
            onClick={() => selectSection('landing')}
            className="group flex items-center gap-3 text-left"
            aria-label="Go to AgentPay home"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl border border-blue-200/25 bg-gradient-to-br from-[#7ba0ff] to-[#3b6df4] text-white shadow-lg shadow-blue-950/60 transition-transform group-hover:scale-[1.03]">
              <Zap className="h-4 w-4 fill-current" />
            </span>
            <span>
              <span className="block text-sm font-bold tracking-[-0.035em] text-white">AgentPay</span>
              <span className="block pt-0.5 text-[10px] font-medium uppercase tracking-[0.15em] text-slate-500">Razorpay buildathon</span>
            </span>
          </button>

          <button
            type="button"
            aria-label="Close navigation"
            onClick={onToggleMobile}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-white/[0.06] hover:text-white lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-5" aria-label="Primary navigation">
          <div className="space-y-6">
            {navigationGroups.map((group) => (
              <section key={group.label}>
                <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                  {group.label}
                </p>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentSection === item.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        aria-current={isActive ? 'page' : undefined}
                        onClick={() => selectSection(item.id)}
                        className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-medium transition-all ${
                          isActive
                            ? 'bg-gradient-to-r from-blue-400/[0.16] to-blue-400/[0.06] text-white shadow-[inset_0_0_0_1px_rgba(147,197,253,0.15)]'
                            : 'text-slate-400 hover:bg-white/[0.045] hover:text-slate-100'
                        }`}
                      >
                        <span className={`grid h-7 w-7 place-items-center rounded-lg transition-colors ${
                          isActive ? 'bg-blue-400/15 text-blue-200' : 'text-slate-500 group-hover:bg-white/[0.06] group-hover:text-slate-300'
                        }`}>
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="flex-1">{item.label}</span>
                        {item.id === 'agent' && (
                          <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,0.9)]' : 'bg-slate-700'}`} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </nav>

        <div className="space-y-3 border-t border-slate-400/[0.12] p-3">
          <div className="rounded-xl border border-slate-400/[0.12] bg-slate-400/[0.045] p-3.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-medium text-slate-300">Daily control</span>
              <span className="font-mono text-cyan-200">₹{dailySpent.toLocaleString()}</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800">
              <div
                className={`h-full rounded-full transition-all duration-500 ${spendPercent > 85 ? 'bg-rose-400' : spendPercent > 60 ? 'bg-amber-300' : 'bg-gradient-to-r from-cyan-300 to-blue-400'}`}
                style={{ width: `${spendPercent}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
              <span>Protected by policy</span>
              <span>₹{dailyCeiling.toLocaleString()} cap</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenWireTrace}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-xs font-medium text-slate-400 transition hover:bg-white/[0.045] hover:text-slate-100"
          >
            <Zap className="h-4 w-4 text-[#0c83ff]" />
            <span className="flex-1">Wire Packet Trace</span>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/5 text-slate-400">RFC</span>
          </button>

          <button
            type="button"
            onClick={onOpenApiDocs}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-xs font-medium text-slate-400 transition hover:bg-white/[0.045] hover:text-slate-100"
          >
            <FileCode className="h-4 w-4 text-slate-500" />
            <span className="flex-1">Protocol docs</span>
            <ArrowUpRight className="h-3.5 w-3.5 text-slate-500" />
          </button>
        </div>
      </aside>
    </>
  );
};
