import React from 'react';
import { X, FileCode, Lock, CheckCircle2, Copy, ExternalLink } from 'lucide-react';

interface ApiDocsModalProps {
  onClose: () => void;
}

export const ApiDocsModal: React.FC<ApiDocsModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A1A]/70 backdrop-blur-sm animate-in">
      <div className="relative w-full max-w-2xl bg-[#FFFFFF] border-2 border-[#1A1A1A] p-7 space-y-6 max-h-[90vh] overflow-y-auto shadow-[0_16px_48px_rgba(0,0,0,0.25)]">
        
        {/* Top Gold Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#D4AF37]" />

        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#1A1A1A]/12">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.18em] text-[#6C6863]">PROTOCOL SPECIFICATION</span>
              <span className="text-[10px] font-mono px-2 py-0.5 border border-emerald-600/30 text-emerald-800 bg-emerald-50 font-bold">
                UAP 1.0 / AP2 v2.0
              </span>
            </div>
            <h2 className="font-serif text-xl font-bold text-[#1A1A1A] mt-1">
              AgentPay Protocol Endpoints & Integration
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-[#6C6863] hover:text-[#1A1A1A]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Endpoints List */}
        <div className="space-y-4 text-xs">
          
          <div className="p-4 bg-[#FAF8F5] border border-[#1A1A1A]/10 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="font-mono font-bold text-emerald-800 px-2 py-0.5 border border-emerald-600/30 bg-emerald-50 text-[10px]">GET</span>
                <span className="font-mono text-[#1A1A1A] font-bold">/api/uap/catalog</span>
              </div>
              <span className="text-[#6C6863] font-sans text-[11px]">Semantic Discovery</span>
            </div>
            <p className="text-[#6C6863] text-[11px] leading-relaxed font-sans">
              Returns machine-readable JSON-LD catalog formatted for LLM agent semantic search and constraint satisfaction.
            </p>
          </div>

          <div className="p-4 bg-[#FAF8F5] border border-[#1A1A1A]/10 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="font-mono font-bold text-[#1A1A1A] px-2 py-0.5 border border-[#1A1A1A]/30 bg-[#FFFFFF] text-[10px]">POST</span>
                <span className="font-mono text-[#1A1A1A] font-bold">/api/uap/quote</span>
              </div>
              <span className="text-[#6C6863] font-sans text-[11px]">AP2 Signed Quote</span>
            </div>
            <p className="text-[#6C6863] text-[11px] leading-relaxed font-sans">
              Merchant Yield Agent calculates dynamic bundle discounts and cryptographically signs quote with inventory lock.
            </p>
          </div>

          <div className="p-4 bg-[#FAF8F5] border border-[#1A1A1A]/10 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="font-mono font-bold text-[#1A1A1A] px-2 py-0.5 border border-[#1A1A1A]/30 bg-[#FFFFFF] text-[10px]">POST</span>
                <span className="font-mono text-[#1A1A1A] font-bold">/api/agent/transact</span>
              </div>
              <span className="text-[#6C6863] font-sans text-[11px]">Autonomous Execution</span>
            </div>
            <p className="text-[#6C6863] text-[11px] leading-relaxed font-sans">
              Coordinates full intent-to-settlement pipeline: Intent $\rightarrow$ Catalog $\rightarrow$ Policy $\rightarrow$ Razorpay Order $\rightarrow$ Webhook.
            </p>
          </div>

          <div className="p-4 bg-[#FAF8F5] border border-[#1A1A1A]/10 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="font-mono font-bold text-amber-800 px-2 py-0.5 border border-amber-600/30 bg-amber-50 text-[10px]">POST</span>
                <span className="font-mono text-[#1A1A1A] font-bold">/api/razorpay/webhook</span>
              </div>
              <span className="text-[#6C6863] font-sans text-[11px]">HMAC-SHA256</span>
            </div>
            <p className="text-[#6C6863] text-[11px] leading-relaxed font-sans">
              Validates `x-razorpay-signature` against raw payload and logs immutable audit ledger record.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

