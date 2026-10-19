"use client";

import * as React from "react";
import Link from "next/link";
import { UserPlus, AlertCircle, ArrowRight, Lock, Mail, User, Building, DoorClosed } from "lucide-react";
import { signupAction, type AuthActionResult } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export function SignupForm({ hasEnv }: { hasEnv: boolean }) {
  const [state, formAction, isPending] = React.useActionState<AuthActionResult | null, FormData>(
    signupAction,
    null
  );

  return (
    <Card className="w-full max-w-md p-2 border-white/10 shadow-2xl glass-panel-glow">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto w-12 h-12 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 mb-2">
          <UserPlus className="w-6 h-6" />
        </div>
        <CardTitle className="text-xl font-bold tracking-tight">
          Create Student Account
        </CardTitle>
        <CardDescription className="text-xs text-zinc-400">
          Sign up with your hostel credentials to submit daily meal attendance.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 pt-2">
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

        {state?.error && (
          <div className="rounded-lg bg-rose-950/70 border border-rose-500/40 p-3 text-xs text-rose-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{state.error}</span>
          </div>
        )}

        <form action={formAction} className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-300 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-zinc-400" />
              <span>Full Name</span>
            </label>
            <input
              name="full_name"
              type="text"
              required
              placeholder="Alex Johnson"
              className="w-full h-9 px-3 rounded-lg bg-zinc-900/90 border border-white/10 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/80 focus:ring-1 focus:ring-violet-500/50"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-300 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-zinc-400" />
              <span>Hostel Email Address</span>
            </label>
            <input
              name="email"
              type="email"
              required
              placeholder="alex@hostel.edu"
              className="w-full h-9 px-3 rounded-lg bg-zinc-900/90 border border-white/10 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/80 focus:ring-1 focus:ring-violet-500/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-300 flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-zinc-400" />
                <span>Hostel Block</span>
              </label>
              <input
                name="hostel_block"
                type="text"
                placeholder="Block B"
                className="w-full h-9 px-3 rounded-lg bg-zinc-900/90 border border-white/10 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/80 focus:ring-1 focus:ring-violet-500/50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-300 flex items-center gap-1">
                <DoorClosed className="w-3.5 h-3.5 text-zinc-400" />
                <span>Room No.</span>
              </label>
              <input
                name="room_number"
                type="text"
                placeholder="B-304"
                className="w-full h-9 px-3 rounded-lg bg-zinc-900/90 border border-white/10 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/80 focus:ring-1 focus:ring-violet-500/50"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-300 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-zinc-400" />
              <span>Password (min. 6 characters)</span>
            </label>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
              className="w-full h-9 px-3 rounded-lg bg-zinc-900/90 border border-white/10 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/80 focus:ring-1 focus:ring-violet-500/50"
            />
          </div>

          <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-white/5 text-[11px] text-zinc-400 leading-normal">
            🛡️ <strong>Role Isolation:</strong> Public registrations are granted <em>Student</em> permissions exclusively. Manager permissions require explicit PostgreSQL provisioning.
          </div>

          <Button
            type="submit"
            disabled={isPending || !hasEnv}
            className="w-full mt-2 gap-2 text-sm font-semibold h-10"
          >
            <span>{isPending ? "Creating Account..." : "Register as Student"}</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>

        <div className="pt-3 border-t border-white/[0.08] text-center text-xs text-zinc-400">
          Already registered?{" "}
          <Link href="/login" className="text-violet-400 hover:text-violet-300 font-medium underline">
            Sign In here
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
