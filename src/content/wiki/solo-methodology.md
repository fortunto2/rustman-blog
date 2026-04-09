---
type: hub
description: "AI-driven solo development — how one person ships products using LLM agents, harness engineering, and automation."
title: "Solo Methodology"
created: 2026-04-07
updated: 2026-04-08
tags: [hub, methodology, ai-driven, solo]
publish: true
---

# Solo Methodology

AI-driven solo development — how one person ships products using LLM agents, harness engineering, and automation.

## Open Source Tools

| Project | What | Stars |
|---------|------|-------|
| [solo-factory](https://github.com/fortunto2/solo-factory) | Claude Code plugin — 27 startup skills, 3 agents, privacy-first pipeline | 14 |
| [solograph](https://github.com/fortunto2/solograph) | Code intelligence MCP server — multi-project code graph, semantic search, session history | 3 |
| [openai-oxide](https://github.com/fortunto2/openai-oxide) | Idiomatic Rust client for OpenAI API — 1:1 parity with openai-python | 20 |
| [rust-code](https://github.com/fortunto2/rust-code) | AI-powered terminal coding agent in Rust — TUI, structured agent loop, MCP | 7 |
| [supervox](https://github.com/fortunto2/supervox) | Voice pipeline toolkit — STT, VAD, TTS for Rust voice apps | 0 |
| [airq](https://github.com/fortunto2/airq) | CLI air quality checker — any city, Open-Meteo + Sensor.Community | 0 |
| [rustman-blog](https://github.com/fortunto2/rustman-blog) | This blog — Astro static, wiki content, CF Pages | 0 |

## Pages

### Harness Engineering
- [[harness-engineering-summary]] — Harness engineering: agent mistake → fix harness, 3 components, 6 adoption steps
- [[agent-mistake-fix-harness]] — Core loop: CLAUDE.md → linters → structural tests. Ratchet effect
- [[context-engineering]] — Context as code: CLAUDE.md as TOC, progressive disclosure, dynamic context
- [[agent-self-discipline]] — Drift detector, complexity thresholds, evolution = commit

### Principles & Frameworks
- [[stream-six-layers]] — STREAM: principles as dependency graph, not flat list
- [[antifragile-life-design]] — Barbell for solo: 90% consulting + 10% products
- [[one-pain-one-feature-launch]] — Ship one thing in days, not platforms in months
- [[portfolio-approach]] — Multiple small bets, not one big bet

### Knowledge Graphs & Memory
- [[context-graphs-summary]] — Context graphs: agent decision trajectories as compounding asset
- [[decision-traces-compound]] — Each agent action improves future ones via precedent retrieval
- [[codegraph-guide]] — CodeGraph: code intelligence across projects via FalkorDB + tree-sitter

### Development Patterns
- [[dev-principles-summary]] — 993-line reference: SOLID, TDD, DDD, Clean Arch, i18n, infra, code quality
- [[cli-first-testing]] — Every project gets CLI mirror, `make integration` mandatory
- [[schema-guided-reasoning]] — SGR: schemas → logic → UI. Agent reads schemas first
- [[enterprise-rag-challenge]] — ERC: structured outputs beat vector search in production RAG
- [[tool-calling-four-layers]] — Tool calling internals: HTTP → chat template → constrained decoding → parser

### Infrastructure
- [[infra-two-tools]] — SST + Pulumi, serverless by default, 4 tiers
- [[background-jobs-ladder]] — Cron → CF Workers → Prefect → Temporal
- [[rag-patterns]] — 7 RAG approaches from vector to agentic

## Open Questions

- Optimal agent team size for solo dev?
- When to use subagents vs sequential work?
- How to prevent context window waste?
