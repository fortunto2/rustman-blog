---
type: concept
title: "Cloudflare Computer — the agent's computer is an isolate, the container is the escape hatch"
description: "Cloudflare's @cloudflare/computer gives each agent a durable SQLite filesystem on a Durable Object and attaches compute to it — a V8 isolate by default, a Linux container only when the work demands one. The argument is arithmetic: there is not enough compute on Earth to give every user's agent a container."
created: 2026-08-04
tags: [agents, cloudflare, isolates, containers, durable-objects, harness-engineering, agent-runtime, filesystem]
publish: true
source_url: "https://blog.cloudflare.com/cloudflare-computer/"
index_line: "@cloudflare/computer (open source, early preview): durable SQLite filesystem on a Durable Object, compute attaches to it — isolate by default (just-bash translates shell to JS in Dynamic Workers), Cloudflare Container via FUSE mount only when Linux binaries are needed. Target: <10% of agent work needs a container. The model picks the backend at runtime via exec(cmd, {backend}). Inverts state/compute: the filesystem persists, the computer is disposable"
index_section: "concept"
---

# Cloudflare Computer — the agent's computer is an isolate

[@cloudflare/computer](https://github.com/cloudflare/computer) (open source, early preview) is an agent runtime built on a claim about arithmetic rather than about developer experience: *"there's nowhere near enough compute in the world for every company to give each of their users' agents their own containerized compute environment."* If agents are going to be numerous — one per user, or several — the per-agent container is not a design choice that can survive its own success.

The industry already made one split: the **brain** (the agent loop) separated from the **hands** (a sandbox where commands run). Cloudflare's move is to split the hands again — into *state* and *compute*.

## The filesystem is durable, the computer is disposable

Normally a filesystem is a property of a machine: the container owns the disk, and when the container dies the state dies with it, so you keep the container alive. Here the relation is inverted. The filesystem is a **SQLite-backed virtual filesystem living on a Durable Object** — hydrated from a git repo, a storage bucket, or arbitrary files, exposed both through a direct API and a `node:fs`-compatible wrapper. Compute *attaches* to it:

- **Isolate backend** — the filesystem is available directly through Worker bindings. Shell commands are translated to JavaScript by [just-bash](https://justbash.dev/) and run in Dynamic Workers. No Linux, no container, no cold-start of a machine.
- **Container backend** — a full Linux userland with npm, package managers, test runners. The same filesystem is mounted over **FUSE** with bidirectional sync.

Both are driven through one `exec(string, options)` interface, so the agent doesn't code against two worlds. Durable Objects supply what makes this hold together: horizontal scale, state storage, and hibernation when idle — an agent that isn't working costs nothing while keeping its computer intact.

This is the same inversion [[webwright-code-as-action]] performs on browsers — there the browser is disposable and the workspace (code, logs, screenshots) is the persistent state. One layer down, the *computer* becomes disposable and the filesystem is what persists. Worth noticing when the same reversal shows up twice at different altitudes: it's probably the shape of the thing, not a trick.

## The model chooses how much the command costs

The `exec` tool takes a `backend` argument, and the tool descriptions steer the model toward isolates for file work and containers only when a Linux binary is genuinely required. That is a **cost decision delegated to the LLM at runtime** — tool design in the sense of the pricing dimension, not just the capability dimension. Cloudflare's stated target: *an agent where a container is required for less than 10% of its work*, with coding, audio/video manipulation, and document creation all handled by isolates.

The interesting risk sits right there. The steering is prose in a tool description; the bill is real. Any harness built on this wants a metric for backend mix — what fraction of `exec` calls escalated to a container, and whether that fraction drifts as the model or the prompt changes.

## Why this is not the same thing as sandboxing

[[agent-sandboxing]] covers the other end of the spectrum: Lima VMs on macOS, isolation because you don't trust the agent with your filesystem. The constraint there is **trust**, the unit is one developer's machine, and a VM per agent is perfectly affordable. Here the constraint is **unit economics** at billions of agents, and isolation is a side effect of the cheap thing happening to also be the isolated thing. Same word, different problem — and the designs diverge accordingly: a VM keeps the whole machine, an isolate keeps only the filesystem.

## Why it lands for this stack

Cloudflare Workers is already Tier 1 in [[infra-two-tools]], so this is not a new vendor — it's a new primitive on infrastructure already in the stack. The honest read: it is an early preview from a company with a decade-long positional bet on isolates (Workers ~10 years, Durable Objects ~6), publishing the runtime that makes that bet pay off. The technical claim and the commercial interest point the same direction, which is a reason to check the numbers rather than a reason to dismiss them.

It also sharpens a [[harness-engineering-summary]] point: the harness is not only context and constraints, it's the *execution substrate*. Choosing where the agent's `exec` lands — and what it costs — is a harness decision that used to be invisible because there was only one answer.

## Connections

- [[webwright-code-as-action]] — the same state/compute inversion one layer up: disposable browser, persistent workspace
- [[agent-sandboxing]] — isolation driven by trust on one laptop, versus isolation driven by economics at scale
- [[infra-two-tools]] — Cloudflare Workers is already Tier 1 here, so this is a new primitive rather than a new vendor
- [[harness-engineering-summary]] — the execution substrate is part of the harness, not a detail beneath it
- [[agent-toolkit-landscape]] — belongs in the runtime/infrastructure row of the toolkit catalog
- [[claude-subscription-boundary]] — the concrete case for the container escape hatch: `claude -p` is a Node process, so a plain Worker cannot host it
