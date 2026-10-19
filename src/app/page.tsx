"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { HeroWordmark } from "@/components/landing/hero-wordmark";
import { StatementSection } from "@/components/landing/statement-section";
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

      {/* 1. Hero: Centered messflow Wordmark & Centered Minimal Description */}
      <HeroWordmark />

      {/* 2. Core Value Statement */}
      <StatementSection />

      {/* 3. Dual Viewport Telemetry Card with Graphs */}
      <LiveProductPreview />

      {/* 4. Action Access Launchpad */}
      <ClosingCtaSection />
    </div>
  );
}
