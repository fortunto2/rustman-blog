---
type: guide
kind: guide
title: "Edit video with an AI assistant: a day of footage to a film"
description: "How I cut nine days in Chicago into films by talking to Claude: the app analyses every clip and finds the beat, the assistant builds the cut, I keep the creative calls. Free desktop app, setup for non-programmers."
created: 2026-10-18
tags: [creative, video, montage, guide]
publish: true
publish_as: creative
tools: [life2film-studio, life2film-engine]
index_line: "Edit video with Claude: Life2Film Studio + MCP, nine Chicago days to films, beat-cut montage, subtitles, rules learned on bad cuts. Guide for non-programmers"
index_section: "creative"
---

# Edit video with an AI assistant

In September I spent nine days in Chicago with a DJI Osmo and two iPhones, 40 to 70 clips a day.
Each day became a 2 to 5 minute trailer and a 10 to 20 minute episode, and at the end a 55-minute
film of the whole trip, cut by theme. The assistant did the editing from my words. I watched,
judged and asked for changes.

```youtube
https://www.youtube.com/watch?v=rW5B6igCv4Y | The Chicago film: nine days cut by theme, scored with my own music
```

It was not one click. The first cut is almost always boring or out of sync; the third one is good.
That is still far faster than editing by hand, and the boring part (watching every clip, finding the
beat, syncing subtitles) is gone.

## The tool

**[Life2Film Studio](https://github.com/fortunto2/life2film-landing/releases/latest)**, a free
desktop app for Apple Silicon Macs (early beta). Everything runs on your Mac; nothing is uploaded.

```bash
brew install --cask fortunto2/tap/life2film-studio
```

(No Homebrew? Download the `.dmg` from the release page.)

It analyses the footage (shots, picture quality, bad frames), transcribes speech on the Mac's GPU in
any language, builds a montage cut on the beat, renders an mp4, and publishes to YouTube, private
first.

Connect [Claude Code](https://claude.com/claude-code) to the open window:

```bash
claude mcp add --transport http life2film http://127.0.0.1:8421/mcp
```

Then ask in plain words:

> Add the folder ~/Movies/trip/day1 to Life2Film and wait for the analysis. Take the first track
> from ~/Music/score. Build a 3-minute montage with the Travel profile, render it, and show me a
> contact sheet.

## How a day becomes a film

1. **One folder per day**, every camera in it. Take the shooting time from the file's metadata, not
   its name: my DJI names were an hour off and the cameras drifted apart.
2. **Analyse picture and speech.** About 20 minutes for 66 clips the first time, seconds after that.
3. **Read the day as text.** All the speech of the day in one file. Every film starts there: the
   assistant reads it like a scriptwriter and proposes the story.
4. **Cut the trailer**: voice as one continuous track, pictures on top. The episode is the same with
   a bigger budget and whole conversations kept.
5. **Look at the whole film as one picture.** A contact sheet of the full film shows a sunset among
   night shots, or three talking heads in a row, faster than watching it.
6. **Subtitles in two languages.** On YouTube as tracks; on Reels burned into the picture, because
   people scroll with the sound off.
7. **Publish private, watch on the phone, then make it public.**

The same way, a week in California became a trailer:

```youtube
https://www.youtube.com/watch?v=gYAVmXvZ7uw | San Francisco and Silicon Valley: the trailer
```

## Rules I learned on bad cuts

- **The cutaway shows what is being talked about.** Talking about the Bean, the Bean is on screen.
- **Never cover a shot where lips move.** Viewers read it as broken sync.
- **Open cold: 8 to 10 seconds of the best shots, then the hook.** Pick those shots yourself. The
  machine picks sharp and colourful, not interesting.
- **Live music stays one piece.** Cut it per shot and the beat restarts at every cut.
- **Music playing in the background is a copyright claim.** Car radio, a shop, a festival stage: one
  day got 10 claims. Strip it and put your own score under it.
- **Vertical clips go to Reels as they are.** Cropping wide shots blindly to 9:16 kept 5 faces of 37;
  following the faces kept 31.
- **Teach it your names.** Speech recognition turns unknown names into celebrities. Keep a word list
  for the trip and fix it once.

The technical side is in [[project-life2film]]. For the soundtrack, see
[[creative-music-with-claude]].
