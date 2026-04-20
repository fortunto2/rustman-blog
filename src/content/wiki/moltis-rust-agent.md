---
type: concept
title: "Moltis -- personal agent server in Rust"
description: "2.6k-star Rust agent server: sandboxed execution, multi-channel (Telegram, Discord, WhatsApp), MCP tools, memory. Our contributions: reqwest bump merged, openai-oxide provider rejected (trust issue)."
created: 2026-04-14
tags: [agents, rust, tools, open-source, contributions]
course_module: 5
course_order: 19
publish: true
source_url: "https://github.com/moltis-org/moltis"
---

# Moltis

Secure persistent personal agent server in Rust. 2.6k stars, MIT. Single binary, sandboxed execution, multi-channel access (Telegram, WhatsApp, Discord, Teams), MCP tools, voice, memory.

46 crates, ~196K lines (excluding web UI). Zero `unsafe` in core. Docker + Apple Container sandboxing. SQLite + FTS + vector embeddings for memory.

## Why it's interesting

Moltis is what happens when you build a full agent server in Rust instead of Python. The architecture is modular: 46 crates with feature gates. Core agent loop is only ~5K lines. Compare to OpenClaw at ~430K.

The security model is real: XChaCha20-Poly1305 vault encryption, WebAuthn passkeys, automatic checkpoints before mutations, BeforeToolCall hook inspection, destructive command guards. Not an afterthought.

## Our contributions

Three PRs submitted ([all PRs](https://github.com/moltis-org/moltis/pulls?q=is%3Apr+author%3Afortunto2)):

| PR | What | Status |
|----|------|--------|
| [#488](https://github.com/moltis-org/moltis/pull/488) | reqwest 0.12 → 0.13 workspace bump | **Merged** |
| [#487](https://github.com/moltis-org/moltis/pull/487) | openai-oxide as alternative OpenAI provider | Closed → superseded by #521 |
| [#521](https://github.com/moltis-org/moltis/pull/521) | openai-oxide provider (rebased) | Closed |

**#488 merged** -- straightforward dependency bump. Greptile flagged Cargo.lock regeneration and missing `query` feature, both fixed.

**#521 rejected** -- 888-line provider replacing their 5300-line openai.rs + openai_compat.rs. Full tool calling, WebSocket streaming, Responses API. 10 commits addressing every Greptile finding. Maintainer `@penso` closed with: *"not confident adding another lib which I'm not sure will be supported long term, for no new features in Moltis."*

Fair feedback. For a 2.6k-star project, adding a dependency on a 23-star crate is a risk. The path forward: grow openai-oxide's user base, hit v1.0, come back when the trust equation changes.

## Lessons for open source contributions

1. **Dependency PRs need social proof.** Code quality alone doesn't sell a new dependency. Stars, downloads, other users matter.
2. **Feature flags lower the bar.** We offered `provider-openai-oxide` as opt-in, not a replacement. Still not enough.
3. **reqwest bumps are easy wins.** Housekeeping PRs get merged when feature PRs don't. Now we're a contributor, which helps future PRs.
4. **Greptile review is thorough.** Their bot found real issues (Cargo.lock not regenerated, missing features, triple reqwest versions). Good signal for CI quality.

## How Moltis compares to our stack

| | Moltis | Our approach |
|---|---|---|
| Agent loop | moltis-agents (5K LoC) | sgr-agent (Rust) |
| LLM client | async-openai (+ our rejected openai-oxide) | openai-oxide |
| Tools | moltis-tools (21.9K, sandboxed) | sgr-agent-tools (14 tools, FileBackend trait) |
| Memory | SQLite + FTS + vectors | Solograph (FalkorDB + vectors) |
| Channels | Telegram, Discord, WhatsApp, Teams | CLI only (for now) |
| Deployment | Single binary, Docker, Fly.io | Local |

Moltis has the channels and deployment story we don't. We have the agent framework (SGR patterns, pipeline state machines) they don't. Different priorities.

Relevant to [[agent-toolkit-landscape]] -- Moltis sits between framework (like LangChain) and product (like Hermes Agent). It's a server you self-host.

Connects to [[project-openai-oxide]] -- the rejected PR is context for why growing the crate matters.

## Links

- [GitHub](https://github.com/moltis-org/moltis) -- 2.6k stars, MIT
- [Our PRs](https://github.com/moltis-org/moltis/pulls?q=is%3Apr+author%3Afortunto2)
- [Local fork](~/startups/shared/moltis/) (if cloned)
