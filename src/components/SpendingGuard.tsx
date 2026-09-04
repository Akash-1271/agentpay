import React, { useState, useEffect } from 'react';
import { Sliders, Lock, CheckCircle2, Save, Key, Tag } from 'lucide-react';
import { AP2DelegationMandate } from '../types';

interface SpendingGuardProps {
  mandate: AP2DelegationMandate | null;
  dailySpent: number;
  onUpdateMandate: (updates: Partial<AP2DelegationMandate>) => Promise<void>;
}

export const SpendingGuard: React.FC<SpendingGuardProps> = ({
  mandate,
  dailySpent: _dailySpent,
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
      <div className="card-dark p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-[#1F1F1F]">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/15 text-zinc-300 text-xs font-semibold mb-3">
            <Lock className="w-3.5 h-3.5" />
            <span>Cryptographic Policy Guardrails</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Bounded Spending Enclave Configuration
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            Define mathematical hard-ceilings, category allowances, and step-up authorization thresholds for all AI buyer agents.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary px-6 py-3 text-xs font-semibold flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
        >
          {saving ? (
            <span>Signing Mandate...</span>
          ) : savedSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
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
        <div className="lg:col-span-7 card-dark p-6 space-y-6">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-zinc-300" />
            <span>Autonomous Spending Thresholds</span>
          </h3>

          {/* Single-Tx Auto-Approval Limit */}
          <div className="p-4 rounded-xl bg-[#0D0D0D] border border-[#1F1F1F] space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <label className="text-xs font-bold text-zinc-200">
                  Single-Transaction Auto-Approval Limit
                </label>
                <p className="text-[11px] text-zinc-400">
                  Transactions above this trigger human Biometric/OTP Step-Up
                </p>
              </div>
              <span className="text-base font-mono font-extrabold text-white px-3 py-1 bg-white/[0.06] rounded-lg border border-white/15">
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
              className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-white"
            />
            <div className="flex justify-between text-[10px] font-mono text-zinc-500">
              <span>₹500 (Strict)</span>
              <span>₹2,000 (Default)</span>
              <span>₹10,000 (Permissive)</span>
            </div>
          </div>

          {/* Daily Cumulative Ceiling */}
          <div className="p-4 rounded-xl bg-[#0D0D0D] border border-[#1F1F1F] space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <label className="text-xs font-bold text-zinc-200">
                  Daily Cumulative Spending Ceiling
                </label>
                <p className="text-[11px] text-zinc-400">
                  Hard ceiling; agents cannot exceed even with step-up
                </p>
              </div>
              <span className="text-base font-mono font-extrabold text-white px-3 py-1 bg-white/[0.06] rounded-lg border border-white/15">
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
              className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-white"
            />
            <div className="flex justify-between text-[10px] font-mono text-zinc-500">
              <span>₹5,000</span>
              <span>₹15,000 (Default)</span>
              <span>₹50,000</span>
            </div>
          </div>

          {/* Allowed Categories */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-zinc-200">
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
                        ? 'bg-white/[0.08] border-white/30 text-white'
                        : 'bg-white/[0.02] border-[#1F1F1F] text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    <span>{cat}</span>
                    <span className={`w-2 h-2 rounded-full ${active ? 'bg-white' : 'bg-neutral-700'}`} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Whitelist & Cryptographic Mandate (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Whitelisted Merchants */}
          <div className="card-dark p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Tag className="w-4 h-4 text-zinc-300" />
              <span>Whitelisted Merchant IDs</span>
            </h3>

            <div className="flex flex-wrap gap-2">
              {merchants.map((m) => (
                <span
                  key={m}
                  className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-white/[0.06] border border-white/15 text-zinc-200 font-mono text-xs"
                >
                  <span>{m}</span>
                  <button
                    onClick={() => handleRemoveMerchant(m)}
                    className="hover:text-rose-400 ml-1 text-zinc-500"
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
                className="flex-1 px-3 py-2 bg-[#0D0D0D] border border-[#1F1F1F] rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/40"
              />
              <button
                type="submit"
                className="btn-secondary px-4 py-2 text-xs font-semibold rounded-xl"
              >
                Add
              </button>
            </form>
          </div>

          {/* Active Cryptographic Mandate Certificate */}
          <div className="card-dark p-6 space-y-3 border-[#1F1F1F]">
            <div className="flex items-center space-x-2 text-xs font-bold text-zinc-300">
              <Key className="w-4 h-4 text-zinc-400" />
              <span>Active AP2 Delegation Certificate</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#080808] border border-[#1F1F1F] font-mono text-[11px] text-zinc-400 space-y-1.5 overflow-x-auto">
              <div>
                <span className="text-zinc-500">Mandate ID:</span> {mandate?.mandateId || 'ap2_man_default'}
              </div>
              <div>
                <span className="text-zinc-500">Principal:</span> {mandate?.principalUser || 'user_akash_ai_shopper'}
              </div>
              <div>
                <span className="text-zinc-500">Authorized Agent:</span> {mandate?.authorizedAgent || 'agent_buyer_concierge'}
              </div>
              <div className="truncate">
                <span className="text-zinc-500">HMAC-SHA256 Sig:</span> {mandate?.cryptographicSignature || 'sig_verified_7a9c8'}
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
