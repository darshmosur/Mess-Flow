# MessFlow — Vercel Deployment & Production Setup Guide

This document provides complete, step-by-step instructions to deploy **MessFlow** on [Vercel](https://vercel.com) with a live [Supabase](https://supabase.com) PostgreSQL backend.

---

## 1. Prerequisites

- A [Vercel](https://vercel.com) account.
- A [Supabase](https://supabase.com) project.
- A GitHub, GitLab, or Bitbucket repository containing this codebase.

---

## 2. Supabase Backend Preparation

### A. Apply the Database Schema & RLS Policies
1. In your Supabase Dashboard, navigate to **SQL Editor**.
2. Open the file [`supabase/schema.sql`](supabase/schema.sql) in this repository.
3. Paste the entire SQL contents into the editor and click **Run**.
4. This script sets up:
   - `public.profiles` (extends Supabase auth with role separation: `student` vs `manager`).
   - `public.meals` (daily menus, meal types, and kitchen cutoff times).
   - `public.meal_attendance` (unique 1-response-per-student-per-meal constraints).
   - `public.meal_demand_forecast` (real-time telemetry view with 5% safety buffer calculation).
   - Strict Row-Level Security (RLS) policies protecting student privacy and reserving administrative mutations for provisioned managers.

### B. Configure Authentication & Redirect URLs
1. In Supabase, go to **Authentication** > **URL Configuration**.
2. Set **Site URL** to your production domain (or initial Vercel domain, e.g., `https://mess-flow.vercel.app`).
3. Under **Redirect URLs**, add the following patterns:
   - `https://<your-vercel-domain>.vercel.app/**`
   - `http://localhost:3000/**`
   - `http://localhost:3001/**`
4. In **Authentication** > **Providers** > **Email**:
   - Enable **Email / Password** login.
   - *(Optional for instant testing)*: Disable "Confirm email" if you want users to log in immediately upon signup without verifying their inbox.

---

## 3. Deploy to Vercel

### Method 1: Via Vercel Web Dashboard (Recommended)

1. Go to [vercel.com/new](https://vercel.com/new).
2. Select your repository: `Mess-Flow`.
3. Configure Project Settings:
   - **Framework Preset**: `Next.js` (automatically detected via [`vercel.json`](vercel.json)).
   - **Root Directory**: `./` (default).
   - **Build Command**: `next build` (default).
   - **Output Directory**: `.next` (default).
4. Add the following **Environment Variables** (under *Project Settings* > *Environment Variables*):

| Key | Value | Target Environments |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://<your-project-id>.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `<your-supabase-anon-key>` | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` *(Optional)* | `<your-supabase-service-role-key>` | Production (Only for CLI scripts) |

5. Click **Deploy**. Vercel will build the application, execute type checks and linting, and deploy it to a high-speed global Edge network.

---

### Method 2: Via Vercel CLI

If you have the Vercel CLI installed:

```bash
# Link repository to Vercel
npx vercel link

# Add environment variables
npx vercel env add NEXT_PUBLIC_SUPABASE_URL
npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY

# Deploy to production
npx vercel --prod
```

---

## 4. Manager Account Provisioning

By design, public signup (`/signup`) strictly provisions **Student** accounts to ensure hostel students cannot self-promote to manage kitchen prep.

To grant Manager privileges to an administrator or head chef:

1. Have the manager create an account via the app's signup page (e.g. `chef@messflow.internal` or `manager@hostel.edu`), or create the user in the Supabase Auth dashboard.
2. In the Supabase **SQL Editor**, execute the following query:

```sql
UPDATE public.profiles
SET role = 'manager'
WHERE email = 'chef@messflow.internal';
```

3. Verify the role elevation:
```sql
SELECT id, email, full_name, role FROM public.profiles WHERE role = 'manager';
```

4. The user can now log in at `/login?role=manager` and access the **Manager Telemetry Deck** (`/manager`).

---

## 5. Post-Deployment Verification Checklist

- [ ] **Landing Page (`/`)**: Hero `messflow` wordmark renders smoothly with the ambient WebGL silk surface responsive to mouse movement.
- [ ] **Dual Telemetry Simulator**: Interactive attendance toggle and chart recalculations function without latency.
- [ ] **Student Flow (`/login?role=student` & `/student`)**:
  - Sign in with a student account.
  - Breakfast, Lunch, and Dinner cards load with current menu items.
  - Toggling "Attending" or "Not Attending" saves to Supabase and immediately reflects persisted state.
- [ ] **Manager Flow (`/login?role=manager` & `/manager`)**:
  - Sign in with the provisioned manager account.
  - Verify attendance totals, pending counts, and prep recommendations update dynamically.
  - Adjust the Safety Buffer and Unresponded Turnout sliders to verify real-time recalculation.
- [ ] **Security Verification**:
  - Attempting to access `/manager` as an unauthenticated visitor or student properly redirects with an unauthorized access warning.
