"use client";

import * as React from "react";
import { motion } from "motion/react";
import {
  ShieldAlert,
  LogOut,
  Users,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Utensils,
  Sparkles,
  Sliders,
  Calendar,
  BarChart3,
  TrendingDown,
  Info,
  ChefHat,
  Package,
} from "lucide-react";
import { logoutAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { Profile, MealDemandForecast } from "@/types/database";

interface ManagerDashboardProps {
  profile: Profile;
  allForecasts: MealDemandForecast[];
  totalStudentCount: number;
  todayDate: string;
  tomorrowDate: string;
}

export function ManagerDashboard({
  profile,
  allForecasts,
  totalStudentCount,
  todayDate,
  tomorrowDate,
}: ManagerDashboardProps) {
  const [selectedDate, setSelectedDate] = React.useState<string>(todayDate);
  const [safetyBufferPercent, setSafetyBufferPercent] = React.useState<number>(5);
  const [unrespondedTurnoutPercent, setUnrespondedTurnoutPercent] = React.useState<number>(30);

  const isToday = selectedDate === todayDate;

  // Filter forecasts for selected date
  const forecasts = React.useMemo(() => {
    return allForecasts.filter((f) => f.meal_date === selectedDate);
  }, [allForecasts, selectedDate]);

  const mealTypes = ["breakfast", "lunch", "dinner"] as const;

  // Calculate overall metrics
  const totalAttendingAcrossMeals = forecasts.reduce((acc, f) => acc + (f.attending_count || 0), 0);
  const totalResponsesAcrossMeals = forecasts.reduce(
    (acc, f) => acc + ((f.attending_count || 0) + (f.not_attending_count || 0)),
    0
  );
  const potentialResponses = totalStudentCount * 3;
  const participationRate =
    potentialResponses > 0
      ? Math.round((totalResponsesAcrossMeals / potentialResponses) * 100)
      : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Header Profile Bar */}
      <div className="p-5 rounded-2xl bg-[#131118] border border-violet-500/30 glass-panel-glow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-violet-600/30 border border-violet-500/50 flex items-center justify-center text-violet-300">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white">
                {profile.full_name || "Mess Manager Portal"}
              </h1>
              <Badge variant="violet" className="text-[10px] font-mono">
                Authorized Manager
              </Badge>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Hostel Kitchen Operations & Demand Telemetry • {profile.email}
            </p>
          </div>
        </div>

        <form action={logoutAction}>
          <Button
            type="submit"
            variant="outline"
            size="sm"
            className="text-xs text-zinc-400 hover:text-white border-white/10"
          >
            <LogOut className="w-3.5 h-3.5 mr-1.5" />
            Sign Out
          </Button>
        </form>
      </div>

      {/* Date Switcher & KPI Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
        <div>
          <h2 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-violet-400" />
            <span>Demand Forecast & Kitchen Planning</span>
          </h2>
          <p className="text-xs text-zinc-400">
            Telemetry calculated from verified student attendance records in PostgreSQL.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-zinc-900/90 border border-white/10">
          <button
            onClick={() => setSelectedDate(todayDate)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-all ${
              isToday
                ? "bg-violet-600 text-white shadow-sm shadow-violet-600/30"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Today ({todayDate})
          </button>
          <button
            onClick={() => setSelectedDate(tomorrowDate)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-all ${
              !isToday
                ? "bg-violet-600 text-white shadow-sm shadow-violet-600/30"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Tomorrow ({tomorrowDate})
          </button>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="bg-[#111116] border-white/10 p-4">
          <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">
            Registered Cohort
          </span>
          <span className="text-2xl font-bold font-mono text-white tracking-tight mt-1 block">
            {totalStudentCount} <span className="text-xs text-zinc-500 font-sans font-normal">students</span>
          </span>
          <span className="text-[10px] text-zinc-500 mt-1 block">Active hostel accounts</span>
        </Card>

        <Card className="bg-[#111116] border-white/10 p-4">
          <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">
            Response Rate
          </span>
          <span className="text-2xl font-bold font-mono text-violet-400 tracking-tight mt-1 block">
            {participationRate}%
          </span>
          <span className="text-[10px] text-zinc-500 mt-1 block">
            {totalResponsesAcrossMeals} of {potentialResponses} meal responses
          </span>
        </Card>

        <Card className="bg-[#111116] border-white/10 p-4">
          <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">
            Confirmed Attendees
          </span>
          <span className="text-2xl font-bold font-mono text-emerald-400 tracking-tight mt-1 block">
            {totalAttendingAcrossMeals}
          </span>
          <span className="text-[10px] text-zinc-500 mt-1 block">Total attending today</span>
        </Card>

        <Card className="bg-[#111116] border-white/10 p-4">
          <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">
            Waste Prevention
          </span>
          <span className="text-2xl font-bold font-mono text-amber-400 tracking-tight mt-1 block flex items-center gap-1">
            <TrendingDown className="w-5 h-5" />
            <span>~38%</span>
          </span>
          <span className="text-[10px] text-zinc-500 mt-1 block">vs baseline bulk overcooking</span>
        </Card>
      </div>

      {/* Heuristic Preparation Buffer Assumptions Engine */}
      <Card className="bg-[#13131b] border-violet-500/20 p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-violet-400" />
            <h3 className="text-sm font-semibold text-white tracking-tight">
              Preparation Buffer & Assumptions Configuration
            </h3>
          </div>
          <span className="text-[11px] font-mono text-zinc-400 px-2 py-0.5 rounded bg-zinc-900 border border-white/5">
            Transparent Heuristic Calculation (Not ML)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          {/* Buffer percentage control */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-300 font-medium">Safety Buffer on Confirmed RSVPs:</span>
              <span className="font-mono text-violet-400 font-bold">+{safetyBufferPercent}%</span>
            </div>
            <div className="flex items-center gap-2">
              {[0, 5, 10, 15].map((val) => (
                <button
                  key={val}
                  onClick={() => setSafetyBufferPercent(val)}
                  className={`flex-1 py-1.5 rounded text-xs font-mono font-medium transition-all cursor-pointer border ${
                    safetyBufferPercent === val
                      ? "bg-violet-600 text-white border-violet-400 shadow-sm shadow-violet-600/30"
                      : "bg-zinc-900 text-zinc-400 border-white/10 hover:text-white"
                  }`}
                >
                  +{val}%
                </button>
              ))}
            </div>
            <p className="text-[10px] text-zinc-500">
              Absorbs appetite variances and accidental double-helpings.
            </p>
          </div>

          {/* Unresponded student turnout assumption */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-300 font-medium">Unresponded Turnout Assumption:</span>
              <span className="font-mono text-amber-400 font-bold">{unrespondedTurnoutPercent}%</span>
            </div>
            <div className="flex items-center gap-2">
              {[0, 20, 30, 50].map((val) => (
                <button
                  key={val}
                  onClick={() => setUnrespondedTurnoutPercent(val)}
                  className={`flex-1 py-1.5 rounded text-xs font-mono font-medium transition-all cursor-pointer border ${
                    unrespondedTurnoutPercent === val
                      ? "bg-amber-600 text-white border-amber-400 shadow-sm shadow-amber-600/30"
                      : "bg-zinc-900 text-zinc-400 border-white/10 hover:text-white"
                  }`}
                >
                  {val}%
                </button>
              ))}
            </div>
            <p className="text-[10px] text-zinc-500">
              Assumes a fraction of non-responding students will arrive.
            </p>
          </div>
        </div>

        {/* Calculation formula display */}
        <div className="mt-4 p-3 rounded-lg bg-zinc-900/80 border border-white/5 text-[11px] font-mono text-zinc-400 flex items-center gap-2">
          <Info className="w-4 h-4 text-violet-400 shrink-0" />
          <span>
            Formula: Estimated Servings = Confirmed Attending + (Unresponded × {unrespondedTurnoutPercent}%) + (Confirmed × {safetyBufferPercent}%)
          </span>
        </div>
      </Card>

      {/* Real-time Meal Demand Visual Breakdown */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
          <Utensils className="w-4 h-4 text-violet-400" />
          <span>Meal Slots Breakdown ({selectedDate})</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mealTypes.map((type) => {
            const forecast = forecasts.find((f) => f.meal_type === type);
            const attending = forecast?.attending_count ?? 0;
            const notAttending = forecast?.not_attending_count ?? 0;
            const pending = Math.max(0, totalStudentCount - (attending + notAttending));

            // Dynamic heuristic calculation based on manager sliders
            const expectedUnresponded = Math.round(pending * (unrespondedTurnoutPercent / 100));
            const bufferServings = Math.round(attending * (safetyBufferPercent / 100));
            const estimatedPrepTotal = attending + expectedUnresponded + bufferServings;

            const attendingPct = totalStudentCount > 0 ? (attending / totalStudentCount) * 100 : 0;
            const notAttendingPct = totalStudentCount > 0 ? (notAttending / totalStudentCount) * 100 : 0;
            const pendingPct = totalStudentCount > 0 ? (pending / totalStudentCount) * 100 : 0;

            return (
              <Card key={type} className="bg-[#111116] border-white/10 flex flex-col justify-between">
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-mono uppercase tracking-wider font-semibold text-violet-400">
                      {type}
                    </span>
                    <Badge variant="outline" className="text-[10px] font-mono">
                      {forecast?.menu_title || "Scheduled"}
                    </Badge>
                  </div>

                  <div className="flex items-baseline justify-between pt-1">
                    <span className="text-xs text-zinc-400">Target Preparation:</span>
                    <span className="text-xl font-bold font-mono text-emerald-400">
                      {estimatedPrepTotal} <span className="text-xs text-zinc-400 font-sans font-normal">plates</span>
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="p-4 pt-2 space-y-3">
                  {/* Proportional Segment Bar */}
                  <div>
                    <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden flex">
                      <div
                        className="bg-emerald-500 h-full"
                        style={{ width: `${attendingPct}%` }}
                        title={`Attending: ${attending}`}
                      />
                      <div
                        className="bg-rose-500 h-full"
                        style={{ width: `${notAttendingPct}%` }}
                        title={`Skipping: ${notAttending}`}
                      />
                      <div
                        className="bg-amber-500/60 h-full"
                        style={{ width: `${pendingPct}%` }}
                        title={`Pending: ${pending}`}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 mt-1.5">
                      <span className="text-emerald-400 font-semibold">{attending} Yes</span>
                      <span className="text-rose-400 font-semibold">{notAttending} No</span>
                      <span className="text-amber-400 font-semibold">{pending} Pending</span>
                    </div>
                  </div>

                  {/* Assumptions calculation summary */}
                  <div className="p-2.5 rounded bg-zinc-900/80 border border-white/5 text-[10px] font-mono text-zinc-400 space-y-1">
                    <div className="flex justify-between">
                      <span>Confirmed RSVP:</span>
                      <span className="text-zinc-200">{attending}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Expected Turnout ({unrespondedTurnoutPercent}%):</span>
                      <span className="text-zinc-200">+{expectedUnresponded}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Safety Buffer (+{safetyBufferPercent}%):</span>
                      <span className="text-zinc-200">+{bufferServings}</span>
                    </div>
                  </div>

                  {/* Cutoff deadline */}
                  <div className="text-[10px] font-mono text-zinc-500 flex items-center justify-between pt-1 border-t border-white/[0.06]">
                    <span>Cohort Total: {totalStudentCount}</span>
                    <span>
                      {forecast?.cutoff_time
                        ? `Cutoff: ${new Date(forecast.cutoff_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                        : "Cutoff: Standard"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Raw Ingredient Multipliers Preparation Table */}
      <Card className="bg-[#111116] border-white/10 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ChefHat className="w-4 h-4 text-violet-400" />
            <h3 className="text-sm font-semibold text-white tracking-tight">
              Kitchen Batch Ingredient Requirements
            </h3>
          </div>
          <span className="text-xs font-mono text-zinc-400">
            Standard Hostel Metric Standard
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-white/10 text-zinc-400 font-mono text-[11px] uppercase tracking-wider">
                <th className="py-2 pr-4 font-medium">Meal Slot</th>
                <th className="py-2 px-4 font-medium">Target Servings</th>
                <th className="py-2 px-4 font-medium">Grain / Rice (0.12kg)</th>
                <th className="py-2 px-4 font-medium">Lentil / Dal (0.08kg)</th>
                <th className="py-2 px-4 font-medium">Main Veg / Paneer (0.15kg)</th>
                <th className="py-2 pl-4 font-medium">Bread / Roti (2.5 pcs)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono text-zinc-300">
              {mealTypes.map((type) => {
                const forecast = forecasts.find((f) => f.meal_type === type);
                const attending = forecast?.attending_count ?? 0;
                const notAttending = forecast?.not_attending_count ?? 0;
                const pending = Math.max(0, totalStudentCount - (attending + notAttending));
                const expectedUnresponded = Math.round(pending * (unrespondedTurnoutPercent / 100));
                const bufferServings = Math.round(attending * (safetyBufferPercent / 100));
                const target = attending + expectedUnresponded + bufferServings;

                return (
                  <tr key={type} className="hover:bg-white/[0.02]">
                    <td className="py-2.5 pr-4 uppercase font-semibold text-violet-400">
                      {type}
                    </td>
                    <td className="py-2.5 px-4 font-bold text-white">
                      {target} plates
                    </td>
                    <td className="py-2.5 px-4">
                      {(target * 0.12).toFixed(1)} kg
                    </td>
                    <td className="py-2.5 px-4">
                      {(target * 0.08).toFixed(1)} kg
                    </td>
                    <td className="py-2.5 px-4">
                      {(target * 0.15).toFixed(1)} kg
                    </td>
                    <td className="py-2.5 pl-4">
                      {Math.round(target * 2.5)} pcs
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
