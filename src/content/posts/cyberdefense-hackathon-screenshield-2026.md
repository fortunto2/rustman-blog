---
type: concept
title: "ScreenShield: DLP for screen recordings, and what the other 77 projects built"
description: "Cyberdefense Hackathon (tokens&, AWS Builder Loft, San Francisco, 9 Oct 2026): a one-day Rust build that blurs secrets in a live video stream on the device and runs an agent over the archive, 3rd place, plus a read of the 78-project gallery."
created: 2026-10-26
tags: [hackathon, security, dlp, video, ocr, agents, clickhouse, rust]
publish: true
publish_as: post
learned_from: "~/startups/hackathons/2026-10-09-cyberdefense-aws (README.md, SUBMISSION.md, ARCHITECTURE.md, DEMO.md, NOTES.md up to the result, competitors/assessment.md, competitors/projects.md); https://github.com/fortunto2/screenshield; https://tokensand.com/cyberhack/projects"
index_line: "Post: Cyberdefense Hackathon (tokens&, AWS Builder Loft SF, 9 Oct 2026, 78 projects, 11 judges), ScreenShield, solo, 3rd place. Video as an untrusted channel: secrets leak out, QR phishing and agent-aimed instructions come in. Fast loop on device, no LLM: keyframes → Apple Vision OCR/QR → deterministic detectors → taint/destination gates → blur, 0.3-0.8 s/keyframe; venue Wi-Fi slide via iPhone: 22 detections in 20 s. Slow loop: agent audits the archive, vision review (30 confirmed, 1 rejected), rotate_in_repo PR forced by policy (gpt-oss skipped it when left to the prompt). ClickHouse local 6.0M rows, fleet queries 26-34 ms. Judges: make it installable → shield run, Homebrew, Claude Code plugin same evening. Gallery: 29 agent-guard, 14 find-fix-verify, 7 content protection, only one on video; AgentWatch, Sauron, HoneyStack, Breakglass"
index_section: "concept"
---

# ScreenShield: DLP for screen recordings

![Is your screen safe? 40 laptops in the room, every screen readable by any phone camera](/images/posts/cyberdefense-hackathon-screenshield-2026/are-you-safe.jpg)

The Cyberdefense Hackathon ran on Friday 9 October 2026 at the AWS Builder Loft on Market Street in
San Francisco, as part of SF Tech Week, hosted by tokens&. Hacking started at 11:00, projects were due
at 16:30, finalist demos and judging followed at 17:00 and awards at 19:00. There were four tracks
(threat discovery, attack intelligence, autonomous remediation, continuous defense) and eleven judges
from Pi, OpenAI, Guild.ai, AWS, Akash, ClickHouse, Semgrep, Airbyte, FlowiseAI and Visibl. The public
gallery ended with 78 projects. I entered threat discovery plus continuous defense, solo.

## The problem

Every lecture hall, boardroom and webinar records a screen, and screens show API keys, passwords,
grades and email addresses. That is the leak going out. The same frames carry things coming in: QR
codes aimed at viewers and instruction text aimed at the AI agents that now watch camera feeds through
MCP. Nobody watches the recordings for any of it, because a leak is the presenter's mistake and nobody
reports it to the vendor of the capture hardware. The README's opening line came from the room
itself: forty laptops, every screen readable by any phone camera.

## What I built

Two loops at two speeds in one Rust binary, `shield`. Mixing them was my first mistake that day, and
the architecture note from 15:25 says so.

- **Fast loop, on the device, no LLM.** Keyframes, then Apple Vision OCR and QR decoding on the Mac,
  then deterministic detectors (secret formats, personal data, QR phishing checks, instruction text
  aimed at agents), then gates for any agent watching the feed: text seen in a frame is tainted, so a
  tool argument that appeared on screen seconds earlier is blocked, and stream destinations are
  allowlisted. Then blur in the recording. 0.3 to 0.8 seconds per keyframe.
- **Slow loop, the agent, over the archive.** `shield audit` crawls the recordings, calls a vision
  model only where the regexes are blind, decides per policy (redact, revoke, block a destination,
  notify a human, retention, incident) and writes the labelled dataset that the fast loop's eval
  reads. The responder uses sgr-agent tool calling on AkashML (gpt-oss-120b), dry-run by default,
  with a rule-based planner offline.
- **Review.** `shield review` sends every stored finding to a vision model to confirm or reject it,
  and runs OCR on the redacted recording to prove the blur removed the text. On AkashML
  (Qwen3.6-35B-A3B): 3 of 3 confirmed and 3 of 3 blurs verified on the camera recording, 30 confirmed
  and 1 rejected across the archive.
- **A burned key gets rotated in the repo.** The `rotate_in_repo` tool replaces every occurrence with
  a placeholder on a separate branch through a git worktree, lists the burned values in
  `COMPROMISED.md` and opens a pull request ([PR #1](https://github.com/fortunto2/screenshield/pull/1)
  came from the live demo). Policy forces this tool for every secret leak, because gpt-oss skipped it
  when the prompt only asked.
- **Code on stream stays readable.** Code shown on purpose is logged, not blurred; only the credential
  lines inside it are.

Under it: a Python reference implementation that reads the same fixtures and serves as the test
oracle, 41 tests, a Next.js archive dashboard, and ClickHouse run locally with 6.0 million keyframe
rows ingested at about 115,000 rows per second, where the three fleet queries (a secret held on
screen, one QR across 31 rooms, frame text followed by a blocked tool call) answer in 26 to 34 ms.

## Demo and result

The live moment that made the video: an iPhone camera pointed at the venue's own Wi-Fi slide gave 22
detections in 20 seconds, and the password line came out blurred in the recording. On stage, in slot
59, I pitched live from the dashboard's live page. Chrome had blocked the camera for the local
address, so the server-side stream fallback ran instead.

Judges' feedback, given before I went on stage: make it easy for the community to install. The same evening
it got `shield run --in X --out Y` (stream in, stream out, one second behind the input so the blur
lands before a frame leaves, with a three-second hold after the last detection), a Homebrew formula, a
release with an Apple-silicon tarball, and a Claude Code plugin with a skill.

Result: **3rd place**.

## What the other teams built

At 16:40 I scraped the [project gallery](https://tokensand.com/cyberhack/projects) and read it before
my slot: one-liners, tool tags, and the repos and videos where I opened them, so a read of the pitches,
not a code review. Tool tags: ClickHouse 65, Semgrep 54, Guild 39, Akash 38. The clusters:

| Cluster | Projects |
|---|---|
| Guard AI agents at runtime: MCP gateways, tool-call gates, injection containment | 29 |
| Find, fix, verify, open a PR (Semgrep finds, an LLM fixes, ClickHouse logs) | 14 |
| Honeypots, red team, evals | 7 |
| Protect content or people rather than code or agents | 7 |
| Telemetry, SOC, cloud | 6 |
| Other | 10 |

Six more arrived after the first scrape. ScreenShield was the only project working on video or camera
input. The ones I ranked highest:

- [AgentWatch](https://tokensand.com/p/agentwatch): a SOC for AI agents that detects a hijacked agent
  across 20 million events in about a second in ClickHouse, and found a real ClickHouse read-only
  bypass on the way.
- [Sauron](https://tokensand.com/p/sauron): a guard inside the MCP gateway that re-checks every tool
  server on every call and blocks one that turns malicious after it was approved.
- [HoneyStack](https://tokensand.com/p/honeystack): the attacker's reverse shell is an LLM playing bash
  inside a fake company, every command goes to ClickHouse, a second agent writes the evidence.
- [Breakglass](https://tokensand.com/p/breakglass): for the one IT person at a small hospital, it
  applies one pre-approved control when an exploited flaw has no patch, proves patients can still
  book, and rolls itself back. The best answer on boundaries in the room.

Four projects used a decision model like TypeSafe's Jev, and in all four it judged and never acted.

What I took: re-check an MCP tool's definition on every call, not only at approval (Sauron); replay
the archive through new rules before shipping them, the way Security Twin attacks a clone instead of
production; and a "verified, present, inconclusive" status for findings (StackWatch). The read also
named my weakest point: the strong teams quoted ClickHouse numbers and I had none. By about 17:00 a
local ClickHouse was running with the 26 to 34 ms figures, before I went on stage.

## What I took from it

- Keep the model out of the hot path. The loop that has to be fast and right is OCR plus regexes; the
  agent works on the archive, where it can be slow and gets reviewed.
- If a tool call matters, policy makes it, not the prompt.
- Read the gallery before your slot. It named the gap (no ClickHouse numbers) while there was still
  time to close it.
- "Make it installable" was the judges' request, and the Homebrew formula is how the next build
  installed this one's OCR helper thirteen days later.

That reuse: [[superset-hackathon-consentshield-2026]] installs ScreenShield's OCR helper with `brew` and
copies its detectors. The same "brake outside the model" showed up across the eight finalists at
[[dell-nvidia-gb10-hackathon-2026]]. The responder runs on sgr-agent, the agent core behind
[[pac1-competition-retrospective]]. Every event: [[hackathons]].

Links: [repo](https://github.com/fortunto2/screenshield) · [demo video, 94 s](https://youtu.be/8p0dc0lLVjM) ·
[project page](https://tokensand.com/p/screenshield) · related: [[agent-sandboxing]].
