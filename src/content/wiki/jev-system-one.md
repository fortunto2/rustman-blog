---
type: concept
title: "Jev / System One — decision models that never generate text, and the open-weight Laya"
description: "Jev (TypeSafe AI) is a non-autoregressive 'System One' model: unstructured text in, typed decisions with calibrated probabilities out, in one parallel pass. Closed weights, API-only — but Laya (Apache 2.0, 322-421M params, ~650-800MB) reproduces it with downloadable weights and runs locally."
created: 2026-09-20
updated: 2026-10-23
tags: [structured-output, classification, non-autoregressive, calibration, rlcd, open-weights, local-models, llm]
publish: true
index_line: "Jev (TypeSafe): non-autoregressive System One model — typed decisions (Choice/Score/Noul) with calibrated probabilities, one parallel pass, 70-500ms, $0.042/MTok in + output free, RLCD training. Closed weights. Downloadable reproduction: Laya (Apache 2.0, 322-421M). Measured on M5: 10/12 EN+RU smoke (RU weaker), Core ML GPU 13.7ms/question, ANE refuses; port in ~/startups/active/laya-ane. Six jobs from OC hackathon 21.10.2026: destructive-action gate, agent-output watchdog, scorer + LLM explainer, intent router, feed filter, image judgments; Mike benchmark: JSON-LLM 7/17 confidently wrong, decision models 0"
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

## Inside an agent harness: offload decisions from the LLM

Vivek Haldar ([Integrating Decision Models into Agent Harnesses](https://vivekhaldar.com/articles/llms-do-too-much-offload-to-decision-models/), Oct 2026) embedded hosted Jev into [Proceda](https://github.com/vivekhaldar/proceda), his SOP-to-agent harness, with Qwen 3.8 27B as the main LLM, on 360 cases from three [SOP-Bench](https://github.com/amazon-science/SOP-Bench) domains (referral abuse, email intent, patient intake). Rule in both experiments: act on the decision only when its probability is ≥0.8, otherwise fall back to the LLM.

- **"Is this step finished?"** after tool calls (harness-internal): 605 fewer LLM calls (−23.8%), 357/360 correct LLM-only vs 356/360 hybrid.
- **Business decision inside the SOP** (email intent, a `Choice`): Jev took 141 of 148 decisions (95.3%), 7 fell back to Qwen, 148/148 correct either way, −25.4% LLM calls for the whole workflow (556 → 415).

These are his reported numbers, not reproduced here. The reusable pattern: put the decision model where the LLM only classifies or checks completion, gate it on calibrated probability, keep the LLM as the fallback. Code and reports are on the `codex/bounded-business-decisions` branch. Haldar ran the OC AI Builders Lightning Hackathon (Irvine, 21.10.2026, theme "Decision models + LLMs", Nebius support).

## Where it pays off: twelve demos in 50 minutes

At the OC AI Builders Lightning Hackathon (EvoNexus Irvine, 21.10.2026) about a dozen teams demoed after a 50-minute build. Most used Jev, and the ones that worked put it in one of six jobs. The demos that had no closed question to ask (a trip planner, a memory-palace app, a therapist journal) did not use a decision model at all, which is the first filter: if the output is not a choice, a score or a yes/no, Jev has nothing to do.

**1. Gate on destructive actions.** ImageKit let a Claude Code agent clean up duplicate and unused assets in a media library. A hook intercepts the delete batch before the API sees it, code checks what the files are, and Jev decides the borderline cases: anything live or in an active campaign goes back to the human as "are you sure?". The same shape held in a separate benchmark: an agent proposing `rm -rf` on a backup server got Jev "escalate, needs a human" at 0.84, and code printed HOLD.

**2. Watchdog on a coding agent's output.** "Kill Bill" streams a coding agent's output into Jev and kills the run when it goes wrong. One run stopped at token 68 with p=0.97: the visible code imported a module outside the allowed list. Pointed at the author's old logs, it found a 1 h 55 min retry loop in a 12-hour session and would have fired before a build hit the 14 GB disk ceiling. A decision model is cheap enough to read every chunk of a stream, which an LLM judge is not.

**3. Scorer, with the LLM only explaining.** SiteScout picks where to open a shop: Overture map data from the Snowflake marketplace, cut into hexagons. Jev scores every hexagon against what the owner values (students nearby, few competitors), sliders change the weights, and Llama is called only when you click a spot, to explain the score in words. The decision and the prose are separate calls with separate costs.

**4. Intent router.** A voice kitchen copilot sends each utterance to Jev to decide: question about the recipe, navigation to the next step, or set a timer. That is a three-way `Choice` an LLM would answer slower and in prose. The demo's failure was elsewhere: the step navigation still wanted an exact phrase.

**5. Feed filter.** A product lead labeled his own X feed as hype, fact or signal and let Jev triage new items. His finding: Jev agreed with him on what to drop, not on what deserved attention. Rejecting noise is a closed question; taste needs his own labels and evals.

**6. Judgments on images.** [BroCheck](https://bro.rustman.org) (ours) sends two selfies as `Image` state with nine typed questions (same vibe, both smiling, style match, red flags, same person, relationship) and adds the probabilities with weights in code. Images need the header `TypeSafe-Danger-Zone-Images: true`. Every question that references the image re-sends it, so nine questions on a full-size JPEG return a 400; shrink to 768 px. Ask "is the plate empty?" as its own question, or an empty plate passes as a healthy meal. Code: [mama-approves](https://github.com/fortunto2/mama-approves).

### One benchmark from the room

Mike (rawrtech, [decide.rawrtech.ai](https://decide.rawrtech.ai)) ran 17 of his own routing cases through five lanes with one forward pass each. Numbers read off his slides; Jev and Laya are from his notes, the rest approximate.

| Lane | Right vs his own call | Wrong while ≥90% sure | p50 | Cost for 17 |
|---|---|---|---|---|
| Jev 1.14, hosted | 14/17 | 0 | 247 ms | $0.00034 |
| Microsoft decision-1, Foundry | ~11/17 | 0 | 454 ms | $0.00012 |
| Laya, local, zero-shot | ~9/17 | 0 | 46 ms | $0 |
| Local LLM asked for JSON | n/a | **7** | 618 ms | $0 |

The LLM asked for JSON was wrong seven times while claiming 90 to 95% confidence. None of the decision models was confidently wrong. Zero-shot Laya was a coin flip on his routing but 5x faster than hosted Jev and free, which matches the Russian misses measured above: Laya needs fine-tuning on your own labels before it decides anything alone.

### The rule that came out of it

Ask a closed question, keep the thresholds in code, and let the LLM write only what a human will read. Mike's line for it: "The model advises. Code controls." His thresholds are three constants at the top of a file, versioned and tested.

## Why it matters

The insight is the class, not the vendor: for routing, triage, moderation, scoring — the bulk of production "AI" calls — generation was never the point. A model that only answers closed questions can be small, calibrated, and 100x cheaper, and a `Noul` at 0.55 can honestly route to a human where an LLM's confident prose cannot. This fits privacy-first/offline-first products directly: Laya-multilingual at 647 MB is download-on-demand territory for a desktop app.

## Links

- [[schema-guided-reasoning]] — the opposite bet: arbitrary typed schemas over any LLM, expressive but uncalibrated; System One trades expressiveness for honest probabilities on a closed taxonomy
- [[needle-tiny-tool-model]] — same design one size down: 45M params, grammar-constrained output + confidence head for escalate-or-act, fully on-device; Laya sits between Needle and hosted Jev
