import { cn, riskClasses, severityClasses } from "@/lib/utils";
import type { AgentStatus, RiskLevel, Severity } from "@/lib/types";

export function SeverityPill({ severity }: { severity: Severity }) {
  return <span className={cn("inline-flex rounded-md px-2 py-1 text-xs font-semibold ring-1", severityClasses(severity))}>{severity}</span>;
}

export function RiskPill({ risk }: { risk: RiskLevel }) {
  return <span className={cn("inline-flex rounded-md px-2 py-1 text-xs font-semibold ring-1", riskClasses(risk))}>{risk}</span>;
}

export function AgentStatusPill({ status }: { status: AgentStatus }) {
  const classes = {
    waiting: "bg-slate-100 text-slate-600 ring-slate-200",
    running: "bg-gold-50 text-gold-700 ring-gold-100",
    completed: "bg-emerald-50 text-emerald-700 ring-emerald-100"
  }[status];

  return <span className={cn("inline-flex rounded-md px-2 py-1 text-xs font-semibold ring-1", classes)}>{status}</span>;
}
