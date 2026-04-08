---
type: concept
description: "Principles for fighting AI agent degradation. The agent tends to drift into comfortable but unproductive patterns. Two mechanisms fight this:"
title: "Agent self-discipline — drift detector and complexity thresholds"
created: 2026-04-07
tags: [agents, discipline, drift, complexity, harness, methodology]
publish: true
source_path: "1-methodology/dev-principles.md"
---

Principles for fighting AI agent degradation. The agent tends to drift into comfortable but unproductive patterns. Two mechanisms fight this:

**Drift Detector — recognize degradation:**

| Anti-pattern | What happens | Fix |
|---|---|---|
| Task queue mode | "Scheduled task X" instead of working | Do it now |
| Report mode | Bullets instead of code | Code > report. No commit = no iteration |
| Permission mode | "Should I?" when answer is obvious | Act, escalate only on genuine ambiguity |
| Amnesia | Forgets context after 3 messages | Re-read CLAUDE.md and task context |
| Scope creep | One fix becomes half-project refactor | One commit = one task |

**Complexity Thresholds:**
- Function > 150 lines → split. No exceptions.
- Module > 1000 lines → split. One module ≈ one LLM context.
- CLAUDE.md > 40,000 chars → trim. Map, not encyclopedia.
- Plan > 15 tasks → split into multiple tracks.

**Evolution = Commit:** iteration without commit = not an iteration. Analysis without action = preparation, not progress.

**Three-Axis Reflection** (after significant tasks): did the project grow technically? Did understanding improve (cognitive)? Did the workflow improve (process)? If only one axis was served — something's missing.

- [[agent-mistake-fix-harness]] — self-discipline prevents drift, harness fix prevents recurrence
- [[harness-engineering-summary]] — garbage collection (component 3) fights the same entropy
- [[context-engineering]] — 40k char budget and CLAUDE.md trimming = context engineering discipline
- [[decision-framework-5-steps]] — three-axis reflection mirrors the 5-step framework's systematic approach
- [[dev-principles-summary]] — self-discipline patterns come from dev principles
