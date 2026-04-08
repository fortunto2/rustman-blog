---
type: concept
description: "Enterprise RAG Challenge results: structured outputs beat vector search, top agents use router+SO+CoT patterns, no embeddings needed for top-3."
title: "Enterprise RAG Challenge — what actually wins in production RAG"
created: 2026-04-08
tags: [rag, agents, structured-outputs, sgr, competition, patterns]
publish: true
source_url: "https://abdullin.com/erc/"
---

Rinat Abdullin's Enterprise RAG Challenge: teams build AI systems to answer 100 questions about 100 annual reports (largest PDF: 1047 pages). Real production RAG, not toy demos.

## Key finding: structured outputs beat vector search

Top-3 all use Structured Outputs as core pattern. #2 and #3 have **no vector database at all** — they use query expansion + LLM search instead of embeddings. The winning architecture is not "better embeddings" but better reasoning.

**Top-1 (Ilia Rice, score 123.7):** Dense retrieval + Router pattern + LLM reranking + Custom Chain-of-Thought with Structured Outputs + Self-Consistency with Majority Vote. Model: o3-mini. 49 minutes to build.

**Top-2 (Emil Shagiev, score 121.6):** Multi-step WITHOUT vector embeddings. Query expansion → cheap LLM search → expensive LLM answer → refinement. Models: gpt-4o-mini + gpt-4o + o3-mini. 55 minutes.

**Top-3 (Dmitry Buykin, score 117.5):** Dynamic Structured Output with SEC EDGAR ontologies. No embeddings, no vector DB. CBOW similarity for majority selection. Model: gpt-4o. 8 hours.

## Winning patterns

| Pattern | Used by | Effect |
|---------|---------|--------|
| **Structured Outputs** | 7/10 top solutions | Forces valid response format, eliminates parsing errors |
| **Router pattern** | #1, #6, #8 | Delegates to specialized agents by query type |
| **Query expansion** | #2, #3, #6 | Broader search coverage without better embeddings |
| **LLM reranking** | #1, #6 | LLM scores relevance better than cosine similarity |
| **Multi-agent** | #8, #9 | Delegation manager + expert agents + aggregator |
| **Self-consistency** | #1 | Generate multiple answers, majority vote |
| **Parent document retrieval** | #1 | Full page context, not just chunk |

## What failed

- Single-model without delegation
- Direct query-to-response without validation
- Simplified embeddings without reranking
- No structured output validation
- Binary page checks (yes/no instead of scoring)
- Over-reliance on OCR without context

## Implications for agent architecture

The challenge proves that **SGR (Schema-Guided Reasoning) is the foundation** of winning RAG. Not better embeddings, not bigger models — structured reasoning patterns:

1. Define output schema first (what do we need to extract?)
2. Route query to appropriate strategy (what kind of question is this?)
3. Retrieve with expansion (don't trust single embedding match)
4. Rerank with LLM (cosine similarity is not relevance)
5. Generate with structured output (force valid format)
6. Validate with self-consistency (multiple runs, majority vote)

This maps directly to the tool calling pipeline: schema defines the contract, constrained decoding ensures compliance, post-processing validates.

**Local/offline solutions also competitive:** Swisscom (107.8) with Llama 3.3-70b fully offline, several teams with Qwen-2.5-72b and DeepSeek-R1 variants. Privacy-first RAG is viable.

- [[schema-guided-reasoning]] — SGR is the core winning pattern: schemas first, then reasoning
- [[tool-calling-four-layers]] — structured outputs in RAG = same constrained decoding from tool calling layer 3
- [[rag-patterns]] — challenge validates: hybrid > pure vector, agentic > single-pass
- [[context-engineering]] — router pattern = context engineering for retrieval: right context for right query
- [[harness-engineering-summary]] — winning teams iterate fast (49 min to solution) because harness is solid
- [[sgr-deep-dive]] — deep dive into SGR patterns used by ERC winners
