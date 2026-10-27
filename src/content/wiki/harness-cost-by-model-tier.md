---
type: concept
title: "When a behavioral harness pays: continuously for a cheap model, once for a frontier one"
description: "Naresh Jain built the same API service 10 times per condition: a behavioral harness lifted GPT-6 Luna from 3 to 10 accepted runs and made it 33% cheaper than unharnessed GPT-6 Sol, while for Sol it cost about 7 times more and changed nothing."
created: 2026-10-27
tags: [harness, sensors, verification, cost, cheap-models, delegation, contracts]
course_module: 4
course_order: 8
publish: true
source_url: "https://martinfowler.com/articles/are-harnesses-worth-the-cost.html"
learned_from: "https://martinfowler.com/articles/are-harnesses-worth-the-cost.html"
index_line: "Naresh Jain (martinfowler.com, 13 Oct 2026; harness built on Specmatic, his colleagues' tool): Java BFF, 178 external acceptance tests, 10 runs/condition, low effort, Codex. GPT-6 Sol 10/10 either way, harness = 10.5x tokens, ~3x time, $2.679 vs $0.406. GPT-6 Luna 3/10 → 10/10, harnessed $0.273 = 33% under unharnessed Sol (REPORTED, API-equivalent, excludes writing the contracts). Unharnessed Luna passed 94.8% of checks: misses were attention lapses at seams (202 deferred flow, Kafka __TypeId__ header, null vs array, 415 vs 400, env var name). Rule: sensors always; cadence by model, continuous for cheap, one final gate for frontier"
index_section: "concept"
---

# When a behavioral harness pays

## Definition

A behavioral harness, in Böckeler's terms, is *guides* that steer the agent before it
acts plus *sensors* that report after it acts. Naresh Jain's guides were OpenAPI and
AsyncAPI contracts, request-response examples and an API-development skill. His sensors
were contract tests, response-value checks and assertions on side effects (mock calls,
Kafka messages). All of the sensors were deterministic: no LLM judged correctness.

## Numbers (reported, API-equivalent estimates)

Task: a backend-for-frontend in Java with a 202-deferred flow, Kafka publishing and
exact error codes. Every finished app faced the same 178 external acceptance tests,
which the harness never saw. 10 runs per condition, low reasoning effort.

| Model | Harness | Accepted | Tokens | Time | Cost per run |
|---|---|---|---|---|---|
| GPT-6 Sol | no | 10/10 | 1.08M | 6 min 51 s | $0.406 |
| GPT-6 Sol | yes | 10/10 | 11.33M | 19 min 53 s | $2.679 |
| GPT-6 Luna | no | 3/10 | 5.86M | 15 min 56 s | $0.086 |
| GPT-6 Luna | yes | 10/10 | 22.93M | 35 min | $0.273 |

The harness did not give Luna a capability it lacked. Unharnessed Luna passed 94.8% of
the checks, and every failed app passed at least 144 of 178. The misses sat at the
seams: a timeout answered with 503 instead of 202 plus a monitor link, a Spring
serializer adding a `__TypeId__` header, `"categories": null` where the contract allowed
only an array, 415 where the brief said 400, `ORDER_API_API_KEY` against
`ORDER_API_KEY`. Jain calls it an *attention lapse*: the requirement was in the brief and
lost its pull during implementation. A red sensor brought it back, which is why he calls
the harness *executable attention*.

## Rule

- Sensors are not optional for any model. Capability changes **when** they run, not
  **whether**.
- Cheap model: give it the test command and have it run the checks during the work,
  not only at the end. That turned 3/10 into 10/10.
- Frontier model: one deterministic gate at completion. Continuous checks cost Sol 7x
  and bought nothing it did not already have.
- Write the expectation outside the implementing agent. Jain's `examples validate` step
  checks that the examples conform to the spec before any test runs, so guides and
  sensors cannot contradict each other. The agent was told to fix the implementation,
  never the expectation, and solo-verify's `HARNESS TOUCHED` line exists for the same
  reason.

## What it confirms here

Our Stop gate (`solo-verify --full` once per turn, syntax-only on each edit) is the
frontier prescription. What is missing is the cheap-model half: when work goes to a
Sonnet or Haiku subagent ([[cheap-model-delegation-boundary]],
[[claude-5-5-effort-and-cost]]), its brief should carry the command that goes red, so
the worker runs it while it works. `make integration` from [[cli-first-testing]] is that
command. Contracts as guides are [[schema-guided-reasoning]] applied to the interface
instead of the model's output. The reverse case, where a test-first ritual adds cost
without adding a sensor, is [[tdd-inside-the-agent-loop]].

## Exceptions

- 10 runs per model on one greenfield service with an unusually complete brief. Legacy
  code, vague requirements and other languages were not tested.
- Guides and sensors were added together, so their separate effects are unknown.
- Costs exclude writing and maintaining the contracts, and exclude fixing a rejected app.
- The "final gate only" condition for Sol was proposed and not measured.
- The harness was built on Specmatic, and Jain thanks "my colleagues at Specmatic". It
  is a vendor-adjacent result, though every number is published with its method.

## Learned from

Naresh Jain, "Are Harnesses Worth the Cost?", martinfowler.com, 13 October 2026. The
guides and sensors framing is Böckeler's "Harness engineering for coding agent users";
see [[harness-engineering-summary]] and [[agent-mistake-fix-harness]].
