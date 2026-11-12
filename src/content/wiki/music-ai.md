---
type: hub
title: "Music AI: generation, transcription, stems"
description: "Notes on AI for music: the generators (ACE-Step, ACE Music, Suno), the local tools we run for audio to MIDI and stem splitting, and what we measured versus what we only read."
created: 2026-11-12
tags: [hub, music, audio, generation, midi, stems, ace-step]
publish: true
index_line: "Hub: music AI. Generation (ACE Music v1 closed #1 on AA vocal board; ACE-Step 1.5 open MIT; Suno v6; none run by us yet), audio-to-MIDI locally (MuScriptor, Basic Pitch, SwiftF0 190x RT), Demucs stems on Apple GPU, beat tracking, our plugins. Open questions"
---

# Music AI

This is the running page for everything we do with AI and music. It starts from what is already in our files: transcription and stem splitting are daily tools, generation is so far reading only. Each line says which.

## Generation (text or lyrics to song)

- [[ace-music-v1]]: ACE Studio's closed, hosted model; #1 on Artificial Analysis's AA-Music-Vocal v1.1 board (Elo 1160 vs Suno v6 1144, intervals overlap). Free tier 20 credits/day with no downloads. **Read, not run.**
- ACE-Step 1.5 (open weights, MIT on the model card, co-led by ACE Studio and StepFun; details on the [[ace-music-v1]] page). Runs locally including on a Mac through MLX per its README. **Read, not run.** Our only file is the inbox capture `3-inbox/2026-10-25-нейрорадио-на-локальной-модели-ace-step-15-генерит.md` ("neural radio": the next track generated live; idea: background music for Life2Film or a superduper-dsp demo).
- Suno v6 and its mini, Mureka V9.5, Lyria 3.5, Eleven Music, MiniMax Music: appear on the same leaderboard (rows and Elo on the [[ace-music-v1]] page). We use none of them.

## Transcription (audio to MIDI), local

The `audio-to-midi` skill in the SuperDuper DSP plugin ([[project-superduper-dsp]]). Three models, picked by material, measured on Apple Silicon (figures from the skill, same 3:12 recording):

| Model | Hears | Time for 3:12 | Licence note |
|---|---|---|---|
| MuScriptor medium | full mix, one MIDI track per instrument, GM drums | 52 s | code MIT, weights CC BY-NC 4.0 (fine for our own film, not for a shipped product) |
| Basic Pitch | polyphony in one track, no drums | 35 s | Apache-2.0 |
| SwiftF0 (our Core ML conversion) | one line, the loudest | 1 s (about 190x realtime) | CC-BY-4.0 source |

Measured on a Gesaffelstein teardown (40 s): MuScriptor tempo 102.994 against 102.985 by hand, kick grid with 0 missing hits over 51 beats; but every velocity comes out as 100, durations are wrong (bass note median 0.26 of a beat against 0.93 real), and instrument labels are guesses. Trust onsets and grid, not length or dynamics.

## Stem splitting

`solo:stem-split`: Demucs `htdemucs`, four stems (vocals, drums, bass, other), local; about 4 minutes per 20 minutes of audio on Apple Silicon with the `mps` device. Used for the Content ID radio scrub in [[creative-video-sound]]. ACE Music offers its own stem splitter and MIDI export, but only on paid plans ([[ace-music-v1]]).

## Rhythm and structure

- [[on-device-beat-tracking-downbeats]]: DSP beat detector downbeat F 0.080 against 0.846 for the Beat This! network.
- `solo:music-reels-cut`: beat-synced vertical clip from footage and a track, section-aware cut density.

## Making and mixing

- [[creative-music-with-claude]]: the REAPER setup, plugins, MIDI and mixing by measurement.
- [[project-superduper-dsp]]: the 36 plugins and the MCP bus the agent mixes through; [[project-kubizbeat]] is the jaw-harp instrument.

## Open questions

1. Can ACE-Step 1.5 produce background tracks good enough for Life2Film, and what does it cost in time and memory on the M5? Nobody here has run it.
2. Does ACE Music v1 beat Suno v6 on our own prompts, or only on Artificial Analysis's mix? The published gap sits inside the error bars.
3. Does generated audio survive our own tools, i.e. does `audio-to-midi` recover the notes of a generated track as well as it does a recorded one? That would also test ACE's built-in MIDI export.
4. Licensing: which generators give commercial rights on a free or paid plan, and which weights allow it. ACE Music's free tier gives none.
5. When the open ACE Music v1 Flash arrives (promised for late 2026), is it a usable local model? Unconfirmed until released.
