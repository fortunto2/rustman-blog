---
type: concept
title: "Hermes Agent -- self-improving AI agent by Nous Research"
description: "76k-star agent with learning loop: creates skills from experience, cross-session memory, 6 deployment backends, 40+ tools, multi-platform (Telegram, Discord, Slack). MIT."
created: 2026-04-14
tags: [agents, tools, memory, skills, open-source]
course_module: 5
course_order: 17
publish: true
source_url: "https://github.com/NousResearch/hermes-agent"
---

# Hermes Agent

Self-improving AI agent from Nous Research. 76.6k stars, MIT. The agent creates skills from experience, improves them during use, and maintains memory across sessions.

Not a framework for building agents. This is a ready-to-run agent with learning built in.

## What makes it different

**Learning loop:** agent creates skills autonomously, then self-improves them at runtime. Skills are compatible with agentskills.io open standard.

**Cross-session memory:** FTS5 session search + LLM summarization. Plus "Honcho dialectic user modeling" that builds a profile of the user over time.

**Multi-platform native:** one gateway process handles Telegram, Discord, Slack, WhatsApp, Signal, Email. Same conversation continues across platforms. Voice memos transcribed automatically.

**Six deployment backends:**
- Local, Docker, SSH (standard)
- Daytona, Modal (serverless with hibernation, near-zero cost when idle)
- Singularity (containers)

**200+ models:** any OpenAI-compatible API. Switch with `hermes model`, no code changes.

## Architecture

```
CLI TUI / Telegram / Discord / Slack / WhatsApp / Signal / Email
    ↓
  Gateway (single process, all platforms)
    ↓
  Agent Loop (tool calls, responses, learning)
    ↓
  Terminal Backend (local / Docker / SSH / Daytona / Modal / Singularity)
```

40+ built-in tools, MCP server integration, parallel subagents, Python RPC, cron scheduler.

## Research angle

Nous uses Hermes for training data: batch trajectory generation, trajectory compression, Atropos RL environments. The agent's tool-calling traces become training data for the next generation of models.

This connects to [[decision-traces-compound]]: every agent action becomes a training signal. And to [[asi-evolve-ai-research-agents]]: both systems use agent outputs to improve the underlying models.

## How it compares to our stack

| | Hermes Agent | Our approach (sgr-agent + Claude Code) |
|---|---|---|
| Language | Python | Rust |
| Learning | Auto-creates skills | Skills authored in SKILL.md, hot-reloaded |
| Memory | FTS5 + LLM summarization | Solograph (FalkorDB + vectors) |
| Deployment | 6 backends including serverless | Local + competition RPC |
| Models | 200+ via OpenRouter | Provider-agnostic (config.toml) |
| Tools | 40+ Python | 14 generic + domain middleware |

Key insight from Hermes: **skill self-improvement at runtime** is something our [[agent-patterns-stream2|self-evolution pattern]] describes in theory (fixed/mutable partition). Hermes implements it in production.

The serverless backends (Daytona, Modal) are also interesting for [[infra-two-tools]]: agent hibernates when idle, wakes on demand.

## Links

- [GitHub](https://github.com/NousResearch/hermes-agent) -- 76.6k stars, MIT
- [Docs](https://hermes-agent.nousresearch.com/docs)
- [Skills Hub](https://agentskills.io)
- [Discord](https://discord.gg/NousResearch)
