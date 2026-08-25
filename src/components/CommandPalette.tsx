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
    { label: 'Amazon Advisor & Reviews', type: 'nav', icon: Star, section: 'amazon' },
    { label: 'Executive Dashboard Overview', type: 'nav', icon: Home, section: 'overview' },
    { label: 'Purchase & Order Console', type: 'nav', icon: ShoppingBag, section: 'agent' },
    { label: 'Audit History & Ledger', type: 'nav', icon: History, section: 'transactions' },
    { label: 'Spending Limits & Enclave', type: 'nav', icon: ShieldCheck, section: 'policies' },
    { label: 'Merchant Catalog & Lookbook', type: 'nav', icon: Package, section: 'catalog' },
    { label: 'Evaluation Benchmark Suite', type: 'nav', icon: Layers, section: 'benchmark' },
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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4 bg-[#1A1A1A]/70 backdrop-blur-sm animate-in">
      <div className="relative w-full max-w-xl bg-[#FFFFFF] border-2 border-[#1A1A1A] shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden">
        
        {/* Top Gold Accent Bar */}
        <div className="h-1 bg-[#D4AF37] w-full" />

        {/* Search Input */}
        <div className="flex items-center px-5 py-4 border-b border-[#1A1A1A]/12 bg-[#FAF8F5]">
          <Search className="w-4 h-4 text-[#D4AF37] mr-3 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search commands, navigate, or dispatch intent..."
            className="w-full bg-transparent text-sm text-[#1A1A1A] placeholder-[#6C6863] focus:outline-none font-sans"
          />
          <span className="text-[10px] font-mono text-[#6C6863] px-2 py-0.5 border border-[#1A1A1A]/20 bg-[#FFFFFF]">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div className="max-h-72 overflow-y-auto p-2 space-y-1 text-xs">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-[#6C6863] text-xs font-sans">
              No matching commands located.
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(item)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left text-[#1A1A1A] hover:bg-[#FAF8F5] transition-all border border-transparent hover:border-[#1A1A1A]/10 group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 border border-[#1A1A1A]/15 bg-[#FAF8F5] flex items-center justify-center text-[#1A1A1A]">
                      <Icon className="w-3 h-3 text-[#D4AF37]" />
                    </div>
                    <span className="text-xs font-sans font-medium text-[#1A1A1A]">{item.label}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#1A1A1A]/30 group-hover:text-[#1A1A1A] transition-colors" />
                </button>
              );
            })
          )}
        </div>

        <div className="px-5 py-2.5 bg-[#FAF8F5] border-t border-[#1A1A1A]/10 text-[10px] font-sans font-semibold uppercase tracking-[0.2em] text-[#6C6863] flex justify-between">
          <span>AgentPay Command Engine</span>
          <span>Quick Actions</span>
        </div>

      </div>
    </div>
  );
};

