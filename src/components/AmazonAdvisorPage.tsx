import React, { useState, useEffect } from 'react';
import {
  Star,
  Sparkles,
  ShoppingBag,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Award,
  Search,
  ExternalLink,
  Store,
  RefreshCw,
} from 'lucide-react';
import { RazorpayLogo } from './RazorpayLogo';
import { api } from '../services/api';

interface ProductReviewAnalysis {
  asin: string;
  title: string;
  brand: string;
  price: number;
  currency: string;
  rating: number;
  totalReviews?: number;
  reviewCount?: number;
  sentimentSummary?: string;
  reviewSummary?: string;
  pros: string[];
  cons: string[];
  bestUseFor?: string;
  bestFor?: string;
  agentRecommendationScore: number;
  isBestValue: boolean;
  source?: 'Amazon.in' | 'Flipkart.com' | string;
  imageUrl?: string;
}

interface AmazonAdvisorPageProps {
  onBuyItem: (prompt: string) => void;
}

const SAMPLE_QUERIES = [
  'Mechanical keyboards for coding under ₹4,000 (Keychron vs Royal Kludge)',
  'Best running shoes under ₹2,000 across Nike, Adidas, Puma, Asics',
  'Fast charging 65W GaN chargers with multi-port USB-C (Anker vs Spigen)',
  'Sony vs Bose wireless noise cancelling headphones',
  'Smart fitness rings and smartwatches under ₹5,000',
];

export const AmazonAdvisorPage: React.FC<AmazonAdvisorPageProps> = ({ onBuyItem }) => {
  const [searchQuery, setSearchQuery] = useState('Mechanical keyboards for coding under ₹4,000 (Keychron vs Royal Kludge)');
  const [loading, setLoading] = useState(false);
  const [analysisItems, setAnalysisItems] = useState<ProductReviewAnalysis[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [brandSummary, setBrandSummary] = useState<string | null>(null);

  const fetchAnalysis = async (query: string) => {
    try {
      setLoading(true);
      const res = await api.analyzeAmazonReviews(query);
      const items = (res.items || res.products || []) as ProductReviewAnalysis[];
      if (items && items.length > 0) {
        setAnalysisItems(items);
        setSelectedBrand(null);
        setSelectedSource(null);
        if (res.brandSummary) {
          setBrandSummary(res.brandSummary);
        }
      }
    } catch (err) {
      console.error('Failed to fetch review analysis:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis(searchQuery);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || loading) return;
    await fetchAnalysis(searchQuery);
  };

  let filteredItems = analysisItems;
  if (selectedBrand) {
    filteredItems = filteredItems.filter((i) => i.brand.toLowerCase() === selectedBrand.toLowerCase());
  }
  if (selectedSource) {
    filteredItems = filteredItems.filter((i) => (i.source || 'Amazon.in').toLowerCase() === selectedSource.toLowerCase());
  }

  const brands = Array.from(new Set(analysisItems.map((i) => i.brand)));
  const sources = Array.from(new Set(analysisItems.map((i) => i.source || 'Amazon.in')));

  return (
    <div className="space-y-10 animate-in max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#1F1F1F] pb-6">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-400">Multi-Merchant Intelligence Engine</span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 border border-white/15 bg-white/[0.04] text-white rounded">
              Amazon.in · Flipkart.com
            </span>
          </div>
          <h1 className="font-playfair italic text-3xl sm:text-4xl text-white tracking-tight">
            Review & Brand Advisor
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1.5 font-sans leading-relaxed">
            Analyze verified reviews across Amazon.in and Flipkart.com, compare price-performance, and place orders with 1-click AgentPay spending bounds.
          </p>
        </div>

        <RazorpayLogo variant="badge" />
      </div>

      {/* Search & AI Query Bar */}
      <section className="card-dark p-6 space-y-4">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center space-x-3 px-4 py-2.5 rounded-xl bg-[#0D0D0D] border border-[#1F1F1F] focus-within:border-white/40 focus-within:ring-1 focus-within:ring-white/20 transition-all flex-1">
            <Search className="w-4 h-4 text-zinc-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. Mechanical keyboards under ₹4,000 or Running shoes on Amazon & Flipkart"
              className="bg-transparent border-none outline-none text-xs sm:text-sm text-stone-100 placeholder:text-stone-500 w-full"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !searchQuery.trim()}
            className="btn-primary px-7 h-11 text-xs shrink-0 flex items-center space-x-2"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 shrink-0" />}
            <span>{loading ? 'Analyzing Multi-Source Reviews...' : 'Analyze & Compare'}</span>
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-stone-400">Curated Searches:</span>
          {SAMPLE_QUERIES.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setSearchQuery(q);
                fetchAnalysis(q);
              }}
              className="px-2.5 py-1 border border-[#1F1F1F] hover:border-white/40 bg-white/[0.02] text-zinc-400 hover:text-white text-[11px] font-mono rounded transition-colors"
            >
              {q.split(' (')[0].split(' under ')[0]}
            </button>
          ))}
        </div>
      </section>

      {/* Synthesis Intelligence Banner */}
      {brandSummary && (
        <div className="p-4 border border-[#1F1F1F] bg-[#0A0A0A] rounded-xl flex items-center justify-between text-xs font-sans text-stone-200">
          <div className="flex items-center space-x-2.5">
            <Sparkles className="w-4 h-4 text-zinc-300 shrink-0" />
            <span className="leading-relaxed">{brandSummary}</span>
          </div>
          <span className="text-[10px] font-mono uppercase font-bold text-emerald-400 shrink-0 ml-4">
            Live Verified
          </span>
        </div>
      )}

      {/* Filter Tabs (Sources & Brands) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1F1F1F] pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-stone-400 mr-1">Platform:</span>
          <button
            onClick={() => setSelectedSource(null)}
            className={`px-3 py-1 text-xs font-mono uppercase tracking-wider transition-all border-b-2 ${
              selectedSource === null
                ? 'border-b-white text-white font-semibold'
                : 'border-b-transparent text-zinc-400 hover:text-white'
            }`}
          >
            All Sources
          </button>
          {sources.map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSource(s)}
              className={`px-3 py-1 text-xs font-mono uppercase tracking-wider transition-all border-b-2 ${
                selectedSource === s
                  ? 'border-b-white text-white font-semibold'
                  : 'border-b-transparent text-zinc-400 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}

          <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-stone-400 ml-4 mr-1">Brand:</span>
          <button
            onClick={() => setSelectedBrand(null)}
            className={`px-3 py-1 text-xs font-mono uppercase tracking-wider transition-all border-b-2 ${
              selectedBrand === null
                ? 'border-b-white text-white font-semibold'
                : 'border-b-transparent text-zinc-400 hover:text-white'
            }`}
          >
            All
          </button>
          {brands.map((b) => (
            <button
              key={b}
              onClick={() => setSelectedBrand(b)}
              className={`px-3 py-1 text-xs font-mono uppercase tracking-wider transition-all border-b-2 ${
                selectedBrand === b
                  ? 'border-b-white text-white font-semibold'
                  : 'border-b-transparent text-zinc-400 hover:text-white'
              }`}
            >
              {b}
            </button>
          ))}
        </div>

        <span className="text-xs font-mono text-stone-400">
          {filteredItems.length} Products Evaluated
        </span>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card-dark p-6 space-y-4">
              <div className="h-4 bg-white/10 rounded w-1/3" />
              <div className="h-6 bg-white/10 rounded w-3/4" />
              <div className="h-10 bg-white/5 rounded w-full" />
              <div className="h-20 bg-white/5 rounded w-full" />
              <div className="h-10 bg-white/10 rounded w-full" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State Fallback */}
      {!loading && filteredItems.length === 0 && (
        <div className="card-dark p-12 text-center space-y-4">
          <Sparkles className="w-8 h-8 text-zinc-400 mx-auto" />
          <h3 className="font-playfair italic text-lg font-bold text-white">No products matching current filter</h3>
          <p className="text-xs text-stone-400 max-w-md mx-auto">
            Try resetting platform or brand filters, or choose one of the curated search prompts above.
          </p>
          <button
            onClick={() => {
              setSelectedBrand(null);
              setSelectedSource(null);
              fetchAnalysis('Mechanical keyboards for coding under ₹4,000');
            }}
            className="btn-primary text-xs h-10 px-6"
          >
            Reset Filters & View Recommendations
          </button>
        </div>
      )}

      {/* Product Comparison Cards */}
      {!loading && filteredItems.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredItems.map((item, idx) => {
            const isAmazon = (item.source || 'Amazon.in').includes('Amazon');
            const totalRev = item.totalReviews || item.reviewCount || 1000;
            const sentSummary = item.sentimentSummary || item.reviewSummary || '';
            const bestUse = item.bestUseFor || item.bestFor || 'Everyday Use';

            return (
              <div
                key={item.asin || idx}
                className={`card-dark p-6 flex flex-col justify-between space-y-5 hover:border-zinc-700 transition-all duration-300 ${
                  item.isBestValue ? 'border-t-2 border-t-white shadow-[0_0_30px_rgba(255,255,255,0.06)]' : ''
                }`}
              >
                <div className="space-y-4">
                  {/* Header Badge, Source & Score */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {item.isBestValue ? (
                        <span className="px-2 py-0.5 bg-white/[0.08] border border-white/20 text-white font-mono text-[9px] font-bold tracking-[0.18em] uppercase flex items-center space-x-1 rounded">
                          <Award className="w-3 h-3 fill-current" />
                          <span>TOP PICK</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-stone-400 uppercase tracking-[0.2em]">
                          Rank 0{idx + 1}
                        </span>
                      )}

                      {/* Source Platform Badge */}
                      <span
                        className={`text-[9px] font-mono font-bold px-2 py-0.5 border rounded uppercase ${
                          isAmazon
                            ? 'border-amber-500/30 text-amber-300 bg-amber-500/10'
                            : 'border-blue-500/30 text-blue-300 bg-blue-500/10'
                        }`}
                      >
                        {item.source || 'Amazon.in'}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1 font-mono text-xs text-white font-semibold">
                      <TrendingUp className="w-3.5 h-3.5 text-zinc-300" />
                      <span>Score {item.agentRecommendationScore || 90}/100</span>
                    </div>
                  </div>

                  {/* Title & Brand */}
                  <div>
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-[0.18em]">{item.brand}</span>
                    <h3 className="font-playfair italic text-base font-bold text-white leading-snug tracking-tight mt-1">
                      {item.title}
                    </h3>
                  </div>

                  {/* Price & Rating */}
                  <div className="flex items-center justify-between border-y border-[#1F1F1F] py-2.5">
                    <div className="font-playfair italic text-2xl font-bold text-white">
                      ₹{item.price.toLocaleString()}
                    </div>
                    <div className="flex items-center space-x-1.5 text-xs text-stone-400">
                      <div className="flex text-zinc-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < Math.floor(item.rating) ? 'fill-zinc-300' : 'text-stone-600'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-bold text-stone-200">{item.rating}</span>
                      <span>({totalRev.toLocaleString()})</span>
                    </div>
                  </div>

                  {/* Sentiment Summary */}
                  {sentSummary && (
                    <p className="text-xs text-stone-300 leading-relaxed italic border-l-2 border-white/40 pl-3 py-1 font-playfair">
                      "{sentSummary}"
                    </p>
                  )}

                  {/* Best For */}
                  <div className="p-3 border border-[#1F1F1F] bg-white/[0.02] rounded-lg text-xs">
                    <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-zinc-400 block mb-0.5">Best Application</span>
                    <span className="font-playfair italic font-bold text-stone-100">{bestUse}</span>
                  </div>

                  {/* Pros & Cons */}
                  <div className="space-y-2 text-xs">
                    <div className="space-y-1">
                      {item.pros?.map((p, i) => (
                        <div key={i} className="flex items-center space-x-1.5 text-emerald-400 text-[11px] font-sans">
                          <span className="text-zinc-400 font-bold">◆</span>
                          <span>{p}</span>
                        </div>
                      ))}
                    </div>
                    {item.cons?.map((c, i) => (
                      <div key={i} className="flex items-center space-x-1.5 text-amber-300 text-[11px] font-sans">
                        <span className="text-amber-500 font-bold">▲</span>
                        <span>{c}</span>
                      </div>
                    ))}
                  </div>

                </div>

                {/* Buy CTA */}
                <div className="pt-4 border-t border-[#1F1F1F]">
                  <button
                    type="button"
                    onClick={() => onBuyItem(`Buy ${item.title} from ${item.source || 'Amazon.in'} under ₹${item.price + 500}`)}
                    className="btn-primary w-full h-11 text-xs flex items-center justify-center space-x-2"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Buy via AgentPay Enclave</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
