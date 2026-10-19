"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, X, ChefHat, Sparkles, Sliders, ArrowRight, Activity, Flame, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MealSim {
  id: "breakfast" | "lunch" | "dinner";
  title: string;
  items: string;
  status: "attending" | "skipping" | "unselected";
  cutoff: string;
}

export function LiveSimulator() {
  const [meals, setMeals] = React.useState<MealSim[]>([
    {
      id: "breakfast",
      title: "South Indian Breakfast",
      items: "Masala Dosa, Sambar, Coconut Chutney",
      status: "attending",
      cutoff: "06:30 AM",
    },
    {
      id: "lunch",
      title: "Punjabi Lunch Thali",
      items: "Rajma Masala, Steamed Rice, Phulka, Raita",
      status: "unselected",
      cutoff: "10:30 AM",
    },
    {
      id: "dinner",
      title: "Royal Dinner Feast",
      items: "Paneer Butter Masala, Dal Makhani, Naan, Rice",
      status: "attending",
      cutoff: "06:00 PM",
    },
  ]);

  const [baseHeadcount, setBaseHeadcount] = React.useState(284);
  const [lastAction, setLastAction] = React.useState<string | null>("Student toggled Dinner: Attending");

  const toggleMeal = (id: "breakfast" | "lunch" | "dinner", newStatus: "attending" | "skipping") => {
    setMeals((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const toggled = m.status === newStatus ? "unselected" : newStatus;
          return { ...m, status: toggled };
        }
        return m;
      })
    );

    // Dynamic headcount simulation
    setBaseHeadcount((prev) => (newStatus === "attending" ? prev + 1 : Math.max(150, prev - 1)));
    setLastAction(`Toggled ${id.toUpperCase()} → ${newStatus === "attending" ? "Confirmed Attending" : "Skipping"}`);
  };

  // Calculated dynamic ingredient requirements based on current baseHeadcount
  const targetPlates = Math.round(baseHeadcount * 1.05); // +5% safety buffer
  const riceKg = (targetPlates * 0.12).toFixed(1);
  const dalKg = (targetPlates * 0.08).toFixed(1);
  const rotisCount = Math.round(targetPlates * 2.5);

  return (
    <section className="py-16 md:py-24 border-t border-white/[0.08] relative bg-radial-violet">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header: Zero Fluff */}
        <div className="max-w-2xl mb-10">
          <span className="text-xs font-mono font-medium text-violet-400 uppercase tracking-wider">
            Live Interactive Simulator
          </span>
          <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Test the closed-loop attendance engine.
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Toggle your choices below to see real-time kitchen batch prep metrics recalculate instantly.
          </p>
        </div>

        {/* 2-Column Simulator Shell */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Student Action Cards */}
          <div className="lg:col-span-6 space-y-3">
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs font-mono font-semibold text-zinc-300 uppercase tracking-wider">
                Student App Simulation
              </span>
              <span className="text-[10px] font-mono text-zinc-500">
                1-Tap Response Protocol
              </span>
            </div>

            {meals.map((meal) => {
              const isAttending = meal.status === "attending";
              const isSkipping = meal.status === "skipping";

              return (
                <div
                  key={meal.id}
                  className={`p-4 rounded-xl border transition-all duration-200 ${
                    isAttending
                      ? "bg-[#111914] border-emerald-500/40"
                      : isSkipping
                      ? "bg-[#181113] border-rose-500/40"
                      : "bg-[#121218] border-white/10"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono uppercase tracking-wider font-semibold text-violet-400">
                          {meal.id}
                        </span>
                        <span className="text-[11px] text-zinc-500 font-mono">
                          Cutoff: {meal.cutoff}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-white mt-0.5">
                        {meal.title}
                      </h4>
                      <p className="text-xs text-zinc-400 mt-0.5">{meal.items}</p>
                    </div>

                    <div className="shrink-0">
                      {isAttending && (
                        <Badge variant="emerald" className="text-[10px] font-mono">
                          Attending
                        </Badge>
                      )}
                      {isSkipping && (
                        <Badge variant="rose" className="text-[10px] font-mono">
                          Skipping
                        </Badge>
                      )}
                      {!isAttending && !isSkipping && (
                        <Badge variant="amber" className="text-[10px] font-mono">
                          Pending
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="pt-2.5 mt-2.5 border-t border-white/[0.06] flex items-center justify-end gap-2">
                    <button
                      onClick={() => toggleMeal(meal.id, "attending")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all flex items-center gap-1.5 border ${
                        isAttending
                          ? "bg-emerald-600 text-white border-emerald-400 shadow-md shadow-emerald-600/30"
                          : "bg-zinc-900/90 text-zinc-400 border-white/10 hover:text-white hover:border-emerald-500/40"
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Attending</span>
                    </button>

                    <button
                      onClick={() => toggleMeal(meal.id, "skipping")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all flex items-center gap-1.5 border ${
                        isSkipping
                          ? "bg-rose-600 text-white border-rose-400 shadow-md shadow-rose-600/30"
                          : "bg-zinc-900/90 text-zinc-400 border-white/10 hover:text-white hover:border-rose-500/40"
                      }`}
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Skipping</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Live Kitchen Telemetry Output */}
          <div className="lg:col-span-6 rounded-2xl bg-[#12121a] border border-violet-500/30 p-5 sm:p-6 glass-panel-glow">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-violet-600/20 border border-violet-500/40 flex items-center justify-center text-violet-400">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white tracking-tight">
                    Kitchen Telemetry Dispatch
                  </h3>
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live Calculation Active
                  </span>
                </div>
              </div>

              <Badge variant="violet" className="text-[10px] font-mono">
                +5% Buffer
              </Badge>
            </div>

            {/* Target Servings Live Counter */}
            <div className="py-5 text-center border-b border-white/[0.08]">
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 block">
                Calculated Batch Target
              </span>
              <motion.span
                key={targetPlates}
                initial={{ scale: 1.15, color: "#a78bfa" }}
                animate={{ scale: 1, color: "#ffffff" }}
                transition={{ duration: 0.25 }}
                className="text-4xl sm:text-5xl font-bold font-mono tracking-tight block mt-1"
              >
                {targetPlates} <span className="text-base text-violet-400 font-sans font-normal">plates</span>
              </motion.span>
              <span className="text-[11px] font-mono text-zinc-500 mt-1 block">
                {baseHeadcount} confirmed attendees + {targetPlates - baseHeadcount} safety buffer plates
              </span>
            </div>

            {/* Raw Ingredient Batch Scaling */}
            <div className="py-4 space-y-2.5 border-b border-white/[0.08]">
              <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block">
                Scaled Kitchen Ingredients
              </span>

              <div className="grid grid-cols-3 gap-2 font-mono">
                <div className="p-2.5 rounded-lg bg-zinc-900/90 border border-white/5 text-center">
                  <span className="text-xs text-zinc-400 block">Grain (Rice)</span>
                  <span className="text-base font-bold text-white block mt-0.5">{riceKg} kg</span>
                  <span className="text-[9px] text-zinc-500 block">0.12kg/plate</span>
                </div>

                <div className="p-2.5 rounded-lg bg-zinc-900/90 border border-white/5 text-center">
                  <span className="text-xs text-zinc-400 block">Lentils (Dal)</span>
                  <span className="text-base font-bold text-white block mt-0.5">{dalKg} kg</span>
                  <span className="text-[9px] text-zinc-500 block">0.08kg/plate</span>
                </div>

                <div className="p-2.5 rounded-lg bg-zinc-900/90 border border-white/5 text-center">
                  <span className="text-xs text-zinc-400 block">Bread (Roti)</span>
                  <span className="text-base font-bold text-white block mt-0.5">{rotisCount} pcs</span>
                  <span className="text-[9px] text-zinc-500 block">2.5 pcs/plate</span>
                </div>
              </div>
            </div>

            {/* Real-time Status Ticker */}
            <div className="pt-3 flex items-center justify-between text-[11px] font-mono text-zinc-400">
              <span className="truncate">{lastAction}</span>
              <span className="text-violet-400 shrink-0">Updated Real-time</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
