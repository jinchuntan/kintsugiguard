import { NextRequest, NextResponse } from "next/server";
import { runAuditWorkflow } from "@/lib/agents/orchestrator";
import { getAiProviderMode, generateStructuredNarrative } from "@/lib/ai/provider";

export async function GET(request: NextRequest) {
  const auditId = request.nextUrl.searchParams.get("auditId") ?? undefined;
  const run = runAuditWorkflow(auditId);

  return NextResponse.json({
    aiMode: getAiProviderMode(),
    run
  });
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as { auditId?: string; includeNarrative?: boolean };
  const run = runAuditWorkflow(body.auditId);
  const narrative = body.includeNarrative
    ? await generateStructuredNarrative({
        system: "You summarize enterprise software waste audits as concise JSON-friendly prose.",
        prompt: `Summarize the KintsugiGuard AI audit for ${run.audit.name}.`
      })
    : undefined;

  return NextResponse.json({
    aiMode: getAiProviderMode(),
    narrative,
    run
  });
}
