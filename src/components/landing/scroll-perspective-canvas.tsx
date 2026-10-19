"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ChefHat, Check, X, ShieldAlert, Sparkles, TrendingDown, Users, Flame, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function ScrollPerspectiveCanvas() {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // 3D Perspective scroll-driven transformations
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], ["20deg", "0deg", "-15deg"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.88, 1, 0.92]);
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [80, 0, -50]);
  const borderOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.1, 0.35, 0.15]);

  // Parallax floating depth layers
  const floatBadgeY1 = useTransform(scrollYProgress, [0, 1], [30, -50]);
  const floatBadgeY2 = useTransform(scrollYProgress, [0, 1], [-40, 40]);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-5xl mx-auto py-12 px-4 sm:px-6"
      style={{ perspective: 1400 }}
    >
      {/* Scroll-driven 3D Main Stage */}
      <motion.div
        style={{
          rotateX,
          scale,
          y,
          transformStyle: "preserve-3d",
        }}
        className="relative rounded-2xl bg-gradient-to-b from-[#14141d]/95 to-[#0d0d12]/95 border border-white/10 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl shadow-violet-950/20"
      >
        {/* Parallax Floating Telemetry Pill 1 (Depth Layer) */}
        <motion.div
          style={{ y: floatBadgeY1, translateZ: 60 }}
          className="hidden md:flex absolute -top-5 -left-4 items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900/90 border border-emerald-500/30 backdrop-blur-md shadow-xl text-xs font-mono text-emerald-300"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Real-time RSVP: 88% Participation</span>
        </motion.div>

        {/* Parallax Floating Telemetry Pill 2 (Depth Layer) */}
        <motion.div
          style={{ y: floatBadgeY2, translateZ: 60 }}
          className="hidden md:flex absolute -bottom-5 -right-4 items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900/90 border border-violet-500/40 backdrop-blur-md shadow-xl text-xs font-mono text-violet-300"
        >
          <TrendingDown className="w-3.5 h-3.5 text-violet-400" />
          <span>Kitchen Buffer Engine Active (+5%)</span>
        </motion.div>

        {/* Terminal Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-5 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/40 flex items-center justify-center text-violet-400">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold tracking-tight text-white">
                  MessFlow Operational Telemetry Preview
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-violet-950 text-violet-400 border border-violet-800">
                  LIVE PERSPECTIVE
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Closed-loop synchronization: Student intent directly instructs kitchen prep
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>PostgreSQL RLS Active</span>
          </div>
        </div>

        {/* Visual Simulated Operations Grid */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Dinner Slot Simulation */}
          <div className="rounded-xl bg-[#171722] border border-violet-500/30 p-4 relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase tracking-wider text-violet-400 font-semibold">
                Dinner Service
              </span>
              <Badge variant="emerald" className="text-[10px] font-mono">
                Confirmed (92%)
              </Badge>
            </div>
            <h4 className="text-sm font-semibold text-white">Royal Feast Thali</h4>
            <div className="flex flex-wrap gap-1 mt-2 text-[10px] text-zinc-400">
              <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-white/5">Paneer Butter</span>
              <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-white/5">Dal Makhani</span>
              <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-white/5">Rice</span>
            </div>
            <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between font-mono text-xs">
              <span className="text-zinc-400">Prep Target:</span>
              <span className="text-emerald-400 font-bold">285 Servings</span>
            </div>
          </div>

          {/* Lunch Slot Simulation */}
          <div className="rounded-xl bg-[#14141e] border border-white/10 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                Lunch Service
              </span>
              <Badge variant="violet" className="text-[10px] font-mono">
                Cutoff Passed
              </Badge>
            </div>
            <h4 className="text-sm font-semibold text-zinc-200">Punjabi Lunch Thali</h4>
            <div className="flex flex-wrap gap-1 mt-2 text-[10px] text-zinc-400">
              <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-white/5">Rajma Masala</span>
              <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-white/5">Jeera Rice</span>
              <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-white/5">Phulka</span>
            </div>
            <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between font-mono text-xs">
              <span className="text-zinc-400">Plates Cooked:</span>
              <span className="text-zinc-200 font-bold">310 Servings</span>
            </div>
          </div>

          {/* Tomorrow Breakfast Simulation */}
          <div className="rounded-xl bg-[#14141e] border border-white/10 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                Tomorrow Breakfast
              </span>
              <Badge variant="outline" className="text-[10px] font-mono">
                RSVP Open
              </Badge>
            </div>
            <h4 className="text-sm font-semibold text-zinc-200">South Indian Breakfast</h4>
            <div className="flex flex-wrap gap-1 mt-2 text-[10px] text-zinc-400">
              <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-white/5">Masala Dosa</span>
              <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-white/5">Sambar</span>
              <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-white/5">Chutney</span>
            </div>
            <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between font-mono text-xs">
              <span className="text-zinc-400">Current RSVP:</span>
              <span className="text-amber-400 font-bold">198 Indicating</span>
            </div>
          </div>
        </div>

        {/* Micro-Metrics Bar */}
        <div className="mt-6 pt-4 border-t border-white/[0.08] grid grid-cols-2 sm:grid-cols-4 gap-4 text-center font-mono">
          <div>
            <span className="text-lg font-bold text-white tracking-tight">100%</span>
            <span className="block text-[10px] text-zinc-500 uppercase tracking-wider">Uniqueness Guard</span>
          </div>
          <div>
            <span className="text-lg font-bold text-violet-400 tracking-tight">&lt; 0.5s</span>
            <span className="block text-[10px] text-zinc-500 uppercase tracking-wider">Attendance Latency</span>
          </div>
          <div>
            <span className="text-lg font-bold text-emerald-400 tracking-tight">0 Overprep</span>
            <span className="block text-[10px] text-zinc-500 uppercase tracking-wider">With Strict Cutoff</span>
          </div>
          <div>
            <span className="text-lg font-bold text-amber-400 tracking-tight">PostgreSQL</span>
            <span className="block text-[10px] text-zinc-500 uppercase tracking-wider">Row Level Security</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
