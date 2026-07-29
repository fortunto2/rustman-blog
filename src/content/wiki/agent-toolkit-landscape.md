---
type: catalog
title: "Agent toolkit landscape — from prompt libraries to autonomous project managers"
description: "Categorized comparison of AI agent toolkits: prompt libraries, executable skill systems, project managers, agent frameworks, memory systems, observability/evals, governance. Growing catalog."
created: 2026-04-09
updated: 2026-07-29
tags: [agents, tools, comparison, solo-factory, skills, methodology, observability, evals, governance]
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
| **Isomorphic Action Frameworks** | "Define an action once, it works in UI + agent + API + MCP + CLI" | [[agent-native-builder]] (Builder.io) |
| **Memory Systems** | "My agent forgets everything" | MemPalace, Solograph, OpenViking |
| **Code Knowledge Graphs** | "My agent greps 40 files to answer one question" | Graphify, Solograph codegraph |
| **Observability & Evals** | "I can't see what the agent did, or whether the answer was good" | Langfuse, MLflow, Laminar, DeepEval |
| **Governance & Sandboxing** | "The agent has real system access and I have no control surface" | agent-governance-toolkit, Lima VMs |

---

## Skill Marketplaces

Discover, install, and share agent skills. The npm/crates.io of agent capabilities.

| Platform | Skills | Install | Platforms | Key Feature |
|----------|--------|---------|-----------|-------------|
| [skills.sh](https://skills.sh/) | 90K+ installs | `npx skills add owner/repo` | 20+ agents (Claude Code, Copilot, Cursor, Windsurf, Gemini...) | Open ecosystem, leaderboard, audited skills |
| [SkillsMP](https://skillsmp.com/) | 700K+ indexed | Browse + manual install | Claude Code, Codex CLI, ChatGPT | Community directory, aggregates from GitHub |

**skills.sh** — open ecosystem for reusable agent skills. `npx skills add` installs to any of 20+ agents. Leaderboard tracks installs (top skill: 731K installs). Categories: dev (React, Next.js, Postgres), cloud (Azure, Firebase), marketing (SEO, copywriting), productivity (browser automation, docs).

**SkillsMP** — community directory indexing 700K+ skills from GitHub. Uses the open SKILL.md standard (Anthropic, Dec 2025; adopted by OpenAI for Codex CLI). Filters low-quality repos (min 2 stars), scans for quality. Independent project, not official.

**SKILL.md standard:** model-invoked (agent decides when to use) vs slash commands (user-invoked). Personal: `~/.claude/skills/`. Project: `.claude/skills/`. Works across Claude Code and Codex CLI. See [[skills-standard]] for the full spec, marketplace breakdown, and authoring tips.

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
| [[bmad-method\|BMAD-METHOD v6]] | — | 40+ | Claude Code | Agents-as-skills with menu dispatch, 3-layer TOML customization, CSV-driven help router |
| [[ruflo-orchestration\|Ruflo]] (ex-Claude Flow) | — | 30 + 60 cmds + 100 agents | Claude Code | Spans this category + Project Managers + Memory: 32 plugins, AgentDB, federation, GOAP planner |
| [Compound Engineering](https://github.com/EveryInc/compound-engineering-plugin) (Every) | — | 36 skills + 51 agents | Claude Code, Codex, Cursor, Copilot, Gemini CLI | Planning and review as first-class commands; `/ce-compound` files the lesson back |
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

**Compound Engineering** (Every Inc, MIT) — 36 skills + 51 agents built on one belief: *each unit of engineering work should make the next unit easier*. Their ratio claim: **"80% of engineering is in planning and review, 20% is in execution"** — enforced by making planning and review actual commands (`/ce-ideate`, `/ce-brainstorm`, `/ce-plan`, `/ce-work`, `/ce-code-review`, `/ce-commit-push-pr`, `/ce-compound`) instead of steps you skip when tired.

**Why it matters even if you write your own skills:** `/ce-compound` is the [[agent-mistake-fix-harness|harness loop]] promoted to an explicit, invocable step in the cycle — not a habit you hope to remember. That's the transferable idea: the ratchet needs its own command, not just a principle in CLAUDE.md.

---

## Project Managers

Autonomous long-running execution systems. State machines, crash recovery, git isolation.

| Tool | Stars | Architecture | Platform | Key Feature |
|------|-------|-------------|----------|-------------|
| [Symphony](https://github.com/openai/symphony) | 15K | Isolated implementation runs | Elixir, OpenAI | Manage work, not supervise agents |
| [[conductor-parallel-agents\|Conductor / Superset / Emdash / …]] | mixed | Worktree-per-agent, multi-model | Mac app / cross-platform | Many Claude Code + Codex in parallel, unified review. See the 2026 orchestrator ecosystem |
| [Orca](https://github.com/stablyai/orca) (Stably) | — | Fleet of parallel agents ("ADE") | Desktop + **mobile** + **VPS** | Any CLI agent on your own subscription; account switcher with rate-limit tracking |
| [GSD-2](https://github.com/gsd-build/gsd-2) | 5K | Milestone → Slice → Task | Pi SDK (20+ providers) | Autonomous multi-session execution |

**Symphony** (15K stars, OpenAI) — turns project work into isolated, autonomous implementation runs. Teams manage work instead of supervising agents. Elixir-based. Each run is isolated — no context leaking between tasks. OpenAI's answer to "how to let agents work on real projects."

**[[conductor-parallel-agents|Conductor]]** (Melty Labs, $22M Series A) — Mac GUI for running many Claude Code + Codex agents in parallel, each in an isolated git worktree. Customers: Linear, Vercel, Notion, Ramp, Spotify. GUI-first variant of the "teams manage work, agents type" pattern.

**Orca** (Stably, trending Jul 2026) — self-described **ADE, Agent Development Environment**: a fleet of parallel agents run with *your own* subscriptions (Claude Code, Codex, Grok, Cursor, Copilot, Devin, Goose, …). What Conductor doesn't have:
- **Mobile + VPS surfaces** — kick off and review runs from a phone, or park the fleet on a server instead of your laptop
- **Account switcher with usage tracking** — see Claude/Codex rate-limit resets and hot-swap accounts without re-login (the practical bottleneck when running many agents on one Max plan)
- **Diff-line comments shipped back to the agent** — review, edit, commit without leaving Orca
- **Computer Use** — agents drive desktop apps when a workflow needs real UI interaction

`brew install --cask stablyai/orca/orca`. Also Windows, Linux AppImage, AUR.

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
| [[graphify-vs-solograph\|Graphify]] | ~98K (unverified) | `graph.json` on disk | Deterministic tree-sitter graph, **no vector store**, every edge tagged EXTRACTED/INFERRED |
| [OpenViking](https://github.com/volcengine/OpenViking) | 27K | `viking://` virtual FS | Unifies memory + RAG + skills; tiered L0/L1/L2 loading |
| [QMD](https://github.com/tobi/qmd) | 20K | Local | BM25 + vector + LLM reranking search |
| [Letta](https://github.com/cpacker/MemGPT) | — | — | MemGPT: core/archival/recall memory |
| Claude Code auto-memory | — | Files | Built-in ~/.claude/ memory system |

**When to use:** your agent needs to remember across sessions — decisions, preferences, code patterns, user context.

### Code Knowledge Graphs (the deterministic branch)

**Graphify** (Apache-2.0 OR MIT) — the retrieval-without-embeddings bet: *"Not a vector index. No embeddings, no vector store: a real graph you traverse."* Code is parsed locally by tree-sitter (36 grammars, 0 LLM credits), docs/PDFs go through your assistant's model, audio/video transcribe locally via faster-whisper. Leiden community detection splits the graph into subsystems. Outputs `graph.json` + `GRAPH_REPORT.md` + interactive `graph.html`. No telemetry.

Two mechanics worth stealing regardless of which tool you keep — see [[graphify-vs-solograph]]:
- **Git merge driver for the graph file** — two devs committing in parallel get their graphs union-merged instead of conflicting
- **PreToolUse hook that intercepts file reads** and nudges the agent toward a graph query; strict mode blocks the first raw read outright

**OpenViking** (Volcengine, **AGPLv3** — study, don't embed) — mounts memory, RAG, and skills as one virtual filesystem the agent browses with `ls` / `tree` / `find` instead of querying an opaque vector store:

```
viking://
├── resources/          # docs, repos, web pages
└── user/{user_id}/
    ├── memories/       # preferences extracted from sessions
    ├── skills/         # SKILL.md files the agent can discover
    └── peers/          # collaborative context
```

The transferable idea is **tiered loading**: L0 abstract (~100 tokens, relevance check) → L1 overview (~2k, structure) → L2 full content on demand, plus directory-recursive retrieval that finds the best *directory* first and drills down, keeping surrounding context intact. Their numbers on LoCoMo + tau2-bench: accuracy 24-57% → 80-83%, input tokens −34-91%, latency −58-66%. Backed by the VikingMem paper (VLDB 2026).

---

## Observability & Evals

Two different questions, often conflated. **Observability** tells you *what happened* — traces of prompts, tool calls, RAG stages, cost. **Evals** tell you *whether the answer was good* and fail the build if it wasn't. Most teams need both; most tools do one well and bolt on the other.

| Tool | Layer | Storage | Key Feature | License |
|------|-------|---------|-------------|---------|
| [Langfuse](https://langfuse.com) | Observability | Self-host (Postgres + ClickHouse) | Default pick: ~20K★, 26M SDK installs/mo, full data ownership. Evals are bring-your-own | MIT core |
| [MLflow](https://mlflow.org/top-5-agent-observability-tools/) | Both | Self-host | The only one combining tracing **with replay** + prompt versioning + automated evals in one platform. 30M+ downloads/mo | OSS |
| [Laminar](https://laminar.sh/article/top-6-agent-observability-platforms) | Both | Self-host / cloud | OpenTelemetry-native, built for agents: 20x trace compression, SQL over all platform data, a debugger driven by a coding agent | OSS |
| [Arize Phoenix](https://phoenix.arize.com/) | Evals | Self-host | Strongest on evals; commonly paired with Langfuse for traces | OSS |
| [[deepeval-llm-testing\|DeepEval]] | Evals | — | `pytest`-native: assertions in CI, not dashboards. 50+ metrics (G-Eval, DAG, RAGAS) | Apache-2.0 |
| [OpenObserve](https://openobserve.ai/blog/llm-observability-tools/) | Observability | Self-host | LLM traces alongside infra logs/metrics in one deployment | OSS |

**Practitioner note from the 2026 roundups:** instrument via OpenTelemetry SDKs rather than monkey-patching or mocks — it's the only approach that reliably reconstructs streaming traces as the agent codebase changes.

**When to use:** the moment an LLM call is in production and a user can see a bad answer. Before that, [[deepeval-llm-testing|evals in CI]] alone are enough.

**Our position:** [[cli-first-testing|CLI-first testing]] and DeepEval cover the eval side. Nothing covers tracing — so when an LLM product ships, Langfuse (self-host, MIT, privacy-compatible) or Laminar (OTel-native) is the missing layer, not another skill.

---

## Governance & Sandboxing

The layer that assumes the agent will do the wrong thing and makes it structurally unable to.

| Tool | Scope | Level | License |
|------|-------|-------|---------|
| [agent-governance-toolkit](https://github.com/microsoft/agent-governance-toolkit) (Microsoft) | Policy, identity, sandboxing, SRE | Application middleware | MIT |
| [[agent-sandboxing\|Lima / lightweight VMs]] | Filesystem + network isolation | OS | OSS |
| [[openai-privacy-filter\|OpenAI PII filter]] | PII detection in pipelines | Model (1.5B MoE) | Apache-2.0 |
| MCP Security Gateway (part of MS toolkit) | Tool poisoning, drift monitoring | Protocol | MIT |

**agent-governance-toolkit** — the framing is the valuable part: *"prompt-level safety ('please follow the rules') is not a control surface."* Actions are intercepted in application code **before** they execute. Components: Agent OS (policy engine, lifecycle gates), Agent Mesh (discovery, routing, trust), Agent Runtime (four privilege rings, command denylist, execution-plan validation), Agent SRE (kill switches, SLO monitoring, chaos testing), Agent Compliance (policy linting, integrity checks). Claims 10/10 coverage of the OWASP Agentic Top 10.

The API is one call, which is why it's worth knowing about even for a solo setup:

```python
from agentmesh.governance import govern
safe_tool = govern(my_tool, policy="policy.yaml")
```

Cloud- and framework-agnostic (Semantic Kernel, AutoGen, LangGraph, CrewAI, …; Python, TS, .NET, Rust, Go). CLI: `agt doctor`, `agt verify`, `agt lint-policy`.

**Important limit, stated by the project itself:** it operates at the application-middleware layer, *not* the OS kernel — so it composes with [[agent-sandboxing|VM/container isolation]] rather than replacing it. Middleware answers "which agent did this, and was it allowed?"; the VM answers "can it touch the host at all?"

**When to use:** multiple agents sharing API keys, agents acting on customer data, or any deployment where "which agent did this?" must have an answer. For a single laptop with a single operator, [[agent-sandboxing|a VM]] is still the higher-leverage control.

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

1. **Memory & retrieval** — [[project-solograph|Solograph]] / [[graphify-vs-solograph|Graphify]] / [[mempalace-agent-memory|MemPalace]] for persistence
2. **Skills** — [[project-solo-factory|solo-factory]] for methodology (what to build, in what order)
3. **Execution** — GSD-2 for autonomous long-running tasks, Orca for a parallel fleet
4. **Specialists** — Agency Agents for domain experts on demand
5. **Guardrails** — [[agent-sandboxing|VM isolation]] + policy middleware where agents touch real systems
6. **Feedback** — traces (Langfuse / Laminar) + [[deepeval-llm-testing|evals in CI]] — without this the loop below has no input
7. **Harness** — [[harness-engineering-summary|CLAUDE.md + linters + hooks]] tying it all together

The [[agent-mistake-fix-harness|harness loop]] applies to all layers: agent mistake → fix the harness. Layer 6 is what makes the loop *observable* instead of anecdotal — you can't ratchet on mistakes you never saw.

---

## See Also

- [[project-solo-factory]] — our executable skill system
- [[graphify-vs-solograph]] — Graphify vs our own code graph: what to steal, what to keep, when to switch
- [[agent-memory-architecture]] — memory layer deep dive (4 types, 3 loops, 5 systems)
- [[harness-engineering-summary]] — the discipline that makes any toolkit reliable
- [[context-engineering]] — how to feed context to agents regardless of toolkit
- [[claude-code-anatomy]] — Claude Code reverse-engineered and compared with LangGraph/SWE-Agent/OpenHands/Aider — different bets on where to impose safety
- [[fff-agent-file-search]] — fff.nvim: memory pushed into the tool layer (file search) instead of the agent. Reduces tokens and roundtrips
- [[design-md-spec]] — Google Labs' DESIGN.md: the CLAUDE.md/AGENTS.md pattern applied to design systems. Another agent-readable spec file with a linter
- [[vercel-agent-browser]] — Vercel Labs' agent-browser: 30k★ Rust CLI with CDP. Browser-automation primitives rewritten for LLMs (a11y refs, content boundaries, daemon persistence)

---

*Catalog is growing. Last updated: 2026-07-29.*

**On star counts:** the numbers in this catalog are what the projects and aggregators claim, and in this ecosystem they're unreliable — Graphify shows up as 76K, 97K, and 98K across three sources on the same day. Treat stars as a rough signal of attention, never of quality. Judge by license, what runs locally, and whether the core is actually open.
