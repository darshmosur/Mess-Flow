-- ==============================================================================
-- MessFlow Database Schema & Row Level Security (RLS) Policies
-- PostgreSQL / Supabase
-- ==============================================================================

-- 1. Create Profiles Table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL CHECK (role IN ('student', 'manager')) DEFAULT 'student',
  hostel_block TEXT DEFAULT '',
  room_number TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast lookup by role
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- 2. Create Meals Configuration Table
CREATE TABLE IF NOT EXISTS public.meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_date DATE NOT NULL,
  meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner')),
  cutoff_time TIMESTAMPTZ NOT NULL,
  menu_title TEXT NOT NULL,
  menu_items TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_meal_date_type UNIQUE (meal_date, meal_type)
);

CREATE INDEX IF NOT EXISTS idx_meals_date ON public.meals(meal_date);

-- 3. Create Meal Attendance Table
-- Enforces: exactly one response per student per meal/date
CREATE TABLE IF NOT EXISTS public.meal_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  meal_date DATE NOT NULL,
  meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner')),
  status TEXT NOT NULL CHECK (status IN ('attending', 'not_attending')),
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_student_meal_date UNIQUE (student_id, meal_date, meal_type)
);

CREATE INDEX IF NOT EXISTS idx_attendance_student ON public.meal_attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date_type ON public.meal_attendance(meal_date, meal_type);

-- 4. Manager Demand Forecast View
CREATE OR REPLACE VIEW public.meal_demand_forecast AS
SELECT
  m.id AS meal_id,
  m.meal_date,
  m.meal_type,
  m.cutoff_time,
  m.menu_title,
  m.menu_items,
  COUNT(a.id) FILTER (WHERE a.status = 'attending') AS attending_count,
  COUNT(a.id) FILTER (WHERE a.status = 'not_attending') AS not_attending_count,
  (SELECT COUNT(*) FROM public.profiles WHERE role = 'student') - COUNT(a.id) AS pending_count,
  (SELECT COUNT(*) FROM public.profiles WHERE role = 'student') AS total_students,
  ROUND(COUNT(a.id) FILTER (WHERE a.status = 'attending') * 1.05) AS recommended_servings -- 5% safety buffer
FROM public.meals m
LEFT JOIN public.meal_attendance a 
  ON m.meal_date = a.meal_date AND m.meal_type = a.meal_type
GROUP BY m.id;

-- ==============================================================================
-- Row Level Security (RLS) & Access Functions
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_attendance ENABLE ROW LEVEL SECURITY;

-- Helper function: check if currently authenticated user is a manager
CREATE OR REPLACE FUNCTION public.is_manager()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'manager'
  );
$$;

-- --- Profiles RLS Policies ---
-- Everyone can read their own profile; managers can read all profiles
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id OR public.is_manager());

-- Users can update only their own profile details (excluding role)
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Trigger: Prevent changing 'role' via normal client updates
CREATE OR REPLACE FUNCTION public.protect_profile_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- If role is being modified, verify that the caller is an active manager or service_role
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    IF NOT (public.is_manager() OR current_setting('request.jwt.claim.role', true) = 'service_role') THEN
      RAISE EXCEPTION 'Unauthorized: Role modifications can only be performed by a provisioned manager.';
    END IF;
  END IF;
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_protect_profile_role ON public.profiles;
CREATE TRIGGER trigger_protect_profile_role
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_profile_role();

-- Automatic profile creation on auth signup (ALWAYS defaults to 'student')
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, hostel_block, room_number)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    'student', -- Public signup ALWAYS creates a student; NEVER a manager
    COALESCE(NEW.raw_user_meta_data->>'hostel_block', ''),
    COALESCE(NEW.raw_user_meta_data->>'room_number', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- --- Meals RLS Policies ---
-- All authenticated students & managers can view meals
DROP POLICY IF EXISTS "Authenticated users view meals" ON public.meals;
CREATE POLICY "Authenticated users view meals"
  ON public.meals FOR SELECT
  TO authenticated
  USING (true);

-- Only managers can insert, update, or delete meals
DROP POLICY IF EXISTS "Managers insert meals" ON public.meals;
CREATE POLICY "Managers insert meals"
  ON public.meals FOR INSERT
  TO authenticated
  WITH CHECK (public.is_manager());

DROP POLICY IF EXISTS "Managers update meals" ON public.meals;
CREATE POLICY "Managers update meals"
  ON public.meals FOR UPDATE
  TO authenticated
  USING (public.is_manager())
  WITH CHECK (public.is_manager());

DROP POLICY IF EXISTS "Managers delete meals" ON public.meals;
CREATE POLICY "Managers delete meals"
  ON public.meals FOR DELETE
  TO authenticated
  USING (public.is_manager());

-- --- Meal Attendance RLS Policies ---
-- Students can only view their own attendance; managers can view all attendance
DROP POLICY IF EXISTS "Students view own attendance" ON public.meal_attendance;
CREATE POLICY "Students view own attendance"
  ON public.meal_attendance FOR SELECT
  TO authenticated
  USING (student_id = auth.uid() OR public.is_manager());

-- Students can insert attendance only for themselves
DROP POLICY IF EXISTS "Students insert own attendance" ON public.meal_attendance;
CREATE POLICY "Students insert own attendance"
  ON public.meal_attendance FOR INSERT
  TO authenticated
  WITH CHECK (student_id = auth.uid());

-- Students can update attendance only for themselves
DROP POLICY IF EXISTS "Students update own attendance" ON public.meal_attendance;
CREATE POLICY "Students update own attendance"
  ON public.meal_attendance FOR UPDATE
  TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

-- Students can delete only their own attendance
DROP POLICY IF EXISTS "Students delete own attendance" ON public.meal_attendance;
CREATE POLICY "Students delete own attendance"
  ON public.meal_attendance FOR DELETE
  TO authenticated
  USING (student_id = auth.uid());

-- ==============================================================================
-- SAFE MANAGER PROVISIONING SCRIPT (Run once in Supabase SQL Editor)
-- ==============================================================================
-- To provision the first manager account:
-- 1. Create a normal user account via the app or Supabase Auth UI (e.g. chef@messflow.internal).
-- 2. Execute the following SQL query to grant manager permissions:
--
-- UPDATE public.profiles
-- SET role = 'manager'
-- WHERE email = 'chef@messflow.internal';
--
-- To verify the provisioned manager:
-- SELECT id, email, full_name, role FROM public.profiles WHERE role = 'manager';
-- ==============================================================================
