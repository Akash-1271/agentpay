import React, { useState } from 'react';
import {
  ShieldAlert,
  ArrowRight,
  X,
  Fingerprint,
  KeyRound,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in">
      <div className="relative w-full max-w-md bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl p-7 space-y-6 shadow-[0_24px_64px_rgba(0,0,0,0.9)] overflow-hidden">
        
        {/* Subtle Top Monochrome Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/20" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#71717A] hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 border border-amber-500/30 bg-amber-500/10 flex items-center justify-center text-amber-400 rounded-xl shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-playfair text-lg font-bold text-white">
                Step-Up Authorization Gating
              </h3>
              <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 rounded-md">
                &gt; ₹2,000 LIMIT
              </span>
            </div>
            <p className="text-xs text-[#A1A1AA] font-sans mt-0.5">
              Autonomous threshold exceeded. Cryptographic authorization required.
            </p>
          </div>
        </div>

        {/* Reason Alert */}
        <div className="p-3 border border-[#1F1F1F] bg-[#0D0D0D] rounded-xl text-xs text-[#D4D4D8] font-mono leading-relaxed">
          ◆ {policyResult?.reason || 'Transaction exceeds autonomous limit.'}
        </div>

        {/* Transaction Summary Card */}
        <div className="p-4 border border-[#1F1F1F] bg-[#0D0D0D] rounded-xl space-y-2 text-xs font-sans">
          <div className="flex justify-between items-center pb-2 border-b border-[#1F1F1F]">
            <span className="text-[#71717A]">Product</span>
            <span className="font-sans font-semibold text-white truncate max-w-[200px]">{selectedProduct?.name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#71717A]">Merchant</span>
            <span className="text-white font-mono text-[11px] font-semibold">{quote.merchantId}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#71717A]">Items</span>
            <span className="text-[#D4D4D8]">{quote.items?.length || 1} item(s)</span>
          </div>
          {quote.discountAmount > 0 && (
            <div className="flex justify-between items-center text-emerald-400">
              <span>Agent Bundle Savings</span>
              <span className="font-mono font-bold">-₹{quote.discountAmount.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between items-center pt-2.5 border-t border-[#1F1F1F]">
            <span className="font-sans font-bold text-[#A1A1AA] uppercase tracking-[0.15em] text-[11px]">Net Amount</span>
            <span className="font-playfair text-2xl font-bold text-white">₹{quote.netAmount.toLocaleString()}</span>
          </div>
        </div>

        {/* Authentication Method Selector */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setAuthMethod('passkey')}
            className={`flex items-center justify-center space-x-2 py-3 px-3 border rounded-xl text-xs font-sans font-bold tracking-[0.15em] uppercase transition-all ${
              authMethod === 'passkey'
                ? 'bg-white text-black border-white shadow-sm'
                : 'border-[#1F1F1F] bg-[#0D0D0D] text-[#71717A] hover:text-white'
            }`}
          >
            <Fingerprint className={`w-4 h-4 ${authMethod === 'passkey' ? 'text-black' : 'text-[#A1A1AA]'}`} />
            <span>Passkey</span>
          </button>

          <button
            type="button"
            onClick={() => setAuthMethod('otp')}
            className={`flex items-center justify-center space-x-2 py-3 px-3 border rounded-xl text-xs font-sans font-bold tracking-[0.15em] uppercase transition-all ${
              authMethod === 'otp'
                ? 'bg-white text-black border-white shadow-sm'
                : 'border-[#1F1F1F] bg-[#0D0D0D] text-[#71717A] hover:text-white'
            }`}
          >
            <KeyRound className={`w-4 h-4 ${authMethod === 'otp' ? 'text-black' : 'text-[#A1A1AA]'}`} />
            <span>SMS OTP</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary flex-1 h-11 text-xs rounded-xl"
          >
            Reject
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={approving}
            className="btn-primary flex-[2] h-11 text-xs flex items-center justify-center space-x-1.5 rounded-xl"
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
