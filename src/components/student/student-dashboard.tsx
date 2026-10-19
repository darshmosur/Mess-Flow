"use client";

import * as React from "react";
import { Check, X, Clock, LogOut, Utensils, AlertTriangle, ShieldCheck } from "lucide-react";
import { logoutAction } from "@/app/actions/auth";
import { submitAttendanceAction } from "@/app/actions/attendance";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { Profile, Meal, MealAttendance, MealType, AttendanceStatus } from "@/types/database";

interface StudentDashboardProps {
  profile: Profile;
  meals: Meal[];
  attendance: MealAttendance[];
  targetDate: string;
}

export function StudentDashboard({
  profile,
  meals,
  attendance,
  targetDate,
}: StudentDashboardProps) {
  const [pendingMealId, setPendingMealId] = React.useState<string | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // Map existing responses by meal_type
  const attendanceMap = React.useMemo(() => {
    const map = new Map<MealType, AttendanceStatus>();
    attendance.forEach((att) => {
      if (att.meal_date === targetDate) {
        map.set(att.meal_type, att.status);
      }
    });
    return map;
  }, [attendance, targetDate]);

  const mealSlots: MealType[] = ["breakfast", "lunch", "dinner"];

  const handleAttendanceChange = async (
    mealType: MealType,
    status: AttendanceStatus
  ) => {
    setPendingMealId(mealType);
    setErrorMessage(null);

    const result = await submitAttendanceAction(targetDate, mealType, status);
    if (result.error) {
      setErrorMessage(result.error);
    }
    setPendingMealId(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header Profile Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#111116] border border-white/10 glass-panel">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-white">
              {profile.full_name || profile.email}
            </h1>
            <Badge variant="violet" className="text-[10px]">
              Student
            </Badge>
          </div>
          <p className="text-xs text-zinc-400 mt-1 flex items-center gap-2">
            <span>{profile.email}</span>
            {profile.hostel_block && <span>• {profile.hostel_block}</span>}
            {profile.room_number && <span>• Room {profile.room_number}</span>}
          </p>
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

      {/* Date Banner */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
        <div>
          <h2 className="text-base font-semibold text-white tracking-tight">
            Meal Attendance for {targetDate}
          </h2>
          <p className="text-xs text-zinc-400">
            Submit your attendance choice before the cutoff deadline for each meal.
          </p>
        </div>
        <span className="text-xs font-mono px-2.5 py-1 rounded bg-zinc-900 text-zinc-400 border border-white/5">
          1 Response / Meal Enforced
        </span>
      </div>

      {errorMessage && (
        <div className="rounded-lg bg-rose-950/70 border border-rose-500/40 p-3.5 text-xs text-rose-300 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 3 Meal Slots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mealSlots.map((type) => {
          const mealConfig = meals.find(
            (m) => m.meal_type === type && m.meal_date === targetDate
          );
          const currentStatus = attendanceMap.get(type);
          const isPending = pendingMealId === type;

          const isCutoffPassed = mealConfig?.cutoff_time
            ? new Date() > new Date(mealConfig.cutoff_time)
            : false;

          return (
            <Card
              key={type}
              className={`border transition-all duration-200 ${
                currentStatus === "attending"
                  ? "border-emerald-500/40 bg-[#121815]"
                  : currentStatus === "not_attending"
                  ? "border-rose-500/40 bg-[#181214]"
                  : "border-white/10 bg-[#111116]"
              }`}
            >
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-mono uppercase tracking-wider font-semibold text-violet-400">
                    {type}
                  </span>
                  {currentStatus === "attending" && (
                    <Badge variant="emerald" className="text-[10px]">
                      Attending
                    </Badge>
                  )}
                  {currentStatus === "not_attending" && (
                    <Badge variant="rose" className="text-[10px]">
                      Not Attending
                    </Badge>
                  )}
                  {!currentStatus && (
                    <Badge variant="outline" className="text-[10px] text-zinc-400">
                      Unselected
                    </Badge>
                  )}
                </div>

                <CardTitle className="text-sm font-semibold text-zinc-100">
                  {mealConfig?.menu_title || `${type.charAt(0).toUpperCase() + type.slice(1)} Service`}
                </CardTitle>

                {mealConfig?.cutoff_time && (
                  <div className="flex items-center gap-1 text-[11px] font-mono text-zinc-400 mt-1">
                    <Clock className="w-3 h-3 text-zinc-400" />
                    <span>
                      Cutoff:{" "}
                      {new Date(mealConfig.cutoff_time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {isCutoffPassed && (
                      <span className="text-amber-400 font-bold ml-1">(Passed)</span>
                    )}
                  </div>
                )}
              </CardHeader>

              <CardContent className="p-4 pt-1 space-y-4">
                {/* Menu items */}
                <div className="min-h-12 py-1">
                  {mealConfig?.menu_items && mealConfig.menu_items.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {mealConfig.menu_items.map((item, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-white/5"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-zinc-400 italic">
                      Standard hostel mess menu scheduled
                    </p>
                  )}
                </div>

                {/* Response Actions */}
                <div className="pt-2 border-t border-white/[0.06] flex items-center gap-2">
                  <Button
                    size="sm"
                    disabled={isPending || isCutoffPassed}
                    onClick={() => handleAttendanceChange(type, "attending")}
                    className={`flex-1 text-xs h-8 ${
                      currentStatus === "attending"
                        ? "bg-emerald-600 text-white border-emerald-400 shadow-md shadow-emerald-600/30"
                        : "bg-zinc-900/80 text-zinc-300 hover:text-white border-white/10 hover:border-emerald-500/40"
                    }`}
                  >
                    <Check className="w-3 h-3 mr-1" />
                    Attending
                  </Button>

                  <Button
                    size="sm"
                    disabled={isPending || isCutoffPassed}
                    onClick={() => handleAttendanceChange(type, "not_attending")}
                    className={`flex-1 text-xs h-8 ${
                      currentStatus === "not_attending"
                        ? "bg-rose-600 text-white border-rose-400 shadow-md shadow-rose-600/30"
                        : "bg-zinc-900/80 text-zinc-300 hover:text-white border-white/10 hover:border-rose-500/40"
                    }`}
                  >
                    <X className="w-3 h-3 mr-1" />
                    Not Attending
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Security Footer Notice */}
      <div className="p-4 rounded-xl bg-zinc-950/80 border border-white/5 text-xs text-zinc-400 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-violet-400 shrink-0" />
        <span>
          Row Level Security (RLS) is active: You are authenticated as an individual student. You can only view and mutate your own records.
        </span>
      </div>
    </div>
  );
}
