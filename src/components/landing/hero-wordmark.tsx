"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { ArrowRight, UserCheck, ShieldAlert, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroWordmark() {
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Mouse position values for restrained cursor-reactive tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 28, stiffness: 220, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [4, -4]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-5, 5]);
  const wordmarkTranslateX = useTransform(smoothX, [-0.5, 0.5], [-12, 12]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[92vh] flex flex-col justify-between pt-12 pb-16 px-4 sm:px-8 max-w-7xl mx-auto overflow-hidden"
    >
      {/* Top Meta Status Line */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.07] pb-5">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500" />
          </span>
          <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
            Hostel Kitchen Telemetry v1.0
          </span>
        </div>

        <div className="text-[11px] font-mono text-zinc-500 hidden sm:block">
          ZERO FOOD WASTE INITIATIVE • SYSTEM ACTIVE
        </div>
      </div>

      {/* Main Hero Center: Dominant Editorial Wordmark */}
      <div className="my-auto py-10 sm:py-16 flex flex-col items-start w-full">
        <motion.div
          style={{
            rotateX,
            rotateY,
            x: wordmarkTranslateX,
            transformPerspective: 1200,
          }}
          className="w-full select-none cursor-default"
        >
          {/* Lowercase massive responsive wordmark with two complementary fonts */}
          <div className="w-full flex items-baseline tracking-[-0.06em] leading-[0.82] overflow-hidden py-2">
            {/* "mess" — bold contemporary sans-serif */}
            <motion.span
              initial={{ y: "110%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="font-editorial-sans text-[20vw] sm:text-[21vw] md:text-[22vw] text-white inline-block font-black pr-1 sm:pr-2 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
            >
              mess
            </motion.span>

            {/* "flow" — elegant italic serif */}
            <motion.span
              initial={{ y: "110%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.95, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-editorial-serif text-[21vw] sm:text-[22vw] md:text-[23vw] text-violet-400 inline-block font-normal italic relative -ml-1 sm:-ml-2"
            >
              flow
            </motion.span>
          </div>
        </motion.div>

        {/* Minimal Editorial Proposition & Fast Actions */}
        <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-8 mt-6 sm:mt-12 items-end">
          {/* Headline & Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="md:col-span-7 space-y-3"
          >
            <h1 className="text-xl sm:text-2xl md:text-3xl font-medium tracking-tight text-zinc-100 max-w-xl">
              Predictive meal planning for hostel mess operations.
            </h1>
            <p className="text-sm sm:text-base text-zinc-400 max-w-lg leading-relaxed">
              Students confirm attendance before meal cutoff. Mess managers prepare accurate batches with zero guesswork and zero waste.
            </p>
          </motion.div>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="md:col-span-5 flex flex-col sm:flex-row items-stretch sm:items-center md:justify-end gap-3.5"
          >
            <Link href="/login?role=student" className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-auto h-12 px-6 rounded-full text-sm font-semibold tracking-wide flex items-center justify-center gap-2 group shadow-lg shadow-violet-600/25"
              >
                <UserCheck className="w-4 h-4 text-violet-200" />
                <span>I&apos;m a student</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <Link href="/login?role=manager" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto h-12 px-6 rounded-full text-sm font-semibold border-white/10 hover:border-violet-500/50 hover:bg-violet-950/20 text-zinc-300 hover:text-white"
              >
                <ShieldAlert className="w-4 h-4 text-violet-400" />
                <span>Mess manager login</span>
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Hero Footnote Ticker */}
      <div className="pt-6 border-t border-white/[0.07] grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono text-zinc-400">
        <div>
          <span className="text-zinc-600 block text-[10px] uppercase">Telemetry</span>
          <span className="text-zinc-300">Live PostgreSQL RLS</span>
        </div>
        <div>
          <span className="text-zinc-600 block text-[10px] uppercase">Accuracy</span>
          <span className="text-violet-400">±3% Servings Target</span>
        </div>
        <div>
          <span className="text-zinc-600 block text-[10px] uppercase">Cutoff Mode</span>
          <span className="text-zinc-300">Synchronized Locks</span>
        </div>
        <div>
          <span className="text-zinc-600 block text-[10px] uppercase">Deployment</span>
          <span className="text-emerald-400">Production Ready</span>
        </div>
      </div>
    </section>
  );
}
