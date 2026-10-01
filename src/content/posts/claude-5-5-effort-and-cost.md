---
type: concept
title: "What I changed in my Claude Code setup after the Opus 5.5 and Sonnet 5.5 posts"
description: "Anthropic's September 2026 claude.dev posts on effort, cost and evals, read against a real setup: effort dropped from xhigh to high, always-loaded rules cut from 37.7 KB to 16 KB, subagents moved to Sonnet 5.5."
created: 2026-09-30
tags: [claude-code, effort, cost, context-engineering, harness, evals]
publish: true
publish_as: post
index_line: "Opus/Sonnet 5.5 field notes: effort is a verification dial, every CLAUDE.md line is resent per turn, rules 37.7→16 KB, build-eval/hillclimb"
index_section: "concept"
---

# What I changed in my Claude Code setup after the Opus 5.5 and Sonnet 5.5 posts

In the last week of September 2026 Anthropic put six posts on [claude.dev](https://claude.dev/). They cover Sonnet 5.5, what a task costs on Opus 5.5, how to pick an effort level, and eval hillclimbing. I read them with my own `settings.json` open, and three settings turned out to be stale. Below are the changes I made, with numbers.

## Effort is a verification dial, not an intelligence dial

[Spending your effort](https://claude.dev/blog/spending-your-effort/) gives the clearest description of effort I've seen. Higher effort doesn't make the model smarter. It makes the model check more. On Terminal-Bench 3.0, an HTML sanitizer task went from 1/5 at low to 5/5 at xhigh. The low runs wrote the filter in one pass and tested it on a single page. The high run reviewed its own draft adversarially, read the parser's source, ran an XSS suite, and finished by writing a fuzzer. Effort reduced the failures caused by missed edge cases. It did nothing for failures caused by a wrong approach.

I had `effortLevel: "xhigh"` as my global default since the Opus 5 days. Two facts made that wrong:

- On Opus 5.5 the default is **medium**, and at a given level 5.5 thinks *more* than Opus 5 did, most of all at xhigh. So a level carried over from the old model doesn't mean the same thing.
- On a subscription or an API key, changing effort mid-session **no longer breaks the prompt cache**. So you can switch to `/effort high` for one hard step without paying for it, and the case for a high global default is weaker.

I went to `high` rather than their recommended medium. Most of my sessions end at a verification gate (a Stop hook that runs lint, types and tests, see [[harness-engineering-summary]]). The post itself puts "verification is important" at high. For sketches I drop to `/effort low`. The loop they describe matches mine: interview me for the spec, implement on low, review, verify on high.

Their back-of-envelope rule is worth keeping. High adds roughly 20K thinking tokens to a task, about $0.40 on Opus 5.5, which is what a ten-turn retry costs. So high pays off when it saves one retry and is wasted when medium would have finished anyway.

## Every line of CLAUDE.md is resent on every turn

[What a task costs](https://claude.dev/blog/what-a-task-costs-on-opus-5-5/) works through the arithmetic. Take a 40-turn task whose context grows from 20K to 120K tokens. It processes about 2.8M input tokens even though the conversation never got past 120K. Cache reads make that cheap ($1.62 at a 90% hit rate, $11.20 at 0%), but cheap isn't free, and always-loaded context is part of the prefix on every request. Their guidance is to keep CLAUDE.md under 200 lines.

I measured mine with `make rules-budget`. User rules came to **37,766 bytes, about 9.4K tokens**, loaded in every session of every project. A single file was 76% of that: the sensor contract for my verification harness. Most of the file was narrative. It recorded how each rule was discovered, a retracted finding kept as a case study, and the mutation-testing story. All of that is valuable to read once and costs tokens every time it's resent.

The fix was a split. The contract stays in `rules/`: placements, the published-promises table that tests pin, verdicts, exit codes, bypasses. The reasoning moved to `docs/harness-sensors.md`, which isn't loaded. The file went from 472 lines to 100, and the always-loaded total went from 37.7 KB to **16.0 KB**. All 24 tests that pin the contract still pass, including the one that checks the exit-code line names every verdict. That test is why the split had to keep certain sentences verbatim.

The general lesson is the one I keep relearning from [[context-engineering]]: a rules file should state rules. The story of how you arrived at a rule belongs in a doc the agent can open when it needs the reason.

## Stop rules beat "don't stop" rules

[Getting the most out of Opus 5.5](https://claude.dev/blog/getting-the-most-out-of-opus-5-5/) says the model sometimes ends a long run on a report or a "want me to continue?". It follows instructions that *name* the stops. I already had a rule against asking questions under an autonomous mandate. What I was missing was the inverse, a list of the only legitimate stops. I added it to my user CLAUDE.md:

> When a step doesn't need my input, take it; status notes go in the same message as the next action. Stop only when you cannot continue without me, or before something destructive: deleting data, force-pushing, changing anything outside the repo. On a long run keep the task list in a file and end with three headings: Blocked on me, Changed, Found.

Two details from the post made it in. A task list in a file survives compaction and scrollback doesn't. And the end-of-run report should start with what's blocked on me, because that's the only part I can't skip. See [[writing-claude-md]] for the rest of how I structure that file.

## Subagents moved to Sonnet 5.5

Since Sonnet 4.5 I've overridden `ANTHROPIC_DEFAULT_HAIKU_MODEL` so that lookup subagents weren't too weak. [Sonnet 5.5](https://claude.dev/blog/building-with-claude-sonnet-5-5/) shipped on 28 September at the same per-token price as Sonnet 5 ($2/$10). It's about 30% faster and uses fewer tokens per task, so the override now points to `claude-sonnet-5-5`. Haiku 5.5 is announced for the coming weeks, and I'll recheck then.

The cost post gives the boundary: small models for lookups (search, logs, "where is this defined"), never for writing code. A mechanical edit across many files stays on Opus at low effort. Agent teams cost about **7×** the tokens of a normal session, which is reason enough to keep them small and shut teammates down when their part is done.

If you call the API directly, Sonnet 5.5 has breaking changes. `thinking: {type: "disabled"}` and `tool_choice: any/tool` now return 400. Use `thinking: {type: "between_tools"}` and `tool_choice: auto` with `strict: true` on the tool.

## What I haven't done yet: build-eval and hillclimb

[Automating eval design](https://claude.dev/blog/automating-eval-design-and-hillclimbing/) adds `/claude-api build-eval` and `/claude-api hillclimb` to the claude-api skill. The hillclimber proposes one patch per round, keeps a held-out test split, and reverts any patch that improves train while test stays flat. When the score stalls it stops editing and sorts the remaining failures by cause, which is how they found graders that contradicted the docs. Their example is skill-trigger accuracy, where the metric depends directly on the text being edited. I have 47 skills and a trigger validator that has already been wrong about itself once, so that's the next experiment.

A related tool is `/claude-api prompt-audit`. It looks for instructions written for older models: "think carefully", "do not be lazy", mandatory multi-step rituals, verify-twice rules. I grepped my skills and CLAUDE.md first and found none, so the audit wasn't needed this time.

## One idea worth stealing from the claude.ai speed sprint

[How we made claude.ai 3x faster](https://claude.dev/blog/how-we-made-claude-ai-faster/) has the line I liked best this month: *with Claude, measuring something makes it tractable.* Wall-clock time is too noisy to gate CI on, so they gated on instruction counts from Valgrind. First they proved those counts tracked wall-clock time (instructions down 48%, wall clock down 78% on one hot path). Then they turned each one into a ratchet: a PR that raised the count failed, and a daily job lowered the ceiling. My rules budget is already a ratchet of the same kind for context bytes, and it's how I caught the 76% file.
