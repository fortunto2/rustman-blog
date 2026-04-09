---
type: concept
title: "Agent patterns from practice — skills vs MCPs, dream mode, self-evolution, teaching→skill"
description: "4 actionable patterns: skills lazy-load vs MCPs eager-load context, autonomous memory consolidation, fixed/mutable partitioning for self-evolution, interactive teaching to skill extraction."
created: 2026-04-09
tags: [agents, skills, memory, context-engineering, methodology]
course_module: 5
course_order: 16
publish: true
source_url: "https://youtu.be/nUT1YRvjG98"
---

# Agent Patterns from Practice

4 actionable patterns from [community stream #2](https://youtu.be/nUT1YRvjG98) (NeuraLab, 2.5h, Apr 2026). Only ideas we didn't already have in the wiki.

---

## 1. Skills are Lazy, MCPs are Eager

**The finding:** Claude Code skills load only their 124-char description into context. The full SKILL.md body loads on-demand when activated. You can attach 150 skills with zero context bloat.

MCPs are the opposite — all tool descriptions load into context upfront. 10 MCP servers = thousands of tokens eaten before you ask anything.

**Implication for us:** this is why [[project-solo-factory|solo-factory]] (30 skills) doesn't bloat context but adding multiple MCP servers does. When designing new capabilities: prefer skills over MCP tools when possible. Use MCP only when you need live data access (search, graph queries).

**Rule of thumb:** static knowledge → skill. Dynamic data → MCP tool.

## 2. Dream Mode: Autonomous Memory Consolidation

**The pattern:** an agent periodically reviews its own memories — merging related entries, garbage-collecting stale ones, updating confidence scores — without human intervention. Like a sleep cycle.

Currently we have manual: `make wiki-lint`, `make compact`, `wiki-graph`. Dream mode would automate this: a scheduled agent that reads memory, finds contradictions, prunes outdated entries, consolidates duplicates.

**Connection to our stack:** [[agent-memory-architecture]] describes the Retain→Recall→Reflect loop. Dream mode is **Reflect running autonomously on a schedule** — not triggered by a query, but by time. Could be an end-of-day agent (Hashimoto step 3 from [[harness-engineering-summary|harness engineering]]).

**Implementation sketch:** cron → agent reads `wiki/index.md` + recent git log → finds stale pages (no updates in 30+ days, contradicted by newer content) → proposes edits or archives.

## 3. Self-Evolution: Fixed/Mutable Partition

**The pattern:** for self-improving agent systems, explicitly split into:
- **Fixed** — pipeline structure, skeleton, evaluation criteria
- **Mutable** — prompts, schemas, tool configs

Three rules:
1. Agent may only change designated mutable parts per cycle
2. **One change per iteration** — otherwise you can't attribute score changes
3. Dump all intermediate states as text files (not dashboards) so the agent can grep them

Reference: Karpathy's autoresearch project uses this exact pattern.

**Connection to our stack:** [[agent-mistake-fix-harness|harness ratcheting]] is already half of this — we fix the harness after mistakes. What's missing: the explicit mutable/fixed boundary and the one-change-per-cycle discipline. solo-factory skills are mutable; the pipeline structure (Analysis→Dev→Promotion) is fixed.

## 4. Interactive Teaching → Skill Extraction

**The protocol:**
1. Open frontier model (Opus, GPT-5) in coding agent
2. Teach your task interactively — 40 min session
3. Let it fail, guide corrections, until it succeeds
4. Say: "now write a skill for this"
5. Agent packages session learnings into SKILL.md + scripts in references/

**Why this matters:** non-technical domain experts can create skills without knowing SKILL.md format. The frontier model acts as both student and skill-compiler.

**Connection to our stack:** our [[project-solo-factory|solo-factory]] `/skill-audit` validates the output. The teaching→extraction→audit pipeline: teach → extract → audit → ship.

---

*Source: [Community Stream #2](https://youtu.be/nUT1YRvjG98) — NeuraLab, neuraldeep, nobilix, superbereza, ai_grably, aostrikov. Apr 2026.*
