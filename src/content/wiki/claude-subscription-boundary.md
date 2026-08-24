---
type: concept
title: "Claude subscription is not a developer credential"
description: "Where the Max plan stops being usable as infrastructure: your own scripts are allowed, third-party logins and multi-user backends are not. Plus the two-layer architecture personal automations end up with."
created: 2026-08-23
tags: [agents, auth, anthropic, claude-code, infrastructure, byok, automation]
publish: true
index_line: "Max $200 buys usage rights to Claude Code + claude.ai, not an API credential. setup-token for own scripts = documented; claude.ai login in your product = banned since Feb 2026. Agent SDK credit ($20/$100/$200) announced May 13, killed June 15. Personal automations: one agent host + per-project CF Workers"
index_section: "concept"
---

# Claude subscription is not a developer credential

A $200 Max plan looks like an inference budget you already paid for. It isn't. It's usage rights to two products — Claude Code and claude.ai — and Anthropic spent the first half of 2026 making that boundary explicit and then enforcing it.

The tempting inversion of [[codex-oauth-proxy]] does not transfer. On the OpenAI side we route agents through a ChatGPT subscription via OAuth and it works; the same trick against Anthropic is what got OpenCode to strip subscription-key support after legal requests, and OpenClaw blocked outright. Anthropic also worked specifically against tools spoofing the Claude Code harness — the stated reason being "token arbitrage" plus traffic with none of the telemetry the real harness emits. Account bans started January 2026, the terms clarification landed 20 February 2026, and on 4 April 2026 billing enforcement switched on — third-party traffic stopped drawing from subscription quotas at all, so the workaround now fails on the meter rather than on the letter of the terms.

## The line, stated once

**Allowed:** `claude setup-token` mints a one-year OAuth token (`sk-ant-oat01-…`), you export it as `CLAUDE_CODE_OAUTH_TOKEN`, and CI pipelines, cron jobs and headless scripts run on your subscription. This is in the official docs, not a workaround. Two constraints worth knowing: the token can only make model requests (no Remote Control, no claude.ai connectors — local MCP still works), and `--bare` mode ignores the variable entirely, so bare scripts need an API key.

**Not allowed:** offering claude.ai login inside your own product. The Agent SDK docs say it plainly — *"Unless previously approved, Anthropic does not allow third party developers to offer claude.ai login or rate limits for their products, including agents built on the Claude Agent SDK."* This holds even when every user brings their own subscription and pays for it themselves; the restriction binds the developer, not the user. Commercial Terms add the other half: you may not pay for, resell, or intermediate Claude usage on behalf of end users.

The distinguishing question is not who pays. It's whether anyone other than you sits behind the credential.

"Unless previously approved" is a real door — partner approval exists and goes through Anthropic sales. It's the only legitimate path to subscription login in a product, and it's slow.

## The credit that didn't happen

Announced May 13, 2026: programmatic usage (Agent SDK, `claude -p`, GitHub Actions, third-party apps) would leave the subscription rate-limit pool and move onto a separate monthly credit metered at API list prices — $20 for Pro, $100 for Max 5x, $200 for Max 20x. Community arithmetic put the effective increase at 12x–175x depending on workload; a class action followed. Anthropic paused it on June 15, the day it was to take effect, with no replacement timeline.

Consequence that still matters in August 2026: **programmatic usage eats the same pool as interactive work.** One subscription, one set of limits, weekly caps included. Any automation you build competes with the sessions you're typing in.

## What personal automations actually look like

Cloudflare Workers cannot run this. Workers are V8 isolates and `claude -p` is a Node process needing a filesystem; the Agent SDK is no escape because it spawns that same CLI underneath. [[cloudflare-computer-agent-runtime]] is the interesting counter-move — a durable SQLite filesystem where compute attaches, container only when Linux binaries are genuinely needed — but a plain Worker is not that.

So the architecture splits, and the "one or many?" question resolves differently per layer:

**One inference host.** A €4 VPS or an always-on Mac mini. Single copy of the OAuth token, single `~/.claude` with skills and MCP servers, thin HTTP surface. It has to be one because the rate-limit pool is one — a ticket crawler that burns the weekly cap at 3am silently kills the Telegram tutor bot at 9am. A centralized queue with priorities is the only place that contention becomes visible. Long-lived connections live here too: MTProto sessions for watching Telegram channels can't exist in a Worker at all.

**Per-project trigger Workers.** Telegram webhooks, Cron Triggers, state in KV/D1 — one Worker per project, independent deploys, separate secrets, blast radius of one. Free to 100k requests/day. This is the [[background-jobs-ladder]] rule applied honestly: cron first, higher rungs only when something actually demands them.

Cost discipline follows from the shared pool: cheap prefilters before expensive calls. A regex or embedding pass drops 95% of Telegram messages; the model sees the remainder. Tool calling comes free with `claude -p` — plus MCP servers and skills — so there's nothing to rebuild versus raw function calling.

## For products, BYOK on API keys

For anything with users — [[project-life2film]] being the live case — the shape is: each user pastes their own Anthropic API key from the Console, stored in the device Keychain, calls going straight to the API and never through your server. Legal, no ambiguity, and the cost sits with the user. The honest downside is conversion: ordinary people don't create Console keys. The alternative is your own key on your own backend with usage priced into the product, which is a normal commercial arrangement and the thing the Commercial Terms actually contemplate.

If the reason to want a subscription was avoiding token spend, [[llm-providers-credits]] is the cheaper answer than risking the account — open models at $17–30 per 100M tokens make the whole question smaller than it looks.

## Links

- [[codex-oauth-proxy]] — the same pattern against OpenAI, where it is viable; read together, the pair shows this is a vendor policy choice, not a technical one
- [[background-jobs-ladder]] — supplies the trigger layer this page's architecture sits on
- [[cloudflare-computer-agent-runtime]] — why an isolate can't host the agent, and what a serious edge answer would need
- [[llm-providers-credits]] — the alternative when the motive was cost rather than convenience
- [[project-life2film]] — the app where the BYOK-vs-subscription decision came up concretely
