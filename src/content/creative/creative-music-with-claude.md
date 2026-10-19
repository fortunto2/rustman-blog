---
type: guide
kind: guide
title: "Make music with an AI assistant: REAPER, free plugins, plain words"
description: "How I make tracks by talking to Claude: it builds the REAPER session, plays my free plugins, writes the MIDI and mixes by measurement. Setup for musicians, no code."
created: 2026-10-18
tags: [creative, music, reaper, audio, guide]
publish: true
publish_as: creative
tools: [superduper-dsp, kubizbeat]
index_line: "Make music with Claude: REAPER via MCP, SuperDuper DSP plugins, stems, audio-to-MIDI, mixing by measurement. Guide for musicians + downloadable kit"
index_section: "creative"
---

# Make music with an AI assistant

I make tracks by talking. I say "a beat at 90 BPM, kubyz on top, dark", and the assistant opens a
REAPER session, creates the tracks, loads the instruments, writes the notes and sets the mix. Then I
listen, say what is wrong, and it changes it. My hands stay on the ideas.

Nothing here needs you to write code. You type sentences; the assistant runs the tools.

## What it can do for you

- **Build a session**: tracks, instruments, effects, tempo, markers, a full arrangement.
- **Play instruments**: a wavetable synth, drums, a pad, a sampler and a Bashkir kubyz (jaw harp),
  all free and open source.
- **Take notes off a recording**: hum or play a line, get MIDI back, play it with any instrument.
- **Split a song into stems**: vocals, drums, bass, the rest. For remixes, mashups, karaoke.
- **Mix by numbers**: loudness (LUFS), peaks, the spectrum compared with a reference track. Not by
  the assistant's ear, which it does not have.
- **Take a reference apart**: tempo, sections, sound layers of a track you like, then rebuild it.

## What you need

- A Mac with Apple Silicon (Windows works for the plugins, not for everything else).
- [REAPER](https://www.reaper.fm/): full trial, cheap licence.
- [Claude Code](https://claude.com/claude-code): the assistant, with a Claude subscription.
- My plugins: [SuperDuper DSP](https://github.com/fortunto2/superduper-dsp/releases/latest),
  31 instruments and effects. Free, open source.

## Setup, about 20 minutes

1. **Plugins.** Download the macOS zip from the
   [latest release](https://github.com/fortunto2/superduper-dsp/releases/latest). Put the `.clap`
   files into `~/Library/Audio/Plug-Ins/CLAP/`. In REAPER: Preferences → Plug-ins → Re-scan.
2. **The kit.** Download my [music kit](/downloads/music-kit.zip): the assistant's instructions
   ("skills") for REAPER, the plugins, stems, notes and mixing, plus everything I learned the hard
   way. The README inside walks through each step.
3. **Connect the assistant to REAPER.** The kit's README has the commands. You run them once; after
   that REAPER shows "MCP Bridge started" and the assistant can drive it.

If a step fails, paste the error to the assistant and ask it to fix the setup. That works more often
than you would expect.

## How to talk to it

Plain sentences. The assistant picks the right skill on its own.

- "Make a 90 BPM beat in REAPER with our drums and a reese bass."
- "Run my vocal through a chain and tell me how loud it is."
- "Take the notes off this recording and play them on the pad."
- "Cut the acapella out of this song."
- "Put the vocal from track A on the beat from track B."
- "Compare my mix with this reference: what is too loud?"

Ask it to explain what it did. Ask it to make it worse on purpose so you can hear the difference.

## What it sounds like live

My own techno set on a rooftop in Chicago.

```youtube
https://www.youtube.com/watch?v=iMKhL4hnUSQ | DJ Rust: rooftop techno set, Chicago
```

## What I learned

- **Check by numbers and by ear, never by the assistant's word.** It cannot hear. It can measure.
- **Big arrangements go faster as a project file** the assistant writes, than as hundreds of clicks
  it makes inside REAPER.
- **When a rebuilt plugin does not change, restart REAPER.** It keeps the old one loaded.
- **Save often.** The assistant can undo, but a crashed session is still a crashed session.

The technical side of all this is in [[project-superduper-dsp]]. The kubyz started as a phone app, [[project-kubizbeat]]. For the picture side, see [[creative-video-with-claude]].
