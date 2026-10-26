---
type: hub
title: "Hackathons"
description: "Every hackathon and agent competition I built at, ran a hub for, watched or judged, from Supabase in Lisbon in November 2025 to Cal Hacks 13.0 in October 2026: what was built, how it went, and the lessons that repeat."
created: 2026-10-26
tags: [hub, hackathon, competition, agents, validation]
publish: true
index_line: "Hub: 10 hackathons/competitions Nov 2025 → Oct 2026 + 2 studied (ERC, ERC3), each with its own write-up. Supabase Lisbon 2nd (SuperStoryboard); BitGN PAC1 17 → 74/104 + Gazipaşa hub; 8 events 3-25 Oct 2026 in California: Hack-Nation (AI Apprentice), Neon (Life2Film Director), Cyberdefense 3rd (ScreenShield), OC Lightning (BroCheck on Jev), super{set} (ConsentShield on Laya), Stanford Cleantech (Crew Air, no finals), Cal Hacks 13.0 judge, Dell x NVIDIA GB10 observer. Patterns: model reads/code decides, brake outside the model, say what you measured and what existed before, simple on the day wins, lock the story + something live, demo must outlive the weekend's keys, bring the asset nobody else has, read the other teams before your slot"
index_section: "hub"
---

# Hackathons

A hackathon gives me what a month of solo work does not. The deadline forces a demo that works end to
end. A jury, mentors and the other teams test the idea in one evening, which is the cheapest
[[startup-validation]] I know. And the people building in the same space are in one room. In October
2026 I did eight in 23 days in California: six as a builder with a public repo, one as an observer,
one as a judge.

Every event below has its own write-up: the event, the problem, what was built, the result as far as
it was recorded, and what the other teams did when I kept notes on them.

## 2025

### Supabase Hackathon, Lisbon, November 2025: SuperStoryboard, 2nd place

A text description becomes a storyboard: scenes with dialogue and camera angles, images from Gemini
2.5 Flash, clips from Veo 3.1, and live sync into Figma through a 37 kb plugin over WebSocket.
Supabase holds everything (auth, storage, database, realtime) and PGMQ runs the generation jobs.
Write-up: [[project-superstoryboard]].

## 2026

### BitGN PAC1, 11 April: 17 of 104 on the day, 74 two days later

An agent benchmark of 104 tasks in a virtual workspace, scored automatically. I competed with
agent-bit, a Rust agent on my sgr-agent core with ONNX classifiers in front of the LLM, and ran a
14-hour physical hub for it in Gazipaşa at the same time. The stack scored 17 on competition day while
the top scorers wrapped Codex CLI in an instructions file and got 70 to 80. After a weekend of batch
tools (185 down to 43.6 steps per task) and tracing, the same agent did 74. Write-ups:
[[pac1-competition-retrospective]], [[agent-bit-pac1]].

### 3-4 October: Hack-Nation 7, Stanford hub in Palo Alto

ElevenLabs' challenge, built overnight in about 18 hours in a team of two. AI Apprentice watches an
expert's screen, asks "why" only when a coded pause gate allows it, and stores each rule twice: in the
expert's words and as a machine check. The same JSON stops the new hire's save and stops an agent at a
supplier the expert never mentioned. An eval with Gemini playing the expert passed 23 of 23. Placement
not recorded. Write-up: [[hack-nation-ai-apprentice-2026]].

### 4 October: Build Personal Agents Hack (Neon), Terra Gallery, San Francisco

Solo, one day, hours after Hack-Nation. At 11:20 I dropped the conference-concierge idea half the room
was building and switched to my own video pipeline. Life2Film Director turns a day of footage into a
trailer, searches it with vectors plus full text in Neon, and turns every correction ("the opening is
boring") into a rule it keeps. Placement not recorded. Write-up:
[[neon-personal-agents-life2film-director-2026]].

### 9 October: Cyberdefense Hackathon (tokens&, AWS Builder Loft), San Francisco: ScreenShield, 3rd place

Solo, one Rust binary. A fast loop on the device with no LLM blurs secrets in a live stream at 0.3 to
0.8 seconds per keyframe; an agent works over the archive and rotates burned keys in a pull request.
Pointed at the venue's own Wi-Fi slide, it found 22 leaks in 20 seconds. The judges asked for an easy
install, and it had a Homebrew formula that night. Of 78 projects in the gallery, it was the only one
working on video. Write-up: [[cyberdefense-hackathon-screenshield-2026]].

### 21 October: OC AI Builders Lightning Hackathon, EvoNexus, Irvine

A 50-minute build on "decision models plus LLMs", team of three. BroCheck sends two photos and nine
typed questions to TypeSafe's Jev and adds the probabilities with weights in code; Mama Approves does
the same for food. No LLM anywhere, and "unsure" becomes "get a better pic". Placement not recorded.
Write-up: [[oc-lightning-hackathon-brocheck-2026]], with the twelve demos in [[jev-system-one]].

### 22 October: super{set} national renaissance hackathon, San Francisco

Solo, track "personal agents and data privacy". ConsentShield sits between the screen and a cloud
agent on the Mac: OCR, detectors, then Laya (the open Jev) picks a data category, and your consent per
purpose decides send, blur or ask. Giving the model more context measured worse, so it stayed off.
Placement not recorded. Write-up: [[superset-hackathon-consentshield-2026]].

### 23-24 October: Stanford Cleantech Hackathon, 24 hours, 19 projects

With a teammate. Crew Air turns smoke and heat forecasts into a shift plan that follows Cal/OSHA
§5141.1 and §3395. We missed the finals: a hardware concept added on the last morning took the whole
Q&A. It stays live as a free tool at [airsignal.app/crew](https://airsignal.app/crew). The write-up is
mostly about the other teams and the investor panel: [[stanford-cleantech-hackathon-2026]].

### 25 October: Cal Hacks 13.0, UC Berkeley, 652 projects

Judge for Technical Complexity: table visits, the final round, then eight repos read line by line.
Sergey Levine's keynote on robot data, and the engineering patterns worth stealing from the repos. Write-up:
[[cal-hacks-13-2026]].

### 25 October: Dell x NVIDIA AI Hackathon, Frontier Tower, San Francisco

Observer, about 150 builders. I watched the top eight always-on agents running on one GB10 and wrote
up how they kept the model away from decisions. Awards had not been announced when it was written.
Write-up: [[dell-nvidia-gb10-hackathon-2026]].

**Studied, not entered.** Two of Rinat Abdullin's competitions, read from their results:
[[enterprise-rag-challenge]] (100 annual reports; the top 3 all used structured outputs, #2 and #3 no
vector database) and [[erc3-agents-competition]] (103 agent tasks; simple ReAct with composite tools
beat multi-agent setups).

## Patterns across hackathons

### The model reads, code decides

At Dell, On the Record let AI read invoices and Python make every decision, Spark MD kept Lung-RADS
scoring in tested code, and Dwayne ran grid simulations before touching a breaker. At Cal Hacks the
pattern was "agents propose, code decides, a backtest admits". At Stanford the investor panel's rule
matched the best builds: LLMs read the documents, deterministic code or classic ML handles anything
physical. In the OC Lightning room, a local LLM asked for JSON was wrong 7 times on 17 routing cases
while claiming 90-95% confidence; no decision model was. BroCheck and ConsentShield have no LLM in the
decision at all: typed questions return probabilities and the verdict is weights or a policy in code.
My own PAC1 agent scored best on a free model because the pipeline did about 80% of the work.
Sources: [[dell-nvidia-gb10-hackathon-2026]], [[cal-hacks-13-2026]],
[[stanford-cleantech-hackathon-2026]], [[oc-lightning-hackathon-brocheck-2026]],
[[superset-hackathon-consentshield-2026]], [[jev-system-one]], [[agent-bit-pac1]].

### Put the brake outside the model

Spark MD's agent has no approve tool, and OpenShell answers 403 on the approve route. Night Shift
keeps its fix CLI off the exec allowlist. In Irvine, ImageKit's hook caught a Claude Code delete batch
before the API saw it. ScreenShield's fast loop has no model in it, and its policy forces the
key-rotation tool because gpt-oss skipped it when the prompt only asked. ConsentShield locks
credentials so no consent toggle can release them. AI Apprentice's guardrails are `when → must`
checks, so the agent stops where the expert would, not where it feels unsure. Asking the model to be
careful is not a gate.
Sources: [[dell-nvidia-gb10-hackathon-2026]], [[cyberdefense-hackathon-screenshield-2026]],
[[superset-hackathon-consentshield-2026]], [[hack-nation-ai-apprentice-2026]], [[jev-system-one]],
[[agent-sandboxing]].

### Say what you measured, what you did not, and what existed before

FlareWise rotated every wind direction by 180° and the NO2 signal vanished, which is validation with
no new data. Griddy labels every number observed, assumed, simulated or inferred. The pages were more
careful than the pitches: 13.7% in a simulator became a saving "if all AI inference companies"
adopted it. At Cal Hacks the question that separated teams was "what did you measure". ConsentShield
measured the improvement everyone would assume (more context for the model) and it made things worse.
The Life2Film Director pitch named the sponsor tools that did not make it, and both it and
ConsentShield list what was built before the kickoff and what on the day.
Sources: [[stanford-cleantech-hackathon-2026]], [[cal-hacks-13-2026]],
[[superset-hackathon-consentshield-2026]], [[neon-personal-agents-life2film-director-2026]].

### Simple and working on the day beats elaborate and working on Monday

My PAC1 stack (ONNX classifiers, a 12-feature threat matrix, two state machines) scored 17/104 on
competition day. The top scorers wrapped Codex CLI with an instructions file and got 70-80. After a
weekend of batch tools and tracing, the same agent did 74/104. ERC3 says the same: simple ReAct with
composite tools beat multi-agent orchestration.
Sources: [[pac1-competition-retrospective]], [[erc3-agents-competition]],
[[enterprise-rag-challenge]].

### The jury sees the story and the live thing

At Stanford a hardware concept added on the last morning took the whole Q&A, the running software
never came up, and we missed the finals. Lock the story the night before. At Cal Hacks the venue Wi-Fi
killed most live demos, and the few teams with live hardware owned the room. ScreenShield's strongest
moment was live and local: the venue's own Wi-Fi slide, read through a phone camera and blurred in the
recording. At Dell the strongest local-first pitch named the moment the network is gone (a substation
in an outage).
Sources: [[stanford-cleantech-hackathon-2026]], [[cal-hacks-13-2026]],
[[cyberdefense-hackathon-screenshield-2026]], [[dell-nvidia-gb10-hackathon-2026]].

### The demo has to outlive the weekend's keys

Judges open links after you leave, and free tiers run out first. AI Apprentice hit Gemini's 20
requests per model per key per day around 2 a.m., so it rotates five models over two keys, takes the
visitor's own keys, and replays a recorded run labelled as a replay. Life2Film Director's hosted demo
uses the visitor's OpenAI key and has no server key to drain. BroCheck caps the shared key per IP per
day, and its site is served from a laptop, so it is down whenever the laptop is. ConsentShield keeps a
static page with recorded results that needs no Mac. ScreenShield's judges asked for exactly this, an
easy install, and got a Homebrew formula the same night.
Sources: [[hack-nation-ai-apprentice-2026]], [[neon-personal-agents-life2film-director-2026]],
[[oc-lightning-hackathon-brocheck-2026]], [[superset-hackathon-consentshield-2026]],
[[cyberdefense-hackathon-screenshield-2026]].

### Bring the asset nobody else in the room has

At the Neon hack the room converged on conference concierges, and the build that was mine came from a
video pipeline and a month of editing notes nobody else had. The parts carry forward: the PAC1 agent
core runs ScreenShield's responder, ScreenShield's OCR helper and detectors became ConsentShield's
first stage 13 days later, and the Laya measurements made a local decision model a realistic choice
for it ([[portfolio-approach]]).
Sources: [[neon-personal-agents-life2film-director-2026]], [[cyberdefense-hackathon-screenshield-2026]],
[[superset-hackathon-consentshield-2026]], [[laya-open-jev-on-mac]].

### Read the other teams, and take notes while it is happening

At the Cyberdefense Hackathon I scraped the gallery before my slot: 78 projects, 29 guarding agents at
runtime, 14 doing find-fix-verify, one on video. It also showed my gap, no ClickHouse numbers, and by
about 17:00 a local ClickHouse was answering in 26 to 34 ms. At Stanford, Cal Hacks and Dell I recorded
talks and pitches with [[project-supervox]], which transcribes on the laptop and keeps a running
summary in a side panel, and each of the three was written up the day it ended.
Sources: [[cyberdefense-hackathon-screenshield-2026]], [[stanford-cleantech-hackathon-2026]],
[[cal-hacks-13-2026]], [[dell-nvidia-gb10-hackathon-2026]].

## Related

- [[startup-validation]]: the hub for the validation methods a hackathon compresses into a day
- [[portfolio-approach]]: why a $250 competition is tuition for a reusable part
- [[harness-engineering-summary]]: a check that proves the result beats an instruction that asks for it
