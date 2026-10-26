---
type: concept
title: "AI Apprentice: a voice agent that asks an expert why, built overnight at Hack-Nation"
description: "Hack-Nation 7 (3-4 Oct 2026, ElevenLabs challenge, Stanford hub in Palo Alto): an apprentice that watches an expert's screen, asks why at the right pause, turns the answers into machine-checkable guardrails and tutors the next hire."
created: 2026-10-26
tags: [hackathon, voice, elevenlabs, screen-understanding, agents, guardrails, evals]
publish: true
publish_as: post
learned_from: "~/startups/hackathons/hacknation-ai-apprentice (README.md, CLAUDE.md, docs/plan.md, docs/pitch.md, docs/demo-script.md, docs/challenge-01-elevenlabs.txt); https://github.com/fortunto2/ai-apprentice"
index_line: "Post: Hack-Nation 7 (3-4 Oct 2026, Stanford hub Palo Alto, ElevenLabs challenge 01), AI Apprentice, ~18 h, team of 2. Capture: tab frame every 1.5 s, 64×36 gray diff ≥1.2% → Gemini returns events not video, PII masked; pause gate (3 s idle, VAD, ≥40 s since last question, 3-5 per 10 min). Map: SGR cascade → Work Map + gaps, spoken debrief + teach-back. Each guardrail twice: expert's quote + `when → must` check → tutor stops the save, agent export stops a queue at an unknown supplier. Eval: real ElevenLabs agent over text WebSocket vs Gemini-played expert, 23/23. Gemini free tier 20 req/model/key/day → 5 models × 2 keys, BYOK, labelled recorded fallback. Placement not recorded"
index_section: "concept"
---

# AI Apprentice: a voice agent that asks an expert why

![Work Map: every step links the screen moment, the decision, the expert's words and the guardrails](/images/posts/hack-nation-ai-apprentice-2026/work-map.jpeg)

Hack-Nation's 7th Global AI Hackathon ran from Saturday 3 October to a 06:00 PT deadline on Sunday 4
October 2026, online and through local hubs. I worked from the Stanford hub at the Nordic Innovation
House in Palo Alto. I took Challenge 01, set by ElevenLabs, "The AI Apprentice", and built it in about 18
hours in a team of two: I wrote the code, my teammate tested it and played the new hire in the demo.
The submission went to the HackOS platform: three videos of up to 60 seconds each, a team photo, a
public repo and a live URL, plus a separate Google Form.

## The problem

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
- **Trust.** "Off the record" is both a button and a tool; it strikes the last 60 seconds. Changed
  frames go to the vision model to become events, but the session and its frames are stored only in
  the browser, not on a server.

The part I would build again is how guardrails are stored. The synthesis writes each rule twice: in
the expert's words and as a check, for example `when amount > 5000 → must cost_center = 0400`. That one
JSON file feeds three consumers. The tutor's checker runs it against the new hire's screen state. It
exports as instructions an agent can load. And in the stretch module, an agent works a queue of five
new invoices from it: codes the €6,400 spindle to capex with the asset number from the invoice text,
holds the December freight bill, saves the routine one, and stops at a supplier the expert never
mentioned, with a button for the controller to approve and continue.

## Tested without a microphone

`pnpm eval` drives the real ElevenLabs agent over a text-only WebSocket, with Gemini playing the expert
and scripted screen events, then checks the brief's requirements as invariants: at least three
questions at pauses, never asking what the screen shows, every Work Map step with a frame, quotes
verbatim, the off-the-record part absent, the tutor stepping in before the save. The last run passed
23 of 23. The same run writes a demo session with real frames, transcript and a confirmed Work Map,
which is what a judge without a microphone sees on the map and teach pages.

## Demo and result

The project went in at 00:32 PT, the Google Form at 00:38, and the final revision carried three videos
of 29, 39 and 43 seconds narrated with ElevenLabs text-to-speech. The rest of the night was about
keeping the demo alive for judges who would open it later:

- Gemini's free tier turned out to be 20 requests per model per key per day, and a full capture run
  needs about 30. The server rotates over five models and two keys, and a Keys button lets a visitor
  paste their own ElevenLabs and Gemini keys, stored only in their browser.
- When the quota is gone, the agent page replays a recorded live run of the same Work Map (all five
  invoices correct) and labels it as a replay on every card.
- From 01:50 PT I stopped running smoke tests so the remaining quota went to the judges, and watched
  production until the deadline: every page answered 200 for four hours.

Placement and judges' feedback were not recorded.

## What the other teams built

Not recorded. I kept no survey of the other Hack-Nation submissions.

## What I took from it

- A pause gate made of measurable conditions does what "please don't interrupt" in a prompt cannot.
- Store a rule as the person's words plus a machine check. The words teach, the check enforces, and
  both come from the same session.
- Let a model play the human in the eval. It turned "did the agent ask at a natural pause" into
  something a script can assert at 2 a.m.
- Free tiers run out while judges are still looking. A labelled replay is better than a dead page.

The same Sunday, a few hours later, I built [[neon-personal-agents-life2film-director-2026]], where a
user's corrections become durable rules for a video agent: the same idea pointed at taste instead of
procedure. The privacy half of this build (PII masked before it reaches the record) became the whole
product in [[superset-hackathon-consentshield-2026]]. Every event: [[hackathons]].

Links: [repo](https://github.com/fortunto2/ai-apprentice) · [live demo](https://ai-apprentice-nu.vercel.app) ·
[architecture page](https://ai-apprentice-nu.vercel.app/architecture) · related: [[schema-guided-reasoning]].
