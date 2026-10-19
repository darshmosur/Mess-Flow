import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#09090b",
        foreground: "#f8fafc",
        card: {
          DEFAULT: "#111116",
          foreground: "#f8fafc",
        },
        popover: {
          DEFAULT: "#111116",
          foreground: "#f8fafc",
        },
        primary: {
          DEFAULT: "#8b5cf6", // Violet-500
          foreground: "#ffffff",
          dark: "#7c3aed",
          light: "#a78bfa",
        },
        secondary: {
          DEFAULT: "#1a1a24",
          foreground: "#e2e8f0",
        },
        muted: {
          DEFAULT: "#181820",
          foreground: "#94a3b8",
        },
        accent: {
          DEFAULT: "#261a3d",
          foreground: "#c4b5fd",
        },
        destructive: {
          DEFAULT: "#ef4444",
          foreground: "#ffffff",
        },
        border: "rgba(255, 255, 255, 0.08)",
        ring: "#8b5cf6",
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.375rem",
      },
      letterSpacing: {
        tighter: "-0.04em",
        tight: "-0.025em",
      },
      backgroundImage: {
        "grid-pattern": "radial-gradient(rgba(139, 92, 246, 0.12) 1px, transparent 1px)",
        "hero-glow": "radial-gradient(circle 800px at 50% -100px, rgba(139, 92, 246, 0.22), transparent 70%)",
      },
    },
  },
  plugins: [],
};

export default config;
