---
type: concept
description: "Open-source CLAP plugin suite — 23 focused audio effects and synths written in Rust, with a retro phosphor-green GUI. Runs in REAPER, Ableton, and any CLAP/VST3/AU host. Built for personal use first."
title: "SuperDuper DSP — 23 Rust audio plugins (CLAP/VST3/AU)"
created: 2026-06-24
tags: [project, open-source, rust, clap, vst3, audio, dsp, daw, reaper, ableton]
project_type: tool
publish: true
publish_as: project
source_url: "https://github.com/fortunto2/superduper-dsp"
github: fortunto2/superduper-dsp
index_line: "SuperDuper DSP: 23 open-source Rust audio plugins (CLAP/VST3/AU), retro phosphor-green GUI. EQ, comp, reverb, NAM, Soothe-style suppressor + 6 synths. Runs in REAPER/Ableton, daily-driver dogfooding, MIT"
index_section: "project"
---

# SuperDuper DSP

Open-source **CLAP plugin suite — 23 focused effects and synths written in Rust**, with a retro phosphor-green theme, custom egui GUIs, factory presets, and CLAP state persistence. CLAP is the primary format; VST3 and Audio Unit v2 ship via `clap-wrapper` bridges, so the same `.clap` core loads everywhere.

Built as a daily-driver toolkit, not a product launch — I use it myself in **REAPER and Ableton**. Dogfooding is the design constraint: every plugin has to earn its slot on a real mix bus before it stays in the repo. Works in any CLAP/VST3/AU host: REAPER, Bitwig, Studio One, FL Studio, Logic 11+, Ableton, Cubase, DaVinci Resolve, GarageBand.

## What's in the suite

**17 effects:** EQ (3-band RBJ biquad) · LinEq (linear-phase 2048-tap FIR mastering EQ) · Compressor (soft-knee feed-forward + sidechain) · Saturator (tape/tube/soft-tanh, 2×/4× oversampling) · Delay (Lagrange interpolation, tape feedback, ducking) · Reverb (Dattorro plate) · Supermass (cascade reverb→chorus→reverb, 28s tail) · Limiter (lookahead brickwall, true-peak) · Spectrum (BS.1770 LUFS-M/S/I meter) · Vocal (de-esser, plosive killer, hum/click removal) · Chorus · Looper (Mobius-style 4-track) · Filter (resonant multi-mode + LFO) · MidSide (M/S width) · Soothe (24-band dynamic resonance suppressor) · NAM (Neural Amp Modeler, loads community `.nam` files) · Denoise (planned RNNoise port).

**6 instruments:** Pad (8-voice poly synth) · Ambient (autonomous chord-drone generator) · Wave (wavetable bass/lead, mouse-editable curves, Serum export) · Kubyz (jaw-harp physical model with IPA vowel pad) · Drum (6-voice analog drum machine) · Sampler (poly WAV player, YIN pitch detection).

Common across plugins: sidechain ports, host automation write, A/B + Initialize workflow, tempo-synced LFOs, a live spectrum strip, and a `[bNNNNN]` build-number suffix in display names so you always know which bundle a session loaded.

## Architecture

Cargo workspace: `sdk/` (CLAP helpers) → `synth-core/` (shared DSP blocks: Biquad, DelayLine, Oversampler) → `effects/` (the plugins). DSP is research-grounded — Dattorro reverb topology (1997), Giannoulis compressor design (JAES 2012), the RBJ EQ cookbook. A standalone `tools/sdsp-runner` lets you process a WAV through a plugin without a DAW, and end-to-end tests audit output WAVs for THD/aliasing.

```bash
make all     # CLAP + VST3 + AU
make clap    # just .clap bundles
make wave    # a single plugin
```

Install: grab bundles from [Releases](https://github.com/fortunto2/superduper-dsp/releases/latest), drop the `.clap` into your CLAP folder, rescan. MIT licensed.

## Agent tooling

Three Claude Code skills wrap this repo for AI-assisted DSP work: `superduper-plugin` (scaffold a new CLAP plugin with the full boilerplate checklist), `sdsp-chain` (run a headless mastering chain with per-stage LUFS/dBTP/RMS), and `sdsp-runner` (single-plugin testing). The `CLAUDE.md` in the repo (~49KB) is the harness that makes adding a plugin a repeatable agent task rather than a from-scratch build.

## Connections

- [[project-superduperai]] — same SuperDuper brand; this is the audio-DSP arm of the portfolio, the products half of the consulting+products barbell.
- [[project-kubizbeat]] — the **Kubyz** instrument here is the same Bashkir jaw-harp physical model that powers KubizBeat. Cultural-preservation DSP reused as a synth voice; shared physical-modeling code.
- [[cli-first-testing]] — `sdsp-runner` and the WAV-audit tests are the CLI mirror of every plugin: if a DSP block works headless from the command line, it's decoupled from the GUI and the host.
- [[privacy-as-architecture]] — native plugins, no accounts, no telemetry, no network. The audio never leaves your machine; same on-device-by-default stance as the rest of the portfolio.
