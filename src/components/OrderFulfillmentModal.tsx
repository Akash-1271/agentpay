import React, { useState } from 'react';
import {
  X,
  Truck,
  CheckCircle2,
  Download,
  Package,
  MapPin,
  Calendar,
  FileText,
  ShieldCheck,
  Clock,
  ChevronRight,
  Phone,
  Key,
  Copy,
  Check,
  ArrowRight,
  Play,
  RotateCcw,
} from 'lucide-react';
import { AgentTransactionOutcome } from '../types';
import { RazorpayLogo } from './RazorpayLogo';

interface OrderFulfillmentModalProps {
  outcome: AgentTransactionOutcome;
  onClose: () => void;
}

interface DeliveryCheckpoint {
  stage: string;
  status: 'COMPLETED' | 'ACTIVE' | 'PENDING';
  location: string;
  time: string;
  description: string;
  detailPayload?: Record<string, any>;
}

export const OrderFulfillmentModal: React.FC<OrderFulfillmentModalProps> = ({ outcome, onClose }) => {
  const [currentStep, setCurrentStep] = useState(2); // In Transit by default
  const [copiedAWB, setCopiedAWB] = useState(false);

  const fulfillment = outcome.fulfillment || {
    orderId: 'AMZ-IN-882910',
    razorpayOrderId: outcome.razorpayOrder?.id || 'order_bcbf54c1cef2cc',
    razorpayPaymentId: outcome.receipt?.paymentId || 'pay_97bd9c9c40fd72',
    merchantName: outcome.selectedProduct?.merchantName || 'Amazon India (Cloudtail Logistics)',
    customerName: 'Akash M (Verified Buyer)',
    deliveryAddress: 'Flat 402, Prestige Tech Park, Outer Ring Road, Bangalore 560103',
    courierPartner: 'Amazon Logistics Express',
    trackingNumber: 'AWB-8F92A1-IN',
    estimatedDelivery: 'Tomorrow by 2:00 PM (Guaranteed)',
    items: [
      {
        name: outcome.selectedProduct?.name || 'Nike Air Zoom Pegasus 40 Running Shoes',
        quantity: 1,
        price: outcome.quote?.netAmount || 1709,
        asinOrSku: outcome.selectedProduct?.id || 'B0C7Q4W9X2',
      },
    ],
    totalAmount: outcome.quote?.netAmount || 1709,
    taxInvoiceId: 'INV-2026-98124',
  };

  const deliveryTimeline: DeliveryCheckpoint[] = [
    {
      stage: 'Order Placed & Paid',
      status: currentStep >= 0 ? 'COMPLETED' : 'PENDING',
      location: 'Razorpay Payment Gateway',
      time: 'Today, 05:14 PM',
      description: `Payment of ₹${fulfillment.totalAmount.toLocaleString()} verified and captured via Razorpay Test Mode.`,
      detailPayload: {
        paymentId: fulfillment.razorpayPaymentId,
        orderId: fulfillment.razorpayOrderId,
        method: 'UPI / NetBanking (Test)',
        signature: 'HMAC-SHA256 Verified',
      },
    },
    {
      stage: 'Packed at Merchant Hub',
      status: currentStep > 1 ? 'COMPLETED' : currentStep === 1 ? 'ACTIVE' : 'PENDING',
      location: 'Amazon Fulfillment Center (BLR-04), Hoskote',
      time: 'Today, 05:30 PM',
      description: 'Item inspected, barcoded, and sealed into tamper-evident package.',
      detailPayload: {
        weight: '0.85 kg',
        dimensions: '32 x 20 x 12 cm',
        boxId: 'AMZ-BOX-9912',
      },
    },
    {
      stage: 'In Transit — Express Linehaul',
      status: currentStep > 2 ? 'COMPLETED' : currentStep === 2 ? 'ACTIVE' : 'PENDING',
      location: 'Amazon Sort Facility, Outer Ring Road Hub',
      time: 'Today, 06:45 PM',
      description: `Package dispatched via ${fulfillment.courierPartner} under tracking ${fulfillment.trackingNumber}.`,
      detailPayload: {
        courier: fulfillment.courierPartner,
        awb: fulfillment.trackingNumber,
        linehaulVehicle: 'KA-01-MJ-8821',
      },
    },
    {
      stage: 'Out for Delivery',
      status: currentStep > 3 ? 'COMPLETED' : currentStep === 3 ? 'ACTIVE' : 'PENDING',
      location: 'Bangalore East Hub (Marathahalli)',
      time: 'Tomorrow, 08:30 AM (Scheduled)',
      description: 'Assigned to delivery associate Ramesh Kumar. OTP required at doorstep.',
      detailPayload: {
        driver: 'Ramesh Kumar',
        phone: '+91 98450 12345',
        deliveryPin: '4829',
      },
    },
    {
      stage: 'Delivered & Signed',
      status: currentStep === 4 ? 'COMPLETED' : 'PENDING',
      location: 'Prestige Tech Park, Bangalore',
      time: 'Tomorrow, 01:15 PM (Estimated)',
      description: 'Contactless delivery confirmed with digital proof of delivery.',
      detailPayload: {
        recipient: fulfillment.customerName,
        signatureProof: 'DIGITAL_POD_VERIFIED',
      },
    },
  ];

  const handleCopyAWB = () => {
    navigator.clipboard.writeText(fulfillment.trackingNumber);
    setCopiedAWB(true);
    setTimeout(() => setCopiedAWB(false), 2000);
  };

  const handleDownloadInvoice = () => {
    const invoiceData = {
      title: 'AGENTPAY TAX INVOICE & PROOF OF FULFILLMENT',
      invoiceNumber: fulfillment.taxInvoiceId,
      date: new Date().toISOString(),
      orderId: fulfillment.orderId,
      razorpayOrderId: fulfillment.razorpayOrderId,
      razorpayPaymentId: fulfillment.razorpayPaymentId,
      merchant: fulfillment.merchantName,
      customer: {
        name: fulfillment.customerName,
        deliveryAddress: fulfillment.deliveryAddress,
      },
      courierDetails: {
        partner: fulfillment.courierPartner,
        awbTrackingNumber: fulfillment.trackingNumber,
        estimatedDelivery: fulfillment.estimatedDelivery,
      },
      lineItems: fulfillment.items,
      totalAmount: `INR ${fulfillment.totalAmount}`,
      paymentVerification: {
        gateway: 'Razorpay',
        status: 'CAPTURED_SUCCESSFULLY',
        settlementMode: 'TEST_API_MODE',
      },
    };

    const blob = new Blob([JSON.stringify(invoiceData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice-${fulfillment.taxInvoiceId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-[#0a0f1d] border border-white/[0.12] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Top Header with Razorpay Logo */}
        <div className="flex items-center justify-between p-5 border-b border-white/[0.08] bg-[#090d16]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#0c83ff]/15 border border-[#0c83ff]/30 flex items-center justify-center text-[#0c83ff]">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-white">Order Delivery & Tracking</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/20">
                  {currentStep === 4 ? 'DELIVERED' : 'IN TRANSIT'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Order <strong className="text-slate-200">{fulfillment.orderId}</strong> · {fulfillment.merchantName}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <RazorpayLogo variant="badge" />
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Quick Summary Card */}
          <div className="p-4 rounded-xl bg-[#0d1424] border border-white/[0.06] space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-0.5">
                <div className="text-[11px] text-slate-400">Estimated Delivery:</div>
                <div className="text-sm font-bold text-emerald-400 flex items-center space-x-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>{fulfillment.estimatedDelivery}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 font-mono text-xs">
                <span className="text-slate-400">AWB:</span>
                <span className="text-white font-bold bg-white/5 px-2 py-1 rounded border border-white/5">
                  {fulfillment.trackingNumber}
                </span>
                <button
                  onClick={handleCopyAWB}
                  className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white"
                  title="Copy Tracking Number"
                >
                  {copiedAWB ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center space-x-1.5 truncate max-w-sm">
                <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                <span className="truncate">{fulfillment.deliveryAddress}</span>
              </div>
              <div className="font-bold text-white font-mono">
                ₹{fulfillment.totalAmount.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Interactive Simulation Stepper Controls */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#090d16] border border-white/[0.05] text-xs">
            <span className="text-slate-400 font-medium">Live Delivery Simulator:</span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-slate-300 rounded font-bold disabled:opacity-30"
              >
                Previous
              </button>
              <span className="text-[11px] font-mono text-[#38bdf8] font-bold">
                Stage {currentStep + 1} of 5
              </span>
              <button
                onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
                disabled={currentStep === 4}
                className="px-2.5 py-1 bg-[#0c83ff] hover:bg-[#0270e0] text-white rounded font-bold disabled:opacity-30 flex items-center space-x-1"
              >
                <span>Advance</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Scrolling Vertical Tracking Timeline */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Real-time Transit Timeline
            </h3>

            <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-white/[0.08]">
              {deliveryTimeline.map((item, idx) => {
                const isCompleted = item.status === 'COMPLETED';
                const isActive = item.status === 'ACTIVE';

                return (
                  <div key={idx} className="relative group">
                    
                    {/* Status Dot */}
                    <div
                      className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                        isCompleted
                          ? 'bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/50'
                          : isActive
                          ? 'bg-[#0c83ff] text-white ring-4 ring-[#0c83ff]/20 animate-pulse'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-3 h-3 stroke-[3]" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      )}
                    </div>

                    {/* Timeline Item Content */}
                    <div
                      className={`p-4 rounded-xl border transition-all ${
                        isActive
                          ? 'bg-[#0c83ff]/10 border-[#0c83ff]/30 shadow-md'
                          : isCompleted
                          ? 'bg-[#090d16] border-white/[0.05]'
                          : 'bg-black/20 border-white/[0.02] opacity-50'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div className="font-bold text-sm text-white">{item.stage}</div>
                        <div className="text-[11px] font-mono text-slate-400">{item.time}</div>
                      </div>

                      <div className="text-xs text-[#38bdf8] font-medium mt-0.5 flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>{item.location}</span>
                      </div>

                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        {item.description}
                      </p>

                      {/* Detail Pill Badges */}
                      {item.detailPayload && (
                        <div className="mt-2.5 pt-2 border-t border-white/[0.04] flex flex-wrap gap-2 text-[10px] font-mono text-slate-400">
                          {Object.entries(item.detailPayload).map(([key, val]) => (
                            <span key={key} className="px-2 py-0.5 rounded bg-white/5 border border-white/5">
                              <span className="text-slate-500">{key}:</span> <strong className="text-slate-200">{String(val)}</strong>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

          {/* Razorpay Trust Seal */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-[#02042b] to-[#0a1829] border border-[#0c83ff]/20 flex items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <RazorpayLogo variant="icon" height={28} />
              <div>
                <div className="text-xs font-bold text-white">Razorpay Verified Payment Settlement</div>
                <div className="text-[11px] text-slate-400">Order settled with zero plaintext credential exposure</div>
              </div>
            </div>
            <div className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20 font-bold flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>TEST SETTLED</span>
            </div>
          </div>

        </div>

        {/* Modal Bottom Footer */}
        <div className="p-4 border-t border-white/[0.08] bg-[#090d16] flex items-center justify-between">
          <button
            onClick={handleDownloadInvoice}
            className="px-4 py-2 bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 text-xs font-bold rounded-lg border border-white/[0.08] flex items-center space-x-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5 text-[#0c83ff]" />
            <span>Download Tax Invoice</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#0c83ff] hover:bg-[#0270e0] text-white text-xs font-bold rounded-lg transition-all"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
