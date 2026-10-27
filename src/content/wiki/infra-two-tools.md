---
type: summary
description: "How a dozen small products actually deploy: one wrangler config per repo on Cloudflare, plus three exceptions that each have a reason."
title: "Infrastructure: Cloudflare by default, exceptions by name"
created: 2026-04-07
updated: 2026-10-27
tags: [infra, cloudflare, wrangler, workers, d1, serverless, deployment]
course_module: 3
course_order: 8
publish: true
source_path: "1-methodology/infra-prd.md"
index_line: "Measured 2026-10-27 in active/: 0 sst.config.ts, 0 Pulumi.yaml; 28 wrangler configs in 13 projects (Worker+D1 in 8, static-asset Workers 5, Pages 4, Durable Objects 2, Containers 1). Off Cloudflare: 4 Next.js apps on Vercel, 1 VPS (Docker: Python video analysis + Temporal), SearXNG on the Mac for its residential IP. Nothing on Hetzner or Fly. infra-prd.md = the earlier SST+Pulumi plan"
index_section: "concept"
---

## What the plan said, and what happened

The raw doc `1-methodology/infra-prd.md` describes the earlier plan: two tools, SST for serverless and Pulumi for VPS, with Hetzner and Fly.io as further tiers. Practice went elsewhere. On 27 Oct 2026 the active projects contain no `sst.config.ts` and no `Pulumi.yaml`, and 28 wrangler configs across 13 projects.

The first principle survived: one project, one deploy config, kept in the repo. The wrangler file became that config. It names the Worker and binds its database, buckets and cron triggers, and `wrangler deploy` applies it, so a second layer on top had nothing left to do.

## What runs on Cloudflare

| Kind | Projects | Typical use |
|---|---|---|
| Worker + D1 | 8 | APIs, cron jobs, small relational data |
| Static assets on Workers | 5 | sites, including a Next.js app built with OpenNext |
| Pages | 4 | Astro and static landings; this blog too |
| Durable Objects | 2 | per-room state in a video-call app; the binding behind a container |
| Containers | 1 | a Rust server binary that sleeps after 10 idle minutes |

One repo often uses several kinds at once. Postgres and auth, where a product needs accounts, come from Supabase (6 active projects have a `supabase/` directory). The account is on Workers Paid, $5 a month; the analytics counter alone would fit the free plan.

## The exceptions, each with a reason

- **Vercel, 4 Next.js apps.** They deploy on git push and have not been moved. One Next.js app already runs on Workers through OpenNext, so moving is possible when one of them needs touching anyway.
- **One VPS with Docker Compose.** A Python video-analysis service behind a Cloudflare Tunnel, and a Temporal server whose worker runs a daily refresh. Both are long-running processes.
- **The Mac.** SearXNG runs in Docker on the laptop on purpose: Google and Bing CAPTCHA-wall datacenter IPs, so a VPS gets blocked on its first queries, and a residential IP needs no proxy. The cost is that search works only while the Mac is on.

Nothing runs on Hetzner. One project keeps a `fly.toml` as an escape hatch; its production runs on Cloudflare Containers.

## Decision rule

1. Static site or landing: static assets on Workers, or Pages.
2. API, cron job, small database: a Worker with D1, plus R2 or KV.
3. State that has to live in one place (a room, a counter): a Durable Object.
4. A process the Worker runtime cannot host: Cloudflare Containers if it can sleep when idle, the VPS if it must run all the time.
5. Needs a residential IP: the Mac, and the repo says so.

## What others found since (Oct 2026)

- **Spend caps that stop, not warn.** Simon Willison ([3 Oct 2026](https://simonwillison.net/2026/Oct/3/default-hard-budget-caps/)): agents make spinning up paid services frictionless, so caps should be hard and on by default. AWS shipped project spend limits in September 2026 (limited rollout) and Google Cloud shipped Spend Caps in July (reported). Know what each provider can cap before an agent gets deploy rights. The same lesson was paid for here in March 2026: several overnight Gemini CLI sessions in `--yolo` mode on Vertex AI looped through tool calls with no stop condition, and the guardrail written afterwards is a token budget per autonomous task, a warning at 2M input tokens and a hard stop at 5M. Cloudflare is still on the soft side: in September 2026 bots enumerated one site's filter URLs and the bill came to $198. The guard since then is a Worker that posts a daily spend report to Telegram and forwards Cloudflare budget alerts there, because the alert emails never reached the inbox. That is a warning, the kind of cap Willison argues against.

## Connections

- [[superduper-analytics]]: the counter every product reports to, a Worker with Analytics Engine and D1
- [[background-jobs-ladder]]: Worker cron triggers come before Temporal
- [[cloudflare-computer-agent-runtime]]: new agent primitives on the same platform
- [[privacy-as-architecture]]: on-device first, minimal cloud
