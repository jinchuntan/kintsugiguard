import clsx, { type ClassValue } from "clsx";
import type { Effort, Finding, RiskLevel, Severity } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

export function formatCarbon(value: number) {
  return `${Math.round(value)} kgCO2e`;
}

export function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`;
}

export function severityWeight(severity: Severity) {
  return {
    Low: 1,
    Medium: 2,
    High: 3,
    Critical: 4
  }[severity];
}

export function effortWeight(effort: Effort) {
  return {
    Low: 1,
    Medium: 1.7,
    High: 2.6
  }[effort];
}

export function riskWeight(risk: RiskLevel) {
  return {
    Low: 1,
    Medium: 1.6,
    High: 2.5
  }[risk];
}

export function calculateRepairPriority(finding: Finding) {
  const impact = finding.estimatedMonthlyCostWaste / 100 + finding.estimatedCarbonKgCO2e / 10 + severityWeight(finding.severity);
  const score = (impact * finding.confidence) / effortWeight(finding.implementationDifficulty) / riskWeight(finding.riskLevel);
  return Number(score.toFixed(2));
}

export function severityClasses(severity: Severity) {
  return {
    Low: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    Medium: "bg-amber-50 text-amber-800 ring-amber-200",
    High: "bg-orange-50 text-orange-800 ring-orange-200",
    Critical: "bg-rose-50 text-rose-800 ring-rose-200"
  }[severity];
}

export function riskClasses(risk: RiskLevel) {
  return {
    Low: "bg-mint/10 text-emerald-800 ring-emerald-200",
    Medium: "bg-gold-50 text-gold-700 ring-gold-100",
    High: "bg-rose-50 text-rose-800 ring-rose-200"
  }[risk];
}
