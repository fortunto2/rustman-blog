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

## Skills

30 executable skills in 4 phases: **Analysis** (6) → **Development** (6) → **Promotion** (11) → **Utility** (7).

**[Browse all skills →](/skills)** — descriptions, install commands, full SKILL.md source for each.

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
