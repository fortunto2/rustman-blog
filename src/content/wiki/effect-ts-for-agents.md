---
type: note
title: "Effect for AI agents: when it beats plain TypeScript and Vercel AI SDK"
description: "Effect is a typed effect system for TypeScript. For short LLM calls it is overhead; for long, parallel, cancellable agent pipelines like video editing it replaces a pile of hand-written retries, queues and cleanup."
created: 2026-09-30
tags: [agents, typescript, effect, reliability, sgr, vercel-ai-sdk, architecture]
publish: true
index_line: "Effect (TS effect system) vs Vercel AI SDK for agents: overhead for simple calls, wins for long parallel cancellable pipelines (video editing). Stats, pros/cons, decision rule"
index_section: "concept"
---

## The short answer

[Effect](https://effect.website) is a typed effect system for TypeScript: errors live in the type
signature, and retries, timeouts, concurrency limits, cancellation, resource cleanup, dependency
injection and tracing are part of the runtime instead of code you write by hand. It is not an LLM
library. Vercel AI SDK calls the model; Effect runs everything around the call. The two combine:
AI SDK inside an Effect program is a normal setup.

**Decision rule.** If the agent is "call a model, fill a schema, show the result", stay on AI SDK
(`generateObject` with a strict schema is already [[schema-guided-reasoning]]). Reach for Effect
when the agent becomes a long-running pipeline: dozens of steps, parallel jobs with a limit,
user-initiated cancel, partial failures that must not be lost, resume after a crash.

## Where it pays off: a video-editing agent

Ingest 50 clips, transcribe, detect scenes and beats, let an LLM pick moments, render with ffmpeg,
upload. On plain TypeScript every one of these needs its own code; in Effect each is one construct:

| Need | Plain TS + AI SDK | Effect |
|---|---|---|
| 50 clips, max 4 ffmpeg at once | hand-written queue / semaphore | `Effect.forEach(clips, f, { concurrency: 4 })` |
| User presses cancel | ffmpeg and LLM requests keep running | interruption kills the whole fiber tree |
| 3 of 50 transcriptions fail | try/catch, easy to swallow an error | failure is in the type; skip, retry or stop is an explicit choice |
| Retry policy with backoff and budget | loops copied into every call site | one `Schedule`, reused everywhere |
| Temp files, GPU slots | leak on crash | `acquireRelease` cleans up even on cancel |
| Resume after a server crash at clip 40 | start over | `@effect/workflow`, durable like Temporal but in-process |

## Pros

- Reliability is structural, not disciplinary: the compiler forces you to handle the failure modes
  an agent actually hits (timeouts, rate limits, invalid JSON).
- One coherent toolkit replaces a zoo (tsyringe + zod + neverthrow + p-retry + hand-rolled queues).
- Built-in OpenTelemetry tracing shows every step of an agent run.
- Healthy project (measured 2026-09-30): 16.3k GitHub stars, 179 open issues of which 90 labelled
  bug, v3.22, active since 2019, ~48M weekly npm downloads (part of that is transitive, pulled in by
  other libraries). For comparison Vercel AI SDK: 27k stars, ~1,450 open issues and PRs.
- Strict types are a guardrail for code written by LLMs, not only by people.

## Cons

- Steep learning curve: generators, `Effect<A, E, R>`, layers and services read like a new language
  on top of TypeScript. The cost is paid by every person (and agent) touching the code.
- `@effect/ai` has a much smaller provider ecosystem than AI SDK.
- For simple request/response agents it is pure overhead; `generateObject` + a retry helper +
  `AbortController` + OpenTelemetry covers ~80% of the reliability for a fraction of the complexity.
- If the orchestrator is in Rust, Effect adds nothing: `Result`, serde/schemars and tokio
  (`JoinSet`, `Semaphore`, `CancellationToken`) already give the same guarantees natively. See
  [[rust-agent-ecosystem]].

## How this connects

- [[schema-guided-reasoning]]: the schema is the first layer of reliability; Effect is the second,
  around execution. Neither replaces the other.
- [[harness-engineering-summary]]: the harness checks that the agent's work is correct; Effect makes
  the run itself predictable. Correctness beats typed retries when you can only afford one.
- [[rust-agent-ecosystem]]: the same reliability toolkit, native in Rust, which is why a Rust
  orchestrator does not need it.
