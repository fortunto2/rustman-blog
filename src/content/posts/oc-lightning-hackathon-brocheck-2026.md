---
type: concept
title: "BroCheck: a 50-minute build where a decision model, not an LLM, judges two photos"
description: "OC AI Builders Lightning Hackathon (EvoNexus, Irvine, 21 Oct 2026): BroCheck and Mama Approves ask TypeSafe's Jev typed questions and compose the verdict in code with no LLM, and why calibrated answers under a hand-set formula still make an uncalibrated verdict."
created: 2026-10-26
event_date: 2026-10-21
tags: [hackathon, decision-models, jev, calibration, images, structured-output]
publish: true
publish_as: post
learned_from: "~/startups/hackathons/2026-10-21-oc-lightning-jev (README.md, CLAUDE.md, Makefile, app/decide.py, app/modes.py, app/server.py, app/index.html, app/local.html, data/verdicts.jsonl); https://github.com/fortunto2/mama-approves; wiki/jev-system-one.md (the twelve demos)"
index_line: "Post: OC AI Builders Lightning Hackathon (EvoNexus Irvine, 21 Oct 2026, Vivek Haldar, Nebius, theme decision models + LLMs, 50-min build, ~12 demos), team of 3, with a self-critique. BroCheck: two photos → one Jev call, 9 typed questions → score = 0.35 vibe + 0.15 smile + 0.25 style + 0.25 friends in code; same person > 0.7 → 'that's you'; unsure → 'get a better pic'. Mama Approves: 10 questions, mom's rules as weights, gate 0.6 → REVIEW. Weak: weights hand-set, composite never checked, no labelled test set (13 logged verdicts), relationship questions have no ground truth, 'expired' hard-codes today's date. Gotchas: image header, every question re-sends the image (shrink to 768 px), ask 'empty plate?' separately. After: per-IP daily budget + BYOK, /local CLIP ViT-B/32 int8 in browser. Room: ImageKit delete gate, Kill Bill watchdog (token 68, p=0.97), SiteScout, kitchen router; JSON-LLM 7/17 confidently wrong, zero-shot Laya ~9/17. Placement not recorded"
index_section: "concept"
---

# BroCheck: a decision model, not an LLM, judges two photos

BroCheck's useful part is a pattern: nine typed questions in one call to TypeSafe's Jev, a verdict
composed in code, and "Get a better pic" when the model is unsure. Its weak part is the formula on top.
Jev returns probabilities TypeSafe calls calibrated, but the weights that turn them into a verdict were
set by hand in a 50-minute build, and a question like "would they be friends" has no ground truth to
calibrate against.

## The short version

- **A closed judgment needs no LLM.** Nine probabilities in one request, about a second, cheaper and
  easier to debug than nine LLM calls. Changing mom's taste is editing a number.
- **"Unsure" is a threshold, not a prompt.** "Get a better pic" and REVIEW beat a confident wrong
  verdict.
- **Calibration stops at Jev's output.** The weighted score built on top was never checked against
  anything: there is no labelled test set, and the whole verdict log holds 13 entries.
- **Decision models were never confidently wrong** on one builder's 17 routing cases; an LLM asked for
  JSON was, 7 times.

## The event

The OC AI Builders Lightning Hackathon took one evening, 21 October 2026, at EvoNexus in Irvine. Vivek
Haldar ran it with support from Nebius, the theme was "decision models plus LLMs", and the build window
was 50 minutes. About a dozen teams demoed afterwards. Most of them used Jev, TypeSafe's decision
model: it takes unstructured input and typed questions, and returns calibrated probabilities instead
of text ([[jev-system-one]] has the details).

The joke was the vehicle. Mama Approves answers "would my mom approve this food?" from one photo.
BroCheck takes your selfie and their photo and says whether you look like a couple, best friends, gym
buddies, coworkers or strangers, or whether you just uploaded yourself twice.

## What we built

Python 3.13 with uv, the `typesafe-sdk` `system_one` call, and FastAPI behind a phone-friendly page.
One request per verdict, about a second.

**Mama Approves** sends the photo as state with ten questions: is there food, is the plate empty,
home-made, vegetables, a warm meal, junk food, portion size on a five-step scale, an expired date,
the likely allergen, and the category. Mom's taste is a dictionary of weights in code (home-made 0.25,
vegetables 0.25, no junk 0.20, warm meal 0.15, portion 0.15). Below 0.6 confidence on the category the
answer is REVIEW, not a guess, and an expired product caps approval at 0.1.

**BroCheck** sends two images, `me` and `them`, with nine questions: same vibe, both smiling, style
match, dress match, the biggest red flag (gym mirror selfie, car selfie, holding a fish, heavy
filters), is there a person, the same person, would they be friends, and which relationship fits. The
score is `0.35 × vibe + 0.15 × smile + 0.25 × style + 0.25 × friends`, times 0.8 if a red flag shows.
"Same person" above 0.7 returns "That's you. Go find a bro." No visible person, or low confidence on
the red flag, returns "Get a better pic." The relationship picks the line: partner gets "Text them",
best friend gets "that's your best friend, not your date".

Three details from the code are worth knowing before you send images to Jev:

- Images need the request header `TypeSafe-Danger-Zone-Images: true`.
- Every question that mentions the image re-sends it, so nine questions on a full-size phone JPEG
  return a 400. Shrink to 768 px first.
- Ask "is the plate empty?" as its own question, or an empty plate passes as a healthy meal.

## What does not hold yet

The shape transfers to any closed judgment. The numbers inside it do not. The weights, 0.35, 0.15,
0.25, 0.25 and the 0.8 red-flag penalty, were picked by hand, and the only check is `make
integration`: one sample that must print a decision. "Would they be friends" from two photos cannot be
checked against any outcome, so a calibrated probability there is a confident-looking opinion. And
Mama Approves writes today's date into the "expired" question, fine for a demo, not for a product.
Calibrated inputs do not make a calibrated verdict: if it matters, label a few dozen cases and fit
the weights.

## Demo and result

<iframe src="https://www.youtube-nocookie.com/embed/_GzPxIwRMgo" title="Is He My Bro? BroCheck, built in 50 minutes with Jev | OC AI Builders Hackathon, Irvine" style="width:100%;aspect-ratio:16/9;border:0;border-radius:8px;margin:1.5rem 0" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

The pitch on stage, 2:53: [why Jev](https://youtu.be/_GzPxIwRMgo?t=28) · [two photos, one match](https://youtu.be/_GzPxIwRMgo?t=42) · [Ask Mom](https://youtu.be/_GzPxIwRMgo?t=72) · [live demo, salad vs donut](https://youtu.be/_GzPxIwRMgo?t=111) · [live-coded in 15 minutes](https://youtu.be/_GzPxIwRMgo?t=138).

The pitch was five slides inside the app, one showing the latest verdict from the log, with a QR code
to the site. Later that evening the build got a public address,
[bro.rustman.org](https://bro.rustman.org), served from a laptop through a Cloudflare tunnel, so it is
up only while that machine serves it. The shared TypeSafe key got a budget per IP per day, and a
visitor's own key skips it. A `/local` page does
the same job with no server and no key: CLIP ViT-B/32 at int8 in the browser through transformers.js,
zero-shot over a side-by-side composite for the relationship and cosine similarity between the two
photos for "same person". Its footer says what that costs: softmax, not calibrated like Jev. Laya, the
open reproduction of Jev, reads text only, so it could not take this job ([[laya-open-jev-on-mac]]).

## What the other teams built

The demos with no closed question to ask (a trip planner, a memory-palace app, a therapist journal) did
not use a decision model at all. The ones that worked put it in one of six jobs. Four of them:

- **ImageKit** let a Claude Code agent clean a media library; a hook catches the delete batch before
  the API sees it, and Jev sends anything live or in an active campaign back to the human. The gate
  sits outside the agent, before the irreversible call.
- **Kill Bill** streams a coding agent's output into Jev and kills the run when it goes wrong. One run
  stopped at token 68 with p=0.97, on an import outside the allowed list. A decision model is cheap
  enough to read every chunk of a stream, which an LLM judge is not.
- **SiteScout** scores map hexagons for where to open a shop with Jev, and calls Llama only to explain
  a score when you click one. Decision and prose are separate calls with separate costs.
- **A voice kitchen copilot** routed each utterance to Jev: recipe question, next step, or timer. The
  router worked; the demo stumbled because step navigation still wanted an exact phrase.

One builder ran 17 of his own routing cases through five lanes. A local LLM asked for JSON was wrong 7
times while claiming 90 to 95% confidence; none of the decision models was confidently wrong, and
zero-shot Laya got about 9 of 17. His line for it: "The model advises. Code controls."

## How this was put together

Built with two teammates; written from the repo (code, README, the verdict log) and my notes
on the twelve demos, which are in [[jev-system-one]]. Placement and judges' feedback were not
recorded. The routing benchmark numbers were read off the builder's slides; the Jev and Laya figures
come from his notes, the rest are approximate.

The next day I used the same gate with a local model in [[superset-hackathon-consentshield-2026]]:
act alone above 0.8, otherwise ask the human. Two days later Jev judged sky photos for smoke in Crew
Air at [[stanford-cleantech-hackathon-2026]]. Every event: [[hackathons]].

Links: [repo](https://github.com/fortunto2/mama-approves) · [site](https://bro.rustman.org).
