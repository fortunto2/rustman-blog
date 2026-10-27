---
type: concept
title: "Analytics without tracking anyone: one cookieless counter for every product"
description: "How a solo founder with a dozen sites and apps measures all of them on one self-hosted Cloudflare counter, with no cookies, no per-person tracking, and installs attributed by store campaign tokens."
index_line: "superduper-analytics, replaced PostHog 2026-10-26. One Worker ingest for web + iOS + Android, Analytics Engine (raw 90 days) + daily D1 rollup. Web id = salted SHA-256(IP+UA+UTC day), dies at midnight; apps send an install-scoped UUID → App Store label 'Not Linked to You'. Installs attributed per source by App Store `ct` / Play `referrer`, never per person. Sampling → `sum(_sample_interval)`; ~3% beacon loss → % gaps are noise, multiples are findings. Revenue only from store reports. Registry: 17 live sites, 15 iOS + 1 Android"
created: 2026-10-27
tags: [analytics, privacy, cloudflare, attribution, ios, android, web, metrics]
learned_from: "https://github.com/fortunto2/superduper-analytics"
course_module: 3
course_order: 7
publish: true
---

# Analytics without tracking anyone

## Definition

A portfolio of small products needs one answer to "how many people, from where, doing what", across landing pages and the apps they sell. superduper-analytics ([open source](https://github.com/fortunto2/superduper-analytics)) is one Cloudflare Worker that every site and app posts events to: no cookie, nothing kept in the browser, no identifier that follows a person across days or products. Adding a product is one registry entry and one commit; an unregistered source is refused.

## Rule

**One counter for every platform.** Websites load a script the Worker serves itself, so changing how browsers report is one deploy. iOS apps use the [SuperDuperAnalytics](https://github.com/fortunto2/superduperai-analytics-swift) Swift package; a Kotlin Multiplatform app gets one client in `commonMain` for Android and iOS. All post the same schema to the same endpoint, so a landing visit and an app launch of one product share a source id.

```html
<script defer src="https://<your-worker>/sda.js" data-source="<id>"></script>
<a href="https://apps.apple.com/app/id<APP_ID>?ct=site-hero&mt=8"
   data-sda-event="app_store_opened" data-sda-placement="hero">Get the app</a>
```

**The id is derived, not stored.** On the web the Worker hashes a secret salt with the visitor's IP, user agent and the UTC date, and keeps 16 hex characters. It changes at midnight UTC, so it can count "roughly how many people today" and nothing longer. Phones change carrier IPs and share NAT, so apps send a UUID made on first launch and deleted with the app: not the advertising ID, not the account. That choice is what lets the App Store privacy label say "Data Not Linked to You". Attach a user ID to events once, and the label has to change.

**Installs are attributed by the store, per source.** The App Store link carries a campaign token (`ct=site-hero`), and App Store Connect attributes page views, installs, purchases and subscriptions to it. Google Play does the same with a percent-encoded `referrer` of UTM tags, and its Install Referrer API hands the app that string on first launch. The click is our event, `app_store_opened`. Every link in the chain is a count per source: "the landing brought 40 installs" is answerable, "this visitor installed" is not.

**Money comes from the store.** A `purchase_completed` event can come from a test build or never arrive, so revenue is read from store sales reports and the events are checked against them.

## What it cannot tell you

- Whether a given visitor installed the app. Every workaround (clipboard, fingerprinting, deferred deep links) is a cross-site identifier under another name, and it makes a consent banner mandatory.
- Web retention. The id dies at midnight, so a returning visitor counts again; the column is labelled people-days, not people. Retention (D1/D3/D7) exists only for apps, where the UUID outlives the day.
- Sessions, paths between pages, replay, heatmaps. Conversion is goals divided by views of the same page, never a path.
- Exact counts. Analytics Engine samples rows, and a plain `count()` undercounts without an error, so every aggregate is weighted by `_sample_interval`. Beacons are fire-and-forget, and some never arrive.
- Raw events older than 90 days. Analytics Engine deletes them; a daily rollup into D1 keeps the totals, not the events.

The reading rule that follows: a gap of a few percent between funnel steps is noise, a gap of several times is a finding.

## Why PostHog was dropped

The house rule is one analytics project per product, and PostHog's free plan allows one project (paid: six). Self-hosted PostHog is officially unsupported, needs a 4 vCPU / 16 GB machine and gets only free-tier features. Google Analytics is web-only and brings cookies; Counterscale counts page views, not app events. PostHog was retired everywhere on 26 Oct 2026 ([[posthog-cross-platform]] keeps the old setup as history). If session replay ever becomes necessary, the plan is to point PostHog at the same event stream, not to grow a worse copy here.

## Numbers

- Registry on 27 Oct 2026: 17 live sites (plus 1 retired) and 16 app sources, 15 iOS and 1 Android.
- Web script: 1,100 bytes brotli against a 1,200-byte budget that is checked before every deploy (measured 27 Oct 2026).
- Running cost: $0. Ingest and Analytics Engine fit the Workers Free plan, 100,000 data points a day.
- Beacon loss on one app over 14 days: 7 of 221 events, 3%.
- Cloudflare's edge reported 20,000 unique clients on one site for a window in which two people visited. "People" come from the browser-only counter instead, labelled a lower bound.
- One app's funnel over 7 days (3 Aug 2026): 2 landing visitors, 32 App Store impressions, 8 product page views, 0 of them from the website, 4 installs. The bottleneck was traffic, not measurement.

## Learned from

The repo's PRD, architecture notes and metrics doc, where each limit above sits next to the incident that produced it.

## Connections

- [[privacy-as-architecture]]: the same principle applied to measurement
- [[posthog-cross-platform]]: the setup this replaced
- [[infra-two-tools]]: runs on the same Cloudflare Workers as everything else
- [[kill-iterate-scale]]: the go/no-go thresholds need per-channel visits and installs
