import React from 'react';
import { ShieldCheck, Cpu, Zap, Activity, BookOpen, AlertOctagon, Store, History } from 'lucide-react';
import { AP2DelegationMandate } from '../types';

interface HeaderProps {
  activeTab: 'arena' | 'guard' | 'merchant' | 'audit' | 'failures';
  onSelectTab: (tab: 'arena' | 'guard' | 'merchant' | 'audit' | 'failures') => void;
  mandate: AP2DelegationMandate | null;
  dailySpent: number;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onSelectTab, mandate, dailySpent }) => {
  const ceiling = mandate?.dailyCeiling || 15000;
  const spentPct = Math.min(100, Math.round((dailySpent / ceiling) * 100));

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[rgba(255,255,255,0.08)] bg-[#07090e]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#0c83ff] to-[#8b5cf6] p-[1.5px] shadow-lg shadow-[#0c83ff]/20">
              <div className="w-full h-full bg-[#090b10] rounded-[10.5px] flex items-center justify-center">
                <Zap className="w-6 h-6 text-[#0c83ff]" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight text-white">
                  Agent<span className="gradient-text-blue">Pay</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider rounded-full bg-[#0c83ff]/15 text-[#38bdf8] border border-[#0c83ff]/30">
                  UAP & AP2 v2.0
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Autonomous Commerce Protocol & Bounded Payment Enclave (Razorpay AI)
              </p>
            </div>
          </div>

          {/* Real-time Status Badges */}
          <div className="hidden lg:flex items-center space-x-4">
            
            {/* Daily Enclave Budget Gauge */}
            <div className="flex items-center space-x-3 px-3.5 py-1.5 rounded-xl bg-[#0e131f] border border-white/5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <div className="text-xs">
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                  <span>Enclave Ceiling</span>
                  <span className="font-mono font-medium text-slate-200 ml-2">₹{dailySpent.toLocaleString()} / ₹{ceiling.toLocaleString()}</span>
                </div>
                <div className="w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${spentPct > 85 ? 'bg-rose-500' : spentPct > 60 ? 'bg-amber-400' : 'bg-emerald-400'}`}
                    style={{ width: `${spentPct}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Gateway Status Badge */}
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#0e131f] border border-white/5 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot" />
              <span className="text-slate-300">Razorpay Test Engine</span>
            </div>
          </div>

        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 sm:space-x-2 border-t border-white/[0.06] py-2 overflow-x-auto">
          {[
            { id: 'arena', label: 'Live Autonomous Arena', icon: Zap },
            { id: 'guard', label: 'Spending Guard Enclave', icon: ShieldCheck },
            { id: 'merchant', label: 'Merchant Hub & Dynamic Yield', icon: Store },
            { id: 'audit', label: 'Cryptographic Audit Ledger', icon: History },
            { id: 'failures', label: 'Failure Recovery Studio', icon: AlertOctagon },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id as any)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? 'bg-[#0c83ff]/15 text-[#38bdf8] border border-[#0c83ff]/40 shadow-sm shadow-[#0c83ff]/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#38bdf8]' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};
