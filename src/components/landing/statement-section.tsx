"use client";

import * as React from "react";
import { motion } from "motion/react";

export function StatementSection() {
  return (
    <section className="relative py-20 sm:py-28 px-4 sm:px-6 border-t border-white/[0.07] max-w-5xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
        className="space-y-4"
      >
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-light tracking-tight text-zinc-100 leading-[1.15]">
          Students confirm attendance before meals.{" "}
          <span className="font-serif italic text-violet-400 font-normal block sm:inline">
            Mess managers prepare accurate portions with minimal food wastage.
          </span>
        </h2>
      </motion.div>
    </section>
  );
}
