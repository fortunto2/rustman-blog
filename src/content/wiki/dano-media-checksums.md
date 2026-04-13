---
type: concept
title: "dano -- media stream checksums via ffmpeg"
description: "Rust CLI that checksums internal media streams, not file containers. Stable across renames, metadata changes, container swaps. Duplicate detection for video libraries."
created: 2026-04-14
tags: [rust, ffmpeg, media, tools, open-source, video]
publish: true
source_url: "https://github.com/kimono-koans/dano"
---

# dano

Rust CLI wrapper for ffmpeg. Checksums internal media streams, not file containers. The hash stays the same when you rename a file, change metadata, or repackage MKV to MP4.

```bash
dano -w 'video.mkv'
# murmur3=2f23cebfe8969a8e11cd3919ce9c9067

ffmpeg -i 'video.mkv' -metadata author="Me" 'video.mp4'
dano -w 'video.mp4'
# murmur3=2f23cebfe8969a8e11cd3919ce9c9067  ← same hash
```

## Modes

- **write** -- generate and store checksums (xattrs or hash files)
- **test** -- verify stored checksums
- **duplicates** -- find duplicate media by stream content
- **print/dump** -- inspect checksum data

## Why this matters for video apps

Traditional checksums (md5, sha256) break when you touch metadata, re-encode, or change containers. dano hashes the actual bitstream -- the video and audio data inside.

**Duplicate detection across sources:** same video from Camera Roll (MOV), WhatsApp (MP4), Google Photos (MP4 re-encoded) can share identical streams. dano catches that.

**Verification after processing:** ffmpeg pipeline ran, did the output stream survive intact? dano checks without re-encoding.

## Ideas for Life2Film

Life2Film imports thousands of videos from phones, cloud, messengers. Duplicates are everywhere.

1. **Import dedup** -- hash streams on import, skip files with known hashes. One video in 3 containers = 1 entry in the library
2. **Integrity check** -- after proxy generation or montage export, verify source streams weren't corrupted
3. **Smart merge** -- user has videos on iPhone + Google Photos + local backup. Stream hashes unify them into one timeline without duplicates

**Implementation:** dano is CLI-only (173 stars, MPL-2.0). Better to take the approach (ffmpeg stream hashing via `-f hash`) and build it as a Rust module directly. The core idea is ~50 lines of ffmpeg invocation.

## Hash algorithms

murmur3 (default, fast), MD5, SHA256, SHA512, adler32, CRC32. `--decode` mode hashes decoded output for lossless format verification (FLAC → ALAC).

## Links

- [GitHub](https://github.com/kimono-koans/dano)
- Inspired by hashdeep, md5tree, ffmpeg
