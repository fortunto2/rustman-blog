---
type: summary
description: "How solograph indexes a portfolio: every project's symbol definitions and packages in SQLite FTS5, searchable by their words across all repositories. Started as a FalkorDB code graph; the structural layer was dropped in Oct 2026 after agents asked it nothing structural in four months."
title: "CodeGraph — symbol and package index across all projects"
created: 2026-02-07
updated: 2026-10-27
tags: [codegraph, code-intelligence, fts5, tree-sitter, mcp, solograph]
publish: true
source_path: "1-methodology/codegraph-guide.md"
index_line: "CodeGraph: symbol + package index across all projects (tree-sitter → SQLite FTS5, words of camel/snake names). Graph layer (calls/imports/inheritance) dropped Oct 2026: 0 structural questions in 4 months, grep matched a code-graph MCP 8/8"
index_section: "concept"
---

## Key Takeaways

One index over every project in the registry: symbol definitions (functions, classes, protocols) from tree-sitter, packages from the manifests, files with language and size. SQLite with FTS5, no server. Symbol names are indexed by their words, so "montage profile" finds `resolve_montage_profile` in one repository and `MontageProfile` in the sibling repository where it is actually defined.

**Architecture:** `registry.yaml` (77 projects) → `solograph-cli scan` → `portfolio.db` (projects, packages, files, symbols + FTS5). Every scan is incremental by mtime and size; the nightly job covers the whole portfolio in seconds. Search over sessions, KB and sources is the same SQLite FTS5.

**Key MCP tools:**
- `symbol_search` — where something is defined, across every project
- `project_info` — all projects with portfolio counts; with `name`, what one project is made of (stack, languages, layers, dependencies); with `package`, who uses it

**What it used to be.** Until 0.8 this was a FalkorDB graph with imports, function calls, inheritance and session→file edges, queried in Cypher. Agents asked it nothing structural in four months, and Grep answers those questions as well: a dedicated code-graph MCP against Grep/Read on a 1,100-file repository gave the same accuracy in 8 of 8 runs, with a 16% cost difference on one question type and none on the other. See [[project-solograph]] for the numbers.

**Code reuse detection:** shared packages, and the same concept implemented in several projects (search a phrase, see every repository that defines it). Directly supports the portfolio approach: shared infrastructure across products.

**GitHub:** [solograph](https://github.com/fortunto2/solograph) — open source, Python, SQLite, FastMCP.

## Connections

- [[context-graphs-summary]] — the theory this started from; the measured result is that the agent's own history (sessions) is the part it uses
- [[decision-traces-compound]] — session search is the trajectory record that compounds
- [[harness-engineering-summary]] — shared packages and duplicated concepts as architectural signals
- [[solo-methodology]] — the code intelligence layer of the solo dev workflow
- [[rag-patterns]] — lexical retrieval with freshness beat vectors on a stale index here
