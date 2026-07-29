---
type: concept
title: "Webwright — code-as-action for browser agents (Microsoft Research)"
description: "Microsoft's Webwright (2.4k★, Apr 2026) flips the browser-agent paradigm: the agent writes Playwright scripts in a terminal, the browser is disposable, the workspace (code + logs + screenshots) is the persistent state. ~1.5k LoC, SOTA on Online-Mind2Web (86.7%) and Odysseys long-horizon (60.1%, +15.6 over prior SOTA)."
created: 2026-05-27
tags: [agents, browser-automation, harness-engineering, microsoft, playwright, code-as-action, plugins]
publish: true
source_url: "https://github.com/microsoft/Webwright"
index_line: "Microsoft Research's Webwright (2.4k★, Apr 2026): agent writes Playwright scripts instead of predicting clicks. Browser is disposable, workspace (code+logs+screenshots) is persistent state. ~1.5k LoC, SOTA on Online-Mind2Web (86.7%) and Odysseys long-horizon (60.1%, +15.6 over prior SOTA). Ships as cross-host plugin (Claude Code, Codex, OpenClaw, Hermes)"
index_section: "concept"
---

# Webwright — A Terminal Is All You Need For Web Agents

[microsoft/Webwright](https://github.com/microsoft/Webwright) (2.4k stars at release, Apr 2026) is Microsoft Research's attempt to rebuild the browser-agent harness from scratch. Their thesis, in one sentence: **separate the agent from the browser, and let the agent write code instead of predicting clicks**.

## The paradigm flip

Every other browser-agent framework — browser-use, Stagehand, Vercel's agent-browser — treats the **browser session as the workspace**. The model gets a snapshot of the current page, predicts one next action (click, type, selector), executes it, gets the new snapshot. The browser holds the state; the agent walks it forward step by step.

Webwright reverses this. The browser is something the agent **launches, inspects, and discards** while developing a Python script. The persistent artifact is the local workspace — `final_script.py`, `plan.md`, screenshots, logs. The agent is a coding agent that happens to spawn Playwright sessions, not a clicking agent that happens to write some code.

That distinction is the whole repo. Once you've made it, the rest falls out:

- **Free-form Python action space**, not a fixed click/type/select vocabulary. The agent writes `await page.locator(...).click()` loops, defines helper functions, handles lazy-loading with explicit `wait_for` conditions.
- **Workspace-as-state.** A run produces a re-runnable script. Same task tomorrow? Just `python final_script.py`. Same task with different inputs? `python final_script.py --origin JFK --destination LAX`.
- **Fewer rounds.** Multi-step interactions like filling a form collapse into one program. The agent doesn't re-predict the same low-level sequence for every variation.
- **The script is the trace.** Browsing history isn't a JSON log of opaque actions — it's a single code file you can read, fork, share.

## Why this beats the click-prediction paradigm

The numbers from the [Microsoft Research blog post](https://www.microsoft.com/en-us/research/articles/webwright-a-terminal-is-all-you-need-for-web-agents/):

- **Online-Mind2Web (300 tasks):** 86.7% with GPT-5.4, 84.7% with Claude Opus 4.7. Highest among open-sourced harnesses in the AutoEval category. Opus is stronger on the hard split (80.5% vs 76.6% for GPT-5.4 at N=100).
- **Odysseys (200 long-horizon tasks, avg. 76 steps):** 60.1% with GPT-5.4. That's **+15.6 points over the prior SOTA** (Opus 4.6 at 44.5% using a vision-based, persistent-browser approach) and **+26.6 points over base GPT-5.4** doing xy-coordinate prediction.
- A reproduced GPT-5.4 screenshot+coordinate baseline gets beaten across every difficulty split. The conclusion isn't subtle: **code-as-action eats coordinate prediction on long horizons**, because errors don't compound when each step is a debuggable line of code instead of a fragile click.

There's a secondary result that matters more for solo builders: **small models work too**. Qwen-3.5-9B completes Online-Mind2Web tasks well when given 5+ reusable parameterized scripts. The harness amortises model intelligence — once Claude writes `book_flight.py`, Qwen can run it.

## The minimal-harness aesthetic

Webwright is **~1.5k lines of code total**:

- Core agent loop: ~450 lines (single file)
- Playwright environment wrapper: ~570 lines
- CLI: ~150 lines
- Each model backend (OpenAI / Anthropic / OpenRouter): ~150–200 lines

Dependencies: `httpx`, `pydantic`, `playwright`, `typer`. No multi-agent system, no graph engine, no plugin layer, no hidden orchestration.

This is the same minimalism thesis as [[claude-code-anatomy]] — Liu et al.'s reverse-engineering of Claude Code v2.1.88 showed 98.4% operational infrastructure, 1.6% AI logic, and a flat prompt→observe→execute loop. Webwright is what happens when you apply that same discipline to web automation specifically. Both repos converge on: small loop, plain dependencies, run-artifacts on disk, no framework lock-in.

## Ships as a plugin everywhere

The pragmatic move is the cross-host plugin manifest. The same `skills/webwright/` folder loads as:

- a Claude Code plugin (`/plugin install webwright@webwright`)
- an OpenAI Codex plugin (same marketplace command)
- an OpenClaw skill
- a Hermes Agent skill

Two slash commands:

- `/webwright:run <task>` — produces a one-shot `final_script.py` for the literal task values
- `/webwright:craft <task>` — produces a **reusable CLI tool**: parameterised function with Google-style `Args:` docstring and `argparse` wrapper, so you can rerun with different arguments later

When you install Webwright into Claude Code, the host agent drives the loop natively — no extra LLM API key, no extra cost beyond your existing subscription. Hosts that read PNG screenshots natively (Claude Code, Codex) skip Webwright's `image_qa` / `self_reflection` tools entirely.

This is the [[skills-standard]] pattern paying off in real life: one folder, four hosts, zero porting.

## Where it sits in the browser-agent landscape

| Tool | Paradigm | State lives in | Action space |
|------|----------|----------------|--------------|
| Stagehand (Browserbase) | Hybrid: code + NL primitives (`act`/`extract`/`agent`) | Browser session | Playwright code, or NL → translated Playwright |
| [[vercel-agent-browser]] | Discrete CLI subcommands (`open`, `click @e2`, `snapshot`) | Browser session (held by daemon across CLI calls) | Indexed actions on accessibility-tree refs |
| browser-use | Autonomous LLM loop over DOM/AX snapshots | Browser session | LLM picks one indexed click/type per step |
| **Webwright** | **Coding agent with a terminal; browser is spawned and discarded** | **Local workspace — code, screenshots, logs** | **Free-form Python (writes Playwright scripts itself)** |

The key contrast: [[vercel-agent-browser]] solves the same surface problem (browser primitives for LLMs) but in the opposite direction. Vercel's bet is *make the browser session better* — stable `@e1` refs, content boundaries, a persistent daemon. Webwright's bet is *make the browser session disposable* — keep the code, throw the browser away.

Both can be right depending on the task. Short, stateful interactions (logged-in dashboards, multi-tab workflows where session continuity matters) favour Vercel's daemon model. Long-horizon, repeatable, parameterisable tasks (book a flight, scrape this listing, fill this form for 500 records) favour Webwright's script model. For our [[browser-automation-cdp|persistent Chrome + CDP setup]], Vercel's primitives map naturally; Webwright would be the layer on top when we want a reusable script as the deliverable.

## Connections

- [[vercel-agent-browser]] — opposite stance: stable refs + persistent daemon. Webwright says throw the browser away, keep the code. Both rewrite browser primitives for LLMs, just in opposite directions
- [[browser-automation-cdp]] — our personal CDP + persistent Chrome rig. Webwright's loop could sit on top: agent writes a script against our authenticated Chrome instance, script becomes the reusable artifact
- [[hermes-agent]] — Webwright ships as a Hermes skill out of the box. Same `skills/webwright/` folder, no duplication
- [[skills-standard]] — the SKILL.md cross-host pattern is what makes one folder install into Claude Code, Codex, OpenClaw, and Hermes simultaneously
- [[claude-code-anatomy]] — same minimal-harness aesthetic: ~1.5k LoC, flat loop, run-artifacts on disk. Webwright is "Claude Code's design philosophy applied to web automation"
- [[harness-engineering-summary]] — Webwright is itself a harness study: the action-space choice (free-form Python vs indexed clicks) is the load-bearing decision, not the model
- [[agent-toolkit-landscape]] — browser-agent slot in the broader catalog; Webwright is the new entrant pushing the code-as-action axis
- [[agent-native-builder]] — opposite axis on the same "agent acts, not chats" idea: Webwright scripts an external, disposable browser; agent-native makes the agent a first-class actor inside your own app's action layer
