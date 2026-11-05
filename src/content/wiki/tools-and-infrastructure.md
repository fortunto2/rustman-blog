---
type: hub
title: "Tools and Infrastructure"
description: "The libraries, CLIs, compute and model providers I use or evaluated for building alone: Rust tooling, storage, cheap compute, LLM credits, and the terminal."
created: 2026-11-01
tags: [hub, tools, infrastructure, rust, cli, llm]
publish: true
index_line: "Hub: tools + infra. Rust (actix, awesome-rust, dano media checksums, deepwiki-rs C4 docs, RustFS 2.3x MinIO on small objects, JS toolchain rewritten in Rust/Go 10-100x), compute & models (measured burst CPU/GPU prices, LLM free tiers and credits, Codex OAuth proxy, RLHF book), terminal (tv fuzzy finder). Two-tool infra rule: infra-two-tools"
---

# Tools and Infrastructure

What sits under the products: libraries I build on, tools I run every day, and where compute and
model calls come from when the budget is one person's. How little infrastructure I actually run is
in [[infra-two-tools]]; my own open-source tools are on [/projects/](/projects/).

## Rust

- [[awesome-rust]]: the community catalog of Rust libraries
- [[actix-actor-framework]]: typed actors with supervision, the base of actix-web
- [[dano-media-checksums]]: checksums of the media streams, stable across renames and container swaps
- [[deepwiki-rs]]: C4 architecture docs generated from a codebase
- [[rustfs-object-storage]]: S3-compatible storage, 2.3x faster than MinIO on small objects
- [[native-frontend-toolchain]]: the JS toolchain rewritten in Rust and Go, 10 to 100 times faster

## Compute and models

- [[cheap-compute-cpu-gpu]]: measured prices for burst CPU, a small CUDA job and single-GPU training
- [[llm-providers-credits]]: free tiers, startup credits and open models
- [[codex-oauth-proxy]]: LLM calls through a ChatGPT subscription, no API key
- [[rlhf-book]]: the free textbook on RLHF, from preference data to DPO and RLVR

## Search for agents

- [[own-searxng-for-agents]]: your own SearXNG with a Tavily-shaped API as web search for Claude Code, and the engine lessons with numbers

## The terminal

- [[tv-terminal-search]]: a fuzzy finder over this wiki, docs and stacks
