---
type: concept
title: "Buzz — give the agent a keypair, not a permission flag"
description: "Block's Buzz is a self-hostable Nostr relay where humans and agents share the same rooms: every message, patch, CI result and approval is a signed event in one log, so an agent is a member with its own key rather than a bot with API scopes."
created: 2026-08-18
tags: [agents, architecture, nostr, event-log, rust, self-hosted, identity, audit]
publish: true
source_url: "https://github.com/block/buzz"
index_line: "Block's Buzz (Apache 2.0, Rust/Axum + Postgres/Redis/S3): humans and agents in one Nostr relay. Agent = keypair + channel membership + audit trail, not a bot token with scopes. Chat, NIP-34 patches, CI, approvals, canvases are all signed events in one log, so search and audit come free. buzz-cli (JSON in/out) + buzz-acp bridges Goose/Codex/Claude Code. Branch-as-room. Team-scale infra, but the substrate idea transfers to solo"
index_section: "concept"
---

# Buzz — Give the Agent a Keypair, Not a Permission Flag

Every "AI in your workspace" product so far bolts the agent on as a bot: a token, a set of OAuth scopes, a webhook that posts as an app rather than a member. [block/buzz](https://github.com/block/buzz) (Apache 2.0, from Block) inverts that. Its one-line claim is *"the same affordances as a human teammate, the same audit trail, a different keypair."* The agent joins channels, opens repos, sends patches, edits canvases and runs workflows through the same protocol a human client uses. Access is scoped by identity, not by permission flags, which means you never have to reason about what "the bot" is allowed to do separately from what a person is allowed to do. There is one answer, and it's the membership list.

## The mechanism: one signed event log

What makes that possible is not a chat feature, it's the substrate. Buzz is a Nostr relay (NIP-01 protocol, NIP-42 auth, NIP-98 HTTP, NIP-34 git) where *everything* becomes a signed event in a single append-only log: messages, reactions, threads, DMs, git patches, CI results, workflow steps, code reviews, approvals. Two properties fall out of that for free, and they are exactly the two properties agent systems usually retrofit badly. **Audit** is not a separate log to correlate, it's the primary store. **Search** is one index over conversations, patches, workflow runs and approvals instead of five tabs that don't know about each other. Block's own framing of the alternative: *"seven tabs pretending they know about each other."*

The best concrete payoff is **branch-as-room**. A feature branch becomes a channel: patches land as NIP-34 events, CI posts results in it, an agent runs the first-pass review, and the decision to merge lives in the same place as the argument about it. Today that context is scattered across a forge, a Slack thread and a CI dashboard, and the reasoning is the part that gets lost. This is the missing storage layer for [[decision-traces-compound]]: traces only compound if they land somewhere retrievable, and a signed event log is a better home for them than three systems glued by a bot.

## The honest read for a solo operator

The stack is team-scale: Rust/Axum relay, Postgres for events plus FTS, Redis pub/sub, S3/MinIO for media via Blossom, Tauri + React desktop, Flutter mobile. Running that so an agent can talk to *you* is absurd. What transfers at solo scale is smaller and more useful: `buzz-cli` is agent-first with JSON in and JSON out so an LLM tool call maps to it directly, and `buzz-acp` bridges to Goose, Codex and Claude Code over ACP rather than inventing another integration per harness. Both are the same design discipline as [[agent-native-builder]]: define the surface once, let every consumer project onto it. Buzz applies it at org level (one event log, every participant), Builder.io applies it at app level (one action, every surface). Same inversion, different altitude.

It also lands on the right side of [[privacy-as-architecture]]: one relay URL is one community, self-hosted, on infrastructure you own, with the multi-tenant case keeping the same semantic boundary even when Postgres and object storage are shared. Alongside [[rust-agent-ecosystem]] it's a different species from the Rust agent servers listed there. Those run the agent; Buzz is the room the agent runs in. Status is candid in the README: relay, channels, canvases, media, search, audit log, desktop, `buzz-cli`, YAML workflows and git events work today; workflow approval gates, huddle lifecycle and push notifications are being wired up; web-of-trust reputation is still an opinion without code.

The one idea worth stealing even if you never run Buzz: **when you add an agent to a system, ask what identity it has, not what permissions it has.** If the answer is "a token in an env var", the audit trail is a fiction.
