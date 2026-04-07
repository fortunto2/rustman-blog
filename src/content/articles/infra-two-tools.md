---
type: summary
description: "Unified infrastructure for multiple mini-startups. Two principles: one project = one deploy config (infra lives in the repo), two tools, no more (SST + Pulumi)."
title: "Infrastructure: two tools, serverless by default"
created: 2026-04-07
tags: [infra, sst, pulumi, cloudflare, hetzner, serverless, deployment]
publish: true
source_path: "1-methodology/infra-prd.md"
---

## Key Takeaways

Unified infrastructure for multiple mini-startups. Two principles: **one project = one deploy config** (infra lives in the repo), **two tools, no more** (SST + Pulumi).

**4 tiers by project type:**

| Tier | When | Tool | Provider |
|------|------|------|----------|
| 1 | Web/API, Next.js, landing | SST (`sst.config.ts`) | Cloudflare Workers/Pages |
| 2 | Python agents, long-running, GPU | Pulumi (Python) | Hetzner VPS + Docker |
| 3 | Trading bots, mass ops | Pulumi + Prefect | Hetzner cluster |
| 4 | Docker without VPS (optional) | Fly CLI | Fly.io |

**Decision matrix:** has frontend? → SST + CF Pages. Pure TS API? → SST + CF Workers. Python long-running? → Pulumi + Hetzner. MVP? → Cloudflare Workers. Outgrown MVP? → migrate to Hetzner via Pulumi.

**Common:** Cloudflare DNS everywhere, GitHub Actions CI/CD, Pulumi Cloud state (free tier), no `.env` in repos. Typical cost: $5-30/mo per startup.

**Serverless by default.** VPS only for: persistent process, GPU, or when serverless is more expensive.

## Connections

- [[privacy-as-architecture]] — on-device + minimal cloud = infrastructure principle aligned with privacy
- [[one-pain-one-feature-launch]] — Cloudflare Workers for MVP = ship in hours, not days
- [[antifragile-life-design]] — cheap infra ($5-30/mo) = low downside per experiment in the barbell
