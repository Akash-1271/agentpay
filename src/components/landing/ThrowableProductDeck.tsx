import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  RotateCcw,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';

export interface DeckProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  merchantName: string;
  statusBadge: string;
  statusType: 'success' | 'warning' | 'bundle' | 'recovered' | 'danger';
  specs: { label: string; val: string }[];
  enclaveNote: string;
  imageUrl: string;
}

const DECK_PRODUCTS: DeckProduct[] = [
  {
    id: 'prod_nike_pegasus',
    name: 'Nike Air Zoom Pegasus 40',
    category: 'Athletics & Footwear',
    price: 1899,
    merchantName: 'Nike India Flagship',
    statusBadge: 'AUTO_APPROVED (≤ ₹2,000)',
    statusType: 'success',
    specs: [
      { label: 'Weight', val: '285g' },
      { label: 'Drop', val: '10mm' },
      { label: 'Cushion', val: 'Dual Air Zoom Units' },
    ],
    enclaveNote: 'Single-purchase ceiling: ₹2,000. Verified below threshold. Instant zero-touch settlement.',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=900&auto=format&fit=crop',
  },
  {
    id: 'prod_keychron_q1',
    name: 'Keychron Q1 Pro Mechanical Keyboard',
    category: 'Electronics & Peripherals',
    price: 3509,
    merchantName: 'Apex Gear India',
    statusBadge: 'STEP_UP_GATED (> ₹2,000)',
    statusType: 'warning',
    specs: [
      { label: 'Body', val: 'CNC Machined 6063 Aluminum' },
      { label: 'Mount', val: 'Double-Gasket Design' },
      { label: 'Connectivity', val: 'Bluetooth 5.1 & Type-C' },
    ],
    enclaveNote: 'Exceeds autonomous spending threshold. Enclave halts order until human biometric passkey approval.',
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=900&auto=format&fit=crop',
  },
  {
    id: 'prod_anker_bundle',
    name: 'Anker PowerExpand 7-in-1 + 100W Cable',
    category: 'Electronics & Accessories',
    price: 3299,
    originalPrice: 4198,
    merchantName: 'Apex Gear India',
    statusBadge: 'DYNAMIC_BUNDLE (-21% SAVINGS)',
    statusType: 'bundle',
    specs: [
      { label: 'Display', val: '4K@60Hz HDMI 2.0' },
      { label: 'Charging', val: '100W USB-C Power Delivery' },
      { label: 'Cable', val: 'Nylon Braided 1.8m Included' },
    ],
    enclaveNote: 'Merchant Yield Agent proposed algorithmic bundle deal. Autonomous Buyer accepted savings within budget.',
    imageUrl: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?q=80&w=900&auto=format&fit=crop',
  },
  {
    id: 'prod_ultrahuman_ring',
    name: 'Ultrahuman Ring AIR (Matte Space Silver)',
    category: 'Wearables & Health',
    price: 2499,
    merchantName: 'BioWear Labs India',
    statusBadge: 'STOCKOUT_RECOVERED',
    statusType: 'recovered',
    specs: [
      { label: 'Material', val: 'Fighter-jet grade Titanium' },
      { label: 'Weight', val: '2.4g Ultra-lightweight' },
      { label: 'Sensors', val: 'PPG, Skin Temp, 6-Axis Motion' },
    ],
    enclaveNote: 'Primary black variant had 0 inventory. Buyer Agent autonomously identified and verified in-stock silver equivalent.',
    imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=900&auto=format&fit=crop',
  },
  {
    id: 'prod_h100_cluster',
    name: 'Nebula Enterprise 10,000 H100 Cluster',
    category: 'Cloud Infrastructure',
    price: 485000,
    merchantName: 'NebulaCloud Global',
    statusBadge: 'HARD_BLOCKED (CEILING BREACH)',
    statusType: 'danger',
    specs: [
      { label: 'Capacity', val: '10,000 SXM5 Nodes' },
      { label: 'Memory', val: '800 TB HBM3 Memory' },
      { label: 'Interconnect', val: '3.2 Tbps Quantum-2 InfiniBand' },
    ],
    enclaveNote: 'Daily cumulative ceiling is ₹25,000. Hardware policy immediately rejects with zero financial exposure.',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=900&auto=format&fit=crop',
  },
];

interface ThrowableProductDeckProps {
  onSelectProduct?: (productName: string) => void;
}

export const ThrowableProductDeck: React.FC<ThrowableProductDeckProps> = ({
  onSelectProduct,
}) => {
  const [topIndex, setTopIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isThrowing, setIsThrowing] = useState<number | null>(null); // -1 (left) or 1 (right)

  const cardRef = useRef<HTMLDivElement | null>(null);
  const startPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const nextCard = useCallback((direction: number = 1) => {
    setIsThrowing(direction);
    setTimeout(() => {
      setTopIndex((prev) => (prev + 1) % DECK_PRODUCTS.length);
      setIsThrowing(null);
      setDragOffset({ x: 0, y: 0 });
    }, 240);
  }, []);

  const prevCard = useCallback(() => {
    setTopIndex((prev) => (prev - 1 + DECK_PRODUCTS.length) % DECK_PRODUCTS.length);
    setDragOffset({ x: 0, y: 0 });
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        nextCard(1);
      } else if (e.key === 'ArrowLeft') {
        prevCard();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextCard, prevCard]);

  // Pointer drag handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    if (isThrowing) return;
    setIsDragging(true);
    startPos.current = { x: e.clientX, y: e.clientY };
    if (cardRef.current) {
      cardRef.current.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - startPos.current.x;
    const dy = e.clientY - startPos.current.y;
    setDragOffset({ x: dx, y: dy });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    if (cardRef.current && cardRef.current.hasPointerCapture(e.pointerId)) {
      cardRef.current.releasePointerCapture(e.pointerId);
    }

    // Check throw threshold
    const THRESHOLD = 100;
    if (Math.abs(dragOffset.x) > THRESHOLD) {
      nextCard(dragOffset.x > 0 ? 1 : -1);
    } else {
      // Snap back smoothly
      setDragOffset({ x: 0, y: 0 });
    }
  };

  const getStatusClasses = (type: DeckProduct['statusType']) => {
    switch (type) {
      case 'success':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'warning':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'bundle':
        return 'text-[#38BDF8] bg-[#0C83FF]/10 border-[#0C83FF]/30';
      case 'recovered':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
      case 'danger':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 select-none">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.2em] text-[#38BDF8] uppercase font-bold">
            <span className="w-2 h-2 rounded-full bg-[#0C83FF]" />
            <span>Interactive Protocol Deck // UAP Catalog</span>
          </div>
          <h3 className="font-display text-2xl sm:text-3xl text-slate-100 font-bold tracking-tight mt-1">
            Physical Product Stack
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-[11px] font-mono text-slate-400">
            Drag, throw or use <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-slate-200 border border-white/10 text-[10px]">←</kbd> <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-slate-200 border border-white/10 text-[10px]">→</kbd>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={prevCard}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors"
              title="Previous card"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => nextCard(1)}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors"
              title="Next card (Throw)"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Throwable Deck Container */}
      <div className="relative h-[480px] sm:h-[420px] w-full flex items-center justify-center touch-pan-y overflow-visible">
        {DECK_PRODUCTS.map((prod, idx) => {
          // Relative position in cyclic stack (0 = top, 1 = middle, 2 = bottom)
          const stackPos = (idx - topIndex + DECK_PRODUCTS.length) % DECK_PRODUCTS.length;
          if (stackPos > 2) return null; // Only render top 3 for maximum rendering performance

          const isTop = stackPos === 0;

          // Calculate transforms
          let transform = '';
          let opacity = 1;
          let zIndex = 30 - stackPos * 10;

          if (isTop) {
            if (isThrowing !== null) {
              const xThrow = isThrowing * 700;
              const rotThrow = isThrowing * 35;
              transform = `translate3d(${xThrow}px, -40px, 0) rotate(${rotThrow}deg) scale(0.9)`;
              opacity = 0;
            } else if (isDragging) {
              const rot = dragOffset.x * 0.045;
              transform = `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0) rotate(${rot}deg) scale(1.02)`;
            } else {
              transform = 'translate3d(0px, 0px, 0) rotate(0deg) scale(1)';
            }
          } else if (stackPos === 1) {
            transform = 'translate3d(0px, 14px, 0) rotate(1.4deg) scale(0.96)';
            opacity = 0.85;
          } else if (stackPos === 2) {
            transform = 'translate3d(0px, 28px, 0) rotate(-1.8deg) scale(0.92)';
            opacity = 0.65;
          }

          return (
            <div
              key={prod.id}
              ref={isTop ? cardRef : null}
              onPointerDown={isTop ? handlePointerDown : undefined}
              onPointerMove={isTop ? handlePointerMove : undefined}
              onPointerUp={isTop ? handlePointerUp : undefined}
              onPointerCancel={isTop ? handlePointerUp : undefined}
              style={{
                transform,
                opacity,
                zIndex,
                transition: isDragging ? 'none' : 'transform 260ms cubic-bezier(0.16, 1, 0.3, 1), opacity 240ms ease',
                touchAction: 'pan-y',
              }}
              className={`absolute inset-x-0 mx-auto max-w-2xl w-full p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#0E131F]/95 backdrop-blur-xl shadow-2xl ${
                isTop ? 'cursor-grab active:cursor-grabbing hover:border-[#0C83FF]/40' : 'pointer-events-none'
              }`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                
                {/* Left: Product Thumbnail */}
                <div className="sm:col-span-4 relative aspect-[4/3] sm:aspect-square rounded-xl overflow-hidden bg-black/40 border border-white/10">
                  <img
                    src={prod.imageUrl}
                    alt={prod.name}
                    className="w-full h-full object-cover pointer-events-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-2 left-2 right-2 text-[10px] font-mono text-slate-300 truncate">
                    {prod.merchantName}
                  </div>
                </div>

                {/* Right: Product Spec & Enclave Policy */}
                <div className="sm:col-span-8 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                      {prod.category}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 text-[10px] font-mono font-bold rounded-md border ${getStatusClasses(
                        prod.statusType
                      )}`}
                    >
                      {prod.statusBadge}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-display text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
                      {prod.name}
                    </h4>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="font-mono text-2xl font-bold text-white">
                        ₹{prod.price.toLocaleString()}
                      </span>
                      {prod.originalPrice && (
                        <span className="font-mono text-xs text-slate-500 line-through">
                          ₹{prod.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Specifications */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10">
                    {prod.specs.map((s, i) => (
                      <div key={i} className="text-[10px] font-mono">
                        <div className="text-slate-500 uppercase">{s.label}</div>
                        <div className="text-slate-200 font-semibold truncate">{s.val}</div>
                      </div>
                    ))}
                  </div>

                  {/* Enclave Policy Note */}
                  <div className="p-3 rounded-lg bg-black/40 border border-white/5 text-xs text-slate-300 font-sans leading-relaxed flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#0C83FF] shrink-0 mt-0.5" />
                    <span className="text-[11px]">{prod.enclaveNote}</span>
                  </div>

                  {/* Quick Action */}
                  {onSelectProduct && (
                    <div className="pt-1 flex justify-end">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectProduct(prod.name);
                        }}
                        className="luxury-btn-primary h-9 px-4 text-[11px]"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 mr-1" />
                        <span>Dispatch to Agent Arena</span>
                      </button>
                    </div>
                  )}
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Dots & Deck Reset */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center space-x-2">
          {DECK_PRODUCTS.map((_, i) => (
            <button
              key={i}
              onClick={() => setTopIndex(i)}
              className={`h-1.5 transition-all rounded-full ${
                i === topIndex ? 'w-8 bg-[#0C83FF]' : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
              title={`Jump to card ${i + 1}`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span>Card {topIndex + 1} of {DECK_PRODUCTS.length}</span>
          <button
            onClick={() => setTopIndex(0)}
            className="p-1 text-slate-500 hover:text-slate-200 transition-colors"
            title="Reset stack to beginning"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
};
