import React, { useState } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  Lock,
  ArrowRight,
  X,
  KeyRound,
  Fingerprint,
} from 'lucide-react';
import { AgentTransactionOutcome } from '../types';

interface StepUpModalProps {
  outcome: AgentTransactionOutcome | null;
  onApprove: (approvalId: string, signature: string) => Promise<void>;
  onClose: () => void;
}

export const StepUpModal: React.FC<StepUpModalProps> = ({ outcome, onApprove, onClose }) => {
  const [approving, setApproving] = useState(false);
  const [authMethod, setAuthMethod] = useState<'passkey' | 'otp'>('passkey');

  if (!outcome || !outcome.stepUpApprovalId || !outcome.quote) {
    return null;
  }

  const { quote, stepUpApprovalId, selectedProduct, policyResult } = outcome;

  const handleConfirm = async () => {
    try {
      setApproving(true);
      const sig = authMethod === 'passkey' ? 'SIG_BIOMETRIC_TOUCH_ID_VERIFIED' : 'SIG_SMS_OTP_984214_CONFIRMED';
      await onApprove(stepUpApprovalId, sig);
    } finally {
      setApproving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-[#0d121f] border border-amber-500/30 rounded-xl shadow-2xl p-6 space-y-5">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/[0.05]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-bold text-white">Step-Up Gating</h3>
              <span className="px-1.5 py-0.2 text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 rounded">
                &gt; ₹2,000 Threshold
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Autonomous threshold exceeded. Human signature required.
            </p>
          </div>
        </div>

        {/* Reason Alert */}
        <div className="p-3 rounded-lg bg-[#090d16] border border-amber-500/20 text-xs text-amber-200/90 font-mono leading-relaxed">
          ⚠️ {policyResult?.reason || 'Transaction exceeds autonomous limit.'}
        </div>

        {/* Transaction Summary Card */}
        <div className="p-3.5 rounded-lg bg-[#090d16] border border-white/[0.04] space-y-2 text-xs">
          <div className="flex justify-between items-center pb-2 border-b border-white/[0.04]">
            <span className="text-slate-400">Product</span>
            <span className="font-semibold text-white truncate max-w-[200px]">{selectedProduct?.name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Merchant</span>
            <span className="text-slate-200 font-mono text-[11px]">{quote.merchantId}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Items / Addons</span>
            <span className="text-slate-200">{quote.items.length} item(s)</span>
          </div>
          {quote.discountAmount > 0 && (
            <div className="flex justify-between items-center text-emerald-400">
              <span>Agent Bundle Savings</span>
              <span className="font-mono">-₹{quote.discountAmount.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between items-center pt-2 border-t border-white/[0.07] font-bold">
            <span className="text-white">Net Amount</span>
            <span className="text-[#38bdf8] font-mono text-sm">₹{quote.netAmount.toLocaleString()}</span>
          </div>
        </div>

        {/* Authentication Method Selector */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => setAuthMethod('passkey')}
            className={`flex items-center justify-center space-x-2 py-2 px-3 rounded-lg border text-xs font-semibold transition-all ${
              authMethod === 'passkey'
                ? 'bg-[#0c83ff]/15 border-[#0c83ff] text-[#38bdf8]'
                : 'bg-[#090d16] border-white/[0.04] text-slate-400 hover:text-slate-200'
            }`}
          >
            <Fingerprint className="w-3.5 h-3.5" />
            <span>Biometric Passkey</span>
          </button>

          <button
            type="button"
            onClick={() => setAuthMethod('otp')}
            className={`flex items-center justify-center space-x-2 py-2 px-3 rounded-lg border text-xs font-semibold transition-all ${
              authMethod === 'otp'
                ? 'bg-[#0c83ff]/15 border-[#0c83ff] text-[#38bdf8]'
                : 'bg-[#090d16] border-white/[0.04] text-slate-400 hover:text-slate-200'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Hardware OTP</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2.5 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 px-3 rounded-lg border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] text-xs font-medium text-slate-300 transition-all"
          >
            Reject
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={approving}
            className="flex-[2] py-2 px-3 rounded-lg bg-[#0c83ff] hover:bg-[#0270e0] text-white text-xs font-bold shadow-sm flex items-center justify-center space-x-1.5 transition-all disabled:opacity-50"
          >
            {approving ? (
              <span>Authorizing...</span>
            ) : (
              <>
                <span>Sign ₹{quote.netAmount.toLocaleString()}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
