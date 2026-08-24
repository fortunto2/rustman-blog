---
type: concept
title: "DeepSeek Harness — no privileged core, so a patch replaces a fork"
description: "DeepSeek's open-source agent harness makes every part a plugin, including the agent loop. Three ideas worth stealing: model-visible means logged, a seam needs all three roles, and credentials as references rather than values."
created: 2026-08-25
tags: [agents, harness-engineering, plugins, typescript, deepseek, architecture, open-source]
publish: true
source_url: "https://github.com/deepseek-ai/deepseek-harness"
index_line: "dsh (DeepSeek, MIT, TypeScript, 191k stars in 12 days): everything is a plugin on Cordis — model adapter, tool registry, session log, and the agent loop itself. Layers compose bundle → profile patch → home patch → --patch, so extending means mounting beside, never forking. Steal: 'model-visible means logged' as a runtime invariant, seam = Definition+Provider+Consumer or it isn't one, apiKeyEnv as a credential reference resolved per request. headless profile = one-shot runner, no port"
index_section: "concept"
---

# DeepSeek Harness

[dsh](https://github.com/deepseek-ai/deepseek-harness) is DeepSeek's agent harness: MIT, TypeScript, created 13 August 2026 and carrying 191,873 stars twelve days later. It is in declared developer preview and promises compatibility-breaking changes, so the interesting part today is not whether to adopt it but what it argues about harness structure.

The claim is *everything is a plugin*, and unusually the codebase means it literally. The model adapter is a plugin, the tool registry is a plugin, the session log is a plugin, and **the agent loop is a plugin** — `core/agent` owns the interface, `core/agent-loop` is merely the default driver implementing it. There is no privileged core to patch. You extend dsh by mounting a plugin beside the others, and registrations are reversible effects that unwind when their plugin unloads.

Underneath is [Cordis](https://github.com/cordiverse/cordis), where plugins contribute services, typed events and those reversible effects to a shared context.

## Composition by layers, not by fork

A running instance is a plugin tree assembled at boot. A **bundle** distributes config rows plus the code they mount; a **profile** stacks bundles and adds its own patch file. Layers apply in order: each bundle, then the profile's `cordis.patch.yml`, then the home-level one, then any `--patch` overlay. A patch targets a row by id and replaces its config outright, or inserts new rows. `dsh --profile web --dump-config` prints the tree your machine actually boots, and every row it prints is replaceable.

This is the structural answer to the failure recorded in [[agent-mistake-fix-harness]] and in our own `rules/skills.md`: the solo plugin was installed as a *copy*, the copy drifted from the repo, and an agent then updated the wrong truth. A layer that overrides by id cannot fork, because the thing it overrides is still the original and still upgrades under it. Symlinking the plugin cache fixed our instance of the problem; layering dissolves the class.

## Three things worth stealing

**Model-visible means logged.** The session log is an append-only `SessionEvent` stream, and `deriveMessages()` projects the model's history from it. Anything reaching a model request must be reconstructable from that log — and a *runtime invariant asserts it*, so a new model-visible input forces a new session event rather than a quiet side channel. This is [[harness-engineering-summary]]'s rule in its strongest form: not a convention agents are asked to honour, but a check that fails when they don't. Fork, resume, transcripts, telemetry and persistence then come free, because they all derive from one stream.

**A seam needs all three roles.** dsh defines a capability seam as a Service Definition declaring the interface, a Service Provider implementing it, and a Consumer using it — and states that one role alone is not a seam. The payoff is concrete: filesystem and subprocess providers share one execution world, so pointing them at a remote sandbox moves Bash, PTY and LSP together, with no per-provider forks. The test is worth borrowing verbatim when reviewing an abstraction: if you cannot name all three roles, you have an interface, not a seam.

**Credentials are references, not values.** In the `llm-pi-ai` adapter, `apiKeyEnv` names a credential resolved *per request*, so no secret enters the config file at all. Same conclusion we reached independently for DirectorOS in [[claude-subscription-boundary]]'s track — the key belongs in the Keychain with the config holding only a pointer. Two codebases arriving at it separately is the sign it is the default, not a preference.

## Where it is immediately useful

The `headless` bundle is a one-shot runner: `dsh --profile headless "task"` mounts no host, no HTTP server and no browser plugin, opens no listening port, writes the last assistant message to stdout and exits 0 on a completed turn or 1 otherwise. That is the shape a personal agent host wants, and it slots into the same architecture [[background-jobs-ladder]] describes.

The `llm-pi-ai` adapter matters more than its name suggests: a route pi-ai does not ship can be declared outright, so an OpenAI-compatible gateway, a self-hosted server, or a model newer than the installed catalog is *configuration rather than a code change*. In-tree adapters are only `llm-deepseek` and that generic one — there is no Anthropic adapter — but any OpenAI-shaped endpoint is reachable today, including a Cloudflare AI Gateway.

## The honest caveats

Developer preview with breaking changes announced in the README, not hinted at. The star count is twelve days old and measures attention, not adoption — [[hermes-agent]] doubled to 163k in a month and that number told us nothing about whether the loop worked. Skills written for Claude Code do not port: this is a different plugin contract in a different runtime, so [[project-solo-factory]] would be a rewrite, not a move.

And the repository contains its own `CLAUDE.md` and `.claude/`, which is the quiet detail: DeepSeek's harness was built with somebody else's harness.

## Links

- [[claude-code-anatomy]] — the reverse-engineered counterpart, where 98.4% turned out to be operational infrastructure; dsh makes that infrastructure the explicit product surface
- [[harness-engineering-summary]] — "model-visible means logged" is the runtime-invariant version of the principle
- [[agent-toolkit-landscape]] — belongs in the harness row, beside the executable-skills entries
- [[agent-mistake-fix-harness]] — the drift-by-copy failure that layered patches make structurally impossible
- [[claude-subscription-boundary]] — the credential-as-reference rule, reached separately for DirectorOS
- [[background-jobs-ladder]] — where a headless one-shot runner fits in a personal automation stack
