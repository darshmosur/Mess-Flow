"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { HeroSection } from "@/components/landing/hero-section";
import { FeatureGrid } from "@/components/landing/feature-grid";
import { RoleLaunchSection } from "@/components/landing/role-launch-section";

export default function HomePage() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Scroll-driven visual depth effect on subtle ambient glow
  const glowY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 0.4, 0.2]);

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden">
      {/* Scroll-driven Ambient Violet Lighting Layer */}
      <motion.div
        style={{
          y: glowY,
          opacity: glowOpacity,
        }}
        className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-violet-600/15 blur-[120px] -z-10"
      />

      <HeroSection />
      <FeatureGrid />
      <RoleLaunchSection />
    </div>
  );
}
