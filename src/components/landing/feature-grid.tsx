import { CheckCircle2, Clock, BarChart3, ShieldCheck } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function FeatureGrid() {
  const features = [
    {
      icon: CheckCircle2,
      title: "1-Tap Student Attendance",
      description:
        "Students quickly mark attending or skipping for each meal slot. Fast, minimal friction, and mobile-ready.",
      tag: "For Students",
    },
    {
      icon: Clock,
      title: "Enforced Cutoff Timers",
      description:
        "RSVP automatically locks 2 hours prior to meal service. Prevents kitchen guesswork and unaccounted surges.",
      tag: "Rule Engine",
    },
    {
      icon: BarChart3,
      title: "Predictive Headcount Forecast",
      description:
        "Aggregates confirmed headcounts instantly. Automatically applies safety buffers to prevent both shortage and waste.",
      tag: "For Managers",
    },
    {
      icon: ShieldCheck,
      title: "Role-Based Data Isolation",
      description:
        "Students only control their own meal selections. Managers access hostel-wide aggregations and meal schedules.",
      tag: "Security",
    },
  ];

  return (
    <section className="py-16 md:py-24 border-t border-white/[0.08] relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Heading: Zero Fluff */}
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-mono font-medium text-violet-400 uppercase tracking-wider">
            Operational Workflow
          </span>
          <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Designed to solve hostel kitchen volatility.
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            A closed-loop system connecting student intent to kitchen preparation.
          </p>
        </div>

        {/* 4-Item Dense Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <Card
                key={idx}
                className="bg-[#111116]/80 hover:border-violet-500/40 hover:bg-[#15151e] transition-all duration-200 group"
              >
                <CardHeader className="p-5 pb-2">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center text-violet-400 group-hover:border-violet-500/40 group-hover:text-violet-300 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-white/5">
                      {feat.tag}
                    </span>
                  </div>
                  <CardTitle className="text-sm font-semibold text-zinc-100">
                    {feat.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 pt-1">
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {feat.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
