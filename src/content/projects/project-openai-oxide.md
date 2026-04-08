---
type: concept
description: "1:1 parity with openai-python. Typed responses, streaming, function calling. First Rust crate shipped via solo-factory pipeline."
title: "openai-oxide — idiomatic Rust client for OpenAI API"
created: 2026-03-01
tags: [project, open-source, rust, openai, api-client, crate]
publish: true
publish_as: project
source_url: "https://github.com/fortunto2/openai-oxide"
---

Idiomatic Rust client for OpenAI API with 1:1 parity to openai-python. Typed responses, streaming, function calling, all models.

**GitHub:** [openai-oxide](https://github.com/fortunto2/openai-oxide) — Rust, published on crates.io.

**Why Rust:** type safety for API contracts (SGR at the language level), zero-cost abstractions for streaming, compile-time guarantees that the client matches the API schema.

**First project shipped via solo-factory pipeline:** `/research` → `/validate` → `/scaffold` → `/build` → `/review`. Pipeline score: 8/10.

- [[schema-guided-reasoning]] — typed Rust structs = SGR at compile time
- [[cli-first-testing]] — CLI-first: `cargo test` + integration tests against live API
- [[portfolio-approach]] — one crate in the Rust open source portfolio
