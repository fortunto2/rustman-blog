---
type: concept
title: "ConsentShield: consent checked at the moment an agent takes your screen"
description: "super{set} national renaissance hackathon (San Francisco, 22 Oct 2026, personal agents and data privacy track): an on-device gate that enforces consent per purpose before a cloud agent sees the screen, and why its zero-shot local model still hands three lines in ten to the human."
created: 2026-10-26
event_date: 2026-10-22
tags: [hackathon, privacy, consent, agents, mcp, local-models, decision-models, ocr]
publish: true
publish_as: post
learned_from: "~/startups/hackathons/2026-10-22-superset-consent (README.md, CLAUDE.md, docs/SUBMISSION.md, docs/CONTEXT.md, docs/ROADMAP.md, docs/mcp-transcript.md, consent/gate.py, app/server.py, tests/test_policy.py); https://github.com/fortunto2/consentshield"
index_line: "Post: super{set} national renaissance hackathon (SF, 22 Oct 2026, track personal agents + data privacy; studio behind Ketch), ConsentShield, solo, one day, with a self-critique. Gate on the Mac between screen and cloud agent: Apple Vision OCR → detectors (secrets, cards, money, injection; credentials locked) → Laya (open Jev, 322M, ~30 ms/line) picks the data category → consent per category × purpose (assistant/analytics/training/third party) → ≥0.8 send or blur alone, else hold blurred and ask; ledger keeps category + outcome, never text. MCP screenshot(purpose). Measured on 3 synthetic screens: 6 of 20 regions asked (chat 7 → 2 sent/2 blurred/3 asked); 0.16-0.32 s after warm-up. Weak: Laya zero-shot, 0.8 taken from an article, unsure lines framed as a feature in the day's notes; per-line answers live in the browser tab (MCP/CLI don't see them); 7 tests, none loads the model; README and MCP run disagree on the chat counts. Neighbour-line context made Laya worse (biopsy → ask, address → allow), off by default. Placement not recorded"
index_section: "concept"
---

# ConsentShield: consent checked at the moment an agent takes your screen

![Your screen on the left, what the cloud agent receives on the right, the consent matrix below (all data synthetic)](/images/posts/superset-hackathon-consentshield-2026/demo.png)

ConsentShield's strong idea is consent per purpose, enforced per frame on the device, before a cloud
agent sees the screen. Its weak part is the model that sorts the lines. On the three sample screens
the local model was unsure about 6 of 20 lines and handed them to the human. Failing closed is the right default; a gate that asks about
three lines in ten is not yet one you would leave running.

## The short version

- **Consent at the point of action.** Data categories against purposes (assistant, analytics,
  training, third party), the model consent platforms already use for websites, checked per frame.
  Switch the purpose to training and almost everything blurs.
- **Some things no model can release.** Keys and card numbers are blurred by regex, and credentials
  have no consent toggle at all.
- **The threshold was borrowed.** Act alone at 0.8 comes from an article on decision models, not from a
  measurement of this model on these categories.
- **More context made it worse.** Given the neighbouring lines, the model sent the biopsy line to
  "ask" and an address to "allow".
- **Thin evidence.** Three measured synthetic screens and seven tests, none of which loads the model.

## The event

The super{set} national renaissance hackathon ran on Thursday 22 October 2026 in San Francisco:
hacking from 10:30, projects due at 17:00, demos for an hour, winners at 18:30. super{set} is a startup
studio, and one of its portfolio companies, Ketch, sells privacy and consent management, so the
second of the two tracks, "personal agents and data privacy, user consent", was home turf for the
judges. The "renaissance engineer" theme asked for four things at once: the technology, the user need,
the business and the system impact. I entered the privacy track, solo.

Personal agents now see the screen: computer-use agents, "remember everything" assistants, Claude
through MCP. Every screenshot they send to the cloud carries whatever was open: a chat about a biopsy,
a bank balance, an `.env` file. Consent today is a cookie banner on a website. Nothing asks at the
moment an agent actually takes your data.

## What I built

A gate that sits between the screen and the agent and runs entirely on the Mac:

1. **OCR on the device.** Apple Vision through a small Swift helper returns text lines with boxes.
2. **Detectors first.** Deterministic rules for secrets, card numbers, money amounts and prompt
   injection, which no model can be talked out of.
3. **A local decision model.** Laya, the Apache 2.0 reproduction of TypeSafe's Jev (mmBERT-base, 322M
   parameters, about 650 MB), answers one typed question per line: which data category is this, with
   a calibrated confidence. About 30 ms per line on the Mac's GPU.
4. **Your consent per purpose.** A matrix of categories (credentials, financial, health, private
   message, contact info, work, public) against the four purposes.
5. **Act or ask.** At confidence 0.8 or above the gate sends or blurs on its own, the rule from Vivek
   Haldar's article on decision models in agent harnesses. Below it, the line stays blurred and goes
   into a "waiting for you" queue. Your answer decides that line, and the ledger records it as a human
   decision.

Nothing leaves the Mac before the decision. The consent ledger stores category, purpose and outcome
for every frame, never the text. No LLM sits anywhere in the gate: an LLM can be the agent behind it,
but it never decides what that agent may see.

The same gate is an MCP server. The agent calls `screenshot(purpose)` and gets the redacted frame plus
a list of what was held back and why. Claude Code, pointed at the personal-chat sample, reported: "I
can read only one line: the sprint planning doc. The other 6 regions are blurred. No raw personal data
reached me."

What existed before: [[cyberdefense-hackathon-screenshield-2026]] from 13 days earlier, whose OCR
helper and detectors this reuses; the Laya port to ONNX and Core ML with measurements; and BroCheck
from the day before. What was built that day: the consent layer, the policy, the gate, the money
detector, the ledger, the web demo, the MCP server, the synthetic screens, the CLI and the tests.

## Measured on the synthetic screens

Purpose set to assistant, on an M-series Mac:

| Screen | Text regions | Sent | Blurred | Asked | Time |
|---|---|---|---|---|---|
| Personal chat | 7 | 2 | 2 | 3 | 1.4 s (first frame, warm-up) |
| Bank dashboard | 7 | 1 | 5 | 1 | 0.16 s |
| Work inbox with an injection | 6 | 2 | 2 | 2 | 0.32 s |

The "ignore previous instructions" line in the inbox never reaches the agent.

Giving Laya the neighbouring lines as context made it worse, so context stays off by default. The
README states the limits: Laya is small and often unsure on short chat lines (0.2 to 0.4), which is
why so many of them go to the human, and OCR boxes are per line, not per word.

## What does not hold yet

The purpose matrix and the hard locks hold: a privacy team can audit both, and no prompt reaches
either. The rest is thinner:

- **The model is zero-shot.** Laya was never calibrated on these seven categories; the roadmap's plan
  is to use the user's answers as labels. The day before, on one builder's routing cases, zero-shot
  Laya got about 9 of 17 and was never wrong while 90% sure. That supports a high bar, not this one.
- **Line answers stay in the browser tab.** The web console sends your per-line answers with each
  request; the MCP server never gets them, and a reload loses them. Only category consent persists in
  the policy file.
- **It guards what it is asked for.** The gate sees the frames an agent requests through it. An agent
  that captures the screen some other way never meets it.

## Demo and result

For the stage there was a five-slide deck inside the page and a rehearsed path through the live
console: a chat sample, an answer to one of the asks, a purpose switch, the inbox injection. A
34-second demo video with voice-over and a static page on GitHub Pages with the recorded gate results
stay up without the Mac.

## What I took from it

- Fail closed, then measure how often it asks, because a gate that asks too often gets switched off.
- Three builds in 13 days fed each other: ScreenShield gave the OCR and detectors, BroCheck the day
  before gave practice with typed questions and thresholds, the Laya measurements gave the local model.

## How this was put together

Written from the repo: README, submission text, the day's context and roadmap notes, the recorded MCP
transcript, the gate code and the tests. Every name, number and diagnosis on the sample screens is
invented. The README table and the recorded MCP run disagree on the same chat screen (2 sent and 2
blurred against 1 sent and 3 blurred, 3 asked in both), and the repo does not say why. Placement and
judges' feedback were not recorded, and I kept no survey of the other super{set} projects.

Siblings: [[oc-lightning-hackathon-brocheck-2026]] the day before (the same act-or-ask gate with
hosted Jev on images) and [[cyberdefense-hackathon-screenshield-2026]] (the fast loop this reuses).
The model itself: [[laya-open-jev-on-mac]]. Every event: [[hackathons]].

Links: [repo](https://github.com/fortunto2/consentshield) · [recorded demo page](https://fortunto2.github.io/consentshield/).
