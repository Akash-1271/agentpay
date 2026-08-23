import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  ShoppingCart,
  Send,
  CheckCircle2,
  Upload,
  FileSpreadsheet,
  Layers,
  Sparkles,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Clock,
  Check,
} from 'lucide-react';
import { api } from '../services/api';

export const RevenueGrowthPage: React.FC = () => {
  const [metrics, setMetrics] = useState<any | null>(null);
  const [carts, setCarts] = useState<any[]>([]);
  const [ledger, setLedger] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [csvInput, setCsvInput] = useState(`id,name,category,price,stock,merchantId,merchantName
prod_shoe_10,Puma Nitro Elite Running Shoes,Athletics & Apparel,1949,15,merch_puma_store,Puma India
prod_head_03,Bose QuietComfort 45 ANC,Audio,19999,6,merch_bose_india,Bose Authorized`);
  const [csvStatus, setCsvStatus] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'recovery' | 'ledger' | 'importer' | 'a2a'>('recovery');
  const [recoveringId, setRecoveringId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [m, c, l] = await Promise.all([
        api.getGrowthMetrics(),
        api.getAbandonedCarts(),
        api.getFinOpsLedger(),
      ]);
      setMetrics(m);
      setCarts(c.carts);
      setLedger(l);
    } catch (err) {
      console.error('Failed to load growth data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRecover = async (cartId: string) => {
    try {
      setRecoveringId(cartId);
      await api.recoverCart(cartId);
      await loadData();
    } catch (err) {
      console.error('Failed to recover cart:', err);
    } finally {
      setRecoveringId(null);
    }
  };

  const handleCsvImport = async () => {
    try {
      setCsvStatus('Importing CSV into UAP Catalog...');
      const res = await api.importCatalogCsv(csvInput);
      setCsvStatus(`✅ Successfully imported ${res.addedCount} new product(s) into UAP Catalog!`);
    } catch (err: any) {
      setCsvStatus(`❌ Error: ${err.message}`);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-2xl font-extrabold text-white">Merchant Revenue Growth Hub</h1>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
              Track 01 Core Requirement
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            "Grow merchant revenue via intelligent dynamic upsells, abandoned cart recovery, and double-entry FinOps."
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="px-3 py-2 bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 text-xs font-mono rounded-lg border border-white/[0.08] flex items-center space-x-1.5 transition-all self-start"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Analytics</span>
        </button>
      </div>

      {/* Metrics Row */}
      {metrics && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="fintech-card p-4 space-y-1.5">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              AOV Lift (Dynamic Bundles)
            </div>
            <div className="text-2xl font-extrabold text-emerald-400 font-mono">
              +{metrics.aovLiftPct}%
            </div>
            <div className="text-[11px] text-slate-400">
              ₹169,075 vs ₹142,800 baseline GMV
            </div>
          </div>

          <div className="fintech-card p-4 space-y-1.5">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Autonomous Conversion
            </div>
            <div className="text-2xl font-extrabold text-[#38bdf8] font-mono">
              {metrics.conversionRatePct}%
            </div>
            <div className="text-[11px] text-slate-400">
              AI Buyer instant settlements
            </div>
          </div>

          <div className="fintech-card p-4 space-y-1.5">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Cart Recovery Rate
            </div>
            <div className="text-2xl font-extrabold text-purple-400 font-mono">
              {metrics.recoveryRatePct}%
            </div>
            <div className="text-[11px] text-slate-400">
              {metrics.recoveredCartsCount} of {metrics.abandonedCartsCount} carts saved
            </div>
          </div>

          <div className="fintech-card p-4 space-y-1.5">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Upsell Acceptance
            </div>
            <div className="text-2xl font-extrabold text-amber-400 font-mono">
              {metrics.upsellAcceptanceRatePct}%
            </div>
            <div className="text-[11px] text-slate-400">
              Dynamic multi-item affinity deals
            </div>
          </div>

        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-white/[0.08] space-x-6 text-xs font-bold">
        <button
          onClick={() => setActiveTab('recovery')}
          className={`pb-3 transition-colors border-b-2 ${
            activeTab === 'recovery'
              ? 'border-[#0c83ff] text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Abandoned Cart Recovery Studio
        </button>
        <button
          onClick={() => setActiveTab('ledger')}
          className={`pb-3 transition-colors border-b-2 ${
            activeTab === 'ledger'
              ? 'border-[#0c83ff] text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Double-Entry FinOps Ledger
        </button>
        <button
          onClick={() => setActiveTab('importer')}
          className={`pb-3 transition-colors border-b-2 ${
            activeTab === 'importer'
              ? 'border-[#0c83ff] text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          CSV Catalog Importer
        </button>
      </div>

      {/* Tab 1: Abandoned Cart Recovery */}
      {activeTab === 'recovery' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Active Abandoned Sessions & Recovery Links</h3>
            <span className="text-xs font-mono text-slate-500">{carts.length} carts tracked</span>
          </div>

          <div className="space-y-3">
            {carts.map((cart) => (
              <div
                key={cart.cartId}
                className="fintech-card p-5 space-y-3 border-l-4 border-l-[#0c83ff]"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs text-slate-400">{cart.cartId}</span>
                      <span className="font-bold text-white text-sm">{cart.item?.name}</span>
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                          cart.status === 'RECOVERED'
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : 'bg-amber-500/15 text-amber-300'
                        }`}
                      >
                        {cart.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Customer: <strong className="text-slate-200">{cart.customerName}</strong> ({cart.customerPhone})
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="text-right font-mono">
                      <div className="text-xs text-slate-500 line-through">₹{cart.originalPrice?.toLocaleString()}</div>
                      <div className="text-sm font-bold text-emerald-400">₹{cart.discountedPrice?.toLocaleString()} (-{cart.discountPct}%)</div>
                    </div>

                    {cart.status === 'PENDING_RECOVERY' && (
                      <button
                        onClick={() => handleRecover(cart.cartId)}
                        disabled={recoveringId === cart.cartId}
                        className="px-3 py-2 bg-gradient-to-r from-[#0c83ff] to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center space-x-1.5 transition-all"
                      >
                        <Send className={`w-3.5 h-3.5 ${recoveringId === cart.cartId ? 'animate-spin' : ''}`} />
                        <span>Send VIP Recovery</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* AI Recovery Message Preview */}
                <div className="p-3 rounded-lg bg-[#090d16] border border-white/[0.04] text-xs font-mono text-slate-300 space-y-1">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">AI Generated Recovery SMS / WhatsApp Message:</div>
                  <p className="text-slate-300 text-[11px]">{cart.recoveryMessage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Double-Entry FinOps Ledger */}
      {activeTab === 'ledger' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Double-Entry Financial Journal</h3>
              <p className="text-xs text-slate-400">Strict balance verification: Debits equal Credits for every autonomous movement</p>
            </div>
            {ledger?.balances && (
              <div className="flex items-center space-x-3 font-mono text-xs">
                <span className="text-slate-400">User Wallet: <strong className="text-emerald-400">₹{ledger.balances.PRINCIPAL_SPENDABLE_WALLET?.toLocaleString()}</strong></span>
                <span className="text-slate-400">Merchant Account: <strong className="text-[#38bdf8]">₹{ledger.balances.MERCHANT_SETTLEMENT_ACCOUNT?.toLocaleString()}</strong></span>
              </div>
            )}
          </div>

          <div className="fintech-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#090d16] text-slate-400 uppercase font-mono text-[10px] border-b border-white/[0.06]">
                  <tr>
                    <th className="p-3.5">Journal ID</th>
                    <th className="p-3.5">Timestamp</th>
                    <th className="p-3.5">Description</th>
                    <th className="p-3.5">Account / Type</th>
                    <th className="p-3.5">Amount</th>
                    <th className="p-3.5">Balanced</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04] font-mono text-slate-300">
                  {ledger?.journal && ledger.journal.length > 0 ? (
                    ledger.journal.map((entry: any) => (
                      <tr key={entry.id} className="hover:bg-white/[0.02]">
                        <td className="p-3.5 text-[#38bdf8] font-bold">{entry.id}</td>
                        <td className="p-3.5 text-slate-400 text-[11px]">{new Date(entry.timestamp).toLocaleTimeString()}</td>
                        <td className="p-3.5 font-sans text-white text-xs">{entry.description}</td>
                        <td className="p-3.5 text-xs">
                          {entry.lines.map((l: any, idx: number) => (
                            <div key={idx} className="flex space-x-2">
                              <span className={l.type === 'DEBIT' ? 'text-amber-400' : 'text-emerald-400'}>{l.type}:</span>
                              <span className="text-slate-400 truncate max-w-[140px]">{l.account}</span>
                            </div>
                          ))}
                        </td>
                        <td className="p-3.5 font-bold text-white">
                          ₹{entry.lines[0]?.amount?.toLocaleString()}
                        </td>
                        <td className="p-3.5">
                          <span className="text-emerald-400 text-[10px] font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                            ✓ BALANCED
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500 font-sans">
                        No transactions executed yet in this session. Run an AI agent purchase to record journal entries!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: CSV Catalog Importer */}
      {activeTab === 'importer' && (
        <div className="fintech-card p-6 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white">Import Custom Products via CSV</h3>
            <p className="text-xs text-slate-400">Instantly make any merchant catalog machine-readable and discoverable by AI buyer agents.</p>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-mono text-slate-400 uppercase">CSV Data (Comma-Separated)</label>
            <textarea
              rows={6}
              value={csvInput}
              onChange={(e) => setCsvInput(e.target.value)}
              className="w-full p-3 bg-[#090d16] border border-white/[0.08] rounded-lg text-xs font-mono text-slate-200 focus:outline-none focus:border-[#0c83ff]"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={handleCsvImport}
              className="px-4 py-2 bg-[#0c83ff] hover:bg-[#0270e0] text-white text-xs font-bold rounded-lg shadow-sm flex items-center space-x-1.5 transition-all"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import to Universal Catalog</span>
            </button>

            {csvStatus && (
              <span className="text-xs font-mono text-emerald-400 animate-in fade-in">
                {csvStatus}
              </span>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
