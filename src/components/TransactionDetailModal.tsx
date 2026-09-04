import React from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  Lock,
  ArrowDown,
  Layers,
  FileText,
  Clock,
  ExternalLink,
} from 'lucide-react';

export interface DisplayTransaction {
  id: string;
  productName: string;
  merchantName: string;
  merchantId: string;
  amount: number;
  currency: string;
  status: 'COMPLETED' | 'STEP_UP_REQUIRED' | 'BLOCKED';
  timestamp: string;
  orderId: string;
  paymentId?: string;
  policyReason: string;
  enclaveHash: string;
  userPrompt: string;
  specs?: Record<string, string>;
}

interface TransactionDetailModalProps {
  transaction: DisplayTransaction | null;
  onClose: () => void;
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  transaction,
  onClose,
}) => {
  if (!transaction) return null;

  const isCompleted = transaction.status === 'COMPLETED';
  const isGated = transaction.status === 'STEP_UP_REQUIRED';
  const isBlocked = transaction.status === 'BLOCKED';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in">
      <div className="relative w-full max-w-2xl bg-[#0A0A0A] border border-[#1F1F1F] shadow-[0_24px_64px_rgba(0,0,0,0.9)] p-7 space-y-6 max-h-[90vh] overflow-y-auto rounded-2xl">
        
        {/* Subtle Top Monochrome Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 rounded-t-2xl" />

        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#1F1F1F] pt-1">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono text-[#71717A]">Tx: {transaction.id}</span>
              <span
                className={`text-[9px] font-mono font-bold px-2 py-0.5 border uppercase tracking-widest rounded-md ${
                  isCompleted
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                    : isGated
                    ? 'border-amber-500/30 bg-amber-500/10 text-amber-400'
                    : 'border-rose-500/30 bg-rose-500/10 text-rose-400'
                }`}
              >
                {transaction.status}
              </span>
            </div>
            <h2 className="font-playfair text-xl font-bold text-white mt-1">
              {isCompleted ? 'Why was this payment approved?' : 'Why was this payment gated/blocked?'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-[#71717A] hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Explainability Timeline */}
        <div className="space-y-3">
          <div className="text-[10px] font-sans font-semibold uppercase tracking-[0.2em] text-[#71717A]">
            Verification & Decision Timeline
          </div>

          <div className="space-y-2.5">
            {/* Step 1: User Request */}
            <div className="p-3.5 bg-[#0D0D0D] border border-[#1F1F1F] rounded-xl text-xs">
              <div className="flex justify-between items-center text-[#71717A] mb-1 font-sans">
                <span className="font-semibold text-white">1. User Intent Dispatch</span>
                <span className="text-[10px] font-mono text-[#71717A]">{new Date(transaction.timestamp).toLocaleTimeString()}</span>
              </div>
              <p className="font-playfair italic text-sm text-[#D4D4D8]">"{transaction.userPrompt}"</p>
            </div>

            {/* Step 2: Product Selected */}
            <div className="p-3.5 bg-[#0D0D0D] border border-[#1F1F1F] rounded-xl text-xs">
              <div className="flex justify-between items-center text-[#71717A] mb-1 font-sans">
                <span className="font-semibold text-white">2. Catalog Discovery & Selection</span>
                <span className="text-emerald-400 font-mono text-[10px] font-bold">Stock Confirmed ✓</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-sans font-semibold text-white text-sm">{transaction.productName}</span>
                <span className="font-playfair font-bold text-white text-base">₹{transaction.amount.toLocaleString()}</span>
              </div>
            </div>

            {/* Step 3: Policy Verification */}
            <div className="p-3.5 bg-[#0D0D0D] border border-[#1F1F1F] rounded-xl text-xs space-y-1.5 font-sans">
              <div className="flex justify-between items-center text-[#71717A]">
                <span className="font-semibold text-white">3. Bounded Spending Policy Evaluation</span>
                <span className={`font-mono text-[10px] font-bold ${isBlocked ? 'text-rose-400' : isGated ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {isBlocked ? 'Blocked ✗' : isGated ? 'Step-Up Required ⚠️' : 'Verified ✓'}
                </span>
              </div>
              <p className="text-[#A1A1AA] text-[11px] font-mono leading-relaxed">
                {transaction.policyReason}
              </p>
            </div>

            {/* Step 4: Razorpay Settlement */}
            {isCompleted && (
              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs space-y-1 font-sans">
                <div className="flex justify-between items-center text-emerald-400">
                  <span className="font-bold">4. Razorpay Test Order & Settlement</span>
                  <span className="font-mono text-[10px] font-bold">Captured ✓</span>
                </div>
                <div className="flex justify-between text-emerald-300 font-mono text-[11px]">
                  <span>Order: {transaction.orderId}</span>
                  <span>Payment: {transaction.paymentId || 'pay_test_active'}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Cryptographic Technical Metadata */}
        <div className="p-4 bg-[#0D0D0D] border border-[#1F1F1F] rounded-xl text-xs font-mono space-y-1.5">
          <div className="text-[#71717A] font-sans font-semibold text-[10px] uppercase tracking-[0.18em] mb-1">
            Technical Audit Verification
          </div>
          <div className="flex justify-between text-[#71717A] text-[11px]">
            <span>Order ID:</span>
            <span className="text-white font-semibold">{transaction.orderId}</span>
          </div>
          <div className="flex justify-between text-[#71717A] text-[11px]">
            <span>Payment ID:</span>
            <span className="text-white font-semibold">{transaction.paymentId || '—'}</span>
          </div>
          <div className="flex justify-between text-[#71717A] text-[11px]">
            <span>Merchant ID:</span>
            <span className="text-white font-semibold">{transaction.merchantId}</span>
          </div>
          <div className="flex justify-between text-[#71717A] text-[11px] truncate">
            <span>Enclave HMAC Hash:</span>
            <span className="text-emerald-400 font-semibold truncate max-w-[280px]">{transaction.enclaveHash}</span>
          </div>
        </div>

      </div>
    </div>
  );
};
