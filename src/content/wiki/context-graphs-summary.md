---
type: summary
description: "Context Graph — a graph capturing AI agent decision-making trajectories: not just what the agent did, but how and why. A system of record for decision-making."
title: "Context Graphs — agent trajectories and organizational memory"
created: 2026-04-07
tags: [context-graphs, agents, decision-traces, memory, knowledge-graph]
publish: true
source_path: "1-methodology/context-graphs.md"
---

## Key Takeaways

**Context Graph** — a graph capturing AI agent decision-making trajectories: not just *what* the agent did, but *how* and *why*. "A system of record for decisions, not just data." — Dharmesh Shah (HubSpot). Synthesized from Foundation Capital's thesis (Ashu Garg).

**Decision traces ≠ observability traces.** Observability = what happened (latency, errors, spans). Decision trace = why it happened (reasoning, alternatives, context at each decision point). Agents sit on a unique set of trajectories representing real decision-making — otherwise impossible to observe.

**Practical cycle: Capture → Retrieve → Apply.** Record agent decisions into a graph (what + why). Before new task, search for similar precedents. Adapt found patterns. Flywheel: each success improves future ones → compound learning.

**Half-life of decisions.** Decisions have expiry dates — policies change, teams change. Agents need to know which precedents are *still relevant*, not just which *exist*. Need decay and re-evaluation mechanism.

**Ontology debate:** emergent (let agents discover structure), prescriptive (Palantir's 3 layers), or hybrid (stable core entities + discovered relationships). Hybrid is pragmatic.

**Already implemented in solograph:** session_search (past Claude Code sessions = decision trajectories), codegraph_query (structural code memory), kb_search (decisions/patterns/precedents), source_search (external knowledge).

**What to strengthen:** decision logging (capture *why*), trajectory export, pattern mining across sessions, precedent retrieval before new tasks, decay mechanism for stale decisions.

## Connections

- [[harness-engineering-summary]] — harness constrains the agent, context graph helps choose best path within constraints
- [[context-engineering]] — context engineering builds the static knowledge base; context graphs capture the dynamic decision history
- [[solo-methodology]] — solograph already implements basic context graphs (sessions, code, KB)
