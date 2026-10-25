---
type: guide
kind: guide
title: "Speech is the timeline: transcription for video editing"
description: "Why every travel film started as a transcript: what I learned running Whisper over a month of clips in two languages, why the Mac's GPU path matters, and how word timings let an agent cut on words instead of seconds."
created: 2026-10-25
tags: [creative, video, transcription, whisper, montage]
publish: true
publish_as: creative
tools: [solo-transcribe, solo-video-edit, life2film-engine]
index_line: "Transcription for editing: speech as the timeline, per-chunk language for RU+EN clips, mlx-whisper large-v3 on the Apple GPU vs faster-whisper on CPU, word timings for cuts, crowd hallucinations, name glossary. Skill: solo:transcribe"
index_section: "creative"
---

# Speech is the timeline

Every film in [[creative-video-agent-cut]] started as text. The assistant cannot watch an hour of
footage, but it reads an hour of speech in seconds, and a vlog is mostly people talking. So the
first step of every day was not the cut, it was the transcript: all clips, in shooting order,
numbered by clip and sentence. The script of the film points at those numbers.

## Two languages break the default

My clips are Russian and English, often in one clip. Whisper decides the language once, from the
first 30 seconds, and applies it to the whole file. A clip that starts in English and moves to
Russian comes back as fluent, confident English; in a test file the second language simply
disappeared from the output. The fix is to split the audio on silences and detect the language for
each piece. A language switch happens at a turn in the conversation, which is a silence, so the
pieces fall where the switches are.

The fast English-only models were out for the same reason: on one Chicago day 45 clips of 66 were
in Russian.

## The Mac's GPU is the difference between a draft and a transcript

faster-whisper is the usual choice, but its engine has no Metal backend, so on a Mac it runs on the
CPU. For a day of 66 clips the `medium` model took about 15 minutes, and on noisy moments it
returned fragments: a prize announcement came back as pieces nobody could read. The same two
minutes through `large-v3` on the Apple GPU (mlx-whisper) took 16 seconds and said clearly who
placed where. A whole 38-minute talk takes under 9 minutes. Now the GPU path is the default, and the CPU path stays for Linux, NVIDIA cards and
speaker labels.

## Words, not seconds

Editing needs more than sentences. With word timings the agent can:

- end a line on its last meaningful word and drop the filler after it,
- check that no cut lands inside a sentence (the trailer printed "cuts inside a sentence: 0"
  before I ever watched it),
- place a cutaway in the silence between two words, never over moving lips,
- build subtitles in two languages from the same timings, so they stay in sync after every re-cut.

## What goes wrong

- **Crowds hallucinate.** 25 minutes in a loud bar came back as French, 454 invented sentences. That
  clip then counted as "speech" and ruined the layout of the whole day. A crowd recording is treated
  as no speech; if one voice in it matters, it is transcribed again with the language forced. That
  re-run found my own pitch in the noise, and it became the ending of the film.
- **Unknown names become celebrities.** "DJ Rust" came out as "James Last". Each trip keeps a
  glossary of people, places and products, and the transcript is fixed once, before subtitles or a
  description quote it.
- **Screen recordings often have no audio track.** Check with `ffprobe` before waiting for nothing.
- **A long talk does not need to leave the memory card as video.** Pull only the audio
  (`ffmpeg -i talk.mp4 -vn -c:a copy talk.m4a`, 130 MB for a 54-minute lecture), read it, and copy
  only the minutes worth showing.

## The skills

Both halves are public in [solo-factory](https://github.com/fortunto2/solo-factory): `solo:transcribe`
runs locally (GPU on a Mac, per-chunk language, `.srt`, word timings, optional speaker labels) and
`solo:video-edit` holds the editing rules that consume it. Nothing leaves the machine except a
one-time model download.

Sound and music: [[creative-video-sound]]. Getting films onto platforms:
[[creative-video-shipping]]. The app version of all this: [[creative-video-with-claude]].
