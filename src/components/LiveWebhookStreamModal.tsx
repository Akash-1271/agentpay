import React, { useState } from 'react';
import {
  Zap,
  X,
  CheckCircle2,
  RefreshCw,
  Copy,
  Check,
  Radio,
} from 'lucide-react';
import { RazorpayLogo } from './RazorpayLogo';

interface WebhookEvent {
  id: string;
  event: string;
  entity: string;
  amount: number;
  timestamp: string;
  status: 'captured' | 'authorized' | 'attested' | 'recovered';
  payload: any;
}

interface LiveWebhookStreamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const INITIAL_EVENTS: WebhookEvent[] = [
  {
    id: 'evt_rzp_9941a8',
    event: 'payment.captured',
    entity: 'payment',
    amount: 1709,
    timestamp: 'Just now',
    status: 'captured',
    payload: {
      entity: 'event',
      account_id: 'acc_agentpay_live',
      event: 'payment.captured',
      contains: ['payment'],
      payload: {
        payment: {
          entity: {
            id: 'pay_97bd9c9c40fd72',
            amount: 170900,
            currency: 'INR',
            status: 'captured',
            order_id: 'order_bcbf54c1cef2cc',
            method: 'agent_ap2_mandate',
            captured: true,
            description: 'Nike Air Zoom Pegasus 40 - AgentPay Auto-Checkout',
            email: 'buyer@agentpay.internal',
            contact: '+919876543210',
            fee: 3418,
            tax: 615,
            notes: {
              enclave_hash: 'a92e81b8b81c364a6977a8090ae81ca13bd337e0b97c4960c479082bb187b802',
              protocol: 'AP2_BOUNDED_ENCLAVE_V1',
            },
          },
        },
      },
      created_at: Math.floor(Date.now() / 1000),
    },
  },
  {
    id: 'evt_rzp_8812c4',
    event: 'order.paid',
    entity: 'order',
    amount: 1709,
    timestamp: '1 min ago',
    status: 'captured',
    payload: {
      event: 'order.paid',
      payload: {
        order: {
          entity: {
            id: 'order_bcbf54c1cef2cc',
            amount: 170900,
            amount_paid: 170900,
            amount_due: 0,
            currency: 'INR',
            receipt: 'rcpt_tx_01',
            status: 'paid',
            attempts: 1,
          },
        },
      },
    },
  },
  {
    id: 'evt_enclave_7731d2',
    event: 'enclave.policy.attested',
    entity: 'mandate',
    amount: 1709,
    timestamp: '2 mins ago',
    status: 'attested',
    payload: {
      event: 'enclave.policy.attested',
      mandateId: 'mandate_user_main_001',
      dailySpentAfter: 1250 + 1709,
      dailyCeiling: 25000,
      ruleEvaluated: 'SINGLE_PURCHASE_CEILING_PASS',
      signature: 'SIG_ED25519_HARDWARE_ATTESTED_0x4f128a',
    },
  },
  {
    id: 'evt_cart_6641b9',
    event: 'cart.abandoned.recovered',
    entity: 'yield_engine',
    amount: 1499,
    timestamp: '5 mins ago',
    status: 'recovered',
    payload: {
      event: 'cart.abandoned.recovered',
      merchantId: 'merch_anker',
      originalAmount: 1999,
      discountedAmount: 1499,
      channel: 'WHATSAPP_SMART_PAYMENT_LINK',
      razorpayPaymentLinkId: 'plink_998124_anker',
      conversionLiftPct: 38.2,
    },
  },
];

export const LiveWebhookStreamModal: React.FC<LiveWebhookStreamModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [events, setEvents] = useState<WebhookEvent[]>(INITIAL_EVENTS);
  const [selectedEvent, setSelectedEvent] = useState<WebhookEvent>(INITIAL_EVENTS[0]);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(selectedEvent.payload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateWebhook = () => {
    const newEvent: WebhookEvent = {
      id: `evt_rzp_${Math.random().toString(36).substring(2, 8)}`,
      event: 'payment.captured',
      entity: 'payment',
      amount: Math.floor(Math.random() * 1500) + 500,
      timestamp: 'Just now',
      status: 'captured',
      payload: {
        event: 'payment.captured',
        id: `pay_${Math.random().toString(36).substring(2, 10)}`,
        amount: 189900,
        currency: 'INR',
        status: 'captured',
        method: 'agent_ap2_mandate',
        created_at: Math.floor(Date.now() / 1000),
      },
    };
    setEvents([newEvent, ...events]);
    setSelectedEvent(newEvent);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in">
      <div className="relative w-full max-w-4xl max-h-[85vh] bg-[#0A0A0A] border border-[#1F1F1F] shadow-[0_24px_64px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden rounded-2xl">
        
        {/* Top Monochrome Accent Bar */}
        <div className="h-1 bg-white/20 w-full" />

        {/* Header */}
        <div className="p-5 border-b border-[#1F1F1F] bg-[#0D0D0D] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 border border-[#1F1F1F] bg-[#141414] flex items-center justify-center shrink-0 rounded-xl">
              <Radio className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-playfair text-lg font-bold text-white">
                  Live Razorpay Webhook & Event Telemetry
                </h3>
                <span className="px-2 py-0.5 text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold rounded-md">
                  LIVE STREAM ACTIVE
                </span>
              </div>
              <p className="text-xs text-[#A1A1AA] mt-0.5 font-sans">
                Real-time cryptographic webhooks dispatched by Razorpay and Bounded Spending Enclaves.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleSimulateWebhook}
              className="btn-secondary text-xs h-9 px-3 flex items-center space-x-1.5 rounded-xl"
            >
              <RefreshCw className="w-3.5 h-3.5 text-white" />
              <span>Simulate Webhook</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-[#71717A] hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2-Column Inspector */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          
          {/* Left Column: Event Feed */}
          <div className="md:col-span-5 border-r border-[#1F1F1F] overflow-y-auto p-3 space-y-2 bg-[#0A0A0A]">
            <div className="text-[10px] font-sans font-semibold uppercase tracking-[0.18em] text-[#71717A] px-2 py-1">
              Event Stream ({events.length})
            </div>
            {events.map((evt) => (
              <button
                key={evt.id}
                onClick={() => setSelectedEvent(evt)}
                className={`w-full text-left p-3 border rounded-xl transition-all ${
                  selectedEvent.id === evt.id
                    ? 'border-white/20 bg-[#141414] shadow-sm'
                    : 'border-[#1F1F1F] hover:border-[#333333] bg-[#0D0D0D]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-white">
                    {evt.event}
                  </span>
                  <span className="text-[10px] text-[#71717A] font-mono">{evt.timestamp}</span>
                </div>
                <div className="flex items-center justify-between text-xs mt-1.5">
                  <span className="text-[#A1A1AA] font-mono text-[11px]">{evt.id}</span>
                  <span className="font-playfair font-bold text-white">
                    ₹{evt.amount.toLocaleString()}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Right Column: JSON Payload Viewer */}
          <div className="md:col-span-7 flex flex-col overflow-hidden bg-[#0A0A0A]">
            <div className="p-3 border-b border-[#1F1F1F] bg-[#0D0D0D] flex items-center justify-between">
              <span className="font-mono text-xs text-white font-bold">
                Payload: {selectedEvent.id}
              </span>
              <button
                onClick={handleCopy}
                className="btn-secondary text-[11px] py-1 px-2.5 h-7 flex items-center space-x-1 rounded-lg"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-white" />}
                <span>{copied ? 'Copied' : 'Copy JSON'}</span>
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto font-mono text-xs bg-[#080808]">
              <pre className="text-[11px] leading-relaxed text-[#D4D4D8]">
                {JSON.stringify(selectedEvent.payload, null, 2)}
              </pre>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
