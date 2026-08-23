import React, { useState, useEffect } from 'react';
import { ShieldCheck, Sliders, Lock, CheckCircle2, AlertCircle, Save, Key, Tag } from 'lucide-react';
import { AP2DelegationMandate } from '../types';

interface SpendingGuardProps {
  mandate: AP2DelegationMandate | null;
  dailySpent: number;
  onUpdateMandate: (updates: Partial<AP2DelegationMandate>) => Promise<void>;
}

export const SpendingGuard: React.FC<SpendingGuardProps> = ({
  mandate,
  dailySpent,
  onUpdateMandate,
}) => {
  const [singleLimit, setSingleLimit] = useState(2000);
  const [dailyCeiling, setDailyCeiling] = useState(15000);
  const [categories, setCategories] = useState<string[]>([
    'Electronics & Peripherals',
    'Audio',
    'Cloud & AI Infrastructure',
    'Wearables & Health',
  ]);
  const [merchants, setMerchants] = useState<string[]>(['merch_apex_gear', 'merch_nebulacloud', 'merch_biowear']);
  const [newMerchantInput, setNewMerchantInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (mandate) {
      setSingleLimit(mandate.requiresStepUpAbove || 2000);
      setDailyCeiling(mandate.dailyCeiling || 15000);
      if (mandate.allowedMerchantCategories) setCategories(mandate.allowedMerchantCategories);
      if (mandate.whitelistedMerchants) setMerchants(mandate.whitelistedMerchants);
    }
  }, [mandate]);

  const handleToggleCategory = (cat: string) => {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleAddMerchant = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMerchantInput.trim() && !merchants.includes(newMerchantInput.trim())) {
      setMerchants([...merchants, newMerchantInput.trim()]);
      setNewMerchantInput('');
    }
  };

  const handleRemoveMerchant = (m: string) => {
    setMerchants(merchants.filter((item) => item !== m));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await onUpdateMandate({
        requiresStepUpAbove: singleLimit,
        maxPerTransaction: singleLimit,
        dailyCeiling,
        allowedMerchantCategories: categories,
        whitelistedMerchants: merchants,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-amber-500/20">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold mb-3">
            <Lock className="w-3.5 h-3.5" />
            <span>Cryptographic Policy Guardrails</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            Bounded Spending Enclave Configuration
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Define mathematical hard-ceilings, category allowances, and step-up authorization thresholds for all AI buyer agents.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-extrabold text-sm rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
        >
          {saving ? (
            <span>Signing Mandate...</span>
          ) : savedSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Enclave Synced!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save & Sign Policy</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Spending Limits (7 cols) */}
        <div className="lg:col-span-7 glass-panel p-6 space-y-6">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-amber-400" />
            <span>Autonomous Spending Thresholds</span>
          </h3>

          {/* Single-Tx Auto-Approval Limit */}
          <div className="p-4 rounded-xl bg-[#090b10] border border-white/5 space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <label className="text-xs font-bold text-slate-200">
                  Single-Transaction Auto-Approval Limit
                </label>
                <p className="text-[11px] text-slate-400">
                  Transactions above this trigger human Biometric/OTP Step-Up
                </p>
              </div>
              <span className="text-base font-mono font-extrabold text-amber-400 px-3 py-1 bg-amber-500/10 rounded-lg border border-amber-500/20">
                ₹{singleLimit.toLocaleString()}
              </span>
            </div>

            <input
              type="range"
              min="500"
              max="10000"
              step="250"
              value={singleLimit}
              onChange={(e) => setSingleLimit(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>₹500 (Strict)</span>
              <span>₹2,000 (Default)</span>
              <span>₹10,000 (Permissive)</span>
            </div>
          </div>

          {/* Daily Cumulative Ceiling */}
          <div className="p-4 rounded-xl bg-[#090b10] border border-white/5 space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <label className="text-xs font-bold text-slate-200">
                  Daily Cumulative Spending Ceiling
                </label>
                <p className="text-[11px] text-slate-400">
                  Hard ceiling; agents cannot exceed even with step-up
                </p>
              </div>
              <span className="text-base font-mono font-extrabold text-[#38bdf8] px-3 py-1 bg-[#0c83ff]/10 rounded-lg border border-[#0c83ff]/20">
                ₹{dailyCeiling.toLocaleString()}
              </span>
            </div>

            <input
              type="range"
              min="5000"
              max="50000"
              step="1000"
              value={dailyCeiling}
              onChange={(e) => setDailyCeiling(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#0c83ff]"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>₹5,000</span>
              <span>₹15,000 (Default)</span>
              <span>₹50,000</span>
            </div>
          </div>

          {/* Allowed Categories */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-200">
              Authorized Merchant Categories
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                'Electronics & Peripherals',
                'Audio',
                'Cloud & AI Infrastructure',
                'Wearables & Health',
              ].map((cat) => {
                const active = categories.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleToggleCategory(cat)}
                    className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all flex items-center justify-between ${
                      active
                        ? 'bg-[#0c83ff]/10 border-[#0c83ff]/40 text-[#38bdf8]'
                        : 'bg-white/[0.02] border-white/5 text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <span>{cat}</span>
                    <span className={`w-2 h-2 rounded-full ${active ? 'bg-[#0c83ff]' : 'bg-slate-700'}`} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Whitelist & Cryptographic Mandate (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Whitelisted Merchants */}
          <div className="glass-panel p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Tag className="w-4 h-4 text-emerald-400" />
              <span>Whitelisted Merchant IDs</span>
            </h3>

            <div className="flex flex-wrap gap-2">
              {merchants.map((m) => (
                <span
                  key={m}
                  className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-mono text-xs"
                >
                  <span>{m}</span>
                  <button
                    onClick={() => handleRemoveMerchant(m)}
                    className="hover:text-rose-400 ml-1 text-slate-400"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <form onSubmit={handleAddMerchant} className="flex space-x-2 pt-2">
              <input
                type="text"
                value={newMerchantInput}
                onChange={(e) => setNewMerchantInput(e.target.value)}
                placeholder="merch_custom_store"
                className="flex-1 px-3 py-2 bg-[#090b10] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#0c83ff]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-xs font-semibold text-white rounded-xl transition-all"
              >
                Add
              </button>
            </form>
          </div>

          {/* Active Cryptographic Mandate Certificate */}
          <div className="glass-panel p-6 space-y-3 border-white/5">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-300">
              <Key className="w-4 h-4 text-amber-400" />
              <span>Active AP2 Delegation Certificate</span>
            </div>

            <div className="p-3.5 rounded-xl bg-black/60 border border-white/5 font-mono text-[11px] text-slate-400 space-y-1.5 overflow-x-auto">
              <div>
                <span className="text-slate-500">Mandate ID:</span> {mandate?.mandateId || 'ap2_man_default'}
              </div>
              <div>
                <span className="text-slate-500">Principal:</span> {mandate?.principalUser || 'user_akash_ai_shopper'}
              </div>
              <div>
                <span className="text-slate-500">Authorized Agent:</span> {mandate?.authorizedAgent || 'agent_buyer_concierge'}
              </div>
              <div className="truncate">
                <span className="text-slate-500">HMAC-SHA256 Sig:</span> {mandate?.cryptographicSignature || 'sig_verified_7a9c8'}
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
