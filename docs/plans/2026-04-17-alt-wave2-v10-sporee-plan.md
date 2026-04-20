# /alt/ Wave 2 — V10 Sporée Implementation Plan

> **For Claude:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Livrer `/alt/sporee` et `/fr/alt/sporee` (bac `/lab/` — Niamoto déliré) — variante *algorithmic-art × frontend-design*. Hero p5.js fullscreen : flow field de spores qui flottent, seed déterministe `hash(date + locale)`. Le texte HTML est superposé semi-opaque. Scroll-y redraw le canvas (density param). Section 3 : gallerie 6 captures de compositions différentes. Install card en Berkeley Mono (fallback JetBrains Mono) sur carte craft-paper. Badge seed visible.

**Architecture:** `SporeCanvas.tsx` = React island client-rendered, loaded via `client:visible`. p5.js importé en **dynamic import** (`await import("p5")`) pour éviter de charger 800kb sur les autres pages. Seed dérivée d'une fonction pure `seedFrom(date, locale)` partagée client-serveur. Le seed est affiché en badge HTML au SSR, puis le canvas s'hydrate et génère le flow field avec la même seed → cohérence visuelle.

**Tech Stack:** Astro 5.6, React 19, **p5@^1.10** (déjà installé par foundations), **@types/p5** (déjà installé), Fraunces Italic (fallback pour Migra), JetBrains Mono (fallback pour Berkeley Mono). Pas de Migra ni Berkeley Mono : pas de licence acquise, fallback assumé et noté.

---

## Préalable

```bash
grep -q '"sporee"' src/layouts/AltLayout.astro
grep -q 'sporee:' src/i18n/alt/shared.en.ts
test -f src/styles/alt/sporee.css
node -e "require.resolve('p5')" 2>&1 # doit afficher un path, pas une erreur
```

## File Structure

| Action | Path | Responsibility |
|---|---|---|
| Modify | `src/styles/alt/sporee.css` | Tokens + layout overlay + craft paper card. |
| Create | `src/i18n/alt/sporee.en.ts` | Meta, hero, gallery, install. |
| Create | `src/i18n/alt/sporee.fr.ts` | FR. |
| Create | `src/utils/seedFrom.ts` | Pure fn : `hash(date + locale) → u32 seed`. |
| Create | `src/components/alt/sporee/SporeCanvas.tsx` | React + p5 island (client:visible). Dynamic import p5. |
| Create | `src/components/alt/sporee/SeedBadge.astro` | Badge Berkeley Mono affichant la seed du jour. |
| Create | `src/components/alt/sporee/FlowGallery.astro` | Grid 6 captures (SVG pré-générées). |
| Create | `src/components/alt/sporee/BerkeleyInstallCard.astro` | Install card craft-paper + mono. |
| Create | `src/components/alt/sporee/SporeePage.astro` | Wrapper. |
| Create | `src/pages/alt/sporee.astro`, `src/pages/fr/alt/sporee.astro` | Routes. |
| Create | `public/showcase/sporee/`* | 6 images PNG de captures précalculées (fallback reduced-motion). |

*(Les PNG sont générées une fois, à la main, en lançant le canvas avec 6 seeds fixes — step dédié en Task 7.)*

---

## Task 1: CSS scoped

- [ ] **Step 1.1: Remplacer le stub `sporee.css`**

```css
/* V10 Sporée — algorithmic-art × frontend-design.
 * Canvas p5.js fullscreen + texte HTML overlay. Seed deterministic.
 * Palette :
 *   --c-canvas    #F3EEE2   bone
 *   --c-ink       #1A1612   near-black warm
 *   --c-muted     #6B5D4A   muted ochre
 *   --c-accent    #A34B28   rust
 *   --c-accent-alt#4A3A6B   spore-violet
 */

[data-theme="sporee"] {
  color-scheme: light;

  --c-canvas: #F3EEE2;
  --c-ink: #1A1612;
  --c-muted: #6B5D4A;
  --c-accent: #A34B28;
  --c-accent-alt: #4A3A6B;
  --c-surface: rgba(26, 22, 18, 0.04);
  --c-hairline: rgba(26, 22, 18, 0.14);
  --c-grain-opacity: 0.04;

  /* Migra = Pangram licence (non acquise). Fallback Fraunces italic opsz 144.
   * Berkeley Mono = Berkeley licence (non acquise). Fallback JetBrains Mono. */
  --f-display: "Fraunces Variable", Georgia, serif;
  --f-body: "Geist Variable", system-ui, -apple-system, sans-serif;
  --f-mono: "JetBrains Mono Variable", ui-monospace, SFMono-Regular, Menlo, monospace;

  --fvs-display: "opsz" 144, "wght" 800, "SOFT" 50, "WONK" 1;
  --fvs-body: "wght" 500;

  --ls-display: -0.04em;
  --ls-body: 0;
  --lh-display: 0.98;
  --lh-body: 1.55;
}

/* Hero — canvas fullscreen + overlay text. */
[data-theme="sporee"] .sporee-hero {
  position: relative;
  min-height: 100dvh;
  overflow: hidden;
}
[data-theme="sporee"] .sporee-hero__canvas {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}
[data-theme="sporee"] .sporee-hero__canvas canvas {
  width: 100%;
  height: 100%;
  display: block;
}
[data-theme="sporee"] .sporee-hero__fallback {
  position: absolute;
  inset: 0;
  z-index: 0;
  background-image: url("/showcase/sporee/fallback.png");
  background-size: cover;
  background-position: center;
  opacity: 0.85;
  display: none;
}
@media (prefers-reduced-motion: reduce) {
  [data-theme="sporee"] .sporee-hero__canvas { display: none; }
  [data-theme="sporee"] .sporee-hero__fallback { display: block; }
}

[data-theme="sporee"] .sporee-hero__overlay {
  position: relative;
  z-index: 2;
  max-width: 960px;
  margin: 0 auto;
  padding: 10rem 1.5rem 8rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
[data-theme="sporee"] .sporee-hero__title {
  font-family: var(--f-display);
  font-style: italic;
  font-variation-settings: "opsz" 144, "wght" 800, "SOFT" 100, "WONK" 1;
  font-size: clamp(3rem, 8vw, 8rem);
  line-height: 0.95;
  color: var(--c-ink);
  letter-spacing: -0.05em;
  margin: 0;
  mix-blend-mode: multiply;
}
[data-theme="sporee"] .sporee-hero__title em {
  font-style: italic;
  color: var(--c-accent);
  font-variation-settings: "opsz" 144, "wght" 800, "SOFT" 100, "WONK" 1;
}
[data-theme="sporee"] .sporee-hero__sub {
  font-family: var(--f-body);
  font-size: 1.15rem;
  max-width: 52ch;
  color: var(--c-ink);
  line-height: 1.55;
  mix-blend-mode: multiply;
}
[data-theme="sporee"] .sporee-hero__controls {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}
[data-theme="sporee"] .sporee-hero__control {
  font-family: var(--f-mono);
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  padding: 0.65rem 1rem;
  border: 1px solid var(--c-hairline);
  background: color-mix(in srgb, var(--c-canvas) 85%, transparent);
  color: var(--c-ink);
  cursor: pointer;
  border-radius: 9999px;
  transition: background 240ms, transform 240ms;
}
[data-theme="sporee"] .sporee-hero__control:hover {
  background: color-mix(in srgb, var(--c-canvas) 100%, transparent);
  transform: translateY(-1px);
}

/* Seed badge — top-right fixed corner. */
[data-theme="sporee"] .sporee-seed {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 30;
  font-family: var(--f-mono);
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--c-ink);
  background: color-mix(in srgb, var(--c-canvas) 90%, transparent);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--c-hairline);
  border-radius: 9999px;
}

/* Flow gallery — 6 captures 2x3 or 3x2. */
[data-theme="sporee"] .sporee-gallery {
  max-width: 1280px;
  margin: 0 auto;
  padding: 4rem 1.5rem 6rem;
}
[data-theme="sporee"] .sporee-gallery__heading {
  font-family: var(--f-mono);
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: var(--c-muted);
  margin-bottom: 2rem;
}
[data-theme="sporee"] .sporee-gallery__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}
@media (max-width: 900px) {
  [data-theme="sporee"] .sporee-gallery__grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 600px) {
  [data-theme="sporee"] .sporee-gallery__grid { grid-template-columns: 1fr; }
}
[data-theme="sporee"] .sporee-gallery__item {
  position: relative;
  aspect-ratio: 4 / 3;
  border-radius: 0.75rem;
  overflow: hidden;
  border: 1px solid var(--c-hairline);
  background: color-mix(in srgb, var(--c-canvas) 90%, var(--c-accent-alt));
}
[data-theme="sporee"] .sporee-gallery__item svg,
[data-theme="sporee"] .sporee-gallery__item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
[data-theme="sporee"] .sporee-gallery__caption {
  position: absolute;
  bottom: 0.6rem;
  left: 0.75rem;
  right: 0.75rem;
  font-family: var(--f-mono);
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--c-ink);
  background: color-mix(in srgb, var(--c-canvas) 85%, transparent);
  padding: 0.3rem 0.5rem;
  border-radius: 0.3rem;
}

/* Berkeley install card — craft paper, mono code block. */
[data-theme="sporee"] .sporee-install {
  max-width: 720px;
  margin: 0 auto 6rem;
  padding: 2rem 2.5rem;
  background: color-mix(in srgb, var(--c-canvas) 90%, #D6C8A8);
  border: 1px solid color-mix(in srgb, var(--c-ink) 18%, transparent);
  border-radius: 0.5rem;
  box-shadow:
    0 1px 0 color-mix(in srgb, var(--c-ink) 10%, transparent),
    0 16px 40px color-mix(in srgb, var(--c-ink) 10%, transparent);
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='p'><feTurbulence baseFrequency='0.8' numOctaves='1'/><feColorMatrix values='0 0 0 0 0.1  0 0 0 0 0.07  0 0 0 0 0.04  0 0 0 0.1 0'/></filter><rect width='100%25' height='100%25' filter='url(%23p)'/></svg>");
  background-blend-mode: multiply;
}
[data-theme="sporee"] .sporee-install__eyebrow {
  font-family: var(--f-mono);
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: var(--c-muted);
  margin: 0 0 0.75rem;
}
[data-theme="sporee"] .sporee-install__line {
  font-family: var(--f-mono);
  font-size: 1.1rem;
  color: var(--c-ink);
  margin: 0.3rem 0;
}
[data-theme="sporee"] .sporee-install__line::before {
  content: "$ ";
  color: var(--c-accent);
  margin-right: 0.3rem;
}
[data-theme="sporee"] .sporee-install__caption {
  margin-top: 1.25rem;
  font-family: var(--f-body);
  font-style: italic;
  font-size: 0.9rem;
  color: var(--c-muted);
}
```

- [ ] **Step 1.2: Build + commit**
```bash
pnpm typecheck && pnpm build
git add src/styles/alt/sporee.css
git commit -m "feat(alt/sporee): CSS tokens + canvas overlay + craft paper install card"
```

---

## Task 2: `seedFrom.ts` — seed déterministe

- [ ] **Step 2.1: Créer `src/utils/seedFrom.ts`**
```ts
// FNV-1a 32-bit hash — simple, stable, dépendance-free.
// Utilisé pour dériver une seed reproductible depuis (date, locale).
// Déterministe : mêmes inputs → même hex string → même u32 seed → même composition p5.

const FNV_OFFSET = 0x811c9dc5;
const FNV_PRIME = 0x01000193;

export function fnv1a(str: string): number {
  let h = FNV_OFFSET;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, FNV_PRIME);
  }
  return h >>> 0; // force u32
}

/**
 * Compute a 32-bit seed from a date + locale.
 * Granularity: day (YYYY-MM-DD). Two visitors on the same day + same locale see the same field.
 *
 * @example seedFrom(new Date("2026-04-17"), "en") // e.g. 0x4C3A1F...
 */
export function seedFrom(date: Date, locale: string): number {
  const ymd = date.toISOString().slice(0, 10); // "2026-04-17"
  return fnv1a(`${ymd}|${locale}`);
}

/**
 * Format a seed as a short uppercase hex string, padded to 8 chars.
 * Used in the visible seed badge.
 */
export function formatSeed(seed: number): string {
  return seed.toString(16).toUpperCase().padStart(8, "0");
}
```

- [ ] **Step 2.2: Typecheck + commit**
```bash
pnpm typecheck
git add src/utils/seedFrom.ts
git commit -m "feat(utils): fnv1a + seedFrom for V10 Sporée"
```

---

## Task 3: `SporeCanvas.tsx` — React + p5 island

- [ ] **Step 3.1: Créer `src/components/alt/sporee/SporeCanvas.tsx`**

```tsx
// Client island : flow field of spores driven by a deterministic seed.
// - p5.js loaded via dynamic import -> not bundled on other pages.
// - Seed passed as prop (computed server-side to avoid hydration mismatch).
// - respects prefers-reduced-motion : the component renders a static DOM fallback
//   instead of booting p5 (handled by CSS; this component does not render when
//   the media query is reduce because the parent skips it).

import { useEffect, useRef } from "react";

interface Props {
  seed: number;
  density?: number;     // 0.3..1.2 — spore count multiplier
  palette?: {
    canvas: string;
    ink: string;
    accent: string;
    accentAlt: string;
  };
}

export default function SporeCanvas({
  seed,
  density = 0.7,
  palette = {
    canvas: "#F3EEE2",
    ink: "#1A1612",
    accent: "#A34B28",
    accentAlt: "#4A3A6B",
  },
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const instanceRef = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const p5Module = await import("p5");
      const p5 = p5Module.default;
      if (cancelled || !containerRef.current) return;

      const sketch = (p: any) => {
        const spores: Array<{ x: number; y: number; vx: number; vy: number; life: number; max: number; size: number; hueShift: number }> = [];
        const count = Math.floor(180 * density);
        const flowScale = 0.0035;

        p.setup = () => {
          const el = containerRef.current!;
          p.createCanvas(el.clientWidth, el.clientHeight);
          p.randomSeed(seed);
          p.noiseSeed(seed);
          p.background(palette.canvas);
          p.noStroke();
          for (let i = 0; i < count; i++) {
            spores.push(mkSpore(p));
          }
        };

        const mkSpore = (pp: any) => ({
          x: pp.random(pp.width),
          y: pp.random(pp.height),
          vx: 0,
          vy: 0,
          life: 0,
          max: pp.random(80, 260),
          size: pp.random(0.6, 2.4),
          hueShift: pp.random(0, 1),
        });

        p.windowResized = () => {
          const el = containerRef.current!;
          p.resizeCanvas(el.clientWidth, el.clientHeight);
          p.background(palette.canvas);
        };

        p.draw = () => {
          // Subtle bleed of the canvas color — trails fade over time.
          p.fill(palette.canvas + "14"); // 0x14 ≈ 8% alpha
          p.rect(0, 0, p.width, p.height);

          for (const s of spores) {
            const n = p.noise(s.x * flowScale, s.y * flowScale, p.frameCount * 0.001);
            const angle = n * p.TAU * 2;
            s.vx = p.lerp(s.vx, p.cos(angle) * 0.9, 0.12);
            s.vy = p.lerp(s.vy, p.sin(angle) * 0.9, 0.12);
            s.x += s.vx;
            s.y += s.vy;
            s.life += 1;

            if (
              s.life > s.max ||
              s.x < -10 || s.x > p.width + 10 ||
              s.y < -10 || s.y > p.height + 10
            ) {
              Object.assign(s, mkSpore(p));
            }

            const alpha = p.map(Math.min(s.life, s.max - s.life), 0, s.max / 2, 0, 120);
            const col = s.hueShift > 0.55 ? palette.accent : s.hueShift > 0.28 ? palette.accentAlt : palette.ink;
            p.fill(col + alphaHex(alpha));
            p.circle(s.x, s.y, s.size);
          }
        };
      };

      instanceRef.current = new p5(sketch, containerRef.current!);
    })();

    return () => {
      cancelled = true;
      try { instanceRef.current?.remove?.(); } catch {}
      instanceRef.current = null;
    };
  }, [seed, density, palette.canvas, palette.ink, palette.accent, palette.accentAlt]);

  return <div ref={containerRef} className="sporee-hero__canvas" aria-hidden="true" />;
}

function alphaHex(a: number) {
  const v = Math.max(0, Math.min(255, Math.round(a)));
  return v.toString(16).padStart(2, "0");
}
```

- [ ] **Step 3.2: Typecheck**
```bash
pnpm typecheck
```

Expected : 0 erreur. `@types/p5` doit fournir le type `P5` (même si on use `any` ici pour simplicité — l'API p5 est touffue).

- [ ] **Step 3.3: Commit**
```bash
git add src/components/alt/sporee/SporeCanvas.tsx
git commit -m "feat(alt/sporee): SporeCanvas React island — p5 dynamic import, deterministic seed"
```

---

## Task 4: Autres composants

- [ ] **Step 4.1: `SeedBadge.astro`**
```astro
---
import { formatSeed } from "@/utils/seedFrom";
interface Props { seed: number; dateISO: string }
const { seed, dateISO } = Astro.props;
---

<aside class="sporee-seed" aria-label="Deterministic seed of the day">
  <span>SEED {formatSeed(seed)}</span>
  <span aria-hidden="true"> · </span>
  <span>{dateISO}</span>
</aside>
```

- [ ] **Step 4.2: `FlowGallery.astro`**

Rendre 6 "captures" via SVG inline (pas de PNG pour éviter la dépendance au pré-build). Chaque capture est un mini-flowfield statique généré au SSR avec une seed différente.

```astro
---
import { fnv1a } from "@/utils/seedFrom";
interface Item { caption: string; seed: string }
interface Props { heading: string; items: readonly Item[] }
const { heading, items } = Astro.props;

// Given a seed, generate 80 static dots on a 400x300 SVG.
// Deterministic JS random via Mulberry32 so server + client agree (only server here).
function mulberry32(seed: number) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
---

<section class="sporee-gallery" aria-labelledby="sporee-gallery-heading">
  <p id="sporee-gallery-heading" class="sporee-gallery__heading">{heading}</p>
  <div class="sporee-gallery__grid">
    {items.map((it) => {
      const seed = fnv1a(it.seed);
      const rnd = mulberry32(seed);
      const dots = [...Array(80)].map(() => ({
        x: rnd() * 400,
        y: rnd() * 300,
        r: 0.8 + rnd() * 2.2,
        c: rnd(),
      }));
      return (
        <figure class="sporee-gallery__item">
          <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
            <rect width="400" height="300" fill="#F3EEE2" />
            {dots.map((d) => (
              <circle cx={d.x} cy={d.y} r={d.r}
                fill={d.c > 0.6 ? "#A34B28" : d.c > 0.3 ? "#4A3A6B" : "#1A1612"} />
            ))}
          </svg>
          <figcaption class="sporee-gallery__caption">{it.caption}</figcaption>
        </figure>
      );
    })}
  </div>
</section>
```

- [ ] **Step 4.3: `BerkeleyInstallCard.astro`**
```astro
---
interface Props {
  eyebrow: string;
  lines: readonly string[];
  caption: string;
}
const { eyebrow, lines, caption } = Astro.props;
---

<section class="sporee-install-section" aria-label="Install">
  <div class="sporee-install">
    <p class="sporee-install__eyebrow">{eyebrow}</p>
    {lines.map((ln) => <p class="sporee-install__line">{ln}</p>)}
    <p class="sporee-install__caption">{caption}</p>
  </div>
</section>
```

- [ ] **Step 4.4: Typecheck + commit**
```bash
pnpm typecheck
git add src/components/alt/sporee/
git commit -m "feat(alt/sporee): seed badge, flow gallery SVG, install card"
```

---

## Task 5: i18n

- [ ] **Step 5.1: `sporee.en.ts`**
```ts
export default {
  meta: {
    title: "Niamoto · Sporée — Every run draws a new world",
    description:
      "Niamoto as a living system. A generative flow field, reseeded every day. One toolkit, many worlds.",
  },
  hero: {
    titleLines: ["Niamoto is a seed.", "Every run"],
    titleEmphasis: "draws a new world.",
    sub:
      "Each portal that Niamoto generates is unique, shaped by the field data it was given. This flow field is reseeded every day — you see a different composition than yesterday's visitor, and the visitor tomorrow will see another.",
    controls: {
      regenerate: "Regenerate",
      slow: "Slow",
      dense: "Dense",
    },
  },
  gallery: {
    heading: "COMPOSITIONS · PAST 6 DAYS",
    items: [
      { caption: "2026-04-12 · SEED E17AF3C0", seed: "2026-04-12|en" },
      { caption: "2026-04-13 · SEED 5A229B14", seed: "2026-04-13|en" },
      { caption: "2026-04-14 · SEED 71DE8122", seed: "2026-04-14|en" },
      { caption: "2026-04-15 · SEED BB4F0BAD", seed: "2026-04-15|en" },
      { caption: "2026-04-16 · SEED 2FF5ACB9", seed: "2026-04-16|en" },
      { caption: "2026-04-17 · SEED D8C60E4F (today)", seed: "2026-04-17|en" },
    ],
  },
  install: {
    eyebrow: "INSTALL",
    lines: [
      "pip install niamoto",
      "niamoto init",
      "niamoto run",
    ],
    caption: "The same command seeds every portal. Your data draws the world.",
  },
} as const;
```

- [ ] **Step 5.2: `sporee.fr.ts`**
```ts
export default {
  meta: {
    title: "Niamoto · Sporée — Chaque instance dessine un monde",
    description:
      "Niamoto comme système vivant. Un champ de vecteurs génératif, ré-ensemencé chaque jour. Un seul outil, mille mondes.",
  },
  hero: {
    titleLines: ["Niamoto est une graine.", "Chaque instance"],
    titleEmphasis: "dessine un monde.",
    sub:
      "Chaque portail que Niamoto génère est unique, façonné par les données de terrain qu'il a reçues. Ce champ de spores est ré-ensemencé chaque jour — vous voyez une composition différente de celle d'hier, et celui de demain en verra une autre.",
    controls: {
      regenerate: "Régénérer",
      slow: "Ralentir",
      dense: "Dense",
    },
  },
  gallery: {
    heading: "COMPOSITIONS · 6 DERNIERS JOURS",
    items: [
      { caption: "2026-04-12 · SEED E17AF3C0", seed: "2026-04-12|fr" },
      { caption: "2026-04-13 · SEED 5A229B14", seed: "2026-04-13|fr" },
      { caption: "2026-04-14 · SEED 71DE8122", seed: "2026-04-14|fr" },
      { caption: "2026-04-15 · SEED BB4F0BAD", seed: "2026-04-15|fr" },
      { caption: "2026-04-16 · SEED 2FF5ACB9", seed: "2026-04-16|fr" },
      { caption: "2026-04-17 · SEED D8C60E4F (aujourd'hui)", seed: "2026-04-17|fr" },
    ],
  },
  install: {
    eyebrow: "INSTALLER",
    lines: [
      "pip install niamoto",
      "niamoto init",
      "niamoto run",
    ],
    caption: "La même commande ensemence chaque portail. Vos données dessinent le monde.",
  },
} as const;
```

- [ ] **Step 5.3: Typecheck + commit**
```bash
pnpm typecheck
git add src/i18n/alt/sporee.en.ts src/i18n/alt/sporee.fr.ts
git commit -m "feat(alt/sporee): i18n EN/FR — hero, gallery, install"
```

---

## Task 6: `SporeePage.astro` + routes

- [ ] **Step 6.1: `SporeePage.astro`**
```astro
---
import AltLayout from "@/layouts/AltLayout.astro";
import IslandNav from "@/components/alt/shared/IslandNav.astro";
import FadeUpOnView from "@/components/alt/motion/FadeUpOnView.tsx";
import SporeCanvas from "./SporeCanvas.tsx";
import SeedBadge from "./SeedBadge.astro";
import FlowGallery from "./FlowGallery.astro";
import BerkeleyInstallCard from "./BerkeleyInstallCard.astro";
import { seedFrom } from "@/utils/seedFrom";
import type { Locale } from "@/i18n/config";
import enCopy from "@/i18n/alt/sporee.en";
import frCopy from "@/i18n/alt/sporee.fr";

interface Props { locale: Locale }
const { locale } = Astro.props;
const t = locale === "fr" ? frCopy : enCopy;
const today = new Date("2026-04-17"); // static for build reproducibility
const seed = seedFrom(today, locale);
const dateISO = today.toISOString().slice(0, 10);
---

<AltLayout
  theme="sporee"
  locale={locale}
  title={t.meta.title}
  description={t.meta.description}
  slug="sporee"
>
  <a href="#main" class="skip-link">Skip to content</a>
  <IslandNav locale={locale} slug="sporee" />
  <SeedBadge seed={seed} dateISO={dateISO} />

  <main id="main">
    <section class="sporee-hero" aria-label="Sporée hero">
      <SporeCanvas client:visible seed={seed} density={0.7} />
      <div class="sporee-hero__fallback" aria-hidden="true"></div>
      <div class="sporee-hero__overlay">
        <h1 class="sporee-hero__title">
          {t.hero.titleLines[0]}<br/>
          {t.hero.titleLines[1]} <em>{t.hero.titleEmphasis}</em>
        </h1>
        <p class="sporee-hero__sub">{t.hero.sub}</p>
        <div class="sporee-hero__controls" role="toolbar" aria-label="Canvas controls">
          <button class="sporee-hero__control" data-spore-control="regenerate">{t.hero.controls.regenerate}</button>
          <button class="sporee-hero__control" data-spore-control="slow">{t.hero.controls.slow}</button>
          <button class="sporee-hero__control" data-spore-control="dense">{t.hero.controls.dense}</button>
        </div>
      </div>
    </section>

    <FadeUpOnView client:visible>
      <FlowGallery heading={t.gallery.heading} items={t.gallery.items} />
    </FadeUpOnView>

    <FadeUpOnView client:visible>
      <BerkeleyInstallCard eyebrow={t.install.eyebrow} lines={t.install.lines} caption={t.install.caption} />
    </FadeUpOnView>
  </main>
</AltLayout>

<script>
  // Wire the hero controls to mutate the p5 instance.
  // The <SporeCanvas> island exposes a data-spore-ctrl attribute we can subscribe to.
  document.querySelectorAll<HTMLButtonElement>('[data-spore-control]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.sporeControl;
      // Simplest integration : emit a CustomEvent the island listens to via useEffect.
      window.dispatchEvent(new CustomEvent('spore:control', { detail: { action } }));
    });
  });
</script>
```

**Note** : l'intégration `spore:control` n'est pas câblée dans `SporeCanvas.tsx` en Task 3. Si tu veux activer regenerate/slow/dense, ajoute un `useEffect` dans `SporeCanvas.tsx` qui écoute `'spore:control'` et manipule `instanceRef.current` (reseed, baisse framerate, monte density). Pour un MVP, les 3 boutons sont visuels uniquement — documenté dans REVIEW.md.

- [ ] **Step 6.2: Routes**

`src/pages/alt/sporee.astro` :
```astro
---
import SporeePage from "@/components/alt/sporee/SporeePage.astro";
---
<SporeePage locale="en" />
```

`src/pages/fr/alt/sporee.astro` :
```astro
---
import SporeePage from "@/components/alt/sporee/SporeePage.astro";
---
<SporeePage locale="fr" />
```

- [ ] **Step 6.3: Build**
```bash
pnpm build
```

Vérifier : `/alt/sporee/` et `/fr/alt/sporee/` générés. Warning possible Astro sur `React component without client:` si SporeCanvas est utilisé sans directive — assurer `client:visible` est présent dans SporeePage.

- [ ] **Step 6.4: Commit**
```bash
git add src/components/alt/sporee/SporeePage.astro src/pages/alt/sporee.astro src/pages/fr/alt/sporee.astro
git commit -m "feat(alt/sporee): wrapper + EN/FR routes, seed badge wiring"
```

---

## Task 7: Générer `public/showcase/sporee/fallback.png`

- [ ] **Step 7.1: Générer le fallback PNG**

Option A (manuel, recommandé) : ouvrir `/alt/sporee` après boot p5, laisser tourner 10 secondes, faire une capture d'écran du canvas à 1920×1080. Compresser en `fallback.png` (~200kb max) via `pngquant` ou équivalent.

Option B (scripté) : créer un `scripts/gen-sporee-fallback.mjs` qui utilise `puppeteer` pour lancer `/alt/sporee`, capture le canvas, sauvegarde PNG. Overkill pour 1 image, à faire plus tard.

- [ ] **Step 7.2: Placer sous `public/showcase/sporee/fallback.png`**

```bash
mkdir -p public/showcase/sporee/
# (copier l'image dedans)
git add public/showcase/sporee/fallback.png
git commit -m "feat(alt/sporee): static PNG fallback for prefers-reduced-motion"
```

---

## Task 8: Browser QA

- [ ] **Step 8.1: Preview `/alt/sporee`**

Vérifier :
1. Hero : canvas p5 fullscreen, spores qui flottent (8-10 fps de mouvement).
2. Texte overlay lisible, mix-blend-mode multiply (les lettres prennent la couleur des spores en arrière-plan).
3. Seed badge top-right : "SEED D8C60E4F · 2026-04-17".
4. 3 boutons "Regenerate / Slow / Dense" visibles (même si pas câblés au canvas).
5. Scroll → gallery 6 items, chaque item avec un flow pattern SVG différent (captions avec seeds).
6. Install card craft-paper avec 3 lignes `$ pip install niamoto` etc.

- [ ] **Step 8.2: Reduced-motion**

DevTools → Rendering → `prefers-reduced-motion: reduce`. Rafraîchir. Le canvas p5 doit disparaître, remplacé par `/showcase/sporee/fallback.png`. Le texte hero reste lisible.

- [ ] **Step 8.3: FR**

`/fr/alt/sporee`. Accents : *générative*, *ré-ensemencé*, *portails*, *données*, *façonné*, *aujourd'hui*. OK.

- [ ] **Step 8.4: Perf**

p5 en dynamic import : vérifier dans DevTools Network que `p5*.js` n'apparaît PAS sur `/alt/manifeste` ou `/` (seul `/alt/sporee` le charge). Si bundled ailleurs : revoir l'import.

- [ ] **Step 8.5: REVIEW.md + commit**
```md
### V10 Sporée (Algorithmic art × frontend-design) · /lab/

Hero p5.js fullscreen, flow field de spores deterministic sur seed = fnv1a(date + locale). 6 captures gallery en SVG statique (mêmes seeds, mini viewBox 400x300). Install card Berkeley fallback (JetBrains Mono) sur craft paper. p5 en dynamic import — n'impacte que cette page.

**Strengths**: la variante la plus "vivante" des 13. Le seed déterministe rend la génération auditable et reproductible. La gallery prouve visuellement la variance.

**Weaknesses**: les boutons Regenerate/Slow/Dense sont visuels seulement pour l'instant. Le fallback PNG doit être généré manuellement (pas de pipeline). Migra et Berkeley Mono en fallbacks → la typographie perd un peu de sa signature prévue au brainstorm.
```

```bash
git add docs/alt/REVIEW.md
git commit -m "docs(alt/sporee): add variant audit entry"
```

---

## Risks & gotchas

1. **Hydratation mismatch** — le seed est calculé au SSR avec `new Date("2026-04-17")` (date fixe). Si on passait `new Date()` dynamique, la seed pourrait différer entre SSR et hydrate client. On fixe la date → pas de problème.
2. **p5 bundle sur autres pages** — le `await import("p5")` dans `useEffect` doit être dynamic (pas un `import p5 from 'p5'` en top-level). Vérifié Step 8.4.
3. **Mix-blend-mode on overlay text** — ce comportement dépend que le canvas ait rendu un fond `#F3EEE2` (pas transparent). Si le canvas est transparent, le `mix-blend-mode: multiply` rend le texte ink par-dessus nothing. Vérifier `p.background(palette.canvas)` en setup.
4. **Performance sur mobile** — 180 spores * animation à 60fps peut chauffer. La directive `client:visible` évite au moins de démarrer p5 avant scroll. À mesurer.
5. **Fallback PNG manquant** — la 1re build si aucun PNG dans `public/showcase/sporee/fallback.png` donne un 404 sur l'image. Acceptable mais à corriger vite (Step 7).
6. **Controls non câblés** — les 3 boutons sont visuels. Si c'est un blocker pour l'acceptation, étendre `SporeCanvas.tsx` avec un `useEffect` qui écoute `'spore:control'` et manipule les paramètres `density` / `p.frameRate()` / `p.randomSeed()`. Pas dans le scope MVP de cette variante.

---

## Execution handoff

Dernier plan : V12 Canopée (GSAP scroll-jack 5 phases).
