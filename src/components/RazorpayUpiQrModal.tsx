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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in">
      <div className="relative w-full max-w-md bg-[#0A0A0A] border border-[#1F1F1F] shadow-[0_24px_64px_rgba(0,0,0,0.9)] overflow-hidden p-6 space-y-5 rounded-2xl">
        
        {/* Top Monochrome Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/20" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1F1F1F] pb-4 pt-1">
          <div className="flex items-center space-x-2.5">
            <RazorpayLogo variant="icon" height={22} />
            <div>
              <div className="font-playfair text-sm font-bold text-white">Razorpay Dynamic UPI QR</div>
              <div className="text-[10px] font-mono text-[#71717A]">Order {orderId}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#71717A] hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product & Price */}
        <div className="p-3.5 bg-[#0D0D0D] border border-[#1F1F1F] rounded-xl flex items-center justify-between text-xs font-sans">
          <div className="truncate max-w-[200px]">
            <div className="text-[#71717A] text-[10px] uppercase tracking-wider font-semibold">Payable to AgentPay</div>
            <div className="font-sans font-semibold text-white truncate">{productName}</div>
          </div>
          <div className="text-right">
            <div className="text-lg font-playfair font-bold text-white">₹{amount.toLocaleString()}</div>
            <div className="text-[10px] text-emerald-400 font-mono font-semibold">Zero Fee Test Mode</div>
          </div>
        </div>

        {/* QR Code Card */}
        <div className="flex flex-col items-center justify-center p-6 bg-[#0D0D0D] border border-[#1F1F1F] rounded-xl text-white space-y-3">
          {paid ? (
            <div className="py-10 text-center space-y-2 animate-in">
              <div className="w-14 h-14 bg-emerald-500 text-black flex items-center justify-center mx-auto rounded-full shadow-md">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <div className="font-playfair font-bold text-base text-white">Payment Captured!</div>
              <div className="text-xs text-[#A1A1AA] font-mono">Webhook Verified · HMAC-SHA256</div>
            </div>
          ) : (
            <>
              <div className="relative p-3 bg-white rounded-xl shadow-md">
                <svg
                  className="w-44 h-44"
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Outer corner finder markers */}
                  <rect x="5" y="5" width="25" height="25" fill="#000000" />
                  <rect x="8" y="8" width="19" height="19" fill="white" />
                  <rect x="12" y="12" width="11" height="11" fill="#000000" />

                  <rect x="70" y="5" width="25" height="25" fill="#000000" />
                  <rect x="73" y="8" width="19" height="19" fill="white" />
                  <rect x="77" y="12" width="11" height="11" fill="#000000" />

                  <rect x="5" y="70" width="25" height="25" fill="#000000" />
                  <rect x="8" y="73" width="19" height="19" fill="white" />
                  <rect x="12" y="77" width="11" height="11" fill="#000000" />

                  {/* Synthetic QR Code data modules */}
                  <rect x="36" y="10" width="6" height="6" fill="#000000" />
                  <rect x="46" y="10" width="6" height="6" fill="#000000" />
                  <rect x="56" y="10" width="6" height="6" fill="#000000" />
                  <rect x="36" y="22" width="6" height="6" fill="#000000" />
                  <rect x="50" y="22" width="6" height="6" fill="#000000" />
                  <rect x="10" y="38" width="6" height="6" fill="#000000" />
                  <rect x="22" y="38" width="6" height="6" fill="#000000" />
                  <rect x="34" y="38" width="6" height="6" fill="#000000" />
                  <rect x="46" y="38" width="8" height="8" fill="#000000" />
                  <rect x="62" y="38" width="6" height="6" fill="#000000" />
                  <rect x="76" y="38" width="6" height="6" fill="#000000" />
                  <rect x="86" y="38" width="6" height="6" fill="#000000" />

                  <rect x="10" y="52" width="6" height="6" fill="#000000" />
                  <rect x="24" y="52" width="6" height="6" fill="#000000" />
                  <rect x="38" y="52" width="6" height="6" fill="#000000" />
                  <rect x="52" y="52" width="6" height="6" fill="#000000" />
                  <rect x="66" y="52" width="6" height="6" fill="#000000" />
                  <rect x="80" y="52" width="8" height="8" fill="#000000" />

                  <rect x="38" y="66" width="6" height="6" fill="#000000" />
                  <rect x="52" y="66" width="6" height="6" fill="#000000" />
                  <rect x="66" y="66" width="6" height="6" fill="#000000" />
                  <rect x="78" y="66" width="6" height="6" fill="#000000" />

                  <rect x="38" y="78" width="6" height="6" fill="#000000" />
                  <rect x="50" y="78" width="6" height="6" fill="#000000" />
                  <rect x="62" y="78" width="6" height="6" fill="#000000" />
                  <rect x="74" y="78" width="6" height="6" fill="#000000" />
                  <rect x="86" y="78" width="6" height="6" fill="#000000" />

                  {/* Center Razorpay Logo Badge */}
                  <rect x="42" y="42" width="16" height="16" fill="white" stroke="#000000" strokeWidth="1.5" />
                  <path d="M48 45L45 55H48L50 49L52 55H55L51 45H48Z" fill="#000000" />
                </svg>
              </div>

              <div className="text-[10px] font-sans font-semibold uppercase tracking-wider text-[#71717A] flex items-center space-x-1">
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
            className="btn-primary w-full h-11 text-xs flex items-center justify-center space-x-2 rounded-xl"
          >
            <Smartphone className={`w-4 h-4 ${simulating ? 'animate-bounce' : ''}`} />
            <span>{simulating ? 'Simulating UPI Payment Capture...' : 'Simulate 1-Click UPI Payment'}</span>
          </button>
        )}

      </div>
    </div>
  );
};
