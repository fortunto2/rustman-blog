---
type: summary
description: "993-line reference document applied to every project regardless of stack. Injected into PRDs during generation. Covers: SOLID, DRY (but Rule of Three), KISS,..."
title: "Universal Development Principles — every project, any stack"
created: 2026-04-07
tags: [dev-principles, tdd, ddd, solid, clean-arch, sgr, baml, agents, methodology]
publish: true
source_path: "1-methodology/dev-principles.md"
---

## Key Takeaways

993-line reference document applied to every project regardless of stack. Injected into PRDs during generation. Covers: SOLID, DRY (but Rule of Three), KISS, TDD (when/when not), DDD (bounded contexts, aggregates, ubiquitous language), Clean Architecture (deps point inward).

**CLI-first testing:** every project has CLI mirroring core logic. CLI uses same modules as UI (DRY). Must work without LLM/network. `make integration` — mandatory Makefile target. If logic works through CLI, it doesn't depend on UI framework.

**SGR (Schema-Guided Reasoning):** schemas → logic → UI, never the reverse. Agent must read `Models/schemas/types/` before any work. SGR is the technical implementation of DDD: bounded context = separate schemas, aggregate = root schema, ubiquitous language = field names and enums.

**BAML (Boundary AI Markup Language):** turns prompt engineering into schema engineering. One `.baml` file gives prompt + schema + streaming parser + retries + typed SDK. Auto-fixes broken LLM output without re-requesting, 2-4x fewer tokens than JSON Schema. Use SGR where precision matters, BAML where reasoning matters.

**Agent self-discipline:** drift detector (task queue mode, report mode, permission mode, amnesia, scope creep), complexity thresholds (function >150 lines → split, module >1000 → split, CLAUDE.md >40k chars → trim, plan >15 tasks → split tracks). Evolution = commit: iteration without commit = not an iteration.

**Memory hierarchy:** user → rules → auto-memory → project chain. 40k char budget. CLAUDE.md is a map, not an encyclopedia. Conditional rules with `paths:` for domain content.

**Shared infra:** Supabase Auth (all platforms), Stripe/StoreKit/Play Billing, Resend + React Email, Zod/Pydantic validation at boundaries.

**Code quality:** Astral toolchain (ruff + ty + uv) for Python, ESLint + Prettier for TS, pre-commit mandatory, autofix by default.

**Agent-readable content:** markdown for agents (Cloudflare), `/llms.txt` discovery file, `Content-Signal` header.

**Opus 4.6 prompting:** no ALL-CAPS pressure, explain WHY not just WHAT, positive framing over prohibitions, no anti-patterns in examples, tone table for calibration.

## Connections

- [[harness-engineering-summary]] — dev-principles operationalizes harness engineering with specific tools and workflows
- [[context-engineering]] — memory hierarchy maintenance is applied context engineering
- [[agent-mistake-fix-harness]] — agent self-discipline section = drift detector + fix harness loop
- [[privacy-as-architecture]] — privacy-first section: all data local, offline-first, user controls everything
- [[solo-methodology]] — the entire dev lifecycle (plan → build → review) lives here
- [[one-pain-one-feature-launch]] — dev workflow supports rapid shipping via CLI-first + TDD + auto-commit
