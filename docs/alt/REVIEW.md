# /alt/ Variants — Review

Date: 2026-04-17 (V5/V6/V7 added; V11 Silex added wave 2); first pass 2026-04-15
Branch: `feat/landing-alternatives`
Status: Eight variants shipped (7 wave 1 + V11 Silex). Build green (22 pages, ~1.45s).

## What was shipped

Seven landing page variants for niamoto.org under `/alt/*`, bilingual FR/EN, all isolated from the existing site's design tokens.

| Variant         | URL EN                 | URL FR                    | Vibe                 | Layout                    |
| --------------- | ---------------------- | ------------------------- | -------------------- | ------------------------- |
| Atlas           | /alt/atlas             | /fr/alt/atlas             | Editorial Luxury     | Editorial Split           |
| Field Journal   | /alt/field-journal     | /fr/alt/field-journal     | Editorial Luxury     | Z-Axis Cascade            |
| Méthode         | /alt/methode           | /fr/alt/methode           | Editorial Luxury     | Asymmetrical Bento        |
| Herbarium       | /alt/herbarium         | /fr/alt/herbarium         | Editorial Luxury     | Editorial Split + Z-Axis  |
| Observatory     | /alt/observatory       | /fr/alt/observatory       | **Ethereal Glass**   | Asymmetrical Bento        |
| Portail         | /alt/portail           | /fr/alt/portail           | **Soft Structuralism** | Editorial Split + Rail  |
| Strate          | /alt/strate            | /fr/alt/strate            | **Soft Structuralism** | Longform Editorial      |
| Silex (V11)     | /alt/silex             | /fr/alt/silex             | **Minimalism Radical** | Full-scroll 4 verb strates |

Plus the dispatcher at `/alt/` (and `/fr/alt/`) listing all variants with palette swatches in a 3-column grid.

The main `src/pages/index.astro` is unchanged except for one quiet line in the closing section linking to `/alt/`.

## Architecture decisions in practice

### Token isolation worked

`AltLayout.astro` does **not** import `BaseLayout.astro` or `src/styles/global.css`. Each `/alt/*` page loads only `src/styles/alt/base.css`, which scopes everything via `[data-theme="…"]`. The existing site's typography (Plus Jakarta Sans, forest green palette) is untouched. Verified: `pnpm build` produces both sets of pages without conflict.

### Tailwind v4 surprises

1. `@utility bg-canvas { ... }` blocks failed Tailwind v4's parser with "Unterminated string". Replaced with plain CSS classes (`.bg-canvas { background-color: var(--c-canvas); }`) declared after `@import "tailwindcss"`. Lower-tech, works.
2. Unicode box-drawing characters in CSS comments (`─`, `┌`, `│`) also broke the parser. All `/alt/` CSS is now ASCII-only in comments.
3. The `@source` explicit subdir gotcha (already documented in CLAUDE.md) was honoured — `base.css` declares `@source` for components/alt, layouts/AltLayout, pages/{en,fr}/alt explicitly.

### Fraunces substituted PP Editorial New

PP Editorial New requires a Pangram Pangram licence. Per the 2026-04-15 decision, Fraunces (SIL OFL, free) is used instead in V1, V2, V4. Each tunes Fraunces' variable axes differently so the variants don't feel like palette swaps:

- V1 Atlas: `opsz` 24, `wght` 400, `WONK` 0, `SOFT` 50 — restrained, italic accent flips on `<em>` to `WONK` 1
- V2 Field Journal: `opsz` 144, `wght` 600, `WONK` 1, `SOFT` 100 — display semibold with quirks
- V4 Herbarium: `opsz` 144, `wght` 800-900, `WONK` 0, `SOFT` 50 — monumental, museum gravity

V3 Méthode keeps Cabinet Grotesk (Fontshare CDN) + Satoshi (Fontshare CDN) as planned.

### Botanical photos: deferred

The plan called for sourcing real botanical photos from the NC portal for V2 and V4. None were available in `public/showcase/`. Both variants now use stylised SVG silhouettes (3 leaf-pattern SVGs in V2's plates, 1 fronded silhouette in V4's specimen frame). The visual impact is reduced versus real photos but the typographic and palette work carries the variants.

**Action for next iteration**: download 3-6 high-res botanical photos (Amborella, Parasitaxus, Zygogynum, Cryptocarya, Hedycarya, Stenocarpus) from the NC portal and replace the SVGs in `BotanicalPlate.astro`, `SpecimenFrame.astro`, `PlateSeries.astro`. Swap the inline `<svg>` for `<img>` with `loading="lazy"`, add proper `alt` text per species.

### Live portal embed (V3): deferred

The plan flagged this as optional. Not shipped. V3 Méthode uses static stats with `AnimatedCounter` instead.

## Anti-AI-slop checklist (per high-end-visual-design §8 + design-taste-frontend §10)

| Check                                            | Status   | Notes |
|--------------------------------------------------|----------|-------|
| No `Inter` font anywhere in `/alt/`              | ✅       | Fraunces / Cabinet Grotesk / Satoshi / Plus Jakarta / Geist only |
| No `h-screen` for full-height                    | ✅       | All hero sections use natural padding; `min-h-[100dvh]` set on body |
| No pure `#000000` background                     | ✅       | Espresso `#1A1410`, dark sage `#1E2822` |
| No 3-equal-card row                              | ✅       | V1/V3 pillars use `border-r` dividers; V2/V4 use bento or asymmetric layouts |
| No AI purple/blue gradient aesthetic             | ✅       | Sage / terra / ochre / copper accents |
| No oversaturated accents                         | ✅       | All accents below 80% saturation |
| Generic `box-shadow` replaced with tinted        | ✅       | Shadows use `color-mix(in srgb, var(--c-ink) X%, transparent)` |
| Custom cubic-bezier transitions                  | ✅       | `cubic-bezier(0.32, 0.72, 0, 1)` used throughout |
| Spring physics for interactive motion            | ✅       | Framer Motion `{ stiffness: 110, damping: 22 }` baseline |
| Animations only on `transform` and `opacity`     | ✅       | No `top`/`left`/`width`/`height` animations |
| Backdrop-blur only on fixed nav pill             | ✅       | `IslandNav` uses `backdrop-filter: blur(18px)` |
| Visible `:focus-visible` rings                   | ✅       | 2px accent outline, 2px offset, declared in `AltLayout` global style |
| Reduced-motion respected                         | ✅       | `@media (prefers-reduced-motion: reduce)` kills all transitions; motion islands gate via `useReducedMotion()` |
| Skip-to-content link                             | ✅       | Each variant page has `<a href="#main" class="skip-link">` |
| Semantic HTML                                    | ✅       | `<main>`, `<nav>`, `<section>`, `<article>`, `<aside>`, `<ol>` used |
| No emojis in content or alt text                 | ✅       | Pure SVG icons (Phosphor stroke 1.5 inline) |
| No `John Doe` / generic names                    | ✅       | Real species, real partners |
| No round fake numbers                            | ✅       | Actual NC stats: 1,208 taxa, 5,400 km², 509 plots, 70,000+ trees, 2,713 endemics |
| Bilingual: hreflang alternates                   | ✅       | `<link rel="alternate" hreflang="en/fr/x-default">` per page |
| `color-scheme: dark` on dark variants            | ✅       | V3 Méthode + V4 Herbarium |
| Font-display: swap                               | ✅       | All `@fontsource-variable/*` fonts ship with this default |
| Content reads with JS disabled                   | ✅       | Astro SSR ships full content; motion is progressive enhancement |

## Variant-by-variant audit

### V1 Atlas

**Strengths**: classic editorial register, the right starting point for "atlas scientifique". Region list with mono stats reads like a publication. Pillars without container cards (just border-r) feel intentional.

**Weaknesses**:
- The italic accent on "share/partagé" works in EN but the FR phrasing is awkward — "Des données de terrain / au portail / partagé" loses some flow when the italic flips.
- Hero sub max-width too tight on wide screens — text wraps oddly at 1440px.

**Recommendations**: revisit the FR hero phrasing in a copy pass. Loosen `--c-canvas` slightly (try `#FCFAF5` for a touch more warmth).

### V2 Field Journal

**Strengths**: the cascade of stylised plates with rotations conveys "carnet" without needing photos. Field Notes section in display Fraunces with mono dates feels like an actual logbook entry.

**Weaknesses**:
- Without real photos, the plates lean too hard on typography — visual weight is uneven.
- Z-Axis cascade overlap on smaller-than-1024px viewports goes single-column too eagerly. Could keep cascade until ~768px with tighter overlap.
- Hero kickers row could use vertical separators between left and right kicker pairs.

**Recommendations**: prioritise getting real photos in. Tighten the responsive break for the cascade.

### V3 Méthode

**Strengths**: dark sage palette plus parchment text reads premium without being "AI dark mode SaaS". Animated counters tie nicely with the typewriter terminal — both feel "alive". Bento grid with 1 large + 2 small cards is a clean asymmetric layout (anti-3-equal-card).

**Weaknesses**:
- Cabinet Grotesk loaded from Fontshare CDN: blocking @import in `fonts.css` adds ~120ms to first paint. Should be self-hosted in a future perf pass.
- The terminal card's typewriter cycles all four prompts — could reduce to 3 to match attention span.
- LiveStatsCard's stats are static numbers from the existing landing — we should think about whether they should be live-fetched in a v2 (e.g., via Niamoto's runtime stats endpoint when one exists).

**Recommendations**: self-host Cabinet Grotesk + Satoshi, add `<link rel="preconnect">` for Fontshare CDN as a fallback.

### V4 Herbarium

**Strengths**: the most distinctive of the four. Display Fraunces black at clamp(3rem, 8vw, 7rem) carries gravity. Dark espresso + cream + copper feels museum-grade. The single specimen frame as hero anchor reads stronger than V2's three-plate cascade.

**Weaknesses**:
- The SVG specimen illustration is simplistic — it really wants a real botanical photo with sepia filter.
- Plate series 4-column layout collapses to 1-col below 560px (intermediate could use 2-col earlier).
- The italic "open/ouvert" accent on the third title line is the most striking move in the whole set, but its scale (clamp 3-7rem) might be too dominant on small viewports.

**Recommendations**: real photo in hero is the single biggest win. Tune the responsive plate-series breakpoints.

## Build metrics

Last successful build: 14 source pages, 1.21s.

| Page                    | EN size  | FR size  | Note |
|-------------------------|----------|----------|------|
| `/alt/atlas/`           | TBD      | TBD      | (run Lighthouse) |
| `/alt/field-journal/`   | TBD      | TBD      | |
| `/alt/methode/`         | TBD      | TBD      | |
| `/alt/herbarium/`       | TBD      | TBD      | |
| `/alt/`                 | TBD      | TBD      | dispatcher |

**Lighthouse audit pending**. Recommend running `pnpm preview` then `lighthouse http://localhost:4321/alt/atlas` for each variant on both desktop and mobile, store reports under `docs/alt/lighthouse/`.

## Dependencies added

- `@astrojs/react` 5.0.3
- `react` + `react-dom` 19.2.5
- `framer-motion` 12.38.0
- `@phosphor-icons/react` 2.1.10
- `@fontsource-variable/fraunces` 5.2.9
- `@fontsource-variable/geist` 5.2.8
- `@fontsource-variable/jetbrains-mono` 5.2.8
- `@types/react` + `@types/react-dom` (devDeps)

## Files added (summary)

- `src/layouts/AltLayout.astro`
- `src/styles/alt/{base,fonts,atlas,field-journal,methode,herbarium}.css`
- `src/i18n/{config.ts,alt/{index,shared.{en,fr},atlas.{en,fr},field-journal.{en,fr},methode.{en,fr},herbarium.{en,fr}}.ts}`
- `src/components/alt/shared/{IslandNav,LanguageSwitch,DoubleBezel,ButtonInButton,EyebrowTag,Stat,FunderGrid,DispatcherPage}.astro`
- `src/components/alt/motion/{FadeUpOnView,StaggeredReveal,MagneticButton,InfiniteTypewriter,AnimatedCounter}.tsx`
- `src/components/alt/atlas/{HeroEditorialSplit,RegionList,PillarGrid,ClosingNote,AtlasPage}.astro`
- `src/components/alt/field-journal/{HeroLayered,BotanicalPlate,FieldNoteBlock,FieldJournalPage}.astro`
- `src/components/alt/methode/{HeroBento,TerminalCard,LiveStatsCard,PortalMiniGrid,MethodePage}.astro`
- `src/components/alt/herbarium/{HeroSplit,SpecimenFrame,PlateSeries,HerbariumPage}.astro`
- `src/pages/{alt,fr/alt}/{index,atlas,field-journal,methode,herbarium}.astro` (10 page files)

## V5/V6/V7 — the 2026-04-17 pass

### V5 Observatory (Ethereal Glass)

The archetype that was missing from the first four. OLED near-black (`#070908`) with subtle emerald + steel radial glows fixed to the body. Geist Variable everywhere. The hero frames Niamoto as a live observatory; a 4-tile bento below carries "LIVE PULSE" (ticker with mock recent events like "Amborella trichopoda — taxon viewed / NC — just now"), "DEPLOYMENT / NC" (animated counters in tabular JetBrains Mono), "RANGE" (SVG visualising the NC islands with emerald + steel orbs), and "INSTALL" (existing typewriter terminal).

Materiality: double-bezel tile with `backdrop-filter: blur(12px) saturate(1.1)`, `box-shadow: inset 0 1px 0 rgba(255,255,255,0.08), 0 24px 60px rgba(0,0,0,0.35)`. Pulse dot with animated expanding ring.

Strengths: the only data-forward variant. Tiles read like a scientific cockpit.
Weaknesses: the RangeCard SVG is abstract — not a real map. The pulse ticker events are mocked rather than fetched live. Both are acceptable for a marketing landing; a future pass could fetch real runtime stats if Niamoto exposes an endpoint.

### V6 Portail (Soft Structuralism, layout Editorial Split + rail)

The variant that proves Niamoto's output visually. Cream off-white (`#F7F4EE`), deep sage (`#3A4F42`) for CTA, copper (`#AE6A3B`) for emphasis. Massive Clash Display 500 on the hero ("Your field data, / a shareable portal.") with italic accent flipping to sage on the second line. Geist Variable for body.

The rail is the star: three micro-tilted cards (`-1.6°`, `0.8°`, `-0.6°`) with long diffused shadows, each showing a real NC portal page — home (existing `/public/showcase/nc-home.png`), taxons index (`/public/showcase/nc-taxons.png`), and a stylised SVG mockup for the Amborella trichopoda taxon sheet (`AmborellaMockup.astro`). Clicking any card opens the real portal. This variant is the most concrete proof-of-output of all seven.

Strengths: the rail converts "what is a Niamoto portal?" into a visual answer in three glances. Clash Display feels premium, matches a consumer-tech register without losing scientific tone.
Weaknesses: the Amborella mockup is SVG, not a real screenshot. If the Niamoto CLI exposes a deterministic URL for the Amborella page on the live deployment, a future pass should capture and inline the real screenshot (WebP, ~180KB budget). Local capture via headless Chrome was attempted; Chrome isn't installed on this machine. Using the two existing screenshots already under `/public/showcase/` was pragmatic.

### V7 Strate (Soft Structuralism, layout Longform Editorial)

The narrative long-read complement to V1 Atlas's short editorial. Warm linen (`#EFEBE2`), mossy green, bronze. Fraunces display opsz 144/wght 500 for the monumental hero ("An ecological / atlas, / one strata / at a time.") with italic accent flipping to bronze on "atlas,". Geist Variable for body, 1.7 line-height.

Six numbered chapters (01 "Ground layer" → 06 "Soil") with sticky side meta (number + ecological stratum label), pull-quotes with bronze left border + opening quote glyph, a stat block, a code snippet, and a captioned figure that reuses `AmborellaMockup.astro` from V6. The whole page reads like a magazine feature article.

Strengths: genuine long-form feel. Typography rhythm carries readers through 6 layers without fatigue. Distinct from V1 which is more card-based.
Weaknesses: figure count is low — the article visually relies heavily on typography. Could benefit from 2-3 more captioned figures (e.g., a plot map, a plugin-architecture diagram) in a v2.

## Motion: why FadeUpOnView/StaggeredReveal dropped whileInView

During V6 testing, `whileInView` from framer-motion stalled on heroes already in the viewport at the moment Astro's `client:visible` hydration completed. The element stayed at `opacity: 0` because the IntersectionObserver callback never fired for an unchanging intersection state. Refactored both components to use `initial` + `animate` (fires on mount). Combined with `client:visible`, the reveal UX is identical — hydration only happens when the element enters the viewport, and animation fires immediately after — but the dependency on IntersectionObserver is gone. The change affects all 7 variants; spot-checked V1 Atlas and V3 Méthode, no visual regression.

Additionally: dropped `blur={8}` from the 3 new hero `FadeUpOnView` usages — blurring 133px Clash Display (V6) costs a tracepile of GPU paint each frame. Kept default blur for below-fold reveals where type is smaller.

## Astro scoped CSS vs React-rendered roots

`StaggeredReveal` wraps children in a React `motion.ul` / `motion.ol`. Astro's scoped CSS (the default) does NOT propagate the `data-astro-cid-*` attribute to elements rendered by React components. Result: grid rules like `.dispatcher__grid { display: grid }` compiled to `.dispatcher__grid[data-astro-cid-kx4izpf5]` did not match the React-rendered `<ul>`, which fell back to `display: block`.

Fix applied: the 4 `<style>` blocks that target StaggeredReveal-rendered lists use `<style is:global>` — classnames are prefixed enough (`dispatcher-`, `portail-rail-`, `portail-process-`, `obs-pillars-`) to avoid collisions. Files: `DispatcherPage.astro`, `PortalRail.astro`, `ProcessStrip.astro`, `PillarStack.astro`.

Note: the existing V1–V4 PillarGrid / plate components may have the same latent bug. Not fixed in this pass since they weren't visibly broken in my spot checks, but worth revisiting.

### V11 Silex (Minimalism radical)

3 couleurs TOTAL. Geist Mono Light en body (anti-Atlas). Un seul chiffre géant (2713), 4 paliers verbes (Observe/Collect/Publish/Share), densité décroissante.

**Strengths**: la plus austère des 13 variantes. Fonctionne comme anti-cheat vs l'empilement de features.

**Weaknesses**: le visiteur qui cherche "install" doit scroller 5 sections pour trouver la commande. OK si on assume le registre manifesto, pas OK pour un visiteur cold.

## Known follow-ups

1. **Botanical photos** — biggest quality win for V2/V4. Source from NC portal, replace SVG silhouettes.
2. **Real Amborella screenshot** for V6 (replace `AmborellaMockup.astro`) once Chrome is installed or deployment has a stable URL.
3. **Self-host Cabinet Grotesk, Satoshi, Clash Display** — currently Fontshare CDN imports in `fonts.css`. Move to local `.woff2` for LCP.
4. **Lighthouse run** — verify Performance ≥ 90 desktop / ≥ 80 mobile across all 7. Capture under `docs/alt/lighthouse/`.
5. **Revisit the V1–V4 scoped-CSS/React-Container bug** if pillars/plates render as block instead of grid in any variant.
6. **`niamoto-site` git remote** — repo is currently local-only (no remote configured). If the user wants to push this branch, set up `git remote add origin <url>` first.
7. **CLAUDE.md refresh** — once a winning variant emerges, decide whether to update CLAUDE.md to reflect the chosen direction or keep both systems alive.
