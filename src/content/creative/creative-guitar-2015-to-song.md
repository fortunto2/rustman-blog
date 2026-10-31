---
type: guide
kind: guide
title: "From a 2015 guitar take to a new song, with an AI assistant in REAPER"
description: "An AI demo grew out of a one-minute guitar theme I recorded in 2015. How I decoded my own picking into notes, laid it under the demo and replaced the demo's parts with my own sounds, step by step, with the numbers."
created: 2026-10-30
tags: [creative, music, reaper, transcription, mixing]
publish: true
publish_as: creative
index_line: "Case study: 2015 guitar → decoded picking (3-bar circle) → base under a Suno demo on its real 68 BPM grid → own drums, kubyz, the original take as intro → a measured basic mix; with A/B audio and the recipe for next time"
index_section: "creative"
tools: [superduper-dsp, sdsp-skills, solo-stem-split]
cover: /media/creative/guitar-2015-to-song/intro-2015.png
media:
  - suno-demo=~/Music/1music/vyshe-i-dalshe/article/publish/suno-demo.wav
  - first-try=~/Music/1music/vyshe-i-dalshe/article/publish/first-try.wav
  - guitar-2015=~/Music/1music/vyshe-i-dalshe/article/publish/guitar-2015.wav
  - guitar-decoded=~/Music/1music/vyshe-i-dalshe/article/publish/guitar-decoded.wav
  - intro-now=~/Music/1music/vyshe-i-dalshe/article/publish/intro-now.mp3
  - uneven-bars=~/Music/1music/vyshe-i-dalshe/article/publish/uneven-bars.png
  - too-fast=~/Music/1music/vyshe-i-dalshe/article/publish/too-fast.png
  - layers=~/Music/1music/vyshe-i-dalshe/article/publish/layers.png
  - drums-grid=~/Music/1music/vyshe-i-dalshe/article/publish/drums-grid.png
  - parts=~/Music/1music/vyshe-i-dalshe/article/publish/parts.png
  - intro-2015=~/Music/1music/vyshe-i-dalshe/article/publish/intro-2015.png
---

# From a 2015 guitar take to a new song

In 2015 I recorded a one-minute guitar theme for a film: acoustic, capo on the first fret, one
take. Ten years later I gave it to Suno as a starting point and got a full demo back, with drums,
bass, synths, strings and voices. The song is called «Выше и дальше» ("Higher and further").

A demo is not a song, though. It plays my theme in its own way, and the guitar that started it is
gone. So I took it back, part by part, in REAPER, with Claude as the assistant: it measured, wrote
the project files and moved the knobs, and I listened and said what was wrong. This page is the
path, with the numbers, and the short version of how I would do it next time.

The teaser below is a day on the Coast Starlight train through Oregon. I worked on this track on
that train, and Claude cut the video from my footage with the same kind of skills
([[creative-video-agent-cut]]).

```youtube
https://www.youtube.com/watch?v=TszqvuMx9wQ | teaser: a day on the Coast Starlight through Oregon, with the track as it stands
```

Here is the whole journey in one player, the first 48 seconds of the song three times: the demo
Suno made from my guitar, my first try at replacing it, and where it stands now.

```ab
A: /media/creative/guitar-2015-to-song/suno-demo.mp3 | the Suno demo
B: /media/creative/guitar-2015-to-song/first-try.mp3 | first try: every stem turned into MIDI and replayed on my plugins
C: /media/creative/guitar-2015-to-song/intro-now.mp3 | now: the 2015 guitar opens, the band comes in on the picking
```

B still carries Suno's voice, strings and percussion; C has no vocals yet. So far it is simple, but
it is already what it needs to be.

And the guitar itself. A is the 2015 recording, B is the same 30 seconds replayed from the notes the
decoder found, on a simple plucked-string synth:

```ab
A: /media/creative/guitar-2015-to-song/guitar-2015.mp3 | the 2015 recording
B: /media/creative/guitar-2015-to-song/guitar-decoded.mp3 | the notes found in it, replayed
```

## What you need

- **REAPER.** Any DAW works, but REAPER keeps the project as a text file, so the assistant can
  write a whole arrangement into it instead of clicking.
- **[SuperDuper DSP](https://github.com/fortunto2/superduper-dsp/releases/latest)**, free: Piano,
  Wave, Kubyz and Sampler for the parts; EQ, Compressor and Soothe for the mix. Every one of them
  reports its sound to a shared meter, so the assistant can see who covers whom.
- **The demo's stems.** Suno exports twelve (vocals, drums, bass, guitar, keys, strings, synth…).
- Free tools the assistant runs for you: Basic Pitch (audio to notes), Demucs (stem split),
  Rubber Band (time-stretch).

## The path

### 0. The first try: straight from the stems to MIDI

My first idea was the direct one: split the demo into its 12 stems, turn every stem into MIDI and
play that MIDI on my own instruments. One night of it produced a full rebuild that matched the
demo's spectrum within 0.6 dB per section (take B above) and still was not the song:

- the bass came out as 10 to 24 notes per bar, re-attacks and harmonics read as notes. It only
  worked once the rhythm came from the bass stem's onsets and the pitch from the chord of the bar;
- the drums, transcribed by frequency band, were noise: the snare smeared over all 16 slots, hats
  everywhere, 195 kicks in 98 bars. They became a hand-written pattern;
- everything sat on the demo's apparent tempo, 90.91 BPM, which turned out to be the kick, not the
  beat (step 3), and for most of the night every written part played one bar early, because the
  bar count started from the wrong downbeat.

I also asked my sound engineer, Andrey Renev ([@andreyrenev](https://t.me/andreyrenev) on
Telegram), for help. He set the demo up in REAPER at 68 BPM with the circle Ab | Eb | Fm | Db.
Later the measurements showed that this is exactly the grid and the circle the demo's harmony
moves on.

In the end I decided to build it myself. I know this melody and how it is supposed to sound, so I
went back to the guitar it came from.

### 1. Hear what the guitar really plays

First check that the take is really solo: a stem split put the guitar at −20 dB and everything else
below −42 dB. Then the notes. The usual transcribers gave me notes but not the pattern: which
string, which finger, where the circle starts. A clip of me playing it
([Instagram](https://www.instagram.com/p/DEUl8nZiX3W/)) did not help either: the picking hand is
out of frame.

So the assistant built a small decoder on top of Basic Pitch that knows a guitar has six strings,
one note per string, and a capo. On a public guitar dataset (GuitarSet, players it was not tuned on)
it finds notes about as well as Basic Pitch (F1 0.63 to 0.78) and names the string right 55 to 79 %
of the time. On my 2015 take it found the whole thing:

- the thumb plays the 6th string, frets 3, 2, 0: **Ab, G, F**;
- the fingers play **[Ab3 + C4] Eb3 Ab3 Eb3** on every beat;
- the circle is **three bars, Ab | Eb/G | Fm**. That is why I could never tell whether it was "in 3
  or in 4".

**Dead end worth knowing:** the first decode looked like noise. Basic Pitch cuts audio into 2-second
windows, and each window starts 10.24 ms earlier than the simple formula says. Reading its output
naively drifts 0.3 s a minute. Fixing that one line doubled the precision (0.14 → 0.30) before any
tuning. When a transcription looks random, check its timing before you blame the model.

### 2. Make it a steady base

The first REAPER project followed every beat of the recording. Accurate, and it felt wrong; my
note was "it stumbles". Bars of different widths are what a human plays, not what you build on.

![A tempo map that follows the recording: every bar a different width](/media/creative/guitar-2015-to-song/uneven-bars.png)

The base became a steady 72 BPM with every note the same length and velocity, on the SuperDuper
Piano. The recording was stretched bar by bar onto that grid for A/B, so I could hear that nothing
was lost.

### 3. Find the demo's real grid before laying anything under it

**Second dead end:** I put the guitar under the stems at the drum tempo, 90.91 BPM, and the chords
ran too fast.

![The guitar at the drum tempo: the chord colours change twice as often as the music](/media/creative/guitar-2015-to-song/too-fast.png)

Measured, the harmony moves every 3.527 s, which is **68.05 BPM**, the tempo Andrey had set.
The 90.91 came from the kick
repeating every 0.66 s, three sixteenths, not from the beat. And the demo's drums turned out to be
tight on their own grid (snare and hats within 12 to 17 ms of it), so the whole project now takes
its grid from the drum stem, one tempo point per beat, written straight into the project file.

An AI demo can carry its drums and its chords on different grids. Measure first.

### 4. Split the guitar into roles

![The guitar split into layers, each bar coloured by its chord](/media/creative/guitar-2015-to-song/layers.png)

One line of notes is hard to reuse. Split by job, it becomes a toolkit:

- **bass**: the root on every beat (what the thumb does);
- **picking**: [Ab3 + C4] Eb3 Ab3 Eb3;
- **whole-bar chords**: muted, ready for pads;
- **the full original line**: muted, as a reference;
- **808**: the demo's bass rhythm, with the root of each bar;
- **synth**: the demo's synth line, split into low (verses) and high (choruses).

Chords the guitar never plays (Db, Bbm in the pre-chorus) come from the demo's own harmony.

### 5. Drums hit by hit, then simpler

Every hit of the demo's drum stem was found and labelled (189 kicks, 292 snares, 323 hats), and each
one matched to the closest one-shot in a sample library by spectrum (kick 0.906 cosine). Then every
hit was snapped to the drum grid and cut at the next one, so the tails stop piling up.

![Each drum on its own track, every hit on the grid](/media/creative/guitar-2015-to-song/drums-grid.png)

It sounded like the demo and I did not like it: too many elements, no groove. The kit became one
simple pattern per part, with hits made from a kubyz, and then my own kubyz takes from older songs:
one slice of a 2026 take, cut into its four strokes and placed on the sixteenths in the break and
the bridge.

### 6. Mark the parts by who sings

![Parts as coloured regions, from the vocal stems](/media/creative/guitar-2015-to-song/parts.png)

The assistant read the pitch of the vocal stems line by line and the level of every stem per part,
and drew the parts as regions: a spoken intro, an instrumental interlude with strings and a pipe,
verses, pre-choruses, choruses, a break, a short dialogue, a bridge, the final and the outro. The
song has three voices to record: mine, a second singer, and a "Bashkir spirit" in the bridge.

### 7. Give the start back to the real guitar

The 2015 take opens with a pickup note and five bars before the picking starts. Those five bars are
now the intro of the song, each stretched to its bar (rate 0.89 to 0.92, pitch kept). The interlude
starts with the very bar that followed them in 2015, so the seam is the real one, and that is where
the bass, the synth and the hats come in.

![The intro: the 2015 opening, then the picking with the band](/media/creative/guitar-2015-to-song/intro-2015.png)

```ab
A: /media/creative/guitar-2015-to-song/intro-now.mp3 | the first 48 seconds now, no vocals yet
```

### 8. A basic mix, by measurement

The shared meter lets the assistant play one chorus on loop and list which tracks cover each other
in which band. The rules it followed:

- **Balance against the demo's own stems.** The demo's vocal sits in both mixes, so it is the
  anchor. My kick was 11 dB above it, the picking 3 dB above; the demo has its drums 3 dB above the
  vocal and its guitars 3 dB below. Faders: kick −8, picking −6, synth +7, 808 +2.
- **Kick ducks the bass** by up to 5 dB on every hit (a compressor keyed from the kick).
- **The synth yields to the voice only while it sings** (Soothe keyed from the vocal, 7 dB): the
  clash at 3.6 to 4.4 kHz went from 61 % of the time to 0, and the synth lost only 1.9 dB on average.
- **One owner per band.** The surprise: my "808" was a kubyz. Its pitch lives in a formant at 320 Hz,
  its fundamental is 28 dB lower. Cutting it with EQ only made it equal to the guitar there. The fix
  was at the source (formant mix 1 → 0.5, brightness 1 → 0.6), and then the bands were split by
  job: the kubyz-bass keeps 270 to 410 Hz, the picking keeps its notes at 140 to 260 Hz.

The voice's band (1.9 to 2.3 kHz) is now free: guitar under the vocal went from 60 % to 0.

## How I would do it next time

1. **Start from the real recording**, and check it is solo with a stem split.
2. **Decode the pattern, not just the notes**: strings, fingers, the length of the circle. Replay
   the notes and A/B them against the take before trusting them.
3. **Build a steady base** with equal notes. Keep the live take for A/B, not as the grid.
4. **Measure the demo's grids before putting anything under it**: harmony and drums separately.
   Take the project grid from whatever is tightest (here the drums).
5. **Split your part by role** (bass, picking, chords, full line muted) so every layer can become
   a new instrument later.
6. **Replace one layer at a time while you listen**, with the demo's stem muted next to it for A/B.
7. **Simplify the drums before you perfect them.** A copy of the demo's kit is still the demo.
8. **Mark the parts by who sings**, from the vocal stems, so the arrangement has a story.
9. **Bring your own sounds**: takes from your earlier songs are what makes it yours.
10. **Mix by measurement**: balance against the demo's stems, sidechain the bass, duck under the
    voice only while it sings, and fix a clash in the source before you reach for EQ.

## What to ask the assistant

> Here is my old guitar take and the stems of an AI song made from it. Find what my guitar plays
> (strings, the circle), make a steady REAPER base from it, measure the song's real grid from its
> stems, and put my guitar under it split into bass, picking and chords.

> Play the chorus on loop and tell me which tracks cover each other. Balance against the demo's
> own stems, then fix the worst clash at its source.

## What is still missing

Besides the vocals: a backbeat (nothing on 2 and 4 in the choruses yet), the violin, which in the
demo plays in the interlude, the bridge and the final, a pad under the chords, the pipe line in the
interlude, and the master. Each is one more step of the same loop.

Related: [[project-superduper-dsp]], [[creative-music-with-claude]], [[creative-kubyz-speaks]].
