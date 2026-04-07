---
type: summary
description: "5 tools for background jobs, ordered by complexity. Rule: start with cron, move up only when you need to."
title: "Background jobs — cron → CF Workers → Prefect → Temporal → Trigger.dev"
created: 2026-02-21
tags: [infrastructure, temporal, prefect, cron, cloudflare, background-jobs, pipelines]
publish: true
source_path: "1-methodology/background-jobs.md"
---

## Key Takeaways

5 tools for background jobs, ordered by complexity. Rule: **start with cron, move up only when you need to.**

| Tool | When | Complexity |
|------|------|-----------|
| **Cron** | Simple schedule, < 30 sec, no retry | Lowest |
| **CF Workers Cron** | Edge function, JS/TS/Python, CF Pages already deployed | Low |
| **Prefect** | Python ETL/ML pipelines, need visual UI | Medium |
| **Temporal** | Parallel tasks, retry, observability, multi-project VPS | High |
| **Trigger.dev** | TS/JS, serverless, long-running AI, managed | High |

**Decision:** one simple task → cron. Need observability + retry → Temporal. Need Python pipeline UI → Prefect. Serverless TS → Trigger.dev.

## Connections

- [[infra-two-tools]] — background jobs are the orchestration layer on top of SST/Pulumi infra
- [[one-pain-one-feature-launch]] — start with cron, don't over-engineer the job system before validating the product
