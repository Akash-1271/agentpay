import React from 'react';
import { X, FileCode, Lock, CheckCircle2, Copy, ExternalLink } from 'lucide-react';

interface ApiDocsModalProps {
  onClose: () => void;
}

export const ApiDocsModal: React.FC<ApiDocsModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in">
      <div className="relative w-full max-w-2xl bg-[#0A0A0A] border border-[#1F1F1F] p-7 space-y-6 max-h-[90vh] overflow-y-auto shadow-[0_24px_64px_rgba(0,0,0,0.9)] rounded-2xl">
        
        {/* Top Monochrome Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 rounded-t-2xl" />

        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#1F1F1F]">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.18em] text-[#71717A]">PROTOCOL SPECIFICATION</span>
              <span className="text-[10px] font-mono px-2 py-0.5 border border-emerald-500/30 text-emerald-400 bg-emerald-500/10 font-bold rounded-md">
                UAP 1.0 / AP2 v2.0
              </span>
            </div>
            <h2 className="font-playfair text-xl font-bold text-white mt-1">
              AgentPay Protocol Endpoints & Integration
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-[#71717A] hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Endpoints List */}
        <div className="space-y-4 text-xs">
          
          <div className="p-4 bg-[#0D0D0D] border border-[#1F1F1F] rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="font-mono font-bold text-emerald-400 px-2 py-0.5 border border-emerald-500/30 bg-emerald-500/10 text-[10px] rounded-md">GET</span>
                <span className="font-mono text-white font-bold">/api/uap/catalog</span>
              </div>
              <span className="text-[#71717A] font-sans text-[11px]">Semantic Discovery</span>
            </div>
            <p className="text-[#A1A1AA] text-[11px] leading-relaxed font-sans">
              Returns machine-readable JSON-LD catalog formatted for LLM agent semantic search and constraint satisfaction.
            </p>
          </div>

          <div className="p-4 bg-[#0D0D0D] border border-[#1F1F1F] rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="font-mono font-bold text-white px-2 py-0.5 border border-white/20 bg-white/10 text-[10px] rounded-md">POST</span>
                <span className="font-mono text-white font-bold">/api/uap/quote</span>
              </div>
              <span className="text-[#71717A] font-sans text-[11px]">AP2 Signed Quote</span>
            </div>
            <p className="text-[#A1A1AA] text-[11px] leading-relaxed font-sans">
              Merchant Yield Agent calculates dynamic bundle discounts and cryptographically signs quote with inventory lock.
            </p>
          </div>

          <div className="p-4 bg-[#0D0D0D] border border-[#1F1F1F] rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="font-mono font-bold text-white px-2 py-0.5 border border-white/20 bg-white/10 text-[10px] rounded-md">POST</span>
                <span className="font-mono text-white font-bold">/api/agent/transact</span>
              </div>
              <span className="text-[#71717A] font-sans text-[11px]">Autonomous Execution</span>
            </div>
            <p className="text-[#A1A1AA] text-[11px] leading-relaxed font-sans">
              Coordinates full intent-to-settlement pipeline: Intent → Catalog → Policy → Razorpay Order → Webhook.
            </p>
          </div>

          <div className="p-4 bg-[#0D0D0D] border border-[#1F1F1F] rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="font-mono font-bold text-amber-400 px-2 py-0.5 border border-amber-500/30 bg-amber-500/10 text-[10px] rounded-md">POST</span>
                <span className="font-mono text-white font-bold">/api/razorpay/webhook</span>
              </div>
              <span className="text-[#71717A] font-sans text-[11px]">HMAC-SHA256</span>
            </div>
            <p className="text-[#A1A1AA] text-[11px] leading-relaxed font-sans">
              Validates `x-razorpay-signature` against raw payload and logs immutable audit ledger record.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
