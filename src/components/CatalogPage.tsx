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
      
      {/* Editorial Lookbook Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#1A1A1A]/12 pb-6">
        <div>
          <div className="luxury-eyebrow mb-2">Curated Machine-Readable Inventory</div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1A1A1A] tracking-tight">
            Merchant Catalog & Lookbook
          </h1>
          <p className="text-xs sm:text-sm text-[#6C6863] mt-1.5 font-sans leading-relaxed">
            Machine-readable inventory designed for autonomous discovery, bundle yield incentives, and instant Razorpay checkout.
          </p>
        </div>

        <button
          onClick={fetchCatalog}
          disabled={loading}
          className="luxury-btn-secondary self-start text-xs h-11 px-5 sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Inventory</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        <div className="luxury-input-wrapper flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#D4AF37] shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search catalog by name, category, merchant, specs..."
            className="luxury-input text-xs sm:text-sm"
          />
        </div>

        <div className="flex space-x-1.5 overflow-x-auto border-b border-[#1A1A1A]/15 pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-sans tracking-[0.15em] uppercase whitespace-nowrap transition-all duration-300 border-b-2 ${
                selectedCategory === cat
                  ? 'border-b-[#1A1A1A] text-[#1A1A1A] font-bold'
                  : 'border-b-transparent text-[#6C6863] hover:text-[#1A1A1A]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Editorial Product Grid with Grayscale-to-Color Cinematic Images */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((product) => {
          const isOutOfStock = product.stock <= 0;
          const aiScore = Math.round(product.rating * 20);
          const imgSrc = PRODUCT_IMAGE_MAP[product.id] || DEFAULT_IMAGE;

          return (
            <div
              key={product.id}
              className="luxury-card group flex flex-col justify-between p-0 overflow-hidden"
            >
              {/* Product Image Frame */}
              <div className="relative aspect-[4/3] overflow-hidden bg-[#EBE5DE] border-b border-[#1A1A1A]/10">
                <img
                  src={imgSrc}
                  alt={product.name}
                  className="luxury-image w-full h-full object-cover"
                />
                
                {/* Category & Stock Floating Tags */}
                <div className="absolute top-3 left-3 right-3 flex justify-between items-start pointer-events-none">
                  <span className="text-[9px] font-sans font-semibold uppercase tracking-[0.2em] px-2.5 py-1 bg-[#1A1A1A]/90 text-[#FFFFFF] backdrop-blur-md">
                    {product.category}
                  </span>
                  <span
                    className={`text-[9px] font-mono font-bold px-2 py-0.5 border backdrop-blur-md ${
                      isOutOfStock
                        ? 'bg-rose-500/90 text-white border-rose-600'
                        : 'bg-[#FFFFFF]/90 text-[#1A1A1A] border-[#1A1A1A]/20'
                    }`}
                  >
                    {isOutOfStock ? '0 (Stockout)' : `${product.stock} units`}
                  </span>
                </div>
              </div>

              {/* Product Details Area */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="font-serif text-lg font-bold text-[#1A1A1A] leading-snug tracking-tight">
                    {product.name}
                  </h3>
                  <p className="text-xs text-[#6C6863] line-clamp-2 leading-relaxed font-sans">
                    {product.description}
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  {/* Store & Match Meta */}
                  <div className="flex items-center justify-between border-t border-b border-[#1A1A1A]/10 py-2 text-[11px] font-sans">
                    <span className="text-[#6C6863] flex items-center space-x-1.5">
                      <Store className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                      <span className="text-[#1A1A1A] font-semibold">{product.merchantName}</span>
                    </span>
                    <span className="text-[#1A1A1A] font-mono font-semibold">
                      Match: {aiScore}%
                    </span>
                  </div>

                  {/* Dynamic Bundles if present */}
                  {product.bundleDeals && product.bundleDeals.length > 0 && (
                    <div className="space-y-1">
                      <div className="text-[9px] font-sans uppercase font-semibold text-[#6C6863] tracking-[0.2em] flex items-center space-x-1">
                        <Sparkles className="w-3 h-3 text-[#D4AF37] shrink-0" />
                        <span>Dynamic Bundle Offer</span>
                      </div>
                      {product.bundleDeals.map((b, i) => (
                        <div key={i} className="text-[11px] text-[#1A1A1A] flex justify-between p-2 bg-[#FAF8F5] border border-[#1A1A1A]/10">
                          <span className="truncate max-w-[180px] font-sans">{b.addonName}</span>
                          <span className="font-mono text-[#D4AF37] font-bold">-{b.bundleDiscountPct}%</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Price & Action Footer */}
                <div className="pt-3 border-t border-[#1A1A1A]/12 flex items-center justify-between">
                  <div>
                    <div className="text-[9px] text-[#6C6863] font-mono uppercase tracking-wider">AP2 Settlement</div>
                    <div className="font-serif text-2xl font-bold text-[#1A1A1A]">
                      ₹{product.price.toLocaleString()}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => setSelectedMetaProduct(product)}
                      className="border border-[#1A1A1A]/20 bg-transparent p-2 text-xs text-[#1A1A1A] hover:bg-[#EBE5DE] transition-colors"
                      title="View Machine-Readable JSON-LD Schema"
                    >
                      <FileCode className="w-3.5 h-3.5 shrink-0" />
                    </button>

                    <button
                      type="button"
                      disabled={isOutOfStock}
                      onClick={() => onQuickBuy(product.name)}
                      className="luxury-btn-primary text-xs px-4 h-10 flex items-center space-x-1.5"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A1A]/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-[#FFFFFF] border-2 border-[#1A1A1A] p-6 space-y-4 max-h-[85vh] overflow-y-auto shadow-[0_12px_40px_rgba(0,0,0,0.2)]">
            <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A]/15">
              <div>
                <h3 className="font-serif text-base font-bold text-[#1A1A1A]">UAP Machine-Readable Catalog Schema</h3>
                <p className="text-xs text-[#6C6863] font-mono">{selectedMetaProduct.id}</p>
              </div>
              <button
                onClick={() => setSelectedMetaProduct(null)}
                className="p-1 text-[#6C6863] hover:text-[#1A1A1A]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-[#1A1A1A] text-[#F9F8F6] font-mono text-[11px] overflow-x-auto max-h-96 border border-[#1A1A1A]">
              <pre className="text-emerald-400">{JSON.stringify(selectedMetaProduct, null, 2)}</pre>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

