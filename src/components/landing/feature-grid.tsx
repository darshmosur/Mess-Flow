"use client";

import { motion } from "motion/react";
import { CheckCircle2, Clock, BarChart3, ShieldCheck } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function FeatureGrid() {
  const features = [
    {
      icon: CheckCircle2,
      title: "1-Tap Student Attendance",
      description:
        "Students indicate attending or skipping for each meal slot in under 2 seconds. Seamless mobile layout.",
      tag: "Students",
    },
    {
      icon: Clock,
      title: "Enforced Cutoff Timers",
      description:
        "Database constraints lock updates prior to meal service, preventing kitchen guesswork and surge volatility.",
      tag: "Rule Engine",
    },
    {
      icon: BarChart3,
      title: "Transparent Heuristic Buffer",
      description:
        "Calculates exact batch quantities with adjustable safety buffers. No hidden or fabricated predictions.",
      tag: "Managers",
    },
    {
      icon: ShieldCheck,
      title: "PostgreSQL Row Isolation",
      description:
        "Strict Row Level Security (RLS) ensures students view only their own records, and managers access telemetry.",
      tag: "Security",
    },
  ];

  return (
    <section className="py-16 md:py-24 border-t border-white/[0.08] relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Heading with whileInView */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mb-12"
        >
          <span className="text-xs font-mono font-medium text-violet-400 uppercase tracking-wider">
            Operational Architecture
          </span>
          <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Engineered for hostel dining predictability.
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            A verified feedback loop connecting student attendance directly to kitchen batch requirements.
          </p>
        </motion.div>

        {/* 4-Item Dense Grid with staggered entrance */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
              >
                <Card className="bg-[#111116]/80 hover:border-violet-500/40 hover:bg-[#15151e] transition-all duration-200 group h-full flex flex-col justify-between">
                  <CardHeader className="p-5 pb-2">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center text-violet-400 group-hover:border-violet-500/40 group-hover:text-violet-300 transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-white/5">
                        {feat.tag}
                      </span>
                    </div>
                    <CardTitle className="text-sm font-semibold text-zinc-100">
                      {feat.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-5 pt-1">
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {feat.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
