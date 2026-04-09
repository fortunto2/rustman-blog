---
type: concept
description: "One of three harness engineering components. The idea: agent context is not chat history — it's a continuously improved knowledge base in the repository."
title: "Context engineering — context as code"
created: 2026-04-07
tags: [context, agents, claude-md, progressive-disclosure, harness]
publish: true
source_path: "1-methodology/harness-engineering.md"
---

One of three harness engineering components. The idea: agent context is not chat history — it's a **continuously improved knowledge base in the repository**.

Architecture:
```
CLAUDE.md           ← table of contents (~100 lines, links deeper)
ARCHITECTURE.md     ← domain and layer map
docs/
├── design-docs/    ← design decisions (with verification status)
├── exec-plans/     ← active and completed plans
├── product-specs/
├── references/     ← llms.txt for dependencies
└── QUALITY_SCORE.md
```

Key OpenAI insight: **one big CLAUDE.md is an anti-pattern.** Pollutes context, rots instantly, impossible to validate mechanically. Instead: table of contents with links to deeper docs. Progressive disclosure — agent starts with a small stable entry point and knows where to look next.

Dynamic context goes beyond docs: observability (logs, metrics, traces), browser via Chrome DevTools Protocol, screenshots, DOM snapshots. The agent can literally see what the user sees.

Tools for legibility (OpenAI): app per worktree (isolated instance per change), local observability stack (ephemeral per worktree), custom linters with remediation instructions, Ralph Wiggum Loop (agent reviews its own changes).

- [[harness-engineering-summary]] — origin: component 1 of three
- [[agent-mistake-fix-harness]] — context engineering is the lightweight fix mechanism (vs linters/tests)
- [[solo-methodology]] — CLAUDE.md structure directly implements this pattern
- [[token-efficient-web-requests]] — context engineering for external data: Accept header, html2text, truncation
