# Niamoto Landing Alternatives — Brainstorm

**Date:** 2026-04-15
**Status:** Design validated, ready for implementation plan
**Scope:** 4 alternative landing pages for niamoto.org, coexisting with the current `index.astro` and the rest of the site (documentation, plugins, showcase pages untouched)
**Stack (locked):** Astro 5.x + Tailwind v4 + TypeScript strict + pnpm (per project `CLAUDE.md`)
**Design rules (overridden for this work):** Typography, palette and composition rules from `niamoto-site/CLAUDE.md` are **not** binding. The current "Niamoto Ecological" design tokens remain in `global.css` for the existing pages; alternatives introduce their own token scopes.

---

## What We're Building

Four standalone landing page variants, each a self-contained `.astro` route under `/alt/*`, all in the **Editorial Luxury** family (from `high-end-visual-design` skill) but with distinct identities. The objective is an exploration of directions for a future niamoto.org refresh — the user will pick a winner or cannibalise across variants.

### The four variants

| ID  | Codename       | Palette family        | Typography                                              | Layout archetype           | Narrative angle                                       |
| --- | -------------- | --------------------- | ------------------------------------------------------- | -------------------------- | ----------------------------------------------------- |
| V1  | Atlas          | cream light / sage / rust   | PP Editorial New (italic partial) + Geist + JetBrains Mono | Editorial Split 50/50      | Accessible scientific review, numbered regions       |
| V2  | Field Journal  | cream warm / moss / terra | Fraunces (wonk) + Plus Jakarta Sans + JBM italic        | Z-Axis Cascade             | Field ecologist notebook, botanical photo layers     |
| V3  | Méthode        | dark sage / parchment / ochre | Cabinet Grotesk + Satoshi + JetBrains Mono           | Asymmetrical Bento         | Devtool premium translated into the science world    |
| V4  | Herbarium      | espresso / cream / copper / muted botanical green | PP Editorial New Heavy + Neue Haas/Geist + JBM       | Editorial Split + Z-Axis overlays | Living digital herbarium, museum-grade gravity |

### Common to all four

- Floating island pill nav (no sticky edge-to-edge navbar).
- FR/EN language switch in nav, mirroring the Nouvelle-Calédonie portal convention.
- FunderStrip repurposed with 50% logo opacity, lifted on hover.
- Showcase cards re-rendered with double-bezel (outer shell + inner core, concentric radii).
- Section rhythm: `py-24` to `py-40`.
- Entry animations: `translate-y-16 blur-md opacity-0 → resolve` on `whileInView` (Framer Motion, isolated leaf client components only).
- Fixed `pointer-events-none` grain overlay at 2-3% opacity.
- Bilingual content (FR + EN), switch pattern identical to NC portal.
- Full copy rewrite per variant (no shared tagline).
- Mobile collapse below 768px: `w-full px-4 py-8`, all Z-Axis rotations neutralised, Bento flattened to single column.

---

## Why This Approach

### Why Editorial Luxury (user choice)

The chosen vibe archetype (`high-end-visual-design` §3.A) fits Niamoto's DNA:
- **Cream / sage / espresso palettes** echo natural substrates (paper, leaf, bark, soil) without resorting to the cliché "green leaf + earthy brown" SaaS treatment.
- **Variable serif display + grotesk body** signals *scientific publication* rather than *SaaS marketing*, matching the tone the user explicitly asked for ("marketing est un mot trop fort").
- **Film grain + macro-whitespace** reads as editorial gravity, which is what a 9-institution open-source scientific project deserves.
- Gives clear guardrails vs the other two archetypes (Ethereal Glass = too AI-SaaS-OLED; Soft Structuralism = too Linear-core, too neutral for a project with this much botanical richness).

### Why four variants, not one

The user asked for *"plusieurs pages de landing"* and chose "exploration large" in the livrable question. Four variants covers:
- **2 light** (V1 Atlas, V2 Field Journal) — two distinct light aesthetics (minimal scientific vs expressive naturalist)
- **1 dark-desaturated** (V3 Méthode) — for the devtool-premium angle
- **1 dark-warm** (V4 Herbarium) — for the museum/living-herbarium angle

Enough spread that cross-pollination is possible; not so many that quality dilutes.

### Why not touch the rest of the site

Constraints: `CLAUDE.md` design rules are still binding on `/documentation/*`, `/plugins/*`, `/showcase/*`. The four variants are isolated under `/alt/*`, have their own token scopes (via component-level CSS or `<style>` blocks with custom properties), and don't pollute the existing `global.css` `@theme`.

---

## Key Decisions

1. **Scope**: 4 new routes under `/alt/{atlas,field-journal,methode,herbarium}` — no existing page is modified.
2. **Design rules override**: `niamoto-site/CLAUDE.md` typography and palette rules are set aside for `/alt/*`. The stack (Astro 5, Tailwind v4, TS strict) stays.
3. **Vibe archetype (chosen)**: Editorial Luxury across all four.
4. **Layout archetypes per variant**: Editorial Split (V1, V4), Z-Axis Cascade (V2), Asymmetrical Bento (V3).
5. **Language**: Bilingual FR/EN with switch, same pattern as the NC portal.
6. **Copy**: Full rewrite per variant. No shared tagline.
7. **Audience**: Mix assumed (ecologists, institutions, devs) — accept higher density and multiple signals per page.
8. **Assets**:
   - Reuse NC portal botanical photos for V2/V4 (*Amborella trichopoda*, *Parasitaxus usta*, *Zygogynum mackeei*, *Cryptocarya barrabea*, *Hedycarya rivularis*, *Stenocarpus trinervis*) — `public/showcase/` to be extended.
   - Reuse existing funder logos (`public/funders/*.png`).
   - Generate grain/noise SVG overlays locally (no external libs).
   - Reuse `nc-home.png` / `nc-taxons.png` for showcase embeds.
9. **Typography stack (new, not in current global.css)**:
   - PP Editorial New (variable, display) — self-hosted or Fontshare
   - Fraunces (variable, display) — Google Fonts
   - Cabinet Grotesk (display) — Fontshare
   - Geist / Plus Jakarta Sans / Satoshi / Neue Haas Grotesk (body options)
   - JetBrains Mono (data/code) — already present
10. **Animation policy**: Framer Motion in isolated `.tsx` leaf components (Astro islands with `client:load` or `client:visible`). No GSAP, no ThreeJS for v1. Spring physics `stiffness:100 damping:20` baseline.
11. **Icons**: Phosphor Light `@phosphor-icons/react`, stroke 1.5. No Lucide. No emojis.
12. **No AI-generated images** for v1 — we have authentic NC botanical photos and authentic partner logos. `inference.sh` pipeline stays out of scope until a later iteration.

---

## Anti-Patterns Explicitly Avoided

From `design-taste-frontend` §7 and `high-end-visual-design` §2:

- No `Inter` anywhere.
- No centered hero on anything with layout variance > 4 (only V4 cheats with serif-over-image centering, authorised).
- No `h-screen` — always `min-h-[100dvh]`.
- No pure `#000000` — espresso `#1A1410` or sage-dark `#1E2822`.
- No generic 3-column card row — Bento / Cascade / Split only.
- No AI-purple/blue gradient aesthetic.
- No oversaturated accents — all accents below 80% saturation.
- No generic `box-shadow: 0 4px 12px rgba(0,0,0,0.1)` — tinted shadows matching background hue.
- No naked hamburger → fluid rotate-to-X morph in V4 nav.
- No "Elevate/Seamless/Unleash/Next-Gen" copy — concrete verbs, specific claims.
- No `John Doe`, no round fake numbers (use actual NC stats: 1,208 taxa, 5,400 km², 509 plots, 70,000+ trees, 2,713 endemic species).

---

## File Structure Plan

```
src/
  pages/
    alt/
      atlas.astro
      field-journal.astro
      methode.astro
      herbarium.astro
      index.astro               # dispatcher/landing presenting the 4 variants side-by-side
  components/
    alt/
      shared/
        IslandNav.astro         # floating pill nav, FR/EN switch
        LanguageSwitch.astro
        GrainOverlay.astro      # fixed pointer-events-none noise layer
        DoubleBezel.astro       # reusable outer-shell + inner-core wrapper
        ButtonInButton.astro    # nested pill CTA with trailing icon circle
        Stat.astro              # mono-tabular stat with label
      atlas/
        Hero.astro
        RegionList.astro
        PillarGrid.astro
      field-journal/
        HeroLayered.astro       # Z-Axis cascade with rotated photo cards
        BotanicalPlate.astro
      methode/
        HeroBento.astro
        TerminalCard.astro
        LiveStatsCard.astro
      herbarium/
        HeroSplit.astro
        SpecimenFrame.astro
      motion/                   # .tsx Framer Motion islands
        FadeUpOnView.tsx
        MagneticButton.tsx
        StaggeredReveal.tsx
  styles/
    alt/
      atlas.css                 # scoped CSS vars (cream palette, fonts)
      field-journal.css
      methode.css
      herbarium.css
  i18n/
    alt/
      atlas.fr.ts / atlas.en.ts
      field-journal.fr.ts / .en.ts
      methode.fr.ts / .en.ts
      herbarium.fr.ts / .en.ts
```

---

## Open Questions (for the implementation plan)

1. **Bilingual routing**: `/alt/atlas` default EN + `/alt/atlas/fr` vs `/fr/alt/atlas` + `/en/alt/atlas`? — Need to confirm URL shape before scaffolding.
2. **Font loading strategy**: self-host PP Editorial New / Cabinet Grotesk (Fontshare licence check) or use their CDN with preconnect? Impact on LCP budget.
3. **Framer Motion in Astro**: confirm React integration (`@astrojs/react`) is acceptable — currently none is declared in the project.
4. **Grain texture**: inline SVG noise via feTurbulence vs small PNG tile — pick one consistent approach.
5. **Live portal embed** (V3 optional): do we iframe `niamoto.nc` directly or ship a static cached snapshot? (loading + CSP).
6. **Entry page at `/alt/`**: what does it look like? A sober "index of variants" with 4 thumbnails, or just a hidden dev-only dispatcher? The user hasn't decided yet.

These are for the implementation plan (`/workflows:plan`) to resolve, not for this brainstorm.

---

## Next step

Run `/workflows:plan` with this document as input to produce a phased implementation plan (tokens + base components → V1 Atlas → V2 Field Journal → V3 Méthode → V4 Herbarium → dispatcher → review pass).
