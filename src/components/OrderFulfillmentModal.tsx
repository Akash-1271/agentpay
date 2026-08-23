import React from 'react';
import { X, Truck, CheckCircle2, Download, Package, MapPin, Calendar, FileText, ShieldCheck } from 'lucide-react';
import { AgentTransactionOutcome } from '../types';

interface OrderFulfillmentModalProps {
  outcome: AgentTransactionOutcome;
  onClose: () => void;
}

export const OrderFulfillmentModal: React.FC<OrderFulfillmentModalProps> = ({ outcome, onClose }) => {
  const fulfillment = outcome.fulfillment || {
    orderId: 'AMZ-IN-882910',
    razorpayOrderId: outcome.razorpayOrder?.id || 'order_default',
    razorpayPaymentId: 'pay_live_test_01',
    merchantName: outcome.selectedProduct?.merchantName || 'Amazon India (Cloudtail Logistics)',
    merchantId: outcome.selectedProduct?.merchantId || 'merch_amazon',
    customerName: 'Akash M (Autonomous Shopper)',
    deliveryAddress: 'Flat 402, Prestige Tech Park, Outer Ring Road, Bangalore 560103',
    courierPartner: 'Amazon Logistics',
    trackingNumber: 'AWB-8F92A1-IN',
    estimatedDelivery: 'Tomorrow, Priority Express (Guaranteed)',
    status: 'CONFIRMED',
    timeline: [
      {
        stage: 'Payment Confirmed & Verified',
        description: 'Settled via AgentPay Bounded Enclave with Razorpay.',
        timestamp: new Date().toISOString(),
        completed: true,
      },
      {
        stage: 'Warehouse Picking & Inspection',
        description: 'Automated inventory allocation at Merchant Fulfillment Hub.',
        timestamp: new Date(Date.now() + 15 * 60000).toISOString(),
        completed: true,
      },
      {
        stage: 'Handed Over to Courier',
        description: 'Dispatched via Amazon Logistics (AWB-8F92A1-IN).',
        timestamp: new Date(Date.now() + 45 * 60000).toISOString(),
        completed: false,
      },
      {
        stage: 'Out for Delivery',
        description: 'Assigned for final mile delivery to Bangalore address.',
        timestamp: new Date(Date.now() + 12 * 3600000).toISOString(),
        completed: false,
      },
    ],
    items: [
      {
        name: outcome.selectedProduct?.name || 'Nike Air Zoom Pegasus 40',
        quantity: 1,
        price: outcome.quote?.netAmount || 1899,
        asinOrSku: outcome.selectedProduct?.id || 'SKU-01',
      },
    ],
    totalAmount: outcome.quote?.netAmount || 1899,
    taxInvoiceId: 'INV-2026-98124',
    cryptoSealHash: 'hash_seal_908a8f1',
  };

  const handleDownloadInvoice = () => {
    const invoiceData = {
      title: 'AGENTPAY TAX INVOICE & PROOF OF AUTONOMOUS FULFILLMENT',
      invoiceNumber: fulfillment.taxInvoiceId,
      date: new Date().toISOString(),
      orderId: fulfillment.orderId,
      razorpayOrderId: fulfillment.razorpayOrderId,
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
      cryptographicProof: {
        enclavePolicyHash: outcome.policyResult?.enclaveHash,
        razorpaySignature: outcome.receipt?.auditEnclaveHash,
        status: 'VERIFIED_FINANCIAL_SETTLEMENT',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-[#0d121f] border border-white/[0.1] rounded-xl shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/[0.07]">
          <div>
            <div className="flex items-center space-x-2">
              <Truck className="w-4 h-4 text-[#0c83ff]" />
              <span className="text-xs font-mono text-[#0c83ff] font-bold">MERCHANT ORDER & COURIER TRACKING</span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">
              Order Confirmed: #{fulfillment.orderId}
            </h2>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownloadInvoice}
              className="px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.09] text-slate-200 text-xs font-mono flex items-center space-x-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span>Tax Invoice</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Courier Badge Banner */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-[#0c83ff]/10 to-emerald-500/10 border border-blue-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-xs font-bold text-white">
              <Package className="w-4 h-4 text-emerald-400" />
              <span>{fulfillment.courierPartner} · Express Air Delivery</span>
            </div>
            <div className="text-xs text-slate-400">
              AWB Tracking ID: <strong className="font-mono text-white">{fulfillment.trackingNumber}</strong>
            </div>
          </div>

          <div className="text-right sm:border-l sm:border-white/[0.08] sm:pl-4">
            <div className="text-[10px] text-slate-400 uppercase font-mono">Guaranteed Delivery</div>
            <div className="text-xs font-bold text-emerald-400 font-mono mt-0.5">{fulfillment.estimatedDelivery}</div>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-300">Live Fulfillment Timeline</div>
          <div className="space-y-3">
            {fulfillment.timeline.map((step, idx) => (
              <div key={idx} className="flex items-start space-x-3 text-xs">
                <div className="mt-0.5">
                  {step.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-600 flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-0.5">
                  <div className={`font-bold ${step.completed ? 'text-white' : 'text-slate-500'}`}>
                    {step.stage}
                  </div>
                  <div className="text-slate-400 text-[11px]">{step.description}</div>
                </div>
                <div className="text-[10px] font-mono text-slate-500">
                  {new Date(step.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Destination */}
        <div className="p-3.5 rounded-lg bg-[#090d16] border border-white/[0.04] space-y-1.5 text-xs">
          <div className="flex items-center space-x-1.5 text-slate-400 font-semibold">
            <MapPin className="w-3.5 h-3.5 text-rose-400" />
            <span>Delivery Destination</span>
          </div>
          <div className="text-white font-medium">{fulfillment.customerName}</div>
          <div className="text-slate-400 text-[11px]">{fulfillment.deliveryAddress}</div>
        </div>

      </div>
    </div>
  );
};
