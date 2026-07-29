---
type: synthesis
title: "Ruflo (ex-Claude Flow) — multi-agent orchestration platform for Claude Code"
description: "Ruflo bundles 32 Claude Code plugins, 100+ agents, MCP server, AgentDB vector memory, agent federation, and a GOAP A* goal planner into one self-learning swarm. Two install paths — lite (slash commands) and full (CLI + MCP + hooks + daemon)."
created: 2026-05-13
updated: 2026-05-13
tags: [agents, swarm, orchestration, claude-code, plugin, mcp, memory, federation, ruvnet]
publish: true
index_line: "Ruflo (ex-Claude Flow): 32 plugins, 100+ agents, AgentDB vector memory (HNSW 150-12500x), agent federation (zero-trust), GOAP A* goal planner. Two install paths — lite (slash commands) and full (MCP + hooks + daemon)"
index_section: "concept"
---

# Ruflo — Multi-Agent Orchestration

**Repo:** [ruvnet/ruflo](https://github.com/ruvnet/ruflo) (renamed from `claude-flow`) · MIT · npm `ruflo` / `@claude-flow/codex`. Author: [`rUv`](https://ruv.io).

The opposite end of the spectrum from [[bmad-method]]. Where BMAD ships a focused agile-dev methodology (~40 skills, single TOML primitive), Ruflo bundles **32 native Claude Code plugins, ~100 agents, ~210 MCP tools, vector memory, federation, and a hosted goal planner** into one self-learning swarm. It's less a methodology and more an attempt at a full agent OS bolted onto Claude Code.

## Two Install Paths (Important)

The README is explicit about a fork in surface area, and getting this wrong wastes hours:

| | **Claude Code Plugin** (lite) | **CLI install** (`npx ruflo init`) |
|---|---|---|
| Surface | Slash commands + a few skills + agent definitions per-plugin | 98 agents · 60+ commands · 30 skills · MCP server · hooks · daemon |
| Files in workspace | **Zero** | `.claude/`, `.claude-flow/`, `CLAUDE.md`, settings |
| MCP server | **Not registered** — `memory_store`, `swarm_init`, `agent_spawn` etc. unavailable | Yes |
| Hooks | No | Yes (auto-route tasks, learn patterns) |
| Best for | Try one plugin's commands without commitment | Production use — everything works as documented |

> "After `init`, just use Claude Code normally — the hooks system automatically routes tasks, learns from successful patterns, and coordinates agents in the background." — i.e., the value is in the **hook + MCP + daemon loop**, not in the slash commands. The lite path is a teaser.

## The 32-Plugin Catalog

Organized by domain (each plugin = its own README and command set):

- **Core & Orchestration** — `ruflo-core`, `ruflo-swarm`, `ruflo-autopilot`, `ruflo-loop-workers`, `ruflo-workflows`, `ruflo-federation`
- **Memory & Knowledge** — `ruflo-agentdb`, `ruflo-rag-memory`, `ruflo-rvf` (save/restore memory across sessions), `ruflo-ruvector` (GPU-accelerated, 103 tools), `ruflo-knowledge-graph`
- **Intelligence & Learning** — `ruflo-intelligence` (SONA neural patterns), `ruflo-daa` (cognitive patterns), `ruflo-ruvllm` (local LLM routing), `ruflo-goals`
- **Code Quality & Testing** — `ruflo-testgen`, `ruflo-browser` (Playwright), `ruflo-jujutsu` (diff risk-scoring), `ruflo-docs`
- **Security** — `ruflo-security-audit` (CVE scan), `ruflo-aidefence` (prompt-injection block, PII detect)
- **Architecture & Methodology** — `ruflo-adr`, `ruflo-ddd`, `ruflo-sparc` (5-phase methodology with quality gates)
- **DevOps & Observability** — `ruflo-migrations`, `ruflo-observability`, `ruflo-cost-tracker` (budgets and alerts)
- **Extensibility** — `ruflo-agent` (local WASM sandbox + Anthropic Managed Agents), `ruflo-plugin-creator`
- **Domain-Specific** — `ruflo-iot-cognitum`, `ruflo-neural-trader` (4 trading agents, backtesting), `ruflo-market-data`

## What's Architecturally Distinct

Beyond the plugin pile, three pieces stand out:

**1. AgentDB vector memory.** HNSW-indexed, claimed 150x–12,500x faster than brute-force vector search. Powers `memory_store`, semantic recall, RAG. Survives sessions. Cross-agent shared namespace via swarm coordination. Conceptually adjacent to [[agent-memory-architecture]] but built into the platform rather than added as a sidecar.

**2. Agent federation.** Zero-trust comms layer where agents on different machines (or orgs) discover, authenticate, and exchange work without leaking secrets. Slack-for-agents framing. Solves a problem most local agent toolkits (including [[project-solo-factory]] and [[bmad-method]]) don't even attempt.

**3. GOAP A\* goal planner.** [goal.ruv.io](https://goal.ruv.io/) takes plain-English goals and decomposes them via Goal-Oriented Action Planning (classic gaming-AI pattern: state-space search with action preconditions and effects, A* for shortest viable path). Replans on failure instead of retry-looping. Visual collapsible action trees. Live agent dashboard at `/agents` shows role, current step, memory namespace, token budget.

A self-hostable web UI ([flo.ruv.io](https://flo.ruv.io/)) wraps it all with multi-model chat, parallel MCP tool execution (one model turn fires 4–6+ tools), and an in-browser WASM tool gallery. Ships as Docker with embedded Mongo.

## Self-Learning Loop

```
User → Ruflo (CLI/MCP) → Router → Swarm → Agents → Memory → LLM Providers
                       ^                                    |
                       +----------- Learning Loop ----------+
```

Three named learning systems: **SONA neural patterns** (trajectory learning), **ReasoningBank** (successful pattern reuse), and **trajectory learning** (agent traces feed back into AgentDB). 12 background workers run on timers (audit, optimize, testgaps, etc.) without user prompts. Underneath: `Cognitum.One` agentic architecture, Rust-based engine.

## Comparison — BMAD vs Ruflo vs solo-factory

| Aspect | [[bmad-method]] | Ruflo | [[project-solo-factory]] |
|---|---|---|---|
| Scope | Agile-dev methodology | Full agent OS | Startup pipeline |
| Skill count | ~40, organized in numbered phases | 30 skills + 60+ commands + 100 agents | 30 skills |
| Persistence | Files only (artifacts as state) | AgentDB vector memory + RAG + Knowledge Graph | Solograph MCP + filesystem |
| Customization | 3-layer TOML merge (defaults → team → user) | Per-plugin config + hooks + daemon | Single `SKILL.md` per skill |
| Multi-machine | No | Federation (zero-trust) | No |
| Goal planning | CSV catalog + filesystem scan | GOAP A* with replanning | Pipeline DAG in markdown |
| Methodology weight | Strong (agile, phased, gated) | Light (plugin pick-and-mix) | Strong (STREAM, S.E.E.D., kill/iterate/scale) |
| Install ceremony | `npx bmad-method install` → modular | Two paths, full path is heavyweight | `npx skills add fortunto2/solo-factory` |

## Where It Fits in the Landscape

Doesn't slot into a single bucket from [[agent-toolkit-landscape]] — it spans **Project Managers + Memory + Frameworks** at once. Closest peers:

- [[conductor-parallel-agents]] — Conductor/Superset/Emdash also coordinate parallel agents, but as worktree managers around a single coding agent. Ruflo is a swarm-first system that owns the coordination layer end-to-end.
- [[hermes-agent]] — both have self-improving learning loops; Hermes auto-creates skills at runtime, Ruflo prefers a fixed plugin catalog with a learning memory layer behind it.

## When to Reach For It vs the Alternatives

- **Pick [[bmad-method]]** when you want a disciplined methodology with low coordination overhead — agile teams, story-driven implementation, no swarm needed.
- **Pick [[project-solo-factory]]** when you're a solopreneur driving research → ship and want a focused pipeline with KB integration.
- **Pick Ruflo** when you actually need swarms, federation, persistent vector memory, autonomous background workers, or you're building something that benefits from GOAP planning. Be ready for the install footprint and the surface area.

## Risks and Caveats

- **Surface area.** 32 plugins · 60+ commands · 30 skills · ~210 MCP tools is a lot to keep mental model on. The README itself acknowledges this and tells users to "just use Claude Code normally" and trust the hooks.
- **Naming churn.** `claude-flow` → `ruflo`, npm package still partly `@claude-flow/codex`. Docs and links in the wild may not be consistent yet.
- **Vendor coupling.** Powered by `Cognitum.One` and tied to `RuVector`/`ruvLLM` ecosystem. Strong opinions about the underlying Rust stack — fine if you adopt the whole loop, awkward if you want to swap pieces.
- **Two-path confusion.** The lite Claude Code Plugin path leaves out the MCP server, hooks, and daemon — meaning most of what makes Ruflo "Ruflo" only works after the full CLI install. New users hit this wall (issue #1744).

## Related

- [[bmad-method]] — opposite design philosophy; minimal & focused vs maximal & swarm-oriented
- [[skills-standard]] — Ruflo's 30 skills + 60 commands sit on top of SKILL.md; the rest (MCP, federation, AgentDB) is what you get when "just skills" isn't enough
- [[project-solo-factory]] — single-developer pipeline, no swarm
- [[agent-toolkit-landscape]] — Ruflo spans Project Managers + Memory + Frameworks categories
- [[conductor-parallel-agents]] — parallel orchestration done as worktree managers, not full agent OS
- [[hermes-agent]] — self-improving learning loop comparison
- [[agent-memory-architecture]] — AgentDB + HNSW is one more memory architecture worth cataloging
