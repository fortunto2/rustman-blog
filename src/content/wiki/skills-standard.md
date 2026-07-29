---
type: concept
title: "SKILL.md standard — model-invoked capabilities for AI agents"
description: "Open standard for packaging reusable agent capabilities. Anthropic shipped Dec 2025, OpenAI Codex CLI adopted it, and 20+ agents now consume the same SKILL.md format. Explains model-invoked vs slash commands, frontmatter, install paths, and the skills.sh marketplace (91K+ skills, top one at 1.5M installs)."
created: 2026-05-13
updated: 2026-05-13
tags: [skills, claude-code, codex, standard, anthropic, openai, marketplace, agents]
publish: true
index_line: "SKILL.md cross-platform standard: model-invoked vs slash, frontmatter routing, install paths. skills.sh marketplace (91K+ skills, top is `find-skills` at 1.5M installs). Adopted by Claude Code, Codex, Cursor, Copilot, 20+ agents"
index_section: "concept"
---

# SKILL.md Standard

A reusable agent capability packaged as a markdown file with YAML frontmatter. Anthropic shipped the standard in December 2025; OpenAI Codex CLI adopted it shortly after. By May 2026, ~20+ agents consume the same `SKILL.md` format, and an open marketplace ([skills.sh](https://skills.sh/)) lists 91K+ of them.

Important because it's the **first cross-platform primitive that survived adoption**. Before SKILL.md, every agent had its own format (Cursor `.cursorrules`, Aider `.aider.conf`, Cline custom prompts, Claude Code Skills v0). After SKILL.md, the same file works in Claude Code, Cursor, Codex, GitHub Copilot, Windsurf, Gemini, Cline, AMP, Antigravity, ClawdBot, Droid, Goose, Kilo, Kiro CLI, Nous Research, OpenCode, Roo, Trae, VS Code.

## What's in a SKILL.md

```markdown
---
name: bmad-dev-story
description: Execute story implementation following a context-filled story spec file. Use when the user says "dev this story [story file]" or "implement the next story in the sprint plan"
---

# Dev Story Workflow

**Goal:** Execute story implementation following a context-filled story spec file.

## On Activation

### Step 1: Load Config
Load config from `_bmad/bmm/config.yaml` and resolve...

### Step 2: ...
```

Two required frontmatter fields: `name` and `description`. Description is the **routing signal** — agents read it to decide whether to invoke the skill. Body is freeform markdown with whatever steps, conventions, and references the skill needs.

Optional siblings: `customize.toml` (per [[bmad-method|BMAD]]), `references/`, `checklists/`, `steps/` — anything the skill body references with relative paths.

## Model-Invoked vs Slash Commands

The critical distinction:

| | **Model-invoked (skill)** | **Slash command** |
|---|---|---|
| Who triggers | The agent itself, based on task context and `description` | The user, by typing `/skill-name` |
| When to use | Capability the agent should reach for autonomously | Capability the user wants explicit control over |
| Description matters | Yes — it's the routing signal | Less — user already chose it by name |
| Example | `frontend-design` (agent uses when designing UI) | `/wiki-ingest` (user explicitly invokes) |

A single skill can be both — Claude Code, Codex CLI, Cursor all surface skills as both auto-callable and slash-callable. The `description` is what makes auto-routing work, so write it like a search query the model will match against ("Use when…", concrete trigger phrases).

## Install Paths (Claude Code)

- **Personal:** `~/.claude/skills/{skill-name}/SKILL.md` — yours across all projects
- **Project:** `.claude/skills/{skill-name}/SKILL.md` — checked into the repo, applies to teammates
- **Plugin:** installed via `/plugin install` from a marketplace; lives in the plugin's own folder, surfaces by namespace (`plugin:skill-name`)

Codex CLI and most other adopters use a similar `~/.{tool}/skills/` and project-local `.{tool}/skills/` pattern.

## skills.sh — The Marketplace

[skills.sh](https://skills.sh/) is the **npm of agent skills**, built by Vercel and open-source. Snapshot (May 2026):

- **91K+ skills indexed**, organized by GitHub `owner/repo`
- **Single install command:** `npx skills add owner/repo` — works for any of the supported agents (it detects which IDEs/CLIs are installed and writes to the right path)
- **Leaderboard** by install count, with "Trending (24h)" and "Hot" alternative views
- **Security audits** section — flags skills that touch shell, network, or sensitive files
- **Official designation** for vendor-blessed skills (Anthropic, Vercel, Microsoft)

Top installs at the time of writing:

| Rank | Skill | Owner | Installs |
|---|---|---|---|
| 1 | `find-skills` | vercel-labs/skills | 1.5M |
| 2 | `frontend-design` | anthropics/skills | 403K |
| 3 | `vercel-react-best-practices` | vercel-labs/agent-skills | 394K |
| 4 | `web-design-guidelines` | vercel-labs/agent-skills | 315K |
| 5 | `microsoft-foundry` | microsoft/azure-skills | 312K |

Notable that `find-skills` is the top — meta-skill that helps the agent find other skills. Skill discovery is a problem people actually have.

[**SkillsMP**](https://skillsmp.com/) is a parallel community directory aggregating from GitHub (700K+ entries indexed, lower bar than skills.sh — minimum 2 stars, scans for quality). Independent project, not official.

## Why the Standard Took

Three pragmatic choices made adoption easy:

1. **Markdown + YAML, nothing exotic.** No DSL, no proprietary runtime, no framework dependency. Any tool that can read a markdown file can host a skill.
2. **Description does the routing.** No registry, no schema validation, no capability tags — the model itself decides via natural-language description matching. Zero infrastructure cost to add a new skill.
3. **Filesystem layout is the contract.** `~/.{tool}/skills/{name}/SKILL.md` is the install location. Tools agree on the path; nothing else needs to be standardized.

Compare to MCP (which requires a server, schema, transport layer) or LangChain tools (require Python imports, type signatures). SKILL.md is closer to AGENTS.md or robots.txt — a convention, not a system.

## Trade-offs

**Pros**

- Cross-platform out of the box
- Zero learning curve for skill authors (just write a markdown file)
- Composable — skills can reference other skills, files, scripts
- Discoverable — marketplaces work because the format is uniform

**Cons**

- **No execution sandbox.** A skill can tell the agent to run anything; safety lives in the host's permission system, not in the skill itself. Hence `skills.sh` audits.
- **Description-quality matters a lot.** Bad description → agent never invokes the skill, or invokes it for wrong tasks. Easy to write, hard to write well.
- **Versioning is informal.** Updates by re-cloning the repo or re-running `npx skills add`. No semver in the standard itself.
- **Capability creep.** Without typed inputs/outputs, complex skills become brittle prompts.

## Where Skills Fit in Larger Systems

Most modern agent toolkits use SKILL.md as their primitive:

- [[project-solo-factory]] — 30 skills, full startup pipeline
- [[bmad-method]] — agents themselves are skills (`bmad-agent-dev`), workflows too (`bmad-dev-story`); 3-layer TOML overrides on top
- [[ruflo-orchestration]] — 30 skills + 60+ commands + 100 agents, plus MCP server beneath
- [[hermes-agent]] — auto-creates new skills at runtime from successful trajectories
- [[project-rust-code]] — own Rust agent has a skills system that pulls from skills.sh registry
- [[webwright-code-as-action]] — Microsoft's Webwright ships one `skills/webwright/` folder that loads identically into Claude Code, Codex, OpenClaw, and Hermes — the cross-host SKILL.md promise paying off in production

The pattern: **skills are the cheapest way to extend an agent**. MCPs are heavier (server, transport, eager-load context — see [[agent-patterns-stream2]]). Plugins bundle skills + agents + slash commands but still rest on SKILL.md inside.

## Authoring Tips (Hard-Won)

From writing 30+ in [[project-solo-factory]]:

- **Description like a search query.** Lead with trigger phrases ("Use when the user says…", "When asked to…"). The model matches your description against the user's request — write for that match.
- **One skill = one outcome.** Don't bundle "research and validate and scaffold" in one skill. Three skills, chained.
- **Steps in the body, references in siblings.** SKILL.md should be readable in one screen. Long checklists, code samples, schemas → separate files referenced by relative path.
- **Test by invocation.** Run the skill from a clean session; if the agent doesn't pick it up from your description, the description is wrong, not the agent.
- **Version via git.** The standard doesn't help you here; commit your skills, tag releases, document breaking changes in the skill body.

## Related

- [[agent-toolkit-landscape]] — broader catalog; skills sit in the marketplace + executable-skills layers
- [[bmad-method]] — most disciplined use of SKILL.md (agents-as-skills + TOML overrides)
- [[ruflo-orchestration]] — skills + plugins + MCP combined into a swarm OS
- [[project-solo-factory]] — concrete example of a 30-skill startup pipeline
- [[hermes-agent]] — skills as runtime artifacts (auto-generated, not just hand-written)
- [[agent-patterns-stream2]] — skills lazy-load vs MCPs eager-load — why this matters for context budget
- [[design-md-spec]] — sibling convention: DESIGN.md for visual identity, AGENTS.md for repo-local agent instructions
- [[agent-native-builder]] — Builder.io ships SKILL.md skills (Claude Code / Cursor / Copilot) alongside its runtime — frameworks now bundle a thin skill layer to hook into whatever harness you already run
