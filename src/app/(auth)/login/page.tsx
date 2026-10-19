import { Suspense } from "react";
import { LoginForm } from "./login-form";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  const hasEnv = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative">
      <div className="absolute inset-0 bg-radial-violet opacity-60 pointer-events-none" />
      <div className="relative z-10 w-full flex justify-center">
        <Suspense
          fallback={
            <div className="w-full max-w-md h-96 rounded-2xl bg-zinc-900/40 animate-pulse border border-white/5" />
          }
        >
          <LoginForm hasEnv={hasEnv} />
        </Suspense>
      </div>
    </div>
  );
}
