---
type: concept
title: "Life2Film Director: a personal agent that learns your editing taste, built in a day at the Neon agents hack"
description: "Build Personal Agents Hack (Neon, San Francisco, 4 Oct 2026): a video agent built on a month of real footage, why most of its strength was built before the kickoff, and why 'it learns your taste' rested on one rule."
created: 2026-10-26
event_date: 2026-10-04
github: fortunto2/tech-week-agent
demo_url: "https://tech-week-agent.vercel.app"
video_url: "https://youtu.be/NAmEDA6vIEY"
tags: [hackathon, personal-agents, video, life2film, neon, mastra, hybrid-search, wasm]
publish: true
publish_as: post
learned_from: "~/startups/hackathons/2026-10-04-neon-personal-agents (README.md, CLAUDE.md, docs/plan.md, docs/plan-v2-reel-agent.md, docs/pitch.md, docs/tech-review.md, docs/hackathon-brief.txt); https://github.com/fortunto2/tech-week-agent"
index_line: "Post: Build Personal Agents Hack (Neon, Terra Gallery SF, 4 Oct 2026, ~200 hackers, kickoff of SF Tech Week), solo, one day, with a self-critique. Pivot 11:20 from conference concierge (room full of them) to Life2Film Director. Weak: engine, renderer, editing scripts and rules existed before kickoff, so the day built the agent glue; learning shown with one rule (11th, from one remark) and 'second cut is better' never measured; only OpenAI direct tested; hosted demo cannot transcribe or render. Neon Postgres days → clips → sentences/moments + rules table; Lakebase hybrid search (1536-d vectors + RU/EN BM25, RRF k=60); Mastra director, 10 tools; WASM 31 measurements/frame (26 s clip: 52 frames in 3.6 s); week as text (2,367 sentences, 163 clips), script in 97 s, 2-4 min trailer in 150-170 s. AI Gateway needed paid plan, Fly needed a card, Kernel not reached. BYOK hosted demo. Placement not recorded"
index_section: "concept"
---

# Life2Film Director: a personal agent that learns your editing taste

Life2Film Director ran on a month of my own real footage, and that cut both ways. The analysis
engine, the renderer and the editing rules all existed before the 10:30 kickoff, so what the day
proved is the agent around them, plus one learned rule. The pitch said the second cut beats the first;
nothing measured that.

## The short version

- **Pivot to the asset nobody else in the room had.** At 11:20, with about five hours of hacking left,
  I dropped the conference concierge the room was full of for a working video pipeline and a month of
  editing notes.
- **Real data, measured.** A week of 163 clips and 2,367 sentences became a script in 97 s and a 2 to 4
  minute trailer in 150 to 170 s.
- **"It learns" rests on one rule.** Ten rules were seeded from a month of corrections; the demo learned
  an eleventh from one remark. Whether the next cut got better was never measured.
- **The hosted demo cannot cut.** It covers memory, search and scripts. Speech, sidecars and renders
  need the Mac.

## The brief

The Build Personal Agents Hack opened SF Tech Week on Sunday 4 October 2026 at Terra Gallery in San
Francisco, with about 200 hackers. The brief was one line: build a personal agent that helps you or
your team with something in your personal life. Hacking ran from 10:30 to 16:30, the judges picked six
teams to present for two minutes plus one minute of questions, and the co-hosts brought the stack:
Neon (Postgres and an AI gateway), Mastra, Exa, Fly.io, Kernel, Executor, assistant-ui and AgentMail.
Using their tools was welcome but not required. Most of the judges were founders or leads of those same
companies. I worked solo, a few hours after submitting [[hack-nation-ai-apprentice-2026]] at the end of
an all-nighter.

The morning plan was a conference concierge: find Tech Week events by coordinates (1,300 of them,
against 68 from the place feed), rank them, RSVP the free ones through a real browser. By late morning
the room was full of conference-concierge agents, so at 11:20 I switched to the travel-vlog pipeline I
had brought. The problem it answers: people who shoot a lot and edit nothing, parents with an archive
nobody can search, vloggers who lose a night of editing per day. My own month: 160 clips a week from a
pocket camera, one night of editing per filmed day.

## What I built

A chat agent with three actions: upload clips, ask, get the cut.

1. **It knows the footage.** Each clip lands in Neon Postgres as `days → clips → sentences / moments`:
   speech from whisper with word timings, picture quality from the life2film engine (Rust compiled to
   WASM, 31 measurements per frame, shot boundaries), and a caption from a vision model. Clips can
   also arrive by email: the agent has its own AgentMail inbox.
2. **It remembers.** Every sentence and caption has a 1536-dimension embedding and a Russian plus
   English full-text index. Search runs both and fuses them with reciprocal rank fusion (40 candidates
   each, k=60), so "the sunset at the ocean" finds a picture even when nobody spoke.
3. **It writes the script.** "Cut a three-minute trailer of the week in the valley": the director reads
   the whole week as numbered text (2,367 sentences across 163 clips) plus the owner's standing rules,
   and writes `script.json` with a cold open, one hook line, three acts, speech kept as one track and
   cutaways that show what is being said.
4. **It renders.** The script becomes an OpenTimelineIO timeline and a Rust renderer cuts the mp4 in
   the background while the chat card shows progress, then a player.
5. **It learns.** "The first ten seconds are boring, I need a hook" becomes a row in a `rules` table,
   the script is revised and the opening re-cut. Each new rule shows up as a card.

The director is a Mastra agent with 10 tools, the chat is assistant-ui with a card per tool, and the
whole thing is one Next.js app. The hosted version analyses an uploaded clip in the visitor's browser
with the same WASM engine and sends only the scores and one frame.

What existed before the kickoff, and the README says so: the analysis engine, the renderer, the
editing scripts and the notes. What was written that day: the agent, the Neon schema and search, the
upload with live analysis, background renders, the learn-a-rule loop, the inbox, the UI, CI and the
video.

## Measured that day

| Step | Time |
|---|---|
| Ingest one week from existing analysis files | 163 clips, 2,367 sentences, 3,084 moments in about 4 min |
| New 26-second clip | 52 frames scored in 3.6 s (WASM), whisper about 20 s, caption about 4 s, embeddings about 2 s |
| Hybrid search | 0.5 to 1.2 s per query |
| Script for the whole week | 97 s |
| Render a 2 to 4 minute trailer | 150 to 170 s |
| Two freshly uploaded clips to a 35-second reel | 24 s |

## What holds and what does not

- **Holds: real footage, real timings.** Every number above comes from a month of actual clips, and
  the before-and-after list answers "what did you build today" before a judge asks.
- **The day's work is integration.** The engine, the renderer and the cutter behind the table were
  built earlier. The hackathon added the schema, search, the agent and its UI.
- **The learning loop was shown once.** One remark became one rule and one re-cut, with no comparison,
  so "the second cut is better than the first" from the pitch is a claim. A correction like "the
  opening is boring" is still the right input: specific, dated, tied to a cut.
- **Thin spots.** Only OpenAI direct was tested. Scene detection at 2 fps finds one shot in most 20 to
  30 second clips, and whisper `small` gets names wrong. Of the sponsor tools, Neon Postgres, Mastra
  and assistant-ui carried the build; the AI gateway needed a paid plan, Fly.io a card (renders stayed
  on the Mac), Kernel was never reached, and the AgentMail inbox never saw a real email.

## Demo and result

<iframe src="https://www.youtube-nocookie.com/embed/NAmEDA6vIEY" title="Life2Film Director: a personal film director agent, hackathon demo" style="width:100%;aspect-ratio:16/9;border:0;border-radius:8px;margin:1.5rem 0" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

The pitch was the app on screen with a three-minute demo video as fallback, and it named the sponsor
tools that did not make it. The hosted demo is bring-your-own OpenAI key: the key stays in the browser
and travels only as a request header. `skills/life2film-director/SKILL.md` in the repo lets another
agent install and drive the tools, which is how this build feeds back into [[project-life2film]].

## How this was put together

Written from the repo and its docs (README, plan, pitch, a technical review written at 14:50 that day,
the event brief). Whether it reached the top six, and any judges' feedback, was not recorded. No survey
of the other teams was kept; the one note from the room is the reason for the pivot.

Same day, same idea in another form: [[hack-nation-ai-apprentice-2026]] turned an expert's spoken
answers into rules for a tutor and an agent. Every event: [[hackathons]].

Links: [repo](https://github.com/fortunto2/tech-week-agent) · [hosted demo](https://tech-week-agent.vercel.app) ·
[demo video, 3 min](https://youtu.be/NAmEDA6vIEY).
