---
type: concept
description: "TUI coding agent with structured agent loop, fuzzy search, tmux background tasks, skills, MCP support. Alternative to Claude Code in Rust."
title: "rust-code — AI terminal coding agent in Rust"
created: 2026-03-15
tags: [project, open-source, rust, agent, tui, mcp]
publish: true
publish_as: project
source_url: "https://github.com/fortunto2/rust-code"
---

AI-powered terminal coding agent written in Rust. TUI interface, schema-based agent loop for structured tool calling, fuzzy file search, tmux background tasks, MCP support.

**GitHub:** [rust-code](https://github.com/fortunto2/rust-code) — Rust.

**Architecture:** Pydantic-style schemas define the agent loop — structured tool dispatch, not string parsing. The agent uses SGR principles: schema first, constrained output, validation.

**Key features:** TUI with ratatui, structured agent loop, fuzzy search (television), tmux integration for background tasks, skill system, MCP tool support.

- [[schema-guided-reasoning]] — structured agent loop = SGR for tool dispatch
- [[tool-calling-four-layers]] — implements layers 1-4 in Rust
- [[enterprise-rag-challenge]] — same structured output patterns that win RAG competitions
