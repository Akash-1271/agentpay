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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A1A]/70 backdrop-blur-sm animate-in">
      <div className="relative w-full max-w-2xl bg-[#FFFFFF] border-2 border-[#1A1A1A] shadow-[0_16px_48px_rgba(0,0,0,0.25)] p-7 space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Top Gold Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#D4AF37]" />

        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#1A1A1A]/12 pt-1">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono text-[#6C6863]">Tx: {transaction.id}</span>
              <span
                className={`text-[9px] font-sans font-bold px-2 py-0.5 border uppercase tracking-widest ${
                  isCompleted
                    ? 'border-emerald-600/30 bg-emerald-50 text-emerald-800'
                    : isGated
                    ? 'border-amber-600/30 bg-amber-50 text-amber-800'
                    : 'border-rose-600/30 bg-rose-50 text-rose-800'
                }`}
              >
                {transaction.status}
              </span>
            </div>
            <h2 className="font-serif text-xl font-bold text-[#1A1A1A] mt-1">
              {isCompleted ? 'Why was this payment approved?' : 'Why was this payment gated/blocked?'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-[#6C6863] hover:text-[#1A1A1A]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Explainability Timeline */}
        <div className="space-y-3">
          <div className="text-[10px] font-sans font-semibold uppercase tracking-[0.2em] text-[#6C6863]">
            Verification & Decision Timeline
          </div>

          <div className="space-y-2.5">
            {/* Step 1: User Request */}
            <div className="p-3.5 bg-[#FAF8F5] border border-[#1A1A1A]/10 text-xs">
              <div className="flex justify-between items-center text-[#6C6863] mb-1 font-sans">
                <span className="font-semibold text-[#1A1A1A]">1. User Intent Dispatch</span>
                <span className="text-[10px] font-mono">{new Date(transaction.timestamp).toLocaleTimeString()}</span>
              </div>
              <p className="font-serif italic text-sm text-[#1A1A1A]">"{transaction.userPrompt}"</p>
            </div>

            {/* Step 2: Product Selected */}
            <div className="p-3.5 bg-[#FAF8F5] border border-[#1A1A1A]/10 text-xs">
              <div className="flex justify-between items-center text-[#6C6863] mb-1 font-sans">
                <span className="font-semibold text-[#1A1A1A]">2. Catalog Discovery & Selection</span>
                <span className="text-emerald-800 font-mono text-[10px] font-bold">Stock Confirmed ✓</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-serif font-bold text-[#1A1A1A] text-sm">{transaction.productName}</span>
                <span className="font-serif font-bold text-[#1A1A1A] text-sm">₹{transaction.amount.toLocaleString()}</span>
              </div>
            </div>

            {/* Step 3: Policy Verification */}
            <div className="p-3.5 bg-[#FAF8F5] border border-[#1A1A1A]/10 text-xs space-y-1.5 font-sans">
              <div className="flex justify-between items-center text-[#6C6863]">
                <span className="font-semibold text-[#1A1A1A]">3. Bounded Spending Policy Evaluation</span>
                <span className={`font-mono text-[10px] font-bold ${isBlocked ? 'text-rose-800' : isGated ? 'text-amber-800' : 'text-emerald-800'}`}>
                  {isBlocked ? 'Blocked ✗' : isGated ? 'Step-Up Required ⚠️' : 'Verified ✓'}
                </span>
              </div>
              <p className="text-[#6C6863] text-[11px] font-mono leading-relaxed">
                {transaction.policyReason}
              </p>
            </div>

            {/* Step 4: Razorpay Settlement */}
            {isCompleted && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-600/30 text-xs space-y-1 font-sans">
                <div className="flex justify-between items-center text-emerald-900">
                  <span className="font-bold">4. Razorpay Test Order & Settlement</span>
                  <span className="font-mono text-[10px] font-bold text-emerald-800">Captured ✓</span>
                </div>
                <div className="flex justify-between text-emerald-950 font-mono text-[11px]">
                  <span>Order: {transaction.orderId}</span>
                  <span>Payment: {transaction.paymentId || 'pay_test_active'}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Cryptographic Technical Metadata */}
        <div className="p-4 bg-[#FAF8F5] border border-[#1A1A1A]/10 text-xs font-mono space-y-1.5">
          <div className="text-[#6C6863] font-sans font-semibold text-[10px] uppercase tracking-[0.18em] mb-1">
            Technical Audit Verification
          </div>
          <div className="flex justify-between text-[#6C6863] text-[11px]">
            <span>Order ID:</span>
            <span className="text-[#1A1A1A] font-semibold">{transaction.orderId}</span>
          </div>
          <div className="flex justify-between text-[#6C6863] text-[11px]">
            <span>Payment ID:</span>
            <span className="text-[#1A1A1A] font-semibold">{transaction.paymentId || '—'}</span>
          </div>
          <div className="flex justify-between text-[#6C6863] text-[11px]">
            <span>Merchant ID:</span>
            <span className="text-[#1A1A1A] font-semibold">{transaction.merchantId}</span>
          </div>
          <div className="flex justify-between text-[#6C6863] text-[11px] truncate">
            <span>Enclave HMAC Hash:</span>
            <span className="text-emerald-800 font-semibold truncate max-w-[280px]">{transaction.enclaveHash}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

