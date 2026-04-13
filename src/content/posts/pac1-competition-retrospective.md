---
type: concept
title: "How I spent $250+ on an AI agent competition and what I learned"
description: "Personal retrospective on BitGN PAC1 challenge: scoring 17/104 live, organizing a hub event while competing, $50 per GPT-5.4 run, and rebuilding the agent to 74/104 in two days."
created: 2026-04-13
tags: [agents, competition, rust, retrospective, sgr, benchmarks]
publish: true
publish_as: post
---

# How I spent $250+ on an AI agent competition and what I learned

I scored 17 out of 104. Let me tell you how I got there and why I'm actually happy about it.

## The setup

[BitGN PAC1](https://bitgn.com/challenge/PAC) is an agent benchmark. Your AI agent connects via API to a virtual workspace -- emails, invoices, contacts, OTP verifications, social engineering attacks -- and completes tasks. 104 tasks, scored automatically. No hand-holding.

I also organized a [physical hub event in Gazipasa](https://bitgn.com/h/hub-Tuz3bqmpZPuaFfVU) for it. 14 hours. The competition started, and I found myself simultaneously explaining to people what agents are, how the competition works, and -- with one hand -- frantically throwing submissions at the leaderboard while begging Claude to figure things out.

Not the ideal competitive setup.

## The money pit

Before the competition, I spent about $50 testing models. I ran through 30+ different models across 6 providers. The best performer? **Nemotron 120B** -- a free model via Cloudflare Workers AI. Seed-2.0-pro was decent too.

Then the competition started, and I switched to GPT-5.4. One run: **$50**. I did three. That's $150 in two hours of panic.

After the competition, another $50 on weekend debugging sessions. Total damage: north of $250.

## My over-engineered stack

I built everything in Rust, from my own libraries. Three layers:

1. **[openai-oxide](https://github.com/fortunto2/openai-oxide)** -- OpenAI client with caching, websockets, realtime. I like everything about this layer.
2. **[sgr-agent](https://github.com/fortunto2/rust-code/tree/master/crates/sgr-agent)** -- Agent core with [SGR patterns](https://abdullin.com/schema-guided-reasoning/) from Rinat (thanks to him for both the competition and the ideas -- I studied the [Python reference implementation](https://github.com/vamplabAI/sgr-agent-core)).
3. **[agent-bit](https://github.com/fortunto2/agent-bit)** -- The competition agent itself.

What I built into the architecture:

- ONNX classifier (MiniLM-L6) for intent and security labels -- runs before the LLM even sees the task
- 12-feature threat matrix, NLI DeBERTa for injection detection, trust graph, two state machines
- 15 hot-reloadable skills, hooks, and tools
- Agent loop -- SGR + function calling hybrid
- OutcomeValidator with adaptive kNN on the output side

Was this over-engineered for a 2-hour competition? Absolutely. But this is the [[agent-mistake-fix-harness]] philosophy in action -- every mistake becomes a permanent fix in the framework.

## What other participants did

After the competition, I looked at what the top scorers actually built. Different universe.

[inozemtsev/bitgn](https://github.com/inozemtsev/bitgn), [ai-babai/bitgn-env](https://github.com/ai-babai/bitgn-env) -- they took [Codex CLI](https://github.com/openai/codex) with a simple wrapper and agent instructions file. No custom frameworks. No ONNX classifiers. No state machines. 70-80 points.

Sometimes the best architecture is no architecture.

(By the way, Codex has an [official Rust version](https://github.com/openai/codex/tree/main/codex-rs) now. I found it later, and it helped me understand how to design tools better.)

## What went wrong

### 1. Dev-Prod gap

On development tasks (43 total), I got **42/43 on Nemotron** -- a free model! In production (104 tasks), everything fell apart. I had hardcoded too many rules at the pre-LLM layer. While updating them in a real-time loop during the competition... well, you can imagine.

### 2. Dumb tools, too many steps

My agent was doing 185 steps per run. Average time: 229 seconds per task. Sum of trial times: 396 minutes. The problem: no batch tools. Every file read was a separate LLM round-trip.

### 3. Blind flying

I couldn't see step counts or cost per run clearly. The leaderboard only appeared on Saturday. I was flying blind during the actual competition.

## The weekend rebuild

I sat down on Saturday and Sunday and actually fixed things.

**Tools:** Created `ReadAllTool` -- read an entire directory in one pass instead of 15 separate calls. Added `EvalTool` -- run JavaScript dynamically via the Boa engine (also works with bash for local scripts). Extracted a [shared tools package](https://github.com/fortunto2/rust-code/tree/master/crates/sgr-agent-tools/src).

**Observability:** Set up [Phoenix](https://phoenix.arize.com/) locally with OpenTelemetry. My sgr-agent had basic tracing, but I made it proper -- every tool call, every LLM round-trip, every token count visible.

**Results after the rebuild** (numbers still improving -- this is a snapshot, not the ceiling):

| Metric | Competition (Apr 11) | After rebuild (Apr 13) | Delta |
|--------|---------------------|----------------------|-------|
| Model | GPT-5.4 | GPT-5.4 | same |
| Parallelism | -104 | 104 | same |
| Score | [17/104 → 16.3%](https://eu.bitgn.com/runs/run-22J8DDkgwCuT9GeGCXRk8WPHw) | **74/104 → 71.2%** | **+4.4x** |
| Sum trial times | 396 min (23,806s) | **155 min (9,326s)** | **-61%** |
| Avg time/task | 229s | **90s** | **-61%** |
| Avg steps/task | 185.8 | **43.6** | **-76%** |
| Fastest task | 97s | **4s** | |
| Slowest task | 508s | **222s** | |

All 104 tasks run in parallel. Total wall-clock time: 3-4 minutes.

## Lessons

**1. Ship simple first, optimize later.** Codex CLI + good prompts = 70-80 points. My entire Rust pipeline = 17 points on competition day. The infrastructure I built is better *now*, but it wasn't ready *then*.

**2. Batch tools are not optional.** `ReadAllTool` alone cut steps from 185 to 43. Each tool call = one LLM round-trip = 2-5 seconds. Multiply by 100+ tasks.

**3. Observability from day one.** I couldn't debug what I couldn't see. Phoenix + OTEL should have been there from the start, not bolted on after the disaster.

**4. The dev-prod gap will get you.** 42/43 in dev means nothing if prod has 2.5x more tasks with different patterns. Hardcoded rules are technical debt with compound interest.

**5. Architecture pays off -- eventually.** My framework now powers multiple agents I'm building. The competition was an expensive stress test, but the sgr-agent ecosystem is stronger for it. A $250 tuition fee for a reusable agent core. This is the [[portfolio-approach]] -- each project strengthens the next.

## Am I happy?

Yes. 17/104 during the competition was embarrassing. 74/104 after the weekend rebuild -- and still improving -- is a real system. The architecture is solid, the tools are smart, and every agent I build from here starts at a higher baseline.

The competition was chaos. The learning was worth every dollar.

---

*Links: [agent-bit on GitHub](https://github.com/fortunto2/agent-bit) | [PAC1 Challenge](https://bitgn.com/challenge/PAC) | [Telegram post](https://t.me/life2film/601)*

*See also:*
- *[[agent-bit-pac1]] -- technical architecture deep-dive (SGR pipeline, tools, FileBackend trait)*
- *[[schema-guided-reasoning]] -- the SGR pattern that powers the agent loop*
- *[[agent-benchmarks]] -- how PAC1 compares to SWE-bench, PinchBench, and others*
- *[[cli-first-testing]] -- why every project gets a CLI mirror*
- *[[project-openai-oxide]] -- the OpenAI Rust client underneath*
