---
type: concept
description: "The original dream, started in 2014: help people turn everyday video moments into meaningful stories. Not just random clips — a narrative, a reflection on life."
title: "Life2Film — turn everyday moments into meaningful montages"
created: 2014-01-01
tags: [project, ios, life2film, video, ai, montage, flagship]
course_module: 7
course_order: 8
publish: true
publish_as: project
---

# Life2Film

Privacy-first, agent-driven video montage application. Create cinematic montages through chat with an AI agent -- or run the deterministic pipeline from CLI. Original videos never leave the device.

**The original dream, started in 2014:** help people turn everyday video moments into meaningful stories. Not just random clips -- a narrative, a reflection on life. Closed v1 in 2021 (technology wasn't ready). Now rebuilding as v2 with on-device AI + web.

**Status:** in active development (v2).

## How It Works

```
Upload video -> Create 360p proxy (FFmpeg.wasm, client-side)
  -> Upload proxy to R2
  -> Analyze (scene detection + quality scoring + beat detection)
  -> Select best segments (knapsack algorithm)
  -> Build timeline -> Preview (Remotion Player) -> Export MP4 (client-side)
```

**Privacy-first:** original videos never leave the device. Only 360p proxies are uploaded for analysis. Final rendering happens on the client from full-quality originals.

## Two Interfaces, Same Pipeline

**Web chat** (`/chat/<filmId>`) -- agent orchestrates tools via AI SDK. Upload videos, agent calls `requestAnalysis` -> `runKnapsack` -> `previewMontage` -> `exportFilm`.

**CLI** (`pnpm montage <video>`) -- deterministic pipeline, no LLM needed. Same algorithms, JSON output.

```bash
pnpm montage fixtures/test-5s.mp4 --pretty   # no LLM
pnpm chat                                      # interactive agent
```

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16, React 19, Tailwind CSS 4, shadcn-ui |
| AI | AI SDK 6, Zod 4, Cloudflare AI Gateway |
| Export | Remotion (client-side rendering) |
| CLI | tsx + Ink (React for CLI) |
| Backend | Python (PySceneDetect, librosa), VPS Docker Compose |
| Database | Supabase PostgreSQL, Drizzle ORM |
| Storage | Cloudflare R2 (`media.life2film.com`) |
| Analytics | PostHog (EU) |
| Auth | Supabase Google OAuth |
| Payments | Stripe (subscriptions + one-time) |
| Testing | Vitest (516 tests, 47 files) |
| Deploy | Vercel (web) + VPS Docker (Python analysis) |

## Web App

- **Landing** (`/`) -- hero, features, how it works
- **Login** (`/login`) -- Google Sign-In (Supabase OAuth)
- **Dashboard** (`/dashboard`) -- film gallery (auth required)
- **Chat** (`/chat/<filmId>`) -- upload videos, agent orchestrates pipeline
- **Pricing** (`/pricing`) -- Free / Plus / Pro / Lifetime plans

## Pipeline Architecture

Deterministic -- same input, same output. No LLM needed.

**Analyzer tiers:** 0=mock, 0.5=canvas, 1=ffprobe, 1.5=pyscene/slick, 1.7=wasm, 2=opencv, 3=full.

**Agent tools:**
- Server-side: `requestAnalysis`, `runKnapsack`, `rhythmTimeline`, `musicBeatTimeline`, `browseMusic`, `selectMusic`, `adjustStyle`, `uploadFinal`
- Client-side: `createProxy`, `previewMontage`, `exportFilm`

## WASM Modules

**FFmpeg.wasm** (`@ffmpeg/ffmpeg` 0.12) -- browser-side video transcoding. Creates 360p proxy from original. Needs COOP/COEP headers (SharedArrayBuffer).

**va-wasm** (Rust video-analyzer) -- analysis engine. Two targets: Node.js (`video-analyzer/pkg-node/`) and Browser (`video-analyzer/pkg/`). Beat detection decodes audio via ffmpeg -> passes PCM to `va_audio::beats::detect_beats` (WASM). No Python/librosa needed.

## Eval & Benchmarks

```bash
pnpm eval:corpus add 'eval/corpus/*.mp4'     # register videos
pnpm eval:run --modules mock,ffprobe          # run evaluation
pnpm eval:report                              # comparison report
pnpm eval:optimize-weights --step 0.05        # grid search composite weights
```

## Video Limits

Max 5 minutes per video. Max 10 videos per film.

## Why It Matters

This is the origin story. "Every product I build is a step toward that original vision: tools that help people reflect, create, and own their narrative." SuperDuperAI exists because Life2Film planted the seed.

## Links

- [life2film.com](https://life2film.com)
- [[origin-story]] -- Life2Film is THE origin: started 2014, closed 2021, rebuilding now
- [[apple-on-device-ai]] -- on-device video analysis via Apple Foundation Models
- [[privacy-as-architecture]] -- user videos never leave the device
- [[portfolio-approach]] -- the flagship product in the portfolio, others fund its development
