---
type: concept
description: "TUI coding agent with structured agent loop, fuzzy search, tmux background tasks, skills, MCP support. Alternative to Claude Code in Rust."
title: "rust-code — AI terminal coding agent in Rust"
created: 2026-03-15
tags: [project, open-source, rust, agent, tui, mcp]
project_type: library
course_module: 7
course_order: 2
publish: true
publish_as: project
source_url: "https://github.com/fortunto2/rust-code"
crate: sgr-agent
github: fortunto2/rust-code
---

# rust-code

Terminal coding agent written in Rust. Ratatui TUI, SGR-driven agent loop with typed tool execution, fuzzy navigation, session persistence, MCP support, and autonomous BigHead mode.

```bash
brew install fortunto2/tap/rust-code     # Homebrew (macOS)
cargo install rust-code                  # crates.io
rust-code doctor --fix                   # install deps (tmux, ripgrep)
```

## Why This Exists

An alternative to Claude Code, built for my workflow:

1. **SGR-driven agent loop** — prompts are compiled schemas, not markdown files. Structured tool dispatch via typed Rust enums, not string parsing
2. **Background tasks on tmux** — sessions you can monitor, detach, reattach. Why doesn't everyone do this?
3. **Fuzzy search everywhere** — git history, file picker, skill browser, all on F1-F10 keys. Everything searchable instantly
4. **Rust** — fast compiler, strict types, one binary. What I was forcing with Pydantic in Python is native here
5. **Memory system built-in** — no need to install plugins, skills, config files. Everything pre-configured out of the box
6. **Minimal dependencies** — but has everything: skills, MCP, tools, sessions

> "With agents, the more typed and strict the language, the better. Python is for humans — but IDEs aren't needed anymore."

Also contains **sgr-agent** crate (v0.6.1) — the core library for building any Rust SGR agent. Structured output, function calling, agent loop, 3 agent variants.

## Usage

```bash
rust-code                                    # interactive TUI
rust-code -p "Find the bug in src/main.rs"   # headless mode
rust-code --resume                           # continue last session
rust-code --resume "refactor"                # fuzzy-search sessions by topic
rust-code -p "build feature X" --loop 5      # autonomous loop (BigHead mode)
rust-code -p "improve yourself" --evolve     # self-evolution mode
```

## Key Features

- **Interactive TUI** -- chat UI built with ratatui + crossterm
- **SGR agent loop** -- typed tool execution with fallback chain (Gemini Pro -> Flash -> Flash Lite)
- **22 built-in tools** -- file read/write/edit/patch, bash (fg + bg), search, git, memory, tasks, agent swarm, MCP, OpenAPI
- **Agent swarm** -- spawn child agents with roles, wait/cancel, parallel task execution
- **Task management** -- persistent kanban board via `.tasks/*.md`
- **Fuzzy file search** (`Ctrl+P`) -- nucleo-powered with live file preview
- **Project symbol search** (`F6`) -- browse functions, structs, enums with code preview
- **Background tasks** (`F7`) -- run long commands in tmux windows with realtime output preview
- **Skills system** (`F9`) -- browse, search, and install from [skills.sh](https://skills.sh) registry
- **MCP support** -- connect external tool servers via `.mcp.json` (Playwright, codegraph, Supabase)
- **OpenAPI -> Tool** -- any REST API as one tool: load spec -> fuzzy search endpoints -> call. 10 pre-configured APIs (GitHub 1093 endpoints, Cloudflare 2656, Stripe, OpenAI, etc.) + APIs.guru (2800+ APIs)
- **Git integration** -- diff sidebar, history viewer, stage and commit from the agent
- **Session persistence** -- `.rust-code/session_*.jsonl`, resume with `--resume`
- **BigHead mode** (`--loop N`) -- autonomous task loop with circuit breaker, control file, `<solo:done/>` signal
- **Self-evolution** (`--evolve`) -- agent evaluates its own runs, patches code, rebuilds, restarts

## Architecture

**SGR agent loop:** Schema-based tool dispatch, not string parsing. Pydantic-style schemas define the loop -- structured tool dispatch, validation, fallback chain. Implements [[tool-calling-four-layers|all four tool calling layers]] in Rust.

**Providers:** Google AI (Gemini), Vertex AI, Anthropic, OpenRouter, Ollama (local). At least one must be configured.

**Agent core:** Built on [sgr-agent](https://github.com/fortunto2/rust-code/tree/master/crates/sgr-agent), which uses [[project-openai-oxide|openai-oxide]] as the LLM transport. Same crate compiles to WASM for browser use.

## TUI Shortcuts

| Key | Action |
|-----|--------|
| `Enter` | Send message |
| `Ctrl+P` | File search |
| `Ctrl+H` | Session history |
| `Ctrl+G` | Refresh git sidebar |
| `Tab` | Focus sidebar |
| `F1` | Diff channel |
| `F2` | Git history |
| `F6` | Project symbols |
| `F7` | Background tasks (tmux) |
| `F9` | Skills browser |

## OpenAPI -> Tool

Convert any REST API into a searchable, callable tool -- no codegen needed.

- 10 popular APIs pre-configured: GitHub, Cloudflare, Stripe, OpenAI, Supabase, PostHog, Slack, Linear, Vercel, Sentry
- APIs.guru fallback: 2800+ APIs searchable by name
- Auto-cache specs to `~/.sgr-agent/openapi-cache/`
- TOML registry at `~/.sgr-agent/apis.toml` for custom APIs
- Auto-detect auth from env vars (`GITHUB_TOKEN`, `STRIPE_SECRET_KEY`, etc.)

## MCP (Model Context Protocol)

Add `.mcp.json` to project or home directory:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

Tools auto-discovered at startup.

## AGENTS.md

rust-code works best when the target repo contains an `AGENTS.md` file with project-specific instructions (stack, architecture, code style, test/build commands). The more concrete, the better the agent performs.

## CLI

```text
Commands:
  setup       Interactive provider setup wizard
  doctor      Check system deps and API auth (--fix to auto-install)
  skills      Manage agent skills (add, remove, search, list, catalog)
  sessions    List or search past chat sessions
  mcp         Show MCP server status and tools
  config      Set default provider (show, set, reset)
  task        Manage project tasks (list, show, create, done, update)

Options:
  -p, --prompt <PROMPT>    Headless mode with a prompt
  -r, --resume [TOPIC]     Resume last session or fuzzy-search by topic
      --model <NAME>       Override model name
      --local              Use local Ollama model
      --loop <N>           Autonomous loop (BigHead mode)
      --max-hours <FLOAT>  Time limit for loop/evolve mode
      --evolve             Self-evolution mode
```

## Links

- [GitHub](https://github.com/fortunto2/rust-code) -- Rust, MIT
- [crates.io](https://crates.io/crates/rust-code)
- [skills.sh](https://skills.sh) -- skill registry
- [[schema-guided-reasoning]] -- structured agent loop = SGR for tool dispatch
- [[tool-calling-four-layers]] -- implements layers 1-4 in Rust
- [[enterprise-rag-challenge]] -- same structured output patterns that win RAG competitions
