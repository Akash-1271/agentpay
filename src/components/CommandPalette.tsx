import React, { useState, useEffect } from 'react';
import {
  Search,
  ShoppingBag,
  Home,
  History,
  ShieldCheck,
  Package,
  Layers,
  ArrowRight,
  Star,
} from 'lucide-react';
import { NavSection } from './Sidebar';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (section: NavSection) => void;
  onRunIntent: (prompt: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onRunIntent,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    { label: 'Buy: "Search Amazon for running shoes under ₹2,000"', type: 'intent', icon: ShoppingBag, prompt: 'Search Amazon for running shoes under ₹2,000' },
    { label: 'Buy: "Order Keychron Q1 Pro mechanical keyboard"', type: 'intent', icon: ShoppingBag, prompt: 'Order Keychron Q1 Pro custom mechanical keyboard' },
    { label: 'Go to Amazon Advisor & Review Insights', type: 'nav', icon: Star, section: 'amazon' },
    { label: 'Go to Overview', type: 'nav', icon: Home, section: 'overview' },
    { label: 'Go to Buy Page', type: 'nav', icon: ShoppingBag, section: 'agent' },
    { label: 'Go to Purchase History', type: 'nav', icon: History, section: 'transactions' },
    { label: 'Go to Spending Limits', type: 'nav', icon: ShieldCheck, section: 'policies' },
    { label: 'Go to Catalog', type: 'nav', icon: Package, section: 'catalog' },
    { label: 'Go to Advanced Tools', type: 'nav', icon: Layers, section: 'benchmark' },
  ];

  const filtered = actions.filter((a) => a.label.toLowerCase().includes(query.toLowerCase()));

  const handleSelect = (item: typeof actions[0]) => {
    if (item.type === 'intent' && item.prompt) {
      onNavigate('agent');
      onRunIntent(item.prompt);
    } else if (item.type === 'nav' && item.section) {
      onNavigate(item.section as NavSection);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-100">
      <div className="relative w-full max-w-xl bg-[#0d121f] border border-white/[0.12] rounded-xl shadow-2xl overflow-hidden">
        
        {/* Search Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/[0.08]">
          <Search className="w-4 h-4 text-slate-400 mr-3" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search purchases, limits, or navigation..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <span className="text-[10px] font-mono text-slate-500 px-1.5 py-0.5 rounded bg-white/5 border border-white/5">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div className="max-h-72 overflow-y-auto p-2 space-y-1 text-xs">
          {filtered.length === 0 ? (
            <div className="py-6 text-center text-slate-500 text-xs">
              No matching options found.
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(item)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-slate-300 hover:text-white hover:bg-white/[0.04] transition-all group"
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className="w-4 h-4 text-[#0c83ff]" />
                    <span className="text-xs font-medium">{item.label}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-300 transition-colors" />
                </button>
              );
            })
          )}
        </div>

        <div className="px-4 py-2 bg-[#090d16] border-t border-white/[0.05] text-[11px] text-slate-500 flex justify-between">
          <span>AgentPay</span>
          <span>Quick actions & navigation</span>
        </div>

      </div>
    </div>
  );
};
