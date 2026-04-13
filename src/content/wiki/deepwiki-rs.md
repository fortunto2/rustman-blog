---
type: concept
title: "deepwiki-rs (Litho) -- AI documentation generator"
description: "Auto-generate C4 architecture docs from any codebase. Rust + LLM, Mermaid diagrams, multi-language, CI/CD integration."
created: 2026-04-14
tags: [rust, documentation, ai, tools, open-source]
publish: true
source_url: "https://github.com/sopaco/deepwiki-rs"
---

# deepwiki-rs (Litho)

AI-powered documentation generator. Scans a codebase, produces C4 model architecture docs with Mermaid diagrams. Keeps docs in sync with code.

## How it works

Four-stage pipeline:

1. **Preprocess** -- scan codebase, extract metadata, identify dependencies
2. **Research** -- LLM analyzes architecture patterns, component relationships
3. **Compose** -- generate C4 diagrams (Context, Container, Component, Code) and structured docs
4. **Validate** -- verify Mermaid syntax, check completeness

## Features

- Multi-language: Rust, Python, Java, Go, C#, JavaScript, TypeScript
- C4 model diagrams at four levels of zoom
- ERD diagrams from database schemas
- Mermaid syntax auto-repair (broken diagrams get fixed)
- External knowledge mounting (PDFs, Markdown, SQL as context)
- CI/CD integration for continuous doc freshness

## Stack

Rust + Axum + LLM integration. Includes Litho Book (markdown reader) and Mermaid Fixer (diagram validation).

## When to use

- New team member onboarding (generate architecture overview)
- Legacy codebase exploration (understand before modifying)
- Documentation debt cleanup (generate, then edit)
- CI pipeline: fail if docs drift from code

## Links

- [GitHub](https://github.com/sopaco/deepwiki-rs)
