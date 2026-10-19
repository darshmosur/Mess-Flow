"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { HeroSection } from "@/components/landing/hero-section";
import { ScrollPerspectiveCanvas } from "@/components/landing/scroll-perspective-canvas";
import { FeatureGrid } from "@/components/landing/feature-grid";
import { RoleLaunchSection } from "@/components/landing/role-launch-section";

export default function HomePage() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Ambient lighting responding smoothly to viewport scroll
  const glowY = useTransform(scrollYProgress, [0, 1], ["0%", "80%"]);
  const glowScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.25, 0.9]);

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden">
      {/* Scroll-driven Ambient Violet Lighting Layer */}
      <motion.div
        style={{
          y: glowY,
          scale: glowScale,
        }}
        className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-violet-600/15 blur-[130px] -z-10"
      />

      <HeroSection />

      {/* Distinctive 3D Scroll-Driven Perspective Section */}
      <section className="relative py-12 md:py-20 border-t border-white/[0.08] bg-radial-violet">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-xs font-mono font-medium text-violet-400 uppercase tracking-wider">
              3D Interactive Viewport
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-white">
              Scroll-driven operational clarity.
            </h2>
            <p className="mt-2 text-sm text-zinc-400 max-w-xl mx-auto">
              Rotate through real meal cycles as you scroll. Every attendance change propagates directly into kitchen batch targets.
            </p>
          </motion.div>
        </div>

        <ScrollPerspectiveCanvas />
      </section>

      <FeatureGrid />
      <RoleLaunchSection />
    </div>
  );
}
