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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-[#0d121f] border border-white/[0.1] rounded-xl shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/[0.07]">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono text-slate-400">Tx: {transaction.id}</span>
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                  isCompleted
                    ? 'bg-emerald-500/15 text-emerald-400'
                    : isGated
                    ? 'bg-amber-500/15 text-amber-400'
                    : 'bg-rose-500/15 text-rose-400'
                }`}
              >
                {transaction.status}
              </span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">
              {isCompleted ? 'Why was this payment allowed?' : 'Why was this payment gated/blocked?'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Explainability Timeline */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Verification & Decision Timeline
          </div>

          <div className="space-y-2.5">
            {/* Step 1: User Request */}
            <div className="p-3 rounded-lg bg-[#090d16] border border-white/[0.04] text-xs">
              <div className="flex justify-between items-center text-slate-400 mb-1">
                <span className="font-semibold text-slate-300">1. User Request</span>
                <span className="text-[10px] font-mono">{new Date(transaction.timestamp).toLocaleTimeString()}</span>
              </div>
              <p className="font-mono text-slate-300">"{transaction.userPrompt}"</p>
            </div>

            {/* Step 2: Product Selected */}
            <div className="p-3 rounded-lg bg-[#090d16] border border-white/[0.04] text-xs">
              <div className="flex justify-between items-center text-slate-400 mb-1">
                <span className="font-semibold text-slate-300">2. Catalog Discovery & Selection</span>
                <span className="text-emerald-400 font-mono">Stock Confirmed ✓</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white font-medium">{transaction.productName}</span>
                <span className="font-mono font-bold text-white">₹{transaction.amount.toLocaleString()}</span>
              </div>
            </div>

            {/* Step 3: Policy Verification */}
            <div className="p-3 rounded-lg bg-[#090d16] border border-white/[0.04] text-xs space-y-1.5">
              <div className="flex justify-between items-center text-slate-400">
                <span className="font-semibold text-slate-300">3. Bounded Spending Policy</span>
                <span className={`font-mono ${isBlocked ? 'text-rose-400' : isGated ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {isBlocked ? 'Blocked ✗' : isGated ? 'Step-Up Required ⚠️' : 'Verified ✓'}
                </span>
              </div>
              <p className="text-slate-300 text-[11px] font-mono leading-relaxed">
                {transaction.policyReason}
              </p>
            </div>

            {/* Step 4: Razorpay Settlement */}
            {isCompleted && (
              <div className="p-3 rounded-lg bg-[#090d16] border border-emerald-500/20 text-xs space-y-1">
                <div className="flex justify-between items-center text-emerald-400">
                  <span className="font-semibold">4. Razorpay Test Order & Settlement</span>
                  <span className="font-mono">Captured ✓</span>
                </div>
                <div className="flex justify-between text-slate-300 font-mono text-[11px]">
                  <span>Order: {transaction.orderId}</span>
                  <span>Payment: {transaction.paymentId || 'pay_test_active'}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Cryptographic Technical Metadata */}
        <div className="p-3.5 rounded-lg bg-[#090d16] border border-white/[0.04] text-xs font-mono space-y-1.5">
          <div className="text-slate-500 font-bold text-[10px] uppercase mb-1">
            Technical Audit Verification
          </div>
          <div className="flex justify-between text-slate-400 text-[11px]">
            <span>Order ID:</span>
            <span className="text-slate-200">{transaction.orderId}</span>
          </div>
          <div className="flex justify-between text-slate-400 text-[11px]">
            <span>Payment ID:</span>
            <span className="text-slate-200">{transaction.paymentId || '—'}</span>
          </div>
          <div className="flex justify-between text-slate-400 text-[11px]">
            <span>Merchant ID:</span>
            <span className="text-slate-200">{transaction.merchantId}</span>
          </div>
          <div className="flex justify-between text-slate-400 text-[11px] truncate">
            <span>Enclave HMAC Hash:</span>
            <span className="text-emerald-400 truncate max-w-[280px]">{transaction.enclaveHash}</span>
          </div>
        </div>

      </div>
    </div>
  );
};
