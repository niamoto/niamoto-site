---
title: Niamoto Landing Alternatives — 4 Editorial Luxury variants
type: feat
date: 2026-04-15
brainstorm: docs/brainstorms/2026-04-15-niamoto-landing-alternatives-brainstorm.md
---

# Niamoto Landing Alternatives — 4 Editorial Luxury variants

> **Amendment 2026-04-15 (post-decision)**: PP Editorial New licence not held → **Fraunces** is used in V1 Atlas, V2 Field Journal and V4 Herbarium. Each variant tunes Fraunces' variable axes differently to stay distinct: V1 light + opsz 24 + italic accent; V2 semibold + opsz 144 + wonk 1 + soft 100; V4 black + opsz 144 + wonk 0 + soft 50. Neue Haas Grotesk (V4 body) → **Geist**. V3 Méthode unchanged (Cabinet Grotesk + Satoshi).

## Overview

Ship four standalone, production-grade landing page variants for niamoto.org under `/alt/*`. Each variant is a self-contained Astro page rendered bilingually (FR/EN), scoped to its own design tokens, and representative of a distinct direction in the Editorial Luxury family. Existing site pages (index, documentation, plugins, showcase) are not modified. The set doubles as a design exploration and as a portfolio of production-ready alternatives the user can pick from for the next niamoto.org iteration.

## Problem Statement

The current `src/pages/index.astro` is a competent, sober marketing page built on the "Niamoto Ecological" token system (Plus Jakarta Sans + forest-green palette). It is correct but safe. It under-delivers on two axes:

1. **Editorial gravity**: Niamoto is a 14-year scientific collaboration across 9 institutions (Province Nord/Sud, IRD, CIRAD, IAC, AMAP, Endemia, Herbier, OFB). The current landing reads like a generic open-source devtool, not like what it actually is: a published scientific framework with real portals running across three continents. The typographic register is too flat.

2. **Voice**: the project is bilingual by nature (the NC portal is in French, the community documentation is in English, the funders are francophone). A monolingual English landing forces non-anglophone stakeholders to translate before engaging.

The user wants to explore richer directions without committing the main page yet. Producing four distinct variants in a coherent family — rather than endlessly iterating on a single design — short-circuits the "which one should it be" debate by making all four real.

## Proposed Solution

Ship four isolated routes — `/alt/atlas`, `/alt/field-journal`, `/alt/methode`, `/alt/herbarium` — plus an index `/alt/` that compares them side-by-side. Each variant:

- Implements one `layout archetype` (Editorial Split, Z-Axis Cascade, Asymmetrical Bento) from the `high-end-visual-design` skill.
- Declares its own palette and typography via `[data-theme="…"]` CSS variables, remapping the Tailwind v4 theme tokens locally without touching `global.css`'s `@theme`.
- Ships bilingual content via Astro 5's native i18n router (`src/pages/{en,fr}/alt/*`).
- Reuses existing assets (`public/funders/*`, `public/showcase/nc-*.png`, botanical photos sourced from the NC portal).
- Runs Framer Motion interactions as leaf React islands hydrated with `client:visible`.
- Respects the full anti-AI-slop checklist from `design-taste-frontend` and `high-end-visual-design`.

No main-site page is modified. The four variants are additive and fully removable.

## Technical Approach

### Architecture

#### URL & file structure

```
src/
  pages/
    index.astro                      # unchanged (current landing, EN)
    documentation/index.astro        # unchanged
    plugins/index.astro               # unchanged
    showcase/nouvelle-caledonie.astro  # unchanged
    en/
      alt/
        index.astro                  # dispatcher (4 thumbnails + links, EN)
        atlas.astro                  # V1 EN
        field-journal.astro          # V2 EN
        methode.astro                # V3 EN
        herbarium.astro              # V4 EN
    fr/
      alt/
        index.astro                  # dispatcher FR
        atlas.astro                  # V1 FR
        field-journal.astro          # V2 FR
        methode.astro                # V3 FR
        herbarium.astro              # V4 FR

  layouts/
    BaseLayout.astro                 # unchanged
    AltLayout.astro                  # NEW: wraps IslandNav, GrainOverlay, data-theme attr, font preloads

  components/
    Header.astro                     # unchanged
    Footer.astro                     # unchanged
    (...)                            # existing components unchanged
    alt/
      shared/
        IslandNav.astro              # floating pill nav, FR/EN switch, variant-aware
        LanguageSwitch.astro         # uses astro:i18n getRelativeLocaleUrl()
        GrainOverlay.astro           # inline SVG feTurbulence, fixed, pointer-events-none
        DoubleBezel.astro            # outer shell + inner core wrapper
        ButtonInButton.astro         # nested pill CTA with trailing icon circle
        EyebrowTag.astro             # small-caps tracking-[0.2em] badge
        Stat.astro                   # tabular mono numbers + label
        FunderGrid.astro             # reworked FunderStrip: 50% opacity, hover lift
      atlas/
        HeroEditorialSplit.astro
        RegionList.astro             # numbered 01 · NC / 02 · Gabon-Cameroun / 03 · Guyane
        PillarGrid.astro             # Atlas-flavored pillars
        ClosingNote.astro
      field-journal/
        HeroLayered.astro            # Z-Axis cascade of rotated plates
        BotanicalPlate.astro         # single rotated photo card with specimen caption
        FieldNoteBlock.astro
      methode/
        HeroBento.astro
        TerminalCard.astro           # simulated shell with infinite typewriter
        LiveStatsCard.astro          # animated counters (isolated island)
        PortalMiniGrid.astro
      herbarium/
        HeroSplit.astro
        SpecimenFrame.astro          # double-bezel photo frame, sepia filter
        PlateSeries.astro
      motion/
        FadeUpOnView.tsx             # Framer Motion whileInView island
        MagneticButton.tsx           # useMotionValue/useTransform
        StaggeredReveal.tsx          # staggerChildren container
        InfiniteTypewriter.tsx       # for Méthode terminal card
        AnimatedCounter.tsx          # Méthode live stats

  styles/
    global.css                       # unchanged (existing @theme)
    alt/
      base.css                       # shared reset/typography/grain for all variants
      atlas.css                      # [data-theme="atlas"] { --color-canvas: …; --font-display: …; }
      field-journal.css              # [data-theme="field-journal"] { … }
      methode.css                    # [data-theme="methode"] { … }
      herbarium.css                  # [data-theme="herbarium"] { … }
      fonts.css                      # @font-face self-hosted declarations

  i18n/
    config.ts                        # locales, default, namespaces
    alt/
      atlas.fr.ts  atlas.en.ts
      field-journal.fr.ts  field-journal.en.ts
      methode.fr.ts  methode.en.ts
      herbarium.fr.ts  herbarium.en.ts
      shared.fr.ts  shared.en.ts     # nav items, common CTAs, install snippet

public/
  fonts/
    pp-editorial-new/                # self-hosted, woff2 variable
    fraunces/
    cabinet-grotesk/
    geist/
    satoshi/
    (JetBrains Mono already via Google Fonts in global.css — we can self-host later)
  showcase/
    nc-home.png                      # existing
    nc-taxons.png                    # existing
    botanical/                       # NEW: plates sourced from NC portal
      amborella-trichopoda.jpg
      parasitaxus-usta.jpg
      zygogynum-mackeei.jpg
      cryptocarya-barrabea.jpg
      hedycarya-rivularis.jpg
      stenocarpus-trinervis.jpg
```

#### Design token scoping (Tailwind v4)

The project's existing `@theme` in `src/styles/global.css` stays untouched. Per-variant tokens are declared in standard CSS selectors — this is the officially supported Tailwind v4 pattern for palette swaps.

```css
/* src/styles/alt/base.css */
@import "tailwindcss";
@import "./fonts.css";

@source "../../pages/en/alt/**/*.astro";
@source "../../pages/fr/alt/**/*.astro";
@source "../../components/alt/**/*.{astro,tsx}";
@source "../../layouts/AltLayout.astro";

/* Semantic tokens used across variants — remapped per data-theme below */
:where([data-theme]) {
  --c-canvas: #FFFFFF;
  --c-ink: #111111;
  --c-muted: #666666;
  --c-accent: #333333;
  --c-accent-alt: #555555;
  --c-surface: rgba(0, 0, 0, 0.02);
  --c-hairline: rgba(0, 0, 0, 0.08);
  --c-grain-opacity: 0.03;
  --f-display: "Geist", system-ui, sans-serif;
  --f-body: "Geist", system-ui, sans-serif;
  --f-mono: "JetBrains Mono", ui-monospace, monospace;
}

/* src/styles/alt/atlas.css */
[data-theme="atlas"] {
  --c-canvas: #FDFBF7;
  --c-ink: #121212;
  --c-muted: #6B6B66;
  --c-accent: #516B5A;           /* desaturated sage */
  --c-accent-alt: #A66B3B;       /* rust */
  --c-surface: rgba(18, 18, 18, 0.03);
  --c-hairline: rgba(18, 18, 18, 0.08);
  --c-grain-opacity: 0.028;
  --f-display: "Fraunces", Georgia, serif;
  --f-body: "Geist", system-ui, sans-serif;
  --fvs-display: "opsz" 24, "wght" 400, "WONK" 0, "SOFT" 50;
}

/* src/styles/alt/field-journal.css */
[data-theme="field-journal"] {
  --c-canvas: #F5EEE0;
  --c-ink: #0F0F0F;
  --c-muted: #6B5F4B;
  --c-accent: #3E5F45;           /* moss */
  --c-accent-alt: #B8633C;       /* terra */
  --c-surface: rgba(15, 15, 15, 0.04);
  --c-hairline: rgba(15, 15, 15, 0.1);
  --c-grain-opacity: 0.04;
  --f-display: "Fraunces", Georgia, serif;
  --f-body: "Plus Jakarta Sans", system-ui, sans-serif;
}

/* src/styles/alt/methode.css */
[data-theme="methode"] {
  --c-canvas: #1E2822;           /* dark sage */
  --c-ink: #E8E2D0;              /* parchment */
  --c-muted: #A8A194;
  --c-accent: #C08A3E;           /* ochre */
  --c-accent-alt: #7CA0A8;       /* cool steel */
  --c-surface: rgba(255, 255, 255, 0.04);
  --c-hairline: rgba(255, 255, 255, 0.1);
  --c-grain-opacity: 0.025;
  --f-display: "Cabinet Grotesk", system-ui, sans-serif;
  --f-body: "Satoshi", system-ui, sans-serif;
}

/* src/styles/alt/herbarium.css */
[data-theme="herbarium"] {
  --c-canvas: #1A1410;           /* espresso */
  --c-ink: #E8DCC8;              /* warm cream */
  --c-muted: #A89A84;
  --c-accent: #B87C4F;           /* copper */
  --c-accent-alt: #7A8B6F;       /* muted botanical green */
  --c-surface: rgba(232, 220, 200, 0.04);
  --c-hairline: rgba(232, 220, 200, 0.12);
  --c-grain-opacity: 0.045;
  --f-display: "Fraunces", Georgia, serif;
  --f-body: "Geist", system-ui, sans-serif;
  --fvs-display: "opsz" 144, "wght" 900, "WONK" 0, "SOFT" 50;
}
```

Utilities then read the tokens through Tailwind's arbitrary-value syntax or via utility classes bound to the CSS variables. Example components use `style="background: var(--c-canvas); color: var(--c-ink)"` or custom Tailwind utilities declared alongside the theme block. No pollution of the global `@theme` → no collision with existing pages.

#### i18n routing

Astro 5's native i18n API is configured:

```js
// astro.config.mjs
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";

export default defineConfig({
  site: "https://niamoto.org",
  vite: { plugins: [tailwindcss()] },
  integrations: [react()],
  build: { inlineStylesheets: "auto" },
  i18n: {
    defaultLocale: "en",
    locales: ["en", "fr"],
    routing: {
      prefixDefaultLocale: false,   // / and /en are the same; /fr/ is French
      redirectToDefaultLocale: false,
    },
    fallback: { fr: "en" },
  },
});
```

The existing non-`alt` pages (`src/pages/index.astro`, `documentation/`, `plugins/`, `showcase/`) sit at the root and serve as English. French equivalents are **not added** — they stay English-only. Only the `/alt/*` routes are bilingual, using helper `getRelativeLocaleUrl(locale, "alt/atlas")` to cross-link.

`src/pages/en/alt/*.astro` re-exports the same bodies as the FR versions via shared component composition — content differences come exclusively from i18n strings passed as props.

#### Framer Motion integration

Astro doesn't animate React components natively. We add `@astrojs/react` and import leaf islands. Each animation component is a small `.tsx` file hydrated with `client:visible` (not `client:load`) to avoid hydration on first paint for the hero. Spring physics baseline `{ type: "spring", stiffness: 100, damping: 20 }`. All animations use `transform` and `opacity` only. No GSAP, no ThreeJS for v1.

Rules from `design-taste-frontend` §3 Rule 5 and §4:
- Magnetic buttons use `useMotionValue` + `useTransform`, never `useState` for continuous motion.
- Perpetual motion isolated in `React.memo`'d leaf components.
- `<AnimatePresence>` wraps anything that mounts/unmounts.
- `whileInView` with `viewport: { once: true, margin: "-10%" }` for reveals, never `scroll` event listeners.

#### Fonts

Self-hosted in `public/fonts/*/` as `.woff2` variable files. `src/styles/alt/fonts.css` declares `@font-face` with `font-display: swap` and explicit `size-adjust` where the Fontshare metric matches the fallback. Preloaded via `<link rel="preload" as="font" …>` in `AltLayout.astro` for the variant's primary display + body faces only. Fallback stacks keep CLS near zero.

Licensing: PP Editorial New requires a Pangram Pangram licence — the user already owns or must purchase this before shipping V1/V4 to production. Fraunces (SIL OFL), Cabinet Grotesk (Fontshare free), Geist (SIL OFL), Satoshi (Fontshare free), Neue Haas Grotesk (Monotype licence — if unavailable, substitute Geist). **Action: verify licensing in Phase 1 before V1 kickoff.**

#### Motion/interaction contract

| Component | Archetype | Motion | Performance pin |
|---|---|---|---|
| IslandNav | Floating pill | Fade-down on mount; magnetic pull on hover | `client:load`, memoized, no re-render on scroll |
| GrainOverlay | Fixed SVG | Static | `position: fixed; inset: 0; pointer-events: none; z-index: 50; opacity: var(--c-grain-opacity)` |
| ButtonInButton | Nested pill | Hover: inner icon circle translate + scale; active: parent scale(0.98) | Pure CSS, no JS |
| FadeUpOnView | Section reveal | `translate-y-16 blur-md opacity-0` → resolved 800ms cubic-bezier(0.32,0.72,0,1) | `client:visible`, whileInView once |
| StaggeredReveal | Card grid | `staggerChildren: 0.08`, y-16 → 0, opacity 0 → 1 | Parent + children in same client tree |
| MagneticButton | CTA | `useMotionValue` on mouse delta, clamped to 6px | `React.memo`, no state |
| InfiniteTypewriter | Méthode terminal | Cycles through 4 prompts, shimmer loading | Isolated, will-change: transform |
| AnimatedCounter | Méthode stats | Number tween on intersect | Runs once, unmounts animation state |

### Implementation Phases

#### Phase 1 — Foundation

**Goal:** install dependencies, configure i18n, set up token scoping pattern, build shared components. No variant yet.

**Tasks:**

1. ~~Verify font licensing (PP Editorial New, Neue Haas Grotesk).~~ **Decided 2026-04-15: Fraunces substitutes PP Editorial New (V1, V2, V4); Geist substitutes Neue Haas Grotesk (V4 body).** All chosen fonts are SIL OFL or Fontshare-free. No commercial licence to acquire.
2. Install dependencies: `pnpm add @astrojs/react react@^19 react-dom@^19 framer-motion@^12 @phosphor-icons/react` and `pnpm add -D @types/react @types/react-dom`.
3. Add `@astrojs/react` integration to `astro.config.mjs`.
4. Configure i18n block in `astro.config.mjs` per "i18n routing" section above.
5. Create `src/i18n/config.ts` with locales constant + type.
6. Create `src/i18n/alt/shared.fr.ts` and `.en.ts` with nav labels, FR/EN switch label, common CTAs, install snippet, legal line.
7. Download and place self-hosted `.woff2` variable font files under `public/fonts/`.
8. Write `src/styles/alt/fonts.css` with `@font-face` declarations and `size-adjust` values.
9. Write `src/styles/alt/base.css` with `@import "tailwindcss"`, explicit `@source` lines per `niamoto-site/CLAUDE.md` gotcha, semantic token defaults, and `@import` of the 4 variant files.
10. Write `src/styles/alt/{atlas,field-journal,methode,herbarium}.css` with the exact token values from the Architecture section.
11. Build `src/layouts/AltLayout.astro` accepting `theme`, `locale`, `pageTitle`, `pageDescription` props; emits `<html lang={locale}>`, `<body data-theme={theme}>`, preloads variant fonts, includes `GrainOverlay`, renders `IslandNav` and the child slot. **Critically**: neutralise the global `html { font-family: var(--font-display); }` and `h1, h2, h3 { letter-spacing: -0.02em; }` rules from `src/styles/global.css:47-66` via a `<style is:global>` block scoped to `[data-theme]` that re-asserts `font-family: var(--f-display) / var(--f-body)` and resets `letter-spacing` (each variant decides its own per `--ls-display`). Without this, every variant would inherit Plus Jakarta Sans on `html` and the typography would silently fail.
12. Build shared components in `src/components/alt/shared/`:
    - `IslandNav.astro` — floating pill using CSS variables, embeds `LanguageSwitch.astro`.
    - `LanguageSwitch.astro` — uses `getRelativeLocaleUrl` from `astro:i18n` to swap FR/EN while preserving path.
    - `GrainOverlay.astro` — inline SVG with `feTurbulence baseFrequency="0.9"` + `feColorMatrix`, no network request.
    - `DoubleBezel.astro` — outer shell + inner core slots with concentric radii via `--radius-outer` / `--radius-inner` calc.
    - `ButtonInButton.astro` — pill CTA with optional trailing icon circle, supports `variant: primary | secondary`.
    - `EyebrowTag.astro`, `Stat.astro`, `FunderGrid.astro`.
13. Build motion islands in `src/components/alt/motion/`:
    - `FadeUpOnView.tsx`, `StaggeredReveal.tsx`, `MagneticButton.tsx`, `InfiniteTypewriter.tsx`, `AnimatedCounter.tsx`.
    - All memoized, all use `client:visible` (except `MagneticButton` → `client:load`).
14. Smoke test: `pnpm build` passes `astro check`; `pnpm dev` renders `/alt/` as a placeholder page.

**Deliverables:**
- `astro.config.mjs` updated
- `src/i18n/` populated
- `src/styles/alt/*` populated
- `src/layouts/AltLayout.astro`
- `src/components/alt/shared/*` (8 files)
- `src/components/alt/motion/*` (5 files)
- `public/fonts/` populated
- Pseudocode smoke page `src/pages/en/alt/index.astro` with only `<AltLayout theme="atlas">hello</AltLayout>` to verify wiring

**Success criteria:**
- [ ] `pnpm build` exits 0 with no type errors.
- [ ] `/alt/` and `/fr/alt/` render with the correct grain overlay and font loading on both.
- [ ] Lighthouse LCP ≤ 2.5s on a cold load of the smoke page.
- [ ] FR/EN switch preserves the path.
- [ ] All 4 variant CSS files scope correctly (manual DOM inspection of `[data-theme]` attr).

**Estimated effort:** 1.5 days.

#### Phase 2 — V1 Atlas (cream light / sage / rust)

**Goal:** first full variant. Registre revue scientifique accessible.

**Tasks:**

1. Write `src/i18n/alt/atlas.fr.ts` and `.en.ts` with full copy:
   - Eyebrow: `OPEN ECOLOGY · SINCE 2012`
   - Hero headline EN: *From the field / to the forest / we can share.* (italic on "share")
   - Hero headline FR: *Des données de terrain / au portail partagé.* (italic on "partagé")
   - Sub: 2 lines max, concrete.
   - Region list: 01 · NC / 02 · Gabon-Cameroun / 03 · Guyane, each with status + stat + partner line.
   - Three pillars: Import / Transform / Publish, each with a 1-sentence body + code snippet.
   - Closing: Apache 2.0, maintained by Arsis, partner strip.
2. Build variant components in `src/components/alt/atlas/`:
   - `HeroEditorialSplit.astro` — 50/50 grid, display type 72-96px on left, `RegionList` embedded on right.
   - `RegionList.astro` — numbered list with silhouettes (reuse existing `RegionCard`'s SVG silhouettes, extracted), stats in `font-mono tabular-nums`.
   - `PillarGrid.astro` — 3 columns but **anti-slop**: no uniform cards; use `border-t` dividers instead of container shadows (per `design-taste-frontend` §3 Rule 4). Each pillar gets a small icon (Phosphor `Database`, `Stack`, `Globe`, stroke 1.5) and a code snippet where relevant.
   - `ClosingNote.astro` — centered manifesto paragraph + Apache 2.0 + GitHub CTA + FunderGrid.
3. Assemble `src/pages/en/alt/atlas.astro` and `src/pages/fr/alt/atlas.astro` using `AltLayout theme="atlas"`.
4. Add 3 page-level motion effects:
   - FadeUp on hero (300ms delay).
   - StaggeredReveal on RegionList (200ms cascade).
   - FadeUp on each section title.
5. Desktop + mobile review: verify collapse below 768px (`w-full px-4`), verify no `h-screen`, verify min-h-[100dvh].
6. Accessibility pass: keyboard focus rings (visible, not suppressed), alt text on silhouettes, `lang` attr, `aria-current` on active nav.

**Deliverables:**
- `src/pages/en/alt/atlas.astro`, `src/pages/fr/alt/atlas.astro`
- `src/components/alt/atlas/*.astro` (4 files)
- `src/i18n/alt/atlas.{en,fr}.ts`
- Screenshot in PR body

**Success criteria:**
- [ ] Hero renders with PP Editorial New (or substituted Fraunces) variable, italic partial on final word.
- [ ] Font Lighthouse LCP ≤ 2.5s on 3G Fast.
- [ ] No Cumulative Layout Shift > 0.05.
- [ ] FR and EN versions render identical layout with locale-specific copy.
- [ ] Mobile at 375px: single column, stats readable, no horizontal scroll.
- [ ] Colour contrast AAA on body text, AA on large display.
- [ ] Variant passes the Pre-Flight Checklist (Section 8 of `high-end-visual-design`).

**Estimated effort:** 1 day.

#### Phase 3 — V2 Field Journal (cream warm / moss / terra)

**Goal:** naturalist fieldnotes vibe. Photos, handwritten-adjacent typography, layered depth.

**Tasks:**

1. Source 3-4 botanical photos from the NC portal (we have PNG paths): *Amborella trichopoda*, *Parasitaxus usta*, *Zygogynum mackeei*. Crop to 1200x1600 portrait, export as WebP + AVIF fallback.
2. Write `src/i18n/alt/field-journal.{en,fr}.ts`:
   - Hero FR: *En paicî, nâ mötö. / La forêt.* (étymologie)
   - Hero EN: *Mötö, in paicî. / The forest.* (same structure, one-word retention)
   - Field note excerpts (200-300 chars each, written in-voice as a field ecologist), with mock collection numbers (`NC-0847-AM`, `NC-1123-PU`).
   - Closing note on 2,713 endemics / Grande Terre / 5,400 km².
3. Build variant components in `src/components/alt/field-journal/`:
   - `HeroLayered.astro` — Z-Axis cascade: 3 `BotanicalPlate` cards with rotations `-2deg`, `+3deg`, `-1deg` and staggered z-index; display serif title overlaid in the negative space. Mobile: cascade collapses to vertical stack, rotations → 0.
   - `BotanicalPlate.astro` — single photo with handwritten-adjacent caption block, specimen name italic, collection number mono, 1px hairline frame using `DoubleBezel`.
   - `FieldNoteBlock.astro` — left-aligned paragraph with drop cap on display serif, italic specimen names inline.
4. Assemble `src/pages/{en,fr}/alt/field-journal.astro`.
5. Motion: StaggeredReveal on plates with slight rotation drift on mount (0 → target rotation). FadeUp on field notes. No magnetic hover on plates (rotation conflict).
6. Cross-linking: add quiet link to atlas & methode in the footer-equivalent closing.

**Deliverables:**
- `src/pages/{en,fr}/alt/field-journal.astro`
- `src/components/alt/field-journal/*.astro` (3 files)
- `src/i18n/alt/field-journal.{en,fr}.ts`
- WebP/AVIF plates under `public/showcase/botanical/`

**Success criteria:**
- [ ] Hero photo cascade renders with smooth stagger; mobile collapses cleanly.
- [ ] Fraunces variable with `wonk: 1` and `softness` slight on hero.
- [ ] Total image weight ≤ 450 KB per page (3 plates, AVIF preferred).
- [ ] Photo `alt` text describes the species in the viewer's locale.
- [ ] Mobile below 768px: rotations neutralised, single column.
- [ ] LCP ≤ 2.5s despite photo hero.

**Estimated effort:** 1 day.

#### Phase 4 — V3 Méthode (dark sage / parchment / ochre)

**Goal:** devtool premium, Linear-core aesthetic translated into the science world. Bento + live stats + terminal.

**Tasks:**

1. Write `src/i18n/alt/methode.{en,fr}.ts`:
   - Hero EN: *Ecological data. / Publishable portals.* (grotesk 96px)
   - Hero FR: *Données écologiques. / Portails publiables.*
   - Bento card titles/bodies.
   - Terminal prompts: 4 realistic `niamoto` invocations cycling (install, init, run, publish).
2. Build variant components in `src/components/alt/methode/`:
   - `HeroBento.astro` — asymmetric CSS Grid (`grid-cols-12`), left column (cols 1-7) holds display type + CTA; right (cols 8-12) is the bento cluster:
     - Row 1 (cols 8-12): `TerminalCard` spanning.
     - Row 2 col 8-10: `LiveStatsCard`.
     - Row 2 col 11-12: 2 mini region cards stacked.
   - `TerminalCard.astro` — double-bezel container; inner core is a dark terminal look; imports `InfiniteTypewriter.tsx` island that cycles prompts with blinking caret and shimmer on "processing".
   - `LiveStatsCard.astro` — 4 stats in a 2x2 grid: `1,208 taxa`, `5,400 km²`, `509 plots`, `70,000+ trees`. Import `AnimatedCounter.tsx` which tweens numbers when card enters viewport.
   - `PortalMiniGrid.astro` — 3 mini cards for NC / Gabon-Cameroun / Guyane with the existing silhouettes, active/upcoming pill.
3. Assemble `src/pages/{en,fr}/alt/methode.astro`.
4. Motion:
   - Hero: FadeUp with 200ms delay, tracking-tighter emphasis animates from `tracking-normal` to `tracking-tighter` over 600ms.
   - Bento: StaggeredReveal 120ms cascade, scale 0.98 → 1.
   - `MagneticButton` on the primary CTA.
   - Perpetual: typewriter loop, counters run once then static, status dots pulse.
5. Dark mode is the only mode — add `color-scheme: dark` meta. Verify contrast on parchment body text over dark sage ≥ AAA.

**Deliverables:**
- `src/pages/{en,fr}/alt/methode.astro`
- `src/components/alt/methode/*.astro` (4 files)
- `src/components/alt/motion/InfiniteTypewriter.tsx`, `AnimatedCounter.tsx` if not built in Phase 1
- `src/i18n/alt/methode.{en,fr}.ts`

**Success criteria:**
- [ ] Bento layout passes the `high-end-visual-design` §2 anti-pattern check (no symmetrical 3-column).
- [ ] Terminal typewriter never freezes on tab blur (throttle when `document.hidden`).
- [ ] Stats counter runs exactly once per viewport entry, no re-runs on re-enter.
- [ ] Double-bezel visible on all cards: outer shell + concentric inner radius.
- [ ] CTA magnetic hover works on pointer devices, respects `@media (hover: hover)` gate, no-op on touch.
- [ ] Contrast check passes on all text.

**Estimated effort:** 1.5 days.

#### Phase 5 — V4 Herbarium (espresso / cream / copper)

**Goal:** living digital herbarium, museum-grade gravity. Serif heavy display + sepia specimen + layered composition.

**Tasks:**

1. Produce the hero specimen frame: pick *Amborella trichopoda* photo, apply sepia/parchment filter at build time (CSS only: `filter: sepia(0.3) saturate(0.8) contrast(1.05)`), wrap in `DoubleBezel` with copper hairline.
2. Write `src/i18n/alt/herbarium.{en,fr}.ts`:
   - Hero FR: *Un herbier vivant, / ouvert.* (serif heavy 120px)
   - Hero EN: *A living herbarium, / open.*
   - Plate series captions (species name, family, endemic status, observation count).
   - Closing note on open data ethics + Apache 2.0 + partner strip.
3. Build variant components in `src/components/alt/herbarium/`:
   - `HeroSplit.astro` — Editorial Split 55/45, display serif heavy on left, full-bleed specimen frame on right. Button-in-button CTA with copper accent.
   - `SpecimenFrame.astro` — reusable double-bezel photo frame, sepia, caption below in small caps + JBM mono collection number.
   - `PlateSeries.astro` — 4 specimen frames in a 2x2 grid (desktop) / 1 col (mobile), staggered reveal, hover spotlight border.
4. Nav: use `IslandNav` with `theme="herbarium"` so pill becomes `bg-[rgba(232,220,200,0.05)] backdrop-blur-2xl` glass variant. Hamburger fluid morph reveal on mobile per `high-end-visual-design` §5.A.
5. Assemble `src/pages/{en,fr}/alt/herbarium.astro`.
6. Motion:
   - FadeUp + blur resolve on hero (1000ms, heavier easing).
   - StaggeredReveal on plate series, 100ms cascade.
   - Spotlight border on specimen hover (CSS only: `--mouse-x / --mouse-y` via `onmousemove` script, scoped).

**Deliverables:**
- `src/pages/{en,fr}/alt/herbarium.astro`
- `src/components/alt/herbarium/*.astro` (3 files)
- `src/i18n/alt/herbarium.{en,fr}.ts`

**Success criteria:**
- [ ] Sepia filter renders consistently across Chrome/Safari/Firefox.
- [ ] Hero LCP specifically: serif display + specimen image both within 2.5s on 3G Fast.
- [ ] Mobile nav hamburger morphs to X with rotate transforms (not disappear-reappear).
- [ ] Plate series hover states work on pointer, gracefully degrade on touch.
- [ ] Contrast passes on all text.

**Estimated effort:** 1 day.

#### Phase 6 — Dispatcher & Review pass

**Goal:** `/alt/` index comparing the 4 variants, plus a thorough review pass.

**Tasks:**

1. Build `src/pages/{en,fr}/alt/index.astro` — a sober index with 4 cards (one per variant), each showing:
   - Codename (Atlas / Field Journal / Méthode / Herbarium).
   - One-line description in the variant's primary font + palette (small preview tile).
   - Palette swatches (4 colour chips).
   - Link "View →".
   - The dispatcher itself is styled in neutral Geist / cream; it doesn't compete with the variants.
2. Add OG images for each variant (use `satori` or a static generator — or handcraft 4 PNGs — decide in implementation).
3. Cross-link from main `src/pages/index.astro`: add a discreet footer line "Explore alternative designs → /alt/" (tiny, low-emphasis). Only change to the existing site.
4. Run the full Pre-Flight Checklist from `high-end-visual-design` §8 and `design-taste-frontend` §10 across all 4 variants.
5. Run Lighthouse on each variant (desktop + mobile). Target all greens (Perf ≥ 90, A11y ≥ 95, BP 100, SEO 100).
6. Write `docs/alt/REVIEW.md` — a variant-by-variant strengths/weaknesses audit with recommendations.
7. Have the user test all 4 on their real browser, gather feedback.

**Deliverables:**
- `src/pages/{en,fr}/alt/index.astro`
- OG images (`public/alt/og/*.png`)
- One-line footer update in `src/pages/index.astro`
- `docs/alt/REVIEW.md`
- Lighthouse reports (4 × 2 = 8 runs) saved under `docs/alt/lighthouse/`

**Success criteria:**
- [ ] Dispatcher renders all 4 variants with accurate previews.
- [ ] Every variant Lighthouse Perf desktop ≥ 90, mobile ≥ 80.
- [ ] A11y ≥ 95 on all.
- [ ] Cross-linking: all nav interactions preserve locale (`getRelativeLocaleUrl`).
- [ ] User-observed impression: the 4 variants read as 4 distinct designs, not as 4 palette swaps of the same page.

**Estimated effort:** 1 day.

**Total estimated effort:** 6-7 days of focused implementation.

## Alternative Approaches Considered

### A. Redesign the main `index.astro` directly (rejected)

Tempting. Saves infrastructure. Rejected because:
- High commitment, low exploration. One design wins with no comparison.
- Risk of regression on SEO / social shares if we A/B swap.
- The user explicitly asked for *"plusieurs pages de landing"* → plural mandatory.

### B. Add 4 variants as Astro routes within the existing page (query string or section anchors) (rejected)

Smaller diff. Rejected because:
- Token scoping through the existing `@theme` would pollute the main page or force wrapper classes everywhere.
- i18n gets messy if the existing page stays English while variants are bilingual.
- Harder to Lighthouse individually.
- Defeats the point of isolation.

### C. Only 2 variants (one light, one dark) (rejected by user)

User explicitly chose "exploration large" → 4 variants.

### D. Inline all CSS per variant (no shared `base.css`) (rejected)

Duplicates grain, nav, language switch, font-face. Rejected for maintenance.

### E. Use Astro Content Collections for variant copy (deferred)

Would give type-safety and FM in markdown. Cleaner long-term. Rejected for v1 because shared `.ts` modules keep the mental model simpler and make the copy easier to diff-review. **Future consideration** if we keep 1+ variants and iterate.

## Acceptance Criteria

### Functional Requirements

- [ ] `/alt/{atlas,field-journal,methode,herbarium}/` routes render successfully in both `/en/` and `/fr/` locales.
- [ ] `/alt/` (and `/fr/alt/`) index page lists the 4 variants with correct preview styling.
- [ ] Language switch in nav toggles between FR ↔ EN preserving the current variant path.
- [ ] Install snippet `pip install niamoto` is copyable via a button on every variant's hero.
- [ ] All Phosphor icons render at stroke 1.5, no Lucide defaults anywhere in `/alt/*`.
- [ ] FunderGrid shows the 9 existing partner logos at 50% opacity, lifting on hover.
- [ ] Existing site pages (`/`, `/documentation`, `/plugins`, `/showcase/*`) continue to build and render identically to pre-change.

### Non-Functional Requirements

- [ ] Lighthouse Performance desktop ≥ 90 on all 4 variants; mobile ≥ 80.
- [ ] Lighthouse Accessibility ≥ 95 on all 4.
- [ ] Lighthouse Best Practices = 100, SEO = 100.
- [ ] LCP ≤ 2.5s on 3G Fast; CLS ≤ 0.05; INP ≤ 200ms.
- [ ] Total transferred weight per variant ≤ 750 KB (including images, fonts, JS).
- [ ] Zero layout shift from font loading (verify via `size-adjust` or `font-display: optional` for non-critical faces).
- [ ] `pnpm build` completes in under 15s cold.
- [ ] Zero type errors (`astro check` green).
- [ ] No console errors or warnings in any variant.

### Quality Gates

- [ ] Anti-slop checklist (`high-end-visual-design` §8) passes on every variant.
- [ ] Anti-slop checklist (`design-taste-frontend` §10) passes on every variant.
- [ ] No `Inter`, no `h-screen`, no pure `#000`, no 3-equal-card row, no AI-purple gradient anywhere under `/alt/*`.
- [ ] No emoji in any content, alt text, or code (per `design-taste-frontend` §2).
- [ ] No `window.addEventListener('scroll')` anywhere — `IntersectionObserver` or `whileInView` only.
- [ ] All animations use `transform` and `opacity` only. No `top`, `left`, `width`, `height` animations.
- [ ] `backdrop-blur` only on fixed/sticky elements (nav pill), never on scrolling containers.
- [ ] All interactive elements have visible `:focus-visible` rings.
- [ ] Every image has descriptive `alt`; no `alt=""` or `alt="image"`.
- [ ] `<main>`, `<nav>`, `<section>`, `<article>` used semantically; no div soup.
- [ ] Grain overlay applied exclusively to a fixed pseudo-element or div, `pointer-events: none`.
- [ ] Every variant passes a keyboard-only navigation audit (tab through, Enter activates, Esc closes any open state).
- [ ] Reduced-motion respected: `@media (prefers-reduced-motion: reduce)` disables all perpetual animations, reduces transitions to ≤ 50ms.

## Success Metrics

**Short-term (within 2 weeks of deploy):**
- User chooses one of the 4 variants (or cherry-picks elements) as the basis for the next niamoto.org iteration.
- Partner stakeholders (IRD, CIRAD, province reps) give qualitative feedback on the chosen variant.

**Medium-term (within 2 months):**
- Chosen variant (or derivative) becomes the main `index.astro`.
- Bounce rate on landing ≤ previous baseline (monitor in Plausible/Umami, whichever is set up).

**Indirect quality signal:**
- Time-to-first-install-command-copy (a proxy for conversion clarity) is measured on the new design. Baseline to be captured on the current design during Phase 1.

## Dependencies & Prerequisites

### External dependencies

- Astro 5.6+ (✅ already on 5.6.0).
- Tailwind v4.0+ (✅ already on 4.0.0).
- `@astrojs/react` (to install).
- `react` 19 + `react-dom` 19 (to install).
- `framer-motion` 12+ (to install).
- `@phosphor-icons/react` (to install).
- `@astrojs/check` (✅ already).

### Licensing

- **PP Editorial New** — Pangram Pangram commercial licence required. Confirm with user in Phase 1 before shipping V1/V4. Fallback: Fraunces.
- **Cabinet Grotesk** — Fontshare free ✅.
- **Neue Haas Grotesk** — Monotype licence required. Fallback: Geist.
- **Fraunces** — SIL OFL ✅.
- **Geist** — SIL OFL ✅.
- **Satoshi** — Fontshare free ✅.

### Asset sourcing

- Botanical photos: reuse from NC portal. Confirm rights for public display on niamoto.org (likely already cleared since they're on the public portal, but worth confirming with AMAP / IAC).
- Partner logos: already present in `public/funders/` and `public/funders/manifest.yaml`.

### Stack compatibility

- Tailwind v4 `@source` explicit subdirs gotcha (documented in `niamoto-site/CLAUDE.md`) applies → every new directory under `src/` needs an explicit `@source` line.
- Astro 5 i18n is native; no plugin needed.

## Risk Analysis & Mitigation

| Risk | Severity | Probability | Mitigation |
|---|---|---|---|
| PP Editorial New licence not held | High | Medium | Phase 1 gate: verify, substitute with Fraunces if not. Flag in this plan. Document in REVIEW.md. |
| Framer Motion hydration blows budget on LCP | High | Low-Medium | All motion islands `client:visible`, never `client:load` except the small nav. Memoize all perpetual motion. Measure per-variant with Lighthouse Phase 6. |
| Variable fonts cause CLS > 0.05 | Medium | Medium | `size-adjust` in `@font-face`; critical face preloaded; fallback stack with matched x-height. Verify in Phase 1 smoke test. |
| `@source` explicit subdirs gotcha produces empty CSS | Medium | Low | User already documented this in CLAUDE.md. Explicit `@source` for every new directory in `src/styles/alt/base.css` AND add `@source "../pages/en/alt/**/*.astro"` + `@source "../pages/fr/alt/**/*.astro"` + `@source "../components/alt/**/*.astro"` lines to `src/styles/global.css` so global utilities still pick up classes used in the variants. Verify in Phase 1 smoke test. |
| Global `html { font-family: var(--font-display) }` and `h1, h2, h3 { letter-spacing: -0.02em }` rules in `global.css:47-66` leak into variants | High | High (without explicit fix) | `AltLayout.astro` includes a `<style is:global>` block that re-asserts `font-family` on `[data-theme]` and resets `letter-spacing` to per-variant `--ls-display`. Verify by inspecting computed style on a hero `<h1>` in Phase 1 smoke test — it must read PP Editorial New / Fraunces / Cabinet Grotesk per variant, not Plus Jakarta Sans. |
| Tailwind utilities don't pick up `--c-canvas` tokens in `[data-theme]` | Medium | Low | Use `style={…}` + CSS variables directly or declare custom utilities in `@layer utilities`. Verify in Phase 1. |
| Dark variants (V3 Méthode, V4 Herbarium) contrast fails AAA on body | Medium | Low-Medium | Lock token values that pass AAA at design time (already calibrated); re-verify with Lighthouse A11y. |
| Botanical photo rights unclear | Medium | Low | Pre-flight: confirm with the user before shipping V2 and V4. Fall back to abstract plant illustrations if unclear. |
| Existing `global.css` `@source` shorthand regresses | Low | Low | Don't touch `src/styles/global.css`. Verify `pnpm build` against main branch in CI. |
| Reduced-motion users see broken layouts | Low | Low | Test `@media (prefers-reduced-motion: reduce)` path explicitly in Phase 6. |
| Framer Motion bundle > 45KB gzipped breaks perf budget | Low | Low | Code-split per-island; use `framer-motion/dom` entrypoint if available; measure in Phase 6. |

## Resource Requirements

- **Developer time:** 6-7 days of focused implementation (1 person).
- **Design review time:** 1-2 rounds with the user at phase boundaries 2, 4, 6.
- **No infrastructure changes.** Shipping through the existing Coolify deploy (Astro static build → Caddy). Same Dockerfile.
- **No new third-party services.** All fonts self-hosted, all images already owned.

## Future Considerations

- **Astro Content Collections for variant copy** — type-safe, markdown-editable, collaboration-friendly. Migrate after v1 settles.
- **Visual regression testing** — add `@lost-pixel/lost-pixel` or Percy once a variant is chosen, to guard against future typographic regressions.
- **inference.sh integration** — the `landing-page-design` skill references `infsh` for AI-generated hero imagery. Not used in v1 (authentic botanical photos win). Could generate texture plates or abstract region silhouettes in v2.
- **Converting a variant to main** — when the user picks a winner, the migration path is: (1) move `src/styles/alt/<winner>.css` tokens into `src/styles/global.css @theme`, (2) copy the variant's page body to `src/pages/index.astro`, (3) retire `src/pages/en/alt/<winner>.astro`. Keep the 3 unpicked variants under `/alt/` as design archive.
- **A/B testing** — post-migration, the runner-up can live under `/alt/<runner-up>/` as a perma-alternative for qualitative feedback.
- **Accessibility upgrade** — consider dyslexia-friendly mode toggle (swap Fraunces for OpenDyslexic) and high-contrast mode toggle on the winner.

## Documentation Plan

- [ ] `docs/brainstorms/2026-04-15-niamoto-landing-alternatives-brainstorm.md` already written.
- [ ] `docs/plans/2026-04-15-feat-niamoto-landing-alternatives-plan.md` = this doc.
- [ ] `docs/alt/README.md` — explains what `/alt/` is, how to edit variant copy, how to add a new variant.
- [ ] `docs/alt/REVIEW.md` — Phase 6 deliverable.
- [ ] Update `niamoto-site/CLAUDE.md` Structure section to mention `/alt/` routes and `src/styles/alt/*` scope.
- [ ] Update `niamoto-site/CLAUDE.md` Stack section to list the new dependencies (React 19, Framer Motion 12, Phosphor Icons).

## References & Research

### Internal references

- Brainstorm: [docs/brainstorms/2026-04-15-niamoto-landing-alternatives-brainstorm.md](../brainstorms/2026-04-15-niamoto-landing-alternatives-brainstorm.md)
- Existing landing: `src/pages/index.astro:1-346`
- Existing tokens: `src/styles/global.css:1-66`
- Existing components (reusable): `src/components/FunderStrip.astro`, `src/components/RegionCard.astro`, `src/components/NiamotoLogo.astro`
- Existing portal style reference: `http://localhost:5173/api/site/preview-exported/fr/index.html` (Niamoto GUI preview of exported NC portal)
- Project conventions: `niamoto-site/CLAUDE.md`
- Workspace conventions: `/Users/julienbarbe/Dev/CLAUDE.md`
- Skills applied:
  - `/Users/julienbarbe/.agents/skills/high-end-visual-design/SKILL.md` — vibe & layout archetypes, double-bezel, motion choreography.
  - `/Users/julienbarbe/.agents/skills/design-taste-frontend/SKILL.md` — bias correction rules, AI tell avoidance, perpetual motion engine.
  - `/Users/julienbarbe/.agents/skills/redesign-existing-projects/SKILL.md` — audit and upgrade methodology.

### External references

- [Astro 5 i18n docs](https://docs.astro.build/en/guides/internationalization/) — locale routing, `getRelativeLocaleUrl`, `prefixDefaultLocale`.
- [Astro i18n recipe](https://docs.astro.build/en/recipes/i18n/) — full bilingual setup pattern.
- [Internationalization (i18n) in Astro 5 — Paul Pietzko, Medium 2026](https://medium.com/@paul.pietzko/internationalization-i18n-in-astro-5-78281827d4b4)
- [Astro + Framer Motion integration — The Valley of Code](https://thevalleyofcode.com/lesson/astro-integrations/adding-react-framer-motion-animations-to-an-astro-site/)
- [astro-base starter (React + Framer Motion + Tailwind) — jonnysmillie](https://github.com/jonnysmillie/astro-base) — reference for the islands pattern.
- [Tailwind v4 theme variables](https://tailwindcss.com/docs/theme) — `@theme` + CSS variables pattern.
- [Design Tokens That Scale in 2026 (Tailwind v4 + CSS Variables) — Mavik Labs](https://www.maviklabs.com/blog/design-tokens-tailwind-v4-2026/) — scoped tokens via selectors.
- [Scoped Color Tokens in Tailwind v4 — GitHub Discussion #16111](https://github.com/tailwindlabs/tailwindcss/discussions/16111) — official guidance on per-selector token remapping.
- [PP Editorial New font pairings](https://maxibestof.one/typefaces/editorial-new) — inspiration and fallback alternatives.
- [Fraunces on Google Fonts / Undercase Type](https://fonts.google.com/specimen/Fraunces) — variable axes including `wonk` and `softness`.
- [Cabinet Grotesk on Fontshare](https://www.fontshare.com/fonts/cabinet-grotesk) — free variable font download.

### Related work

- None yet on this repo. First implementation plan.

## Edge Cases & Cross-Cutting Concerns

- **JavaScript disabled** — All variants render the full hero, copy, partner strip, and CTAs with zero JS. Framer Motion enhancements degrade to static end-states (`<noscript>` not required; the SSR output is the end-state with motion classes removed by the absence of hydration).
- **`prefers-reduced-motion: reduce`** — `AltLayout.astro` injects a global `@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }` and motion islands check `useReducedMotion()` from Framer Motion to skip perpetual animations entirely.
- **`prefers-color-scheme`** — V1 Atlas and V2 Field Journal are light-only (set `color-scheme: light` meta). V3 Méthode and V4 Herbarium are dark-only (set `color-scheme: dark` meta on the `AltLayout` when `theme` is `methode` or `herbarium`). No automatic light/dark swap — variants are intentional aesthetic choices, not theme toggles.
- **SEO per variant** — Each variant defines unique `<title>`, `<meta description>`, `og:image`, `og:title`, `og:description`. Locale-tagged via `<link rel="alternate" hreflang="fr" href="…">` and `hreflang="en"`. `sitemap.xml` includes all 8 variant URLs (4 × 2 locales) plus the dispatcher index.
- **`robots.txt`** — `/alt/` indexable by default. If the user prefers to keep them off search engines until promoted to main, add `Disallow: /alt/` decision in Phase 6.
- **TypeScript path alias** — `tsconfig.json` already extends `astro/tsconfigs/strict` with `@/*` → `src/*` alias. All new files under `/alt/*` use this alias for imports (`import IslandNav from "@/components/alt/shared/IslandNav.astro"`).
- **`@source` lines in `global.css`** — When creating `src/pages/en/alt/`, `src/pages/fr/alt/`, and `src/components/alt/` directories, add explicit `@source` lines to `src/styles/global.css` (per the project gotcha) so Tailwind utilities used in variant pages are still picked up by the global build. The alt-only base.css *also* declares its own `@source` lines for variant-only utilities.
- **Variant cross-linking** — Each variant footer links to the other 3 in a small "Other directions" row. Helps the user (and reviewers) compare without going back to `/alt/`.
- **`niamoto-site/CLAUDE.md` golden rule conflict** — The current CLAUDE.md says "no emojis, no gradient text, no revolutionary language". This plan respects all three. Where the rules conflict (e.g. CLAUDE.md mandates Plus Jakarta Sans), the brainstorm explicitly suspended typography rules for `/alt/*` only — `global.css` and the rest of the site stay bound by CLAUDE.md.

## Open questions resolved in this plan

The 6 open questions from the brainstorm:

1. **Bilingual routing shape**: resolved → `/alt/X` (EN default) and `/fr/alt/X` (French), using Astro 5's `prefixDefaultLocale: false` + explicit `src/pages/{en,fr}/` folders.
2. **Font loading strategy**: resolved → self-hosted `.woff2` variable, preloaded per-variant in `AltLayout.astro`, `size-adjust` in `@font-face`, `font-display: swap`.
3. **Framer Motion in Astro**: resolved → `@astrojs/react` integration, leaf `.tsx` islands hydrated with `client:visible` (nav is `client:load`).
4. **Grain texture**: resolved → inline SVG `feTurbulence` in `GrainOverlay.astro`, applied to fixed `pointer-events-none` overlay with variant-controlled `opacity` via CSS variable.
5. **Live portal embed (V3 optional)**: **not shipped in v1**. Too heavy (CSP, loading budget, cross-origin state). V3 Méthode uses static stats with animated counters instead. Can be revisited post-v1.
6. **Entry page at `/alt/`**: resolved → sober dispatcher listing 4 variants with palette swatches and one-line descriptions, no hero.
