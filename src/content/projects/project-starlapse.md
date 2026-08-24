---
type: concept
description: "Long-exposure astrophotography for iPhone: manual camera that holds, frame stacking from 10s to an hour, star alignment, night time-lapse, and a meteor detector with a pre-roll buffer."
title: "Starlapse — long-exposure astrophotography for iPhone"
created: 2026-08-13
tags: [project, ios, swift, astrophotography, metal, starlapse]
project_type: app
source_url: "https://github.com/fortunto2/starlapse"
app_store_id: "6801191027"
index_line: "Starlapse: iPhone astro camera — locked manual control, stacking, star alignment, meteor detector; built in one night of Perseids"
index_section: "project"
publish: true
publish_as: project
---

# Starlapse

Built on 2026-08-13, the night the Perseids peaked, because no camera app would hold an
exposure setting and none would say where to point.

Public, MIT: [github.com/fortunto2/starlapse](https://github.com/fortunto2/starlapse)

## The three hardware facts it is built around

Every design decision follows from these, and each contradicts something people bring from
DSLR astrophotography:

1. **Aperture is not adjustable.** iPhone lenses have fixed apertures. "Opening up" means
   picking a faster lens (main ≈ f/1.78 vs ultra-wide f/2.2), nothing more.
2. **A single frame caps at ~1 second.** `activeFormat.maxExposureDuration`. Night mode's
   30 s is private API. Everything longer is **stacked** — which is better than a long
   exposure, because noise falls as √N and the same frames can be developed as pinpoint
   stars or star trails afterwards.
3. **Capture cannot run in the background.** iOS force-stops `AVCaptureSession`. The honest
   substitute is `isIdleTimerDisabled` plus a dimmed screen.

The UI states all three rather than hiding them: a "10 minute exposure" is shown as
"600 × 1.00s".

## What is worth stealing from it

**The domain is platform-free.** `SkyKit` (where things are in the sky) and `StackKit` (star
detection, frame registration) import only Foundation and simd. 43 tests run in 3 seconds on
a Mac with no simulator. A CLI, `starlapse-sky tonight --lat … --lon …`, drives the same code
— CLI-first testing that actually earns its keep.

**Tests anchored to external facts, not to their own output.** Polaris altitude equals
latitude; the synodic month falls out of the periodic terms; the Moon is new on the day of
the 2026-08-12 solar eclipse. When a test failed, the maths was right and the test's own
constants were wrong — three of four raw timestamps pointed at a different day than their
comment claimed. Now: no magic timestamps, only `utc(y, m, d, h)`.

**Alignment proven arithmetically.** Star registration is tested against synthetic fields
rotated by a known angle, recovering it to 0.05°. A misaligned stack just looks like a
slightly soft photo — you would find out in a field at 2am.

**Where to aim is not where the radiant is.** Meteors streak *away* from the radiant, so the
longest trails are 40° off to the side. The app computes that, keeps clear of the Moon, and
picks a height a tripod can hold. That is the part that earns the app.

## Lessons that generalise

- [[swift6-callback-isolation]] — the crash that survived two rounds of fixes aimed at the
  wrong subsystem. Pull the crash report before theorising.
- **A comment that promises what the code does not do is worse than no comment.** The ring
  buffer's doc said "the event lands in the middle of the clip"; it was sized to the pre-roll
  only, so the post-roll evicted the history and one frame survived. Another cited a camera
  format preference that did not exist — 300 MB of ring buffer and 200 MB/s of memcpy.
- **Never derive a state's purpose from a combination of other fields.** `isFraming` meant
  "no segment count"; then watching arrived, which also has no segment count, and the stop
  button silently did nothing. Twice from the same root, so purpose is stored now.
- **Screenshots without faking.** The Simulator has no camera, so a synthesised sky is fed
  through the real pipeline — same stacking, same alignment, same curve. A meteor crosses
  because the app is built to catch meteors. No comet: those come every few years, and a
  screenshot promising one promises a buyer something they will not get.

## Status

TestFlight, build 2. Store listing complete, `asc validate` clean. Release mechanics in
`docs/store/RELEASE.md`.

Unproven where it matters: the time-lapse path has never run to completion and the detector
has never seen a meteor. Everything above the domain layer is verified by reasoning and
compilation, not by photons.
