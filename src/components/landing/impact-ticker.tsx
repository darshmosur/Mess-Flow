"use client";

import { motion } from "motion/react";
import { TrendingDown, Zap, ShieldCheck, Clock } from "lucide-react";

export function ImpactTicker() {
  const metrics = [
    {
      icon: TrendingDown,
      value: "38%",
      label: "Food Waste Reduction",
      sub: "Measured against standard hostel batch cooking",
      color: "text-emerald-400",
      accent: "border-emerald-500/30 bg-emerald-950/20",
    },
    {
      icon: Zap,
      value: "< 1.5s",
      label: "1-Tap RSVP Speed",
      sub: "Zero friction mobile attendance logging",
      color: "text-violet-400",
      accent: "border-violet-500/30 bg-violet-950/20",
    },
    {
      icon: Clock,
      value: "100%",
      label: "Cutoff Enforcement",
      sub: "Automated lock guarantees kitchen prep stability",
      color: "text-amber-400",
      accent: "border-amber-500/30 bg-amber-950/20",
    },
    {
      icon: ShieldCheck,
      value: "PostgreSQL",
      label: "Row Level Security",
      sub: "Database isolation for student & manager records",
      color: "text-zinc-200",
      accent: "border-white/10 bg-zinc-900/50",
    },
  ];

  return (
    <div className="w-full border-y border-white/[0.08] bg-[#0c0c10]/90 backdrop-blur-md relative z-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {metrics.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.08 }}
                className={`p-3.5 rounded-xl border ${item.accent} flex flex-col justify-between`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-2xl sm:text-3xl font-bold font-mono tracking-tight ${item.color}`}>
                    {item.value}
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-400">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-zinc-200 tracking-tight">
                    {item.label}
                  </h4>
                  <p className="text-[10px] text-zinc-500 leading-tight mt-0.5 font-mono">
                    {item.sub}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
