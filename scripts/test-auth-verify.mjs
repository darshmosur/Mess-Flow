import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://xzeeqdtbjjzufzcggjlg.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6ZWVxZHRiamp6dWZ6Y2dnamxnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI0MTU1OTksImV4cCI6MjEwNzk5MTU5OX0.jzOwXkebv4jLDwrhF7pvA4dW2Xad0tixmowlNJhwx_o";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAuth() {
  console.log("Testing Student Login...");
  const sRes = await supabase.auth.signInWithPassword({
    email: "student1@messflow.com",
    password: "Password123!",
  });

  if (sRes.error) {
    console.error("Student login failed:", sRes.error.message);
  } else {
    console.log("✓ Student logged in successfully! User ID:", sRes.data.user.id);
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, full_name")
      .eq("id", sRes.data.user.id)
      .single();
    console.log("✓ Student profile verified:", profile);
  }

  console.log("\nTesting Manager Login...");
  const mRes = await supabase.auth.signInWithPassword({
    email: "manager@messflow.com",
    password: "Password123!",
  });

  if (mRes.error) {
    console.error("Manager login failed:", mRes.error.message);
  } else {
    console.log("✓ Manager logged in successfully! User ID:", mRes.data.user.id);
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, full_name")
      .eq("id", mRes.data.user.id)
      .single();
    console.log("✓ Manager profile verified:", profile);
  }
}

testAuth();
