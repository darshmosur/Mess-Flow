import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50 active:scale-[0.98]";

    const variantStyles = {
      primary:
        "bg-violet-600 text-white hover:bg-violet-500 shadow-lg shadow-violet-600/20 hover:shadow-violet-500/30 border border-violet-500/30",
      secondary:
        "bg-zinc-800/80 text-zinc-100 hover:bg-zinc-700/80 border border-white/10 hover:border-white/20",
      outline:
        "bg-transparent text-zinc-200 hover:text-white border border-white/15 hover:border-violet-500/50 hover:bg-violet-500/10",
      ghost:
        "bg-transparent text-zinc-400 hover:text-white hover:bg-white/5",
      destructive:
        "bg-rose-600 text-white hover:bg-rose-500 border border-rose-500/30",
    };

    const sizeStyles = {
      sm: "text-xs px-3 py-1.5 h-8 gap-1.5",
      md: "text-sm px-4 py-2 h-9 gap-2",
      lg: "text-sm md:text-base px-5 py-2.5 h-11 gap-2.5",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
