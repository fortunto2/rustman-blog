---
type: concept
description: "AI platform that turns everyday moments into meaningful montages. Rust core (video-analyzer, 11 crates), mobile-first, WASM for web. The original dream since 2014, 1M+ users."
title: "Life2Film — turn everyday moments into meaningful montages"
created: 2014-01-01
tags: [creative, project, ios, life2film, video, ai, montage, flagship, rust, wasm]
project_type: app
course_module: 7
course_order: 1
publish: true
publish_as: project
source_url: "https://life2film.com"
index_line: "Life2Film: the original dream (2014), video montage with on-device AI, rebuilding v2"
index_section: "project"
---

# Life2Film

AI platform that automatically creates beautiful films from your everyday videos — selecting worthy moments, matching music, preserving memories and emotions.

> "Start collecting experiences, not money. You are the sum of your experiences... Only your memories and impressions don't lose their value"

<iframe width="100%" height="400" src="https://www.youtube.com/embed/HpqiNjCTVIU" title="LIFE.FILM — Turn Your Life to Film" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="border-radius: 8px; margin-bottom: 1.5rem;"></iframe>

## The Problem

- Only 1% of people upload to YouTube. Most recorded videos sit unwatched
- Storage fills up, memories fade. Children grow up as if they were never small
- Creating a nice montage takes hours of editing skill most people don't have

## The Solution

AI watches your videos, finds the best moments, adds music, and creates a film. No editing skills, no equipment, no budget. Minutes, not hours.

**Fractal Hypervideo** — combine multiple videos into one. Daily films → monthly → yearly. Dive into any moment infinitely deep, like a time machine for your life.

## Architecture

**Core: video-analyzer** — Rust workspace with 11 crates. Frame-level video analysis engine:

| Crate | What it does |
|-------|-------------|
| `va-domain` | Core types, timeline, segments |
| `va-scene` | Scene detection, shot boundaries |
| `va-audio` | Audio analysis, beat detection |
| `va-features` | Visual features, quality scoring |
| `va-director` | AI montage decisions, story structure |
| `va-project` | Project management, export |
| `va-audio-library` | Music matching, mood detection |
| `va-stt` | Speech-to-text |
| `va-otio` | OpenTimelineIO integration |
| `va-wasm` | WebAssembly build for browser |
| `va-gui-dioxus` | Desktop GUI (Dioxus/Rust) |

**Platforms** (rollout order):
1. **Mobile** (first) — iOS beta, then Android
2. **Desktop** — Rust native (Dioxus) or Swift (macOS)
3. **Web** — WASM build of va-core in browser

## Vision

From [life2film.com/about](https://life2film.com/about):

- **Life Calendar** — 90 years × 52 weeks = 4,680 cells. Each recorded week fills a cell. How many of your weeks have you preserved?
- **Collaborative editing** — group vacation? Everyone uploads, AI creates one combined film
- **LifeGO** — geotag gamification: filming in rare locations yields higher rewards
- **Creator ecosystem** — Creator, Director, Editor, Musician, Sponsor, Moderator roles

## Why Rust

The original Life2Film (2014) was Python + Yahoo's [hecate](https://github.com/yahoo/hecate) for video analysis. Rewrote it in Rust and got:

- **100x more convenient** — direct FFmpeg API access, frame processing in memory, entire pipeline in one binary
- **One binary, every platform** — compile to iOS, Android, desktop, or WASM for browser. Same core algorithm everywhere
- **Rust + Swift = Apple must-have** — Rust core for performance, Swift for native UI and Apple APIs
- **DDD finally works** — strict types, ownership, algebraic data types. What I was forcing with Pydantic in Python is native in Rust

Cross-platform bridges: WASM for web, [PyO3](https://pyo3.rs/) for Python, [UniFFI](https://mozilla.github.io/uniffi-rs/) for Swift/Kotlin/C#.

> "Rust — the programming language and my short name (Rust'am). With agents, the more typed and strict the language, the better. Python is for humans — but IDEs aren't needed anymore."

## The Story

Started in 2014 as a website. The first version reached 1M+ users, but the technology wasn't ready, and that version closed in 2021; in that form it no longer works. The dream never left: Life2Film is rewritten from scratch around the same idea, as a mobile-first app. SuperDuperAI is the second chapter. Now AI can do what was impossible then: understand video content, detect emotions, match music, create meaningful edits automatically.

## Stack

- **Core:** Rust (video-analyzer workspace, 11 crates)
- **Mobile:** Swift (iOS), Kotlin (Android planned)
- **Web:** WASM (va-wasm) + Next.js
- **Desktop:** Dioxus (Rust) or native Swift
- **AI:** on-device where possible ([[apple-on-device-ai]])

## Links

- **[Life2Film Studio](https://github.com/fortunto2/life2film-landing/releases/latest)** — the free desktop app for Apple Silicon: `brew install --cask fortunto2/tap/life2film-studio`
- [[creative-video-with-claude]] — how I cut nine days in Chicago with it and Claude, step by step
- [life2film-engine on npm](https://www.npmjs.com/package/life2film-engine) — the analysis core (beats, shots, frame quality) as WebAssembly, to build into your own code
- [life2film.com](https://life2film.com)
- [About — full vision](https://life2film.com/about) — Life Calendar, ecosystem, Fractal Hypervideo
- [[origin-story]] — the personal story behind Life2Film
- [[project-superduperai]] — the studio rebuilding the dream
- [[privacy-as-architecture]] — on-device video processing, your memories stay yours
- [[filmcraft-agent-built-editor]] — an open Premiere-class editor written by agents in a month; why breadth is no longer the moat and judgment is
- [[claude-subscription-boundary]] — why the in-app LLM key has to be BYOK on an API key, not a Claude subscription login
- [[neu-wave-ai-film-festival-2026]]: at the Neu Wave AI Film Festival (Santa Monica, Oct 2026) the shortage the stage named was directors, not generators, which is the layer Life2Film works on
- [[la-tech-week-video-agents-live-worlds-2026]]: two LA Tech Week evenings on 15 Oct 2026, agents that assemble a finished ad and live models that generate a world, with story and editing still the bottleneck
