import React, { useState, useEffect } from 'react';
import {
  History,
  ShieldCheck,
  Search,
  RefreshCw,
  Lock,
  ChevronDown,
  ChevronUp,
  FileCode,
} from 'lucide-react';
import { AuditRecord } from '../types';
import { api } from '../services/api';

export const AuditTrailPage: React.FC = () => {
  const [ledger, setLedger] = useState<AuditRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchAudit = async () => {
    try {
      setLoading(true);
      const res = await api.getAuditLedger();
      setLedger(res.ledger);
    } catch (err) {
      console.error('Failed to load audit ledger:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAudit();
  }, []);

  const filtered = ledger.filter((rec) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      rec.action.toLowerCase().includes(q) ||
      rec.agentId.toLowerCase().includes(q) ||
      rec.reasoning.toLowerCase().includes(q) ||
      rec.signature.toLowerCase().includes(q)
    );
  });

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'PAYMENT_CAPTURED':
      case 'STEP_UP_APPROVED':
        return 'border border-emerald-600/30 text-emerald-800 bg-emerald-50';
      case 'STEP_UP_REQUESTED':
        return 'border border-amber-600/30 text-amber-800 bg-amber-50';
      case 'EXECUTION_REJECTED':
      case 'FAILURE_HANDLED':
        return 'border border-rose-600/30 text-rose-800 bg-rose-50';
      case 'RAZORPAY_ORDER_CREATED':
      case 'QUOTE_NEGOTIATION':
        return 'border border-[#1A1A1A]/30 text-[#1A1A1A] bg-[#FAF8F5]';
      default:
        return 'border border-[#1A1A1A]/15 text-[#6C6863] bg-[#FAF8F5]';
    }
  };

  return (
    <div className="space-y-10 animate-in max-w-5xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#1A1A1A]/12 pb-6">
        <div>
          <div className="luxury-eyebrow mb-2">Immutable Proofs</div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1A1A1A] tracking-tight">
            Cryptographic Audit Ledger
          </h1>
          <p className="text-xs sm:text-sm text-[#6C6863] mt-1.5 font-sans leading-relaxed">
            Chronological, tamper-evident audit ledger of every prompt, policy evaluation, and Razorpay payment.
          </p>
        </div>

        <button
          onClick={fetchAudit}
          disabled={loading}
          className="luxury-btn-secondary text-xs h-11 px-5 flex items-center space-x-2 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Ledger</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="luxury-input-wrapper max-w-md">
        <Search className="w-4 h-4 text-[#D4AF37] shrink-0" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter by action, actor, reasoning, or HMAC hash..."
          className="luxury-input text-xs sm:text-sm"
        />
      </div>

      {/* Audit Table Container */}
      <div className="luxury-card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] border-b border-[#1A1A1A]/12 text-[#1A1A1A] font-sans uppercase tracking-[0.15em] text-[10px]">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Reasoning / Decision</th>
                <th className="py-3 px-4 text-right">HMAC Signature</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1A1A]/10 text-[#1A1A1A]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#6C6863] font-sans">
                    No records found matching your query.
                  </td>
                </tr>
              ) : (
                filtered.map((rec) => {
                  const isExpanded = expandedId === rec.id;
                  return (
                    <React.Fragment key={rec.id}>
                      <tr
                        onClick={() => setExpandedId(isExpanded ? null : rec.id)}
                        className="hover:bg-[#FAF8F5] cursor-pointer transition-colors duration-300"
                      >
                        <td className="py-3.5 px-4 font-mono text-[#6C6863] whitespace-nowrap text-[11px]">
                          {new Date(rec.timestamp).toLocaleTimeString()}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-0.5 text-[9px] font-sans font-semibold tracking-wider uppercase ${getActionBadge(rec.action)}`}>
                            {rec.action}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px] text-[#6C6863]">
                          {rec.agentId}
                        </td>
                        <td className="py-3.5 px-4 font-serif font-bold text-[#1A1A1A]">
                          {rec.amount ? `₹${rec.amount.toLocaleString()}` : '—'}
                        </td>
                        <td className="py-3.5 px-4 max-w-sm truncate text-[#6C6863] font-sans">
                          {rec.reasoning}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono text-[10px] text-[#1A1A1A]">
                          <span className="inline-flex items-center space-x-1 font-semibold">
                            <Lock className="w-3 h-3 text-[#D4AF37]" />
                            <span>{rec.signature.slice(0, 8)}...</span>
                          </span>
                        </td>
                      </tr>

                      {isExpanded && (
                        <tr className="bg-[#FAF8F5]">
                          <td colSpan={6} className="p-4 border-y border-[#1A1A1A]/10">
                            <div className="p-4 bg-[#1A1A1A] text-[#F9F8F6] font-mono text-[11px] space-y-2 border border-[#1A1A1A]">
                              <div className="flex justify-between text-[#D4AF37] border-b border-white/10 pb-1 font-semibold">
                                <span>Record ID: {rec.id}</span>
                                <span>Full Signature: {rec.signature}</span>
                              </div>
                              <div className="text-emerald-400 overflow-x-auto max-h-40">
                                <pre>{JSON.stringify(rec.details, null, 2)}</pre>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

