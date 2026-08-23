import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Save,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Plus,
  X,
} from 'lucide-react';
import { AP2DelegationMandate } from '../types';

interface PolicyEnginePageProps {
  mandate: AP2DelegationMandate | null;
  dailySpent: number;
  onUpdateMandate: (updates: Partial<AP2DelegationMandate>) => Promise<void>;
}

export const PolicyEnginePage: React.FC<PolicyEnginePageProps> = ({
  mandate,
  dailySpent,
  onUpdateMandate,
}) => {
  const [maxAutoTx, setMaxAutoTx] = useState(2000);
  const [dailyCeiling, setDailyCeiling] = useState(25000);
  const [merchants, setMerchants] = useState<string[]>([
    'Amazon India',
    'Nike Official',
    'Adidas Store',
    'Keychron India',
    'Anker Store',
    'Bose India',
  ]);
  const [newStore, setNewStore] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showTechnical, setShowTechnical] = useState(false);

  useEffect(() => {
    if (mandate) {
      setMaxAutoTx(mandate.requiresStepUpAbove || 2000);
      setDailyCeiling(mandate.dailyCeiling || 25000);
    }
  }, [mandate]);

  const handleAddStore = (e: React.FormEvent) => {
    e.preventDefault();
    if (newStore.trim() && !merchants.includes(newStore.trim())) {
      setMerchants([...merchants, newStore.trim()]);
      setNewStore('');
    }
  };

  const handleRemoveStore = (s: string) => {
    setMerchants(merchants.filter((item) => item !== s));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await onUpdateMandate({
        requiresStepUpAbove: maxAutoTx,
        maxPerTransaction: maxAutoTx,
        dailyCeiling,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200 max-w-4xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Spending Limits</h1>
          <p className="text-sm text-slate-400 mt-1">
            Control how much can be spent without asking you first.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 bg-[#0c83ff] hover:bg-[#0270e0] text-white text-xs font-bold rounded-lg shadow-sm flex items-center space-x-2 transition-all self-start"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Limits'}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>Limits updated successfully!</span>
        </div>
      )}

      {/* Control 1: Max per single purchase */}
      <div className="fintech-card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-white">Auto-approve limit</h3>
            <p className="text-xs text-slate-400">Purchases over this amount will always ask for your confirmation.</p>
          </div>
          <div className="text-xl font-extrabold text-white font-mono">
            ₹{maxAutoTx.toLocaleString()}
          </div>
        </div>

        <input
          type="range"
          min="500"
          max="10000"
          step="500"
          value={maxAutoTx}
          onChange={(e) => setMaxAutoTx(Number(e.target.value))}
          className="w-full accent-[#0c83ff] cursor-pointer"
        />

        <div className="flex justify-between text-xs text-slate-500 font-mono">
          <span>₹500 (Strict)</span>
          <span>₹10,000 (Relaxed)</span>
        </div>
      </div>

      {/* Control 2: Daily limit */}
      <div className="fintech-card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-white">Daily spending limit</h3>
            <p className="text-xs text-slate-400">Maximum total amount that can be spent in a single day.</p>
          </div>
          <div className="text-xl font-extrabold text-white font-mono">
            ₹{dailyCeiling.toLocaleString()}
          </div>
        </div>

        <input
          type="range"
          min="5000"
          max="100000"
          step="5000"
          value={dailyCeiling}
          onChange={(e) => setDailyCeiling(Number(e.target.value))}
          className="w-full accent-[#0c83ff] cursor-pointer"
        />

        <div className="flex justify-between text-xs text-slate-500 font-mono">
          <span>₹5,000 / day</span>
          <span>₹1,00,000 / day</span>
        </div>
      </div>

      {/* Control 3: Approved Stores */}
      <div className="fintech-card p-6 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-white">Approved stores</h3>
          <p className="text-xs text-slate-400">Purchases will only be made from these verified stores.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {merchants.map((m) => (
            <span
              key={m}
              className="px-3 py-1.5 rounded-lg bg-[#090d16] border border-white/[0.08] text-xs font-semibold text-slate-200 flex items-center space-x-2"
            >
              <span>{m}</span>
              <button
                onClick={() => handleRemoveStore(m)}
                className="text-slate-500 hover:text-rose-400"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>

        <form onSubmit={handleAddStore} className="flex gap-2 max-w-sm pt-2">
          <input
            type="text"
            value={newStore}
            onChange={(e) => setNewStore(e.target.value)}
            placeholder="Add store name..."
            className="flex-1 px-3 py-2 bg-[#090d16] border border-white/[0.08] rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#0c83ff]"
          />
          <button
            type="submit"
            disabled={!newStore.trim()}
            className="px-3 py-2 bg-white/[0.06] hover:bg-white/[0.1] text-white text-xs font-bold rounded-lg border border-white/[0.08] flex items-center space-x-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </form>
      </div>

      {/* Progressive Disclosure: Technical details */}
      <div className="pt-2">
        <button
          onClick={() => setShowTechnical(!showTechnical)}
          className="text-xs text-slate-400 hover:text-slate-200 flex items-center space-x-1.5 transition-colors"
        >
          <span>{showTechnical ? 'Hide technical details' : 'Show technical security details'}</span>
          {showTechnical ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showTechnical && (
          <div className="mt-3 p-4 rounded-xl bg-[#090d16] border border-white/[0.05] space-y-2 text-xs font-mono text-slate-300">
            <div className="text-slate-500 uppercase text-[10px] font-bold">Cryptographic Policy Details</div>
            <div>Mandate ID: <strong className="text-white">{mandate?.mandateId || 'mandate_991823'}</strong></div>
            <div>Signature Algorithm: <strong className="text-white">HMAC-SHA256</strong></div>
            <div>Enclave Status: <strong className="text-emerald-400">HARDWARE_ISOLATED_OK</strong></div>
          </div>
        )}
      </div>

    </div>
  );
};
