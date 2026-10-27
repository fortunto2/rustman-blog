---
type: concept
title: "Delegation economics: the lead model's habits cost more than its price per token"
description: "Cognition ran 3,000 coding sessions in which Fable 5 with a cheap sidekick cost less than Opus 4.8 with the same sidekick while scoring higher, because Fable delegated early with spec-quality briefs; Factory adds that switching models mid-session throws away the prompt cache, so routing has to live in the harness."
created: 2026-10-27
tags: [agents, delegation, subagents, cost, routing, prompt-caching, cheap-models]
course_module: 5
course_order: 11
publish: true
source_url: "https://cognition.com/blog/making-fable-cheaper-than-opus"
learned_from: "https://cognition.com/blog/making-fable-cheaper-than-opus ; https://factory.com/news/model-routing-belongs-in-the-harness"
index_line: "Cognition (13 Jul 2026, own FrontierCode 1.1, 3,000 sessions): Fable 5 is 2x Opus 4.8 per token, yet Fable+sidekick $1.86/60.7 vs Opus+sidekick $2.04/54.6; pure Fable $4.03/60.8, so sidekick -54% at same score. Fable lead 11.5 turns vs 26.5, 545k vs 1,679k input, no code edit in 81% of runs (Opus 24%). Both ~3 handoffs/run: the difference is WHEN (early) and WHAT (constraints, edge cases, done). Forcing delegation lowers quality; no gain on short or serial-debugging tasks. Factory (24 Aug 2026, own router): cache-aware routing -58% aggregate, median session -76%; cache-blind switching 2.12-2.37x all-frontier by turn 61+; reviewer from another model family. Refines Portal's 'cannot delegate editing' and Anthropic's 'no subagents'"
index_section: "concept"
---

# Delegation economics

## Definition

A frontier lead owns the session (plans, reviews, commits) and hands work to a cheaper
sidekick subagent through a plain-language brief. Cognition calls this Fusion.

## Numbers (reported by the vendors, on their own benchmark and product)

Cognition, 3,000 sessions on FrontierCode 1.1:

| Config | Score | Cost per run | Lead turns | Lead input |
|---|---|---|---|---|
| Fable 5 (low) + sidekick | 60.7 | $1.86 | 11.5 | 545k |
| Opus 4.8 (medium) + sidekick | 54.6 | $2.04 | 26.5 | 1,679k |
| Fable 5 (low) alone | 60.8 | $4.03 | | |
| Opus 4.8 (medium) alone | 55.4 | $3.06 | | |

Fable costs twice as much per token and still came out cheaper. In 81% of Fable-led runs
the lead never edited code (Opus: 24%), and in 13% it never read a repo file.

## The finding is management style, not delegation count

Both leads handed off about 3 times per run. Fable delegated early, sometimes as its
first action, with a brief that read like a design doc. Opus explored and built for 20
to 45 turns and handed off only the mechanical tail. On one task the spec required a
hash that is O(1) in pointer length. Opus coded it itself, lost the constraint and
shipped linear time, scoring 25. Fable's brief said "operator() must be O(1) in pointer
length: NO full token scan", and the sidekick scored 94. After a handoff, Opus pulled
the sidekick's files back into its own context 2x as often and made 4x as many
corrective edits at lead prices. Forcing Opus to delegate more made it worse: knowing
what is safe to hand off is a judgment of its own.

## What Factory adds: the cache

Providers cache the processed prefix per model, and reads from that cache cost about a
tenth of fresh input. Moving the session to another model reprocesses the whole history
at fresh rates. In Factory's data, cache-blind switching reached 2.12x the all-frontier
cost at turns 61-150 and 2.37x at turns 151-200; cache-aware routing stayed at 0.19x to
0.28x. Over two months of production, routing cut aggregate cost 58%, the median
session 76%, and median turn latency from 81 s to 49 s. "Staying put is itself a routing
decision." A subagent with a short spec sidesteps the cache problem: the parent stays
warm. Factory's default reviewer comes from a different model family than the
implementer.

## Rule

- Delegate implementation, keep judgment. The brief lists constraints, edge cases and a
  definition of done; review the diff and re-delegate a fix instead of rewriting at lead
  prices.
- Delegate early or not at all. A late handoff of the tail saves little.
- Never switch the main session's model mid-task to save money. Spawn a worker with a
  spec instead.
- Choose the lead by turns and context per task, not by price per token.

## How it changes two pages here

[[cheap-model-delegation-boundary]] says editing cannot be delegated. That holds when the
worker returns a *summary*, which carries no line numbers. Cognition's sidekick reads and
edits the files itself and the lead reviews a diff, and the score held. So the boundary
is the summary, not the edit. Reasoning stays with the lead: serial debugging gained
nothing, which matches Portal's missed thread-safety bug.

[[commerce-agent-blueprint]] says to use no subagents, because every handoff is
state-lossy. For a conversational flow, where the state *is* the product, that stands.
For coding work with a delegable chunk, a brief that carries the constraints makes the
loss cheap: use a sidekick there.

## Exceptions

- Short tasks and serial debugging: nothing to hand off, so no saving.
- FrontierCode is Cognition's own benchmark and Factory Router is Factory's product. None
  of this has been reproduced independently.
- Lead behaviour is a property of a model release and can change with the next one.

## Learned from

Joon Hee Lee, "Making Fable Cheaper Than Opus", Cognition, 13 July 2026. Abhay Singhal,
"Why model routing must be in the harness", Factory, 24 August 2026. Related:
[[claude-5-5-effort-and-cost]] (subagents moved to Sonnet 5.5),
[[harness-cost-by-model-tier]] (making the cheap worker reliable), [[needle-tiny-tool-model]].
