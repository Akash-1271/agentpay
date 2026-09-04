import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  Lock,
  CheckCircle2,
  ArrowRight,
  Terminal,
  Zap,
  ShoppingBag,
  Cpu,
  Layers,
} from 'lucide-react';
import { PhyllotaxisField } from './PhyllotaxisField';
import { ThrowableProductDeck } from './ThrowableProductDeck';
import { NeuralTopology } from './NeuralTopology';
import { RazorpayLogo } from '../RazorpayLogo';
import { NavSection } from '../Sidebar';

interface CinematicLandingProps {
  onNavigate: (section: NavSection) => void;
  onRunLiveDemo: (prompt: string) => void;
}

const STAGE_LOGS = [
  {
    time: '00:00:14.102',
    actor: 'BUYER_AGENT',
    action: 'INTENT_PARSED',
    detail: 'Intent extracted: "Nike running shoes under ₹2,000" · Category: Athletics',
    badge: 'PARSED',
  },
  {
    time: '00:00:14.240',
    actor: 'UAP_CATALOG',
    action: 'SEMANTIC_MATCH',
    detail: 'Canonical match: Nike Air Zoom Pegasus 40 (₹1,899) · In-stock verified',
    badge: 'MATCHED',
  },
  {
    time: '00:00:14.398',
    actor: 'MERCHANT_AGENT',
    action: 'QUOTE_NEGOTIATED',
    detail: 'Inventory locked · Unit quote ₹1,899 generated with merchant signature',
    badge: 'SIGNED',
  },
  {
    time: '00:00:14.482',
    actor: 'SPENDING_ENCLAVE',
    action: 'POLICY_VERIFIED',
    detail: 'Single-purchase check (₹1,899 ≤ ₹2,000) & Daily ceiling check passed',
    badge: 'AUTO_APPROVED',
  },
  {
    time: '00:00:14.531',
    actor: 'FINOPS_LEDGER',
    action: 'DOUBLE_ENTRY_JOURNAL',
    detail: 'Balanced journal entry committed: Debits ₹1,899 == Credits ₹1,899',
    badge: 'BALANCED',
  },
  {
    time: '00:00:14.610',
    actor: 'RAZORPAY_API',
    action: 'ORDER_SETTLED',
    detail: 'Test order captured with HMAC-SHA256 signature · Logistics AWB generated',
    badge: 'CAPTURED',
  },
];

export const CinematicLanding: React.FC<CinematicLandingProps> = ({
  onNavigate,
  onRunLiveDemo,
}) => {
  // Scroll progress state for each pinned stage (0.0 to 1.0)
  const [p1, setP1] = useState(0);
  const [p2, setP2] = useState(0);
  const [p3, setP3] = useState(0);
  const [p4, setP4] = useState(0);
  const [activeLogRow, setActiveLogRow] = useState(0);
  const [currentStageName, setCurrentStageName] = useState('Portal Hero');

  // Stage container refs
  const stage1Ref = useRef<HTMLDivElement | null>(null);
  const stage2Ref = useRef<HTMLDivElement | null>(null);
  const stage3Ref = useRef<HTMLDivElement | null>(null);
  const stage4Ref = useRef<HTMLDivElement | null>(null);

  // Single rAF-throttled scroll handler
  useEffect(() => {
    let ticking = false;

    const calculateProgress = (el: HTMLElement | null) => {
      if (!el) return 0;
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScrollable = rect.height - windowHeight;
      if (totalScrollable <= 0) return 0;
      const progress = -rect.top / totalScrollable;
      return Math.min(1, Math.max(0, progress));
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const prog1 = calculateProgress(stage1Ref.current);
          const prog2 = calculateProgress(stage2Ref.current);
          const prog3 = calculateProgress(stage3Ref.current);
          const prog4 = calculateProgress(stage4Ref.current);

          setP1(prog1);
          setP2(prog2);
          setP3(prog3);
          setP4(prog4);

          // Update active row index only when index changes
          const nextRow = Math.min(STAGE_LOGS.length - 1, Math.floor(prog4 * STAGE_LOGS.length));
          setActiveLogRow((prev) => (prev !== nextRow ? nextRow : prev));

          // Stage breadcrumb
          if (prog4 > 0.1) setCurrentStageName('04 · Verification Log');
          else if (prog3 > 0.1) setCurrentStageName('03 · Iris Enclave');
          else if (prog2 > 0.1) setCurrentStageName('02 · Perimeter Statement');
          else setCurrentStageName('01 · Portal Hero');

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="relative bg-[#080B11] text-[#F1F5F9] font-sans selection:bg-[#0C83FF]/30 selection:text-white">
      
      {/* Film Grain Subtle Overlay */}
      <div className="film-grain-overlay" />

      {/* Floating Cinematic Glass Header */}
      <header className="fixed top-4 inset-x-4 sm:inset-x-8 max-w-6xl mx-auto z-50 flex items-center justify-between px-5 py-3 rounded-2xl bg-[#0E131F]/70 backdrop-blur-xl border border-white/10 shadow-2xl">
        <div className="flex items-center space-x-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#0C83FF] shadow-[0_0_8px_#0C83FF]" />
          <span className="font-display text-base font-bold text-white tracking-tight">
            Agent<span className="text-[#0C83FF]">Pay</span>
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded-md text-[9px] font-mono tracking-widest uppercase bg-white/5 border border-white/10 text-slate-400">
            Track 01
          </span>
        </div>

        {/* Dynamic Stage Pill */}
        <div className="hidden md:flex items-center space-x-2 text-[11px] font-mono text-slate-400">
          <span className="text-slate-600">//</span>
          <span className="text-[#38BDF8] tracking-widest uppercase">{currentStageName}</span>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigate('overview')}
            className="hidden sm:inline-flex text-xs font-mono text-slate-300 hover:text-white px-3 py-1.5 transition-colors"
          >
            Console
          </button>
          <button
            onClick={() => onNavigate('agent')}
            className="luxury-btn-primary h-9 px-4 text-xs"
          >
            <span>Enter Arena</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>
      </header>

      {/* ───────────────────────────────────────────────────────────
          STAGE 1: PORTAL HERO (≈ 260vh)
          Layers: Backdrop Image -> Veil -> Parting Panels -> Wordmark & Dots
          ─────────────────────────────────────────────────────────── */}
      <div ref={stage1Ref} className="relative h-[260vh]">
        <div className="sticky top-0 h-screen w-full overflow-hidden isolate">
          
          {/* Layer 1: Full-Bleed Photographic Backdrop settling from 1.25 -> 1.0 */}
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              transform: `scale(${1.22 - p1 * 0.22})`,
              transition: 'transform 100ms ease-out',
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2000&auto=format&fit=crop"
              alt="Neural Commerce Infrastructure"
              className="w-full h-full object-cover filter brightness-[0.45] contrast-[1.15]"
            />
          </div>

          {/* Layer 2: Soft Duotone Radial Veil */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#080B11]/50 via-transparent to-[#080B11] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_20%,_#080B11_85%)] pointer-events-none" />

          {/* Layer 3: Solid Parting Panels (Starts Closed at p1 = 0) */}
          <div
            className="absolute top-0 bottom-0 left-0 w-1/2 bg-[#080B11] border-r border-white/10 z-20 will-change-transform"
            style={{
              transform: `translate3d(-${p1 * 105}%, 0, 0)`,
            }}
          />
          <div
            className="absolute top-0 bottom-0 right-0 w-1/2 bg-[#080B11] border-l border-white/10 z-20 will-change-transform"
            style={{
              transform: `translate3d(${p1 * 105}%, 0, 0)`,
            }}
          />

          {/* Layer 4: Accent Dots Traveling to Opposite Corners */}
          <div
            className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-[#0C83FF] shadow-[0_0_12px_#0C83FF] z-30 pointer-events-none will-change-transform"
            style={{
              transform: `translate3d(calc(-50% - ${p1 * 260}px), calc(-50% - ${p1 * 200}px), 0)`,
              opacity: Math.max(0, 1 - p1 * 1.2),
            }}
          />
          <div
            className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-[#E8913C] shadow-[0_0_12px_#E8913C] z-30 pointer-events-none will-change-transform"
            style={{
              transform: `translate3d(calc(-50% + ${p1 * 260}px), calc(-50% + ${p1 * 200}px), 0)`,
              opacity: Math.max(0, 1 - p1 * 1.2),
            }}
          />

          {/* Layer 5: Split Wordmark "Agent" + "Pay" Scaling & Tightening */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none select-none px-4"
            style={{
              opacity: Math.max(0, 1 - Math.max(0, (p1 - 0.7) / 0.3)),
            }}
          >
            <div
              className="flex items-center font-display text-6xl sm:text-8xl md:text-9xl font-extrabold text-white tracking-tight will-change-transform"
              style={{
                transform: `scale(${1.0 + p1 * 0.15})`,
                letterSpacing: `${0.02 - p1 * 0.05}em`,
              }}
            >
              <span
                className="inline-block transition-transform duration-75"
                style={{ transform: `translate3d(-${p1 * 150}px, 0, 0)` }}
              >
                Agent
              </span>
              <span
                className="inline-block text-[#0C83FF] transition-transform duration-75"
                style={{ transform: `translate3d(${p1 * 150}px, 0, 0)` }}
              >
                Pay
              </span>
            </div>

            <div className="mt-4 flex items-center space-x-3 text-xs sm:text-sm font-mono tracking-[0.25em] text-slate-400 uppercase">
              <span>Scroll to open portal</span>
              <span className="inline-block animate-bounce text-[#0C83FF]">↓</span>
            </div>
          </div>

          {/* Bottom Fixed Descriptor on Stage 1 */}
          <div className="absolute bottom-8 inset-x-8 flex justify-between items-end z-20 pointer-events-none text-slate-400 font-mono text-[10px] tracking-widest uppercase">
            <div>AP2 PROTOCOL // RAZORPAY 2026</div>
            <div>SCROLL PROGRESS: {Math.round(p1 * 100)}%</div>
          </div>

        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────
          STAGE 2: STATEMENT / FRAME OPEN (≈ 200vh)
          Photo clip-path opens from inset(32% 28% round 8px) -> full bleed
          ─────────────────────────────────────────────────────────── */}
      <div ref={stage2Ref} className="relative h-[200vh]">
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center isolate">
          
          {/* Expanding Clip-Path Image Frame */}
          <div
            className="absolute inset-0 w-full h-full will-change-transform"
            style={{
              clipPath: `inset(${(1 - p2) * 32}% ${(1 - p2) * 28}% round ${(1 - p2) * 8}px)`,
              transition: 'clip-path 80ms ease-out',
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1920&auto=format&fit=crop"
              alt="Cryptographic Perimeter Architecture"
              className="w-full h-full object-cover filter brightness-50 contrast-125"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080B11] via-transparent to-[#080B11]/80" />
          </div>

          {/* Large Accent Numeral "01" */}
          <div
            className="absolute top-16 left-8 sm:left-16 font-mono text-7xl sm:text-9xl font-bold text-white/5 pointer-events-none select-none z-10"
            style={{ opacity: Math.min(1, p2 * 1.4) }}
          >
            01
          </div>

          {/* Statement Scrim & Narrative */}
          <div
            className="relative z-20 max-w-4xl mx-auto px-6 text-center space-y-6"
            style={{
              opacity: Math.min(1, Math.max(0, (p2 - 0.15) / 0.7)),
              transform: `translate3d(0, ${(1 - p2) * 30}px, 0)`,
            }}
          >
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono tracking-widest text-[#38BDF8] uppercase">
              <span>Section II // The Perimeter Requirement</span>
            </div>

            <h2 className="font-display text-3xl sm:text-5xl md:text-6xl text-white font-bold tracking-tight leading-tight">
              Autonomous intelligence demands an{' '}
              <span className="text-[#38BDF8] italic font-light">immutable</span>{' '}
              financial perimeter.
            </h2>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-sans leading-relaxed">
              When software negotiates and moves capital on behalf of humans, soft prompt guardrails are fatal. AgentPay locks purchasing within mathematical bounds: per-transaction ceilings, daily caps, and verified merchant allow-lists.
            </p>
          </div>

        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────
          STAGE 3: IRIS / REVEAL (≈ 200vh)
          Circular clip-path circle(0% -> 80% at center)
          ─────────────────────────────────────────────────────────── */}
      <div ref={stage3Ref} className="relative h-[200vh]">
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-[#080B11] isolate">
          
          {/* Outer Dark Substrate with Difference Headline */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10 pointer-events-none"
            style={{
              opacity: Math.max(0, 1 - Math.max(0, (p3 - 0.6) / 0.35)),
            }}
          >
            <span className="text-xs font-mono tracking-[0.3em] uppercase text-slate-500 mb-2">
              AP2 ENCLAVE RESOLUTION
            </span>
            <h2 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold text-white tracking-tight">
              Expanding Iris of <span className="italic font-light text-[#E8913C]">Attestation</span>
            </h2>
          </div>

          {/* Circular Iris Expanding (0% to 80%) */}
          <div
            className="absolute inset-0 w-full h-full will-change-transform z-20"
            style={{
              clipPath: `circle(${p3 * 85}% at 50% 50%)`,
              transition: 'clip-path 70ms ease-out',
            }}
          >
            <div className="relative w-full h-full bg-[#0E131F] flex items-center justify-center p-8">
              <img
                src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1920&auto=format&fit=crop"
                alt="Cryptographic Enclave Grid"
                className="absolute inset-0 w-full h-full object-cover opacity-20 filter contrast-150"
              />
              <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#0E131F]/90 to-[#080B11]" />

              {/* Revealed Content inside Iris */}
              <div className="relative z-30 max-w-3xl text-center space-y-6">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-[#0C83FF]/10 border border-[#0C83FF]/30 flex items-center justify-center text-[#38BDF8]">
                  <Lock className="w-6 h-6" />
                </div>

                <h3 className="font-display text-2xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
                  Zero Credential Leakage. Zero Prompt Drift.
                </h3>

                {/* Secondary Monospace Caption (Fades in after circle is halfway open) */}
                <div
                  className="font-mono text-xs sm:text-sm text-slate-300 tracking-wider uppercase border-t border-b border-white/10 py-3"
                  style={{
                    opacity: Math.min(1, Math.max(0, (p3 - 0.45) / 0.45)),
                  }}
                >
                  HARDWARE-GRADE SPENDING ENCLAVE · DOUBLE-ENTRY FINOPS · RAZORPAY TEST API SETTLEMENT
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────
          STAGE 4: CUMULATIVE LOG + PHYLLOTAXIS FIELD (≈ 220vh)
          Two-column: Live timestamped rows on left, Phyllotaxis canvas on right
          ─────────────────────────────────────────────────────────── */}
      <div ref={stage4Ref} className="relative h-[220vh]">
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center px-4 sm:px-8 lg:px-16 bg-[#080B11] isolate">
          
          <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Cumulative Timestamped Rows (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center space-x-2 text-[10px] font-mono tracking-[0.25em] text-[#38BDF8] uppercase font-bold">
                <Terminal className="w-4 h-4 text-[#0C83FF]" />
                <span>Deterministic Execution Log // AP2 Trail</span>
              </div>

              <h3 className="font-display text-2xl sm:text-4xl text-white font-bold tracking-tight">
                Cumulative Verification Stream
              </h3>

              {/* Rows lighting one by one */}
              <div className="space-y-2 pt-2">
                {STAGE_LOGS.map((step, idx) => {
                  const isReached = idx <= activeLogRow;
                  const isCurrent = idx === activeLogRow;

                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border transition-all duration-300 font-mono text-xs ${
                        isCurrent
                          ? 'border-[#0C83FF] bg-[#131929] shadow-[0_0_20px_rgba(12,131,255,0.15)] text-white'
                          : isReached
                          ? 'border-white/10 bg-white/[0.02] text-slate-300'
                          : 'border-transparent text-slate-600 opacity-40'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] pb-1">
                        <div className="flex items-center space-x-2">
                          <span className={isCurrent ? 'text-[#38BDF8] font-bold' : 'text-slate-500'}>
                            {step.time}
                          </span>
                          <span className="text-slate-400">[{step.actor}]</span>
                        </div>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                            isCurrent
                              ? 'bg-[#0C83FF]/20 text-[#38BDF8] border border-[#0C83FF]/30'
                              : isReached
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-white/5 text-slate-600'
                          }`}
                        >
                          {step.badge}
                        </span>
                      </div>
                      <div className="text-xs font-sans mt-0.5 leading-snug">
                        <span className="font-semibold text-slate-200">{step.action}:</span> {step.detail}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: High-Performance Canvas Phyllotaxis Field (5 cols) */}
            <div className="lg:col-span-5 h-[380px] sm:h-[460px] rounded-2xl border border-white/10 bg-[#0E131F]/80 backdrop-blur-xl overflow-hidden relative">
              <PhyllotaxisField speed={0.0007} />
            </div>

          </div>

        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────
          NORMAL FLOW POST-PINNED BANDS
          1. Guarantees Grid
          2. Throwable Product Deck
          3. Multi-Agent Neural Topology
          4. Close & Product CTA
          ─────────────────────────────────────────────────────────── */}
      <div className="relative z-20 space-y-32 py-24 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto border-t border-white/10 bg-[#080B11]">
        
        {/* Band 1: Mathematical Guarantees */}
        <section className="space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="text-[10px] font-mono tracking-[0.25em] text-[#38BDF8] uppercase font-bold">
              Guaranteed Invariants
            </div>
            <h3 className="font-display text-3xl sm:text-4xl text-white font-bold tracking-tight">
              Three Non-Bypassable Financial Perimeters
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel-luxury p-8 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#0C83FF]/10 border border-[#0C83FF]/30 flex items-center justify-center text-[#0C83FF]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-display text-lg font-bold text-white">Bounded Spending Enclave</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Every AI purchase undergoes deterministic server-side policy validation prior to order creation. Autonomous purchases over ₹2,000 halt for human passkeys.
              </p>
              <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest pt-2">
                ✓ Non-Bypassable Policy
              </div>
            </div>

            <div className="glass-panel-luxury p-8 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Lock className="w-5 h-5" />
              </div>
              <h4 className="font-display text-lg font-bold text-white">Zero Card Exposure</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                The agent never touches raw PANs, CVVs, or bank tokens. All money movement executes via cryptographically signed AP2 delegation mandates and Razorpay test rails.
              </p>
              <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest pt-2">
                ✓ Zero Credential Drift
              </div>
            </div>

            <div className="glass-panel-luxury p-8 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h4 className="font-display text-lg font-bold text-white">Double-Entry FinOps</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Every transaction generates balanced double-entry accounting records in SQLite with idempotency key protection, preventing replay attacks and duplicate billing.
              </p>
              <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest pt-2">
                ✓ Debits == Credits Invariant
              </div>
            </div>
          </div>
        </section>

        {/* Band 2: Throwable Product Deck */}
        <section className="pt-8">
          <ThrowableProductDeck
            onSelectProduct={(productName) => {
              onNavigate('agent');
              onRunLiveDemo(`Purchase ${productName} with priority delivery`);
            }}
          />
        </section>

        {/* Band 3: Multi-Agent Neural Topology */}
        <section className="pt-8">
          <NeuralTopology />
        </section>

        {/* Band 4: Cinematic Close & Product CTA */}
        <section className="relative p-8 sm:p-14 rounded-3xl border border-white/10 bg-gradient-to-b from-[#0E131F] to-[#080B11] text-center space-y-8 overflow-hidden">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#0C83FF]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <span className="text-[10px] font-mono tracking-[0.25em] text-[#38BDF8] uppercase font-bold">
              Ready for Autonomous Commerce
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-bold text-white tracking-tight">
              The era of manual checkout is over.
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed">
              Step into the agent arena. Explore the machine-readable catalog, test dynamic upsells, and observe real-time cryptographic settlement on Razorpay.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <button
              onClick={() => onNavigate('agent')}
              className="luxury-btn-primary h-12 px-8 text-xs w-full sm:w-auto"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              <span>Launch Agent Arena</span>
            </button>
            <button
              onClick={() => onNavigate('overview')}
              className="luxury-btn-secondary h-12 px-8 text-xs w-full sm:w-auto"
            >
              <span>Explore Dashboard</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>

          <div className="pt-6 border-t border-white/5 flex flex-wrap items-center justify-center gap-6 text-[10px] font-mono text-slate-500 uppercase tracking-widest relative z-10">
            <span>Razorpay AI Buildathon 2026</span>
            <span>·</span>
            <span>Track 01: Agentic Commerce</span>
            <span>·</span>
            <span>14/14 Automated Tests Passing</span>
          </div>
        </section>

      </div>

    </div>
  );
};
