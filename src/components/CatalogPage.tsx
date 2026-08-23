import React, { useState, useEffect } from 'react';
import {
  Package,
  Search,
  Filter,
  Sparkles,
  Bot,
  FileCode,
  CheckCircle2,
  RefreshCw,
  X,
  ArrowRight,
  Store,
} from 'lucide-react';
import { ProductItem } from '../types';
import { api } from '../services/api';

interface CatalogPageProps {
  onQuickBuy: (productName: string) => void;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({ onQuickBuy }) => {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedMetaProduct, setSelectedMetaProduct] = useState<ProductItem | null>(null);

  const fetchCatalog = async () => {
    try {
      setLoading(true);
      const res = await api.getCatalog();
      setProducts(res.items);
    } catch (err) {
      console.error('Failed to load catalog:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, []);

  const categories = ['ALL', 'Athletics & Apparel', 'Electronics & Peripherals', 'Audio', 'Cloud & AI Infrastructure', 'Wearables & Health'];

  const filtered = products.filter((p) => {
    if (selectedCategory !== 'ALL' && p.category !== selectedCategory) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.merchantName.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-9 animate-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="eyebrow">Agent-ready inventory</div>
          <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.045em] text-white sm:text-4xl">Product catalog</h1>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            A machine-readable inventory designed for confident autonomous discovery and comparison.
          </p>
        </div>

        <button
          onClick={fetchCatalog}
          disabled={loading}
          className="premium-button-secondary self-start px-3.5 py-2.5 text-xs font-semibold sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Inventory</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search catalog by name, category, merchant, specs..."
            className="premium-input w-full py-3 pl-10 pr-4 text-xs sm:text-sm"
          />
        </div>

        <div className="flex space-x-1.5 overflow-x-auto rounded-xl border border-slate-400/[0.12] bg-slate-950/25 p-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-400/20 text-blue-50 shadow-[inset_0_0_0_1px_rgba(147,197,253,0.2)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((product) => {
          const isOutOfStock = product.stock <= 0;
          const aiScore = Math.round(product.rating * 20); // e.g. 4.9 -> 98%

          return (
            <div
              key={product.id}
              className="fintech-card-interactive flex flex-col justify-between space-y-4 p-5"
            >
              <div>
                {/* Badges */}
                <div className="flex justify-between items-start mb-2.5">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-slate-400 border border-white/5">
                    {product.category}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      isOutOfStock
                        ? 'bg-rose-500/15 text-rose-400 border border-rose-500/20'
                        : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                    }`}
                  >
                    {isOutOfStock ? '0 in stock (Stockout)' : `${product.stock} units`}
                  </span>
                </div>

                {/* Name & Desc */}
                <h3 className="text-sm font-bold text-white mb-1 leading-snug">
                  {product.name}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                  {product.description}
                </p>

                {/* AI Score & Merchant */}
                <div className="mb-3 flex items-center justify-between rounded-lg border border-slate-400/[0.1] bg-slate-950/25 p-2.5 text-[11px]">
                  <span className="text-slate-400 flex items-center space-x-1">
                    <Store className="w-3 h-3 text-slate-500" />
                    <span>{product.merchantName}</span>
                  </span>
                  <span className="text-[#38bdf8] font-mono font-semibold">
                    AI Match: {aiScore}%
                  </span>
                </div>

                {/* Dynamic Bundles if present */}
                {product.bundleDeals && product.bundleDeals.length > 0 && (
                  <div className="space-y-1 mb-2">
                    <div className="text-[10px] font-semibold text-purple-400 uppercase flex items-center space-x-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Dynamic Upsell Deal</span>
                    </div>
                    {product.bundleDeals.map((b, i) => (
                      <div key={i} className="text-[11px] text-slate-300 flex justify-between p-1.5 rounded bg-purple-950/20 border border-purple-500/20">
                        <span className="truncate max-w-[170px]">{b.addonName}</span>
                        <span className="font-mono text-purple-300 font-bold">-{b.bundleDiscountPct}%</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Price & Action Footer */}
              <div className="pt-3 border-t border-white/[0.05] flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-500 font-mono">AP2 Price</div>
                  <div className="text-base font-bold font-mono text-white">
                    ₹{product.price.toLocaleString()}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setSelectedMetaProduct(product)}
                    className="rounded-lg border border-slate-400/[0.12] bg-white/[0.04] p-2 text-xs text-slate-300 transition hover:bg-white/[0.09]"
                    title="View Machine-Readable JSON-LD"
                  >
                    <FileCode className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onQuickBuy(product.name)}
                    className="premium-button px-3 py-2 text-xs font-semibold"
                  >
                    Buy via Agent
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Metadata / JSON-LD Modal */}
      {selectedMetaProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-xl bg-[#0d121f] border border-white/[0.1] rounded-xl p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.07]">
              <div>
                <h3 className="text-sm font-bold text-white">UAP Machine-Readable Catalog Schema</h3>
                <p className="text-xs text-slate-400 font-mono">{selectedMetaProduct.id}</p>
              </div>
              <button
                onClick={() => setSelectedMetaProduct(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-lg bg-black/70 border border-white/5 font-mono text-[11px] text-emerald-400 overflow-x-auto max-h-96">
              <pre>{JSON.stringify(selectedMetaProduct, null, 2)}</pre>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
