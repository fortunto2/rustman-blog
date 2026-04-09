---
type: concept
description: "The single most important principle from harness engineering: when an AI agent makes a mistake, don't fix the prompt or try a better model. Fix the environment."
title: "Agent mistake → fix the harness, not the prompt"
created: 2026-04-07
tags: [harness, agents, methodology, debugging]
course_module: 5
course_order: 3
publish: true
source_path: "1-methodology/harness-engineering.md"
---

The single most important principle from harness engineering: when an AI agent makes a mistake, **don't fix the prompt or try a better model**. Fix the environment.

Three mechanisms, escalating in robustness:

1. **CLAUDE.md** — for simple problems (wrong commands, wrong APIs). One line per bad behavior. "Each line in that file is based on a bad agent behavior, and it almost completely resolved them all." — Hashimoto
2. **Linters with remediation** — custom linters whose error messages contain instructions the agent can follow. Not just "error on line 5" but "fix by doing X."
3. **Structural tests** — ArchUnit-style checks that validate dependency direction, file sizes, naming conventions. Automated guardrails, not manual review.

This creates a **ratchet**: mistakes can only happen once. Each failure permanently improves the harness. Over time, the repository becomes a progressively better environment for agents.

The anti-pattern: manually cleaning up "AI slop." OpenAI found that 20% of time (Fridays) went to cleanup — doesn't scale. Automation or bust.

- [[harness-engineering-summary]] — origin: core principle from harness engineering synthesis
- [[solo-methodology]] — the ratchet effect is what makes solo dev viable: compound improvements
- [[kill-iterate-scale]] — same philosophy: predetermined rules remove human judgment from repetitive decisions
