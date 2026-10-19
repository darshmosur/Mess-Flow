"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight, UserCheck, ShieldAlert, Key, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ClosingCtaSection() {
  const [copied, setCopied] = React.useState(false);

  const copyCreds = () => {
    navigator.clipboard.writeText("manager@messflow.com / Password123!");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative py-28 sm:py-36 px-4 sm:px-8 border-t border-white/[0.07] max-w-7xl mx-auto">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="space-y-4"
        >
          <span className="text-xs font-mono uppercase tracking-widest text-violet-400">
            04 / Access Portal
          </span>
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-light tracking-tight text-white leading-[1.05]">
            Start zero-waste mess <br />
            <span className="font-serif italic text-violet-400">operations today</span>.
          </h2>
          <p className="text-base sm:text-lg text-zinc-400 max-w-xl mx-auto pt-2">
            Experience verified meal attendance telemetry. Choose your portal to proceed.
          </p>
        </motion.div>

        {/* Action Dual Launchpad */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <Link href="/login?role=student" className="w-full sm:w-auto">
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto h-14 px-8 rounded-full text-base font-semibold tracking-wide flex items-center justify-center gap-2 group shadow-xl shadow-violet-600/30"
            >
              <UserCheck className="w-5 h-5 text-violet-200" />
              <span>Student Attendance Portal</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Button>
          </Link>

          <Link href="/login?role=manager" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto h-14 px-8 rounded-full text-base font-semibold border-white/10 hover:border-violet-500/50 hover:bg-violet-950/20 text-zinc-200 hover:text-white flex items-center justify-center gap-2"
            >
              <ShieldAlert className="w-5 h-5 text-violet-400" />
              <span>Mess Manager Portal</span>
            </Button>
          </Link>
        </motion.div>

        {/* Demo Credentials Quick-Copy for Evaluators */}
        <div className="pt-8">
          <button
            onClick={copyCreds}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-white/10 hover:border-violet-500/40 text-xs font-mono text-zinc-400 hover:text-zinc-200 cursor-pointer transition-colors"
          >
            <Key className="w-3.5 h-3.5 text-violet-400" />
            <span>Copy Demo: manager@messflow.com / Password123!</span>
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400 ml-1" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-zinc-500 ml-1" />
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
