---
type: project
title: "SEO CLI — all search engine data in one terminal"
description: "Unified CLI for SEO: Google Search Console, GA4, Cloudflare, Bing, IndexNow. Launch, audit, monitor, reindex, plus agent-readiness and who actually visited: 23 commands, one config, all sites."
created: 2026-03-01
tags: [project, open-source, python, cli, seo, analytics]
project_type: tool
updated: 2026-10-27
course_module: 7
course_order: 7
publish: true
publish_as: project
source_url: "https://github.com/fortunto2/seo-cli"
pypi: seo-cli
github: fortunto2/seo-cli
index_line: "SEO CLI: 23 commands for GSC, GA4, Bing, IndexNow, agent-readiness and superduper-analytics traffic. All sites in one terminal"
index_section: "project"
---

# SEO CLI

All search engine data in one terminal. 23 commands covering launch, indexing, auditing and monitoring across all your sites, plus two questions search consoles never answer: can an AI agent read the site, and did anyone actually come.

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
| `seo traffic` | Who actually visited, from [[superduper-analytics]]. Bots are excluded and reported separately; sampled figures say they are a lower bound |
| `seo conversion` | Which pages make people act: goals against views of the same page |
| `seo retention` | Do people come back to the apps on their own (apps only) |
| `seo products` | Every registered product, and whether its counter reports. Read it before concluding a product has no traffic |
| `seo compare` | GA vs Cloudflare: real users vs bots, AI referrals (ChatGPT, Perplexity, Gemini) |

### AI Crawlers

| Command | What it does |
|---------|-------------|
| `seo crawlers` | Who crawls (GPTBot, ClaudeBot, BingBot...), HTTP statuses, trends, ROI by referrals |
| `seo agents` | Which AI agents read the sites and why: an AI Assistant fetch means someone asked a question right now, an AI Crawler is building an index. These never show in `traffic`, agents don't run JavaScript |
| `seo agent-audit [URL]` | Agent-readiness: robots rules for GPTBot and friends, llms.txt, markdown negotiation, MCP and A2A cards. Starts with a path that cannot exist, so a site that answers 200 for everything is caught |

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
- **[[superduper-analytics]]** — people, page views, goals, app retention, AI agent fetches
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
