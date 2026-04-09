---
type: project
title: "SuperStoryboard — AI storyboard generation with Figma sync"
description: "AI-powered storyboard generation with real-time Figma collaboration. 2nd place at Supabase Hackathon. Gemini + Veo 3.1 + PGMQ."
created: 2026-04-01
tags: [project, ai, supabase, figma, hackathon, video, storyboard]
project_type: product
course_module: 7
course_order: 7
publish: true
publish_as: project
source_url: "https://github.com/fortunto2/superstoryboard"
---

# SuperStoryboard

**2nd Place** at [Supabase Hackathon](https://hackathon.supabase.com/).

AI-powered storyboard generation with real-time Figma plugin sync. Built entirely on Supabase. Generates storyboards from text descriptions with instant Figma sync.

<iframe width="100%" height="400" src="https://www.youtube.com/embed/ZGePJxuK3ic" title="SuperStoryboard Demo" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="border-radius: 8px; margin: 1.5rem 0;"></iframe>

## How It Works

1. Describe your story in plain text
2. AI generates scenes with dialogue, camera angles, and descriptions
3. Gemini 2.5 Flash generates images for each scene
4. Veo 3.1 generates video clips
5. Everything syncs to Figma in real-time via WebSocket

## Technical Highlights

- **Figma Plugin** (37kb) with WebSocket sync — real-time collaboration
- **Supabase** as single source of truth — auth, storage, DB, realtime
- **Google Gemini 2.5 Flash** for image generation
- **Google Veo 3.1** for video generation
- **PGMQ** for async job processing
- **Real-time Phoenix Channels** protocol

## Stack

Supabase, Figma Plugin API, Google Gemini, Veo 3.1, PGMQ, Phoenix Channels, WebSocket, Next.js.

## Links

- [GitHub](https://github.com/fortunto2/superstoryboard)
- [Figma Community Template](https://www.figma.com/community/file/1569684518251047797/ai-storybord-with-google-nana-banana-and-veo3-1)
- [Supabase Hackathon](https://hackathon.supabase.com/)
- [YouTube Demo](https://youtu.be/ZGePJxuK3ic)

## Connections

- [[project-superduperai]] — parent product studio
- [[schema-guided-reasoning]] — structured outputs for storyboard generation pipeline
