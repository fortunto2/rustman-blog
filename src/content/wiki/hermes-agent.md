---
type: concept
title: "Hermes Agent -- self-improving AI agent by Nous Research"
description: "263k-star agent with learning loop: creates skills from experience, cross-session memory, 7 deployment backends, 40+ tools, multi-platform (Telegram, Discord, Slack). MIT."
created: 2026-04-14
updated: 2026-11-12
tags: [agents, tools, memory, skills, open-source]
publish: true
source_url: "https://github.com/NousResearch/hermes-agent"
index_line: "Hermes Agent (Nous Research): self-improving agent with learning loop, **263k stars (Nov 2026; 163k in May, 76k in Apr)**. Auto-creates skills, cross-session memory, 7 backends (incl. Vercel Sandbox), multi-platform, native Windows beta"
---

# Hermes Agent

Self-improving AI agent from Nous Research. 262.8k stars, 59.1k forks, MIT as of 12 Nov 2026 (163.1k / 26.7k on 23 May; 76.6k stars in April). The agent creates skills from experience, improves them during use, and maintains memory across sessions.

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
| Memory | FTS5 + LLM summarization | Solograph (SQLite FTS5, no vectors) |
| Deployment | 7 backends including 3 serverless (Daytona, Modal, Vercel Sandbox) | Local + competition RPC |
| Models | 200+ via OpenRouter | Provider-agnostic (config.toml) |
| Tools | 40+ Python | 14 generic + domain middleware |

Key insight from Hermes: **skill self-improvement at runtime** is something our [[agent-patterns-stream2|self-evolution pattern]] describes in theory (fixed/mutable partition). Hermes implements it in production.

The serverless backends (Daytona, Modal) are also interesting for [[infra-two-tools]]: agent hibernates when idle, wakes on demand.

## Growth signal (2026-05-23)

Snapshot of 23 May 2026 (262.8k by 12 Nov). From 76.6k → 163.1k stars in 39 days (~85k new stars, ~2.2k/day). Forks crossed 26.7k. For comparison, [[ruflo-orchestration]] and [[bmad-method]] sit two orders of magnitude lower. This is the most-starred ready-to-run agent today and the strongest empirical signal that the **agentic harness** layer -- not the model layer -- is where developer attention concentrates. Matches the thesis in [[claude-code-anatomy]]: harness eats the model.

## Links

- [GitHub](https://github.com/NousResearch/hermes-agent) -- 262.8k stars (Nov 2026), MIT
- [Docs](https://hermes-agent.nousresearch.com/docs)
- [Skills Hub](https://agentskills.io)
- [Discord](https://discord.gg/NousResearch)
