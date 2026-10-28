---
type: concept
title: "Running production with agents: make the mistake impossible, not forbidden"
description: "Notes from a Rootly panel in San Francisco on 27 Oct 2026 with PostHog, WorkOS, NVIDIA and Replit: the bottleneck moved from writing code to judging it, delegation follows reversibility, and how I build a solo harness on the same idea, with an iPhone app as the worked example."
created: 2026-10-28
event_date: 2026-10-27
tags: [talk, agents, sre, incidents, code-review, harness, security, open-source, ios, sf]
publish: true
publish_as: post
source_url: "https://luma.com/r8sy88tq"
learned_from: "https://luma.com/r8sy88tq, 'Running Production with Agents' panel by Rootly AI, San Francisco, panel attended 27 Oct 2026; full analysis of the panel's transcript by ARLI Research, https://arliwork.com/blog/agents-in-production.html (names and figures in the transcript are approximate)"
index_line: "Post: Rootly panel 'Running Production with Agents', SF, 27 Oct 2026 (Tim Glaser PostHog, Michael Grinich WorkOS, Vishakha Sadhwani NVIDIA, Niall O'Higgins Replit; mod. Sylvain Kalache). Claims: nobody hand-writes IaC since Opus 4/5; architecture and infrastructure stay human (feedback in quarters, ops knowledge absent from corpora, agents do not see a leaking abstraction); 'if you can build it in a day it has no durable value'; refactoring got cheap, delay is the expensive error except at one-way doors; hiring wants judgement + fast filtering, juniors gain; non-engineer drives on build days; incident investigation is the best agent use; three reviewers per PR, 1-2k line ceiling, ~10-round agent loops, review the spec; 'slop cannon' → PRD; staging ~1/1000 of prod; one external governor for agent tool calls; agents choose tools, docs must let an agent start without a human; open-core gate small, cloud is the revenue. Includes a diagram of my harness layers (feedforward, agent+MCP, sensors, structural guards, human at one-way doors) and an iOS worked example (ios-swift stack, swiftc -parse, swiftlint, lefthook, OnDeviceSpeechPromiseTests, 1000-line split)."
index_section: "concept"
---

# Running production with agents: make the mistake impossible, not forbidden

The panel's central claim was not that agents write code. It was that code stopped being the scarce thing, and the scarce thing is now judgement about it: what to build, what to let through, who answers for it at 3 am. Each team had landed on the same answer, too: when a mistake matters, they did not write a rule against it, they built a place where the mistake cannot be made.

Rootly AI ran it in San Francisco on 27 October 2026: Tim Glaser (PostHog), Michael Grinich (WorkOS), Vishakha Sadhwani (NVIDIA) and Niall O'Higgins (Replit), moderated by Sylvain Kalache. I was in the room. These notes come from that and from the [full analysis of the panel by ARLI Research](https://arliwork.com/blog/agents-in-production.html), which is worth reading whole. It works from the automatic transcript, which garbled several product names, so I do not pin internal tools to companies and treat every number as an order of magnitude.

## What was said

**The trust flip in infrastructure code.** A year ago agent-written infrastructure code got rewritten by hand, so nobody bothered. Since the Opus 4/5 generation it gets accepted, and the panel's estimate of engineers still hand-writing it was zero. The engineer moved from author to arbiter, and the worry moved up a level, from each resource to how the system behaves under load and failure.

**Architecture and infrastructure stay human, for two different reasons.** Architecture is checked over quarters, as the system degrades, and models learn how systems look when presented, not how they rot. Infrastructure stays human because how S3 or a large database is actually operated is barely in any training corpus; it lives in heads and unpublished postmortems. Their definition of failure was the useful part: infrastructure breaks when the abstraction leaks and you have to think about connection limits or retry timeouts. An agent works through the abstraction, so it does not notice the leak and keeps acting in high-level terms while the damage piles up.

**Cheap production raised the bar for a product.** An idea now gets a prototype during the meeting where it is proposed. The flip side, in their words: if you can build it in a day, it does not have the durable value customers pay for. Volume stopped being a signal; lifespan and retention became the signal.

**Refactoring got cheap, so delay is the expensive error.** The old belief that an early design is nearly impossible to fix no longer holds; a rewrite, even into another language, is affordable. The real currency is how fast you learn, and design review asks "why are we shipping this, who did we talk to" rather than "is the architecture right". The one exception is the irreversible decision, which is the same line that governs delegation below.

**People.** Hiring moved from T-shaped depth to two things: architectural judgement and the speed to absorb and discard text, because models produce more than anyone can read. Juniors gained rather than lost: they can be on call early because they can ask the tool what to do. To get the whole company building, one company embedded AI engineers in sales teams first, then ran a monthly build day where an engineer and a non-engineer pair and the non-engineer drives. When the engineer drives it becomes a demo and the other person concludes it is not for them.

**The best agent use today is incident investigation.** The agent pulls logs, traces, feature flags, code and architecture notes and gives an explanation you can question: why this service, what changed first, what else is hit. A wrong hypothesis costs nothing, so non-determinism is cheap here.

**Review: three readers, and the loop to avoid.** A PR now gets the agent (catastrophic defects), the author, who really rereads the code because they did not type it, and a human reviewer. The anti-patterns came with numbers: an agent reviewer and an agent author arguing for about ten rounds over a 10,000-line diff, and a PR ceiling of roughly 1,000 to 2,000 lines. The direction is reviewing the spec instead of the diff, since the cost of reading a diff grows with generated volume and the cost of reading intent does not.

**The "slop cannon".** Once non-engineers could build, big PRs started landing from people who will never be paged for them. The fix was to change what comes in: an issue or a PRD, which engineers and their agents turn into a change someone owns. Ownership was defined bluntly: can you page them, will they come to the war room.

**Delegate by reversibility.** Application changes roll back; infrastructure changes cascade. So: a flagged feature or a fast-rollback change the agent does alone, a migration or a cloud change a human decides. "May the agent create an index at night" was left open on purpose, with the right test: can the system see the degradation and roll back faster than it gets expensive.

**Staging lies.** It sees about a thousandth of production traffic, so it proves the system starts, not that it holds. A canary on 1% of real traffic, flags and automatic rollback on metric deviation are more honest, and none of them needs intelligence.

**One control layer, each tool removing a capability.** One team described three internal tools: a deploy target where an app cannot be exposed to the internet because the operation does not exist; a governor between every agent and every company system that intercepts tool calls, with a deterministic permission graph for what must always answer the same way and a model-judged policy for what depends on intent (the agent states why it needs the data, the governor allows or asks); and a reviewer that auto-approves only cheap-to-undo change classes and routes migrations to an owner. Claude Code, Cursor or a homegrown agent all pass the same point, so the harness is replaceable and the policy is not.

**Go-to-market.** Agents read sales calls and "lie less than sales": the CRM says the deal closes this quarter, the transcript has no word about budget. Agents also pick the tools now, so if you are not in an agent's consideration set you do not exist. Being found is not enough: the docs have to let an agent get access, authenticate and make its first call without a human. People stay in enterprise deals above roughly $30 to 40k a year.

**Open source.** Keep the open-core gate small and critical (permissions, multi-node, support, bring-your-own-cloud). Licences really buy support. Cloud was practically all the revenue, and self-hosters would not have paid anyway. The hot take, offered as a guess: if an agent rebuilds a library in hours, open source may stop being a growth strategy by default.

**Horizon, 1 to 2 years.** Self-healing infrastructure (the database that adds its own index), migration to another cloud or language at the press of a button, and companies of dozens of people, each with an army of agents.

## What I take from it

Most of this I already run as one person; the panel is a good audit of where I stopped at an instruction instead of a mechanism.

- **Guards must check something the agent cannot set.** My video delete accepts only private videos, and this week I got past it in two commands: set to private, then delete. The user had agreed, but the guard checked a state the agent controls. Fix: destructive commands take consent from the user's message, not from state.
- **No governor on shell commands yet.** "Confirm before force-push, branch delete, `rm -rf`" lives in CLAUDE.md as prose, which is the policy-instead-of-platform the panel warned about. Fix: one PreToolUse hook with a short deterministic list and one log.
- **Review loop and size.** I have the three readers ([[harness-engineering-summary]]); I lack the 1,500-line "decompose" flag and a hand-back to the human after three agent rounds on one finding.
- **Review intent.** `/solo:plan` writes the spec, nothing checks the build against it. Fix: `/build` ends by mapping each success criterion to the test that proves it.
- **Synthetic tests are my staging.** A green synthetic suite missed a 96 kHz recording that broke at the outro seam; only the gate that measured the real file caught it. Fix: one real-footage case in every media gate.
- **Be startable by an agent.** For my products that is a page an agent can install, authenticate and call from, checked with `seo agent-audit`.

One disagreement. For a solo builder, "architecture is the last human domain" matters less than "refactoring got cheap": a wrong early design costs a weekend, so the error to avoid is slowness, except at the one-way doors.

## How I build the harness

Five layers, from what the agent reads before it acts to the one step that stays mine. Each box names the real files.

<svg viewBox="0 0 360 600" role="img" aria-label="Harness layers: feedforward, agent with MCP, sensors, structural guards, human at one-way doors, with a feedback loop from mistakes back to the rules" style="width:100%;max-width:640px;height:auto;display:block;margin:1.5em auto;font-family:ui-sans-serif,system-ui,sans-serif" fill="none" stroke="currentColor">
<defs><marker id="hx-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="currentColor" stroke="none"/></marker></defs>
<g stroke-width="1.2">
<rect x="8" y="8" width="296" height="96" rx="8"/>
<rect x="8" y="128" width="296" height="96" rx="8"/>
<rect x="8" y="248" width="296" height="110" rx="8"/>
<rect x="8" y="382" width="296" height="96" rx="8"/>
<rect x="8" y="502" width="296" height="90" rx="8" stroke="#2563eb" stroke-width="2"/>
<path d="M156 104 V126 M156 224 V246 M156 358 V380 M156 478 V500" marker-end="url(#hx-arrow)"/>
<path d="M304 300 H336 V56 H308" stroke-dasharray="4 3" marker-end="url(#hx-arrow)"/>
</g>
<g fill="currentColor" stroke="none" font-size="11">
<text x="20" y="30" font-size="13" font-weight="700">1 · Feedforward: what it reads first</text>
<text x="20" y="50">CLAUDE.md (global → workspace → project)</text>
<text x="20" y="66">rules/*.md · solo-factory skills (solo:*)</text>
<text x="20" y="82">stack templates: stacks/ios-swift.yaml</text>
<text x="20" y="98">wiki first: my measured notes before the web</text>
<text x="20" y="150" font-size="13" font-weight="700">2 · The agent acts, with context tools</text>
<text x="20" y="170">Claude Code, subagents for side work</text>
<text x="20" y="186">MCP solograph: KB, code graph, past sessions</text>
<text x="20" y="202">MCP searxng (search, extract), xcodebuild</text>
<text x="20" y="218">long runs keep the task list in a file</text>
<text x="20" y="270" font-size="13" font-weight="700">3 · Sensors: observe after it acts</text>
<text x="20" y="290">every edit: syntax only, &lt;1 s</text>
<text x="20" y="306">end of turn: solo-verify --full, lint, types,</text>
<text x="20" y="322">tests; a red receipt blocks the turn</text>
<text x="20" y="338">commit: pre-commit · push: pre-push suite</text>
<text x="20" y="354" fill="#737373">green = checks passed, never "correct"</text>
<text x="20" y="404" font-size="13" font-weight="700">4 · Structural guards in the tools</text>
<text x="20" y="424">the tool refuses, no instruction needed:</text>
<text x="20" y="440">upload refuses big files on a phone hotspot,</text>
<text x="20" y="456">a broken audio clock, a film without outro;</text>
<text x="20" y="472">limits: function &gt;150, module &gt;1000 lines</text>
<text x="20" y="524" font-size="13" font-weight="700" fill="#2563eb">5 · Me, only at one-way doors</text>
<text x="20" y="544">publish, delete, force-push, money,</text>
<text x="20" y="560">anything outward or irreversible;</text>
<text x="20" y="576">everything else: the agent decides, logs why</text>
<text x="344" y="190" font-size="10" transform="rotate(90 344 190)" text-anchor="middle">mistake → fix the harness, not the prompt</text>
</g>
</svg>

The dashed loop is the part that compounds. When the agent gets something wrong, the fix goes into the cheapest layer that would have stopped it: a line in CLAUDE.md, then a lint rule, then a structural refusal ([[agent-mistake-fix-harness]]). This week's examples: the outro join that silently re-encoded became a test that fails on a re-encode, and the upload that ran over the phone's data became a refusal before every chunk.

The sensors keep me honest about what they prove. They live in `solo-factory/rules/harness-sensors.md` with a published promise per sensor, and on 24 planted defects they caught 11. A green receipt says lint, types and tests passed, nothing more. That is why layer 4 exists: the expensive mistakes get a refusal inside the tool, not a hope that a test notices.

## Worked example: an iPhone app

What the same five layers look like on a Swift project, using my `ios-swift` stack.

1. **Feedforward.** The stack file prescribes Swift 6 and SwiftUI, `@Observable @MainActor` view models, actors for ML services, a protocol per service for test doubles, SwiftData, XcodeGen with the `.xcodeproj` never committed, String Catalogs, StoreKit 2, my own usage counter (SuperDuperAnalytics) and no third-party crash SDK. Skills: `solo:ios-dev`, `solo:ios-release` (the `asc` CLI for TestFlight), `solo:swiftui-design-system`. On SwiftUI questions Apple's own Xcode skills are read before mine. The stack's code patterns were mined from my other apps through the solograph code graph.
2. **The agent acts.** XcodeBuildMCP builds and tests on the simulator, takes screenshots and UI snapshots, so "it works" is something the agent looked at.
3. **Sensors.** An edit runs `swiftc -parse` on that one file (about 0.15 s). The end of the turn runs SwiftLint with its violation count and exit code honoured, plus the size limits. A commit runs lefthook with SwiftLint and swift-format. Mutation testing with `muter` checks that the tests catch anything, with the known gap that it cannot mutate most SwiftUI view bodies.
4. **Structural guards.** In Life2Film Studio the permission sheet promises on-device speech recognition, in 36 languages. `OnDeviceSpeechPromiseTests` reads both the prompt and the code and fails the build if `requiresOnDeviceRecognition` is ever set conditionally; it was written after that line turned out to sit behind a dead `#available` check. The module limit did its job this week too: `iOSNativeExecutor+AVFoundation.swift` was at 1,168 lines, the guard refused growth, so the new passthrough concat went into its own `iOSNativeExecutor+Concat.swift`.
5. **Me.** Submitting to the App Store, the App Privacy answers and anything that touches a real user stay with me. A TestFlight build is a two-way door and goes without asking.

## Caveats

This was a panel, not a study. Product claims are the speakers' own, numbers came from an automatic transcript with "roughly" attached, and the experience is from small, autonomous infrastructure companies, not regulated industries. The principles (delegate by reversibility, keep policy outside the agent, review intent, prefer a mechanism to a rule) hold on their own; check the company specifics before quoting them.

Related: [[agent-sandboxing]] for running an agent where the damage is bounded, [[aaron-levie-agi-house-2026]] for the same month's enterprise view.
