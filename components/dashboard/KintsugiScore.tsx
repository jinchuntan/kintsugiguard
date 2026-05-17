import { Gauge } from "lucide-react";

export function KintsugiScore({ before, after }: { before: number; after: number }) {
  return (
    <article className="gold-crack rounded-lg border border-ink/10 bg-white p-5 shadow-soft">
      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-gold-50 text-gold-700 ring-1 ring-gold-100">
            <Gauge className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <p className="text-sm font-medium text-graphite">Kintsugi Score</p>
            <p className="text-2xl font-semibold text-ink">
              {before} <span className="text-graphite">to</span> {after}
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <ScoreBar label="Before repair" value={before} color="bg-clay" />
          <ScoreBar label="After repair" value={after} color="bg-mint" />
        </div>
      </div>
    </article>
  );
}

function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs font-medium text-graphite">
        <span>{label}</span>
        <span>{value}/100</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-ink/10">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
      </div>
    </div>
  );
}
