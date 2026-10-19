"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { MealType, AttendanceStatus } from "@/types/database";

export interface AttendanceActionResult {
  error?: string;
  success?: boolean;
  updatedAt?: string;
}

export async function submitAttendanceAction(
  mealDate: string,
  mealType: MealType,
  status: AttendanceStatus,
  notes?: string
): Promise<AttendanceActionResult> {
  const supabase = await createClient();
  if (!supabase) {
    return {
      error: "Supabase connection is not configured. Please check .env.local.",
    };
  }

  // 1. Verify authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized. Please sign in to submit attendance." };
  }

  // 2. Check if meal exists and whether cutoff time has elapsed
  const { data: meal } = await supabase
    .from("meals")
    .select("cutoff_time")
    .eq("meal_date", mealDate)
    .eq("meal_type", mealType)
    .single();

  if (meal && meal.cutoff_time) {
    const cutoffDate = new Date(meal.cutoff_time);
    if (new Date() > cutoffDate) {
      return {
        error: `Submission deadline has passed for this ${mealType} (Cutoff was ${cutoffDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}). Response is locked.`,
      };
    }
  }

  const nowIso = new Date().toISOString();

  // 3. Upsert attendance record enforcing 1 response per student per meal/date
  const { error } = await supabase.from("meal_attendance").upsert(
    {
      student_id: user.id,
      meal_date: mealDate,
      meal_type: mealType,
      status,
      notes: notes || "",
      updated_at: nowIso,
    },
    {
      onConflict: "student_id,meal_date,meal_type",
    }
  );

  if (error) {
    return { error: `Database error: ${error.message}` };
  }

  revalidatePath("/student");
  revalidatePath("/manager");

  return {
    success: true,
    updatedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
  };
}

export async function updateMealConfigAction(
  mealId: string,
  menuTitle: string,
  menuItems: string[],
  cutoffTime: string
): Promise<{ error?: string; success?: boolean }> {
  const supabase = await createClient();
  if (!supabase) return { error: "Database client unavailable." };

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized." };

  // Strict manager verification
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "manager") {
    return { error: "Forbidden: Only managers can update meal configurations." };
  }

  const { error } = await supabase
    .from("meals")
    .update({
      menu_title: menuTitle,
      menu_items: menuItems,
      cutoff_time: cutoffTime,
      updated_at: new Date().toISOString(),
    })
    .eq("id", mealId);

  if (error) return { error: error.message };

  revalidatePath("/student");
  revalidatePath("/manager");
  return { success: true };
}
