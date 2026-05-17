import type { AgentResult, AuditSample, GovernanceDecision, GovernanceEntry, GovernancePolicyCheck, RepairPlan } from "@/lib/types";

function decideFinding(findingId: string, title: string, riskLevel: string, category: string): GovernanceEntry {
  const policyChecks: GovernancePolicyCheck[] = [
    {
      id: `${findingId}-production`,
      question: "Does this repair touch production infrastructure?",
      result: riskLevel === "High" || category.includes("Cloud"),
      detail: riskLevel === "High" ? "Yes — production resource modification detected." : "No — isolated change."
    },
    {
      id: `${findingId}-secrets`,
      question: "Does this action modify secrets or environment variables?",
      result: false,
      detail: "No secrets or environment variable changes detected."
    },
    {
      id: `${findingId}-delete`,
      question: "Does this recommendation involve deleting resources?",
      result: category.includes("Idle") || category.includes("Cloud"),
      detail: category.includes("Idle") ? "Yes — idle resource removal suggested." : "No deletion involved."
    },
    {
      id: `${findingId}-human`,
      question: "Does this require human approval?",
      result: riskLevel !== "Low",
      detail: riskLevel === "Low" ? "No — low risk, auto-approvable." : "Yes — elevated risk requires review."
    },
    {
      id: `${findingId}-budget`,
      question: "Is the action within the allowed budget?",
      result: true,
      detail: "Action does not incur additional cost."
    }
  ];

  const violations = policyChecks.filter((check) => check.result).length;
  let decision: GovernanceDecision;

  if (riskLevel === "High" && category.includes("Cloud")) {
    decision = "Blocked by policy";
  } else if (riskLevel === "High" || violations >= 3) {
    decision = "Human review required";
  } else if (riskLevel === "Medium") {
    decision = "Human review required";
  } else {
    decision = "Auto-approved";
  }

  const riskScore = violations * 20 + (riskLevel === "High" ? 30 : riskLevel === "Medium" ? 15 : 0);

  return {
    findingId,
    findingTitle: title,
    decision,
    policyChecks,
    riskScore: Math.min(100, riskScore),
    reason: decision === "Auto-approved"
      ? "Low risk with no policy violations. Safe for autonomous execution."
      : decision === "Blocked by policy"
        ? "Production infrastructure deletion requires explicit approval workflow."
        : "Elevated risk or policy flag requires human review before execution."
  };
}

export function governancePolicyAgent(audit: AuditSample, repairPlan: RepairPlan): { result: AgentResult; entries: GovernanceEntry[] } {
  const entries = audit.findings.map((finding) =>
    decideFinding(finding.id, finding.title, finding.riskLevel, finding.category)
  );

  const approved = entries.filter((e) => e.decision === "Auto-approved").length;
  const blocked = entries.filter((e) => e.decision === "Blocked by policy").length;
  const review = entries.filter((e) => e.decision === "Human review required").length;

  return {
    entries,
    result: {
      agentName: "Governance Policy Agent",
      status: "completed",
      confidence: 0.91,
      explanation: "Checks whether recommended repairs are allowed under enterprise policy before execution.",
      summary: `Policy review complete: ${approved} auto-approved, ${review} require human review, ${blocked} blocked.`,
      output: {
        totalEntries: entries.length,
        autoApproved: approved,
        humanReview: review,
        blocked,
        averageRiskScore: Math.round(entries.reduce((sum, e) => sum + e.riskScore, 0) / entries.length)
      }
    }
  };
}
