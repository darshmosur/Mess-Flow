import Link from "next/link";
import { UserCheck, ShieldAlert, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RoleLaunchSection() {
  return (
    <section className="py-16 md:py-20 border-t border-white/[0.08] relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="rounded-2xl bg-gradient-to-b from-[#14141d] to-[#0e0e14] border border-violet-500/20 p-8 sm:p-12 relative overflow-hidden">
          {/* Subtle violet ambient accent */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-violet-600/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            <span className="text-xs font-mono font-medium text-violet-400 uppercase tracking-wider">
              Ready for Testing
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Access the MessFlow Portals
            </h2>
            <p className="mt-2 text-sm text-zinc-300">
              Select your persona to test the attendance registration flow or the kitchen preparation dashboard.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link href="/login?role=student">
                <Button size="lg" className="w-full sm:w-auto gap-2 text-sm font-semibold">
                  <UserCheck className="w-4 h-4" />
                  <span>Enter Student Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>

              <Link href="/login?role=manager">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto gap-2 text-sm font-semibold border-white/15 hover:border-violet-500/50 hover:bg-violet-950/40"
                >
                  <ShieldAlert className="w-4 h-4 text-violet-400" />
                  <span>Enter Manager Portal</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
