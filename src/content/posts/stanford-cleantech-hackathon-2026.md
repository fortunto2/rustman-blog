---
type: concept
title: "Who built what at a climate hackathon, and where the industry is going"
description: "Stanford Cleantech Hackathon 2026, 23-24 Oct: the data, models and stacks behind 13 projects, what the investor panel said about where the money is, and seven insights with evidence."
created: 2026-10-24
tags: [hackathon, climate, cleantech, energy, public-data, validation, air-quality]
publish: true
publish_as: post
learned_from: "Stanford Cleantech Hackathon 23-24 Oct 2026: investor panel, mentor conversations and finalist pitches recorded with supervox; all 19 Devpost project pages"
index_line: "Post: Stanford Cleantech Hackathon 2026, technical survey. GridLight (CAISO g/kWh), Griddy (chained XGBoost, held-out regions), Shadow Plan (CPUC plan vs CAISO delays), FlareWise (DBSCAN + Gaussian plume on ERA5, 180° wind test), Chill Factor (leave-one-out), Dengai (OR-Tools orienteering), heat plan audit (blind LLM coder, kappa), WattNext, ResilienceOS, Pismo, Crew Air. Panel: data-center load, adaptation, asset owners; red flags utilities, subsidy, AI where physics would do."
index_section: "concept"
---

# Who built what at a climate hackathon, and where the industry is going

On 23-24 October I spent 24 hours at the Stanford Cleantech Hackathon building [Crew Air](https://airsignal.app/crew) with a teammate. 19 projects were submitted across three tracks. I recorded the investor panel and the finalist pitches with [[project-supervox]] and read every Devpost page. Stage quotes are paraphrases of rough speech-to-text; numbers come from the project pages unless stated.

## Who built what

### Grid

**GridLight.** On PG&E's E-TOU-C every hour outside 4 to 9 pm costs the same, yet 1 pm and 4 am both cost 29¢/kWh at 141 against 324 g/kWh of CO2. Data: CAISO Today's Outlook CO2 and demand files, PG&E tariffs, SVCE's hourly CalFUSE prices via the GridX API, the customer's Green Button CSV. Method: intensity = Σ CO2 (t/h, imports in, exports out) ÷ demand (MW) × 1000 = g/kWh, and a planner that minimises bill plus carbon at $100/t. Vanilla JS and hand-built SVG, all in the browser, Playwright tests. Simulated: the EV home behind "$62 a month, 18% less CO2".

**Griddy.** Click a California site, get a 0 to 100 build score and an hourly simulation of 2024. Five people, FastAPI and Next.js, a dozen public datasets (EIA, CAISO, LBNL, NREL ATB, EPA, Census, Earth Engine). Two chained XGBoost models: hourly demand for 7 load regions (8.7% error on unseen 2025-26 data against 11.2% for a baseline), then a siting model over 16,393 cells of 5 km, at 0.92 to 0.96 ROC-AUC on held-out regions. A linear program places the capacity. The page admits the AUC is flattered by easy negatives and shows that next to the number.

**Shadow Plan.** California's plan puts 34,722 MW of solar and about 9,300 MW of batteries at 77 substations by 2036. Shadow Plan checks it against CAISO's upgrade delays, the interconnection queue and county decisions in agendas and scanned PDFs (Tesseract). Land is rebuilt from CEC map layers and matches the state workbook within 5% at 56 of 76 substations. Delays are counted by two separate programs, Python and TypeScript, and a test checks they agree. An LLM turns a changed county page into an event with a quote and a page number. Finding: after San Bernardino's 2019 ban, only about 190 of the 300 MW planned at Lugo fit on the land left.

**Follow The Sun.** A Next.js simulator that routes an inference query to the datacenter with the lowest energy use within a latency limit, from hardware efficiency, cooling weather and the local demand curve. It claims 13.7% less energy at under 100 ms, from modeled estimates.

**WattNext.** Household scores for a community choice aggregator: grid value, outage exposure, support need, data confidence. Real layers: Census ACS, CPUC fire tiers, OpenStreetMap, Open-Meteo, Earth Engine (NAIP at 0.6 m, Sentinel-2), Planet, Google's Solar API. The 360 households are synthetic, seeded on real building footprints. The best idea is confidence as data: a permit starts at 85%, imagery at 70%, Green Button at 90%, a device found by the customer's app at 97%, and each halves every equipment half-life. LightGBM on a physics baseline forecasts load 48 hours ahead; a Raspberry Pi plays a home battery.

**Consumer apps.** Housemates (appliance photo plus label OCR, then a chat character) runs on simulated prices. Judy pairs smart plugs with what its page calls reinforcement learning. Matcha, built solo in Lovable, keeps AI to the wording and sizes backup batteries in plain TypeScript.

### Resilience

**ResilienceOS.** Storm-outage risk for life-dependent customers in SCE territory, from ORNL EAGLE-I outage records and NOAA HRRR. Features come from NVIDIA StormCast, a regional AI weather model, fine-tuned on outage history. An LLM agent drafts an action plan that a utility employee reviews. The 52% error on stage belongs to existing models in a 2026 paper. Their own accuracy is not reported; customer sites are synthetic.

**Pismo.** Charge a home battery before the NWS warning. NOAA GFS through Earth Engine averaged by county, the NWS alert archive from Iowa Mesonet, EAGLE-I for 2018-21. The rule (rain ≥ 15 mm or wind ≥ 18 m/s) was set on two earlier months and left untouched for the test storm. In Humboldt it fired 27 hours before the High Wind Warning. Santa Cruz and San Mateo got no warning at all. Limits stated: one storm, and EAGLE-I fully records only about 1 day in 7.

### Climate and health

**FlareWise.** Which gas flares to capture on a budget, counting gas value and people downwind. The deepest pipeline in the room. FIRMS VIIRS detections, matched to the Nightfire catalogue, are clustered into sites with DBSCAN. A Gaussian mixture separates routine from occasional flares. Fire radiative power becomes gas volume, an Arps decline and an NPV. An hourly Gaussian plume on ERA5 wind with Briggs dispersion lands on a Census population grid. A thousand Monte Carlo draws feed a mixed-integer program that traces the value-versus-people frontier. In the Eagle Ford, 19 of 1,574 sites pay for capture at $2.50/MMBtu.

**The Chill Factor (UC Davis).** Chill hours per orchard, because growers rely on a CIMIS station up to 50 km away. Data: CIMIS hourly, FNRIC sensors, PRISM, Daymet, NWS National Blend, 16-day forecasts. It rebuilds hourly temperature from daily highs and lows, so a cheap orchard sensor sends one message a day. Python with LightGBM, FastAPI on Cloud Run, Next.js. Asked how they validate without hardware, they said: switch off stations and predict each as an orchard, the night's best answer to a judge.

**Dengai.** Drone-detected mosquito breeding sites in Makassar become tomorrow's inspection routes. Priority = type × confidence × people nearby × cluster × rain, within 100 m, about the flight range of Aedes aegypti. Routing is a team orienteering problem in Google OR-Tools, guided local search capped at 30 seconds, straight-line distance × 1.3 for roads. No LLM, no paid APIs, one laptop. The 200 sites are synthetic because the lab's real detections were not released in time.

**US Heat and Cold Plan Audit (USC).** A blind Claude coder answered a fixed codebook for 50 plan PDFs, each answer with a verbatim quote and page, or "not stated". Harm comes from EpiNOAA temperatures, EPA CIRA curves and CDC WONDER. Deaths averted are Σ D_t (1 − Π (1 − r_i,t)), so measures are not double counted. A lint test fails if a place name appears in engine code. Agreement: kappa 0.78 on action class, 0.84 on commitment strength, 0.38 on status, all three on the page.

### Ours: Crew Air

The hour each Cal/OSHA rule starts on an outdoor shift. Rust engine (airq-core) compiled to WASM on a Cloudflare Worker, D1 for reports. It computes the EPA NowCast from hourly PM2.5 (why is in the API notes below). Rules are data: one JSON rulebook per jurisdiction. VIIRS fires within 50 km raise a warning. An AirNow monitor within 25 km that disagrees by more than 1.5× scales the forecast, clamped to [0.5, 3] and fading over 12 hours. Hourly wind draws smoke cones, with NWS as fallback. A sky photo goes to TypeSafe's Jev: smoke right on 11 or 12 of 12 known photos, never wrong. ML appears only there.

## What to expect in this industry

**The money follows data-center load.** A panelist said demand growth is the fastest since right after World War II. Hyperscalers buy transformers and switchgear directly, outside the utility process. Four projects worked that seam: Griddy sized a 1 GW AI campus, Follow The Sun routes inference, WattNext sets a campus against substation headroom, Shadow Plan tracks the queue. LBNL, cited by Griddy, finds only about 13% of capacity that asks for a connection reaches operation. My inference: siting and interconnection intelligence is where software meets that money, and the buyer is a developer or a hyperscaler.

**Adaptation is the white space, and asset owners pay.** Paraphrasing the panel: funding adaptation used to sound defeatist, and it is now clear mitigation alone is not happening. They named extreme-weather risk, insurance, asset owners with billions at risk, and home hardening. Pismo, ResilienceOS, the Chill Factor (pitched to lenders and land buyers too) and Crew Air sit there.

**The red flags were explicit.** Number one: "we sell to utilities". A utility earns a regulated return on approved capital, and a pilot on its R&D line has no budget to graduate into. Number two: subsidy as the business, "regardless of the party". Then AI where physics or an optimizer would do, single-digit-billion markets, and hardware scaling faster than 10× per step. ResilienceOS and WattNext still pitched a utility or an aggregator as the customer.

**Patterns becoming standard**, my inference from the 19 projects:
- One shared public stack: Open-Meteo, FIRMS, AirNow, CAISO, NWS, EAGLE-I, Earth Engine, Census. Nobody had a data moat.
- Downscaling a coarse source to a point: orchard from station, work site from monitor, county from a GFS grid.
- Tools inside a decision someone already makes: a capture budget, tomorrow's routes, a comment to the CPUC.
- LLMs for reading documents, deterministic code or classic ML for anything physical.

**Overhyped, in my reading:** chat over a dataset (a panelist: build for the questions businesses actually ask), consumer apps on simulated prices, and "AI" as a label on a rule.

## Seven insights

1. **The best validation needed no new data.** FlareWise rotated every wind direction 180°: NO2 at Karnes was 4.8 ppb downwind against 2.2 upwind, and the signal vanished under rotation. The Chill Factor and Griddy held out stations and regions.
2. **Price and carbon disagree, and the usual advice follows price.** On GridLight's simulated home, the same $62 saving cuts CO2 18% at midday and raises it 7% on an overnight timer.
3. **Provenance became a feature.** WattNext decays confidence per source. Griddy labels every number observed, assumed, simulated or inferred. ResilienceOS counts separating real from synthetic as an accomplishment.
4. **The honest finding was the uncomfortable one.** FlareWise found that capturing the cheapest gas first avoids more greenhouse gas than its health plan, and published it.
5. **Numbers grew between page and stage.** 13.7% in a simulator became the saving "if all AI inference companies" adopted it. A kappa of 0.78 became "almost 92% agreement". The pages were more careful than the pitches.
6. **The missing number is never a model.** Utilities do not publish spare substation capacity (Griddy). EAGLE-I gaps make "no outage" unconfirmable (Pismo, ResilienceOS). Dengai's real detections were not released. Labels and utility data are the bottleneck.
7. **The panel's AI rule matched the best builds.** Dengai's routing, matcha's sizing, FlareWise's plume and our NowCast are deterministic. LLMs did the reading: 50 plan PDFs, county agendas. A mentor asked me "what is your model?", and "rules and physics" was the right answer.

## Notes on the APIs, for whoever builds on them next

Each public API we used had one trap. What it gives, the trap, the fix:

- **Open-Meteo air quality.** Hourly PM2.5 and weather, no key. Trap: `us_aqi_pm2_5` is a 24-hour mean, which lags a smoke front by most of a shift. Fix: compute the EPA NowCast from hourly `pm2_5`.
- **Open-Meteo, from a Cloudflare Worker.** Trap: a 429 "Daily API request limit exceeded" for the whole UTC day, because the limit is per IP and Worker egress IPs are shared. Fix: fall back to the nearest AirNow reading and NWS temperatures, say so in the answer, and put the upstream status in every error. It is also free only for non-commercial use.
- **The AQI scale.** Trap: it stops at 500, so a rule written as `AQI >= 501` never fires. Fix: write smoke thresholds as concentrations, 55.5 and 500.5 µg/m³, as Appendix A of §5141.1 does.
- **AirNow hourly files.** Regulatory monitors, no key. Trap: the newest file fills in over the next hour, so a listed monitor can have an empty PM2.5. Fix: read files newest first, up to four hours back, and take the median of the nearest three monitors.
- **NASA FIRMS.** The public 24-hour VIIRS CSVs need no key; the area API needs a free MAP_KEY. Trap: VIIRS sees heat, not smoke, so flares and landfills show up as "fires". Fix: say so on the map.
- **NWS.** Hourly forecast via `/points/{lat},{lon}`, and active alerts by point, free. Send a User-Agent with contact details, as NWS asks.
- **DOL OSHA enforcement API.** Free key. Traps: it refuses urllib's default User-Agent, and it answers 403, not 429, while throttling. §5141.1 is coded `51410001`, while a bare `5141 A` is the older §5141. Fix: real User-Agent, slow retries, a local cache, batches of 40.
- **EPA AirData × BLS QCEW.** Daily county AQI times farm employment (NAICS 11, × 5/7 for workdays) gave our exposure table: 4.5 million worker-days at AQI 151+ in 2020-21.
- **TypeSafe Jev.** Typed questions about a photo, answered with probabilities. Trap: wording changes answers. Fix: a 12-photo eval rerun after every change of wording. Smoke was reliable and visibility was not.
- **Platform traps.** Astro's origin check returns 403 to a multipart POST without an Origin header, so app endpoints take JSON or raw `image/jpeg`. `wrangler dev` keeps its edge cache across restarts, so add a throwaway query parameter. Overpass timed out from the venue twice. Devpost answered 403 to our agent's fetcher; curl with a browser User-Agent worked.

**Earth Engine.** We used it for the pitch, not the product. Notebook auth was blocked on our Cloud project, so a small helper passes a `gcloud auth print-access-token` token into `ee.Initialize` as OAuth credentials. We had no Planet account, so we used Sentinel-2 instead (`COPERNICUS/S2_SR_HARMONIZED`). The least-cloudy scene from 10 to 24 October over the largest FIRMS cluster of 20 October, near Sequoia, rendered as a SWIR composite (B12, B8A, B4), shows the active fire front. A second script computes a dNBR burn scar from median NBR before and after, thresholded at 0.27. At a hackathon its value is that a whole archive comes back as one `getThumbURL` PNG, with nothing downloaded. Other teams used it harder. Griddy took layers for siting, WattNext pulled NAIP at 0.6 m, Sentinel-2 and ESA WorldCover, and Pismo read NOAA GFS forecasts through it. Pismo also measured the cost: about 8 months of forecasts took 1.5 hours, so they cut scope to one storm.

## What happens with Crew Air now

We did not make the finals. A hardware concept added on the last morning took the whole Q&A, and the running software never came up. The lesson fits in a line: lock the story the night before.

Crew Air stays a free tool for outdoor crews in California, with no business around it. Site and API are live at [airsignal.app/crew](https://airsignal.app/crew). The iOS app is at version 1.0 and waits for its App Store record. That evening I added two ideas from other teams: a calendar file of the shift plan (GridLight) and a deterministic backup-battery calculator (matcha).

- Devpost: [devpost.com/software/crew-air](https://devpost.com/software/crew-air)
- Explainer video, 89 seconds: [youtu.be/cflNvJU9x5o](https://youtu.be/cflNvJU9x5o)
