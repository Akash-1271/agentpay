import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";

interface ProtocolStep {
  id: string;
  title: string;
  description: string;
  image: string;
}

const services: ProtocolStep[] = [
  {
    id: "01",
    title: "Zero-Trust Intent Ingestion",
    description:
      "Autonomous buyer agents ingest unstructured commercial intent with fine-grained semantic extraction and user session attestation.",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "02",
    title: "Cryptographic Enclave Mandate",
    description:
      "AP2 policy contracts enforce single-transaction caps, daily cumulative thresholds, and merchant category whitelist verification.",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "03",
    title: "Double-Entry Ledger Invariant",
    description:
      "Debit and credit movements are mathematically verified before payment handoff, ensuring deterministic atomicity across all accounts.",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "04",
    title: "Razorpay Atomic Settlement",
    description:
      "Instant order generation, automated webhook verification, and HMAC-signed receipts delivered straight to merchant ERPs.",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80",
  },
];

interface VerticalTabsProps {
  className?: string;
  autoplayInterval?: number;
}

export function VerticalTabs({
  className,
  autoplayInterval = 5000,
}: VerticalTabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % services.length);
    }, autoplayInterval);
  };

  useEffect(() => {
    if (!isPaused) {
      startTimer();
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, autoplayInterval]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % services.length);
    if (!isPaused) startTimer();
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + services.length) % services.length);
    if (!isPaused) startTimer();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      handleNext();
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      handlePrev();
    }
  };

  return (
    <section
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      className={cn(
        "w-full bg-[#000000] text-white py-16 md:py-24 outline-none",
        className
      )}
      aria-label="How Autonomous Commerce Settles Interactive Protocol Steps"
    >
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-4 border-b border-[#1F1F1F] pb-6">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-zinc-400 font-semibold block mb-2">
              (PROTOCOL)
            </span>
            <h2 className="font-playfair italic text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
              How Autonomous Commerce Settles
            </h2>
          </div>

          <div className="flex items-center gap-2 self-start md:self-end">
            <button
              onClick={handlePrev}
              aria-label="Previous protocol step"
              className="p-3 border border-[#1F1F1F] hover:border-white/40 hover:bg-white/[0.04] text-white transition-all duration-300 rounded-full"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next protocol step"
              className="p-3 border border-[#1F1F1F] hover:border-white/40 hover:bg-white/[0.04] text-white transition-all duration-300 rounded-full"
            >
              <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
          
          {/* Left: Interactive Tab Items */}
          <div className="lg:col-span-6 flex flex-col space-y-4 md:space-y-5 order-2 lg:order-1">
            {services.map((service, index) => {
              const isActive = activeIndex === index;

              return (
                <div
                  key={service.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setActiveIndex(index)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setActiveIndex(index);
                    }
                  }}
                  className={cn(
                    "cursor-pointer p-5 md:p-6 border transition-all duration-500 rounded-2xl relative overflow-hidden outline-none",
                    isActive
                      ? "border-white/30 bg-[#0D0D0D] shadow-[0_8px_30px_rgba(0,0,0,0.6)]"
                      : "border-[#1F1F1F] bg-[#0A0A0A] hover:border-zinc-700 hover:bg-[#0D0D0D]"
                  )}
                >
                  {/* Active White Progress Bar */}
                  {isActive && (
                    <motion.div
                      key={activeIndex}
                      className="absolute top-0 left-0 bottom-0 w-1 bg-white"
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{
                        duration: autoplayInterval / 1000,
                        ease: "linear",
                      }}
                      style={{ originY: 0 }}
                    />
                  )}

                  <div className="flex items-start gap-4">
                    <span
                      className={cn(
                        "font-mono text-xs font-bold pt-1 transition-colors duration-300",
                        isActive ? "text-white" : "text-zinc-600"
                      )}
                    >
                      {service.id}
                    </span>

                    <div className="flex-1 space-y-1.5">
                      <h3
                        className={cn(
                          "font-playfair italic text-lg md:text-xl font-bold transition-colors duration-300",
                          isActive ? "text-white" : "text-zinc-400"
                        )}
                      >
                        {service.title}
                      </h3>

                      <AnimatePresence initial={false}>
                        {isActive && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.35, ease: "easeInOut" }}
                            className="text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed pt-1"
                          >
                            {service.description}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Image Display */}
          <div className="lg:col-span-6 order-1 lg:order-2">
            <div className="relative aspect-[4/3] md:aspect-[16/10] w-full overflow-hidden rounded-2xl md:rounded-3xl border border-[#1F1F1F] bg-[#0A0A0A] shadow-[0_16px_48px_rgba(0,0,0,0.6)] group">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeIndex}
                  src={services[activeIndex].image}
                  alt={services[activeIndex].title}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </AnimatePresence>

              {/* Subtle Dark Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

              {/* Bottom Counter & Stage Badge */}
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between pointer-events-none">
                <div className="bg-[#0D0D0D]/90 backdrop-blur-md px-3.5 py-1 text-xs font-mono font-bold text-white rounded-full border border-[#1F1F1F] shadow-sm">
                  {services[activeIndex].id} / 04
                </div>

                <div className="bg-[#0D0D0D]/90 backdrop-blur-md px-3.5 py-1 text-[10px] font-mono font-bold text-zinc-300 rounded-full border border-[#1F1F1F] shadow-sm uppercase tracking-wider">
                  {services[activeIndex].title}
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

export default VerticalTabs;
