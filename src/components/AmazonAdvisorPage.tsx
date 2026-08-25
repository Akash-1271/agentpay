import React, { useState } from 'react';
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
  ChevronRight,
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
  totalReviews: number;
  sentimentSummary: string;
  pros: string[];
  cons: string[];
  bestUseFor: string;
  agentRecommendationScore: number;
  isBestValue: boolean;
}

interface AmazonAdvisorPageProps {
  onBuyItem: (prompt: string) => void;
}

const SAMPLE_QUERIES = [
  'Best running shoes under ₹2,000 across Nike, Adidas, Puma, Asics',
  'Mechanical keyboards for coding under ₹4,000 (Keychron vs Royal Kludge)',
  'Fast charging 65W GaN chargers with multi-port USB-C (Anker vs Spigen)',
];

const DEFAULT_ANALYSIS_ITEMS: ProductReviewAnalysis[] = [
  {
    asin: 'B0C7Q4W9X2',
    title: 'Nike Air Zoom Pegasus 40 Road Running Shoes',
    brand: 'Nike',
    price: 1709,
    currency: 'INR',
    rating: 4.8,
    totalReviews: 2420,
    sentimentSummary: 'Exceptional cushioning with React foam and dual Zoom Air units. Widely praised for daily 10k training.',
    pros: ['Ultra-responsive foam', 'Breathable engineered mesh', 'Under ₹2,000 auto-approved limit'],
    cons: ['Slightly narrow toe box for wide feet'],
    bestUseFor: 'Daily Marathon & 10k Road Training',
    agentRecommendationScore: 96,
    isBestValue: true,
  },
  {
    asin: 'B09V7N8W51',
    title: 'Adidas Ultraboost Light 23 Running Shoes',
    brand: 'Adidas',
    price: 1899,
    currency: 'INR',
    rating: 4.6,
    totalReviews: 1890,
    sentimentSummary: '30% lighter Boost material gives superior energy return. Great arch support and Continental rubber grip.',
    pros: ['Plush cushioning', 'Continental rubber all-weather traction', 'High durability'],
    cons: ['Heavier than pure racing shoes'],
    bestUseFor: 'High-Mileage Heavy Runners & Arch Support',
    agentRecommendationScore: 92,
    isBestValue: false,
  },
  {
    asin: 'B0B3R9K8Z1',
    title: 'Puma Velocity Nitro 2 Running Shoes',
    brand: 'Puma',
    price: 1499,
    currency: 'INR',
    rating: 4.5,
    totalReviews: 1430,
    sentimentSummary: 'Nitro-infused midsole offers top tier responsiveness for budget under ₹1,500. PumaGrip outsole is class-leading.',
    pros: ['Lowest price to performance ratio', 'PumaGrip wet weather grip', 'Lightweight upper'],
    cons: ['Heel collar padding is slightly thin'],
    bestUseFor: 'Budget-Conscious Fast Runners',
    agentRecommendationScore: 89,
    isBestValue: false,
  },
];

export const AmazonAdvisorPage: React.FC<AmazonAdvisorPageProps> = ({ onBuyItem }) => {
  const [searchQuery, setSearchQuery] = useState('Best running shoes under ₹2,000 across Nike, Adidas, Puma, Asics');
  const [loading, setLoading] = useState(false);
  const [analysisItems, setAnalysisItems] = useState<ProductReviewAnalysis[]>(DEFAULT_ANALYSIS_ITEMS);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || loading) return;
    await fetchAnalysis(searchQuery);
  };

  const fetchAnalysis = async (query: string) => {
    try {
      setLoading(true);
      const res = await api.analyzeAmazonReviews(query);
      if (res && res.items && res.items.length > 0) {
        setAnalysisItems(res.items);
      }
    } catch (err) {
      console.error('Failed to fetch review analysis:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = selectedBrand
    ? analysisItems.filter((i) => i.brand.toLowerCase() === selectedBrand.toLowerCase())
    : analysisItems;

  const brands = Array.from(new Set(analysisItems.map((i) => i.brand)));

  return (
    <div className="space-y-10 animate-in max-w-6xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#1A1A1A]/12 pb-6">
        <div>
          <div className="luxury-eyebrow mb-2">
            Amazon Intelligence Engine
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1A1A1A] tracking-tight">
            Review & Brand Advisor
          </h1>
          <p className="text-xs sm:text-sm text-[#6C6863] mt-1.5 font-sans leading-relaxed">
            Analyze thousands of verified reviews across top brands, compare pros & cons, and place orders with 1-click AgentPay spending bounds.
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
              placeholder="e.g. Best running shoes under ₹2,000 across Nike, Adidas, Puma, Asics"
              className="luxury-input text-xs sm:text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !searchQuery.trim()}
            className="luxury-btn-primary px-7 h-11 text-xs shrink-0"
          >
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>{loading ? 'Analyzing Reviews...' : 'Analyze & Compare'}</span>
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
              {q.split(' under ')[0]}
            </button>
          ))}
        </div>
      </section>

      {/* Brand Filters */}
      <div className="flex items-center justify-between gap-4 border-b border-[#1A1A1A]/12 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-sans font-semibold text-[#6C6863] uppercase tracking-[0.18em] mr-2">Filter Brand:</span>
          <button
            onClick={() => setSelectedBrand(null)}
            className={`px-3 py-1 text-xs font-sans uppercase tracking-[0.15em] transition-all border-b-2 ${
              selectedBrand === null
                ? 'border-b-[#1A1A1A] text-[#1A1A1A] font-bold'
                : 'border-b-transparent text-[#6C6863] hover:text-[#1A1A1A]'
            }`}
          >
            All Brands
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
        {filteredItems.map((item, idx) => (
          <div
            key={item.asin}
            className={`luxury-card flex flex-col justify-between space-y-5 ${
              item.isBestValue ? 'border-t-2 border-t-[#D4AF37] shadow-[0_8px_24px_rgba(212,175,55,0.15)]' : ''
            }`}
          >
            <div className="space-y-4">
              
              {/* Badge & Score */}
              <div className="flex items-center justify-between">
                {item.isBestValue ? (
                  <span className="px-2.5 py-1 bg-[#1A1A1A] text-[#D4AF37] font-sans text-[10px] font-bold tracking-[0.18em] uppercase flex items-center space-x-1">
                    <Award className="w-3.5 h-3.5 fill-current" />
                    <span>EDITOR'S CHOICE</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-sans font-semibold text-[#6C6863] uppercase tracking-[0.2em]">
                    Rank 0{idx + 1}
                  </span>
                )}

                <div className="flex items-center space-x-1 font-mono text-xs text-[#1A1A1A] font-semibold">
                  <TrendingUp className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Score {item.agentRecommendationScore}/100</span>
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
                  <span>({item.totalReviews})</span>
                </div>
              </div>

              {/* Sentiment Summary */}
              <p className="text-xs text-[#6C6863] leading-relaxed italic border-l-2 border-[#D4AF37] pl-3 py-1 font-serif">
                "{item.sentimentSummary}"
              </p>

              {/* Best For */}
              <div className="p-3 border border-[#1A1A1A]/10 bg-[#FAF8F5] text-xs">
                <span className="text-[10px] font-sans font-semibold text-[#6C6863] uppercase tracking-[0.18em] block mb-0.5">Best Application</span>
                <span className="font-serif font-bold text-[#1A1A1A]">{item.bestUseFor}</span>
              </div>

              {/* Pros & Cons */}
              <div className="space-y-2 text-xs">
                <div className="space-y-1">
                  {item.pros.map((p, i) => (
                    <div key={i} className="flex items-center space-x-1.5 text-emerald-800 text-[11px] font-sans">
                      <span className="text-[#D4AF37] font-bold">◆</span>
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
                {item.cons.map((c, i) => (
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
                onClick={() => onBuyItem(`Buy ${item.title} on Amazon under ₹${item.price + 500}`)}
                className="luxury-btn-primary w-full h-11 text-xs flex items-center justify-center space-x-2"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Buy with AgentPay</span>
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};

