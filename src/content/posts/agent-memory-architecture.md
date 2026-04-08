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

AI agents forget everything between sessions. Context windows are finite. RAG retrieves documents but doesn't capture decisions, preferences, or evolving relationships. This is the core problem of agent memory — and there are now several mature approaches to solving it.

This post synthesizes patterns from five systems I've built or studied: SuperDuper Multi-Agent System (my own v1, Aug 2025), SGR Agents spec, Moltis, OpenClaw Workspace Memory, and MemPalace. Each takes a different approach. Together they map the full design space.

---

## The Four Types of Memory

Every serious agent memory system converges on the same cognitive taxonomy. The naming varies, but the functions are consistent:

### 1. Working Memory (short-term)

The agent's scratchpad during a task. Messages, intermediate results, current plan. Cleared or archived when the task completes.

- **SuperDuper v2**: Kernel maintains task context (current step, accumulated artifacts, plan graph). Stored temporarily in Kernel structure, mirrored to Event Log for audit.
- **SGR v1**: NextStep schema itself — `reasoning` + `planning` fields are the working memory, visible on every step.
- **MemPalace**: L0 + L1 layers (~170 tokens always loaded). Identity + critical facts.
- **Moltis**: Current session transcript, auto-exported to `memory/sessions/` on close.

**Key insight**: Working memory should be *structured*, not a raw conversation log. The SGR approach (reasoning/planning/function as explicit JSON fields) makes the agent's thought process inspectable and debuggable.

### 2. Semantic Memory (long-term facts)

Durable knowledge about the world, the user, the domain. Timeless or slowly changing. Retrieved by similarity or entity.

- **SuperDuper v2**: `memory_records` table with `type=semantic`, vector embeddings via pgvector, HNSW indexing. Examples: "Company founded in 2020", "Hero X is brother of Hero Y".
- **SGR v1**: Dict-based, no external DB. `memory["semantic"] = { ... }` loaded into system prompt at init. Concise representation is key — summarize, don't dump.
- **OpenClaw**: `bank/world.md` for objective facts, `bank/entities/*.md` for entity pages. Markdown source of truth + derived SQLite/FTS5 index.
- **MemPalace**: `hall_facts` corridor within each wing. Verbatim storage (96.6% recall) beats compression (84.2%).
- **Moltis**: Hybrid search (vector + FTS5 keyword), with optional LLM reranking (70% LLM score + 30% original).

**Key insight**: Structure beats embeddings for retrieval. MemPalace showed that spatial hierarchy (wing → room → hall) improves recall by 34% over flat vector search. But for getting started, a simple dict in the system prompt works (SGR v1 approach).

### 3. Episodic Memory (experience log)

What happened, when, in what order. Decision history, interaction logs, past results. Time-bound and growing.

- **SuperDuper v2**: Event Log — every agent action, tool call, user message, error as an Event with timestamp, type, agent name, payload. Episodic memories are MemoryRecords with `type=episodic`. Answers: "What did we do last time for a similar request?"
- **OpenClaw**: Daily logs (`memory/YYYY-MM-DD.md`) + `bank/experience.md` curated by reflection. The `## Retain` section extracts 2-5 narrative, self-contained facts from each day.
- **MemPalace**: `hall_events` + `hall_discoveries` corridors. Specialist agent diaries capture domain-specific history.
- **Solograph**: `session_search` — raw Claude Code session history as searchable episodes.

**Key insight**: Episodic ≠ semantic. Episodic is time-ordered (event sequence), semantic is timeless (generalized fact). The OpenClaw `## Retain` pattern is elegant: extract narrative facts from the raw log, tag with type + entities + confidence.

### 4. Procedural Memory (how-to)

Methods, templates, algorithms, workflows. "How to do X" rather than "what is X".

- **SuperDuper v2**: YAML workflow templates (`workflows/*.yaml`) — predefined agent sequences for video trailers, marketing campaigns, etc. Kernel uses them as default plans.
- **SGR v1**: `memory["procedural"]` — story structure templates (3-act method), writing instructions. Loaded as recommendations in system prompt.
- **OpenClaw**: Implicitly in `memory.md` and agent prompts.
- **MemPalace**: `hall_advice` corridor — accumulated recommendations and patterns.

**Key insight**: Procedural memory is often the most undervalued. A well-defined workflow template can 10x consistency. SuperDuper's YAML workflows are essentially codified procedural memory — the agent doesn't have to figure out the sequence, it follows a proven template.

---

## Three Operational Loops

### Capture → Retrieve → Apply (Context Graphs pattern)

From Foundation Capital's context graphs thesis:

1. **Capture** — record agent decisions into a graph (what + why)
2. **Retrieve** — before new task, search for similar precedents  
3. **Apply** — adapt found patterns to current situation

Each successful action improves future ones → compound learning flywheel.

### Retain → Recall → Reflect (OpenClaw/Hindsight pattern)

Blending Letta/MemGPT control loop with Hindsight memory substrate:

1. **Retain** — normalize raw logs into narrative, self-contained facts with type tags (`W` world, `B` experience, `O` opinion) and entity mentions (`@Peter`, `@ProjectX`)
2. **Recall** — queries over derived index: lexical (FTS5), entity-centric, temporal, opinion-with-confidence
3. **Reflect** — scheduled job that updates entity pages, adjusts opinion confidence based on reinforcement/contradiction, proposes edits to core memory

Opinion evolution: each belief has statement + confidence `c ∈ [0,1]` + evidence links. New facts update confidence by small deltas; big jumps require strong repeated contradiction.

### Understand → Recall → Examine → Backtrack (SuperDuper Reasoning Tools)

SuperDuper v2's four-step reasoning loop:

1. **Understand Question** — parse intent, entities, constraints → structured task object
2. **Recall Related** — vector search over semantic memory + episode selection
3. **Examine Answer** — quality check by Kernel or Critic agent
4. **Backtrack & Refinement** — if quality fails, roll back to specific graph node and retry with different parameters

This is memory-augmented reasoning, not just storage.

---

## Forgetting: The Half-Life Problem

Not all memories should persist forever. Decisions have an expiry date — policies change, teams change, context shifts.

### Approaches to Forgetting

| System | Mechanism |
|--------|-----------|
| **MemPalace** | Knowledge graph with `valid_from` / `ended` dates. `kg.invalidate()` marks facts as expired |
| **OpenClaw** | Opinion confidence decay. Contradicting evidence reduces `c` score. Reflect job proposes removal |
| **SuperDuper v2** | Event-driven: Kernel monitors agent errors and adjusts policy. If an agent consistently fails, Kernel deprioritizes it |
| **Moltis** | Session auto-cleanup by age/count limits. Embedding cache LRU eviction |
| **Context Graphs** | Half-life concept: agents need to know which precedents are *still relevant*, not just which *exist* |

**Key insight**: Active forgetting > passive accumulation. Without decay, memory becomes noise. The simplest implementation: `valid_from`/`ended` timestamps on every fact, with periodic cleanup.

---

## Progressive Context Loading

All systems converge on the same pattern: don't load everything, load progressively.

| Layer | What | When | Size |
|-------|------|------|------|
| L0 | Identity / role | Always | ~50 tokens |
| L1 | Core facts / preferences | Always | ~100-200 tokens |
| L2 | Topic-relevant facts | On demand | Variable |
| L3 | Deep search results | Explicit query | Variable |

- **MemPalace**: Explicit L0-L3 layers
- **SGR v1**: Dict memory loaded into system prompt (L1), retrieval via tools later (L2-L3)
- **SuperDuper v2**: Kernel provides relevant facts to agent's system prompt (L1), agent queries MemorySpace for more (L2-L3)
- **OpenClaw**: `memory.md` as always-loaded core (L1), derived index for recall (L2-L3)
- **Moltis**: File watching + auto-sync as L1, hybrid search as L2-L3

This is context engineering in practice — treating the context window as a memory budget.

---

## Storage Architecture Comparison

| System | Storage | Search | Embeddings | Scale |
|--------|---------|--------|------------|-------|
| **SGR v1** | Python dict (in-memory) | None | None | <100 facts |
| **Moltis** | SQLite + FTS5 | Hybrid (vector + keyword) + LLM reranking | Local GGUF / OpenAI / Ollama | <5K chunks |
| **OpenClaw** | Markdown + SQLite index | FTS5 + optional embeddings | Optional | <10K facts |
| **MemPalace** | ChromaDB + SQLite KG | Spatial filtering + vector | Local | 22K+ memories |
| **SuperDuper v2** | PostgreSQL + pgvector | Vector (HNSW) + Event Log | pgvector | Unlimited |
| **Solograph** | FalkorDB + MLX | Graph queries + vector | multilingual-e5-small | Multi-project |

---

## Practical Recommendations

### Starting Simple (SGR v1 approach)
If you're building your first agent, start with dict-based memory in the system prompt. No database, no embeddings. Three categories: semantic, procedural, rules. Load at init, don't mutate during session. This alone gets you surprisingly far.

### Adding Persistence (Moltis/OpenClaw approach)
When you need cross-session recall: Markdown files as source of truth + SQLite/FTS5 derived index. Rebuild index from Markdown anytime. Add vector search when FTS5 isn't enough. Keep the `## Retain` discipline for extracting structured facts from raw logs.

### Scaling Up (SuperDuper/MemPalace approach)
For multi-agent systems with rich history: PostgreSQL + pgvector or ChromaDB with spatial hierarchy. Knowledge graph for entity relationships. Event log for full audit trail. Progressive context loading (L0-L3). Active forgetting with temporal validity.

### The Compound Learning Goal
The ultimate goal isn't just remembering — it's compounding. Every decision trace should make the next decision better. This requires:
- Capturing *why*, not just *what*
- Precedent retrieval before new tasks
- Active decay of stale knowledge
- Structured reflection (not just accumulation)

---

*Synthesized from: SuperDuper Multi-Agent PRD v2 (Aug 2025), SGR Agents Spec v1 (Sep 2025), OpenClaw Workspace Memory Research (Feb 2026), Moltis Memory System (Mar 2026), MemPalace (Apr 2026), Foundation Capital Context Graphs thesis (Jan 2026).*
