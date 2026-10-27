---
type: concept
title: "ScreenShield: DLP for screen recordings, and what the other 77 projects built"
description: "Cyberdefense Hackathon (tokens&, AWS Builder Loft, San Francisco, 9 Oct 2026): a one-day Rust build that blurs secrets in a live video stream took 3rd of 78 as the only video project, and two of its pitched mechanisms turned out weaker than the slides."
created: 2026-10-26
event_date: 2026-10-09
github: fortunto2/screenshield
video_url: "https://youtu.be/qZVPiqBWxJg"
tags: [hackathon, security, dlp, video, ocr, agents, clickhouse, rust]
publish: true
publish_as: post
learned_from: "~/startups/hackathons/2026-10-09-cyberdefense-aws (README.md, SUBMISSION.md, ARCHITECTURE.md, DEMO.md, NOTES.md up to the result, REVIEW-TODO.md, competitors/assessment.md, competitors/projects.md); https://github.com/fortunto2/screenshield (shield-rs/src re-read 26 Oct); https://tokensand.com/cyberhack/projects"
index_line: "Post: Cyberdefense Hackathon (tokens&, AWS Builder Loft SF, 9 Oct 2026, 78 projects, 11 judges), ScreenShield, solo, 3rd place, with a self-critique. Only video project: 29 agent-guard, 14 find-fix-verify, 7 content protection. Fast loop on device, no LLM: keyframes → Apple Vision OCR/QR → deterministic detectors → blur, 0.3-0.8 s/keyframe; venue Wi-Fi slide via iPhone: 22 detections in 20 s. Slow loop: agent audits the archive, vision review (30 confirmed, 1 rejected), rotate_in_repo PR forced by policy (gpt-oss skipped it when left to the prompt). Weak: taint gate unit-tested but never called by scan or responder (tainted=0); ClickHouse figures (26-34 ms) over 6.0M synthetic rows, match_hash=0; revoke is dry-run; blur hold trails a panning camera. Judges: make it installable → shield run, Homebrew, Claude Code plugin same evening. Gallery: AgentWatch, Sauron, HoneyStack, Breakglass"
index_section: "concept"
---

# ScreenShield: DLP for screen recordings

![Is your screen safe? 40 laptops in the room, every screen readable by any phone camera](/images/posts/cyberdefense-hackathon-screenshield-2026/are-you-safe.jpg)

ScreenShield took 3rd place out of 78 projects as the only one that treated video as an attack
channel, and its best moment was unscripted: an iPhone pointed at the venue's own Wi-Fi slide gave 22
detections in 20 seconds and a blurred password. Two of the mechanisms I pitched are weaker than the
slides. The gate that blocks a tool call copied from the screen is unit-tested but never wired into a
running path, and the ClickHouse figures were measured on 6 million synthetic rows.

## The short version

- **Video was an empty lane.** 29 of the 78 projects guarded AI agents at runtime and 14 ran find, fix,
  verify, open a PR. Nobody else read screens or cameras.
- **Keep the model out of the hot path.** OCR plus regexes blur on the device in 0.3 to 0.8 seconds per
  keyframe; the agent works on the archive, where it can be slow and gets reviewed.
- **If a tool call matters, policy makes it.** gpt-oss skipped `rotate_in_repo` when the prompt only
  asked, so policy forces it for every secret leak.
- **Reading the gallery before my slot found my gap.** The strong teams quoted ClickHouse numbers and I
  had none. I added some for the demo, on synthetic data.

## The event

The Cyberdefense Hackathon ran on Friday 9 October 2026 at the AWS Builder Loft on Market Street in
San Francisco, as part of SF Tech Week, hosted by tokens&. Hacking started at 11:00, projects were due
at 16:30, finalist demos and judging followed at 17:00 and awards at 19:00. There were four tracks
(threat discovery, attack intelligence, autonomous remediation, continuous defense) and eleven judges
from Pi, OpenAI, Guild.ai, AWS, Akash, ClickHouse, Semgrep, Airbyte, FlowiseAI and Visibl. I entered
threat discovery plus continuous defense, solo.

Every lecture hall, boardroom and webinar records a screen, and screens show API keys, passwords,
grades and email addresses. That is the leak going out. The same frames carry things coming in: QR
codes aimed at viewers and instruction text aimed at the AI agents that now watch camera feeds through
MCP. Nobody watches the recordings for any of it, because a leak is the presenter's mistake and nobody
reports it to the vendor of the capture hardware.

## What I built

Two loops at two speeds in one Rust binary, `shield`. Mixing them was my first mistake that day, and
the architecture note from 15:25 says so.

- **Fast loop, on the device, no LLM.** Keyframes, then Apple Vision OCR and QR decoding on the Mac,
  then deterministic detectors (secret formats, personal data, QR phishing checks, instruction text
  aimed at agents), then blur in the recording. 0.3 to 0.8 seconds per keyframe. A taint gate for
  agents watching the feed (a tool argument seen on screen seconds earlier is blocked, destinations
  are allowlisted) is built and tested, but not wired in; see below.
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
  came from the live demo).
- **Code on stream stays readable.** Code shown on purpose is logged, not blurred; only the credential
  lines inside it are.

Under it: a Python reference implementation that reads the same fixtures and serves as the test
oracle, 41 tests, a Next.js archive dashboard, and ClickHouse run locally with 6.0 million synthetic
keyframe rows ingested at about 115,000 rows per second, where the three fleet queries (a secret held
on screen, one QR across 31 rooms, frame text followed by a blocked tool call) answer in 26 to 34 ms.

## Where it is weak

- **The taint gate is not wired in.** `guard.rs` implements it and its tests pass, but the scan loop
  never asks it about a tool call, and the responder checks only `block_destination` and logs
  `tainted: 0` on every call. A reviewer agent flagged this before the demo; it is still open.
- **The ClickHouse numbers are thin.** They were measured over generated rows; the real archive was 6 recordings with 55 findings. `match_hash` is written as 0,
  so "secret held on screen" cannot tell one secret from another in a room.
- **Rotation is half a fix.** The repo gets a placeholder and a PR, but revoking the key at the
  provider is a dry-run, so the burned key works until someone revokes it by hand.
- **The blur trails a moving camera.** The three-second hold keeps a box where the text was, so a
  panning camera outruns it.

## Demo and result

<iframe src="https://www.youtube-nocookie.com/embed/qZVPiqBWxJg" title="3rd place at a San Francisco cyberdefense hackathon: Screen Shield, SF Tech Week" style="width:100%;aspect-ratio:16/9;border:0;border-radius:8px;margin:1.5rem 0" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

The day in 8:31: [what I built](https://youtu.be/qZVPiqBWxJg?t=43) · [other finalists](https://youtu.be/qZVPiqBWxJg?t=171) · [my pitch](https://youtu.be/qZVPiqBWxJg?t=193) · [judges' questions](https://youtu.be/qZVPiqBWxJg?t=323) · [prizes](https://youtu.be/qZVPiqBWxJg?t=389).

The Wi-Fi slide scene made the video. On stage, in slot 59, I pitched live from the dashboard's live
page; Chrome had blocked the camera for the local address, so the server-side stream fallback ran.

Judges' feedback, given before I went on stage: make it easy for the community to install. The same
evening it got `shield run --in X --out Y` (stream in, stream out, one second behind the input so the
blur lands before a frame leaves, with a three-second hold after the last detection), a Homebrew
formula, a release with an Apple-silicon tarball, and a Claude Code plugin with a skill.

Result: **3rd place overall**, $400 from the top-overall prizes ([announced at 7:36](https://youtu.be/qZVPiqBWxJg?t=456)).

## What the other teams built

Tool tags across the gallery: ClickHouse 65, Semgrep 54, Guild 39, Akash 38. The clusters:

| Cluster | Projects |
|---|---|
| Guard AI agents at runtime: MCP gateways, tool-call gates, injection containment | 29 |
| Find, fix, verify, open a PR (Semgrep finds, an LLM fixes, ClickHouse logs) | 14 |
| Honeypots, red team, evals | 7 |
| Protect content or people rather than code or agents | 7 |
| Telemetry, SOC, cloud | 6 |
| Other | 10 |

Most of the field built one of two shapes. The ones I ranked highest, judged on the pitch and its
stated evidence:

- [AgentWatch](https://tokensand.com/p/agentwatch): a SOC for AI agents that detects a hijacked agent
  across 20 million events in about a second in ClickHouse, and found a real ClickHouse read-only
  bypass on the way. A number and a real bug, the two things a judge can check.
- [Sauron](https://tokensand.com/p/sauron): a guard inside the MCP gateway that re-checks every tool
  server on every call and blocks one that turns malicious after it was approved. Narrow and reusable.
- [HoneyStack](https://tokensand.com/p/honeystack): the attacker's reverse shell is an LLM playing bash
  inside a fake company, every command goes to ClickHouse, a second agent writes the evidence. The most
  original attack-intelligence idea in the room.
- [Breakglass](https://tokensand.com/p/breakglass): for the one IT person at a small hospital, it
  applies one pre-approved control when an exploited flaw has no patch, proves patients can still
  book, and rolls itself back. The best answer on boundaries in the room.

Four projects used a decision model like TypeSafe's Jev, and in all four it judged and never acted.

What I took: re-check an MCP tool's definition on every call, not only at approval (Sauron); replay
the archive through new rules before shipping them, the way Security Twin attacks a clone instead of
production; and a "verified, present, inconclusive" status for findings (StackWatch).

## What I took from it

- A gate that passes its unit tests is not a gate until a production path calls it. Test the wiring.
- Numbers measured in the last half hour on generated data are a patch, not a result.
- "Make it installable" was the judges' request, and the Homebrew formula is how the next build
  installed this one's OCR helper thirteen days later.

## How this was put together

Written from my notes of the day (up to the result), the submission and architecture docs, the
reviewer agent's list of open issues, and the public repo's code, re-read on 26 October. At 16:40 I
scraped the [project gallery](https://tokensand.com/cyberhack/projects) and read one-liners, tool
tags, and the repos and videos where I opened them, so the section on other teams is a read of the
pitches, not a code review. Six more projects arrived after that scrape, for 78 in the end.

That reuse: [[superset-hackathon-consentshield-2026]] installs ScreenShield's OCR helper with `brew` and
copies its detectors. The same "brake outside the model" showed up across the eight finalists at
[[dell-nvidia-gb10-hackathon-2026]]. The responder runs on sgr-agent, the agent core behind
[[pac1-competition-retrospective]]. Every event: [[hackathons]].

Links: [repo](https://github.com/fortunto2/screenshield) · [film of the day, 8:31](https://youtu.be/qZVPiqBWxJg) · [demo video, 94 s](https://youtu.be/8p0dc0lLVjM) ·
[project page](https://tokensand.com/p/screenshield) · related: [[agent-sandboxing]].
