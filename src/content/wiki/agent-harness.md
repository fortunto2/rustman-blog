---
type: hub
title: "Agent Harness and Claude Code"
description: "Everything I have measured about running coding agents well: the harness around the model, context and memory, delegation to cheaper models, evals, and Claude Code itself."
created: 2026-11-01
tags: [hub, harness, agents, claude-code, context-engineering, memory, evals]
publish: true
index_line: "Hub: running coding agents. Harness (always-on Gnome, cost by model tier, TDD inside the loop costs 3-8x tokens), context (CLAUDE.md, skills standard, effort/cost on Claude 5.5, 80% fewer web tokens), memory (4 types/3 loops, AI-NOTE comments, wiki feedback loop, solograph on FTS5), delegation (Fable+sidekick beats Opus, cheap-model boundaries), evals (plugin ablation, deepeval, benchmarks, SGR)"
---

# Agent Harness and Claude Code

The model is the smaller half of an agent. What decides whether it does reliable work is the harness:
what it reads before it acts, what checks it after, what it remembers, and what it is allowed to hand
to a cheaper model. These pages are the measured part of that, most of them from my own setup.
The method behind them is [[harness-engineering-summary]].

## The harness

- [[agent-harness-and-always-on-gnome]]: how I run my work through Claude Code, the scheduled jobs, and why they need a box that never sleeps
- [[harness-cost-by-model-tier]]: a behavioral harness took a small model from 3 to 10 accepted runs and made it cheaper than the big one unharnessed
- [[tdd-inside-the-agent-loop]]: agent-run TDD cost 3 to 8 times the tokens with no better tests or design
- [[claude-code-anatomy]]: Claude Code reverse-engineered: the seven-part loop, five layers of compaction, deny-first permissions
- [[commerce-agent-blueprint]]: one agent with skills beats subagents; guardrails live in the harness, not the prompt
- [[design-md-spec]]: design tokens plus their rationale in one file the agent can lint against
- [[reading-agent-output]]: the terminal as a reading instrument once the work is reviewing an agent's stream

## Context: what the agent reads

- [[claude-code-from-zero]]: one-page start for people who do not use agents yet
- [[writing-claude-md]]: how to write instruction files, and what did not work
- [[skills-standard]]: the SKILL.md format 20+ agents now share
- [[agent-patterns-stream2]]: skills load lazily, MCPs eagerly, and four other patterns
- [[claude-5-5-effort-and-cost]]: effort from xhigh to high, always-loaded rules from 37.7 KB to 16 KB
- [[claude-model-choice-guide-nov-2026]]: Anthropic's 9 Nov 2026 model-choice guide read against a Claude Code setup: effort before model, Haiku 5.5 for subagents
- [[token-efficient-web-requests]]: 80% fewer tokens per web page by asking for markdown
- [[claude-subscription-boundary]]: where a Max plan stops being usable as infrastructure

## Memory

- [[agent-memory-architecture]]: 4 memory types, 3 loops, 5 systems compared
- [[inline-agent-memory]]: notes inside the code with a prefix grep finds (AI-NOTE, AI-TODO, AI-ASK)
- [[wiki-feedback-loop]]: corrections and unanswered questions flowing back into this wiki
- [[solograph-rebuilt-one-binary]]: my memory server, from a graph database to one Rust binary over SQLite FTS5

## Delegation and cost

- [[lead-model-delegation-economics]]: 3,000 sessions where a strong lead with a cheap sidekick cost less and scored higher
- [[cheap-model-delegation-boundary]]: what a cheap model can read for you, and the two places it cannot

## Evals and structure

- [[plugin-eval-ablation]]: only the arm without your plugin measures what the plugin adds
- [[deepeval-llm-testing]]: 50+ eval metrics with pytest in CI
- [[agent-benchmarks]]: SWE-bench, PAC-1, LongMemEval and what each one scores
- [[sgr-deep-dive]]: schema-guided reasoning, schemas as the interface between the LLM and code
- [[effect-ts-for-agents]]: when a typed effect system pays for itself in an agent pipeline
- [[github-top-100-agentic-shift]]: every repo under 18 months old in GitHub's top 100 is harness tooling

Tools and frameworks other people built for the same problems: [[agent-landscape]].
