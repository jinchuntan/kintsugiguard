import type { AgentResult, AuditSample } from "@/lib/types";

export function carbonAccountantAgent(audit: AuditSample): AgentResult {
  const carbonByCategory = audit.findings.reduce<Record<string, number>>((accumulator, finding) => {
    accumulator[finding.category] = (accumulator[finding.category] ?? 0) + finding.estimatedCarbonKgCO2e;
    return accumulator;
  }, {});

  const topCategory = Object.entries(carbonByCategory).sort(([, a], [, b]) => b - a)[0];

  return {
    agentName: "Carbon Accountant Agent",
    status: "completed",
    confidence: 0.84,
    explanation: "Converts avoidable compute, transfer, build minutes, and model calls into an estimated monthly carbon impact.",
    summary: `Estimated ${audit.metrics.monthlyCarbonWasteKgCO2e} kgCO2e/month of avoidable digital carbon waste.`,
    output: {
      monthlyCarbonWasteKgCO2e: audit.metrics.monthlyCarbonWasteKgCO2e,
      carbonByCategory,
      topCarbonCategory: topCategory ? `${topCategory[0]} (${topCategory[1]} kgCO2e)` : "No category",
      methodology: "Demo factors combine utilization waste, CI runtime, image transfer, and model-call duplication."
    }
  };
}
