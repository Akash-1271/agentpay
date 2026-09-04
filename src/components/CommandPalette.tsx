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
    { label: 'Buy: "Order Keychron Q1 Pro custom mechanical keyboard"', type: 'intent', icon: ShoppingBag, prompt: 'Order Keychron Q1 Pro custom mechanical keyboard' },
    { label: 'Buy: "Order Anker 735 GaN Fast Charger 65W"', type: 'intent', icon: ShoppingBag, prompt: 'Order Anker 735 GaN Fast Charger 65W' },
    { label: 'Amazon.in & Flipkart.com Review Advisor', type: 'nav', icon: Star, section: 'amazon' },
    { label: 'Executive Dashboard Overview', type: 'nav', icon: Home, section: 'overview' },
    { label: 'Purchase & Order Console (Autonomous ReAct Agent)', type: 'nav', icon: ShoppingBag, section: 'agent' },
    { label: 'Audit History & Double-Entry Ledger', type: 'nav', icon: History, section: 'transactions' },
    { label: 'Spending Limits & Bounded Enclave', type: 'nav', icon: ShieldCheck, section: 'policies' },
    { label: 'Merchant Catalog & Lookbook (UAP)', type: 'nav', icon: Package, section: 'catalog' },
    { label: 'Merchant Revenue & Abandoned Cart Recovery', type: 'nav', icon: Layers, section: 'growth' },
    { label: 'Failure Simulation & Edge Cases (3 Modes)', type: 'nav', icon: ShieldCheck, section: 'failures' },
    { label: 'Evaluation Stress Benchmark Suite (50-Tx)', type: 'nav', icon: Layers, section: 'benchmark' },
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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4 bg-black/80 backdrop-blur-md animate-in">
      <div className="relative w-full max-w-xl bg-[#0A0A0A] border border-[#1F1F1F] shadow-[0_24px_64px_rgba(0,0,0,0.9)] overflow-hidden rounded-2xl">
        
        {/* Top Monochrome Accent Bar */}
        <div className="h-1 bg-white/20 w-full" />

        {/* Search Input */}
        <div className="flex items-center px-5 py-4 border-b border-[#1F1F1F] bg-[#0D0D0D]">
          <Search className="w-4 h-4 text-[#A1A1AA] mr-3 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search commands, navigate, or dispatch intent..."
            className="w-full bg-transparent text-sm text-white placeholder-[#71717A] focus:outline-none font-sans"
          />
          <span className="text-[10px] font-mono text-[#71717A] px-2 py-0.5 border border-[#1F1F1F] bg-[#141414] rounded-md">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div className="max-h-72 overflow-y-auto p-2 space-y-1 text-xs">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-[#71717A] text-xs font-sans">
              No matching commands located.
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(item)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left text-white hover:bg-[#141414] transition-all border border-transparent hover:border-[#1F1F1F] rounded-xl group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 border border-[#1F1F1F] bg-[#141414] flex items-center justify-center text-white rounded-lg">
                      <Icon className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-xs font-sans font-medium text-[#D4D4D8] group-hover:text-white">{item.label}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#52525B] group-hover:text-white transition-colors" />
                </button>
              );
            })
          )}
        </div>

        <div className="px-5 py-2.5 bg-[#0D0D0D] border-t border-[#1F1F1F] text-[10px] font-sans font-semibold uppercase tracking-[0.2em] text-[#71717A] flex justify-between">
          <span>AgentPay Command Engine</span>
          <span>Quick Actions</span>
        </div>

      </div>
    </div>
  );
};
