"use client";

import Link from "next/link";
import { ArrowRight, GitPullRequestArrow, Hammer, TimerReset, WalletCards } from "lucide-react";
import { BeforeAfterChart, RepairLaneChart } from "@/components/charts/WasteCharts";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { PageFrame } from "@/components/dashboard/PageFrame";
import { RiskPill, SeverityPill } from "@/components/dashboard/StatusPill";
import { useAuditRun } from "@/components/dashboard/useAuditRun";
import type { RepairItem } from "@/lib/types";
import { formatCarbon, formatCurrency } from "@/lib/utils";

export function RepairPlanExperience() {
  const { run } = useAuditRun();
  const { audit, repairPlan, report } = run;

  return (
    <PageFrame
      eyebrow="Repair plan"
      title="Prioritized gold repairs"
      description="The Repair Planner ranks each fix with impact, confidence, effort, and risk so the demo can separate quick wins from approval-gated changes."
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Monthly savings"
          value={formatCurrency(report.monthlySavingsUsd)}
          detail="Projected after repair execution"
          icon={<WalletCards className="h-5 w-5" aria-hidden />}
          tone="gold"
        />
        <MetricCard
          label="Annual savings"
          value={formatCurrency(report.annualSavingsUsd)}
          detail="Business value for CTO and finance teams"
          icon={<GitPullRequestArrow className="h-5 w-5" aria-hidden />}
          tone="green"
        />
        <MetricCard
          label="Carbon reduction"
          value={formatCarbon(report.monthlyCarbonReductionKgCO2e)}
          detail="Estimated monthly reduction"
          icon={<Hammer className="h-5 w-5" aria-hidden />}
          tone="blue"
        />
        <MetricCard
          label="Engineering time"
          value={`${report.engineeringHoursSavedMonthly}h/mo`}
          detail="Recovered from CI and duplicate workflow waste"
          icon={<TimerReset className="h-5 w-5" aria-hidden />}
          tone="rose"
        />
      </div>

      <section className="mt-6 rounded-lg border border-gold-100 bg-gold-50/70 p-5 shadow-soft">
        <p className="text-sm font-semibold text-gold-700">{repairPlan.formula}</p>
        <p className="mt-2 text-sm leading-6 text-graphite">
          Impact combines monthly cost, carbon, and severity. Confidence comes from agent evidence. Effort and risk reduce the
          score so KintsugiGuard AI does not blindly chase risky savings.
        </p>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.72fr_1fr]">
        <RepairLaneChart repairPlan={repairPlan} />
        <BeforeAfterChart audit={audit} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <RepairLane title="Quick wins" description="Low-risk, high-confidence fixes the agent can prepare first." items={repairPlan.quickWins} />
        <RepairLane title="Medium-term fixes" description="Worth scheduling after the fast repairs land." items={repairPlan.mediumTerm} />
        <RepairLane
          title="Human approval"
          description="High-impact or higher-risk changes that need an owner before execution."
          items={repairPlan.humanApproval}
        />
      </div>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.85fr]">
        <article className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft">
          <h2 className="text-lg font-semibold text-ink">Suggested pull request summary</h2>
          <p className="mt-3 text-sm leading-7 text-graphite">{repairPlan.pullRequestSummary}</p>
        </article>

        <article className="rounded-lg border border-ink/10 bg-ink p-5 text-white shadow-soft">
          <p className="text-sm font-semibold text-gold-100">Next screen</p>
          <h2 className="mt-2 text-2xl font-semibold">Agentic payment moment</h2>
          <p className="mt-3 text-sm leading-6 text-white/76">
            The X402 Payment Agent buys a specialist carbon audit result only after a budget policy approves the price.
          </p>
          <Link
            href="/x402"
            className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-gold-300 px-4 text-sm font-semibold text-ink transition hover:bg-gold-100 focus:outline-none focus:ring-2 focus:ring-white"
          >
            Simulate X402 payment
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </article>
      </section>
    </PageFrame>
  );
}

function RepairLane({ title, description, items }: { title: string; description: string; items: RepairItem[] }) {
  return (
    <section className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-ink">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-graphite">{description}</p>
      </div>
      <div className="space-y-3">
        {items.length ? (
          items.map((item) => <RepairItemCard key={item.finding.id} item={item} />)
        ) : (
          <p className="rounded-md bg-porcelain p-4 text-sm text-graphite">No repairs landed in this lane for the selected sample.</p>
        )}
      </div>
    </section>
  );
}

function RepairItemCard({ item }: { item: RepairItem }) {
  return (
    <article className="rounded-lg border border-ink/10 bg-porcelain p-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold leading-6 text-ink">{item.finding.title}</h3>
        <span className="min-w-16 rounded-md bg-white px-2 py-1 text-center text-xs font-semibold text-gold-700 ring-1 ring-gold-100">
          {item.priorityScore}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <SeverityPill severity={item.finding.severity} />
        <RiskPill risk={item.finding.riskLevel} />
        <span className="inline-flex rounded-md bg-white px-2 py-1 text-xs font-semibold text-graphite ring-1 ring-ink/10">
          Effort {item.finding.implementationDifficulty}
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-graphite">{item.finding.repairRecommendation}</p>
      <dl className="mt-3 grid gap-2 text-xs text-graphite">
        <div className="rounded-md bg-white p-2 ring-1 ring-ink/10">
          <dt className="font-semibold text-ink">Owner</dt>
          <dd>{item.suggestedOwner}</dd>
        </div>
        <div className="rounded-md bg-white p-2 ring-1 ring-ink/10">
          <dt className="font-semibold text-ink">Verification</dt>
          <dd>{item.verificationStep}</dd>
        </div>
      </dl>
    </article>
  );
}
