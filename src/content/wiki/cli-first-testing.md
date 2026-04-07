---
type: concept
description: "Every project should have a CLI utility that mirrors the core business logic without UI. Not a separate tool — the same modules, different entry point."
title: "CLI-first testing — every project gets a CLI mirror"
created: 2026-04-07
tags: [testing, cli, integration, tdd, methodology]
publish: true
---

Every project should have a **CLI utility** that mirrors the core business logic without UI. Not a separate tool — the same modules, different entry point.

```
lib/pipeline/       # Business logic (pure functions, no UI)
cli/main.ts         # CLI wrapper — calls same functions as UI
app/                # UI — calls same functions from lib/pipeline/
Makefile            # make integration — runs CLI with test data
```

Why this matters:
- **Integration testing** — verifies full pipeline end-to-end without browser/simulator
- **Debugging** — CLI is faster to launch, simpler to debug than UI
- **Pipeline-friendly** — CI/CD runs `make integration` without headless browser
- **Separation of concerns** — if logic works through CLI, it doesn't depend on UI framework

Rules:
- CLI uses same modules as UI (DRY — one implementation, two entry points)
- CLI must work without LLM / without network (deterministic fallback)
- `make integration` — mandatory Makefile target in every project
- `/solo:scaffold` generates CLI stub, `/solo:build` uses `make integration` after pipeline tasks

This is a forcing function for clean architecture: if your business logic can't run from a CLI, it's too coupled to the framework.

- [[dev-principles-summary]] — origin: CLI-first testing section
- [[one-pain-one-feature-launch]] — CLI enables rapid validation: ship logic, test via CLI, add UI later
- [[solo-methodology]] — `make integration` is mandatory in the solo dev workflow
