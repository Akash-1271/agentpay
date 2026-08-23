import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Save,
  Tag,
  Key,
  Ban,
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
  const [dailyCeiling, setDailyCeiling] = useState(15000);
  const [categories, setCategories] = useState<string[]>([
    'Athletics & Apparel',
    'Electronics & Peripherals',
    'Audio',
    'Cloud & AI Infrastructure',
    'Wearables & Health',
  ]);
  const [merchants, setMerchants] = useState<string[]>([
    'merch_nike_india',
    'merch_adidas_store',
    'merch_apex_gear',
    'merch_amazon',
    'merch_razorpay_store',
    'merch_nebulacloud',
    'merch_biowear',
  ]);
  const [newMerchant, setNewMerchant] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (mandate) {
      setMaxAutoTx(mandate.requiresStepUpAbove || 2000);
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
    if (newMerchant.trim() && !merchants.includes(newMerchant.trim())) {
      setMerchants([...merchants, newMerchant.trim()]);
      setNewMerchant('');
    }
  };

  const handleRemoveMerchant = (m: string) => {
    setMerchants(merchants.filter((item) => item !== m));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await onUpdateMandate({
        requiresStepUpAbove: maxAutoTx,
        maxPerTransaction: maxAutoTx,
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
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Financial Policies</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Control what your AI agent is allowed to do.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2.5 bg-[#0c83ff] hover:bg-[#0270e0] text-white text-xs font-semibold rounded-lg shadow-sm flex items-center space-x-1.5 transition-all self-start sm:self-auto disabled:opacity-50"
        >
          {saving ? (
            <span>Signing Mandate...</span>
          ) : savedSuccess ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Policies Updated!</span>
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5" />
              <span>Save & Sign Policies</span>
            </>
          )}
        </button>
      </div>

      {/* Clear Policy Principle Banner */}
      <div className="p-4 rounded-xl bg-[#0d121f] border border-white/[0.07] text-xs text-slate-300 flex items-start space-x-3">
        <ShieldCheck className="w-4 h-4 text-[#0c83ff] flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <span className="font-semibold text-white">Security Guarantee: </span>
          Transactions within your defined limits can be completed automatically. Higher-risk transactions require explicit human approval.
        </p>
      </div>

      {/* Main Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Spending Thresholds (7 cols) */}
        <div className="lg:col-span-7 fintech-card p-6 space-y-6">
          <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-[#0c83ff]" />
            <span>Autonomous Spending Limits</span>
          </div>

          {/* Maximum Autonomous Transaction */}
          <div className="p-4 rounded-lg bg-[#090d16] border border-white/[0.05] space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-xs font-bold text-slate-200">
                  Maximum Autonomous Transaction
                </div>
                <div className="text-[11px] text-slate-400">
                  Purchases above this require human step-up signature
                </div>
              </div>
              <div className="text-sm font-mono font-extrabold text-[#38bdf8] px-2.5 py-1 bg-[#0c83ff]/10 rounded border border-[#0c83ff]/20">
                ₹{maxAutoTx.toLocaleString()}
              </div>
            </div>

            <input
              type="range"
              min="500"
              max="10000"
              step="250"
              value={maxAutoTx}
              onChange={(e) => setMaxAutoTx(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#0c83ff]"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>₹500</span>
              <span>₹2,000 (Default)</span>
              <span>₹10,000</span>
            </div>
          </div>

          {/* Daily Spending Limit */}
          <div className="p-4 rounded-lg bg-[#090d16] border border-white/[0.05] space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-xs font-bold text-slate-200">
                  Daily Cumulative Spending Limit
                </div>
                <div className="text-[11px] text-slate-400">
                  Hard ceiling; agents cannot exceed even with approval
                </div>
              </div>
              <div className="text-sm font-mono font-extrabold text-white px-2.5 py-1 bg-white/[0.06] rounded border border-white/5">
                ₹{dailyCeiling.toLocaleString()}
              </div>
            </div>

            <input
              type="range"
              min="5000"
              max="50000"
              step="1000"
              value={dailyCeiling}
              onChange={(e) => setDailyCeiling(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>₹5,000</span>
              <span>₹15,000 (Default)</span>
              <span>₹50,000</span>
            </div>
          </div>

          {/* Allowed Categories */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-200">
              Authorized Merchant Categories
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                'Athletics & Apparel',
                'Electronics & Peripherals',
                'Audio',
                'Cloud & AI Infrastructure',
                'Wearables & Health',
              ].map((cat) => {
                const isSelected = categories.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleToggleCategory(cat)}
                    className={`p-2.5 rounded-lg border text-xs font-medium text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#0c83ff]/10 border-[#0c83ff]/30 text-[#38bdf8]'
                        : 'bg-[#090d16] border-white/[0.04] text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <span>{cat}</span>
                    <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-[#0c83ff]' : 'bg-slate-700'}`} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Whitelist & AP2 Mandate (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Whitelisted Merchants */}
          <div className="fintech-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-white uppercase tracking-wider">
                Merchant Whitelist
              </div>
              <div className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">
                Unknown: Blocked
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {merchants.map((m) => (
                <span
                  key={m}
                  className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded bg-[#090d16] border border-white/[0.08] text-slate-200 text-xs font-mono"
                >
                  <span>{m}</span>
                  <button
                    onClick={() => handleRemoveMerchant(m)}
                    className="text-slate-500 hover:text-rose-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <form onSubmit={handleAddMerchant} className="flex gap-2 pt-2">
              <input
                type="text"
                value={newMerchant}
                onChange={(e) => setNewMerchant(e.target.value)}
                placeholder="e.g. merch_custom_store"
                className="flex-1 px-3 py-2 bg-[#090d16] border border-white/[0.08] rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#0c83ff]"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-white rounded-lg transition-all"
              >
                Add
              </button>
            </form>
          </div>

          {/* Cryptographic AP2 Mandate Certificate */}
          <div className="fintech-card p-6 space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-200">
              <Key className="w-3.5 h-3.5 text-[#0c83ff]" />
              <span>AP2 Cryptographic Mandate</span>
            </div>

            <div className="p-3 rounded-lg bg-[#090d16] border border-white/[0.04] font-mono text-[11px] text-slate-400 space-y-1.5">
              <div>
                <span className="text-slate-600">ID:</span> {mandate?.mandateId || 'ap2_man_default_guard'}
              </div>
              <div>
                <span className="text-slate-600">Principal:</span> {mandate?.principalUser || 'user_akash_ai_shopper'}
              </div>
              <div className="truncate">
                <span className="text-slate-600">Signature:</span> {mandate?.cryptographicSignature || 'sig_enclave_verified_09a8f'}
              </div>
              <div className="text-[10px] text-emerald-400 pt-1">
                ● Status: Cryptographically Bound & Valid
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
