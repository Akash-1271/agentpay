import React, { useState, useEffect } from 'react';
import { History, ShieldCheck, Search, Filter, RefreshCw, ChevronDown, ChevronUp, Lock, FileText } from 'lucide-react';
import { AuditRecord } from '../types';
import { api } from '../services/api';

export const AuditInspector: React.FC = () => {
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

  const filteredLedger = ledger.filter((rec) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      rec.action.toLowerCase().includes(q) ||
      rec.agentId.toLowerCase().includes(q) ||
      rec.reasoning.toLowerCase().includes(q) ||
      rec.signature.toLowerCase().includes(q)
    );
  });

  const getActionBadgeClass = (action: string) => {
    switch (action) {
      case 'PAYMENT_CAPTURED':
      case 'STEP_UP_APPROVED':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'STEP_UP_REQUESTED':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'EXECUTION_REJECTED':
      case 'FAILURE_HANDLED':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      case 'RAZORPAY_ORDER_CREATED':
      case 'QUOTE_NEGOTIATION':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="card-dark p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-[#1F1F1F]">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/15 text-zinc-300 text-xs font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Immutable Explainability Trail</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            Cryptographic Fin-Ops Audit Ledger
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            Every prompt, discount negotiation, bounded policy gate, Razorpay order, and settlement webhook is signed and verifiable.
          </p>
        </div>

        <button
          onClick={fetchAudit}
          disabled={loading}
          className="btn-secondary px-4 py-2.5 rounded-xl text-xs font-bold text-zinc-200 flex items-center space-x-2 transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Audit Logs</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="card-dark p-4 flex items-center space-x-3">
        <Search className="w-4 h-4 text-zinc-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter by action, agent, reasoning, or HMAC hash..."
          className="w-full bg-transparent border-none text-xs sm:text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none"
        />
      </div>

      {/* Audit Table / Stream */}
      <div className="card-dark overflow-hidden border-[#1F1F1F]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0D0D0D] border-b border-[#1F1F1F] text-zinc-400 font-mono">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Agent Actor</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Reasoning / Explanation</th>
                <th className="py-3 px-4 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F1F1F] text-zinc-300">
              {filteredLedger.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-zinc-500">
                    No audit records match your query.
                  </td>
                </tr>
              ) : (
                filteredLedger.map((rec) => {
                  const isExpanded = expandedId === rec.id;
                  return (
                    <React.Fragment key={rec.id}>
                      <tr
                        onClick={() => setExpandedId(isExpanded ? null : rec.id)}
                        className="hover:bg-white/[0.02] cursor-pointer transition-colors"
                      >
                        <td className="py-3.5 px-4 font-mono text-[11px] text-zinc-400 whitespace-nowrap">
                          {new Date(rec.timestamp).toLocaleTimeString()}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded border ${getActionBadgeClass(
                              rec.action
                            )}`}
                          >
                            {rec.action}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px] text-zinc-400">
                          {rec.agentId}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-zinc-200">
                          {rec.amount ? `₹${rec.amount.toLocaleString()}` : '—'}
                        </td>
                        <td className="py-3.5 px-4 max-w-xs sm:max-w-md truncate text-zinc-300">
                          {rec.reasoning}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono text-[10px] text-emerald-400">
                          <span className="inline-flex items-center space-x-1">
                            <Lock className="w-3 h-3" />
                            <span>{rec.signature.slice(0, 8)}...</span>
                          </span>
                        </td>
                      </tr>

                      {isExpanded && (
                        <tr className="bg-black/50">
                          <td colSpan={6} className="p-4 border-y border-[#1F1F1F]">
                            <div className="p-3 rounded-lg bg-[#080808] border border-[#1F1F1F] font-mono text-[11px] space-y-2">
                              <div className="flex justify-between text-zinc-400">
                                <span>Record ID: {rec.id}</span>
                                <span>Full Signature: {rec.signature}</span>
                              </div>
                              <div className="text-emerald-400/90 overflow-x-auto max-h-40">
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
