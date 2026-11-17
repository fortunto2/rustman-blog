---
type: concept
title: "Skills or a doc tree: where an agent's on-demand knowledge should live"
description: "Two ways to give a coding agent knowledge it loads only when needed, skills and a plain tree of well-named documents, what a small study and Claude Code's own source say about each, and the rule I apply after counting how many of my skills the model actually sees described."
created: 2026-11-17
tags: [skills, progressive-disclosure, context-engineering, claude-code, codex, harness]
publish: true
learned_from: "session 20221b3e-9dc7-4338-a083-2e28e72e25e2 (17.11.2026); t.me/llm_under_hood/960, /982, /988"
index_line: "Skills vs doc tree (progressive disclosure). Alexey S study, Oct 2026: `tree docs` beat skills on every project in Claude and Codex, gap grows with codebase, Claude +30% tokens on docs. Claude Code 2.1.326 source: skill listing budget = context × 4 chars × 0.01 (8,000 chars at 200k), per-description cap 1,536, knobs SLASH_COMMAND_TOOL_CHAR_BUDGET / skillListingBudgetFraction. Measured here 17.11: 95 of 156 skills listed by bare name, 47 of 67 solo:*. Rule: knowledge → doc tree; procedures with scripts → skills; route by hook. 16 of 64 solo skills invoked in 30 days; `skillOverrides` (on | name-only | user-invocable-only | off) works for own skills only, NOT third-party plugin skills (measured 2.1.326; retracted claim); plugin lever = SKILL.md disable-model-invocation or skillListingBudgetFraction (set 0.02)"
---

# Skills or a doc tree

## Definition

Both are **progressive disclosure**: the agent starts with a short map and opens the detail only
when the task needs it.

- A **skill** is a folder with `SKILL.md`. The harness lists every skill's name and description in
  the context; the body loads when the model decides to use it ([[skills-standard]]).
- A **doc tree** is a directory of documents whose file names say what is inside, plus one line in
  `AGENTS.md` / `CLAUDE.md`. Rinat Abdullin's whole setup is that one line:
  `Always run tree docs at the beginning to get an overview of durable documents. Before changing documentation read document_writing.md.`

He does not use skills at all, and organizes his company-brain workspaces the same way
([[company-brain]]).

## Rule

- **Knowledge goes in the doc tree.** Facts about a project, decisions, how a subsystem works:
  documents with descriptive names, reachable from `CLAUDE.md` or a generated index
  (this wiki's `index.md` is the same idea at KB scale).
- **Procedures with tools stay skills.** A skill earns its place when it carries scripts,
  references and a workflow the agent would otherwise rebuild, not when it is a page of advice.
- **Do not route by description alone.** The listing is budgeted (numbers below), so a skill can
  reach the model as a bare name. Route by prompt shape in a hook (here `harness/routing.json`
  injects "load `/solo:research`"), which works whether the description survived or not.
- **When the skill count grows, prune first, then raise the budget.** Raising costs tokens in every
  session; a skill nobody invoked in a month costs them for nothing. Pruning does not mean deleting.
  For your own skills (`~/.claude/skills/`, a project's `.claude/skills/`) Claude Code's
  `skillOverrides` setting takes `on`, `name-only`, `user-invocable-only` or `off` per skill, and
  `user-invocable-only` drops a skill from the model's listing while its slash command keeps
  working. **It does not reach a third-party plugin's skills** (measured below), so for those the
  lever is the plugin's own `SKILL.md` (`disable-model-invocation: true`), which changes it for
  everyone who installs the plugin, or a bigger budget. Keep listed every skill a routing hook
  tells the model to load.

## Exceptions

- Inside a product agent you control the listing and the traffic, and Anthropic's own commerce
  blueprint finds one agent with a handful of skills beats both one big prompt and subagents
  ([[commerce-agent-blueprint]]). The truncation problem is a symptom of 150 skills in a personal
  harness, not of the skill format.
- Small projects: the study below found both approaches work equally well there.

## Numbers

- **Study, reported** (Alexey S, Oct 2026, shared by Rinat in post 960): tree docs beat skills on
  answer accuracy and on calling the doc/skill the question implied, on several small projects and
  on FastAPI, in both Claude and Codex; the gap widens as the codebase grows. Claude ignored skills
  on utility questions and went straight to code; with tree docs it spent ~30% more tokens than
  Codex did.
- **Codex, reported** (Rinat, 9 Nov 2026): ~20k tokens of harness context before the first user
  message, with every optional skill switched off.
- **Claude Code source, measured here** (binary 2.1.326, 17 Nov 2026): the skill listing budget is
  `context_tokens × 4 chars × 0.01`, i.e. 8,000 characters at the 200k default; one description is
  capped at 1,536 characters. Overrides: env `SLASH_COMMAND_TOOL_CHAR_BUDGET` (absolute chars) or
  settings `skillListingBudgetFraction` / `skillListingMaxDescChars`.
- **My own listing, measured here** (17 Nov 2026): of 156 skills in the session, **95 arrived as a
  bare name** with no description, including 47 of 67 `solo:*` skills such as `validate`,
  `launch`, `grill` and `diagnose`, whose `SKILL.md` files do have descriptions. The model was
  choosing among them by name.
- **What gets used, measured here** (1,220 transcripts of the last 30 days, 17 Nov 2026): 16 of 64
  solo skills were invoked at all, by the Skill tool or a slash command. `humanize` led with 16 calls;
  42 skills were neither invoked nor named by the routing hook.
- **`skillOverrides` and plugin skills, measured here** (2.1.326, 17 Nov 2026, the `init` event of
  `claude -p --output-format stream-json`): `"airq": "off"` removed a personal skill (144 → 143
  listed); `"off"` under `solo:kindle`, `kindle`, `solo-kindle` and `solo:solo-kindle` left the
  plugin skill listed every time. In the binary, plugin skills get override names only when the
  plugin comes from Anthropic's own repository. **Retracted** the same day: an earlier version of
  this page said `skillOverrides` could hide the 42 unused solo skills. What I did instead: raised
  `skillListingBudgetFraction` to 0.02 (16,000 characters at 200k context).

## Learned from

Reading Rinat Abdullin's channel for [[company-brain]] (posts 960, 982, 988), then checking the
claim against this harness instead of taking it on trust: the budget formula is in the Claude Code
binary, and the bare names were in my own session's skill list.

## Connections

- [[skills-standard]] — the format itself
- [[writing-claude-md]] — the one-line entry point a doc tree hangs from
- [[context-engineering]] — progressive disclosure as a context budget
- [[company-brain]] — the same pattern applied to a whole company's memory
- [[agent-harness]] — hub
