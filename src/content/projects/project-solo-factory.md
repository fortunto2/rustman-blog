---
type: concept
description: "Claude Code plugin with 27 startup skills and 3 agents. Pipeline: research → validate → scaffold → build → deploy → launch. Privacy-first, offline-first."
title: "solo-factory — Claude Code plugin for solopreneurs"
created: 2026-02-01
tags: [project, open-source, claude-code, plugin, skills, agents]
publish: true
publish_as: project
source_url: "https://github.com/fortunto2/solo-factory"
---

Claude Code plugin that turns a solo founder into a startup factory. 27 skills covering the full pipeline from idea to launch.

**What it does:** `/research` → `/validate` → `/scaffold` → `/plan` → `/build` → `/deploy` → `/launch`. Each skill is a structured workflow that guides Claude through a specific task.

**GitHub:** [solo-factory](https://github.com/fortunto2/solo-factory) — MIT license.

**Stack:** Claude Code plugin system (SKILL.md + references/ + scripts/). Skills written as markdown instructions, not code. Agents: researcher (sonnet), code-analyst (haiku), idea-validator (sonnet).

**Key innovation:** skills are prompts, not programs. The harness (CLAUDE.md + skills + rules) IS the product. Agent mistake → fix the skill, not the code.

- [[harness-engineering-summary]] — solo-factory IS harness engineering in practice
- [[solo-methodology]] — the plugin that powers the methodology
- [[agent-mistake-fix-harness]] — every skill improvement is a harness fix
