---
type: hub
title: "Hackathons"
description: "Every hackathon and agent competition I organized, built at, watched or judged, from #STRHACK1 in 2017 to Cal Hacks 13.0 in October 2026: what was built, how it went, and the lessons that repeat."
created: 2026-10-26
tags: [hub, hackathon, competition, agents, validation]
publish: true
index_line: "Hub: 13 hackathons/competitions 2017 → Oct 2026 + 2 studied (ERC, ERC3). Supabase Lisbon 2nd (SuperStoryboard); BitGN PAC1 17 → 74/104 + Gazipaşa hub; 8 events 3-25 Oct 2026 in the Bay Area: Hack-Nation (AI Apprentice), Neon (Life2Film Director), Cyberdefense 3rd (ScreenShield), OC Lightning (BroCheck on Jev), super{set} (ConsentShield on Laya), Stanford Cleantech (Crew Air, no finals), Cal Hacks 13.0 judge, Dell x NVIDIA GB10 observer. Patterns: model reads/code decides, brake outside the model, say what is not validated, simple on the day wins, lock the story + something live, supervox notes → post the same day"
index_section: "hub"
---

# Hackathons

A hackathon gives me what a month of solo work does not. The deadline forces a demo that works end to
end. A jury, mentors and the other teams test the idea in one evening, which is the cheapest
[[startup-validation]] I know. And the people building in the same space are in one room. In October
2026 I did eight in 23 days around San Francisco: six as a builder with a public repo, one as an
observer, one as a judge.

Every build leaves a part that outlives the weekend. The PAC1 agent core now runs other agents
([[portfolio-approach]]), and Crew Air stayed live at [airsignal.app/crew](https://airsignal.app/crew)
after it missed the finals.

## Events

| Date | Event | Role | What | Result | Links |
|---|---|---|---|---|---|
| 8-9 Nov 2025 | Supabase Lisbon AI Hackathon, Lisbon | builder | SuperStoryboard: text to storyboard, Gemini images and Veo 3.1 clips, live sync into Figma | 2nd place | [[project-superstoryboard]], [repo](https://github.com/fortunto2/superstoryboard) |
| 11 Apr 2026 | BitGN PAC1 agent challenge, 104 tasks | participant; ran the 14-hour hub in Gazipaşa | agent-bit: a Rust agent on sgr-agent, ONNX classifiers before the LLM | 17/104 live, 74/104 two days later | [[pac1-competition-retrospective]], [[agent-bit-pac1]] |
| 3-4 Oct 2026 | Hack-Nation 7 Global AI Hackathon, Stanford hub in Palo Alto, ElevenLabs challenge | builder, team SuperDuper, ~18 h | AI Apprentice: a voice agent watches an expert work, asks "why" at natural pauses, builds a Work Map with guardrails, tutors the next hire | not recorded | [repo](https://github.com/fortunto2/ai-apprentice), [demo](https://ai-apprentice-nu.vercel.app) |
| 4 Oct 2026 | Build Personal Agents Hack (Neon), Terra Gallery, SF | builder, solo, one day | Life2Film Director: a day of your own footage becomes a trailer, and every correction becomes a durable rule | prototype with a hosted demo | [[project-life2film]], [repo](https://github.com/fortunto2/tech-week-agent), [video](https://youtu.be/NAmEDA6vIEY) |
| 9 Oct 2026 | Cyberdefense Hackathon (tokens&, AWS Builder Loft), SF | builder, solo | ScreenShield: DLP for screen recordings. On-device OCR and deterministic detectors blur secrets at 0.3-0.8 s per keyframe; an agent audits the archive | 3rd place (AWS credits) | [repo](https://github.com/fortunto2/screenshield) |
| 21 Oct 2026 | OC AI Builders Lightning Hackathon, EvoNexus Irvine, 50-minute build | builder, with a teammate | BroCheck and Mama Approves: TypeSafe's Jev answers nine typed questions about photos, the verdict is weights in code, no LLM | demoed, live | [[jev-system-one]], [[laya-open-jev-on-mac]], [bro.rustman.org](https://bro.rustman.org), [repo](https://github.com/fortunto2/mama-approves) |
| 22 Oct 2026 | super{set} national renaissance hackathon, SF, track "Personal agents and data privacy" | builder, solo | ConsentShield: a gate between the screen and a cloud agent. Detectors first, then local Laya picks the data category, and your consent per purpose decides send, blur or ask | not recorded | [repo](https://github.com/fortunto2/consentshield), [demo](https://fortunto2.github.io/consentshield/) |
| 23-24 Oct 2026 | Stanford Cleantech Hackathon, 24 h, 19 projects | builder, with a teammate | Crew Air: smoke and heat forecasts become a shift plan that follows Cal/OSHA §5141.1 and §3395 | did not make the finals; stays live as a free tool | [[stanford-cleantech-hackathon-2026]], [repo](https://github.com/fortunto2/stanford-cleantech-2026), [Devpost](https://devpost.com/software/crew-air) |
| 25 Oct 2026 | Cal Hacks 13.0, UC Berkeley, 652 projects | judge, Technical Complexity | table visits, the final round, then 8 repos read line by line | n/a | [[cal-hacks-13-2026]] |
| 25 Oct 2026 | Dell x NVIDIA AI Hackathon, Frontier Tower, SF, ~150 builders | observer | watched the top 8 always-on agents on a GB10; started a local Night Desk prototype, unpublished | awards not announced when written | [[dell-nvidia-gb10-hackathon-2026]] |

**Before 2025.** I organized #STRHACK1, the first hackathon in Sterlitamak, in January 2017
([vk.com/strhack](https://vk.com/strhack)). 3rd place at TealTech MedHack in St. Petersburg, 2017
([RBC](https://ufa.rbc.ru/ufa/22/11/2017/5a1574879a79472fcf8563d2)). Top-10 finalist at the PicsArt AI
Hackathon, 2018 ([rb.ru](https://rb.ru/news/itogi-hakaton-picsart/)).

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
while claiming 90-95% confidence; no decision model was. My own PAC1 agent scored best on a free
model because the pipeline did about 80% of the work.
Sources: [[dell-nvidia-gb10-hackathon-2026]], [[cal-hacks-13-2026]],
[[stanford-cleantech-hackathon-2026]], [[jev-system-one]], [[agent-bit-pac1]].

### Put the brake outside the model

Spark MD's agent has no approve tool, and OpenShell answers 403 on the approve route. Night Shift
keeps its fix CLI off the exec allowlist. Four days earlier in Irvine, ImageKit's hook caught a
Claude Code delete batch before the API saw it. In a separate benchmark, a proposed `rm -rf` on a
backup server got "escalate" at 0.84 from Jev and HOLD from code. Asking the model to be careful is not a gate.
Sources: [[dell-nvidia-gb10-hackathon-2026]], [[jev-system-one]], [[agent-sandboxing]].

### Say what you measured, and what you did not

FlareWise rotated every wind direction by 180° and the NO2 signal vanished, which is validation with
no new data. Griddy labels every number observed, assumed, simulated or inferred. The pages were more
careful than the pitches: 13.7% in a simulator became a saving "if all AI inference companies"
adopted it. At Cal Hacks the question that separated teams was "what did you measure", and the
patterns I took home were a pre-registered gate, the trivial baseline printed next to the result, and
provenance per value. At Dell, Spark MD's README says VISTA-3D failed their nodule validation.
Sources: [[stanford-cleantech-hackathon-2026]], [[cal-hacks-13-2026]],
[[dell-nvidia-gb10-hackathon-2026]].

### Simple and working on the day beats elaborate and working on Monday

My PAC1 stack (ONNX classifiers, a 12-feature threat matrix, two state machines) scored 17/104 on
competition day. The top scorers wrapped Codex CLI with an instructions file and got 70-80. After a
weekend of batch tools (185 → 43.6 steps per task) and tracing, the same agent did 74/104. ERC3 says
the same: simple ReAct with composite tools beat multi-agent orchestration.
Sources: [[pac1-competition-retrospective]], [[erc3-agents-competition]],
[[enterprise-rag-challenge]].

### The jury sees the story and the live thing

At Stanford a hardware concept added on the last morning took the whole Q&A, the running software
never came up, and we missed the finals. Lock the story the night before. At Cal Hacks the venue
Wi-Fi killed most live demos, and the few teams with live hardware (a robot arm, a bed sensor, an EEG
headset) owned the room. At Dell the strongest local-first pitch named the moment the network is gone
(a substation in an outage); the weakest was "it works with Wi-Fi off" with no buyer, and the best
model engineering of the night had not worked out who pays.
Sources: [[stanford-cleantech-hackathon-2026]], [[cal-hacks-13-2026]],
[[dell-nvidia-gb10-hackathon-2026]].

### The notes are part of the build

At Stanford, Cal Hacks and Dell I recorded talks and pitches with [[project-supervox]], which
transcribes on the laptop and keeps a running summary in a side panel. At Dell a DJI Osmo Pocket 3
served as a USB webcam for the slides, and a second agent matched team names to GitHub repos created
that day. Each of the three was written up the day the event ended.
Sources: [[stanford-cleantech-hackathon-2026]], [[cal-hacks-13-2026]],
[[dell-nvidia-gb10-hackathon-2026]].

## Related

- [[startup-validation]]: the hub for the validation methods a hackathon compresses into a day
- [[portfolio-approach]]: why a $250 competition is tuition for a reusable part
- [[harness-engineering-summary]]: a check that proves the result beats an instruction that asks for it
