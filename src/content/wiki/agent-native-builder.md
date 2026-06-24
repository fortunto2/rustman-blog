---
type: concept
title: "Agent-Native — UI and agent as equal citizens (Builder.io)"
description: "Builder.io's Agent-Native framework: define an action once, it powers UI, agent, HTTP, MCP, A2A, and CLI. The agent acts inside the real app instead of chatting next to it; one SQL-backed state syncs both surfaces in real time."
created: 2026-06-24
tags: [agents, frameworks, mcp, a2a, unified-actions, builder-io, harness-engineering]
publish: true
source_url: "https://github.com/BuilderIO/agent-native"
---

# Agent-Native — One Action, Every Surface

[BuilderIO/agent-native](https://github.com/BuilderIO/agent-native) is Builder.io's open-source framework for apps where the AI agent and the UI are **equal citizens of one system**, not two layers bolted together. Their one-line thesis: *"agents that act inside real apps, not just chat next to them. Every action works both ways: click it or ask for it."*

## The core pattern: unified actions

The whole framework rests on one move — **you define an action once, and it serves every surface**: UI buttons, the agent's tool list, an HTTP endpoint, an MCP server, an A2A (agent-to-agent) call, and the CLI. No separate REST controller, no separate tool schema, no separate CLI command that all drift out of sync. The action *is* the contract, and the six surfaces are projections of it.

This is the architectural inverse of the common "chatbot in a sidebar" pattern, where the agent calls APIs the UI also calls, and you maintain two parallel code paths that disagree over time. Here there's one path. State is SQL-backed (Drizzle ORM), so "one database, one state — changes from either side show up instantly." The agent knows what the user is currently viewing (context-aware), can tag and coordinate with other agents, and can even add features / fix bugs / refine the UI over time (self-improving).

## Distribution model: clone, don't scaffold

Builder.io ships production templates (Clips, Plans, Design, Content, Slides, Analytics) that are **"cloneable, not scaffolded — except you own the code."** The flagship is [[clips-agent-native-video|Clips]] — an open-source, self-hostable Loom replacement where an agent reads a video straight from its URL (full audiovisual content, not just the transcript); it's the clearest proof of what the framework buys you. Backend-agnostic (any Nitro-compatible host). It also exposes "skills" that plug into Claude Code, Cursor, and Copilot (visual planning, PR recap), so the framework meets you inside the agent harness you already run.

## How it relates to what's in the wiki

- [[agent-toolkit-landscape]] — extends the "Agent Frameworks" row of that map with a category the matrix doesn't yet name: **isomorphic action frameworks**, where the differentiator isn't orchestration or memory but collapsing UI/API/agent/MCP/CLI into one definition. Worth adding as its own line.
- [[webwright-code-as-action]] — both reject "agent chats *about* the app." But they pick opposite axes: Webwright makes the agent **write code that drives a disposable browser**; agent-native makes the agent a **first-class actor inside a persistent app's own action layer**. Webwright = the app is external and you script it; agent-native = the app is yours and the agent shares its verbs.
- [[skills-standard]] — agent-native's "skills for Claude Code / Cursor / Copilot" ride the same SKILL.md cross-platform standard, confirming the pattern that frameworks now ship *both* a runtime and a thin skill layer to hook into whatever harness the developer already uses.

## Why it matters for solo builders

The unified-action idea is a real DRY win for the kind of app a solo dev ships: you'd otherwise hand-write the button handler, the API route, the MCP tool, and the CLI command four times. If the framework delivers, the cost of "make this app agent-operable" drops to near zero — the agent gets every capability the UI has, for free, the moment you define it once. The open question (unverified here) is lock-in: how much of your app's shape the action abstraction dictates, and how cleanly you can leave.
