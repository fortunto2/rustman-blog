---
type: concept
title: "RustFS -- S3-compatible object storage in Rust"
description: "Distributed object storage, 2.3x faster than MinIO for small objects. S3 + Swift API, single-node and cluster modes, Apache-2.0."
created: 2026-04-14
tags: [rust, storage, s3, infrastructure, open-source]
publish: true
source_url: "https://github.com/rustfs/rustfs"
---

# RustFS

S3-compatible distributed object storage written in Rust. Drop-in MinIO replacement with 2.3x better throughput on 4KB objects. Apache-2.0 (not AGPL like MinIO).

## Why it matters

MinIO switched to AGPL. RustFS is Apache-2.0 -- embed it, modify it, ship it commercially without license headaches.

Performance: 2.3x faster than MinIO for small objects (4KB) on the same hardware. Rust's zero-GC advantage shows on high-throughput workloads.

## Features

- S3 API (full compatibility)
- OpenStack Swift API
- Web console (port 9001)
- Versioning, replication, lifecycle management
- Bitrot protection
- Single-node and distributed modes
- Kubernetes Helm charts
- No telemetry (GDPR/CCPA compliant)

## Quick start

```bash
# Docker
docker run -d -p 9000:9000 -p 9001:9001 rustfs/rustfs:latest

# Or one-liner
curl -O https://rustfs.com/install_rustfs.sh && bash install_rustfs.sh
```

Default credentials: `rustfsadmin / rustfsadmin`. Console at `:9001`.

## Where it fits

- **Self-hosted S3** for projects that need object storage without AWS
- **Edge/IoT** -- lightweight enough for constrained environments
- **AI/ML pipelines** -- data lake storage for training data
- **Media storage** -- video/image assets for Life2Film, FaceAlarm, etc.

Fits the [[infra-two-tools]] approach: when CF R2 or Supabase Storage isn't enough, RustFS is the self-hosted tier.

## Links

- [GitHub](https://github.com/rustfs/rustfs) -- 25.6k stars
- [Docs](https://docs.rustfs.com)
- [Helm charts](https://charts.rustfs.com)
