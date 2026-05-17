import type { AuditRun, GovernanceSummary } from "@/lib/types";
import { auditTrailAgent, buildAuditTrail } from "@/lib/agents/auditTrailAgent";
import { carbonAccountantAgent } from "@/lib/agents/carbonAccountantAgent";
import { cloudWasteAgent } from "@/lib/agents/cloudWasteAgent";
import { crackFinderAgent } from "@/lib/agents/crackFinderAgent";
import { governancePolicyAgent } from "@/lib/agents/governancePolicyAgent";
import { impactReportAgent } from "@/lib/agents/impactReportAgent";
import { repairPlannerAgent } from "@/lib/agents/repairPlannerAgent";
import { riskVerifierAgent } from "@/lib/agents/riskVerifierAgent";
import { securityInspectionAgent } from "@/lib/agents/securityInspectionAgent";
import { x402PaymentAgent } from "@/lib/agents/x402PaymentAgent";
import { getAuditSample } from "@/lib/data/demoAudit";

export function runAuditWorkflow(auditId?: string): AuditRun {
  const audit = getAuditSample(auditId);
  const crackFinder = crackFinderAgent(audit);
  const cloudWaste = cloudWasteAgent(audit);
  const carbonAccountant = carbonAccountantAgent(audit);
  const repairPlanner = repairPlannerAgent(audit);
  const riskVerifier = riskVerifierAgent(audit, repairPlanner.repairPlan);
  const x402Payment = x402PaymentAgent(audit);
  const governance = governancePolicyAgent(audit, repairPlanner.repairPlan);
  const security = securityInspectionAgent(audit);
  const impactReport = impactReportAgent(audit, repairPlanner.repairPlan);

  const coreAgents = [
    crackFinder,
    cloudWaste,
    carbonAccountant,
    repairPlanner.result,
    riskVerifier,
    x402Payment.result,
    governance.result,
    security.result,
    impactReport.result
  ];

  const auditTrail = auditTrailAgent(coreAgents, governance.entries);
  const trail = buildAuditTrail(coreAgents, governance.entries);

  const governanceSummary: GovernanceSummary = {
    totalAgentActions: coreAgents.length,
    approvedActions: governance.entries.filter((e) => e.decision === "Auto-approved").length,
    blockedActions: governance.entries.filter((e) => e.decision === "Blocked by policy").length,
    humanReviewRequired: governance.entries.filter((e) => e.decision === "Human review required").length,
    overallRiskScore: Math.round(governance.entries.reduce((sum, e) => sum + e.riskScore, 0) / governance.entries.length),
    policyViolations: governance.entries.filter((e) => e.riskScore > 50).length,
    entries: governance.entries,
    securityInspections: security.inspections,
    auditTrail: trail
  };

  return {
    audit,
    agents: [...coreAgents, auditTrail],
    repairPlan: repairPlanner.repairPlan,
    x402Simulation: x402Payment.simulation,
    report: impactReport.report,
    governance: governanceSummary
  };
}
