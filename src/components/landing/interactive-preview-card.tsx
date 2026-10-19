"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { Check, X, Clock, Flame, Sparkles, ChefHat } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DemoMeal {
  id: string;
  name: string;
  timeSlot: string;
  cutoff: string;
  menu: string[];
  status: "attending" | "skipping" | "unselected";
  calories: string;
}

export function InteractivePreviewCard() {
  const [meals, setMeals] = React.useState<DemoMeal[]>([
    {
      id: "lunch",
      name: "Today's Lunch",
      timeSlot: "12:30 PM - 02:30 PM",
      cutoff: "10:30 AM",
      menu: ["Rajma Masala", "Jeera Rice", "Roti", "Fresh Salad"],
      status: "attending",
      calories: "620 kcal",
    },
    {
      id: "dinner",
      name: "Tonight's Dinner",
      timeSlot: "07:30 PM - 09:30 PM",
      cutoff: "05:30 PM",
      menu: ["Paneer Butter Masala", "Tandoori Roti", "Dal Tadka", "Gulab Jamun"],
      status: "unselected",
      calories: "740 kcal",
    },
  ]);

  // 3D Tilt handling
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 25 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleToggle = (id: string, newStatus: "attending" | "skipping") => {
    setMeals((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, status: m.status === newStatus ? "unselected" : newStatus } : m
      )
    );
  };

  return (
    <div
      className="relative w-full max-w-xl mx-auto py-2"
      style={{ perspective: 1200 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Violet Glow Aura */}
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-violet-600/25 via-violet-500/10 to-violet-800/20 blur-xl opacity-75 group-hover:opacity-100 transition duration-700 pointer-events-none" />

      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative rounded-2xl bg-[#111116]/95 border border-white/10 p-5 sm:p-6 backdrop-blur-xl shadow-2xl shadow-black/80"
      >
        {/* Card Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <ChefHat className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold tracking-tight text-white">
                  Student RSVP Interface
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-violet-950/80 text-violet-300 border border-violet-800/50">
                  <Sparkles className="w-2.5 h-2.5 mr-1 text-violet-400" />
                  Live Demo
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                1-tap attendance registration before cutoffs
              </p>
            </div>
          </div>
          <Badge variant="violet" className="text-[10px] tracking-wider font-mono">
            Hostel Mess A
          </Badge>
        </div>

        {/* Meal Cards List */}
        <div className="mt-4 space-y-3">
          {meals.map((meal) => {
            const isAttending = meal.status === "attending";
            const isSkipping = meal.status === "skipping";

            return (
              <div
                key={meal.id}
                className="rounded-xl bg-[#15151c] border border-white/[0.06] p-3.5 transition-all duration-200 hover:border-violet-500/30"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-zinc-100 tracking-tight">
                        {meal.name}
                      </h4>
                      <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-zinc-400" />
                        Cutoff: {meal.cutoff}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                      {meal.menu.map((item, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] px-2 py-0.5 rounded bg-zinc-900/90 text-zinc-300 border border-white/5"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
                      <Flame className="w-3 h-3 text-amber-400/80" />
                      {meal.calories}
                    </span>
                  </div>
                </div>

                {/* RSVP Action Toggle */}
                <div className="mt-3 pt-2.5 border-t border-white/[0.05] flex items-center justify-between">
                  <div className="text-[11px] text-zinc-400">
                    Status:{" "}
                    {isAttending && (
                      <span className="font-semibold text-emerald-400">Attending</span>
                    )}
                    {isSkipping && (
                      <span className="font-semibold text-rose-400">Skipping</span>
                    )}
                    {!isAttending && !isSkipping && (
                      <span className="font-mono text-amber-400">Pending choice</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleToggle(meal.id, "attending")}
                      className={`px-3 py-1 rounded-md text-xs font-medium cursor-pointer transition-all duration-150 flex items-center gap-1 border ${
                        isAttending
                          ? "bg-emerald-600 text-white border-emerald-400 shadow-md shadow-emerald-600/30"
                          : "bg-zinc-900/80 text-zinc-400 border-white/10 hover:text-white hover:border-emerald-500/40"
                      }`}
                    >
                      <Check className="w-3 h-3" />
                      <span>Attending</span>
                    </button>

                    <button
                      onClick={() => handleToggle(meal.id, "skipping")}
                      className={`px-3 py-1 rounded-md text-xs font-medium cursor-pointer transition-all duration-150 flex items-center gap-1 border ${
                        isSkipping
                          ? "bg-rose-600 text-white border-rose-400 shadow-md shadow-rose-600/30"
                          : "bg-zinc-900/80 text-zinc-400 border-white/10 hover:text-white hover:border-rose-500/40"
                      }`}
                    >
                      <X className="w-3 h-3" />
                      <span>Skipping</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Card Footer Micro-Note */}
        <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-zinc-400 font-mono">
          <span>Target Cutoff Protocol Active</span>
          <span className="text-violet-400">Zero Food Waste Objective</span>
        </div>
      </motion.div>
    </div>
  );
}
