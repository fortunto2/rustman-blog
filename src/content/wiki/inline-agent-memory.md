---
type: concept
title: "Inline agent memory — grep-friendly comments as a 5th memory layer"
description: "AI agents heavily use grep, so persist notes inside the code itself with a discoverable prefix (AI-NOTE / AI-TODO / AI-ASK). A 5th memory location alongside CLAUDE.md, docs/, knowledge graphs, and session logs."
created: 2026-05-06
tags: [agents, memory, context-engineering, harness, code-comments, methodology]
course_module: 5
course_order: 8
publish: true
source_url: "https://t.me/llm_under_hood/590"
---

# Inline agent memory

CLAUDE.md, `docs/`, knowledge graphs and session logs all sit *outside* the code. But coding agents (Codex, Cursor, Claude Code) have one tool they reach for first on any non-trivial task: **grep**. So make the code itself grep-discoverable as a memory surface — leave persistent notes inline with a fixed prefix the agent learns to look for before touching a file.

This is the 5th memory location, complementary to the four types catalogued in [[agent-memory-architecture]]: it's *procedural* in form (how to handle this code) but lives where the agent actually reads.

## The protocol — three (four) prefixes

The minimum viable set: NOTE / TODO / ASK. Our convention adds PATTERN.

| Prefix | Purpose | Lifecycle |
|---|---|---|
| `AI-NOTE:` | Context the agent should know before changing this code: hidden constraint, subtle invariant, why-not-just-X explanation | Permanent until the constraint disappears |
| `AI-TODO:` | Task the agent leaves itself for a later session — used to split a large task into smaller ones it can tackle one at a time | Removed when done |
| `AI-ASK:` | Open question for the human. After the human answers, agent rewrites it as `AI-NOTE:` capturing the answer | Promoted to NOTE, never just deleted |
| `AI-PATTERN:` | Reusable shape worth remembering across this codebase | Permanent reference |

The harness rule that makes it work: **before modifying a file, search `grep -r "# AI-" <file>`**. One line, easy to enforce.

```js
// AI-NOTE: Complex OSC sequence parsing — core login overlay logic
// AI-ASK: What if sequences split across messages? Currently buffer holds them
socket.addEventListener('message', ev => {
  // ...
});
```

After the human answers the ASK, the agent itself converts it:

```js
// AI-NOTE: Sequences may split across WS messages; buffer accumulates until both markers present
```

## Why grep beats embeddings here

For a coding agent, "what do I need to know about this file" is an **exact, operational** query, not a conceptual one. Lexical scan of the file (or a directory) lands directly on the relevant prose. No index to maintain, no embedding store, no MCP server, no staleness — the comment moves with the code under refactor and is destroyed alongside the code it described. Same logic as [[agent-memory-architecture|lexical-first retrieval]]: don't reach for semantic magic when grep already answers the question.

The downside is real: comments rot like any other doc. But because they sit inches from the code they describe, the agent that's *editing the surrounding code* is the most likely entity to update them — so the rot pressure is lower than for a separate `NOTES.md`.

## Where it fits in the harness

Three roles in the broader harness:

1. **Memory layer** — captures what `CLAUDE.md` is too high-level to mention and what a knowledge graph is too far away to retrieve. The comment lives at the call site.
2. **Self-decomposition mechanism** — `AI-TODO` lets the agent split a task it can't finish in one pass. This is exactly the *one-change-per-cycle* discipline from [[agent-patterns-stream2|fixed/mutable partition]], but written into the code rather than a plan file.
3. **Question channel** — `AI-ASK → AI-NOTE` is a structured way for the agent to escalate without breaking flow. Connects to [[agent-self-discipline|drift detector]]: the agent that asks instead of guessing avoids "permission mode" while still flagging genuine ambiguity.

## Implementation — already in solo-factory

We already enforce this convention via `solo-factory/rules/ai-comments.md`:

```
- AI-NOTE:    important context for future AI sessions
- AI-TODO:    task for later implementation
- AI-ASK:     question needing human answer
- AI-PATTERN: common pattern worth documenting
Before modifying a file, search: grep -r "# AI-" <file>
Keep concise (one line). Remove AI-TODO after completing,
convert AI-ASK to AI-NOTE after answered.
```

The `llm_under_hood` post uses `AICODE-` instead of `AI-`. Functionally equivalent — the prefix only needs to be unique, short, and grep-clean. The original Telegram post argues for it standalone; our wiki ties it into the broader memory taxonomy.

## Connections

- [[agent-memory-architecture]] — extends the 4-type taxonomy: this is procedural memory persisted *at the call site* rather than in a separate store
- [[context-engineering]] — `CLAUDE.md` is the table of contents; inline comments are the footnotes pinned to the actual lines
- [[agent-mistake-fix-harness]] — when the agent misreads a piece of code, fix is often a one-line `AI-NOTE:` rather than a CLAUDE.md addition. Locality wins
- [[agent-self-discipline]] — `AI-TODO` enforces one-commit-one-task by externalising the next step instead of carrying it in working memory
- [[agent-patterns-stream2]] — same spirit as Teaching → Skill extraction: capture the agent's learning *outside* the model, into the artefact
- [[writing-claude-md]] — complementary: `CLAUDE.md` documents the convention; the comments themselves carry the per-file knowledge

## Source

- [llm_under_hood, Apr 2026 — «Как добавить памяти AI+Code агентам?»](https://t.me/llm_under_hood/590) — original `AICODE-` proposal in the context of Codex working on a TS/Vue learning platform
