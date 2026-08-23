import React, { useState, useEffect } from 'react';
import {
  Search,
  Star,
  ShoppingBag,
  CheckCircle2,
  ThumbsUp,
  ThumbsDown,
  ShieldCheck,
  Truck,
  ArrowRight,
  Sparkles,
  Zap,
  Tag,
  Flame,
  Check,
} from 'lucide-react';
import { api } from '../services/api';
import { RazorpayLogo } from './RazorpayLogo';
import { AmazonProductItem, AmazonBrandComparisonReport } from '../../server/merchants/amazonAdapter';

interface AmazonAdvisorPageProps {
  onBuyItem: (prompt: string) => void;
}

const SAMPLE_QUERIES = [
  'Best running shoes under ₹2,000 (Nike vs Adidas vs Puma vs Asics)',
  'Top noise-canceling headphones with long battery',
  'Best custom mechanical keyboards for programmers',
];

export const AmazonAdvisorPage: React.FC<AmazonAdvisorPageProps> = ({ onBuyItem }) => {
  const [searchQuery, setSearchQuery] = useState('Best running shoes under ₹2,000');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<AmazonBrandComparisonReport | null>(null);
  const [buyingAsin, setBuyingAsin] = useState<string | null>(null);

  const fetchAnalysis = async (query: string) => {
    try {
      setLoading(true);
      const res = await api.analyzeAmazonReviews(query);
      setReport(res);
    } catch (err) {
      console.error('Failed to fetch Amazon review analysis:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis('running shoes');
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    fetchAnalysis(searchQuery);
  };

  const handleBuy = (item: AmazonProductItem) => {
    setBuyingAsin(item.asin);
    onBuyItem(`Buy ${item.title} (ASIN: ${item.asin}) for ₹${item.price}`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200 max-w-6xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-extrabold text-white">Amazon Review & Brand Advisor</h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#0c83ff]/15 text-[#38bdf8] font-bold border border-[#0c83ff]/30">
              Live Amazon India Intelligence
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Analyze thousands of verified reviews across top brands, compare pros & cons, and place orders with 1-click AgentPay spending bounds.
          </p>
        </div>

        <RazorpayLogo variant="badge" />
      </div>

      {/* Search & AI Query Bar */}
      <section className="fintech-card p-6 space-y-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. Best running shoes under ₹2,000 across Nike, Adidas, Puma, Asics"
              className="w-full pl-10 pr-4 py-3 bg-[#090d16] border border-white/[0.08] rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#0c83ff]"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !searchQuery.trim()}
            className="px-6 py-3 bg-[#0c83ff] hover:bg-[#0270e0] text-white text-xs font-bold rounded-xl shadow-md flex items-center space-x-2 transition-all disabled:opacity-50 flex-shrink-0"
          >
            <Search className="w-4 h-4" />
            <span>{loading ? 'Analyzing Reviews...' : 'Analyze & Compare'}</span>
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500 text-[11px] font-bold uppercase font-mono">Popular searches:</span>
          {SAMPLE_QUERIES.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setSearchQuery(q);
                fetchAnalysis(q);
              }}
              className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-slate-300 text-[11px] transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </section>

      {/* Review Intelligence Summary */}
      {report && (
        <div className="space-y-6">
          
          {/* AI Advisor Key Takeaway */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-[#0d1527] to-[#090d16] border border-[#0c83ff]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-lg bg-[#0c83ff]/20 text-[#38bdf8] flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-white">AI Verified Review Intelligence</div>
                <p className="text-xs text-slate-300 leading-relaxed">{report.brandSummary}</p>
              </div>
            </div>

            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20 font-bold self-start sm:self-auto whitespace-nowrap">
              {report.totalFound} Models Ranked
            </span>
          </div>

          {/* Top Recommendation Highlight Cards (3-Column) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Top Pick 1: Overall Best */}
            {report.topPick && (
              <div className="fintech-card p-5 space-y-4 border-t-4 border-t-[#0c83ff] flex flex-col justify-between">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#0c83ff]/15 text-[#38bdf8] font-mono uppercase">
                      🏆 #1 Overall Top Pick
                    </span>
                    <span className="text-xs font-bold text-amber-400 flex items-center space-x-1">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{report.topPick.rating}</span>
                      <span className="text-slate-500 text-[10px]">({report.topPick.reviewCount.toLocaleString()})</span>
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white leading-snug">{report.topPick.title}</h3>
                  
                  <div className="text-xs text-[#38bdf8] font-medium">
                    Best for: {report.topPick.bestFor}
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed bg-[#090d16] p-2.5 rounded-lg border border-white/[0.04]">
                    "{report.topPick.reviewSummary}"
                  </p>

                  {/* Pros & Cons */}
                  <div className="space-y-1 text-[11px]">
                    {report.topPick.pros?.slice(0, 2).map((pro, i) => (
                      <div key={i} className="flex items-center space-x-1.5 text-emerald-400">
                        <Check className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{pro}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-slate-500 line-through font-mono">₹{report.topPick.originalPrice?.toLocaleString()}</div>
                    <div className="text-base font-extrabold text-white font-mono">₹{report.topPick.price?.toLocaleString()}</div>
                  </div>

                  <button
                    onClick={() => handleBuy(report.topPick)}
                    disabled={buyingAsin === report.topPick.asin}
                    className="px-4 py-2 bg-[#0c83ff] hover:bg-[#0270e0] text-white text-xs font-bold rounded-lg shadow-sm flex items-center space-x-1.5 transition-all"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Order with AgentPay</span>
                  </button>
                </div>
              </div>
            )}

            {/* Top Pick 2: Best Value */}
            {report.bestValue && (
              <div className="fintech-card p-5 space-y-4 border-t-4 border-t-emerald-500 flex flex-col justify-between">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-mono uppercase">
                      💎 Best Budget Value
                    </span>
                    <span className="text-xs font-bold text-amber-400 flex items-center space-x-1">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{report.bestValue.rating}</span>
                      <span className="text-slate-500 text-[10px]">({report.bestValue.reviewCount.toLocaleString()})</span>
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white leading-snug">{report.bestValue.title}</h3>
                  
                  <div className="text-xs text-emerald-400 font-medium">
                    Best for: {report.bestValue.bestFor}
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed bg-[#090d16] p-2.5 rounded-lg border border-white/[0.04]">
                    "{report.bestValue.reviewSummary}"
                  </p>

                  <div className="space-y-1 text-[11px]">
                    {report.bestValue.pros?.slice(0, 2).map((pro, i) => (
                      <div key={i} className="flex items-center space-x-1.5 text-emerald-400">
                        <Check className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{pro}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-slate-500 line-through font-mono">₹{report.bestValue.originalPrice?.toLocaleString()}</div>
                    <div className="text-base font-extrabold text-white font-mono">₹{report.bestValue.price?.toLocaleString()}</div>
                  </div>

                  <button
                    onClick={() => handleBuy(report.bestValue)}
                    disabled={buyingAsin === report.bestValue.asin}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-sm flex items-center space-x-1.5 transition-all"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Order with AgentPay</span>
                  </button>
                </div>
              </div>
            )}

            {/* Top Pick 3: Best Comfort */}
            {report.bestComfort && (
              <div className="fintech-card p-5 space-y-4 border-t-4 border-t-purple-500 flex flex-col justify-between">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/15 text-purple-400 font-mono uppercase">
                      ☁️ Best Plush Comfort
                    </span>
                    <span className="text-xs font-bold text-amber-400 flex items-center space-x-1">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{report.bestComfort.rating}</span>
                      <span className="text-slate-500 text-[10px]">({report.bestComfort.reviewCount.toLocaleString()})</span>
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white leading-snug">{report.bestComfort.title}</h3>
                  
                  <div className="text-xs text-purple-400 font-medium">
                    Best for: {report.bestComfort.bestFor}
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed bg-[#090d16] p-2.5 rounded-lg border border-white/[0.04]">
                    "{report.bestComfort.reviewSummary}"
                  </p>

                  <div className="space-y-1 text-[11px]">
                    {report.bestComfort.pros?.slice(0, 2).map((pro, i) => (
                      <div key={i} className="flex items-center space-x-1.5 text-emerald-400">
                        <Check className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{pro}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-slate-500 line-through font-mono">₹{report.bestComfort.originalPrice?.toLocaleString()}</div>
                    <div className="text-base font-extrabold text-white font-mono">₹{report.bestComfort.price?.toLocaleString()}</div>
                  </div>

                  <button
                    onClick={() => handleBuy(report.bestComfort)}
                    disabled={buyingAsin === report.bestComfort.asin}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg shadow-sm flex items-center space-x-1.5 transition-all"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Order with AgentPay</span>
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Detailed Multi-Brand Comparison Matrix Table */}
          <div className="fintech-card overflow-hidden">
            <div className="p-4 border-b border-white/[0.07] flex items-center justify-between bg-[#090d16]">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Multi-Brand Detailed Review Matrix
              </h3>
              <span className="text-xs text-slate-400">All models verified on Amazon India</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#080b11] text-slate-400 uppercase font-mono text-[10px] border-b border-white/[0.06]">
                  <tr>
                    <th className="p-3.5">Brand & Model</th>
                    <th className="p-3.5">Rating & Reviews</th>
                    <th className="p-3.5">Review Highlight</th>
                    <th className="p-3.5">Delivery Speed</th>
                    <th className="p-3.5 text-right">Price</th>
                    <th className="p-3.5 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04] text-slate-300">
                  {report.products.map((item) => (
                    <tr key={item.asin} className="hover:bg-white/[0.02]">
                      <td className="p-3.5">
                        <div className="font-bold text-white text-xs">{item.title}</div>
                        <div className="text-[10px] text-slate-500 font-mono">ASIN: {item.asin} · {item.brand}</div>
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center space-x-1 font-bold text-amber-400">
                          <Star className="w-3 h-3 fill-current" />
                          <span>{item.rating}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">{item.reviewCount.toLocaleString()} reviews</div>
                      </td>
                      <td className="p-3.5 max-w-xs text-slate-300 text-[11px] leading-relaxed">
                        {item.reviewSummary}
                      </td>
                      <td className="p-3.5 text-[11px] text-emerald-400 font-medium">
                        <div className="flex items-center space-x-1">
                          <Truck className="w-3 h-3" />
                          <span>{item.deliveryEstimate}</span>
                        </div>
                      </td>
                      <td className="p-3.5 text-right font-mono font-bold text-white text-sm">
                        ₹{item.price.toLocaleString()}
                      </td>
                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => handleBuy(item)}
                          disabled={buyingAsin === item.asin}
                          className="px-3 py-1.5 bg-[#0c83ff] hover:bg-[#0270e0] text-white text-xs font-bold rounded-lg shadow-sm inline-flex items-center space-x-1 transition-all"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>Buy</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
