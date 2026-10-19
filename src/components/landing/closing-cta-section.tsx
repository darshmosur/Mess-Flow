"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight, UserCheck, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ClosingCtaSection() {
  return (
    <section className="relative py-24 sm:py-32 px-4 sm:px-8 border-t border-white/[0.07] max-w-5xl mx-auto">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="space-y-3"
        >
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-light tracking-tight text-white leading-[1.1]">
            Start zero-waste mess <br />
            <span className="font-serif italic text-violet-400 font-normal">operations today</span>.
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 max-w-md mx-auto pt-1">
            Experience verified meal attendance telemetry.
          </p>
        </motion.div>

        {/* Dual Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3"
        >
          <Link href="/login?role=student" className="w-full sm:w-auto">
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto h-13 px-8 rounded-full text-sm font-semibold tracking-wide flex items-center justify-center gap-2 group shadow-xl shadow-violet-600/30"
            >
              <UserCheck className="w-4 h-4 text-violet-200" />
              <span>Student Login</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Button>
          </Link>

          <Link href="/login?role=manager" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto h-13 px-8 rounded-full text-sm font-semibold border-white/10 hover:border-violet-500/50 hover:bg-violet-950/20 text-zinc-200 hover:text-white flex items-center justify-center gap-2"
            >
              <ShieldAlert className="w-4 h-4 text-violet-400" />
              <span>Mess Manager Login</span>
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
