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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in">
      <div className="relative w-full max-w-3xl bg-[#0A0A0A] border border-[#1F1F1F] p-7 space-y-6 max-h-[90vh] overflow-y-auto shadow-[0_24px_64px_rgba(0,0,0,0.9)] rounded-2xl">
        
        {/* Top Monochrome Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 rounded-t-2xl" />

        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#1F1F1F]">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.18em] text-[#71717A]">RFC-COMPLIANT PROTOCOL WIRE TRACE</span>
              <span className="text-[10px] font-mono px-2 py-0.5 border border-emerald-500/30 text-emerald-400 bg-emerald-500/10 font-bold rounded-md">
                UAP 1.0 / AP2 v2.0
              </span>
            </div>
            <h2 className="font-playfair text-xl font-bold text-white mt-1">
              Raw Network Wire Frames & Cryptographic Headers
            </h2>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="p-1.5 border border-[#1F1F1F] bg-[#0D0D0D] text-[#A1A1AA] hover:text-white hover:border-[#333333] text-xs flex items-center space-x-1 transition-all rounded-lg"
              title="Copy Raw JSON"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-1 text-[#71717A] hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Frames Timeline */}
        {wireData ? (
          <div className="space-y-4 text-xs font-mono">
            
            {/* Frame 1: Client Request */}
            <div className="p-4 bg-[#0D0D0D] border border-[#1F1F1F] rounded-xl space-y-2">
              <div className="flex justify-between items-center text-white border-b border-[#1F1F1F] pb-2">
                <span className="font-bold text-white">FRAME 1: UAP Client Intent Request</span>
                <span className="font-mono text-[#71717A]">{wireData.clientRequest.method} {wireData.clientRequest.path}</span>
              </div>
              <div className="space-y-1 text-[11px] text-[#A1A1AA]">
                {Object.entries(wireData.clientRequest.headers).map(([k, v]) => (
                  <div key={k} className="flex">
                    <span className="text-[#71717A] w-48 flex-shrink-0">{k}:</span>
                    <span className="text-white truncate">{v as string}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Frame 2: Enclave Interception */}
            <div className="p-4 bg-[#141108] border border-amber-500/30 rounded-xl space-y-2">
              <div className="flex justify-between items-center text-amber-400 border-b border-amber-500/20 pb-2">
                <span className="font-bold">FRAME 2: Bounded Spending Enclave Guard Interception</span>
                <span className="font-mono text-amber-300">HTTP 200 {wireData.enclaveInterception.statusText}</span>
              </div>
              <div className="space-y-1 text-[11px] text-amber-200">
                {Object.entries(wireData.enclaveInterception.headers).map(([k, v]) => (
                  <div key={k} className="flex">
                    <span className="text-amber-400/80 w-48 flex-shrink-0">{k}:</span>
                    <span className="font-semibold truncate">{v as string}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Frame 3: Razorpay Settlement */}
            <div className="p-4 bg-[#08140E] border border-emerald-500/30 rounded-xl space-y-2">
              <div className="flex justify-between items-center text-emerald-400 border-b border-emerald-500/20 pb-2">
                <span className="font-bold">FRAME 3: Razorpay Test Order Settlement & Webhook</span>
                <span className="font-mono text-emerald-300">HTTP 201 CREATED</span>
              </div>
              <div className="space-y-1 text-[11px] text-emerald-200">
                {Object.entries(wireData.razorpaySettlement.headers).map(([k, v]) => (
                  <div key={k} className="flex">
                    <span className="text-emerald-400/80 w-48 flex-shrink-0">{k}:</span>
                    <span className="font-semibold truncate">{v as string}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ) : (
          <div className="py-8 text-center text-xs text-[#71717A] font-mono">
            Loading wire frames...
          </div>
        )}

      </div>
    </div>
  );
};
