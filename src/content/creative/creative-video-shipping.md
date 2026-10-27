---
type: guide
kind: guide
title: "One film, four doors: YouTube, Reels, Telegram, the archive"
description: "What I learned getting a month of travel films out from the Mac: HEVC halves the upload, 1440p buys a better YouTube transcode, face-following vertical crops keep 31 of 37 faces, the hook and the cover are picked by eye."
created: 2026-10-25
tags: [creative, video, youtube, instagram, ffmpeg]
publish: true
publish_as: creative
tools: [solo-video-edit, solo-youtube-channel]
index_line: "Shipping travel films: HEVC master 1.6 vs 3.2 GB, 1440p upload trick, Telegram stays h264, face-following 9:16 (31/37 faces vs 5/37), hand-picked hook, cover with geo badges, outro card, dates in descriptions, archive to iCloud after"
index_section: "creative"
---

# One film, four doors

Each day ended as several files from one master: a long YouTube episode, a vertical trailer for
Reels, a file for the family chat, and the whole day joined as-is for a private archive. Everything
went up from the Mac; my phone had no free space, which is how the Instagram upload ended up on the
API too.

## Codecs, measured

- **The master is HEVC on the Mac's hardware encoder**: a 36-minute film is 1.6 GB, against 3.2 GB
  for x264 at crf 18.
  ```bash
  ffmpeg -i film.mov -c:v hevc_videotoolbox -q:v 62 -tag:v hvc1 -c:a aac -b:a 256k -movflags +faststart film.mp4
  ```
- **Upload to YouTube in 1440p, even from 1080p footage.** YouTube serves a 1080p upload at about
  3.5 Mbps AVC, while the 1440p tier gets VP9 or AV1 and more bits. The upscale adds no detail; it
  buys the viewer a better transcode.
- **Telegram stays h264.** Some Android phones have no HEVC decoder, and a file there downloads
  whole. 1080p at crf 21 fits about 40 minutes into the 2 GB limit.
- **Swapping audio never re-encodes the picture**: `-map 0:v -c:v copy`.

## Vertical

Phone clips shot vertical go to Reels untouched. For a horizontal day there are three options: the
whole frame over a blurred copy, a fixed centre crop, or a 9:16 window that follows faces. On a
20-second clip with the face off-centre, following kept **31 faces of 37**, the centre crop **5**.
The window moves slowly and stays put when nobody is in frame; a jumpy window is more visible than an
imperfect composition. Subtitles are burned in here and only here: the feed plays muted.

## What the machine does not pick

- **The hook.** The first ten seconds of a long film are a mini trailer. The automatic pick goes for
  sharp and colourful, which is a clean empty path through trees, exactly what people scroll past.
  Fire, water, neon, night, something moving at the camera, a face with an expression: chosen by eye
  from a contact sheet of candidates.
- **The cover.** Best frame, a big title, and the city and region as badges on the image: on YouTube
  that is search.

## Small things that saved confusion

- The real shooting date in every description. A week in, I could not tell which day was which, and
  neither could viewers.
- A short Life2Film card at the end of every file, appended without re-encoding the film.
- Upload private, watch on the phone, then publish. Related videos are linked by hand in Studio: the
  API accepts that field and does not save it.
- **Archive after the films are out, never during.** Sources and outputs of finished days moved to
  iCloud (4 TB free there, the laptop disk was running out). The analysis files travel with them,
  so a month-long film later needs no re-analysis.

How the cut itself was made: [[creative-video-agent-cut]]. Sound: [[creative-video-sound]].
Every recipe here was re-run before publishing and lives in the `solo:video-edit` skill
([solo-factory](https://github.com/fortunto2/solo-factory), `references/delivery.md`).

A UGC talk at LA Tech Week put numbers on the first frame: 0.1 seconds for Gen Z, 0.5 for millennials, 1 to 2 for boomers, by the speaker's own count ([[la-tech-week-video-agents-live-worlds-2026]]).
