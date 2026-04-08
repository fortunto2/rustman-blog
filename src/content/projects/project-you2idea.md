---
type: project
title: "You2Idea — AI startup idea search from YouTube"
description: "Search 700+ YouTube videos from 46 startup channels. AI extracts ideas, generates PRDs, maps topic clusters. Terminal-style hacker UI."
created: 2026-03-01
tags: [project, open-source, ai, youtube, search, astro, startup-ideas]
publish: true
publish_as: project
source_url: "https://you2idea.com"
---

# You2Idea

AI-powered startup idea search engine. Extracts business ideas from 700+ YouTube videos across 46 curated channels (Y Combinator, Greg Isenberg, My First Million, Alex Hormozi).

**Live:** [you2idea.com](https://you2idea.com)

## What it does

- **Semantic search** across video transcripts — find ideas by concept, not just keywords
- **Weekly curated digests** with top ideas + supporting video evidence
- **PRD generator** — from idea to product spec with tech stack recommendations
- **Topic graph** — visual map of connections between videos and concepts
- **Daily automated pipeline** — Temporal workflows index new videos from 46 channels

## Terminal UI

Hacker aesthetic: green-on-black CRT terminal, JetBrains Mono, scanline effects, command-line metaphors (`/search`, `@channel`, `$` prompts). No rounded corners, no gradients — pure terminal.

## Stack

**Frontend:** Astro 5 (SSG + SSR), Tailwind CSS 4, Orama (client-side fulltext), Graphology (graph visualization), HuggingFace Transformers (browser-side embeddings).

**Backend:** Python 3.13 + Temporal (daily pipeline), FalkorDB (graph DB), yt-dlp (transcript extraction).

**Infra:** Cloudflare Pages + Workers + R2 (subtitles, data files).

- [[enterprise-rag-challenge]] — hybrid search (fulltext + semantic) same pattern as ERC winners
- [[tool-calling-four-layers]] — structured extraction pipeline from video transcripts
- [[schema-guided-reasoning]] — typed schemas for idea extraction and PRD generation
- [[context-engineering]] — curated channel list = context engineering for idea quality
- [[solo-methodology]] — built and shipped as solo founder with AI agents
