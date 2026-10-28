---
type: concept
description: "MCP server for a portfolio of projects: symbol search across every repository, full-text search over Claude Code sessions, a knowledge base and external sources. 12 tools, all SQLite FTS5: no graph database, no embeddings."
title: "solograph — portfolio index and agent memory over SQLite"
created: 2026-02-07
updated: 2026-10-28
tags: [project, open-source, mcp, fts5, sqlite, tree-sitter, python, agent-memory]
project_type: tool
course_module: 5
course_order: 5
publish: true
publish_as: project
source_url: "https://github.com/fortunto2/solograph"
pypi: solograph
github: fortunto2/solograph
index_line: "solograph: one Rust binary — symbol search across 77 projects + FTS5 over sessions/KB/sources, 12 MCP tools, the same reads as CLI commands, HTTP for sources. Vectors out in 0.7 (0/40 recall, 14 s cold); structural graph out in 0.8 (0 structural questions in 4 months); the Python duplicate out in 0.9; KB search, link graph and prompt hint on one index (Oct 2026), Russian→English via an alias table: 0→21/22 in top 5"
index_section: "project"
---

# Solograph

MCP server for a portfolio of projects: one index of every repository's definitions and packages, plus full-text search over Claude Code session history, a markdown knowledge base, and indexed external sources (YouTube, ProductHunt, TrustMRR, Telegram). Everything is SQLite with FTS5, and all of it is one Rust binary: the MCP server, every read as a command, an HTTP API for the sources, the nightly scan. Python is left only for the scrapers.

```bash
git clone https://github.com/fortunto2/solograph && cd solograph && make rust-install
claude mcp add -s user solograph -- ~/.solo/bin/solograph
~/.solo/bin/solograph scan                       # registry + portfolio index
~/.solo/bin/solograph symbols "montage profile"  # the same reads the agent gets, --json for its exact output
```

## 12 MCP tools

| Tool | What it answers |
|------|-----------------|
| `symbol_search` | Where something is defined, across every project: "montage profile" finds `resolve_montage_profile` and `MontageProfile` |
| `codegraph_explain` | What one project is made of: stack, languages, layers, patterns, dependencies |
| `codegraph_shared` | Packages used by more than one project, or every project using a given one |
| `codegraph_stats` | Counts: projects, files, symbols by kind, packages |
| `project_info` | Registry entry for a project |
| `session_search` | Every past prompt and answer, including transcripts Claude Code already deleted |
| `kb_search` | Markdown knowledge base: title and summary fields above the body, `path` to scope it (`wiki/`), `expand_graph` for up to 3 pages linked by `[[wikilinks]]`; Russian words reach English pages through the KB's alias table |
| `source_search` | YouTube transcripts (timestamped links), ProductHunt, TrustMRR, Telegram |
| `source_list` / `source_tags` / `source_related` | What is indexed, topics, related videos |
| `web_fetch` | A URL as text |

Web search lives in a separate searxng MCP server, so a broken import in one cannot take the other down.

## How it works

- **Portfolio:** tree-sitter reads function, class and protocol definitions from 15 languages; manifests give the packages. Symbol names are indexed by their words (camelCase and snake_case split), so a phrase finds every spelling, and a definition in a sibling repository shows up next to the one in front of you. A scan re-reads a file only when its mtime or size changed: all 77 projects from scratch in 38 seconds, an untouched portfolio in about 7.
- **Search:** SQLite FTS5, BM25, Snowball stems for Russian and English sent as prefix terms. Every index stats its source files before answering, so there is no reindex step.

## What was cut, and the numbers behind it

solograph started as a FalkorDB code graph with vector search on top. In October 2026 both were measured on the live machine, and both went.

**0.7: the vectors.**

| | Vector version | FTS5 version |
|---|---|---|
| Session search, 39 known-answer sessions, found in top 5 | **0** | 32 |
| Why | index held 640 sessions, disk 633, **overlap zero**: Claude Code deletes transcripts after 30 days and nothing re-read the disk | syncs before every search; deleted transcripts stay as archive |
| KB search, cold | 14 s, top hit always "relevance 1.0" (it was rank position), first result for "tree-sitter code graph" an Amazon page snapshot | 66 ms, BM25 score, hidden dirs skipped |
| Source search | hung past 120 s | 16 ms median |

**0.8: the structural graph.** 781k call edges, imports, inheritance, session→file and git edges. In four months agents asked it nothing structural: five calls in total, every one "list the projects" or stats. Grep answers those questions as well. A benchmark on video-analyzer (1,100 files, Rust + Swift), `claude -p` with a dedicated code-graph MCP ([colbymchenry/codegraph](https://github.com/colbymchenry/codegraph)) against plain Grep/Read, answers checked against ripgrep:

| Question | Accuracy | Cost (median) | Tool calls |
|---|---|---|---|
| Call chain to `plan_montage` | same, 4/4 each | $1.73 vs $2.07 | 16.5 vs 25 |
| Impact of changing `resolve_montage_profile` | same, 4/4 each | $0.69 vs $0.65 | — |

A 16% saving on one kind of question did not justify a second tool and a second index per repository. What grep cannot do is look across repositories, so that is what stayed. The environment went from 862 MB (torch, FalkorDB) to 89 MB.

Other things the review found: `session_search` had failed on every MCP call for seven weeks (a `-> list[dict]` annotation on a function returning a dict; its tests never went through the protocol); the nightly refresh had scanned zero projects for 70 nights after Homebrew dropped PyYAML from its python, and logged "done" each time; `codegraph_query` accepted writes; 40 checkouts were missing from the registry.

**0.9: the second implementation.** For a day after the Rust port the same 12 tools existed twice, in Rust (serving MCP) and in Python (the CLI). Two implementations of one search drift, and drift is what kept `session_search` failing for seven weeks, so every read moved into the binary and Python kept only what writes the sources index: 11 modules and 17 dependencies gone, the Python environment 97 → 34 MB. The tests that remain are the contract itself — the real scrapers write a store, the real binary reads it.

Session ranking was measured on the way, on 37 sessions with a known answer:

| Ranking | recall@1 | recall@5 |
|---|---|---|
| any word, BM25 (0.8) | 26 | 30 |
| **all words first, then any (0.9)** | **29** | **32** |
| title weighted ×10 instead of ×3 | 24 | 30 |
| recency boost | 26 | 30 |

Ranking all words first surfaced the long sessions that contain every word, and FTS5's `snippet()` tokenises a whole 3–4 MB transcript to pick its fragment. Ranking from the index alone and building snippets only for the rows returned took the CLI query from 2–3 s to 70 ms.

The lesson is not "vectors are bad" or "graphs are bad". It is that an index nobody measures drifts silently, and that a feature nobody calls is cost without benefit. The same convergence shows up across the [[code-graph-mcp-landscape|code-graph tools on GitHub]]: tree-sitter + SQLite FTS5, embeddings optional.

## Sessions as an archive

Claude Code keeps transcripts 30 days. The session index keeps their text after that, marked `transcript: deleted`; live ones come with a `claude --resume` command. Transcripts are append-only, so a grown one is read from its last byte offset: live transcripts reach 400 MB, and a resync costs ~10 ms. Batch runs from temp directories (`claude -p` from `/tmp`, agent scratchpads, 322 of 633 transcripts here) are left out; a folder with `.solograph-private` or Spotlight's `.metadata_never_index` keeps its sessions out entirely.

## The knowledge base: one engine

Until Oct 2026 the same wiki was indexed four times: solograph for `kb_search`, a Python FTS index for `make wiki-search`, a third for the prompt hint, and a JSON link graph a script rebuilt (it sat at 36 nodes for eight months while the wiki passed 160 pages). Now one index serves all of it, synced before every call: `solograph kb [--pages]`, `solograph kb-graph` (hubs, orphans, broken links, pages missing from the catalog, backlinks; `--check` fails on any, and that exit code is the pre-commit gate), and `solograph kb-hint --hook`, registered as the UserPromptSubmit hook itself.

The engine knows no KB's layout: a KB states it in `.solograph.yaml` (`kb: pages, stacks, exclude`). Here that excluded a gitignored client checkout that was 949 of the 1187 directories every sync walked:

| | before | after |
|---|---|---|
| KB search, median | 60-70 ms | 12 ms |
| MCP `kb_search` | 48 ms | 15 ms |
| prompt hook, end to end | 74 ms (a Python wrapper, then the binary) | 19-35 ms (the binary, syncing only `wiki/`) |

Each layer was kept only with its measured delta, as the Epiphan knowledge agent did, on a known-answer set (`scripts/kb_eval.py`):

| Layer | body words, top-1 /40 | summary words, top-1 /25 | real agent queries, top-1 /10 | Russian → English page, top-5 /22 |
|---|---|---|---|---|
| title + body index (before) | 29 | 18 | 7 | 0 |
| title / summary fields / body, BM25 2-2-1, file name as a field | 31 | 22 | 7 | 0 |
| + alias table, one way | 31 | 22 | 8 | 4 (21 with `path wiki/`) |

Body-word top-5 lost one query (38 → 37, a rank 5 that became 7) with the field split itself: it happens at weights 1-1-1 too. The alias table first expanded both ways and sent English queries to Russian documents (top-1 31 → 24); one way, from other spellings to the term the wiki writes, left every English set untouched. Over the whole KB a Russian question still lands on Russian docs first, which is why the wiki tools scope to `wiki/`.

## Why it matters

As a [[agent-memory-architecture|memory system]]: episodic memory (session_search), reference memory (kb_search), and a map of everything already written across the portfolio (symbol_search), which is how [[decision-traces-compound|past decisions compound]] instead of being rewritten.

## Links

- [GitHub](https://github.com/fortunto2/solograph) — MIT, Python, PyPI
- [[codegraph-guide]] — usage guide
- [[code-graph-mcp-landscape]] — the tools solograph sits among, October 2026
- [[graphify-vs-solograph]] — the closest competitor and what to take from it
- [[agent-toolkit-landscape]] — where solograph fits in the ecosystem
