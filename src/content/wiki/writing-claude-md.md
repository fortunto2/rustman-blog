---
type: concept
title: "Writing effective CLAUDE.md files"
description: "Patterns for writing agent instruction files. Karpathy's 4 principles (29k stars), our hierarchical approach, what works, what doesn't. Quality Gate, progressive disclosure, refs over inline."
created: 2026-04-14
tags: [agents, context-engineering, methodology, claude-code]
course_module: 5
course_order: 22
publish: true
---

# Writing effective CLAUDE.md files

CLAUDE.md is the primary way to shape agent behavior. It loads into context on every request. The difference between a good and bad CLAUDE.md is the difference between an agent that helps and one that fights you.

## Karpathy's 4 principles (29k stars)

[andrej-karpathy-skills](https://github.com/forrestchang/andrej-karpathy-skills) went viral for good reason. Four rules addressing three real LLM failure modes:

**Failure modes:** silent assumptions, overcomplication, orthogonal changes.

**Rules:**
1. **Think before coding** -- state assumptions, ask when confused, push back on bad requests
2. **Simplicity first** -- minimum code, no speculative abstractions, no unrequested flexibility
3. **Surgical changes** -- touch only what's needed, match existing style, don't "improve" adjacent code
4. **Goal-driven execution** -- transform "add validation" into "write tests for invalid inputs, then make them pass"

These are good defaults. But they're generic. A project-specific CLAUDE.md needs more.

## Our approach: hierarchical CLAUDE.md

We use a 3-level hierarchy that Claude Code loads automatically:

```
~/.claude/CLAUDE.md              (56 lines)  — who I am, stack, coding style
~/startups/CLAUDE.md             (61 lines)  — workspace navigation
~/startups/solopreneur/CLAUDE.md (287 lines) — KB commands, wiki, CRM, search
```

Each level adds context. Global is terse (language, stack, methodology). Workspace is routing ("each subdirectory has its own CLAUDE.md"). Project is detailed (every make command, search tools, conventions).

## What makes a good CLAUDE.md

**1. TOC, not encyclopedia.** ~100 lines of pointers. Link to detailed docs with `Ref:` paths. Don't inline 500 lines of rules.

```markdown
## Methodology
Ref: `~/startups/solopreneur/solo-factory/templates/principles/dev-principles.md`
- **TDD:** Red→Green→Refactor
- **Schemas First:** Read Models/schemas/types/ before any work
```

**2. Quality Gate over long rule lists.** Three questions beat twenty rules:

```markdown
## Quality Gate (before completing ANY task)
1. "Am I building bullshit?" — Real problem or surface symptom?
2. "Is this code garbage?" — Would a master accept this?
3. "How to make this amazing?" — What 10x insight is everyone missing?
```

**3. Commands section.** Agent needs to know what it can run. Table format works:

```markdown
## Essential Commands
make idea T="Your idea"    # Capture idea
make search Q="query"      # Semantic search
make wiki-lint             # Health check
```

**4. Don'ts section.** Explicit negative constraints prevent the most common mistakes:

```markdown
## Don't
- Modify .solo/, registry.yaml directly
- Create files without frontmatter
- Use global pip (use uv add)
```

**5. Drift detection.** Name the anti-patterns you've seen:

```markdown
## Drift
- Scheduling instead of doing → do now
- Bullets instead of code → commit
- One fix becomes refactor → stop
```

## What doesn't work

**Walls of text.** Agent skims like a human. 500 lines of rules = none of them followed consistently.

**Vague principles.** "Write clean code" means nothing. "Function >150 lines → split" is actionable.

**No hierarchy.** Everything in one file = bloat. Split: global preferences → workspace routing → project specifics.

**Copy-pasting Karpathy.** The 4 principles are good defaults but they're not your project. Add what's specific: your stack, your commands, your conventions.

## Generating CLAUDE.md for new projects

Our `/scaffold` skill generates CLAUDE.md from stack templates. The template includes:

- Stack-specific commands (make, pnpm, cargo)
- Dev principles reference
- Directory structure
- Essential commands
- Quality Gate
- Don'ts

See [[context-engineering]] for the broader pattern: CLAUDE.md as progressive disclosure.

See [[agent-mistake-fix-harness]] for the feedback loop: agent makes a mistake → fix the CLAUDE.md → mistake happens once.

## Links

- [Karpathy skills](https://github.com/forrestchang/andrej-karpathy-skills) -- 29k stars, the baseline
- [[context-engineering]] -- CLAUDE.md as code, progressive disclosure
- [[agent-self-discipline]] -- drift detection, complexity thresholds
- [[agent-mistake-fix-harness]] -- the ratchet: mistake → harness fix
- [[claude-code-anatomy]] -- CLAUDE.md is the root node of the seven-component architecture; paper measures what sits behind it (98.4% infra)
- [[design-md-spec]] -- Google Labs' DESIGN.md applies the same CLAUDE.md pattern to visual identity: YAML tokens + markdown rationale, linted in CI
