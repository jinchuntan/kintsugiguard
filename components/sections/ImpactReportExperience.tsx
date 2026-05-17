"use client";

import { useState } from "react";
import { ClipboardCheck, Download, FileText, Leaf, TrendingUp, WalletCards } from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { PageFrame } from "@/components/dashboard/PageFrame";
import { RiskPill } from "@/components/dashboard/StatusPill";
import { useAuditRun } from "@/components/dashboard/useAuditRun";
import { formatCarbon, formatCurrency } from "@/lib/utils";

export function ImpactReportExperience() {
  const { run } = useAuditRun();
  const [copied, setCopied] = useState(false);
  const { report, audit, repairPlan } = run;

  const downloadMarkdown = () => {
    const blob = new Blob([report.markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `kintsugiguard-report-${audit.id}.md`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const copyMarkdown = async () => {
    if (!navigator.clipboard) {
      return;
    }
    try {
      await navigator.clipboard.writeText(report.markdown);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <PageFrame
      eyebrow="Impact report"
      title="Executive-ready repair ledger"
      description="A concise report for engineering, finance, and sustainability teams with savings, carbon reduction, repair risk, and Kintsugi Score."
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Monthly savings"
          value={formatCurrency(report.monthlySavingsUsd)}
          detail="Estimated recurring savings"
          icon={<WalletCards className="h-5 w-5" aria-hidden />}
          tone="gold"
        />
        <MetricCard
          label="Annual savings"
          value={formatCurrency(report.annualSavingsUsd)}
          detail="Projected business impact"
          icon={<TrendingUp className="h-5 w-5" aria-hidden />}
          tone="green"
        />
        <MetricCard
          label="Carbon reduction"
          value={formatCarbon(report.monthlyCarbonReductionKgCO2e)}
          detail="Monthly avoidable kgCO2e"
          icon={<Leaf className="h-5 w-5" aria-hidden />}
          tone="blue"
        />
        <MetricCard
          label="Kintsugi Score"
          value={`${report.scoreBefore} to ${report.scoreAfter}`}
          detail="Health after repair plan"
          icon={<FileText className="h-5 w-5" aria-hidden />}
          tone="ink"
        />
      </div>

      <section className="mt-6 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <aside className="space-y-6">
          <article className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft">
            <h2 className="text-lg font-semibold text-ink">Executive summary</h2>
            <p className="mt-3 text-sm leading-7 text-graphite">{report.executiveSummary}</p>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm font-semibold text-graphite">Repair risk</span>
              <RiskPill risk={report.riskLevel} />
            </div>
          </article>

          <article className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft">
            <h2 className="text-lg font-semibold text-ink">Key waste findings</h2>
            <div className="mt-4 space-y-3">
              {audit.findings
                .slice()
                .sort((a, b) => b.estimatedMonthlyCostWaste - a.estimatedMonthlyCostWaste)
                .slice(0, 5)
                .map((finding) => (
                  <div key={finding.id} className="rounded-md bg-porcelain p-3 ring-1 ring-ink/10">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-semibold text-ink">{finding.title}</p>
                      <span className="min-w-fit text-sm font-semibold text-gold-700">{formatCurrency(finding.estimatedMonthlyCostWaste)}</span>
                    </div>
                    <p className="mt-1 text-xs leading-5 text-graphite">{finding.repairRecommendation}</p>
                  </div>
                ))}
            </div>
          </article>

          <article className="rounded-lg border border-ink/10 bg-ink p-5 text-white shadow-soft">
            <p className="text-sm font-semibold text-gold-100">Closing line</p>
            <p className="mt-3 text-lg font-semibold leading-7">
              KintsugiGuard AI turns software waste and agentic risk into governed, measurable enterprise repair.
            </p>
          </article>
        </aside>

        <article className="rounded-lg border border-ink/10 bg-white shadow-soft">
          <div className="flex flex-col gap-3 border-b border-ink/10 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-ink">Markdown report</h2>
              <p className="text-sm text-graphite">Exportable repair plan for stakeholders and technical reviewers.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={copyMarkdown}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-ink/10 bg-white px-3 text-sm font-semibold text-ink transition hover:bg-porcelain focus:outline-none focus:ring-2 focus:ring-gold-300"
              >
                <ClipboardCheck className="h-4 w-4" aria-hidden />
                {copied ? "Copied" : "Copy"}
              </button>
              <button
                type="button"
                onClick={downloadMarkdown}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-ink px-3 text-sm font-semibold text-white transition hover:bg-graphite focus:outline-none focus:ring-2 focus:ring-gold-300"
              >
                <Download className="h-4 w-4" aria-hidden />
                Export
              </button>
            </div>
          </div>
          <pre className="max-h-[720px] overflow-auto whitespace-pre-wrap p-5 text-sm leading-7 text-graphite">
            <code>{report.markdown}</code>
          </pre>
        </article>
      </section>

      <section className="mt-6 rounded-lg border border-ink/10 bg-white p-5 shadow-soft">
        <h2 className="text-lg font-semibold text-ink">Repair ledger snapshot</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <LedgerMetric label="Quick wins" value={String(repairPlan.quickWins.length)} />
          <LedgerMetric label="Approval gates" value={String(repairPlan.humanApproval.length)} />
          <LedgerMetric label="X402 receipt" value={run.x402Simulation.receiptId} />
        </div>
      </section>
    </PageFrame>
  );
}

function LedgerMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-porcelain p-3 ring-1 ring-ink/10">
      <p className="text-xs font-semibold text-graphite">{label}</p>
      <p className="mt-1 break-words text-sm font-semibold text-ink">{value}</p>
    </div>
  );
}
