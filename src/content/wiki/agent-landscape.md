---
type: hub
title: "Agent Landscape"
description: "The agent frameworks, runtimes, memory systems and browser tools I studied, grouped by the problem each one answers, with what was worth taking from it."
created: 2026-11-01
tags: [hub, agents, tools, comparison, open-source, memory, orchestration]
publish: true
index_line: "Hub: other people's agent tools by problem. Orchestration (Conductor & co, Paperclip org charts, Ruflo, BMAD, Buzz on Nostr), runtimes (Cloudflare computer, DeepSeek harness, Hermes, Rust agents: Moltis/ZeroClaw/IronClaw), memory & code search (15 code-graph tools → tree-sitter+FTS5, Graphify, MemPalace, fff, PromptQL, Semantica), browser (agent-browser refs, Webwright code-as-action), agent-native apps (Builder.io, Clips, HyperFrames), research agents (ASI-Evolve, ShinkaEvolve), safety (DSEWiki collusion)"
---

# Agent Landscape

Other people's answers to the problems in [[agent-harness]]. Each page says what the tool does and
which idea, if any, I took from it. The category map is [[agent-toolkit-landscape]].

## Running many agents

- [[conductor-parallel-agents]]: Conductor, Superset, Claude Squad and the rest: many agents in parallel worktrees
- [[paperclip-agent-company]]: agents in an org chart, with budgets that hard-stop and heartbeats in a database
- [[ruflo-orchestration]]: 32 plugins and 100+ agents in one self-learning swarm
- [[bmad-method]]: agents and workflows as Claude Code skills, persona in a TOML file
- [[buzz-agent-workspace]]: humans and agents in the same rooms, every message a signed event

## Runtimes and agent servers

- [[cloudflare-computer-agent-runtime]]: a durable SQLite filesystem per agent with compute attached on demand
- [[deepseek-harness]]: every part a plugin, the loop included
- [[hermes-agent]]: an agent that writes skills from its own experience
- [[rust-agent-ecosystem]]: ZeroClaw, IronClaw, Moltis, ZeptoClaw compared
- [[moltis-rust-agent]]: a Rust agent server I contributed to

## Memory and code search

- [[code-graph-mcp-landscape]]: 15 code-graph tools, nearly all ended on tree-sitter plus SQLite FTS5
- [[graphify-vs-solograph]]: tree-sitter graphs with no embeddings, against my own index
- [[mempalace-agent-memory]]: local memory scoring 96.6% on LongMemEval
- [[fff-agent-file-search]]: fuzzy file search with frecency, over MCP
- [[promptql-context-wiki]]: what makes an agent accurate on company data
- [[semantica-decision-provenance]]: a graph that answers a regulator's "why" months later

## The browser

- [[vercel-agent-browser]]: accessibility-tree references instead of selectors
- [[webwright-code-as-action]]: the agent writes Playwright scripts; the browser is disposable

## Apps built for agents

- [[agent-native-builder]]: one action definition serves the UI, the agent, HTTP, MCP and CLI
- [[clips-agent-native-video]]: a Loom alternative an agent can read and edit
- [[agent-native-format-choice]]: video rendered from plain HTML, because agents already write HTML

## Research agents and safety

- [[asi-evolve-ai-research-agents]]: agents running full-cycle AI research
- [[shinka-evolve]]: code evolved with LLMs as the mutation operator
- [[dsewiki-agent-collusion]]: rogue agents used a public wiki to share ways to cheat their evals
- [[world-models-in-markets-2026]]: order-book generators work as test stands, trading signals are unproven, weather models are the part that sells
