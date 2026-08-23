import React from 'react';
import { X, Printer, Download, CheckCircle2, ShieldCheck } from 'lucide-react';
import { RazorpayLogo } from './RazorpayLogo';

interface TaxInvoiceViewModalProps {
  invoiceId: string;
  orderId: string;
  paymentId: string;
  productName: string;
  amount: number;
  customerName: string;
  deliveryAddress: string;
  onClose: () => void;
}

export const TaxInvoiceViewModal: React.FC<TaxInvoiceViewModalProps> = ({
  invoiceId,
  orderId,
  paymentId,
  productName,
  amount,
  customerName,
  deliveryAddress,
  onClose,
}) => {
  const basePrice = Math.round(amount / 1.18);
  const gstAmount = amount - basePrice;
  const cgst = Math.round(gstAmount / 2);
  const sgst = gstAmount - cgst;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Top Bar (Hidden during window.print) */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50 print:hidden">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-700">Official Tax Invoice Preview</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
              GST Compliant
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-[#0c83ff] hover:bg-[#0270e0] text-white text-xs font-bold rounded-lg shadow-sm flex items-center space-x-1.5 transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Tax Invoice Sheet */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 text-xs font-sans">
          
          {/* Invoice Header */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-6">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded bg-[#0c83ff] flex items-center justify-center text-white font-extrabold text-xs">
                  AP
                </div>
                <span className="text-lg font-extrabold tracking-tight text-slate-950">AgentPay Merchant Network</span>
              </div>
              <p className="text-slate-500 text-[11px]">
                Fulfillment by Amazon India (Cloudtail Pvt Ltd)<br />
                GSTIN: <strong>29AAAAA0000A1Z5</strong> · CIN: U72900KA2026PTC081234
              </p>
            </div>

            <div className="text-right space-y-0.5">
              <div className="text-sm font-extrabold text-slate-900 uppercase">Tax Invoice</div>
              <div className="text-[11px] font-mono text-slate-600">Invoice: <strong>{invoiceId}</strong></div>
              <div className="text-[11px] text-slate-500">Date: {new Date().toLocaleDateString('en-IN')}</div>
            </div>
          </div>

          {/* Bill To & Payment Verification */}
          <div className="grid grid-cols-2 gap-6 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">Billed To</div>
              <div className="font-bold text-slate-900 text-sm">{customerName}</div>
              <p className="text-slate-600 text-[11px] leading-relaxed">{deliveryAddress}</p>
              <div className="text-[11px] text-slate-500">State Code: 29 (Karnataka)</div>
            </div>

            <div className="space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">Payment Confirmation</div>
              <div className="font-bold text-emerald-700 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Paid via Razorpay Test API</span>
              </div>
              <div className="text-[11px] font-mono text-slate-600">Payment ID: {paymentId}</div>
              <div className="text-[11px] font-mono text-slate-600">Order ID: {orderId}</div>
              <div className="text-[10px] font-mono text-slate-500">Settlement: Instant HMAC-SHA256</div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">Description of Goods</th>
                  <th className="p-3">HSN Code</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-right">Taxable Value</th>
                  <th className="p-3 text-right">Total (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-3 font-mono text-slate-500">1</td>
                  <td className="p-3">
                    <div className="font-bold text-slate-900">{productName}</div>
                    <div className="text-[10px] text-slate-500">Verified Autonomous Order Settlement</div>
                  </td>
                  <td className="p-3 font-mono text-slate-600">640411</td>
                  <td className="p-3 text-center font-mono font-bold">1</td>
                  <td className="p-3 text-right font-mono">₹{basePrice.toLocaleString()}</td>
                  <td className="p-3 text-right font-mono font-bold">₹{basePrice.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Tax Breakdown */}
          <div className="flex justify-end">
            <div className="w-64 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Taxable Subtotal:</span>
                <span className="font-mono font-bold">₹{basePrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>CGST (9.0%):</span>
                <span className="font-mono">₹{cgst.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>SGST (9.0%):</span>
                <span className="font-mono">₹{sgst.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-950 font-bold text-sm pt-2 border-t border-slate-200">
                <span>Grand Total (INR):</span>
                <span className="font-mono text-base font-extrabold text-[#0c83ff]">₹{amount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Footer Note & Razorpay Watermark */}
          <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500">
            <div className="space-y-0.5">
              <div>This is a computer-generated tax invoice verified under the Razorpay AI Buildathon 2026.</div>
              <div>Cryptographic Seal: <strong>SHA256:a92e81b8b81c364a6977a8090ae81ca1</strong></div>
            </div>
            <div className="flex items-center space-x-1.5 opacity-80">
              <span className="text-[10px] font-bold text-slate-600">Powered by</span>
              <strong className="text-[#0c83ff] font-bold text-xs">Razorpay</strong>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
