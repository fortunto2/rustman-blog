---
type: project
title: "SuperStoryboard — AI storyboard generation with Figma sync"
description: "AI-powered storyboard generation with real-time Figma collaboration. 2nd place at Supabase Hackathon. Gemini + Veo 3.1 + PGMQ."
created: 2026-04-01
tags: [project, ai, supabase, figma, hackathon, video, storyboard]
course_module: 7
course_order: 7
publish: true
publish_as: project
source_url: "https://github.com/fortunto2/superstoryboard"
---

# SuperStoryboard

**2nd Place** at [Supabase Hackathon](https://hackathon.supabase.com/). AI-powered storyboard generation with real-time Figma plugin sync.

Built entirely on Supabase as single source of truth. Generates storyboards from text descriptions with instant Figma sync. Combines Google Gemini 2.5 Flash for image generation, Veo 3.1 for video, and Phoenix Channels for real-time collaboration.

## Technical highlights

- Figma Plugin (37kb) with WebSocket sync
- Supabase as single backend (auth, storage, DB, realtime)
- Google Gemini 2.5 Flash for image generation
- Google Veo 3.1 for video generation
- PGMQ for async job processing
- Real-time Phoenix Channels protocol

## Stack

Supabase, Figma Plugin, Google Gemini, Veo 3.1, PGMQ, Phoenix Channels, WebSocket.

## Links

- [GitHub](https://github.com/fortunto2/superstoryboard)
- [Live Demo](https://figma-chat.superduperai.co/)
- [Figma Community Template](https://www.figma.com/community/file/1569684518251047797/ai-storybord-with-google-nana-banana-and-veo3-1)

- [[project-superduperai]] — parent product studio
- [[schema-guided-reasoning]] — structured outputs for storyboard generation pipeline
