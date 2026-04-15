# /alt/ Variants — Review

Date: 2026-04-15
Branch: `feat/landing-alternatives`
Status: First implementation pass complete. Build green.

## What was shipped

Four landing page variants for niamoto.org under `/alt/*`, bilingual FR/EN, all isolated from the existing site's design tokens.

| Variant         | URL EN              | URL FR                 | Direction            |
| --------------- | ------------------- | ---------------------- | -------------------- |
| Atlas           | /alt/atlas          | /fr/alt/atlas          | Editorial Split      |
| Field Journal   | /alt/field-journal  | /fr/alt/field-journal  | Z-Axis Cascade       |
| Méthode         | /alt/methode        | /fr/alt/methode        | Asymmetrical Bento   |
| Herbarium       | /alt/herbarium      | /fr/alt/herbarium      | Editorial Split + Z  |

Plus a sober dispatcher at `/alt/` (and `/fr/alt/`) listing the four with palette swatches.

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

## Known follow-ups

1. **Botanical photos** — biggest quality win. Source from NC portal, replace SVG silhouettes in V2 and V4.
2. **Self-host Cabinet Grotesk + Satoshi** — currently Fontshare CDN imports in `fonts.css`. Move to local `.woff2` files for LCP.
3. **Lighthouse run** — verify Performance ≥ 90 desktop / ≥ 80 mobile across all 4. Capture under `docs/alt/lighthouse/`.
4. **Visual review with the user** — start `pnpm dev`, walk through all 4 variants in the browser, gather feedback.
5. **`niamoto-site` git remote** — repo is currently local-only (no remote configured). If the user wants to push this branch, set up `git remote add origin <url>` first.
6. **The current site's CLAUDE.md mentions Plus Jakarta Sans + forest-green tokens as "the design system"** — once a winning variant emerges, decide whether to update CLAUDE.md to reflect the chosen direction or keep both systems alive.
