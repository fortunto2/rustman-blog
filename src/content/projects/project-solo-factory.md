---
type: concept
description: "Claude Code plugin with 57 skills, 2 agents, 12 stack templates, MCP portfolio search. Full pipeline: research → validate → scaffold → build → deploy → launch."
title: "solo-factory — Claude Code plugin for solopreneurs"
created: 2026-02-01
tags: [project, open-source, claude-code, plugin, skills, agents]
project_type: tool
course_module: 4
course_order: 10
publish: true
publish_as: project
source_url: "https://github.com/fortunto2/solo-factory"
github: fortunto2/solo-factory
index_line: "solo-factory: Claude Code plugin, 57 skills, 2 agents, startup pipeline"
index_section: "project"
---

# Solo Factory

**From shower thought to deployed product** — 57 skills, 2 agents, and an MCP server that searches every project you've ever built.

```
/research → /validate → /scaffold → /setup → /plan → /build → /deploy → /launch → /review
```

## Why

Most AI coding tools help you write code. Solo Factory helps you **run a startup** — from market research and idea validation to deployment and promotion. Every skill is designed for one-person teams moving fast across multiple projects and stacks.

- **No context switching** — one pipeline handles research, coding, deployment, and marketing
- **Stack-agnostic** — 12 templates from SwiftUI to Rust
- **Portfolio search** — [[project-solograph|Solograph]] MCP server indexes symbols and packages across all your projects and searches past sessions
- **Works without MCP** — skills gracefully fall back to Glob, Grep, Read, WebSearch

## Install

```bash
# Option 1: Skills (any AI agent — Claude Code, Cursor, Copilot, Gemini CLI, Codex)
npx skills add fortunto2/solo-factory --all

# Option 2: Claude Code Plugin (skills + agents + hooks)
claude plugin marketplace add https://github.com/fortunto2/solo-factory
claude plugin install solo@solo --scope user
```

## Skills

57 executable skills in 5 groups: **Analysis** (5) → **Development** (8) → **Mobile & Apple** (7) → **Promotion** (15) → **Utility** (22).

**[Browse all skills →](/skills)** — descriptions, install commands, full SKILL.md source for each.

## Agents

| Agent | Model | Specialization |
|-------|-------|----------------|
| `researcher` | Sonnet | Market research, competitors, pain points |
| `code-analyst` | Haiku | Codebase exploration, dependency analysis |

## Stacks

12 stack templates: iOS, Next.js, Kotlin, Astro, Python, Rust, Cloudflare Workers.

**[Browse all stacks →](/stacks)** — full YAML configs with copy button.

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
| `kb_search` | BM25 full-text search over the knowledge base, RU+EN stemming |
| `session_search` | Past Claude Code sessions, including transcripts Claude Code deleted |
| `symbol_search` | Where a function or class is defined, across every project |
| `project_info` | The projects; one project's stack and layers; who uses a package |
| `source_search` | Indexed YouTube transcripts, ProductHunt, TrustMRR, Telegram |

Web search is a separate MCP server, `searxng` (`web_search`, `web_extract`, `youtube_transcript`), so a broken import in one cannot take the other down.

Without MCP, skills fall back to Glob, Grep, Read, WebSearch — always works.

## Architecture

The [[harness-engineering-summary|harness]] IS the product:

```
skills/          — 57 SKILL.md files (instructions, not code)
agents/          — 2 agent definitions (model + role + tools)
templates/stacks — 12 YAML stack templates
rules/           — routing, skill locations, AI comments, debugging, sensors
hooks/           — sensors on edit and end of turn, secret guard, pipeline progression
scripts/         — bighead launcher, tmux dashboard, formatters
```

Skills are prompts, not programs. [[agent-mistake-fix-harness|Agent mistake → fix the skill]], not the code.

## Links

- [GitHub](https://github.com/fortunto2/solo-factory) — MIT, 57 skills, 2 agents
- [skills.sh](https://skills.sh/) — `npx skills add fortunto2/solo-factory`
- [[project-solograph]] — MCP server for portfolio, KB and session search
- [[agent-toolkit-landscape]] — where solo-factory fits in the ecosystem
- [[bmad-method]] — sibling executable skill system; differs by unifying agents and skills under one TOML primitive with 3-layer overrides
- [[harness-engineering-summary]] — the methodology behind the design
- [[context-engineering]] — context as code principle applied
- [Course: AI Solopreneur Engineer](/course) — learn the methodology step by step

- [[project-agent-board]] — the task board that hands out work on this repo: an agent claims under a lease and returns a URL plus the sha256 of exactly what it delivered. Built because both measurements of solo-verify so far were made by its own author
- [[plugin-eval-ablation]] — `claude plugin eval` can finally answer whether any of these 57 skills beats the bare model on its own task. Nothing here has ever been measured against a no-plugin baseline
