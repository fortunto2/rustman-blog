---
type: concept
title: "ACE Music v1: the closed model that tops a vocal leaderboard, and the open ACE-Step beside it"
description: "ACE Music v1 is a hosted, closed song generator from ACE Studio that ranks first on Artificial Analysis's vocal leaderboard by a margin inside the error bars; the free open-weights option is the separate ACE-Step."
created: 2026-11-12
tags: [music, generation, ace-step, suno, leaderboard, audio, open-weights]
publish: true
source_url: "https://acemusic.ai/acemusic-v1/"
learned_from:
  - "https://artificialanalysis.ai/music/leaderboard/vocals"
  - "https://acemusic.ai/acemusic-v1/"
  - "https://acemusic.ai/pricing"
  - "https://github.com/ace-step/ACE-Step-1.5"
  - "https://huggingface.co/ACE-Step/Ace-Step1.5"
  - "https://alphasignal.ai/news/ace-studio-s-ace-music-v1-beats-suno-to-top-ai-music-leaderboard"
  - "Telegram channel digest, 12 Nov 2026 (second-hand, the starting claim)"
index_line: "ACE Music v1 (ACE Studio, closed, hosted at acemusic.ai, no public API): #1 on AA-Music-Vocal v1.1, Elo 1160 [1139-1181] vs Suno v6 1144 [1126-1162], intervals overlap. Free = 20 credits/day (v1 costs 2/song), no downloads/stems/commercial rights; paid from $7.90/mo. NOT the open model: that is ACE-Step 1.5 (MIT, local, co-led with StepFun); v1 Flash open-source promised late 2026. Not tested by us"
---

# ACE Music v1

## Definition

ACE Music v1 is a text-and-lyrics-to-song model made by ACE Studio and served as a web product at acemusic.ai. The weights are closed. It is a different thing from **ACE-Step**, the open-weights music model the same team co-leads with StepFun. The digest line merged the two; the facts below separate them. Part of [[music-ai]].

## The digest claim, checked

«Free music model, ranks above Suno V6, 20 credits a day».

| Part | Result |
|---|---|
| Ranks above Suno V6 | **Verified, with a caveat.** AA-Music-Vocal v1.1 (Artificial Analysis, blind listening, Elo): ACE Music v1 1160 (interval 1139 to 1181, 2,119 samples), Suno v6 1144 (1126 to 1162, 3,063 samples), Suno v6-mini 1132, Mureka V9.5 1101, Lyria 3.5 1050. The leaderboard's own rank ranges are 1-2 for ACE and 1-3 for Suno v6, and the two intervals overlap. It is a lead in the table, not a proven gap. |
| 20 credits a day | **Verified** on the pricing page: the free plan gives 20 credits/day. ACE Music v1 spends 4 credits for two songs, so 20 credits is up to 10 songs a day. |
| "Free model" | **Misleading.** The free plan has a shared queue, **no downloads, no stem splitter, no commercial-use rights**. Paid plans: 1,000 credits/month at $7.90/mo (Creator, billed yearly), 2,500 credits at $16.58/mo (billed yearly) (Artist, adds the ACE Studio DAW). AlphaSignal says the $7.90 is the yearly-billing price; the pricing page shows it as a monthly equivalent. |
| An open or free-to-run model | **No.** The free-to-run model is ACE-Step v1.5, below. |

Other facts, verified at acemusic.ai: it takes text descriptions and lyrics with performance cues in parentheses like "(hum softly)"; converts a generated song to MIDI and splits stems inside the app; commercial rights only for songs made on a paid plan, not retroactive. A separate **ACE Music v1.1 Preview** plans the music in ABC notation first and works from melodies and scores. **ACE Music v1 Flash** is promised as open source "in late 2026", a plan, not a release.

**Reported only** (AlphaSignal, not confirmed at a primary page): no public API, so no pipeline use; strongest on reggae, dancehall, classical and orchestral prompts, weaker on dense modern pop. ACE Studio is a vocal-synthesis company (founded 2018 per the same article).

## The open sibling: ACE-Step 1.5

Verified on the GitHub README and the Hugging Face card:

- Open weights, licence **MIT** on the model card, "co-led by ACE Studio and StepFun". The README's commercial-use claim and training-data description (licensed, royalty-free and synthetic MIDI-rendered data) are the authors' own.
- README says: full song in under 2 s on an A100 and under 10 s on an RTX 3090, runs in under 4 GB VRAM, 10 s to 10 min of audio, 50+ languages, LoRA from a few songs (8 songs, about 1 h on a 3090), cover, repaint, stem separation, vocal-to-accompaniment, key/BPM extraction. These are vendor numbers, nobody here reproduced them.
- A 4B-parameter "XL" DiT was released on 2 Apr 2026 (README); it needs at least 12 GB VRAM with offload, 20 GB recommended.
- Mac support through an MLX launch script and a portable package. The README's own quality line is "between Suno v4.5 and Suno v5", not v6.
- acemusic.ai says ACE-Step generations are unlimited and MP3 downloads free, commercial use included.

Our only file on it is an unprocessed inbox capture (`3-inbox/2026-10-25-нейрорадио-…ace-step-15-генерит.md`): a third-party "neural radio" site generating the next track live with ACE-Step 1.5 XL Turbo through an MLX server, 48 kHz stereo on a Mac. That is reported, not measured by us. **We have not run ACE-Step or ACE Music v1.**

## What we would test (not run)

1. ACE-Step 1.5 locally on this Mac: time per 2-minute track, memory, and whether the 48 kHz output holds up, with three prompts for Life2Film background music.
2. The same three prompts and one set of lyrics (one Russian) through ACE Music v1 free tier and Suno, blind, levels matched.
3. Round trip into our tools: run the output through `stem-split` and `audio-to-midi` (see [[music-ai]]) and compare with ACE's built-in MIDI export and stems.

Decision rule: licensing decides first. A background-music use needs commercial rights, which means a paid ACE plan or the MIT ACE-Step weights, never the free tier.

## Learned from

Leaderboard, product, pricing, repo and model card pages in `learned_from`, read 12 Nov 2026. The starting claim came from a Telegram digest.
