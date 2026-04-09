---
type: concept
description: "The economic argument for context graphs: agent decision traces are a compounding asset. Each successful action recorded in the graph improves future ones th..."
title: "Decision traces compound — each agent action improves future ones"
created: 2026-04-07
tags: [context-graphs, compound-learning, flywheel, agents]
course_module: 5
course_order: 9
publish: true
source_path: "1-methodology/context-graphs.md"
---

The economic argument for context graphs: agent decision traces are a **compounding asset**. Each successful action recorded in the graph improves future ones through precedent retrieval.

Five value layers:
1. **Reduced compute waste** — reuse proven decision paths instead of reasoning from scratch
2. **Accelerated onboarding** — new agents bootstrapped from accumulated knowledge
3. **Compound learning** — every action enriches the graph, making next actions better
4. **Enterprise memory** — organization retains expertise even as individual agents/sessions end
5. **Network effects** — value grows exponentially with graph enrichment

This is the same pattern as wiki compounding (Karpathy): knowledge compiled once, kept current, not re-derived every query. But applied to *agent decisions* rather than *human knowledge*.

The decay problem: decisions have a half-life. A decision made 6 months ago may no longer be valid. Without a decay mechanism, the graph fills with stale precedents that misguide new agents. Need: timestamps, confidence scores, re-evaluation triggers.

"Whoever first captures decision traces in a high-value domain creates a compounding asset and moat." — Foundation Capital

- [[context-graphs-summary]] — origin: compound value thesis from context graphs
- [[antifragile-life-design]] — compound learning = antifragility: system gets stronger from use
- [[harness-engineering-summary]] — harness ratchet + decision compound = two flywheel mechanisms for solo dev
