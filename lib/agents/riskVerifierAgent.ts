import type { AgentResult, AuditSample, RepairPlan } from "@/lib/types";

export function riskVerifierAgent(audit: AuditSample, repairPlan: RepairPlan): AgentResult {
  const lowRisk = repairPlan.allItems.filter((item) => item.finding.riskLevel === "Low").length;
  const mediumRisk = repairPlan.allItems.filter((item) => item.finding.riskLevel === "Medium").length;
  const highRisk = repairPlan.allItems.filter((item) => item.finding.riskLevel === "High").length;

  return {
    agentName: "Risk Verifier Agent",
    status: "completed",
    confidence: 0.83,
    explanation: "Adds approval gates, canary checks, rollback plans, and quality thresholds before repair execution.",
    summary: `Risk gates prepared for ${audit.name}: ${lowRisk} low, ${mediumRisk} medium, ${highRisk} high-risk repairs.`,
    output: {
      riskDistribution: {
        lowRisk,
        mediumRisk,
        highRisk
      },
      approvalGateCount: repairPlan.humanApproval.length,
      mandatoryChecks: [
        "No production capacity change without canary metrics",
        "No AI routing change without quality sample comparison",
        "No dependency removal without targeted tests",
        "Attach every before/after metric to the repair ledger"
      ]
    }
  };
}
