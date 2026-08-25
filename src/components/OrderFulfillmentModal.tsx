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
import { TaxInvoiceViewModal } from './TaxInvoiceViewModal';

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
  const [currentStep, setCurrentStep] = useState(2);
  const [copiedAWB, setCopiedAWB] = useState(false);
  const [isInvoicePreviewOpen, setIsInvoicePreviewOpen] = useState(false);

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
      stage: 'Order Placed & Settled',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A1A]/70 backdrop-blur-sm animate-in">
      <div className="relative w-full max-w-2xl bg-[#FFFFFF] border-2 border-[#1A1A1A] shadow-[0_16px_48px_rgba(0,0,0,0.25)] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Top Gold Accent Bar */}
        <div className="h-1 bg-[#D4AF37] w-full" />

        {/* Modal Top Header with Razorpay Logo */}
        <div className="flex items-center justify-between p-5 border-b border-[#1A1A1A]/12 bg-[#FAF8F5]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 border border-[#1A1A1A]/20 bg-[#FFFFFF] flex items-center justify-center text-[#1A1A1A]">
              <Truck className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-serif text-base font-bold text-[#1A1A1A]">Order Delivery & Tracking</h2>
                <span className="text-[9px] font-sans font-bold px-2 py-0.5 border border-emerald-600/30 text-emerald-800 bg-emerald-50 uppercase tracking-widest">
                  {currentStep === 4 ? 'DELIVERED' : 'IN TRANSIT'}
                </span>
              </div>
              <p className="text-xs text-[#6C6863] font-sans mt-0.5">
                Order <strong className="text-[#1A1A1A]">{fulfillment.orderId}</strong> · {fulfillment.merchantName}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <RazorpayLogo variant="badge" />
            <button
              onClick={onClose}
              className="p-1.5 text-[#6C6863] hover:text-[#1A1A1A] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Quick Summary Card */}
          <div className="p-4 bg-[#FAF8F5] border border-[#1A1A1A]/10 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-0.5">
                <div className="text-[10px] font-sans uppercase font-semibold text-[#6C6863] tracking-[0.18em]">Estimated Delivery:</div>
                <div className="text-sm font-serif font-bold text-emerald-800 flex items-center space-x-1.5">
                  <Calendar className="w-4 h-4 text-emerald-700" />
                  <span>{fulfillment.estimatedDelivery}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 font-mono text-xs">
                <span className="text-[#6C6863]">AWB:</span>
                <span className="text-[#1A1A1A] font-bold bg-[#FFFFFF] px-2 py-1 border border-[#1A1A1A]/15">
                  {fulfillment.trackingNumber}
                </span>
                <button
                  onClick={handleCopyAWB}
                  className="p-1.5 text-[#6C6863] hover:text-[#1A1A1A]"
                  title="Copy Tracking Number"
                >
                  {copiedAWB ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-[#1A1A1A]/10 flex items-center justify-between text-xs text-[#6C6863] font-sans">
              <div className="flex items-center space-x-1.5 truncate max-w-sm">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF37] flex-shrink-0" />
                <span className="truncate">{fulfillment.deliveryAddress}</span>
              </div>
              <div className="font-serif font-bold text-[#1A1A1A] text-sm">
                ₹{fulfillment.totalAmount.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Interactive Simulation Stepper Controls */}
          <div className="flex items-center justify-between p-3 bg-[#FAF8F5] border border-[#1A1A1A]/10 text-xs">
            <span className="text-[#6C6863] font-sans uppercase tracking-[0.15em] font-semibold text-[10px]">Live Delivery Simulator:</span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="px-3 py-1 bg-[#FFFFFF] hover:bg-[#EBE5DE] text-[#1A1A1A] border border-[#1A1A1A]/20 text-xs font-sans uppercase font-bold disabled:opacity-30"
              >
                Previous
              </button>
              <span className="text-[11px] font-mono text-[#1A1A1A] font-bold">
                Stage {currentStep + 1} of 5
              </span>
              <button
                onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
                disabled={currentStep === 4}
                className="px-3 py-1 luxury-btn-primary text-xs font-sans uppercase font-bold disabled:opacity-30 flex items-center space-x-1"
              >
                <span>Advance</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Scrolling Vertical Tracking Timeline */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-sans font-semibold text-[#6C6863] uppercase tracking-[0.2em]">
              Real-time Transit Timeline
            </h3>

            <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-[#1A1A1A]/15">
              {deliveryTimeline.map((item, idx) => {
                const isCompleted = item.status === 'COMPLETED';
                const isActive = item.status === 'ACTIVE';

                return (
                  <div key={idx} className="relative group">
                    
                    {/* Status Dot */}
                    <div
                      className={`absolute -left-6 top-1 w-5 h-5 flex items-center justify-center transition-all ${
                        isCompleted
                          ? 'bg-emerald-600 text-white'
                          : isActive
                          ? 'bg-[#1A1A1A] text-white ring-4 ring-[#1A1A1A]/10'
                          : 'bg-[#EBE5DE] text-[#6C6863]'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-3 h-3 stroke-[3]" />
                      ) : (
                        <span className="w-1.5 h-1.5 bg-current" />
                      )}
                    </div>

                    {/* Timeline Item Content */}
                    <div
                      className={`p-4 border transition-all ${
                        isActive
                          ? 'bg-[#FAF8F5] border-[#1A1A1A] shadow-sm'
                          : isCompleted
                          ? 'bg-[#FAF8F5] border-[#1A1A1A]/10'
                          : 'bg-[#FFFFFF] border-[#1A1A1A]/5 opacity-60'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div className="font-serif font-bold text-sm text-[#1A1A1A]">{item.stage}</div>
                        <div className="text-[11px] font-mono text-[#6C6863]">{item.time}</div>
                      </div>

                      <div className="text-xs text-[#1A1A1A] font-medium mt-0.5 flex items-center space-x-1 font-sans">
                        <MapPin className="w-3 h-3 text-[#D4AF37]" />
                        <span>{item.location}</span>
                      </div>

                      <p className="text-xs text-[#6C6863] mt-1 leading-relaxed font-sans">
                        {item.description}
                      </p>

                      {/* Detail Pill Badges */}
                      {item.detailPayload && (
                        <div className="mt-2.5 pt-2 border-t border-[#1A1A1A]/10 flex flex-wrap gap-2 text-[10px] font-mono text-[#6C6863]">
                          {Object.entries(item.detailPayload).map(([key, val]) => (
                            <span key={key} className="px-2 py-0.5 bg-[#FFFFFF] border border-[#1A1A1A]/15">
                              <span className="text-[#6C6863]">{key}:</span> <strong className="text-[#1A1A1A]">{String(val)}</strong>
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
          <div className="p-4 bg-[#FAF8F5] border border-[#1A1A1A]/12 flex items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <RazorpayLogo variant="icon" height={28} />
              <div>
                <div className="text-xs font-serif font-bold text-[#1A1A1A]">Razorpay Verified Payment Settlement</div>
                <div className="text-[11px] text-[#6C6863] font-sans">Order settled with zero plaintext credential exposure</div>
              </div>
            </div>
            <div className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2.5 py-1 border border-emerald-600/30 font-bold flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>TEST SETTLED</span>
            </div>
          </div>

        </div>

        {/* Modal Bottom Footer */}
        <div className="p-4 border-t border-[#1A1A1A]/12 bg-[#FAF8F5] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsInvoicePreviewOpen(true)}
              className="luxury-btn-secondary text-xs h-10 px-4 flex items-center space-x-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Print Tax Invoice</span>
            </button>
            <button
              onClick={handleDownloadInvoice}
              className="border border-[#1A1A1A]/20 bg-transparent hover:bg-[#EBE5DE] text-[#1A1A1A] text-xs h-10 px-3 flex items-center space-x-1.5 transition-colors font-sans uppercase tracking-wider"
              title="Download JSON Proof"
            >
              <Download className="w-3.5 h-3.5" />
              <span>JSON Proof</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="luxury-btn-primary text-xs h-10 px-6"
          >
            Done
          </button>
        </div>

      </div>

      {isInvoicePreviewOpen && (
        <TaxInvoiceViewModal
          invoiceId={fulfillment.taxInvoiceId}
          orderId={fulfillment.orderId}
          paymentId={fulfillment.razorpayPaymentId}
          productName={fulfillment.items[0]?.name || 'Autonomous Purchase'}
          amount={fulfillment.totalAmount}
          customerName={fulfillment.customerName}
          deliveryAddress={fulfillment.deliveryAddress}
          onClose={() => setIsInvoicePreviewOpen(false)}
        />
      )}
    </div>
  );
};

