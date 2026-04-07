---
type: summary
description: "Knowledge graph of source code across all projects. Scans files, symbols (functions, classes, protocols), dependencies, imports, function calls, class inheri..."
title: "CodeGraph — code intelligence across all projects via FalkorDB + tree-sitter"
created: 2026-02-07
tags: [codegraph, graph, code-intelligence, falkordb, tree-sitter, mcp, solograph]
publish: true
source_path: "1-methodology/codegraph-guide.md"
---

## Key Takeaways

Knowledge graph of source code across all projects. Scans files, symbols (functions, classes, protocols), dependencies, imports, function calls, class inheritance, and git history. FalkorDBLite (embedded, no Docker), Cypher queries. CLI with Rich output. 10 MCP tools via solograph.

**Architecture:** `registry.yaml` (12+ projects) → `codegraph scan [--deep]` → FalkorDB nodes (Project → File → Symbol, File → Package dependencies, Session → File edits). Deep analysis adds imports, calls, inheritance edges. Per-project vector DBs for semantic search.

**Key MCP tools:**
- `codegraph_query` — raw Cypher queries on the graph
- `codegraph_explain` — architectural overview of a project
- `codegraph_shared` — find shared packages across projects
- `project_code_search` — semantic code search within a project
- `codegraph_stats` — graph statistics

**Code reuse detection:** find shared packages, common patterns, functions that multiple projects import. Directly supports the portfolio approach — shared infrastructure across products.

**Session tracking:** records which files each Claude Code session edited. Enables: "what did I work on last week?", "which sessions touched auth code?", "show me all context for this feature."

**This is context graphs applied to code** — not just "what functions exist" but "how do they relate, who uses what, what changed when." The structural memory that harness engineering talks about.

## Connections

- [[context-graphs-summary]] — codegraph IS a context graph implementation for code (capture → retrieve → apply)
- [[decision-traces-compound]] — session tracking = agent trajectory recording, compounds over time
- [[harness-engineering-summary]] — codegraph is an architectural constraint tool: dependency direction, shared packages
- [[solo-methodology]] — codegraph is the code intelligence layer powering the solo dev workflow
- [[rag-patterns]] — graph-boosted RAG pattern implemented: vectors + structural edges
