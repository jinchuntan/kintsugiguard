import type { AgentResult, AuditSample } from "@/lib/types";

const crackCategories = new Set([
  "Container Waste",
  "Dependency Waste",
  "CI/CD Waste",
  "Application Efficiency",
  "Code Duplication",
  "AI API Waste"
]);

export function crackFinderAgent(audit: AuditSample): AgentResult {
  const findings = audit.findings.filter((finding) => crackCategories.has(finding.category));
  const topCrack = [...findings].sort((a, b) => b.estimatedMonthlyCostWaste - a.estimatedMonthlyCostWaste)[0];

  return {
    agentName: "Crack Finder Agent",
    status: "completed",
    confidence: 0.91,
    explanation: "Scans package metadata, Dockerfile signals, workflow YAML, API logs, and repository structure for software waste cracks.",
    summary: `Detected ${findings.length} software cracks across build, dependency, API, and code paths.`,
    output: {
      scannedFiles: audit.files.map((file) => file.name),
      cracksDetected: findings.length,
      strongestSignal: topCrack?.title ?? "No high-confidence crack found",
      reusableEvidence: findings.flatMap((finding) => finding.sourceSignals)
    },
    findings
  };
}
