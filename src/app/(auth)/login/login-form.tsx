"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { UserCheck, ShieldAlert, AlertCircle, ArrowRight, Lock, Mail } from "lucide-react";
import { loginAction, type AuthActionResult } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export function LoginForm({ hasEnv }: { hasEnv: boolean }) {
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "student";
  const errorParam = searchParams.get("error");
  const isManager = role === "manager";

  const [state, formAction, isPending] = React.useActionState<AuthActionResult | null, FormData>(
    loginAction,
    null
  );

  return (
    <Card className="w-full max-w-md p-2 border-white/10 shadow-2xl glass-panel-glow">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto w-12 h-12 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 mb-2">
          {isManager ? <ShieldAlert className="w-6 h-6" /> : <UserCheck className="w-6 h-6" />}
        </div>
        <CardTitle className="text-xl font-bold tracking-tight">
          {isManager ? "Mess Manager Sign In" : "Student Sign In"}
        </CardTitle>
        <CardDescription className="text-xs text-zinc-400">
          {isManager
            ? "Authorized kitchen managers only. Explicitly provisioned accounts."
            : "Sign in to log meal attendance and view daily mess menus."}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 pt-2">
        {/* Environment Alert when credentials are not configured */}
        {!hasEnv && (
          <div className="rounded-lg bg-amber-950/60 border border-amber-500/40 p-3.5 text-xs text-amber-200 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-amber-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Supabase Not Yet Configured</span>
            </div>
            <p className="text-[11px] text-amber-200/90 leading-relaxed">
              Add your <code className="font-mono text-amber-100">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
              <code className="font-mono text-amber-100">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to{" "}
              <code className="font-mono text-amber-100">.env.local</code> to activate live Supabase Auth.
            </p>
          </div>
        )}

        {/* URL Error Message (e.g. unauthorized attempt) */}
        {errorParam === "unauthorized_manager_access" && (
          <div className="rounded-lg bg-rose-950/70 border border-rose-500/40 p-3 text-xs text-rose-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block">Access Restricted</span>
              Your account does not possess Manager privileges. Student accounts cannot access the Manager portal.
            </div>
          </div>
        )}

        {/* Form Action Error */}
        {state?.error && (
          <div className="rounded-lg bg-rose-950/70 border border-rose-500/40 p-3 text-xs text-rose-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{state.error}</span>
          </div>
        )}

        {/* Form */}
        <form action={formAction} className="space-y-3.5">
          <input type="hidden" name="role" value={role} />

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-300 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-zinc-400" />
              <span>Email Address</span>
            </label>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder={isManager ? "chef@messflow.internal" : "student@hostel.edu"}
              className="w-full h-10 px-3 rounded-lg bg-zinc-900/90 border border-white/10 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/80 focus:ring-1 focus:ring-violet-500/50 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-300 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-zinc-400" />
              <span>Password</span>
            </label>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full h-10 px-3 rounded-lg bg-zinc-900/90 border border-white/10 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/80 focus:ring-1 focus:ring-violet-500/50 transition-colors"
            />
          </div>

          <Button
            type="submit"
            disabled={isPending || !hasEnv}
            className="w-full mt-2 gap-2 text-sm font-semibold h-10"
          >
            <span>{isPending ? "Authenticating..." : `Sign In as ${isManager ? "Manager" : "Student"}`}</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>

        {/* Navigation & Role Switching */}
        <div className="pt-3 border-t border-white/[0.08] flex flex-col gap-2.5 text-center text-xs text-zinc-400">
          {!isManager ? (
            <p>
              New student?{" "}
              <Link href="/signup" className="text-violet-400 hover:text-violet-300 font-medium underline">
                Create Student Account
              </Link>
            </p>
          ) : (
            <p className="text-[11px] text-zinc-400">
              Manager credentials must be provisioned in PostgreSQL via{" "}
              <code className="text-violet-300 font-mono">UPDATE profiles SET role = &apos;manager&apos;</code>.
            </p>
          )}

          <div className="flex items-center justify-between pt-1 text-[11px] text-zinc-400">
            <Link
              href={isManager ? "/login?role=student" : "/login?role=manager"}
              className="hover:text-zinc-200 transition-colors"
            >
              Switch to {isManager ? "Student Login" : "Manager Login"}
            </Link>
            <Link href="/" className="hover:text-zinc-200 transition-colors">
              Back to Home
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
