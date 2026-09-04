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
        return 'border border-emerald-500/30 text-emerald-400 bg-emerald-500/10';
      case 'STEP_UP_REQUESTED':
        return 'border border-amber-500/30 text-amber-300 bg-amber-500/10';
      case 'EXECUTION_REJECTED':
      case 'FAILURE_HANDLED':
        return 'border border-rose-500/30 text-rose-400 bg-rose-500/10';
      case 'RAZORPAY_ORDER_CREATED':
      case 'QUOTE_NEGOTIATION':
        return 'border border-white/20 text-white bg-white/[0.04]';
      default:
        return 'border border-[#1F1F1F] text-zinc-400 bg-[#0D0D0D]';
    }
  };

  return (
    <div className="space-y-10 animate-in max-w-5xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#1F1F1F] pb-6">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-400 mb-2 flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
            <span>Immutable Proofs</span>
          </div>
          <h1 className="font-playfair italic text-3xl sm:text-4xl text-white tracking-tight">
            Cryptographic Audit Ledger
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1.5 font-sans leading-relaxed">
            Chronological, tamper-evident audit ledger of every prompt, policy evaluation, and Razorpay payment.
          </p>
        </div>

        <button
          onClick={fetchAudit}
          disabled={loading}
          className="btn-secondary text-xs h-11 px-5 flex items-center space-x-2 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Ledger</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center space-x-3 px-4 py-2.5 rounded-xl bg-[#0D0D0D] border border-[#1F1F1F] focus-within:border-white/40 focus-within:ring-1 focus-within:ring-white/20 transition-all max-w-md">
        <Search className="w-4 h-4 text-zinc-400 shrink-0" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter by action, actor, reasoning, or HMAC hash..."
          className="bg-transparent border-none outline-none text-xs sm:text-sm text-stone-100 placeholder:text-stone-500 w-full"
        />
      </div>

      {/* Audit Table Container */}
      <div className="card-dark p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0D0D0D] border-b border-[#1F1F1F] text-zinc-400 font-mono uppercase tracking-[0.15em] text-[10px]">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Reasoning / Decision</th>
                <th className="py-3 px-4 text-right">HMAC Signature</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F1F1F] text-stone-200 font-mono">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-stone-500 font-sans">
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
                        className="hover:bg-white/[0.02] cursor-pointer transition-colors duration-200"
                      >
                        <td className="py-3.5 px-4 text-stone-400 whitespace-nowrap text-[11px]">
                          {new Date(rec.timestamp).toLocaleTimeString()}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-0.5 text-[9px] font-mono font-semibold tracking-wider uppercase rounded ${getActionBadge(rec.action)}`}>
                            {rec.action}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-[11px] text-zinc-400">
                          {rec.agentId}
                        </td>
                        <td className="py-3.5 px-4 font-playfair italic font-bold text-white text-sm">
                          {rec.amount ? `₹${rec.amount.toLocaleString()}` : '—'}
                        </td>
                        <td className="py-3.5 px-4 max-w-sm truncate text-stone-300 font-sans text-xs">
                          {rec.reasoning}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono text-[10px] text-stone-200">
                          <span className="inline-flex items-center space-x-1 font-semibold">
                            <Lock className="w-3 h-3 text-zinc-400" />
                            <span>{rec.signature.slice(0, 8)}...</span>
                          </span>
                        </td>
                      </tr>

                      {isExpanded && (
                        <tr className="bg-[#080808]">
                          <td colSpan={6} className="p-4 border-y border-[#1F1F1F]">
                            <div className="p-4 bg-[#0A0A0A] text-stone-200 font-mono text-[11px] space-y-2 border border-[#1F1F1F] rounded-xl">
                              <div className="flex justify-between text-zinc-300 border-b border-[#1F1F1F] pb-1 font-semibold">
                                <span>Record ID: {rec.id}</span>
                                <span className="text-zinc-400">Full Signature: {rec.signature}</span>
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
