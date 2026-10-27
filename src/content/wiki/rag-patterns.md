---
type: summary
description: "Reference catalog of 7 RAG patterns, each with when-to-use, trade-offs, and components."
title: "RAG patterns — 7 approaches from vector to agentic"
created: 2026-02-11
tags: [rag, retrieval, llm, embeddings, vectors, knowledge-graph, solograph]
publish: true
source_path: "1-methodology/rag-patterns.md"
index_line: "7 RAG approaches: vector, graph-boosted, tree-based, ColBERT, HyDE, hybrid, agentic"
index_section: "concept"
---

## Key Takeaways

Reference catalog of 7 RAG patterns, each with when-to-use, trade-offs, and components.

1. **Classic Vector RAG** — docs → chunks → embeddings → similarity search → LLM. Fast, cheap, offline-capable. Solograph ran FalkorDB + MLX until Oct 2026, then dropped it for FTS5.
2. **Graph-Boosted RAG** — vector search + 1-hop knowledge graph expansion. Finds related docs vectors miss. Solograph keeps a lite version: `kb_search` can add 1-hop neighbours over explicit links and shared tags, with no vectors underneath since Oct 2026.
3. **Tree-Based Reasoning (PageIndex)** — no vectors. LLM builds hierarchical tree, reasons over it. For 100+ page professional docs.
4. **Late Interaction (ColBERT)** — token-level similarity, 10x better on exact terms. Heavy but precise.
5. **Hypothetical Document Embeddings (HyDE)** — LLM generates ideal answer first, embeds that. Great for abstract questions.
6. **Hybrid** — BM25 (keywords) + vectors + graph, with reciprocal rank fusion. Best of all worlds.
7. **Agentic RAG** — LLM decides what to search, iterates, self-corrects. Highest quality, highest cost.

**Decision matrix:** small docs + budget → Classic Vector. Linked docs → Graph-Boosted. Long docs → Tree-Based. Need keywords + semantics → Hybrid. Complex multi-step → Agentic.

**Our implementation (solograph):** BM25 over SQLite FTS5 with Russian and English stemming, plus optional 1-hop link expansion; every index checks its files before answering. Vectors went in Oct 2026, after FTS5 found 32 of 39 known sessions to their 0 ([[project-solograph]]). The LLM Wiki (index.md) sits above all of this as a compiled navigation layer.

## Connections

- [[context-graphs-summary]] — knowledge graph in RAG = context graphs applied to document retrieval
- [[privacy-as-architecture]] — offline RAG with MLX = privacy-first retrieval, no cloud dependency
- [[solo-methodology]] — solograph started with patterns 1+2+6 and kept BM25 plus 1-hop link expansion
