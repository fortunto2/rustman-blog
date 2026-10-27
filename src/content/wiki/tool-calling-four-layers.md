---
type: concept
description: "How tool calling actually works under the hood: HTTP API → Jinja2 chat template → xgrammar constrained decoding → Hermes XML parser. Four layers of abstraction."
title: "Tool calling internals — four layers from HTTP to parser"
created: 2026-04-08
updated: 2026-10-27
tags: [tool-calling, llm, inference, constrained-decoding, vllm, chat-template, xgrammar]
course_module: 5
course_order: 8
publish: true
source_url: "https://t.me/neuraldeep/2047"
index_line: "Tool calling internals: HTTP → Jinja2 chat template → xgrammar constrained decoding → Hermes parser"
index_section: "concept"
---

How tool calling actually works end-to-end, traced through vLLM internals. Four layers of abstraction that everyone confuses with each other.

**Layer 1: HTTP request.** You send `tools: [...]` as a separate field in the API request. At the API level, tools are a distinct section, not part of the system prompt. This is what you see in OpenAI/Anthropic docs.

**Layer 2: Chat template (Jinja2).** The inference engine loads `tokenizer_config.json` which contains a Jinja2 template. The template takes your `tools: [...]` and renders them directly INTO the system prompt:

```
{%- if tools %}
  "# Tools\n\nYou may call one or more functions..."
  <tools>{tool schemas}</tools>
```

So tools ARE injected into the prompt — but by the chat template, not by you. Both "tools are in the system prompt" and "tools are a separate API field" are correct, just at different abstraction layers.

**Layer 3: Constrained decoding (xgrammar/outlines).** In parallel, JSON schemas from tools feed into `guided_decoding=GuidedDecodingParams(json={...})`. This is xgrammar — constrained decoding at the logit level. A token mask physically prevents the model from generating invalid JSON. The model cannot produce broken tool calls because invalid tokens have -inf probability.

**Layer 4: Hermes parser (post-processing).** The model generates plain text: `<tool_call>{"name": "...", "arguments": {...}}</tool_call>`. This arrives in the `content` field. The Hermes parser catches XML tags, extracts JSON, and moves it into the structured `tool_calls` response field. Important: during this stage `tool_calls: null, finish_reason: "stop"` — NOT `tool_use`. The parser does all the magic in post-processing.

**Proprietary APIs** (Anthropic, OpenAI) hide all of this server-side. You get a clean `tool_calls: [{...}]` and `finish_reason: tool_use`. But inside, the exact same chain runs.

The contract between inference framework and provider — what goes where via chat template — is what engineers should understand. Otherwise you're a user of someone else's abstractions, not an engineer.

Key references for going deep: vLLM source (tool parsers), model `tokenizer_config.json` (chat templates), xgrammar (constrained decoding library).

## What others found since (Oct 2026)

- **Correction to Layer 3.** "Cannot produce broken tool calls" holds only when constrained decoding is switched on for that call. Armin Ronacher ([Jul 2026](https://lucumr.pocoo.org/2026/7/4/better-models-worse-tools/)) saw Opus 4.8 and Sonnet 5 add invented keys to nested tool arguments in about 20% of one session's edit calls under a harness that did not enforce the schema; `strict` mode eliminated it (reported).
- **Composition moves into the harness.** Ronacher's [Codemode](https://lucumr.pocoo.org/2026/10/6/codemode/) in Pi 1.0 (Oct 2026) runs tool composition as QuickJS in WASM with no network, filesystem or timers, at most 4 concurrent tool calls, and reaches MCP tools only through tool search (reported).


## Connections

- [[schema-guided-reasoning]] — SGR/constrained decoding is Layer 3 of this pipeline
- [[harness-engineering-summary]] — understanding the tool calling contract is part of "know your tools" in harness engineering
- [[context-engineering]] — chat templates are literally context engineering: what the model sees is shaped by the template, not just your prompt
- [[sgr-deep-dive]] — SGR deep dive: the theory behind constrained decoding (layer 3)
