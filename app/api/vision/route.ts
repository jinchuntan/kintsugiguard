import { NextRequest, NextResponse } from "next/server";
import { generateVisionAnalysis, getAiProviderMode } from "@/lib/ai/provider";
import type { VisionAnalysisResult, VisionFinding } from "@/lib/types";

export const maxDuration = 30;

const MAX_REQUEST_BYTES = 5 * 1024 * 1024;
const MAX_BASE64_LENGTH = 4 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function tooLarge(request: NextRequest) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  return contentLength > MAX_REQUEST_BYTES;
}

function isLikelyBase64(value: string) {
  return /^[A-Za-z0-9+/]+={0,2}$/.test(value);
}

export async function POST(request: NextRequest) {
  if (tooLarge(request)) {
    return NextResponse.json({ error: "Request body too large" }, { status: 413 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    image?: string;
    mimeType?: string;
  };

  if (!body.image) {
    return NextResponse.json({ error: "Missing image field (base64)" }, { status: 400 });
  }

  const mimeType = body.mimeType ?? "image/png";
  const image = body.image.trim();

  if (!ALLOWED_IMAGE_TYPES.has(mimeType)) {
    return NextResponse.json({ error: "Unsupported image type" }, { status: 415 });
  }

  if (image.length > MAX_BASE64_LENGTH || !isLikelyBase64(image)) {
    return NextResponse.json({ error: "Invalid image payload" }, { status: 400 });
  }

  const response = await generateVisionAnalysis({
    imageBase64: image,
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
