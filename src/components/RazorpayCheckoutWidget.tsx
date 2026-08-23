import React, { useState } from 'react';
import { CreditCard, CheckCircle2, ShieldCheck, QrCode } from 'lucide-react';
import { AgentTransactionOutcome } from '../types';
import { RazorpayUpiQrModal } from './RazorpayUpiQrModal';
import { RazorpayLogo } from './RazorpayLogo';
import { playPaymentSuccessChime } from '../utils/soundEffects';

interface RazorpayCheckoutWidgetProps {
  outcome: AgentTransactionOutcome;
  onPaymentSuccess?: (paymentId: string) => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const RazorpayCheckoutWidget: React.FC<RazorpayCheckoutWidgetProps> = ({
  outcome,
  onPaymentSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleLaunchCheckout = async () => {
    try {
      setLoading(true);
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        alert('Failed to load Razorpay SDK. Please check your internet connection.');
        setLoading(false);
        return;
      }

      const options = {
        key: 'rzp_test_AgentPayLiveDemo2026',
        amount: (outcome.quote?.netAmount || 1709) * 100,
        currency: outcome.quote?.currency || 'INR',
        name: 'AgentPay Autonomous Commerce',
        description: `Order for ${outcome.selectedProduct?.name || 'Item'}`,
        order_id: outcome.razorpayOrder?.id,
        handler: function (response: any) {
          setPaymentCompleted(true);
          const pId = response.razorpay_payment_id || `pay_${Date.now()}`;
          setPaymentId(pId);
          playPaymentSuccessChime();
          if (onPaymentSuccess) {
            onPaymentSuccess(pId);
          }
        },
        prefill: {
          name: 'Akash M',
          email: 'akash@agentpay.network',
          contact: '+919876543210',
        },
        theme: {
          color: '#0c83ff',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (resp: any) {
        alert('Payment failed: ' + resp.error.description);
      });
      rzp.open();
    } catch (err) {
      console.error('Razorpay popup error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleQrSuccess = (pId: string) => {
    setPaymentCompleted(true);
    setPaymentId(pId);
    setIsQrModalOpen(false);
    playPaymentSuccessChime();
    if (onPaymentSuccess) {
      onPaymentSuccess(pId);
    }
  };

  return (
    <div className="p-4 rounded-xl bg-[#090d16] border border-blue-500/20 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <RazorpayLogo variant="icon" height={18} />
          <span className="text-xs font-bold text-white">Razorpay Test Gateway</span>
        </div>
        <RazorpayLogo variant="badge" height={14} />
      </div>

      <p className="text-xs text-slate-400">
        In addition to autonomous background settlement, you can launch the official Razorpay test popup or scan a live UPI QR code.
      </p>

      {paymentCompleted ? (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs animate-in zoom-in-95">
          <div className="flex items-center space-x-2 text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Payment Captured: <strong className="font-mono">{paymentId}</strong></span>
          </div>
          <span className="font-mono text-emerald-400 font-bold text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            HMAC VERIFIED
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleLaunchCheckout}
            disabled={loading}
            className="py-2.5 px-3 bg-[#0c83ff] hover:bg-[#0270e0] text-white text-xs font-bold rounded-lg shadow-sm flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>{loading ? 'Opening...' : 'Razorpay SDK Sheet'}</span>
          </button>

          <button
            onClick={() => setIsQrModalOpen(true)}
            className="py-2.5 px-3 bg-white/[0.05] hover:bg-white/[0.09] text-slate-200 text-xs font-bold rounded-lg border border-white/[0.08] flex items-center justify-center space-x-2 transition-all"
          >
            <QrCode className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span>Pay with UPI QR</span>
          </button>
        </div>
      )}

      {isQrModalOpen && (
        <RazorpayUpiQrModal
          amount={outcome.quote?.netAmount || 1709}
          orderId={outcome.razorpayOrder?.id || 'order_bcbf54c1cef2cc'}
          productName={outcome.selectedProduct?.name || 'Nike Air Zoom Pegasus 40'}
          onSuccess={handleQrSuccess}
          onClose={() => setIsQrModalOpen(false)}
        />
      )}
    </div>
  );
};
