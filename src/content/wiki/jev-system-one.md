---
type: concept
title: "Jev / System One — decision models that never generate text, and the open-weight Laya"
description: "Jev (TypeSafe AI) is a non-autoregressive 'System One' model: unstructured text in, typed decisions with calibrated probabilities out, in one parallel pass. Closed weights, API-only — but Laya (Apache 2.0, 322-421M params, ~650-800MB) reproduces it with downloadable weights and runs locally."
created: 2026-09-20
tags: [structured-output, classification, non-autoregressive, calibration, rlcd, open-weights, local-models, llm]
publish: true
index_line: "Jev (TypeSafe): non-autoregressive System One model — typed decisions (Choice/Score/Noul) with calibrated probabilities, one parallel pass, 70-500ms, $0.042/MTok in + output free, RLCD training. Closed weights. Downloadable reproduction: Laya (Apache 2.0, 322-421M). Measured on M5: 10/12 EN+RU smoke (RU weaker), Core ML GPU 13.7ms/question, ANE refuses; port in ~/startups/active/laya-ane"
index_section: "concept"
---

# Jev / System One — Decision Models That Never Generate Text

Jev is TypeSafe AI's flagship model (founder Diogo Almeida, ex-OpenAI, worked on the research behind ChatGPT) and the first of what they call **System One models**. It is not an LLM in the usual sense: **non-autoregressive**, it never generates tokens one by one. You send unstructured text as `state` plus typed questions — `Choice` (classify), `Score` (ordinal rate), `Noul` (probability of yes) — and it answers all of them **in one parallel pass**, each as a typed value with a probability distribution and a confidence score. No text means nothing to parse and nothing to hallucinate. Training is **RLCD** (Reinforcement Learning for Calibrated Decisions): the reward is epistemically honest probabilities, not human preference (RLHF) or verifiable answers (RLVR). Reported numbers: 70-500ms end-to-end, $0.042 per MTok input, output free; TypeSafe claims ~194x faster and ~445x cheaper than frontier LLMs on workflow benchmarks. Adding questions barely changes latency, since each is evaluated in parallel against the same state.

A real-world data point (reported, from a Telegram channel author's test): classifying 4 MB of text (~1,597 posts) into categories took ~1 minute at 16 concurrent requests and cost $0.08.

**Jev itself cannot be downloaded.** Closed weights, hosted API only (api.typesafe.ai, early access), no self-host or on-prem path announced. The confidence calibration is the product.

## The downloadable path: Laya

[convaiinnovations/laya](https://huggingface.co/convaiinnovations/laya) is an open reproduction with weights on Hugging Face, **Apache 2.0**, `pip install laya`:

- `laya` (English): ModernBERT-large backbone, 421M params, ~808 MB
- `laya-multilingual`: mmBERT-base, 322M params, ~647 MB, 100+ languages incl. RU, context up to 8k
- Decision head: 2 transformer layers + option-marker scorer + act/escalate head; single forward pass ~33ms

Model-card claims (reported, not verified here): 7-8x faster than Jev per question, better typed-decisions accuracy (0.766 vs 0.727) and far better calibration after temperature scaling (ECE 0.081 vs 0.246); Jev still leads on high-cardinality choices (>20 options) and soft distribution matching. At 421M params this runs on a laptop — the entire hosted product collapses into a local `pip install`.

**Measured here** (Apple M5, 32 GB, 2026-09-20, `~/startups/active/laya-ane`): the multilingual checkpoint scores 10/12 on a hand-labeled EN+RU smoke set — both failures are Russian, and one is *confidently wrong* (urgency Noul at 0.023 with 0.977 confidence), so RU output needs a human-review gate until measured on a bigger set. English: 9/9. Latency: 34 ms per 3-question call on MPS (matches the card's ~33 ms). Ported to ONNX (int8: 325 MB, decisions unchanged) and Core ML: **fp16 615 MB at 13.7 ms/question on the M5 GPU, int8 309 MB at 25.2 ms** — 5-35x faster than hosted Jev's 70-500 ms. The Neural Engine refused the model outright (`ANECCompile() FAILED`; the 34 ms "ANE" number is E5RT's fallback); a transformer needs ane_transformers-style surgery to pass, and the GPU number made that not worth chasing. Five coremltools 9.0 blockers and their patches are in the repo's README.

Other reproductions, all downloadable: [razorback16/openjev](https://github.com/razorback16/openjev) (Jev-compatible server on DiffusionGemma, ~18 GB, vLLM), [ekzhang/openjev-sglang](https://github.com/ekzhang/openjev-sglang) (prefill-only trick over open models: read logits from the prefill pass, never decode), [logan-markewich/jeff](https://github.com/logan-markewich/jeff) (GliFormer). Tracker: [jev-reproductions-tracker](https://huggingface.co/spaces/multimodalart/jev-reproductions-tracker) on HF Spaces.

## Why it matters

The insight is the class, not the vendor: for routing, triage, moderation, scoring — the bulk of production "AI" calls — generation was never the point. A model that only answers closed questions can be small, calibrated, and 100x cheaper, and a `Noul` at 0.55 can honestly route to a human where an LLM's confident prose cannot. This fits privacy-first/offline-first products directly: Laya-multilingual at 647 MB is download-on-demand territory for a desktop app.

## Links

- [[schema-guided-reasoning]] — the opposite bet: arbitrary typed schemas over any LLM, expressive but uncalibrated; System One trades expressiveness for honest probabilities on a closed taxonomy
- [[needle-tiny-tool-model]] — same design one size down: 45M params, grammar-constrained output + confidence head for escalate-or-act, fully on-device; Laya sits between Needle and hosted Jev
