"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export interface AuthActionResult {
  error?: string;
  success?: boolean;
}

export async function loginAction(
  _prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const targetRole = formData.get("role") as string | null;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = await createClient();
  if (!supabase) {
    return {
      error:
        "Supabase credentials are not configured in .env.local. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  if (!data.user) {
    return { error: "Authentication failed. No user returned." };
  }

  // Fetch verified profile role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  const userRole = profile?.role || "student";

  // Prevent student from logging into manager portal if target was manager
  if (targetRole === "manager" && userRole !== "manager") {
    await supabase.auth.signOut();
    return {
      error:
        "Access Denied: This account does not have Manager privileges. Only explicitly provisioned manager accounts can access this portal.",
    };
  }

  // Redirect to respective authorized portal
  if (userRole === "manager") {
    redirect("/manager");
  } else {
    redirect("/student");
  }
}

export async function signupAction(
  _prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("full_name") as string;
  const hostelBlock = (formData.get("hostel_block") as string) || "";
  const roomNumber = (formData.get("room_number") as string) || "";

  if (!email || !password || !fullName) {
    return { error: "Full name, email, and password (min 6 characters) are required." };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters long." };
  }

  const supabase = await createClient();
  if (!supabase) {
    return {
      error:
        "Supabase credentials are not configured in .env.local. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    };
  }

  // Public signup is strictly locked to Student role
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        hostel_block: hostelBlock,
        room_number: roomNumber,
        // Public signups are explicitly assigned 'student' by database trigger
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/student");
}

export async function logoutAction() {
  const supabase = await createClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
  redirect("/login");
}
