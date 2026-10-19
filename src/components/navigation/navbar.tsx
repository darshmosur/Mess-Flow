"use client";

import * as React from "react";
import Link from "next/link";
import { UtensilsCrossed, ShieldAlert, UserCheck, Key, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [copied, setCopied] = React.useState(false);

  const copyDemoCreds = () => {
    navigator.clipboard.writeText("manager@messflow.com / Password123!");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/85 border-b border-white/[0.08]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex items-baseline tracking-[-0.04em] text-xl">
            <span className="font-editorial-sans font-black text-white group-hover:text-violet-100 transition-colors">
              mess
            </span>
            <span className="font-editorial-serif font-normal italic text-violet-400 group-hover:text-violet-300 transition-colors">
              flow
            </span>
          </div>
        </Link>

        {/* Action Controls: Student Login & Manager Portal */}
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
