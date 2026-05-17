import Link from "next/link";
import { ArrowRight, Building2, FileCheck2, Leaf, Lock, Shield, Sparkles } from "lucide-react";

const proofPoints = [
  {
    icon: Sparkles,
    title: "Detect software waste",
    copy: "Autonomous agents find bloated images, unused dependencies, repeated API calls, and idle compute."
  },
  {
    icon: Leaf,
    title: "Estimate cost and carbon",
    copy: "Every finding carries monthly spend, kgCO2e, confidence, effort, and before/after impact."
  },
  {
    icon: Shield,
    title: "Govern agentic actions",
    copy: "Policy agents enforce approval gates, flag risky repairs, and block unsafe changes automatically."
  },
  {
    icon: Lock,
    title: "Enterprise approval gates",
    copy: "High-risk repairs require human review. Low-risk fixes are auto-approved with full audit trail."
  },
  {
    icon: FileCheck2,
    title: "Audit-ready repair ledger",
    copy: "Every agent action is recorded with decision provenance for compliance and governance teams."
  },
  {
    icon: Building2,
    title: "Agentic payment control",
    copy: "X402 flow shows how agents purchase paid APIs under budget policy with governance oversight."
  }
];

export function LandingPage() {
  return (
    <>
      <section
        className="relative min-h-[76svh] bg-cover bg-center"
        style={{ backgroundImage: "url('/hero-kintsugiops.png')" }}
      >
        <div className="absolute inset-0 bg-ink/30" aria-hidden />
        <div
          className="absolute inset-0 bg-[linear-gradient(90deg,rgba(31,41,51,0.84)_0%,rgba(31,41,51,0.72)_34%,rgba(31,41,51,0.34)_64%,rgba(31,41,51,0.08)_100%)]"
          aria-hidden
        />
        <div className="relative mx-auto flex min-h-[76svh] max-w-7xl items-center px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="max-w-3xl text-white">
            <h1 className="break-anywhere text-4xl font-semibold [text-shadow:0_2px_22px_rgb(0_0_0_/_0.42)] sm:text-6xl lg:text-7xl">
              KintsugiGuard AI
            </h1>
            <p className="mt-6 max-w-2xl text-xl leading-8 text-white/92 [text-shadow:0_2px_18px_rgb(0_0_0_/_0.38)]">
              Repair software waste. Govern agentic risk.
            </p>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/88 [text-shadow:0_2px_16px_rgb(0_0_0_/_0.36)]">
              Autonomous AI agents that detect inefficient systems, assess repair risk, enforce approval policies, and generate audit-ready software repair ledgers for enterprise teams.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/upload"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-gold-300 px-5 text-sm font-semibold text-ink shadow-soft transition hover:bg-gold-100 focus:outline-none focus:ring-2 focus:ring-white"
              >
                Start Enterprise Audit
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href="/governance"
                className="inline-flex h-12 items-center justify-center rounded-md border border-white/32 bg-white/12 px-5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
              >
                View Governance Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-ink/10 bg-porcelain py-10">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
          {proofPoints.map((point) => {
            const Icon = point.icon;
            return (
              <article key={point.title} className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft">
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-gold-50 text-gold-700 ring-1 ring-gold-100">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h2 className="mt-4 text-base font-semibold text-ink">{point.title}</h2>
                <p className="mt-2 text-sm leading-6 text-graphite">{point.copy}</p>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}
