---
type: concept
description: "TUI coding agent with BAML agent loop, fuzzy search, tmux background tasks, skills, MCP support. Alternative to Claude Code in Rust."
title: "rust-code — AI terminal coding agent in Rust"
created: 2026-03-15
tags: [project, open-source, rust, agent, tui, baml, mcp]
publish: true
publish_as: project
source_url: "https://github.com/fortunto2/rust-code"
---

AI-powered terminal coding agent written in Rust. TUI interface, BAML-based agent loop for structured tool calling, fuzzy file search, tmux background tasks, MCP support.

**GitHub:** [rust-code](https://github.com/fortunto2/rust-code) — 7 stars, Rust.

**Architecture:** BAML defines the agent loop schema — structured tool dispatch, not string parsing. The agent uses the same SGR principles as the enterprise RAG challenge winners: schema first, constrained output, validation.

**Key features:** TUI with ratatui, BAML agent loop, fuzzy search (television), tmux integration for background tasks, skill system, MCP tool support.

- [[schema-guided-reasoning]] — BAML agent loop = SGR for agent tool dispatch
- [[tool-calling-four-layers]] — implements layers 1-4 in Rust
- [[enterprise-rag-challenge]] — same structured output patterns that win RAG competitions
