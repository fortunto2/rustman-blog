---
type: concept
title: "Eight always-on agents on one GB10: what a Dell x NVIDIA hackathon showed about local agents"
description: "Top 8 demos at the Dell x NVIDIA AI Hackathon in San Francisco (25 Oct 2026): the strong ones kept every decision in tested code, only one finalist ran the whole required stack, and four pitched numbers or components their repos do not back."
created: 2026-10-25
event_date: 2026-10-25
tags: [hackathon, local-first, agents, gb10, nvidia, on-device, sandboxing]
publish: true
publish_as: post
learned_from: "https://builderbase.com/event/dell-x-nvidia-ai-hackathon-san-francisco; live notes via supervox (top 8 demos and Q&A, 25 Oct 2026); public finalist repos read afterwards; ~/startups/hackathons/2026-10-25-dell-nvidia-gb10/docs (gallery.md, projects.json)"
index_line: "Post: Dell x NVIDIA GB10 hackathon SF 25.10.2026, top 8 demos with verdicts. Hook: only Spark MD of 8 finalists runs NemoClaw+OpenClaw+OpenShell per README (12 of 40 overall); stage vs repo differ for 4 of 8 (Mission Control $88B/$36B and 15 agents vs one 120B running, SSO 40-47 vs ~37 tok/s, Night Shift numbers absent from README, Spark MD % vs mm). Pattern: LLM reads/writes, code decides (20 of 40 READMEs); approve blocked by OpenShell policy (403) in 1 of 40; NO_REPLY when calm; NemoClaw custom skills don't load (#12670) → AGENTS.md. GB10: 121 of 128 GB free, Qwen3.8-Flash-Next 125B NVFP4 with n-gram table on SSD ~37-47 tok/s, Whisper CPU→CUDA 4 s→0.4 s, 3× Qwen3-Coder ~63 GB. Teams: Mission Control, Solar Storm Ops, On the Record, Night Shift, Spark MD, WreckLess, Braille Dive, Dwayne (grid, smoke scenario, no repo)"
index_section: "concept"
---

# Eight always-on agents on one GB10

The Dell x NVIDIA hackathon in San Francisco on 25 October required NemoClaw, OpenClaw and OpenShell
running on a GB10, and only one of the eight finalists, Spark MD, says in its README that all three
run. The demos that held up won on something else: every decision that costs money, health or a
breaker stayed in tested code, and the model read, routed and drafted. For four of the eight, a number
or a component on stage is not what the repo shows.

## The short version

- **Code decides, the model reads.** 20 of 40 READMEs say so in some form, one (VaultWatch) lets the
  model give the verdict. On the Record keeps an LLM rewrite only if every amount and clause number
  survives it.
- **The required stack was mostly on paper.** All three components run in 12 of 40 repos. Four
  finalists ship config files with no stated run, and Braille Dive says outright that its sandbox is
  not claimed as working.
- **The sandbox enforced approval in 1 of 40.** Spark MD's OpenShell policy answers 403 on the approve
  route. Three more teams removed the approve tool from the agent.
- **Stage numbers ran ahead of the repos.** Mission Control quoted $88B and $36B of food waste in one
  pitch, neither in its README. None of Night Shift's outage figures are in its README.
- **The strongest local-first argument was the least checkable.** Dwayne's substation loses its comms
  exactly when the grid fails, and Dwayne has no public repo.

## The brief

About 150 builders had eight hours at Frontier Tower to build an always-on agent a company would pay
for, all inference on a Dell Pro Max with GB10 (Grace Blackwell, 128 GB unified memory), talking over
Slack, Discord or Telegram. Judges scored technical execution, business value, local-first design and
demo quality. I watched the top 8 demos from the audience.

## The model reads, code decides

Most of the eight teams arrived at the same split on their own.

- **On the Record** audits supplier invoices overnight. Their README puts it in one line: AI reads the
  documents, Python makes every decision.
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

Spark MD's agent has no approve tool at all, and OpenShell answers 403 on the approve route, which the
team verified. Night Shift (an on-call SRE agent) keeps its remediation CLI outside the exec allowlist:
the agent can diagnose anything, but a fix needs a human, and after a fix it checks that recovery holds
and reverts if it does not. Mission Control's config gives each of its 15 agents its own OpenShell host
and path allowlist plus a dollar threshold above which it must escalate.

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

Weakest was "it works with Wi-Fi off" as a demo trick with no buyer named.

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

### Verdicts

On the work as shown on stage and in the repo.

- **Mission Control.** Strong: Whisper on CUDA, voice orders in three languages with Wi-Fi off. But the
  README's 15 agents on three model tiers meet a status doc where only the 120B Nemotron runs and
  OpenClaw never ran end to end on the GB10; orders are demo data.
- **Solar Storm Ops.** The best model engineering of the night, a 125B model made to fit. No buyer: asked
  for a business plan, the team said they would have to think about it. Operator data is mock.
- **On the Record.** The closest match between pitch and repo, and the clearest buyer, an AP manager.
  Tested only on generated invoices; the LLM is optional and explanations are templates for now.
- **Night Shift.** The right shape: fix outside the allowlist, verify, revert. Its stage numbers (over
  $300k and 3 hours per outage, a new error pattern caught 11 s after the first error) are not in the
  README, the shop is a simulated "Acme", and the repo was gone by morning.
- **Spark MD.** All three components running, on public research scans (NLST, LIDC-IDRI), and the
  README admits VISTA-3D failed their nodule validation. On stage the growth rule was a percentage; the
  README says more than 1.5 mm in 12 months, and some numbers came from a prep machine on 24-25 October.
- **Wrecking Crew.** Grades the agent outside the agent: a plain-code Verifier and tests the patcher
  never sees. NemoClaw not used; the README's 5 of 5 replays are of one CVE, on a replica.
- **Braille Dive.** The most candid README in the top 8, and no action executed, so a perception demo
  more than an agent. The $500k to $1M ship survey system against a roughly $10k sonar plus a GB10 is
  a stage comparison.
- **Dwayne.** The best argument for local and the hardest to check: no repo, a synthetic world model,
  and about $350M lost to a San Francisco outage last December, quoted from the stage.

## What the other 32 teams built

The 40 projects come from GitHub: 39 repos plus Dwayne, who has none. Counted from the READMEs:

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
  16-page Captan 80 DF label gave 41 facts on the GB10, all verified by code, in 44 s. The repo was
  updated after the code freeze, so read it as the current state, not the demo.
- [phucducnguyen/locallab](https://github.com/phucducnguyen/locallab) watches a real NUCLEO-F446RE
  board and 8 QEMU boards: a fixed rule says HARDWARE or CODE, the model explains with cited serial
  lines, the dashboard marks whether they agree. Also updated after the freeze.
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

- Verify after acting and roll back on failure (Night Shift); replay the exploit after the patch
  (Wrecking Crew).
- Grade the agent with checks it cannot see or change: held-out regression tests (Wrecking Crew), a
  hidden suite before a fix becomes a skill (SkillForge).
- Keep a model's rewrite only if every number in it is in the source (On the Record, DealDesk).
- Write the "what is not validated" section before a judge asks, and pitch only numbers the repo has.

This matches what I keep relearning in [[harness-engineering-summary]]: a check that proves the result
beats an instruction that asks for it. Dwayne's smoke scenario is also the other half of the problem I
work on with air quality: they decide where the power goes, someone still has to decide which crews
stay outside.

## How this was put together

The demos were recorded with [[project-supervox]], which transcribes on the laptop and keeps a running
summary in a side panel. For slides at the back of the room, a DJI Osmo Pocket 3 served as a USB
webcam with pan and 4x zoom driven over UVC from a script (it drops the stream about once a minute, so
each frame opens a fresh capture). A second agent matched team names heard by speech recognition to
public GitHub repos created that day.

Stage numbers are the teams' own claims, and speech recognition garbles names and figures, so I call
out a gap between stage and repo only where the README states a different value. Nothing was
re-measured. Awards had not been announced when this was written. BuilderBase keeps the gallery behind
a login (project API routes answer 401), so the 40 projects come from GitHub; for 5 the event link is
inferred, not stated. By morning 3 repos returned 404, two of them finalists (Night Shift, Braille
Dive), described from READMEs cached the evening before, and 8 of the 36 live repos had been pushed
after the 18:00 code freeze, so they may show more than was demoed.

Same week, different rooms: [[cal-hacks-13-2026]] and [[stanford-cleantech-hackathon-2026]]. Every
event: [[hackathons]].
