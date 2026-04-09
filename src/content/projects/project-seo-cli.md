---
type: project
title: "SEO CLI — all search engine data in one terminal"
description: "Unified CLI for SEO: Google Search Console, GA4, Cloudflare, Bing, IndexNow. Launch, audit, monitor, reindex — 18 commands, one config, all sites."
created: 2026-03-01
tags: [project, open-source, python, cli, seo, analytics]
project_type: tool
course_module: 7
course_order: 11
publish: true
publish_as: project
source_url: "https://github.com/fortunto2/seo-cli"
---

# SEO CLI

All search engine data in one terminal. 18 commands covering launch, analytics, indexing, auditing, and monitoring across all your sites.

![SEO CLI dashboard](/images/projects/seo-cli-dashboard.png)

```bash
pip install seo-cli
# or
uv tool install seo-cli
```

## Commands

### Launch (first day)

| Command | What it does |
|---------|-------------|
| `seo launch` | Full cycle: register in GSC/Bing + submit sitemap + ping IndexNow + audit |

### Analytics

| Command | What it does |
|---------|-------------|
| `seo ga` | Google Analytics 4: sessions, pages, channels, countries |
| `seo analytics` | Search queries from GSC + Yandex |
| `seo traffic` | Cloudflare: views, uniques, bandwidth + bot/human breakdown |
| `seo compare` | GA vs Cloudflare: real users vs bots, AI referrals (ChatGPT, Perplexity, Gemini) |

### AI Crawlers

| Command | What it does |
|---------|-------------|
| `seo crawlers` | Who crawls (GPTBot, ClaudeBot, BingBot...), HTTP statuses, trends, ROI by referrals |

### Indexing

| Command | What it does |
|---------|-------------|
| `seo inspect URL` | Google indexation status |
| `seo reindex URL` | Instant reindex (Google Indexing API + IndexNow) |
| `seo submit` | Submit sitemap to all engines |
| `seo ping` | IndexNow ping (Bing + Yandex + Naver + Seznam in one request) |

### SEO Audit

| Command | What it does |
|---------|-------------|
| `seo audit URL` | SEO + GEO audit: meta, schema, speed, keywords, llms.txt |
| `seo improve URL` | Audit → fix cycle with tracking |
| `seo monitor` | Position tracking with deltas |

### Research

| Command | What it does |
|---------|-------------|
| `seo competitors QUERY` | Competitor analysis in search results |
| `seo keywords QUERY` | Keywords from Google Autocomplete |

## Integrations

One config — all sites:

- **Google Search Console** — indexation, queries, impressions
- **Google Analytics 4** — sessions, users, channels, pages
- **Cloudflare** — traffic, bots, bandwidth, plans
- **Bing Webmaster Tools** — indexation, submit
- **IndexNow** — instant ping to Bing, Yandex, Naver, Seznam

## Why

Every startup launch has the same SEO checklist: register in GSC, submit sitemap, ping IndexNow, check meta tags, set up analytics. Doing it manually for 10+ sites = hours of clicking through web UIs. One CLI command handles it all.

Part of the [[project-solo-factory|solo-factory]] ecosystem — `/seo-audit` skill wraps this CLI for agent use.

## Stack

Python 3.13 + uv. Rich tables for output. Google APIs (oauth2), Cloudflare API, IndexNow protocol.

## Links

- [GitHub](https://github.com/fortunto2/seo-cli)
- [[project-solo-factory]] — `/seo-audit` skill uses this CLI
- [[one-pain-one-feature-launch]] — built for the launch day checklist
