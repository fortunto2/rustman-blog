---
type: concept
description: "Check whether a passport or visa photo meets a country's published specification, and crop one that does. Rust core, WebAssembly in the browser — the photo never leaves the device. 1000+ pages across 9 languages."
title: "VisaYes — does your visa photo meet the spec?"
created: 2026-08-05
tags: [project, visayes, rust, wasm, onnx, privacy, seo, astro]
project_type: app
course_module: 7
course_order: 9
publish: true
publish_as: project
source_url: "https://visayes.app"
github: fortunto2/visa-photo
index_line: "VisaYes: does your visa photo meet the spec? Rust + WASM in the browser, 9 languages, nothing uploaded. Desktop app on Dioxus from the same core"
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

## Stack

Rust core for the image work, Astro for the site, Cloudflare Pages. Every document page is
built twice — once for people, once as markdown for agents, from a single derivation so a
corrected specification cannot reach one and miss the other.

## There is a desktop app too

The same Rust core also ships as an offline desktop application built with Dioxus — Apple
Vision or ONNX for background removal, the same country presets, ICAO guides and print
layout. The web tool covers the case where someone needs one photo now; the desktop one
covers the case where someone processes many.
