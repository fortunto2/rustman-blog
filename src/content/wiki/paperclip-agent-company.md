---
type: concept
title: "Paperclip — the org chart as the missing layer above coding agents"
description: "Paperclip (MIT, 75k stars, Mar 2026) wraps any agent runtime in a company: org chart with reporting lines, per-agent budgets that hard-stop, DB-backed heartbeats, atomic task checkout, immutable audit. 'If OpenClaw is an employee, Paperclip is the company.'"
created: 2026-07-30
tags: [agents, orchestration, org-chart, budgets, heartbeats, governance, openclaw, claude-code, multi-agent]
publish: true
source_url: "https://github.com/paperclipai/paperclip"
index_line: "Paperclip (MIT, TypeScript, 75k★ in 5 months): wraps Claude Code/Codex/Cursor/OpenClaw in a company — org chart with reporting lines, per-agent monthly budgets that hard-stop, DB-backed heartbeat queue, atomic task checkout, goal ancestry, immutable audit, multi-company isolation. Five mechanics to steal; 'zero-human' is marketing"
index_section: "concept"
---

# Paperclip — the company around the agents

[paperclipai/paperclip](https://github.com/paperclipai/paperclip) · MIT · TypeScript · **75 090★ / 13 977 forks** · created 2026-03-02, pushed daily since. Author: the pseudonymous **@dotta**; the repo now sits under Paperclip Labs with 100+ contributors. Docs at [docs.paperclip.ing](https://docs.paperclip.ing).

Their one-liner is the whole thesis: **"If OpenClaw is an _employee_, Paperclip is the _company_."**

It is not another agent runtime. It's a Node.js server + React UI that sits *above* the agents you already run and gives them the thing scripts can't: roles, reporting lines, budgets, approval gates, and an audit trail. As the author put it — *"you can only manage a rats nest of shell scripts and HEARTBEATS.md for so long before you realize there's got to be a better way."*

## The workflow

| | Step | Example from the README |
|---|---|---|
| 01 | Define the goal | *"Build the #1 AI note-taking app to $1M MRR."* |
| 02 | Hire the team | CEO, CTO, engineers, designers, marketers — any bot, any provider |
| 03 | Approve and run | Review strategy, set budgets, hit go, monitor from the dashboard |

You hire a **CEO agent**; it drafts a hiring plan and delegates to specialists. You sit above all of it as **the board** — approving hires, budgets, and anything you've flagged as needing sign-off. Delegation then flows up and down the org chart on its own.

## Bring your own agent

Adapters for **OpenClaw, Claude Code, Codex, Cursor, bash CLI agents, and HTTP/webhook bots**, plus external adapter plugins. The admission rule: *"If it can receive a heartbeat, it's hired."*

This is the part that makes it interesting for us — it composes with the runtime already on the machine instead of replacing it. The README's own qualifying signal is uncomfortably familiar: *"You have 20 simultaneous Claude Code terminals open and lose track of what everyone is doing."*

## The four pillars

| Pillar | For whom | Covers |
|---|---|---|
| **Agentic Task Manager** | everyone, daily | tickets, approval & review gates, proactive coworkers, verify from diffs/screenshots/tests |
| **Org Chart for Agents** | managers | mixed human+agent hierarchy, delegation, specialization, who-can-do-what, scoped secrets |
| **Agent Employee Training** | enablers | Skill Studio, org-wide shared skills, evals & saved test runs, **performance reviews for agents** |
| **Agentic OS** | platform | cross-provider runtime, sandboxing, MCP servers, SSO/RBAC/cost controls, internal trace collection |

Twelve server-side subsystems back this: Identity & Access, Work & Tasks, Heartbeat Execution, Governance & Approvals, Org Chart & Agents, Workspaces & Runtime, Plugins, Budget & Costs, Routines & Schedules, Secrets & Storage, Activity & Events, Company Portability.

## What to steal

The engineering claims are more valuable than the branding. Five mechanics worth lifting regardless of whether we ever run Paperclip:

1. **Atomic task checkout + budget enforcement in one transaction.** No double-work when several agents wake at once, no runaway spend racing the check. This is the correct answer to the failure mode [[conductor-parallel-agents|parallel orchestrators]] mostly leave to the human.

2. **Per-agent monthly budget that hard-stops.** Not a warning — the agent stops. *"Runaway loops waste hundreds of dollars of tokens and max your quota before you even know what happened"* is a real failure we've hit; a hard ceiling per agent is the fix, and it belongs in our own tooling.

3. **Goal ancestry carried on every task.** Tasks hold company → project → goal → parent links, so an agent always sees the *why*, not just a title. Our skills pass artifacts forward but never the chain of intent — this is a concrete upgrade to [[project-solo-factory|the pipeline]].

4. **DB-backed heartbeat queue with coalescing**, plus persistent agent state across heartbeats and automatic recovery of orphaned runs. Compare with the [[background-jobs-ladder|cron→Workers→Prefect ladder]]: this is rung two done properly, and it beats a pile of systemd timers.

5. **Portable company templates.** Export/import orgs, agents, and skills with **secret scrubbing and collision handling** — the same idea as our stack templates, but for an entire org definition. Also: config changes are revisioned and bad ones roll back.

Runner-up worth noting: **isolated execution workspaces** built on git worktrees and operator branches, with dev servers and preview URLs attached — the [[conductor-parallel-agents|worktree-per-agent]] pattern, but as infrastructure rather than a GUI convenience.

## Where the hype ends

The **"zero-human company"** framing is marketing. In practice a Paperclip company always has a human at the top: you're the board, approving hires and budgets while agents work in between. Zero *busywork* is accurate; zero humans is not.

Independent testing lands harder. One reviewer built a company over a weekend and got *"an AI-generated brand, a marketing strategy full of hallucinated statistics, and a website that looked like someone fed a blender a stack of Bootstrap templates."* AI automation specialist Nick Puru calls the broader pattern **"productivity theater"** — the seductive belief that organizing tasks equals achieving results. Hallucinated numbers presented as fact, unreviewed code reaching production, security and logic errors: all still on the human.

The honest read: a real architectural trend (org-level orchestration is genuinely missing) wrapped in overpromising branding. The org chart solves *coordination*, not *quality* — quality still needs [[deepeval-llm-testing|evals in CI]] and review gates, which is exactly why their fourth pillar bothers to include evals and agent performance reviews.

## Why it matters for a solo builder

Two things, neither of which is "fire yourself":

- **Multi-company isolation on one deployment** — every entity is company-scoped with separate data and audit trails. That's a [[portfolio-approach|portfolio of small bets]] with one control plane, which maps directly onto how we run several projects at once.
- **Cost as a first-class primitive.** Budgets, throttling, and cost events per agent turn "how much did this experiment burn?" into a number on a dashboard instead of a surprise invoice — relevant to [[kill-iterate-scale|kill/iterate/scale thresholds]], which need per-project cost to be decidable.

Install is a single command (`npx paperclipai onboard --yes`, Node 20+, pnpm 9.15+), self-host only, no account required, two deployment modes (trusted local or authenticated). A "Clipmart" template marketplace — content agencies, trading desks, dev shops — is announced but not shipped.

## Links

- [paperclipai/paperclip](https://github.com/paperclipai/paperclip) — the repo (verify the org: lookalikes exist)
- [docs.paperclip.ing](https://docs.paperclip.ing) — docs
- [[agent-toolkit-landscape]] — where it sits in the ecosystem
- [[conductor-parallel-agents]] — the layer below: many agents in worktrees, no org
- [[project-solo-factory]] — our pipeline: skills as the unit, not roles
- [[background-jobs-ladder]] — heartbeats vs the scheduling ladder
- [[agent-self-discipline]] — limits and drift, the manual version of budget enforcement
- [[harness-engineering-summary]] — approval gates and audit as harness, not prompt
