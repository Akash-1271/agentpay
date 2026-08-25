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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A1A]/70 backdrop-blur-sm animate-in">
      <div className="relative w-full max-w-md bg-[#FFFFFF] border-2 border-[#1A1A1A] p-7 space-y-6 shadow-[0_16px_48px_rgba(0,0,0,0.25)]">
        
        {/* Top Gold Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#D4AF37]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#6C6863] hover:text-[#1A1A1A] p-1 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 border border-amber-600/30 bg-amber-50 flex items-center justify-center text-amber-800 shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">
                Step-Up Authorization Gating
              </h3>
              <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-600/30">
                &gt; ₹2,000 LIMIT
              </span>
            </div>
            <p className="text-xs text-[#6C6863] font-sans mt-0.5">
              Autonomous threshold exceeded. Cryptographic authorization required.
            </p>
          </div>
        </div>

        {/* Reason Alert */}
        <div className="p-3 border border-[#1A1A1A]/10 bg-[#FAF8F5] text-xs text-[#1A1A1A] font-mono leading-relaxed">
          ◆ {policyResult?.reason || 'Transaction exceeds autonomous limit.'}
        </div>

        {/* Transaction Summary Card */}
        <div className="p-4 border border-[#1A1A1A]/10 bg-[#FAF8F5] space-y-2 text-xs font-sans">
          <div className="flex justify-between items-center pb-2 border-b border-[#1A1A1A]/10">
            <span className="text-[#6C6863]">Product</span>
            <span className="font-serif font-bold text-[#1A1A1A] truncate max-w-[200px]">{selectedProduct?.name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#6C6863]">Merchant</span>
            <span className="text-[#1A1A1A] font-mono text-[11px] font-semibold">{quote.merchantId}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#6C6863]">Items</span>
            <span className="text-[#1A1A1A]">{quote.items?.length || 1} item(s)</span>
          </div>
          {quote.discountAmount > 0 && (
            <div className="flex justify-between items-center text-emerald-800">
              <span>Agent Bundle Savings</span>
              <span className="font-mono font-bold">-₹{quote.discountAmount.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between items-center pt-2.5 border-t border-[#1A1A1A]/12">
            <span className="font-sans font-bold text-[#1A1A1A] uppercase tracking-[0.15em] text-[11px]">Net Amount</span>
            <span className="font-serif text-2xl font-bold text-[#1A1A1A]">₹{quote.netAmount.toLocaleString()}</span>
          </div>
        </div>

        {/* Authentication Method Selector */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setAuthMethod('passkey')}
            className={`flex items-center justify-center space-x-2 py-3 px-3 border text-xs font-sans font-bold tracking-[0.15em] uppercase transition-all ${
              authMethod === 'passkey'
                ? 'bg-[#1A1A1A] text-[#F9F8F6] border-[#1A1A1A]'
                : 'border-[#1A1A1A]/20 text-[#6C6863] hover:text-[#1A1A1A]'
            }`}
          >
            <Fingerprint className="w-4 h-4 text-[#D4AF37]" />
            <span>Passkey</span>
          </button>

          <button
            type="button"
            onClick={() => setAuthMethod('otp')}
            className={`flex items-center justify-center space-x-2 py-3 px-3 border text-xs font-sans font-bold tracking-[0.15em] uppercase transition-all ${
              authMethod === 'otp'
                ? 'bg-[#1A1A1A] text-[#F9F8F6] border-[#1A1A1A]'
                : 'border-[#1A1A1A]/20 text-[#6C6863] hover:text-[#1A1A1A]'
            }`}
          >
            <KeyRound className="w-4 h-4 text-[#D4AF37]" />
            <span>SMS OTP</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="luxury-btn-secondary flex-1 h-11 text-xs"
          >
            Reject
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={approving}
            className="luxury-btn-primary flex-[2] h-11 text-xs flex items-center justify-center space-x-1.5"
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
