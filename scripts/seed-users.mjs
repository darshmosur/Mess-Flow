import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://xzeeqdtbjjzufzcggjlg.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6ZWVxZHRiamp6dWZ6Y2dnamxnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI0MTU1OTksImV4cCI6MjEwNzk5MTU5OX0.jzOwXkebv4jLDwrhF7pvA4dW2Xad0tixmowlNJhwx_o";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const accounts = [
  {
    email: "manager@messflow.internal",
    password: "Password123!",
    fullName: "Chef Ramesh (Manager)",
    hostelBlock: "Central Mess",
    roomNumber: "Admin Office",
  },
  {
    email: "student1@messflow.internal",
    password: "Password123!",
    fullName: "Alex Johnson",
    hostelBlock: "Block A",
    roomNumber: "A-101",
  },
  {
    email: "student2@messflow.internal",
    password: "Password123!",
    fullName: "Priya Sharma",
    hostelBlock: "Block B",
    roomNumber: "B-204",
  },
  {
    email: "student3@messflow.internal",
    password: "Password123!",
    fullName: "Rohan Verma",
    hostelBlock: "Block C",
    roomNumber: "C-312",
  },
];

async function seed() {
  console.log("Seeding accounts...");
  for (const acc of accounts) {
    const { data, error } = await supabase.auth.signUp({
      email: acc.email,
      password: acc.password,
      options: {
        data: {
          full_name: acc.fullName,
          hostel_block: acc.hostelBlock,
          room_number: acc.roomNumber,
        },
      },
    });

    if (error) {
      console.log(`- ${acc.email}: ${error.message}`);
    } else {
      console.log(`+ ${acc.email} registered (ID: ${data.user?.id})`);
    }
  }
}

seed();
