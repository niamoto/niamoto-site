# /alt/ Wave 2 — V13 Planche Implementation Plan

> **For Claude:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Livrer `/alt/planche` et `/fr/alt/planche` — variante *canvas-design × algorithmic-art*. Scroll **horizontal** desktop (2400px wide) = une planche d'herbier A3 dépliée. 9 spécimens botaniques SVG en quinconce (chacun = un plugin Niamoto). Colonne droite "Notes de terrain". Texture grain papier. `@media print` → impression A3 paysage PDF-like. Numéro planche génératif en chiffres romains (date → roman). Typo IM Fell (serif XIXe grainée) + Caslon Italic.

**Architecture:** Scroll horizontal via `overflow-x: auto` sur conteneur + inner width explicite. Fallback vertical mobile via `@media (max-width: 900px)`. 9 spécimens en `position: absolute` avec coordonnées fixes (pas de flexbox), pour respecter la disposition en quinconce d'une vraie planche d'herbier. Util `romanize()` pour convertir la date (jour · mois romain · année romaine).

**Tech Stack:** Astro 5.6, Tailwind v4. Fontes : **IM Fell** (Google Fonts — OFL), **Libre Caslon Text** (Google Fonts — OFL, fallback Caslon). Installer via `@fontsource-variable/libre-caslon-text` si dispo, sinon link Google Fonts. Pas de JS runtime.

---

## Préalable

```bash
grep -q '"planche"' src/layouts/AltLayout.astro
grep -q 'planche:' src/i18n/alt/shared.en.ts
test -f src/styles/alt/planche.css
```

## Nouvelles dépendances (fontes)

- `@fontsource/im-fell-double-pica-sc` (IM Fell Double Pica SC, serif XIXe grainée)
- `@fontsource/libre-caslon-text` (fallback Caslon italic)

Les deux sont SIL OFL, free.

## File Structure

| Action | Path | Responsibility |
|---|---|---|
| Modify | `package.json` | Ajouter `@fontsource/im-fell-double-pica-sc` + `@fontsource/libre-caslon-text`. |
| Modify | `src/styles/alt/fonts.css` | Imports des 2 nouvelles fontes dans le bundle CSS. |
| Modify | `src/styles/alt/planche.css` | Tokens + SVG texture grain + scroll horizontal + print. |
| Create | `src/i18n/alt/planche.en.ts` | 9 spécimens plugins + notes de terrain + copy. |
| Create | `src/i18n/alt/planche.fr.ts` | FR. |
| Create | `src/components/alt/planche/Specimen.astro` | 1 spécimen (SVG illustré + étiquette manuscrite). |
| Create | `src/components/alt/planche/FieldNotesColumn.astro` | Colonne droite "Notes de terrain". |
| Create | `src/components/alt/planche/PlancheHeader.astro` | Titre "PLANCHE Nº <roman>" + date + maintainer. |
| Create | `src/components/alt/planche/PlanchePage.astro` | Wrapper — orchestre scroll horizontal. |
| Create | `src/utils/romanize.ts` | Util pure : `romanize(n: number): string`. |
| Create | `src/pages/alt/planche.astro`, `src/pages/fr/alt/planche.astro` | Routes. |

---

## Task 1: Fontes + CSS

- [ ] **Step 1.1: Ajouter les deps**
```bash
pnpm add @fontsource/im-fell-double-pica-sc@^5.2.5 @fontsource/libre-caslon-text@^5.2.5
```

- [ ] **Step 1.2: Importer dans `fonts.css`**

Éditer `src/styles/alt/fonts.css` — ajouter en fin de fichier :
```css
/* V13 Planche — IM Fell + Libre Caslon Text */
@import "@fontsource/im-fell-double-pica-sc/400.css";
@import "@fontsource/im-fell-double-pica-sc/400-italic.css";
@import "@fontsource/libre-caslon-text/400.css";
@import "@fontsource/libre-caslon-text/400-italic.css";
```

- [ ] **Step 1.3: Remplacer le stub `planche.css`**

```css
/* V13 Planche — canvas-design × algorithmic-art.
 * Scroll horizontal desktop, fallback vertical mobile. Print-ready.
 * Palette :
 *   --c-canvas    #EDE4D0   paper cream
 *   --c-ink       #3F2A18   sepia deep
 *   --c-muted     #6B563A   sepia mid
 *   --c-accent    #A03223   madder red (titles, specimen labels)
 *   --c-accent-alt#232F58   indigo (captions, numerals)
 */

[data-theme="planche"] {
  color-scheme: light;

  --c-canvas: #EDE4D0;
  --c-ink: #3F2A18;
  --c-muted: #6B563A;
  --c-accent: #A03223;
  --c-accent-alt: #232F58;
  --c-surface: rgba(63, 42, 24, 0.04);
  --c-hairline: rgba(63, 42, 24, 0.2);
  --c-grain-opacity: 0.09;

  --f-display: "IM Fell Double Pica SC", "Iowan Old Style", Georgia, serif;
  --f-body: "Libre Caslon Text", Georgia, serif;
  --f-mono: "Libre Caslon Text", Georgia, serif;

  --fvs-display: normal;
  --fvs-body: normal;

  --ls-display: 0.02em;
  --ls-body: 0.01em;
  --lh-display: 1.05;
  --lh-body: 1.55;
}

/* Heavier paper grain for V13. */
[data-theme="planche"] .grain-overlay {
  opacity: 0.09;
}

/* Page texture — faux-paper. Layered: base cream + mottled darker + sparse fibers. */
[data-theme="planche"] body {
  background-color: var(--c-canvas);
  background-image:
    radial-gradient(2px 2px at 10% 20%, rgba(63, 42, 24, 0.08) 50%, transparent 51%),
    radial-gradient(1px 1px at 80% 60%, rgba(63, 42, 24, 0.1) 50%, transparent 51%),
    radial-gradient(1.5px 1.5px at 50% 85%, rgba(63, 42, 24, 0.06) 50%, transparent 51%),
    linear-gradient(180deg, #EDE4D0 0%, #E8DCC3 100%);
  background-attachment: fixed;
}

/* Scroll horizontal container. */
[data-theme="planche"] .planche-viewport {
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: thin;
  scrollbar-color: var(--c-muted) transparent;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 1rem;
}
[data-theme="planche"] .planche-page {
  position: relative;
  width: 2400px;
  min-width: 2400px;
  height: calc(100dvh - 4rem);
  min-height: 780px;
  max-height: 900px;
  padding: 4rem;
  display: grid;
  grid-template-columns: 320px 1fr 300px;
  gap: 3rem;
  box-sizing: border-box;
}

/* Left column — title block. */
[data-theme="planche"] .planche-header {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-top: 2rem;
}
[data-theme="planche"] .planche-header__eyebrow {
  font-family: var(--f-display);
  font-size: 0.85rem;
  letter-spacing: 0.2em;
  color: var(--c-muted);
  text-transform: uppercase;
}
[data-theme="planche"] .planche-header__title {
  font-family: var(--f-display);
  font-size: clamp(2.5rem, 3vw, 3.5rem);
  line-height: 1.05;
  color: var(--c-accent);
  margin: 0;
}
[data-theme="planche"] .planche-header__title em {
  font-family: var(--f-body);
  font-style: italic;
  color: var(--c-accent-alt);
  display: block;
  font-size: 0.7em;
  margin-top: 0.5rem;
}
[data-theme="planche"] .planche-header__number {
  font-family: var(--f-body);
  font-style: italic;
  font-size: 2.5rem;
  color: var(--c-accent-alt);
  line-height: 1;
  letter-spacing: 0.08em;
}
[data-theme="planche"] .planche-header__meta {
  font-family: var(--f-body);
  font-style: italic;
  color: var(--c-muted);
  line-height: 1.6;
  max-width: 28ch;
}
[data-theme="planche"] .planche-header__meta strong {
  font-style: normal;
  color: var(--c-ink);
}

/* Middle column — specimens in a quincunx. */
[data-theme="planche"] .planche-specimens {
  position: relative;
  width: 100%;
  height: 100%;
}
[data-theme="planche"] .planche-specimen {
  position: absolute;
  width: 160px;
  text-align: center;
  transition: transform 320ms cubic-bezier(0.32, 0.72, 0, 1);
}
[data-theme="planche"] .planche-specimen:hover {
  transform: translateY(-4px) rotate(0deg) !important;
}
[data-theme="planche"] .planche-specimen svg {
  width: 100%;
  height: 160px;
  display: block;
  margin: 0 auto;
  color: var(--c-ink);
}
[data-theme="planche"] .planche-specimen__label {
  font-family: var(--f-body);
  font-style: italic;
  color: var(--c-accent);
  font-size: 0.9rem;
  margin-top: 0.75rem;
  letter-spacing: 0.02em;
}
[data-theme="planche"] .planche-specimen__hint {
  font-family: var(--f-display);
  font-size: 0.7rem;
  letter-spacing: 0.14em;
  color: var(--c-muted);
  text-transform: uppercase;
  margin-top: 0.25rem;
  opacity: 0;
  transition: opacity 220ms;
}
[data-theme="planche"] .planche-specimen:hover .planche-specimen__hint {
  opacity: 1;
}

/* Right column — field notes. */
[data-theme="planche"] .planche-notes {
  font-family: var(--f-body);
  color: var(--c-ink);
  padding-top: 2rem;
  border-left: 1px solid var(--c-hairline);
  padding-left: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
[data-theme="planche"] .planche-notes__heading {
  font-family: var(--f-display);
  font-size: 0.85rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--c-accent-alt);
  margin-bottom: 0.5rem;
}
[data-theme="planche"] .planche-notes__item {
  border-top: 1px solid var(--c-hairline);
  padding-top: 0.75rem;
}
[data-theme="planche"] .planche-notes__item-num {
  font-family: var(--f-body);
  font-style: italic;
  color: var(--c-accent);
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}
[data-theme="planche"] .planche-notes__item-body {
  font-size: 0.9rem;
  line-height: 1.55;
  color: var(--c-ink);
}
[data-theme="planche"] .planche-notes__footnote {
  margin-top: auto;
  font-family: var(--f-body);
  font-style: italic;
  font-size: 0.75rem;
  color: var(--c-muted);
}

/* Print CTA at the bottom of the viewport. */
[data-theme="planche"] .planche-print-cta {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 40;
  background: var(--c-accent);
  color: var(--c-canvas);
  font-family: var(--f-body);
  font-style: italic;
  padding: 0.75rem 1.25rem;
  border-radius: 9999px;
  border: none;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(63, 42, 24, 0.2);
  transition: transform 220ms cubic-bezier(0.32, 0.72, 0, 1);
}
[data-theme="planche"] .planche-print-cta:hover {
  transform: translateY(-2px);
}

/* Mobile fallback — vertical stacking. */
@media (max-width: 900px) {
  [data-theme="planche"] .planche-viewport {
    overflow-x: hidden;
  }
  [data-theme="planche"] .planche-page {
    width: 100%;
    min-width: 0;
    height: auto;
    min-height: 0;
    grid-template-columns: 1fr;
    padding: 3rem 1.5rem;
  }
  [data-theme="planche"] .planche-specimens {
    height: 820px;
  }
  [data-theme="planche"] .planche-notes {
    border-left: none;
    border-top: 1px solid var(--c-hairline);
    padding-left: 0;
    padding-top: 2rem;
  }
  [data-theme="planche"] .planche-print-cta {
    position: static;
    margin: 2rem auto 0;
    display: block;
  }
}

/* PRINT — A3 landscape. */
@media print {
  [data-theme="planche"] .grain-overlay { display: none; }
  [data-theme="planche"] .planche-print-cta { display: none; }
  [data-theme="planche"] .planche-viewport {
    overflow: visible;
  }
  [data-theme="planche"] .planche-page {
    width: 420mm;
    min-width: 420mm;
    height: 297mm;
    min-height: 297mm;
    max-height: 297mm;
    padding: 15mm;
    page-break-after: avoid;
  }
  @page {
    size: A3 landscape;
    margin: 0;
  }
  /* Remove the skip-link + nav from print. */
  [data-theme="planche"] .skip-link,
  [data-theme="planche"] nav { display: none; }
}
```

- [ ] **Step 1.4: Build + commit**
```bash
pnpm typecheck && pnpm build
git add package.json pnpm-lock.yaml src/styles/alt/fonts.css src/styles/alt/planche.css
git commit -m "feat(alt/planche): IM Fell + Libre Caslon fonts, scoped CSS, print A3 stylesheet"
```

---

## Task 2: Util `romanize()`

**Files:**
- Create: `src/utils/romanize.ts`

- [ ] **Step 2.1: Créer `romanize.ts`**

```ts
/**
 * Convert an integer (1..3999) to Roman numerals.
 * Returns uppercase Roman string. Falls back to input as string for 0 or 4000+.
 *
 * @example romanize(17) // "XVII"
 * @example romanize(2026) // "MMXXVI"
 */
export function romanize(n: number): string {
  if (n <= 0 || n >= 4000 || !Number.isInteger(n)) return String(n);
  const map: Array<[number, string]> = [
    [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
    [100, "C"],  [90, "XC"],  [50, "L"],  [40, "XL"],
    [10, "X"],   [9, "IX"],   [5, "V"],   [4, "IV"],
    [1, "I"],
  ];
  let result = "";
  let remainder = n;
  for (const [value, symbol] of map) {
    while (remainder >= value) {
      result += symbol;
      remainder -= value;
    }
  }
  return result;
}

/**
 * Convert a Date to a "day · month(roman) · year(roman)" string.
 *
 * @example dateToRoman(new Date("2026-04-17")) // "XVII · IV · MMXXVI"
 */
export function dateToRoman(d: Date): string {
  return `${romanize(d.getDate())} · ${romanize(d.getMonth() + 1)} · ${romanize(d.getFullYear())}`;
}
```

- [ ] **Step 2.2: Typecheck**
```bash
pnpm typecheck
```

- [ ] **Step 2.3: Commit**
```bash
git add src/utils/romanize.ts
git commit -m "feat(utils): romanize() + dateToRoman() for V13 Planche"
```

---

## Task 3: i18n EN + FR

- [ ] **Step 3.1: `planche.en.ts`**

9 spécimens = 9 plugins Niamoto (transform, export, cli, taxonomy, plot, tree, viewer, theme, watch). Shape SVG simple : chaque spécimen est désigné par une forme botanique stylisée (palmier, algue, fougère, feuille composée, etc.).

```ts
export default {
  meta: {
    title: "Niamoto · Planche — Specimens of open ecology",
    description:
      "A single horizontal plate, 2400 pixels wide. Nine Niamoto plugins as botanical specimens. Print to A3, pin on the wall.",
  },
  header: {
    eyebrow: "CATALOGUE OPEN ECOLOGY",
    titleMain: "Niamoto",
    titleItalic: "Specimens for an open data herbarium.",
    plateNumber: "VIII",
    metaLine1: "Drawn",
    metaLine2: "for the Niamoto collective.",
    metaInstitutions: "IRD · CIRAD · AMAP · ANPN",
  },
  specimens: [
    { slug: "transform", label: "niamoto.transform",  hint: "PIPELINE · PALM",     shape: "palm",     x: 120,  y: 40 },
    { slug: "export",    label: "niamoto.export",     hint: "OUTPUT · ALGA",       shape: "alga",     x: 360,  y: 120 },
    { slug: "cli",       label: "niamoto.cli",        hint: "COMMAND · FERN",      shape: "fern",     x: 200,  y: 280 },
    { slug: "taxonomy",  label: "niamoto.taxonomy",   hint: "TAXA · CANOPY",       shape: "canopy",   x: 520,  y: 260 },
    { slug: "plot",      label: "niamoto.plot",       hint: "FIELD · SAPLING",     shape: "sapling",  x: 700,  y: 40 },
    { slug: "tree",      label: "niamoto.tree",       hint: "MEASURE · BRANCH",    shape: "branch",   x: 860,  y: 180 },
    { slug: "viewer",    label: "niamoto.viewer",     hint: "PORTAL · LEAF",       shape: "leaf",     x: 1040, y: 60 },
    { slug: "theme",     label: "niamoto.theme",      hint: "STYLE · COMPOUND",    shape: "compound", x: 1200, y: 260 },
    { slug: "watch",     label: "niamoto.watch",      hint: "MONITOR · LICHEN",    shape: "lichen",   x: 960,  y: 340 },
  ],
  notes: {
    heading: "FIELD NOTES",
    items: [
      { num: "Nº 1",  body: "All specimens on this plate are Apache-2 licensed. None of them were grown in a silo." },
      { num: "Nº 2",  body: "Installation: pip install niamoto. Each specimen docks into the same runtime, which is not a SaaS." },
      { num: "Nº 3",  body: "This plate is generated from real data. Click any specimen to see its command invocation on GitHub." },
      { num: "Nº 4",  body: "Print this page (A3 landscape) and pin it to the wall of your forest research lab. Offline-ready." },
    ],
    footnote:
      "Plate Nº VIII · drawn by the Niamoto collective, 2026. Reproduction authorised under CC-BY-SA 4.0.",
  },
  printCta: "Print this page",
  pinTiltsDeg: [-2, 1.5, -1.2, 2, -0.8, 1, -1.4, 2.2, -1.8], // micro-rotations per specimen
} as const;
```

- [ ] **Step 3.2: `planche.fr.ts`**
```ts
export default {
  meta: {
    title: "Niamoto · Planche — Spécimens d'écologie ouverte",
    description:
      "Une planche horizontale de 2400 pixels. Neuf plugins Niamoto en spécimens botaniques. À imprimer en A3, à épingler au mur.",
  },
  header: {
    eyebrow: "CATALOGUE ÉCOLOGIE OUVERTE",
    titleMain: "Niamoto",
    titleItalic: "Spécimens pour un herbier de données ouvertes.",
    plateNumber: "VIII",
    metaLine1: "Dressée",
    metaLine2: "pour le collectif Niamoto.",
    metaInstitutions: "IRD · CIRAD · AMAP · ANPN",
  },
  specimens: [
    { slug: "transform", label: "niamoto.transform", hint: "PIPELINE · PALMIER",   shape: "palm",     x: 120,  y: 40 },
    { slug: "export",    label: "niamoto.export",    hint: "SORTIE · ALGUE",       shape: "alga",     x: 360,  y: 120 },
    { slug: "cli",       label: "niamoto.cli",       hint: "COMMANDE · FOUGÈRE",   shape: "fern",     x: 200,  y: 280 },
    { slug: "taxonomy",  label: "niamoto.taxonomy",  hint: "TAXA · CANOPÉE",       shape: "canopy",   x: 520,  y: 260 },
    { slug: "plot",      label: "niamoto.plot",      hint: "TERRAIN · POUSSE",     shape: "sapling",  x: 700,  y: 40 },
    { slug: "tree",      label: "niamoto.tree",      hint: "MESURE · RAMEAU",      shape: "branch",   x: 860,  y: 180 },
    { slug: "viewer",    label: "niamoto.viewer",    hint: "PORTAIL · FEUILLE",    shape: "leaf",     x: 1040, y: 60 },
    { slug: "theme",     label: "niamoto.theme",     hint: "STYLE · COMPOSÉE",     shape: "compound", x: 1200, y: 260 },
    { slug: "watch",     label: "niamoto.watch",     hint: "SURVEILLE · LICHEN",   shape: "lichen",   x: 960,  y: 340 },
  ],
  notes: {
    heading: "NOTES DE TERRAIN",
    items: [
      { num: "Nº 1",  body: "Tous les spécimens de cette planche sont sous licence Apache 2. Aucun n'a poussé dans un silo." },
      { num: "Nº 2",  body: "Installation : pip install niamoto. Chaque spécimen s'accroche au même runtime, qui n'est pas un SaaS." },
      { num: "Nº 3",  body: "Cette planche est générée à partir de données réelles. Cliquez sur un spécimen pour voir sa commande sur GitHub." },
      { num: "Nº 4",  body: "Imprimez cette page (A3 paysage) et épinglez-la au mur de votre laboratoire de terrain. Lisible hors-ligne." },
    ],
    footnote:
      "Planche Nº VIII · dressée par le collectif Niamoto, 2026. Reproduction autorisée sous licence CC-BY-SA 4.0.",
  },
  printCta: "Imprimer cette page",
  pinTiltsDeg: [-2, 1.5, -1.2, 2, -0.8, 1, -1.4, 2.2, -1.8],
} as const;
```

- [ ] **Step 3.3: Typecheck + commit**
```bash
pnpm typecheck
git add src/i18n/alt/planche.en.ts src/i18n/alt/planche.fr.ts
git commit -m "feat(alt/planche): i18n EN/FR — 9 specimens, field notes"
```

---

## Task 4: Composants

- [ ] **Step 4.1: `Specimen.astro`**

Les shapes SVG sont générées à la main pour 9 formes botaniques simples. Chaque shape est un inline SVG de ~160x160.

```astro
---
interface Props {
  label: string;
  hint: string;
  shape: "palm" | "alga" | "fern" | "canopy" | "sapling" | "branch" | "leaf" | "compound" | "lichen";
  x: number;
  y: number;
  tiltDeg: number;
  href: string;
}
const { label, hint, shape, x, y, tiltDeg, href } = Astro.props;
const transform = `translate(${x}px, ${y}px) rotate(${tiltDeg}deg)`;
---

<a class="planche-specimen" href={href} style={`left: ${x}px; top: ${y}px; transform: rotate(${tiltDeg}deg);`} aria-label={label}>
  {shape === "palm" && (
    <svg viewBox="0 0 160 160" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true">
      <path d="M80 140 L80 80" />
      <path d="M80 80 C 40 70, 30 50, 40 30" />
      <path d="M80 80 C 120 70, 130 50, 120 30" />
      <path d="M80 80 C 60 75, 45 60, 50 40" />
      <path d="M80 80 C 100 75, 115 60, 110 40" />
      <path d="M80 80 C 80 60, 70 40, 80 20" />
      <circle cx="80" cy="80" r="3" fill="currentColor" />
    </svg>
  )}
  {shape === "alga" && (
    <svg viewBox="0 0 160 160" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true">
      <path d="M80 20 Q 50 60, 70 100 Q 90 140, 60 150" />
      <path d="M80 20 Q 110 60, 90 100 Q 70 140, 100 150" />
      <path d="M75 50 Q 65 55, 70 65" />
      <path d="M85 80 Q 95 85, 90 95" />
    </svg>
  )}
  {shape === "fern" && (
    <svg viewBox="0 0 160 160" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true">
      <path d="M80 150 L 80 30" />
      {[...Array(10)].map((_, i) => {
        const yy = 40 + i * 11;
        const w = 30 - i * 2;
        return (
          <>
            <path d={`M 80 ${yy} Q ${80 - w/2} ${yy - 4}, ${80 - w} ${yy + 2}`} />
            <path d={`M 80 ${yy} Q ${80 + w/2} ${yy - 4}, ${80 + w} ${yy + 2}`} />
          </>
        );
      })}
    </svg>
  )}
  {shape === "canopy" && (
    <svg viewBox="0 0 160 160" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true">
      <circle cx="80" cy="60" r="35" />
      <path d="M 80 60 L 80 140" />
      <path d="M 80 90 L 60 110" />
      <path d="M 80 90 L 100 110" />
      <path d="M 60 50 L 80 55" />
      <path d="M 100 50 L 80 55" />
    </svg>
  )}
  {shape === "sapling" && (
    <svg viewBox="0 0 160 160" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true">
      <path d="M80 150 L 80 80" />
      <path d="M 80 100 L 60 90" />
      <path d="M 80 110 L 100 100" />
      <path d="M 80 80 L 65 65" />
      <path d="M 80 80 L 95 65" />
      <ellipse cx="65" cy="62" rx="6" ry="10" />
      <ellipse cx="95" cy="62" rx="6" ry="10" />
    </svg>
  )}
  {shape === "branch" && (
    <svg viewBox="0 0 160 160" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true">
      <path d="M 20 80 C 60 75, 100 85, 140 80" />
      {[35, 60, 85, 110].map((xx) => (
        <>
          <ellipse cx={xx} cy="60" rx="4" ry="8" />
          <path d={`M ${xx} 78 L ${xx} 68`} />
        </>
      ))}
    </svg>
  )}
  {shape === "leaf" && (
    <svg viewBox="0 0 160 160" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true">
      <path d="M 40 90 Q 80 20, 120 90 Q 80 140, 40 90 Z" />
      <path d="M 80 25 L 80 135" />
      {[50, 70, 90, 110].map((yy) => (
        <>
          <path d={`M 80 ${yy} L ${80 - (130 - yy) * 0.3} ${yy + 5}`} />
          <path d={`M 80 ${yy} L ${80 + (130 - yy) * 0.3} ${yy + 5}`} />
        </>
      ))}
    </svg>
  )}
  {shape === "compound" && (
    <svg viewBox="0 0 160 160" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true">
      <path d="M 80 140 L 80 30" />
      {[50, 70, 90, 110].map((yy, i) => (
        <>
          <ellipse cx={80 - 20 - i * 3} cy={yy} rx="12" ry="6" />
          <ellipse cx={80 + 20 + i * 3} cy={yy} rx="12" ry="6" />
        </>
      ))}
    </svg>
  )}
  {shape === "lichen" && (
    <svg viewBox="0 0 160 160" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true">
      <circle cx="60" cy="70" r="12" />
      <circle cx="90" cy="80" r="14" />
      <circle cx="75" cy="100" r="10" />
      <circle cx="105" cy="60" r="8" />
      <circle cx="50" cy="95" r="6" />
      {[[60,70],[90,80],[75,100],[105,60],[50,95]].map(([cx, cy]) => (
        <circle cx={cx} cy={cy} r="1.5" fill="currentColor" />
      ))}
    </svg>
  )}
  <p class="planche-specimen__label">{label}</p>
  <p class="planche-specimen__hint">{hint}</p>
</a>
```

- [ ] **Step 4.2: `PlancheHeader.astro`**
```astro
---
import { dateToRoman } from "@/utils/romanize";

interface Props {
  eyebrow: string;
  titleMain: string;
  titleItalic: string;
  plateNumber: string;
  metaLine1: string;
  metaLine2: string;
  metaInstitutions: string;
}
const {
  eyebrow, titleMain, titleItalic, plateNumber,
  metaLine1, metaLine2, metaInstitutions,
} = Astro.props;
const today = dateToRoman(new Date("2026-04-17"));
---

<header class="planche-header">
  <p class="planche-header__eyebrow">{eyebrow}</p>
  <h1 class="planche-header__title">
    {titleMain}
    <em>{titleItalic}</em>
  </h1>
  <p class="planche-header__number">Nº {plateNumber}</p>
  <p class="planche-header__meta">
    {metaLine1}<br/>
    {metaLine2}<br/>
    <strong>{today}</strong><br/>
    {metaInstitutions}
  </p>
</header>
```

- [ ] **Step 4.3: `FieldNotesColumn.astro`**
```astro
---
interface Item { num: string; body: string }
interface Props { heading: string; items: readonly Item[]; footnote: string }
const { heading, items, footnote } = Astro.props;
---

<aside class="planche-notes" aria-labelledby="planche-notes-heading">
  <p id="planche-notes-heading" class="planche-notes__heading">{heading}</p>
  {items.map((it) => (
    <div class="planche-notes__item">
      <p class="planche-notes__item-num">{it.num}</p>
      <p class="planche-notes__item-body">{it.body}</p>
    </div>
  ))}
  <p class="planche-notes__footnote">{footnote}</p>
</aside>
```

- [ ] **Step 4.4: Typecheck + commit**
```bash
pnpm typecheck
git add src/components/alt/planche/
git commit -m "feat(alt/planche): 9-shape SVG specimens, header, field notes"
```

---

## Task 5: `PlanchePage.astro` + routes

- [ ] **Step 5.1: `PlanchePage.astro`**
```astro
---
import AltLayout from "@/layouts/AltLayout.astro";
import IslandNav from "@/components/alt/shared/IslandNav.astro";
import PlancheHeader from "./PlancheHeader.astro";
import Specimen from "./Specimen.astro";
import FieldNotesColumn from "./FieldNotesColumn.astro";
import type { Locale } from "@/i18n/config";
import enCopy from "@/i18n/alt/planche.en";
import frCopy from "@/i18n/alt/planche.fr";

interface Props { locale: Locale }
const { locale } = Astro.props;
const t = locale === "fr" ? frCopy : enCopy;
---

<AltLayout
  theme="planche"
  locale={locale}
  title={t.meta.title}
  description={t.meta.description}
  slug="planche"
>
  <a href="#main" class="skip-link">Skip to content</a>
  <IslandNav locale={locale} slug="planche" />

  <main id="main" class="planche-viewport">
    <div class="planche-page">
      <PlancheHeader
        eyebrow={t.header.eyebrow}
        titleMain={t.header.titleMain}
        titleItalic={t.header.titleItalic}
        plateNumber={t.header.plateNumber}
        metaLine1={t.header.metaLine1}
        metaLine2={t.header.metaLine2}
        metaInstitutions={t.header.metaInstitutions}
      />

      <div class="planche-specimens">
        {t.specimens.map((s, i) => (
          <Specimen
            label={s.label}
            hint={s.hint}
            shape={s.shape}
            x={s.x}
            y={s.y}
            tiltDeg={t.pinTiltsDeg[i] ?? 0}
            href={`https://github.com/niamoto/niamoto/tree/main/src/niamoto/${s.slug}`}
          />
        ))}
      </div>

      <FieldNotesColumn
        heading={t.notes.heading}
        items={t.notes.items}
        footnote={t.notes.footnote}
      />
    </div>
  </main>

  <button class="planche-print-cta" onclick="window.print()" aria-label={t.printCta}>
    {t.printCta}
  </button>
</AltLayout>
```

- [ ] **Step 5.2: Routes**

`src/pages/alt/planche.astro`:
```astro
---
import PlanchePage from "@/components/alt/planche/PlanchePage.astro";
---
<PlanchePage locale="en" />
```

`src/pages/fr/alt/planche.astro`:
```astro
---
import PlanchePage from "@/components/alt/planche/PlanchePage.astro";
---
<PlanchePage locale="fr" />
```

- [ ] **Step 5.3: Build**
```bash
pnpm build
```

- [ ] **Step 5.4: Commit**
```bash
git add src/components/alt/planche/PlanchePage.astro src/pages/alt/planche.astro src/pages/fr/alt/planche.astro
git commit -m "feat(alt/planche): wrapper + EN/FR routes"
```

---

## Task 6: QA + print test

- [ ] **Step 6.1: Preview `/alt/planche` desktop**

Vérifier :
1. Scroll horizontal fonctionne (trackpad gauche/droite, ou scrollbar bas).
2. Planche fait 2400px wide, 3 colonnes visibles simultanément si viewport 1200px.
3. Les 9 spécimens sont disposés en quinconce (pas alignés en grille parfaite).
4. Hover sur un spécimen : légère translation up + rotate 0°, hint visible.
5. Click → GitHub.
6. Texture grain papier visible sur background.
7. Header gauche : "Niamoto / Specimens for an open data herbarium." italique, Nº VIII, date romaine "XVII · IV · MMXXVI".
8. Colonne droite : 4 notes numérotées Nº 1–4, footnote en italique muted.

- [ ] **Step 6.2: Preview FR**

Accents : *écologie*, *générée*, *spécimens*, *canopée*, *fougère*. Planche Nº VIII en FR.

- [ ] **Step 6.3: Print test**

`Cmd+P` (ou `Ctrl+P`) sur `/alt/planche`. Choisir "Save as PDF", format "A3 landscape" (297×420mm).

Vérifier le PDF :
1. Page A3 paysage remplie.
2. Grain overlay retiré.
3. Print CTA retiré.
4. Nav retirée.
5. Les 9 spécimens et notes tiennent sur 1 page sans coupure.

Si overflow sur le PDF : ajuster `padding: 15mm` → `10mm` dans la règle `@media print`.

- [ ] **Step 6.4: Mobile fallback**

Viewport 375px : scroll horizontal désactivé, layout stack vertical (header → specimens en box 820px → notes). OK.

- [ ] **Step 6.5: REVIEW.md + commit**
```md
### V13 Planche (Canvas design × algorithmic art)

Scroll horizontal desktop (2400px wide) = planche d'herbier A3 dépliée. 9 plugins en spécimens SVG stylisés, disposés en quinconce avec micro-tilts. Notes de terrain en colonne droite. Print A3 paysage fonctionnel.

**Strengths**: esthétique print rare sur une landing, assumée. Le CTA "Imprimer" transforme la variante en poster physique. Date romaine ajoute un détail savant.

**Weaknesses**: le scroll horizontal n'est pas intuitif pour tout le monde (affordance manquante). Les SVG spécimens sont stylisés, pas photo-réels.
```

```bash
git add docs/alt/REVIEW.md
git commit -m "docs(alt/planche): add variant audit entry"
```

---

## Risks & gotchas

1. **Scroll horizontal découverte** — la première impression sur desktop peut dérouter. Option : ajouter un petit hint "← scroll → to explore plate" sous le header ou animé la première fois. À voir en impl.
2. **Print sur Firefox** — A3 landscape + `@page` peut avoir un comportement différent de Chrome. Tester. Worst case, doc dans REVIEW.md de ne tester qu'avec Chrome.
3. **SVG coordinates hardcoded** — `x`, `y` sont en pixels absolus. Si le viewport est énormément large (>2400px), il y aura un "vide" à droite. On peut ajouter un `max-width: 100vw; margin: 0 auto` au `.planche-page`. OK.
4. **Accessibility scroll horizontal** — clavier : `arrow-right` / `arrow-left` scroll naturellement en overflow. Ne pas casser le tab-order des 9 specimen links.
5. **Date hardcodée** — `new Date("2026-04-17")` donne une date fixe. Si on veut dynamique : `new Date()`. Par défaut statique pour stabilité du build (éviter que le numéro de planche change d'un build à l'autre).

---

## Execution handoff

Plan suivant : V10 Sporée (p5.js génératif) ou V12 Canopée (GSAP scroll-jack).
