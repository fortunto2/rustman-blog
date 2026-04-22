---
type: concept
title: "fff.nvim + Kovalenko #82 — memory-augmented file search and the retrieval layer for AI coding agents"
description: "Dmitry Kovalenko's fff.nvim (MCP + Neovim fuzzy finder with frecency + query→file memory, sparse bigram index in Rust) and insights from his Hexlet podcast #82 on why retrieval, not models, will decide who wins the coding-agent market."
created: 2026-04-22
updated: 2026-04-22
tags: [agents, mcp, search, rust, neovim, memory, token-efficiency, retrieval, lsp, benchmarks, harness]
publish: true
---

# FFF + Kovalenko #82 — File Search as the Retrieval Layer for Coding Agents

Two sources, one thesis: **agents spend their life searching files and emitting diffs; whoever builds the best retrieval layer for that narrow loop collects the tokens saved across millions of sessions.** The artifact is [fff.nvim](https://github.com/dmtrKovalenko/fff.nvim) — a fuzzy file picker with persistent memory exposed via MCP. The argument is Dmitry Kovalenko's [Hexlet podcast #82](https://www.youtube.com/watch?v=Jcx-JclhB18) with Kirill Mokevnin ("Как работают AI-агенты для программистов: поиск кода, индексы, эффективность", 97 min).

Kovalenko's own framing: *"всё, что делают агенты — это ищут файлы, генерят диффы, и запускают какие-то консольки. И вдруг получилось, что у меня был плагинчик для Neovim под названием FFF."* Toxic tweet → OpenCode CEO offered to hire him → he wrote the integration for free. The plugin grew into an SDK, then an MCP.

## The fff.nvim design, in one diagram

```
┌───────────────────────────┐
│  immutable file vector    │ ← watcher (inotify/FSEvents, no tree walks)
├───────────────────────────┤
│  sparse bigram index      │ ← ~15x smaller than trigrams, mmap'd
│  + overlay for dirty files│   (dirty files searched directly, ripgrep-fast)
├───────────────────────────┤
│  frecency + combo-boost   │ ← query→file history, boost after min_combo_count=3
│  + git-status + defs      │ ← definition parser marks def-lines, returns type bodies inline
└───────────────────────────┘
            │
            ├─ Neovim plugin (Lua bindings)
            └─ MCP server (Claude Code, Codex, OpenCode)
```

### Architectural decisions that matter

- **Bigrams, not trigrams.** Traditional code search (Postgres FTS, Google Code Search) uses trigrams — ~800k unique per project, ~1GB index. Kovalenko uses a small subset of bigrams over English letters + programming punctuation — 4k total. Index is ~15x smaller. His novel addition: **Sparse One Bigram** — stores the bigram *with one character skipped*, so underscores and camel-case boundaries get indexed at higher density. *"Это то, что я нигде до этого не видел, мне в голову пришло."*
- **Immutable index + overlay.** Full repo indexed once (< 1 sec on 100k files); currently-edited files are searched directly, not re-indexed. On large diffs, dump and rebuild in background. The **design budget**: full initial indexing must finish before the LLM emits its first tool_call — ≈ 2 seconds.
- **mmap, not open().** 100k `open()` calls on Linux kernel would dominate startup; memory-mapping pulls the pages lazily on read.
- **File watcher, not rescans.** Subscribe to `inotify` / `FSEvents` and react to deltas instead of walking the tree per query. Most agent tools don't do this — they burn syscalls per invocation.
- **Cross-platform from day one.** ripgrep is heavily tuned for Linux; fff is optimized for macOS and Windows too, where most agents actually run.

## The economics — why tool-level memory pays off

A tool_call isn't a cheap function dispatch. It's an LLM message with a JSON-schema-validated payload, a round trip, a response, and another round of context assembly. Kovalenko: *"Tool-call — это настоящий месседж, который приходит от LMки, содержит огромный JSON. Эти параметры должны совпасть со схемой. Это всё очень долго."* Every saved roundtrip is real money and latency.

Two concrete wins fff lands on top of raw search:

1. **Definition inlining.** When the LLM greps for a type, fff parses definitions, marks those lines, and — if the type body is small — returns it inline. The LLM doesn't have to emit a follow-up `read_file` just to look at the struct.
2. **Git-status and path tags embedded in results.** `(modified in git)`, `(staged)`, `(untracked)` travels with the result. The agent doesn't have to spawn a separate `git status` tool call to know which files it just touched.

This is the same thesis as [[token-efficient-web-requests]] ("pay attention to what crosses the wire") applied to the filesystem boundary — and the same bet as [[mempalace-agent-memory]] and [[project-solograph]], shifted one level down: **don't make the model remember what the tool can**.

## Agent search ≠ human search

The key asymmetry the podcast hammers on: humans know which files they touched this morning, remember which dirs are irrelevant, and can eyeball a list of paths. An agent has none of that — and after [[claude-code-anatomy|compaction]] it has *less* than none. *"Он с нуля начинает искать эти файлы. Поэтому контекст, который ты даёшь, очень важно фильтровать и дополнять."*

Ranking therefore has to encode the working set *inside the tool*:

- **Frecency** (open frequency × recency)
- **Combo boost** — if query `auth` repeatedly terminates with opening `src/session/mod.rs`, that pairing ratchets up
- **Git metadata** as a first-class signal
- **Definition density** as a structural signal

The agent's context isn't the right place to store any of this. The tool is.

## LSP is the wrong abstraction for agents

Kovalenko ripped `rust-analyzer` out of his OpenCode integration: *"Этот LSP от него больше проблем. Он спотыкается, это долго, потому что LSP внутри себя сделан как очень большой индекс, заточенный на дефиниции структур, которые тебе не принадлежат."*

Agents practically never walk the LSP symbol graph (hover, jump-to-def) — they grep text and read files. The one LSP strength — guaranteed renames — agents don't use either. The only observed use is the **lint-feedback loop**: after a TypeScript edit OpenCode runs the linter and feeds the errors back to the LLM, saving the round-trip for spawning a compile tool. If LSP survives in the agent stack, that's the niche.

Contrast with [[codegraph-guide|CodeGraph]]: tree-sitter + FalkorDB structural queries are useful when the agent *needs* structure (who-calls-whom, dependency graphs). For "find this function body," plain text + frecency wins.

## Measurement is the unsolved problem

The deepest concession in the podcast: *"Самая большая проблема всего этого — нет никакого детерминистика аутпута. Практически невозможно замерить, насколько хорошо оно работает."*

This breaks public benchmarks. Cursor published `cursor-bench-2.0` as proprietary, ran it on "an Apple M2," and reported 16 sec. Kovalenko found a coworker's M2, cloned the same repo, ran the same query → 9 sec. He can't reproduce their baseline, let alone their win. Same story with Cursor's Composer bragging about bloom-filter-based indexing that he couldn't replicate smaller than his trigram baseline.

The consequence for our work: any retrieval claim ("my tool is 2x faster, my memory is better") is only meaningful if the benchmark is both open and reproducible on commodity hardware. This is exactly the angle of [[agent-benchmarks]] and why [[pac1-competition-retrospective|PAC1's]] open-eval approach matters. The "benchmark theater" trap is real and it's how big labs will win by default.

## Bun vs Node for agent tooling

A side remark with implications. Node's `glob`, path utils, and file-system helpers are implemented in JavaScript on top of libuv. Agents invoke these thousands of times per session. Bun reimplements them in Zig natively — real speedup for the one workload that actually matters for local agent harnesses. FFI is also trivial in Bun (just `dlopen`), so shipping a Rust core as a shared library is painless. Downside: Zig's memory-management around black-box boundaries is fragile → Bun crashes, especially on Windows (`memory mapping` + NTFS file locks). Until that's fixed, agent infrastructure on Bun is a tradeoff, not a win.

## The thesis: infrastructure, not models

The podcast's closing line: *"Выиграют не модели, а инфраструктура вокруг них."* File search sat untouched for a decade; now in three months Anthropic, Cursor, and OpenCode all started building their own indexing. The retrieval layer is where differentiation compounds: every token saved per tool-call scales to every user, every session, every run.

For us specifically, this aligns the [[agent-mistake-fix-harness|harness loop]] with a concrete frontier: **the tool boundary is where most of our optimization budget should go**, not the prompt. [[project-solograph|Solograph]] already does this at the code-graph + vector layer; fff shows the same pattern at the fuzzy-search layer. [[agent-memory-architecture|Memory architecture]] is the general frame; fff is a procedural-memory instance of it.

## When to reach for this vs alternatives

| Need | Tool |
|------|------|
| Interactive human file browsing | [[tv-terminal-search|tv]] (no memory, but preview + channels) |
| Agent file search with memory | **fff.nvim** |
| Agent code structure queries (who calls whom) | [[codegraph-guide|CodeGraph]] / [[project-solograph|Solograph]] |
| Agent cross-session episodic memory | [[mempalace-agent-memory|MemPalace]] / Solograph `session_search` |
| Human rename / jump-to-def in IDE | LSP (keep) |
| Agent rename | regex + LLM + lint loop (LSP provides no real win here) |

## See Also

- [[agent-memory-architecture]] — where tool-level (procedural) memory fits relative to episodic/semantic/working
- [[agent-toolkit-landscape]] — fff as the tool/integration-layer example
- [[tv-terminal-search]] — human-facing sibling; no learned ranking
- [[token-efficient-web-requests]] — same thesis (save roundtrips), different boundary (HTTP vs filesystem)
- [[codegraph-guide]] — structural code intelligence, complements fff's lexical search
- [[claude-code-anatomy]] — why context compaction resets the agent's working set and why the tool has to carry it
- [[agent-benchmarks]] — why reproducibility matters more than headline numbers
- [[harness-engineering-summary]] — the outer loop that makes any retrieval improvement compound

## Podcast chapters (for deep-dive)

00:00 Как токсичный твит привёл к интеграции в OpenCode · 01:14 Никто не понимает AI-агентов · 06:34 Когда оптимизация начинает иметь значение · 14:47 Внутренности быстрого поиска (watchers, state, bigrams) · 26:10 SDK и MCP без магии · 36:10 LSP против AI · 44:20 AI почти не использует стандартные библиотеки · 53:40 Невозможно нормально измерить AI · 01:02:00 Ловушка: разработка под бенчмарки · 01:17:00 Bun vs Node · 01:28:30 Будущее интерфейсов: CLI и GUI сходятся · 01:35:30 Итог: выиграют не модели, а инфраструктура
