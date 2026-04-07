---
type: concept
description: "Key distinction from the manifesto: privacy is not a settings checkbox but an architectural decision made before the first line of code."
title: "Privacy is architecture, not a feature"
created: 2026-02-11
tags: [privacy, architecture, manifesto, on-device]
publish: true
---

Key distinction from the manifesto: privacy is not a settings checkbox but an **architectural decision** made before the first line of code.

In practice: on-device processing, local storage, no accounts when possible. "If we can't see your data, we can't leak it, sell it, or be forced to hand it over."

This isn't altruism — it's a **competitive advantage**. When Apple makes privacy a marketing moment and GDPR/CCPA tighten regulation, privacy-first architecture saves compliance costs and builds trust.

For a solo founder this is especially valuable: no legal department, no compliance team. If data isn't on the server — there's nothing to protect.

Implementation: MLX embeddings (Apple Silicon, on-device), Supabase Auth + RLS (minimal cloud), PostHog EU (GDPR-compliant analytics).

- [[manifest-summary]] — origin: manifesto principle #2
- [[privacy-first]] — hub page for privacy-first architecture
- [[antifragile-life-design]] — privacy = antifragility: less data = smaller attack surface
