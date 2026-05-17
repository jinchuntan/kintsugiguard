import type { AgentResult, AuditSample } from "@/lib/types";

const cloudCategories = new Set(["Cloud Waste", "Idle Compute", "Observability Waste"]);

export function cloudWasteAgent(audit: AuditSample): AgentResult {
  const findings = audit.findings.filter((finding) => cloudCategories.has(finding.category));
  const monthlyCost = findings.reduce((sum, finding) => sum + finding.estimatedMonthlyCostWaste, 0);
  const idleSignal = `${audit.metrics.idleComputeHoursPerDay} idle compute hours/day`;

  return {
    agentName: "Cloud Waste Agent",
    status: "completed",
    confidence: 0.88,
    explanation: "Correlates cloud billing rows, utilization clues, replica policies, and scheduled workload behavior.",
    summary: `Identified ${monthlyCost.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}/month of cloud and infrastructure waste.`,
    output: {
      monthlyCloudWasteUsd: audit.metrics.monthlyCloudWasteUsd,
      cloudFindings: findings.length,
      idleComputeSignal: idleSignal,
      rightSizingCandidate: findings.find((finding) => finding.category === "Cloud Waste")?.title ?? "No right-sizing candidate"
    },
    findings
  };
}
