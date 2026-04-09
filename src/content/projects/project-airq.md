---
type: concept
description: "Check AQI, PM2.5, PM10 for any city from terminal. Open-Meteo + Sensor.Community data merge. Rust core with WASM support."
title: "airq — CLI air quality checker"
created: 2026-03-16
tags: [project, open-source, rust, air-quality, cli, wasm]
course_module: 7
course_order: 3
publish: true
publish_as: project
source_url: "https://github.com/fortunto2/airq"
---

CLI tool to check air quality for any city. Merges data from Open-Meteo (model forecasts) and Sensor.Community (real sensors). Rust core, WASM build for web.

**GitHub:** [airq](https://github.com/fortunto2/airq) — Rust, 4 modules (matrix, event, merge, signal), 101 tests, 14 signal types.

**Key innovation:** sensor data is primary, model is fallback. Divergence detection between sources (Moscow fix: 130 → 6.2 AQI after merge). Event detection with EWMA + concordance + directional analysis.

**Web dashboard:** [air-signal](https://github.com/fortunto2/air_signal) — Leaflet map, sensor merge visualization.

- [[privacy-as-architecture]] — all processing local, no user data sent anywhere
- [[cli-first-testing]] — CLI-first: `airq antalya` works offline with cached data
- [[one-pain-one-feature-launch]] — one pain (air quality in Antalya), one feature (check from terminal)
