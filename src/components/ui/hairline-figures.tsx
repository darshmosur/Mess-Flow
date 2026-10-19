"use client";

import * as React from "react";
import { Padlock, Plot } from "@lucasmarkes/hairline/react";

interface HairlineFigureProps {
  intensity?: number;
  play?: boolean;
  className?: string;
}

export function HairlinePadlock({
  intensity = 0.7,
  play = true,
  className = "w-28",
}: HairlineFigureProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={`${className} aspect-[5/4] animate-pulse bg-white/[0.02] rounded-xl`}
      />
    );
  }

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <Padlock
        intensity={intensity}
        theme="dark"
        play={play}
        className="w-full h-auto cursor-pointer"
      />
    </div>
  );
}

export function HairlinePlot({
  intensity = 0.7,
  play = true,
  className = "w-28",
}: HairlineFigureProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={`${className} aspect-[5/4] animate-pulse bg-white/[0.02] rounded-xl`}
      />
    );
  }

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <Plot
        intensity={intensity}
        theme="dark"
        play={play}
        className="w-full h-auto cursor-pointer"
      />
    </div>
  );
}
