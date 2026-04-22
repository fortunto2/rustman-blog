---
type: concept
title: "DESIGN.md — agent-readable design system spec (Google Labs)"
description: "Google Labs' DESIGN.md format: YAML design tokens + markdown rationale in one file. Tokens tell the agent what to use; prose tells it why. CLI lints contrast, diffs regressions, exports to Tailwind/DTCG. The CLAUDE.md pattern applied to visual identity."
created: 2026-04-22
tags: [agents, design-systems, harness, tokens, standards, context-engineering, google-labs]
publish: true
---

# DESIGN.md — Design System as Agent Context

[Google Labs' DESIGN.md](https://github.com/google-labs-code/design.md) is a file format for describing a visual identity in a way that coding agents can actually act on. It's the same pattern as [[writing-claude-md|CLAUDE.md]] and `AGENTS.md`, but for the design layer: a single file at the root of your repo that the agent reads before generating UI.

The format layers two things on top of each other. YAML front matter holds normative design tokens — colors, typography, spacing, rounded corners, component mappings. Markdown prose explains *why* those values exist: the mood, the hierarchy, the contrast story, the do's-and-don'ts. Tokens without rationale leave the agent guessing; rationale without tokens leaves it hallucinating values. DESIGN.md says: put both in the same place, delimited by `---` fences, and let the agent choose which layer it needs at each moment.

## The two-layer file

```md
---
name: Heritage
colors:
  primary: "#1A1C1E"     # deep ink
  secondary: "#6C7278"   # slate borders/captions
  tertiary: "#B8422E"    # "Boston Clay" — sole interaction color
typography:
  h1: { fontFamily: Public Sans, fontSize: 3rem }
  body-md: { fontFamily: Public Sans, fontSize: 1rem }
components:
  button-primary:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.on-tertiary}"
    rounded: "{rounded.sm}"
---

## Colors
The palette is rooted in high-contrast neutrals and a single accent.
- **Tertiary (#B8422E)** — "Boston Clay" — the sole driver for interaction.
```

Tokens are referenced via `{path.to.token}`. Sections are optional but must appear in a fixed canonical order (Overview → Colors → Typography → Layout → Elevation → Shapes → Components → Do's/Don'ts). The version field is currently `alpha`.

## The CLI is the interesting part

What makes DESIGN.md a spec and not just a convention is the tooling that turns it into a structured signal for agents:

- **`lint`** — validates token references, runs WCAG contrast checks on every component's text-on-background pair, outputs findings as JSON. Rules have fixed severities: `broken-ref` = error, `contrast-ratio` / `missing-primary` / `orphaned-tokens` / `missing-typography` / `section-order` = warning, `token-summary` / `missing-sections` = info.
- **`diff`** — compares two files, detects regressions (token removal, contrast drops), returns non-zero exit code so CI can block merges.
- **`export`** — converts tokens to Tailwind theme config or DTCG `tokens.json`. Bridges the agent file to the actual build.
- **`spec --rules`** — prints the format spec itself, designed to be piped into agent system prompts for in-context learning.

This is the same idea as `ruff` for Python or `eslint` for JS but applied to a design file that agents author and read. The linter isn't for humans — it's the deterministic gate that catches the kinds of mistakes agents systematically make (unresolvable references, bad contrast, out-of-order sections). It's the **harness layer** for design, in the sense of [[harness-engineering-summary]].

## Why this pattern matters beyond design

DESIGN.md is a data point for a broader trend: **agent-readable spec files per concern**, each with its own linter. `CLAUDE.md` for project behavior, `AGENTS.md` for agent roster, `DESIGN.md` for visual identity. Each file is both context for the agent and an artifact the agent can update. The linter enforces invariants the agent can't be trusted to keep on its own. That's the [[agent-mistake-fix-harness|harness loop]] at the file-format level: a mistake becomes a lint rule, and the rule compounds.

For our stack this fits right next to [[project-solo-factory|solo-factory]]'s `stacks/*.yaml` templates and [[schema-guided-reasoning|SGR]]'s schemas-first discipline. Both make a specific claim the agent can lint against; prose alone doesn't. DESIGN.md is the UI-layer version.

## When to adopt it

- New project with a real brand system → write DESIGN.md, wire `lint` into CI, export to Tailwind. Agent generates UI consistent with tokens, contrast violations fail the PR.
- Existing project with Tailwind config → DTCG export goes the other way; harder to retrofit the rationale without a designer.
- Throwaway prototypes → overkill. The value comes from agent-generated UI that has to be consistent across sessions.

Currently `alpha` — the spec will shift, and no large ecosystem has adopted it yet. Worth tracking because the **pattern** (token + rationale + linter, one file) is what's durable, not the specific schema.

## See Also

- [[writing-claude-md]] — the original "agent-readable spec file" pattern; DESIGN.md applies the same recipe to a different domain
- [[agent-toolkit-landscape]] — DESIGN.md fits in the integration/harness layer, next to `AGENTS.md` and SKILL.md standards
- [[schema-guided-reasoning]] — tokens-first mirrors schemas-first: exact values the agent must honor, prose for the why
- [[harness-engineering-summary]] — the linter is the deterministic gate; prose alone doesn't enforce invariants
- [[context-engineering]] — two-layer file (machine values + human rationale) is a concrete realization of "context as code"
- [[claude-code-anatomy]] — same observation at a higher level: the operational scaffolding (linter, spec, tokens) is where quality lives, not the generation itself
- [[project-solo-factory]] — candidate for adoption: one `DESIGN.md` per stack template, linted in scaffold output
