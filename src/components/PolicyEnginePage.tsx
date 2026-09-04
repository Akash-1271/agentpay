import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Save,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Plus,
  X,
  Sparkles,
  Lock,
  Zap,
} from 'lucide-react';
import { AP2DelegationMandate } from '../types';

interface PolicyEnginePageProps {
  mandate: AP2DelegationMandate | null;
  dailySpent: number;
  onUpdateMandate: (updates: Partial<AP2DelegationMandate>) => Promise<void>;
}

const SANDBOX_PREVIEW_PRODUCTS = [
  { name: 'Anker 65W GaN Fast Charger', price: 1499, store: 'Amazon India' },
  { name: 'Nike Air Zoom Pegasus 40', price: 1709, store: 'Nike Store' },
  { name: 'Puma Velocity Nitro 2 Shoes', price: 1499, store: 'Puma India' },
  { name: 'Redragon K552 RGB Keyboard', price: 2499, store: 'Amazon India' },
  { name: 'Royal Kludge RK84 Keyboard', price: 3499, store: 'Flipkart India' },
  { name: 'Keychron Q1 Pro Custom Keyboard', price: 3899, store: 'Apex Gear' },
  { name: 'Ultrahuman Titanium Ring AIR', price: 4999, store: 'Ultrahuman' },
  { name: 'Sony WH-1000XM5 ANC Headphones', price: 24990, store: 'Appario Retail' },
];

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
        whitelistedMerchants: merchants,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const autoApprovedItems = SANDBOX_PREVIEW_PRODUCTS.filter((p) => p.price <= maxAutoTx);
  const gatedItems = SANDBOX_PREVIEW_PRODUCTS.filter((p) => p.price > maxAutoTx);

  return (
    <div className="space-y-8 animate-in max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="luxury-eyebrow mb-2">ENCLAVE POLICY BOUNDARIES</div>
          <h1 className="font-playfair text-3xl sm:text-4xl text-stone-100 font-bold tracking-tight">
            Spending Limits & Mandates
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1 font-sans leading-relaxed">
            Configure bounded financial constraints. The buyer agent mathematically cannot breach these parameters.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-gold-primary text-xs h-10 px-6 self-start sm:self-auto flex items-center gap-2"
        >
          <Save className="w-3.5 h-3.5 shrink-0" />
          <span>{saving ? 'Saving...' : 'Save Limits'}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3.5 border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-mono uppercase tracking-[0.16em] font-semibold flex items-center space-x-2 animate-in rounded-xl">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>Limits updated successfully in cryptographic enclave!</span>
        </div>
      )}

      {/* Control 1: Max per single purchase */}
      <div className="glass-gold p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div>
            <h3 className="font-playfair text-base font-bold text-stone-100">
              Autonomous Approval Threshold
            </h3>
            <p className="text-xs text-stone-400 font-sans mt-0.5">
              Purchases exceeding this threshold trigger biometric passkey gating.
            </p>
          </div>
          <div className="font-playfair text-2xl font-bold text-stone-100">
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
          className="w-full accent-[#a78b71] cursor-pointer h-2 bg-black/60 rounded-lg"
        />

        <div className="flex justify-between text-[10px] font-mono text-stone-400">
          <span>Min: ₹500</span>
          <span className="text-[#e8d5b7] font-bold">Current: ₹{maxAutoTx.toLocaleString()}</span>
          <span>Max: ₹10,000</span>
        </div>

        {/* Live Interactive Sandbox Split Matrix */}
        <div className="pt-3 border-t border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-[#c9b8a0] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#c9b8a0]" />
              LIVE ENCLAVE SIMULATION MATRIX
            </span>
            <span className="text-[10px] font-mono text-stone-400">
              {autoApprovedItems.length} Instant · {gatedItems.length} Gated
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Auto Approved Column */}
            <div className="p-3.5 bg-emerald-950/20 border border-emerald-500/30 rounded-xl space-y-2">
              <div className="text-[10px] font-mono uppercase font-bold text-emerald-400 flex items-center gap-1">
                <Zap className="w-3 h-3 text-emerald-400" />
                <span>Auto-Approved (&le; ₹{maxAutoTx.toLocaleString()})</span>
              </div>
              <div className="space-y-1.5 text-xs font-sans">
                {autoApprovedItems.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-stone-200 text-[11px] bg-black/40 px-2.5 py-1 rounded border border-white/5">
                    <span className="truncate">{item.name}</span>
                    <strong className="font-mono text-emerald-400 ml-2">₹{item.price.toLocaleString()}</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Step-Up Required Column */}
            <div className="p-3.5 bg-[#a78b71]/10 border border-[#a78b71]/30 rounded-xl space-y-2">
              <div className="text-[10px] font-mono uppercase font-bold text-[#e8d5b7] flex items-center gap-1">
                <Lock className="w-3 h-3 text-[#c9b8a0]" />
                <span>Passkey Step-Up (&gt; ₹{maxAutoTx.toLocaleString()})</span>
              </div>
              <div className="space-y-1.5 text-xs font-sans">
                {gatedItems.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-stone-200 text-[11px] bg-black/40 px-2.5 py-1 rounded border border-white/5">
                    <span className="truncate">{item.name}</span>
                    <strong className="font-mono text-[#e8d5b7] ml-2">₹{item.price.toLocaleString()}</strong>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Control 2: Daily budget ceiling */}
      <div className="glass-gold p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div>
            <h3 className="font-playfair text-base font-bold text-stone-100">
              Daily Spending Ceiling
            </h3>
            <p className="text-xs text-stone-400 font-sans mt-0.5">
              Hard limit on aggregate money movement allowed within any 24-hour cycle.
            </p>
          </div>
          <div className="font-playfair text-2xl font-bold text-stone-100">
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
          className="w-full accent-[#a78b71] cursor-pointer h-2 bg-black/60 rounded-lg"
        />

        <div className="flex justify-between text-[10px] font-mono text-stone-400">
          <span>Min: ₹5,000/day</span>
          <span className="text-[#e8d5b7] font-bold">Current: ₹{dailyCeiling.toLocaleString()}/day</span>
          <span>Max: ₹100,000/day</span>
        </div>
      </div>

      {/* Control 3: Approved Stores */}
      <div className="glass-gold p-6 space-y-4">
        <div className="border-b border-white/10 pb-3">
          <h3 className="font-playfair text-base font-bold text-stone-100">
            Authorized Merchant Whitelist
          </h3>
          <p className="text-xs text-stone-400 font-sans mt-0.5">
            The buyer agent will only execute transactions with verified UAP merchants.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {merchants.map((store) => (
            <span
              key={store}
              className="inline-flex items-center space-x-2 px-3 py-1.5 border border-[#a78b71]/30 bg-[#a78b71]/10 rounded-xl text-xs font-sans text-[#e8d5b7] shadow-sm"
            >
              <span>{store}</span>
              <button
                type="button"
                onClick={() => handleRemoveStore(store)}
                className="text-stone-400 hover:text-rose-400 transition-colors"
              >
                <X className="w-3.5 h-3.5 shrink-0" />
              </button>
            </span>
          ))}
        </div>

        <form onSubmit={handleAddStore} className="flex gap-3 pt-2">
          <div className="luxury-input-wrapper flex-1">
            <input
              type="text"
              value={newStore}
              onChange={(e) => setNewStore(e.target.value)}
              placeholder="Add another trusted merchant (e.g. Croma India)..."
              className="luxury-input text-xs"
            />
          </div>
          <button
            type="submit"
            disabled={!newStore.trim()}
            className="btn-gold-secondary text-xs h-10 px-5 shrink-0 flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 shrink-0" />
            <span>Add Store</span>
          </button>
        </form>
      </div>

      {/* Progressive Disclosure: Technical JSON Mandate */}
      <div className="pt-2">
        <button
          onClick={() => setShowTechnical(!showTechnical)}
          className="font-sans text-xs text-[#c9b8a0] hover:text-[#e8d5b7] flex items-center space-x-1.5 tracking-wider uppercase font-semibold transition-colors"
        >
          <span>{showTechnical ? 'Hide Enclave Mandate' : 'View Cryptographic AP2 Mandate (JSON)'}</span>
          {showTechnical ? <ChevronUp className="w-3.5 h-3.5 shrink-0 text-[#c9b8a0]" /> : <ChevronDown className="w-3.5 h-3.5 shrink-0 text-[#c9b8a0]" />}
        </button>

        {showTechnical && (
          <div className="mt-3 p-5 border border-[#a78b71]/20 bg-black/80 space-y-2 text-xs font-mono text-[#e8d5b7] animate-in shadow-2xl rounded-2xl">
            <div className="text-[#c9b8a0] uppercase text-[10px] font-bold tracking-widest pb-1 border-b border-white/10">
              Hardware-Signed Mandate Payload
            </div>
            <pre className="overflow-x-auto text-[11px] leading-relaxed text-[#e8d5b7]">
              {JSON.stringify(
                {
                  mandateId: mandate?.mandateId || 'mandate_user_main_001',
                  enclaveFingerprint: 'SHA256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
                  autonomousThresholdINR: maxAutoTx,
                  dailyCeilingINR: dailyCeiling,
                  authorizedMerchants: merchants,
                  hardwareEnclaveStatus: 'ACTIVE_HARDWARE_ATTESTED',
                },
                null,
                2
              )}
            </pre>
          </div>
        )}
      </div>

    </div>
  );
};
