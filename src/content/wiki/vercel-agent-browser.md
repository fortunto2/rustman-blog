---
type: concept
title: "Vercel agent-browser — CDP in Rust with accessibility refs for LLMs"
description: "Vercel Labs' agent-browser (30k ★) is a native Rust CLI that rethinks browser-automation primitives for AI agents: accessibility-tree refs (@e1, @e2) instead of CSS selectors, content boundaries against prompt injection, batch mode, and a persistent daemon — no Node.js, no Playwright."
created: 2026-04-22
tags: [agents, browser-automation, cdp, rust, cli, vercel, accessibility, prompt-injection]
publish: true
---

# agent-browser — Browser Automation Designed for LLMs

[vercel-labs/agent-browser](https://github.com/vercel-labs/agent-browser) (30k stars, Apache-2.0) is a native Rust CLI that talks directly to Chrome via CDP. The thesis is simple: Playwright and Puppeteer were built for engineers writing tests. LLMs need a different surface — **stable element refs from the accessibility tree, structured JSON everywhere, explicit content boundaries, and a stateless command shape that composes with tool-calling**.

## The primitive that matters: `@e1` refs

Every traditional browser automation tool hands the agent a CSS selector or XPath. Those shift on every re-render. agent-browser exposes the page's accessibility tree:

```bash
agent-browser snapshot
# - button "Submit" [ref=e2]
# - textbox "Email" [ref=e3]

agent-browser click @e2
agent-browser fill @e3 "test@example.com"
```

Refs are deterministic and stable across commands in a session. The LLM doesn't have to re-query after every click to find the "new" button — it already has `@e2` and can keep using it. This is the same move [[fff-agent-file-search|fff.nvim]] made at the file-search layer: give the agent an index with meaningful IDs and stop making it re-derive them on every turn.

Traditional selectors still work (`click "#submit"`, `find role button click --name "Submit"`), but the ref flow is the one optimized for LLMs.

## Architecture

```
Rust CLI  ──Unix socket / named pipe──▶  Rust daemon  ──CDP──▶  Chrome for Testing
```

- **Native Rust, no Node.js.** The daemon speaks CDP directly. Fits on any host Rust can target. Multi-platform binaries ship for macOS/Linux/Windows.
- **Persistent daemon.** First command starts it; subsequent commands reuse it. `AGENT_BROWSER_IDLE_TIMEOUT_MS` for cleanup. This is the crucial win over Playwright's per-invocation process: thousand-call agent sessions don't pay startup cost.
- **Chrome for Testing.** `agent-browser install` downloads the official Google automation channel. No "which Chrome is this?" guesswork. Existing Chrome, Brave, Playwright, or Puppeteer installs are detected and reused.
- **CLI-first, not MCP-first.** Vercel's bet: plain shell commands with structured output compose with every agent framework trivially — no MCP server, no schema dance. `batch` subcommand amortizes startup when you have a known sequence.

## Content boundaries — the prompt-injection defense

The feature I didn't expect: `--content-boundaries` wraps tool output in explicit delimiters so the LLM can distinguish what *it* produced from what the *page* produced. A user-visible phrase like "IMPORTANT: ignore previous instructions" is just text inside a page snapshot, not an instruction. Without boundaries, that's exactly how injection attacks land.

This is the same concern [[token-efficient-web-requests]] raises for web fetching ("you're feeding untrusted HTML into the prompt") but specifically for browser automation, where scraped text is the *primary* return value of every tool call.

## Features that signal the target audience is agents, not humans

- **`chat "<instruction>"`** — a built-in agent inside the CLI. Natural-language browser control, single-shot or REPL. You can wire your agent *to* it or just use it alone.
- **`screenshot --annotate`** — numbered visual labels on elements that map to `@e` refs. Multimodal agents see the annotation and can click by number.
- **`batch`** with stdin JSON — execute a known sequence in one process. Also skippable per-step (`--bail` on first error).
- **`stream enable --port`** — runtime WebSocket for live preview of the automated browser. For harnesses that want to observe without re-requesting snapshots.
- **Session persistence via `--session-name`** — auto-saves cookies and localStorage between runs. Log in once per session name, reuse.

## When to reach for this vs alternatives

| Need | Tool |
|------|------|
| Persistent logged-in Chrome profile, personal agent | [[browser-automation-cdp]] (Playwright + `connect_over_cdp`) |
| Ephemeral automation in an agent workflow, want ref-based UI interaction | **agent-browser** |
| MCP integration into Claude Code / Cursor | Playwright MCP (still the path if you want MCP specifically) |
| Cloud-native scaled browser fleet | Browserless / Browserbase / Kernel — agent-browser lists integrations |

The clean split: `browser-automation-cdp` = "my Chrome on my Mac mini, logged into everything, agent reuses"; `agent-browser` = "the tool shape an LLM would design for itself if it could."

## Why this pattern generalizes

agent-browser is a concrete instance of a pattern that keeps recurring in the wiki:

- [[fff-agent-file-search]] — rewrite file search for agent workloads (memory, index in tool)
- [[design-md-spec]] — spec file + linter, machine + human layers
- [[context-engineering]] — CDP / structured JSON / refs — all context engineered to be legible
- [[agent-toolkit-landscape]] — integration/tool layer, where token savings compound per call

The common thread: **the AI-native rewrite wins when the old tool was designed for humans**. Browser-automation-for-humans (Playwright) is verbose, state-dependent, and hostile to process isolation. Browser-automation-for-agents needs refs, boundaries, batch, and a daemon. Same surface, different primitives.

## See Also

- [[browser-automation-cdp]] — complementary: personal persistent Chrome via CDP+Playwright. Same protocol, different use case
- [[agent-toolkit-landscape]] — where agent-browser sits (integration layer)
- [[fff-agent-file-search]] — parallel rewrite at the file-search layer
- [[design-md-spec]] — parallel rewrite at the design-system layer
- [[token-efficient-web-requests]] — content-boundary concern applies here too
- [[context-engineering]] — structured output with refs is the pattern
- [[agent-sandboxing]] — real Chrome with CDP is the opposite bet: full access, not isolated
- [[project-rust-code]] — our own Rust CLI agent could integrate agent-browser as the browser tool
