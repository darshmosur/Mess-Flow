export type UserRole = "student" | "manager";
export type MealType = "breakfast" | "lunch" | "dinner";
export type AttendanceStatus = "attending" | "not_attending";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  hostel_block: string;
  room_number: string;
  created_at: string;
  updated_at: string;
}

export interface Meal {
  id: string;
  meal_date: string; // YYYY-MM-DD
  meal_type: MealType;
  cutoff_time: string; // ISO 8601
  menu_title: string;
  menu_items: string[];
  created_at: string;
  updated_at: string;
}

export interface MealAttendance {
  id: string;
  student_id: string;
  meal_date: string;
  meal_type: MealType;
  status: AttendanceStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface MealDemandForecast {
  meal_id: string;
  meal_date: string;
  meal_type: MealType;
  cutoff_time: string;
  menu_title: string;
  menu_items: string[];
  attending_count: number;
  not_attending_count: number;
  pending_count: number;
  total_students: number;
  recommended_servings: number;
}
