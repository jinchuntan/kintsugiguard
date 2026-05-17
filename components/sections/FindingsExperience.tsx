"use client";

import Link from "next/link";
import { ArrowRight, Box, Cloud, Cpu, Leaf } from "lucide-react";
import { BeforeAfterChart, WasteBreakdownChart } from "@/components/charts/WasteCharts";
import { KintsugiScore } from "@/components/dashboard/KintsugiScore";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { PageFrame } from "@/components/dashboard/PageFrame";
import { RiskPill, SeverityPill } from "@/components/dashboard/StatusPill";
import { useAuditRun } from "@/components/dashboard/useAuditRun";
import { formatCarbon, formatCurrency, formatPercent } from "@/lib/utils";

export function FindingsExperience() {
  const { run } = useAuditRun();
  const { audit } = run;

  return (
    <PageFrame
      eyebrow="Findings dashboard"
      title="Detected software waste cracks"
      description="Every crack includes cost, carbon, repair guidance, effort, risk, and expected before/after impact."
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Estimated monthly waste"
          value={formatCurrency(audit.metrics.estimatedTotalMonthlyWasteUsd)}
          detail={`${formatCurrency(audit.metrics.annualSavingsUsd)} potential annual savings`}
          icon={<Cloud className="h-5 w-5" aria-hidden />}
          tone="rose"
        />
        <MetricCard
          label="Carbon reduction"
          value={formatCarbon(audit.metrics.monthlyCarbonWasteKgCO2e)}
          detail="Estimated avoidable monthly impact"
          icon={<Leaf className="h-5 w-5" aria-hidden />}
          tone="green"
        />
        <MetricCard
          label="Image reduction"
          value={`${audit.metrics.dockerImageSizeMb}MB to ${audit.metrics.dockerImageTargetMb}MB`}
          detail="Smaller transfer and deployment footprint"
          icon={<Box className="h-5 w-5" aria-hidden />}
          tone="gold"
        />
        <MetricCard
          label="Duplicate AI calls"
          value={formatPercent(audit.metrics.aiDuplicateCallRate)}
          detail="Avoidable calls with cache and routing"
          icon={<Cpu className="h-5 w-5" aria-hidden />}
          tone="blue"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.72fr]">
        <WasteBreakdownChart findings={audit.findings} />
        <KintsugiScore before={audit.metrics.kintsugiScoreBefore} after={audit.metrics.kintsugiScoreAfter} />
      </div>

      <div className="mt-6">
        <BeforeAfterChart audit={audit} />
      </div>

      <section className="mt-6 rounded-lg border border-ink/10 bg-white shadow-soft">
        <div className="border-b border-ink/10 p-5">
          <h2 className="text-lg font-semibold text-ink">Waste findings</h2>
          <p className="mt-1 text-sm text-graphite">Structured output from the Crack Finder, Cloud Waste, and Carbon Accountant agents.</p>
        </div>
        <div className="grid gap-4 p-4 lg:hidden">
          {audit.findings.map((finding) => (
            <article key={finding.id} className="rounded-lg border border-ink/10 bg-porcelain p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-ink">{finding.title}</p>
                  <p className="mt-1 text-xs font-semibold text-gold-700">{finding.category}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <SeverityPill severity={finding.severity} />
                  <RiskPill risk={finding.riskLevel} />
                </div>
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
                <div className="rounded-md bg-white p-2 ring-1 ring-ink/10">
                  <dt className="font-semibold text-graphite">Cost</dt>
                  <dd className="mt-1 font-semibold text-ink">{formatCurrency(finding.estimatedMonthlyCostWaste)}</dd>
                </div>
                <div className="rounded-md bg-white p-2 ring-1 ring-ink/10">
                  <dt className="font-semibold text-graphite">Carbon</dt>
                  <dd className="mt-1 font-semibold text-ink">{formatCarbon(finding.estimatedCarbonKgCO2e)}</dd>
                </div>
                <div className="rounded-md bg-white p-2 ring-1 ring-ink/10">
                  <dt className="font-semibold text-graphite">Effort</dt>
                  <dd className="mt-1 font-semibold text-ink">{finding.implementationDifficulty}</dd>
                </div>
                <div className="rounded-md bg-white p-2 ring-1 ring-ink/10">
                  <dt className="font-semibold text-graphite">Confidence</dt>
                  <dd className="mt-1 font-semibold text-ink">{Math.round(finding.confidence * 100)}%</dd>
                </div>
              </dl>
              <p className="mt-4 text-sm leading-6 text-graphite">{finding.repairRecommendation}</p>
              <p className="mt-2 text-xs leading-5 text-graphite">{finding.expectedImpact}</p>
            </article>
          ))}
        </div>
        <div className="hidden overflow-x-auto lg:block">
          <table className="min-w-[1080px] divide-y divide-ink/10 text-left text-sm">
            <thead className="bg-porcelain text-xs font-semibold text-graphite">
              <tr>
                <th className="px-4 py-3">Finding</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Severity</th>
                <th className="px-4 py-3">Cost waste</th>
                <th className="px-4 py-3">Carbon</th>
                <th className="px-4 py-3">Difficulty</th>
                <th className="px-4 py-3">Risk</th>
                <th className="px-4 py-3">Suggested repair</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10 bg-white">
              {audit.findings.map((finding) => (
                <tr key={finding.id} className="align-top">
                  <td className="max-w-64 px-4 py-4">
                    <p className="font-semibold text-ink">{finding.title}</p>
                    <p className="mt-1 text-xs leading-5 text-graphite">{finding.expectedImpact}</p>
                  </td>
                  <td className="px-4 py-4 text-graphite">{finding.category}</td>
                  <td className="px-4 py-4">
                    <SeverityPill severity={finding.severity} />
                  </td>
                  <td className="px-4 py-4 font-semibold text-ink">{formatCurrency(finding.estimatedMonthlyCostWaste)}</td>
                  <td className="px-4 py-4 text-graphite">{formatCarbon(finding.estimatedCarbonKgCO2e)}</td>
                  <td className="px-4 py-4 text-graphite">{finding.implementationDifficulty}</td>
                  <td className="px-4 py-4">
                    <RiskPill risk={finding.riskLevel} />
                  </td>
                  <td className="max-w-80 px-4 py-4 text-graphite">{finding.repairRecommendation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="mt-6 flex justify-end">
        <Link
          href="/repair-plan"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-ink px-4 text-sm font-semibold text-white transition hover:bg-graphite focus:outline-none focus:ring-2 focus:ring-gold-300"
        >
          Prioritize repairs
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </PageFrame>
  );
}
