---
type: concept
title: "Which Claude model to use: what Anthropic's 9 November guide changes for Claude Code subagents"
description: "Anthropic's model-choice guide of 9 November 2026 says to start on Opus 5.5 at medium, change effort before changing models, and keep subagents on Haiku 5.5; read against a real Claude Code setup it makes one override obsolete and one built-in subagent more expensive than it looks."
created: 2026-11-10
tags: [claude-code, models, effort, cost, subagents, routing, haiku, fable]
publish: true
source_url: "https://claude.dev/blog/which-claude-model-should-you-build-with/"
learned_from: "https://claude.dev/blog/which-claude-model-should-you-build-with/ ; https://cellcog.ai/blog/which-claude-model-to-use/ (secondary summary, used for the author and date)"
index_line: "Anthropic guide 9 Nov 2026 (Addy Osmani, claude.dev; own benchmarks, unreproduced): start Opus 5.5 @medium; order when stuck = add self-check, +1 effort, next model at LOWER effort. Prices /M in/out: Haiku 5.5 $0.10/$0.50 (<=100K prompt, 5x above), Sonnet 5.5 $2/$10, Opus 5.5 $4/$20, Fable 5.2 $8/$40; cache read $0.20 Opus/Fable. SWE-bench Pro Opus 5.5: medium -2.5pt @70% cost, low -8pt @33%, xhigh +1.4pt @2.5x; low + rerun failures at high = 97% @ $0.17 vs 95.3% @ $0.29. Opus lead + 25 Sonnet workers -33% cost, same score. Cache belongs to the model: switch at a break. Built-in Explore now inherits the session model (define own Explore with model: haiku); haiku alias = 5.5 on Anthropic API only, needs CC 2.1.293+; opusplan puts edits on Sonnet, unmeasured"
---

# Which Claude model to use (guide of 9 November 2026)

## Definition

Anthropic's own answer to "which model for which task", published on claude.dev by
Addy Osmani. Four generally available models: Haiku 5.5, Sonnet 5.5, Opus 5.5 and
Fable 5.2 (Mythos 5.2 is verification-programme only). Every number below is from
Anthropic's runs, some on internal benchmarks, none reproduced outside (reported).
The guide itself says to test candidates on your own tasks.

## Rule

1. **Start on Opus 5.5 at its default effort, medium.** It is the Claude Code default and
   half the price of Fable 5.2.
2. **When a result is not good enough, three steps in this order:** make sure the model
   can verify its own work (test, build, script that hits the endpoint); raise effort one
   level; move up a model, at a *lower* effort than you used on the smaller one.
3. **Down to Sonnet 5.5** for scoped work (bug fix, spec-driven feature, repeated
   investigation or review). A clear spec does not guarantee Sonnet: a migration or a
   performance job can be specified and still need Opus.
4. **Down to Haiku 5.5** for classification, routing, extraction and subagents that
   search files, read logs or summarise.
5. **Up to Fable 5.2** for major refactors and migrations, architecture, leading many
   subagents, deep research, long unattended runs, or when Opus at `high` still falls
   short. Test Fable before raising Opus past `high`.
6. **Subagents on small models, edits on the main one.** Keep the expensive model's
   context for decisions. Small models only where a wrong answer is cheap to spot.
7. **Switch models at a natural break.** The prompt cache belongs to the model that wrote
   it, so the first turn on the new model pays the cache-write price for the whole
   conversation. Run `/compact` or start fresh with a written plan first.
8. **Keep a multi-model setup only if it beats every single-model point** on a
   score-versus-spend chart from your own tasks.

## Numbers

Prices per million tokens, Claude API list:

| | Haiku 5.5 | Sonnet 5.5 | Opus 5.5 | Fable 5.2 |
|---|---|---|---|---|
| Input / output | $0.10 / $0.50 (prompt <=100K); $0.50 / $2.50 above | $2 / $10 | $4 / $20 | $8 / $40 |
| Cache read | $0.01 / $0.05 | $0.10 | $0.20 | $0.20 |
| Default effort (API) | medium | high (medium in Claude Code) | medium | high (medium in Claude Code) |
| Fast mode | no | no | yes | yes |

All four have a 1M context window and 128K max output. Haiku 5.5 is the only model whose
price depends on prompt length; over 100K it is still a quarter of Sonnet's per-token
price, and under 100K its input is a twentieth of Sonnet's.

Effort on SWE-bench Pro, Opus 5.5, relative to `high`:

| Effort | Score | Cost |
|---|---|---|
| low | about -8 points | about 1/3 |
| medium | about -2.5 points | about 70% |
| xhigh | about +1.4 points | 2.5x |

Other Anthropic runs:

- Low effort for everything, re-run only failures at `high`: about 97% passed at about
  $0.17 a task, against 95.3% at $0.29 with all tasks at `high`. Needs an automatic check.
- Terminal-Bench 3.0: Fable 5.1 at `max` 58.0%, Opus 5.5 at `high` 58.9% with half the tokens.
- FrontierCode 2.0: Fable 5.2 at `high` 45.3% vs Opus 5.5 at `max` 45.5%, about half the
  cost per task.
- 20-problem search benchmark: two problems carried 43% of the spend. Price the hard
  tasks, not the typical ones.
- Opus 5.5 lead with up to 25 Sonnet 5.5 workers over about 22M tokens of source: about a
  third cheaper than Opus 5.5 alone, about the same score.
- Advisor tool, Opus 5.5 executor at `high` with a Fable 5.1 advisor: 90.1% at $2.92,
  +1.7 points for about 2.1x the money, at the edge of noise.
- Cache read at 150K context costs about $0.03 a turn on Opus 5.5, about $0.004 at 20K.

## Claude Code specifics that bite

- **Built-in Explore no longer always runs on Haiku.** In current versions it inherits the
  session model (capped at Opus on the API). To keep exploration cheap, define your own
  subagent named `Explore` with `model: haiku`.
- **`haiku` alias resolves to Haiku 5.5 on the Anthropic API only**, and needs Claude Code
  2.1.293 or later. On Bedrock, Google Cloud, Foundry and Claude Platform on AWS it still
  means Haiku 4.5. `ANTHROPIC_DEFAULT_HAIKU_MODEL` pins it.
- `model: haiku|sonnet` in a subagent definition, or `CLAUDE_CODE_SUBAGENT_MODEL` as the
  default for subagents that name no model.
- **`opusplan` puts code edits on Sonnet**, the reverse of rule 6. Measure before making
  it a default.
- A move down a tier drops the earlier thinking blocks (a model never reads blocks from a
  model above it); Fable 5.2 to any other model drops them too.
- Flagged cybersecurity requests can silently re-run on an older model (Opus 4.8,
  biology on Opus 5); the transcript says so.

## Exceptions

- Small models are weaker in long agentic loops; they fit high-volume work with checkable
  output. Computer use and vision-heavy loops start on Opus 5.5.
- For replies a person waits on, Sonnet 5.5 at `low` or `medium`.
- Effort adds latency and gives no knowledge the model lacks; for that, move up a model.
- Own API code: `tool_choice` `any`/`tool` returns 400 on Sonnet 5.5, Opus 5.5 and Fable
  5.2 (use `auto` with `strict: true` tools). Fable 5.2 returns 400 if anything before one
  of its thinking blocks changed, so history must be append-only. Haiku 4.5 to 5.5: replace
  `budget_tokens` with effort, drop non-default `temperature`/`top_p`/`top_k`, end
  `messages` on a user turn. Build requests for the strictest model and routing becomes
  config; let code, not a model, pick the model when the rule is simple.

## How it reads against our setup

- Delegation: this is [[lead-model-delegation-economics]] from the vendor side. Anthropic
  says the same thing about the boundary as [[cheap-model-delegation-boundary]]: cheap
  models read, the lead edits and judges. Only the Opus-lead-plus-Sonnet-workers figure is
  a cost number for delegation, and it is on a bulk-reading task.
- Effort: confirms [[claude-5-5-effort-and-cost]] (effort is the finer dial) and gives
  its missing curve. Our global `high` sits one step above Anthropic's start, justified
  only by the Stop-hook gate; `xhigh` buys 1.4 points for 2.5x.
- Haiku: the September note said "recheck when Haiku 5.5 ships". It shipped. The
  override `ANTHROPIC_DEFAULT_HAIKU_MODEL=claude-sonnet-5-5` costs 20x Haiku's input
  price for every lookup subagent that names `haiku`.
- Verification before escalation (rule 2, first step) is the sensor argument of
  [[harness-cost-by-model-tier]].

## Learned from

Read 10 Nov 2026 after a Telegram digest item. Primary page fetched in full; the date and
author came from a secondary summary (the page shows neither).
