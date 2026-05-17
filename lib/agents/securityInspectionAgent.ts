import type { AgentResult, AuditSample, SecurityInspection } from "@/lib/types";

const mockInspections: SecurityInspection[] = [
  {
    id: "sec-env-secret",
    title: "Possible secret in environment file",
    category: "Credential Exposure",
    severity: "High",
    detail: "Detected a pattern resembling an API key in .env.production that may be committed to version control.",
    recommendation: "Rotate the key, move to a secrets manager, and add .env.production to .gitignore."
  },
  {
    id: "sec-shell-cmd",
    title: "Unsafe shell command in CI workflow",
    category: "Command Injection",
    severity: "Medium",
    detail: "CI step interpolates an unescaped variable into a shell command, creating injection risk.",
    recommendation: "Use environment variable binding instead of inline interpolation."
  },
  {
    id: "sec-excessive-perms",
    title: "Excessive permission in cloud IAM role",
    category: "Over-Privilege",
    severity: "High",
    detail: "Service account has AdministratorAccess instead of least-privilege scoped to required APIs.",
    recommendation: "Replace with a scoped policy covering only the required S3 and ECS actions."
  },
  {
    id: "sec-unclear-intent",
    title: "Unclear agent intent in repair suggestion",
    category: "Agent Governance",
    severity: "Medium",
    detail: "A repair suggestion could be interpreted as modifying production data without explicit scope declaration.",
    recommendation: "Require declared intent and scope before allowing execution."
  },
  {
    id: "sec-budget-verify",
    title: "Paid API call requires budget verification",
    category: "Budget Control",
    severity: "Low",
    detail: "Agent attempted to call a premium API; budget verification intercepted and approved within limits.",
    recommendation: "Continue enforcing budget gates for all paid external calls."
  },
  {
    id: "sec-prod-change",
    title: "Production resource change requires approval",
    category: "Change Control",
    severity: "High",
    detail: "Right-sizing recommendation targets production compute. Change requires approval workflow.",
    recommendation: "Route to infrastructure owner for canary verification before execution."
  }
];

export function securityInspectionAgent(audit: AuditSample): { result: AgentResult; inspections: SecurityInspection[] } {
  const inspections = mockInspections;
  const highCount = inspections.filter((i) => i.severity === "High").length;

  return {
    inspections,
    result: {
      agentName: "Security Inspection Agent",
      status: "completed",
      confidence: 0.88,
      explanation: "Flags risky prompts, exposed secrets, dangerous commands, suspicious tool usage, or unsafe repair suggestions.",
      summary: `Detected ${inspections.length} security concerns (${highCount} high severity) across the audit context.`,
      output: {
        totalInspections: inspections.length,
        highSeverity: highCount,
        categories: [...new Set(inspections.map((i) => i.category))]
      }
    }
  };
}
