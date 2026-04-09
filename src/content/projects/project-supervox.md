---
type: project
title: "SuperVox — voice pipeline toolkit for Rust"
description: "Voice-powered productivity TUI: live call assistant with real-time subtitles, post-call analysis, agent chat with history. STT, VAD, TTS in Rust."
created: 2026-03-01
tags: [project, open-source, rust, voice, tui, ai, stt]
project_type: tool
course_module: 7
course_order: 12
publish: true
publish_as: project
source_url: "https://github.com/fortunto2/supervox"
---

# SuperVox

Voice-powered productivity TUI. Live call assistant + post-call analysis + agent chat. All in Rust.

```bash
cargo install supervox
```

## Modes

| Mode | What it does |
|------|-------------|
| `supervox live` | Real-time subtitles, translation, rolling summary, audio recording |
| `supervox analyze <call.json>` | Post-call summary, action items, follow-up draft |
| `supervox agent` | Chat with call history, search across past calls |
| `supervox calls` | Browse past calls, open any in Analysis mode |

## Key Features

- **Live mode** — real-time STT with speaker labels (You: cyan, Them: yellow), rolling summary during call
- **Analysis** — LLM-powered summary, action items, mood, themes. Generate follow-up email with one key
- **Agent chat** — conversational search across all past calls
- **Audio recording** — WAV (16-bit PCM mono) saved alongside transcripts
- **Export** — markdown, JSON, clipboard. Play back recordings
- **Local LLM** — `--local` flag uses Ollama instead of cloud

## TUI Keybindings

| Key | Action |
|-----|--------|
| `r` / `s` | Start/stop recording (Live) |
| `f` | Generate follow-up email (Analysis) |
| `c` / `C` | Copy analysis / follow-up to clipboard |
| `p` | Play audio recording |
| `h` | Open call history |
| `?` | Help overlay |

## Stack

Rust 2024 edition. OpenAI Realtime API for STT. macOS system audio capture (`system-audio-tap`). Ratatui TUI. Local Ollama support.

## Links

- [GitHub](https://github.com/fortunto2/supervox)
- [[project-rust-code]] — same TUI approach (ratatui + Rust)
- [[schema-guided-reasoning]] — structured outputs for call analysis
- [[privacy-as-architecture]] — audio stays local, `--local` for full offline
