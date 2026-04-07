---
type: summary
title: "Agent sandboxing — safe LLM agent execution on Mac"
created: 2026-02-11
tags: [agents, security, sandbox, vm, macos, privacy, isolation]
publish: true
source_path: "1-methodology/agent-sandboxing.md"
---

## Key Takeaways

LLM agents (Claude Code, Codex, Gemini CLI) run with full filesystem access. Sandboxing via lightweight VMs solves this: agent works in isolation, sees only what you share.

**Why:** `--yolo` without fear (agent can't harm host), privacy control (you decide what agent sees), isolation (agent installs/deletes freely), reproducibility (clean env per project).

**Real case:** Codex reads files outside working directory even WITHOUT `--yolo`. VM is the only reliable way to prevent this.

**Approaches:** Lima/Colima VMs on macOS (Apple Silicon), Docker Desktop (heavier), nsjail (Linux only). Lima recommended: lightweight, mounts project directory read-write, rest of system invisible.

**Pattern:** `lima start agent-sandbox.yaml` → mount project dir → run agent inside → changes sync back to host. Config specifies CPU/RAM limits, network policy, shared directories.

## Connections

- [[privacy-as-architecture]] — sandboxing = privacy at the execution layer, not just data layer
- [[harness-engineering-summary]] — sandbox is an architectural constraint (component 2) for agent safety
- [[agent-self-discipline]] — sandboxing is the external guardrail when internal discipline isn't enough
