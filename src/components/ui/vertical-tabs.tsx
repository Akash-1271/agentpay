"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const SERVICES = [
  {
    id: "01",
    title: "Natural Intent",
    description:
      "Buyer prompt parsed into a canonical merchant query. Agents understand natural language spending goals and constraints.",
    image:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200",
  },
  {
    id: "02",
    title: "UAP Discovery",
    description:
      "Real-time merchant inventory lock, automatic dynamic bundle discounts, and cryptographically signed quotes.",
    image:
      "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=1200",
  },
  {
    id: "03",
    title: "Enclave Gating",
    description:
      "Deterministic verification against spending policies. Biometric passkey step-up when limits are exceeded.",
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200",
  },
  {
    id: "04",
    title: "Razorpay Settle",
    description:
      "Test-mode capture, GST-compliant tax invoice generation, and real-time courier tracking assignment.",
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
  autoplayInterval = 5000,
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

  return (
    <div
      className={cn(
        "w-full bg-[#F9F8F6] text-[#1A1A1A] py-12 md:py-20",
        className
      )}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-16 gap-4 border-b border-[#1A1A1A]/10 pb-6">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#D4AF37] font-semibold block mb-2">
              (PROTOCOL)
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#1A1A1A] tracking-tight">
              How Autonomous Commerce Settles
            </h2>
          </div>

          <div className="flex items-center gap-2 self-start md:self-end">
            <button
              onClick={handlePrev}
              aria-label="Previous step"
              className="p-3 border border-[#1A1A1A]/15 hover:border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#FFFFFF] text-[#1A1A1A] transition-all duration-300 rounded-full"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next step"
              className="p-3 border border-[#1A1A1A]/15 hover:border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#FFFFFF] text-[#1A1A1A] transition-all duration-300 rounded-full"
            >
              <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
          
          {/* Left: Tab Items */}
          <div className="lg:col-span-6 flex flex-col space-y-4 md:space-y-6 order-2 lg:order-1">
            {services.map((service, index) => {
              const isActive = activeIndex === index;

              return (
                <div
                  key={service.id}
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    "cursor-pointer p-5 md:p-6 border transition-all duration-500 rounded-2xl relative overflow-hidden",
                    isActive
                      ? "border-[#1A1A1A] bg-[#FFFFFF] shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
                      : "border-[#1A1A1A]/10 bg-transparent hover:border-[#1A1A1A]/30 hover:bg-[#FFFFFF]/50"
                  )}
                >
                  {/* Active Progress Bar */}
                  {isActive && (
                    <motion.div
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
                            className="text-xs sm:text-sm text-[#1A1A1A]/70 font-sans leading-relaxed pt-1"
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
            <div className="relative aspect-[4/3] md:aspect-[16/10] w-full overflow-hidden rounded-2xl md:rounded-3xl border border-[#1A1A1A]/15 bg-[#EBE5DE] shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeIndex}
                  src={services[activeIndex].image}
                  alt={services[activeIndex].title}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </AnimatePresence>

              {/* Floating ID badge */}
              <div className="absolute bottom-4 right-4 bg-[#1A1A1A]/80 backdrop-blur-md px-3 py-1 text-[10px] font-mono font-bold text-[#FFFFFF] rounded-full border border-white/20">
                STAGE {services[activeIndex].id} / 04
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default VerticalTabs;
