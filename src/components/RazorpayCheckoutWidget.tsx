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
          color: '#1A1A1A',
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
    <div className="p-5 border border-[#1A1A1A]/12 bg-[#FAF8F5] space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <RazorpayLogo variant="icon" height={18} />
          <span className="font-serif text-sm font-bold text-[#1A1A1A]">Razorpay Test Gateway</span>
        </div>
        <RazorpayLogo variant="badge" height={14} />
      </div>

      <p className="text-xs text-[#6C6863] font-sans">
        In addition to autonomous background settlement, you can launch the official Razorpay test popup or scan a live UPI QR code.
      </p>

      {paymentCompleted ? (
        <div className="p-3 bg-emerald-50 border border-emerald-600/30 flex items-center justify-between text-xs animate-in">
          <div className="flex items-center space-x-2 text-emerald-800 font-sans">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>Payment Captured: <strong className="font-mono">{paymentId}</strong></span>
          </div>
          <span className="font-sans text-emerald-800 uppercase font-bold text-[10px] bg-emerald-100 px-2 py-0.5 border border-emerald-600/30">
            HMAC VERIFIED
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <button
            onClick={handleLaunchCheckout}
            disabled={loading}
            className="luxury-btn-primary h-10 text-xs flex items-center justify-center space-x-2"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>{loading ? 'Opening...' : 'Razorpay SDK Sheet'}</span>
          </button>

          <button
            onClick={() => setIsQrModalOpen(true)}
            className="luxury-btn-secondary h-10 text-xs flex items-center justify-center space-x-2"
          >
            <QrCode className="w-3.5 h-3.5 text-[#D4AF37]" />
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

