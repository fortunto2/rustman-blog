---
type: summary
description: "Harness Engineering — designing environments where AI agents do reliable work. Humans steer, agents execute. Synthesized from three sources: OpenAI experimen..."
title: "Harness Engineering — development in the age of agents"
created: 2026-04-07
tags: [harness, agents, ai-dev, context-engineering, methodology]
publish: true
source_path: "1-methodology/harness-engineering.md"
source_url: "https://openai.com/index/harness-engineering/"
---

## Key Takeaways

**Harness Engineering** — designing environments where AI agents do reliable work. Humans steer, agents execute. Synthesized from three sources: OpenAI experiment (Ryan Lopopolo), Mitchell Hashimoto's adoption journey, and Birgitta Böckeler's analysis (Thoughtworks/Martin Fowler).

Core loop: **agent mistake → fix the harness** (not the prompt, not the model). Fix CLAUDE.md, add a linter, write a structural test. The repository IS the agent's brain.

Three components (Böckeler/Fowler):
1. **Context Engineering** — CLAUDE.md as table of contents (~100 lines, links deeper), docs/ as system of records, progressive disclosure. One big CLAUDE.md is an **anti-pattern** — pollutes context, rots instantly.
2. **Architectural Constraints** — layered domain architecture, directed dependencies validated by custom linters, parse at boundary (Zod/Pydantic), structural tests (ArchUnit-style), taste invariants.
3. **Garbage Collection** — golden principles in repo, recurring cleanup agents, doc-gardening agent, quality grades per domain. Tech debt as credit — pay continuously in small installments.

6 adoption steps (Hashimoto): drop chatbot → reproduce your work → end-of-day agents → outsource slam dunks → engineer the harness → always have agent running.

OpenAI numbers: 3→7 engineers, ~1M lines, ~1,500 PRs, 3.5 PR/engineer/day, 0 human code, ~10x speedup. Max single Codex run: 6+ hours.

Predictions: harness as new service templates, tech stack convergence toward AI-friendliness, topology convergence, two worlds (greenfield with harness vs retrofit on legacy).

**Our implementation:** [solo-factory](https://github.com/fortunto2/solo-factory) (27 skills as harness), [solograph](https://github.com/fortunto2/solograph) (code intelligence as context), [rust-code](https://github.com/fortunto2/rust-code) (AI terminal agent).

## Connections

- [[solo-methodology]] — harness engineering is the foundational methodology
- [[stream-six-layers]] — harness = building an accurate map (epistemic layer 1) of the codebase
- [[privacy-as-architecture]] — architectural constraints parallel: decisions baked into structure, not features
