---
type: concept
description: "Code intelligence MCP server: a tree-sitter code graph across every project, plus full-text search over Claude Code sessions, a knowledge base and external sources. 13 tools, FalkorDB + SQLite FTS5, no embeddings."
title: "solograph — code intelligence MCP server"
created: 2026-02-07
updated: 2026-10-26
tags: [project, open-source, mcp, code-graph, falkordb, tree-sitter, python, rust]
project_type: tool
course_module: 6
course_order: 4
publish: true
publish_as: project
source_url: "https://github.com/fortunto2/solograph"
pypi: solograph
github: fortunto2/solograph
index_line: "solograph: code graph (FalkorDB + tree-sitter, 83 projects) + FTS5 search over sessions/KB/sources, 13 tools; vectors removed in 0.7 after measuring them (0/40 recall, 14 s cold, hung source search)"
index_section: "project"
---

# Solograph

Code intelligence MCP server for Claude Code: a tree-sitter code graph across every project in a portfolio, plus full-text search over Claude Code session history, a markdown knowledge base, and indexed external sources (YouTube, ProductHunt, TrustMRR, Telegram).

```bash
uv tool install solograph
claude mcp add -s user solograph -- uvx solograph
solograph-cli init ~/projects --deep
```

## 13 MCP tools

| Tool | What it answers |
|------|-----------------|
| `codegraph_query` | Read-only Cypher over the code graph |
| `codegraph_stats` | Counts of projects, files, symbols, packages, sessions, edges |
| `codegraph_explain` | Architecture of one project: stack, layers, hub files, dependencies |
| `codegraph_repomap` | Aider-style map of a project's most important files and symbols |
| `codegraph_shared` | Packages used by more than one project |
| `project_info` | Registry entry for a project |
| `session_search` | Every past prompt and answer, including transcripts Claude Code already deleted |
| `kb_search` | Markdown knowledge base: frontmatter title, type, tags, body |
| `source_search` | YouTube transcripts (timestamped links), ProductHunt, TrustMRR, Telegram |
| `source_list` / `source_tags` / `source_related` | What is indexed, topics, related videos |
| `web_fetch` | A URL as text |

Web search lives in a separate searxng MCP server, so a broken import in one cannot take the other down.

## Architecture

- **Code graph:** FalkorDBLite (embedded, no Docker). tree-sitter parses Python, Swift, TypeScript, Kotlin, Rust and more into Project → File → Symbol, with imports, calls, inheritance and package dependencies. A nightly job merges new checkouts into the registry and rescans what git says changed: 83 projects, 113k symbols, 781k call edges.
- **Search:** SQLite FTS5, BM25, Snowball stems for Russian and English sent as prefix terms. Every index stats its source files before answering and re-reads only what changed, so there is no reindex step.

```
Project ──HAS_FILE──→ File ──DEFINES──→ Symbol
   │                    │                  │
   └──DEPENDS_ON──→ Package          INHERITS/CALLS
                       ↑
Session ──EDITED──→ File
```

```cypher
-- What breaks if I change this file?
MATCH (f:File {path: 'lib/utils.ts'})<-[:IMPORTS*1..3]-(dep:File) RETURN dep.path
```

## 0.7: the vectors came out

Until October 2026 every search in solograph was an embedding search (multilingual-e5-small on MLX, FalkorDB vector indexes). A review measured each part on the live machine, and the graph was the only part that worked:

| | Vector version | FTS5 version |
|---|---|---|
| Session search, 39 known-answer sessions, found in top 5 | **0** | 32 |
| Why | index held 640 sessions, disk 633, **overlap zero**: Claude Code deletes transcripts after 30 days and nothing re-read the disk | syncs before every search; deleted transcripts stay as archive |
| KB search, cold | 14 s, top hit always "relevance 1.0" (it was rank position), first result for "tree-sitter code graph" an Amazon page snapshot | 66 ms, BM25 score, hidden dirs skipped |
| Source search | hung past 120 s | 16 ms median |
| Environment | 862 MB (torch) | 149 MB |

Other things the review found: `session_search` had failed on every MCP call for seven weeks (a `-> list[dict]` annotation on a function returning a dict; its tests called the function directly, never through the protocol); the nightly refresh had scanned zero projects for 70 nights after Homebrew dropped PyYAML from its python, and logged "done" each time; `codegraph_query` accepted writes; 40 checkouts were missing from the registry.

The lesson is not "vectors are bad". It is that an index nobody measures drifts silently, and that for an agent's own history and notes, lexical search plus freshness beats semantic search on a stale index. The same convergence shows up across the [[code-graph-mcp-landscape|code-graph tools on GitHub]]: tree-sitter + SQLite FTS5, embeddings optional.

## Sessions as an archive

Claude Code keeps transcripts 30 days. The session index keeps their text after that, marked `transcript: deleted`; live ones come with a `claude --resume` command. Transcripts are append-only, so a grown one is read from its last byte offset: live transcripts reach 400 MB, and a resync costs ~10 ms. Batch runs from temp directories (`claude -p` from `/tmp`, agent scratchpads, 322 of 633 transcripts here) are left out; a folder with `.solograph-private` or Spotlight's `.metadata_never_index` keeps its sessions out entirely.

## Why it matters

Solograph implements [[context-graphs-summary|context graphs]] for code: every session is a [[decision-traces-compound|decision trajectory]] linked to the files it touched. As a [[agent-memory-architecture|memory system]]: episodic memory (session_search), reference memory (kb_search), structural memory (the code graph).

## Links

- [GitHub](https://github.com/fortunto2/solograph) — MIT, Python, PyPI
- [[codegraph-guide]] — architecture and usage guide
- [[code-graph-mcp-landscape]] — the tools solograph sits among, October 2026
- [[graphify-vs-solograph]] — the closest competitor and what to take from it
- [[agent-toolkit-landscape]] — where solograph fits in the ecosystem
