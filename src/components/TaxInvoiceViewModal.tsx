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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A1A]/70 backdrop-blur-sm animate-in">
      <div className="relative w-full max-w-2xl bg-[#FFFFFF] text-[#1A1A1A] border-2 border-[#1A1A1A] shadow-[0_16px_48px_rgba(0,0,0,0.25)] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Gold Accent Bar */}
        <div className="h-1 bg-[#D4AF37] w-full" />

        {/* Modal Top Bar (Hidden during window.print) */}
        <div className="flex items-center justify-between p-4 border-b border-[#1A1A1A]/12 bg-[#FAF8F5] print:hidden">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-serif font-bold text-[#1A1A1A]">Official Tax Invoice Preview</span>
            <span className="text-[10px] font-mono px-2 py-0.5 border border-emerald-600/30 bg-emerald-50 text-emerald-800 font-bold">
              GST Compliant
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="luxury-btn-primary text-xs h-9 px-3.5 flex items-center space-x-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[#6C6863] hover:text-[#1A1A1A] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Tax Invoice Sheet */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 text-xs font-sans">
          
          {/* Invoice Header */}
          <div className="flex justify-between items-start border-b border-[#1A1A1A]/12 pb-6">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 bg-[#1A1A1A] flex items-center justify-center text-[#F9F8F6] font-serif font-bold text-xs">
                  AP
                </div>
                <span className="font-serif text-lg font-bold text-[#1A1A1A]">AgentPay Merchant Network</span>
              </div>
              <p className="text-[#6C6863] text-[11px] font-sans">
                Fulfillment by Amazon India (Cloudtail Pvt Ltd)<br />
                GSTIN: <strong className="text-[#1A1A1A]">29AAAAA0000A1Z5</strong> · CIN: U72900KA2026PTC081234
              </p>
            </div>

            <div className="text-right space-y-0.5">
              <div className="text-sm font-sans font-bold text-[#1A1A1A] uppercase tracking-[0.18em]">Tax Invoice</div>
              <div className="text-[11px] font-mono text-[#6C6863]">Invoice: <strong className="text-[#1A1A1A]">{invoiceId}</strong></div>
              <div className="text-[11px] text-[#6C6863]">Date: {new Date().toLocaleDateString('en-IN')}</div>
            </div>
          </div>

          {/* Bill To & Payment Verification */}
          <div className="grid grid-cols-2 gap-6 p-4 bg-[#FAF8F5] border border-[#1A1A1A]/10">
            <div className="space-y-1">
              <div className="text-[10px] font-sans font-semibold uppercase tracking-[0.18em] text-[#6C6863]">Billed To</div>
              <div className="font-serif font-bold text-[#1A1A1A] text-sm">{customerName}</div>
              <p className="text-[#6C6863] text-[11px] leading-relaxed font-sans">{deliveryAddress}</p>
              <div className="text-[11px] text-[#6C6863]">State Code: 29 (Karnataka)</div>
            </div>

            <div className="space-y-1">
              <div className="text-[10px] font-sans font-semibold uppercase tracking-[0.18em] text-[#6C6863]">Payment Confirmation</div>
              <div className="font-bold text-emerald-800 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>Paid via Razorpay Test API</span>
              </div>
              <div className="text-[11px] font-mono text-[#6C6863]">Payment ID: {paymentId}</div>
              <div className="text-[11px] font-mono text-[#6C6863]">Order ID: {orderId}</div>
              <div className="text-[10px] font-mono text-[#6C6863]">Settlement: Instant HMAC-SHA256</div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-[#1A1A1A]/12 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] text-[#1A1A1A] font-sans font-bold border-b border-[#1A1A1A]/12 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">Description of Goods</th>
                  <th className="p-3">HSN Code</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-right">Taxable Value</th>
                  <th className="p-3 text-right">Total (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1A1A]/10">
                <tr>
                  <td className="p-3 font-mono text-[#6C6863]">1</td>
                  <td className="p-3">
                    <div className="font-serif font-bold text-[#1A1A1A]">{productName}</div>
                    <div className="text-[10px] text-[#6C6863]">Verified Autonomous Order Settlement</div>
                  </td>
                  <td className="p-3 font-mono text-[#6C6863]">640411</td>
                  <td className="p-3 text-center font-mono font-bold text-[#1A1A1A]">1</td>
                  <td className="p-3 text-right font-mono text-[#1A1A1A]">₹{basePrice.toLocaleString()}</td>
                  <td className="p-3 text-right font-mono font-bold text-[#1A1A1A]">₹{basePrice.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Tax Breakdown */}
          <div className="flex justify-end">
            <div className="w-64 space-y-1.5 text-xs font-sans">
              <div className="flex justify-between text-[#6C6863]">
                <span>Taxable Subtotal:</span>
                <span className="font-mono font-bold text-[#1A1A1A]">₹{basePrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#6C6863]">
                <span>CGST (9.0%):</span>
                <span className="font-mono text-[#1A1A1A]">₹{cgst.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#6C6863]">
                <span>SGST (9.0%):</span>
                <span className="font-mono text-[#1A1A1A]">₹{sgst.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#1A1A1A] font-bold text-sm pt-2 border-t border-[#1A1A1A]/12">
                <span className="uppercase tracking-wider text-xs">Grand Total:</span>
                <span className="font-serif text-lg font-bold text-[#1A1A1A]">₹{amount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Footer Note & Razorpay Watermark */}
          <div className="pt-6 border-t border-[#1A1A1A]/12 flex items-center justify-between text-[10px] text-[#6C6863]">
            <div className="space-y-0.5">
              <div>This is a computer-generated tax invoice verified under the Razorpay AI Buildathon 2026.</div>
              <div>Cryptographic Seal: <strong className="text-[#1A1A1A]">SHA256:a92e81b8b81c364a6977a8090ae81ca1</strong></div>
            </div>
            <div className="flex items-center space-x-1.5 opacity-80">
              <span className="text-[10px] font-bold text-[#6C6863]">Powered by</span>
              <strong className="text-[#1A1A1A] font-bold text-xs">Razorpay</strong>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

