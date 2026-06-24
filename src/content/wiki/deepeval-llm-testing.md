---
type: concept
title: "DeepEval — pytest-native LLM evaluation framework"
description: "Apache-2.0 LLM eval framework by Confident AI: 50+ research-backed metrics (G-Eval, DAG, RAGAS, hallucination, faithfulness, answer relevancy), pytest integration for CI, Cursor/Claude Code support. 100M daily evals, 150K+ devs."
created: 2026-05-22
tags: [evals, llm, testing, pytest, ragas, methodology, observability]
publish: true
source_url: "https://deepeval.com/"
---

# DeepEval — pytest-native LLM evaluation framework

A different category from Langfuse / Arize Phoenix. Those are **observability** platforms — they tell you what happened. DeepEval is an **evaluation framework** — it tells you whether the answer was good, and fails the test if it wasn't. The mental model is `pytest`, not Datadog: assertions in CI, not dashboards on a screen.

Built by Confident AI, Apache-2.0. The marketing claim — 100M+ daily evals, 150K+ developers, >50% of Fortune 500 — is unusually high for an OSS eval lib and signals that the category itself has crossed into mainstream CI/CD practice. 250+ GitHub contributors. The OSS framework is the engine; Confident AI is the cloud platform on top (regression testing, experimentation, tracing, production monitoring).

## The shape of an LLM test

```python
from deepeval import assert_test
from deepeval.test_case import LLMTestCase
from deepeval.metrics import AnswerRelevancyMetric, FaithfulnessMetric

def test_rag_pipeline():
    test_case = LLMTestCase(
        input="What's our refund policy?",
        actual_output=agent.run("What's our refund policy?"),
        retrieval_context=docs,
        expected_output="14-day return window with original packaging",
    )
    assert_test(test_case, [
        AnswerRelevancyMetric(threshold=0.7),
        FaithfulnessMetric(threshold=0.8),
    ])
```

`LLMTestCase` is a typed dataclass. Metrics return scores + reasoning. `assert_test` raises on threshold breach — same contract as a normal pytest assertion. Run via `deepeval test run` or stock `pytest`.

## Three evaluation techniques

- **G-Eval** — criteria-based, chain-of-thought judging via form-filling. You give it a rubric (`evaluation_steps`), the judge emits a structured score with reasoning. This is [[schema-guided-reasoning|SGR]] applied to *the evaluator itself* — the judge is forced through a typed output shape, not a free-form opinion.
- **DAG metrics** — directed acyclic graph of conditional checks. Multi-step scoring with branches (`if format_ok then check_grounding else fail`). Composable.
- **QAG** — Question-Answer Generation. Builds a reference set from your knowledge base and grades retrieval against it. The mechanic behind faithfulness and contextual recall.

50+ metrics ship out of the box: hallucination, faithfulness, answer relevancy, contextual precision/recall/relevancy, toxicity, bias, summarization, task completeness, role adherence, knowledge retention. RAGAS metrics are first-class.

## Where it sits in the agent stack

Observability + evals + benchmarks form a three-layer measurement stack — they don't compete, they answer different questions:

| Layer | Question | Tools |
|---|---|---|
| **Observability** | What happened on this request? | Arize Phoenix, Langfuse, OpenTelemetry |
| **Evaluation** | Was the answer good? Did anything regress? | DeepEval, RAGAS, OpenAI Evals |
| **Benchmark** | How does my agent rank on a public, fixed task set? | SWE-bench, PAC-1, BitGN ECOM, LongMemEval |

DeepEval is also explicitly positioning itself as the **eval harness for coding agents** — Cursor, Claude Code — capturing full execution traces and grading at the span level. That makes it adjacent to [[harness-engineering-summary|harness engineering]]'s third component (feedback loops): evals are the architectural constraint for *behavior*, the way ArchUnit is the architectural constraint for *code structure*.

## Connections

- [[agent-benchmarks]] — benchmarks score aggregate performance on a fixed set; DeepEval is the per-task layer underneath that you actually run on every PR. Benchmarks need eval harnesses to be reproducible
- [[enterprise-rag-challenge]] — ERC winners optimised for faithfulness, contextual recall, structured outputs. DeepEval's RAGAS-shaped metrics quantify exactly those properties — without measuring them you can't replicate the wins
- [[schema-guided-reasoning]] — `LLMTestCase` is typed; G-Eval forces the judge through a Pydantic-shaped output. Same SGR pattern applied to the *evaluator*, not the agent. Schemas all the way down
- [[sgr-deep-dive]] — when DeepEval's G-Eval emits `(score, reasoning)`, it's the SGR structured-output pattern wrapping a judge model
- [[pac1-competition-retrospective]] — Phoenix gave observability ("I couldn't debug what I couldn't see"); DeepEval gives the missing half — assertions that fail PRs before they reach production. Trace + assert = the full feedback loop
- [[harness-engineering-summary]] — DeepEval is Component 2 (architectural constraints) extended to LLM outputs: ArchUnit for code structure, DeepEval for behavior. Component 3 (garbage collection) gains regression tests for free
- [[tool-calling-four-layers]] — once tool calling outputs are structured, you can grade them; DeepEval's `task_completeness` metric is the natural eval for SGR `NextStep` traces

## Source

- [deepeval.com](https://deepeval.com/) — official site, docs, metrics catalog
- [GitHub: confident-ai/deepeval](https://github.com/confident-ai/deepeval) — Apache-2.0, 250+ contributors
- [Confident AI](https://www.confident-ai.com/) — paid cloud platform on top of OSS framework
