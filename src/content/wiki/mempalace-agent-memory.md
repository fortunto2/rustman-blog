---
type: concept
title: "MemPalace — spatial memory architecture for AI agents"
description: "Open-source local-first memory system: 96.6% on LongMemEval, palace metaphor (wings/rooms/halls), ChromaDB + SQLite knowledge graph, 19 MCP tools."
created: 2026-04-09
tags: [memory, agents, tools, mcp, rag, open-source]
publish: true
source_url: "https://github.com/milla-jovovich/mempalace"
---

# MemPalace — Spatial Memory for AI Agents

Open-source, local-first AI memory system that scored 96.6% on LongMemEval benchmarks. No cloud, no subscriptions, MIT license. 27K+ GitHub stars as of April 2026.

## The Problem

AI agents forget everything between sessions. Context windows are finite. RAG retrieves documents but doesn't capture decisions, preferences, or evolving relationships between concepts.

## Palace Architecture

Memory organized via spatial metaphor — intuitive and structurally filterable:

- **Wings** — top-level containers (one per person, project, or domain)
- **Rooms** — specific topics within a wing (auth, billing, onboarding)
- **Halls** — memory type corridors: `hall_facts`, `hall_events`, `hall_discoveries`, `hall_preferences`, `hall_advice`
- **Closets** — compressed summaries pointing to originals
- **Drawers** — verbatim source files
- **Tunnels** — cross-wing connections for shared topics

This structure enables progressive filtering: searching all closets gives 60.9% recall, narrowing to wing+room jumps to 94.8%.

## Layered Context Loading

| Layer | Content | Size | When |
|-------|---------|------|------|
| L0 | Identity | ~50 tokens | Always |
| L1 | Critical facts | ~120 tokens | Always |
| L2 | Room recall | On demand | Topic-triggered |
| L3 | Deep search | On demand | Explicit queries |

This mirrors the [[context-engineering]] principle of progressive disclosure — start with a small stable context, expand on demand.

## Knowledge Graph

Temporal entity-relationship triples in SQLite. Supports historical queries, invalidation, and timeline views. Every relationship has `valid_from` / `ended` dates — natural implementation of [[decision-traces-compound]] half-life concept.

## Specialist Agents

Each agent gets its own wing + diary. Domain-specific memory without cross-contamination. The diary pattern (`mempalace_diary_write`) captures decision rationale — exactly what [[context-graphs-summary]] calls "decision traces."

## Evaluation: 96.6% on LongMemEval

Tested on 22,000+ memories. Key insight: structural filtering (wing → hall → room) is more important than embedding quality. Raw verbatim storage beats compressed formats (AAAK dialect scored only 84.2%).

## Integration

- **Claude Code plugin**: `claude plugin marketplace add milla-jovovich/mempalace`
- **MCP server**: 19 tools for automatic memory access
- **Python API**: `from mempalace.searcher import search_memories`
- **CLI**: `mempalace mine`, `mempalace search`, `mempalace wake-up`

## Connection to Our Stack

MemPalace solves the same problem as several tools in the [[codegraph-guide]] ecosystem:

| Our Tool | MemPalace Equivalent | Difference |
|----------|---------------------|------------|
| `session_search` | Wing diaries | MemPalace: structured spatial, ours: raw session logs |
| `kb_search` | Hall search | MemPalace: palace hierarchy, ours: flat vector search |
| `codegraph_query` | Knowledge graph | MemPalace: entity triples, ours: AST-based code graph |
| Claude auto-memory | L0/L1 layers | MemPalace: explicit mining, ours: implicit capture |

Not a replacement — a complementary architecture. Our tools focus on code intelligence and session history. MemPalace focuses on conversational memory and cross-project knowledge.

## Key Takeaways

1. **Structure beats embeddings** — spatial hierarchy (wing/room/hall) improves recall by 34% over flat vector search
2. **Verbatim > compression** — raw storage outperforms lossy encoding (96.6% vs 84.2%)
3. **Progressive loading** — L0→L3 layers prevent context pollution, same principle as [[context-engineering]]
4. **Temporal validity** — knowledge graph with `valid_from`/`ended` implements [[decision-traces-compound]] half-life naturally
5. **Local-first** — ChromaDB + SQLite, no cloud dependency, aligns with [[privacy-as-architecture]]

## Links

- [GitHub: milla-jovovich/mempalace](https://github.com/milla-jovovich/mempalace) — MIT, 27K+ stars
- [[context-graphs-summary]] — the theory behind agent trajectories
- [[decision-traces-compound]] — why capturing decision rationale compounds
- [[context-engineering]] — progressive disclosure and context budgeting
- [[rag-patterns]] — 7 RAG approaches, MemPalace adds spatial filtering as 8th pattern
- [[codegraph-guide]] — our complementary code intelligence layer
