---
type: concept
title: "Semantica — the graph is for the audit, not the recall"
description: "An MIT graph layer that sits under the LLM and answers a regulator's 'why' months later. Its useful idea for a solo builder is the split: retrieval graphs optimise for finding, provenance graphs optimise for reconstructing a decision."
created: 2026-08-25
tags: [agents, knowledge-graph, provenance, observability, context-engineering, enterprise]
publish: true
source_url: "https://github.com/semantica-agi/semantica"
index_line: "Semantica (MIT, Python, 10.7k stars, live since Jun 2025): 'open source Palantir for AI agents' — context graph + KG with decision provenance, deterministic and LLM-free at the reasoning layer, RDF + LPG, built for regulated domains like lending. For solo work the platform is oversized; the transferable idea is that a retrieval graph and a provenance graph are different artefacts optimised for different questions"
index_section: "concept"
---

# Semantica — the graph is for the audit, not the recall

[Semantica](https://github.com/semantica-agi/semantica) (MIT, Python, 10,659 stars, first commit June 2025) calls itself the open-source Palantir for AI agents. It ingests enterprise data, extracts entities into a context graph and a knowledge graph, and runs analytics and causal reasoning over both — with decision provenance recorded throughout. Polyglot storage, RDF and LPG, W3C standards, self-hostable.

The framing sentence is the useful one: *most AI agents act without a trail; they store embeddings, not meaning.* Their example is underwriting — an approval has to survive a regulator asking "why" months later, and a cosine similarity is not an answer to that question.

Notably, the reasoning layer is deterministic and needs no LLM. The graph is infrastructure underneath the model, not another thing the model is asked to maintain.

## The idea worth extracting

For a solo builder the platform is oversized — this is aimed at regulated industries with compliance exposure, and adopting it would be adopting an ontology practice, not a library. But the distinction it draws is real and transferable:

**A retrieval graph and a provenance graph answer different questions.** Retrieval optimises for *finding the right thing now* — which is what [[project-solograph]]'s code graph and vector indexes do, and what the tiering borrowed in [[graphify-vs-solograph]] makes cheaper. Provenance optimises for *reconstructing why something happened, later* — a different shape, different write path, different cost.

Conflating them is the common mistake, and it usually shows up as a retrieval store quietly failing at forensics: you can find the document the agent read, but not establish that this is why it did what it did.

[[decision-traces-compound]] argues the same case from the value side — that traces are the asset that accumulates. Semantica is what it looks like when someone builds the infrastructure for that claim rather than asserting it. And [[claude-code-anatomy]]'s finding that 98.4% of a harness is operational infrastructure predicts this: provenance is infrastructure, so it does not arrive by being a good idea.

Cheap version for one person: the session log already is a provenance store if nothing model-visible bypasses it. That is the same invariant [[deepseek-harness]] enforces at runtime — *model-visible means logged*. A graph on top is an optimisation for querying it, not the thing that makes provenance exist.

## Links

- [[context-graphs-summary]] — the concept this productises
- [[decision-traces-compound]] — why traces are the compounding asset
- [[project-solograph]] — our graph, built for retrieval; the contrast is the point
- [[graphify-vs-solograph]] — where tiered loading was already borrowed from a neighbour in this space
- [[deepseek-harness]] — the cheap invariant that gives provenance without a graph
- [[agent-toolkit-landscape]] — belongs in the observability/governance rows
