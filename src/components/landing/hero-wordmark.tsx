"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

export function HeroWordmark() {
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Mouse position values for restrained cursor-reactive tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 28, stiffness: 220, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [3, -3]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-3, 3]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[65vh] sm:min-h-[72vh] flex flex-col items-center justify-center pt-16 pb-20 px-4 sm:px-6 max-w-6xl mx-auto overflow-hidden text-center"
    >
      {/* Centered Dominant Editorial Wordmark */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformPerspective: 1200,
        }}
        className="w-full flex items-center justify-center select-none cursor-default py-4"
      >
        <div className="flex items-baseline justify-center tracking-[-0.05em] leading-[0.85] text-center w-full">
          {/* "mess" — bold contemporary sans-serif */}
          <motion.span
            initial={{ y: "80%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="font-editorial-sans text-[clamp(3.5rem,14vw,11.5rem)] text-white inline-block font-black pr-0.5 sm:pr-1"
          >
            mess
          </motion.span>

          {/* "flow" — elegant italic serif */}
          <motion.span
            initial={{ y: "80%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.95, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-editorial-serif text-[clamp(3.7rem,14.5vw,12rem)] text-violet-400 inline-block font-normal italic relative -ml-0.5 sm:-ml-1"
          >
            flow
          </motion.span>
        </div>
      </motion.div>

      {/* Centered Minimal Descriptive Text */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.25 }}
        className="mt-6 sm:mt-8 max-w-xl mx-auto text-center space-y-1.5"
      >
        <p className="text-base sm:text-xl text-zinc-300 font-normal tracking-tight">
          Predictive meal planning for mess operations.
        </p>
        <p className="text-xs sm:text-sm text-zinc-500 font-mono uppercase tracking-wider">
          A zero waste initiative.
        </p>
      </motion.div>
    </section>
  );
}
