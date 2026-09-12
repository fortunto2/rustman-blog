---
type: concept
title: "Pick the format your generator already speaks — HyperFrames' bet on plain HTML"
description: "HeyGen's HyperFrames renders video from plain HTML with data-* timing attributes instead of React components, on the argument that agents already write HTML. Deterministic frames make the output regression-testable, which is what turns a generated video into something a CI job can check."
created: 2026-09-08
tags: [agents, video, determinism, agent-authoring, open-source, skills, testing]
publish: true
source_url: "https://github.com/heygen-com/hyperframes"
index_line: "HyperFrames (heygen-com, Apache-2.0, 47,037 stars / 4,360 forks, created 2026-03-10 — verified via the GitHub API, not the README): renders video by seeking each frame in headless Chrome and encoding with FFmpeg. Composition is plain HTML with data-start / data-duration / data-track-index; no bundler, index.html previews in a browser as-is. Explicit contrast with Remotion — 'Remotion's bet is React components; HyperFrames' bet is plain HTML', because agents already write HTML. Deterministic frames make golden-file regression tests possible; ~240 MB of .mp4 fixtures in Git LFS. Ships 20 published skills with the library. Node 22+, FFmpeg, distributed rendering only on AWS Lambda"
index_section: "concept"
---

# Pick the format your generator already speaks

HyperFrames renders MP4 from a composition that is an ordinary HTML file: timing
lives in `data-start`, `data-duration`, `data-track-index`, animation comes from
whatever seekable runtime you like (GSAP, CSS, Lottie, Three.js, WAAPI), and the
renderer seeks each frame in headless Chrome and hands it to FFmpeg. There is no
bundler; `index.html` opens in a browser and plays.

The project states its own contrast with Remotion in one line: *"Remotion's bet is
React components; HyperFrames' bet is plain HTML"*, and gives the reason as **agents
already write HTML**. That is the idea worth extracting, and it generalises past
video: when the primary author of an artifact is a model rather than a person, the
representation to choose is the one the model is already fluent in — not the one with
the nicest developer ergonomics. A React composition is better for a human team with
a component library. HTML is better when the thing producing it has read most of the
HTML ever written and comparatively little of your JSX conventions.

## Determinism is what makes it checkable

The second half is what stops this being a preference. The renderer promises *same
input, same frames, same output*, and the repository carries roughly **240 MB of
`.mp4` fixtures in Git LFS** as regression tests. A non-deterministic renderer can
only be reviewed by watching; a deterministic one can be diffed, so a generated video
becomes an artifact a CI job checks rather than one a person approves.

That is the same move [[harness-engineering-summary]] argues for everywhere else: the
value is not that the output is good, it is that a wrong output is *detectable
without a human in the loop*. Agent-authored anything needs that property or the
review cost eats the generation saving.

## The numbers, and where they came from

**47,037 stars, 4,360 forks, Apache-2.0, TypeScript, created 2026-03-10** — six
months old. Those are from the GitHub API rather than the README, because a
star count read off a page is the kind of figure that gets repeated without anyone
checking it. Node 22+ and FFmpeg are required; distributed rendering exists only on
AWS Lambda, which the project itself calls less mature than Remotion Lambda.

## What it connects to here

[[clips-agent-native-video]] is the mirror image and the reason to read both: Clips
makes video an agent can **watch** — API and metadata so a model can see and hear any
timestamp. HyperFrames makes video an agent can **write**. Between them the medium
stops being opaque in both directions, which is a bigger change than either alone.

[[skills-standard]] matters because HyperFrames ships **20 published skills** with the
library, teaching video-production patterns its authors say generic web documentation
misses. That is the harness shipped with the tool rather than left to whoever installs
it — the same argument as bundling rules with a plugin instead of writing a tutorial.
