---
type: concept
title: "Plugin evals: the ablation arm is the finding"
description: "claude plugin eval runs every case twice, with the plugin and without, and reports the delta. An absolute score measures the model; only the baseline arm measures what your skill contributed."
created: 2026-09-12
tags: [evals, claude-code, plugins, skills, harness, measurement, methodology]
publish: true
source_url: "https://code.claude.com/docs/en/plugin-evals"
index_line: "claude plugin eval (CC 2.1.269): --ablation with-without runs each case with and without the plugin and reports the delta. Absolute score measures the model, delta measures your skill. `tool_used: Skill` is a with-only indicator, kept out of the score: fired-but-useless and useful-but-never-fired are different bugs. 3 runs/case, haiku judge, threshold 1.0, --max-cost-usd, HTML report"
index_section: "concept"
---

# Plugin evals: the ablation arm is the finding

Claude Code 2.1.269 ships `claude plugin eval`. The test runner is the boring half. The half worth copying is `--ablation with-without`, on by default whenever a plugin resolves: every case runs twice, once with the plugin loaded and once with a bare baseline arm, and the report shows the **delta** rather than a score.

That distinction is the whole point. A skill that scores 0.9 has told you nothing, because the model without the skill may also score 0.9 on the same prompt. An absolute score measures the model; the difference between the arms is the only number that measures what you wrote. It is the same rule the [[harness-engineering-summary]] sensors live by: never believe a result from an instrument you have not seen produce the other value. Skills have been shipped for a year with no such instrument, on the assumption that a rule written down is a rule that helped.

A second split comes out of the same run. Graders marked `with-only` (including `tool_used: Skill`) are reported as a **plugin-fired indicator** and deliberately kept out of the score. So "the skill never triggered" and "the skill triggered and the answer was no better" stop being one blurred failure. They have different fixes: the first is the `description` line and its routing keywords ([[skills-standard]]), the second is the body. Pre-eval, both looked like "the plugin doesn't work".

## Mechanics

`claude plugin eval init` runs an interview: you describe good and bad output and hand it real prompts, it drafts cases and graders, does a trial pass and prices the full run. `--bare` writes a blank `prompt.md` + `graders/criteria.md` instead. Cases live in `evals/` (or the manifest's `experimental.evals`) as `case.yaml`, or `prompt.md` plus `graders/*.md`.

Defaults that matter: 3 runs per case, because graders call a model and the same case scores differently across runs; the judge is **haiku** unless `--judge-model` says otherwise; `--threshold` is 1.0, so any case below it exits 1 and a CI gate is one flag away. `--runs 1` is the cheap dry pass before committing to a full sweep, `--max-cost-usd` is a hard ceiling checked before each run launches, and `-j` runs up to 8 children on your own credential and rate limit. Output is a self-contained HTML report, published as a private artifact when the account supports it.

Trust is not a formality here. The plugin's hooks and MCP servers execute as you: MCP mocks are recorded by default and a server with no mock is simply not started, but `--allow-real-servers` and `--mocks off` start the real ones outside the OS sandbox, and `--scaffold` runs author-supplied bash. The help text says the quiet part itself: a bundled suite passing is not a security vetting.

## What it changes here

[[project-solo-factory]] has 39 skills and zero evidence that any individual one beats the bare model on its own task. The [[agent-mistake-fix-harness]] loop assumes each written rule earned its place; nothing ever checked. The realistic expectation from a first sweep is that several skills come back at delta ≈ 0, and that result is worth more than the skill was, because a rule that changes nothing still costs context on every session that loads it.

Category note: [[deepeval-llm-testing]] scores the *output* of a pipeline as a pytest assertion, and [[agent-benchmarks]] scores the *model* against a fixed task set. Neither answers "is my addition to the harness pulling its weight", which is the question a skill author actually has. [[commerce-agent-blueprint]] arrived at the same place from Anthropic's side: snapshot evals, 50-100 cases per flow, a negative case for every positive one.
