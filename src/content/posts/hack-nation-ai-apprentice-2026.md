---
type: concept
title: "AI Apprentice: a voice agent that asks an expert why, built overnight at Hack-Nation"
description: "Hack-Nation 7 (3-4 Oct 2026, ElevenLabs challenge): a voice apprentice that stores each expert rule as her words plus a machine check, and why its 23-of-23 eval, one scripted case with a model playing the expert, proves less than it looks."
created: 2026-10-26
event_date: 2026-10-03
tags: [hackathon, voice, elevenlabs, screen-understanding, agents, guardrails, evals]
publish: true
publish_as: post
learned_from: "~/startups/hackathons/hacknation-ai-apprentice (README.md, CLAUDE.md, docs/plan.md, docs/pitch.md, docs/demo-script.md, docs/challenge-01-elevenlabs.txt, app/eval/cases); https://github.com/fortunto2/ai-apprentice"
index_line: "Post: Hack-Nation 7 (3-4 Oct 2026, Stanford hub Palo Alto, ElevenLabs challenge 01), AI Apprentice, ~18 h, team of 2, with a self-critique. Keep: each guardrail twice, expert's quote + `when → must` check → tutor stops the save, agent export stops a queue at an unknown supplier; pause gate in code (3 s idle, VAD, ≥40 s since last question, 3-5 per 10 min). Weak: eval 23/23 is one case (sabine-invoicing) with Gemini playing the expert; sandbox ERP posts structured state to the checker; PII masked in Gemini's output, so changed frames leave the browser first unless the on-screen mask is on. Capture: tab frame every 1.5 s, 64×36 gray diff ≥1.2% → Gemini returns events. Gemini free tier 20 req/model/key/day → 5 models × 2 keys, BYOK, labelled recorded fallback. Placement not recorded"
index_section: "concept"
---

# AI Apprentice: a voice agent that asks an expert why

![Work Map: every step links the screen moment, the decision, the expert's words and the guardrails](/images/posts/hack-nation-ai-apprentice-2026/work-map.jpeg)

The part of AI Apprentice I would reuse is a storage format: every rule an expert explains is saved
twice, in her words and as a `when → must` check, and one JSON file drives a tutor, an agent and an
export. The evidence behind it is thin. The 23-of-23 eval is one scripted scenario with Gemini playing
the expert, and personal data is masked only after a changed frame has already reached Gemini.

## The short version

- **When to ask is code, not prompt.** Six measurable conditions in the browser, from 3 seconds of no
  input to at least 40 seconds since the last question, decide when the voice agent may speak.
- **One rule, three consumers.** `when amount > 5000 → must cost_center = 0400` stops the new hire's
  save, exports as agent instructions, and stops an agent at a supplier the expert never mentioned.
- **The 23 of 23 is one case.** One scripted session, a model playing the expert, a sandbox screen with
  invented data. No accounts-payable expert ever used it.
- **The privacy story is weaker than its label.** `[PERSON]` and `[IBAN]` come back from the cloud
  vision model, so the raw frame has left the browser before anything is masked.
- **Free tiers die before judging ends.** Gemini's gave 20 requests per model per key per day, against
  about 30 for one capture run. A labelled replay beat a dead page.

## The brief

Hack-Nation's 7th Global AI Hackathon ran from Saturday 3 October to a 06:00 PT deadline on Sunday 4
October 2026, online and through local hubs; I worked from the Stanford hub at the Nordic Innovation
House in Palo Alto. I took Challenge 01, set by ElevenLabs, "The AI Apprentice", and built it in about
18 hours in a team of two.

The brief came with one scene. Sabine has run accounts payable at a machine builder for 24 years. She
moves one invoice to capex without a word, holds a second because that supplier double-bills every
December, and sends a third for a second approval because it comes from the Czech subsidiary. Lena,
who started on Monday, catches half of it. Sabine retires in 18 months.

A screen recording shows what Sabine clicked and says nothing about why. The brief asked for three
working modules: a capture session where a voice agent asks at least three questions at natural
pauses, one of them about a guardrail; a debrief with at least three follow-ups and a teach-back the
expert confirms; and a tutor that catches at least one wrong decision before it is saved, on a case
the expert never showed. "Interrupts mid-typing" and "summary written afterwards" were listed as the
weak answers.

## What I built

One Next.js 16 app with a sandbox accounts-payable screen full of invented data, an ElevenLabs agent,
and Gemini for vision and synthesis. The server pipeline runs on Effect 4 (typed errors, retry,
timeout, key rotation), the schemas are Effect Schema, and the session lives in the browser's
IndexedDB.

- **Capture.** The expert shares a tab. Every 1.5 seconds the browser shrinks the frame to 64×36
  grayscale and diffs it against the last one; only a change of 1.2% or more goes to the vision model,
  which returns events instead of video ("cost center 4711 → 0400") with `[PERSON]`, `[IBAN]` and
  `[EMAIL]` in place of personal data.
- **When to ask.** The pause gate is code in the browser, not a sentence in the prompt: no keys or
  mouse for 3 seconds, no speech from the user, the agent itself silent, at least 40 seconds since the
  last question, something new on screen, and a budget of 3 to 5 questions per 10 minutes. Screen
  events reach the agent as context it must not answer, and the prompt forbids asking what the screen
  already shows. Unasked events roll into the debrief.
- **Map.** "That's it, I'm done" starts a schema-guided cascade (observations, step boundaries,
  quotes, guardrail evidence, map) that produces a draft Work Map and a list of open gaps. The agent
  asks at least three gap questions out loud, explains the process back, takes a correction ("the
  limit is net, without VAT") and records the confirmation through a client tool.
- **Teach.** On a case Sabine never saw, the tutor asks the new hire to predict the next decision,
  pauses the save when it would break a guardrail ("Sabine would stop here. Why do you think?"), and
  replays Sabine's moment as 8 seconds of the recorded screen with her quote.
- **Trust.** "Off the record" is both a button and a tool; it strikes the last 60 seconds. The session
  and its frames are stored only in the browser, not on a server.

The part I would build again is how guardrails are stored. The synthesis writes each rule twice: in
the expert's words and as a check. That one JSON file feeds three consumers. The tutor's checker runs
it against the new hire's screen state. It exports as instructions an agent can load. And in the
stretch module, an agent works a queue of five new invoices from it: codes the €6,400 spindle to capex
with the asset number from the invoice text, holds the December freight bill, saves the routine one,
and stops at a supplier the expert never mentioned, with a button for the controller to approve and
continue.

`pnpm eval` drives the real ElevenLabs agent over a text-only WebSocket, with Gemini playing the expert
and scripted screen events, then checks the brief's requirements as invariants: at least three
questions at pauses, never asking what the screen shows, every Work Map step with a frame, quotes
verbatim, the off-the-record part absent, the tutor stepping in before the save. The last run passed
23 of 23. Letting a model play the human turned "did the agent ask at a natural pause" into something a
script can assert at 2 a.m. The same run writes the demo session a judge without a microphone sees.

## What does not hold yet

- **One scenario, played by a model.** The eval has one case file (`sabine-invoicing`), the tutor one
  unseen invoice (INV-4480), both from the brief's own scene. 23 of 23 proves the agent meets the
  brief's invariants, not that a real expert's answers turn into good rules.
- **The checker reads easy state.** The sandbox screen is an iframe that posts its own field changes
  to the app, so the new hire's decisions arrive structured. On a real ERP they would have to come from
  the vision events, and that path is untested.
- **Masking happens after the upload.** The placeholders are in Gemini's answer; only the optional
  on-screen mask blurs personal data before capture. The pitch notes said frames are "never uploaded".
  Changed frames are.
- **Judges may have seen a replay.** Once the shared quota ran out, the agent page replayed a recorded
  live run of the same Work Map (all five invoices correct), labelled as a replay on every card.

## Demo and result

The project went in at 00:32 PT, the Google Form at 00:38, with three videos of 29, 39 and 43 seconds
narrated with ElevenLabs text-to-speech. The rest of the night went to keeping the demo alive for
judges who would open it later. A full capture run needs about 30 Gemini requests, so the server
rotates over five models and two keys, and a Keys button lets a visitor paste their own ElevenLabs and
Gemini keys, stored only in their browser. From 01:50 PT I stopped running smoke tests so the remaining
quota went to the judges, and watched production until the deadline: every page answered 200 for four
hours.

## How this was put together

Written from the repo and its docs (README, plan, pitch, demo script, the challenge brief, the eval
case). I wrote the code; my teammate tested it and played the new hire in the demo. The submission went
to the HackOS platform: three videos of up to 60 seconds each, a team photo, a public repo and a live
URL, plus a separate Google Form. Placement and judges' feedback were not recorded, and I kept no
survey of the other Hack-Nation submissions, so there is no field to compare against here.

The same Sunday, a few hours later, I built [[neon-personal-agents-life2film-director-2026]], where a
user's corrections become durable rules for a video agent: the same idea pointed at taste instead of
procedure. Masking personal data on the device, before anything leaves it, became the whole product in
[[superset-hackathon-consentshield-2026]]. Every event: [[hackathons]].

Links: [repo](https://github.com/fortunto2/ai-apprentice) · [live demo](https://ai-apprentice-nu.vercel.app) ·
[architecture page](https://ai-apprentice-nu.vercel.app/architecture) · related: [[schema-guided-reasoning]].
