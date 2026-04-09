---
type: concept
description: "Claude Code plugin with 30 startup skills, 3 agents, 9 stack templates, MCP code intelligence. Full pipeline: research → validate → scaffold → build → deploy → launch."
title: "solo-factory — Claude Code plugin for solopreneurs"
created: 2026-02-01
tags: [project, open-source, claude-code, plugin, skills, agents]
course_module: 6
course_order: 1
publish: true
publish_as: project
source_url: "https://github.com/fortunto2/solo-factory"
---

# Solo Factory

**From shower thought to deployed product** — 30 skills, 3 agents, and a code intelligence MCP server that knows every project you've ever built.

```
/research → /validate → /scaffold → /setup → /plan → /build → /deploy → /launch → /review
```

## Why

Most AI coding tools help you write code. Solo Factory helps you **run a startup** — from market research and idea validation to deployment and promotion. Every skill is designed for one-person teams moving fast across multiple projects and stacks.

- **No context switching** — one pipeline handles research, coding, deployment, and marketing
- **Stack-agnostic** — 9 templates from SwiftUI to Cloudflare Workers
- **Code intelligence** — [[project-solograph|Solograph]] MCP server indexes all your projects, searches past sessions, and provides semantic code search
- **Works without MCP** — skills gracefully fall back to Glob, Grep, Read, WebSearch

## Install

```bash
# Option 1: Skills (any AI agent — Claude Code, Cursor, Copilot, Gemini CLI, Codex)
npx skills add fortunto2/solo-factory --all

# Option 2: Claude Code Plugin (skills + agents + MCP)
claude plugin marketplace add https://github.com/fortunto2/solo-factory
claude plugin install solo@solo --scope user
```

## Skills by Phase

### Analysis (6 skills)

| Command | What it does |
|---------|-------------|
| `/research <idea>` | Market — competitors, SEO keywords, domains, TAM/SAM/SOM |
| `/swarm <idea>` | 3 parallel research agents (market + users + tech) |
| `/validate <idea>` | [[seed-niche-scoring|S.E.E.D.]] check + [[stream-six-layers|STREAM]] scoring + Devil's Advocate → PRD |
| `/stream <decision>` | [[stream-six-layers|STREAM]] 6-layer decision framework for high-stakes choices |
| `/sgr` | Design [[schema-guided-reasoning|SGR]] pipelines — NextStep, analysis cascade, tool dispatch |
| `/you2idea-extract` | Mine startup ideas from YouTube transcripts |

### Development (6 skills)

| Command | What it does |
|---------|-------------|
| `/scaffold <name> <stack>` | PRD → running project with CLAUDE.md, git, GitHub push |
| `/setup` | Wire TDD workflow, linting, CI — zero questions |
| `/plan <feature>` | Explore codebase → spec + phased plan with file-level tasks |
| `/build [track-id]` | Execute plan with TDD, auto-commit, phase gates |
| `/deploy` | Detect CLI tools, set up DB, push, verify live |
| `/review` | Final quality gate — tests, coverage, security, acceptance criteria |

### Promotion (11 skills)

| Command | What it does |
|---------|-------------|
| `/launch` | GTM strategy — beachhead, channels, pricing, growth loops |
| `/landing-gen` | Landing page content — hero, features, A/B headlines, CTA |
| `/content-gen` | Social media pack — LinkedIn, Reddit, Twitter/X thread |
| `/video-promo` | 30-45s promo script + storyboard |
| `/community-outreach` | Find Reddit/HN/PH threads, draft value-first responses |
| `/reddit` | Reddit engagement + karma building |
| `/github-outreach` | Target competitor library dependents |
| `/seo-audit <url>` | SEO health check — meta tags, JSON-LD, sitemap, score 0-100 |
| `/metrics-track` | PostHog event funnel, KPI benchmarks, [[kill-iterate-scale|kill/iterate/scale]] |
| `/legal` | Privacy policy + terms — [[privacy-as-architecture|privacy-first]], manifest-aligned |
| `/humanize` | Strip AI writing patterns from copy |

### Utility (7 skills)

| Command | What it does |
|---------|-------------|
| `/pipeline research <idea>` | Automated research → validate loop |
| `/pipeline dev <name> <stack>` | Automated scaffold → setup → plan → build → deploy → review |
| `/init` | One-time founder onboarding — manifest, calibration, stack selection |
| `/factory` | Install the full Solo Factory toolkit in one command |
| `/retro` | Post-pipeline retrospective — score, find waste, suggest fixes |
| `/audit` | KB health check — broken links, frontmatter, tags |
| `/memory-audit` | Claude Code memory hierarchy — loaded files, char counts, optimization |

## Agents

| Agent | Model | Specialization |
|-------|-------|----------------|
| `researcher` | Sonnet | Market research, competitors, pain points |
| `code-analyst` | Haiku | Codebase exploration, dependency analysis |
| `idea-validator` | Sonnet | Idea validation, STREAM scoring, PRD generation |

## Available Stacks

| Stack | Tech |
|-------|------|
| `ios-swift` | SwiftUI, CoreML, StoreKit 2 |
| `nextjs-supabase` | Next.js 16, React 19, Tailwind 4, Supabase |
| `nextjs-ai-agents` | extends nextjs-supabase + Vercel AI SDK, MCP |
| `cloudflare-workers` | Hono, D1, R2, Durable Objects |
| `kotlin-android` | Jetpack Compose, Room, Koin |
| `astro-static` | Astro 5, Cloudflare Pages |
| `python-api` | FastAPI, Pydantic, SQLAlchemy, Alembic |
| `python-ml` | uv, Pydantic, FalkorDB, MLX |

## Automated Pipeline

Two modes for hands-free execution:

```bash
# Interactive — one Claude Code session
/pipeline dev "my-app" "nextjs-supabase"

# Big Head — tmux dashboard, logs, long pipelines
make bighead-dev P=my-app S=nextjs-supabase
```

Pipeline signals: `<solo:done/>` (stage complete) and `<solo:redo/>` (go back). Stage markers in `.solo/states/`. Per-iteration logs in `~/.solo/pipelines/`.

## MCP Integration

Skills auto-detect [[project-solograph|Solograph]] tools when available:

| Tool | What it does |
|------|-------------|
| `kb_search` | Semantic search over knowledge base |
| `session_search` | Search past Claude Code sessions |
| `codegraph_query` | Cypher queries on code intelligence graph |
| `codegraph_explain` | Architecture overview of any project |
| `project_code_search` | Semantic code search across projects |
| `web_search` | Web search via SearXNG or Tavily |

Without MCP, skills fall back to Glob, Grep, Read, WebSearch — always works.

## Architecture

The [[harness-engineering-summary|harness]] IS the product:

```
skills/          — 30 SKILL.md files (instructions, not code)
agents/          — 3 agent definitions (model + role + tools)
templates/stacks — 9 YAML stack templates
rules/           — routing table, AI comments, debugging
hooks/           — session start/stop, pipeline progression
scripts/         — bighead launcher, tmux dashboard, formatters
```

Skills are prompts, not programs. [[agent-mistake-fix-harness|Agent mistake → fix the skill]], not the code.

## Links

- [GitHub](https://github.com/fortunto2/solo-factory) — MIT, 30 skills, 3 agents
- [skills.sh](https://skills.sh/) — `npx skills add fortunto2/solo-factory`
- [[project-solograph]] — MCP server powering code intelligence
- [[agent-toolkit-landscape]] — where solo-factory fits in the ecosystem
- [[harness-engineering-summary]] — the methodology behind the design
- [[context-engineering]] — context as code principle applied
- [Course: AI Solopreneur Engineer](/course) — learn the methodology step by step
