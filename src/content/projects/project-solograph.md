---
type: concept
description: "Multi-project code graph with FalkorDB, tree-sitter AST, MLX embeddings, session history. 15 MCP tools for Claude Code."
title: "solograph — code intelligence MCP server"
created: 2026-02-07
tags: [project, open-source, mcp, code-graph, falkordb, tree-sitter]
publish: true
publish_as: project
source_url: "https://github.com/fortunto2/solograph"
---

MCP server providing code intelligence across all projects. Scans code with tree-sitter, builds a FalkorDB knowledge graph, serves 15 tools to Claude Code.

**GitHub:** [solograph](https://github.com/fortunto2/solograph) — 3 stars, Python, FalkorDBLite (embedded, no Docker).

**Key tools:** `codegraph_query` (Cypher), `codegraph_explain` (architecture), `project_code_search` (semantic), `session_search` (past sessions), `kb_search` (knowledge base), `web_search` (SearXNG).

**Why it matters:** context graphs for code. Every Claude Code session is a decision trajectory recorded in the graph. The graph compounds — each session makes future sessions smarter.

- [[codegraph-guide]] — full architecture and usage guide
- [[context-graphs-summary]] — solograph implements the context graphs pattern
- [[decision-traces-compound]] — session tracking = decision traces that compound
