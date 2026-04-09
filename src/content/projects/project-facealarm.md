---
type: concept
description: "Face yoga tracker with daily selfie alarm. AI won't turn off until you take a selfie. Track transformation daily. iOS + Android."
title: "FaceAlarm — face yoga tracker with daily selfie alarm"
created: 2025-06-01
tags: [project, ios, android, facealarm, on-device-ai, health]
course_module: 7
course_order: 9
publish: true
publish_as: project
source_url: "https://www.face-alarm.com"
---

# FaceAlarm

Track your face transformation daily. AI-powered alarm that won't turn off until you take a selfie — perfect for face yoga, gua sha, and skincare routines.

![FaceAlarm](/images/projects/facealarm/app-mockup.png)

## The Problem

Wife runs a face massage coaching business. Her clients needed a daily reminder tool with progress tracking. No good app existed — all face yoga apps were either video courses (no tracking) or generic timers (no face focus). Built one.

## How It Works

1. **Set alarm** — daily reminder at your preferred time
2. **Take selfie** — alarm won't turn off until you take a photo (AI verifies it's a real face)
3. **Track progress** — see your transformation over days, weeks, months
4. **Follow routines** — guided face yoga and gua sha exercise sequences

## Features

- **Daily selfie alarm** — consistent tracking without willpower
- **AI face verification** — on-device, no server, no photo uploads
- **Progress timeline** — before/after comparisons over time
- **Guided exercises** — face yoga, gua sha, skincare routines
- **Privacy-first** — all photos stay on device, no registration required

![FaceAlarm screenshots](/images/projects/facealarm/facealarm-2.webp)

## Stack

- **iOS:** Swift + SwiftUI + CoreML + Apple Foundation Models
- **Android:** Kotlin + Jetpack Compose
- **AI:** on-device face detection and verification — zero API cost
- **Monetization:** StoreKit 2 (iOS), Google Play Billing (Android)

## Links

- [Website](https://www.face-alarm.com)
- [App Store](https://apps.apple.com/app/facealarm-face-yoga-tracker/id6758454962)
- [Google Play](https://play.google.com/store/apps/details?id=com.facealarm.app)
- [SuperDuperAI product page](https://superduperai.co/product/face-alarm)

## Lessons

- Products from life = real pain, not hypothetical
- iOS + Android dual launch doubles reach for utility apps
- On-device AI removes cost barrier for AI features in freemium
- [[apple-on-device-ai]] — uses Apple Foundation Models for on-device inference
- [[one-pain-one-feature-launch]] — classic: one pain (wife's business), one feature (alarm), launched
- [[privacy-as-architecture]] — all photos on-device, no cloud
- [[portfolio-approach]] — one product in the barbell portfolio
