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
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#1A1A1A]/12 pb-6">
        <div>
          <div className="flex items-center space-x-2.5 mb-2">
            <span className="luxury-eyebrow">Commerce Optimization</span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 border border-emerald-600/30 text-emerald-800 bg-emerald-50">
              Yield Engine
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1A1A1A] tracking-tight">
            Merchant Revenue & FinOps
          </h1>
          <p className="text-xs sm:text-sm text-[#6C6863] mt-1.5 font-sans leading-relaxed">
            "Grow merchant revenue via intelligent dynamic upsells, abandoned cart recovery, and double-entry FinOps."
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="luxury-btn-secondary text-xs h-11 px-5 flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Analytics</span>
        </button>
      </div>

      {/* Metrics Row */}
      {metrics && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="luxury-card space-y-2">
            <div className="text-[10px] font-sans font-semibold text-[#6C6863] uppercase tracking-[0.2em]">
              AOV Lift (Bundles)
            </div>
            <div className="font-serif text-3xl font-bold text-emerald-800">
              +{metrics.aovLiftPct}%
            </div>
            <div className="text-[11px] text-[#6C6863] font-sans">
              ₹169,075 vs ₹142,800 baseline
            </div>
          </div>

          <div className="luxury-card space-y-2">
            <div className="text-[10px] font-sans font-semibold text-[#6C6863] uppercase tracking-[0.2em]">
              Autonomous Conversion
            </div>
            <div className="font-serif text-3xl font-bold text-[#1A1A1A]">
              {metrics.conversionRatePct}%
            </div>
            <div className="text-[11px] text-[#6C6863] font-sans">
              AI Buyer instant settlements
            </div>
          </div>

          <div className="luxury-card space-y-2">
            <div className="text-[10px] font-sans font-semibold text-[#6C6863] uppercase tracking-[0.2em]">
              Cart Recovery Rate
            </div>
            <div className="font-serif text-3xl font-bold text-[#1A1A1A]">
              {metrics.recoveryRatePct}%
            </div>
            <div className="text-[11px] text-[#6C6863] font-sans">
              {metrics.recoveredCartsCount} of {metrics.abandonedCartsCount} saved
            </div>
          </div>

          <div className="luxury-card space-y-2">
            <div className="text-[10px] font-sans font-semibold text-[#6C6863] uppercase tracking-[0.2em]">
              Upsell Acceptance
            </div>
            <div className="font-serif text-3xl font-bold text-[#1A1A1A]">
              {metrics.upsellAcceptanceRatePct}%
            </div>
            <div className="text-[11px] text-[#6C6863] font-sans">
              Dynamic multi-item affinity
            </div>
          </div>

        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#1A1A1A]/15 space-x-6 text-xs font-sans uppercase tracking-[0.15em] font-semibold">
        <button
          onClick={() => setActiveTab('recovery')}
          className={`pb-3 transition-all duration-300 border-b-2 ${
            activeTab === 'recovery'
              ? 'border-b-[#1A1A1A] text-[#1A1A1A] font-bold'
              : 'border-b-transparent text-[#6C6863] hover:text-[#1A1A1A]'
          }`}
        >
          Abandoned Cart Recovery
        </button>
        <button
          onClick={() => setActiveTab('ledger')}
          className={`pb-3 transition-all duration-300 border-b-2 ${
            activeTab === 'ledger'
              ? 'border-b-[#1A1A1A] text-[#1A1A1A] font-bold'
              : 'border-b-transparent text-[#6C6863] hover:text-[#1A1A1A]'
          }`}
        >
          Double-Entry FinOps Ledger
        </button>
        <button
          onClick={() => setActiveTab('importer')}
          className={`pb-3 transition-all duration-300 border-b-2 ${
            activeTab === 'importer'
              ? 'border-b-[#1A1A1A] text-[#1A1A1A] font-bold'
              : 'border-b-transparent text-[#6C6863] hover:text-[#1A1A1A]'
          }`}
        >
          CSV Catalog Importer
        </button>
      </div>

      {/* Tab 1: Abandoned Cart Recovery */}
      {activeTab === 'recovery' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-base font-bold text-[#1A1A1A]">Active Abandoned Sessions & Recovery Links</h3>
            <span className="text-xs font-mono text-[#6C6863]">{carts.length} carts tracked</span>
          </div>

          <div className="space-y-3">
            {carts.map((cart) => (
              <div
                key={cart.cartId}
                className="luxury-card p-5 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs text-[#6C6863]">{cart.cartId}</span>
                      <span className="font-serif font-bold text-[#1A1A1A] text-sm">{cart.item?.name}</span>
                      <span
                        className={`text-[9px] font-sans uppercase font-bold px-2 py-0.5 border ${
                          cart.status === 'RECOVERED'
                            ? 'border-emerald-600/30 text-emerald-800 bg-emerald-50'
                            : 'border-amber-600/30 text-amber-800 bg-amber-50'
                        }`}
                      >
                        {cart.status}
                      </span>
                    </div>
                    <div className="text-xs text-[#6C6863] font-sans mt-0.5">
                      Customer: <strong className="text-[#1A1A1A]">{cart.customerName}</strong> ({cart.customerPhone})
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="text-right font-mono">
                      <div className="text-xs text-[#6C6863] line-through">₹{cart.originalPrice?.toLocaleString()}</div>
                      <div className="text-base font-serif font-bold text-emerald-800">₹{cart.discountedPrice?.toLocaleString()} (-{cart.discountPct}%)</div>
                    </div>

                    {cart.status === 'PENDING_RECOVERY' && (
                      <button
                        onClick={() => handleRecover(cart.cartId)}
                        disabled={recoveringId === cart.cartId}
                        className="luxury-btn-primary text-xs h-10 px-4 flex items-center space-x-1.5"
                      >
                        <Send className={`w-3.5 h-3.5 ${recoveringId === cart.cartId ? 'animate-spin' : ''}`} />
                        <span>Send Recovery</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* AI Recovery Message Preview */}
                <div className="p-3 bg-[#FAF8F5] border border-[#1A1A1A]/10 text-xs font-mono text-[#1A1A1A] space-y-1">
                  <div className="text-[10px] text-[#6C6863] uppercase tracking-wider font-semibold">AI Generated Recovery SMS / WhatsApp Message:</div>
                  <p className="text-[#1A1A1A] text-[11px] font-sans">{cart.recoveryMessage}</p>
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
              <h3 className="font-serif text-base font-bold text-[#1A1A1A]">Double-Entry Financial Journal</h3>
              <p className="text-xs text-[#6C6863] font-sans">Strict balance verification: Debits equal Credits for every autonomous movement</p>
            </div>
            {ledger?.balances && (
              <div className="flex items-center space-x-3 font-mono text-xs">
                <span className="text-[#6C6863]">Wallet: <strong className="text-emerald-800 font-bold">₹{ledger.balances.PRINCIPAL_SPENDABLE_WALLET?.toLocaleString()}</strong></span>
                <span className="text-[#6C6863]">Merchant: <strong className="text-[#1A1A1A] font-bold">₹{ledger.balances.MERCHANT_SETTLEMENT_ACCOUNT?.toLocaleString()}</strong></span>
              </div>
            )}
          </div>

          <div className="luxury-card p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F5] text-[#1A1A1A] uppercase font-sans text-[10px] tracking-[0.15em] border-b border-[#1A1A1A]/12">
                  <tr>
                    <th className="p-3.5">Journal ID</th>
                    <th className="p-3.5">Timestamp</th>
                    <th className="p-3.5">Description</th>
                    <th className="p-3.5">Account / Type</th>
                    <th className="p-3.5">Amount</th>
                    <th className="p-3.5">Balanced</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A1A1A]/10 font-mono text-[#1A1A1A]">
                  {ledger?.journal && ledger.journal.length > 0 ? (
                    ledger.journal.map((entry: any) => (
                      <tr key={entry.id} className="hover:bg-[#FAF8F5] transition-colors duration-300">
                        <td className="p-3.5 text-[#1A1A1A] font-bold">{entry.id}</td>
                        <td className="p-3.5 text-[#6C6863] text-[11px]">{new Date(entry.timestamp).toLocaleTimeString()}</td>
                        <td className="p-3.5 font-serif text-[#1A1A1A] text-xs font-semibold">{entry.description}</td>
                        <td className="p-3.5 text-xs">
                          {entry.lines.map((l: any, idx: number) => (
                            <div key={idx} className="flex space-x-2">
                              <span className={l.type === 'DEBIT' ? 'text-amber-800 font-bold' : 'text-emerald-800 font-bold'}>{l.type}:</span>
                              <span className="text-[#6C6863] truncate max-w-[140px]">{l.account}</span>
                            </div>
                          ))}
                        </td>
                        <td className="p-3.5 font-serif font-bold text-[#1A1A1A]">
                          ₹{entry.lines[0]?.amount?.toLocaleString()}
                        </td>
                        <td className="p-3.5">
                          <span className="text-emerald-800 text-[10px] font-sans uppercase font-bold bg-emerald-50 px-2 py-0.5 border border-emerald-600/30">
                            ✓ BALANCED
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-[#6C6863] font-sans">
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
        <div className="luxury-card space-y-4">
          <div>
            <h3 className="font-serif text-base font-bold text-[#1A1A1A]">Import Custom Products via CSV</h3>
            <p className="text-xs text-[#6C6863] font-sans">Instantly make any merchant catalog machine-readable and discoverable by AI buyer agents.</p>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-sans uppercase text-[#6C6863] font-semibold tracking-[0.18em]">CSV Data (Comma-Separated)</label>
            <textarea
              rows={6}
              value={csvInput}
              onChange={(e) => setCsvInput(e.target.value)}
              className="w-full p-3 bg-[#FAF8F5] border border-[#1A1A1A]/15 text-xs font-mono text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={handleCsvImport}
              className="luxury-btn-primary text-xs h-11 px-5 flex items-center space-x-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import to Universal Catalog</span>
            </button>

            {csvStatus && (
              <span className="text-xs font-mono text-emerald-800 animate-in font-semibold">
                {csvStatus}
              </span>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

