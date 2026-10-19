"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, X, Clock, ShieldAlert, Utensils, TrendingUp, Sparkles, UserCheck } from "lucide-react";
import { BklitBarChart } from "@/components/charts/bklit-bar-chart";

export function LiveProductPreview() {
  const [activeTab, setActiveTab] = React.useState<"both" | "student" | "manager">("both");
  const [studentChoice, setStudentChoice] = React.useState<"attending" | "skipping">("attending");
  const [safetyBuffer, setSafetyBuffer] = React.useState<number>(5);

  // Dynamic calculated mock dataset based on student toggle
  const baseConfirmed = studentChoice === "attending" ? 342 : 341;
  const expectedPrep = Math.round(baseConfirmed * (1 + safetyBuffer / 100) + 18);

  const previewChartData = [
    { label: "BREAKFAST", confirmed: 285, expected: 305 },
    { label: "LUNCH", confirmed: 390, expected: 415 },
    { label: "DINNER", confirmed: baseConfirmed, expected: expectedPrep },
  ];

  return (
    <section className="relative py-24 sm:py-32 px-4 sm:px-8 border-t border-white/[0.07] max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-10 sm:mb-16">
        <span className="text-xs font-mono uppercase tracking-widest text-violet-400">
          03 / Live Interface Simulator
        </span>
        <div className="h-[1px] flex-1 bg-white/[0.07]" />
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-white leading-tight">
            Dual-viewport <span className="font-serif italic text-violet-400">telemetry</span>.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-400 max-w-lg">
            Test the student RSVP action below and observe how kitchen prep batch sizes update instantly on the manager telemetry deck.
          </p>
        </div>

        {/* View Switcher Controls */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-900/90 border border-white/10 self-start md:self-auto">
          <button
            onClick={() => setActiveTab("both")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              activeTab === "both"
                ? "bg-violet-600 text-white font-semibold shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Split View
          </button>
          <button
            onClick={() => setActiveTab("student")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              activeTab === "student"
                ? "bg-violet-600 text-white font-semibold shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Student Mobile
          </button>
          <button
            onClick={() => setActiveTab("manager")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              activeTab === "manager"
                ? "bg-violet-600 text-white font-semibold shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Manager Deck
          </button>
        </div>
      </div>

      {/* Dual Interactive Simulator Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Student Mobile Interface Preview */}
        {(activeTab === "both" || activeTab === "student") && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className={`${
              activeTab === "both" ? "lg:col-span-5" : "lg:col-span-8 lg:col-start-3"
            } editorial-card rounded-2xl p-6 sm:p-7 border-violet-500/20`}
          >
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-violet-600/20 border border-violet-500/40 flex items-center justify-center text-violet-400">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Student Portal</div>
                  <div className="text-[10px] font-mono text-zinc-400">Hostel Block B • Room 304</div>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                ACTIVE SESSION
              </span>
            </div>

            {/* Simulated Active Meal Card */}
            <div className="p-4 rounded-xl bg-zinc-950/70 border border-white/[0.08] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-violet-400">
                  Dinner • Today
                </span>
                <span className="text-[10px] font-mono text-zinc-500 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-400" />
                  Cutoff in 45m
                </span>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-white">Paneer Butter Masala & Rotis</h4>
                <p className="text-xs text-zinc-400 mt-0.5">Steamed basmati rice, dal tadka, cucumber salad.</p>
              </div>

              {/* Interactive RSVP Buttons */}
              <div className="pt-2 flex items-center gap-2.5">
                <button
                  onClick={() => setStudentChoice("attending")}
                  className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                    studentChoice === "attending"
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30 scale-[1.02]"
                      : "bg-zinc-900 text-zinc-400 border border-white/10 hover:text-white"
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Attending</span>
                </button>

                <button
                  onClick={() => setStudentChoice("skipping")}
                  className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                    studentChoice === "skipping"
                      ? "bg-rose-600 text-white shadow-md shadow-rose-600/30 scale-[1.02]"
                      : "bg-zinc-900 text-zinc-400 border border-white/10 hover:text-white"
                  }`}
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Skipping</span>
                </button>
              </div>

              <div className="text-[10px] font-mono text-center text-zinc-500 pt-1">
                {studentChoice === "attending"
                  ? "✓ Attending registered in PostgreSQL"
                  : "✗ Skipping registered in PostgreSQL"}
              </div>
            </div>
          </motion.div>
        )}

        {/* Manager Telemetry Preview */}
        {(activeTab === "both" || activeTab === "manager") && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`${
              activeTab === "both" ? "lg:col-span-7" : "lg:col-span-10 lg:col-start-2"
            } editorial-card rounded-2xl p-6 sm:p-7 border-violet-500/20 space-y-5`}
          >
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Manager Kitchen Analytics</div>
                  <div className="text-[10px] font-mono text-zinc-400">bklit UI VisX Telemetry Engine</div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-zinc-400">Buffer:</span>
                {[0, 5, 10].map((val) => (
                  <button
                    key={val}
                    onClick={() => setSafetyBuffer(val)}
                    className={`px-2 py-0.5 rounded text-[11px] cursor-pointer transition-colors ${
                      safetyBuffer === val
                        ? "bg-violet-600 text-white font-bold"
                        : "bg-zinc-900 text-zinc-400 hover:text-white"
                    }`}
                  >
                    +{val}%
                  </button>
                ))}
              </div>
            </div>

            {/* Integrated bklit UI Bar Chart */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
                <span className="text-white font-semibold">Today&apos;s Attendance vs Planned Batch</span>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 text-violet-400">
                    <span className="w-2 h-2 rounded-full bg-violet-500" />
                    Confirmed
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Target Prep
                  </span>
                </div>
              </div>

              <BklitBarChart data={previewChartData} height={200} />
            </div>

            {/* Real-time KPI footer */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/[0.08] text-xs font-mono">
              <div>
                <span className="text-zinc-500 text-[10px] block">DINNER TARGET</span>
                <span className="text-emerald-400 font-bold text-sm">{expectedPrep} plates</span>
              </div>
              <div>
                <span className="text-zinc-500 text-[10px] block">CONFIRMED ATTENDING</span>
                <span className="text-white font-bold text-sm">{baseConfirmed}</span>
              </div>
              <div>
                <span className="text-zinc-500 text-[10px] block">EST. FOOD SAVED</span>
                <span className="text-violet-400 font-bold text-sm">~42 kg</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
