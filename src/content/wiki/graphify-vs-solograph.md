---
type: comparison
title: "Graphify vs Solograph — deterministic code graphs, and what to steal"
description: "Graphify (Apache-2.0/MIT) bets on tree-sitter graphs with no embeddings, explained edges, git merge drivers, and PreToolUse hooks that block raw file reads. Compared against our own Solograph codegraph: what overlaps, what to steal, when to switch."
created: 2026-07-29
tags: [agents, code-graph, memory, retrieval, tree-sitter, solograph, graphify, comparison]
publish: true
source_url: "https://github.com/Graphify-Labs/graphify"
index_line: "Graphify (Apache-2.0/MIT, tree-sitter 36 grammars, no embeddings, edges tagged EXTRACTED/INFERRED, git merge driver, PreToolUse hook that blocks raw file reads) vs our own codegraph. Four mechanics to steal, three not to copy"
index_section: "concept"
---

# Graphify vs Solograph

[Graphify](https://github.com/Graphify-Labs/graphify) (Apache-2.0 OR MIT) is the first tool in this space that overlaps [[project-solograph|Solograph]] hard enough to force a decision rather than a bookmark. Both parse code with tree-sitter into a graph an agent queries instead of grepping. They diverge on almost everything else — and several of Graphify's choices are better than ours.

## The one-line difference

**Graphify** is a *deterministic, explainable graph of one corpus*, shipped as a skill to 20+ assistants, with no embeddings anywhere. **Solograph** is a *multi-project memory system* — code graph plus episodic session history plus a semantic KB plus web search — shipped as one MCP server for Claude Code.

Graphify goes deeper on a repo. Solograph goes wider across a portfolio and remembers what you did.

## Side by side

| | Graphify | [[project-solograph\|Solograph]] |
|---|---|---|
| License | Apache-2.0 OR MIT | MIT |
| Store | `graph.json` file on disk | FalkorDBLite (embedded graph DB) + files |
| Embeddings | **None, by design** | MLX multilingual-e5-small (RU + EN), sentence-transformers fallback |
| Languages | 36 tree-sitter grammars | 5 (Python, Swift, TS, Kotlin, Rust) |
| Query interface | `graphify query` / `path` / `explain` over `graph.json` + MCP server | Cypher via `codegraph_query`, 15 MCP tools |
| Scope | One corpus at a time | **Multi-project** — shared packages, cross-project Cypher |
| Non-code inputs | Docs, PDFs, images (via model), audio/video (local faster-whisper) | KB markdown, YouTube/Telegram sources |
| Episodic memory | — | `session_search` over Claude Code history |
| Edge provenance | **Every edge tagged `EXTRACTED` / `INFERRED`** | Untyped confidence — an edge is an edge |
| Cost to build | **0 LLM credits** for code-only | 0 for AST, local embeddings for vectors |
| Incremental rebuild | **post-commit + post-checkout git hooks** | Manual `scan` / hook on `.md` writes |
| Merge conflicts | **Git merge driver, union-merges graphs** | N/A (DB is local, not committed) |
| Read discipline | **PreToolUse hook nudges — or blocks — raw file reads** | Advisory: CLAUDE.md tells the agent to prefer the graph |
| Artifacts | `graph.html`, `GRAPH_REPORT.md`, `graph.json` | Mermaid diagram, `xray`, `explain` |
| Community detection | Leiden → subsystems | — |
| Telemetry | None. Query log exists but is **off by default** | None |

Their benchmark: LOCOMO (n=300) recall@10 of 0.497 against mem0 at 0.048 and supermemory at 0.149. Their harness, their numbers — untested here, and LOCOMO is a *memory* benchmark being used to argue about *code retrieval*, so read it as directional at best.

## What to steal

Four mechanics are independently useful and don't require adopting Graphify:

1. **Tag every edge with provenance.** `EXTRACTED` (literally in the source) vs `INFERRED` (resolved by the tool) turns "the graph says X calls Y" into a claim the agent can weigh. Our schema has `IMPORTS` / `CALLS` / `INHERITS` with no such distinction, so a heuristically-resolved dynamic dispatch looks exactly as solid as a literal import. Cheapest high-value change on this list.

2. **PreToolUse hook on file reads.** Graphify intercepts the agent *before* a `Read`, points it at a graph query, and in strict mode blocks the first raw read outright before reverting to a nudge. We already run PostToolUse hooks for reindexing — the same machinery, aimed one step earlier. This is [[agent-mistake-fix-harness|harness engineering]] in its purest form: not "remember to query the graph" in CLAUDE.md, but a mechanism that makes ignoring it inconvenient.

3. **Rebuild on git events, not on demand.** post-commit + post-checkout means the graph is never stale and never needs a human to remember `make scan`. AST-only rebuilds cost nothing, so there's no reason to defer them.

4. **Tiered loading for `explain`** — borrowed from [OpenViking](https://github.com/volcengine/OpenViking) rather than Graphify, but it belongs in the same change: L0 abstract (~100 tokens) → L1 overview (~2k) → L2 full detail on demand. `codegraph_explain` currently returns one fixed-size answer; most calls only need L0 to decide whether to keep digging.

Plus one lower-priority idea: **Leiden community detection** to auto-partition a project into subsystems. That's a better `explain` for an unfamiliar repo than a flat symbol dump.

## What not to copy

- **Dropping embeddings entirely.** Graphify's "no vector store" is a real advantage for *code* — ASTs are exact, embeddings drift. It's the wrong call for our KB, where `kb_search` answers RU-language conceptual queries over prose that a graph can't index. Keep the graph deterministic and the prose semantic; the mistake would be letting one purity argument override both.
- **Sending docs and PDFs to a model.** Graphify parses code locally but routes docs/PDFs/images through the assistant's model. Fine for open source, wrong for `6-crm/` and anything under `~/personal/`. Our [[privacy-as-architecture|privacy posture]] means non-code corpora stay local or don't get indexed.
- **Committing the graph.** The merge driver is clever, but it exists because they commit `graph.json`. A local DB has no merge problem to solve — take the git *hooks*, skip the committed artifact.

## Which to run

- **One repo, unfamiliar codebase, want explainability and 36 languages** → Graphify. It's better at that specific job than our codegraph, and it costs nothing to try: `uv tool install graphifyy && graphify install`.
- **Portfolio across `~/startups/active/`, session history, RU+EN knowledge base, web search in the same tool** → Solograph. Graphify has no equivalent of `session_search`, `kb_search`, or cross-project Cypher, and multi-project is the whole reason our graph exists.
- **Both** is coherent: Graphify per-repo for depth during a deep dive, Solograph as the portfolio-and-memory layer. They don't share storage, so the cost is duplicated parsing, not conflict.

## Caveats

Open core with a commercial upsell — "Graphify Enterprise" is on a waitlist at graphify.com as an always-on layer across meetings and files. The CLI itself is fully open with visible extraction code and no telemetry, so the downside risk is the usual one: the open core stops getting the interesting features. Note also the package-name trap: PyPI package is `graphifyy` (double y), CLI is `graphify`, and at least two lookalike domains serve the same pitch — verify you're installing from the real repo.

Star counts are meaningless here. Three sources reported 76K, 97K, and 98K on the same day.

## Links

- [Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify) — the repo
- [[project-solograph]] — our code intelligence MCP server
- [[codegraph-guide]] — Solograph's architecture and Cypher patterns
- [[agent-toolkit-landscape]] — where both sit in the ecosystem
- [[agent-memory-architecture]] — the 4-type memory frame both are instances of
- [[rag-patterns]] — graph retrieval vs the six other approaches
- [[agent-mistake-fix-harness]] — why the PreToolUse hook matters more than the graph format
