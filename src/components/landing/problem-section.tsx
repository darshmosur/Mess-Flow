"use client";

import * as React from "react";
import { motion } from "motion/react";
import { AlertCircle, TrendingDown, Scale } from "lucide-react";

export function ProblemSection() {
  return (
    <section className="relative py-24 sm:py-32 px-4 sm:px-8 border-t border-white/[0.07] max-w-7xl mx-auto">
      {/* Section Label */}
      <div className="flex items-center gap-3 mb-10 sm:mb-16">
        <span className="text-xs font-mono uppercase tracking-widest text-violet-400">
          01 / The Problem
        </span>
        <div className="h-[1px] flex-1 bg-white/[0.07]" />
      </div>

      {/* Dominant Headline */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="max-w-4xl space-y-6"
      >
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-light tracking-tight text-zinc-100 leading-[1.08]">
          When attendance is uncertain, kitchens are forced to cook for <span className="font-serif italic text-violet-400">everyone</span>.
        </h2>
        <p className="text-base sm:text-xl text-zinc-400 font-light max-w-2xl leading-relaxed">
          Without verified headcount signals, hostel managers guess daily portions. The outcome is chronic overpreparation, budget erosion, and preventable food disposal.
        </p>
      </motion.div>

      {/* Editorial Metric Strips */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mt-16 sm:mt-24 pt-12 border-t border-white/[0.07]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-3"
        >
          <div className="text-4xl sm:text-6xl font-black font-editorial-sans text-white tracking-tighter">
            38%
          </div>
          <div className="text-xs font-mono uppercase tracking-wider text-violet-400">
            Average Overprep Variance
          </div>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Bulk kitchens cook baseline buffers to prevent sudden stockouts, discarding excess prep when students dine elsewhere.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-3"
        >
          <div className="text-4xl sm:text-6xl font-black font-editorial-sans text-white tracking-tighter">
            120kg
          </div>
          <div className="text-xs font-mono uppercase tracking-wider text-rose-400">
            Weekly Scrap Per 500 Students
          </div>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Edible cooked meals dumped daily due to unscheduled student departures, weekend trips, and unrecorded skips.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-3"
        >
          <div className="text-4xl sm:text-6xl font-black font-editorial-sans text-white tracking-tighter">
            0-Lag
          </div>
          <div className="text-xs font-mono uppercase tracking-wider text-emerald-400">
            Direct RSVP Telemetry
          </div>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Replacing assumption guesswork with one-tap student declarations locked strictly before pantry batch fires.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
