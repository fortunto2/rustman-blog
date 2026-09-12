---
type: concept
title: "Where cheap-model delegation stops — reading yes, editing and reasoning no"
description: "Spotify's Portal routes bulk file reads to Gemini Flash and reports a ~90% mean saving on those reads. The transferable part is the two boundaries it found: summaries lack the line numbers editing needs, and the worker missed a thread-safety bug a summary cannot surface."
created: 2026-09-08
tags: [agents, tokens, context-engineering, harness, delegation, cost]
publish: true
source_url: "https://engineering.atspotify.com/2026/9/portal-by-spotify-cut-my-claude-code-token-usage-by-90"
index_line: "Spotify Portal: PreToolUse hook blocks reads over 350 lines and shunts them to Gemini Flash, which returns a summary; a second mode writes boilerplate straight to disk. Reported ~90% MEAN BULK-READ saving — a per-read figure, not a session total. Two boundaries found by running it: cannot delegate editing (summaries carry no reliable line numbers) and cannot delegate reasoning (worker found surface patterns, missed a thread-safety bug). 10-30s per call makes small reads a net loss; debugging, architecture and safety-critical code excluded by policy"
index_section: "concept"
---

# Where cheap-model delegation stops

Spotify's Portal adds two "modes" around Claude Code: `bulk-reader` sends large files
to Gemini 2.5 Flash and returns a summary, and `code-writer` generates boilerplate
straight to disk without the expensive model seeing it. Reported result: a **mean
bulk-read saving of around 90%**, measured on a Java monorepo across four scenarios.

The number is the least useful part, and worth reading carefully: it is a *mean
saving per bulk read*, not a reduction in a session's total tokens. A tool that
routes 90% of the bytes of the reads it intercepts still spends whatever the
reasoning costs, and the article gives no before/after session totals. The headline
collapses a per-operation ratio into a total, which is the same shape as any other
[[harness-engineering-summary]] counter that does not say what it counted.

## The enforcement is a hook, not an instruction

What makes it work is that the agent is not asked to delegate. A `PreToolUse` hook
**blocks** any read over a configurable threshold (default 350 lines) and redirects it
to the worker model. That is [[agent-mistake-fix-harness]] applied to cost rather than
to correctness: an instruction to "use the cheap model for big files" is advice the
agent will drop under pressure, and a hook that refuses the read is not.

## The two boundaries are the finding

Both were discovered by running it, and both are stated as flat prohibitions:

- **You cannot delegate editing.** A summary does not carry reliable line numbers, and
  an edit needs them. The cheap model can tell you what a file does; it cannot tell you
  where to cut.
- **You cannot delegate reasoning.** The worker found surface-level patterns and missed
  a subtle thread-safety bug — the class of defect that is invisible in a summary
  precisely because a summary is a compression of what the code *says*, not of how it
  behaves under interleaving.

Debugging, architectural decisions and safety-critical code are excluded by policy on
top of that, which reads less like caution and more like the same two boundaries
restated for cases where being wrong is expensive.

## The floor nobody mentions in the headline

Each delegation costs 10–30 seconds, capped at 30. So the saving has a **floor**: below
some file size the round trip costs more wall-clock than the tokens are worth, and the
article says so — "counterproductive for small reads". Any threshold like the 350-line
default is a guess at where that crossover sits for one codebase, and it is the number
a reader should expect to have to re-measure rather than inherit.

## What it connects to here

[[needle-tiny-tool-model]] is the same boundary drawn from the other end: a 45M model
that does only tool calls and structured extraction, with a *calibrated confidence
head* deciding when to escalate. Portal decides by file size, which is a proxy;
Needle decides by the model's own estimate of whether it is out of its depth. The
second is the better shape, and the harder thing to build.

[[token-efficient-web-requests]] attacks the same cost from a different direction —
asking the *source* for less rather than compressing what came back. Content
negotiation has no summariser in the loop, so it has neither the latency floor nor the
lost-line-numbers problem. Where both apply, it is the cheaper one.
