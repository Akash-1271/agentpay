import React, { useState } from 'react';
import { X, QrCode, ShieldCheck, CheckCircle2, ArrowRight, Smartphone, RefreshCw, Check } from 'lucide-react';
import { RazorpayLogo } from './RazorpayLogo';
import { playPaymentSuccessChime } from '../utils/soundEffects';

interface RazorpayUpiQrModalProps {
  amount: number;
  orderId: string;
  productName: string;
  onSuccess: (paymentId: string) => void;
  onClose: () => void;
}

export const RazorpayUpiQrModal: React.FC<RazorpayUpiQrModalProps> = ({
  amount,
  orderId,
  productName,
  onSuccess,
  onClose,
}) => {
  const [simulating, setSimulating] = useState(false);
  const [paid, setPaid] = useState(false);

  const handleSimulatePayment = () => {
    setSimulating(true);
    setTimeout(() => {
      setSimulating(false);
      setPaid(true);
      playPaymentSuccessChime();
      setTimeout(() => {
        onSuccess(`pay_upi_${Math.random().toString(36).substring(2, 10)}`);
      }, 1200);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-[#0a0f1d] border border-white/[0.12] rounded-2xl shadow-2xl overflow-hidden p-6 space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center space-x-2.5">
            <RazorpayLogo variant="icon" height={22} />
            <div>
              <div className="text-sm font-bold text-white">Razorpay Dynamic UPI QR</div>
              <div className="text-[10px] font-mono text-slate-400">Order {orderId}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product & Price */}
        <div className="p-3.5 rounded-xl bg-[#090d16] border border-white/[0.05] flex items-center justify-between text-xs">
          <div className="truncate max-w-[200px]">
            <div className="text-slate-400 text-[11px]">Payable to AgentPay</div>
            <div className="font-bold text-white truncate">{productName}</div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-white font-mono">₹{amount.toLocaleString()}</div>
            <div className="text-[10px] text-emerald-400 font-mono">Zero Fee Test Mode</div>
          </div>
        </div>

        {/* QR Code Card */}
        <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white text-slate-900 space-y-3 shadow-inner">
          {paid ? (
            <div className="py-10 text-center space-y-2 animate-in zoom-in-95">
              <div className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <div className="font-bold text-base text-slate-900">Payment Captured!</div>
              <div className="text-xs text-slate-600 font-mono">Webhook Verified · HMAC-SHA256</div>
            </div>
          ) : (
            <>
              <div className="relative p-2 rounded-xl bg-white border-2 border-slate-200 shadow-sm">
                <svg
                  className="w-44 h-44"
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Outer corner finder markers */}
                  <rect x="5" y="5" width="25" height="25" rx="3" fill="#0C2340" />
                  <rect x="8" y="8" width="19" height="19" rx="2" fill="white" />
                  <rect x="12" y="12" width="11" height="11" fill="#0C83FF" />

                  <rect x="70" y="5" width="25" height="25" rx="3" fill="#0C2340" />
                  <rect x="73" y="8" width="19" height="19" rx="2" fill="white" />
                  <rect x="77" y="12" width="11" height="11" fill="#0C83FF" />

                  <rect x="5" y="70" width="25" height="25" rx="3" fill="#0C2340" />
                  <rect x="8" y="73" width="19" height="19" rx="2" fill="white" />
                  <rect x="12" y="77" width="11" height="11" fill="#0C83FF" />

                  {/* Synthetic QR Code data modules */}
                  <rect x="36" y="10" width="6" height="6" fill="#0C2340" />
                  <rect x="46" y="10" width="6" height="6" fill="#0C2340" />
                  <rect x="56" y="10" width="6" height="6" fill="#0C2340" />
                  <rect x="36" y="22" width="6" height="6" fill="#0C2340" />
                  <rect x="50" y="22" width="6" height="6" fill="#0C83FF" />
                  <rect x="10" y="38" width="6" height="6" fill="#0C2340" />
                  <rect x="22" y="38" width="6" height="6" fill="#0C83FF" />
                  <rect x="34" y="38" width="6" height="6" fill="#0C2340" />
                  <rect x="46" y="38" width="8" height="8" fill="#0C2340" />
                  <rect x="62" y="38" width="6" height="6" fill="#0C83FF" />
                  <rect x="76" y="38" width="6" height="6" fill="#0C2340" />
                  <rect x="86" y="38" width="6" height="6" fill="#0C2340" />

                  <rect x="10" y="52" width="6" height="6" fill="#0C83FF" />
                  <rect x="24" y="52" width="6" height="6" fill="#0C2340" />
                  <rect x="38" y="52" width="6" height="6" fill="#0C83FF" />
                  <rect x="52" y="52" width="6" height="6" fill="#0C2340" />
                  <rect x="66" y="52" width="6" height="6" fill="#0C2340" />
                  <rect x="80" y="52" width="8" height="8" fill="#0C83FF" />

                  <rect x="38" y="66" width="6" height="6" fill="#0C2340" />
                  <rect x="52" y="66" width="6" height="6" fill="#0C83FF" />
                  <rect x="66" y="66" width="6" height="6" fill="#0C2340" />
                  <rect x="78" y="66" width="6" height="6" fill="#0C2340" />

                  <rect x="38" y="78" width="6" height="6" fill="#0C83FF" />
                  <rect x="50" y="78" width="6" height="6" fill="#0C2340" />
                  <rect x="62" y="78" width="6" height="6" fill="#0C2340" />
                  <rect x="74" y="78" width="6" height="6" fill="#0C83FF" />
                  <rect x="86" y="78" width="6" height="6" fill="#0C2340" />

                  {/* Center Razorpay Logo Badge */}
                  <rect x="42" y="42" width="16" height="16" rx="4" fill="white" stroke="#0C83FF" strokeWidth="1.5" />
                  <path d="M48 45L45 55H48L50 49L52 55H55L51 45H48Z" fill="#0C83FF" />
                </svg>
              </div>

              <div className="text-[11px] font-mono font-bold text-slate-600 flex items-center space-x-1">
                <span>Scan with any UPI app</span>
                <span>(GPay · PhonePe · Paytm · CRED)</span>
              </div>
            </>
          )}
        </div>

        {/* 1-Click Simulation Button */}
        {!paid && (
          <button
            onClick={handleSimulatePayment}
            disabled={simulating}
            className="w-full py-3 bg-[#0c83ff] hover:bg-[#0270e0] text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
          >
            <Smartphone className={`w-4 h-4 ${simulating ? 'animate-bounce' : ''}`} />
            <span>{simulating ? 'Simulating UPI Payment Capture...' : 'Simulate 1-Click UPI Payment'}</span>
          </button>
        )}

      </div>
    </div>
  );
};
