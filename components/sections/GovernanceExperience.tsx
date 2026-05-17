"use client";

import Link from "next/link";
import { AlertTriangle, ArrowRight, CheckCircle2, Eye, Lock, Shield, ShieldAlert, XCircle } from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { PageFrame } from "@/components/dashboard/PageFrame";
import { useAuditRun } from "@/components/dashboard/useAuditRun";
import type { GovernanceDecision, GovernanceEntry, SecurityInspection } from "@/lib/types";
import { cn } from "@/lib/utils";

const decisionStyles: Record<GovernanceDecision, { bg: string; text: string; icon: typeof CheckCircle2 }> = {
  "Auto-approved": { bg: "bg-emerald-50 ring-emerald-200", text: "text-emerald-800", icon: CheckCircle2 },
  "Human review required": { bg: "bg-amber-50 ring-amber-200", text: "text-amber-800", icon: Eye },
  "Blocked by policy": { bg: "bg-rose-50 ring-rose-200", text: "text-rose-800", icon: XCircle },
  "Safe to simulate only": { bg: "bg-sky-50 ring-sky-200", text: "text-sky-800", icon: Shield }
};

export function GovernanceExperience() {
  const { run } = useAuditRun();
  const { governance } = run;

  return (
    <PageFrame
      eyebrow="Governance dashboard"
      title="Enterprise policy enforcement"
      description="Every repair recommendation is evaluated against enterprise policy. Actions are approved, flagged for human review, or blocked before execution."
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Total agent actions"
          value={String(governance.totalAgentActions)}
          detail="Actions evaluated by policy"
          icon={<Shield className="h-5 w-5" aria-hidden />}
          tone="ink"
        />
        <MetricCard
          label="Auto-approved"
          value={String(governance.approvedActions)}
          detail="Safe for autonomous execution"
          icon={<CheckCircle2 className="h-5 w-5" aria-hidden />}
          tone="green"
        />
        <MetricCard
          label="Human review required"
          value={String(governance.humanReviewRequired)}
          detail="Escalated for team decision"
          icon={<Eye className="h-5 w-5" aria-hidden />}
          tone="gold"
        />
        <MetricCard
          label="Blocked by policy"
          value={String(governance.blockedActions)}
          detail="Prevented from execution"
          icon={<XCircle className="h-5 w-5" aria-hidden />}
          tone="rose"
        />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Overall risk score"
          value={`${governance.overallRiskScore}/100`}
          detail="Average across all findings"
          icon={<ShieldAlert className="h-5 w-5" aria-hidden />}
          tone="gold"
        />
        <MetricCard
          label="Policy violations"
          value={String(governance.policyViolations)}
          detail="Findings exceeding risk threshold"
          icon={<AlertTriangle className="h-5 w-5" aria-hidden />}
          tone="rose"
        />
        <MetricCard
          label="Audit trail entries"
          value={String(governance.auditTrail.length)}
          detail="Full decision provenance recorded"
          icon={<Lock className="h-5 w-5" aria-hidden />}
          tone="blue"
        />
      </div>

      {/* Policy Decisions */}
      <section className="mt-6 rounded-lg border border-ink/10 bg-white shadow-soft">
        <div className="border-b border-ink/10 p-5">
          <h2 className="text-lg font-semibold text-ink">Policy decisions</h2>
          <p className="mt-1 text-sm text-graphite">Each repair recommendation evaluated against enterprise governance policy.</p>
        </div>
        <div className="grid gap-4 p-4 md:grid-cols-2">
          {governance.entries.map((entry) => (
            <GovernanceEntryCard key={entry.findingId} entry={entry} />
          ))}
        </div>
      </section>

      {/* Security Inspections */}
      <section className="mt-6 rounded-lg border border-ink/10 bg-white shadow-soft">
        <div className="border-b border-ink/10 p-5">
          <h2 className="text-lg font-semibold text-ink">Security inspections</h2>
          <p className="mt-1 text-sm text-graphite">Detected security and governance concerns across the audit context.</p>
        </div>
        <div className="grid gap-4 p-4 md:grid-cols-2">
          {governance.securityInspections.map((inspection) => (
            <SecurityInspectionCard key={inspection.id} inspection={inspection} />
          ))}
        </div>
      </section>

      {/* Policy Inspection Layer */}
      <section className="mt-6 rounded-lg border border-gold-100 bg-gold-50/70 p-5 shadow-soft">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-gold-50 text-gold-700 ring-1 ring-gold-100">
            <Shield className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <h2 className="text-base font-semibold text-ink">Policy Inspection Layer</h2>
            <p className="mt-1 text-sm leading-6 text-graphite">
              Integration-ready architecture compatible with deep prompt inspection approaches (e.g. Lobster Trap-style governance):
            </p>
            <ul className="mt-3 space-y-1 text-sm text-graphite">
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-gold-300" />Prompt injection detection</li>
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-gold-300" />Credential and PII detection</li>
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-gold-300" />Policy enforcement at agent boundary</li>
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-gold-300" />Declared vs detected intent checking</li>
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-gold-300" />Allow / deny / human review actions</li>
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-gold-300" />Full audit log with decision provenance</li>
            </ul>
            <p className="mt-3 text-xs font-semibold text-gold-700">Mock policy inspection — integration-ready architecture</p>
          </div>
        </div>
      </section>

      {/* Audit Trail */}
      <section className="mt-6 rounded-lg border border-ink/10 bg-white shadow-soft">
        <div className="border-b border-ink/10 p-5">
          <h2 className="text-lg font-semibold text-ink">Audit trail</h2>
          <p className="mt-1 text-sm text-graphite">Chronological record of all agent actions and governance decisions.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-ink/10 text-left text-sm">
            <thead className="bg-porcelain text-xs font-semibold text-graphite">
              <tr>
                <th className="px-4 py-3">Agent</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10 bg-white">
              {governance.auditTrail.map((entry, i) => {
                const style = decisionStyles[entry.decision];
                return (
                  <tr key={i} className="align-top">
                    <td className="px-4 py-3 font-semibold text-ink">{entry.agentName}</td>
                    <td className="max-w-80 px-4 py-3 text-graphite">{entry.action}</td>
                    <td className="px-4 py-3">
                      <span className={cn("inline-flex rounded-md px-2 py-1 text-xs font-semibold ring-1", style.bg, style.text)}>
                        {entry.decision}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <div className="mt-6 flex justify-end">
        <Link
          href="/x402"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-ink px-4 text-sm font-semibold text-white transition hover:bg-graphite focus:outline-none focus:ring-2 focus:ring-gold-300"
        >
          View X402 payment flow
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </PageFrame>
  );
}

function GovernanceEntryCard({ entry }: { entry: GovernanceEntry }) {
  const style = decisionStyles[entry.decision];
  const Icon = style.icon;

  return (
    <article className="rounded-lg border border-ink/10 bg-porcelain p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className={cn("flex h-9 w-9 min-w-9 items-center justify-center rounded-md ring-1", style.bg)}>
            <Icon className={cn("h-4 w-4", style.text)} aria-hidden />
          </span>
          <div>
            <p className="text-sm font-semibold text-ink">{entry.findingTitle}</p>
            <p className="mt-1 text-xs text-graphite">{entry.reason}</p>
          </div>
        </div>
        <span className="rounded-md bg-white px-2 py-1 text-xs font-semibold text-gold-700 ring-1 ring-gold-100">
          Risk {entry.riskScore}
        </span>
      </div>
      <div className="mt-3">
        <span className={cn("inline-flex rounded-md px-2 py-1 text-xs font-semibold ring-1", style.bg, style.text)}>
          {entry.decision}
        </span>
      </div>
    </article>
  );
}

function SecurityInspectionCard({ inspection }: { inspection: SecurityInspection }) {
  return (
    <article className="rounded-lg border border-ink/10 bg-porcelain p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-ink">{inspection.title}</p>
        <span className={cn(
          "rounded-md px-2 py-0.5 text-xs font-semibold ring-1",
          inspection.severity === "High" ? "bg-rose-50 text-rose-800 ring-rose-200" :
          inspection.severity === "Medium" ? "bg-amber-50 text-amber-800 ring-amber-200" :
          "bg-emerald-50 text-emerald-800 ring-emerald-200"
        )}>
          {inspection.severity}
        </span>
      </div>
      <p className="mt-1 text-xs font-semibold text-gold-700">{inspection.category}</p>
      <p className="mt-2 text-sm leading-6 text-graphite">{inspection.detail}</p>
      <p className="mt-2 text-xs leading-5 text-graphite"><span className="font-semibold">Recommendation:</span> {inspection.recommendation}</p>
    </article>
  );
}
