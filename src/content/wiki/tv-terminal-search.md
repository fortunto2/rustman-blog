---
type: concept
title: "Television (tv) — fuzzy terminal search for wiki and code"
description: "How to set up tv (television) as interactive fuzzy finder for wiki, docs, stacks. Custom channels, ripgrep full-text search, bat preview."
created: 2026-04-09
tags: [tools, cli, search, productivity, terminal, rust]
course_module: 6
course_order: 6
publish: true
---

# Television (tv) — Terminal Fuzzy Search

[Television](https://github.com/alexpasmantier/television) is a fast, hackable fuzzy finder for the terminal. Written in Rust. Think fzf but with channels, previews, and custom actions.

## Why tv over grep/fzf

- **Channels** — preconfigured search scopes (wiki, git files, docker, k8s...)
- **Preview** — bat syntax highlighting inline while you type
- **Actions** — F12 opens file in editor, custom keybindings
- **Speed** — Rust, instant even on large codebases

## Install

```bash
brew install television   # macOS
cargo install television  # from source
```

## Wiki Search Channels

Two custom channels for the solopreneur knowledge base:

### `wiki` — fuzzy file picker

Find wiki pages by filename. Searches across wiki/, principles, methodology, stacks.

```bash
tv wiki              # or: make wiki-tv
```

Channel config (`~/.config/television/cable/wiki.toml`):

```toml
[metadata]
name = "wiki"
description = "Search solopreneur wiki, methodology, stacks"
requirements = ["rg", "bat"]

[source]
command = [
  "rg --files --glob '*.md' ~/startups/solopreneur/wiki/ ~/startups/solopreneur/0-principles/ ~/startups/solopreneur/1-methodology/ ~/startups/solopreneur/2-inspiration/",
  "rg --files --glob '*.yaml' ~/startups/solopreneur/1-methodology/stacks/"
]

[preview]
command = "bat -n --color=always '{}'"
env = { BAT_THEME = "ansi" }

[keybindings]
shortcut = "f2"
f12 = "actions:edit"

[actions.edit]
command = "${EDITOR:-vim} '{}'"
shell = "bash"
mode = "execute"
```

### `wiki-text` — full-text content search

Search inside files with ripgrep. Preview shows matching line with context.

```bash
tv wiki-text         # or: make wiki-tv-text
```

Channel config (`~/.config/television/cable/wiki-text.toml`):

```toml
[metadata]
name = "wiki-text"
description = "Full-text search in solopreneur wiki, docs, stacks"
requirements = ["rg", "bat"]

[source]
command = [
  "rg --line-number --no-heading --color=never --glob '*.md' --glob '*.yaml' '' ~/startups/solopreneur/wiki/ ~/startups/solopreneur/0-principles/ ~/startups/solopreneur/1-methodology/ ~/startups/solopreneur/2-inspiration/"
]

[preview]
command = "bat -n --color=always --highlight-line {2} {1}"
delimiter = ":"
env = { BAT_THEME = "ansi" }

[keybindings]
shortcut = "f3"
f12 = "actions:edit"

[actions.edit]
command = "${EDITOR:-vim} +{2} '{1}'"
shell = "bash"
delimiter = ":"
mode = "execute"
```

## Three Search Tools Compared

| Tool | Type | Best for | Speed |
|------|------|----------|-------|
| `make wiki-search Q="query"` | FTS5 BM25 | Agent/script, ranked results, stemming | ~1ms |
| `make wiki-tv` | Fuzzy file | Human, find a page by name | Instant |
| `make wiki-tv-text` | Fuzzy content | Human, find a line in any file | Instant |

**Use FTS5** when you need ranked results, stemming ("agents" → "agent"), or programmatic access.
**Use tv** when you're browsing interactively and want preview + open in editor.

## Adding to Your Project

Copy the `.toml` files to `~/.config/television/cable/`. Adjust paths in `[source]` command to match your project layout. The pattern works for any markdown-heavy project.

## See Also

- [[cli-first-testing]] — CLI-first approach to tooling
- [[token-efficient-web-requests]] — FTS5 search is the lexical-first approach from this page
- [[codegraph-guide]] — graph-based search (relationships, not text)
- [[fff-agent-file-search]] — fff.nvim: same fuzzy-finder genre, but adds memory (frecency + combo boost) and an MCP surface for AI agents
