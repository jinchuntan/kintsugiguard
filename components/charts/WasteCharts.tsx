"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import type { AuditSample, Finding, RepairPlan } from "@/lib/types";

export function WasteBreakdownChart({ findings }: { findings: Finding[] }) {
  const data = findings
    .slice()
    .sort((a, b) => b.estimatedMonthlyCostWaste - a.estimatedMonthlyCostWaste)
    .slice(0, 6)
    .map((finding) => ({
      name: finding.title.length > 20 ? `${finding.title.slice(0, 20)}...` : finding.title,
      cost: finding.estimatedMonthlyCostWaste,
      carbon: finding.estimatedCarbonKgCO2e
    }));

  return (
    <div className="h-80 rounded-lg border border-ink/10 bg-white p-4 shadow-soft">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-ink">Waste Breakdown</h2>
        <p className="text-sm text-graphite">Top cracks by monthly cost and carbon impact.</p>
      </div>
      <ResponsiveContainer width="100%" height="78%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} height={56} />
          <YAxis yAxisId="cost" tick={{ fontSize: 12 }} />
          <YAxis yAxisId="carbon" orientation="right" tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Bar yAxisId="cost" dataKey="cost" name="USD/mo" fill="#a97913" radius={[4, 4, 0, 0]} />
          <Bar yAxisId="carbon" dataKey="carbon" name="kgCO2e" fill="#2f9e8f" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function BeforeAfterChart({ audit }: { audit: AuditSample }) {
  const data = [
    {
      name: "Docker MB",
      before: audit.metrics.dockerImageSizeMb,
      after: audit.metrics.dockerImageTargetMb
    },
    {
      name: "CI minutes",
      before: audit.metrics.ciRuntimeMinutes,
      after: audit.metrics.ciRuntimeTargetMinutes
    },
    {
      name: "Cloud waste",
      before: audit.metrics.monthlyCloudWasteUsd,
      after: Math.round(audit.metrics.monthlyCloudWasteUsd * 0.28)
    },
    {
      name: "Carbon kg",
      before: audit.metrics.monthlyCarbonWasteKgCO2e,
      after: Math.round(audit.metrics.monthlyCarbonWasteKgCO2e * 0.22)
    }
  ];

  return (
    <div className="h-80 rounded-lg border border-ink/10 bg-white p-4 shadow-soft">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-ink">Before and After</h2>
        <p className="text-sm text-graphite">Estimated impact after gold repairs are applied.</p>
      </div>
      <ResponsiveContainer width="100%" height="78%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="before" name="Before" fill="#b7654a" radius={[4, 4, 0, 0]} />
          <Bar dataKey="after" name="After" fill="#2f9e8f" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RepairLaneChart({ repairPlan }: { repairPlan: RepairPlan }) {
  const data = [
    { name: "Quick wins", repairs: repairPlan.quickWins.length },
    { name: "Medium-term", repairs: repairPlan.mediumTerm.length },
    { name: "Approval", repairs: repairPlan.humanApproval.length }
  ];

  return (
    <div className="h-72 rounded-lg border border-ink/10 bg-white p-4 shadow-soft">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-ink">Repair Lanes</h2>
        <p className="text-sm text-graphite">Execution grouping by autonomy and risk.</p>
      </div>
      <ResponsiveContainer width="100%" height="75%">
        <BarChart data={data} layout="vertical" margin={{ left: 16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={92} />
          <Tooltip />
          <Bar dataKey="repairs" name="Repairs" fill="#286f9b" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
