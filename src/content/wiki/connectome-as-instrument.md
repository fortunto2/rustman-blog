---
type: concept
title: "The connectome is a sparse hash, so play it"
description: "FlyWire's fly brain is open data and the simulator is already built — the unclaimed part is that the mushroom body's sparse odour code is a ready-made generator of non-repeating musical material."
created: 2026-09-14
tags: [connectome, dsp, rust, clap, music, simulation, neuroscience, ios, idea]
publish: true
source_url: "https://flywire.ai/"
index_line: "FlyWire connectome as a CLAP modulation source, not another simulator. Surveyed against awesome-fly (94 projects, wave started 2026-09-03 with MaleCNS 166k/125M): 1 audio project, 0 on iOS. Olfactory path ~2700 cells = realtime on one core; Kenyon cells fire sparse and decorrelated, a non-repeating note generator reproducible from a seed"
index_section: "concept"
---

# The connectome is a sparse hash, so play it

FlyWire published the whole *Drosophila* brain: 139,255 neurons, ~50M synapses, free to
download. Every step after that is unremarkable. The edge list is a CSV of
`pre_id, post_id, syn_count`; thresholding it to strong connections leaves ~2.7M edges;
each cell gets a leaky integrate-and-fire model, which is one line of arithmetic; you
drive sensory neurons and read descending neurons as motor output. `flybrain` already
does all of it in a browser tab.

So the simulator is not the opportunity. It exists, it runs, and a second one is a
second demo. Surveyed 2026-09-14 against [cobanov/awesome-fly](https://github.com/cobanov/awesome-fly),
94 projects: Doom, Minecraft, Mario 64, chess, Pong, tic-tac-toe, a Godot horror game,
stock trading, haiku, fashion prints. The wave is two weeks old — Google Research and
HHMI Janelia released the full MaleCNS connectome (166k neurons, 125M connections) on
2026-09-03 — and it has already eaten every obvious idea.

**Two things it has not eaten.** Of 94 projects, exactly **one** is audio: *Fly Lab*,
Python driving the Ableton Live API from motor circuits, with a trained musical readout.
No plugin, nothing on the mushroom body. And **zero** run on a phone: `DesktopFly` is
macOS/Swift with a 668-neuron circuit (escapes the cursor in ~4 ms) and has been ported
to Linux twice, but the iOS App Store has no connectome app at all.

**The unclaimed part is what the circuit computes.** The olfactory path is ~50 receptor
neurons projecting onto ~150 projection neurons, which fan out onto ~2,500 Kenyon cells
in the mushroom body. That expansion is the point: a dense low-dimensional input becomes
a *sparse, decorrelated* high-dimensional code, where any given odour lights up a few
percent of the cells and two similar odours light up near-disjoint sets. Neuroscience
calls it sparse coding. Anyone who has built a synth recognises something else: a hash
function with musically useful properties. Non-repeating, deterministic from its input,
and continuous in the right way — nudge the odour vector and the output changes by a
little, not by everything.

That makes the fly brain a **modulation source**, not a physics toy. Kenyon-cell spikes
are a note generator that never loops and is reproducible from a seed; membrane voltages
are envelopes; descending neurons are gates. The input control is an odour mixture, and
turning that knob reorganises the entire musical material because reorganising it is
what the circuit is for.

The engineering is small, and that is the second half of the argument. ~2,700 cells at a
1 ms step is realtime on one core with room to spare — no GPU, no web workers, no
Loihi. It lands directly on [[project-superduper-dsp]]: Rust, a CLAP plugin skeleton,
headless rendering, egui GUI, a release pipeline that already ships. The new code is a
CSV loader, an LIF loop, and a spike-to-MIDI mapping.

Two things this connects to. [[project-kubizbeat]] took an instrument nobody expected to
digitise and found the digital form suited it; this is the same move with a biological
circuit instead of a cultural one. And the honest version needs the discipline from
[[harness-engineering-summary]] — a simulation that produces plausible output while
ignoring its own weights is the exact false green that file is about. Zero out a random
bundle of synapses, delete 5% of the cells, shuffle the delays: if the sound does not
change, the model is playing its defaults rather than the connectome, and no amount of
pretty output disproves that. Mutation testing applies to simulations, and nobody runs
it on them.
