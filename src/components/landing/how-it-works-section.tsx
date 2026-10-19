"use client";

import * as React from "react";
import { motion } from "motion/react";
import { CheckCircle2, Clock, Cpu, ChefHat } from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    {
      step: "01",
      title: "Student Confirmation",
      tagline: "One-tap meal commitment",
      description:
        "Students indicate Attending or Skipping for upcoming breakfast, lunch, and dinner before the meal's cutoff window locks.",
      accent: "text-violet-400",
    },
    {
      step: "02",
      title: "PostgreSQL Telemetry",
      tagline: "Atomic database deduplication",
      description:
        "Row Level Security policies prevent spoofing and enforce strict uniqueness constraints. Responses aggregate in real-time.",
      accent: "text-white",
    },
    {
      step: "03",
      title: "Batch Calibration",
      tagline: "Calculated preparation buffers",
      description:
        "The mess manager views verified headcounts, applies transparent turnout assumptions, and translates plate targets into raw ingredient weights.",
      accent: "text-emerald-400",
    },
  ];

  return (
    <section className="relative py-24 sm:py-32 px-4 sm:px-8 border-t border-white/[0.07] max-w-7xl mx-auto">
      {/* Section Label */}
      <div className="flex items-center gap-3 mb-12 sm:mb-16">
        <span className="text-xs font-mono uppercase tracking-widest text-violet-400">
          02 / Architecture & Flow
        </span>
        <div className="h-[1px] flex-1 bg-white/[0.07]" />
      </div>

      <div className="max-w-3xl mb-16 sm:mb-20">
        <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-white leading-tight">
          From student pocket to <span className="font-serif italic text-violet-400">steaming cauldron</span>.
        </h2>
        <p className="mt-4 text-base text-zinc-400 max-w-xl">
          A synchronized feedback loop engineered to convert student attendance signals into calibrated pantry batch weights.
        </p>
      </div>

      {/* 3 Step Editorial Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((item, idx) => (
          <motion.div
            key={item.step}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: idx * 0.15 }}
            className="editorial-card p-6 sm:p-8 rounded-2xl flex flex-col justify-between group hover:border-violet-500/30"
          >
            <div>
              <div className="flex items-center justify-between mb-8">
                <span className="font-mono text-xs text-zinc-500 group-hover:text-zinc-300 transition-colors">
                  PHASE {item.step}
                </span>
                <span className={`text-xs font-mono uppercase ${item.accent}`}>
                  {item.tagline}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-semibold text-white tracking-tight mb-3">
                {item.title}
              </h3>

              <p className="text-sm text-zinc-400 leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-zinc-500">
              <span>LATENCY: &lt;100MS</span>
              <span className="text-violet-400">SECURE RLS</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
