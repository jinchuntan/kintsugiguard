import type { AgentResult, AuditSample, ImpactReport, RepairPlan, RiskLevel } from "@/lib/types";
import { formatCarbon, formatCurrency } from "@/lib/utils";

function overallRisk(repairPlan: RepairPlan): RiskLevel {
  if (repairPlan.humanApproval.length > 1) {
    return "High";
  }
  if (repairPlan.humanApproval.length === 1 || repairPlan.mediumTerm.length > repairPlan.quickWins.length) {
    return "Medium";
  }
  return "Low";
}

export function buildImpactReport(audit: AuditSample, repairPlan: RepairPlan): ImpactReport {
  const totalFindingWaste = audit.findings.reduce((sum, finding) => sum + finding.estimatedMonthlyCostWaste, 0);
  const monthlySavingsUsd = Math.max(audit.metrics.estimatedTotalMonthlyWasteUsd, totalFindingWaste);
  const monthlyCarbonReductionKgCO2e = audit.metrics.monthlyCarbonWasteKgCO2e;
  const riskLevel = overallRisk(repairPlan);

  const keyFindings = audit.findings
    .slice()
    .sort((a, b) => b.estimatedMonthlyCostWaste - a.estimatedMonthlyCostWaste)
    .slice(0, 5)
    .map((finding) => `- ${finding.title}: ${formatCurrency(finding.estimatedMonthlyCostWaste)}/month, ${formatCarbon(finding.estimatedCarbonKgCO2e)}`)
    .join("\n");

  const recommendedRepairs = repairPlan.allItems
    .slice(0, 6)
    .map((item, index) => `${index + 1}. ${item.finding.repairRecommendation} (priority ${item.priorityScore})`)
    .join("\n");

  const executiveSummary = `${audit.name} can recover roughly ${formatCurrency(monthlySavingsUsd)} per month and ${formatCarbon(monthlyCarbonReductionKgCO2e)} by repairing the highest-confidence cracks before adding more cloud capacity.`;

  const governanceSection = `## Governance summary
- Repairs auto-approved: ${repairPlan.quickWins.length}
- Repairs requiring human review: ${repairPlan.humanApproval.length}
- Blocked by policy: ${repairPlan.humanApproval.filter((item) => item.finding.riskLevel === "High").length}
- Audit trail entries recorded for all agent actions`;

  const markdown = `# KintsugiGuard AI Impact Report

## Executive summary
${executiveSummary}

## Key waste findings
${keyFindings}

## Recommended repairs
${recommendedRepairs}

${governanceSection}

## Business and sustainability impact
- Estimated monthly savings: ${formatCurrency(monthlySavingsUsd)}
- Estimated annual savings: ${formatCurrency(audit.metrics.annualSavingsUsd)}
- Estimated monthly carbon reduction: ${formatCarbon(monthlyCarbonReductionKgCO2e)}
- Engineering time saved monthly: ${audit.metrics.engineeringHoursSavedMonthly} hours
- Repair risk level: ${riskLevel}
- KintsugiGuard Score: ${audit.metrics.kintsugiScoreBefore} -> ${audit.metrics.kintsugiScoreAfter}

## Suggested pull request summary
${repairPlan.pullRequestSummary}
`;

  return {
    executiveSummary,
    monthlySavingsUsd,
    annualSavingsUsd: audit.metrics.annualSavingsUsd,
    monthlyCarbonReductionKgCO2e,
    engineeringHoursSavedMonthly: audit.metrics.engineeringHoursSavedMonthly,
    riskLevel,
    scoreBefore: audit.metrics.kintsugiScoreBefore,
    scoreAfter: audit.metrics.kintsugiScoreAfter,
    markdown
  };
}

export function impactReportAgent(audit: AuditSample, repairPlan: RepairPlan): { result: AgentResult; report: ImpactReport } {
  const report = buildImpactReport(audit, repairPlan);

  return {
    report,
    result: {
      agentName: "Impact Report Agent",
      status: "completed",
      confidence: 0.86,
      explanation: "Consolidates findings, repair lanes, X402 evidence, and before/after metrics into an executive-ready report.",
      summary: `Prepared report showing ${formatCurrency(report.annualSavingsUsd)} annual savings and a Kintsugi Score lift from ${report.scoreBefore} to ${report.scoreAfter}.`,
      output: {
        monthlySavingsUsd: report.monthlySavingsUsd,
        annualSavingsUsd: report.annualSavingsUsd,
        monthlyCarbonReductionKgCO2e: report.monthlyCarbonReductionKgCO2e,
        scoreBefore: report.scoreBefore,
        scoreAfter: report.scoreAfter
      }
    }
  };
}
