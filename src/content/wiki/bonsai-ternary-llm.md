---
type: note
title: "Bonsai — ternary-weight 500M LLM running in browser via WebGPU"
description: "Bonsai (deepgrove): 500M ternary-weight LLM (-1/0/+1), trained on <5B tokens, competitive with Qwen 2.5 0.5B and MobileLLM 600M. Runs in browser through transformers.js + WebGPU. Zero server cost, zero data leakage."
created: 2026-04-20
tags: [llm, on-device, webgpu, browser, quantization, privacy, transformers-js, open-model]
publish: true
---

## Key Takeaways

Bonsai is a 500M-parameter **ternary-weight** language model from deepgrove (Apache-2). Weights take only three values: `-1`, `0`, `+1`. Built on Llama architecture with Mistral tokenizer, trained on less than 5B tokens (one-two orders of magnitude less than typical 0.5B models), yet competitive with Qwen 2.5 0.5B (46.96 vs 48.22 avg across ARC, HellaSwag, PiQA, MMLU, Winogrande).

The HuggingFace Space `webml-community/bonsai-webgpu` runs this model **entirely in the browser** via WebGPU — no server, no API key, no data upload. Inference is hardware-accelerated through the browser's GPU. This is the transformers.js + ONNX Runtime Web pipeline hitting a sweet spot: quantized small model + WebGPU compute = usable LLM on the client side.

## Why it matters

**Browser LLM = privacy ceiling raised.** For web apps, "on-device AI" usually meant "call our API and trust our privacy policy". WebGPU + small quantized models makes it literal: the model file downloads once, runs in the tab, data never leaves. Same privacy guarantee as Apple Foundation Models on iOS, but for web.

**Ternary quantization vs 1-bit:** common misnomer — "1-bit" LLMs (BitNet b1.58, Bonsai) actually use ternary weights (1.58 bits). Trade-off: ~10× smaller memory than fp16, dramatically lower bandwidth, but requires custom kernels. Bonsai currently runs at 16-bit precision while mixed-precision kernels are in development — so the full efficiency story is still ahead.

**Training efficiency:** <5B tokens for competitive 0.5B model is unusual. Points to DCLM-Pro + Fineweb-Edu data quality mattering more than scale at this tier. Similar to our own SGR thesis: inference-time structure beats more training.

**Founder implication:** web MVPs with AI features no longer need OpenAI API on the critical path. A 500M model in-browser can handle classification, extraction, simple QA, schema-guided output. Zero marginal cost per call — freemium actually works because there is no unit cost to subsidize.

## Trade-offs

- **Not instruction-tuned.** Raw base model — fine-tuning needed for downstream use.
- **English only.**
- **Model download cost.** First load pulls hundreds of MB; browser caches but cold start is slow on mobile.
- **WebGPU coverage.** Chrome/Edge desktop solid, Safari iOS partial, older devices fall back to WASM (slower).
- **Quality ceiling.** 500M ternary will not replace GPT-4-class for complex reasoning. Use for narrow, well-scoped tasks.

## Connections

- [[apple-on-device-ai]] — Apple's native path to on-device AI for iOS; Bonsai + WebGPU is the web-browser equivalent of the same pattern (data stays on device, zero API cost)
- [[privacy-as-architecture]] — browser-native LLM is privacy by construction: no server exists that could leak data, same ceiling as on-device iOS
- [[privacy-first]] — extends the privacy-first hub with a concrete pathway for web products, not just native
- [[schema-guided-reasoning]] — small ternary models need SGR more than big ones; constrained decoding compensates for lower raw quality
- [[llm-providers-credits]] — opposite end of the spectrum: instead of choosing a cheap cloud provider, run zero-cost inference on the user's own GPU
- [[validated-apps-2026]] — on-device AI thesis applies to web apps too, not just iOS; Bonsai-class models unlock the freemium-works economics in the browser

## References

- HF Space: `webml-community/bonsai-webgpu` (136 likes)
- Model: `deepgrove/Bonsai` (Apache-2)
- Paper: github.com/deepgrove-ai/Bonsai
- Related: BitNet b1.58 (Microsoft), transformers.js, ONNX Runtime Web
