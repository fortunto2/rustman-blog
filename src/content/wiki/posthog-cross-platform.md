---
type: summary
description: "Unified analytics for solo founder with mobile apps + web landings. Core problem: one person on landing and in app = 2 anonymous IDs. Broken attribution, bro..."
title: "PostHog analytics: one product = one project, cross-platform identity"
created: 2026-04-07
tags: [posthog, analytics, ios, web, cross-platform, privacy, metrics]
publish: true
source_path: "1-methodology/posthog-analytics.md"
---

## Key Takeaways

Unified analytics for solo founder with mobile apps + web landings. Core problem: one person on landing and in app = 2 anonymous IDs. Broken attribution, broken retention, broken funnels.

**Architecture:** one PostHog project per product (EU region). Web SDK + iOS SDK → unified user via `distinct_id`. Linking moment: purchase, email capture, or login.

**Identity strategy:** start anonymous (4x cheaper events), identify only on monetization/signup. Three phases: anonymous → identity moment → unified cross-platform view.

**Key event taxonomy:** `app_open`, `feature_used`, `purchase_completed`, `signup_completed`. Shared across web + iOS. Prefix platform in properties, not event names.

**Privacy-first:** EU hosting, anonymous by default, minimal PII. Aligns with manifesto principle: if we don't need the data, don't collect it.

**Kill/scale metrics integration:** PostHog funnels directly feed Kill/Iterate/Scale thresholds — fake-door clicks, signups, WoW growth all tracked as PostHog events.

## Connections

- [[privacy-as-architecture]] — anonymous by default, EU hosting, minimal PII collection
- [[kill-iterate-scale]] — PostHog funnels feed the weekly go/no-go thresholds directly
- [[infra-two-tools]] — PostHog is the monitoring layer across all infra tiers
