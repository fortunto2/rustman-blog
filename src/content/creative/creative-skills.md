---
type: guide
kind: guide
title: "Skills for making films and music with an AI assistant"
description: "Every skill behind my travel films and tracks in one list: transcription, editing, publishing, mixing and audio-to-MIDI, with where each one lives and how to install it."
created: 2026-10-25
tags: [creative, skills, video, music, agents]
publish: true
publish_as: creative
tools: [solo-transcribe, solo-video-edit, solo-stem-split, solo-youtube-channel, sdsp-skills, life2film-engine]
index_line: "Creative skills hub: solo:transcribe, solo:video-edit, solo:stem-split, solo:youtube-channel (solo-factory); sdsp-mix, superduper-song, sdsp-chain, audio-to-midi, track-teardown, vocal-mix (superduper-dsp); life2film-engine (npm). What each does, where it lives, install"
index_section: "creative"
---

# Skills for films and music

A skill is a file of instructions the assistant loads when a task matches it: what to run, in
which order, and the mistakes not to repeat. Each one below grew out of real work, most rules
with the date of the bad result that taught them. They live in three places.

## Video: solo-factory

```bash
claude plugin marketplace add https://github.com/fortunto2/solo-factory
claude plugin install solo@solo --scope user
# other agents (Cursor, Codex, Gemini CLI): npx skills add fortunto2/solo-factory --all
```

| Skill | What it does | Story |
|---|---|---|
| `solo:transcribe` | Speech to text on your machine: large-v3 on the Mac's GPU, language per stretch of speech, `.srt`, word timings for editing, optional speaker labels | [[creative-video-transcribe]] |
| `solo:video-edit` | Footage to a film: the cut as a script, cutaways that match the words, the hook by eye, a critic pass, score and radio cleanup, masters for YouTube, Reels and messengers | [[creative-video-agent-cut]], [[creative-video-sound]], [[creative-video-shipping]] |
| `solo:stem-split` | Split a song or a film's soundtrack into vocals, drums, bass and other with Demucs, on the Mac GPU (60 s of music in 8 s) | [[creative-video-sound]] |
| `solo:youtube-channel` | Upload from the terminal with two subtitle tracks, thumbnails, publish, link Shorts, read analytics | [[creative-video-shipping]] |

## Music: SuperDuper DSP

The installer from [[project-superduper-dsp]] adds the first four; the rest are in the
[repo](https://github.com/fortunto2/superduper-dsp).

| Skill | What it does |
|---|---|
| `sdsp-mix` | Mix and master by measurement: who masks whom, kick and bass ducking, a pocket for the vocal |
| `superduper-song` | Build a track in REAPER on these instruments, with parameter maps and presets |
| `sdsp-chain` | Render plugin chains from the command line, no DAW, with loudness per stage. The travel films' scores are rendered this way |
| `audio-to-midi` | A recording to MIDI, checked before it is trusted. In the films it lifts the chords someone played on camera into the score ([[creative-video-sound]]) |
| `track-teardown` | Take a reference song apart and rebuild its feel |
| `vocal-mix` | A vocal chain, slot by slot |

How they work together in a session: [[creative-music-with-claude]].

## Analysis in your own code: life2film-engine

```bash
npm i life2film-engine
```

The analysis core of [[project-life2film]] as WebAssembly: beats, shot boundaries, frame quality,
OpenTimelineIO, in a browser tab or Node with no upload. The package ships its own `SKILL.md`, so
an agent that installs it also learns how to use it, including the one mistake to avoid: it
analyses, it does not decode or encode.

## Why skills and not one big prompt

A prompt is forgotten at the next session. A skill is loaded only when the task matches, stays
in git, and its rules are dated, so the next agent knows which ones were paid for and when. The
editing skill reached about 900 lines over one trip; the public version keeps the rules and drops
my paths.
