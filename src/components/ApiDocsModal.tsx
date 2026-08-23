import React from 'react';
import { X, FileCode, Lock, CheckCircle2, Copy, ExternalLink } from 'lucide-react';

interface ApiDocsModalProps {
  onClose: () => void;
}

export const ApiDocsModal: React.FC<ApiDocsModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-[#0d121f] border border-white/[0.1] rounded-xl shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/[0.07]">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono text-[#0c83ff] font-bold">PROTOCOL SPECIFICATION</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400">
                UAP 1.0 / AP2 v2.0
              </span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">
              AgentPay Protocol Endpoints & Integration
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Endpoints List */}
        <div className="space-y-4 text-xs">
          
          <div className="p-3.5 rounded-lg bg-[#090d16] border border-white/[0.04] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="font-mono font-bold text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/10">GET</span>
                <span className="font-mono text-white">/api/uap/catalog</span>
              </div>
              <span className="text-slate-500">Semantic Discovery</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Returns machine-readable JSON-LD catalog formatted for LLM agent semantic search and constraint satisfaction.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-[#090d16] border border-white/[0.04] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="font-mono font-bold text-[#38bdf8] px-1.5 py-0.5 rounded bg-blue-500/10">POST</span>
                <span className="font-mono text-white">/api/uap/quote</span>
              </div>
              <span className="text-slate-500">AP2 Signed Quote</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Merchant Yield Agent calculates dynamic bundle discounts and cryptographically signs quote with inventory lock.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-[#090d16] border border-white/[0.04] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="font-mono font-bold text-[#38bdf8] px-1.5 py-0.5 rounded bg-blue-500/10">POST</span>
                <span className="font-mono text-white">/api/agent/transact</span>
              </div>
              <span className="text-slate-500">Autonomous Execution</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Coordinates full intent-to-settlement pipeline: Intent $\rightarrow$ Catalog $\rightarrow$ Policy $\rightarrow$ Razorpay Order $\rightarrow$ Webhook.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-[#090d16] border border-white/[0.04] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="font-mono font-bold text-amber-400 px-1.5 py-0.5 rounded bg-amber-500/10">POST</span>
                <span className="font-mono text-white">/api/razorpay/webhook</span>
              </div>
              <span className="text-slate-500">HMAC-SHA256</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Validates `x-razorpay-signature` against raw payload and logs immutable audit ledger record.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
