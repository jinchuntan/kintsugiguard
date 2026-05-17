import type { AgentResult, AuditRun, AuditTrailEntry, GovernanceEntry } from "@/lib/types";

export function buildAuditTrail(agents: AgentResult[], governanceEntries: GovernanceEntry[]): AuditTrailEntry[] {
  const now = new Date();
  const entries: AuditTrailEntry[] = [];

  agents.forEach((agent, index) => {
    const timestamp = new Date(now.getTime() + index * 2000).toISOString();
    const matchingGov = governanceEntries[index];

    entries.push({
      timestamp,
      agentName: agent.agentName,
      action: agent.summary,
      dataUsed: `Audit package signals (confidence: ${Math.round(agent.confidence * 100)}%)`,
      recommendation: agent.summary,
      decision: matchingGov?.decision ?? "Auto-approved"
    });
  });

  return entries;
}

export function auditTrailAgent(agents: AgentResult[], governanceEntries: GovernanceEntry[]): AgentResult {
  const trail = buildAuditTrail(agents, governanceEntries);

  return {
    agentName: "Audit Trail Agent",
    status: "completed",
    confidence: 0.95,
    explanation: "Records what each agent did, what data was used, what recommendation was made, and whether it was approved, blocked, or escalated.",
    summary: `Recorded ${trail.length} audit trail entries with full decision provenance.`,
    output: {
      totalEntries: trail.length,
      decisions: {
        approved: trail.filter((e) => e.decision === "Auto-approved").length,
        review: trail.filter((e) => e.decision === "Human review required").length,
        blocked: trail.filter((e) => e.decision === "Blocked by policy").length
      }
    }
  };
}
