---
type: methodology
title: "Agent Memory Architecture — From Working Memory to Compound Learning"
description: "How to build memory for AI agents: 4 memory types, 3 operational loops, 5 systems compared. From dict-based v1 to spatial palaces and knowledge graphs."
created: 2026-04-09
tags: [agents, memory, architecture, methodology, rag, context-engineering]
publish: true
publish_as: post
source_path: "1-methodology/agent-memory-architecture.md"
---

# Agent Memory Architecture

AI agents forget everything between sessions. Context windows are finite. [[rag-patterns|RAG]] retrieves documents but doesn't capture decisions, preferences, or evolving relationships. This is the core problem of agent memory — and there are now several mature approaches to solving it.

This post synthesizes patterns from five memory-focused systems I've built or studied: [[schema-guided-reasoning|SGR Agents]] spec (the cognitive foundation), [Moltis](https://github.com/moltis-ai/moltis), [OpenClaw](https://github.com/openclaw/openclaw) Workspace Memory, [[mempalace-agent-memory|MemPalace]], and [[project-solograph|Solograph]]. Each takes a different approach. Together they map the full design space.

---

## The Four Types of Memory

Every serious agent memory system converges on the same cognitive taxonomy, mirroring how human cognition organizes knowledge ([Generative Agents, Stanford 2023](https://arxiv.org/abs/2304.03442)). The naming varies, but the functions are consistent:

### 1. Working Memory (short-term)

The agent's scratchpad during a task. Messages, intermediate results, current plan. Cleared or archived when the task completes.

- **[[schema-guided-reasoning|SGR]]**: The NextStep schema itself — `reasoning` + `planning` fields are the working memory, visible on every step. Structured JSON makes thought process inspectable.
- **[[mempalace-agent-memory|MemPalace]]**: L0 + L1 layers (~170 tokens always loaded). Identity + critical facts — the minimum context the agent always has.
- **Moltis**: Current session transcript, auto-exported to `memory/sessions/` on close.
- **[[project-solograph|Solograph]]**: Active Claude Code session context — task state, tool results, conversation. Becomes episodic memory when session ends.

**Key insight**: Working memory should be *structured*, not a raw conversation log. The [[schema-guided-reasoning|SGR]] approach (reasoning/planning/function as explicit JSON fields) makes the agent's thought process inspectable and debuggable. This aligns with [[harness-engineering-summary|harness engineering]] — agent logic should be transparent.

### 2. Semantic Memory (long-term facts)

Durable knowledge about the world, the user, the domain. Timeless or slowly changing. Retrieved by similarity or entity.

- **[[schema-guided-reasoning|SGR]]**: Dict-based, no external DB. `memory["semantic"] = { ... }` loaded into system prompt at init. Concise representation is key — summarize, don't dump.
- **OpenClaw**: `bank/world.md` for objective facts, `bank/entities/*.md` for entity pages. Markdown source of truth + derived SQLite/FTS5 index. Inspired by [Hindsight](https://arxiv.org/abs/2404.00498) and [MemGPT/Letta](https://arxiv.org/abs/2310.08560).
- **[[mempalace-agent-memory|MemPalace]]**: `hall_facts` corridor within each wing. Verbatim storage (96.6% on [LongMemEval](https://arxiv.org/abs/2410.10813)) beats compression (84.2%).
- **Moltis**: Hybrid search (vector + FTS5 keyword), with optional LLM reranking (70% LLM score + 30% original).
- **[[project-solograph|Solograph]]**: `kb_search` — knowledge base with MLX embeddings (multilingual-e5-small, RU+EN). Facts, principles, patterns stored as markdown files.

**Key insight**: Structure beats embeddings for retrieval. MemPalace showed that spatial hierarchy (wing → room → hall) improves recall by 34% over flat vector search. Solograph's graph layer adds relationship traversal on top. But for getting started, a simple dict in the system prompt works ([[schema-guided-reasoning|SGR v1]] approach).

### 3. Episodic Memory (experience log)

What happened, when, in what order. Decision history, interaction logs, past results. Time-bound and growing. This is what [[context-graphs-summary|context graphs]] call "decision traces."

- **OpenClaw**: Daily logs (`memory/YYYY-MM-DD.md`) + `bank/experience.md` curated by reflection. The `## Retain` section extracts 2-5 narrative, self-contained facts from each day, tagged with type (`W` world, `B` experience, `O` opinion) and entities (`@Peter`).
- **[[mempalace-agent-memory|MemPalace]]**: `hall_events` + `hall_discoveries` corridors. Specialist agent diaries capture domain-specific history.
- **[[project-solograph|Solograph]]**: `session_search` — every past Claude Code session is searchable. Each session = a [[decision-traces-compound|decision trajectory]]. "What did I do last time I set up auth?" returns the full trace with reasoning.
- **[Generative Agents](https://arxiv.org/abs/2304.03442)**: Memory stream — timestamped observations, with retrieval scored by recency × relevance × importance. The original "agents need episodic memory" paper.

**Key insight**: Episodic ≠ semantic. Episodic is time-ordered (event sequence), semantic is timeless (generalized fact). The OpenClaw `## Retain` pattern is elegant: extract narrative facts from the raw log, tag with type + entities + confidence. [[decision-traces-compound|Decision traces compound]] — each captured trajectory improves future retrieval.

### 4. Procedural Memory (how-to)

Methods, templates, algorithms, workflows. "How to do X" rather than "what is X".

- **[[schema-guided-reasoning|SGR]]**: `memory["procedural"]` — story structure templates (3-act method), writing instructions. Loaded as recommendations in system prompt.
- **[[mempalace-agent-memory|MemPalace]]**: `hall_advice` corridor — accumulated recommendations and patterns.
- **[[project-solograph|Solograph]]**: `codegraph_query` + `codegraph_explain` — AST-based code graph (tree-sitter) across all projects. Cypher queries on code structure reveal implementation patterns: "How is auth implemented?" returns structural patterns, not just files.
- **YAML workflow templates**: Predefined agent sequences (video trailers, marketing campaigns). Codified procedural memory — the agent follows a proven template instead of reasoning from scratch.

**Key insight**: Procedural memory is often the most undervalued. A well-defined workflow template can 10x consistency. [[cli-first-testing|CLI-first]] design makes procedural knowledge testable. [[dev-principles-summary|Schemas first, logic second]] applies here too — define the procedure schema before implementing.

---

## Three Operational Loops

### Capture → Retrieve → Apply ([[context-graphs-summary|Context Graphs]] pattern)

From Foundation Capital's [[context-graphs-summary|context graphs]] thesis:

1. **Capture** — record agent decisions into a graph (what + why)
2. **Retrieve** — before new task, search for similar precedents
3. **Apply** — adapt found patterns to current situation

Each successful action improves future ones → [[decision-traces-compound|compound learning]] flywheel. Already implemented in [[project-solograph|Solograph]]: `session_search` for precedent retrieval, `kb_search` for pattern matching, `codegraph_query` for structural precedents.

### Retain → Recall → Reflect (OpenClaw/[Hindsight](https://arxiv.org/abs/2404.00498) pattern)

Blending [Letta/MemGPT](https://arxiv.org/abs/2310.08560) control loop with [Hindsight](https://arxiv.org/abs/2404.00498) memory substrate:

1. **Retain** — normalize raw logs into narrative, self-contained facts with type tags (`W` world, `B` experience, `O` opinion) and entity mentions (`@Peter`, `@ProjectX`)
2. **Recall** — queries over derived index: lexical (FTS5), entity-centric, temporal, opinion-with-confidence
3. **Reflect** — scheduled job that updates entity pages, adjusts opinion confidence based on reinforcement/contradiction, proposes edits to core memory

Opinion evolution: each belief has statement + confidence `c ∈ [0,1]` + evidence links. New facts update confidence by small deltas; big jumps require strong repeated contradiction.

### Retrieve → Reflect → Plan ([Generative Agents](https://arxiv.org/abs/2304.03442) pattern)

Stanford's Generative Agents introduced the three-layer cognitive architecture:

1. **Retrieve** — score memories by recency × relevance × importance
2. **Reflect** — periodically synthesize observations into higher-level insights ("What are the top 3 things I've learned about X?")
3. **Plan** — create day/hour plans grounded in reflections and current goals

This is the most research-validated loop — the paper showed it produces believable long-term agent behavior across 25 interacting agents.

---

## Forgetting: The Half-Life Problem

Not all memories should persist forever. Decisions have an expiry date — policies change, teams change, context shifts. [[context-graphs-summary|Context graphs]] call this the "half-life of decisions."

### Approaches to Forgetting

| System | Mechanism |
|--------|-----------|
| **[[mempalace-agent-memory\|MemPalace]]** | Knowledge graph with `valid_from` / `ended` dates. `kg.invalidate()` marks facts as expired |
| **OpenClaw** | Opinion confidence decay. Contradicting evidence reduces `c` score. Reflect job proposes removal |
| **Moltis** | Session auto-cleanup by age/count limits. Embedding cache LRU eviction |
| **[Generative Agents](https://arxiv.org/abs/2304.03442)** | Recency score decays exponentially. Old memories naturally rank lower in retrieval |
| **[SuCo](https://arxiv.org/abs/2411.14754)** | Summarize-Condense-Distill: compress old memories into summaries, discard originals |

**Key insight**: Active forgetting > passive accumulation. Without decay, memory becomes noise. The simplest implementation: `valid_from`/`ended` timestamps on every fact, with periodic cleanup. [[agent-self-discipline|Agent self-discipline]] applies here — thresholds and limits prevent memory bloat.

---

## Progressive Context Loading

All systems converge on the same [[context-engineering|context engineering]] pattern: don't load everything, load progressively.

| Layer | What | When | Size |
|-------|------|------|------|
| L0 | Identity / role | Always | ~50 tokens |
| L1 | Core facts / preferences | Always | ~100-200 tokens |
| L2 | Topic-relevant facts | On demand | Variable |
| L3 | Deep search results | Explicit query | Variable |

- **[[mempalace-agent-memory|MemPalace]]**: Explicit L0-L3 layers
- **[[schema-guided-reasoning|SGR]]**: Dict memory loaded into system prompt (L1), retrieval via tools later (L2-L3)
- **OpenClaw**: `memory.md` as always-loaded core (L1), derived index for recall (L2-L3)
- **Moltis**: File watching + auto-sync as L1, hybrid search as L2-L3
- **[[project-solograph|Solograph]]**: CLAUDE.md as L0-L1 (table of contents, ~100 lines per [[harness-engineering-summary|harness engineering]]), `kb_search`/`session_search` as L2-L3

This is [[context-engineering|context engineering]] in practice — treating the context window as a memory budget. [[agent-mistake-fix-harness|Harness]] keeps L0-L1 stable and tested; L2-L3 are dynamic.

---

## Storage Architecture Comparison

| System | Storage | Search | Embeddings | Scale |
|--------|---------|--------|------------|-------|
| **[[schema-guided-reasoning\|SGR v1]]** | Python dict (in-memory) | None | None | <100 facts |
| **Moltis** | SQLite + FTS5 | Hybrid (vector + keyword) + LLM reranking | Local GGUF / OpenAI / Ollama | <5K chunks |
| **OpenClaw** | Markdown + SQLite index | FTS5 + optional embeddings | Optional | <10K facts |
| **[[mempalace-agent-memory\|MemPalace]]** | ChromaDB + SQLite KG | Spatial filtering + vector | Local | 22K+ memories |
| **[[project-solograph\|Solograph]]** | FalkorDB (graph) + SQLite (vector) + filesystem | Cypher graph queries + vector + session search | MLX multilingual-e5-small | Multi-project |

### [[project-solograph|Solograph]] as a Full Memory System

Solograph implements all four memory types on a unified graph + file foundation:

- **Working memory**: active session context — the current Claude Code conversation, task state, tool results
- **Semantic memory**: `kb_search` — knowledge base with vector embeddings (MLX, RU+EN). Markdown files indexed with embeddings. [[privacy-as-architecture|Local-first]] — no cloud dependency
- **Episodic memory**: `session_search` — every past session is a searchable [[decision-traces-compound|decision trajectory]]. "What did I do last time I set up auth?" returns the full trace
- **Procedural memory**: `codegraph_query` + `codegraph_explain` — AST-based code graph (tree-sitter) across all projects. Cypher queries on code structure reveal patterns, not just files
- **Long-term file storage**: markdown files in wiki/ and knowledge base. Git-backed, human-readable, versioned. No database lock-in — rebuild index from files anytime

The graph layer (FalkorDB) adds what flat vector search lacks: **relationship traversal**. `codegraph_shared` finds shared packages across projects. `source_related` finds related content by tag overlap. These are graph queries, not similarity search — the key difference from [[rag-patterns|standard RAG patterns]].

15 MCP tools provide the interface — agents call `session_search`, `kb_search`, `codegraph_query` naturally.

---

## Practical Recommendations

### Starting Simple ([[schema-guided-reasoning|SGR v1]] approach)
If you're building your first agent, start with dict-based memory in the system prompt. No database, no embeddings. Three categories: semantic, procedural, rules. Load at init, don't mutate during session. This alone gets you surprisingly far. [[dev-principles-summary|Schemas first]] — define the memory structure before adding persistence.

### Adding Persistence (Moltis/OpenClaw approach)
When you need cross-session recall: Markdown files as source of truth + SQLite/FTS5 derived index. Rebuild index from Markdown anytime. Add vector search when FTS5 isn't enough. Keep the `## Retain` discipline for extracting structured facts. [[privacy-as-architecture|Local-first, offline-first]].

### Scaling Up ([[mempalace-agent-memory|MemPalace]]/[[project-solograph|Solograph]] approach)
For multi-agent systems with rich history: ChromaDB or FalkorDB with spatial/graph hierarchy. Knowledge graph for entity relationships. Session search for full audit trail. Progressive [[context-engineering|context loading]] (L0-L3). Active forgetting with temporal validity. [[portfolio-approach|Small bets]] — try one memory type first, add others incrementally.

### The [[decision-traces-compound|Compound Learning]] Goal
The ultimate goal isn't just remembering — it's compounding. Every [[context-graphs-summary|decision trace]] should make the next decision better. This requires:
- Capturing *why*, not just *what*
- Precedent retrieval before new tasks
- Active decay of stale knowledge
- Structured reflection (not just accumulation)

---

## Research & References

### Papers

- **MemGPT / Letta** — [MemGPT: Towards LLMs as Operating Systems](https://arxiv.org/abs/2310.08560) (Oct 2023). The foundational paper on virtual context management — paging facts in/out of LLM context like an OS manages memory. Core → archival → recall architecture.
- **Generative Agents** — [Generative Agents: Interactive Simulacra of Human Behavior](https://arxiv.org/abs/2304.03442) (Apr 2023, Stanford). 25 agents with memory streams, reflection, and planning. Introduced retrieve-reflect-plan. The original "agents need memory" paper.
- **Hindsight** — [Hindsight: Posterization for LLM Conversations](https://arxiv.org/abs/2404.00498) (Apr 2024). Separating observed vs believed vs summarized. Confidence-bearing opinions that evolve with evidence.
- **LongMemEval** — [LongMemEval: Benchmarking Long-Term Memory](https://arxiv.org/abs/2410.10813) (Oct 2024). The benchmark MemPalace scored 96.6% on. Tests multi-session reasoning, temporal reasoning, knowledge updates.
- **SuCo** — [Summarize, Condense, and Distill](https://arxiv.org/abs/2411.14754) (Nov 2024). Memory compaction for long-running agents — the forgetting problem formalized.
- **RAISE** — [Retrieval-Augmented In-Context Learning](https://arxiv.org/abs/2401.02009) (Jan 2024). Entity-centric retrieval from semi-structured sources.
- **Cognitive Architectures for Language Agents** — [CoALA](https://arxiv.org/abs/2309.02427) (Sep 2023). Survey of memory, action, and decision-making in language agents. Proposes working/episodic/semantic/procedural taxonomy used in this post.

### Industry

- [Foundation Capital — Context Graphs](https://foundationcapital.com/context-graphs-ais-trillion-dollar-opportunity/) (Dec 2025) — "system of record for decisions" thesis
- [Anthropic — Effective Context Engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) — context window as working memory budget
- [Manus — Context Engineering Lessons](https://manus.im/blog/Context-Engineering-for-AI-Agents-Lessons-from-Building-Manus) — KV-cache locality, filesystem memory
- [OpenHands — Context Condensation](https://openhands.dev/blog/openhands-context-condensensation-for-more-efficient-ai-agents) — bounded conversation memory
- [Anthropic — Harness Design for Long-Running Apps](https://www.anthropic.com/engineering/harness-design-long-running-apps) — task state and evaluator design

### Tools & Systems

- [[mempalace-agent-memory|MemPalace]] — [GitHub](https://github.com/milla-jovovich/mempalace) — spatial memory, 96.6% LongMemEval, MIT (27K stars)
- [[project-solograph|Solograph]] — [GitHub](https://github.com/fortunto2/solograph) — graph + vector MCP server, 15 tools, FalkorDB + MLX
- [Moltis](https://github.com/moltis-ai/moltis) — Rust-based memory with hybrid search + LLM reranking
- [OpenClaw](https://github.com/openclaw/openclaw) — Markdown source-of-truth + derived index, Retain/Recall/Reflect
- [Letta](https://github.com/cpacker/MemGPT) — MemGPT implementation, core/archival/recall memory management
- [LangGraph](https://github.com/langchain-ai/langgraph) — graph-based agent execution framework

### Related Wiki Pages

- [[context-graphs-summary]] — agent trajectories and organizational memory
- [[decision-traces-compound]] — why capturing decision rationale compounds
- [[context-engineering]] — progressive disclosure and context budgeting
- [[rag-patterns]] — 7 RAG approaches, spatial filtering as additional pattern
- [[harness-engineering-summary]] — agent mistake → fix the harness
- [[agent-mistake-fix-harness]] — the core harness loop
- [[agent-self-discipline]] — drift detection and complexity thresholds
- [[schema-guided-reasoning]] — schemas first, logic second
- [[sgr-deep-dive]] — complete SGR guide with code examples
- [[privacy-as-architecture]] — local-first memory design
- [[codegraph-guide]] — Solograph's code intelligence layer

---

*Synthesized from: SGR Agents Spec v1 (Sep 2025), OpenClaw Workspace Memory Research (Feb 2026), Moltis Memory System (Mar 2026), MemPalace (Apr 2026), Solograph (ongoing), Foundation Capital Context Graphs (Jan 2026), and 7 research papers.*
