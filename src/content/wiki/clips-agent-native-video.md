---
type: concept
title: "Clips — an agent-legible Loom replacement"
description: "Builder.io's Clips is a free, open-source, self-hostable Loom alternative built agent-native: every clip exposes an API + metadata so an agent can read it from a URL — seeing and hearing everything in the video at any timestamp, not just the transcript."
created: 2026-06-24
tags: [agents, video, screen-recording, open-source, builder-io, agent-legible, loom]
publish: true
source_url: "https://github.com/BuilderIO/agent-native"
---

# Clips — Video That an Agent Can Actually Watch

Clips is the flagship template of [[agent-native-builder|Builder.io's Agent-Native framework]]: a **free, open-source replacement for Loom, built for agents**. Where Loom is a closed SaaS that hands a human a video link, Clips makes the video a first-class artifact an AI agent can consume directly.

## The core insight: video as an agent-readable surface

The distinguishing move isn't "open-source Loom" — it's that **an agent understands a Clip just from its link**. Every clip exposes an API and metadata, so the agent can inspect its contents without a human transcribing or summarizing. And crucially, the agent doesn't just read a transcript: it **sees and hears everything happening in the video at any moment in time**. The clip is queryable across the full audiovisual track, addressable by timestamp.

That turns a screen recording into a precise input channel for agentic work. You record a bug report, a piece of feedback, or a walkthrough analysis, and hand the link to an agent — which then improves the product, fixes the bug, or revises the report from what it actually observed on screen. This is the same "agent acts inside the real thing, not a chat beside it" thesis as the parent framework, applied to the video medium: the recording stops being an opaque blob and becomes a structured, machine-legible source of truth.

## Ownership and self-hosting

The other half of the pitch is control. **The software is yours** — nobody hikes the price overnight the way Loom did. There's a free hosted version to start, and you can fork and self-host the whole thing. Because the built-in agent can edit its own code, you adapt the app to your workflow instead of waiting on a vendor roadmap. You can also import existing Loom videos by URL and upload your own files, so migration isn't a wall.

## Why it's filed separately from the framework

[[agent-native-builder]] is the *pattern* — define an action once, it powers UI + agent + MCP + A2A + CLI. Clips is the *proof*: a concrete, useful product that demonstrates what "agent-native" buys you in a medium (video) where agent-legibility is normally near-zero. The reusable lesson lives here: **if you want an agent to act on a thing, make the thing addressable and queryable by URL — expose its full content through an API, not just a human-facing rendering.**

## Connections

- [[agent-native-builder]] — Clips is the headline template of this framework; it's the clearest demonstration of the unified-action, agent-as-equal-citizen thesis.
- [[project-life2film]] — also treats video as a first-class, AI-processed medium (on-device montage). Clips is the inverse use case: video as *input* for an agent rather than AI-generated *output*.
- [[webwright-code-as-action]] — shares the "make the environment legible to the agent" instinct: Webwright keeps the run as readable code; Clips keeps the recording as a queryable audiovisual API. Both beat the opaque-blob default (a click log, a video file).
