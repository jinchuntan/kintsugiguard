# KintsugiGuard AI

**Repair software waste. Govern agentic risk.**

Enterprise AI governance and software repair platform that helps engineering, DevOps, security, and governance teams detect software waste, estimate business and sustainability impact, assess agentic risk, enforce approval gates, and generate audit-ready repair logs.

## Problem

Enterprises are adopting AI agents for automation, but these autonomous systems create new risks:
- Software waste accumulates silently (bloated images, idle compute, duplicate API calls)
- AI agents make decisions without governance oversight
- No audit trail for autonomous repair actions
- Cost and carbon impact go unmeasured
- Security risks from uncontrolled agent behavior

## Solution

KintsugiGuard AI uses the kintsugi metaphor — repairing broken pottery with gold — to turn software cracks into governed, measurable enterprise repairs:

- **Cracks** = software waste and agentic risk
- **Gold repairs** = safe, policy-approved improvements
- **Restored vessel** = cleaner, safer enterprise software system
- **Repair ledger** = audit-ready governance trail
- **KintsugiGuard Score** = combined health, sustainability, and governance score

## Hackathon Track Alignment

| Track | Alignment |
|-------|-----------|
| Agent Security & AI Governance | Governance Policy Agent, Security Inspection Agent, policy enforcement, audit trail |
| Google AI Studio / Gemini | Gemini provider support for reasoning, classification, and summarization |
| Data & Intelligence | Multi-agent waste detection, impact estimation, repair prioritization |

## Architecture

### Multi-Agent System (10 agents)

1. **Crack Finder Agent** — scans for software waste signals
2. **Cloud Waste Agent** — identifies cloud infrastructure waste
3. **Carbon Accountant Agent** — estimates carbon impact
4. **Repair Planner Agent** — prioritizes repairs by impact, confidence, effort, risk
5. **Risk Verifier Agent** — adds approval gates and canary checks
6. **X402 Payment Agent** — simulates governed agentic payments
7. **Governance Policy Agent** — enforces enterprise policy on repairs
8. **Security Inspection Agent** — flags risky prompts, secrets, unsafe commands
9. **Audit Trail Agent** — records full decision provenance
10. **Impact Report Agent** — generates executive-ready repair ledger

### Governance Layer

Every repair recommendation receives a policy decision:
- **Auto-approved** — low risk, safe for autonomous execution
- **Human review required** — elevated risk, needs team approval
- **Blocked by policy** — production infrastructure changes blocked
- **Safe to simulate only** — can be modeled but not executed

### Policy Inspection Layer (Integration-Ready)

Compatible with deep prompt inspection approaches:
- Prompt injection detection
- Credential/PII detection
- Policy enforcement at agent boundary
- Declared vs detected intent checking
- Allow / deny / human review actions

### Gemini Support

Configurable AI provider with mock mode default:
- `mock` — deterministic outputs, no API key needed
- `gemini` — Google AI Studio for reasoning and classification
- `openai` / `anthropic` — alternative providers

Gemini is used for: audit reasoning, repair report summarization, governance risk classification, and executive summaries.

## Setup

```bash
git clone https://github.com/your-username/kintsugiguard.git
cd kintsugiguard
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

```env
KINTSUGIGUARD_AI_PROVIDER=mock    # mock | gemini | openai | anthropic
GEMINI_API_KEY=                    # Google AI Studio key (optional)
KINTSUGIGUARD_GEMINI_MODEL=gemini-2.0-flash
```

The app works fully in mock mode without any API keys.

## Demo Script

1. **Landing** — overview of KintsugiGuard AI capabilities
2. **Audit** — select a demo audit package (SaaS backend, AI pipeline, or microservice)
3. **Agents** — watch 10 agents run the audit workflow with governance
4. **Findings** — review detected waste with cost, carbon, and risk data
5. **Repair Plan** — see prioritized repairs grouped by execution lane
6. **Governance** — view policy decisions, security inspections, and audit trail
7. **X402** — see governed agentic payment with budget policy
8. **Report** — export executive-ready impact report with governance summary

## Tech Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Recharts
- Lucide Icons

## Judging Criteria Alignment

- **Innovation** — multi-agent governance for autonomous software repair
- **Technical complexity** — 10 coordinated agents with policy layer
- **Business value** — measurable cost savings, carbon reduction, risk mitigation
- **Completeness** — full audit-to-report flow with governance at every step
- **Presentation** — clean UI with enterprise-focused design

## Roadmap

- [ ] Live Gemini integration for real-time reasoning
- [ ] Lobster Trap deep prompt inspection integration
- [ ] Real cloud billing API connectors
- [ ] GitHub/GitLab PR generation from repair plans
- [ ] Team approval workflow with notifications
- [ ] Historical audit comparison and trend tracking
