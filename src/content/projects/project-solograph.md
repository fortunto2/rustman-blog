---
type: concept
description: "Code intelligence MCP server: multi-project code graph, semantic search, session history, knowledge base, web search. 15 tools for Claude Code. FalkorDB + tree-sitter + MLX."
title: "solograph — code intelligence MCP server"
created: 2026-02-07
tags: [project, open-source, mcp, code-graph, falkordb, tree-sitter, python, rust]
project_type: tool
course_module: 6
course_order: 4
publish: true
publish_as: project
source_url: "https://github.com/fortunto2/solograph"
pypi: solograph
github: fortunto2/solograph
---

# Solograph

Code intelligence MCP server for Claude Code. Multi-project code graph, semantic search, session history, knowledge base, web search.

```bash
# Install + add to Claude Code
uv tool install solograph
claude mcp add -s project solograph -- uvx solograph
```

## 15 MCP Tools

| Tool | What it does |
|------|-------------|
| `codegraph_query` | Cypher queries against code graph |
| `codegraph_stats` | Graph statistics (projects, files, symbols, packages) |
| `codegraph_explain` | Architecture overview of any project |
| `codegraph_shared` | Packages shared across projects |
| `project_code_search` | Semantic code search (auto-indexes on first call) |
| `project_code_reindex` | Reindex project code into FalkorDB vectors |
| `project_info` | Project registry info |
| `session_search` | Claude Code session history search |
| `kb_search` | Knowledge base semantic search (RU + EN) |
| `web_search` | Web search via SearXNG or Tavily |
| `source_search` | Search indexed external sources (YouTube, Telegram) |
| `source_list` | List indexed sources with document counts |
| `source_tags` | Auto-detected topics with video counts |
| `source_related` | Find related videos by shared tags |

## Architecture

**Storage:** FalkorDB (embedded graph DB, no Docker) + MLX embeddings (Apple Silicon, multilingual-e5-small, 384-dim).

**Code scanning:** tree-sitter AST parsing for Python, Swift, TypeScript, Kotlin, Rust. Extracts files, symbols (classes/functions), imports, calls, inheritance.

**Graph schema:**

```
Project ──HAS_FILE──→ File ──DEFINES──→ Symbol
   │                    │                  │
   └──DEPENDS_ON──→ Package          INHERITS/CALLS
                       ↑
Session ──EDITED──→ File
   │
   └──IN_PROJECT──→ Project
```

**Example Cypher queries:**

```cypher
-- Hub files (most imported)
MATCH (f:File)<-[:IMPORTS]-(other:File)
RETURN f.path, COUNT(other) AS importers ORDER BY importers DESC LIMIT 10

-- Shared packages across projects
MATCH (p1:Project)-[:DEPENDS_ON]->(pkg:Package)<-[:DEPENDS_ON]-(p2:Project)
WHERE p1.name <> p2.name
RETURN pkg.name, COLLECT(DISTINCT p1.name) AS projects

-- Impact analysis: what breaks if I change this file?
MATCH (f:File {path: 'lib/utils.ts'})<-[:IMPORTS*1..3]-(dep:File)
RETURN dep.path
```

## Embeddings

| Backend | Model | Platform | Languages |
|---------|-------|----------|-----------|
| **MLX** (primary) | multilingual-e5-small-mlx | Apple Silicon | RU + EN |
| **sentence-transformers** (fallback) | all-MiniLM-L6-v2 | Any | EN |

Auto-detects Apple Silicon → MLX. Falls back to sentence-transformers on other platforms.

## Web Search

Connects to any Tavily-compatible API. Works with self-hosted [SearXNG + Tavily Adapter](https://github.com/fortunto2/searxng-docker-tavily-adapter) — private, no API keys. Smart engine routing: tech queries → GitHub + StackOverflow, academic → arxiv, product → Reddit + app stores.

## CLI

```bash
solograph-cli init ~/projects          # Scan + build graph
solograph-cli scan --deep              # Re-scan with imports/calls/inheritance
solograph-cli explain my-app           # Architecture overview
solograph-cli xray ~/projects          # Portfolio X-Ray (all projects)
solograph-cli diagram my-app           # Mermaid diagram
solograph-cli query "MATCH (n) RETURN n LIMIT 5"
solograph-cli index-youtube -c GregIsenberg -n 10
```

## Why It Matters

Solograph implements [[context-graphs-summary|context graphs]] for code. Every Claude Code session is a [[decision-traces-compound|decision trajectory]] recorded in the graph. The graph compounds — each session makes future sessions smarter.

It's also a full [[agent-memory-architecture|memory system]]: working memory (active session), semantic memory (kb_search), episodic memory (session_search), procedural memory (codegraph_query for patterns).

## Links

- [GitHub](https://github.com/fortunto2/solograph) — MIT, Python, PyPI
- [PyPI](https://pypi.org/project/solograph/) — `pip install solograph`
- [[codegraph-guide]] — full architecture and usage guide
- [[context-graphs-summary]] — the theory behind solograph
- [[agent-memory-architecture]] — solograph as a full memory system
- [[agent-toolkit-landscape]] — where solograph fits in the ecosystem
