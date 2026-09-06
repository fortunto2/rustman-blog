---
type: concept
description: "When the work shifts from writing code to reviewing an agent's stream, the terminal becomes a reading instrument — and the defaults every terminal ships with are tuned for typing, not for reading text that moves."
title: "Reading agent output: the terminal as a reading instrument"
created: 2026-08-29
tags: [terminal, ergonomics, claude-code, tooling, attention]
publish: true
index_line: "Agent-era terminal: motion/contrast/habit are 3 separate fatigue sources. Positive polarity wins in a lit room, 7-12:1 not 21:1, ported light themes leave ANSI accents at 2-3:1. macOS ALS readable at 25ms"
index_section: "concept"
---

The job changed before the tools did. Writing code means looking at static text you
authored; supervising an agent means reading a stream someone else is producing, for
hours. Every terminal default — cursor blink, bright ANSI accents, a bell that flashes the
window — was chosen for the first job. Under the second one they are a tax you pay all day
without noticing.

This is [[agent-mistake-fix-harness]] pointed at the human: the agent makes a mistake, you
fix the environment rather than the agent. When *you* get tired, the same move applies.
Fix the environment, not your willpower.

## Three fatigue sources, three different fixes

They get conflated constantly, and each needs a different remedy.

**Motion.** Reading text that moves breaks the saccadic rhythm: the eye re-hunts a fixation
point on every frame instead of holding one. The complaints are specific and documented —
Claude Code issues [#9158](https://github.com/anthropics/claude-code/issues/9158)
("Excessive UI Blinking/Flickering Causes Eye Strain") and
[#25095](https://github.com/anthropics/claude-code/issues/25095) on the spinner, tagged
a11y and citing WCAG 2.2.2 (Pause, Stop, Hide). The fixes are frame-level: alt-screen
rendering so frames update atomically (`/tui fullscreen`), synchronized output, a slower
repaint (`repaint_delay 20` in kitty halves redraw frequency and turns a shimmer into
chunks), no cursor blink, no visual bell.

**Contrast.** Pure `#000`/`#fff` is 21:1. Halation — the glow bleeding around glyphs — is
worst there, and it is punishing with uncorrected astigmatism. 7–12:1 is the target on
either polarity.

**Habit.** The largest effect and the only one that isn't a setting: stop watching the
stream. Launch, switch away, get called back by a bell or a tab badge, read the finished
diff as static text. Reviewing a still diff costs an order of magnitude less than watching
it being typed. Four live panes in one window is the same mistake at a larger scale — four
independent motion sources in one visual field, all of which the brain processes whether
you want it to or not.

## Polarity: light wins in a lit room

Dark text on a light ground reads measurably better, an effect called the *positive
polarity advantage*. Buchner & Baumgartner (2007) found it holds regardless of ambient
illumination and color contrast; Piepenbrock et al. (2014) supplied the mechanism — a
lighter screen constricts the pupil, which increases depth of field and sharpens
accommodation. Same optics as squinting. Proofreading accuracy, not just speed, improves.

The caveats matter more than the headline:

- **Match the screen to the room, not to taste.** A white screen in a dark room blinds; a
  black screen in a bright room makes the pupil oscillate between screen and surroundings.
- **The effect is small per-hour and compounds over a day.** It matters exactly in the
  read-heavy regime, and not much otherwise.
- **Adaptation takes days.** First impression of a polarity switch is always "too bright"
  and it passes in two or three days. Judge it on day four.
- Photophobia, dry eye and some retinal conditions invert the recommendation outright.

## The ANSI trap nobody checks

This is the finding worth keeping. Ported light themes almost always inherit their sixteen
ANSI colors from a dark ancestor, where those hues were chosen against a dark ground. On a
cream background the canonical Novel yellow `#d06b00` and cyan `#0087cc` land near
**2–3:1**. Nothing is broken, so nobody investigates; the user just reports that "accents
look washed out" and assumes it is the light theme's fault.

Two rules fix it:

1. Re-derive all sixteen against the actual background — normal ≥4.5:1, bright ≥3.5:1,
   since bright carries bold text.
2. On a light theme make `color7`/`color15` **dark**. Solarized Light keeps them light,
   and every TUI that paints "white" text disappears into the background.

A palette built by eye does not pass this. Ours didn't: a contrast checker found five
colors below their floor in a palette that looked fine on screen — bright green at 3.39,
bright cyan at 3.22, and three more in the dark variant. Measure, then look; the math
catches what the eye rationalizes, and the eye catches hues the math approves of.

Agents have their own layer of this. Claude Code's theme tokens are separate from the
terminal palette, and several that carry real accent weight are missing from the docs
(`professionalBlue`, `chromeYellow`, `skill`, `background`) — a light terminal with the
agent still in its dark theme is the worst of both.

## Follow the room, not the clock

macOS exposes the ambient light sensor to userspace. On Apple Silicon it is not
`AppleLMUController` (that was Intel) but `AmbientBrightness` in the display driver:
`ioreg -r -l -w 0 -k AmbientBrightness`, divided by 65536 for lux, ~25 ms per read. A dim
room with one lamp reads 10–30 lux, a normally lit room 40–120.

Two properties separate a switcher you keep from one you disable within a day: a **dead
zone** between thresholds, so a passing cloud doesn't flip the theme, and a **manual
override** that suppresses the automation for a few hours after you switch by hand.
Automation that argues with an explicit choice gets turned off, permanently.

And keep the blast radius small: switching the OS appearance changes Finder, Safari and
every other app, which is not what "make my terminal readable" asked for.

## What this looks like as a tool

Packaged as [[project-solo-factory]]'s `solo:terminal-eyes`: the one-setting-six-terminals
matrix (each names these differently), contrast-checked palettes, a contrast checker, an
Apple Terminal profile generator (its colors are archived `NSKeyedArchiver` blobs, so one
palette can drive both terminals), and the ambient-light switcher.

If the strain survives all of it, that is an optometrist question rather than a config one.
Uncorrected astigmatism and presbyopia produce exactly this picture, and they surface when
the work shifts from writing to reading — which is precisely what happened.

## Sources

- Buchner & Baumgartner (2007), *Text–background polarity affects performance irrespective
  of ambient illumination and colour contrast*
- Piepenbrock et al. (2014), *Smaller pupil size and better proofreading performance with
  positive polarity displays*
- Claude Code issues [#9158](https://github.com/anthropics/claude-code/issues/9158),
  [#25095](https://github.com/anthropics/claude-code/issues/25095)
- [Terminal configuration](https://code.claude.com/docs/en/terminal-config) — Claude Code docs
- Related: [[claude-code-anatomy]], [[harness-engineering-summary]]
