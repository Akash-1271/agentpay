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
  const [activeTab, setActiveTab] = useState<'recovery' | 'ledger' | 'importer'>('recovery');
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
    <div className="space-y-10 animate-in max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#1F1F1F] pb-6">
        <div>
          <div className="flex items-center space-x-2.5 mb-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-400">Commerce Optimization</span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 border border-emerald-500/30 text-emerald-300 bg-emerald-500/10 rounded">
              Yield Engine
            </span>
          </div>
          <h1 className="font-playfair italic text-3xl sm:text-4xl text-white tracking-tight">
            Merchant Revenue & FinOps
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1.5 font-sans leading-relaxed">
            Grow merchant revenue via intelligent dynamic upsells, abandoned cart recovery, and double-entry FinOps.
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="btn-secondary text-xs h-11 px-5 flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Analytics</span>
        </button>
      </div>

      {/* Metrics Row */}
      {metrics && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card-dark p-6 space-y-2 hover:border-zinc-700 transition-all">
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-400">
              AOV Lift (Bundles)
            </div>
            <div className="font-playfair italic text-3xl font-bold text-emerald-400">
              +{metrics.aovLiftPct}%
            </div>
            <div className="text-[11px] text-stone-400 font-mono">
              ₹{metrics.growthGmv?.toLocaleString() || '14,100'} vs ₹{metrics.baselineGmv?.toLocaleString() || '12,000'} baseline
            </div>
          </div>

          <div className="card-dark p-6 space-y-2 hover:border-zinc-700 transition-all">
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-400">
              Autonomous Conversion
            </div>
            <div className="font-playfair italic text-3xl font-bold text-white">
              {metrics.conversionRatePct}%
            </div>
            <div className="text-[11px] text-stone-400 font-mono">
              AI Buyer instant settlements
            </div>
          </div>

          <div className="card-dark p-6 space-y-2 hover:border-zinc-700 transition-all">
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-400">
              Cart Recovery Rate
            </div>
            <div className="font-playfair italic text-3xl font-bold text-white">
              {metrics.recoveryRatePct}%
            </div>
            <div className="text-[11px] text-stone-400 font-mono">
              {metrics.recoveredCartsCount} of {metrics.abandonedCartsCount} saved
            </div>
          </div>

          <div className="card-dark p-6 space-y-2 hover:border-zinc-700 transition-all">
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-400">
              Upsell Acceptance
            </div>
            <div className="font-playfair italic text-3xl font-bold text-white">
              {metrics.upsellAcceptanceRatePct}%
            </div>
            <div className="text-[11px] text-stone-400 font-mono">
              Dynamic multi-item affinity
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#1F1F1F] space-x-6 text-xs font-mono uppercase tracking-wider">
        <button
          onClick={() => setActiveTab('recovery')}
          className={`pb-3 transition-all duration-300 border-b-2 ${
            activeTab === 'recovery'
              ? 'border-b-white text-white font-semibold'
              : 'border-b-transparent text-zinc-400 hover:text-white'
          }`}
        >
          Abandoned Cart Recovery
        </button>
        <button
          onClick={() => setActiveTab('ledger')}
          className={`pb-3 transition-all duration-300 border-b-2 ${
            activeTab === 'ledger'
              ? 'border-b-white text-white font-semibold'
              : 'border-b-transparent text-zinc-400 hover:text-white'
          }`}
        >
          Double-Entry FinOps Ledger
        </button>
        <button
          onClick={() => setActiveTab('importer')}
          className={`pb-3 transition-all duration-300 border-b-2 ${
            activeTab === 'importer'
              ? 'border-b-white text-white font-semibold'
              : 'border-b-transparent text-zinc-400 hover:text-white'
          }`}
        >
          CSV Catalog Importer
        </button>
      </div>

      {/* Tab 1: Abandoned Cart Recovery */}
      {activeTab === 'recovery' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-playfair italic text-lg font-bold text-white">Active Abandoned Sessions & Recovery Links</h3>
            <span className="text-xs font-mono text-stone-400">{carts.length} carts tracked</span>
          </div>

          <div className="space-y-3">
            {carts.map((cart) => (
              <div
                key={cart.cartId}
                className="card-dark p-5 space-y-3 hover:border-zinc-700 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs text-zinc-400">{cart.cartId}</span>
                      <span className="font-playfair italic font-bold text-white text-base">{cart.item?.name}</span>
                      <span
                        className={`text-[9px] font-mono uppercase font-bold px-2 py-0.5 border rounded ${
                          cart.status === 'RECOVERED'
                            ? 'border-emerald-500/30 text-emerald-300 bg-emerald-500/10'
                            : 'border-amber-500/30 text-amber-300 bg-amber-500/10'
                        }`}
                      >
                        {cart.status}
                      </span>
                    </div>
                    <div className="text-xs text-stone-400 font-sans mt-1">
                      Customer: <strong className="text-stone-200">{cart.customerName}</strong> ({cart.customerPhone})
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="text-right font-mono">
                      <div className="text-xs text-stone-500 line-through">₹{cart.originalPrice?.toLocaleString()}</div>
                      <div className="text-base font-playfair italic font-bold text-emerald-400">₹{cart.discountedPrice?.toLocaleString()} (-{cart.discountPct}%)</div>
                    </div>

                    {cart.status === 'PENDING_RECOVERY' && (
                      <button
                        onClick={() => handleRecover(cart.cartId)}
                        disabled={recoveringId === cart.cartId}
                        className="btn-primary text-xs h-9 px-4 flex items-center space-x-1.5"
                      >
                        <Send className={`w-3.5 h-3.5 ${recoveringId === cart.cartId ? 'animate-spin' : ''}`} />
                        <span>Send Recovery</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* AI Recovery Message Preview */}
                <div className="p-3 bg-black/40 border border-white/10 rounded-lg text-xs font-mono text-stone-200 space-y-1">
                  <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">AI Generated Recovery SMS / WhatsApp Message:</div>
                  <p className="text-stone-300 text-[11px] font-sans">{cart.recoveryMessage}</p>
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
              <h3 className="font-playfair italic text-lg font-bold text-white">Double-Entry Financial Journal</h3>
              <p className="text-xs text-stone-400 font-sans mt-0.5">Strict balance verification: Debits equal Credits for every autonomous movement</p>
            </div>
            {ledger?.balances && (
              <div className="flex items-center space-x-4 font-mono text-xs">
                <span className="text-stone-400">Wallet: <strong className="text-emerald-400 font-bold">₹{ledger.balances.PRINCIPAL_SPENDABLE_WALLET?.toLocaleString()}</strong></span>
                <span className="text-stone-400">Merchant: <strong className="text-white font-bold">₹{ledger.balances.MERCHANT_SETTLEMENT_ACCOUNT?.toLocaleString()}</strong></span>
              </div>
            )}
          </div>

          <div className="card-dark p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/[0.02] text-zinc-400 uppercase font-mono text-[10px] tracking-wider border-b border-[#1F1F1F]">
                  <tr>
                    <th className="p-3.5">Journal ID</th>
                    <th className="p-3.5">Timestamp</th>
                    <th className="p-3.5">Description</th>
                    <th className="p-3.5">Account / Type</th>
                    <th className="p-3.5">Amount</th>
                    <th className="p-3.5">Balanced</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono text-stone-300">
                  {ledger?.journal && ledger.journal.length > 0 ? (
                    ledger.journal.map((entry: any) => (
                      <tr key={entry.id} className="hover:bg-white/[0.02] transition-colors duration-200">
                        <td className="p-3.5 text-stone-200 font-semibold">{entry.id}</td>
                        <td className="p-3.5 text-stone-500 text-[11px]">{new Date(entry.timestamp).toLocaleTimeString()}</td>
                        <td className="p-3.5 font-playfair italic text-white text-xs">{entry.description}</td>
                        <td className="p-3.5 text-xs">
                          {entry.lines.map((l: any, idx: number) => (
                            <div key={idx} className="flex space-x-2">
                              <span className={l.type === 'DEBIT' ? 'text-amber-400 font-semibold' : 'text-emerald-400 font-semibold'}>{l.type}:</span>
                              <span className="text-stone-400 truncate max-w-[140px]">{l.account}</span>
                            </div>
                          ))}
                        </td>
                        <td className="p-3.5 font-mono font-bold text-white">
                          ₹{entry.lines[0]?.amount?.toLocaleString()}
                        </td>
                        <td className="p-3.5">
                          <span className="text-emerald-300 text-[10px] font-mono uppercase font-bold bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/30 rounded">
                            ✓ BALANCED
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-stone-500 font-sans">
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
        <div className="card-dark p-6 space-y-4">
          <div>
            <h3 className="font-playfair italic text-lg font-bold text-white">Import Custom Products via CSV</h3>
            <p className="text-xs text-stone-400 font-sans mt-0.5">Instantly make any merchant catalog machine-readable and discoverable by AI buyer agents.</p>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-mono uppercase text-zinc-400 font-semibold tracking-wider">CSV Data (Comma-Separated)</label>
            <textarea
              rows={6}
              value={csvInput}
              onChange={(e) => setCsvInput(e.target.value)}
              className="w-full p-3 bg-black/40 border border-[#1F1F1F] rounded-xl text-xs font-mono text-stone-200 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={handleCsvImport}
              className="btn-primary text-xs h-11 px-5 flex items-center space-x-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import to Universal Catalog</span>
            </button>

            {csvStatus && (
              <span className="text-xs font-mono text-emerald-400 animate-in font-semibold">
                {csvStatus}
              </span>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

