import React, { useState, useEffect } from 'react';
import { Store, Package, TrendingUp, Sparkles, Tag, Plus, Check, RefreshCw } from 'lucide-react';
import { ProductItem } from '../types';
import { api } from '../services/api';

interface MerchantHubProps {
  onQuickBuyProduct: (productName: string) => void;
}

export const MerchantHub: React.FC<MerchantHubProps> = ({ onQuickBuyProduct }) => {
  const [catalog, setCatalog] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);

  const fetchCatalog = async () => {
    try {
      setLoading(true);
      const data = await api.getCatalog();
      setCatalog(data.items);
      if (data.items.length > 0 && !selectedProduct) {
        setSelectedProduct(data.items[0]);
      }
    } catch (err) {
      console.error('Failed to load catalog:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-purple-500/20">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-3">
            <Store className="w-3.5 h-3.5" />
            <span>Merchant Yield & Catalog Engine</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            UAP Machine-Readable Catalog & Revenue Maximizer
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Expose structured JSON-LD specifications to AI buyer agents and automate dynamic bundle upsells to increase GMV.
          </p>
        </div>

        <button
          onClick={fetchCatalog}
          disabled={loading}
          className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-slate-300 flex items-center space-x-2 transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Inventory</span>
        </button>
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {catalog.map((product) => {
          const isSelected = selectedProduct?.id === product.id;
          const isOutOfStock = product.stock <= 0;

          return (
            <div
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              className={`glass-panel-interactive p-5 flex flex-col justify-between cursor-pointer ${
                isSelected ? 'border-purple-500/60 ring-2 ring-purple-500/20' : ''
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/5">
                    {product.category}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      isOutOfStock
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {isOutOfStock ? '0 in stock (Stockout)' : `${product.stock} units left`}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white line-clamp-1 mb-1">
                  {product.name}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                  {product.description}
                </p>

                {/* Specs Pill List */}
                <div className="space-y-1 mb-4 p-2.5 rounded-lg bg-black/40 border border-white/5 text-[11px]">
                  {Object.entries(product.specifications).slice(0, 2).map(([k, v]) => (
                    <div key={k} className="flex justify-between text-slate-400">
                      <span className="capitalize">{k}:</span>
                      <span className="font-mono text-slate-200 truncate max-w-[140px]">{v}</span>
                    </div>
                  ))}
                </div>

                {/* Bundle Deals Pill */}
                {product.bundleDeals && product.bundleDeals.length > 0 && (
                  <div className="mb-4">
                    <div className="text-[10px] font-semibold uppercase text-purple-400 flex items-center space-x-1 mb-1.5">
                      <Sparkles className="w-3 h-3" />
                      <span>Dynamic Upsell Bundle Available</span>
                    </div>
                    <div className="space-y-1">
                      {product.bundleDeals.map((deal, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center text-[11px] px-2 py-1 rounded bg-purple-950/20 border border-purple-500/20 text-purple-200"
                        >
                          <span className="truncate max-w-[160px]">{deal.addonName}</span>
                          <span className="font-mono font-bold">-{deal.bundleDiscountPct}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between mt-2">
                <div>
                  <div className="text-[10px] text-slate-500">Price (AP2 Listed)</div>
                  <div className="text-base font-extrabold font-mono text-white">
                    ₹{product.price.toLocaleString()}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onQuickBuyProduct(product.name);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#0c83ff]/20 hover:bg-[#0c83ff]/30 text-[#38bdf8] border border-[#0c83ff]/40 text-xs font-semibold transition-all"
                >
                  Prompt Agent to Buy
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
