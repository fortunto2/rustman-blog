---
type: concept
title: "GitHub top-100 in 2026 — agent harnesses ate the all-time chart"
description: "Snapshot of the GitHub all-time top-100 by stars (July 2026): 16 of 100 repos are younger than 18 months, and every single one of them is agent harness tooling — skills, CLAUDE.md configs, agent CLIs."
created: 2026-07-30
tags: [agents, skills, harness, open-source, github, benchmarks, distribution]
source_url: "https://www.star-history.com/"
publish: true
index_line: "GitHub all-time top-100 (Jul 2026): **16 of 100 repos created after Jan 2025 — all of them agent harness tooling**. Velocity: claw-code 1611★/day, OpenClaw 1550, ECC 1219, mattpocock/skills 1095, karpathy-skills 1073, Superpowers 895, gstack 887 vs React's lifetime 52★/day. Markdown-only repos now outrank frameworks. Includes what to steal (gstack roles, ECC harness-OS, taste skills) and why stars died as a signal (GitHub closed the stargazers API Jul 6, 2026)"
index_section: "concept"
---

# GitHub Top-100 in 2026 — Agent Harnesses Ate the All-Time Chart

Snapshot taken 2026-07-29 from [star-history.com](https://www.star-history.com/) (all-time ranking, 12 142 repos tracked; metadata verified against the GitHub API).

The headline is not "AI is popular." It is that **the unit of open-source distribution changed**. Sixteen repos in the all-time top-100 were created after January 2025, and all sixteen are agent harness tooling — skills, config files, agent CLIs, provider switchers. Not one is a library, framework, or runtime.

---

## The young cohort — 16 of 100

| # | Repo | Stars | Created | ★/day | Lang | What it is |
|---|------|-------|---------|-------|------|------------|
| 6 | [openclaw/openclaw](https://github.com/openclaw/openclaw) | 384K | Nov 2025 | 1550 | TS | Personal AI assistant on your own devices, 25+ chat channels, non-profit foundation, OpenAI/GitHub as sponsors |
| 14 | [obra/superpowers](https://github.com/obra/superpowers) | 263K | Oct 2025 | 895 | Shell | Agentic skills framework + SDLC methodology |
| 18 | [affaan-m/ECC](https://github.com/affaan-m/ECC) | 235K | Jan 2026 | 1219 | JS | "Agent harness operating system": skills, instincts, memory, security, research-first dev |
| 20 | [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent) | 222K | Jul 2025 | 596 | Python | Self-improving agent — see [[hermes-agent]] |
| 24 | [multica-ai/andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills) | 197K | Jan 2026 | 1073 | md | **One CLAUDE.md file.** Four principles from Karpathy's LLM-coding critique |
| 27 | [ultraworkers/claw-code](https://github.com/ultraworkers/claw-code) | 195K | Mar 2026 | 1611 | Rust | "Agent-managed museum exhibit, no human intervention" — README is mostly a redirect to two other harnesses |
| 28 | [mattpocock/skills](https://github.com/mattpocock/skills) | 194K | Feb 2026 | 1095 | Shell | "Skills for real engineers, straight from my .agents directory" |
| 29 | [anomalyco/opencode](https://github.com/anomalyco/opencode) | 191K | Apr 2025 | 418 | TS | Open-source coding agent |
| 47 | [anthropics/skills](https://github.com/anthropics/skills) | 165K | Sep 2025 | 530 | Python | Official Agent Skills repo — see [[skills-standard]] |
| 59 | [x1xhlol/system-prompts-and-models-of-ai-tools](https://github.com/x1xhlol/system-prompts-and-models-of-ai-tools) | 142K | Mar 2025 | 278 | md | Leaked/extracted system prompts of 25+ AI coding tools |
| 63 | [anthropics/claude-code](https://github.com/anthropics/claude-code) | 139K | Feb 2025 | 267 | Python | The harness itself |
| 64 | [msitarzewski/agency-agents](https://github.com/msitarzewski/agency-agents) | 137K | Oct 2025 | 474 | Shell | "A complete AI agency" — role-persona prompt library |
| 76 | [garrytan/gstack](https://github.com/garrytan/gstack) | 125K | Mar 2026 | 887 | TS | Garry Tan's (YC CEO) exact Claude Code setup: 23 slash commands as a virtual eng team |
| 77 | [github/spec-kit](https://github.com/github/spec-kit) | 124K | Aug 2025 | 363 | Python | Spec-driven development toolkit |
| 81 | [farion1231/cc-switch](https://github.com/farion1231/cc-switch) | 122K | Aug 2025 | 339 | Rust | Tauri desktop switcher for Claude Code / Codex / OpenCode / OpenClaw / Hermes |
| 94 | [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | 111K | Nov 2025 | 460 | Python | Design-intelligence skill for 10+ agents |

For scale: `build-your-own-x` at #1 took eight years to reach 533K (177★/day). React is at 247K after thirteen years (~52★/day). A markdown file with four rules for CLAUDE.md is pulling **20× React's lifetime rate**.

Overall composition of the top-100: 33 repos are AI/LLM-related, 17 of them are agent harness tooling specifically, and 16 of those 17 are younger than 18 months. Learning resources still hold #1–#5 and #8–#13; infrastructure (linux, vscode, react, node, kubernetes) is stable but no longer where the attention flows.

---

## Why this matters for us

**1. Markdown is now a shippable product.** Five of the sixteen contain effectively zero application code — `andrej-karpathy-skills` is literally one CLAUDE.md. This is the strongest available evidence for [[harness-engineering-summary|harness engineering]]: the leverage is in the instructions, not the runtime. [[project-solo-factory|solo-factory]] (27 skills) is in exactly this category and is competing in a category that now has a top-100 ceiling.

**2. gstack is the closest public analogue to solo-factory.** Garry Tan packages 23 slash commands as roles — CEO, eng manager, designer, reviewer, QA lead, security officer (OWASP + STRIDE), release engineer. Ours are pipeline stages (`/research → /validate → /plan → /build → /launch`). Two different decompositions of the same problem: **roles vs stages**. Worth stealing: `/office-hours` (describe what you're building, get product pushback before planning), `/qa` against a live staging URL with a real browser, and a security-officer pass as a gate rather than an afterthought. His productivity claim — 11.4K logical lines/day in 2026 vs 14/day in 2013, with a published reproduction script — is the first serious attempt to measure the solo-with-agents delta instead of asserting it.

**3. "Taste skills" are a new category.** In the same week's trending list: [ponytail](https://github.com/DietrichGebert/ponytail) ("makes your agent think like the laziest senior dev in the room"), [hallmark](https://github.com/Nutlope/hallmark) (anti-AI-slop design skill), [impeccable](https://github.com/pbakaus/impeccable) ("design language that makes your harness better at design"). These encode judgment, not procedure — the opposite of a checklist skill. Our `/humanize` is the same species. See [[agent-toolkit-landscape]] for the full category map.

**4. Rust holds the desktop/utility layer.** Five Rust repos in the top-100 (claw-code, cc-switch, rustdesk, rust-lang, tauri) plus `herdr` (agent multiplexer) trending. cc-switch specifically = Rust + Tauri for a cross-platform agent-provider desktop app, which is the exact shape of our tooling preference. See [[rust-agent-ecosystem]] and [[moltis-rust-agent]].

**5. Privacy/self-hosting is structurally in the top-100, not a niche.** awesome-selfhosted (#11), open-webui (#56), immich (#98), prompts.chat marketing itself on "self-host for complete privacy", OpenClaw's entire pitch being "runs on your own devices." [[privacy-first]] is a market position, not just an ethic.

---

## The skeptical half

**Stars stopped being a quality signal.** claw-code sits at #27 with 195K stars and 1611★/day — the highest velocity in the entire top-100 — and its README is a badge wall pointing at two other harnesses, describing itself as "an agent-managed museum exhibit." Several others in the cohort are single-file repos with 12-language README translations, Discord funnels, and star badges served from their own API. Rank in this chart measures distribution mechanics (X threads, agent-ecosystem cross-promotion, install one-liners), not code you'd want to depend on. Read the repo before citing the number — the same discipline as [[paperclip-agent-company|Paperclip]], where the "zero-human" framing turned out to be marketing over five genuinely good mechanics.

**And the underlying data just closed.** GitHub restricted the stargazers API on **6 July 2026** (announced 30 June): who-starred-when is now visible only to repo admins and collaborators. Star History can no longer draw growth curves for repos you don't own; embedded README charts for third-party repos are broken with no workaround yet. Practical consequences for us:

- Star **trajectories** for other people's repos are gone. Only point-in-time totals remain — this page is a snapshot, and it cannot be reconstructed retroactively.
- Any scraper that used star velocity as a traction proxy needs a new signal. The working substitute is activity data from GH Archive — that's how star-history's own [coding-AI leaderboard](https://www.star-history.com/coding-ai-leaderboard) now ranks tools (PR reviews, PRs opened, pushes) instead of stars. Jun 29 – Jul 28 2026: Copilot 7 874 PR reviews, CodeRabbit 6 575, Codex 4 372, Cursor 81 216 pushes.

---

## Currently trending (22–28 Jul 2026)

Weekly leaders, useful as an early-warning list: [mattpocock/skills](https://github.com/mattpocock/skills), [OmniRoute](https://github.com/diegosouzapw/OmniRoute) (MIT AI gateway, 290+ providers, token compression), [worldmonitor](https://github.com/koala73/worldmonitor) (real-time geopolitical intel dashboard), [Orca](https://github.com/stablyai/orca) (ADE for a fleet of parallel agents), [pi](https://github.com/earendil-works/pi) (unified LLM API + agent loop + TUI), [ponytail](https://github.com/DietrichGebert/ponytail), [Graphify](https://github.com/Graphify-Labs/graphify) (see [[graphify-vs-solograph]]), [hallmark](https://github.com/Nutlope/hallmark), [herdr](https://github.com/ogulcancelik/herdr) (Rust agent multiplexer), [alibaba/open-code-review](https://github.com/alibaba/open-code-review) (deterministic pipeline + LLM agent hybrid).

---

## Related

[[skills-standard]] · [[agent-toolkit-landscape]] · [[harness-engineering-summary]] · [[writing-claude-md]] · [[project-solo-factory]] · [[hermes-agent]] · [[paperclip-agent-company]] · [[agent-benchmarks]] · [[rust-agent-ecosystem]] · [[privacy-first]] · [[graphify-vs-solograph]]
