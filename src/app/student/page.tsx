import { redirect } from "next/navigation";
import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { StudentDashboard } from "@/components/student/student-dashboard";
import { Button } from "@/components/ui/button";
import type { Profile, Meal, MealAttendance } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function StudentPage() {
  const supabase = await createClient();

  if (!supabase) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="p-8 rounded-2xl bg-zinc-900/80 border border-amber-500/40 text-amber-200 space-y-4">
          <AlertCircle className="w-10 h-10 mx-auto text-amber-400" />
          <h2 className="text-xl font-bold text-white">Supabase Credentials Required</h2>
          <p className="text-xs text-zinc-300 leading-relaxed">
            Please configure <code className="font-mono text-amber-300">.env.local</code> to access the live student portal.
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
    redirect("/login?role=student&redirect=/student");
  }

  // Fetch student profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const currentProfile: Profile = profile || {
    id: user.id,
    email: user.email || "",
    full_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "Student",
    role: "student",
    hostel_block: user.user_metadata?.hostel_block || "",
    room_number: user.user_metadata?.room_number || "",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const now = new Date();
  const realToday = now.toISOString().split("T")[0];
  const tomorrowObj = new Date(now);
  tomorrowObj.setDate(tomorrowObj.getDate() + 1);
  const realTomorrow = tomorrowObj.toISOString().split("T")[0];

  // Try fetching meals for real calendar dates first
  let { data: mealsData } = await supabase
    .from("meals")
    .select("*")
    .in("meal_date", [realToday, realTomorrow])
    .order("meal_date", { ascending: true });

  let today = realToday;
  let tomorrow = realTomorrow;

  // Gracefully fallback to scheduled dates in database if real calendar day has no records
  if (!mealsData || mealsData.length === 0) {
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

    const { data: fallbackMeals } = await supabase
      .from("meals")
      .select("*")
      .in("meal_date", [today, tomorrow])
      .order("meal_date", { ascending: true });
    mealsData = fallbackMeals;
  }

  // Fetch student's own attendance records (strictly filtered by RLS)
  const { data: attendanceData } = await supabase
    .from("meal_attendance")
    .select("*")
    .eq("student_id", user.id)
    .in("meal_date", [today, tomorrow]);

  return (
    <StudentDashboard
      profile={currentProfile}
      initialMeals={(mealsData as Meal[]) || []}
      initialAttendance={(attendanceData as MealAttendance[]) || []}
      todayDate={today}
      tomorrowDate={tomorrow}
    />
  );
}
