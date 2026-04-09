---
type: project
title: "You2Idea — AI startup idea search from YouTube"
description: "Search 700+ YouTube videos from 46 startup channels. AI extracts ideas, generates PRDs, maps topic clusters. Terminal-style hacker UI."
created: 2026-03-01
tags: [project, open-source, ai, youtube, search, astro, startup-ideas]
project_type: product
course_module: 7
course_order: 5
publish: true
publish_as: project
source_url: "https://you2idea.com"
github: fortunto2/you2idea
---

# You2Idea

AI-powered startup idea extraction from YouTube. Search 700+ indexed videos from 46 curated channels (Y Combinator, Greg Isenberg, My First Million, Alex Hormozi).

**Live:** [you2idea.com](https://you2idea.com)

## Features

- **Semantic search** across video transcripts -- find ideas by concept, not just keywords
- **Weekly curated digests** with top ideas + supporting video evidence
- **PRD generator** -- from idea to product spec with tech stack recommendations
- **Topic graph** -- visual map of connections between videos and concepts
- **Video chapters** with timestamp links -- jump to the exact moment
- **Free daily digest** via Substack
- **Suggest your favorite channel** for indexing
- **Daily automated pipeline** -- Temporal workflows index new videos from 46 channels

## Terminal UI

Hacker aesthetic: green-on-black CRT terminal, JetBrains Mono, scanline effects, command-line metaphors (`/search`, `@channel`, `$` prompts). No rounded corners, no gradients -- pure terminal.

## Tech Stack

**Frontend:** Astro 5 (SSG + SSR), Tailwind CSS 4, Fuse.js (client-side fuzzy search), Graphology (graph visualization), HuggingFace Transformers (browser-side embeddings).

**Backend:** Python 3.13 + Temporal (daily pipeline), FalkorDB (graph DB), yt-dlp (transcript extraction).

**Infra:** Cloudflare Pages + Workers + R2 (subtitles, data files).

## Data Pipeline

Video data is pre-exported from FalkorDB (indexed by solograph) as JSON files:
- `src/data/videos.json` -- channels, recent videos, tags, stats (33KB)
- `public/data/all-videos.json` -- all 727 videos with chapters for search (681KB, lazy-loaded)

```bash
make export   # Export fresh data from FalkorDB
make update   # Export -> build -> deploy (one command)
```

## Automated Daily Refresh (Temporal)

Daily pipeline runs via Temporal on VPS:

```
Temporal server (:7233)
  -> you2idea-worker container
     -> YoutubeRefreshWorkflow (daily 02:00 UTC)
        -> load_channels (channels.yaml, 45 handles)
        -> index_channel x 45 (parallel, max 5 concurrent)
        -> export_data/vectors
        -> fetch_transcripts
        -> upload_r2
        -> deploy_cloudflare
```

### VPS Management

```bash
# SSH tunnels for Temporal UI + gRPC
ssh -f -N -L 8082:localhost:8082 -L 7233:localhost:7233 google

# Manual trigger
ssh google 'docker exec you2idea-worker python3 -c "..."'

# Deploy file changes
scp deploy/docker-compose.yml google:~/you2idea-cron/
ssh google 'cd ~/you2idea-cron && docker compose up -d --build'
```

### Persistent Volumes

| Host path | Purpose |
|-----------|---------|
| `./data/youtube/` | FalkorDB graph.db (325MB) |
| `./data/wrangler/` | Wrangler OAuth tokens |
| `./data/vtt/` | ~750 VTT subtitle files |

## Development

```bash
pnpm install
pnpm dev        # http://localhost:4321
pnpm build      # Production build
make deploy     # Deploy to Cloudflare Pages
```

## Testing

```bash
cd deploy/
pytest test_workflow.py -v --asyncio-mode=auto    # Unit (mock, no VPS)
python test_workflow.py smoke localhost:7233       # Smoke (needs SSH tunnel)
```

## Links

- [you2idea.com](https://you2idea.com) -- live site
- [GitHub](https://github.com/fortunto2/you2idea)
- [[enterprise-rag-challenge]] -- hybrid search (fulltext + semantic) same pattern as ERC winners
- [[tool-calling-four-layers]] -- structured extraction pipeline from video transcripts
- [[schema-guided-reasoning]] -- typed schemas for idea extraction and PRD generation
- [[context-engineering]] -- curated channel list = context engineering for idea quality
- [[solo-methodology]] -- built and shipped as solo founder with AI agents
