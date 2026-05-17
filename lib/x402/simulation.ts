import type { AuditSample, X402Simulation, X402Step } from "@/lib/types";

export function requestPremiumAudit(audit: AuditSample): X402Step {
  return {
    id: "request-premium-audit",
    label: "Agent requests premium carbon data",
    actor: "Agent",
    method: "GET",
    endpoint: `/v1/carbon-intensity/premium?audit=${audit.id}`,
    detail: "The Carbon Accountant Agent asks for regional carbon intensity factors to refine the estimate.",
    status: "completed"
  };
}

export function receive402PaymentRequired(priceUsd: number): X402Step {
  return {
    id: "receive-402",
    label: "API returns HTTP 402 Payment Required",
    actor: "Paid API",
    httpStatus: 402,
    detail: `The API exposes a machine-readable price of $${priceUsd.toFixed(2)} for a premium audit result.`,
    status: "completed"
  };
}

export function evaluatePriceAgainstBudget(priceUsd: number, budgetUsd: number): X402Step {
  return {
    id: "evaluate-budget",
    label: "Agent checks budget policy",
    actor: "Budget policy",
    detail:
      priceUsd <= budgetUsd
        ? `Approved because $${priceUsd.toFixed(2)} is within the $${budgetUsd.toFixed(2)} autonomous spend limit.`
        : `Blocked because $${priceUsd.toFixed(2)} exceeds the $${budgetUsd.toFixed(2)} autonomous spend limit.`,
    status: "approved"
  };
}

export function signMockPayment(audit: AuditSample, priceUsd: number): { step: X402Step; header: string } {
  const header = `X-PAYMENT mock-x402;asset=USDC;amount=${priceUsd.toFixed(2)};audit=${audit.id};sig=demo_7fb9`;

  return {
    header,
    step: {
      id: "sign-payment",
      label: "Agent signs mock payment",
      actor: "Agent",
      detail: "A replaceable mock signer creates an X402-style payment payload for the paid service.",
      header,
      status: "completed"
    }
  };
}

export function retryWithPaymentHeader(header: string): X402Step {
  return {
    id: "retry-with-payment",
    label: "Agent retries with X-PAYMENT header",
    actor: "Agent",
    method: "GET",
    endpoint: "/v1/carbon-intensity/premium",
    header,
    detail: "The agent retries the same resource request with payment authorization attached.",
    status: "completed"
  };
}

export function receivePremiumResult(audit: AuditSample): X402Step {
  return {
    id: "premium-result",
    label: "API returns premium audit result",
    actor: "Paid API",
    httpStatus: 200,
    detail: `Premium data confirms ${audit.metrics.monthlyCarbonWasteKgCO2e} kgCO2e/month of avoidable waste with regional adjustment factors.`,
    status: "completed"
  };
}

export function logReceipt(receiptId: string): X402Step {
  return {
    id: "log-receipt",
    label: "Receipt logged in repair ledger",
    actor: "Ledger",
    detail: `Receipt ${receiptId} is attached to the repair ledger for auditability and finance review.`,
    status: "logged"
  };
}

export function simulateX402Payment(audit: AuditSample, priceUsd = 3.5, budgetUsd = 12): X402Simulation {
  const request = requestPremiumAudit(audit);
  const paymentRequired = receive402PaymentRequired(priceUsd);
  const budgetCheck = evaluatePriceAgainstBudget(priceUsd, budgetUsd);
  const signed = signMockPayment(audit, priceUsd);
  const retry = retryWithPaymentHeader(signed.header);
  const result = receivePremiumResult(audit);
  const receiptId = `rcpt_x402_${audit.id.replaceAll("-", "_")}_042`;
  const receipt = logReceipt(receiptId);

  return {
    serviceName: "Carbon Intensity API",
    priceUsd,
    budgetUsd,
    approved: priceUsd <= budgetUsd,
    mockPaymentHeader: signed.header,
    premiumResult: result.detail,
    receiptId,
    steps: [request, paymentRequired, budgetCheck, signed.step, retry, result, receipt]
  };
}
