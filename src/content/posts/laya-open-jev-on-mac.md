---
type: concept
title: "Running an open Jev on a Mac: Laya, measured"
description: "Laya is an Apache 2.0 reproduction of TypeSafe's Jev decision model. We ran the multilingual checkpoint on an M5, ported it to ONNX and Core ML, and measured quality, size and latency: 13.7 ms per question on the GPU, 309 MB at int8, and Russian still needs a review gate."
created: 2026-10-22
tags: [local-models, open-weights, decision-models, coreml, onnx, apple-silicon, calibration]
publish: true
publish_as: post
learned_from: "~/startups/active/laya-ane (measured 2026-09-20); vivekhaldar.com article; OC AI Builders Lightning Hackathon 21.10.2026"
index_line: "Post: Laya (open Jev, Apache 2.0, mmBERT 322M) on Apple M5. 10/12 EN+RU smoke (both misses RU, one confidently wrong). Core ML fp16 GPU 13.7 ms/question, int8 309 MB; ONNX int8 325 MB; ANE refuses. 5 coremltools 9.0 blockers. Haldar's gate pattern: act at p>=0.8, else LLM"
index_section: "concept"
---

# Running an open Jev on a Mac: Laya, measured

[Jev](/wiki/jev-system-one) from TypeSafe AI is a decision model, not a chatbot. You give it text and a list of typed questions (yes/no, pick one of N, rate 1 to 5), and it answers all of them in one pass with calibrated probabilities. It never generates text, so there is nothing to parse and nothing to hallucinate. It is also closed: hosted API only, no weights.

[Laya](https://huggingface.co/convaiinnovations/laya) is an open reproduction under Apache 2.0, with weights on Hugging Face. I wanted to know whether it is good enough to ship inside a Mac or iPhone app, so I ran the multilingual checkpoint (mmBERT-base, 322M parameters, about 650 MB) on an Apple M5 with 32 GB and ported it to ONNX and Core ML. The numbers below are from 2026-09-20.

## Quality

I hand-labeled 12 smoke cases in English and Russian and made every variant pass the same set.

| Variant | Pass | Max logit diff vs torch |
|---|---|---|
| torch fp32 | 10/12 | — |
| ONNX fp32 | 10/12 | 0.00002 |
| ONNX int8 | 10/12 | 2.38, decisions unchanged |
| Core ML fp16 (GPU) | 10/12 | 0.06 |

English went 9 of 9. Both misses are Russian, and one of them is the bad kind: "is this urgent?" answered 0.023 with 0.977 confidence on a message that was urgent. A calibrated model being confidently wrong is exactly the failure the calibration is supposed to prevent, so Russian output gets a human-review step until it is measured on a bigger set.

The int8 row taught me something too. Quantization moved logits by up to 2.4, and every decision survived. Compare decisions, not raw logits.

## Speed and size

| Artifact | Size | Latency |
|---|---|---|
| safetensors bf16 | 647 MB | 34 ms per 3-question call on MPS |
| ONNX int8 | 325 MB | 148 ms per question on CPU |
| Core ML fp16 | 615 MB | **13.7 ms per question on GPU** |
| Core ML int8 | 309 MB | 25.2 ms per question on GPU |

Hosted Jev answers in 70 to 500 ms over the network. The local Core ML build is 5 to 35 times faster and needs no Python or torch at serving time, so it can live inside a Swift app. The model card claims about 33 ms per call; I got 34 on MPS.

int8 on ONNX bought size, not speed: 325 MB instead of 1290, same 148 ms. Inputs are padded to a fixed 512 tokens for export, so a 100-token message pays for 512 everywhere except the original torch path.

The Neural Engine refused the model: `ANECCompile() FAILED` on every attempt. The 34 ms you get when asking for `cpuAndNeuralEngine` is a silent fallback to CPU and GPU, not the ANE. Getting a transformer encoder through the ANE compiler means rewriting attention as convolutions, and with the GPU at 13.7 ms I stopped there.

## Five converter blockers

coremltools 9.0 with torch 2.7.0 (that exact pair, they are tested together) failed five times before it produced a model:

1. `new_ones` has no lowering. Registered it by hand.
2. `bitwise_and` on a double and a bool. Overridden with cast plus `logical_and`, and the override has to be registered under the alias `and`, or it silently does nothing.
3. `int()` on a one-element numpy array, which numpy 2 refuses during constant folding.
4. The fused fastpath of `nn.TransformerEncoderLayer`. Fixed with `torch.backends.mha.set_fastpath_enabled(False)` before tracing.
5. A `clamp` that turned integer indices into floats. I dropped it, since positions are non-negative by construction, and asserted a logit diff of exactly 0 after each rewrite.

## Where a decision model pays off

Vivek Haldar, who ran the OC AI Builders Lightning Hackathon in Irvine on 21.10.2026, published [an experiment](https://vivekhaldar.com/articles/llms-do-too-much-offload-to-decision-models/) that answers the "why bother" question. He put hosted Jev inside [Proceda](https://github.com/vivekhaldar/proceda), his harness that turns business procedures into agents, next to Qwen 27B, on 360 [SOP-Bench](https://github.com/amazon-science/SOP-Bench) cases. The rule: act on Jev's answer when its probability is at least 0.8, otherwise ask the LLM.

- Checking "is this step finished?" after tool calls cut 605 LLM calls (23.8%), at 356 of 360 correct against 357 for the LLM alone.
- Classifying email intent, Jev took 141 of 148 decisions by itself, all 148 were correct, and the workflow made 25% fewer LLM calls.

Those are his numbers; I have not reproduced them.

A demo at the same event put Jev and Laya side by side as the router. One request, "Translate 'the meeting moved to Thursday afternoon' into Spanish", went to three deciders, each picking a lane (fast or slow model) and scoring urgency and "needs a human":

| Decider | Fast lane | Needs human | Urgency | Latency |
|---|---|---|---|---|
| Jev (hosted) | 100% | 24% | 1.5, this week | 259 ms |
| Laya | 41% | 26% | 1.0, this week | 46 ms |
| "brain" (LLM) | 94% | 35% | 1.5, today | 562 ms |

The draft then came from a small fast model in 755 ms, and the decision model checked it: safe 97%, answers the request 94%, 235 ms. This is one request photographed off a slide, not a benchmark, but it shows the trade in one row: Laya was 5 times faster than Jev and agreed with it on the soft scores, yet on the routing call it sat at 41%, below any sensible 0.8 gate, where Jev was certain. With Haldar's rule that request would have fallen through to the LLM. The pattern carries over to Laya unchanged: wherever an LLM only classifies or checks, a small calibrated model can take the confident cases, and the LLM keeps the rest.

## What it cannot do

Laya reads text only. At that same hackathon we built [BroCheck](https://bro.rustman.org), which looks at two photos and judges whether the pair are friends, a couple, or the same person twice. Hosted Jev handled the images. For the offline version (`/local`) Laya was no use, so it runs CLIP ViT-B/32 int8 in the browser instead: zero-shot over a side-by-side composite, plus cosine similarity between the two faces.

## Verdict

For English routing, triage and scoring, Laya is ready to embed: 309 MB, 25 ms a question, no server, and an open license. For Russian, ship it behind a review gate. For images, it is the wrong model.

Related: [[jev-system-one]], [[needle-tiny-tool-model]], [[schema-guided-reasoning]], [[hackathons]].
