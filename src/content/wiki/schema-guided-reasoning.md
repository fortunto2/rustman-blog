---
type: concept
description: "Schema-Guided Reasoning (SGR): all projects built from schemas to logic, not the other way around. Schemas are the contract between AI agent, business logic,..."
title: "SGR — schemas first, logic second, UI last"
created: 2026-04-07
tags: [sgr, schemas, ddd, pydantic, zod, methodology]
publish: true
source_path: "1-methodology/dev-principles.md"
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

By stack: Pydantic (Python), Zod (TypeScript), SwiftData @Model (iOS), data class + kotlinx.serialization (Kotlin).

**BAML extends SGR for LLM output:** when you need structured responses from LLMs, BAML turns prompt engineering into schema engineering. Use SGR (constrained decoding) where precision matters (tool routing, classification), BAML where reasoning matters (extraction, analysis).

- [[dev-principles-summary]] — origin: SGR + BAML sections
- [[context-engineering]] — agent reading schemas first = context engineering for code
- [[harness-engineering-summary]] — schemas as architectural constraints (component 2)
