import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "violet" | "emerald" | "amber" | "rose" | "outline";
}

export function Badge({
  className,
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    default: "bg-zinc-800 text-zinc-300 border-zinc-700/60",
    violet: "bg-violet-950/70 text-violet-300 border-violet-500/30",
    emerald: "bg-emerald-950/70 text-emerald-300 border-emerald-500/30",
    amber: "bg-amber-950/70 text-amber-300 border-amber-500/30",
    rose: "bg-rose-950/70 text-rose-300 border-rose-500/30",
    outline: "bg-transparent text-zinc-300 border-white/15",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide uppercase border select-none",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
