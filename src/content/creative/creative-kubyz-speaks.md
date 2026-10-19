---
type: guide
kind: recipe
title: "Make a kubyz speak your words"
description: "Sing into one input, play a jaw harp on the other, and the kubyz pronounces your vowels. A free plugin, one setting, a before/after you can hear."
created: 2026-10-18
tags: [creative, music, kubyz, formant]
publish: true
publish_as: creative
index_line: "Recipe: voice in the sidechain of SuperDuper Formant (Follow) shapes a kubyz drone into your vowels; A/B dry vs shaped, full chain + TOML"
index_section: "creative"
tools: [superduper-dsp]
media:
  - dry=~/Music/1music/demos/src/kubyz30.wav
  - voice=~/Music/1music/demos/src/voice30.wav
  - shaped=~/Music/1music/demos/mp3/01_kubyz_speaks.mp3
---

# Make a kubyz speak your words

A kubyz (jaw harp) already sounds like a mouth: you shape its tone with your lips and tongue. This
recipe hands that job to your voice. You sing, and the kubyz pronounces your vowels. None of your
voice is heard; every vowel is the kubyz.

```ab
A: /media/creative/kubyz-speaks/dry.mp3 | kubyz, dry
B: /media/creative/kubyz-speaks/voice.mp3 | my voice
C: /media/creative/kubyz-speaks/shaped.mp3 | kubyz shaped by the voice
```

## What you need

- **SuperDuper Formant**, one of the free [SuperDuper DSP](https://github.com/fortunto2/superduper-dsp/releases/latest)
  plugins (macOS and Windows).
- A kubyz recording or the **SuperDuper Kubyz** instrument, and a vocal take of the same length.
- Any DAW with sidechain routing. I used REAPER.

## The chain

1. Kubyz on a track. On it, **Formant**, then a reverb.
2. Send the voice to Formant's sidechain input (it is called `Voice`). Mute the voice track itself.
3. Formant settings:

| setting | value | why |
|---|---|---|
| Mode | Follow | track the vowels from the sidechain |
| Glide | 22 ms | vowels slide instead of stepping |
| Width | 0.9 | wide resonances |
| Drive | 0.3 | more harmonics for the resonances to bite on |
| Mix | 0.95 | almost all shaped signal |
| Output | +6 dB | make-up gain |

4. Reverb (I used Supermass) at Mix 0.22.

When the voice stops, the last vowel freezes and the kubyz keeps "holding" it. That is a feature:
sing a phrase, stop, and the instrument finishes the sentence.

## What to ask the assistant

> Put the kubyz on one track and my vocal on another. Make the kubyz pronounce the vowels of the
> vocal with SuperDuper Formant in Follow mode, and mute the vocal.

To render it without a DAW, the same chain as a file for `sdsp-chain`:

```toml
sidechain = "voice.wav"

[[track]]
name = "kubyz articulated by voice"
input = "kubyz.wav"

  [[track.stage]]
  plugin = "formant"
  params = { Mode = 1.0, Follow = 1.0, Glide = 22.0, Width = 0.9, Drive = 0.3, Mix = 0.95, Output = 6.0 }

  [[track.stage]]
  plugin = "supermass"
  params = { Mix = 0.22, Width = 1.0 }
```

## Why it works

A vowel is three resonances of the mouth (formants). Formant measures them on your voice many times
a second and puts the same three resonances on the kubyz. The kubyz gives the pitch and the buzz,
your voice gives the shape. Drive goes first because a plucked drone is too pure: without extra
harmonics there is nothing for the resonances to shape.

More: [[project-superduper-dsp]], the kubyz as a phone app in [[project-kubizbeat]], and the whole
setup in [[creative-music-with-claude]].
