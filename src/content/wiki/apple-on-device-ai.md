---
type: summary
description: "Unified on-device AI layer for all iOS products (KissMyTask, FaceAlarm, VoiceJournal, QuestSchool). Zero API cost, privacy by architecture, SGR natively via ..."
title: "Apple Foundation Models — zero-cost on-device AI for iOS portfolio"
created: 2026-04-07
tags: [apple, foundation-models, ios, on-device, sgr, swift, privacy, mlx]
publish: true
source_path: "1-methodology/apple-foundation-models.md"
---

## Key Takeaways

Unified on-device AI layer for all iOS products (KissMyTask, FaceAlarm, VoiceJournal, QuestSchool). Zero API cost, privacy by architecture, SGR natively via @Generable.

**Core capabilities:** structured generation (@Generable + @Guide = constrained decoding), tool calling (model invokes local functions: CoreData, HealthKit, Calendar), streaming for responsive UI, graceful degradation for non-Apple Intelligence devices.

**Why it matters for solo founder:** freemium model breaks when each AI call costs money. On-device AI = AI features are free (no server cost) → better conversion. No API keys, no cloud dependency, complete privacy.

**SGR native in Swift:** Apple @Generable annotation = Schema-Guided Reasoning out of the box. Define typed output, model produces exactly that structure. Same philosophy as Pydantic/Zod but at the framework level.

**Reusable module:** one Swift Package across all products. Each product plugs in only needed capabilities. Shared inference pipeline, shared schemas, product-specific prompts.

## Connections

- [[privacy-as-architecture]] — on-device AI is the ultimate privacy-first architecture: data never leaves the device
- [[schema-guided-reasoning]] — Apple @Generable = native SGR implementation for iOS
- [[antifragile-life-design]] — zero API cost = each product experiment has even lower downside in the barbell
- [[one-pain-one-feature-launch]] — on-device AI removes the cost barrier to adding AI features in MVPs
