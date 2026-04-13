---
type: methodology
status: active
title: "Launch Playbook: From Niche to Revenue"
description: "5D workflow (Discovery→Decision→Design→Delivery→Distribution), S.E.E.D. niche scoring, fake-door validation, kill/iterate/scale rules."
created: 2026-02-11
updated: 2026-02-11
tags: [methodology, launch, validation, niche, metrics, playbook]
course_module: 3
course_order: 1
publish: true
publish_as: post
source_path: "1-methodology/launch-playbook.md"
related:
  - 0-principles/manifest.md
  - 0-principles/stream-framework.md
  - 1-methodology/dev-principles.md
---

# Launch Playbook

Frameworks for niche selection, validation, launch, and go/no-go decisions. Complements the Manifest (philosophy) and STREAM (decision-making) with operational rules.

---

## 1. Workflow: 5D Contour

Every product cycle follows five phases:

**Discovery** → **Decision** → **Design** → **Delivery** → **Distribution**

| Phase | Output | Time |
|-------|--------|------|
| Discovery | Niche candidates (S.E.E.D. scored) | 1-2 days |
| Decision | GO/NO-GO via STREAM + Fake-Door | 1 day |
| Design | PRD (passes Definition of Done) | 1 day |
| Delivery | Landing page or working demo | 1-3 days |
| Distribution | Content pack + first traffic | 1-2 days |

Total: 5-9 days from idea to live product with traffic

---

## 2. Niche Selection: S.E.E.D.

Score each niche candidate on four dimensions:

| Dimension | Question | Signal |
|-----------|----------|--------|
| **S — Searchability** | Can I rank? | Forums/Reddit in top-10, few fresh giants, no video blocks, weak brands |
| **E — Evidence** | Do people actually have this pain? | Real questions/complaints with URLs |
| **E — Ease** | Can I build MVP in 1-2 days? | Fits my stack, no external dependencies |
| **D — Demand** | Will they pay? | Long-tail keywords, clear monetization path |

### Kill Flags (stop before starting)

- Top-10 dominated by media giants or encyclopedias
- Fresh guides (<60 days old) already covering the topic
- Video blocks on first SERP positions
- No evidence of real pain (only hypothetical)
- MVP needs more than 1 week on my stack

---

## 3. Day 0 Validation: Fake-Door Test

Before writing any code:

1. Build a landing page stub (2 hours max)
2. Spend $20 on targeted traffic (small ads or relevant communities)
3. Measure CTA clicks

**Decision:**
- **< 10 clicks** on CTA per $20 → **KILL** (no oxygen)
- **10+ clicks** → proceed to PRD

Goal: cheapest proof that someone cares.

---

## 4. PRD Definition of Done

A PRD is not done until it passes this checklist.

- [ ] **Problem statement** ≥ 30 words (who suffers, when, why now)
- [ ] **ICP + JTBD**: target segment + 2-3 jobs-to-be-done
- [ ] **3-5 features**: each with measurable acceptance criteria
- [ ] **3-5 KPIs**: with units (daily/weekly), target values ≥ 0
- [ ] **3-5 risks**: with mitigation plan (legal/data/channels/deps)
- [ ] **Tech requirements**: ≥3 API endpoints, integrations, NFR (speed, logging, limits)
- [ ] **Evidence-first**: every number/claim has a source URL

### Quality Controls

- **Evidence-linter**: catches numbers without sources, invalid KPIs, malformed endpoints
- **Pre-mortem (Counter-PRD)**: structured document asking "where will this break and how will we notice?"
- **Shadow-PRD** (optional): alternative pain/UVP formulation for A/B testing the positioning

---

## 5. Weekly Decision Rules: Kill / Iterate / Scale

| Week | Metric | KILL | ITERATE | SCALE |
|------|--------|------|---------|-------|
| Week 1 | Fake-Door clicks | < 10 per $20 | — | — |
| Week 2 | Signups | 0 | 1-4 | ≥ 5 |
| Week 3+ | Signup growth WoW | < 0% | 0-50% | > 50% |

**ARCHIVE** (soft kill): declining signups for 2+ weeks.
**SCALE** actions: new locale, partnerships, programmatic SEO.

---

## 6. Delivery: One-Screen Landing

Every product launches with:

- **One screen**: PROBLEM → DEMO → CTA
- **SEO minimum**: title, OG tags, JSON-LD, sitemap, hreflang
- **A/B headlines**: edge-split (Cloudflare Workers or similar)
- **Events**: view → click → signup/checkout
- **P-SEO clusters** (optional): /examples, /compare (2-3 subpages)

---

## 7. Distribution: Content Pack

Minimum launch content for every product:

1. **Vertical video** (30-45s): HOOK → PROBLEM → DEMO → CTA
2. **LinkedIn/Twitter post**: before/after story, 1 concrete example, CTA
3. **Community engagement**: substantive answers in 2-3 relevant threads
4. **i18n**: EN first + 1 locale where SERP gap is highest

---

## 8. Metrics

### North Star

Completed "value outcomes" per week per active user.

### Weekly Dashboard

| Metric | Description |
|--------|-------------|
| Activation L7/L14 | New user → first value event |
| Cohort retention | Week-over-week retention |
| Payback period | Months to recoup per-customer cost |
| Gross margin | Revenue minus cost-to-serve |
| Active experiments | Count + ROE (result-over-effort) |

### Relative Benchmarking

Skip arbitrary "norms." Compare to your niche:

```
relative_ctr  = your_CTR / niche_benchmark_CTR
relative_conv = your_Conv / niche_benchmark_Conv
score = average(relative_ctr, relative_conv)
```

Target: ≥ 1.0× niche benchmark.

---

## 9. Cadence

### Sprint Format (pick one)

- **14-day**: Week 1 = research/PRD/prototype, Week 2 = launch/traffic
- **Parallel tracks**: one product launching, next one in research

### Weekly Rituals

| Day | Duration | Focus |
|-----|----------|-------|
| Mon | 90 min | Pick 1-2 decisive steps for the week, freeze everything else |
| Wed | 30 min | Checkpoint: cut anything not moving North Star |
| Fri | 60 min | Retro: what got stronger? what to safely break next? |

### Daily Structure

- 2 × 90 min deep work
- 2 × 45 min operations
- 1 slot community engagement

---

## 10. Scale Through Leverage

- Find partners who already reach your target audience (platforms, agencies, niche leaders)
- Ship integrations instead of running ad campaigns
- Case studies as currency: 2-3 measurable results open doors
- Start concierge: handle non-critical tasks manually until first revenue

---

## 11. Founder-Bandwidth Check

Before committing to a PRD, estimate hours-to-MVP:

| Component | Typical Time |
|-----------|-------------|
| UI (if needed) | 2-8 hours |
| Backend/API | 2-4 hours |
| Data/ML pipeline | 4-8 hours |
| Landing page | 1-2 hours |
| Distribution content | 2-3 hours |

If total > 40 hours, you're bloating "one pain, one function" into a platform. Simplify.

---

*Extracted from startup-agent v1-v4 evolution. No personalities, just operational frameworks.*
