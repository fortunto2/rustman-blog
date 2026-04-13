---
type: concept
description: "Free offline desktop app for biometric visa photos. AI background removal, country presets, ICAO guides, print layout. Rust + Dioxus."
title: "Visa Photo — biometric photo tool"
created: 2026-04-13
tags: [project, open-source, rust, dioxus, desktop, ai, privacy]
project_type: tool
publish: true
publish_as: project
source_url: "https://github.com/fortunto2/visa-photo"
github: fortunto2/visa-photo
---

# Visa Photo

Free, offline, AI-powered desktop app for creating biometric visa and passport photos. Your photos never leave your machine -- no cloud, no subscriptions, no watermarks.

## What it does

1. Load photo (drag or click)
2. Pick country preset (Turkey ikamet, USA Green Card, Schengen, custom)
3. Crop with ICAO face alignment guides (head, chin, eye lines, face oval)
4. Remove background with AI (one click)
5. Save processed photo + generate A4 print sheet (300 DPI)

## AI Background Removal

Three engines, pick what fits:

| Engine | Size | Speed | Quality | Platform |
|--------|------|-------|---------|----------|
| Apple Vision | built-in | 0.2s | Best | macOS 13+ |
| Silueta | 43 MB | <1s | OK | all |
| U2Net Human | 176 MB | 2-4s | Good | all |

ONNX models download on-demand from within the app.

## Country Presets

- **Turkey (ikamet)**: 600x720px, 50x60mm, 56.7% face height
- **USA Green Card**: 600x600px, 51x51mm, 50-69% face height
- **Schengen**: 413x531px, 35x45mm, 71-80% face height
- **Custom**: configurable via `presets.toml` or built-in editor

## Tech Stack

- **Rust** -- core logic, image processing (`image` crate)
- **Dioxus** -- desktop UI (webview)
- **ort** -- ONNX Runtime for AI models
- **Apple Vision** -- native macOS background removal (Swift bridge)

## Install

```bash
brew install fortunto2/tap/visa-photo    # Homebrew (macOS)
```

Pre-built binaries: macOS (ARM64/x64), Linux x64, Windows x64 on GitHub Releases.

## Why this exists

Visa photo services charge $5-15 for something that takes 30 seconds with the right tool. Privacy matters -- biometric photos shouldn't go to random cloud services. [[privacy-as-architecture]] in practice.

## Connections

- [[project-facealarm]] -- another on-device AI app from the portfolio
- [[project-airq]] -- same pattern: Rust core, Homebrew distribution
- [[apple-on-device-ai]] -- Apple Vision as zero-cost AI engine
- [[one-pain-one-feature-launch]] -- one pain (visa photo) → one tool → ship fast
- [[portfolio-approach]] -- small bet, clear utility, open-source
