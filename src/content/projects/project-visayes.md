---
type: concept
description: "Check whether a passport or visa photo meets a country's published specification, and crop one that does. Rust core, WebAssembly in the browser — the photo never leaves the device. 1000+ pages across 9 languages."
title: "VisaYes — does your visa photo meet the spec?"
created: 2026-08-05
updated: 2026-10-30
tags: [project, visayes, rust, wasm, onnx, privacy, seo, geo, astro, agents, leads]
project_type: app
price: 0
price_currency: USD
offer_url: "https://visayes.app"
course_module: 7
course_order: 8
publish: true
publish_as: project
source_url: "https://visayes.app"
github: fortunto2/visa-photo
index_line: "VisaYes: does your visa photo meet the spec? Rust + WASM in the browser, 9 languages, nothing uploaded. Google went to ~0 by September 2026; 73% of visitors now arrive from ChatGPT citations. Visa-help chat (Claude Haiku, contact = request) and agent-readable twins, skill, WebMCP. Desktop app on Dioxus from the same core"
index_section: "project"
---

# VisaYes

A photo for a visa or a passport has to match a published specification down to the
millimetre — 35 × 45 mm for Schengen, 2 × 2 inches for the United States, head between
this fraction and that fraction of the frame. Get it wrong and the application comes back.

[VisaYes](https://visayes.app) does two things. It tells you the specification for a given
country and document, from the official source, with the date it was last checked. And it
takes your photo and produces one that matches: background replaced, face straightened,
crop to the exact frame.

## The photo never leaves the browser

Background removal runs as an ONNX model compiled to WebAssembly, in the tab. Nothing is
uploaded, so there is no server holding anyone's face and no account to create.

That is the whole differentiator, and it is a real one. The market standard is a free
preview and $6–17 to download the result without a watermark — the same product resold
under several brands at different prices. VisaYes charges nothing and watermarks nothing.

## What the data said about the product

Within two weeks of launch the site had 460 pages earning impressions across nine
languages. Then a comparison settled a product question that opinion could not.

At the same search positions, the pages that offer to **check** a photo convert at 6.6%,
against 1.0% for the pages that state the specification. Same rankings, six times the
clicks. People do not arrive wanting to know what the size is; they arrive wanting to know
whether the photo already on their phone will pass.

Reference material gets read. A verdict gets clicked.

## Then Google stopped showing it, and ChatGPT took over

The impressions did not last. In late August the site drew around 900 Google impressions
across some 500 queries in a fortnight; by early September it was near zero, and it has stayed
there. The pages are still indexed and pass every on-page check; Google simply does not show
them. My guess, not proven: a new domain with 855 pages from one template reads as scaled
content.

The traffic came from somewhere else. In the week to 30 October about 600 people visited, and
73% of them arrived from ChatGPT (it tags the links it cites with `utm_source=chatgpt.com`),
almost all on the DV lottery photo checker. Being the page an assistant cites became the
channel, which is why the agent-readable side below matters more than any meta tag.

## Help beyond the photo

People who check a photo often have the next question too: the form, the appointment, a
refusal. Each visa page now has a small chat for that. An AI assistant (Claude Haiku) answers in
a sentence or three and asks about the case; when the person types an e-mail, phone or
Telegram handle, code turns the conversation into a request that a consultant follows up by
hand. The model only answers. The history lives on the server, messages and turns are capped,
three off-topic messages close the chat, and spending stops at $1 a day.

The first version of the offer taught something cheap. On the DV lottery pages it offered help
with a US tourist visa, and every click came from people entering the lottery; nobody wrote.
Now three ways of asking rotate per visitor (a fast answer, a free look at the case, the fear of
a refusal) and the funnel is counted per variant, from the hook appearing on screen to a
request. As of 30 October there are no requests yet, which is itself the measurement.

## Readable by agents

Every document page has a Markdown twin, served to anything that sends
`Accept: text/markdown`, with a line that links to the chat with the question typed in
(`?ask=…#consult`). The site also publishes llms.txt and llms-full.txt, every specification as
JSON, an installable agent skill with a discovery index, Link headers pointing at all of them,
and the chat form as a WebMCP tool for agents in the browser. Nothing an agent can do sends a
request on its own: the person presses send.

## Stack

Rust core for the image work, Astro for the site, Cloudflare Pages. Every document page is
built twice, once for people and once as Markdown for agents, from a single derivation so a
corrected specification cannot reach one and miss the other. Each also gets its own link
preview, drawn at build time with the document's proportions (270 cards). The chat and
requests run in a Cloudflare Worker with D1.

## There is a desktop app too

The same Rust core also ships as an offline desktop application built with Dioxus — Apple
Vision or ONNX for background removal, the same country presets, ICAO guides and print
layout. The web tool covers the case where someone needs one photo now; the desktop one
covers the case where someone processes many.
