---
type: concept
description: "Schema-Guided Reasoning (SGR): all projects built from schemas to logic, not the other way around. Schemas are the contract between AI agent, business logic,..."
title: "SGR — schemas first, logic second, UI last"
created: 2026-04-07
updated: 2026-10-27
tags: [sgr, schemas, ddd, pydantic, zod, methodology, rust]
course_module: 3
course_order: 2
publish: true
source_path: "1-methodology/dev-principles.md"
source_url: "https://abdullin.com/schema-guided-reasoning/"
index_line: "SGR: schemas → logic → UI. Agent reads Models/schemas/types/ first. Technical DDD implementation"
---

**Schema-Guided Reasoning (SGR):** all projects built from schemas to logic, not the other way around. Schemas are the contract between AI agent, business logic, and UI.

Order: **Define domain (typed schemas) → Then logic (services work with schemas) → UI last (displays schemas, doesn't parse strings).**

When an AI agent works on a project, it MUST:
- Read schemas first — `Models/`, `schemas/`, `types/` before any work
- Generate structured output through typed schemas, not strings
- Validate at boundaries — agent I/O goes through schema validation
- Document the domain — enums, value objects, aggregates as code, not comments

SGR is the technical implementation of DDD:
- Bounded Context → separate set of schemas
- Aggregate → root schema with nested ones
- Ubiquitous Language → field names and enums = language of business
- Value Objects → enums and typed wrappers

By stack: Pydantic (Python), Zod (TypeScript), SwiftData @Model (iOS), data class + kotlinx.serialization (Kotlin). See SGR in practice: [openai-oxide](https://github.com/fortunto2/openai-oxide) (Rust client with typed responses), [rust-code](https://github.com/fortunto2/rust-code) (structured agent loop).

**Skill:** `/sgr` in [solo-factory](https://github.com/fortunto2/solo-factory) — design and implement SGR pipelines (NextStep agent loop, analysis cascade, tool dispatch). 4 reference files incl. working 304-line demo.

**Libraries:** [sgr-agent](https://github.com/fortunto2/rust-code) crate v0.6.1 (Rust core for SGR agents), [sgr-agent-core](https://github.com/vamplabAI/sgr-agent-core) (Python, 1K+ stars), [openai-oxide](https://github.com/fortunto2/openai-oxide) (typed Rust client).

## What others found since (Oct-Nov 2026)

- **Turn strict mode on; don't assume it.** Armin Ronacher ([Better Models: Worse Tools](https://lucumr.pocoo.org/2026/7/4/better-models-worse-tools/), Jul 2026) saw Opus 4.8 and Sonnet 5 invent keys in nested tool arguments in about 20% of one session's edit calls, and `strict` tool mode removed them (reported). His reading: post-training inside a forgiving harness makes its flat schema shapes in-distribution and other shapes out of it. Keep schemas flat and enforce them.
- **SGR's author says the product architecture has not changed** (Rinat Abdullin, [post 952](https://t.me/llm_under_hood/952), 30 Sep 2026): quality as a trajectory, evals, SGR, feedback loops, hallucination triggers and moving to cheaper models still carry LLM products. What changed is the economics: a general agent did the first research pass of an old case in 14 minutes.
- **Put the contract in code** (Ilyas Salikhov's Exoskeleton on BitGN ECOM1, [insight](https://bitgn.com/insights/2026-06-15-ecom1-exoskeleton-insight), Jun 2026): gpt-5.4-mini only routes and judges; Python owns preflight security exits, an evidence ledger, a reference normalizer and a final formatter. 71.8 in the blind Speed round (TOP1), 74.7 Ultimate (#10), 97.4 on the live board later. The largest miss was still grounding references (15-17 zero-score tasks). This is SGR's "schema is the contract" pushed one step further: whatever a failure class makes predictable becomes code, not a prompt amendment.
- **Same harness, open models** ([research](https://bitgn.com/insights/2026-06-22-ecom1-open-models-research-insight)): reference discipline (right answer, wrong refs) is the error class spread across the most model families; cheap tokens did not make cheap task runs. Our [[agent-bit-pac1]] fork for ECOM1 logs the same thing as its #1 fail mode.
- **When the tool surface is wide, code mode instead of a tool union.** Rinat cut his memory server's MCP to two tools, `start` (session + SDK description) and `run` (Python in a server sandbox), and halved agent wandering; Cloudflare reports ~1000x fewer tokens for 2,549 tools the same way. A `Union[ToolA, ToolB]` dispatch stays right for a narrow, fixed surface. See [[company-brain]].


## Connections

- [[dev-principles-summary]] — origin: SGR section
- [[context-engineering]] — agent reading schemas first = context engineering for code
- [[harness-engineering-summary]] — schemas as architectural constraints (component 2)
- [[rlhf-book]] — RLHF = training-time alignment, SGR = inference-time alignment. Complementary strategies for the same goal
- [[deepeval-llm-testing]] — G-Eval applies the SGR pattern to the judge: rubric → structured (score, reasoning) output, not free-form opinion
- [[native-frontend-toolchain]] — codegen-from-OpenAPI is the frontend face of schema-first: "compilation becomes an integration test"
- [[jev-system-one]] — the opposite bet: Jev/Laya answer a closed Choice/Score/Noul taxonomy with calibrated confidence per answer, instead of arbitrary schemas with none

- See also: [[effect-ts-for-agents]] — Effect, the TypeScript reliability layer around execution, and when it is worth its learning curve.
