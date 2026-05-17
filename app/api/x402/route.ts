import { NextRequest, NextResponse } from "next/server";
import { getAuditSample } from "@/lib/data/demoAudit";
import { simulateX402Payment } from "@/lib/x402/simulation";

export async function GET(request: NextRequest) {
  const audit = getAuditSample(request.nextUrl.searchParams.get("auditId") ?? undefined);
  return NextResponse.json(simulateX402Payment(audit));
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as { auditId?: string; priceUsd?: number; budgetUsd?: number };
  const audit = getAuditSample(body.auditId);

  return NextResponse.json(simulateX402Payment(audit, body.priceUsd, body.budgetUsd));
}
