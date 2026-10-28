---
type: summary
description: "993-line reference document applied to every project regardless of stack. Injected into PRDs during generation. Covers: SOLID, DRY (but Rule of Three), KISS,..."
title: "Universal Development Principles — every project, any stack"
created: 2026-04-07
updated: 2026-10-27
tags: [dev-principles, tdd, ddd, solid, clean-arch, sgr, agents, methodology]
course_module: 3
course_order: 1
publish: true
source_path: "1-methodology/dev-principles.md"
index_line: "Dev Principles (1-methodology/dev-principles.md). SOLID, TDD, DDD, SGR, agent discipline, code quality"
index_section: "summary"
---

## Key Takeaways

993-line reference document applied to every project regardless of stack. Injected into PRDs during generation. Covers: SOLID, DRY (but Rule of Three), KISS, TDD (when/when not), DDD (bounded contexts, aggregates, ubiquitous language), Clean Architecture (deps point inward).

**CLI-first testing:** every project has CLI mirroring core logic. CLI uses same modules as UI (DRY). Must work without LLM/network. `make integration` — mandatory Makefile target. If logic works through CLI, it doesn't depend on UI framework.

**SGR (Schema-Guided Reasoning):** schemas → logic → UI, never the reverse. Agent must read `Models/schemas/types/` before any work. SGR is the technical implementation of DDD: bounded context = separate schemas, aggregate = root schema, ubiquitous language = field names and enums.

**Agent self-discipline:** drift detector (task queue mode, report mode, permission mode, amnesia, scope creep), complexity thresholds (function >150 lines → split, module >1000 → split, CLAUDE.md >40k chars → trim, plan >15 tasks → split tracks). Evolution = commit: iteration without commit = not an iteration.

**Memory hierarchy:** user → rules → auto-memory → project chain. 40k char budget. CLAUDE.md is a map, not an encyclopedia. Conditional rules with `paths:` for domain content.

**Shared infra:** Supabase Auth (all platforms), Stripe/StoreKit/Play Billing, Resend + React Email, Zod/Pydantic validation at boundaries.

**Code quality:** Astral toolchain (ruff + ty + uv) for Python, ESLint + Prettier for TS, pre-commit mandatory, autofix by default.

**Agent-readable content:** markdown for agents (Cloudflare), `/llms.txt` discovery file, `Content-Signal` header.

**Claude prompting** (rules written for Opus 4.6): no ALL-CAPS pressure, explain WHY not just WHAT, positive framing over prohibitions, no anti-patterns in examples, tone table for calibration.

## What others found since (Oct 2026)

- **TDD changes once the agent runs the loop itself (adopted 27 Oct 2026).** Birgitta Böckeler ([martinfowler.com](https://martinfowler.com/articles/exploring-gen-ai/tdd-in-the-agent-loop.html), Aug 2026) had agents do red-green-refactor alone: 2.96x to 8.5x the tokens, mutation scores no better, and the no-TDD runs ranked higher on design in the small and medium tasks (reported, 5 batches). Test-first keeps its value where a human or a fixed spec owns the test. The principles now say so: when the agent owns the test, design first, then code and tests together at agreed seams, then a mutation check. See [[tdd-inside-the-agent-loop]].
- **File size has a token price.** Giles Edwards-Alexander ([martinfowler.com](https://martinfowler.com/articles/exploring-gen-ai/refactoring-economic-benefit.html), Jul 2026) split a 17,155-line agent-written Rust layer in 15 steps: input tokens per change fell 83%, from 159,564 to 27,360, while total lines stayed flat (reported).

## Connections

- [[harness-engineering-summary]] — dev-principles operationalizes harness engineering with specific tools and workflows
- [[context-engineering]] — memory hierarchy maintenance is applied context engineering
- [[agent-mistake-fix-harness]] — agent self-discipline section = drift detector + fix harness loop
- [[privacy-as-architecture]] — privacy-first section: all data local, offline-first, user controls everything
- [[solo-methodology]] — the entire dev lifecycle (plan → build → review) lives here
- [[one-pain-one-feature-launch]] — dev workflow supports rapid shipping via CLI-first + TDD + auto-commit
- [[agent-self-discipline]] — agent self-discipline section extracted as concept page
- [[enterprise-rag-challenge]] — ERC validates SGR + structured outputs patterns from dev principles
