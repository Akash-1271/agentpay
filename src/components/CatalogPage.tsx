import React, { useState, useEffect } from 'react';
import {
  Package,
  Search,
  Sparkles,
  FileCode,
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

const PRODUCT_IMAGE_MAP: Record<string, string> = {
  prod_kb_01: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=800&auto=format&fit=crop',
  prod_audio_02: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop',
  prod_mouse_03: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=800&auto=format&fit=crop',
  prod_saas_04: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop',
  prod_gadget_05: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop',
  prod_hub_06: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?q=80&w=800&auto=format&fit=crop',
  prod_shoe_07: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop',
  prod_shoe_08: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=800&auto=format&fit=crop',
  prod_shoe_09: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=800&auto=format&fit=crop',
};

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop';

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
    <div className="space-y-10 animate-in">
      {/* Editorial Catalog Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#c9b8a0] mb-2 flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#a78b71] animate-pulse"></span>
            <span>Curated Machine-Readable Inventory</span>
          </div>
          <h1 className="font-playfair italic text-3xl sm:text-4xl text-white tracking-tight">
            Merchant Catalog & Lookbook
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1.5 font-sans leading-relaxed">
            Machine-readable inventory structured for autonomous discovery, bundle yield incentives, and instant Razorpay AP2 execution.
          </p>
        </div>

        <button
          onClick={fetchCatalog}
          disabled={loading}
          className="btn-gold-secondary self-start text-xs h-11 px-5 sm:self-auto flex items-center space-x-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Inventory</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        <div className="flex items-center space-x-3 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 focus-within:border-[#a78b71]/50 focus-within:ring-2 focus-within:ring-[#a78b71]/20 transition-all flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#c9b8a0] shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search catalog by item, merchant, tags..."
            className="bg-transparent border-none outline-none text-xs sm:text-sm text-stone-100 placeholder:text-stone-500 w-full"
          />
        </div>

        <div className="flex space-x-1.5 overflow-x-auto border-b border-white/10 pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-mono tracking-wider uppercase whitespace-nowrap transition-all duration-300 border-b-2 ${
                selectedCategory === cat
                  ? 'border-b-[#c9b8a0] text-[#e8d5b7] font-semibold'
                  : 'border-b-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Luxury Glass Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((product) => {
          const isOutOfStock = product.stock <= 0;
          const aiScore = Math.round(product.rating * 20);
          const imgSrc = PRODUCT_IMAGE_MAP[product.id] || DEFAULT_IMAGE;

          return (
            <div
              key={product.id}
              className="glass-gold group flex flex-col justify-between p-0 overflow-hidden hover:border-[#a78b71]/40 transition-all duration-300 hover:shadow-[0_0_40px_rgba(167,139,113,0.12)]"
            >
              {/* Product Image Frame */}
              <div className="relative aspect-[4/3] overflow-hidden bg-black/40 border-b border-white/10">
                <img
                  src={imgSrc}
                  alt={product.name}
                  className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                />
                
                {/* Category & Stock Floating Tags */}
                <div className="absolute top-3 left-3 right-3 flex justify-between items-start pointer-events-none">
                  <span className="text-[9px] font-mono font-semibold uppercase tracking-[0.2em] px-2.5 py-1 bg-black/80 text-[#c9b8a0] border border-white/10 backdrop-blur-md rounded-md">
                    {product.category}
                  </span>
                  <span
                    className={`text-[9px] font-mono font-bold px-2 py-0.5 border backdrop-blur-md rounded-md ${
                      isOutOfStock
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    }`}
                  >
                    {isOutOfStock ? '0 (Out of stock)' : `${product.stock} in stock`}
                  </span>
                </div>
              </div>

              {/* Product Details Area */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="font-playfair italic text-lg font-semibold text-white leading-snug tracking-tight group-hover:text-[#e8d5b7] transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed font-sans">
                    {product.description}
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  {/* Store & Match Meta */}
                  <div className="flex items-center justify-between border-t border-b border-white/10 py-2.5 text-[11px] font-sans">
                    <span className="text-stone-400 flex items-center space-x-1.5">
                      <Store className="w-3.5 h-3.5 text-[#c9b8a0] shrink-0" />
                      <span className="text-stone-200 font-medium">{product.merchantName}</span>
                    </span>
                    <span className="text-[#c9b8a0] font-mono font-semibold">
                      Match: {aiScore}%
                    </span>
                  </div>

                  {/* Dynamic Bundles if present */}
                  {product.bundleDeals && product.bundleDeals.length > 0 && (
                    <div className="space-y-1">
                      <div className="text-[9px] font-mono uppercase font-semibold text-[#c9b8a0] tracking-[0.2em] flex items-center space-x-1">
                        <Sparkles className="w-3 h-3 text-[#a78b71] shrink-0" />
                        <span>Dynamic Bundle Offer</span>
                      </div>
                      {product.bundleDeals.map((b, i) => (
                        <div key={i} className="text-[11px] text-stone-200 flex justify-between p-2 bg-white/[0.02] border border-white/10 rounded-lg">
                          <span className="truncate max-w-[180px] font-sans">{b.addonName}</span>
                          <span className="font-mono text-[#e8d5b7] font-semibold">-{b.bundleDiscountPct}%</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Price & Action Footer */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-[9px] text-stone-400 font-mono uppercase tracking-wider">Settlement Price</div>
                    <div className="font-playfair italic text-2xl font-bold text-white">
                      ₹{product.price.toLocaleString()}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => setSelectedMetaProduct(product)}
                      className="border border-white/15 bg-white/[0.03] p-2 text-xs text-stone-300 hover:text-white hover:border-[#a78b71]/50 rounded-lg transition-colors"
                      title="View Machine-Readable JSON-LD Schema"
                    >
                      <FileCode className="w-3.5 h-3.5 shrink-0" />
                    </button>

                    <button
                      type="button"
                      disabled={isOutOfStock}
                      onClick={() => onQuickBuy(product.name)}
                      className="btn-gold-primary text-xs px-4 h-9 flex items-center space-x-1.5"
                    >
                      <span>Buy</span>
                      <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Metadata / JSON-LD Modal */}
      {selectedMetaProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl glass-gold-elevated p-6 space-y-4 max-h-[85vh] overflow-y-auto border border-[#a78b71]/30">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="font-playfair italic text-lg font-bold text-white">UAP Machine-Readable Catalog Schema</h3>
                <p className="text-xs text-stone-400 font-mono mt-0.5">{selectedMetaProduct.id}</p>
              </div>
              <button
                onClick={() => setSelectedMetaProduct(null)}
                className="p-1 text-stone-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-[#0a0a0a]/90 text-stone-200 font-mono text-[11px] overflow-x-auto max-h-96 border border-white/10 rounded-xl">
              <pre className="text-emerald-400">{JSON.stringify(selectedMetaProduct, null, 2)}</pre>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

