export type AiProviderMode = "mock" | "openai" | "anthropic" | "gemini";

export interface StructuredGenerationRequest {
  system: string;
  prompt: string;
  temperature?: number;
}

export interface StructuredGenerationResponse {
  mode: AiProviderMode;
  content: string;
  mocked: boolean;
}

export function getAiProviderMode(): AiProviderMode {
  const mode = (process.env.KINTSUGIGUARD_AI_PROVIDER ?? process.env.AI_PROVIDER ?? "mock").toLowerCase();
  if (mode === "openai" || mode === "anthropic" || mode === "gemini") {
    return mode;
  }
  return "mock";
}

// --- Gemini ---

function getGeminiConfig() {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.KINTSUGIGUARD_GEMINI_MODEL ?? "gemini-2.0-flash";
  return apiKey ? { apiKey, model } : null;
}

function getGeminiUrl(model: string) {
  return `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
}

async function callGemini(prompt: string, temperature = 0.2, maxTokens = 900): Promise<string | null> {
  const config = getGeminiConfig();
  if (!config) return null;

  try {
    const response = await fetch(getGeminiUrl(config.model), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": config.apiKey
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature, maxOutputTokens: maxTokens }
      })
    });
    const json = (await response.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
      error?: { message?: string };
    };
    if (!response.ok || json.error) return null;
    return json.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
  } catch {
    return null;
  }
}

async function callGeminiVision(prompt: string, imageBase64: string, mimeType: string): Promise<string | null> {
  const config = getGeminiConfig();
  if (!config) return null;

  try {
    const response = await fetch(getGeminiUrl(config.model), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": config.apiKey
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            { inlineData: { mimeType, data: imageBase64 } }
          ]
        }],
        generationConfig: { temperature: 0.2 }
      })
    });
    const json = (await response.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
      error?: { message?: string };
    };
    if (!response.ok || json.error) return null;
    return json.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
  } catch {
    return null;
  }
}

// --- OpenAI-compatible (Groq, OpenAI, etc.) ---

function getOpenAIConfig() {
  const apiKey = process.env.OPENAI_API_KEY ?? process.env.KINTSUGIGUARD_OPENAI_API_KEY;
  const baseUrl = process.env.KINTSUGIGUARD_OPENAI_BASE_URL ?? "https://api.openai.com/v1";
  const model = process.env.KINTSUGIGUARD_OPENAI_MODEL ?? "gpt-4.1-mini";
  return apiKey ? { apiKey, baseUrl, model } : null;
}

async function callOpenAI(system: string, prompt: string, temperature = 0.2): Promise<string | null> {
  const config = getOpenAIConfig();
  if (!config) return null;

  try {
    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: config.model,
        temperature,
        messages: [
          { role: "system", content: system },
          { role: "user", content: prompt }
        ]
      })
    });
    const json = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
      error?: { message?: string };
    };
    if (!response.ok || json.error) return null;
    return json.choices?.[0]?.message?.content ?? null;
  } catch {
    return null;
  }
}

async function callOpenAIVision(system: string, prompt: string, imageBase64: string, mimeType: string): Promise<string | null> {
  const config = getOpenAIConfig();
  if (!config) return null;

  const visionModel = process.env.KINTSUGIGUARD_VISION_MODEL ?? config.model;

  try {
    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: visionModel,
        temperature: 0.2,
        messages: [
          { role: "system", content: system },
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              { type: "image_url", image_url: { url: `data:${mimeType};base64,${imageBase64}` } }
            ]
          }
        ]
      })
    });
    const json = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
      error?: { message?: string };
    };
    if (!response.ok || json.error) return null;
    return json.choices?.[0]?.message?.content ?? null;
  } catch {
    return null;
  }
}

// --- Anthropic ---

async function callAnthropic(system: string, prompt: string, temperature = 0.2): Promise<string | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.KINTSUGIGUARD_ANTHROPIC_MODEL ?? "claude-sonnet-4-20250514",
        max_tokens: 900,
        temperature,
        system,
        messages: [{ role: "user", content: prompt }]
      })
    });
    const json = (await response.json()) as { content?: Array<{ text?: string }>; error?: { message?: string } };
    if (!response.ok || json.error) return null;
    return json.content?.[0]?.text ?? null;
  } catch {
    return null;
  }
}

// --- Fallback chain: primary provider -> OpenAI/Groq -> mock ---

const MOCK_NARRATIVE =
  "Mock AI mode: deterministic agent outputs are generated from the audit package so the demo remains fully runnable without API keys.";

export async function generateStructuredNarrative(
  request: StructuredGenerationRequest
): Promise<StructuredGenerationResponse> {
  const mode = getAiProviderMode();

  if (mode === "mock") {
    return { mode: "mock", mocked: true, content: MOCK_NARRATIVE };
  }

  // Try primary provider
  let result: string | null = null;
  let usedMode: AiProviderMode = mode;

  if (mode === "gemini") {
    result = await callGemini(`${request.system}\n\n${request.prompt}`, request.temperature);
  } else if (mode === "openai") {
    result = await callOpenAI(request.system, request.prompt, request.temperature);
  } else if (mode === "anthropic") {
    result = await callAnthropic(request.system, request.prompt, request.temperature);
  }

  // Fallback to OpenAI/Groq if primary failed and primary wasn't already openai
  if (!result && mode !== "openai" && getOpenAIConfig()) {
    result = await callOpenAI(request.system, request.prompt, request.temperature);
    if (result) usedMode = "openai";
  }

  if (result) {
    return { mode: usedMode, mocked: false, content: result };
  }

  return { mode: "mock", mocked: true, content: MOCK_NARRATIVE };
}

// --- Vision ---

export interface VisionRequest {
  imageBase64: string;
  mimeType: string;
  prompt: string;
  system?: string;
}

export interface VisionResponse {
  mode: AiProviderMode;
  mocked: boolean;
  content: string;
}

const MOCK_VISION_RESPONSE = JSON.stringify({
  summary: "The uploaded image shows a cloud billing dashboard with several over-provisioned resources and idle compute instances. Detected 3 waste signals: unused reserved instances ($420/mo), oversized database tier ($310/mo), and idle load balancers ($85/mo).",
  findings: [
    {
      title: "Unused reserved instances",
      category: "Cloud compute",
      severity: "High",
      detail: "Reserved instances with <5% average utilization detected in the billing screenshot.",
      estimatedMonthlyCostUsd: 420,
      repairSuggestion: "Convert to on-demand or release reservations for idle capacity."
    },
    {
      title: "Oversized database tier",
      category: "Database",
      severity: "Medium",
      detail: "Database instance appears provisioned at 4x the required capacity based on visible metrics.",
      estimatedMonthlyCostUsd: 310,
      repairSuggestion: "Downsize to the next tier or enable auto-scaling."
    },
    {
      title: "Idle load balancers",
      category: "Networking",
      severity: "Low",
      detail: "Multiple load balancers with zero active connections visible in the dashboard.",
      estimatedMonthlyCostUsd: 85,
      repairSuggestion: "Remove unused load balancers or consolidate traffic routing."
    }
  ]
});

const DEFAULT_VISION_SYSTEM = "You are a software waste analyst. Analyze images of cloud dashboards, architecture diagrams, billing reports, or infrastructure screenshots. Respond with ONLY a valid JSON object: {\"summary\": \"string\", \"findings\": [{\"title\": \"string\", \"category\": \"string\", \"severity\": \"Low|Medium|High|Critical\", \"detail\": \"string\", \"estimatedMonthlyCostUsd\": number, \"repairSuggestion\": \"string\"}]}";

export async function generateVisionAnalysis(request: VisionRequest): Promise<VisionResponse> {
  const mode = getAiProviderMode();
  const system = request.system ?? DEFAULT_VISION_SYSTEM;
  const prompt = `${request.prompt} Respond with ONLY valid JSON, no markdown fences.`;

  if (mode === "mock") {
    return { mode: "mock", mocked: true, content: MOCK_VISION_RESPONSE };
  }

  let result: string | null = null;
  let usedMode: AiProviderMode = mode;

  // Try primary provider
  if (mode === "gemini") {
    result = await callGeminiVision(`${system}\n\n${prompt}`, request.imageBase64, request.mimeType);
  } else if (mode === "openai") {
    result = await callOpenAIVision(system, prompt, request.imageBase64, request.mimeType);
  }

  // Fallback to OpenAI/Groq if primary failed
  if (!result && mode !== "openai" && getOpenAIConfig()) {
    result = await callOpenAIVision(system, prompt, request.imageBase64, request.mimeType);
    if (result) usedMode = "openai";
  }

  if (result) {
    return { mode: usedMode, mocked: false, content: result };
  }

  return { mode: "mock", mocked: true, content: MOCK_VISION_RESPONSE };
}
