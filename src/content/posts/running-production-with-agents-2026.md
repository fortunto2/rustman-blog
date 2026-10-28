---
type: concept
title: "Running production with agents: make the mistake impossible, not forbidden"
description: "Notes from a Rootly panel in San Francisco on 27 Oct 2026 with PostHog, WorkOS, NVIDIA and Replit: why the bottleneck moved from writing code to judging it, how delegation should follow reversibility, and what a solo builder's harness should take from it."
created: 2026-10-28
event_date: 2026-10-27
tags: [talk, agents, sre, incidents, code-review, harness, security, open-source, sf]
publish: true
publish_as: post
source_url: "https://luma.com/r8sy88tq"
learned_from: "https://luma.com/r8sy88tq, 'Running Production with Agents' panel by Rootly AI, San Francisco, panel attended 27 Oct 2026; a written analysis of the panel's automatic transcript (names and figures in it are approximate)"
index_line: "Post: Rootly panel 'Running Production with Agents', SF, 27 Oct 2026 (Tim Glaser PostHog, Michael Grinich WorkOS, Vishakha Sadhwani NVIDIA, Niall O'Higgins Replit; mod. Sylvain Kalache). Claims: nobody hand-writes IaC since the Opus 4/5 generation; architecture is the last human domain (feedback measured in quarters); agents best at incident investigation (wrong hypothesis is cheap); three reviewers per PR (agent, author rereading generated code, human); anti-patterns: agent-vs-agent review loop ~10 rounds, 10k-line diffs, ceiling 1-2k lines; review the spec not the diff; 'slop cannon' → ask for a PRD; staging sees ~1/1000 of prod traffic, canary on 1% is more honest; delegate by reversibility (one-way vs two-way door); internal tools: deploy target where exposing an app is impossible, an external governor on agent tool calls (deterministic permission graph + natural-language policy, intent-based access), auto-approve only harmless change classes; agents read sales calls; if an agent does not consider you, you do not exist; humans above ~$30-40k ACV; open-core gate small but critical, licences buy support, cloud is most revenue, self-hosters would not have paid. Our gaps: no destructive-command governor (rules are instructions), no diff-size sensor, guards an agent can step around in two moves."
index_section: "concept"
---

# Running production with agents: make the mistake impossible, not forbidden

The panel's central claim was not that agents write code. It was that code stopped being the scarce thing, and the scarce thing is now judgement about it: what to build, what to let through, who answers for it at 3 am. Everything else they said follows from that. The answer each team had found was the same shape, too: when a mistake matters, they did not write a rule against it, they built something where the mistake cannot be made.

Rootly AI ran it in San Francisco on 27 October 2026: Tim Glaser (PostHog), Michael Grinich (WorkOS), Vishakha Sadhwani (NVIDIA) and Niall O'Higgins (Replit), moderated by Sylvain Kalache. I was in the room. These notes come from that and from a written analysis of the automatic transcript, which garbled several product names, so I do not pin internal tools to companies and treat every number as an order of magnitude.

## What was said

**The trust flip in infrastructure code.** A year ago, agent-written infrastructure code got rewritten by hand, so nobody bothered. Since the Opus 4/5 generation it gets accepted, and the panel's estimate of engineers still hand-writing it was zero. The engineer moved from author to arbiter, and the worry moved up a level: from each resource to how the system behaves under load and failure.

**Architecture stays human.** Agents produce designs that sound right. Code is checked in minutes (it builds or it does not); architecture is checked over quarters, as the system degrades, and models are trained on how systems look when presented, not on how they rot. Same reason infrastructure is the moat: how S3 or a large database is actually operated is barely in any training corpus.

**The best use today is incident investigation.** The agent pulls logs, traces, feature flags, code and architecture notes, and gives an explanation you can question: why this service, what changed first, what else is hit. A wrong hypothesis costs nothing, so non-determinism is cheap here. It also levels experience: juniors on call ask the tool what to do, and the panel pushed back on the "no entry for juniors" story.

**Review: three readers, and the loop to avoid.** A PR now gets the agent (catastrophic defects), the author, who actually rereads the code because they did not type it, and a human reviewer. The author became a better reviewer because they read the text, not their memory of the intent. The anti-patterns had numbers: an agent reviewer and an agent author arguing for about ten rounds over a 10,000-line diff, where the fix is decomposition, and a PR ceiling of roughly 1,000 to 2,000 lines. The direction they are moving to is reviewing the spec instead of the diff: the cost of reading a diff grows with generated volume, the cost of reading intent does not.

**The "slop cannon".** Once non-engineers could build, big PRs started landing in the main codebase from people who will never be paged for them. The answer was to change what comes in: an issue or a PRD, which engineers and their agents turn into a change someone owns. Ownership was defined bluntly: can you page them, will they come to the war room.

**Delegate by reversibility.** Application changes roll back; infrastructure changes cascade, break in one place, show up in another, need a fix in a third. So the rule is one-way door versus two-way door: a flagged feature or a fast-rollback change the agent can do alone, a migration or cloud change a human decides. The "may the agent create an index at night" argument was left open on purpose, with the right criterion: can the system detect the degradation and roll it back faster than it gets expensive.

**Staging lies.** It sees about a thousandth of production traffic, so it proves the system starts, not that it holds. A canary on 1% of real traffic, feature flags and automatic rollback on metric deviation are more honest, and they exist today without any intelligence.

**Three control layers, each removing a capability.** One team described three internal tools: a deploy target for the code everyone now writes, where an app cannot accidentally be exposed to the internet because that operation does not exist; a governor between every agent and every company system that intercepts tool calls, with a deterministic permission graph for what must always answer the same way and a natural-language policy judged by a model for what depends on intent ("the agent states why it needs the data, the governor allows or asks"); and a reviewer that auto-approves only narrow, cheap-to-undo change classes and routes migrations and data pipelines to an owner. Claude Code, Cursor or a homegrown agent all pass the same point, so the model and the harness are replaceable and the policy is not. "We couldn't break it" was their own claim, not an audit.

**Go-to-market.** Agents read sales call recordings and "lie less than sales": the CRM says the deal closes this quarter, the transcript has no word about budget. Agents also choose tools now, so if an agent does not have you in its consideration set, you do not exist; documentation became an interface, ideally one an agent can sign up through without a human. People stay in enterprise deals, roughly above $30 to 40k a year.

**Open source.** The open-core gate should be small and critical (permissions, multi-node, support, bring-your-own-cloud), not half the product. Licences really buy round-the-clock support. Cloud turned out to be practically all the revenue, and self-hosters "would not have paid anyway". One enterprise ran a system five engineers built with fifteen operators. The hot take, offered as a guess: if an agent rebuilds a library in hours, open source may stop being a growth strategy by default.

**Horizon, 1 to 2 years.** Self-healing infrastructure (the Postgres that adds its own index), migrations to another cloud or language at the press of a button, products that watch their own usage and change themselves, and mature companies of dozens of people, each with an army of agents.

## What we take

Our harness was built on the same instinct, and the panel is a good audit of where we stopped at an instruction instead of a mechanism.

- **Turn instructions into impossibilities.** We already have the structural kind in places: the upload script refuses big files on a phone hotspot and now checks before every chunk, and video deletion only accepts private videos. But on 26 Oct I walked around that last guard in two commands, setting two unlisted videos to private and then deleting them. The user had agreed, so no harm, but it shows the guard checks a state the agent can change. **Action:** destructive commands take a consent token that only the user's message can produce, not a state the agent can set.
- **We have no governor on shell commands.** Our only PreToolUse hook is the secret guard on edits; "confirm before force-push, deleting branches, `rm -rf`" lives in CLAUDE.md as prose, which is exactly the "policy, not platform" the panel warned about. **Action:** a PreToolUse Bash hook in solo-factory with a small deterministic list (force-push, remote branch delete, `rm -rf` outside the scratchpad, YouTube delete) that refuses without the consent token, and logs every call in one place.
- **Our three reviewers exist, the loop guard does not.** The end-of-turn sensor gate is the agent reviewer, the author rereads, and `/simplify` and `/code-review` add independent readers ([[harness-engineering-summary]]). What we lack is the diff-size ceiling and a stop on agent-vs-agent rounds. **Action:** the limits sensor reports a change above ~1,500 lines as "decompose", and a review skill hands back to the human after three rounds of agent replies on the same finding.
- **Review intent, for real.** `/solo:plan` already writes a spec before `/build`, but nothing checks the build against it. **Action:** the end of `/build` lists each spec success criterion with the test that proves it, and an unmatched criterion is a red receipt.
- **Test on production-shaped input.** The 1/1000 staging point is our synthetic-test problem. The same week a synthetic suite was green while a real 96 kHz panel recording drifted 1.39 s at the outro seam, caught only because the upload gate measured the real file. **Action:** every media pipeline keeps one real-footage case in its gate, not only lavfi fixtures.
- **Incidents: we already do it, solo.** `/solo:diagnose` is the investigator loop (reproduce, rank hypotheses, cheap to be wrong). Worth borrowing the conversational format: a single command that gathers logs, the last commits and the run receipts into one context before asking anything.
- **Be in the agent's consideration set.** For our products this is the open `rustman-agent-ready` topic (6.5/10 on agent-readiness) and the MCP bus in SuperDuper DSP. **Action:** for each product, a page an agent can read and use to start without a human (install, auth, first call), checked with `seo agent-audit`.
- **Open-core arithmetic for us.** SuperDuper DSP is MIT and Life2Film keeps montage free; the panel's math says the money is in what a buyer cannot run without (support, cloud, the operation), which matches how [[project-life2film]] prices: free core, paid for the thing that keeps working. Do not gate features an agent can rebuild in a day.

Where I disagree: "architecture is the last human domain" is true for systems with years of operating history. For a solo builder the cheaper refactor they also described changes the calculus more: a wrong early design costs a weekend now, so the error to avoid is slowness, not imperfection, except at the one-way doors.

## Caveats

This was a panel, not a study. Product claims are the speakers' own, numbers came from an automatic transcript with "roughly" and "about" attached, and the experience is from small, autonomous infrastructure companies, not regulated industries. The principles (delegate by reversibility, keep policy outside the agent, review intent, prefer a mechanism to a rule) hold on their own; the company specifics should be checked before quoting.

Related: [[agent-mistake-fix-harness]] for the ratchet that turns each mistake into a mechanism, [[aaron-levie-agi-house-2026]] for the same month's enterprise view of agents, [[agent-sandboxing]] for running an agent where the damage is bounded.
