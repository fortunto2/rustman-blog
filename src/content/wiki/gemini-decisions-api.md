---
type: concept
title: "Gemini Decisions API (gemini-decision-1): Google's decision model, next to Jev"
description: "Google's Decisions API scores yes/no, choice and rubric questions in one pass and returns calibrated probabilities with zero output tokens; it is the same class of model as Jev, hosted only."
created: 2026-11-12
tags: [structured-output, classification, calibration, routing, gemini, google, llm, decision-models]
publish: true
source_url: "https://aistudio.google.com/docs/decisions-api"
learned_from:
  - "https://aistudio.google.com/docs/decisions-api"
  - "https://aistudio.google.com/docs/models/gemini-decision-1"
  - "https://blog.google/innovation-and-ai/technology/developers-tools/gemini-decisions-api/"
  - "Telegram channel digest, 12 Nov 2026 (second-hand, the starting claim)"
index_line: "Gemini Decisions API (gemini-decision-1, Google, Nov 2026): POST /v1beta/decisions, questions noul/choice/score, up to 1,000 per call, 262,144-token context, text+image+audio+video+PDF, calibrated probs, 0 output tokens, 150-250 ms, $0.10/MTok in, free tier in AI Studio. Hosted only, no caching/batch. Same class as Jev ([[jev-system-one]]); Google does not name Jev in the pages read. Eval plan on our own cases, not run"
---

# Gemini Decisions API (`gemini-decision-1`)

## Definition

A Google endpoint that does not generate text. You send one shared `input` and a map of typed questions; the model scores all of them in a single forward pass and returns a calibrated probability per question. `gemini-decision-1` is the only model it accepts. It is the same class of model as Jev in [[jev-system-one]], from a bigger vendor, with a multimodal input.

Status of each claim below: **verified** means read on a Google page (URL in `learned_from`); **vendor claim** means Google says it and publishes no method in the pages read; **channels only** means not found at a primary source.

## What the digest said, checked

| Claim from the digest | Result |
|---|---|
| Google released Gemini Decisions API, `gemini-decision-1` | **Verified.** Google blog, AI Studio docs and a model page all exist. Press coverage is dated 11 Nov 2026 (MarkTechPost URL); the Google blog page carried no date in the extract. |
| A separate endpoint for choosing, routing, classifying | **Verified.** Google's own list: tool selection, policy checks, model routing, context grading. |
| "Competitor of Jev" | **Channels only.** The type names are the same as Jev's (`noul`, `choice`, `score`), and so is the idea (calibrated probabilities, one parallel pass). None of the Google pages I read mention Jev or TypeSafe. |

## Shape of the API (verified, docs page)

- REST: `POST https://generativelanguage.googleapis.com/v1beta/decisions`, header `x-goog-api-key`. SDK: `client.decisions.create(...)`, needs `google-genai` 3.2 or later (or `@google/genai`), `api_version` set to `v1beta`.
- Request: `model`, `input` (a string, or content blocks: text, image, audio, video, PDF), `questions` (1 to 1,000, keys `[A-Za-z0-9_-]+` up to 64 chars).
- Question types:
  - `noul`: yes/no, returns a probability from 0.01 to 0.99 (never 0 or 1, so a threshold above 0.99 never fires) and `confidence`.
  - `choice`: 2 to 255 options with a description each, returns the winner and a probability for every option. Options are sorted alphabetically before scoring, so a key like `none_of_the_above` lands in the middle; use `other`.
  - `score`: an ordered rubric of 2 to 255 levels (2 to 10 recommended), returns the probability-weighted average of level indices, the per-level probabilities and a legend.
- `confidence` = probability of the top answer (`max(p, 1-p)` for yes/no). The docs tell you to threshold it and to set thresholds on labeled traffic of your own.
- Questions cannot see each other and the model never sees the question keys. Shared input is billed once however many questions follow.
- Limits: context 262,144 tokens across input and questions; inline media up to 100 MB (50 MB PDF); external URL up to 15 MB; no YouTube URLs and no `gs://`; question text is text only.
- Not supported: context caching, Batch API, Flex and Priority inference, function calling, structured output, thinking. Repeated input is billed in full each time.
- Blocked input returns HTTP 400 with a code (`safety`, `prohibited_content`, `blocklist`, `image_safety`, `content_blocked`).
- Docs warning worth keeping: input is untrusted, user text can argue for its own classification; test adversarial inputs and keep a human on high-stakes actions.

## Price, speed, claims

- **Verified (Google blog and model page):** $0.10 per 1M input tokens, $0 output, a no-cost tier in AI Studio for prototyping. I did not read the rate-limit page, so no quota numbers here.
- **Vendor claim:** 150-250 ms end to end, 50-100 ms model compute, "nearly flat" from 1 to 100 questions; "nearly 5x cheaper" than Gemini 3.5 Flash-Lite on Interactions API across their benchmark suite; "lowest calibration error" and "leads across the suite". The blog shows no benchmark table, so there are no accuracy numbers to quote.
- **Vendor claim, internal use:** Gemini Notebook routes queries with it (up to 40% lower latency), Search uses it as a safety layer for MCP tools.
- Integrations announced as rolling out: OpenRouter, LangChain, Vercel AI SDK, LiteLLM, Pydantic AI, Pipecat, LiveKit, OpenCode.

## Where it overlaps Jev, where it does not

| | Gemini Decision 1 | Jev (our notes) |
|---|---|---|
| Question types | noul / choice / score | Noul / Choice / Score |
| Output | probabilities, 0 text tokens | same |
| Price per MTok input | $0.10 | $0.042 (reported, see [[jev-system-one]]) |
| Latency | 150-250 ms e2e (vendor) | 70-500 ms (reported); 247 ms p50 in Mike's 17-case run |
| Input | text, image, audio, video, PDF | text and image |
| Options per choice | up to 255 | weaker above 20 options (Laya card claim) |
| Weights | closed, hosted | closed, hosted |
| Local copy | none | Laya, Apache 2.0, measured 13.7 ms on M5 GPU |

The decisive difference for us is the last row. Anything that must stay on the Mac (privacy-first products) still needs Laya or a similar open model; Google's endpoint is a cloud call with the data leaving the machine. Its edge is audio, video and PDF in the same call, which none of our current Jev jobs needed.

Mike's table in [[jev-system-one]] already lists a "Microsoft decision-1" lane on Foundry, so Google is at least the second large vendor with this primitive.

## What we would test (not run)

Goal: does Gemini Decision 1 beat Jev 1.14 and Laya on our own cases, in Russian too?

1. Build 60 to 100 labeled cases from jobs we already have: the destructive-action gate (rm -rf style), the agent-output watchdog, the intent router from the kitchen demo, the channel-digest filter ("worth posting or not", in Russian), and the BroCheck image questions. Label by hand first, before any model runs.
2. Run the same cases through Gemini Decision 1, hosted Jev and Laya-multilingual with identical question wording; keep Russian cases as a separate slice, because Laya failed there.
3. Record accuracy against our label, the number wrong while confidence is 0.9 or higher (the metric that sank JSON-from-LLM in Mike's run: 7 of 17), p50 latency and cost per 100 cases.
4. Set the threshold on half the cases and check it on the other half; compare how often each model passes a case to a human.
5. Add 10 adversarial inputs that argue for their own label (the docs' own warning) and check none flips a gate.

Decision rule: adopt Google's only if it cuts confidently-wrong cases without losing the Russian slice; otherwise keep Jev for hosted and Laya for local.

## Learned from

Primary: the three Google pages in `learned_from`. The starting claim came from a Telegram digest of 12 Nov 2026. Nothing here was run by us.
