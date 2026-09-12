---
type: concept
title: "Needle 2 — a 14MB model that only does tool calls"
description: "Cactus Compute's 45M-parameter model ships as a single 14MB binary running in ~28MB of RAM. It does not chat: it picks tools, fills arguments, and extracts structured data, with a calibrated confidence score deciding when to escalate."
created: 2026-08-25
tags: [on-device, small-models, tool-calling, ios, quantization, agents, privacy]
publish: true
source_url: "https://github.com/cactus-compute/needle"
index_line: "Needle 2 (Cactus Compute, Apache-2.0, 8.9k stars): 45M params, single 14MB binary, ~28MB RAM per session regardless of conversation length. Scope is tool calls + structured extraction, not prose. Byte-level grammar compiled from your schemas constrains every token; a learned confidence head gives a threshold for escalate-or-act; a retrieval head renders only the top 5 tools per turn. LoRA fine-tune to one .cact file. Trades wins with FunctionGemma 270M / LFM2.5 230M / Apple FM at 5-70x smaller"
index_section: "concept"
---

# Needle 2 — a 14MB model that only does tool calls

[Needle 2](https://github.com/cactus-compute/needle) (Cactus Compute, Apache-2.0, 8,951 stars) is 45M parameters compressed to CQ2-bit and baked into its own engine: one 14MB binary, a full session in about 28MB of RAM. It benchmarks against FunctionGemma 270M, LFM2.5 230M and Apple's foundation model at 5–70x smaller and two bits against their f16. Architecture is their Simple Attention Network — Hadamard MLP instead of the FFN, GQA attention, engram key-value memory, multi-lane hyper-connections ([arXiv:2607.18363](https://arxiv.org/abs/2607.18363)).

The reason it fits is not compression alone. It gave up being a chat model. Scope is tool calling, device use and structured extraction: text in, JSON out.

## Four mechanisms, not four features

**A grammar compiled from your schemas.** Decoding is constrained by a byte-level grammar built from the tool declarations, so every token is legal by construction. Malformed JSON is not unlikely, it is unreachable.

**A confidence head you can threshold.** Every response carries a calibrated score from a learned head. Act above your threshold, escalate below it. This is what makes a tiny model usable as a first stage rather than a gamble — it knows when to hand off.

**A retrieval head over the tool catalogue.** Declare many tools; the model renders only the top five per turn and constrains the grammar to that subset. The usual failure of small models given large tool lists is addressed in the architecture rather than in the prompt.

**Bounded memory.** A 256-token sliding window with the tools pinned as KV sinks, so the footprint stays near 28MB no matter how long the conversation runs. Not "small at first" — small always.

LoRA fine-tuning on the frozen base merges at export, so a tuned model is still one `.cact` on the same engine. `pip install cactus-needle`, `needle playground` for a browser UI with a fine-tune button.

## Why this lands on DirectorOS specifically

The `model-picker` track measured nine models on this app's own agent prompt and recorded the finding that matters here: **`level` is about the action schema, not about prose.** GPT-OSS 20B rated level 3 while answering "how many clips" with the bare string `0.0` — it chose the right tool and returned parseable JSON every time, which is what the number encodes.

That is exactly and only what Needle does. The measurement already in the repo is the measurement Needle is built to win.

It also changes the shape of [[claude-subscription-boundary]]'s access ladder. That plan's free rung is Apple's on-device model, which is free but conditional: eligible hardware, Apple Intelligence enabled, model downloaded — three distinct failure sentences the spec has to write. A 14MB binary in the bundle has no such conditions. It runs on the iPhone that cannot run Apple Intelligence, which is the phone whose owner currently gets nothing.

The honest version: this does not replace the ladder, it widens its bottom rung. Needle picks tools and extracts structure; it does not write the sentence that summarises a film. Escalation is the design, and the confidence head is what makes escalation principled rather than a guess.

## Caveats worth carrying

- The Python package is inference, fine-tuning and export. On-device deployment into a Swift app is a separate integration, not a `pip install` — see [[apple-on-device-ai]] for what the platform path already gives for free.
- 45M parameters is 45M parameters. Anything needing world knowledge, long reasoning or good prose is the wrong job for it.
- The engine is fetched once from Hugging Face and cached; air-gapped setup is documented, but "no network at inference" is not the same as "no network ever".
- Benchmarks are the authors' own, on a size-quality frontier they drew. Measure on your own agent prompt, the way `model-picker` did, before trusting a level.

## Links

- [[apple-on-device-ai]] — the platform-provided on-device path, free but conditional on hardware and a settings toggle; Needle is the unconditional floor beneath it
- [[bonsai-ternary-llm]] — the same compression thesis from the other direction
- [[claude-subscription-boundary]] — the access ladder this widens at the bottom
- [[project-life2film]] — DirectorOS, where the agent's job is already scored on action schemas rather than prose
- [[privacy-as-architecture]] — a model in the bundle makes the offline claim structural instead of a promise

[[cheap-model-delegation-boundary]] — the same escalate-or-act boundary from the other end: Portal decides what to hand to a cheap model by file size, a proxy, where Needle decides by its own calibrated confidence.
