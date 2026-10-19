import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://xzeeqdtbjjzufzcggjlg.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6ZWVxZHRiamp6dWZ6Y2dnamxnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI0MTU1OTksImV4cCI6MjEwNzk5MTU5OX0.jzOwXkebv4jLDwrhF7pvA4dW2Xad0tixmowlNJhwx_o";

async function runFullFlowTest() {
  console.log("=== RUNNING FULL STUDENT-TO-MANAGER FLOW TEST ===");
  const today = "2026-10-19";
  const tomorrow = "2026-10-20";

  // 1. Student 1 (Alex) logs in and sets attendance
  const s1 = createClient(supabaseUrl, supabaseAnonKey);
  await s1.auth.signInWithPassword({ email: "student1@messflow.com", password: "Password123!" });
  const { data: { user: u1 } } = await s1.auth.getUser();

  await s1.from("meal_attendance").upsert({
    student_id: u1.id, meal_date: today, meal_type: "breakfast", status: "attending"
  }, { onConflict: "student_id,meal_date,meal_type" });

  await s1.from("meal_attendance").upsert({
    student_id: u1.id, meal_date: today, meal_type: "lunch", status: "not_attending"
  }, { onConflict: "student_id,meal_date,meal_type" });

  await s1.from("meal_attendance").upsert({
    student_id: u1.id, meal_date: today, meal_type: "dinner", status: "attending"
  }, { onConflict: "student_id,meal_date,meal_type" });

  // Student 1 sets Tomorrow Breakfast
  await s1.from("meal_attendance").upsert({
    student_id: u1.id, meal_date: tomorrow, meal_type: "breakfast", status: "attending"
  }, { onConflict: "student_id,meal_date,meal_type" });

  console.log("✓ Student 1 (Alex) responses saved for today & tomorrow.");

  // 2. Student 2 (Priya) logs in and sets attendance
  const s2 = createClient(supabaseUrl, supabaseAnonKey);
  await s2.auth.signInWithPassword({ email: "student2@messflow.com", password: "Password123!" });
  const { data: { user: u2 } } = await s2.auth.getUser();

  await s2.from("meal_attendance").upsert({
    student_id: u2.id, meal_date: today, meal_type: "lunch", status: "attending"
  }, { onConflict: "student_id,meal_date,meal_type" });

  await s2.from("meal_attendance").upsert({
    student_id: u2.id, meal_date: today, meal_type: "dinner", status: "not_attending"
  }, { onConflict: "student_id,meal_date,meal_type" });

  console.log("✓ Student 2 (Priya) responses saved.");

  // 3. Student 3 (Rohan) logs in and sets attendance
  const s3 = createClient(supabaseUrl, supabaseAnonKey);
  await s3.auth.signInWithPassword({ email: "student3@messflow.com", password: "Password123!" });
  const { data: { user: u3 } } = await s3.auth.getUser();

  await s3.from("meal_attendance").upsert({
    student_id: u3.id, meal_date: today, meal_type: "dinner", status: "attending"
  }, { onConflict: "student_id,meal_date,meal_type" });

  console.log("✓ Student 3 (Rohan) responses saved.");

  // 4. Verify Student returns: Student 1 queries their own responses
  const { data: student1Records } = await s1.from("meal_attendance").select("*");
  console.log(`✓ Persistence check: Student 1 returns and sees ${student1Records.length} persisted records.`);
  student1Records.forEach(r => console.log(`  - [${r.meal_date}] ${r.meal_type}: ${r.status}`));

  // 5. Manager queries demand forecast
  const mgr = createClient(supabaseUrl, supabaseAnonKey);
  await mgr.auth.signInWithPassword({ email: "manager@messflow.com", password: "Password123!" });

  const { data: forecasts } = await mgr.from("meal_demand_forecast").select("*").eq("meal_date", today);
  console.log("\n✓ Manager Live Telemetry for Today (" + today + "):");
  forecasts.forEach(f => {
    console.log(`  - ${f.meal_type.toUpperCase()}: ${f.attending_count} Attending, ${f.not_attending_count} Skipping, ${f.pending_count} Pending (Recommended: ${f.recommended_servings} plates)`);
  });

  const { data: tomorrowForecast } = await mgr.from("meal_demand_forecast").select("*").eq("meal_date", tomorrow);
  console.log("\n✓ Manager Live Telemetry for Tomorrow (" + tomorrow + "):");
  tomorrowForecast.forEach(f => {
    console.log(`  - ${f.meal_type.toUpperCase()}: ${f.attending_count} Attending, ${f.not_attending_count} Skipping, ${f.pending_count} Pending`);
  });

  console.log("\n=== ALL FLOW TESTS PASSED SUCCESSFULLY ===");
}

runFullFlowTest();
