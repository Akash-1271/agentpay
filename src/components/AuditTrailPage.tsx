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
        return 'bg-emerald-500/15 text-emerald-400';
      case 'STEP_UP_REQUESTED':
        return 'bg-amber-500/15 text-amber-400';
      case 'EXECUTION_REJECTED':
      case 'FAILURE_HANDLED':
        return 'bg-rose-500/15 text-rose-400';
      case 'RAZORPAY_ORDER_CREATED':
      case 'QUOTE_NEGOTIATION':
        return 'bg-blue-500/15 text-[#38bdf8]';
      default:
        return 'bg-white/5 text-slate-300';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Cryptographic Audit Trail</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Chronological, tamper-evident audit ledger of every prompt, policy evaluation, and Razorpay payment.
          </p>
        </div>

        <button
          onClick={fetchAudit}
          disabled={loading}
          className="px-3.5 py-2 bg-[#0d121f] hover:bg-[#121828] border border-white/[0.08] text-xs font-semibold text-slate-300 rounded-lg flex items-center space-x-2 transition-all self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Ledger</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter by action, actor, reasoning, or HMAC hash..."
          className="w-full pl-10 pr-4 py-2.5 bg-[#0d121f] border border-white/[0.07] rounded-lg text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#0c83ff]"
        />
      </div>

      {/* Audit Table */}
      <div className="fintech-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#090d16] border-b border-white/[0.07] text-slate-400 font-mono">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Reasoning / Decision</th>
                <th className="py-3 px-4 text-right">HMAC Signature</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-slate-300">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
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
                        className="hover:bg-white/[0.02] cursor-pointer transition-colors"
                      >
                        <td className="py-3.5 px-4 font-mono text-slate-400 whitespace-nowrap text-[11px]">
                          {new Date(rec.timestamp).toLocaleTimeString()}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded ${getActionBadge(rec.action)}`}>
                            {rec.action}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                          {rec.agentId}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-white">
                          {rec.amount ? `₹${rec.amount.toLocaleString()}` : '—'}
                        </td>
                        <td className="py-3.5 px-4 max-w-sm truncate text-slate-300">
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
                        <tr className="bg-[#090d16]">
                          <td colSpan={6} className="p-4 border-y border-white/[0.08]">
                            <div className="p-3 rounded-lg bg-black/60 border border-white/5 font-mono text-[11px] space-y-2">
                              <div className="flex justify-between text-slate-400">
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
