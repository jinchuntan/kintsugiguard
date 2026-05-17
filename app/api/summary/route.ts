import { NextRequest, NextResponse } from "next/server";
import { generateStructuredNarrative, getAiProviderMode } from "@/lib/ai/provider";

const MAX_REQUEST_BYTES = 16 * 1024;
const MAX_TEXT_LENGTH = 900;

function tooLarge(request: NextRequest) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  return contentLength > MAX_REQUEST_BYTES;
}

function limitText(value: unknown, maxLength = MAX_TEXT_LENGTH) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function finiteNumber(value: unknown, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export async function POST(request: NextRequest) {
  if (tooLarge(request)) {
    return NextResponse.json({ error: "Request body too large" }, { status: 413 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    auditName: string;
    findings: string;
    savings: string;
    carbon: string;
    scoreBefore: number;
    scoreAfter: number;
    governanceApproved: number;
    governanceBlocked: number;
    governanceReview: number;
  };

  const mode = getAiProviderMode();

  if (mode === "mock") {
    return NextResponse.json({ summary: null, mode: "mock" });
  }

  // Uses the provider fallback chain: Gemini -> Groq/OpenAI -> mock
  const result = await generateStructuredNarrative({
    system: "You are KintsugiGuard AI, an enterprise AI governance and software repair platform. Write a concise executive summary (3-4 sentences) for a software waste audit report. Write a professional executive summary that highlights business value, sustainability impact, and governance posture. Do not use markdown. Do not use bullet points.",
    prompt: `Audit: ${limitText(body.auditName)}\nKey findings: ${limitText(body.findings)}\nMonthly savings potential: ${limitText(body.savings, 80)}\nMonthly carbon reduction: ${limitText(body.carbon, 80)}\nKintsugiGuard Score: ${finiteNumber(body.scoreBefore)} -> ${finiteNumber(body.scoreAfter)}\nGovernance: ${finiteNumber(body.governanceApproved)} repairs auto-approved, ${finiteNumber(body.governanceReview)} need human review, ${finiteNumber(body.governanceBlocked)} blocked by policy`,
    temperature: 0.3
  });

  if (!result.mocked) {
    return NextResponse.json({ summary: result.content, mode: result.mode });
  }

  return NextResponse.json({ summary: null, mode: "mock" });
}
