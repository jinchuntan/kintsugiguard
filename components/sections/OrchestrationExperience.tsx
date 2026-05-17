"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, BrainCircuit, CheckCircle2, Clock3, Loader2 } from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { PageFrame } from "@/components/dashboard/PageFrame";
import { AgentStatusPill } from "@/components/dashboard/StatusPill";
import { useAuditRun } from "@/components/dashboard/useAuditRun";
import type { AgentStatus } from "@/lib/types";
import { cn, formatCarbon, formatCurrency, formatPercent } from "@/lib/utils";

export function OrchestrationExperience() {
  const { run } = useAuditRun();
  const [progressIndex, setProgressIndex] = useState(0);

  useEffect(() => {
    setProgressIndex(0);
    const timer = window.setInterval(() => {
      setProgressIndex((current) => Math.min(current + 1, run.agents.length));
    }, 760);

    return () => window.clearInterval(timer);
  }, [run.audit.id, run.agents.length]);

  const completedCount = Math.min(progressIndex, run.agents.length);
  const progress = Math.round((completedCount / run.agents.length) * 100);

  const statuses = useMemo(
    () =>
      run.agents.map((_, index): AgentStatus => {
        if (index < progressIndex || progressIndex >= run.agents.length) {
          return "completed";
        }
        if (index === progressIndex) {
          return "running";
        }
        return "waiting";
      }),
    [progressIndex, run.agents]
  );

  return (
    <PageFrame
      eyebrow="Agent orchestration"
      title="Autonomous repair team at work"
      description="Each specialist agent produces structured output, then hands off evidence to the next stage of the software waste audit."
    >
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard
          label="Audit package"
          value={run.audit.name}
          detail={`${run.audit.files.length} signals scanned`}
          icon={<BrainCircuit className="h-5 w-5" aria-hidden />}
          tone="ink"
        />
        <MetricCard
          label="Monthly waste"
          value={formatCurrency(run.audit.metrics.estimatedTotalMonthlyWasteUsd)}
          detail="Cost waste detected before repairs"
          icon={<Clock3 className="h-5 w-5" aria-hidden />}
          tone="rose"
        />
        <MetricCard
          label="Carbon waste"
          value={formatCarbon(run.audit.metrics.monthlyCarbonWasteKgCO2e)}
          detail="Avoidable monthly footprint"
          icon={<CheckCircle2 className="h-5 w-5" aria-hidden />}
          tone="green"
        />
        <MetricCard
          label="AI duplication"
          value={formatPercent(run.audit.metrics.aiDuplicateCallRate)}
          detail="Avoidable repeated model calls"
          icon={<BrainCircuit className="h-5 w-5" aria-hidden />}
          tone="blue"
        />
      </div>

      <section className="mt-6 rounded-lg border border-ink/10 bg-white p-5 shadow-soft">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-ink">Multi-agent run</h2>
            <p className="text-sm text-graphite">Visible agent state for a three-minute demo narrative.</p>
          </div>
          <div className="min-w-56">
            <div className="mb-1 flex items-center justify-between text-xs font-semibold text-graphite">
              <span>Run progress</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-ink/10">
              <div className="h-full rounded-full bg-gold-300 transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7">
          {run.agents.map((agent, index) => {
            const status = statuses[index];
            const showOutput = status === "completed";
            return (
              <article
                key={agent.agentName}
                className={cn(
                  "relative rounded-lg border p-4 shadow-sm transition",
                  status === "running"
                    ? "border-gold-300 bg-gold-50"
                    : status === "completed"
                      ? "border-emerald-200 bg-emerald-50/55"
                      : "border-ink/10 bg-white"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-md",
                      status === "completed" ? "bg-mint text-white" : status === "running" ? "bg-gold-300 text-ink" : "bg-ink/8 text-graphite"
                    )}
                  >
                    {status === "running" ? (
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    ) : status === "completed" ? (
                      <CheckCircle2 className="h-4 w-4" aria-hidden />
                    ) : (
                      <Clock3 className="h-4 w-4" aria-hidden />
                    )}
                  </span>
                  <AgentStatusPill status={status} />
                </div>
                <h3 className="mt-4 text-sm font-semibold leading-6 text-ink">{agent.agentName}</h3>
                <p className="mt-2 text-sm leading-6 text-graphite xl:min-h-24">
                  {showOutput ? agent.summary : status === "running" ? agent.explanation : "Queued for the next handoff."}
                </p>
                <div className="mt-4 rounded-md bg-white/72 p-3 ring-1 ring-ink/10">
                  <p className="text-xs font-semibold text-graphite">Confidence</p>
                  <p className="mt-1 text-lg font-semibold text-ink">{formatPercent(agent.confidence)}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft">
          <h2 className="text-lg font-semibold text-ink">Agent handoff summary</h2>
          <div className="mt-4 space-y-3">
            {run.agents.map((agent) => (
              <div key={agent.agentName} className="rounded-md bg-porcelain p-3 ring-1 ring-ink/10">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-ink">{agent.agentName}</p>
                  <span className="text-xs font-semibold text-gold-700">{formatPercent(agent.confidence)}</span>
                </div>
                <p className="mt-1 text-sm leading-6 text-graphite">{agent.summary}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-ink/10 bg-ink p-5 text-white shadow-soft">
          <p className="text-sm font-semibold text-gold-100">Next screen</p>
          <h2 className="mt-2 text-2xl font-semibold">Findings are ready</h2>
          <p className="mt-3 text-sm leading-6 text-white/76">
            The autonomous run has converted raw audit files into ranked cracks, estimated waste, repair actions, and payment evidence.
          </p>
          <Link
            href="/findings"
            className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-gold-300 px-4 text-sm font-semibold text-ink transition hover:bg-gold-100 focus:outline-none focus:ring-2 focus:ring-white"
          >
            Open findings dashboard
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </section>
    </PageFrame>
  );
}
