---
type: hub
title: "On-Device AI and Apple Apps"
description: "Models that run on the phone or the Mac instead of an API, and the Apple-platform engineering around my apps: what was measured, what shipped, and what broke."
created: 2026-11-01
tags: [hub, on-device, ios, apple, swift, privacy]
publish: true
index_line: "Hub: on-device AI + Apple apps. Apple 3B model plans 11/24 free-text vs a grammar-constrained form; Beat This! downbeat F 0.846 vs DSP 0.080; learned shot detectors on phone footage; Needle 45M tool picker (14 MB); Bonsai ternary 500M in browser; Swift 6 main-actor callback crash; analytics without cookies on one Cloudflare counter; KMP offline sync (Supabase+PowerSync)"
---

# On-Device AI and Apple Apps

A model on the device costs nothing per call, works offline and keeps the user's data where it is,
which is the architecture [[privacy-first]] asks for. The price is a small model and a hard platform.
These pages are what I measured getting real features to run that way, mostly inside
[[project-life2film]]. Shrinking a model for the device is the `solo:model-shrink` skill.

## Models on the device

- [[apple-on-device-ai]]: one on-device layer for all my iOS apps, built on Apple's Foundation Models
- [[apple-on-device-agent-sgr]]: Apple's 3B model planned tool calls right 11 times in 24, and what fixed it
- [[on-device-beat-tracking-downbeats]]: a 20M-parameter net found downbeats where the DSP detector missed nine in ten
- [[shot-detection-phone-footage-no-cuts]]: sixteen shot detectors on two days of phone footage
- [[needle-tiny-tool-model]]: a 45M model in 14 MB that only picks tools and fills arguments
- [[bonsai-ternary-llm]]: a 500M ternary model running in the browser

## The platform around them

- [[swift6-callback-isolation]]: the Swift 6 crash when a framework callback inherits main-actor isolation
- [[superduper-analytics]]: every app and site measured on one self-hosted counter, no cookies
- [[posthog-cross-platform]]: the analytics setup it replaced, and why
- [[kmp-sync-strategy]]: offline-first sync between Android and iOS
