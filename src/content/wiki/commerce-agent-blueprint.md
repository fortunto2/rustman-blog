---
type: concept
title: "Commerce agents blueprint — Anthropic's own answer to skills vs subagents"
description: "Anthropic's September 2026 commerce blueprint and its engineering deep-dive: one agent with skills beats subagents, guardrails live in the harness rather than the prompt, and prompt-cache segmentation is treated as an architecture decision."
created: 2026-09-05
tags: [agents, skills, subagents, harness, prompt-caching, memory, evals, guardrails, claude, commerce]
publish: true
source_url: "https://claude.com/blog/claude-for-commerce-agents"
index_line: "Anthropic commerce blueprint (Sep 2026, github.com/anthropics/commerce-agents): single agent + skills, NO subagents ('every handoff is state-lossy'); 1/3-of-traffic rule for system prompt vs skill; safety in harness (staged writes + server-issued ID allowlist, no tool call moves money); async memory extractor = +13% recall; 3-segment prompt cache at 90-99% hit; snapshot evals, 50-100 cases/flow, negative for every positive"
index_section: "concept"
---

# Commerce agents blueprint — what Anthropic ships when it builds an agent itself

On 2026-09-02 Anthropic published [claude-for-commerce-agents](https://claude.com/blog/claude-for-commerce-agents) plus an [engineering deep-dive](https://claude.com/blog/the-anatomy-of-effective-commerce-agents) and an open repo, [anthropics/commerce-agents](https://github.com/anthropics/commerce-agents): working shopping and merchant agents for retail, travel, telecom and ticketing, with a Claude Code plugin. Marketing numbers: carts up to 35% larger, shoppers 60% more likely to complete a purchase. Payment is deliberately left out of the blueprint.

The commerce framing is the least interesting part. What matters is that this is the vendor's own production architecture written down, and on several questions the wiki keeps circling it takes a clear side.

## One agent with skills, not a swarm

> "Every handoff to a subagent is a state-lossy operation."

The reference implementation is a **single model in a standard agent loop**. No intent router, no subagent tree. Anthropic states that one agent with skills "consistently has outperformed both the one-prompt-for-everything design and the subagent design on quality." Subagents survive in exactly two cases: deep research that needs its own context window, and a handoff to an agent with a separate compliance surface.

Where instructions go has a numeric rule: **anything relevant to a third or more of your traffic goes in the system prompt, the rest goes in skills** — because loading a skill costs a model turn. Shopping ships five skills (search-discovery, purchase-research, planning-goals, customer-care, memory-personalization); merchant ships five more (performance-insights, catalog-listings, inventory-operations, pricing-promotions, marketing-campaigns).

UI is a tool, not a rendering layer: `present_products`, `present_itinerary`, `present_plan_comparison` take typed arguments already ordered as rows and carousels. Top-level arguments get buffered for validation, which kills streaming; `eager_input_streaming: true` turns the buffer off, and they note schema violations are very rare on Sonnet-class models and up.

Tool design rule of thumb: call your existing systems, never reimplement them in tool code. Search comes back pre-ranked, the agent only chooses what to show. Tool results *are* context, so return reasoning fields and drop image URLs. Errors are written as instructions, not codes: "Include a product ID when querying availability."

## Guardrails belong to the harness

The safety section is the strongest confirmation of [[harness-engineering-summary]] I have seen from a model vendor. None of it is prompt text.

| Mechanism | What it actually does |
|---|---|
| Staged writes | "No model tool call moves money or changes the business." Writes produce staged changes with server-generated IDs; `apply_change` needs approval through a real surface (button, CLI, approval prompt), and guardrails are re-checked at apply time against current limits |
| ID allowlist | Per-session allowlist of server-issued IDs. The cart accepts only product IDs returned in this session; an ID that arrived any other way is refused before the backend sees it. Presentation tools have the server fill in records itself |
| Caps on state | The cap is enforced on the *resulting* state, not the request, and writes are serialized per session so parallel tool calls can't sum past the limit |
| Content fencing | All third-party text (listings, reviews, policies) is wrapped in a fixed-label fence, with control and bidirectional characters stripped, fence-marker imitations removed, conversation-turn imitations defused, and size capped |

This is [[claude-code-anatomy]]'s 98.4%-infrastructure finding restated from the product side: the intelligence is one loop, everything that makes it safe is scaffolding around it. And it is the deployable version of what [[agent-sandboxing]] does locally with VMs — same instinct, applied to money instead of the filesystem.

## Cache segmentation as an architecture decision

Prompt cache is treated as a first-class layout problem, targeting **90–99% hit rates**. Three segments, warmest first: global (system prompt, tools, identical across sessions) → session (user context, history) → volatile (timestamp, current page) at the end of the request. Cached reads cost a tenth of fresh tokens and run 1.5–2x faster at ~100k tokens; a cache write costs ~1.25x and pays off on the second use. Breakpoints roll forward each turn, and skills are loaded as *tool results* so they cache inside the conversation prefix.

The named failure mode is worth memorising: **a timestamp or "current page" at the top of the system prompt silently breaks the cache on every single request.**

Latency has three levers (fewer turns, faster tools, faster tokens) and one counter-intuitive result: a smarter model configuration sometimes wins on wall-clock because it plans its tool calls better. So measure **cost per completed task**, not per model call. Their starting split is Opus for the analysis-heavy merchant agent, Sonnet for the latency-sensitive consumer one.

## Memory and evals

Memory writing runs in an **asynchronous extractor** on a separate thread — 13% higher fact recall than inline tool calls, at zero latency cost to the conversation, and it reads only user and assistant text, never tool results. Reading is layered three ways: always in context (default store, fulfillment preference), pre-fetched per turn (shoe sizes when searching shoes), and behind a lookup tool for everything else. Records are keyed by person, not account. This is a concrete, shipping instance of the layering in [[agent-memory-architecture]], with the async-write trick that page doesn't name.

Evals invert the usual instinct: **evaluate snapshots, not conversations.** Construct the test state directly as a messages array and grade the outcome (final state, rendered response), not the path taken. Simulated-user runs are demoted to a way of finding coverage gaps. Budget 50–100 cases per user flow, write a negative case for every positive, and split prompt-injection tests into user-authored (directive in the user message) and data-plane (planted in product names, reviews, web snippets). CI gates on pass rate, cache hit rate, and cost per turn; there is a per-skill kill switch that needs no deploy, canary cohorts for prompt and skill changes, and a freeze before peak season. [[deepeval-llm-testing]] gives the pytest harness for exactly this shape of assertion.

## What I'd steal

- The **1/3-of-traffic rule** as the split line between CLAUDE.md and a skill — the missing threshold in [[context-engineering]], which says progressive disclosure but not when.
- **Server-issued ID allowlists** for anything a solo project lets an agent mutate: invoices in [[project-invoice-crm]] are the obvious candidate, where a hallucinated client ID is a real invoice to a nonexistent company.
- **Snapshot evals over conversation replays** — cheap enough to actually run in a one-person CI.
- The default answer to "should I add a subagent here": no, add a skill.
