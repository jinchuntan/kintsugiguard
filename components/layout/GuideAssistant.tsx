"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Bot, CircleHelp, MessageCircle, Send, Sparkles, X } from "lucide-react";

type GuideInfo = {
  name: string;
  summary: string;
  nextHref: string;
  nextLabel: string;
  tips: string[];
};

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const guideFlow: Record<string, GuideInfo> = {
  "/": {
    name: "Home",
    summary: "This page introduces KintsugiGuard AI and gives you two entry points: start an audit or watch the agent workflow.",
    nextHref: "/upload",
    nextLabel: "Start software waste audit",
    tips: ["Use Start Software Waste Audit if you are new.", "Use Watch Agent Workflow when you already selected an audit package."]
  },
  "/upload": {
    name: "Audit setup",
    summary: "This page lets you choose a demo audit package or add optional files and screenshots for analysis.",
    nextHref: "/orchestration",
    nextLabel: "Run autonomous audit",
    tips: ["Pick one demo sample first.", "Uploads are optional for the demo.", "Screenshots can be analyzed in the vision section."]
  },
  "/orchestration": {
    name: "Agent workflow",
    summary: "This page shows the specialist agents moving through the audit, from waste detection to repair planning evidence.",
    nextHref: "/findings",
    nextLabel: "Open findings dashboard",
    tips: ["Wait for the run progress to finish.", "Use the agent summaries to understand how evidence is handed off."]
  },
  "/findings": {
    name: "Findings",
    summary: "This dashboard ranks detected software waste by cost, carbon impact, severity, confidence, effort, and risk.",
    nextHref: "/repair-plan",
    nextLabel: "Prioritize repairs",
    tips: ["Start with high cost and high confidence findings.", "Check risk before assuming a repair can be automated."]
  },
  "/repair-plan": {
    name: "Repair plan",
    summary: "This page turns findings into prioritized repair lanes: quick wins, medium-term work, and human approval items.",
    nextHref: "/governance",
    nextLabel: "View governance dashboard",
    tips: ["Quick wins are the safest first actions.", "Human approval items need an owner before execution."]
  },
  "/governance": {
    name: "Governance",
    summary: "This page shows policy decisions, security inspections, and the full audit trail for all agent actions.",
    nextHref: "/x402",
    nextLabel: "View X402 payment",
    tips: ["Check which repairs are auto-approved vs blocked.", "Review the audit trail for full decision provenance."]
  },
  "/x402": {
    name: "X402 payment",
    summary: "This page demonstrates an agent discovering a paid specialist API, checking budget policy, authorizing payment, and logging a receipt.",
    nextHref: "/impact-report",
    nextLabel: "Generate impact report",
    tips: ["Review the payment flow from HTTP 402 discovery to ledger receipt.", "The payment header is mocked for the demo."]
  },
  "/impact-report": {
    name: "Impact report",
    summary: "This page packages the audit outcome into a stakeholder-ready report with savings, carbon reduction, risk, and repair summary.",
    nextHref: "/upload",
    nextLabel: "Start another audit",
    tips: ["Use Copy for a quick share.", "Use Export to download the markdown report."]
  }
};

const fallbackGuide: GuideInfo = {
  name: "Current page",
  summary: "I can help explain this screen and point you to the next step in the KintsugiGuard AI audit flow.",
  nextHref: "/upload",
  nextLabel: "Go to audit setup",
  tips: ["Start at the audit setup page if you are unsure where to begin."]
};

export function GuideAssistant() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Hi, I can explain this page, suggest your next step, and answer simple questions about using KintsugiGuard AI."
    }
  ]);

  const guide = useMemo(() => guideFlow[pathname] ?? fallbackGuide, [pathname]);

  const askQuestion = async (rawQuestion: string) => {
    const trimmed = rawQuestion.trim();
    if (!trimmed) return;

    setMessages((current) => [
      ...current,
      { role: "user", content: trimmed }
    ]);
    setQuestion("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          pageName: guide.name,
          pageSummary: guide.summary
        })
      });
      const data = (await res.json()) as { reply: string | null; mode: string };

      if (data.reply && data.mode !== "mock") {
        setMessages((current) => [...current, { role: "assistant", content: data.reply as string }]);
        return;
      }
    } catch {
      // Fall through to local answer
    }

    setMessages((current) => [
      ...current,
      { role: "assistant", content: getGuideAnswer(trimmed, guide) }
    ]);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    askQuestion(question);
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-50 inline-flex h-12 w-12 items-center justify-center gap-2 rounded-full border border-ink/10 bg-ink px-0 text-sm font-semibold text-white shadow-soft transition hover:bg-graphite focus:outline-none focus:ring-2 focus:ring-gold-300 sm:w-auto sm:px-4"
        aria-label="Open guide assistant"
      >
        <MessageCircle className="h-5 w-5" aria-hidden />
        <span className="hidden sm:inline">Guide</span>
      </button>
    );
  }

  return (
    <aside
      className="fixed bottom-4 right-4 z-50 flex max-h-[min(78vh,38rem)] w-[min(calc(100vw-2rem),24rem)] flex-col overflow-hidden rounded-lg border border-ink/10 bg-white shadow-soft"
      aria-label="Guide assistant"
    >
      <div className="flex items-center justify-between gap-3 border-b border-ink/10 bg-ink px-4 py-3 text-white">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-9 w-9 min-w-9 items-center justify-center rounded-md bg-gold-300 text-ink">
            <Bot className="h-5 w-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold">Guide assistant</p>
            <p className="truncate text-xs text-white/70">{guide.name}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="flex h-8 w-8 items-center justify-center rounded-md text-white/80 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Close guide assistant"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <section className="rounded-lg border border-gold-100 bg-gold-50/70 p-3">
          <div className="flex items-start gap-2">
            <Sparkles className="mt-0.5 h-4 w-4 min-w-4 text-gold-700" aria-hidden />
            <div>
              <h2 className="text-sm font-semibold text-ink">{guide.name}</h2>
              <p className="mt-1 text-sm leading-6 text-graphite">{guide.summary}</p>
            </div>
          </div>
          <Link
            href={guide.nextHref}
            className="mt-3 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-ink px-3 text-sm font-semibold text-white transition hover:bg-graphite focus:outline-none focus:ring-2 focus:ring-gold-300"
          >
            {guide.nextLabel}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </section>

        <section className="mt-3 rounded-lg border border-ink/10 bg-porcelain p-3">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-ink">
            <CircleHelp className="h-4 w-4 text-gold-700" aria-hidden />
            Helpful notes
          </h2>
          <ul className="mt-2 space-y-2 text-sm leading-5 text-graphite">
            {guide.tips.map((tip) => (
              <li key={tip} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 min-w-1.5 rounded-full bg-gold-300" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-3 flex flex-wrap gap-2">
          {["What is this page?", "What should I do next?", "What files help?"].map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => askQuestion(prompt)}
              className="rounded-md border border-ink/10 bg-white px-2.5 py-1.5 text-xs font-semibold text-graphite transition hover:bg-gold-50 hover:text-ink focus:outline-none focus:ring-2 focus:ring-gold-300"
            >
              {prompt}
            </button>
          ))}
        </div>

        <div className="mt-4 space-y-3" aria-live="polite">
          {messages.slice(-6).map((message, index) => (
            <div
              key={`${message.role}-${index}-${message.content}`}
              className={message.role === "assistant" ? "rounded-lg bg-porcelain p-3" : "ml-8 rounded-lg bg-ink p-3 text-white"}
            >
              <p className={message.role === "assistant" ? "break-words text-sm leading-6 text-graphite" : "break-words text-sm leading-6 text-white"}>
                {message.content}
              </p>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={onSubmit} className="flex gap-2 border-t border-ink/10 bg-white p-3">
        <label className="sr-only" htmlFor="guide-question">
          Ask the guide assistant
        </label>
        <input
          id="guide-question"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Ask how to use this page"
          className="min-w-0 flex-1 rounded-md border border-ink/10 bg-porcelain px-3 py-2 text-sm text-ink outline-none transition placeholder:text-graphite/70 focus:border-gold-300 focus:bg-white focus:ring-2 focus:ring-gold-100"
        />
        <button
          type="submit"
          className="flex h-10 w-10 min-w-10 items-center justify-center rounded-md bg-gold-300 text-ink transition hover:bg-gold-100 focus:outline-none focus:ring-2 focus:ring-gold-300"
          aria-label="Send question"
        >
          <Send className="h-4 w-4" aria-hidden />
        </button>
      </form>
    </aside>
  );
}

function getGuideAnswer(question: string, guide: GuideInfo) {
  const text = question.toLowerCase();

  if (text.includes("next") || text.includes("continue") || text.includes("where") || text.includes("do now")) {
    return `Your next step is: ${guide.nextLabel}. This keeps you moving through the audit flow from setup to findings, repair plan, payment demo, and final report.`;
  }

  if (text.includes("this page") || text.includes("current page") || text.includes("what is") || text.includes("explain")) {
    return guide.summary;
  }

  if (text.includes("upload") || text.includes("file") || text.includes("screenshot") || text.includes("provide")) {
    return "Useful evidence includes package manifests, Dockerfiles, CI configs, build logs, cloud billing exports, utilization notes, AI API logs, and screenshots of dashboards or architecture diagrams. You can also use the demo samples without uploading anything.";
  }

  if (text.includes("agent") || text.includes("workflow") || text.includes("run")) {
    return "The agent workflow shows specialist agents scanning the audit package, finding waste signals, estimating cost and carbon impact, checking risk, and preparing repair evidence for the next screens.";
  }

  if (text.includes("finding") || text.includes("severity") || text.includes("confidence")) {
    return "Findings show each waste signal with estimated cost, carbon impact, severity, confidence, implementation effort, risk, and a suggested repair. High-confidence, low-risk findings are usually best to review first.";
  }

  if (text.includes("repair") || text.includes("quick win") || text.includes("risk")) {
    return "The repair plan groups work into quick wins, medium-term fixes, and human-approval items. Use it to choose repairs that balance savings, confidence, effort, and operational risk.";
  }

  if (text.includes("x402") || text.includes("payment") || text.includes("paid")) {
    return "The X402 page is a demo of agentic paid access. It shows an agent discovering a paid specialist API, checking budget, sending a mock payment header, and logging an auditable receipt.";
  }

  if (text.includes("report") || text.includes("export") || text.includes("copy")) {
    return "The report page summarizes savings, carbon reduction, risk, and repair recommendations. Use Copy for a quick share or Export to download the markdown report.";
  }

  if (text.includes("cost") || text.includes("carbon") || text.includes("saving")) {
    return "Cost waste is estimated recurring spend that can be reduced. Carbon impact is estimated avoidable kgCO2e tied to the waste. Together they help engineering, finance, and sustainability teams discuss the same repair plan.";
  }

  return "I can help with where to start, what to upload, what each page means, how to read findings, how repairs are prioritized, what X402 shows, and how to export the report.";
}
