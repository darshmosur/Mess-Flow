import { redirect } from "next/navigation";
import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ManagerDashboard } from "@/components/manager/manager-dashboard";
import { Button } from "@/components/ui/button";
import type { Profile, MealDemandForecast } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function ManagerPage() {
  const supabase = await createClient();

  if (!supabase) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="p-8 rounded-2xl bg-zinc-900/80 border border-amber-500/40 text-amber-200 space-y-4">
          <AlertCircle className="w-10 h-10 mx-auto text-amber-400" />
          <h2 className="text-xl font-bold text-white">Supabase Configuration Required</h2>
          <p className="text-xs text-zinc-300 leading-relaxed">
            The manager portal requires a live PostgreSQL connection. Please configure <code className="font-mono text-amber-300">.env.local</code>.
          </p>
          <div className="pt-2">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                Return to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?role=manager&redirect=/manager");
  }

  // Strict Server-side Role Check
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "manager") {
    // Redirect non-managers to student portal with access violation flag
    redirect("/student?error=unauthorized_manager_access");
  }

  const now = new Date();
  const realToday = now.toISOString().split("T")[0];
  const tomorrowObj = new Date(now);
  tomorrowObj.setDate(tomorrowObj.getDate() + 1);
  const realTomorrow = tomorrowObj.toISOString().split("T")[0];

  // Try fetching forecasts for real calendar dates first
  let { data: forecastData } = await supabase
    .from("meal_demand_forecast")
    .select("*")
    .in("meal_date", [realToday, realTomorrow])
    .order("meal_date", { ascending: true });

  let today = realToday;
  let tomorrow = realTomorrow;

  // Gracefully fallback to scheduled dates in database if real calendar day has no records
  if (!forecastData || forecastData.length === 0) {
    const { data: latestMeals } = await supabase
      .from("meals")
      .select("meal_date")
      .order("meal_date", { ascending: false })
      .limit(6);

    const dates = Array.from(new Set(latestMeals?.map((m) => m.meal_date) || [])).sort();
    if (dates.length >= 2) {
      today = dates[dates.length - 2];
      tomorrow = dates[dates.length - 1];
    } else if (dates.length === 1) {
      today = dates[0];
      tomorrow = dates[0];
    } else {
      today = "2026-10-19";
      tomorrow = "2026-10-20";
    }

    const { data: fallbackForecasts } = await supabase
      .from("meal_demand_forecast")
      .select("*")
      .in("meal_date", [today, tomorrow])
      .order("meal_date", { ascending: true });
    forecastData = fallbackForecasts;
  }

  // Query total student count
  const { count: studentCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "student");

  return (
    <ManagerDashboard
      profile={profile as Profile}
      allForecasts={(forecastData as MealDemandForecast[]) || []}
      totalStudentCount={studentCount || 0}
      todayDate={today}
      tomorrowDate={tomorrow}
    />
  );
}
