---
type: guide
kind: guide
title: "Sound for travel films: your own score and no radio"
description: "How the Chicago films got their own music written to the cut, why a hole in the score beats ducking, and how car radio got 10 Content ID claims and was stripped with Demucs without losing my voice."
created: 2026-10-25
tags: [creative, video, music, audio, copyright]
publish: true
publish_as: creative
tools: [solo-video-edit, solo-stem-split, sdsp-skills, superduper-dsp]
index_line: "Travel film sound: score built from the edit plan (chords change on cuts), mood = scale degrees not tempo, silence holes vs ducking, Content ID radio scrub with Demucs drums+bass, keep the vocal stem whole"
index_section: "creative"
---

# Sound for travel films

Picture got most of my complaints. Sound got the most expensive ones.

## A score written to the cut

The background music is generated per film from the edit plan, not laid on top of it. Chord changes
land on the beat nearest to a cut, parts of the film can run at different tempos, and the plugins
from [[creative-music-with-claude]] mix it with a sidechain on the voice track, so the music steps
back under speech by itself.

Two things surprised me:

- **Mood is the scale degrees, not the tempo.** My first major score came out sad. The tempo was
  fine; the chords were the problem. Walks alone now get major sevenths and a minor sixth, films with
  my daughter get triads with an added sixth and no minor chord at all.
- **Where something is played live, there is no score.** Not quieter: a hole. Inside the window the
  score sits at −91 dB against −13.6 at full level. You hear music ducking. You do not hear a hole.

If someone plays in the footage, the harmony can be taken from the recording and fed to the score
(the `audio-to-midi` skill from [[project-superduper-dsp]]).
On a noisy street recording three models agreed on the key and disagreed on the melody, so it
recovers chords, not a tune.

Live music in the frame stays one continuous piece under the whole scene, with the picture cuts on
top. Cut it per shot and the beat restarts at every cut; I called that version garbage the moment I
heard it.

## Other people's music

Car radio, shop speakers, a festival stage. One California episode got **10 Content ID claims**,
about four minutes of other people's songs, and four of the claims blocked the video in two
countries, 21% of my audience. A claim is not a strike, but you do not get to pick the block.

The fix runs before upload:

```bash
demucs -o stems -d mps film_audio.wav   # 4 stems, ~4 min per 20 min of audio on Apple Silicon
```

`-d mps` matters: without it Demucs stays on the CPU, about half the speed. The `solo:stem-split`
skill has the install line and the variants.

- **Detect radio by drums and bass**, not "everything but the voice". Demucs puts the engine, wind
  and city into `other`; a radio has a rhythm section. The first detector read the no-vocals stem and
  was blind.
- **Keep the vocal stem whole.** The first version passed my voice only inside subtitle windows. I
  noticed the same day: the emotions on a bridge were gone. Speech recognition does not hear
  exclamations; 31 seconds of loud speech lived outside the subtitles. The singer's ghost stays in
  the stem 5 to 10 dB under my voice and disappears under the score.
- **The picture is not touched.** Only the audio is rebuilt, the video goes `-c:v copy`.
- **YouTube's claims are a check, not the map.** Content ID sees a subset. Clean everything the
  detector found, then confirm it also covers the windows YouTube flagged.

An already published video with a claim that changes nothing stays as it is. Re-uploading pays only
when there is a block. Instagram trailers keep the radio: no monetisation there to lose.

Picture side: [[creative-video-agent-cut]]. Platforms: [[creative-video-shipping]]. Transcripts:
[[creative-video-transcribe]]. The rules and ffmpeg recipes are in the `solo:video-edit` skill
([solo-factory](https://github.com/fortunto2/solo-factory)).
