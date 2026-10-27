---
type: concept
description: "Check AQI, PM2.5, PM10 for any city from terminal. Open-Meteo + Sensor.Community data merge. One Rust core, compiled to WASM, behind the CLI, airsignal.app and the Crew Air shift planner."
title: "airq — CLI air quality checker"
created: 2026-03-16
tags: [project, open-source, rust, air-quality, cli, wasm]
project_type: tool
course_module: 7
course_order: 4
publish: true
publish_as: project
source_url: "https://github.com/fortunto2/airq"
crate: airq
github: fortunto2/airq
index_line: "airq: CLI air quality checker, Rust core, sensor+model merge, WASM"
index_section: "project"
---

# airq

Check air quality from your terminal. Any city in the world, no API key needed. Detects pollution fronts, generates visual reports with maps and heatmaps.

Merges two data sources with dynamic weighting by divergence:
- **Sensor.Community** -- 15,000+ citizen science sensors worldwide -- primary, ground truth
- **Open-Meteo** -- CAMS atmospheric model (PM2.5, PM10, CO, NO2, O3, SO2, UV) -- fallback

When sources diverge (e.g. model says 130, sensors say 7), sensors win. Model weight drops to ~0% at high divergence.

The core (`airq-core`) is shared. The CLI links it natively; [airsignal.app](https://airsignal.app) runs it as WASM; the Air Signal and Crew Air iPhone apps call the site's API, so every surface gives the same number from the same code.

```bash
brew install fortunto2/tap/airq     # Homebrew (macOS & Linux)
cargo install airq                  # crates.io (any platform)
```

## Quick Start

```bash
airq --city gazipasa
```

```
Resolved city: Gazipasa, Turkiye
Sources: Open-Meteo (model) + Sensor.Community (1 sensors, 5km median)
PM2.5  9.6 avg  (12.7 model, 6.5 sensors)
PM10   14.7 avg  (16.2 model, 13.1 sensors)
CO    159.0 | NO2  1.9 | O3  73.0 | SO2  1.1
UV Index: 0 (Low) | Humidity: 59% | Pressure: 1009 hPa
Wind:   5.2 km/h NE | Comfort: 90/100 Excellent
US AQI: 40 | EU AQI: 29 -- Good
```

## Commands

| Command | What it does |
|---------|-------------|
| `airq --city tokyo` | Air quality for any city (40K+ built-in) |
| `airq --lat 55.75 --lon 37.62` | By coordinates |
| `airq comfort --city berlin` | 6-signal comfort index (Air, Temp, Wind, UV, Pressure, Humidity) |
| `airq --city gazipasa --full` | Extended data: pollen, earthquakes, geomagnetic Kp |
| `airq history --city istanbul --days 5` | Sparkline history chart |
| `airq top --country turkey` | Top cities by AQI for any country |
| `airq compare --city berlin` | Compare providers (model vs sensor area median) |
| `airq front --city gazipasa --radius 150` | Pollution front detection (cross-correlation, time-lag) |
| `airq report --city hamburg --radius 150 --pdf` | HTML/PDF report with Leaflet.js map and heatmap |
| `airq blame --city hamburg --radius 20` | Source attribution (factories, power plants from OSM) |
| `airq serve --city moscow --city istanbul` | Headless REST server + Swagger UI |

All commands support `--json` for machine-readable output.

## Air Signal Desktop

Native desktop app for real-time air quality monitoring. Single binary, no Docker, no browser.

```bash
cargo run -p airq-dashboard     # from source
```

**Tabs:**
- **Dashboard** -- PM2.5/PM10 stats, comfort score, CO/NO2/O3 WHO status, sensor table
- **Map** -- Leaflet with heatmap overlay, layer switcher (dark/OSM/light), city radius
- **Comfort** -- 6-signal matrix with progress bars
- **Events** -- pollution event timeline with source classification
- **Sources** -- PM10/PM2.5 ratio guide, extended pollutants grid
- **Network** -- local WiFi/VPN IPs, start/stop HTTP server, LAN sensor scan (ESP8266)
- **Settings** -- editable config, save to `config.toml` (shared with CLI)

City switching via chips in top bar or search (40K city autocomplete).

## Air Signal Web

[airsignal.app](https://airsignal.app) ([source](https://github.com/fortunto2/air-signal-web)): Astro + Cloudflare Workers, D1 for reports, `airq-core` compiled to WASM for the merge, event detection, source attribution (CPF), bearings and the comfort index.

**14 comfort signals** (all normalized in Rust via sigmoid/gaussian):

| Signal | Curve | Ideal |
|--------|-------|-------|
| Air (PM2.5) | sigmoid desc | AQI < 50 |
| Temperature | gaussian | 23C |
| Wind | sigmoid desc | < 25 km/h |
| UV | sigmoid desc | < 6 |
| Pressure | gaussian | 1013 hPa |
| Humidity | gaussian | 50% |
| Sea (waves) | sigmoid desc | < 2m |
| Earthquake | sigmoid desc | < M4.5 |
| Fire | sigmoid asc | > 30km |
| Pollen | sigmoid desc | < 50 |
| Geomagnetic | sigmoid desc | < Kp4 |
| Daylight | sigmoid asc | > 10h |
| Noise | sigmoid desc | < 60dB |
| Moon | cosine | full moon |

## Crew Air: shift plans for outdoor crews

Built at the Stanford Cleantech Hackathon (Oct 2026) as a module of the core, `crew.rs`, exported as `wasm_crew_plan`. Live at [airsignal.app/crew](https://airsignal.app/crew).

For a site and a shift it answers, hour by hour, what California's wildfire-smoke rule (Cal/OSHA §5141.1) and heat rule (§3395) require:

- **NowCast, not the daily mean.** Open-Meteo's `us_aqi_pm2_5` is a 24-hour average; the rule uses the current AQI, so the engine recomputes the EPA NowCast from hourly PM2.5.
- **Rulebooks are data.** Thresholds live in `rulebooks/us-ca.json`, not in code. Smoke rules are concentrations, because the AQI caps at 500.
- **Checked against the ground.** The nearest AirNow monitor corrects the forecast, clamped to [0.5, 3] so a safety tool only corrects cautiously; NASA VIIRS fires within 50 km come with distance and bearing; the NWS wind turns each fire into a downwind cone.
- **A signal for machines.** The same plan goes out as JSON that a dispatch system or a building controller can act on.

## Architecture

**4 crates:**
- `airq` -- CLI binary (commands, TUI)
- `airq-core` -- library (matrix, event, merge, signal, crew), 131 tests, 14 signal types; PM2.5 AQI on the EPA's 2024 breakpoints
- `airq-dashboard` -- native desktop app
- `airq-core` WASM -- browser/web build

**Event detection:** EWMA + concordance + directional analysis, dual PM2.5+PM10, source fingerprint.

**Merge algorithm:** sensors primary, model fallback by divergence (Moscow fix: 130 -> 6.2 AQI after merge).

**Pollution front detection:** Z-score spike detection, cross-correlation with time-lag, haversine geometry.

**Blame (source attribution):** auto-discovers factories, power plants, highways from OpenStreetMap (Overpass API). CPF = probability that high PM2.5 occurs when wind blows from source direction.

## Headless Server

```bash
airq serve --city gazipasa --radius 15 --port 8080
```

REST API + Swagger UI at `http://localhost:8080/docs/`:
- `GET /api/status` -- uptime, sensor/reading counts
- `GET /api/readings?sensor=X&from=Y&to=Z` -- sensor readings
- `GET /api/sensors` -- sensor list
- `GET /api/events` -- detected pollution events
- `POST /api/push` -- ESP8266/ESP32 data ingestion

Install as daemon on macOS (launchd), Linux (systemd), or Windows (nssm).

## Links

- [GitHub](https://github.com/fortunto2/airq) -- Rust, AGPL-3.0
- [crates.io](https://crates.io/crates/airq)
- [airsignal.app](https://airsignal.app) -- the web app on the same core; [/crew](https://airsignal.app/crew) -- Crew Air
- [[privacy-as-architecture]] -- all processing local, no user data sent anywhere
- [[cli-first-testing]] -- CLI-first: `airq antalya` works offline with cached data
- [[one-pain-one-feature-launch]] -- one pain (air quality in Antalya), one feature (check from terminal)
