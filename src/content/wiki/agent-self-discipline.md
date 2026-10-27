---
type: concept
description: "Principles for fighting AI agent degradation. The agent tends to drift into comfortable but unproductive patterns. Two mechanisms fight this:"
title: "Agent self-discipline — drift detector and complexity thresholds"
created: 2026-04-07
updated: 2026-10-27
tags: [agents, discipline, drift, complexity, harness, methodology]
course_module: 4
course_order: 6
publish: true
source_path: "1-methodology/dev-principles.md"
index_line: "Drift detector (5 anti-patterns), complexity thresholds (150/1000/40k/15), evolution = commit"
index_section: "concept"
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

## What others found since (Oct 2026)

- **The line limits now have a token price.** Giles Edwards-Alexander ([martinfowler.com](https://martinfowler.com/articles/exploring-gen-ai/refactoring-economic-benefit.html), Jul 2026) refactored a 17,155-line agent-written Rust data layer in 15 steps and had a fresh agent make the same change after each one. Input tokens per change fell 83%, from 159,564 to 27,360, once the largest file was down to 3,695 lines; total lines stayed around 16.5k and output tokens did not move (reported). Claude was poor at choosing the refactorings without a human.


## Connections

- [[agent-mistake-fix-harness]] — self-discipline prevents drift, harness fix prevents recurrence
- [[harness-engineering-summary]] — garbage collection (component 3) fights the same entropy
- [[context-engineering]] — 40k char budget and CLAUDE.md trimming = context engineering discipline
- [[decision-framework-5-steps]] — three-axis reflection mirrors the 5-step framework's systematic approach
- [[dev-principles-summary]] — self-discipline patterns come from dev principles
- [[claude-code-anatomy]] — 93% of permission prompts approved: deterministic safety gates do not solve the human discipline problem
