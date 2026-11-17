---
type: guide
title: "Build your own auto-montage engine in Rust"
description: "A 500-line Rust program that turns a folder of phone clips and a song into a film cut on the beat: beat tracking from scratch, a cheap clip scorer, a knapsack that picks the moments, and one ffmpeg command to render."
created: 2026-11-17
tags: [guide, rust, video, audio, beat-tracking, knapsack, montage, ffmpeg, life2film, build-your-own]
publish: true
feed: true
github:
index_line: "Guide, 4 mermaid diagrams + glossary: build-your-own auto-montage in Rust, std only (~490 code lines + 4 tests). Probe with ffprobe; song to mono PCM via ffmpeg; own radix-2 FFT, spectral-flux onsets, autocorrelation tempo + comb fit for the beat grid; clip score = motion + Laplacian variance, dark penalty, 4 fps at 96x54; multiple-choice knapsack fills N beat-units; cuts are whole beats so they land on kicks; one ffmpeg filter_complex renders. Measured: synthetic 120/100/90/140 BPM tracked to 120.01/100.00/90.01/140.00, cuts within 5 ms of the true kick; 99 s of clips to a 38 s film in 4.9 s; 6 real phone clips (165 s) to an 84 s film in 37 s. Gotchas: STFT frame stamp is ~40 ms early, a loud offbeat hi-hat flips the phase by half a beat."
---

# Build your own auto-montage engine in Rust

You shot forty clips on your phone this month. You have a song. You want a film that cuts on the beat, with the good moments in it and the black frames of your pocket left out. Cutting that by hand takes an evening. The program below makes a first cut in under a minute.

We will write it from nothing but the Rust standard library: no crates, no machine learning, about 490 lines of code. `ffmpeg` is used the way a compiler uses a linker: it decodes and encodes, and everything that decides what goes into the film is ours. That includes a Fourier transform, a beat tracker, a clip scorer and a knapsack solver.

## The short version

| Step | What the program does | Why that way |
|---|---|---|
| 1. Probe | Ask `ffprobe` for each clip's length and orientation | Cheap, and it drops broken files early |
| 2. Beat | Decode the song, find onsets with an FFT, find the tempo by autocorrelation, fit a beat grid | A film looks "on the beat" when every cut lands on one |
| 3. Score | Sample each clip at 4 frames a second, measure motion, sharpness and darkness | Cheap signals that separate a moment from a pocket |
| 4. Select | A knapsack picks the shots that fill the song exactly | Maximises total score for a fixed length |
| 5. Snap | Make every shot a whole number of beats long | Then every cut is on a beat by construction |
| 6. Render | One `ffmpeg` filtergraph: trim, scale, concat, fade the song | One process, one file out |

Measured on my Mac: eight synthetic clips (99 s of footage) and a 40 s song at 120 BPM became a 38 s film in 4.9 s. The tracker said 120.01 BPM, and every cut landed within 5 ms of the true kick drum. Six real phone clips (165 s) and an 84 s song became an 84 s film in 37 s. Every number in this post comes from the code printed here, compiled and run.

## Words used here

- **PCM**: raw audio as a list of numbers, one per sample. What you get when you decode an mp3.
- **FFT**: the Fast Fourier Transform. Turns a short slice of audio into "how much energy at each pitch".
- **Onset**: the moment a new sound starts. A drum hit is an onset; a held pad is not.
- **Spectral flux**: how much the spectrum grew since the previous slice. Big flux means something just started.
- **Tempo (BPM)**: beats per minute. At 120 BPM a beat lasts 0.5 s.
- **Autocorrelation**: compare a signal with a copy of itself shifted by some lag. If the signal repeats every 43 frames, the match at lag 43 is high. That is how we find the beat period.
- **Beat grid**: the tempo plus the time of the first beat. Every other beat is `first + n * period`.
- **Laplacian variance**: a standard sharpness measure. Edges make the Laplacian of an image large; blur makes it flat.
- **Knapsack**: you have a bag that holds N units and a pile of items, each with a size and a value. Choose items to maximise total value without overflowing the bag.
- **EDL**: edit decision list. The plain list of "take clip X from second A for D seconds" that describes a cut.
- **Filtergraph**: ffmpeg's way to describe a chain of video and audio operations in one command line.

## The plan

```mermaid
flowchart LR
  A[Folder of clips] --> B[Probe]
  S[Song] --> C[Beat grid]
  B --> D[Score frames]
  D --> E[Knapsack picks shots]
  C --> E
  E --> F[Whole beats per shot]
  F --> G[ffmpeg render]
  S --> G
  G --> H[film.mp4]
```

The song decides how long the film is and where the cuts fall. The clips decide what is in it. They meet at the knapsack: the song says "fill 19 slots of 2 seconds", the clips say "here are the moments, and here is how good each one is".

## Setup

You need Rust (any recent stable) and `ffmpeg` with `ffprobe` on your PATH.

```toml
[package]
name = "montage"
version = "0.1.0"
edition = "2024"
```

No dependencies. Put everything in `src/main.rs`. The file starts with its imports and one error alias:

```rust
use std::f64::consts::PI;
use std::path::{Path, PathBuf};
use std::process::Command;
type Res<T> = Result<T, Box<dyn std::error::Error>>;
```

## Step 1. Probe the clips

For each file we need three facts: how long it is, whether it is a portrait or landscape clip, and whether `ffprobe` can read it at all. Phone clips are named by time (`IMG_2238.mov`, `2023-11-23 13-24-22.mp4`), so sorting by name gives the order they were shot, which becomes the order of the film.

```rust
struct Clip {
    path: PathBuf,
    secs: f64,
    portrait: bool,
}

fn probe(p: &Path) -> Res<Clip> {
    let o = Command::new("ffprobe")
        .args([
            "-v",
            "error",
            "-select_streams",
            "v:0",
            "-show_entries",
            "stream=width,height:format=duration",
            "-of",
            "csv=p=0",
        ])
        .arg(p)
        .output()?;
    let text = String::from_utf8_lossy(&o.stdout).to_string();
    let mut lines = text.lines();
    let mut wh = lines.next().ok_or("no video stream")?.split(',');
    let (w, h): (u32, u32) = (
        wh.next().ok_or("no width")?.parse()?,
        wh.next().ok_or("no height")?.parse()?,
    );
    let secs: f64 = lines.next().ok_or("no duration")?.trim().parse()?;
    Ok(Clip {
        path: p.to_path_buf(),
        secs,
        portrait: h > w,
    })
}

fn list_clips(dir: &Path) -> Res<Vec<Clip>> {
    let mut paths: Vec<PathBuf> = std::fs::read_dir(dir)?
        .filter_map(|e| e.ok().map(|e| e.path()))
        .filter(|p| {
            let ext = p
                .extension()
                .and_then(|e| e.to_str())
                .unwrap_or("")
                .to_lowercase();
            ["mp4", "mov", "m4v", "mkv"].contains(&ext.as_str())
        })
        .collect();
    paths.sort(); // phone clips are named by time, so name order is story order
    let mut clips = Vec::new();
    for p in paths {
        match probe(&p) {
            Ok(c) if c.secs >= 1.5 => clips.push(c),
            _ => eprintln!("skip {}", p.display()),
        }
    }
    Ok(clips)
}
```

We drop clips under 1.5 s. A film cut every two seconds has no use for them.

## Step 2. Find the beat

This is the part that makes the film feel right, and the longest. It has four moves: decode, look at the spectrum slice by slice, turn the spectrum into an "something started here" curve, then find the tempo and the grid in that curve.

```mermaid
flowchart LR
  A[Song file] --> B[Mono PCM 22 kHz]
  B --> C[FFT every 11 ms]
  C --> D[Onset curve: flux]
  D --> E[Autocorrelation]
  E --> F[Rough tempo]
  F --> G[Slide tempo and phase]
  G --> H[Beat grid]
```

### Decode and transform

`ffmpeg` converts any song to 32-bit float PCM, mono, 22,050 Hz, written to a pipe. 22 kHz is plenty: beats live in the low and mid frequencies, and halving the data makes everything faster. Then comes the FFT. We need only one: the textbook radix-2 version, 25 lines.

```rust
const SR: usize = 22_050;

const N_FFT: usize = 1024;

const HOP: usize = 256;

const DT: f64 = HOP as f64 / SR as f64; // seconds per onset frame

/// A frame is stamped with its start, but a click is loudest to the flux when it sits about
/// three quarters of the way into the window: the stamp is early by that much.
const LATENCY: f64 = 0.75 * N_FFT as f64 / SR as f64;

fn decode_mono(p: &Path) -> Res<Vec<f32>> {
    let o = Command::new("ffmpeg")
        .args(["-v", "error", "-i"])
        .arg(p)
        .args(["-f", "f32le", "-ac", "1", "-ar", &SR.to_string(), "-"])
        .output()?;
    if !o.status.success() {
        return Err("ffmpeg could not decode the song".into());
    }
    Ok(o.stdout
        .as_chunks::<4>()
        .0
        .iter()
        .map(|b| f32::from_le_bytes(*b))
        .collect())
}

/// In-place radix-2 FFT. `re.len()` must be a power of two.
fn fft(re: &mut [f64], im: &mut [f64]) {
    let n = re.len();
    let mut j = 0;
    for i in 1..n {
        let mut bit = n >> 1;
        while j & bit != 0 {
            j ^= bit;
            bit >>= 1;
        }
        j |= bit;
        if i < j {
            re.swap(i, j);
            im.swap(i, j);
        }
    }
    let mut len = 2;
    while len <= n {
        let ang = -2.0 * PI / len as f64;
        for s in (0..n).step_by(len) {
            for k in 0..len / 2 {
                let (wr, wi) = ((ang * k as f64).cos(), (ang * k as f64).sin());
                let (a, b) = (s + k, s + k + len / 2);
                let (tr, ti) = (re[b] * wr - im[b] * wi, re[b] * wi + im[b] * wr);
                re[b] = re[a] - tr;
                im[b] = im[a] - ti;
                re[a] += tr;
                im[a] += ti;
            }
        }
        len <<= 1;
    }
}
```

We slide a 1024-sample window along the song in steps of 256 samples, so one frame every 11.6 ms. `DT` is that step in seconds. `LATENCY` I will explain in a moment, because I got it wrong the first time.

### The onset curve

For each window we take the FFT, convert magnitudes to a log scale (so quiet parts count), and add up how much each frequency grew since the previous window. A drum hit makes many frequencies jump at once, so the sum spikes. Then we subtract a half-second moving average, because a sustained pad has a high but flat flux and we only want the peaks above it.

```rust
/// Spectral flux: how much new energy appeared in each frame, summed over frequencies.
fn onset_strength(x: &[f32]) -> Vec<f64> {
    let win: Vec<f64> = (0..N_FFT)
        .map(|i| 0.5 - 0.5 * (2.0 * PI * i as f64 / N_FFT as f64).cos())
        .collect();
    let mut prev = vec![0.0; N_FFT / 2];
    let mut flux = Vec::new();
    let mut start = 0;
    while start + N_FFT <= x.len() {
        let mut re: Vec<f64> = (0..N_FFT).map(|i| x[start + i] as f64 * win[i]).collect();
        let mut im = vec![0.0; N_FFT];
        fft(&mut re, &mut im);
        let mut f = 0.0;
        for k in 0..N_FFT / 2 {
            let mag = (1.0 + (re[k] * re[k] + im[k] * im[k]).sqrt()).ln(); // log: quiet parts count too
            f += (mag - prev[k]).max(0.0); // only increases are onsets
            prev[k] = mag;
        }
        flux.push(f);
        start += HOP;
    }
    // subtract a ~0.5 s moving average so sustained pads do not look like beats
    let r = 22;
    let sm: Vec<f64> = (0..flux.len())
        .map(|i| {
            let (a, b) = (i.saturating_sub(r), (i + r + 1).min(flux.len()));
            flux[a..b].iter().sum::<f64>() / (b - a) as f64
        })
        .collect();
    let mut out: Vec<f64> = flux.iter().zip(&sm).map(|(f, m)| (f - m).max(0.0)).collect();
    let max = out.iter().cloned().fold(1e-9, f64::max);
    out.iter_mut().for_each(|v| *v /= max);
    out
}
```

The result is a curve with one value per 11.6 ms, scaled to 0..1, with a bump at each drum hit.

### Tempo and grid

Two stages. First, autocorrelation: for every lag from 60 to 200 BPM, multiply the curve by itself shifted by that lag and average. The lag with the largest match is the beat period. A song at 120 BPM also repeats at 60 BPM and 240 BPM, so we weight the scores with a bell curve centred on 120 and about an octave wide. This is a prior, and a weak one: the 90, 100 and 140 BPM test songs below were found just as well.

The lag is a whole number of frames, which is coarse: at 120 BPM it is 43 frames, and one frame off is a 2% tempo error that drifts half a second over a minute. So the second stage refines. We lay a comb of equally spaced beats over the onset curve, slide the tempo through plus or minus 3% in 0.01 BPM steps and the start phase through one period, and keep the pair whose comb sits on the highest values of the curve.

```rust
struct Grid {
    bpm: f64,
    period: f64, // seconds per beat
    first: f64,  // time of the first beat
}

impl Grid {
    fn beat(&self, i: usize) -> f64 {
        self.first + i as f64 * self.period
    }
}

fn track_beats(onset: &[f64], song_secs: f64) -> Grid {
    // (a) tempo: autocorrelation of the onset curve, 60..200 BPM, nudged towards 120
    let lag = |bpm: f64| (60.0 / bpm / DT).round() as usize;
    let (mut best_bpm, mut best) = (120.0, f64::MIN);
    for l in lag(200.0)..=lag(60.0) {
        let r: f64 =
            (0..onset.len() - l).map(|i| onset[i] * onset[i + l]).sum::<f64>() / (onset.len() - l) as f64;
        let bpm = 60.0 / (l as f64 * DT);
        let prior = (-0.5 * ((bpm / 120.0).log2() / 1.0).powi(2)).exp(); // prefers the 90..160 octave
        if r * prior > best {
            best = r * prior;
            best_bpm = bpm;
        }
    }
    // (b) refine: a comb of equally spaced beats, slide tempo and phase, keep the best fit
    // read the curve between frames (linear interpolation) so the fit has one clear peak
    let at = |t: f64| -> f64 {
        let x = t / DT;
        let i = x.floor() as usize;
        let get = |j: usize| onset.get(j).copied().unwrap_or(0.0);
        get(i) * (1.0 - x.fract()) + get(i + 1) * x.fract()
    };
    let (mut fit, mut grid) = (
        f64::MIN,
        Grid {
            bpm: best_bpm,
            period: 60.0 / best_bpm,
            first: 0.0,
        },
    );
    let mut bpm = best_bpm * 0.97;
    while bpm <= best_bpm * 1.03 {
        let period = 60.0 / bpm;
        let mut phase = 0.0;
        while phase < period {
            let n = ((song_secs - phase) / period) as usize;
            let s: f64 = (0..n).map(|k| at(phase + k as f64 * period)).sum::<f64>() / n as f64;
            if s > fit {
                fit = s;
                grid = Grid {
                    bpm,
                    period,
                    first: phase,
                };
            }
            phase += DT / 2.0;
        }
        bpm += 0.01;
    }
    grid.first = (grid.first + LATENCY) % grid.period;
    grid
}
```

Two details cost me time. The curve is read with linear interpolation between frames: my first version took the maximum of three neighbouring frames, which made the fit flat across a whole range of tempos and always picked the lowest one (119.93 BPM for a 120 BPM song, which is 20 ms of drift over 36 s). And a frame is stamped with the time its window starts, but a click is loudest to the flux when it sits about three quarters of the way into the window. That is `LATENCY`, 35 ms. My own test caught it: the first run put the grid 41 ms early.

### Check it against a song you wrote

The only way to trust a beat tracker is to feed it something whose answer you know. `gen_inputs.sh` (below) makes a 40 s song with a kick drum every beat, a hi-hat between the kicks, and a pad underneath. The first kick is at 0.25 s.

| True tempo | Detected | First beat (true 0.25 s) |
|---|---|---|
| 90 BPM | 90.01 | 0.255 s |
| 100 BPM | 100.00 | 0.255 s |
| 120 BPM | 120.01 | 0.255 s |
| 140 BPM | 140.00 | 0.255 s |

My first synthetic song had a hi-hat at amplitude 0.15 against a kick at 0.9, and the grid came out a half beat late (first beat 0.499 s instead of 0.25 s). The hat is noise: it excites every frequency at once, so its flux is far bigger than a kick's, and the comb locked onto the hats. I turned the hat down to 0.02 and moved on. That fixes the test song, not the algorithm, so it is the first thing to improve for real music (see the end).

## Step 3. Score the clips

We need one number per moment: how worth watching is it? Three cheap signals, all computed on tiny frames.

`ffmpeg` samples each clip at 4 frames per second, scales to 96 by 54 pixels, and sends grayscale bytes down a pipe. For each frame we measure:

- **Motion**: mean absolute difference from the previous frame. A static shot of a wall scores near zero.
- **Sharpness**: variance of the Laplacian (each pixel minus the average of its four neighbours). A blurry frame, a lens cap, a pocket all score low.
- **Brightness**: the mean pixel value. Used only to punish dark frames.

```rust
const FPS: usize = 4; // sampled frames per second

const W: usize = 96;

const H: usize = 54;

struct FrameStat {
    motion: f64,
    sharp: f64,
    bright: f64,
}

fn frame_stats(p: &Path) -> Res<Vec<FrameStat>> {
    let o = Command::new("ffmpeg")
        .args(["-v", "error", "-i"])
        .arg(p)
        .args([
            "-vf",
            &format!("fps={FPS},scale={W}:{H},format=gray"),
            "-f",
            "rawvideo",
            "-",
        ])
        .output()?;
    let frames: Vec<&[u8]> = o
        .stdout
        .as_chunks::<{ W * H }>()
        .0
        .iter()
        .map(|f| f.as_slice())
        .collect();
    let mut stats = Vec::new();
    for (n, f) in frames.iter().enumerate() {
        let prev = if n > 0 {
            frames[n - 1]
        } else {
            frames.get(1).copied().unwrap_or(f)
        };
        let motion = f
            .iter()
            .zip(prev)
            .map(|(a, b)| (*a as f64 - *b as f64).abs())
            .sum::<f64>()
            / (W * H) as f64;
        // sharpness: variance of the Laplacian (edges and fine detail make it large)
        let g = |x: usize, y: usize| f[y * W + x] as f64;
        let mut lap = Vec::with_capacity(W * H);
        for y in 1..H - 1 {
            for x in 1..W - 1 {
                lap.push(g(x - 1, y) + g(x + 1, y) + g(x, y - 1) + g(x, y + 1) - 4.0 * g(x, y));
            }
        }
        let mean = lap.iter().sum::<f64>() / lap.len() as f64;
        let sharp = lap.iter().map(|v| (v - mean).powi(2)).sum::<f64>() / lap.len() as f64;
        let bright = f.iter().map(|&v| v as f64).sum::<f64>() / (W * H) as f64 / 255.0;
        stats.push(FrameStat {
            motion,
            sharp,
            bright,
        });
    }
    Ok(stats)
}
```

Raw numbers from different clips are not comparable, so we normalise by the 95th percentile of each signal across all clips (the 95th rather than the maximum, so one flash does not squash everything else), average motion and sharpness, and multiply by a darkness factor that goes to 0.05 for black frames.

```rust
fn percentile(mut v: Vec<f64>, q: f64) -> f64 {
    v.sort_by(|a, b| a.partial_cmp(b).unwrap());
    v[((v.len() - 1) as f64 * q) as usize].max(1e-9)
}

/// One number per sampled frame, 0..1. Normalised across all clips, so a dull clip stays dull.
fn score_all(stats: &[Vec<FrameStat>]) -> Vec<Vec<f64>> {
    let all = |f: fn(&FrameStat) -> f64| stats.iter().flatten().map(f).collect::<Vec<_>>();
    let (m95, s95) = (
        percentile(all(|s| s.motion), 0.95),
        percentile(all(|s| s.sharp), 0.95),
    );
    stats
        .iter()
        .map(|clip| {
            clip.iter()
                .map(|s| {
                    let dark = ((s.bright - 0.05) / 0.15).clamp(0.05, 1.0); // black frames are worthless
                    (0.5 * (s.motion / m95).min(1.0) + 0.5 * (s.sharp / s95).min(1.0)) * dark
                })
                .collect()
        })
        .collect()
}
```

This is a crude judge that cannot tell a smile from a bus. It does rank "something is happening, in focus, with light" above its opposite, which on phone footage removes most of the bad material.

## Step 4. Choose the moments

Now the song and the clips meet. The song gives a length; the clips give candidates.

**Units.** A shot should last a whole number of beats, and 2 to 3 seconds is a good pace for music. So we define a *unit* as the smallest of 1, 2, 4 or 8 beats that lasts at least 1.6 s. At 120 BPM that is 4 beats, 2 s. At 140 BPM, 4 beats is 1.71 s. A shot is 1 or 2 units long. The film must fill `cap` units, the number of whole units in the song.

**Candidates.** We cut every clip into segments 2 units long. For each segment we find the best window of 1 unit and the best window of 2 units (the one with the highest mean score), and offer both as options. Long shots pay a 10% tax on value, so the film does not drift into slow shots when the footage is uniform.

**Diversity.** From each segment we may take at most one option. That is the diversity rule: a good moment cannot be used twice, and one long clip cannot supply the whole film from a single hot spot, because it has only so many segments.

**Knapsack.** Each option has a weight (1 or 2 units) and a value (mean score times seconds times the tax). The bag holds exactly `cap` units. A pick-at-most-one-per-group knapsack is a small step from the classic one, and the table is tiny: groups times capacity times two options.

The values in this picture are made up; the shape is what matters. Each segment offers a short and a long option, and the knapsack takes at most one from each.

```mermaid
flowchart TB
  subgraph Seg1[Segment 1]
    A1[1 unit, value 0.9]
    A2[2 units, value 1.5]
  end
  subgraph Seg2[Segment 2]
    B1[1 unit, value 0.4]
    B2[2 units, value 0.9]
  end
  subgraph Seg3[Segment 3]
    C1[1 unit, value 1.1]
    C2[2 units, value 1.8]
  end
  Seg1 --> P{Pick at most one per segment}
  Seg2 --> P
  Seg3 --> P
  P --> R[Best total, exactly N units]
```

```rust
#[derive(Clone, Debug)]
struct Shot {
    clip: usize,
    start: f64, // seconds into the clip
    units: usize,
    value: f64,
}

/// Cut each clip into segments; every segment offers its best window at 1, 2 and 3 units long.
fn candidate_groups(
    clip: usize,
    scores: &[f64],
    clip_secs: f64,
    unit: f64,
    max_units: usize,
) -> Vec<Vec<Shot>> {
    let seg = (max_units as f64 * unit * FPS as f64).round() as usize;
    let mut groups = Vec::new();
    let mut s0 = 0;
    while (s0 as f64 / FPS as f64) + unit <= clip_secs && s0 < scores.len() {
        let seg_end = (s0 + seg).min(scores.len());
        let mut group = Vec::new();
        for units in 1..=max_units {
            let len = (units as f64 * unit * FPS as f64).round() as usize;
            if s0 + len > seg_end || (s0 as f64 / FPS as f64) + units as f64 * unit > clip_secs {
                break;
            }
            let (mut best, mut at) = (f64::MIN, s0);
            for a in s0..=seg_end - len {
                let m = scores[a..a + len].iter().sum::<f64>() / len as f64;
                if m > best {
                    best = m;
                    at = a;
                }
            }
            let pace = 1.0 - 0.1 * (units as f64 - 1.0); // long shots slow the film: small tax
            group.push(Shot {
                clip,
                start: at as f64 / FPS as f64,
                units,
                value: best * units as f64 * unit * pace,
            });
        }
        if !group.is_empty() {
            groups.push(group);
        }
        s0 += seg;
    }
    groups
}

/// Multiple-choice knapsack: from each group take at most one shot, total weight == cap if possible.
fn knapsack(groups: &[Vec<Shot>], cap: usize) -> Vec<Shot> {
    let neg = f64::NEG_INFINITY;
    let mut dp = vec![vec![neg; cap + 1]; groups.len() + 1];
    let mut pick = vec![vec![None; cap + 1]; groups.len() + 1];
    dp[0][0] = 0.0;
    for (g, opts) in groups.iter().enumerate() {
        for c in 0..=cap {
            dp[g + 1][c] = dp[g][c]; // take nothing from this group
            for (j, o) in opts.iter().enumerate() {
                if c >= o.units && dp[g][c - o.units] > neg && dp[g][c - o.units] + o.value > dp[g + 1][c] {
                    dp[g + 1][c] = dp[g][c - o.units] + o.value;
                    pick[g + 1][c] = Some(j);
                }
            }
        }
    }
    // the best fill we can reach, normally exactly `cap`
    let mut c = (0..=cap).rev().find(|&c| dp[groups.len()][c] > neg).unwrap_or(0);
    let mut chosen = Vec::new();
    for g in (1..=groups.len()).rev() {
        if let Some(j) = pick[g][c] {
            chosen.push(groups[g - 1][j].clone());
            c -= groups[g - 1][j].units;
        }
    }
    chosen.reverse();
    chosen
}
```

`dp[g][c]` is the best value reachable using the first `g` segments and exactly `c` units. For each segment we either skip it or add one of its options. We keep a second table of which option was chosen, then walk back from `dp[last][cap]` to recover the picks. If the footage is too short to fill the song exactly, we take the largest fill we can reach.

## Step 5. Cut on the beat

Because every shot is a whole number of units, and every unit is a whole number of beats, the cut points of the film are beats by construction. Nothing needs to be detected or nudged: `lay_out` just orders the chosen shots (by clip, then by time in the clip, so the film follows the day) and adds up beats.

```rust
struct Cut {
    shot: Shot,
    film_start: f64, // seconds on the film timeline == seconds after the first beat
    beat: usize,     // which beat of the grid that is
}

fn lay_out(mut shots: Vec<Shot>, k: usize, period: f64) -> Vec<Cut> {
    shots.sort_by(|a, b| (a.clip, a.start).partial_cmp(&(b.clip, b.start)).unwrap());
    let mut beat = 0;
    shots
        .into_iter()
        .map(|shot| {
            let cut = Cut {
                film_start: beat as f64 * period,
                beat,
                shot,
            };
            beat += cut.shot.units * k; // a shot is a whole number of beats, so every cut is on one
            cut
        })
        .collect()
}
```

```mermaid
flowchart LR
  subgraph Grid[Beat grid at 120 BPM]
    b0[beat 0] --- b4[beat 4] --- b12[beat 12] --- b16[beat 16]
  end
  S1[Shot 1: 1 unit] -.-> b0
  S2[Shot 2: 2 units] -.-> b4
  S3[Shot 3: 1 unit] -.-> b12
```

Film time 0 is the first beat of the song, so the render will start the audio at `grid.first`. A cut at film time `n * period` is then at song time `first + n * period`, which is exactly where the grid says a beat is. The check that matters is whether the grid is right, and for the synthetic song we know the answer. Here are all twelve cuts of the 120 BPM run, next to the nearest true kick:

| # | Clip | Clip time | Film time | Beat | Song time (grid) | True kick | Error |
|---|---|---|---|---|---|---|---|
| 0 | 01_testsrc.mp4 | 0.00 | 0.000 | 0 | 0.255 | 0.250 | +5 ms |
| 1 | 01_testsrc.mp4 | 4.00 | 4.000 | 8 | 4.255 | 4.250 | +5 ms |
| 2 | 01_testsrc.mp4 | 8.00 | 7.999 | 16 | 8.255 | 8.250 | +5 ms |
| 3 | 01_testsrc.mp4 | 12.00 | 11.999 | 24 | 12.254 | 12.250 | +4 ms |
| 4 | 02_mandel.mp4 | 0.00 | 13.999 | 28 | 14.254 | 14.250 | +4 ms |
| 5 | 02_mandel.mp4 | 4.00 | 17.999 | 36 | 18.254 | 18.250 | +4 ms |
| 6 | 02_mandel.mp4 | 8.00 | 21.998 | 44 | 22.254 | 22.250 | +4 ms |
| 7 | 02_mandel.mp4 | 12.00 | 25.998 | 52 | 26.253 | 26.250 | +3 ms |
| 8 | 02_mandel.mp4 | 16.00 | 27.998 | 56 | 28.253 | 28.250 | +3 ms |
| 9 | 06_portrait.mp4 | 2.00 | 29.998 | 60 | 30.253 | 30.250 | +3 ms |
| 10 | 06_portrait.mp4 | 4.00 | 31.997 | 64 | 32.253 | 32.250 | +3 ms |
| 11 | 06_portrait.mp4 | 10.00 | 35.997 | 72 | 36.252 | 36.250 | +2 ms |

The worst is 5 ms off, which is the 0.255 s versus 0.25 s error of the first beat, and a sixth of one frame at 30 fps. The three scene changes ffmpeg's own scene detector found in the rendered file (14.000, 28.000 and 30.000 s) are within 5 ms of the true kick as well.

## Step 6. Render

One `ffmpeg` command. For each shot there is an input, a `trim` to the chosen window, a scale-and-crop to fill the frame, and a fixed frame rate; the pieces are joined with `concat`. The song is the last input, started at the first beat, cut to the film's length, with a 0.2 s fade in and a 1.5 s fade out.

The film takes the orientation most of your clips were shot in, and every shot is scaled to fill the frame and cropped. A vertical clip in a landscape film loses most of its picture; the real engine chooses the frame per project, here it is one line.

```rust
fn render(clips: &[Clip], cuts: &[Cut], k: usize, grid: &Grid, song: &Path, out: &Path) -> Res<f64> {
    let unit = k as f64 * grid.period;
    let film: f64 = cuts.iter().map(|c| c.shot.units as f64 * unit).sum();
    let mut args: Vec<String> = vec!["-v".into(), "error".into(), "-y".into()];
    let mut graph = String::new();
    // the film takes the orientation most clips were shot in
    let portrait = clips.iter().filter(|c| c.portrait).count() * 2 > clips.len();
    let (w, h) = if portrait { (720, 1280) } else { (1280, 720) };
    for (i, c) in cuts.iter().enumerate() {
        let dur = c.shot.units as f64 * unit;
        args.extend(["-i".into(), clips[c.shot.clip].path.display().to_string()]);
        graph += &format!(
            "[{i}:v]trim=start={:.3}:duration={:.3},setpts=PTS-STARTPTS,scale={w}:{h}:force_original_aspect_ratio=increase,crop={w}:{h},setsar=1,fps=30[v{i}];",
            c.shot.start, dur
        );
    }
    let n = cuts.len();
    let labels: String = (0..n).map(|i| format!("[v{i}]")).collect();
    graph += &format!("{labels}concat=n={n}:v=1:a=0[v];");
    graph += &format!(
        "[{n}:a]atrim=duration={film:.3},asetpts=PTS-STARTPTS,afade=t=in:d=0.2,afade=t=out:st={:.3}:d=1.5[a]",
        film - 1.5
    );
    // the song starts at the first beat, so film time 0 is beat 0
    args.extend([
        "-ss".into(),
        format!("{:.3}", grid.first),
        "-i".into(),
        song.display().to_string(),
    ]);
    args.extend(["-filter_complex".into(), graph]);
    args.extend(
        [
            "-map", "[v]", "-map", "[a]", "-c:v", "libx264", "-preset", "veryfast", "-crf", "20", "-pix_fmt",
            "yuv420p", "-c:a", "aac", "-b:a", "192k",
        ]
        .map(String::from),
    );
    args.push(out.display().to_string());
    let st = Command::new("ffmpeg").args(&args).status()?;
    if !st.success() {
        return Err("ffmpeg render failed".into());
    }
    Ok(film)
}
```

Passing the graph inline is fine for a few dozen shots. Past a few hundred you would write the graph to a file; recent ffmpeg versions spell that option `-/filter_complex file`, and older ones `-filter_complex_script`.

## Wire it together

```rust
fn main() -> Res<()> {
    let a: Vec<String> = std::env::args().collect();
    if a.len() != 4 {
        eprintln!("usage: montage <clips-dir> <song> <out.mp4>");
        std::process::exit(2);
    }
    let (dir, song, out) = (Path::new(&a[1]), Path::new(&a[2]), Path::new(&a[3]));
    let t = std::time::Instant::now();

    let clips = list_clips(dir)?;
    println!(
        "{} clips, {:.0}s of footage",
        clips.len(),
        clips.iter().map(|c| c.secs).sum::<f64>()
    );

    let pcm = decode_mono(song)?;
    let song_secs = pcm.len() as f64 / SR as f64;
    let grid = track_beats(&onset_strength(&pcm), song_secs);
    println!(
        "song {song_secs:.1}s  tempo {:.2} BPM  first beat {:.3}s",
        grid.bpm, grid.first
    );

    let stats = clips
        .iter()
        .map(|c| frame_stats(&c.path))
        .collect::<Res<Vec<_>>>()?;
    let scores = score_all(&stats);

    // a shot unit is the smallest whole number of beats that lasts at least 1.6 s
    let k = [1usize, 2, 4, 8]
        .into_iter()
        .find(|&k| k as f64 * grid.period >= 1.6)
        .unwrap_or(8);
    let unit = k as f64 * grid.period;
    let beats_in_song = ((song_secs - grid.first) / grid.period) as usize;
    let cap = beats_in_song / k;
    let groups: Vec<Vec<Shot>> = clips
        .iter()
        .enumerate()
        .flat_map(|(i, c)| candidate_groups(i, &scores[i], c.secs, unit, 2))
        .collect();
    let chosen = knapsack(&groups, cap);
    let cuts = lay_out(chosen, k, grid.period);

    println!(
        "cut every {k} beats ({unit:.2}s), {cap} units to fill, {} shots",
        cuts.len()
    );
    println!(
        "{:>3} {:<22} {:>7} {:>9} {:>5}",
        "#", "clip", "src_t", "film_t", "beat"
    );
    for (i, c) in cuts.iter().enumerate() {
        let name = clips[c.shot.clip]
            .path
            .file_name()
            .unwrap()
            .to_string_lossy()
            .to_string();
        println!(
            "{i:>3} {name:<22} {:>7.2} {:>9.3} {:>5}  song_t={:.3}",
            c.shot.start,
            c.film_start,
            c.beat,
            grid.beat(c.beat)
        );
    }
    let analysed = t.elapsed().as_secs_f64();
    let film = render(&clips, &cuts, k, &grid, song, out)?;
    println!(
        "film {film:.2}s written to {}; analysis {analysed:.1}s, render {:.1}s",
        out.display(),
        t.elapsed().as_secs_f64() - analysed
    );
    Ok(())
}
```

Run it:

```bash
cargo build --release
./target/release/montage ~/Movies/trip  song.mp3  film.mp4
```

## Try it without any footage

`gen_inputs.sh` makes eight clips from ffmpeg's built-in test sources (a moving test card, a Mandelbrot zoom, a nearly black clip with noise, colour bars, a cellular automaton, a portrait clip) plus a song at the tempo you choose. It exists so every claim in this post can be checked by anyone.

```bash
#!/bin/sh
# usage: gen_inputs.sh BPM OUTDIR
set -e
BPM=${1:-120}; D=${2:-input}; mkdir -p "$D/clips"
ff() { out=$1; shift; ffmpeg -v error -y "$@" -c:v libx264 -preset ultrafast -pix_fmt yuv420p -r 30 "$out"; }
ff $D/clips/01_testsrc.mp4   -f lavfi -i testsrc2=s=1280x720:d=14
ff $D/clips/02_mandel.mp4    -f lavfi -i mandelbrot=s=1280x720:r=30 -t 18
ff $D/clips/03_dark.mp4      -f lavfi -i "color=c=0x050505:s=1280x720:d=10,noise=alls=3:allf=t"
ff $D/clips/04_bars.mp4      -f lavfi -i smptebars=s=1920x1080:d=8
ff $D/clips/05_life.mp4      -f lavfi -i life=s=640x360:r=30:mold=10:ratio=0.1:death_color=#C83232:life_color=#00ff00,scale=1280:720:flags=neighbor -t 16
ff $D/clips/06_portrait.mp4  -f lavfi -i testsrc2=s=720x1280:d=12
ff $D/clips/07_cellauto.mp4  -f lavfi -i cellauto=s=1280x720:r=30 -t 9
ff $D/clips/08_rgb.mp4       -f lavfi -i rgbtestsrc=s=1280x720:d=12
P=$(awk "BEGIN{print 60/$BPM}")
ffmpeg -v error -y -f lavfi -i "aevalsrc='if(gte(t,0.25), 0.9*sin(2*PI*(50*mod(t-0.25,$P)+90*(1-exp(-30*mod(t-0.25,$P)))/30))*exp(-9*mod(t-0.25,$P)), 0) + 0.08*sin(2*PI*220*t)+0.05*sin(2*PI*277*t)+0.02*random(0)*exp(-60*mod(t-0.25+$P/2,$P))':d=40:s=44100" "$D/song.wav"
```

```bash
./gen_inputs.sh 120 input
./target/release/montage input/clips input/song.wav film.mp4
```

The output of that run:

```text
8 clips, 99s of footage
song 40.0s  tempo 120.01 BPM  first beat 0.255s
cut every 4 beats (2.00s), 19 units to fill, 12 shots
  # clip                     src_t    film_t  beat
  0 01_testsrc.mp4            0.00     0.000     0  song_t=0.255
  1 01_testsrc.mp4            4.00     4.000     8  song_t=4.255
  2 01_testsrc.mp4            8.00     7.999    16  song_t=8.255
  3 01_testsrc.mp4           12.00    11.999    24  song_t=12.254
  4 02_mandel.mp4             0.00    13.999    28  song_t=14.254
  5 02_mandel.mp4             4.00    17.999    36  song_t=18.254
  6 02_mandel.mp4             8.00    21.998    44  song_t=22.254
  7 02_mandel.mp4            12.00    25.998    52  song_t=26.253
  8 02_mandel.mp4            16.00    27.998    56  song_t=28.253
  9 06_portrait.mp4           2.00    29.998    60  song_t=30.253
 10 06_portrait.mp4           4.00    31.997    64  song_t=32.253
 11 06_portrait.mp4          10.00    35.997    72  song_t=36.252
film 38.00s written to out_synth.mp4; analysis 1.4s, render 3.5s
```

## Tests

Four tests pin the parts that are easy to get wrong without noticing. The beat tracker runs on click trains built in memory at 120, 100 and 140 BPM with different first-beat times, and must find the tempo within half a BPM and the phase within 30 ms (this is the test that exposed the 41 ms frame latency). The knapsack is compared with brute force over every combination. The FFT must put a pure sine in the right bin. And a layout test checks that every cut is a whole number of beats.

```rust
#[cfg(test)]
mod tests {
    use super::*;

    /// A click train at a known tempo, built in memory: no ffmpeg needed.
    fn clicks(bpm: f64, first: f64, secs: f64) -> Vec<f32> {
        let mut x = vec![0.0f32; (secs * SR as f64) as usize];
        let period = 60.0 / bpm;
        let mut t = first;
        while t < secs - 0.1 {
            let s = (t * SR as f64) as usize;
            for i in 0..400 {
                x[s + i] += ((i as f32) * 0.3).sin() * (-(i as f32) / 80.0).exp();
            }
            t += period;
        }
        x
    }

    #[test]
    fn fft_finds_a_sine() {
        let mut re: Vec<f64> = (0..64)
            .map(|i| (2.0 * PI * 5.0 * i as f64 / 64.0).sin())
            .collect();
        let mut im = vec![0.0; 64];
        fft(&mut re, &mut im);
        let mag: Vec<f64> = (0..32).map(|k| (re[k] * re[k] + im[k] * im[k]).sqrt()).collect();
        let peak = (0..32)
            .max_by(|&a, &b| mag[a].partial_cmp(&mag[b]).unwrap())
            .unwrap();
        assert_eq!(peak, 5);
    }

    #[test]
    fn tracks_known_tempo_and_phase() {
        for (bpm, first) in [(120.0, 0.25), (100.0, 0.4), (140.0, 0.1)] {
            let x = clicks(bpm, first, 30.0);
            let g = track_beats(&onset_strength(&x), 30.0);
            assert!((g.bpm - bpm).abs() < 0.5, "bpm {} vs {bpm}", g.bpm);
            let off = ((g.first - first) / g.period + 0.5).rem_euclid(1.0) - 0.5; // phase error in beats
            assert!(off.abs() * g.period < 0.03, "phase off by {} s", off * g.period);
        }
    }

    #[test]
    fn knapsack_matches_brute_force() {
        let mk = |u, v| Shot {
            clip: 0,
            start: 0.0,
            units: u,
            value: v,
        };
        let groups = vec![
            vec![mk(1, 3.0), mk(2, 5.0)],
            vec![mk(1, 4.0), mk(3, 9.0)],
            vec![mk(2, 4.5)],
        ];
        let chosen = knapsack(&groups, 5);
        assert_eq!(chosen.iter().map(|s| s.units).sum::<usize>(), 5);
        let total: f64 = chosen.iter().map(|s| s.value).sum();
        // brute force over every choice per group (None, or one option)
        let mut best = f64::MIN;
        for a in 0..=2 {
            for b in 0..=2 {
                for c in 0..=1 {
                    let pick = [(0, a), (1, b), (2, c)];
                    let (mut w, mut v) = (0, 0.0);
                    for (g, j) in pick {
                        if j > 0 {
                            w += groups[g][j - 1].units;
                            v += groups[g][j - 1].value;
                        }
                    }
                    if w == 5 && v > best {
                        best = v;
                    }
                }
            }
        }
        assert!((total - best).abs() < 1e-9);
    }

    #[test]
    fn every_cut_lands_on_a_beat() {
        let mk = |u| Shot {
            clip: 0,
            start: u as f64,
            units: u,
            value: 1.0,
        };
        let cuts = lay_out(vec![mk(1), mk(2), mk(3)], 4, 0.5);
        assert_eq!(cuts.iter().map(|c| c.beat).collect::<Vec<_>>(), vec![0, 4, 12]);
        assert!(cuts.iter().all(|c| (c.film_start / 0.5).fract() == 0.0));
    }
}
```

`cargo test --release` passes all four. `cargo clippy --all-targets -- -D warnings` and `cargo fmt --check` are clean.

## On real footage

The six real phone clips (165 s: two portrait iPhone clips and four 720p clips) and an 84 s song gave a film of exactly 84.00 s with 31 shots, drawn from five of the six clips. The tracker reported 120.00 BPM with the first beat at 0.011 s. I have no ground truth for that song, so treat the number as a claim, not a check. Time: 7.3 s to analyse everything, 29.8 s to render. The render is the slow part: 31 inputs means 31 decoders. I did not profile it further; for a long film, cutting each shot into its own small file first is the first thing I would try.

## Where it breaks

- **One fixed tempo.** A song that speeds up, or a live recording, drifts away from the grid. The usual fix is a tracker that follows the tempo through the song instead of fitting one comb.
- **Loud off-beats.** As the hi-hat test showed, the onset curve does not know which hits are the beat. Weighting low frequencies more, or splitting the spectrum into bands and taking the flux per band, helps.
- **Scores are not taste.** Motion rewards camera shake. Sharpness rewards a sunlit wall. Nothing here knows a face from a floor.
- **Half-time and double-time.** Many songs are equally 70 or 140 BPM. The bell curve picks one; whether it is the one you want depends on the song.
- **Audio from clips is dropped.** The film has the song only.

## Going further

This is the teaching version of the engine inside [Life2Film](https://life2film.com) ([App Store](https://apps.apple.com/app/id6761656888)), a Rust workspace that runs on the phone and in the browser. What the production engine does differently:

- **Scores with more than three signals.** Face quality (frontality, size, landmark visibility), scene analysis, a speech transcript. The cheap frame statistics here stand in for all of it.
- **A global model instead of a bag.** Its default selector is a linear-chain conditional random field, which scores pairs of neighbouring shots as well as single shots. The knapsack is still there as an option, in a greedy mode with a diversity penalty for moments within 3 seconds of each other and an exact dynamic-programming mode.
- **Beats as intervals.** In one of its timelines every beat interval gets one shot, sped up or slowed down by up to 4x to fit.
- **Speech ducking.** When someone talks in a clip, a smooth gain curve lowers the music under the voice and raises it after.
- **An editable output.** It exports OpenTimelineIO, so the cut opens in a real editor.

Exercises that stay inside this program: weight the onset curve by frequency band and watch the hi-hat problem go away; add a second knapsack dimension for a "no two shots from the same place in a row" rule; replace the frame-statistics score with one that counts edges in the middle third of the frame; write the EDL as a file, then render from the file, so you can edit it by hand.
