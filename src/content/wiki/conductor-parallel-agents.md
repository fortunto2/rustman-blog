---
type: concept
title: "Conductor — parallel coding agents with git worktree isolation (Melty Labs)"
description: "Conductor.build: Mac app for running many Claude Code and Codex agents in parallel, each isolated in its own git worktree. $22M Series A, used at Linear/Vercel/Notion/Ramp. Thesis: you orchestrate tasks, agents do the typing."
created: 2026-04-22
tags: [agents, orchestration, claude-code, codex, worktree, parallelism, melty-labs]
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

## See Also

- [[agent-toolkit-landscape]] — Conductor belongs in the "project managers" category alongside Symphony and GSD-2
- [[claude-code-anatomy]] — the harness-eats-the-model thesis explains why orchestrating model instances is easier than improving the model
- [[fff-agent-file-search]] — Kovalenko's podcast noted Conductor's momentum in the agent-tooling ecosystem
- [[portfolio-approach]] — multi-lane concurrency fits multi-project portfolio work
- [[project-solo-factory]] — sequential skill pipeline; Conductor is the concurrent orchestration shell that could contain it
- [[project-rust-code]] — local agent at the node level; Conductor would be the orchestration layer above
