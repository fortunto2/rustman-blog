---
type: concept
title: "Cal Hacks 13.0: what the most technical teams built, and what is worth stealing"
description: "Judging at Cal Hacks 13.0 (UC Berkeley, 25 Oct 2026): Sergey Levine's keynote on robot data, the projects I judged for technical complexity, and ten engineering patterns from their repos."
created: 2026-10-25
tags: [hackathon, berkeley, robotics, voice, on-device, agents, evals]
publish: true
publish_as: post
learned_from: "Cal Hacks 13.0, 25 Oct 2026: judging at tables and in the final round, Sergey Levine's keynote and the closing ceremony recorded with supervox, Devpost pages, read-only pass over 8 GitHub repos"
index_line: "Post: Cal Hacks 13.0 (Berkeley, 652 projects). Levine keynote: more robot data makes human video usable, robot CoT, 13 h espresso. Projects: BrainSync (SSVEP EEG → speech), Handoff (hand over WebRTC + SAM 3D twin), Vigil (personal baselines, 903 → 22 alarms), RealiSIM (video → sim, provenance labels), muselet (on-device voice agent, speculative partials, single-token router), Fermata (agents propose, backtest admits), Pooltune, Hypercompute (Iroh). Patterns + observations: Wi-Fi killed live demos, hardware won the room"
index_section: "concept"
---

# Cal Hacks 13.0: what the most technical teams built, and what is worth stealing

On 25 October I judged at Cal Hacks 13.0 at UC Berkeley, in the Technical Complexity category: a
morning of five-minute table visits, then a final round with the shortlist. 652 projects went up on
Devpost. I recorded the keynote and the closing ceremony with [[project-supervox]] and afterwards
read eight of the repos line by line. Stage quotes are paraphrases of rough speech-to-text; numbers
come from the teams' own READMEs and name their setup, nothing here was re-measured.

## The keynote: Sergey Levine, Physical Intelligence

Levine opened with Moravec's paradox: the skills that are easy for us are exactly the ones nobody
ever wrote down, so there is no text corpus for folding laundry. Web video gives knowledge, but
watching tennis on TV does not make you a tennis player.

The finding he called the most surprising of the last two years: **the more robot data you have, the
easier it gets to use everything else**, including video of people. A robot foundation model maps
observations plus language to actions; pooled data from many labs (Open X-Embodiment) produced a
generalist that beat the specialists. With little robot data, the embeddings of a human doing a task
and a robot doing it sit far apart. As robot data grows they converge, and the model starts encoding
*the task* rather than *who is doing it*. Demo: a person with a head camera shows a task, the robot
repeats it with the same model ([pi.website/research/human_to_robot](https://www.pi.website/research/human_to_robot)).

Two more ideas I wrote down:

- **Chain of thought for robots.** The model produces intermediate text "thoughts", and a person
  corrects the thoughts instead of the motions. A robot learned an air fryer (sweet potatoes) from a
  verbal explanation. There is also a visual version, where the model draws the next step.
- **Learning from its own attempts.** A policy plus a value function, then RL on autonomous
  experience. The proof slide: a robot making espresso for 13 hours straight.

In the Q&A he named semi-structured work like warehousing as the near-term opening, and on safety
said that robots today are "not smart enough" to be the worry; the job is to make foundation models
controllable in what they are allowed to do.

My takeaway: egocentric human video becomes training data once a base of robot data exists. That is
the same bet as everything I do with personal video in [[project-life2film]].

## What the teams built

**BrainSync.** A brain-computer interface for people who cannot speak, inspired by a team member's
grandmother with Parkinson's. Squares flicker at 11 to 17 Hz, an 8-channel dry EEG headset picks up
the frequency the user is looking at, and a training-free decoder chooses. Claude writes three reply
options in the user's voice; a second look confirms and Cartesia speaks it. The decoder commits only
after four consecutive windows agree, and "abstain" counts as a vote, so silence never commits. The
README has an "Honest claim" table with pre-registered accuracy gates and unmeasured cells left TBD.

**Handoff.** Remote help where the helper's tracked hand appears inside the other person's video call.
Every few seconds a frame goes to Claude to find the key objects, Meta's SAM 3D turns one into a 3D
twin with physics, and the helper can grab it and take it apart. Engineering details I liked: at most
one frame in flight, a slow frame is dropped and never queued; the hand travels as a 262-byte binary
frame at 30 Hz over an unordered WebRTC channel; a session is saved as an event log (two minutes ≈ 2
MB) instead of video, so it replays as a lesson.

**Vigil.** Overnight monitoring for nursing homes, where one worker covers 15 or 16 residents. A
wristband and an iPhone under the pillow as a bed sensor, live in the final round: get out of bed and
the resident jumps to the top of the "check next" queue with reasons from the chart. The clever part is
alarm fatigue: each metric is scored against the resident's own normal for that 4-hour block of the
day, with hysteresis, persistence and suppression after acknowledgement. Their replay: 903
fixed-threshold alarms against 22. On TimescaleDB, a 7-day hourly query went from 5,158 ms on raw
rows to 214 ms on a continuous aggregate.

**RealiSIM** (won Most Technically Advanced). Video of a real object in, simulation assets out, with a
robot arm mirroring the simulation live at the table. The pipeline is staged and resumable, with a
review pause, and every physical value carries a label: Measured, Supplied, Estimated or Unknown. A
dimension found on the web that is more than 25% off the scan is dropped; model output never quietly
overrides a measurement.

**muselet.** An on-device voice agent for the Mac. While the key is held it re-transcribes the
buffer every 450 ms and starts routing the request speculatively; the final reuses that work if the
text did not change. The router is not generation at all: one forward pass over single-token choice
ids on a cached prompt, softmax over their logits, about 60 ms p50 on a 4-bit 4B model in MLX, and
"ask" when the top probability is under a threshold fitted on validation. Their testing postmortem is
the best document I read all weekend: seven failures in the user's first ten minutes despite about
2,000 passing tests, because the fakes returned ok for anything.

**Fermata.** Month-end close for a family retail business in Indonesia with 15 branches, where about
20 people reconcile by hand. Known cases go through a deterministic rule engine. An unknown case goes
to a "case room": an investigator agent proposes a rule, an auditor agent attacks it, the rule is
backtested on years of real history, and the CFO approves it. Agents propose, code decides, a
backtest admits.

**Pooltune.** Database connection pools are static, so a traffic spike queues queries for 30 to 60
seconds. A Go control layer over PgBouncer, Supavisor and the cloud poolers resizes the pool once a
second, adapting Netflix's open-source concurrency-limits gradient, and keeps warm connections
standing by.

**Also worth a look:** Hypercompute pools LLM inference across laptops over Iroh QUIC and honestly
reports that pooling *slows* decoding (0.83x) when one machine already holds the model. Signal Bridge
merges NWS alerts, FEMA shelters and scraped county pages into an emergency assistant with a voice
mode and a 50-mile offline map. Overflow puts an escrow contract under agent purchases: data is hashed
in chunks and payment is released only when the hashes match.

## Patterns I am taking home

1. **Speculate on partial transcripts**, cancel on newer input, reuse on match.
2. **Classify with one forward pass over choice tokens**, and abstain under a fitted threshold.
3. **Score against a personal baseline**, not a fixed limit, and budget alarms explicitly.
4. **Pre-register the gate** before you look at the result, and print the trivial baseline next to it.
5. **Agents propose, code decides, a backtest admits.**
6. **One frame in flight**: drop, never queue, in any real-time loop.
7. **Label provenance per value**: measured, supplied, estimated, unknown.
8. **A user report becomes a replay case** that fails on main before the fix.

## What the day looked like from the judge's side

- **Venue Wi-Fi killed most live demos.** Most teams showed a recorded video. The few who ran live
  hardware (a robot arm, a bed sensor, an EEG headset) owned the room, and that weighed heavily in
  deliberation.
- **Coding agents are now the default teammate.** AGENTS.md and CLAUDE.md in most repos,
  phase-numbered commits from written specs, tens of thousands of lines in 36 hours. The questions
  that separated teams were no longer "did you build it" but "what did you measure" and "what is
  yours".
- **Claude plus Cartesia was the default voice stack**, and Snowflake, Tiger Data and Convex showed up
  wherever a sponsor prize did.

Related: [[stanford-cleantech-hackathon-2026]] (the day before), [[link-radar]].
