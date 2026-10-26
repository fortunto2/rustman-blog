---
type: concept
title: "FilmCraft: a Premiere-class editor written by agents in four weeks, and what it means for Life2Film"
description: "FilmCraft is an open-source video editor in pure Rust with its own decoders, built mostly by Claude agents in under a month. What is real, what is still alpha, and the parts worth taking into an AI-first editor."
created: 2026-10-26
tags: [video, rust, agents, open-source, codecs, life2film, mcp]
publish: true
publish_as: creative
learned_from: "https://github.com/storytold/filmcraft (v0.13.0, README, ROADMAP.md, docs/agents.md, docs/gaps.md, docs/codec-parity.md, crates/hevc, crates/media), read 26 Oct 2026 after a Threads post"
index_line: "FilmCraft (storytold, Apache/MIT): pure-Rust NLE, own H.264/HEVC Main10/ProRes/AV1 decoders bit-exact on conformance, 343k lines, 2,424 commits since 30 Sep 2026, ~61% co-authored by Claude, alpha (~56% ready per own roadmap). 650 low-level CLI/MCP commands vs Life2Film's judgment-level tools. Take: isobmff mux (one stsd per track, hev1 needed for camera seams), interchange OTIO to FCPXML/AAF, never-crash and honest-progress agent rules. Risks: Premiere trade dress, codec patents, no real-camera corpus"
index_section: "creative"
---

# FilmCraft: an editor written by agents

## Definition

[FilmCraft](https://github.com/storytold/filmcraft) is an open-source nonlinear video editor in pure
Rust, built to feel like Adobe Premiere: same panels, same shortcuts. It ships its own decoders and
encoders written from the public specs, runs natively on macOS, Windows and Linux, and has a
WebAssembly build. MIT or Apache-2.0.

What makes it worth a page is how it was made. The first commit is dated 30 September 2026. Four
weeks later the repository has 2,424 commits, about 343,000 lines of Rust in 45 crates and 2,520
tests. In a sample of 100 commits, 61 are co-authored by Claude. The project's own roadmap measures
the remaining work in "agent-hours": 400 to 700 to beta.

## Numbers

- **Decoders are real.** HEVC Main and Main 10 decode bit-exact on 41 conformance streams; ProRes in
  all six profiles; also H.264, AV1, VP8/VP9, MPEG-2, AAC, Opus, AC-3. HEVC 1080p runs at about 75
  fps on one thread and 225 on fourteen.
- **Encoders are fewer.** H.264, ProRes, DNxHR and AAC in software; HEVC only through the hardware
  encoder. Their H.264 encoder exported a 9.5-minute 1080p timeline in 793 s, against 311 s through
  VideoToolbox.
- **Alpha by its own count**: "feature breadth ~86%, ready for real work ~56%". No real-camera test
  corpus yet; test CI on pull requests only since 20 October.

## Rule

An agent-built editor at this scale is now a month of work. Feature breadth stops being a moat. For
[[project-life2film]] that settles the positioning question: FilmCraft gives an agent about 650
low-level commands (place a clip, set an effect parameter), so the agent has to be the editor.
Life2Film gives an agent judgment: what is in every shot, which frames are sharp, where the beats and
the words are, and a cut written as a script ([[creative-video-agent-cut]]). One is an open Premiere
for professionals; the other is for someone with a day of phone and drone footage and no editing
skill. They complement each other: our cut can open in theirs for manual finishing.

## What we take

- **Interchange, without their code.** Their CLI (`filmcraft-cli run`, headless) converts OTIO into
  FCPXML, FCP7 XML, EDL and AAF. Measured on a 10-shot Life2Film plan: FCPXML and EDL in one
  command, score markers kept. The first run also caught a bug on our side: the plan stored its
  media as `./fixtures/x.mp4`, relative to the folder the CLI ran in, and editors resolve a
  relative path against the OTIO file's folder, so the footage opened offline. Our OTIO writer now
  stores absolute `file://` paths, and the same plan links its media. In video-analyzer this is
  `make otio-export OTIO=plan.otio FORMAT=fcpxml`, which fails loudly when any media is offline.
- **Container crates, carefully.** Their MP4 muxer is pure Rust and builds for WebAssembly, but it
  writes one sample description per track, the same limit that broke our outro join on 10-bit DJI
  footage the same week ([[creative-video-shipping]]). A camera clip plus a card from another encoder
  still needs `hev1` with parameter sets in-band.
- **Agent rules worth copying.** "Never crash": clippy denies `unwrap`, `expect` and `panic`, every
  number from a file is treated as hostile, every crash fix ships with a test that crashed before
  it. "Report progress honestly": every number labelled measured or estimated, a stub counted as a
  stub. And agents ask a human only about licences, money, publishing, personal data and destructive
  git; everything else they decide and write down.

## Exceptions

- **Trade dress is theirs to defend.** The UI is measured against Premiere's own menu dump and names
  Adobe features (Lumetri, Ultra Key). Do not copy their naming.
- **Codec patents.** Apache-2.0 gives no cover for H.264, HEVC or AAC pools. Reading containers is
  fine; shipping their software encoders is a separate decision.
- **Bit-exact on conformance streams is not tested on cameras.** DJI and iPhone files are exactly
  what their gaps list says is missing.
