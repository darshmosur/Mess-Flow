"use client";

import Link from "next/link";
import { UtensilsCrossed, ShieldAlert, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/80 border-b border-white/[0.08]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-lg bg-violet-600/20 border border-violet-500/40 flex items-center justify-center text-violet-400 group-hover:scale-105 group-hover:border-violet-400 transition-all">
            <UtensilsCrossed className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-base tracking-tight text-white flex items-center gap-1.5">
              Mess<span className="text-violet-400 font-bold">Flow</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono uppercase bg-violet-950 text-violet-400 border border-violet-800/60">
                MVP
              </span>
            </span>
          </div>
        </Link>

        {/* Action Controls: Clear Student Login and Manager Login */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/login?role=student">
            <Button
              variant="outline"
              size="sm"
              className="text-xs font-medium border-white/10 hover:border-violet-500/50 hover:bg-violet-950/40"
            >
              <UserCheck className="w-3.5 h-3.5 text-violet-400" />
              <span>Student Login</span>
            </Button>
          </Link>

          <Link href="/login?role=manager">
            <Button
              variant="primary"
              size="sm"
              className="text-xs font-medium"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Manager Portal</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
