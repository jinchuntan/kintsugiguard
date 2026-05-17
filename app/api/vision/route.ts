import { NextRequest, NextResponse } from "next/server";
import { generateVisionAnalysis, getAiProviderMode } from "@/lib/ai/provider";
import type { VisionAnalysisResult, VisionFinding } from "@/lib/types";

export const maxDuration = 30;

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as {
    image?: string;
    mimeType?: string;
  };

  if (!body.image) {
    return NextResponse.json({ error: "Missing image field (base64)" }, { status: 400 });
  }

  const mimeType = body.mimeType ?? "image/png";

  const response = await generateVisionAnalysis({
    imageBase64: body.image,
    mimeType,
    prompt: "Analyze this image for software infrastructure waste, cloud cost inefficiencies, over-provisioned resources, or architectural problems. Return your analysis as a JSON object with summary and findings array."
  });

  let result: VisionAnalysisResult;

  if (response.mocked) {
    const parsed = JSON.parse(response.content) as { summary: string; findings: VisionFinding[] };
    result = { mocked: true, summary: parsed.summary, findings: parsed.findings };
  } else {
    try {
      const cleaned = response.content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const parsed = JSON.parse(cleaned) as { summary?: string; findings?: VisionFinding[] };
      result = {
        mocked: false,
        summary: parsed.summary ?? "Analysis complete.",
        findings: parsed.findings ?? []
      };
    } catch {
      result = {
        mocked: false,
        summary: response.content.slice(0, 500),
        findings: []
      };
    }
  }

  return NextResponse.json({ aiMode: getAiProviderMode(), result });
}
