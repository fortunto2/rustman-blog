---
type: concept
title: "BroCheck: a 50-minute build where a decision model, not an LLM, judges two photos"
description: "OC AI Builders Lightning Hackathon (EvoNexus, Irvine, 21 Oct 2026, theme decision models plus LLMs): BroCheck and Mama Approves send photos to TypeSafe's Jev with typed questions and compose the verdict in code, with no LLM anywhere."
created: 2026-10-26
tags: [hackathon, decision-models, jev, calibration, images, structured-output]
publish: true
publish_as: post
learned_from: "~/startups/hackathons/2026-10-21-oc-lightning-jev (README.md, CLAUDE.md, Makefile, app/decide.py, app/modes.py, app/server.py, app/index.html, app/local.html); https://github.com/fortunto2/mama-approves; wiki/jev-system-one.md (the twelve demos)"
index_line: "Post: OC AI Builders Lightning Hackathon (EvoNexus Irvine, 21 Oct 2026, Vivek Haldar, Nebius, theme decision models + LLMs, 50-min build, ~12 demos), team of 3. BroCheck: two photos → one Jev call, 9 typed questions (vibe, smiles, style, red flag, same person, relationship...) → score = 0.35 vibe + 0.15 smile + 0.25 style + 0.25 friends in code; same person > 0.7 → 'that's you'; unsure → 'get a better pic'. Mama Approves: 10 questions, mom's rules as weights, gate 0.6 → REVIEW. Gotchas: image header, every question re-sends the image (shrink to 768 px), ask 'empty plate?' separately. After: per-IP daily budget on the shared key + BYOK, /local CLIP ViT-B/32 int8 in browser. Room: ImageKit delete gate, Kill Bill watchdog, SiteScout, JSON-LLM 7/17 confidently wrong. Placement not recorded"
index_section: "concept"
---

# BroCheck: a decision model, not an LLM, judges two photos

The OC AI Builders Lightning Hackathon took one evening, 21 October 2026, at EvoNexus in Irvine. Vivek
Haldar ran it with support from Nebius, the theme was "decision models plus LLMs", and the build window
was 50 minutes. About a dozen teams demoed afterwards. Most of them used Jev, TypeSafe's decision
model: it takes unstructured input and typed questions, and returns calibrated probabilities instead
of text ([[jev-system-one]] has the details). I built with two teammates.

## The problem

The joke was the vehicle. Mama Approves answers "would my mom approve this food?" from one photo.
BroCheck takes your selfie and their photo and says whether you look like a couple, best friends, gym
buddies, coworkers or strangers, or whether you just uploaded yourself twice. The point underneath: a
closed judgment does not need an LLM writing prose. It needs a few typed questions and a formula you
can read.

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

## Demo and result

The pitch was five slides inside the app, one of them showing the latest verdict pulled from the
log, with a QR code to the site. Placement and judges' feedback were not recorded.

Later the same evening the build got a public address and two more features. The site runs at
[bro.rustman.org](https://bro.rustman.org), served from a laptop through a Cloudflare tunnel, so it is
up only while that machine serves it. The shared TypeSafe key got a budget per IP per day, and a
visitor's own key skips it. A `/local` page does the same job with no server and no key: CLIP
ViT-B/32 at int8 in the browser through transformers.js, zero-shot over a side-by-side composite for
the relationship and cosine similarity between the two photos for "same person". Its footer says the
honest part: softmax, not calibrated like Jev. Laya, the open reproduction of Jev, reads text only, so
it could not take this job ([[laya-open-jev-on-mac]]).

## What the other teams built

My notes on the twelve demos are in [[jev-system-one]]. The filter came first: the demos with no
closed question to ask (a trip planner, a memory-palace app, a therapist journal) did not use a
decision model at all. The ones that worked put it in one of six jobs. Three stood out:

- **ImageKit** let a Claude Code agent clean a media library; a hook catches the delete batch before
  the API sees it, and Jev sends anything live or in an active campaign back to the human.
- **Kill Bill** streams a coding agent's output into Jev and kills the run when it goes wrong. One run
  stopped at token 68 with p=0.97, on an import outside the allowed list.
- **SiteScout** scores map hexagons for where to open a shop with Jev, and calls Llama only to explain
  a score when you click one.

One builder ran 17 of his own routing cases through five lanes. A local LLM asked for JSON was wrong 7
times while claiming 90 to 95% confidence; none of the decision models was confidently wrong. His line
for it: "The model advises. Code controls."

## What I took from it

- If the output is a choice, a score or a yes/no, ask the closed question and keep the formula in
  code. Changing mom's taste is editing a number.
- "Unsure" is an answer. "Get a better pic" beats a confident wrong verdict, and it is a threshold, not
  a prompt.
- One call, many answers: nine probabilities in one request is cheaper and easier to debug than nine
  LLM calls or one long one.

The next day I used the same gate with a local model in [[superset-hackathon-consentshield-2026]]:
act alone above 0.8, otherwise ask the human. Two days later Jev judged sky photos for smoke in Crew
Air at [[stanford-cleantech-hackathon-2026]]. Every event: [[hackathons]].

Links: [repo](https://github.com/fortunto2/mama-approves) · [site](https://bro.rustman.org).
