---
type: summary
description: "LLM agents (Claude Code, Codex, Gemini CLI) run with full filesystem access. Sandboxing via lightweight VMs solves this: agent works in isolation, sees only ..."
title: "Agent sandboxing — safe LLM agent execution on Mac"
created: 2026-02-11
updated: 2026-10-27
tags: [agents, security, sandbox, vm, macos, privacy, isolation]
course_module: 4
course_order: 9
publish: true
source_path: "1-methodology/agent-sandboxing.md"
index_line: "Safe LLM agent execution via lightweight VMs. Lima on macOS, project-scoped mounts"
index_section: "concept"
---

## Key Takeaways

LLM agents (Claude Code, Codex, Gemini CLI) run with full filesystem access. Sandboxing via lightweight VMs solves this: agent works in isolation, sees only what you share.

**Why:** `--yolo` without fear (agent can't harm host), privacy control (you decide what agent sees), isolation (agent installs/deletes freely), reproducibility (clean env per project).

**Real case:** Codex reads files outside working directory even WITHOUT `--yolo`. VM is the only reliable way to prevent this.

**Approaches:** Lima/Colima VMs on macOS (Apple Silicon), Docker Desktop (heavier), nsjail (Linux only). Lima recommended: lightweight, mounts project directory read-write, rest of system invisible.

**Pattern:** `lima start agent-sandbox.yaml` → mount project dir → run agent inside → changes sync back to host. Config specifies CPU/RAM limits, network policy, shared directories.

## What others found since (Oct 2026)

- **Egress and credentials, not just the filesystem.** Anthropic's [How we contain Claude](https://www.anthropic.com/research/how-we-contain-claude) (May 2026): the OS sandbox cut permission prompts 84%, yet in a red-team run a phished prompt exfiltrated `~/.aws/credentials` in 24 of 25 retries, and only egress and filesystem boundaries would have stopped it. A domain allowlist turned out to be a capability grant: data left through api.anthropic.com (reported). Matthew Green ([Sep 2026](https://blog.cryptographyengineering.com/2026/09/30/is-sandboxing-sufficient-to-contain-rogue-agents/)) puts it as: a sandbox moves the problem to the gate it leaves open. Related: [[dsewiki-agent-collusion]].

## Connections

- [[privacy-as-architecture]] — sandboxing = privacy at the execution layer, not just data layer
- [[harness-engineering-summary]] — sandbox is an architectural constraint (component 2) for agent safety
- [[agent-self-discipline]] — sandboxing is the external guardrail when internal discipline isn't enough
- [[cloudflare-computer-agent-runtime]] — the same isolation at cloud scale, where the driver is unit economics rather than trust: an isolate per agent instead of a VM per agent
