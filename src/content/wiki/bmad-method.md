---
type: synthesis
title: "BMAD-METHOD v6 — agents-as-skills with TOML customization layers"
description: "BMAD v6 unifies agents and workflows as Claude Code skills. Persona lives in customize.toml, three-layer merge (defaults → team → user), CSV-driven help router, phase-numbered modules."
created: 2026-05-13
updated: 2026-05-13
tags: [agents, skills, bmad, claude-code, methodology, plugin, toml, comparison]
publish: true
index_line: "BMAD-METHOD v6: agents-as-skills with `[agent]` block + menu dispatch, 3-layer TOML merge (defaults → team → user), CSV-driven help router grounded in filesystem state"
index_section: "concept"
---

# BMAD-METHOD v6 — Agents-as-Skills

**Repo:** [bmad-code-org/BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD) · npm `bmad-method` · MIT.

The Breakthrough Method for Agile AI-Driven Development. v6 is a full Claude Code plugin where **everything is a skill** — including agents. Worth studying as a more disciplined sibling of [[project-solo-factory|solo-factory]] and [[agent-toolkit-landscape|other executable skill systems]].

## The Core Insight

Most plugins keep agents and skills as two separate primitives (own `.claude/agents/`, own loading rules, own prompt format). BMAD collapses them: an agent is just a **skill that activates a persona and presents a menu of other skills to dispatch into**.

```
src/bmm-skills/4-implementation/
├── bmad-agent-dev/         ← agent-skill (persona + menu)
├── bmad-dev-story/         ← workflow-skill (one process)
├── bmad-code-review/
└── bmad-sprint-planning/
```

Both kinds share the same shape: `SKILL.md` + `customize.toml` + optional refs/checklists. The difference is which top-level block lives in TOML — `[agent]` vs `[workflow]`.

## Agent-Skill Anatomy

`bmad-agent-dev/customize.toml` (excerpt):

```toml
[agent]
name = "Amelia"
title = "Senior Software Engineer"
icon = "💻"
role = "Implement approved stories with test-first discipline..."
identity = "Disciplined in Kent Beck's TDD..."
communication_style = "Ultra-succinct. File paths and AC IDs only."
principles = [
  "No task complete without passing tests.",
  "Red, green, refactor — in that order.",
]
persistent_facts = ["file:{project-root}/**/project-context.md"]

[[agent.menu]]
code = "DS"
description = "Write the next story's tests and code"
skill = "bmad-dev-story"

[[agent.menu]]
code = "CR"
skill = "bmad-code-review"
```

On activation, `SKILL.md` greets with the icon, loads persistent facts, renders the menu as a numbered table, and dispatches on `code`/number/fuzzy match into the referenced skill. Persona survives the dispatch — Amelia's icon and tone carry through `bmad-dev-story` execution.

This is **menu-driven sub-skill orchestration without the framework boilerplate**.

## Three-Layer TOML Customization

Every skill resolves config through this chain:

1. `{skill-root}/customize.toml` — defaults (overwritten on update; do not edit)
2. `{project-root}/_bmad/custom/{skill-name}.toml` — team overrides
3. `{project-root}/_bmad/custom/{skill-name}.user.toml` — personal overrides

Merge rules are explicit:

- **Scalars** → override wins
- **Tables** → deep-merge
- **Arrays** (`persistent_facts`, `principles`, `activation_steps_*`) → append
- **Arrays-of-tables keyed by `code`/`id`** → replace matching items, append new ones

Resolved by `python3 _bmad/scripts/resolve_customization.py --skill … --key agent`. If the script fails, `SKILL.md` instructs the agent to merge by the same rules itself — graceful degradation built into the prompt.

This is what [[project-solo-factory]] is missing: a clean override layer so users can tweak `principles` or swap a menu item without forking the skill.

## Persistent Facts with `file:` Prefix

```toml
persistent_facts = [
  "Our org is AWS-only — do not propose GCP or Azure.",
  "file:{project-root}/docs/standards.md",
  "file:{project-root}/**/project-context.md",
]
```

A clean way to inject static context at activation. Literals are loaded verbatim; `file:` entries (globs supported) get their contents inlined as facts. Distinct from runtime memory sidecar — these are loaded once per session.

## Catalog-Driven Help Router

`bmad-help` skill is interesting on its own. It reads `_bmad/_config/bmad-help.csv`:

```
module,skill,display-name,menu-code,description,action,args,
phase,preceded-by,followed-by,required,output-location,outputs
```

Then it scans the resolved `output-location` paths with the `outputs` glob patterns to detect what artifacts already exist, and recommends the next step based on phase + `preceded-by`/`followed-by` chains + `required` gates.

Compared to [[project-solo-factory]]'s markdown `routing.md` (read by humans, not parsed), this is **machine-readable navigation that grounds in actual filesystem state**. The skill literally answers "where am I in the workflow?" by looking at what files exist.

## Module System

Phases live as numbered folders inside a module:

```
src/bmm-skills/
├── module.yaml           ← agent roster (essence only) + config schema
├── module-help.csv       ← help router catalog
├── 1-analysis/
├── 2-plan-workflows/
├── 3-solutioning/
└── 4-implementation/
```

`module.yaml` keeps the agent **roster** (code, name, title, icon, one-line description) — read by `bmad-help`, party-mode, retrospective for routing and display. Full persona lives in each agent-skill's `customize.toml`. Clean separation: roster = directory; behavior = skill.

Other modules (Test Architect, Game Dev Studio, Creative Intelligence Suite) plug in the same way.

## Plugin Composition

`.claude-plugin/marketplace.json` ships **two** plugins from one repo:

- `bmad-pro-skills` — 11 anytime-available core skills (help, brainstorm, party-mode, distillator, shard-doc, advanced-elicitation, editorial-review, adversarial-review, edge-case-hunter…)
- `bmad-method-lifecycle` — full BMM lifecycle (analysis → planning → solutioning → implementation)

Letting users adopt the toolkit progressively rather than all-or-nothing.

## What's Worth Stealing for solo-factory

| BMAD pattern | What [[project-solo-factory]] has now | Gap |
|---|---|---|
| Agent = skill with `[agent]` block + menu | Agents in `.claude/agents/` separate from skills | Two primitives, no menu dispatch |
| TOML 3-layer merge with explicit rules | Single `SKILL.md`, no override surface | Users fork to customize |
| `persistent_facts` with `file:` glob | Ad-hoc context loading | Inconsistent across skills |
| CSV catalog + filesystem scan for "where am I" | Markdown `rules/routing.md` | Routing isn't grounded in actual state |
| Phase-numbered module folders | Flat skills directory | Order in docs only, not structure |
| `module.yaml` agent roster (essence only) | No equivalent | Persona/dispatch info scattered |

The biggest concrete win would be adopting the TOML override layer — it's a small change (skill stays a single file otherwise) that unlocks team/user customization without forking.

## Related

- [[agent-toolkit-landscape]] — BMAD belongs in **Executable Skill Systems** alongside Superpowers and solo-factory; differentiator is the agent-as-skill unification
- [[skills-standard]] — BMAD is the most disciplined consumer of SKILL.md: agents and workflows both packaged as skills, with TOML overrides as the customization surface
- [[ruflo-orchestration]] — opposite design philosophy: BMAD is minimal & focused on agile methodology, Ruflo is maximal & swarm-oriented (32 plugins, federation, GOAP planner)
- [[project-solo-factory]] — direct comparison; BMAD is more disciplined about layering, solo-factory is more pipeline-automated
- [[agent-patterns-stream2]] — both rely on lazy-loaded skills as the primary primitive
- [[hermes-agent]] — auto-creates skills at runtime; BMAD ships a fixed catalog but allows user-defined overlays
- [[claude-code-anatomy]] — explains the plugin/marketplace mechanics BMAD builds on
