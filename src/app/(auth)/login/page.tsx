import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, UserCheck, ShieldAlert, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

function LoginContent({ role }: { role?: string }) {
  const isManager = role === "manager";

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md p-2 border-white/10 shadow-2xl">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-12 h-12 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 mb-2">
            {isManager ? <ShieldAlert className="w-6 h-6" /> : <UserCheck className="w-6 h-6" />}
          </div>
          <CardTitle className="text-xl font-bold">
            {isManager ? "Mess Manager Portal" : "Student Attendance Portal"}
          </CardTitle>
          <CardDescription>
            {isManager
              ? "Access kitchen forecast telemetry & preparation planning"
              : "Access daily meal RSVP and cutoff registration"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pt-2">
          <div className="rounded-lg bg-zinc-900/90 border border-white/5 p-4 text-xs text-zinc-400 space-y-2">
            <div className="flex items-center gap-2 font-mono text-violet-400 font-semibold">
              <KeyRound className="w-4 h-4" />
              <span>Milestone 2 Checkpoint</span>
            </div>
            <p>
              Supabase Auth, Row Level Security (RLS) policies, and 1-click hackathon role switching
              will be connected in <strong>Milestone 2</strong>.
            </p>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <Link href="/" className="w-full">
              <Button variant="outline" className="w-full gap-2 text-xs">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Landing Page</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const params = await searchParams;
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center text-zinc-500">Loading...</div>}>
      <LoginContent role={params.role} />
    </Suspense>
  );
}
