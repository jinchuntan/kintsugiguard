import type { AuditSample, AuditSampleId } from "@/lib/types";

export const demoAudits: AuditSample[] = [
  {
    id: "bloated-saas-backend",
    name: "Bloated SaaS backend",
    tagline: "A growing B2B product with slow CI, oversized containers, and idle cloud spend.",
    description:
      "A Node.js and Postgres SaaS backend that accumulated duplicate services, heavy Docker layers, and missed caching opportunities during rapid growth.",
    organizationProfile: "Series B B2B SaaS, 42 engineers, AWS ECS, GitHub Actions, OpenAI-backed support workflow.",
    architectureNotes: [
      "API pods run 24/7 even though traffic is weekday-heavy.",
      "Billing CSV shows c6i.2xlarge services averaging 18% CPU.",
      "Dockerfile installs build tools in the final image.",
      "CI repeats dependency installation across test, lint, and build jobs.",
      "Support summarization pipeline retries identical prompts without a cache key."
    ],
    files: [
      {
        name: "package.json",
        type: "package",
        signal: "12 direct dependencies unused in runtime bundles; duplicate date and validation libraries."
      },
      {
        name: "Dockerfile",
        type: "docker",
        signal: "Single-stage image ships build toolchain, package cache, and test fixtures."
      },
      {
        name: ".github/workflows/ci.yml",
        type: "ci",
        signal: "Three jobs repeat install and transpilation work with no dependency cache."
      },
      {
        name: "aws-billing-march.csv",
        type: "billing",
        signal: "Compute utilization indicates right-sizing and schedule opportunities."
      },
      {
        name: "ai-api-usage.log",
        type: "api-log",
        signal: "38% of model calls share identical prompt hash and context payload."
      },
      {
        name: "architecture-notes.md",
        type: "notes",
        signal: "Batch workers are always-on despite a narrow daily processing window."
      },
      {
        name: "repo-tree.txt",
        type: "tree",
        signal: "Two legacy REST endpoints route to equivalent data transforms."
      }
    ],
    metrics: {
      dockerImageSizeMb: 1800,
      dockerImageTargetMb: 650,
      ciRuntimeMinutes: 24,
      ciRuntimeTargetMinutes: 11,
      monthlyCloudWasteUsd: 1240,
      estimatedTotalMonthlyWasteUsd: 1670,
      aiDuplicateCallRate: 0.38,
      idleComputeHoursPerDay: 17,
      monthlyCarbonWasteKgCO2e: 92,
      annualSavingsUsd: 20040,
      engineeringHoursSavedMonthly: 44,
      kintsugiScoreBefore: 54,
      kintsugiScoreAfter: 84
    },
    findings: [
      {
        id: "container-bloat",
        title: "Bloated Docker image",
        category: "Container Waste",
        severity: "High",
        estimatedMonthlyCostWaste: 320,
        estimatedCarbonKgCO2e: 21,
        repairRecommendation: "Use a multi-stage build, prune package caches, and ship only production artifacts.",
        implementationDifficulty: "Medium",
        riskLevel: "Low",
        expectedImpact: "Reduce image size from 1.8GB to roughly 650MB and shorten deploy pulls.",
        confidence: 0.92,
        sourceSignals: ["Dockerfile", "repo-tree.txt"],
        before: "1.8GB production image with build tools and fixtures",
        after: "650MB runtime image with cached dependency layers"
      },
      {
        id: "unused-dependencies",
        title: "Unused dependencies in runtime package",
        category: "Dependency Waste",
        severity: "Medium",
        estimatedMonthlyCostWaste: 105,
        estimatedCarbonKgCO2e: 5,
        repairRecommendation: "Remove unused packages and consolidate overlapping date, schema, and HTTP client libraries.",
        implementationDifficulty: "Low",
        riskLevel: "Low",
        expectedImpact: "Smaller installs, lower vulnerability surface, and faster cold starts.",
        confidence: 0.88,
        sourceSignals: ["package.json", "repo-tree.txt"],
        before: "86 runtime dependencies with duplicate utility stacks",
        after: "74 runtime dependencies after consolidation"
      },
      {
        id: "redundant-ci",
        title: "Redundant CI/CD jobs repeat the same work",
        category: "CI/CD Waste",
        severity: "High",
        estimatedMonthlyCostWaste: 180,
        estimatedCarbonKgCO2e: 14,
        repairRecommendation: "Share dependency cache, split changed-package checks, and collapse duplicate transpilation steps.",
        implementationDifficulty: "Low",
        riskLevel: "Low",
        expectedImpact: "Cut CI runtime from 24 minutes to 11 minutes for the main workflow.",
        confidence: 0.9,
        sourceSignals: [".github/workflows/ci.yml"],
        before: "24 minute CI with repeated install and build steps",
        after: "11 minute CI with shared cache and selective jobs"
      },
      {
        id: "overprovisioned-instance",
        title: "Over-provisioned cloud service tier",
        category: "Cloud Waste",
        severity: "Critical",
        estimatedMonthlyCostWaste: 410,
        estimatedCarbonKgCO2e: 28,
        repairRecommendation: "Right-size ECS tasks to the observed p95 CPU and memory profile, then apply autoscaling guardrails.",
        implementationDifficulty: "Medium",
        riskLevel: "Medium",
        expectedImpact: "Move from fixed c6i.2xlarge capacity to smaller autoscaled tasks while preserving headroom.",
        confidence: 0.86,
        sourceSignals: ["aws-billing-march.csv", "architecture-notes.md"],
        before: "Always-on c6i.2xlarge capacity averaging 18% CPU",
        after: "Autoscaled c6i.large equivalent capacity with p95 guardrails"
      },
      {
        id: "idle-scheduled-workers",
        title: "Idle scheduled workloads stay warm all day",
        category: "Idle Compute",
        severity: "High",
        estimatedMonthlyCostWaste: 210,
        estimatedCarbonKgCO2e: 17,
        repairRecommendation: "Convert daily batch workers to event-driven jobs with a shutdown policy outside processing windows.",
        implementationDifficulty: "Medium",
        riskLevel: "Low",
        expectedImpact: "Remove roughly 17 idle compute hours per day from non-customer-facing workers.",
        confidence: 0.84,
        sourceSignals: ["architecture-notes.md", "aws-billing-march.csv"],
        before: "Batch workers remain provisioned 24 hours/day",
        after: "Workers run on schedule and drain after completion"
      },
      {
        id: "duplicate-ai-calls",
        title: "Excessive duplicate AI model calls",
        category: "AI API Waste",
        severity: "High",
        estimatedMonthlyCostWaste: 290,
        estimatedCarbonKgCO2e: 4,
        repairRecommendation: "Add prompt-hash caching, retry de-duplication, and lower-cost routing for deterministic summaries.",
        implementationDifficulty: "Medium",
        riskLevel: "Medium",
        expectedImpact: "Avoid 38% of repeated model calls while preserving response quality thresholds.",
        confidence: 0.89,
        sourceSignals: ["ai-api-usage.log"],
        before: "Identical prompt hashes frequently billed as fresh requests",
        after: "Cached deterministic summaries with budget-aware model routing"
      },
      {
        id: "missing-cache",
        title: "Missing cache for high-volume API reads",
        category: "Application Efficiency",
        severity: "Medium",
        estimatedMonthlyCostWaste: 95,
        estimatedCarbonKgCO2e: 2,
        repairRecommendation: "Introduce a short-lived cache for repeated tenant dashboard reads and invalidate on writes.",
        implementationDifficulty: "Medium",
        riskLevel: "Medium",
        expectedImpact: "Lower database load on repeated dashboard refreshes and reduce p95 latency.",
        confidence: 0.8,
        sourceSignals: ["repo-tree.txt", "architecture-notes.md"],
        before: "Every dashboard refresh hits Postgres and enrichment services",
        after: "Hot reads served from a five-minute tenant-aware cache"
      },
      {
        id: "duplicate-endpoint",
        title: "Duplicate API endpoint and transform function",
        category: "Code Duplication",
        severity: "Medium",
        estimatedMonthlyCostWaste: 60,
        estimatedCarbonKgCO2e: 1,
        repairRecommendation: "Merge duplicate reporting endpoints behind a shared transform with compatibility tests.",
        implementationDifficulty: "Low",
        riskLevel: "Medium",
        expectedImpact: "Reduce maintenance drag and prevent two code paths from running equivalent enrichment work.",
        confidence: 0.77,
        sourceSignals: ["repo-tree.txt"],
        before: "Two endpoints perform equivalent report aggregation",
        after: "Single shared report transform with route-level compatibility"
      }
    ]
  },
  {
    id: "wasteful-ai-pipeline",
    name: "Wasteful AI API pipeline",
    tagline: "A support automation flow burning tokens through repeated context and missing cache policy.",
    description:
      "An AI-heavy workflow that overuses premium models, retries full transcripts, and lacks budget-aware routing for routine summaries.",
    organizationProfile: "Marketplace support team, 9 engineers, serverless queue workers, high-volume ticket summarization.",
    architectureNotes: [
      "Support tickets with the same order state are summarized repeatedly.",
      "Premium model is used for deterministic classification.",
      "No token budget policy exists for long transcripts.",
      "Retry failures re-send the entire conversation context."
    ],
    files: [
      {
        name: "ai-api-usage.log",
        type: "api-log",
        signal: "47% avoidable duplicate or oversized calls."
      },
      {
        name: "package.json",
        type: "package",
        signal: "Two tokenizer libraries and unused evaluation tooling are deployed to production workers."
      },
      {
        name: "architecture-notes.md",
        type: "notes",
        signal: "No model routing or cache invalidation policy."
      }
    ],
    metrics: {
      dockerImageSizeMb: 920,
      dockerImageTargetMb: 510,
      ciRuntimeMinutes: 16,
      ciRuntimeTargetMinutes: 9,
      monthlyCloudWasteUsd: 540,
      estimatedTotalMonthlyWasteUsd: 2260,
      aiDuplicateCallRate: 0.47,
      idleComputeHoursPerDay: 6,
      monthlyCarbonWasteKgCO2e: 38,
      annualSavingsUsd: 27120,
      engineeringHoursSavedMonthly: 29,
      kintsugiScoreBefore: 49,
      kintsugiScoreAfter: 81
    },
    findings: [
      {
        id: "premium-model-routing",
        title: "Premium model used for low-complexity classification",
        category: "AI API Waste",
        severity: "Critical",
        estimatedMonthlyCostWaste: 980,
        estimatedCarbonKgCO2e: 10,
        repairRecommendation: "Route deterministic classification and short summaries to a lower-cost model with quality gates.",
        implementationDifficulty: "Medium",
        riskLevel: "Medium",
        expectedImpact: "Lower model spend while escalating only ambiguous tickets.",
        confidence: 0.91,
        sourceSignals: ["ai-api-usage.log", "architecture-notes.md"],
        before: "All tickets call the premium model",
        after: "Budget-aware model router with escalation thresholds"
      },
      {
        id: "missing-prompt-cache",
        title: "Missing cache for repeated prompt hashes",
        category: "AI API Waste",
        severity: "High",
        estimatedMonthlyCostWaste: 720,
        estimatedCarbonKgCO2e: 8,
        repairRecommendation: "Cache summaries by normalized prompt hash, model, tenant, and policy version.",
        implementationDifficulty: "Low",
        riskLevel: "Low",
        expectedImpact: "Avoid repeated summaries for identical ticket states.",
        confidence: 0.93,
        sourceSignals: ["ai-api-usage.log"],
        before: "Repeated states are billed as new calls",
        after: "Identical prompt states return cached summaries"
      },
      {
        id: "oversized-context",
        title: "Oversized transcript context on retries",
        category: "Application Efficiency",
        severity: "High",
        estimatedMonthlyCostWaste: 420,
        estimatedCarbonKgCO2e: 12,
        repairRecommendation: "Trim retry context to failed segments and carry forward structured state instead of full transcripts.",
        implementationDifficulty: "Medium",
        riskLevel: "Medium",
        expectedImpact: "Reduce token volume and retry latency for long-running tickets.",
        confidence: 0.87,
        sourceSignals: ["ai-api-usage.log"],
        before: "Retries resend entire transcript context",
        after: "Retries send compact state plus failed segment"
      },
      {
        id: "worker-package-bloat",
        title: "Production worker ships unused evaluation tooling",
        category: "Dependency Waste",
        severity: "Medium",
        estimatedMonthlyCostWaste: 140,
        estimatedCarbonKgCO2e: 8,
        repairRecommendation: "Move eval-only dependencies to devDependencies and slim the worker bundle.",
        implementationDifficulty: "Low",
        riskLevel: "Low",
        expectedImpact: "Faster serverless cold starts and lower transfer volume.",
        confidence: 0.82,
        sourceSignals: ["package.json"],
        before: "Evaluation packages bundled into support workers",
        after: "Production worker excludes eval-only packages"
      }
    ]
  },
  {
    id: "overprovisioned-microservice",
    name: "Over-provisioned cloud microservice",
    tagline: "A microservice fleet with oversized instances, idle jobs, and underused observability.",
    description:
      "A cloud-hosted microservice that was sized for launch traffic, never right-sized, and now spends most of the day idle.",
    organizationProfile: "Enterprise internal platform, Kubernetes, regional workloads, strict approval process.",
    architectureNotes: [
      "Traffic peaks for 90 minutes after regional batch imports.",
      "Four replicas remain active overnight.",
      "Autoscaling is configured but min replicas force unused capacity.",
      "Observability collects high-cardinality debug logs in production."
    ],
    files: [
      {
        name: "cloud-billing.csv",
        type: "billing",
        signal: "Replica and logging spend exceed observed utilization."
      },
      {
        name: "deployment.yaml",
        type: "ci",
        signal: "Minimum replica count pins four pods per region."
      },
      {
        name: "architecture-notes.md",
        type: "notes",
        signal: "Regional batch traffic has predictable windows."
      }
    ],
    metrics: {
      dockerImageSizeMb: 760,
      dockerImageTargetMb: 540,
      ciRuntimeMinutes: 18,
      ciRuntimeTargetMinutes: 13,
      monthlyCloudWasteUsd: 3110,
      estimatedTotalMonthlyWasteUsd: 3525,
      aiDuplicateCallRate: 0.08,
      idleComputeHoursPerDay: 19,
      monthlyCarbonWasteKgCO2e: 156,
      annualSavingsUsd: 42300,
      engineeringHoursSavedMonthly: 35,
      kintsugiScoreBefore: 46,
      kintsugiScoreAfter: 78
    },
    findings: [
      {
        id: "replica-floor",
        title: "Minimum replica floor keeps pods idle",
        category: "Cloud Waste",
        severity: "Critical",
        estimatedMonthlyCostWaste: 1480,
        estimatedCarbonKgCO2e: 74,
        repairRecommendation: "Lower minimum replicas by region and add scheduled scaling before known import windows.",
        implementationDifficulty: "Medium",
        riskLevel: "High",
        expectedImpact: "Reduce idle overnight compute while keeping batch windows protected.",
        confidence: 0.89,
        sourceSignals: ["deployment.yaml", "cloud-billing.csv"],
        before: "Four pods per region pinned 24/7",
        after: "Scheduled minimums matched to regional import windows"
      },
      {
        id: "debug-log-volume",
        title: "Production debug logs create avoidable storage waste",
        category: "Observability Waste",
        severity: "High",
        estimatedMonthlyCostWaste: 690,
        estimatedCarbonKgCO2e: 22,
        repairRecommendation: "Sample high-cardinality debug logs and shorten retention for non-audit event streams.",
        implementationDifficulty: "Low",
        riskLevel: "Medium",
        expectedImpact: "Lower logging storage and indexing cost without losing incident traces.",
        confidence: 0.85,
        sourceSignals: ["cloud-billing.csv", "architecture-notes.md"],
        before: "Full debug stream retained for 30 days",
        after: "Sampled debug stream with seven-day retention"
      },
      {
        id: "oversized-node-pool",
        title: "Node pool sized above p95 memory needs",
        category: "Cloud Waste",
        severity: "High",
        estimatedMonthlyCostWaste: 970,
        estimatedCarbonKgCO2e: 49,
        repairRecommendation: "Right-size node pool class and run a canary with memory pressure alerts.",
        implementationDifficulty: "High",
        riskLevel: "High",
        expectedImpact: "Cut excess regional capacity after approval and canary verification.",
        confidence: 0.81,
        sourceSignals: ["cloud-billing.csv"],
        before: "Large memory-optimized nodes at 31% p95 usage",
        after: "Balanced nodes with canary rollback policy"
      },
      {
        id: "stale-ci-environments",
        title: "Preview environments remain active after merge",
        category: "Idle Compute",
        severity: "Medium",
        estimatedMonthlyCostWaste: 385,
        estimatedCarbonKgCO2e: 11,
        repairRecommendation: "Add automatic teardown for merged branches and weekly orphan cleanup.",
        implementationDifficulty: "Low",
        riskLevel: "Low",
        expectedImpact: "Remove idle preview services without touching production traffic.",
        confidence: 0.9,
        sourceSignals: ["cloud-billing.csv"],
        before: "Merged branch previews keep running",
        after: "Preview services expire after merge or inactivity"
      }
    ]
  }
];

export function getAuditSample(id?: string): AuditSample {
  return demoAudits.find((audit) => audit.id === id) ?? demoAudits[0];
}

export const defaultAuditId: AuditSampleId = "bloated-saas-backend";
