"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const AUTO_PLAY_DURATION = 6500;

export const SERVICES = [
  {
    id: "01",
    title: "Natural Intent",
    description:
      "Buyer prompts are parsed into canonical merchant queries. Agents understand natural-language spending goals, constraints, and merchant preferences with zero ambiguity.",
    image:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200",
  },
  {
    id: "02",
    title: "UAP Discovery",
    description:
      "Real-time merchant inventory locking, automatic dynamic bundle discounts, and cryptographically signed quotes delivered in a single deterministic handshake.",
    image:
      "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=1200",
  },
  {
    id: "03",
    title: "Enclave Gating",
    description:
      "Hardware-grade policy verification against spending limits and authorized merchants. Biometric passkey step-up is triggered the moment any boundary is exceeded.",
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200",
  },
  {
    id: "04",
    title: "Razorpay Settle",
    description:
      "Test-mode capture, GST-compliant tax invoice generation, and real-time courier tracking assignment — all executed with cryptographic proof and zero card exposure.",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200",
  },
];

export interface VerticalTabsProps {
  services?: typeof SERVICES;
  autoplayInterval?: number;
  className?: string;
}

export function VerticalTabs({
  services = SERVICES,
  autoplayInterval = AUTO_PLAY_DURATION,
  className,
}: VerticalTabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % services.length);
  }, [services.length]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + services.length) % services.length);
  }, [services.length]);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      handleNext();
    }, autoplayInterval);

    return () => clearInterval(timer);
  }, [activeIndex, isPaused, autoplayInterval, handleNext]);

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
        "w-full bg-[#F9F8F6] text-[#1A1A1A] py-16 md:py-24 outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37]/50",
        className
      )}
      aria-label="How Autonomous Commerce Settles Interactive Protocol Steps"
    >
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-4 border-b border-[#1A1A1A]/10 pb-6">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#D4AF37] font-semibold block mb-2">
              (PROTOCOL)
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#1A1A1A] tracking-tight">
              How Autonomous Commerce Settles
            </h2>
          </div>

          <div className="flex items-center gap-2 self-start md:self-end">
            <button
              onClick={handlePrev}
              aria-label="Previous protocol step"
              className="p-3 border border-[#1A1A1A]/15 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 text-[#1A1A1A] transition-all duration-300 rounded-full"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next protocol step"
              className="p-3 border border-[#1A1A1A]/15 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 text-[#1A1A1A] transition-all duration-300 rounded-full"
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
                    "cursor-pointer p-5 md:p-6 border transition-all duration-500 rounded-3xl relative overflow-hidden outline-none",
                    isActive
                      ? "border-[#1A1A1A] bg-[#FFFFFF] shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
                      : "border-[#1A1A1A]/10 bg-transparent hover:border-[#1A1A1A]/30 hover:bg-[#FFFFFF]/50 focus-visible:border-[#D4AF37]"
                  )}
                >
                  {/* Active Gold Progress Bar */}
                  {isActive && (
                    <motion.div
                      key={activeIndex}
                      className="absolute top-0 left-0 bottom-0 w-1 bg-[#D4AF37]"
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
                        isActive ? "text-[#D4AF37]" : "text-[#1A1A1A]/40"
                      )}
                    >
                      {service.id}
                    </span>

                    <div className="flex-1 space-y-1.5">
                      <h3
                        className={cn(
                          "font-serif text-lg md:text-xl font-bold transition-colors duration-300",
                          isActive ? "text-[#1A1A1A]" : "text-[#1A1A1A]/70"
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
                            className="text-xs sm:text-sm text-[#1A1A1A]/60 font-sans leading-relaxed pt-1"
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

          {/* Right: Image Display with Gold Accent Overlay */}
          <div className="lg:col-span-6 order-1 lg:order-2">
            <div className="relative aspect-[4/3] md:aspect-[16/10] w-full overflow-hidden rounded-3xl md:rounded-[2.5rem] border border-[#1A1A1A]/10 bg-[#EBE5DE] shadow-[0_16px_48px_rgba(0,0,0,0.06)] group">
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

              {/* Subtle Gold Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/30 via-transparent to-[#D4AF37]/10 pointer-events-none" />

              {/* Bottom Counter & Stage Badge */}
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between pointer-events-none">
                <div className="bg-[#FFFFFF]/90 backdrop-blur-md px-3.5 py-1 text-xs font-mono font-bold text-[#1A1A1A] rounded-full border border-[#1A1A1A]/10 shadow-sm">
                  {services[activeIndex].id} / 04
                </div>

                <div className="bg-[#1A1A1A]/90 backdrop-blur-md px-3.5 py-1 text-[10px] font-mono font-bold text-[#FFFFFF] rounded-full border border-white/20 shadow-sm uppercase tracking-wider">
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
