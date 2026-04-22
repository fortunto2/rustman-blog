---
type: catalog
title: "Agent toolkit landscape — from prompt libraries to autonomous project managers"
description: "Categorized comparison of AI agent toolkits: prompt libraries, executable skill systems, project managers, agent frameworks, memory systems. Growing catalog."
created: 2026-04-09
updated: 2026-04-09
tags: [agents, tools, comparison, solo-factory, skills, methodology]
course_module: 6
course_order: 2
publish: true
---

# Agent Toolkit Landscape

A growing catalog of AI agent toolkits, organized by what they actually do. Not a ranking — a map for choosing the right tool for the right job.

---

## Categories

| Category | What it solves | Examples |
|----------|---------------|----------|
| **Skill Marketplaces** | "I need to find and install skills" | skills.sh, SkillsMP |
| **Prompt Libraries** | "I need a domain specialist now" | Agency Agents |
| **Executable Skills** | "I need a startup pipeline" | solo-factory, Superpowers |
| **Project Managers** | "I need autonomous long-running execution" | GSD-2 |
| **Integration Platforms** | "My agent needs to call 1000+ APIs" | Composio |
| **Agent Frameworks** | "I need to build custom agents" | LangGraph, CrewAI |
| **Memory Systems** | "My agent forgets everything" | MemPalace, Solograph |

---

## Skill Marketplaces

Discover, install, and share agent skills. The npm/crates.io of agent capabilities.

| Platform | Skills | Install | Platforms | Key Feature |
|----------|--------|---------|-----------|-------------|
| [skills.sh](https://skills.sh/) | 90K+ installs | `npx skills add owner/repo` | 20+ agents (Claude Code, Copilot, Cursor, Windsurf, Gemini...) | Open ecosystem, leaderboard, audited skills |
| [SkillsMP](https://skillsmp.com/) | 700K+ indexed | Browse + manual install | Claude Code, Codex CLI, ChatGPT | Community directory, aggregates from GitHub |

**skills.sh** — open ecosystem for reusable agent skills. `npx skills add` installs to any of 20+ agents. Leaderboard tracks installs (top skill: 731K installs). Categories: dev (React, Next.js, Postgres), cloud (Azure, Firebase), marketing (SEO, copywriting), productivity (browser automation, docs).

**SkillsMP** — community directory indexing 700K+ skills from GitHub. Uses the open SKILL.md standard (Anthropic, Dec 2025; adopted by OpenAI for Codex CLI). Filters low-quality repos (min 2 stars), scans for quality. Independent project, not official.

**SKILL.md standard:** model-invoked (agent decides when to use) vs slash commands (user-invoked). Personal: `~/.claude/skills/`. Project: `.claude/skills/`. Works across Claude Code and Codex CLI.

**When to use:** before building a custom skill, search these marketplaces. Someone probably already built it.

---

## Prompt Libraries

Collections of agent personalities/prompts. Zero setup, no state, no orchestration.

| Tool | Stars | Agents | Platforms | Key Feature |
|------|-------|--------|-----------|-------------|
| [Agency Agents](https://github.com/msitarzewski/agency-agents) | 76K | 130+ | Claude Code, Cursor, Copilot, Aider, Windsurf, Gemini CLI, OpenCode, Kimi Code | Cross-platform conversion scripts |
| [AGENTS.md spec](https://github.com/agentsmd/agents.md) | — | format | Any | Open format for repo-local agent instructions |

**Agency Agents** — 130+ specialists organized by division (engineering, design, marketing, sales, product, testing, PM). Each = markdown file with identity, workflows, deliverables, success metrics. Convert to any platform with one script.

**When to use:** you need a domain expert you don't have a skill for (Solidity audit, Chinese market localization, threat detection). Copy a file, go.

**Limitation:** prompts only. No state, no memory, no pipeline, no quality gates.

---

## Executable Skill Systems

Pipeline-oriented tools that chain multi-step workflows. Skills read previous outputs, write artifacts, enforce quality.

| Tool | Stars | Skills | Platform | Key Feature |
|------|-------|--------|----------|-------------|
| [Superpowers](https://github.com/obra/superpowers) | 143K | 15+ | Claude Code, Cursor, Copilot, Codex, Gemini CLI, OpenCode | Enforced 7-phase dev workflow, subagent-driven development |
| [[project-solo-factory\|solo-factory]] | — | 30 | Claude Code | Full startup pipeline: research → ship |
| [GitHub Spec Kit](https://github.com/github/spec-kit) | — | — | GitHub | Spec-driven development |

**Superpowers** (143K stars) — enforced 7-phase development workflow: brainstorming → git worktrees → writing plans → subagent-driven execution → TDD → code review → finish branch. Key innovations:
- **Mandatory, not optional** — agent checks for relevant skills before any task
- **Subagent-driven development** — fresh agent instance per task prevents context drift, two-stage review (spec compliance → code quality)
- **Plans for a "junior engineer"** — 2-5 min tasks with exact file paths, complete code, no ambiguity
- **TDD enforced** — deletes code written before tests
- **Cross-platform** — Claude Code, Cursor, Copilot CLI, Codex, Gemini CLI, OpenCode

**vs solo-factory:** Superpowers focuses on the development workflow (plan → code → test → review). solo-factory covers the full product lifecycle (research → validate → scaffold → build → deploy → launch → promote). Superpowers has better cross-platform support; solo-factory has business/marketing skills. Complementary — use Superpowers for code quality, solo-factory for product strategy.

**solo-factory** — 30 executable skills in 4 phases:
- **Analysis** (5): `/research`, `/swarm`, `/validate`, `/stream`, `/you2idea-extract`
- **Development** (6): `/scaffold`, `/setup`, `/plan`, `/build`, `/deploy`, `/review`
- **Promotion** (11): `/launch`, `/landing-gen`, `/content-gen`, `/video-promo`, `/reddit`, `/seo-audit`...
- **Utility** (8): `/init`, `/factory`, `/pipeline`, `/retro`, `/audit`, `/memory-audit`...

Pipeline: output of one skill is input to next. `/pipeline` chains automatically. Harness-aware — respects CLAUDE.md, runs tests, follows TDD.

**When to use:** you're building a product solo and want the full cycle from idea to launch.

**Limitation:** Claude Code only. Opinionated methodology (STREAM, S.E.E.D., harness engineering).

---

## Project Managers

Autonomous long-running execution systems. State machines, crash recovery, git isolation.

| Tool | Stars | Architecture | Platform | Key Feature |
|------|-------|-------------|----------|-------------|
| [Symphony](https://github.com/openai/symphony) | 15K | Isolated implementation runs | Elixir, OpenAI | Manage work, not supervise agents |
| [GSD-2](https://github.com/gsd-build/gsd-2) | 5K | Milestone → Slice → Task | Pi SDK (20+ providers) | Autonomous multi-session execution |

**Symphony** (15K stars, OpenAI) — turns project work into isolated, autonomous implementation runs. Teams manage work instead of supervising agents. Elixir-based. Each run is isolated — no context leaking between tasks. OpenAI's answer to "how to let agents work on real projects."

**GSD-2 (Get Shit Done 2)** — autonomous coding agent with hierarchical project management:
- **Milestone** → shippable version (4-10 slices)
- **Slice** → demoable vertical capability (1-7 tasks)
- **Task** → single context-window unit of work

**Key capabilities:**
- Fresh 200K-token context per task (no context pollution)
- SQLite-backed state machine with TOCTOU hardening
- Git worktree isolation per milestone
- Crash recovery via lock files + session forensics
- Stuck detection (sliding-window pattern analysis)
- Parallel multi-worker execution with file-based IPC
- 3 modes: step (`/gsd`), auto (`/gsd auto`), headless (CI/cron)
- `.gsd/` artifacts: PROJECT.md, DECISIONS.md, KNOWLEDGE.md, RUNTIME.md, STATE.md

**vs solo-factory:** GSD-2 is a project manager that runs autonomously for hours. solo-factory is a toolkit you invoke per task. GSD-2 manages the execution loop; solo-factory manages the methodology. They could complement each other — solo-factory for what to build, GSD-2 for how to execute.

**When to use:** you have a clear spec and want autonomous multi-session execution with crash recovery.

---

## Integration & Tool Platforms

Connect agents to external services — 1000+ APIs, auth, sandboxing. The "plumbing" layer.

| Tool | Stars | Integrations | Key Feature |
|------|-------|-------------|-------------|
| [Composio](https://github.com/composiohq/composio) | 28K | 1000+ toolkits | Tool search, context management, auth, sandboxed workbench, MCP/SSE |

**Composio** — powers 1000+ toolkits for AI agents: GitHub, Slack, Gmail, Notion, Jira, Salesforce, etc. Handles the hard parts: OAuth/API key authentication, tool search (find right tool from 1000+), context management, sandboxed execution.

**Key features:**
- **Tool search** — agent describes what it needs, Composio finds the right tool from 1000+
- **Authentication** — manages OAuth flows, API keys, token refresh for all integrations
- **Sandboxed workbench** — safe execution environment for agent actions
- **MCP + SSE support** — works as MCP server or standalone
- **Python + TypeScript** — works with LangGraph, CrewAI, AutoGen, Claude, OpenAI

**When to use:** your agent needs to interact with external services (send emails, create PRs, update CRM, post to Slack). Instead of building each integration, use Composio as the tool layer.

---

## Agent Frameworks

Infrastructure for building custom agents. Maximum flexibility, maximum setup cost.

| Tool | Stars | Language | Key Feature |
|------|-------|----------|-------------|
| [LangGraph](https://github.com/langchain-ai/langgraph) | — | Python/JS | Graph-based execution, state management |
| [CrewAI](https://github.com/crewAIInc/crewAI) | — | Python | Role-based multi-agent teams |
| [AutoGen](https://github.com/microsoft/autogen) | — | Python | Multi-agent conversations |
| [Claude Agent SDK](https://docs.anthropic.com/en/docs/agents) | — | Python/TS | Official Anthropic agent toolkit |

**When to use:** you're building a product that IS an agent system (not using agents to build a product).

**Key difference:** frameworks = building blocks. Everything else = finished tools.

---

## Memory Systems

Persistent memory that survives between sessions. See [[agent-memory-architecture]] for deep dive.

| Tool | Stars | Storage | Key Feature |
|------|-------|---------|-------------|
| [[mempalace-agent-memory\|MemPalace]] | 27K | ChromaDB + SQLite KG | Spatial memory, 96.6% LongMemEval |
| [[project-solograph\|Solograph]] | — | FalkorDB + SQLite + files | Graph + vector + session search, 15 MCP tools |
| [QMD](https://github.com/tobi/qmd) | 20K | Local | BM25 + vector + LLM reranking search |
| [Letta](https://github.com/cpacker/MemGPT) | — | — | MemGPT: core/archival/recall memory |
| Claude Code auto-memory | — | Files | Built-in ~/.claude/ memory system |

**When to use:** your agent needs to remember across sessions — decisions, preferences, code patterns, user context.

---

## Comparison Matrix

| Aspect | Prompt Libs | Exec Skills | Project Mgrs | Integrations | Frameworks | Memory |
|--------|------------|-------------|-------------|-------------|------------|--------|
| **Setup** | Minutes | Hours | Hours | Hours | Days | Hours |
| **State** | None | Pipeline | Full SM | Stateless | Custom | Persistent |
| **Autonomy** | None | Per-task | Multi-session | Per-call | Custom | Background |
| **Memory** | None | Via Solograph | `.gsd/KNOWLEDGE` | None | Build own | Core |
| **Quality** | None | Built-in | Verification | N/A | Build own | N/A |
| **Platform** | 7+ tools | Claude Code | Pi SDK (20+) | Python/TS | Python/JS | Varies |
| **Best for** | Quick expert | Product cycle | Long execution | API plumbing | Custom agents | Persistence |

---

## The Layered Stack

These aren't competing — they're layers:

1. **Memory** — [[project-solograph|Solograph]] / [[mempalace-agent-memory|MemPalace]] for persistence
2. **Skills** — [[project-solo-factory|solo-factory]] for methodology (what to build, in what order)
3. **Execution** — GSD-2 for autonomous long-running tasks
4. **Specialists** — Agency Agents for domain experts on demand
5. **Harness** — [[harness-engineering-summary|CLAUDE.md + linters + hooks]] tying it all together

The [[agent-mistake-fix-harness|harness loop]] applies to all layers: agent mistake → fix the harness.

---

## See Also

- [[project-solo-factory]] — our executable skill system
- [[agent-memory-architecture]] — memory layer deep dive (4 types, 3 loops, 5 systems)
- [[harness-engineering-summary]] — the discipline that makes any toolkit reliable
- [[context-engineering]] — how to feed context to agents regardless of toolkit
- [[claude-code-anatomy]] — Claude Code reverse-engineered and compared with LangGraph/SWE-Agent/OpenHands/Aider — different bets on where to impose safety
- [[fff-agent-file-search]] — fff.nvim: memory pushed into the tool layer (file search) instead of the agent. Reduces tokens and roundtrips

---

*Catalog is growing. Last updated: 2026-04-09.*
