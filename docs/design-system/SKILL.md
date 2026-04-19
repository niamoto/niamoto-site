---
name: niamoto-design
description: Use this skill to generate well-branded interfaces and assets for Niamoto — the open-source ecological data platform that publishes biodiversity portals from tabular + GIS data. Contains colors, type, fonts, assets, copy tone, and UI kit components (desktop GUI + published static site).
user-invocable: true
---

Read `README.md` first — it covers voice, content fundamentals, visual foundations, and iconography.

Key files:
- `colors_and_type.css` — every color/type/radius/shadow/motion token
- `assets/` — logo (charcoal N + fern + wave), favicon, WFO partner logo, product screenshots
- `preview/` — small reference cards for each token group
- `ui_kits/gui/` — Niamoto Desktop recreation (Plus Jakarta Sans, Lucide icons, Frond theme)
- `ui_kits/published_site/` — generated biodiversity portal recreation (Arial Black nav, Font Awesome, animated widget gradients)

If creating visual artifacts (slides, mocks, throwaway prototypes), copy assets out of this skill and produce static HTML. If working on production code, adopt the tokens directly.

If invoked without guidance, ask the user whether they want to design for the **desktop GUI** surface (admin, internal — calm UI, cool greys, forest green) or the **published portal** surface (public-facing — Arial Black header, gradient widget headers, Font Awesome). Then ask what they want to build.

Rules of thumb:
- Voice: neutral, declarative, field-scientist; imperative verbs for workflow ("Import. Structure. Publish."). No emoji in product UI.
- Latin botanical names always italic.
- Primary = `#2E7D32` (GUI) or `#228b22` (site). Neutrals are cool (oklch hue 250), NOT green-tinted.
- Radii 7px default, 12px for published-site widgets. Pill only for status chips.
- Motion is `cubic-bezier(0.22, 1, 0.36, 1)`, 200ms base. No bounce / overshoot in product UI.
- Icons: Lucide for GUI, Font Awesome 6 for published site. Never hand-draw SVG icons.
- The one sanctioned "colored left border" card is the StageCard dashboard pattern — it encodes pipeline stage.
