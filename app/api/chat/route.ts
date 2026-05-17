import { NextRequest, NextResponse } from "next/server";
import { generateStructuredNarrative, getAiProviderMode } from "@/lib/ai/provider";

const MAX_REQUEST_BYTES = 16 * 1024;
const MAX_MESSAGE_LENGTH = 1200;
const MAX_CONTEXT_LENGTH = 600;

function tooLarge(request: NextRequest) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  return contentLength > MAX_REQUEST_BYTES;
}

function limitText(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function POST(request: NextRequest) {
  if (tooLarge(request)) {
    return NextResponse.json({ error: "Request body too large" }, { status: 413 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    message: string;
    pageName?: string;
    pageSummary?: string;
  };
  const message = limitText(body.message, MAX_MESSAGE_LENGTH);
  const pageName = limitText(body.pageName, MAX_CONTEXT_LENGTH) || "unknown page";
  const pageSummary = limitText(body.pageSummary, MAX_CONTEXT_LENGTH) || "No context available";

  if (!message) {
    return NextResponse.json({ error: "Missing message" }, { status: 400 });
  }

  const mode = getAiProviderMode();

  if (mode === "mock") {
    return NextResponse.json({ reply: null, mode: "mock" });
  }

  const system = `You are the KintsugiGuard AI guide assistant. You help users navigate an enterprise AI governance and software repair platform.

The user is currently on: ${pageName}
Page context: ${pageSummary}

The platform has these pages:
- Audit: Select a demo audit package to analyze
- Agents: Watch 10 AI agents run the waste detection and governance workflow
- Findings: View detected software waste with cost, carbon, and risk data
- Repair Plan: See prioritized repairs grouped by execution lane
- Governance: View policy decisions, security inspections, and audit trail
- X402: See governed agentic payment with budget policy
- Report: Export executive-ready impact report

Keep answers concise (2-3 sentences max). Be helpful and direct.`;

  // Uses the provider fallback chain: Gemini -> Groq/OpenAI -> mock
  const result = await generateStructuredNarrative({
    system,
    prompt: message,
    temperature: 0.3
  });

  if (!result.mocked) {
    return NextResponse.json({ reply: result.content, mode: result.mode });
  }

  return NextResponse.json({ reply: null, mode: "mock" });
}
