export function Footer() {
  return (
    <footer className="border-t border-white/[0.08] py-8 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-zinc-400 font-sans font-medium flex items-baseline">
            <span className="font-editorial-sans font-bold text-white">mess</span>
            <span className="font-editorial-serif italic text-violet-400">flow</span>
            <span className="ml-1.5 text-zinc-500 font-mono text-[11px]">telemetry active</span>
          </span>
        </div>

        <div>Next.js App Router • VisX • Motion • Supabase RLS</div>

        <div className="text-zinc-600">Zero-Waste Hostel Engine</div>
      </div>
    </footer>
  );
}
