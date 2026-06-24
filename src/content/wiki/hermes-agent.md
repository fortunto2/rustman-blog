---
type: concept
title: "Hermes Agent -- self-improving AI agent by Nous Research"
description: "163k-star agent with learning loop: creates skills from experience, cross-session memory, 7 deployment backends, 40+ tools, multi-platform (Telegram, Discord, Slack). MIT."
created: 2026-04-14
updated: 2026-05-23
tags: [agents, tools, memory, skills, open-source]
course_module: 5
course_order: 17
publish: true
source_url: "https://github.com/NousResearch/hermes-agent"
---

# Hermes Agent

Self-improving AI agent from Nous Research. 163.1k stars, 26.7k forks, MIT (up from 76.6k stars in April 2026 -- 2x growth in one month, top-tier traction for an agent harness). The agent creates skills from experience, improves them during use, and maintains memory across sessions.

Not a framework for building agents. This is a ready-to-run agent with learning built in.

## What makes it different

**Learning loop:** agent creates skills autonomously, then self-improves them at runtime. Skills are compatible with agentskills.io open standard.

**Cross-session memory:** FTS5 session search + LLM summarization. Plus "Honcho dialectic user modeling" that builds a profile of the user over time.

**Multi-platform native:** one gateway process handles Telegram, Discord, Slack, WhatsApp, Signal, Email. Same conversation continues across platforms. Voice memos transcribed automatically.

**Seven deployment backends:**
- Local, Docker, SSH (standard)
- Daytona, Modal, Vercel Sandbox (serverless with hibernation, near-zero cost when idle)
- Singularity (HPC containers)

**200+ models:** any OpenAI-compatible API. First-class wiring for Nous Portal, OpenRouter, NovitaAI, NVIDIA NIM (Nemotron), Xiaomi MiMo, z.ai/GLM, Kimi/Moonshot, MiniMax, Hugging Face, OpenAI, plus self-hosted endpoints. Switch with `hermes model`, no code changes.

**Native Windows beta:** PowerShell installer ships portable MinGit (~45MB), isolated from any system Git. Termux on Android works via curated extras. WSL2 remains the most battle-tested Windows path.

## Architecture

```
CLI TUI / Telegram / Discord / Slack / WhatsApp / Signal / Email
    ↓
  Gateway (single process, all platforms)
    ↓
  Agent Loop (tool calls, responses, learning)
    ↓
  Terminal Backend (local / Docker / SSH / Daytona / Modal / Singularity / Vercel Sandbox)
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
| Deployment | 7 backends including 3 serverless (Daytona, Modal, Vercel Sandbox) | Local + competition RPC |
| Models | 200+ via OpenRouter | Provider-agnostic (config.toml) |
| Tools | 40+ Python | 14 generic + domain middleware |

Key insight from Hermes: **skill self-improvement at runtime** is something our [[agent-patterns-stream2|self-evolution pattern]] describes in theory (fixed/mutable partition). Hermes implements it in production.

The serverless backends (Daytona, Modal) are also interesting for [[infra-two-tools]]: agent hibernates when idle, wakes on demand.

## Growth signal (2026-05-23)

From 76.6k → 163.1k stars in 39 days (~85k new stars, ~2.2k/day). Forks crossed 26.7k. For comparison, [[ruflo-orchestration]] and [[bmad-method]] sit two orders of magnitude lower. This is the most-starred ready-to-run agent today and the strongest empirical signal that the **agentic harness** layer -- not the model layer -- is where developer attention concentrates. Matches the thesis in [[claude-code-anatomy]]: harness eats the model.

## Links

- [GitHub](https://github.com/NousResearch/hermes-agent) -- 163.1k stars, MIT
- [Docs](https://hermes-agent.nousresearch.com/docs)
- [Skills Hub](https://agentskills.io)
- [Discord](https://discord.gg/NousResearch)
