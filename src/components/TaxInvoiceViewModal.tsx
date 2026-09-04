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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in">
      <div className="relative w-full max-w-2xl bg-[#0A0A0A] text-white border border-[#1F1F1F] shadow-[0_24px_64px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[92vh] rounded-2xl">
        
        {/* Top Monochrome Accent Bar */}
        <div className="h-1 bg-white/20 w-full" />

        {/* Modal Top Bar (Hidden during window.print) */}
        <div className="flex items-center justify-between p-4 border-b border-[#1F1F1F] bg-[#0D0D0D] print:hidden">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-playfair font-bold text-white">Official Tax Invoice Preview</span>
            <span className="text-[10px] font-mono px-2 py-0.5 border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-bold rounded-md">
              GST Compliant
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="btn-primary text-xs h-9 px-3.5 flex items-center space-x-1.5 rounded-xl"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[#71717A] hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Tax Invoice Sheet */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 text-xs font-sans">
          
          {/* Invoice Header */}
          <div className="flex justify-between items-start border-b border-[#1F1F1F] pb-6">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 bg-white flex items-center justify-center text-black font-serif font-bold text-xs rounded-md">
                  AP
                </div>
                <span className="font-playfair text-lg font-bold text-white">AgentPay Merchant Network</span>
              </div>
              <p className="text-[#71717A] text-[11px] font-sans">
                Fulfillment by Amazon India (Cloudtail Pvt Ltd)<br />
                GSTIN: <strong className="text-white">29AAAAA0000A1Z5</strong> · CIN: U72900KA2026PTC081234
              </p>
            </div>

            <div className="text-right space-y-0.5">
              <div className="text-sm font-sans font-bold text-white uppercase tracking-[0.18em]">Tax Invoice</div>
              <div className="text-[11px] font-mono text-[#71717A]">Invoice: <strong className="text-white">{invoiceId}</strong></div>
              <div className="text-[11px] text-[#71717A]">Date: {new Date().toLocaleDateString('en-IN')}</div>
            </div>
          </div>

          {/* Bill To & Payment Verification */}
          <div className="grid grid-cols-2 gap-6 p-4 bg-[#0D0D0D] border border-[#1F1F1F] rounded-xl">
            <div className="space-y-1">
              <div className="text-[10px] font-sans font-semibold uppercase tracking-[0.18em] text-[#71717A]">Billed To</div>
              <div className="font-sans font-bold text-white text-sm">{customerName}</div>
              <p className="text-[#A1A1AA] text-[11px] leading-relaxed font-sans">{deliveryAddress}</p>
              <div className="text-[11px] text-[#71717A]">State Code: 29 (Karnataka)</div>
            </div>

            <div className="space-y-1">
              <div className="text-[10px] font-sans font-semibold uppercase tracking-[0.18em] text-[#71717A]">Payment Confirmation</div>
              <div className="font-bold text-emerald-400 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Paid via Razorpay Test API</span>
              </div>
              <div className="text-[11px] font-mono text-[#A1A1AA]">Payment ID: {paymentId}</div>
              <div className="text-[11px] font-mono text-[#A1A1AA]">Order ID: {orderId}</div>
              <div className="text-[10px] font-mono text-[#71717A]">Settlement: Instant HMAC-SHA256</div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-[#1F1F1F] rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#121212] text-white font-sans font-bold border-b border-[#1F1F1F] uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">Description of Goods</th>
                  <th className="p-3">HSN Code</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-right">Taxable Value</th>
                  <th className="p-3 text-right">Total (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F1F1F] bg-[#0A0A0A]">
                <tr>
                  <td className="p-3 font-mono text-[#71717A]">1</td>
                  <td className="p-3">
                    <div className="font-sans font-semibold text-white">{productName}</div>
                    <div className="text-[10px] text-[#71717A]">Verified Autonomous Order Settlement</div>
                  </td>
                  <td className="p-3 font-mono text-[#71717A]">640411</td>
                  <td className="p-3 text-center font-mono font-bold text-white">1</td>
                  <td className="p-3 text-right font-mono text-[#A1A1AA]">₹{basePrice.toLocaleString()}</td>
                  <td className="p-3 text-right font-mono font-bold text-white">₹{basePrice.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Tax Breakdown */}
          <div className="flex justify-end">
            <div className="w-64 space-y-1.5 text-xs font-sans">
              <div className="flex justify-between text-[#A1A1AA]">
                <span>Taxable Subtotal:</span>
                <span className="font-mono font-bold text-white">₹{basePrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#A1A1AA]">
                <span>CGST (9.0%):</span>
                <span className="font-mono text-white">₹{cgst.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#A1A1AA]">
                <span>SGST (9.0%):</span>
                <span className="font-mono text-white">₹{sgst.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-white font-bold text-sm pt-2 border-t border-[#1F1F1F]">
                <span className="uppercase tracking-wider text-xs">Grand Total:</span>
                <span className="font-playfair text-lg font-bold text-white">₹{amount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Footer Note & Razorpay Watermark */}
          <div className="pt-6 border-t border-[#1F1F1F] flex items-center justify-between text-[10px] text-[#71717A]">
            <div className="space-y-0.5">
              <div>This is a computer-generated tax invoice verified under the Razorpay AI Buildathon 2026.</div>
              <div>Cryptographic Seal: <strong className="text-[#A1A1AA]">SHA256:a92e81b8b81c364a6977a8090ae81ca1</strong></div>
            </div>
            <div className="flex items-center space-x-1.5 opacity-90">
              <span className="text-[10px] font-bold text-[#71717A]">Powered by</span>
              <strong className="text-white font-bold text-xs">Razorpay</strong>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
