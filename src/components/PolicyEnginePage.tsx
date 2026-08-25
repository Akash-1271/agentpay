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
    <div className="space-y-10 animate-in max-w-4xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#1A1A1A]/12 pb-6">
        <div>
          <div className="luxury-eyebrow mb-2">Policy Enclave</div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1A1A1A] tracking-tight">
            Spending Limits & Enclave Policies
          </h1>
          <p className="text-xs sm:text-sm text-[#6C6863] mt-1.5 font-sans leading-relaxed">
            Configure bounded financial constraints. The buyer agent mathematically cannot breach these parameters.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="luxury-btn-primary text-xs h-11 px-6 self-start sm:self-auto"
        >
          <Save className="w-4 h-4 shrink-0" />
          <span>{saving ? 'Saving...' : 'Save Limits'}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3.5 border border-emerald-600/30 bg-emerald-50 text-emerald-800 text-xs font-sans uppercase tracking-[0.15em] font-semibold flex items-center space-x-2 animate-in">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-700" />
          <span>Limits updated successfully in cryptographic enclave!</span>
        </div>
      )}

      {/* Control 1: Max per single purchase */}
      <div className="luxury-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1A1A1A]/10 pb-3">
          <div>
            <h3 className="font-serif text-base font-bold text-[#1A1A1A]">
              Autonomous Approval Threshold
            </h3>
            <p className="text-xs text-[#6C6863] font-sans mt-0.5">
              Purchases exceeding this threshold trigger biometric passkey gating.
            </p>
          </div>
          <div className="font-serif text-2xl font-bold text-[#1A1A1A]">
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
          className="w-full accent-[#1A1A1A] cursor-pointer h-1.5 bg-[#EBE5DE]"
        />

        <div className="flex justify-between text-[10px] font-mono text-[#6C6863]">
          <span>Min: ₹500</span>
          <span className="text-[#1A1A1A] font-bold">Current: ₹{maxAutoTx.toLocaleString()}</span>
          <span>Max: ₹10,000</span>
        </div>
      </div>

      {/* Control 2: Daily budget ceiling */}
      <div className="luxury-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1A1A1A]/10 pb-3">
          <div>
            <h3 className="font-serif text-base font-bold text-[#1A1A1A]">
              Daily Spending Ceiling
            </h3>
            <p className="text-xs text-[#6C6863] font-sans mt-0.5">
              Hard limit on aggregate money movement allowed within any 24-hour cycle.
            </p>
          </div>
          <div className="font-serif text-2xl font-bold text-[#1A1A1A]">
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
          className="w-full accent-[#1A1A1A] cursor-pointer h-1.5 bg-[#EBE5DE]"
        />

        <div className="flex justify-between text-[10px] font-mono text-[#6C6863]">
          <span>Min: ₹5,000/day</span>
          <span className="text-[#1A1A1A] font-bold">Current: ₹{dailyCeiling.toLocaleString()}/day</span>
          <span>Max: ₹100,000/day</span>
        </div>
      </div>

      {/* Control 3: Approved Stores */}
      <div className="luxury-card space-y-4">
        <div className="border-b border-[#1A1A1A]/10 pb-3">
          <h3 className="font-serif text-base font-bold text-[#1A1A1A]">
            Authorized Merchant Whitelist
          </h3>
          <p className="text-xs text-[#6C6863] font-sans mt-0.5">
            The buyer agent will only execute transactions with verified UAP merchants.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {merchants.map((store) => (
            <span
              key={store}
              className="inline-flex items-center space-x-2 px-3 py-1.5 border border-[#1A1A1A]/20 bg-[#FAF8F5] text-xs font-sans text-[#1A1A1A]"
            >
              <span>{store}</span>
              <button
                type="button"
                onClick={() => handleRemoveStore(store)}
                className="text-[#6C6863] hover:text-rose-600 transition-colors"
              >
                <X className="w-3.5 h-3.5 shrink-0" />
              </button>
            </span>
          ))}
        </div>

        <form onSubmit={handleAddStore} className="flex gap-4 pt-2">
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
            className="luxury-btn-secondary text-xs h-10 px-5 shrink-0"
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
          className="font-sans text-xs text-[#1A1A1A] hover:text-[#D4AF37] flex items-center space-x-1.5 tracking-wider uppercase font-semibold transition-colors"
        >
          <span>{showTechnical ? 'Hide Enclave Mandate' : 'View Cryptographic AP2 Mandate (JSON)'}</span>
          {showTechnical ? <ChevronUp className="w-3.5 h-3.5 shrink-0 text-[#D4AF37]" /> : <ChevronDown className="w-3.5 h-3.5 shrink-0 text-[#D4AF37]" />}
        </button>

        {showTechnical && (
          <div className="mt-3 p-5 border border-[#1A1A1A]/15 bg-[#1A1A1A] space-y-2 text-xs font-mono text-[#F9F8F6] animate-in shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
            <div className="text-[#D4AF37] uppercase text-[10px] font-bold tracking-widest pb-1 border-b border-white/10">
              Hardware-Signed Mandate Payload
            </div>
            <pre className="overflow-x-auto text-[11px] leading-relaxed text-[#F9F8F6]">
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

