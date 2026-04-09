---
type: concept
title: "Agent benchmarks — how to measure if your coding agent actually works"
description: "Catalog of coding agent benchmarks: SWE-bench, PinchBench, PAC-1, LongMemEval. What they test, how scoring works, where we participate."
created: 2026-04-09
tags: [agents, benchmarks, evaluation, methodology, tools]
publish: true
---

# Agent Benchmarks

Benchmarks answer the question: "Does my agent actually work, or does it just look impressive in demos?" This page catalogs the benchmarks that matter for coding agents and AI toolkits.

---

## Coding Agent Benchmarks

| Benchmark | What it tests | Tasks | Key metric | Link |
|-----------|--------------|-------|------------|------|
| **SWE-bench** | Fix real GitHub issues | 2,294 (full) / 300 (Verified) | % resolved | [swebench.com](https://www.swebench.com/) |
| **SWE-bench ES3** | Extended real-world SWE tasks | Expanded set | % resolved | [swe-bench.github.io](https://swe-bench.github.io/) |
| **Terminal-Bench 2.0** | Terminal agent tasks (kernel build, git servers, async debug, CTF) | 100 validated | Pass rate (k=5 trials) | [tbench.ai](https://www.tbench.ai/) |
| **Aider Polyglot** | Code generation across 6 languages incl. Rust | 225 (Exercism) | % passing tests | [github.com/Aider-AI](https://github.com/Aider-AI/aider) |
| **PAC-1** | Personal & trustworthy agents | 43 tasks | Score / 43 | [bitgn.com/l/pac1-dev](https://bitgn.com/l/pac1-dev) |
| **PinchBench** | LLM as OpenClaw coding agent | 23 tasks, 8 categories | Averaged score | [pinchbench.com](https://pinchbench.com) |

### SWE-bench

The industry standard. Real GitHub issues from popular Python repos → agent must understand the issue, find relevant code, write a fix, pass tests. SWE-bench Verified (300 human-validated tasks) is the trusted subset.

**Why it matters:** closest to real engineering work. Not toy tasks — real bugs in Django, Flask, scikit-learn.

**Current top agents:** consistently improving — from 4% (Jan 2024) to 70%+ (mid 2026).

### SWE-bench ES3

Extended version — broader range of tasks, more languages, harder edge cases. The next generation of SWE-bench.

### PAC-1 (Personal & Trustworthy Agents)

BitGN benchmark for personal AI agents. 43 tasks, max score 43.0. DEV leaderboard is active — top agents score perfect 43/43.

**We participate here.** Focus: personal agent reliability, trustworthiness, real-world task completion.

### PinchBench

Evaluates LLM models as OpenClaw coding agents across 8 categories:

- **Productivity** — calendar, scheduling, time parsing
- **Research** — stock prices, conferences, data extraction
- **Writing** — blog posts, emails, content
- **Coding** — scripts, file operations
- **Analysis** — spreadsheets, PDFs, document processing
- **Email** — inbox management, triage
- **Memory** — long-term recall, context retrieval
- **Skills** — ecosystem integration, skill discovery

**Scoring:** automated grading + LLM judge (nuanced quality). 23 real-world tasks. Results on [pinchbench.com](https://pinchbench.com).

**Key insight:** tests practical agent capabilities (tool usage, multi-step reasoning, ambiguous instructions), not isolated LLM knowledge.

### Terminal-Bench 2.0

The de-facto standard for terminal agent evaluation. 100 tasks validated by humans and LMs for solvability and realism. Tasks: kernel builds, git server setup, async debugging, COBOL modernization, security CTFs.

**Harness:** [Harbor framework](https://github.com/harbor-framework/terminal-bench-2) — rewritten from scratch for reliability and parallelism. Built-in agents: Claude Code, Codex, Terminus-2, Aider, Oracle (ground truth).

**Running your own agent:** `BaseInstalledAgent` (if CLI) or `BaseAgent` (full control via `perform_task()`). Custom agent wrapper is ~40 lines.

**Practical notes:**
- Apple Silicon: x86 container conflicts — use Daytona/Modal instead of local Docker
- Some tasks run 2+ hours (COBOL modernization)
- Leaderboard requires k=5 trials minimum (high variance: DeepAgents showed 40.4% vs 44.9% between runs)
- ~$10-20 via Daytona for a full parallel run (32 trials/hour)

### Aider Polyglot

225 Exercism tasks across 6 languages (Python, Rust, Go, JS, Java, C#). Simpler than TB2 — `cargo test` / `pytest` validation, no containers needed for Mac.

**Format:** 2 attempts per task. First solo, second with test feedback. Close to real agentic loop.

**Why useful for agent comparison:** headless mode for all major agents — `rust-code -p`, `codex exec --full-auto`, `claude -p`. Same dataset = comparable scores. Can filter `--languages rust` for Rust-only subset (~50 tasks).

**Key metrics:** pass rate attempt 1 / attempt 2, avg loop steps, token usage per task, edit accuracy (valid patch on first try).

---

## Memory Benchmarks

| Benchmark | What it tests | Memories | Key metric | Link |
|-----------|--------------|----------|------------|------|
| **LongMemEval** | Long-term memory in agents | 22K+ | Retrieval accuracy | [arxiv](https://arxiv.org/abs/2410.10813) |

### LongMemEval

Tests: information extraction, multi-session reasoning, temporal reasoning, knowledge updates, and abstention (knowing when you don't know).

**Notable result:** [[mempalace-agent-memory|MemPalace]] scored 96.6%. Structure (spatial hierarchy) beat raw embeddings. Verbatim storage beat compression.

---

## Skill Benchmarks

| Benchmark | What it tests | Focus |
|-----------|--------------|-------|
| **Superpowers TDD enforcement** | Does agent actually write tests first? | Process compliance |
| **solo-factory /retro** | Pipeline quality after full run | End-to-end methodology |

These aren't public leaderboards — they're built-in evaluation in [[agent-toolkit-landscape|agent toolkits]]. [[project-solo-factory|solo-factory's]] `/retro` skill evaluates pipeline effectiveness after a run. Superpowers enforces TDD and deletes code written before tests.

---

## Our Participation

- **PAC-1** — active participation on DEV leaderboard
- **PinchBench** — relevant for OpenClaw/Moltis ecosystem evaluation
- **SWE-bench** — reference benchmark for coding agents
- **LongMemEval** — reference for [[agent-memory-architecture|memory systems]]

---

## Continuous Eval: The Missing Layer

Public benchmarks run once. Real systems degrade daily. The [Zero Harness eval engine](https://t.me/s/neuralllab) (NeuraLab) proposes eval as a **permanent loop**, not a one-time check:

### Routing Eval
Daily control cases for agent routing. Not abstract benchmarks — real questions matching system roles (memory lookup, code implementation, research, browser-required flows). Catches **architectural drift** fast: e.g., browser-required cases routing to skill runner instead of browser agent.

### Skills Eval
Formal gate before a skill is "ready":
- Has trigger + `when_to_use` / `when_not_to_use`
- Has `required_tools` + fallback strategy
- Has eval cases
- Passes threshold (e.g., 0.8)
- Doesn't break routing around itself

A skill isn't done because "it worked once." It must pass formal checks. This maps directly to [[agent-toolkit-landscape|skill marketplace]] quality: skills.sh audits, solo-factory `/skill-audit`.

### Browser Eval
14-day comparison of browser candidates across task types. Metrics: success rate, latency, determinism, token overhead, retry rate, composite score. Key finding: **lightweight-first + controlled heavy fallback** beats browser-first (which adds unnecessary complexity).

### Why Continuous Eval Matters
Without permanent eval, degradation is invisible:
- Routing drifts
- New skill breaks old path
- Browser candidate becomes unstable
- Latency grows unnoticed

The agent continues to look confident externally. Eval is insurance against self-confident agents.

**Next frontier: completion control** — agent can't self-declare "done" until facts, artifacts, and smoke-checks confirm it. Less spectacular than "autonomous agent that does everything." Closer to production than an investor demo.

---

## What Benchmarks Miss

Public benchmarks test isolated capabilities. They don't test:

- **Pipeline quality** — can the agent ship a complete product? (research → code → deploy → launch)
- **Harness effectiveness** — does the [[harness-engineering-summary|harness]] prevent real mistakes?
- **Architectural drift** — does routing degrade over days/weeks? (Zero Harness eval engine)
- **Compound learning** — does the agent get better over time? ([[decision-traces-compound]])
- **Cross-session memory** — does context survive between runs? ([[agent-memory-architecture]])
- **Completion honesty** — does the agent actually finish, or just claim it did?
- **Real user value** — did anyone actually use the thing it built?

The best benchmark is shipping real products. Everything else is a proxy.

## Sources

- [NeuraLab / Zero Harness](https://t.me/s/neuralllab) — practical eval engine for agent routing, skills, browser; continuous eval loop

## See Also

- [[agent-toolkit-landscape]] — tools being benchmarked
- [[agent-memory-architecture]] — memory evaluation deep dive, trust hierarchy
- [[harness-engineering-summary]] — quality comes from harness, not model
- [[enterprise-rag-challenge]] — RAG-specific competition results
- [[agent-self-discipline]] — drift detection relates to continuous eval
