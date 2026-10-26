---
type: concept
title: "Cal Hacks 13.0: what the most technical teams built, and what is worth stealing"
description: "Judging at Cal Hacks 13.0 (UC Berkeley, 25 Oct 2026): Sergey Levine's keynote on robot data, the stack 13 projects ran on, and thirteen engineering patterns from their repos with the thresholds and files behind them."
created: 2026-10-25
tags: [hackathon, berkeley, robotics, voice, on-device, agents, evals]
publish: true
publish_as: post
learned_from: "Cal Hacks 13.0, 25 Oct 2026: judging at tables and in the final round, Sergey Levine's keynote and the closing ceremony recorded with supervox, Devpost pages, read-only pass over 13 GitHub repos (numbers re-checked against the repos on 26 Oct)"
index_line: "Post: Cal Hacks 13.0 (Berkeley, 652 projects, Devpost window Thu 18:00 to Sun 09:30 PT). Levine keynote: more robot data makes human video usable, robot CoT, 13 h espresso. Stack table (Claude+Cartesia, Convex/SpacetimeDB, Tiger Data, Snowflake, MediaPipe/SAM 3D, TRELLIS/CoACD/MuJoCo, Iroh, WebRTC, CDP/USDC). 13 patterns with numbers: speculative STT partials (450 ms), one frame in flight, WebRTC channels by delivery, event log not video, TTS prefetch, single-token router (~60 ms, abstain under tau), N-window voter, personal baseline z per 4-h block + hysteresis 60/50 (903 → 22 alarms, simulated night), backtest-admitted rules (≥90%, 0 wrong), gradient pool limit, pre-registered gates, fail-closed fakes + replay cases, provenance labels + resumable stages. Null results: pooling 0.83x, adaptive ≈ warm pool. Judge's checklist for agent-built repos"
index_section: "concept"
---

# Cal Hacks 13.0: what the most technical teams built, and what is worth stealing

![Judge badge in the main hall of Cal Hacks 13.0, 25 October 2026](/images/posts/cal-hacks-13-2026/judge.jpg)

On 25 October I judged at Cal Hacks 13.0 at UC Berkeley, in the Technical Complexity category: a
morning of five-minute table visits with pairwise votes, then a final round with three shortlisted
projects. 652 projects went up on Devpost. I recorded the keynote and the closing ceremony with
[[project-supervox]], and afterwards read 13 of the repos, eight of them file by file.

How to read the numbers: each one is the team's own, from their README or docs, and comes with their
setup. I re-measured nothing. Two headline results (Vigil's alarm count, Fermata's match rate) were
measured on synthetic data, and I say so next to them. Stage quotes are paraphrases of rough
speech-to-text.

## The short version

- **The engineering worth copying was the control code around the model**, not the model: when to
  commit, when to abstain, when to drop a frame, when an agent's idea may become a rule.
- **The best repos published their null results.** Pooling inference across laptops slowed decoding;
  an adaptive connection pool did as well as a warm fixed one and no better; a brain-computer
  interface shipped a results table with every unmeasured cell left as TBD.
- **Coding agents wrote most of the code**: 60 KB specs, a 330 KB progress log, 200+ commits in a
  weekend. So the questions that separated teams were "what did you measure" and "what is yours".
- **Live hardware owned the room.** Venue Wi-Fi killed most live software demos; a robot arm, a bed
  sensor and an EEG headset worked anyway.

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

## The stack in the room

Tags from the Devpost pages, checked against the code where I read it.

| Layer | What showed up | Who |
|---|---|---|
| Reasoning, extraction, agents | Claude (Sonnet for classifiers, Haiku for generation) | almost everyone |
| Voice in the cloud | Cartesia TTS, and its ink-whisper STT | BrainSync, Fermata, Signal Bridge, Argument Gym |
| Voice on the device | Parakeet on the Neural Engine via FluidAudio, Qwen3.5-4B 4-bit in MLX | muselet |
| Live state, backend | Convex; SpacetimeDB (the sponsor counted 160+ submissions on it) | Handoff, Fermata; Signal Bridge, RealiSIM, TOT |
| Time series | Tiger Data (TimescaleDB) | Vigil, Pooltune |
| Warehouse ML | Snowflake ANOMALY_DETECTION, FORECAST, Cortex | Vigil |
| Vision and 3D | MediaPipe hands, SAM 3D; COLMAP, BiRefNet, TRELLIS, CoACD, MuJoCo | Handoff; RealiSIM |
| Transport | WebRTC data channels; Iroh QUIC with tickets | Handoff; Hypercompute |
| Agent payments | Coinbase CDP wallets, USDC escrow on Base, EIP-712, an MCP server | Overflow |
| Scraping | Apify actors | Signal Bridge, RealiSIM |
| Hardware | Cerelog X8 dry EEG; Polar Verity Sense over Web Bluetooth plus an iPhone as bed sensor; SO-101 arm | BrainSync; Vigil; RealiSIM |

Sponsor prizes shape this table: Snowflake, Tiger Data, Convex and SpacetimeDB showed up where a
sponsor track offered a prize. Claude and Cartesia showed up everywhere.

## What the teams built

**[RealiSIM](https://github.com/ChampCNV/RealiSIM)**, announced at the closing ceremony as the winner
of Most Technically Advanced (Devpost had no winner badges yet on 26 October). Film an object or a
robot workspace on a phone and get a pip-installable Gymnasium environment back. Claude vision
proposes the objects with size, mass and friction, an Apify actor looks up real product specs with
sources, TRELLIS builds a textured mesh scaled to the real dimensions, CoACD makes the collision
hulls, and every scene must drop, land and settle in MuJoCo before it can be exported. At the table an
SO-101 arm mirrored the simulation live, and the README reports a policy trained in their sim picking
up a Lego tree on a real SO-100. The pipeline lives on the `photo2grasp` branch (39 commits; `main`
has 2).

**[BrainSync](https://github.com/1thing2say/BrainSync).** A brain-computer interface for people who
cannot speak, inspired by a team member's grandmother with Parkinson's. Squares flicker at 11 to 17
Hz, an 8-channel dry EEG headset picks up the frequency the user is looking at, and a training-free
decoder chooses. Claude writes three reply options in the user's voice; a second look confirms and
Cartesia speaks it. Claude never speaks on its own: only a confirmed selection does. One detail I had
not thought of: the headset's sample clock lagged the host's markers by a constant 0.45 to 0.9 s that
changed on every reconnect, so they measure the offset per connection and rebase onto the host clock.

**[Handoff](https://github.com/Wilozz/CalHacks13).** Remote help where the helper's tracked hand
appears inside the other person's video call. Every few seconds a frame goes to Claude to find the
key objects, SAM 3D turns one into a 3D twin with physics, and the helper can grab it and take it
apart. Sessions are saved as replayable lessons. The live call died on venue Wi-Fi after a few
seconds; the architecture doc is the part to read.

**[Vigil](https://github.com/snr2753423/Vigil_calhacks).** Overnight monitoring for nursing homes,
where one worker covers 15 or 16 residents. A wristband and an iPhone under the pillow as a bed
sensor, live in the final round: get out of bed and the resident jumps to the top of the "check next"
queue with reasons from the chart. A fast tier on TimescaleDB runs rules and z-scores over 120
residents every 2 seconds; a deep tier on Snowflake runs anomaly detection and forecasts, and if it is
down the fast tier and the UI keep working. The resident history is simulated.

**[muselet](https://github.com/ardahk/muselet).** An on-device voice agent for the Mac: hold a key,
speak, and it changes settings, opens things or drives an app. The router decides in about 60 ms and
the first action lands about 190 ms after the key is released. The router is a LoRA on Qwen3.5-4B,
trained on Tinker under a $150 hard budget. Their testing postmortem is the best document I read all
weekend.

**[Fermata](https://github.com/keananwongso/fermata).** Month-end cash reconciliation for a family
retail business in Indonesia, where fourteen stores share five bank accounts and about 20 people
reconcile by hand. A TypeScript engine with no AI settles every bank line an approved rule explains.
Whatever no rule explains goes to a "case room" of three Claude agents, and then to one question for
the CFO, and the answer becomes a rule after a backtest. On one synthetic year of 104,820 bank lines
they report first-pass matching climbing from 85% to 95% with learning, against a flat 84% with the
rules frozen.

**[Pooltune](https://github.com/jyshum/pooltune).** Database connection pools are static, so a
traffic spike queues queries for 30 to 60 seconds. A Go gateway in front of PgBouncer resizes
admission once a second within approved bounds, keeps warm connections in reserve, and backs off when
the provider reports CPU or memory pressure. The controller is a pure function, documented in eight
formulas in `docs/controller.md`.

**Also worth a look:**

- [Hypercompute](https://github.com/amemon12/Hypercompute) pools LLM inference across laptops over
  Iroh QUIC. A ticket identifies the peer, a separate invite code authorises it, and traffic relays
  when there is no direct path, with no VPN interface. It also has a GGUF header reader that sizes
  tensors from offset differences and a ranged downloader that refuses a 200 where it asked for a
  range.
- [Overflow](https://github.com/its-advait/Overflow) puts a USDC escrow contract under agent
  purchases: buyer and seller agree a hash up front, data is hashed in chunks, and payment is
  released only when the hashes match, otherwise refunded. Spending is capped by a dedicated
  sub-wallet, and the contracts are tested against real USDC v2.2 bytecode.
- [Signal Bridge](https://github.com/tiramisuuuuuuu/SignalBridge) merges NWS alerts, FEMA shelters and
  scraped county pages into an emergency assistant with a voice mode and a 50-mile offline map, which
  the team named as the hardest part.
- At the tables: [TOT](https://github.com/alexanderzhao2007/calhacks) holds Claude's answer on
  claude.ai and asks the student one question first, with a Sonnet classifier deciding when to step
  in. [Devil's Advocate](https://github.com/roynguyenn/DevilsAdvocate) intercepts Amazon checkout and
  argues against the purchase from your transaction history. [Argument Gym](https://github.com/swarasai/Argument_Gym)
  scores debate delivery (pace, pauses, fillers, pitch); the team started on dysarthria support and
  pivoted when impaired-speech recognition proved out of reach in a weekend, which is a good call
  made early. The common shape at the tables was a browser extension around one LLM call. What would
  make one of them a product is an eval of when the intervention should fire, and none I saw had one.

## Thirteen patterns worth stealing

Each with the numbers the team chose and the file to read.

### Real-time loops and voice

**1. Speculate on partial transcripts.** While the key is held, muselet re-transcribes the buffer
every 450 ms once it is at least 0.6 s long and starts routing that partial in the background under
a generation counter, so only one speculative job runs and a newer partial cancels the older one. On
release the final reuses the work if the normalised text did not change. Re-transcribing the whole
buffer is quadratic, fine for push-to-talk under ten seconds and wrong for a long call; the part to
take is the speculation. `app/Sources/MuseletApp/Voice/VoiceController.swift`, `ml/src/brain/orchestrator.py`.

**2. One frame in flight.** Handoff runs MediaPipe in a Web Worker on transferable `ImageBitmap`s and
lets at most one frame be processed at a time: a slow inference drops the frames behind it instead of
queueing them. Landmarks go through a One Euro filter (steady at rest, quick in motion) and the hand
hides after 350 ms without data. `docs/ARCHITECTURE.md`.

**3. Split the transport by what a lost packet costs.** Handoff opens three WebRTC data channels:
`hand`, unreliable and unordered, 262 bytes per hand at 30 Hz, because a late hand is worthless;
`pose`, unordered with sequence numbers and resent every 300 ms while the twin moves; `control`,
reliable.

**4. Record an event log, not video.** Each side logs `{t, kind, data}` for hands, poses and parts.
Two hands at 30 Hz and 262 bytes come to about 16 KB/s, roughly 2 MB for a two-minute lesson, and the
log goes to file storage because a Convex document caps at 1 MiB. Replay re-renders the scene from
data. For my own work this is the clearest idea of the weekend: store the edit decisions of a film
and re-render, rather than storing renders.

**5. Prefetch every spoken option, and rewrite text for the ear.** BrainSync synthesises all reply
options the moment they exist, concurrently and in rank order, with a disk cache keyed by
sha256(voice | model | format | text), a keep-alive connection (connect plus TLS took 1 to 2 s on
venue Wi-Fi) and the system voice as fallback. Fermata runs `forSpeech()` before TTS so "Rp 358m"
becomes "358 million rupiah" instead of "R P 358 meters". `app/tts.py`, `convex/lib/speech.ts`.

### Decisions and alarms

**6. Classify with one forward pass over choice tokens.** muselet's router does not generate. The
options sit in a static system prompt whose KV cache is prefilled once and copied per call; the
assistant turn is prefilled up to `choice#?`, and a softmax over the logits of the id tokens gives a
probability per option in about 60 ms. Ids are restricted to characters that encode as exactly one
token. Below a threshold fitted on validation macro-F1 the answer is "ask", not a guess. A test
asserts the rendered prompt matches the cached prefix byte for byte, since a training/runtime
mismatch there fails silently. `ml/src/brain/decision.py`, `bench/tests/test_route_renderer_parity.py`.

**7. Commit only when N windows agree, and let abstain vote.** BrainSync's decoder commits a target
after four consecutive 1.5 s windows (0.25 s hop) name it, and ABSTAIN counts as a value, so a run
of uncertainty never commits anything. Any noisy stream decision (speaker change, wake word, a
gesture) flaps less this way. `brainsync/online.py`, `class Voter`.

**8. Score against a personal baseline, and budget the alarms.** Vigil scores each metric against
the resident's own normal for that 4-hour block of the day: robust z = (v − p50) / ((p95 − p05) /
3.29), with a per-metric floor so a very steady resident's narrow band does not turn noise into
alarms. Then three controls: hysteresis (enter HIGH at 60, leave at 50), persistence (two consecutive
evaluations), and 30 minutes of suppression after a logged check unless the score rises by 10. A
silent device becomes a device task, never a patient alarm. Every alert carries three deterministic
reasons ("HR 84 (her expected 67–79)"), and a template card shows at once while the LLM card arrives
12 to 15 seconds later. On one simulated replay night: 903 fixed-threshold alarms across 110
residents against 22 alerts for 4. `backend/app/scoring/baseline.py`, `SPEC.md`.

**9. Agents propose, code decides, a backtest admits.** Fermata's rules are small JSON programs
validated in code. A drafted rule passes only if a backtest over past books covers at least 90% of
the lines in its scope with zero wrong. Three agents argue a held case (Investigator finds the
pattern, Auditor tries to break it, Learner drafts the rule), and a meeting manager written in code
stops them at six turns and asks a person once. Every state change goes through one `transition()`
that checks the role and writes an audit row, refused steps included. `convex/lib/learn.ts`,
`convex/lib/rules.ts`, `convex/lib/transition.ts`.

**10. Limit concurrency with a gradient, not a fixed number.** Pooltune adapts the gradient idea from
Netflix's concurrency-limits (their doc says "inspired", not a port): congestion is
`ceil(C · max(0, 1 − baseline/current))`, applied only at 80% average occupancy or more; growth is at
most a quarter of the current cap per step, backoff multiplies by 0.8, and quiet reduction by 0.9
after 30 seconds. Stale readings freeze the last safe cap rather than guess. The same function would
cap concurrent LLM calls better than a fixed semaphore. `docs/controller.md`.

### Evals and honesty

**11. Pre-register the gate and print the trivial baseline.** BrainSync fixed its thresholds before
looking (70% or more: keep the mode; 55 to 70%: re-check; below: fall back), prints the
label-permutation p-value of the *best* cell so a lucky maximum is not read as a result, shows
balanced accuracy next to "always the majority class", and runs eyes-closed controls. Its "Honest
claim" table leaves every unmeasured cell as TBD. `brainsync/calibrate.py`, README "Honest claim".

**12. Fakes that fail on anything unrecorded, and user reports as replay cases.** muselet's user hit
seven failures in the first ten minutes despite about 2,000 passing tests. The causes, in their
words: fakes that returned ok for any call, idealised start states (app closed, fresh memory), evals
written rather than spoken so no speech-to-text spellings, grading what the agent *said* instead of
what is on screen, and timeouts that hid outcomes. The fixes: `RecordedHands`, a fake that fails on
any call it has no recording for, and a rule that a user report becomes a replay case that fails on
`main` before the fix lands. `docs/TESTING_POSTMORTEM.md`.

**13. Label where every value came from, and make the pipeline resumable.** RealiSIM tags each
physical value Measured, Supplied, Estimated or Unknown; an Unknown blocks the pipeline, a looked-up
height more than 25% off the scan is ignored in favour of the scan, and every export ships a
`provenance.json` saying estimated values "were acknowledged, not measured". The job is a list of
eight stages with state saved after each, a rerun from any stage, and a review pause after physics.
`photo2grasp/api/jobs.py`, `backend/workflow.py` (branch `photo2grasp`).

Three teams reported results that went against them, and those were the most useful READMEs I read:

- Hypercompute: pooling made models too big for one laptop usable, and made decoding *slower* (0.83x)
  on a machine that already holds the model. Their advice is to run there alone.
- Pooltune: 2,476 of 3,000 requests completed on Azure, against 2,469 for an equally large warm fixed
  pool, "superiority … not established".
- muselet: "The latest full Python-suite attempt was incomplete and showed failures; it is not a
  green full-suite result." A `pitch/claims.md` registers every number with the run that produced it.

## How the code got written, and how to judge it

Coding agents were the default teammate. AGENTS.md and CLAUDE.md sat in most repos. Overflow keeps
a 61 KB `docs/SPEC.md` and a 332 KB `docs/PROGRESS.md`, an agent's work log. BrainSync has 218
commits across more than 30 branches and an 89 KB `PLAN.md`. Phase-numbered commits from a written
spec were common. None of that is a problem; it moves the human part of the work into the spec, the
evals and the measured claims, and that is what the judging questions have to reach.

What I would check on any hackathon repo now, in ten minutes:

1. **The real submission window.** Here Devpost opened submissions on Thursday 23 October at 18:00 PT
   and closed them on Sunday at 09:30, a day before the Friday-evening start I had assumed. By Thursday's
   clock no repo I read predated the start; by Friday's, half the commits of several repos would have
   looked early.
2. **Every branch, not the default.** RealiSIM's work was on `photo2grasp`; another team's default
   branch held only a README, so their Devpost had no code link at all.
3. **What was written and what was assembled.** A copied reference implementation, sponsor SDKs and
   generated scaffolding are fine; the question is which part the team designed.
4. **One measured number and its baseline.** Ask for it at the table. The teams with an answer had a
   file for it.

## From the judge's chair

Venue Wi-Fi killed most live demos, and most teams showed a recorded video. The few who ran live
hardware held the table's attention in a way no video did. If you pitch at a hackathon, make the demo
run offline: muselet's whole stack does, and it reports the first action 190 ms after the key is
released.

Related: [[stanford-cleantech-hackathon-2026]] (the day before), [[dell-nvidia-gb10-hackathon-2026]]
(the same day, in SF), [[hackathons]] (all of them), [[agent-mistake-fix-harness]] (the same lesson as
muselet's postmortem), [[semantica-decision-provenance]], [[link-radar]].
