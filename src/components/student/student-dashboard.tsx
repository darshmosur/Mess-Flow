"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Check,
  X,
  Clock,
  LogOut,
  Utensils,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  User,
} from "lucide-react";
import { logoutAction } from "@/app/actions/auth";
import { submitAttendanceAction } from "@/app/actions/attendance";
import { Button } from "@/components/ui/button";
import type { Profile, Meal, MealAttendance, MealType, AttendanceStatus } from "@/types/database";

interface StudentDashboardProps {
  profile: Profile;
  initialMeals: Meal[];
  initialAttendance: MealAttendance[];
  todayDate: string;
  tomorrowDate: string;
}

export function StudentDashboard({
  profile,
  initialMeals,
  initialAttendance,
  todayDate,
  tomorrowDate,
}: StudentDashboardProps) {
  const [selectedDate, setSelectedDate] = React.useState<string>(todayDate);
  const [attendanceList, setAttendanceList] = React.useState<MealAttendance[]>(initialAttendance);
  const [pendingMeal, setPendingMeal] = React.useState<MealType | null>(null);
  const [lastSaved, setLastSaved] = React.useState<{ mealType: MealType; time: string; status: AttendanceStatus } | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const mealSlots: MealType[] = ["breakfast", "lunch", "dinner"];

  // Filter attendance for selected date
  const currentAttendanceMap = React.useMemo(() => {
    const map = new Map<MealType, { status: AttendanceStatus; updatedAt: string }>();
    attendanceList.forEach((att) => {
      if (att.meal_date === selectedDate) {
        map.set(att.meal_type, { status: att.status, updatedAt: att.updated_at });
      }
    });
    return map;
  }, [attendanceList, selectedDate]);

  const handleAttendanceToggle = async (mealType: MealType, newStatus: AttendanceStatus) => {
    setPendingMeal(mealType);
    setErrorMessage(null);

    // Optimistic UI state update
    setAttendanceList((prev) => {
      const filtered = prev.filter(
        (a) => !(a.meal_date === selectedDate && a.meal_type === mealType)
      );
      return [
        ...filtered,
        {
          id: "temp-" + Date.now(),
          student_id: profile.id,
          meal_date: selectedDate,
          meal_type: mealType,
          status: newStatus,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];
    });

    const result = await submitAttendanceAction(selectedDate, mealType, newStatus);

    if (result.error) {
      setErrorMessage(result.error);
      setAttendanceList(initialAttendance);
    } else if (result.updatedAt) {
      setLastSaved({
        mealType,
        time: result.updatedAt,
        status: newStatus,
      });
    }

    setPendingMeal(null);
  };

  const isToday = selectedDate === todayDate;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Student Identity Card */}
      <div className="editorial-card rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-violet-500/20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-violet-600/20 border border-violet-500/40 flex items-center justify-center text-violet-300 font-bold text-lg font-mono">
            {profile.full_name?.charAt(0) || "S"}
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold tracking-tight text-white">
                {profile.full_name || profile.email}
              </h1>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-violet-950 text-violet-400 border border-violet-800/60">
                Verified Student
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1 font-mono flex flex-wrap items-center gap-x-2">
              <span>{profile.email}</span>
              {profile.hostel_block && <span>• {profile.hostel_block}</span>}
              {profile.room_number && <span>• Room {profile.room_number}</span>}
            </p>
          </div>
        </div>

        <form action={logoutAction}>
          <Button
            type="submit"
            variant="outline"
            size="sm"
            className="text-xs text-zinc-400 hover:text-white border-white/10 hover:border-violet-500/40"
          >
            <LogOut className="w-3.5 h-3.5 mr-1.5" />
            Sign Out
          </Button>
        </form>
      </div>

      {/* Date Switcher & Deck Subheading */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-violet-400" />
            <h2 className="text-lg font-semibold text-white tracking-tight">
              Meal Attendance Registration
            </h2>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Declare attendance for each meal slot before the kitchen cutoff locks.
          </p>
        </div>

        {/* Date Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-900 border border-white/10">
          <button
            onClick={() => setSelectedDate(todayDate)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium cursor-pointer transition-all ${
              isToday
                ? "bg-violet-600 text-white font-semibold shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Today ({todayDate})
          </button>
          <button
            onClick={() => setSelectedDate(tomorrowDate)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium cursor-pointer transition-all ${
              !isToday
                ? "bg-violet-600 text-white font-semibold shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Tomorrow ({tomorrowDate})
          </button>
        </div>
      </div>

      {/* Persistence Feedback Banners */}
      <AnimatePresence>
        {lastSaved && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Persisted to PostgreSQL: <strong>{lastSaved.mealType.toUpperCase()}</strong> confirmed as{" "}
                <strong>{lastSaved.status === "attending" ? "Attending" : "Not Attending"}</strong>
              </span>
            </div>
            <span className="font-mono text-[10px] text-emerald-400/80">
              Saved {lastSaved.time}
            </span>
          </motion.div>
        )}

        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-3.5 rounded-xl bg-rose-950/70 border border-rose-500/40 text-xs text-rose-300 flex items-start gap-2"
          >
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3 Meal Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {mealSlots.map((type) => {
          const mealConfig = initialMeals.find(
            (m) => m.meal_type === type && m.meal_date === selectedDate
          );
          const currentRecord = currentAttendanceMap.get(type);
          const currentStatus = currentRecord?.status;
          const isPending = pendingMeal === type;

          const isCutoffPassed = mealConfig?.cutoff_time
            ? new Date() > new Date(mealConfig.cutoff_time)
            : false;

          const formattedCutoff = mealConfig?.cutoff_time
            ? new Date(mealConfig.cutoff_time).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "Standard";

          return (
            <div
              key={type}
              className={`editorial-card rounded-2xl p-5 flex flex-col justify-between space-y-4 transition-all duration-300 ${
                currentStatus === "attending"
                  ? "border-emerald-500/50 bg-[#0d1612]"
                  : currentStatus === "not_attending"
                  ? "border-rose-500/50 bg-[#170e12]"
                  : "hover:border-violet-500/30"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono uppercase tracking-wider font-bold text-violet-400">
                    {type}
                  </span>

                  {currentStatus === "attending" && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      ✓ Attending
                    </span>
                  )}
                  {currentStatus === "not_attending" && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                      ✕ Skipping
                    </span>
                  )}
                  {!currentStatus && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      Pending Choice
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-semibold text-white">
                  {mealConfig?.menu_title || `${type.charAt(0).toUpperCase() + type.slice(1)} Service`}
                </h3>

                <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400 mt-1">
                  <Clock className="w-3 h-3 text-zinc-400" />
                  <span>Cutoff: {formattedCutoff}</span>
                  {isCutoffPassed && (
                    <span className="text-rose-400 font-semibold ml-1">(Locked)</span>
                  )}
                </div>

                {/* Menu items pills */}
                <div className="min-h-12 py-2 mt-2">
                  {mealConfig?.menu_items && mealConfig.menu_items.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {mealConfig.menu_items.map((item, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-white/5 font-mono"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-500 italic">
                      Standard hostel daily menu scheduled.
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                {/* Status Explanation */}
                <div className="text-[11px] font-mono text-zinc-400 pt-2 border-t border-white/[0.06]">
                  {currentStatus === "attending" ? (
                    <span className="text-emerald-400">
                      Confirmed: Your plate is budgeted in kitchen prep.
                    </span>
                  ) : currentStatus === "not_attending" ? (
                    <span className="text-rose-400">
                      Skipping: Kitchen will avoid overcooking for your slot.
                    </span>
                  ) : (
                    <span className="text-amber-400">
                      Please confirm your attendance below.
                    </span>
                  )}
                </div>

                {/* Tactile Attendance Action Buttons */}
                <div className="pt-2 border-t border-white/[0.06] flex items-center gap-2">
                  <button
                    disabled={isPending || isCutoffPassed}
                    onClick={() => handleAttendanceToggle(type, "attending")}
                    className={`flex-1 h-9 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                      currentStatus === "attending"
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30 scale-[1.02]"
                        : "bg-zinc-900 text-zinc-300 hover:text-white border border-white/10 hover:border-emerald-500/40"
                    } ${isCutoffPassed ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Attending</span>
                  </button>

                  <button
                    disabled={isPending || isCutoffPassed}
                    onClick={() => handleAttendanceToggle(type, "not_attending")}
                    className={`flex-1 h-9 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                      currentStatus === "not_attending"
                        ? "bg-rose-600 text-white shadow-md shadow-rose-600/30 scale-[1.02]"
                        : "bg-zinc-900 text-zinc-300 hover:text-white border border-white/10 hover:border-rose-500/40"
                    } ${isCutoffPassed ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Not Attending</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* RLS Security Assurance Footer */}
      <div className="p-4 rounded-xl bg-zinc-950/80 border border-white/5 text-xs text-zinc-400 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-violet-400 shrink-0" />
          <span>
            Database uniqueness enforced: exactly one response per student per meal slot.
          </span>
        </div>
        <span className="font-mono text-[10px] text-zinc-500 hidden sm:inline">
          RLS Policy Active
        </span>
      </div>
    </div>
  );
}
