"use client";

import Link from "next/link";
import { ArrowRight, BadgeDollarSign, CheckCircle2, KeyRound, LockKeyhole, ReceiptText, Server } from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { PageFrame } from "@/components/dashboard/PageFrame";
import { useAuditRun } from "@/components/dashboard/useAuditRun";
import type { X402Step } from "@/lib/types";
import { cn, formatCurrency } from "@/lib/utils";

const actorIcons = {
  Agent: KeyRound,
  "Paid API": Server,
  "Budget policy": LockKeyhole,
  Ledger: ReceiptText
};

export function X402Experience() {
  const { run } = useAuditRun();
  const simulation = run.x402Simulation;

  return (
    <PageFrame
      eyebrow="X402 enterprise payment"
      title="Governed agentic payment"
      description="Enterprise-controlled X402-style flow: agent requests premium API, Governance Policy Agent checks budget and policy, payment is approved only within limits, and receipt is logged in the audit trail."
    >
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard
          label="Paid service"
          value={simulation.serviceName}
          detail="Replaceable with a real provider later"
          icon={<Server className="h-5 w-5" aria-hidden />}
          tone="blue"
        />
        <MetricCard
          label="API price"
          value={formatCurrency(simulation.priceUsd)}
          detail="Returned by HTTP 402 metadata"
          icon={<BadgeDollarSign className="h-5 w-5" aria-hidden />}
          tone="gold"
        />
        <MetricCard
          label="Agent budget"
          value={formatCurrency(simulation.budgetUsd)}
          detail="Autonomous spend policy"
          icon={<LockKeyhole className="h-5 w-5" aria-hidden />}
          tone="ink"
        />
        <MetricCard
          label="Receipt"
          value={simulation.receiptId.slice(-10)}
          detail="Logged in repair ledger"
          icon={<ReceiptText className="h-5 w-5" aria-hidden />}
          tone="green"
        />
      </div>

      <section className="mt-6 grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <article className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft">
          <h2 className="text-lg font-semibold text-ink">Payment flow</h2>
          <div className="mt-5 space-y-4">
            {simulation.steps.map((step, index) => (
              <PaymentStepCard key={step.id} step={step} index={index} />
            ))}
          </div>
        </article>

        <aside className="space-y-6">
          <section className="rounded-lg border border-ink/10 bg-ink p-5 text-white shadow-soft">
            <p className="text-sm font-semibold text-gold-100">X-PAYMENT header</p>
            <pre className="mt-4 overflow-x-auto rounded-md bg-white/10 p-4 text-xs leading-6 text-white">
              <code>{simulation.mockPaymentHeader}</code>
            </pre>
            <p className="mt-4 text-sm leading-6 text-white/76">
              This is a mock signer, but the code isolates the payment simulation so a real X402 implementation can replace it.
            </p>
          </section>

          <section className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft">
            <h2 className="text-lg font-semibold text-ink">Premium result</h2>
            <p className="mt-3 text-sm leading-6 text-graphite">{simulation.premiumResult}</p>
            <div className="mt-4 rounded-md bg-emerald-50 p-3 text-sm font-semibold text-emerald-800 ring-1 ring-emerald-100">
              Approved: {simulation.approved ? "yes, within autonomous budget" : "no, human approval required"}
            </div>
          </section>

          <section className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft">
            <h2 className="text-lg font-semibold text-ink">Enterprise governance</h2>
            <p className="mt-3 text-sm leading-6 text-graphite">
              Enterprise agents require governed access to paid tools. The Governance Policy Agent validates budget, checks policy compliance, and logs the receipt in the audit trail. If payment exceeds budget, it escalates to human review.
            </p>
            <Link
              href="/impact-report"
              className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-ink px-4 text-sm font-semibold text-white transition hover:bg-graphite focus:outline-none focus:ring-2 focus:ring-gold-300"
            >
              Generate impact report
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </section>
        </aside>
      </section>
    </PageFrame>
  );
}

function PaymentStepCard({ step, index }: { step: X402Step; index: number }) {
  const Icon = actorIcons[step.actor];

  return (
    <article className="relative rounded-lg border border-ink/10 bg-porcelain p-4">
      <div className="flex gap-4">
        <span
          className={cn(
            "flex h-10 w-10 min-w-10 items-center justify-center rounded-md text-white",
            step.httpStatus === 402 ? "bg-clay" : step.actor === "Ledger" ? "bg-mint" : "bg-ink"
          )}
        >
          <Icon className="h-5 w-5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-white px-2 py-1 text-xs font-semibold text-graphite ring-1 ring-ink/10">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="rounded-md bg-white px-2 py-1 text-xs font-semibold text-gold-700 ring-1 ring-gold-100">
              {step.actor}
            </span>
            {step.httpStatus ? (
              <span className="rounded-md bg-white px-2 py-1 text-xs font-semibold text-ink ring-1 ring-ink/10">
                HTTP {step.httpStatus}
              </span>
            ) : null}
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-100">
              <CheckCircle2 className="h-3 w-3" aria-hidden />
              {step.status}
            </span>
          </div>
          <h3 className="mt-3 text-sm font-semibold text-ink">{step.label}</h3>
          <p className="mt-2 text-sm leading-6 text-graphite">{step.detail}</p>
          {step.endpoint ? (
            <p className="mt-3 overflow-x-auto rounded-md bg-white p-2 text-xs text-graphite ring-1 ring-ink/10">
              {step.method} {step.endpoint}
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}
