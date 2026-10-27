---
type: comparison
title: "Code-graph MCP servers, October 2026 — what the field converged on"
description: "Fifteen code-graph and code-search tools for coding agents, measured on GitHub on 26 Oct 2026: nearly all of them ended up on tree-sitter plus SQLite FTS5 with embeddings optional or absent. What that means for building one, and which three are worth a look."
created: 2026-10-26
tags: [agents, code-graph, mcp, retrieval, tree-sitter, fts5, solograph, comparison]
publish: true
index_line: "15 code-graph/code-search MCP tools (gh-measured 26 Oct 2026): convergence on tree-sitter + SQLite FTS5, embeddings optional. Top picks colbymchenry/codegraph, codebase-memory-mcp, Graphify; star counts look inflated, fork velocity used instead"
index_section: "concept"
---

# Code-graph MCP servers, October 2026

Coding agents waste most of their budget rediscovering structure: grep, open a file, grep again. A wave of tools now hands them a pre-built map instead — a graph of files, symbols, imports and calls, exposed over MCP. This page is the field as of 26 Oct 2026, collected while rebuilding [[project-solograph|solograph]].

## The convergence

Almost every tool that is growing landed on the same design:

- **tree-sitter** for parsing, often dozens of grammars.
- **SQLite with FTS5** for storage and search, BM25 ranking. A few keep a graph DB (FalkorDB, Kuzu forks, Neo4j as an option) for Cypher.
- **Embeddings optional or absent.** The pure-vector entrant (claude-context, Milvus + OpenAI keys) stopped being pushed to in July.
- **Freshness as a feature.** A file watcher or a per-query sync, so the agent never reads a stale map.

Solograph reached the same place from the other side: its vector search measured worse than plain FTS5 on every axis it was tested on (see the 0.7 section of [[project-solograph]]).

## The table

Stars measured with `gh api` on 26 Oct 2026. GitHub no longer serves star histories, so "trending" is fork velocity: days the last 100 forks took, as forks per day.

| Repo | ★ | Store | Embeddings | MCP | What sets it apart | Forks/day |
|---|---|---|---|---|---|---|
| [Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify) | 136k | `graph.json` | none, by design | yes + skill | Leiden communities, edges tagged EXTRACTED/INFERRED, git hooks | 100 |
| [Egonex-AI/Understand-Anything](https://github.com/Egonex-AI/Understand-Anything) | 88k | JSON | none, but an LLM builds the graph | skills | dashboard; the graph costs tokens to build | 25 |
| [colbymchenry/codegraph](https://github.com/colbymchenry/codegraph) | 75k | SQLite + FTS5 | none | yes | FSEvents sync under 1 s, Swift↔ObjC and RN-bridge edges, ~35 languages | 33 |
| [abhigyanpatwari/GitNexus](https://github.com/abhigyanpatwari/GitNexus) | 48k | Kuzu fork | optional | yes | PolyForm Noncommercial; growth has cooled | 2.5 |
| [DeusData/codebase-memory-mcp](https://github.com/DeusData/codebase-memory-mcp) | 48k | SQLite + FTS5, Cypher-like | optional, compiled into the binary | yes, 17 tools | one static C binary, hybrid LSP, camelCase-aware tokenizer | 12.5 |
| [tirth8205/code-review-graph](https://github.com/tirth8205/code-review-graph) | 32k | SQLite | optional | yes | minimal file set for a diff | 11 |
| [oraios/serena](https://github.com/oraios/serena) | 31k | none, live LSP | none | yes | exact references and renames via language servers | 14 |
| [zilliztech/claude-context](https://github.com/zilliztech/claude-context) | 13k | Milvus | required | yes | pure vector; last push July | 0.8 |
| [trailhq/Trail-Code](https://github.com/trailhq/Trail-Code) | 11k | markdown + JSON | none | yes + hooks | every query tops the graph up (~50 ms) | 6.7 |
| [repowise-dev/repowise](https://github.com/repowise-dev/repowise) | 8k | graph + vectors | yes | yes | AGPL; measured its own call-edge precision (85.7%) | 8.3 |
| [vitali87/code-graph-rag](https://github.com/vitali87/code-graph-rag) | 5k | SQLite (Memgraph optional) | optional | yes | moved off Memgraph to embedded SQLite | 1.5 |
| [CodeGraphContext](https://github.com/CodeGraphContext/CodeGraphContext) | 4k | FalkorDB Lite / Kuzu / Neo4j | not documented | yes | closest architectural twin of solograph; SCIP import | 1.1 |
| [jgravelle/jcodemunch-mcp](https://github.com/jgravelle/jcodemunch-mcp) | 3k | local index | not documented | yes | symbol retrieval by byte offset; paid commercial licence, telemetry on by default | 0.8 |
| [probelabs/probe](https://github.com/probelabs/probe) | 0.7k | none | none | yes | BM25 + AST on the fly, "agents don't need embedding search" | 0.1 |
| [ast-grep/ast-grep-mcp](https://github.com/ast-grep/ast-grep-mcp) | 0.5k | none | none | yes, 4 tools | structural pattern search | 0.1 |

## Three worth a look

1. **colbymchenry/codegraph** — the cleanest version of the converged design: SQLite + FTS5, no vectors, a watcher that keeps it current, and real Swift/Kotlin/ObjC support. For one repo it does what solograph's graph does, better.
2. **codebase-memory-mcp** — keeps Cypher-style queries on top of SQLite in a single binary. The answer to "I want a graph query language without running a graph DB".
3. **Graphify** — fastest-growing, no embeddings at all. What to borrow from it is already in [[graphify-vs-solograph]]: edge provenance, a PreToolUse nudge towards the graph, rebuild on git events.

Serena is a complement rather than a rival: LSP precision where tree-sitter guesses.

## Measured here: codegraph against plain grep

On 27 Oct codegraph 1.6.2 was run against a real repository with its own README's method: `claude -p`, `--strict-mcp-config`, WITH = only codegraph's MCP server, WITHOUT = no MCP at all, its CLI blocked in both arms. The repository was a 1,105-file Rust + Swift app; codegraph indexed it in 5 s (20k nodes, 47k edges, a 76 MB index). Two questions, two runs per arm, every answer checked against call sites found with `rg`:

| Question | Cost, median (with / without) | Tool calls | Correct |
|---|---|---|---|
| Trace how `plan_montage` is reached, from the UI down, across a Swift↔Rust FFI boundary | $1.73 / $2.07 (−16%) | 16.5 / 25 | 4/4 both |
| What breaks if `resolve_montage_profile`'s signature changes | $0.69 / $0.65 | 6 / 5.5 | 4/4 both |

Both arms found the same chain through the same files, including the UniFFI hop. The graph saved a sixth of the cost where the agent had to explore, and nothing where it could grep its way there in five calls — which is what codegraph's own README says ("near-even where it got there in 7"). For that, it wants a global agent install, a per-repo index and a background daemon (one was still running after the runs). Not adopted here; two runs per cell is a small sample, and a repo where questions need 30–40 lookups could come out differently.

## What none of them do

Not one covers several projects at once, or the agent's own history. Solograph's distinct part is the portfolio: one graph over 83 repositories, cross-project Cypher (`codegraph_shared`), and full-text search over every Claude Code session, including the ones Claude Code has deleted. That is the part worth keeping; per-repo depth can come from codegraph.

## Caveats

- **Star counts look inflated.** In July three sources gave Graphify 76k, 97k and 98k on the same day; it shows 136k now. Fork velocity is a better signal and can be gamed too.
- **Every benchmark is the vendor's own.** codegraph claims 62% fewer tokens, codebase-memory 10× (its own preprint), jcodemunch 96%. None were rerun here. codegraph's own README adds the honest counterpoint: answers stay resident, so its sessions end with about 80% more retrieval context in the window.
- "No embeddings" for CodeGraphContext and jcodemunch means their READMEs do not mention any.

## Related

- [[project-solograph]] — the rebuild this survey was for
- [[graphify-vs-solograph]] — the one-to-one comparison
- [[fff-agent-file-search]] — file search for agents, the layer below
- [[agent-toolkit-landscape]] — the wider tool landscape
