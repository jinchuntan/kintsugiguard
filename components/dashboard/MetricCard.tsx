import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string;
  detail?: string;
  icon?: ReactNode;
  tone?: "gold" | "green" | "blue" | "rose" | "ink";
}

const tones = {
  gold: "bg-gold-50 text-gold-700 ring-gold-100",
  green: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  blue: "bg-sky-50 text-river ring-sky-100",
  rose: "bg-rose-50 text-rose-700 ring-rose-100",
  ink: "bg-ink text-white ring-ink"
};

export function MetricCard({ label, value, detail, icon, tone = "gold" }: MetricCardProps) {
  return (
    <article className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-graphite">{label}</p>
          <p className="break-anywhere mt-2 text-2xl font-semibold leading-tight text-ink">{value}</p>
        </div>
        {icon ? <span className={cn("flex h-11 w-11 items-center justify-center rounded-md ring-1", tones[tone])}>{icon}</span> : null}
      </div>
      {detail ? <p className="mt-3 text-sm leading-6 text-graphite">{detail}</p> : null}
    </article>
  );
}
