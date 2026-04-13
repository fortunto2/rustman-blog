---
type: concept
title: "Glicol -- graph-oriented live coding music in Rust"
description: "Live coding music language and audio engine in Rust. Runs in browser via WASM, VST plugins, embedded boards. Graph-oriented synthesis with zero-install web playground."
created: 2026-04-14
tags: [rust, music, audio, wasm, live-coding, open-source]
publish: true
source_url: "https://github.com/chaosprint/glicol"
---

# Glicol

Computer music language with both parser and audio engine written in Rust. Live code music in your browser at [glicol.org](https://glicol.org) -- zero install, WASM-powered.

## How it sounds

Graph-oriented: nodes connect with `>>`, reference with `~name`.

```
// AM synthesis
o: sin 440 >> mul ~amp
~amp: sin 1.0 >> mul 0.3 >> add 0.5
```

```
// Sequencer with random notes
o: speed 2.0 >> seq 60 _~a _ 48__67 >> sp \blip
~a: choose 60 60 0 0 72 72
```

```
// Raw DSP in meta blocks
o: meta `
    output.pad(128, 0.0);
    for i in 0..128 {
        output[i] = sin(2*PI()*phase);
        phase += 440.0 / sr;
    };
    while phase > 1.0 { phase -= 1.0 };
    output
`
```

## Architecture

- **glicol-synth** -- audio graph engine (dasp_graph + const generics)
- **glicol-parser** -- pest.rs grammar
- **glicol-wasm** -- WebAssembly build for browsers
- **glicol-ext** -- macro-based node extensions (reverbs, etc.)

Runs on: browsers (AudioWorklet + SharedArrayBuffer), VST plugins, Bela board (embedded), desktop.

## Design

"Low entry fee, high ceiling." Someone with zero coding/music knowledge can start with `sin 440`. An experienced coder can write sample-accurate DSP in meta blocks.

Graph updates use LCS (Longest Common Subsequence) -- change one node, only that part re-renders. No audio glitches during live edits.

## Relation to KubizBeat

Not a direct fit for kubyz instrument emulation (Glicol is a general live coding language, not an instrument sampler). But the Rust + WASM audio engine architecture is relevant:

- **glicol-synth** as a reference for building real-time audio graphs in Rust
- **WASM audio** pattern: AudioWorklet + SharedArrayBuffer for browser-based instruments
- **Graph-oriented synthesis** could model kubyz overtone series

## Links

- [glicol.org](https://glicol.org) -- live playground
- [GitHub](https://github.com/chaosprint/glicol) -- 2.9k stars, MIT
- [NPM](https://glicol.js.org) -- npm package for web projects
