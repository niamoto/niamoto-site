# Niamoto Design System

A design system for **Niamoto** — an open-source ecological data platform that turns heterogeneous biodiversity data (taxonomy, occurrences, plots, GIS layers) into a structured, publishable biodiversity portal.

Niamoto runs as **two connected surfaces**:

1. **Niamoto Desktop (GUI)** — a Tauri + React/Vite app for local project management, data import, collection configuration, and site publishing. Also runs as a web app via `pnpm dev`.
2. **Niamoto CLI** — the Python-first tool (`pip install niamoto`; `niamoto init / import / transform / export`) that the GUI wraps.
3. **Published Static Site** — the generated output (`exports/web/`) rendered through Jinja2 templates with Tailwind, Font Awesome, Plotly, and Leaflet. This is what an end reader actually browses.

Product truth lives in the repo [`niamoto/niamoto`](https://github.com/niamoto/niamoto). A demo instance ships at `niamoto.github.io/niamoto-static-site/`.

---

## Sources used to build this system

- Repo: `niamoto/niamoto@main`
- GUI theme presets: `src/niamoto/gui/ui/src/themes/presets/frond.ts` (default brand preset) + `forest.ts / lapis.ts / tidal.ts / ink.ts / herbier.ts` (alternates)
- GUI tokens layer: `src/niamoto/gui/ui/src/index.css`
- GUI bootstrap / fonts / runtime theme swap: `src/niamoto/gui/ui/index.html`
- Published-site tokens: `src/niamoto/publish/templates/_base.html`
- Published-site custom CSS (widget chrome, modebar, gradients): `src/niamoto/publish/assets/css/niamoto.css`
- Tailwind extension: `tailwind.config.js` (`primary: #1fb99d`, `nav-bg: #228b22`)
- Editorial teaser (the Remotion pitch video): `media/demo-video/src/teaser/theme.ts` + `copy.ts`
- Logo asset: `assets/niamoto_logo.png`

Icon system: **Lucide** for the GUI (`lucide-react`), **Font Awesome 6.6** for the published site. Illustrations and data viz come from **Plotly** (charts) and **Leaflet / MapLibre** (maps).

Fonts: **Plus Jakarta Sans** (display + body) and **JetBrains Mono** (code). The published-site nav title uses **Arial Black** with uppercase + wide tracking.

---

## Index of this folder

| Path | What it is |
| --- | --- |
| `README.md` | This file. |
| `colors_and_type.css` | Every CSS custom property — colors, type, radii, shadows, motion. |
| `SKILL.md` | Agent Skill frontmatter for portability. |
| `assets/` | Logo, favicon, partner logo, product screenshots. |
| `preview/` | Small HTML cards shown in the Design System tab. |
| `ui_kits/gui/` | Recreation of the Niamoto Desktop / GUI surface. |
| `ui_kits/published_site/` | Recreation of the published static biodiversity portal. |

There is **no slide template** in the source repo, so no `slides/` directory is generated.

---

## Content Fundamentals

Niamoto writes like a precise naturalist, not a marketer.

- **Voice is neutral + operational.** Sentences start with imperative verbs for workflow (`Import.` `Structure.` `Publish.`). Product surfaces use second-person sparingly (`Your website is ready at exports/web/`); the rest is declarative.
- **English first.** Docs, README, and the GUI default to English. A French locale is shipped (`i18n/`) and some internal comments/commits are bilingual — fine to mirror if the user is francophone, but default to English.
- **Low on hype.** No "revolutionary", no "powerful AI", no exclamations outside quickstarts. The one place emojis appear is the public-facing README (`🚀 Quick Start`, `🌿 Features`, `🧩 Plugin System`) — decorative section anchors only. **Do not use emoji inside the product UI.**
- **Concrete nouns over abstractions.** Say "taxon", "occurrence", "plot", "collection", "widget", "shapefile" — these are real terms the audience (botanists, conservation orgs, GIS analysts) already uses.
- **Casing:** Title Case for nav and button labels (`Create New Project`, `Open Project`, `Recent Projects`). Sentence case for descriptions and help text.
- **Status messaging is quiet and diagnostic.** Examples from the dashboard:
  - `"Everything is up to date"`
  - `"Updates are needed"`
  - `"Initial steps are still pending"`
  - `"Recalculate 4 collection(s) → Rebuild site → Publish"` (arrow shows sequence)
- **Microcopy examples from the teaser:**
  - Eyebrow: `"Ecological publishing"`
  - Title: `"Import. Structure. Publish."`
  - Body: `"Turn heterogeneous ecological files into clear, structured web pages."`
- **Empty / never-run states** say `"Not yet run"`, not `"Click here to get started!"`.

Tone tagline: *calm, competent, field-scientist*. Every word should survive peer review.

---

## Visual Foundations

### Colors
- **Primary brand** is `#2E7D32` (forest green, the dark leg of the N in the logo). Its lighter sibling `#4BAF50` (`--nia-leaf`) is the success / highlight.
- **Secondary accent** is a steel blue `#5B86B0` — used for "info" status, secondary data series, and supplementary buttons.
- **Published site** ships a slightly different green (`#228b22` — "forest green" web literal) as the nav bar; both greens coexist because the GUI and the static site are themed independently.
- **Neutrals are cool and near-grey** (oklch ~250 hue) — they are deliberately NOT green-tinted. This keeps the brand greens feeling saturated when used as accents.
- **Charts** use a 5-color sequence: forest, steel, leaf, warm, violet — no rainbow spread.
- **Surfaces** are overwhelmingly `#ffffff` cards on `oklch(0.97 …)` page. No gradients on page backgrounds.

### Type
- **Plus Jakarta Sans** everywhere in-app, 400/500/600/700. Geometric-but-warm; pairs with the leaf motif.
- **JetBrains Mono** for code, file paths, YAML, Darwin Core field names.
- Headings use tight tracking (`-0.02em`), body is normal, and the published-site nav uses uppercase Arial Black with `0.125em` tracking and a heavy text-shadow — this is an intentional "field-station signage" quality, retained from the original brand.
- Latin botanical names always italic (`*Araucaria montana*`).

### Spacing & layout
- 4-pt base, Tailwind default scale. Common values: `px-2.5 py-2` for nav items, `p-4` for card sections, `gap-4` between top-level cards.
- 12-column grid for widget layouts on the published site (`.widget-col-12 / 6 / 4 / 3`).
- Sidebar widths are strict: **52×4=208px expanded / 16×4=64px compact** (GUI).
- Content is anchored to viewport with `max-w-2xl` for dialogs, `container mx-auto` for nav.

### Backgrounds
- **No full-bleed photography.** No illustrations beyond the logo and occasional fern/wave motifs derived from it.
- The welcome screen uses a very subtle `bg-gradient-to-br from-background via-background to-muted/30` — near-imperceptible, not showy.
- **Widget headers** are the one place gradients appear: an animated diagonal gradient `135deg, #228b22 → #2d8f47 → #1f7a1f` that shifts across 8s (`gradientShift`). Every Nth widget rotates through variations — see `niamoto.css`.

### Animation
- `--motion-fast: 120ms`, `--motion-base: 200ms`, `--motion-slow: 350ms`.
- Signature easing is `cubic-bezier(0.22, 1, 0.36, 1)` (ease-out-expo) — snappy entrance, no overshoot.
- Widget headers quietly shift their gradient over 8s. Plotly modebars fade/slide in on hover with a 0.2s delay.
- Dialogs: `scale(0.95) → 1` + opacity over 200ms.
- Hover uplift on cards: `translateY(-2px)` + shadow upgrade (`.widget-modern`).
- No bounce, no spring overshoot anywhere in production UI. The teaser video uses springs; the app does not.

### Hover / press states
- **Hover on nav items / sidebar rows:** bg → `accent` / `oklch(0.93 …)`. On the dark sidebar it's `rgba(255,255,255,0.06)`.
- **Active / selected item** in the dark sidebar: `rgba(34,139,34,0.14)` — a tinted green wash.
- **Hover on buttons:** shade down + `transform: scale(1.02)` via `.btn-interactive`.
- **Press:** `transform: scale(0.98)`. No color flash.
- **Link hover on published site:** link color → primary (`#228b22`), nav link adds `rgba(255,255,255,0.2)` wash.

### Borders, radii, shadows
- Borders are near-invisible: `oklch(0.88 0.005 250 / 0.6)` — a cool grey at 60% alpha. `border-width: 1px`.
- Radii are refined, not playful: **4/6/7/10/12px**. Pill = `9999px` is reserved for status chips.
- Shadow system is neutral, multi-layer:
  - `--shadow-sm` through `--shadow-xl` each combine a soft outer shadow with a 1px inner ring.
  - `--shadow-card-stack` is a signature **triple-layer** shadow used in the teaser and marketing shots.
- The published-site widget uses a stronger "lift on hover" (`0 10px 25px`) — this is the single place the UI behaves marketing-y.

### Transparency & blur
- `--backdrop-blur: 8px`, `--surface-opacity: 0.55`. The Frond preset is explicitly "translucent surfaces"; popovers, command palettes, and sheets sit on blurred backdrops.
- Do NOT add blur to cards, tables, or main content — only transient overlays.

### Protection gradients & capsules
- No "text on photo" situations → no protection gradients needed.
- Status capsules are full `rounded-full` with `px-2 py-0.5 text-xs`, colored `bg-{hue}-100 text-{hue}-700` (light) / `bg-{hue}-950 text-{hue}-400` (dark). Hues: green (fresh), amber (stale), blue (running), muted (never_run).

### Cards
Two card tiers coexist:

- **GUI cards** (`Card` / shadcn): `border-width: 1px` in `--border`, `border-radius: var(--radius-lg)` (7px), `--shadow-sm`, solid white / `--surface`. No hover lift.
- **StageCards** (dashboard): add a **3-pixel colored left border** (`border-l-[3px]` in blue/amber/emerald/orange) that encodes the pipeline stage — Data / Collections / Site / Publish. This is the one sanctioned use of the "colored-left-border card" pattern and it carries meaning.
- **Published-site widget** (`.widget-modern`): 12px radius, `0 4px 6px -1px` shadow, lifts `-2px` on hover. Header gets the animated gradient band.

### Imagery & color vibe
- The only photography in the system is product screenshots of the taxon pages. Natural / neutral color cast, not graded.
- Maps use either Leaflet's street tiles or Plotly choropleths with a Plasma ramp (`#0d0887 → #f0f921`).
- DBH / forestry bar charts use a beige-brown palette (`#C28E5F`, `#A0693F`) — warm, earthy, deliberately different from the cool-blue chart palette.

### Fixed elements
- Nav bar on published site: `position: fixed; top: 0; w-full; z-50`.
- Command palette trigger (`⌘K`) pinned bottom-of-sidebar.
- Scroll-pinned action buttons (`.button-container.fixed`) snap below the nav after 63px of scroll.

---

## Iconography

- **Desktop GUI:** `lucide-react` — used via `import { Plus, FolderOpen, Clock, … } from 'lucide-react'`. Stroke icons, ~1.5px weight at 16/20px. Always imported by name, never inline SVG. Sizes used in the app: `h-3`, `h-3.5`, `h-4`, `h-5`, `h-7` (large button glyph).
- **Published site:** **Font Awesome 6.6** (`fas fa-home`, `fa-chevron-down`, `fa-globe`, `fa-check`, `fa-circle-info`) loaded from `assets/css/font-awesome/6.6.0_all.min.css`. Older solid style.
- **Published-site widgets** also use the embedded **Lucide bundle** (`assets/js/vendor/lucide/0.577.0_lucide.min.js`) — initialized on DOMContentLoaded.
- **Emoji:** used only as anchors in the public README (`🚀 🖼️ ✨ 🎯 📦 🏃‍♂️ 📂 🔧 🧩 👩‍💻 📚 🤝 📄 ❓ 📅`). **Never** inside the GUI or the published site.
- **Unicode glyphs:** `→`, `·` used in status lines (`"Recalculate 4 collection(s) → Rebuild site → Publish"`, `"6s · built in 2.4s"`).
- **Partner/provider logos:** WFO (World Flora Online) SVG lives in `public/provider-logos/`; kept as-is, never recolored.

Substitutions made in this design system:
- If `lucide-react` isn't available, this system uses **Lucide via CDN** (`https://unpkg.com/lucide@latest`) or Font Awesome 6 as a last resort.
- Plus Jakarta Sans + JetBrains Mono are loaded from Google Fonts here. The actual app ships local `.woff2` files in `src/niamoto/gui/ui/public/fonts/` — request those from the user if pixel-perfect fidelity is needed.

---

## Caveats / substitutions flagged

- **Fonts:** Google Fonts is used here; the Niamoto desktop app ships local `.woff2` (Plus Jakarta Sans 400/500/600/700, JetBrains Mono 400/500). Ask for the `/fonts` folder if you need the exact bundled files.
- **Screenshots:** the `assets/screenshot-*.png` files are official marketing screenshots; use as reference, not as UI source of truth.
- **Theme alternates:** only the default **Frond** preset is documented in detail. Forest / Herbier / Ink / Lapis / Tidal exist in `src/themes/presets/` and could each be surfaced as tweaks if required.
- **Published-site primary** (`#228b22`) and **GUI primary** (`#2E7D32`) differ by a few LCH points. Both are valid. Match the surface you are designing for.
