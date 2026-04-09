---
type: concept
description: "AI platform that turns everyday moments into meaningful montages. Rust core (video-analyzer, 11 crates), mobile-first, WASM for web. The original dream since 2014, 1M+ users."
title: "Life2Film — turn everyday moments into meaningful montages"
created: 2014-01-01
tags: [project, ios, life2film, video, ai, montage, flagship]
project_type: app
course_module: 7
course_order: 8
publish: true
publish_as: project
source_url: "https://life2film.com"
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

Started in 2014. Built the first version, reached 1M+ users on iOS. Technology wasn't ready — closed in 2021. The dream never left. SuperDuperAI is the second chapter. Now AI can do what was impossible then: understand video content, detect emotions, match music, create meaningful edits automatically.

## Stack

- **Core:** Rust (video-analyzer workspace, 11 crates)
- **Mobile:** Swift (iOS), Kotlin (Android planned)
- **Web:** WASM (va-wasm) + Next.js
- **Desktop:** Dioxus (Rust) or native Swift
- **AI:** on-device where possible ([[apple-on-device-ai]])

## Links

- [life2film.com](https://life2film.com)
- [About — full vision](https://life2film.com/about) — Life Calendar, ecosystem, Fractal Hypervideo
- [[origin-story]] — the personal story behind Life2Film
- [[project-superduperai]] — the studio rebuilding the dream
- [[privacy-as-architecture]] — on-device video processing, your memories stay yours
