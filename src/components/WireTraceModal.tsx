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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl bg-[#0d121f] border border-white/[0.1] rounded-xl shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/[0.07]">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono text-[#0c83ff] font-bold">RFC-COMPLIANT PROTOCOL WIRE TRACE</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400">
                UAP 1.0 / AP2 v2.0
              </span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">
              Raw Network Wire Frames & Cryptographic Headers
            </h2>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 text-xs flex items-center space-x-1 transition-all"
              title="Copy Raw JSON"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Frames Timeline */}
        {wireData ? (
          <div className="space-y-4 text-xs font-mono">
            
            {/* Frame 1: Client Request */}
            <div className="p-4 rounded-lg bg-[#090d16] border border-white/[0.04] space-y-2">
              <div className="flex justify-between items-center text-slate-400 border-b border-white/[0.04] pb-2">
                <span className="text-[#38bdf8] font-bold">FRAME 1: UAP Client Intent Request</span>
                <span>{wireData.clientRequest.method} {wireData.clientRequest.path}</span>
              </div>
              <div className="space-y-1 text-[11px] text-slate-300">
                {Object.entries(wireData.clientRequest.headers).map(([k, v]) => (
                  <div key={k} className="flex">
                    <span className="text-slate-500 w-44 flex-shrink-0">{k}:</span>
                    <span className="text-slate-300 truncate">{v as string}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Frame 2: Enclave Interception */}
            <div className="p-4 rounded-lg bg-[#090d16] border border-amber-500/20 space-y-2">
              <div className="flex justify-between items-center text-slate-400 border-b border-white/[0.04] pb-2">
                <span className="text-amber-400 font-bold">FRAME 2: Bounded Spending Enclave Guard Interception</span>
                <span className="text-amber-300">HTTP 200 {wireData.enclaveInterception.statusText}</span>
              </div>
              <div className="space-y-1 text-[11px] text-slate-300">
                {Object.entries(wireData.enclaveInterception.headers).map(([k, v]) => (
                  <div key={k} className="flex">
                    <span className="text-slate-500 w-44 flex-shrink-0">{k}:</span>
                    <span className="text-emerald-400 truncate">{v as string}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Frame 3: Razorpay Settlement */}
            <div className="p-4 rounded-lg bg-[#090d16] border border-emerald-500/20 space-y-2">
              <div className="flex justify-between items-center text-slate-400 border-b border-white/[0.04] pb-2">
                <span className="text-emerald-400 font-bold">FRAME 3: Razorpay Test Order Settlement & Webhook</span>
                <span className="text-emerald-300">HTTP 201 CREATED</span>
              </div>
              <div className="space-y-1 text-[11px] text-slate-300">
                {Object.entries(wireData.razorpaySettlement.headers).map(([k, v]) => (
                  <div key={k} className="flex">
                    <span className="text-slate-500 w-44 flex-shrink-0">{k}:</span>
                    <span className="text-slate-200 truncate">{v as string}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ) : (
          <div className="py-8 text-center text-xs text-slate-500 font-mono">
            Loading wire frames...
          </div>
        )}

      </div>
    </div>
  );
};
