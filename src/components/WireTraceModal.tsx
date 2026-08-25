import React, { useState, useEffect } from 'react';
import { X, Network, Copy, Check, Terminal, ShieldCheck, ArrowDown } from 'lucide-react';
import { api } from '../services/api';

interface WireTraceModalProps {
  txId?: string;
  onClose: () => void;
}

export const WireTraceModal: React.FC<WireTraceModalProps> = ({ txId = 'tx_pegasus_40_01', onClose }) => {
  const [wireData, setWireData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadWire() {
      try {
        setLoading(true);
        const data = await api.getProtocolWireTrace(txId);
        setWireData(data);
      } catch (err) {
        console.error('Failed to load wire trace:', err);
      } finally {
        setLoading(false);
      }
    }
    loadWire();
  }, [txId]);

  const handleCopy = () => {
    if (wireData) {
      navigator.clipboard.writeText(JSON.stringify(wireData, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A1A]/70 backdrop-blur-sm animate-in">
      <div className="relative w-full max-w-3xl bg-[#FFFFFF] border-2 border-[#1A1A1A] p-7 space-y-6 max-h-[90vh] overflow-y-auto shadow-[0_16px_48px_rgba(0,0,0,0.25)]">
        
        {/* Top Gold Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#D4AF37]" />

        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#1A1A1A]/12">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.18em] text-[#6C6863]">RFC-COMPLIANT PROTOCOL WIRE TRACE</span>
              <span className="text-[10px] font-mono px-2 py-0.5 border border-emerald-600/30 text-emerald-800 bg-emerald-50 font-bold">
                UAP 1.0 / AP2 v2.0
              </span>
            </div>
            <h2 className="font-serif text-xl font-bold text-[#1A1A1A] mt-1">
              Raw Network Wire Frames & Cryptographic Headers
            </h2>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="p-1.5 border border-[#1A1A1A]/20 bg-[#FAF8F5] text-[#1A1A1A] hover:bg-[#EBE5DE] text-xs flex items-center space-x-1 transition-all"
              title="Copy Raw JSON"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-700" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-1 text-[#6C6863] hover:text-[#1A1A1A]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Frames Timeline */}
        {wireData ? (
          <div className="space-y-4 text-xs font-mono">
            
            {/* Frame 1: Client Request */}
            <div className="p-4 bg-[#FAF8F5] border border-[#1A1A1A]/12 space-y-2">
              <div className="flex justify-between items-center text-[#1A1A1A] border-b border-[#1A1A1A]/10 pb-2">
                <span className="font-bold text-[#1A1A1A]">FRAME 1: UAP Client Intent Request</span>
                <span className="font-mono text-[#6C6863]">{wireData.clientRequest.method} {wireData.clientRequest.path}</span>
              </div>
              <div className="space-y-1 text-[11px] text-[#1A1A1A]">
                {Object.entries(wireData.clientRequest.headers).map(([k, v]) => (
                  <div key={k} className="flex">
                    <span className="text-[#6C6863] w-48 flex-shrink-0">{k}:</span>
                    <span className="text-[#1A1A1A] truncate">{v as string}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Frame 2: Enclave Interception */}
            <div className="p-4 bg-amber-50 border border-amber-600/30 space-y-2">
              <div className="flex justify-between items-center text-amber-900 border-b border-amber-600/20 pb-2">
                <span className="font-bold text-amber-900">FRAME 2: Bounded Spending Enclave Guard Interception</span>
                <span className="font-mono text-amber-800">HTTP 200 {wireData.enclaveInterception.statusText}</span>
              </div>
              <div className="space-y-1 text-[11px] text-amber-950">
                {Object.entries(wireData.enclaveInterception.headers).map(([k, v]) => (
                  <div key={k} className="flex">
                    <span className="text-amber-800 w-48 flex-shrink-0">{k}:</span>
                    <span className="font-semibold truncate">{v as string}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Frame 3: Razorpay Settlement */}
            <div className="p-4 bg-emerald-50 border border-emerald-600/30 space-y-2">
              <div className="flex justify-between items-center text-emerald-900 border-b border-emerald-600/20 pb-2">
                <span className="font-bold text-emerald-900">FRAME 3: Razorpay Test Order Settlement & Webhook</span>
                <span className="font-mono text-emerald-800">HTTP 201 CREATED</span>
              </div>
              <div className="space-y-1 text-[11px] text-emerald-950">
                {Object.entries(wireData.razorpaySettlement.headers).map(([k, v]) => (
                  <div key={k} className="flex">
                    <span className="text-emerald-800 w-48 flex-shrink-0">{k}:</span>
                    <span className="font-semibold truncate">{v as string}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ) : (
          <div className="py-8 text-center text-xs text-[#6C6863] font-mono">
            Loading wire frames...
          </div>
        )}

      </div>
    </div>
  );
};

