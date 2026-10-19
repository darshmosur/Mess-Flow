"use client";

import * as React from "react";
import { ShieldAlert, LogOut, Users, CheckCircle2, XCircle, HelpCircle, Utensils, Sparkles } from "lucide-react";
import { logoutAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { Profile, MealDemandForecast } from "@/types/database";

interface ManagerDashboardProps {
  profile: Profile;
  forecasts: MealDemandForecast[];
  targetDate: string;
}

export function ManagerDashboard({
  profile,
  forecasts,
  targetDate,
}: ManagerDashboardProps) {
  const mealTypes = ["breakfast", "lunch", "dinner"];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Header Manager Profile Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#131118] border border-violet-500/30 glass-panel-glow">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-600/30 border border-violet-500/50 flex items-center justify-center text-violet-300">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white">
                {profile.full_name || profile.email}
              </h1>
              <Badge variant="violet" className="text-[10px] font-mono">
                Authorized Manager
              </Badge>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Kitchen Preparation Planning & Demand Telemetry ({targetDate})
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

      {/* Security & Access Banner */}
      <div className="p-3.5 rounded-xl bg-violet-950/40 border border-violet-800/40 text-xs text-violet-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-violet-400 shrink-0" />
          <span>
            Access verified: PostgreSQL Row Level Security (RLS) has confirmed your Manager identity.
          </span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-wider text-violet-400 bg-violet-950/80 px-2 py-0.5 rounded border border-violet-700/50">
          Role Guard Active
        </span>
      </div>

      {/* Demand Forecast Cards for Today */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <div>
            <h2 className="text-base font-semibold text-white tracking-tight">
              Real-time Meal Demand Breakdown
            </h2>
            <p className="text-xs text-zinc-400">
              Aggregated from authentic student attendance records in PostgreSQL.
            </p>
          </div>
          <span className="text-xs font-mono text-zinc-400">Date: {targetDate}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mealTypes.map((type) => {
            const forecast = forecasts.find((f) => f.meal_type === type);
            const attending = forecast?.attending_count ?? 0;
            const notAttending = forecast?.not_attending_count ?? 0;
            const pending = forecast?.pending_count ?? 0;
            const total = forecast?.total_students ?? (attending + notAttending + pending);
            const recommended = forecast?.recommended_servings ?? Math.round(attending * 1.05);

            const attendancePercent =
              total > 0 ? Math.round((attending / total) * 100) : 0;

            return (
              <Card key={type} className="bg-[#111116] border-white/10">
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono uppercase tracking-wider font-semibold text-violet-400">
                      {type}
                    </span>
                    <Badge variant="outline" className="text-[10px] font-mono">
                      {forecast?.menu_title || "Scheduled"}
                    </Badge>
                  </div>
                  <CardTitle className="text-sm font-semibold text-zinc-100 flex items-center justify-between">
                    <span>Target Servings:</span>
                    <span className="text-emerald-400 font-mono text-base font-bold">
                      {recommended} plates
                    </span>
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-4 pt-2 space-y-3">
                  {/* Progress bar */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono mb-1">
                      <span>Confirmed Attending</span>
                      <span className="text-white font-bold">{attendancePercent}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden flex">
                      <div
                        className="bg-emerald-500 h-full transition-all duration-300"
                        style={{ width: `${Math.min(attendancePercent, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Telemetry Breakdown */}
                  <div className="grid grid-cols-3 gap-1 pt-2 border-t border-white/[0.06] text-center">
                    <div className="p-1.5 rounded bg-zinc-900/60 border border-white/5">
                      <div className="flex items-center justify-center gap-1 text-[10px] text-zinc-400">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>Yes</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-white">{attending}</span>
                    </div>

                    <div className="p-1.5 rounded bg-zinc-900/60 border border-white/5">
                      <div className="flex items-center justify-center gap-1 text-[10px] text-zinc-400">
                        <XCircle className="w-3 h-3 text-rose-400" />
                        <span>No</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-white">{notAttending}</span>
                    </div>

                    <div className="p-1.5 rounded bg-zinc-900/60 border border-white/5">
                      <div className="flex items-center justify-center gap-1 text-[10px] text-zinc-400">
                        <HelpCircle className="w-3 h-3 text-amber-400" />
                        <span>Pending</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-white">{pending}</span>
                    </div>
                  </div>

                  <div className="text-[10px] text-zinc-500 font-mono flex items-center justify-between pt-1">
                    <span>Total Cohort: {total}</span>
                    <span>+5% Waste Buffer</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
