---
type: concept
title: "Rust agent ecosystem -- who builds AI agents in Rust"
description: "4 major Rust agent projects compared: ZeroClaw (30k stars, edge), IronClaw (11.8k, security), Moltis (2.6k, personal server), ZeptoClaw (589, ultra-light). Plus our sgr-agent stack."
created: 2026-04-14
tags: [agents, rust, open-source, comparison, ecosystem]
course_module: 5
course_order: 21
publish: true
---

# Rust Agent Ecosystem

AI agents are mostly Python. But a growing cluster of projects builds them in Rust, trading ecosystem size for performance, safety, and small binaries. Here's who does it and how.

Source: [big_model_radar#97](https://github.com/gsscsd/big_model_radar/issues/97) (OpenClaw ecosystem daily report, 2026-03-26).

## The landscape

| Project | Stars | Binary | RAM | Channels | Sandbox | Focus |
|---------|-------|--------|-----|----------|---------|-------|
| [ZeroClaw](https://github.com/zeroclaw-labs/zeroclaw) | 30.1k | small | <5MB | 25+ (incl. iMessage, IRC) | default | Edge/IoT, runs on $10 hardware |
| [IronClaw](https://github.com/nearai/ironclaw) | 11.8k | medium | -- | REPL, Telegram, web | WASM | Security-first, credential protection |
| [Moltis](https://github.com/moltis-org/moltis) | 2.6k | 44MB | -- | Telegram, Discord, WhatsApp, Teams | Docker + Apple | Personal server, 46 crates |
| [ZeptoClaw](https://github.com/qhkm/zeptoclaw) | 589 | ~6MB | ~6MB | 11 channels | 6 runtimes | Ultra-light, 50ms startup |
| **sgr-agent** (ours) | -- | -- | -- | CLI | -- | Agent framework, SGR patterns |

For comparison, Python agents: OpenClaw (~430K LoC, Node.js), Hermes Agent (76k stars, Python), NanoBot (Python).

## What they have in common

**Single binary deployment.** No pip, no node_modules, no Docker required (though most support it). ZeroClaw runs on ESP32. ZeptoClaw is 6MB.

**Multi-channel as core feature.** Not just CLI. Telegram, Discord, Slack, WhatsApp are table stakes. ZeroClaw does 25+ including iMessage and Matrix.

**Security beyond "trust the LLM."** WASM sandboxing (IronClaw), Apple Container sandboxing (Moltis), SSRF prevention (ZeptoClaw), prompt injection detection (all of them). Rust's type system helps here -- compile-time tenant isolation in IronClaw.

**MCP support.** Every Rust agent supports Model Context Protocol. It's the standard connector.

## What differs

**ZeroClaw** bets on edge. <5MB RAM, hardware peripherals (ESP32, STM32, Arduino via traits). React 19 dashboard. 30k stars says the market wants lightweight agents.

**IronClaw** bets on security. WASM sandbox for tool execution, credentials never exposed to tools, capability-based permissions. PostgreSQL-backed memory with hybrid search. NEAR AI is behind it.

**Moltis** bets on modularity. 46 crates, feature-gated. You assemble what you need. We [contributed](https://github.com/moltis-org/moltis/pulls?q=is%3Apr+author%3Afortunto2) reqwest bump (merged) and openai-oxide provider (rejected). See [[moltis-rust-agent]].

**ZeptoClaw** bets on minimalism. 6MB binary, 50ms startup, 6MB RAM. 33 tools, 16 providers, multi-tenant. The "Alpine Linux" of agents.

## Where our stack fits

Our approach is different. We don't build an agent server. We build the **framework layer** that agent servers use:

```
openai-oxide        → LLM client (any Rust agent can use)
sgr-agent-core      → Tool/Backend traits (any agent can implement)
sgr-agent-tools     → 14 reusable tools (any agent can embed)
sgr-agent           → Agent loop with SGR patterns
```

[[project-openai-oxide]] is already a crate on crates.io. The rejected Moltis PR (#521) was an attempt to prove this -- 888 lines replacing 5300. The architecture works, the social proof needs growing.

The gap in our stack: no multi-channel (Telegram, Discord). No sandboxing. No deployment story beyond "run locally." These are the features that get Rust agents to 10k+ stars.

## Patterns worth stealing

1. **WASM tool sandboxing** (IronClaw) -- tools run in WASM, can't access host filesystem. Our FileBackend trait could add a WasmFs backend.
2. **Hardware peripheral traits** (ZeroClaw) -- same trait-based abstraction we use for FileBackend, but for GPIO/sensors. Interesting for airq/air-signal.
3. **Subscription OAuth** (ZeroClaw) -- route through existing ChatGPT/Claude subscriptions instead of API keys. Lowers user friction.
4. **Multi-tenant compile-time isolation** (IronClaw) -- TenantCtx generic parameter on every service. Type system prevents cross-tenant data leaks.

## Links

- [big_model_radar#97](https://github.com/gsscsd/big_model_radar/issues/97) -- source comparison
- [[moltis-rust-agent]] -- our Moltis contributions
- [[agent-toolkit-landscape]] -- broader agent ecosystem (Python + Rust + JS)
- [[hermes-agent]] -- top Python agent for comparison (76k stars)
