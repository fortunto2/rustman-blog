---
type: concept
title: "OpenAI privacy-filter — on-device PII redaction model (1.5B MoE, Apache-2.0)"
description: "OpenAI open-sourced a 1.5B-parameter PII detection model (50M active via MoE) converted from gpt-oss into a bidirectional classifier. 8 PII categories, BIOES span tagging, Viterbi decoding, 128K context, runs on laptop/browser. The missing privacy primitive for AI-agent pipelines that used to rely on regex."
created: 2026-04-22
tags: [privacy, pii, ml, openai, on-device, gpt-oss, redaction, moe, token-classification]
publish: true
---

# privacy-filter — A Real Model for the PII Problem

[openai/privacy-filter](https://github.com/openai/privacy-filter) (Apache-2.0, Python, 173★) is OpenAI's open-source PII detection and masking model. It's the boring-but-important piece that was missing from most agent pipelines: **not a regex library, not an LLM prompt — a dedicated 1.5B-parameter model** fine-tuned specifically for token-level PII classification, runnable on a laptop.

Up to now the PII step in any agent stack was either a fragile regex (misses "John Smith" anywhere, over-matches every date), or a round-trip to GPT-4/Claude with a "detect PII in this text" prompt (slow, expensive, non-deterministic, leaks the PII to the provider you're trying to protect from). privacy-filter is the third option: a small local model that does one job well.

## The architecture is interesting

The model is a **pre-norm transformer encoder** with 8 blocks, grouped-query attention (14 Q heads, 2 KV heads), and a **sparse MoE layer** (128 experts, top-4 routing — only 50M of the 1.5B parameters are active per token). 128K context window. Per-token logits over 33 classes (8 PII categories × 4 boundary tags via BIOES + background), decoded into coherent spans with a **constrained Viterbi decoder** using tunable linear-chain transitions.

The clever bit: the checkpoint was **bootstrapped from `gpt-oss`** (their open autoregressive model) and converted into a bidirectional classifier, instead of training a masked-LM from scratch. They're reusing pretrained weights across form-factors — one more data point for the "pretrain once, adapt many" pattern. Supervised fine-tuning on labeled PII spans does the rest; they call it "data-efficient finetuning."

## The 8 PII categories

```
account_number   private_address   private_email      private_person
private_phone    private_url       private_date       secret
```

"Private" as a prefix is the signal: the model is trying to distinguish *personal* references (`Alice Smith lives at 12 Oak St`) from *public* entities (`Tim Cook, CEO of Apple`). This is exactly where regex falls over.

## How to use it

```bash
pip install -e .
opf "Alice was born on 1990-01-02 at 123 Main St."
opf -f ./conversation.txt
```

Model weights auto-download to `~/.opf/privacy_filter`. At runtime you can tune the six **transition-bias parameters** of the Viterbi decoder to trade precision for recall — useful because agent pipelines have very different tolerances (batch logging wants high recall even at the cost of some over-redaction; live customer-facing sanitization wants high precision so you don't mangle legitimate text).

## Where it fits in our stack

This closes a real gap in the [[privacy-as-architecture|privacy-as-architecture]] approach we've been pushing. That page argues for "no accounts, on-device, zero data"; privacy-filter is the component that makes that tractable when you *do* have to send text to an LLM provider — strip PII locally first, send the redacted version, reconstitute on return if needed. It sits alongside [[apple-on-device-ai|Apple Foundation Models]] as another "real local model for a real privacy primitive" building block.

For anything client-facing in [[project-invoice-crm|Invoice CRM]] or the `6-crm/` workspace, or the Gmail/Drive sync in [[project-solograph|Solograph's]] personal layer, this is the sanitizer I want between "user text" and "provider API call." The alternatives (`presidio`, `spacy` NER, regex stacks) all have worse precision and worse multilingual fallback. `privacy-filter` is primarily English but reports "selected multilingual robustness" — worth benchmarking on Russian before relying on it.

## What it is NOT

OpenAI is careful in the README: *"not an anonymization, compliance, or safety guarantee."* It's a detection/redaction model, not a certification. That means:

- **No differential privacy, no k-anonymity** — purely span-level masking
- **Static label policy** — can't add new PII categories without fine-tuning
- **Drops on non-Latin scripts and underrepresented naming patterns** — false negatives on unusual names, fragmented boundaries on mixed content
- **Over-redacts public figures** — Tim Cook may get masked as a private person

You still need the policy layer (what to do with a flagged span), the audit log (what was redacted), and the legal framing. The model is one leaf of the tree.

## The pattern worth noticing

Every few months OpenAI open-sources *exactly the commodity piece* you'd have otherwise built yourself badly. Whisper killed everyone's homegrown STT. gpt-oss is now the cheap pretraining base for downstream classifiers — this repo is the first concrete example of that. Expect more: a small local toxicity classifier, a small local moderation model, a small local summarizer — all bootstrapped from gpt-oss, all Apache-2.0, all undercutting the "call our API for this" business.

For solo founders the calculus is: **stop building the commodity layer, compose from these.**

## See Also

- [[privacy-as-architecture]] — privacy as a structural choice, not a feature; privacy-filter is the piece that makes "strip-before-send" cheap
- [[privacy-first]] — the principle; this is an implementation lever
- [[apple-on-device-ai]] — sibling: another real on-device model for a real privacy primitive (Apple's generation; this is detection/redaction)
- [[bonsai-ternary-llm]] — same thesis (small local models beat API round-trips for narrow tasks) but more extreme compression (ternary weights, browser)
- [[token-efficient-web-requests]] — preprocessing before the LLM call compounds; privacy-filter adds PII-stripping to that pipeline
- [[posthog-cross-platform]] — PostHog EU for analytics only solves server-side leakage; privacy-filter solves LLM-provider leakage
