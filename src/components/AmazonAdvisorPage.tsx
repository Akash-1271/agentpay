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
  'Best running shoes under ₹2,000 across Nike, Adidas, Puma, Asics',
  'Mechanical keyboards for coding under ₹4,000 (Keychron vs Royal Kludge)',
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
      if (items.length > 0) {
        setAnalysisItems(items);
        setSelectedBrand(null);
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
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#1A1A1A]/12 pb-6">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span className="luxury-eyebrow">Multi-Merchant Intelligence Engine</span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 border border-[#1A1A1A]/20 bg-[#FAF8F5] text-[#1A1A1A]">
              Amazon.in · Flipkart.com
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1A1A1A] tracking-tight">
            Review & Brand Advisor
          </h1>
          <p className="text-xs sm:text-sm text-[#6C6863] mt-1.5 font-sans leading-relaxed">
            Analyze verified reviews across Amazon.in and Flipkart.com, compare price-performance, and place orders with 1-click AgentPay spending bounds.
          </p>
        </div>

        <RazorpayLogo variant="badge" />
      </div>

      {/* Search & AI Query Bar */}
      <section className="luxury-card space-y-4">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="luxury-input-wrapper flex-1">
            <Search className="w-4 h-4 text-[#D4AF37] shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. Mechanical keyboards under ₹4,000 or Running shoes on Amazon & Flipkart"
              className="luxury-input text-xs sm:text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !searchQuery.trim()}
            className="luxury-btn-primary px-7 h-11 text-xs shrink-0 flex items-center space-x-2"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 shrink-0" />}
            <span>{loading ? 'Analyzing Multi-Source Reviews...' : 'Analyze & Compare'}</span>
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
          <span className="text-[10px] font-sans font-semibold text-[#6C6863] uppercase tracking-[0.18em]">Curated Searches:</span>
          {SAMPLE_QUERIES.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setSearchQuery(q);
                fetchAnalysis(q);
              }}
              className="px-2.5 py-1 border border-[#1A1A1A]/15 hover:border-[#1A1A1A] text-[#6C6863] hover:text-[#1A1A1A] text-[11px] font-sans transition-colors"
            >
              {q.split(' (')[0].split(' under ')[0]}
            </button>
          ))}
        </div>
      </section>

      {/* Synthesis Intelligence Banner */}
      {brandSummary && (
        <div className="p-4 border border-[#1A1A1A]/12 bg-[#FAF8F5] flex items-center justify-between text-xs font-sans text-[#1A1A1A]">
          <div className="flex items-center space-x-2.5">
            <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0" />
            <span className="leading-relaxed">{brandSummary}</span>
          </div>
          <span className="text-[10px] font-mono uppercase font-bold text-emerald-800 shrink-0 ml-4">
            Live Verified
          </span>
        </div>
      )}

      {/* Filter Tabs (Sources & Brands) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1A1A1A]/12 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-sans font-semibold text-[#6C6863] uppercase tracking-[0.18em] mr-1">Platform:</span>
          <button
            onClick={() => setSelectedSource(null)}
            className={`px-3 py-1 text-xs font-sans uppercase tracking-[0.15em] transition-all border-b-2 ${
              selectedSource === null
                ? 'border-b-[#1A1A1A] text-[#1A1A1A] font-bold'
                : 'border-b-transparent text-[#6C6863] hover:text-[#1A1A1A]'
            }`}
          >
            All Sources
          </button>
          {sources.map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSource(s)}
              className={`px-3 py-1 text-xs font-sans uppercase tracking-[0.15em] transition-all border-b-2 ${
                selectedSource === s
                  ? 'border-b-[#1A1A1A] text-[#1A1A1A] font-bold'
                  : 'border-b-transparent text-[#6C6863] hover:text-[#1A1A1A]'
              }`}
            >
              {s}
            </button>
          ))}

          <span className="text-[10px] font-sans font-semibold text-[#6C6863] uppercase tracking-[0.18em] ml-4 mr-1">Brand:</span>
          <button
            onClick={() => setSelectedBrand(null)}
            className={`px-3 py-1 text-xs font-sans uppercase tracking-[0.15em] transition-all border-b-2 ${
              selectedBrand === null
                ? 'border-b-[#1A1A1A] text-[#1A1A1A] font-bold'
                : 'border-b-transparent text-[#6C6863] hover:text-[#1A1A1A]'
            }`}
          >
            All
          </button>
          {brands.map((b) => (
            <button
              key={b}
              onClick={() => setSelectedBrand(b)}
              className={`px-3 py-1 text-xs font-sans uppercase tracking-[0.15em] transition-all border-b-2 ${
                selectedBrand === b
                  ? 'border-b-[#1A1A1A] text-[#1A1A1A] font-bold'
                  : 'border-b-transparent text-[#6C6863] hover:text-[#1A1A1A]'
              }`}
            >
              {b}
            </button>
          ))}
        </div>

        <span className="text-xs font-mono text-[#6C6863]">
          {filteredItems.length} Products Evaluated
        </span>
      </div>

      {/* Product Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredItems.map((item, idx) => {
          const isAmazon = (item.source || 'Amazon.in').includes('Amazon');
          const totalRev = item.totalReviews || item.reviewCount || 1000;
          const sentSummary = item.sentimentSummary || item.reviewSummary || '';
          const bestUse = item.bestUseFor || item.bestFor || 'Everyday Use';

          return (
            <div
              key={item.asin || idx}
              className={`luxury-card flex flex-col justify-between space-y-5 ${
                item.isBestValue ? 'border-t-2 border-t-[#D4AF37] shadow-[0_8px_24px_rgba(212,175,55,0.15)]' : ''
              }`}
            >
              <div className="space-y-4">
                
                {/* Header Badge, Source & Score */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {item.isBestValue ? (
                      <span className="px-2 py-0.5 bg-[#1A1A1A] text-[#D4AF37] font-sans text-[9px] font-bold tracking-[0.18em] uppercase flex items-center space-x-1">
                        <Award className="w-3 h-3 fill-current" />
                        <span>TOP PICK</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-sans font-semibold text-[#6C6863] uppercase tracking-[0.2em]">
                        Rank 0{idx + 1}
                      </span>
                    )}

                    {/* Source Platform Badge */}
                    <span
                      className={`text-[9px] font-sans font-bold px-2 py-0.5 border tracking-wider uppercase ${
                        isAmazon
                          ? 'border-amber-600/30 text-amber-900 bg-amber-50'
                          : 'border-blue-600/30 text-blue-900 bg-blue-50'
                      }`}
                    >
                      {item.source || 'Amazon.in'}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1 font-mono text-xs text-[#1A1A1A] font-semibold">
                    <TrendingUp className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Score {item.agentRecommendationScore || 90}/100</span>
                  </div>
                </div>

                {/* Title & Brand */}
                <div>
                  <span className="text-[10px] font-sans font-semibold text-[#6C6863] uppercase tracking-[0.18em]">{item.brand}</span>
                  <h3 className="font-serif text-base font-bold text-[#1A1A1A] leading-snug tracking-tight mt-1">
                    {item.title}
                  </h3>
                </div>

                {/* Price & Rating */}
                <div className="flex items-center justify-between border-y border-[#1A1A1A]/10 py-2.5">
                  <div className="font-serif text-2xl font-bold text-[#1A1A1A]">
                    ₹{item.price.toLocaleString()}
                  </div>
                  <div className="flex items-center space-x-1.5 text-xs text-[#6C6863]">
                    <div className="flex text-[#D4AF37]">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < Math.floor(item.rating) ? 'fill-[#D4AF37]' : 'text-[#6C6863]/30'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-bold text-[#1A1A1A]">{item.rating}</span>
                    <span>({totalRev.toLocaleString()})</span>
                  </div>
                </div>

                {/* Sentiment Summary */}
                {sentSummary && (
                  <p className="text-xs text-[#6C6863] leading-relaxed italic border-l-2 border-[#D4AF37] pl-3 py-1 font-serif">
                    "{sentSummary}"
                  </p>
                )}

                {/* Best For */}
                <div className="p-3 border border-[#1A1A1A]/10 bg-[#FAF8F5] text-xs">
                  <span className="text-[10px] font-sans font-semibold text-[#6C6863] uppercase tracking-[0.18em] block mb-0.5">Best Application</span>
                  <span className="font-serif font-bold text-[#1A1A1A]">{bestUse}</span>
                </div>

                {/* Pros & Cons */}
                <div className="space-y-2 text-xs">
                  <div className="space-y-1">
                    {item.pros?.map((p, i) => (
                      <div key={i} className="flex items-center space-x-1.5 text-emerald-800 text-[11px] font-sans">
                        <span className="text-[#D4AF37] font-bold">◆</span>
                        <span>{p}</span>
                      </div>
                    ))}
                  </div>
                  {item.cons?.map((c, i) => (
                    <div key={i} className="flex items-center space-x-1.5 text-amber-800 text-[11px] font-sans">
                      <span className="text-amber-600 font-bold">▲</span>
                      <span>{c}</span>
                    </div>
                  ))}
                </div>

              </div>

              {/* Buy CTA */}
              <div className="pt-4 border-t border-[#1A1A1A]/10">
                <button
                  type="button"
                  onClick={() => onBuyItem(`Buy ${item.title} from ${item.source || 'Amazon.in'} under ₹${item.price + 500}`)}
                  className="luxury-btn-primary w-full h-11 text-xs flex items-center justify-center space-x-2"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Buy via AgentPay Enclave</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
