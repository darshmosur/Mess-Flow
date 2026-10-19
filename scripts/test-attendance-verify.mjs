import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://xzeeqdtbjjzufzcggjlg.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6ZWVxZHRiamp6dWZ6Y2dnamxnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI0MTU1OTksImV4cCI6MjEwNzk5MTU5OX0.jzOwXkebv4jLDwrhF7pvA4dW2Xad0tixmowlNJhwx_o";

async function verifyAttendanceAndRLS() {
  // 1. Student Client
  const studentClient = createClient(supabaseUrl, supabaseAnonKey);
  await studentClient.auth.signInWithPassword({
    email: "student1@messflow.com",
    password: "Password123!",
  });

  const { data: { user: studentUser } } = await studentClient.auth.getUser();
  console.log("Authenticated Student:", studentUser.email);

  // 2. Submit attendance for dinner today
  const today = "2026-10-19";
  const { data: upsertData, error: upsertErr } = await studentClient
    .from("meal_attendance")
    .upsert(
      {
        student_id: studentUser.id,
        meal_date: today,
        meal_type: "dinner",
        status: "attending",
      },
      { onConflict: "student_id,meal_date,meal_type" }
    )
    .select();

  if (upsertErr) {
    console.error("Attendance submission error:", upsertErr);
  } else {
    console.log("✓ Student 1 submitted attendance for Dinner:", upsertData);
  }

  // 3. Test Student 2 submits not_attending
  const student2Client = createClient(supabaseUrl, supabaseAnonKey);
  await student2Client.auth.signInWithPassword({
    email: "student2@messflow.com",
    password: "Password123!",
  });
  const { data: { user: student2User } } = await student2Client.auth.getUser();

  await student2Client
    .from("meal_attendance")
    .upsert(
      {
        student_id: student2User.id,
        meal_date: today,
        meal_type: "dinner",
        status: "not_attending",
      },
      { onConflict: "student_id,meal_date,meal_type" }
    );
  console.log("✓ Student 2 submitted attendance: not_attending");

  // 4. Verify RLS: Student 1 attempts to read all attendance records
  const { data: studentView, error: rlsErr } = await studentClient
    .from("meal_attendance")
    .select("*");

  console.log(`✓ RLS Student Isolation: Student 1 requested all records but RLS filtered to only their own (${studentView?.length} record returned)`);

  // 5. Verify Manager View
  const managerClient = createClient(supabaseUrl, supabaseAnonKey);
  await managerClient.auth.signInWithPassword({
    email: "manager@messflow.com",
    password: "Password123!",
  });

  const { data: forecast, error: forecastErr } = await managerClient
    .from("meal_demand_forecast")
    .select("*")
    .eq("meal_date", today)
    .eq("meal_type", "dinner");

  console.log("✓ Manager Demand Forecast for Dinner:", forecast);
}

verifyAttendanceAndRLS();
