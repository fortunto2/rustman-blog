---
type: guide
kind: guide
title: "How the Chicago films were actually cut: an agent, a Rust core and ffmpeg"
description: "Behind the Studio guide: for a month of travel films I mostly ran the analysis core and ffmpeg from the terminal, with Claude writing the cut as a script and a skill file remembering every rule a bad cut taught."
created: 2026-10-25
tags: [creative, video, montage, agents, ffmpeg]
publish: true
publish_as: creative
tools: [solo-video-edit, solo-transcribe, life2film-engine]
index_line: "Chicago films behind the Studio: Claude as editor over Rust core + ffmpeg, cut as script.json, skill file as memory of bad cuts, critic pass, read the film as text, theme film from day films"
index_section: "creative"
---

# How the Chicago films were actually cut

The [[creative-video-with-claude]] guide shows the desktop app. That is the door for other people.
For my own month in the US I barely opened it: I ran the analysis core and ffmpeg from the terminal,
and Claude was the editor. Every day I dropped a folder and said one line, «new day, trailer for
three minutes, focus on the music». This post is how that loop worked.

## The cut is a text file

The core does the boring part: shots, picture quality, beats, speech with word timings. It writes
the analysis next to each source clip, so a month later nothing is analysed twice.

Then the whole day becomes one text file of speech ([[creative-video-transcribe]] is how, in two
languages), and the assistant reads it like a scriptwriter.
The cut it writes is not a timeline, it is a short JSON script: which sentences of which clip to
say, which shot to lay over a line, which walk keeps its own street sound, what opens the film.
The renderer turns that into the film. When I say "the Bean is mentioned and never shown", the fix
is one line in the script, not a re-edit.

A ranking by length and confidence gives a coherent film. It does not give a film *about*
something. Picking the story stayed the agent's job, with me judging.

## The skill file is the memory

Each rule in the guide's list cost a bad cut. They live in one skill file the agent loads before
every day, each with the date and my words when I complained. Over the month it grew to about
900 lines. The general part, without my paths and scripts, is published as the `solo:video-edit`
skill in [solo-factory](https://github.com/fortunto2/solo-factory). A few that are not in the guide:

- **Take something from every clip.** If I filmed it, it mattered to me. A clip with no words still
  gets 1.5 to 3 seconds as a cutaway, and after the cut the agent lists every clip that did not make
  it in, with a reason.
- **Cut the filler words at the ends of a line**, and in the middle only when the join falls in
  silence. A torn join is worse than an «ну».
- **Scenes, not best phrases.** A film about my daughter built from the "best lines" failed: the
  lines had no context. A conversation now goes in whole, with what led to it and the reaction after.
- **Promise and payoff are the thread.** "We'll buy a sweatshirt at Stanford" one day, the purchase
  the next. Find those pairs in the transcripts and keep both halves.
- **The length follows the material.** I asked for "one, two, three hours, however it goes" for the
  whole trip. After two critic passes it was 55 minutes, and nobody stretched it.

## Eyes before render

Numbers miss things. One scene showed the same face ten times and every metric was green. So before
anything goes out:

1. **Read the whole film as text**, in order. Every line has to make sense to someone who did not
   see what was cut. Rendering before that wasted ten minutes more than once.
2. **A sheet of every cutaway** with the line under it. On one film 12 of 54 automatic cutaways were
   off topic: a car over the garage line, a frame upside down.
3. **A critic subagent, at least twice.** The first pass on the trip film found repeats between
   chapters and a 9-minute guitar shop that became 3.7. The second found six lines cut mid-word at
   the joins.

## The trip film is cut from day films

Nine days became 55 minutes grouped by theme: the city, college, food (every visit to one place in
one chapter), music, the farewell DJ set. It is cut from the finished day films, not the sources,
because colour, sync and subtitles were already fixed there. Each chapter renders to its own file,
so a critic's note re-renders one chapter, not an hour. Chapters are levelled to −16 LUFS; before
that, neighbours differed by 9 dB.

The sound side is in [[creative-video-sound]], getting it onto platforms in
[[creative-video-shipping]].
