---
type: concept
title: "Eight always-on agents on one GB10: what a Dell x NVIDIA hackathon showed about local agents"
description: "Top 8 demos at the Dell x NVIDIA AI Hackathon in San Francisco (25 Oct 2026): what fits on a 128 GB GB10, how teams kept the model away from decisions, and which local-first arguments held up."
created: 2026-10-25
tags: [hackathon, local-first, agents, gb10, nvidia, on-device, sandboxing]
publish: true
publish_as: post
learned_from: "https://builderbase.com/event/dell-x-nvidia-ai-hackathon-san-francisco; live notes via supervox (top 8 demos and Q&A, 25 Oct 2026); public finalist repos read afterwards"
index_line: "Post: Dell x NVIDIA GB10 hackathon SF 25.10.2026, top 8 demos. Pattern: LLM reads/writes, code decides; approve blocked by OpenShell policy (403), not prompt; NO_REPLY when calm; NemoClaw custom skills don't load (#12670) → AGENTS.md. GB10: 121 of 128 GB free, Qwen3.8-Flash-Next 125B NVFP4 with n-gram table on SSD ~37-47 tok/s, Whisper CPU→CUDA 4 s→0.4 s, 3× Qwen3-Coder ~63 GB. Teams: Mission Control, Solar Storm Ops, On the Record, Night Shift, Spark MD, WreckLess, Braille Dive, Dwayne (grid, smoke scenario)"
index_section: "concept"
---

# Eight always-on agents on one GB10

On 25 October about 150 builders spent eight hours at Frontier Tower in San Francisco on one brief:
an always-on agent a company would pay for, with all inference on a Dell Pro Max with GB10 (Grace
Blackwell, 128 GB unified memory). The stack had to include NemoClaw, OpenClaw or OpenShell, the
channel was Slack, Discord or Telegram, and the judges scored technical execution, business value,
local-first design and demo quality. I watched the top 8 demos from the audience. Awards had not been
announced when this was written.

Numbers quoted from the stage are the teams' own claims. Where a public repo backs a detail, I say so.
Nothing here was re-measured.

## The model reads, code decides

Most of the eight teams arrived at the same split on their own, and the strongest said it out loud.

- **On the Record** audits supplier invoices overnight. Their README puts it in one line: AI reads the
  documents, Python makes every decision. An LLM rewrite of a finding survives only if every amount
  and clause number in it is unchanged.
- **Spark MD** follows up lung CT scans. MONAI's nodule detector does the measuring, Lung-RADS scoring
  lives in tested code (41 reference vectors from the ACR), and the LLM (Qwen3.8-27B per the repo)
  only calls tools, watches the inbox, flags and drafts.
- **Dwayne** controls switching at a power substation. The LLM proposes actions; a local grid physics
  engine runs thousands of simulations before anything touches a breaker.
- **Wrecking Crew** chains four agents: Scout finds a CVE, Ralph writes an exploit, Felix patches, a
  Verifier replays the exploit against the patched app. A finding counts only once an exploit proves
  it applies to your version.

Money, medicine and switchgear all punish a confident wrong number, so the number comes from code.

## Approval is a policy, not a sentence in the prompt

The second shared move. Spark MD's agent has no approve tool at all, and OpenShell answers 403 on the
approve route, which the team verified. Night Shift (an on-call SRE agent) keeps its remediation CLI
outside the exec allowlist: the agent can diagnose anything, but a fix needs a human, and after a fix
it checks that recovery holds and reverts if it does not. Mission Control gives each of its 15 agents
its own OpenShell host and path allowlist plus a dollar threshold above which it must escalate.

Approvals come back through the chat channel: a Slack button, or replying "approve" in Telegram. More
on the sandbox side in [[agent-sandboxing]].

## Small tricks worth copying

- **NO_REPLY when calm.** Solar Storm Ops runs a check every 5 minutes. When nothing changed, the
  script prints `NO_REPLY` and nobody gets a message. An agent that pings every 5 minutes is muted by
  the second day.
- **AGENTS.md instead of custom skills.** NemoClaw custom skills did not load (issue #12670), so
  teams put their instructions in the workspace `AGENTS.md` and called scripts through `exec`.
- **Sandbox to host networking** was the common pain. Fixes seen: a dummy interface (Spark MD's
  `spark0` at 10.77.0.1), a trusted private host policy, `host.openshell.internal`.
- **Wait for the file to settle.** On the Record's inbox watcher dispatches an invoice only when its
  size stops changing. Their audit log is hash-chained, and Slack alerts never carry prices.
- **Say what is not validated.** Spark MD's README admits VISTA-3D failed their nodule validation, so
  it only produces the lung mask. Braille Dive states plainly that the NemoClaw/OpenShell sandbox is
  not claimed as working.

## What fits on a GB10

- **121 of the advertised 128 GB** were free in practice, per the Solar Storm Ops team.
- **Qwen3.8-Flash-Next 125B (NVFP4)** does not fit whole. NVIDIA's packaging separates the thinking
  model from its n-gram embedding table, so the team moved the table to SSD with an open-source lookup
  optimizer. On stage they reported 40-47 tok/s with no visible slowdown; the repo says about 37.
- **Three Qwen3-Coder models**, two 30B-A3B and one 80B-A3B, in about 63 GB on vLLM (Wrecking Crew).
- **Voice on the same GPU.** Mission Control first ran the LLM on the GPU and Whisper on the CPU, which
  was too slow for spoken orders. Moving Whisper to CUDA took latency from about 4 s to 0.4 s.
- **Models of choice:** Qwen3.6-35B-A3B-NVFP4 and Qwen3.8 (27B, Flash-Next) on vLLM or TensorFold,
  Nemotron 3 Super 120B through Ollama, gpt-oss:20b for the simpler agents.

## Which local-first arguments held up

The rules said "runs locally", so every team had to justify it. Ranked by how hard each argument is to
push back on:

1. **No network at the moment of need.** Dwayne sits at a distribution substation. When the grid goes
   down the comms go with it, so a cloud backup fails exactly when it is needed. Their demo: a camera
   spots smoke, drones confirm it, the agent runs fire and grid simulations and reroutes power around
   the danger.
2. **Data that cannot leave.** CT scans (Spark MD), production logs (Night Shift), contracts and
   prices (On the Record). Here local is the purchase condition, not a feature.
3. **Defense and remote sites.** Braille Dive began as sonar mine hunting; the model's guardrails
   refused, so the demo became flood rescue for dive teams. Mission Control's README points out that
   cold rooms behave like Faraday cages.

Weakest was "it works with Wi-Fi off" as a demo trick with no buyer named. Solar Storm Ops had the most
impressive model engineering of the night and said in Q&A they had not yet worked out who pays.

## The eight finalists

| Team | What the agent does | Stack | Repo |
|---|---|---|---|
| Mission Control | 24/7 ops for a perishable food wholesale terminal; 15 agents, voice orders in English, Spanish and Cantonese | Nemotron 3 Super 120B (Ollama), whisper | [yfandev/mission-control](https://github.com/yfandev/mission-control) |
| Solar Storm Ops (SPF) | Geomagnetic storm risk for satellite fleets, approve or deny in Telegram; replays the Feb 2022 Starlink loss | Qwen3.8-Flash-Next 125B NVFP4, NOAA SWPC + CelesTrak | [adi-suresh01/solar-storm-ops](https://github.com/adi-suresh01/solar-storm-ops) |
| On the Record | Overnight accounts payable audit: 3-way match, then contract tiers and billing history | Nemotron / Qwen 32B (Ollama), OpenClaw skills | [ItsPrateekBansal/on-the-record](https://github.com/ItsPrateekBansal/on-the-record) |
| Night Shift | On-call SRE: spots an outage, finds the cause, proposes a fix in Slack, applies it after approval | OpenClaw in OpenShell, SQLite FTS5 postmortem memory | Keerthirajan58/nightshift (public on 25.10, 404 since 26.10) |
| Spark MD | CT follow-up: nodule detection and comparison with the patient's previous scans | Qwen3.8-27B, MONAI v0.5.9, Lung-RADS in code | [tdoan35/spark-md](https://github.com/tdoan35/spark-md) |
| Wrecking Crew | Red and blue team for your app: find a CVE, prove it, patch, verify | 3× Qwen3-Coder on vLLM, OpenShell deny-all egress | [djang-c/WreckLess-Cyber-Security](https://github.com/djang-c/WreckLess-Cyber-Security) |
| Braille Dive | Sonar to a 4D seabed scene so rescue divers know where to look | Qwen3-VL-4B LoRA, D-FINE-N tuned on AquaScan, OpenClaw | francolinx/brailledivesubmission- (public on 25.10, 404 since 26.10) |
| Dwayne | Autonomous grid connection control at a substation | OpenClaw agents, local grid physics engine | not public |

Stage claims to read as claims: $88B and $36B of food waste (Mission Control used both), over $300k
and about 3 hours per outage, and an unseen error pattern caught 11 s after the first error (Night
Shift), about $350M of economic loss from a San Francisco outage last December (Dwayne), and $500k to
$1M for a ship survey system against a roughly $10k sonar plus a GB10 (Braille Dive).

## What the other 32 teams built

BuilderBase keeps the gallery behind a login (project API routes answer 401), so the list comes from
GitHub: 39 repos plus Dwayne, who has none. For 5 the event link is inferred, not stated. By morning
3 repos returned 404, two of them finalists linked above (Night Shift, Braille Dive), and 8 of the 36
live ones had been pushed after the 18:00 code freeze, so they may show more than was demoed.

Counted from the READMEs:

- **Runtime** (39 repos): vLLM 16, Ollama 14, llama.cpp 2, TensorFold 1, "Ollama or vLLM" 1, not
  stated 5.
- **Models:** Qwen3.6-35B-A3B in 15. A Nemotron is named in 12, a working model in 8. gpt-oss and
  qwen3.5:9b in 4 each.
- **Required stack:** NemoClaw runs in 14, OpenClaw in 15, OpenShell in 16, all three in 12. Seven
  show neither files nor a run.
- **OpenShell:** 15 ship a policy file. Only Spark MD uses it to block the approval itself; 3 more
  drop approve from the agent's tools.
- **Human approval** in 27 of 40; 5 take no action that needs one, 8 do not say.
- **Code decides** per 20 READMEs, the model in 1, 19 do not say.
- **Channel:** Slack 10, Telegram 9, Discord 2, none in the repo for 20. Data is synthetic, mock or
  a replay in 24.

Five worth reading:

- [ImDannyVilla/spraywatch](https://github.com/ImDannyVilla/spraywatch) keeps harvests and crew
  entries inside pesticide label limits. Code applies every rule, an alert keyed to the exact
  conflict never posts twice, English and Spanish postings come from fixed templates. The real
  16-page Captan 80 DF label gave 41 facts on the GB10, all verified by code, in 44 s. Pushed after
  the freeze.
- [phucducnguyen/locallab](https://github.com/phucducnguyen/locallab) watches a real NUCLEO-F446RE
  board and 8 QEMU boards: a fixed rule says HARDWARE or CODE, the model explains with cited serial
  lines, the dashboard marks whether they agree. Pushed after the freeze.
- [dude297/skillforge_main](https://github.com/dude297/skillforge_main): a fix that passes a hidden
  test suite and a human's promotion becomes a sha256-pinned skill; the next matching incident runs
  it with no model call. Its OpenClaw-in-sandbox gate is marked not passed.
- [Bikz/super-archilles](https://github.com/Bikz/super-archilles) coaches a talk every 3 s against
  the plan and the clock. A gate in front of the model cancels background work with HTTP 409 the
  moment a coach request arrives.
- [ovevayrus/dealdesk-local](https://github.com/ovevayrus/dealdesk-local) prices enterprise deals
  with a margin floor. A reply with an amount or percentage absent from the tool results is
  replaced with scripted wording.

## What I'd steal

- Put the decision in code and test it like code. Let the model read, summarize and route.
- Remove the approve tool instead of asking the model not to use it, and enforce that at the sandbox.
- Treat silence as a feature: say nothing when nothing changed.
- Verify after acting and roll back on failure (Night Shift); replay the exploit after the patch
  (Wrecking Crew).
- Grade the agent with checks it cannot see or change: held-out regression tests (Wrecking Crew), a
  hidden suite before a fix becomes a skill (SkillForge).
- Keep a model's rewrite only if every number in it is in the source; otherwise ship the wording code
  produced (On the Record, DealDesk).
- Write the "what is not validated" section before a judge asks for it.

This matches what I keep relearning in [[harness-engineering-summary]]: a check that proves the result
beats an instruction that asks for it. Dwayne's smoke scenario is also the other half of the problem I
work on with air quality: they decide where the power goes, someone still has to decide which crews
stay outside.

## How these notes were taken

The demos were recorded with [[project-supervox]], which transcribes on the laptop and lets an agent
keep a running summary in a side panel. The laptop camera could not read slides from the back of the
room, so I plugged in a DJI Osmo Pocket 3 as a USB webcam and drove its pan and 4x zoom over UVC from a
script; the camera drops its stream and resets zoom about once a minute, so each frame opens a fresh
capture and re-applies the zoom. A second agent matched team names heard by speech recognition to
public GitHub repos created that day. Same week, different rooms: [[cal-hacks-13-2026]] and
[[stanford-cleantech-hackathon-2026]]. Every event: [[hackathons]].
