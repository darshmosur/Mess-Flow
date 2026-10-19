"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, UserCheck, ShieldAlert, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InteractivePreviewCard } from "@/components/landing/interactive-preview-card";

export function HeroSection() {
  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-radial-violet">
      {/* Background Subtle Grid Texture */}
      <div className="absolute inset-0 bg-grid-subtle opacity-40 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Direct, High-Signal Pitch */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Restrained Pill */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-violet-950/70 text-violet-300 border border-violet-500/30 mb-5"
            >
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span>Predictive Hostel Mess Management</span>
            </motion.div>

            {/* Tight Typography Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter text-white leading-[1.08] max-w-2xl"
            >
              Zero food waste. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-violet-300 to-purple-200">
                Predictive meal prep.
              </span>
            </motion.h1>

            {/* Punchy, Non-Fluff Value Statement */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-4 text-base sm:text-lg text-zinc-300 font-normal leading-relaxed max-w-xl"
            >
              Students indicate meal attendance with a single tap before daily cutoffs.
              Mess managers view exact headcount demand and prepare precise quantities.
            </motion.p>

            {/* Clear Call-to-Actions: Student & Manager Portals */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 flex flex-wrap items-center gap-3 w-full sm:w-auto"
            >
              <Link href="/login?role=student" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto gap-2 text-sm font-semibold">
                  <UserCheck className="w-4 h-4" />
                  <span>Student Portal</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>

              <Link href="/login?role=manager" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto gap-2 text-sm font-semibold border-white/15 hover:border-violet-500/50 hover:bg-violet-950/30"
                >
                  <ShieldAlert className="w-4 h-4 text-violet-400" />
                  <span>Mess Manager Portal</span>
                </Button>
              </Link>
            </motion.div>

            {/* High-Density Key Specs */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-10 pt-6 border-t border-white/[0.08] w-full grid grid-cols-3 gap-4"
            >
              <div>
                <span className="block text-xl sm:text-2xl font-bold font-mono text-white tracking-tight">
                  1 Tap
                </span>
                <span className="text-[11px] sm:text-xs text-zinc-400 uppercase tracking-wider font-medium">
                  Student RSVP
                </span>
              </div>
              <div>
                <span className="block text-xl sm:text-2xl font-bold font-mono text-violet-400 tracking-tight">
                  Automated
                </span>
                <span className="text-[11px] sm:text-xs text-zinc-400 uppercase tracking-wider font-medium">
                  Cutoff Timers
                </span>
              </div>
              <div>
                <span className="block text-xl sm:text-2xl font-bold font-mono text-emerald-400 tracking-tight">
                  Real-time
                </span>
                <span className="text-[11px] sm:text-xs text-zinc-400 uppercase tracking-wider font-medium">
                  Demand Headcount
                </span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: 3D Interactive Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="lg:col-span-5 flex justify-center"
          >
            <InteractivePreviewCard />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
