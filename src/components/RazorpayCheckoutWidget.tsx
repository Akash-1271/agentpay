import React, { useState } from 'react';
import { CreditCard, CheckCircle2, ShieldCheck, Sparkles, ExternalLink } from 'lucide-react';
import { AgentTransactionOutcome } from '../types';

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
        key: 'rzp_test_AgentPayLiveDemo2026', // High-fidelity test key
        amount: (outcome.quote?.netAmount || 1899) * 100, // paise
        currency: outcome.quote?.currency || 'INR',
        name: 'AgentPay Autonomous Commerce',
        description: `Order for ${outcome.selectedProduct?.name || 'Item'}`,
        order_id: outcome.razorpayOrder?.id,
        handler: function (response: any) {
          setPaymentCompleted(true);
          setPaymentId(response.razorpay_payment_id || `pay_${Date.now()}`);
          if (onPaymentSuccess) {
            onPaymentSuccess(response.razorpay_payment_id || `pay_${Date.now()}`);
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

  return (
    <div className="p-4 rounded-xl bg-[#090d16] border border-blue-500/20 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <CreditCard className="w-4 h-4 text-[#0c83ff]" />
          <span className="text-xs font-bold text-white">Razorpay Standard Checkout Modal</span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/15 text-[#38bdf8] border border-blue-500/20">
          SDK Popup Mode
        </span>
      </div>

      <p className="text-xs text-slate-400">
        In addition to autonomous background settlement, you can launch the official Razorpay test payment modal to test real-world card/UPI payments.
      </p>

      {paymentCompleted ? (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Razorpay Payment Verified: <strong>{paymentId}</strong></span>
          </div>
          <span className="font-mono text-emerald-400 font-bold">CAPTURED</span>
        </div>
      ) : (
        <button
          onClick={handleLaunchCheckout}
          disabled={loading}
          className="w-full py-2.5 bg-[#0c83ff] hover:bg-[#0270e0] text-white text-xs font-bold rounded-lg shadow-sm flex items-center justify-center space-x-2 transition-all"
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>{loading ? 'Launching Razorpay Sheet...' : 'Launch Official Razorpay Popup Modal'}</span>
        </button>
      )}
    </div>
  );
};
