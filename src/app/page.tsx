"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { HeroWordmark } from "@/components/landing/hero-wordmark";
import { ProblemSection } from "@/components/landing/problem-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { LiveProductPreview } from "@/components/landing/live-product-preview";
import { ClosingCtaSection } from "@/components/landing/closing-cta-section";

export default function HomePage() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Restrained scroll-driven ambient violet depth lighting
  const glowY = useTransform(scrollYProgress, [0, 1], ["-10%", "80%"]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.4, 0.8, 1], [0.18, 0.24, 0.16, 0.22]);

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden bg-background">
      {/* Ambient Radial Violet Lighting Layer */}
      <motion.div
        style={{
          y: glowY,
          opacity: glowOpacity,
        }}
        className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[550px] rounded-full bg-violet-600/18 blur-[160px] -z-10"
      />

      {/* 1. Hero: Oversized messflow Wordmark & Primary Actions */}
      <HeroWordmark />

      {/* 2. The Problem: Operational Volatility & Overprep Waste */}
      <ProblemSection />

      {/* 3. How It Works: Student RSVP to Calibrated Batch Prep */}
      <HowItWorksSection />

      {/* 4. Live Product Preview: Dual Interactive Viewport with bklit UI Chart */}
      <LiveProductPreview />

      {/* 5. Closing CTA: Editorial Portal Direct Access */}
      <ClosingCtaSection />
    </div>
  );
}
