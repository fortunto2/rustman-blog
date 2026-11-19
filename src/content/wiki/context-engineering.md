---
type: concept
description: "One of three harness engineering components. The idea: agent context is not chat history — it's a continuously improved knowledge base in the repository."
title: "Context engineering — context as code"
created: 2026-04-07
updated: 2026-11-19
tags: [context, agents, claude-md, progressive-disclosure, harness]
publish: true
source_path: "1-methodology/harness-engineering.md"
index_line: "Context as code: CLAUDE.md as TOC (~100 lines), progressive disclosure, dynamic context via CDP"
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

## What others found since (Oct 2026)

- **Fewer always-loaded tokens, measured by A/B.** Cursor ([Sep 2026](https://cursor.com/blog/improved-token-efficiency)) cut its system prompt by about 66%, because stronger models need tool behaviour described rather than lists of prohibitions; moved tools used in under 20% of conversations to dynamic loading (-60% static tool tokens); and set explicit cache breakpoints (-20% cold misses). User token cost fell 7% at the same quality (reported). Same direction as cutting always-loaded rules from 37.7 KB to 16 KB in [[claude-5-5-effort-and-cost]].

- **Context has a price, and the sign depends on the cache discount.** Paper [arXiv 2611.22238](https://arxiv.org/abs/2611.22238) (17 Nov 2026) counts uncached input, cached input and output tokens separately in more than 20,000 runs of seven open models (five Qwen) on SWE-bench Verified, SWE-bench and Loc-Bench. Cost is priced at a cached-token price relative to uncached, and the paper cites API list prices of 0.025-0.1 for cache reads, so a tenth is the upper end of that range. Three findings:
  1. **Adding context.** A retrieved evidence package (top three functions in full, up to about 14K tokens) cut read and search commands by 18-34%, yet raised cost 33-42% at a tenth-price cache (and 25-33% more at a second price point whose value the HTML extract lost), with no measurable gain in resolved rate. Random code of the same length cut nothing, so the effect is relevance, not length. Rule behind it: a token added early is paid again on every later request. Small evidence (about 1.2K tokens) cost within a few percent of none; replacing the big package with a location index after use paid in 91-97% of runs.
  2. **Removing context.** Masking all but the latest ten tool outputs saved 19-25% with no cache discount, and cost 116% and 87% more (two models) at a tenth-price cache. Reason: every removal changes the prefix at that point, so everything after it is recomputed at the full price. The crossover sat at a cached price of about 0.38-0.55 of uncached in the main runs. None of 33 method, model and scaffold combinations beat doing nothing across the current API price range. Masked content was re-fetched (about 2 extra re-reads per run), so agents ran longer.
  3. **Shorter prompts are not cheaper runs.** An agent that loses information takes more steps (92 to 116 in one scaffold). Replaying the same actions with the context cut would have saved money; the live runs did not, so the saving was eaten by behaviour.
  Side finding: conditions run side by side on one server share cached prefixes, which flattered the cost of whichever condition ran second. Measure on a fresh server or count only a run's own cache hits.
  **Limits (the paper's own):** open models served locally, no thinking, capped steps and output; not frontier API agents. One retrieval design. Cache accounting is idealised prefix overlap, with no expiry, write charges or provider breakpoints, and prices are applied to recorded tokens, not invoices. Quality is scored on the working-tree diff, which misses staged changes in 1-4% of runs.
  Practical rule the paper supports: **a stable prefix is cheap, a prefix that changes early is expensive**. Appending is cheap to cache; editing or deleting something already sent is what costs. Report the three token streams, not one total.

## What it means for our own injections (Nov 2026)

What the paper covers is a coding agent's tool outputs; ours are injected blocks. The mechanism carries over, the numbers do not. We have not measured our own cache behaviour, so what follows is the reading, not a result.

- **Per-prompt hint (solograph hook).** It names a page when a prompt uses a rare term, and a memory nudge goes on about 14% of prompts (`harness/memory-gate.json`, figure from the project CLAUDE.md). It lands after what was already sent, so it extends the prefix instead of breaking it, which is the cheap case. The cost is the paper's first rule: each hint stays in the history and is re-read at the cached price on every later turn. It is cheap only while it stays short. I have not checked where Claude Code places hook output relative to earlier turns.
- **Project map, once per session.** Also appended, once, so one cache write per session. The risk is that it is not byte-identical between sessions (stack, deps and layers change), which only matters if something stable sits after it.
- **SessionStart brief (solo harness).** It prints open topics, the digest bottom line and whether the standup ran today (`harness/README.md`), so by design it differs every day. Anything that follows it in the prompt cannot be reused from yesterday. That is the one injection built to change early.
- **Rules loaded every session.** `make rules-budget` in solo-factory, run 19 Nov 2026: 16,500 bytes across 6 files in `~/.claude/rules`, about 4,125 tokens at 4 bytes per token (the script's own estimate), 118,500 bytes under its 135,000 budget. `harness-sensors.md` is 9,223 bytes (55.9%). Moving the case log out removed what was 42% of the payload (`rules/harness-sensors.md`). These are stable files, so they are the cheap kind of cost: written once, read at the cached price. Shrinking them again saves little under the paper's model.
- **Whole first request.** In the 8 most recent main-thread sessions in this project, the first request wrote 51,706 to 81,691 tokens to the cache (transcript `usage` fields; one of the eight already read 29,247). Rules are about 4K of that; the rest is the system prompt, tools, CLAUDE.md files and the brief. Single project, 8 sessions, not a distribution.

**What the paper implies for us.** The order of the prompt matters more than its size. Put the stable material first and the daily or per-prompt material last; a brief that changes every morning is acceptable only if nothing large sits behind it. Do not "clean up" by deleting old hint blocks or tool outputs mid-session: the paper's masking result is exactly that, and it lost at a tenth-price cache. Our compaction and the pipeline in [[claude-code-anatomy]] are a different mechanism (whole-history rewrite), so the paper does not rate them.

**Measure, do not rewrite.** Claude Code transcripts record `usage` per request. Count the three streams per session, split by whether the hook fired:

```bash
jq -s '[.[]|select(.type=="assistant" and (.isSidechain|not))|{id:.message.id,u:.message.usage}]
  |unique_by(.id)|map(.u) as $u
  |{req:($u|length),uncached:($u|map(.input_tokens)|add),
    cache_write:($u|map(.cache_creation_input_tokens//0)|add),
    cache_read:($u|map(.cache_read_input_tokens//0)|add),
    out:($u|map(.output_tokens)|add)}' ~/.claude/projects/<project>/<session>.jsonl
```

Then price it as `uncached + 1.25 x cache_write + 0.1 x cache_read + 5 x output` (the paper's ratios for cache read and output; the 1.25 write multiplier is my assumption from API price lists, check it). Use `solograph usage` to pick the sessions where the hint was followed versus not, and compare cache_write per request. A hint is worth keeping if cache_write per request does not rise on the turn after it and the session's total does not exceed that of comparable sessions without it. Run the comparison on at least a few dozen sessions per arm and note that sessions differ in length, so compare per request.


## Connections

- [[harness-engineering-summary]] — origin: component 1 of three
- [[agent-mistake-fix-harness]] — context engineering is the lightweight fix mechanism (vs linters/tests)
- [[solo-methodology]] — CLAUDE.md structure directly implements this pattern
- [[token-efficient-web-requests]] — context engineering for external data: Accept header, html2text, truncation
- [[agent-patterns-stream2]] — skills lazy-load vs MCPs eager-load: 150 skills = ok, 10 MCPs = context full
- [[claude-code-anatomy]] — concrete implementation: five-layer lazy-degradation compaction pipeline (budget → snip → microcompact → collapse → auto-compact)
- [[inline-agent-memory]] — context inside the code itself: AI-NOTE / AI-TODO / AI-ASK comments as a grep-discoverable memory layer below CLAUDE.md and docs/
- [[commerce-agent-blueprint]] — supplies the missing threshold: instructions touching a third or more of traffic go in the system prompt, the rest become skills (loading a skill costs a turn)
