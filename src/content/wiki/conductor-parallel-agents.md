---
type: concept
title: "Parallel coding-agent orchestrators — Conductor and the 2026 ecosystem"
description: "Conductor, Superset, Emdash, Claude Squad, Parallel Code, ccswarm, Vibe Kanban, Agent Orchestrator: the category of tools that run many Claude Code / Codex / Gemini CLI agents in isolated git worktrees. Addy Osmani's 'conductors to orchestrators' frame: the shift from human dirigent to autonomous planner."
created: 2026-04-22
updated: 2026-04-22
tags: [agents, orchestration, claude-code, codex, worktree, parallelism, melty-labs, superset, emdash]
publish: true
---

# Conductor — Orchestrate, Don't Supervise

[Conductor](https://www.conductor.build/) (by Melty Labs, $22M Series A) is a Mac app whose single claim is: you should be running **many** coding agents at once, not one. The product is a GUI wrapper around the same pattern Claude Code's power users already do manually — spawn an agent per task in its own git worktree — but productized so you stop hand-managing the branches.

Quote from a testimonial that sums up the bet: *"feels like going from typing with two fingers to having eight arms."* You become the conductor; the agents are the section.

## What it actually does

- **Git worktree per task.** Each agent gets an isolated workspace off the same repo. No branch-switch churn, no conflicts while an agent is mid-edit, and you review merges from the conductor UI.
- **Multi-model in the same workflow.** Claude Code *and* Codex in the same session — pick whichever model fits the task, or run the same task with both and compare diffs. Uses your existing Claude Pro/Max or API key, nothing new to configure.
- **Unified review/merge.** The whole point of parallelism is that you can't watch 6 agents at once. Conductor gives one pane where each agent's diff shows up, you skim, you merge the ones that worked.
- **Local.** After clone, it runs on your Mac. No SaaS middleman for the code.
- **Mac-only.** Not a browser app, not cross-platform. This ships the unopinionated pieces (Claude Code, Codex) inside an opinionated shell.

## Customer signal

Linear, Vercel, Notion, Ramp, Life360, Square, Spotify. This is not 143k-star indie toolchain territory — this is what engineering teams at tooling-literate companies are actually buying. That matters because the parallel-agents thesis has been floating around for a year and this is the first execution that teams with money are choosing.

## Why the pattern works

Coding is throughput-bound on the *human*, not the agent. One Claude Code session makes you wait on generation, lint, tests, and your own review. Stack six sessions and your bottleneck becomes: *did you decompose the work well enough that six things can run in parallel without stepping on each other?* Worktree isolation removes the git stepping-on-toes problem. Your remaining job is task decomposition and merge review — which is what a senior engineer does anyway.

This is the same shift that Symphony (OpenAI) and GSD-2 bet on, framed as *teams manage work, not agents*. See [[agent-toolkit-landscape]]'s **project managers** category: Conductor is the GUI-first variant, Symphony is the Elixir-first variant, GSD-2 is the milestone/slice/task structured variant. Different execution, same bet.

## Where this fits in our framing

- The [[claude-code-anatomy|98.4%-infrastructure thesis]] predicts this: if the model is 1.6% of the system, multiplying model instances costs almost nothing compared to the harness that contains them. The hard part is the containment (worktrees, diff review, merge), not the generation — exactly what Conductor productizes.
- Dmitry Kovalenko flagged it in [[fff-agent-file-search|podcast #82]]: *"все ссутся по кондактору сейчас"*. A signal the idea is cresting beyond early adopters.
- The gap vs our [[project-solo-factory|solo-factory]] flow: we chain skills sequentially for a single agent. Conductor chains **agents concurrently**. These compose: one Conductor lane could run `/research` → `/validate` → `/scaffold` while another lane builds a different project entirely. Worth trying for multi-project portfolio work ([[portfolio-approach]]).
- Complement, not competitor, to [[project-rust-code]]'s local agent — Conductor is the orchestrator shell, the agents inside are still Claude Code / Codex.

## The tradeoff to watch

The value is real but bounded: the moment two lanes need to modify overlapping code, worktree isolation doesn't save you — you get six drift-parallel solutions to the same problem, and the merge review becomes the new bottleneck. The skill this forces is **task decomposition that doesn't overlap**. Buy Conductor if decomposition is your strength; skip it if your work is one-PR-at-a-time.

## The 2026 ecosystem

Conductor wasn't first and isn't alone. Once "agent-per-worktree" landed as a pattern, an entire category appeared in a few months. The axes that matter: open-source vs closed, Mac-only vs cross-platform, Claude-Code-only vs agent-agnostic, terminal vs GUI, orchestrator-managed vs you-decide.

| Tool | License | Platform | Agents | Shape | Distinctive |
|------|---------|----------|--------|-------|-------------|
| **[Conductor](https://www.conductor.build/)** (Melty Labs, YC S24) | Closed, free | macOS (Apple Silicon) | Claude Code, Codex | GUI | Deep Claude Code integration, automated spec/plan review for logic errors, race conditions, null-pointer risks |
| **[Superset](https://github.com/superset-sh/superset)** | Apache-2.0 | macOS, Linux, Windows | Any CLI agent (Claude Code, Codex, Aider, Cursor Agent, Gemini CLI, Copilot, OpenCode…) | Editor-style desktop | 3.2k★ in 3 days; "code editor for the AI agent era," zero telemetry, BYO agent |
| **[Emdash](https://emdash.sh/)** (YC W26) | MIT | macOS, Linux, Windows | 22+ agents | Desktop + SSH remote | Only one with native Windows/Linux and SSH remote; first-class Linear/Jira/GitHub issue integration |
| **[Claude Squad](https://github.com/smtg-ai/claude-squad)** | Open-source | Cross-platform | Claude Code | Terminal (tmux + worktrees) | The keyboard-only lineage; `smtg-ai` |
| **[Parallel Code](https://github.com/johannesjo/parallel-code)** | Open-source | Desktop | Claude Code, Codex, Gemini CLI | GUI | Side-by-side view of 3 agents tackling the same task — useful for A/B model comparison |
| **[Agent Orchestrator](https://github.com/ComposioHQ/agent-orchestrator)** (Composio) | Open-source | — | Multiple | Autonomous | Plans tasks, spawns agents, handles CI fixes and merge conflicts without a human in the loop |
| **[ccswarm](https://github.com/nwiizo/ccswarm)** | Open-source | Cross-platform | Claude Code | Terminal | Each agent is role-specialized (backend, frontend, review) |
| **[Vibe Kanban](https://github.com/)** | Open-source | Web/Desktop | Multiple | Kanban UI | Task cards → lanes → agents; the Trello metaphor for agent work |
| **Google Antigravity Mission Control** | Closed | Browser | Google's agents | Cloud | The incumbent entry — Google's bet on the category |
| **[Workstream Labs](https://github.com/workstream-labs/workstreams)** | Open-source | Desktop | Multiple | IDE-style | "IDE for parallel AI coding agents" positioning |

Awesome list: [andyrewlee/awesome-agent-orchestrators](https://github.com/andyrewlee/awesome-agent-orchestrators).

### The conceptual frame — Addy Osmani's "conductors to orchestrators"

Osmani's [O'Reilly essay](https://www.oreilly.com/radar/conductors-to-orchestrators-the-future-of-agentic-coding/) names the transition this category captures. A **conductor** is a human dirigent — you assign a task to each agent, watch the lanes, merge at the end. An **orchestrator** is the *planner itself*: decompose the goal, fan out agents, resolve merge conflicts, re-plan on failure, surface only exceptions to you.

Today's products are mostly conductor-shaped (Conductor, Superset, Emdash — you still drive). Composio's Agent Orchestrator is the first visible step toward orchestrator-shaped (autonomous planning and CI healing). The category's trajectory is clearly toward the orchestrator end — the same arc [[claude-code-anatomy|98.4% infrastructure]] predicts: once model instances are cheap, the planning and merging logic in the harness becomes the real product.

### How to choose (April 2026)

- **Claude Code on Mac, want it to just work** → Conductor. Closed, free, polished.
- **Any agent, any OS, open-source, no lock-in** → Superset.
- **Linux/Windows or SSH remote dev, Linear/Jira integration** → Emdash.
- **Terminal-first keyboard driver** → Claude Squad or ccswarm.
- **Same task across multiple models for A/B comparison** → Parallel Code.
- **Want the agent to plan and fix CI itself (less human in the loop)** → Composio Agent Orchestrator.
- **Team workflow with explicit cards** → Vibe Kanban.

For our own setup: Superset looks the closest match — agent-agnostic (we run Claude Code + Codex + our own Rust agent), open-source, cross-platform. Worth a spike on one real project before committing.

## See Also

- [[agent-toolkit-landscape]] — Conductor belongs in the "project managers" category alongside Symphony and GSD-2
- [[claude-code-anatomy]] — the harness-eats-the-model thesis explains why orchestrating model instances is easier than improving the model
- [[fff-agent-file-search]] — Kovalenko's podcast noted Conductor's momentum in the agent-tooling ecosystem
- [[portfolio-approach]] — multi-lane concurrency fits multi-project portfolio work
- [[project-solo-factory]] — sequential skill pipeline; Conductor is the concurrent orchestration shell that could contain it
- [[project-rust-code]] — local agent at the node level; Conductor would be the orchestration layer above
