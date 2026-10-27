---
type: concept
title: "TDD inside the agent loop: a red test the agent saw proves only that it saw red"
description: "Birgitta Böckeler's August 2026 eval found that telling a coding agent to run its own TDD loop cost 3 to 8 times the tokens and produced no better design, tests or mutation scores, so the test needs an owner other than the implementing agent and the suite needs mutation testing."
created: 2026-10-27
tags: [tdd, testing, agents, harness, sensors, mutation-testing, methodology]
course_module: 3
course_order: 5
publish: true
source_url: "https://martinfowler.com/articles/exploring-gen-ai/tdd-in-the-agent-loop.html"
learned_from: "https://martinfowler.com/articles/exploring-gen-ai/tdd-in-the-agent-loop.html"
index_line: "Böckeler (martinfowler.com, 10 Aug 2026; Sonnet 4.6 builds, Opus 4.8 ranks blind, 5 batches, greenfield business logic): agent-run TDD ranked #3-#4 behind no-TDD on small+medium tasks, mutation scores no better (81.0/77.3% vs 84.2/89.6%), tokens 2.96x-8.5x (REPORTED, cache reads counted). Agents faked/skipped red, over-implemented past the current test, still wrote a tautological test. Up-front design was what moved quality. Rule here: test-first only where a human or a fixed spec owns the test; mutation score is the regression sensor; 'never been red' is not evidence when the agent watched it"
index_section: "concept"
---

# TDD inside the agent loop

## Definition

Böckeler separates three ways TDD meets an agent: a human writes the tests; the
agent writes a failing test and a human reviews it before the implementation; or the
agent runs the whole red-green-refactor loop alone. The third is the most common, and
it is the one her eval tested.

## Numbers (reported, not re-measured here)

Three greenfield business-logic tasks. Sonnet 4.6 wrote the code, a Sonnet 4.6 judge
checked TDD adherence from the transcripts, and Opus 4.8 ranked the solutions without
knowing how each was made. Every run had to reach 80% coverage.

| | No TDD | Agent-run TDD |
|---|---|---|
| Rank, small + medium tasks (4 batches) | #1 and #2 | #3 and #4, except one run that ranked #1 while its twin with the same prompt ranked last |
| Mutation score, medium round 1 | 84.2%, 89.6% | 81.0%, 77.3% |
| Tokens, TDD ÷ no-TDD | 1x | 8.50x small, 2.96x medium, 4.89x large |

The token counts are running totals that include cache reads, so the dollar overhead
is smaller than the multiplier. It is still several times.

Reading the transcripts, Opus found that the no-TDD runs designed the whole thing first:
data types, edge cases, contracts. The TDD runs let the first test fix the shape and
rarely revisited it, and behaviour nobody wrote a test for was never built. Ivett
Ördög's explanation: models were trained on finished functions, not on step-by-step
TDD sessions.

## Why red-green loses its meaning

A red test proves a regression check works only when someone checks *why* it went red.
When the agent writes the test and watches it fail, all that proves is that the agent
ran it. In her runs agents skipped or faked the red step, and they implemented ahead
of the current test so the next one passed without ever going red. Test-first also did
not prevent the tautological test: one TDD run computed its "expected" value by
re-running the implementation. That is the third of the four lying tests in
`skills/build/references/tdd-seams.md`.

Our `/solo:build` says "a test that has never been red proves nothing." That holds for a
human. For an agent the stronger statement holds: a test the agent saw go red proves
nothing either.

## Rule

- Test-first only where the test has an owner other than the implementing agent: a
  seam the human confirmed (the build skill already asks for this), a contract or a set
  of examples written before the code (see [[harness-cost-by-model-tier]]), or a human
  checkpoint between the test and the implementation.
- Measure the suite rather than the ritual. `make mutants` in solo-factory asks "does
  the suite go red when a line is wrong", which is the question red-green was meant to
  answer. Böckeler made the same switch, to mutation testing as the regression sensor.
- Ask for the design up front: data model, edge cases, contracts. That is what moved
  quality in her runs, and step-by-step TDD works against it.
- For agent-only tasks, default `docs/workflow.md` to moderate or none rather than
  strict, and put the saved tokens into a mutation run at the end.

## Exceptions

- One person's exploratory eval: 5 batches, one judge model, greenfield business logic
  only. Legacy code, concurrency and UI were not tested.
- Quality is Opus's rubric, built on the fly. Her criteria were deliberately loose.
- When a human writes the tests or reviews the failing test (her first two modes), none
  of this applies. Seam-first and vertical slices in [[dev-principles-summary]] are about
  *what* gets tested and stay as they are.

## What it touches here

[[writing-claude-md]] and [[dev-principles-summary]] teach Red→Green→Refactor as a
default. [[cli-first-testing]] stays: `make integration` is a sensor with a human-owned
expectation. And [[agent-mistake-fix-harness]] applies: a procedure that drifts across
model releases belongs in the harness, not the prompt.

## Learned from

Birgitta Böckeler, "TDD inside the agent loop: theater or actual value?", Exploring Gen
AI series on martinfowler.com. The series index dates it 10 August 2026; the article
page prints no date. Raw runs are on GitHub at `birgitta410/tdd-comparisons`. Her
mutation-testing setup is in "Sensors for coding agents" (martinfowler.com, 27 May 2026).
