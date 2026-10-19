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
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Flame,
} from "lucide-react";
import { logoutAction } from "@/app/actions/auth";
import { submitAttendanceAction } from "@/app/actions/attendance";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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

  // Filter attendance for the selected date
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

    // Optimistic local state update
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
      // Revert to initial on failure
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
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Student Profile & System Status Header */}
      <div className="p-5 rounded-2xl bg-[#111116] border border-white/10 glass-panel flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-violet-600/20 border border-violet-500/40 flex items-center justify-center text-violet-400 font-bold text-base font-mono">
            {profile.full_name?.charAt(0) || "S"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white">
                {profile.full_name || profile.email}
              </h1>
              <Badge variant="violet" className="text-[10px] tracking-wider font-mono">
                Student
              </Badge>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1">
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

      {/* Date Navigation Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
        <div>
          <h2 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
            <Calendar className="w-4 h-4 text-violet-400" />
            <span>Meal Attendance Registration</span>
          </h2>
          <p className="text-xs text-zinc-400">
            Submit your attendance for each meal slot before the cutoff locks.
          </p>
        </div>

        {/* Today vs Tomorrow Pill Tabs */}
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

      {/* Feedback Messages */}
      <AnimatePresence>
        {lastSaved && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-xs text-emerald-300 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Persisted to PostgreSQL: <strong>{lastSaved.mealType.toUpperCase()}</strong> marked as{" "}
                <strong>{lastSaved.status === "attending" ? "Attending" : "Not Attending"}</strong>
              </span>
            </div>
            <span className="font-mono text-[10px] text-emerald-400/80">
              Saved at {lastSaved.time}
            </span>
          </motion.div>
        )}

        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-3.5 rounded-xl bg-rose-950/70 border border-rose-500/40 text-xs text-rose-300 flex items-start gap-2"
          >
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3 Meals Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <Card
              key={type}
              className={`border transition-all duration-300 flex flex-col justify-between ${
                currentStatus === "attending"
                  ? "border-emerald-500/50 bg-[#101914] shadow-lg shadow-emerald-950/20"
                  : currentStatus === "not_attending"
                  ? "border-rose-500/50 bg-[#191013] shadow-lg shadow-rose-950/20"
                  : "border-white/10 bg-[#111116] hover:border-violet-500/30"
              }`}
            >
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono uppercase tracking-wider font-semibold text-violet-400">
                    {type}
                  </span>
                  {currentStatus === "attending" && (
                    <Badge variant="emerald" className="text-[10px] font-mono">
                      ✓ Attending
                    </Badge>
                  )}
                  {currentStatus === "not_attending" && (
                    <Badge variant="rose" className="text-[10px] font-mono">
                      ✕ Not Attending
                    </Badge>
                  )}
                  {!currentStatus && (
                    <Badge variant="amber" className="text-[10px] font-mono">
                      Unselected
                    </Badge>
                  )}
                </div>

                <CardTitle className="text-sm font-semibold text-zinc-100">
                  {mealConfig?.menu_title || `${type.charAt(0).toUpperCase() + type.slice(1)} Service`}
                </CardTitle>

                <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400 mt-1">
                  <Clock className="w-3 h-3 text-zinc-400" />
                  <span>Cutoff: {formattedCutoff}</span>
                  {isCutoffPassed && (
                    <span className="text-rose-400 font-semibold ml-1">(Locked)</span>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-4 pt-1 space-y-4">
                {/* Menu Breakdown */}
                <div className="min-h-14 py-1">
                  {mealConfig?.menu_items && mealConfig.menu_items.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {mealConfig.menu_items.map((item, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-white/5"
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

                {/* Status Explanation Note */}
                <div className="text-[11px] font-mono text-zinc-400 pt-1 border-t border-white/[0.06]">
                  {currentStatus === "attending" ? (
                    <span className="text-emerald-400">
                      Confirmed: Your plate is included in kitchen prep.
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

                {/* Action Controls */}
                <div className="pt-2 border-t border-white/[0.06] flex items-center gap-2">
                  <Button
                    size="sm"
                    disabled={isPending || isCutoffPassed}
                    onClick={() => handleAttendanceToggle(type, "attending")}
                    className={`flex-1 text-xs h-9 cursor-pointer transition-all ${
                      currentStatus === "attending"
                        ? "bg-emerald-600 text-white border-emerald-400 shadow-md shadow-emerald-600/30"
                        : "bg-zinc-900/90 text-zinc-300 hover:text-white border-white/10 hover:border-emerald-500/40"
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 mr-1" />
                    <span>Attending</span>
                  </Button>

                  <Button
                    size="sm"
                    disabled={isPending || isCutoffPassed}
                    onClick={() => handleAttendanceToggle(type, "not_attending")}
                    className={`flex-1 text-xs h-9 cursor-pointer transition-all ${
                      currentStatus === "not_attending"
                        ? "bg-rose-600 text-white border-rose-400 shadow-md shadow-rose-600/30"
                        : "bg-zinc-900/90 text-zinc-300 hover:text-white border-white/10 hover:border-rose-500/40"
                    }`}
                  >
                    <X className="w-3.5 h-3.5 mr-1" />
                    <span>Not Attending</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
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
        <span className="font-mono text-[10px] text-zinc-400 hidden sm:inline">
          RLS Policy Active
        </span>
      </div>
    </div>
  );
}
