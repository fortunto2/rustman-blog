---
type: concept
description: "35 free, open-source audio plugins in Rust (CLAP/VST3/AU) for macOS and Windows: EQ, compressors, reverbs, vocal tools, a spatial panner and 7 instruments including a Bashkir jaw harp. Every parameter is reachable by an AI agent over MCP. One installer."
title: "SuperDuper DSP — 35 free Rust audio plugins an AI agent can mix with"
created: 2026-06-24
tags: [creative, project, open-source, rust, clap, vst3, au, audio, dsp, daw, reaper, ableton, mcp, agents]
project_type: tool
app_category: MultimediaApplication
publish: true
publish_as: project
source_url: "https://github.com/fortunto2/superduper-dsp"
github: fortunto2/superduper-dsp
index_line: "SuperDuper DSP: 35 free open-source Rust audio plugins (CLAP/VST3/AU), one macOS installer. Every parameter on an MCP bus, so Claude/Cursor/Codex can measure and mix. Kubyz jaw harp, Space panner, MIT"
index_section: "project"
---

# SuperDuper DSP

35 audio plugins written in Rust, free and MIT-licensed: the everyday mixing set (EQ, compressors, reverbs, de-esser, limiter, meters), vocal tools, a surround panner, and 7 instruments. They run in any host that loads CLAP, VST3 or Audio Unit. What makes them different: every plugin publishes what it hears on a shared bus, and an AI agent can read that bus and turn every knob over MCP.

<div style="display:flex;flex-wrap:wrap;gap:12px;margin:1.5em 0">
<a href="https://github.com/fortunto2/superduper-dsp/releases/latest/download/SuperDuperDSP-macos-arm64.pkg" style="display:inline-block;padding:12px 20px;border-radius:8px;background:#16a34a;color:#fff;font-weight:600;text-decoration:none">macOS installer (Apple silicon)</a>
<a href="https://github.com/fortunto2/superduper-dsp/releases/latest/download/SuperDuperDSP-windows-x64-Setup.exe" style="display:inline-block;padding:12px 20px;border-radius:8px;background:#2563eb;color:#fff;font-weight:600;text-decoration:none">Windows installer (x64)</a>
<a href="https://github.com/fortunto2/superduper-dsp/releases/latest" style="display:inline-block;padding:12px 20px;border-radius:8px;border:1px solid currentColor;font-weight:600;text-decoration:none">All downloads</a>
</div>

### macOS

One `.pkg`, four checkboxes:

- **CLAP** (always on): REAPER, Bitwig, Studio One, Logic 11+.
- **VST3** and **Audio Unit**: Ableton, Cubase, FL Studio, DaVinci Resolve, Logic. They are thin wrappers that load the CLAP, which is why CLAP is always installed.
- **Agent tools**: the `sdsp-bus` MCP server and `sdsp-chain` renderer, four skills, and `sdsp-bus setup`, which registers the server in whichever of Claude Code, Claude Desktop, Cursor, Windsurf and Codex you already have. Nothing of yours is overwritten; `sdsp-bus setup --uninstall` takes it back.

The package isn't notarized yet, so the first time macOS may refuse to open it: right-click → Open.

### Windows

`Setup.exe` installs CLAP into `C:\Program Files\Common Files\CLAP` and, if ticked, the VST3 wrappers. Agent tools aren't in the Windows installer yet.

### The setup I'd recommend: CLAP in REAPER

If you're picking a DAW for this, take REAPER and load the **CLAP** versions (search the FX browser for `CLAP: SuperDuper`). CLAP is the format the plugins are written in, so there's no wrapper in the way; REAPER has loaded CLAP natively since 6.71; it's what I mix in every day, so it's the most tested path; and an agent can drive REAPER itself, not just the plugins, through a REAPER MCP server.

For that server, use our fork, **[fortunto2/total-reaper-mcp](https://github.com/fortunto2/total-reaper-mcp)**. It fixes the upstream install (a pinned `mcp<2`, no tracked `.venv`), starts its REAPER bridge automatically, and adds `run_lua` for anything the fixed tools can't reach:

```bash
git clone https://github.com/fortunto2/total-reaper-mcp && cd total-reaper-mcp
python3 -m venv .venv && .venv/bin/pip install -e .
./scripts/install_bridge.sh     # then restart REAPER
claude mcp add reaper -- "$PWD/.venv/bin/python" -m server.app --profile dsl-production
```

With both servers connected, the agent hears the mix through `superduper-bus` and edits the session through `reaper`.

Single plugins have their own zips on the [release page](https://github.com/fortunto2/superduper-dsp/releases/latest).

## The plugins

**Mixing and mastering**
- **EQ**: 3-band parametric with high/low cut, plus a dynamic mid band that can react to another track.
- **LinEq**: linear-phase version of the same curve for the master, 2048 taps.
- **Compressor**: soft knee, 2 ms lookahead, sidechain input, Clean / Pump / Smooth curves, a dual RMS-plus-peak detector.
- **Multiband**: 2 to 4 bands, bit-for-bit transparent until a band actually compresses (measured −240 dB difference), each band can duck under another track.
- **Saturator**: tape, tube and soft clip, plus Inflate, the mastering loudness curve after the Oxford Inflator.
- **Limiter**: lookahead brickwall with true-peak detection.
- **Soothe**: 24-band resonance suppressor for harsh vocals and muddy peaks; can also duck one track under another, Trackspacer-style.
- **Spectrum**: analyzer with a BS.1770 LUFS meter and true peak, plus a Mix view that shows which tracks mask each other.
- **Mid/Side**: stereo width and M/S encode/decode.

**Space and time**
- **Reverb**: Dattorro plate. **Supermass**: huge cascade reverb with tails up to ~28 s.
- **Delay**: tape-style feedback, ping-pong, slapback, ducks under the vocal.
- **Chorus**, **Filter** (resonant multi-mode with LFO and envelope follower), **Looper** (4-track, host-synced).
- **Space**: places a track in the room. VBAP panning to stereo, quad, 5.1, 7.1 and 7.1.4.

**Voice**
- **Vocal**: de-esser that follows the sibilance, plosive killer, hum and click removal.
- **Tune**: pitch correction to a scale, to MIDI notes or to another track; hard T-Pain at 0 ms.
- **Pitch**: pitch and formant shift, a voice engine plus a polyphonic one that can change the key of a whole mix.
- **Double**: a doubler that drifts like a second take, not like a chorus; Tuned modes snap the doubles to the key.
- **Vocoder**: 11 / 16 / 20 bands, play chords on a MIDI keyboard.
- **Formant**: three vowel resonances on any sound; Follow mode copies them from a singer onto an instrument.
- **Morph**: moves a sound's timbre toward another sound (or the Kubyz model) while the performance stays.

**Texture and repair**
- **Granular**: grain cloud with freeze, one sung note becomes a pad. **Stretch**: PaulStretch, up to 50×.
- **Harmonic**: cleans contact-mic rustle off a piezo jaw harp without touching the plucks.
- **NAM**: Neural Amp Modeler, loads community `.nam` amp captures.

**Instruments**
- **Wave**: wavetable bass and lead, draw your own waveform, Serum-compatible wavetable export.
- **Kubyz**: physical model of the Bashkir jaw harp, with a vowel pad that shapes it like a mouth.
- **Drum**: 6 synth voices, each pad can also play a sample or both; moves the kick to the song's key.
- **Piano**: SFZ player, matches sfizz within 0.3 dB on Salamander Grand.
- **Sampler**, **Pad**, **Ambient** (a generator that plays drones by itself), **Wind** (kurai, nay, howling wind; also works as an effect).

## Working with an agent

Every plugin writes its track name, level and a 32-band spectrum into a shared memory file, the SuperDuper bus. `sdsp-bus serve` exposes that bus as an MCP server, and the rule in the repo is that a feature an agent cannot reach does not exist. In practice:

- **Every parameter of every plugin** can be read and set by name. State that isn't a parameter (Wave's wavetable, Kubyz harmonics and formants, Space position, presets) goes through a mailbox.
- **`mix_masking`** says which tracks fight in which band while the song plays; **`mix_phase`** finds bands where parts cancel; **`mix_compare`** shows what a change did.
- **`duck_under`** and the **bus key** make a reverb, delay, EQ band, compressor or multiband band duck under another track with no sidechain routing in the DAW.

This works in any host: the plugins talk to the agent directly, the DAW doesn't need to know. To also drive the DAW itself (create tracks, write MIDI, render) in REAPER, add the REAPER MCP server from [our fork](https://github.com/fortunto2/total-reaper-mcp) (setup above); the `superduper-song` skill explains how the two work together.

**Prompts** (one command each; in Claude Code they show up as `/mcp__superduper-bus__…`): `mix-check` (measure, change nothing), `make-room-for-vocal`, `duck-under`, `fix-mud`, `master-to-target`. Each one measures, makes one change, measures again and keeps the old values as undo.

**Skills** (instructions an agent loads when the task matches). All nine install as a Claude Code plugin: `claude plugin marketplace add https://github.com/fortunto2/superduper-dsp && claude plugin install superduper-dsp@superduper-dsp`. The installer also links the first four; keep one route:
- `sdsp-mix`: mix and master by measurement: who masks whom, kick/bass ducking, a pocket for the vocal, band balance against a reference.
- `superduper-song`: build a track in REAPER on these instruments, with parameter maps and preset indices.
- `sdsp-chain`: render plugin chains and instruments from the command line, no DAW, with LUFS and true peak per stage.
- `audio-to-midi`: turn a recording into MIDI and check it before trusting it.
- In the repo: `track-teardown` (take a reference song apart and rebuild its feel), `vocal-mix` (a slot-by-slot vocal chain), `superduper-plugin` (write a new plugin in this codebase).

The video skills that use them (scores for travel films, chords lifted from footage) are in [[creative-skills]].

## Principles

- **Measured, not tuned by ear.** Every plugin passes the official `clap-validator`; each has checked-in quality snapshots (THD, aliasing, levels) that run on every release build; the mix tools are checked against 15 scenes with known answers before their output is trusted. When the validator found 34 real failures that an old report had printed as zero, they were fixed, not hidden.
- **One plugin, one job.** 35 small plugins instead of one channel strip.
- **Offline.** No accounts, no license server, no telemetry. The audio never leaves the machine.
- **Open.** MIT license, Rust, source on [GitHub](https://github.com/fortunto2/superduper-dsp).

## How it compares

Against FabFilter, iZotope, oeksound Soothe or Wavesfactory Trackspacer, the honest picture:

- **Free and open source.** You can read how every block works and change it.
- **Agent-addressable.** Commercial plugins expose automation parameters at best; here an agent can also read what each track sounds like and fix masking with numbers.
- **The plugins hear each other.** Ducking a reverb under the vocal or carving a band out of the guitar when the voice comes in needs no sidechain routing.
- **Instruments nobody else makes**: a Bashkir kubyz physical model, kurai and nay in Wind.

Where it's weaker:

- **Young.** Started in 2026; the GUIs are functional, not polished.
- **Not notarized.** The installer is unsigned by Apple, so the first launch needs a right-click → Open, and the plugins are ad-hoc signed.
- **Platforms:** macOS on Apple silicon and Windows x64. No Intel Mac, no Linux build yet.
- **One developer**, built for my own music first. Bugs get fixed fast, but there is no support team.

New to this? Start with the musician's guide, [[creative-music-with-claude]].

## Connections

- [[creative-music-with-claude]] — the same suite driven by Claude in REAPER: setup, what to ask, what I learned. Written for musicians.
- [[creative-video-with-claude]] — the soundtrack side of the travel films: themes played in the footage, re-played with these plugins.
- [[project-superduperai]] — same SuperDuper brand; this is the audio-DSP arm of the portfolio, the products half of the consulting+products barbell.
- [[project-kubizbeat]] — the **Kubyz** instrument here is the same Bashkir jaw-harp physical model that powers KubizBeat. Cultural-preservation DSP reused as a synth voice; shared physical-modeling code.
- [[cli-first-testing]] — `sdsp-chain` and the WAV-audit tests are the CLI mirror of every plugin: if a DSP block works headless from the command line, it's decoupled from the GUI and the host.
- [[privacy-as-architecture]] — native plugins, no accounts, no telemetry, no network. The audio never leaves your machine; same on-device-by-default stance as the rest of the portfolio.
- [[connectome-as-instrument]] — the fly connectome as a modulation source for this suite: ~2700 cells of the olfactory path run realtime on one core, and Kenyon-cell sparse coding is a non-repeating note generator that a Rust CLAP plugin can host directly
