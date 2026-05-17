import type { AgentResult, AuditSample, RepairItem, RepairPlan } from "@/lib/types";
import { calculateRepairPriority } from "@/lib/utils";

function ownerForCategory(category: string) {
  if (category.includes("Cloud") || category.includes("Compute") || category.includes("Observability")) {
    return "DevOps platform owner";
  }
  if (category.includes("AI")) {
    return "AI platform owner";
  }
  if (category.includes("CI")) {
    return "Developer experience owner";
  }
  return "Service team owner";
}

function verificationForCategory(category: string) {
  if (category.includes("Cloud") || category.includes("Compute")) {
    return "Canary deploy with utilization, latency, and rollback guardrails.";
  }
  if (category.includes("AI")) {
    return "Compare quality sample set before and after cache or routing policy.";
  }
  if (category.includes("CI")) {
    return "Run workflow on three representative PRs and compare runtime plus failure rate.";
  }
  return "Run targeted regression tests and compare resource metrics.";
}

export function buildRepairPlan(audit: AuditSample): RepairPlan {
  const allItems: RepairItem[] = audit.findings
    .map((finding) => {
      const priorityScore = calculateRepairPriority(finding);
      const lane: RepairItem["lane"] =
        finding.riskLevel === "High" || (finding.riskLevel === "Medium" && finding.severity === "Critical")
          ? "Needs human approval"
          : priorityScore >= 4
            ? "Quick win"
            : "Medium-term";

      return {
        finding,
        priorityScore,
        lane,
        suggestedOwner: ownerForCategory(finding.category),
        verificationStep: verificationForCategory(finding.category)
      };
    })
    .sort((a, b) => b.priorityScore - a.priorityScore);

  const quickWins = allItems.filter((item) => item.lane === "Quick win");
  const mediumTerm = allItems.filter((item) => item.lane === "Medium-term");
  const humanApproval = allItems.filter((item) => item.lane === "Needs human approval");

  return {
    formula: "Repair Priority Score = impact x confidence / effort / risk",
    quickWins,
    mediumTerm,
    humanApproval,
    allItems,
    pullRequestSummary: [
      "Slim runtime image and production dependencies.",
      "Add CI dependency cache and selective workflow execution.",
      "Introduce budget-aware AI API caching and routing.",
      "Apply cloud right-sizing behind canary and approval gates.",
      "Attach before/after cost, carbon, and runtime checks to the repair ledger."
    ].join(" ")
  };
}

export function repairPlannerAgent(audit: AuditSample): { result: AgentResult; repairPlan: RepairPlan } {
  const repairPlan = buildRepairPlan(audit);

  return {
    repairPlan,
    result: {
      agentName: "Repair Planner Agent",
      status: "completed",
      confidence: 0.87,
      explanation: "Ranks repairs by impact, confidence, effort, and risk, then groups them into execution lanes.",
      summary: `${repairPlan.quickWins.length} quick wins, ${repairPlan.mediumTerm.length} medium-term repairs, and ${repairPlan.humanApproval.length} approval-gated repairs.`,
      output: {
        formula: repairPlan.formula,
        topRepair: repairPlan.allItems[0]?.finding.title ?? "No repair found",
        quickWins: repairPlan.quickWins.map((item) => item.finding.title),
        approvalsRequired: repairPlan.humanApproval.map((item) => item.finding.title)
      }
    }
  };
}
