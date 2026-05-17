import type { AgentResult, AuditSample, X402Simulation } from "@/lib/types";
import { simulateX402Payment } from "@/lib/x402/simulation";

export function x402PaymentAgent(audit: AuditSample): { result: AgentResult; simulation: X402Simulation } {
  const simulation = simulateX402Payment(audit);

  return {
    simulation,
    result: {
      agentName: "X402 Payment Agent",
      status: "completed",
      confidence: 0.9,
      explanation: "Simulates an autonomous paid API access flow using HTTP 402, budget policy, and an X-PAYMENT header.",
      summary: `Approved a $${simulation.priceUsd.toFixed(2)} specialist ${simulation.serviceName} call within a $${simulation.budgetUsd.toFixed(2)} agent budget.`,
      output: {
        serviceName: simulation.serviceName,
        approved: simulation.approved,
        priceUsd: simulation.priceUsd,
        budgetUsd: simulation.budgetUsd,
        receiptId: simulation.receiptId
      }
    }
  };
}
