# /alt/ Wave 2 — V12 Canopée Implementation Plan

> **For Claude:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Livrer `/alt/canopee` et `/fr/alt/canopee` (bac `/lab/`) — variante *gpt-taste × anti-slop*. Scroll-jack cinématique complet GSAP ScrollTrigger, **5 phases pinnées** : (1) Canopée — zoom avant sur feuillage SVG layered, (2) Sous-bois — 3 plateaux stacking, (3) Strate arbustive — data-viz en stroke-dasharray, (4) Strate herbacée — grid plugins sequential, (5) Sol — closing typewriter. Scroll total ~3000vh. Caméra descend dans la forêt. Anti-slop respecté malgré l'exubérance motion.

**Architecture:** GSAP ScrollTrigger coordonne 5 phases. Chaque phase est un `<section>` marked `data-canopy-stage="{1..5}"` avec une durée de pin définie. Une seule island React `CanopyStageController.tsx` initialise tous les ScrollTriggers une fois hydratée. SVG "feuillages" et "strates" en inline SVG avec classes CSS pour les transformations GSAP.

**Tech Stack:** Astro 5.6, React 19, **gsap@^3.12** (ScrollTrigger inclus, gratuit depuis fin 2024), **@gsap/react** (hook `useGSAP`). Aucune autre dep. Fraunces + Geist Mono déjà installés.

---

## Préalable

```bash
grep -q '"canopee"' src/layouts/AltLayout.astro
grep -q 'canopee:' src/i18n/alt/shared.en.ts
test -f src/styles/alt/canopee.css
node -e "require.resolve('gsap')" 2>&1
node -e "require.resolve('@gsap/react')" 2>&1
```

## File Structure

| Action | Path | Responsibility |
|---|---|---|
| Modify | `src/styles/alt/canopee.css` | Tokens night + phase layouts + GSAP-friendly classes. |
| Create | `src/i18n/alt/canopee.en.ts` | Copy pour les 5 phases. |
| Create | `src/i18n/alt/canopee.fr.ts` | FR. |
| Create | `src/components/alt/canopee/ForestPinController.tsx` | Client island — installe les 5 ScrollTriggers. |
| Create | `src/components/alt/canopee/Stage1Canopy.astro` | Phase 1 : feuillage SVG layered qui zoom. |
| Create | `src/components/alt/canopee/Stage2Understory.astro` | Phase 2 : 3 plateaux stacking. |
| Create | `src/components/alt/canopee/Stage3Shrub.astro` | Phase 3 : data-viz stroke-dasharray. |
| Create | `src/components/alt/canopee/Stage4Herb.astro` | Phase 4 : grid plugins sequential. |
| Create | `src/components/alt/canopee/Stage5Soil.astro` | Phase 5 : closing typewriter + CTA. |
| Create | `src/components/alt/canopee/CanopeePage.astro` | Wrapper — orchestration des 5 stages + controller island. |
| Create | `src/pages/alt/canopee.astro`, `src/pages/fr/alt/canopee.astro` | Routes. |

---

## Task 1: CSS scoped

- [ ] **Step 1.1: Remplacer le stub `canopee.css`**

```css
/* V12 Canopée — gpt-taste × anti-slop.
 * GSAP scroll-jack, 5 phases pinnées, caméra descend dans la forêt.
 * Palette :
 *   --c-canvas      #0A0E0B   night, slight green tint (pas pur #000)
 *   --c-ink         #D4E0D0   mist
 *   --c-muted       #7C8B7F   muted moss
 *   --c-accent      #5E8255   canopy
 *   --c-accent-alt  #C9A86A   understory (bronze)
 */

[data-theme="canopee"] {
  color-scheme: dark;

  --c-canvas: #0A0E0B;
  --c-ink: #D4E0D0;
  --c-muted: #7C8B7F;
  --c-accent: #5E8255;
  --c-accent-alt: #C9A86A;
  --c-surface: rgba(212, 224, 208, 0.04);
  --c-hairline: rgba(212, 224, 208, 0.1);
  --c-grain-opacity: 0.035;

  --f-display: "Fraunces Variable", Georgia, serif;
  --f-body: "Geist Variable", system-ui, -apple-system, sans-serif;
  --f-mono: "JetBrains Mono Variable", ui-monospace, SFMono-Regular, Menlo, monospace;

  --fvs-display: "opsz" 144, "wght" 700, "SOFT" 50, "WONK" 0;
  --fvs-body: "wght" 400;

  --ls-display: -0.05em;
  --ls-body: -0.005em;
  --lh-display: 0.98;
  --lh-body: 1.55;
}

[data-theme="canopee"] body {
  background-color: var(--c-canvas);
  background-image:
    radial-gradient(52rem 38rem at 20% 10%, rgba(94, 130, 85, 0.12), transparent 65%),
    radial-gradient(40rem 30rem at 85% 90%, rgba(201, 168, 106, 0.08), transparent 60%);
  background-attachment: fixed;
}

/* Stage wrappers — each pinned, heights set dynamically by ScrollTrigger. */
[data-theme="canopee"] .canopy-stage {
  position: relative;
  min-height: 100dvh;
  padding: 4rem 1.5rem;
  overflow: hidden;
}

/* Stage 1 — Canopy zoom. */
[data-theme="canopee"] .canopy-stage--1 .canopy-stage__title {
  font-family: var(--f-display);
  font-variation-settings: "opsz" 144, "wght" 700;
  font-size: clamp(3rem, 10vw, 10rem);
  color: var(--c-ink);
  line-height: 0.95;
  margin: 0;
  max-width: 14ch;
}
[data-theme="canopee"] .canopy-stage--1 .canopy-stage__title em {
  font-style: italic;
  color: var(--c-accent-alt);
}
[data-theme="canopee"] .canopy-layers {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
[data-theme="canopee"] .canopy-layer {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  will-change: transform, opacity;
}
[data-theme="canopee"] .canopy-layer svg {
  width: 120%;
  height: 120%;
  color: var(--c-accent);
}
[data-theme="canopee"] .canopy-layer--far    { color: color-mix(in srgb, var(--c-accent) 50%, transparent); }
[data-theme="canopee"] .canopy-layer--mid    { color: color-mix(in srgb, var(--c-accent) 75%, transparent); }
[data-theme="canopee"] .canopy-layer--near   { color: var(--c-accent); }

/* Stage 2 — Understory plateaux. */
[data-theme="canopee"] .canopy-stage--2 .canopy-plateau {
  padding: 3rem 0;
  border-bottom: 1px solid var(--c-hairline);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
  will-change: transform;
}
@media (max-width: 900px) {
  [data-theme="canopee"] .canopy-stage--2 .canopy-plateau { grid-template-columns: 1fr; }
}
[data-theme="canopee"] .canopy-plateau__title {
  font-family: var(--f-display);
  font-variation-settings: "opsz" 144, "wght" 500;
  font-size: clamp(2rem, 4vw, 3.5rem);
  color: var(--c-ink);
}
[data-theme="canopee"] .canopy-plateau__body {
  color: var(--c-muted);
  line-height: 1.6;
}
[data-theme="canopee"] .canopy-plateau__figure {
  aspect-ratio: 4 / 3;
  background: color-mix(in srgb, var(--c-accent) 20%, transparent);
  border: 1px solid var(--c-hairline);
  border-radius: 0.75rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
[data-theme="canopee"] .canopy-plateau__figure svg {
  width: 80%;
  height: 80%;
  color: var(--c-accent);
  opacity: 0.7;
}

/* Stage 3 — Data-viz stroke-dasharray lines build in on scroll. */
[data-theme="canopee"] .canopy-stage--3 .canopy-viz {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 3rem;
  align-items: center;
}
@media (max-width: 900px) {
  [data-theme="canopee"] .canopy-stage--3 .canopy-viz { grid-template-columns: 1fr; }
}
[data-theme="canopee"] .canopy-viz__svg {
  width: 100%;
  height: 360px;
}
[data-theme="canopee"] .canopy-viz__line {
  fill: none;
  stroke: var(--c-accent-alt);
  stroke-width: 1.5;
  stroke-dasharray: 1200;
  stroke-dashoffset: 1200;
  stroke-linecap: round;
}
[data-theme="canopee"] .canopy-viz__line--secondary {
  stroke: var(--c-accent);
}

/* Stage 4 — Plugins grid sequential. */
[data-theme="canopee"] .canopy-stage--4 .canopy-plugins {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}
@media (max-width: 900px) {
  [data-theme="canopee"] .canopy-stage--4 .canopy-plugins { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 600px) {
  [data-theme="canopee"] .canopy-stage--4 .canopy-plugins { grid-template-columns: 1fr; }
}
[data-theme="canopee"] .canopy-plugin {
  padding: 1.25rem;
  background: var(--c-surface);
  border: 1px solid var(--c-hairline);
  border-radius: 0.75rem;
  opacity: 0;
  transform: translateY(20px);
  will-change: opacity, transform;
}
[data-theme="canopee"] .canopy-plugin__name {
  font-family: var(--f-mono);
  font-size: 0.85rem;
  color: var(--c-accent-alt);
  margin: 0 0 0.5rem;
}
[data-theme="canopee"] .canopy-plugin__body {
  color: var(--c-ink);
  font-size: 0.9rem;
  line-height: 1.55;
}

/* Stage 5 — Closing + terminal typewriter. */
[data-theme="canopee"] .canopy-stage--5 {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
[data-theme="canopee"] .canopy-stage--5 .canopy-closing__quote {
  font-family: var(--f-display);
  font-variation-settings: "opsz" 144, "wght" 500;
  font-style: italic;
  font-size: clamp(2rem, 4vw, 3.25rem);
  color: var(--c-ink);
  max-width: 24ch;
  line-height: 1.1;
  margin: 0 auto 2rem;
}
[data-theme="canopee"] .canopy-stage--5 .canopy-terminal {
  font-family: var(--f-mono);
  font-size: 1.15rem;
  color: var(--c-accent);
  background: color-mix(in srgb, var(--c-accent) 12%, transparent);
  padding: 1rem 1.5rem;
  border: 1px solid color-mix(in srgb, var(--c-accent) 35%, transparent);
  border-radius: 0.5rem;
  min-height: 2.5rem;
  display: inline-block;
}
[data-theme="canopee"] .canopy-stage--5 .canopy-terminal__cursor {
  display: inline-block;
  width: 0.5ch;
  height: 1em;
  background: var(--c-accent);
  vertical-align: middle;
  margin-left: 0.1em;
  animation: canopy-blink 1s steps(2) infinite;
}
@keyframes canopy-blink {
  50% { opacity: 0; }
}

/* Stage markers / progress rail (decorative). */
[data-theme="canopee"] .canopy-progress {
  position: fixed;
  top: 50%;
  right: 1.5rem;
  transform: translateY(-50%);
  z-index: 20;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  pointer-events: none;
}
[data-theme="canopee"] .canopy-progress__item {
  font-family: var(--f-mono);
  font-size: 0.65rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--c-muted);
  opacity: 0.5;
  transition: opacity 320ms, color 320ms;
}
[data-theme="canopee"] .canopy-progress__item--active {
  color: var(--c-accent-alt);
  opacity: 1;
}

/* Reduced-motion : fallback linéaire classique. Voir Task 6. */
@media (max-width: 900px), (prefers-reduced-motion: reduce) {
  [data-theme="canopee"] .canopy-stage { min-height: auto; padding: 4rem 1.5rem; }
  [data-theme="canopee"] .canopy-viz__line { stroke-dashoffset: 0; }
  [data-theme="canopee"] .canopy-plugin { opacity: 1; transform: none; }
  [data-theme="canopee"] .canopy-progress { display: none; }
}
```

- [ ] **Step 1.2: Build + commit**
```bash
pnpm typecheck && pnpm build
git add src/styles/alt/canopee.css
git commit -m "feat(alt/canopee): CSS tokens + 5-stage layouts + reduced-motion fallback"
```

---

## Task 2: i18n EN + FR

- [ ] **Step 2.1: `canopee.en.ts`**
```ts
export default {
  meta: {
    title: "Niamoto · Canopée — A forest, from canopy to soil",
    description:
      "A vertical scroll through a forest, canopy to soil, with Niamoto as the lens. Five strata, one toolkit, one open licence.",
  },
  stage1: {
    title: "A forest,",
    titleEmphasis: "canopy to soil.",
    caption: "CANOPY · STRATA I",
  },
  stage2: {
    eyebrow: "UNDERSTORY · STRATA II",
    plateaux: [
      {
        title: "A toolkit, not a platform.",
        body: "Niamoto is installed on your laptop, runs against your data, publishes to your server. No account to create. No signup page. No uptime to worry about.",
      },
      {
        title: "Every portal, a static site.",
        body: "What ships is plain HTML. It outlives the grant that funded the project. It reads without JavaScript. It survives three hosting migrations.",
      },
      {
        title: "The pipeline is yours.",
        body: "Transforms, exports, taxonomies, plugins — all versioned in your repo. The moment the project ends, the portal keeps serving.",
      },
    ],
  },
  stage3: {
    eyebrow: "SHRUB · STRATA III",
    heading: "Counted, plotted, shared.",
    body: "Three forests in, over a decade of measurements. The data doesn't live in a silo — every plot, every tree, every taxon, accessible offline.",
    legend: [
      { label: "Taxa indexed",  value: "1,208" },
      { label: "Plots covered", value: "509"   },
      { label: "Trees measured",value: "70,412"},
    ],
  },
  stage4: {
    eyebrow: "HERB · STRATA IV",
    heading: "Forty-two plugins, one runtime.",
    plugins: [
      { name: "niamoto.transform",  body: "Move columns between raw field notes and the portal schema." },
      { name: "niamoto.export",     body: "Emit HTML, JSON, GeoJSON, static shapefiles — whatever the field wants." },
      { name: "niamoto.taxonomy",   body: "Reconcile names across IRD, Kew, GBIF sources in a single pass." },
      { name: "niamoto.plot",       body: "Build plot-level summaries — biodiversity, basal area, DBH histograms." },
      { name: "niamoto.tree",       body: "Per-tree narratives. Rarity flags. Endemism badges." },
      { name: "niamoto.viewer",     body: "Static map + taxon browser. Offline-friendly. No API keys." },
      { name: "niamoto.theme",      body: "Swap the design system. Same data, different skin." },
      { name: "niamoto.watch",      body: "Detect schema drift between field campaigns." },
    ],
  },
  stage5: {
    quote: "One toolkit. One install. One licence. The forest does the rest.",
    terminal: "pip install niamoto",
    ctaPrimary: { label: "Clone the repo", href: "https://github.com/niamoto/niamoto" },
  },
  progress: [
    "CANOPY",
    "UNDERSTORY",
    "SHRUB",
    "HERB",
    "SOIL",
  ],
} as const;
```

- [ ] **Step 2.2: `canopee.fr.ts`**
```ts
export default {
  meta: {
    title: "Niamoto · Canopée — Une forêt, de la canopée au sol",
    description:
      "Un scroll vertical à travers une forêt, de la canopée au sol, avec Niamoto comme lentille. Cinq strates, un outil, une licence ouverte.",
  },
  stage1: {
    title: "Une forêt,",
    titleEmphasis: "de la canopée au sol.",
    caption: "CANOPÉE · STRATE I",
  },
  stage2: {
    eyebrow: "SOUS-BOIS · STRATE II",
    plateaux: [
      {
        title: "Un outil, pas une plateforme.",
        body: "Niamoto s'installe sur votre laptop, tourne sur vos données, publie sur votre serveur. Pas de compte à créer. Pas de page d'inscription. Pas d'uptime à surveiller.",
      },
      {
        title: "Chaque portail, un site statique.",
        body: "Ce qui sort, c'est du HTML ordinaire. Il survit à la subvention qui a financé le projet. Il se lit sans JavaScript. Il passe trois migrations d'hébergement.",
      },
      {
        title: "Le pipeline vous appartient.",
        body: "Transformations, exports, taxonomies, plugins — tout est versionné dans votre dépôt. Le projet termine, le portail continue de servir.",
      },
    ],
  },
  stage3: {
    eyebrow: "STRATE ARBUSTIVE · STRATE III",
    heading: "Comptés, cartographiés, partagés.",
    body: "Trois forêts couvertes, plus d'une décennie de mesures. Les données ne vivent pas dans un silo — chaque parcelle, chaque arbre, chaque taxon, accessible hors-ligne.",
    legend: [
      { label: "Taxons indexés",    value: "1 208"  },
      { label: "Parcelles couvertes", value: "509"    },
      { label: "Arbres mesurés",    value: "70 412" },
    ],
  },
  stage4: {
    eyebrow: "STRATE HERBACÉE · STRATE IV",
    heading: "Quarante-deux plugins, un seul runtime.",
    plugins: [
      { name: "niamoto.transform",  body: "Déplace les colonnes entre les notes de terrain brutes et le schéma du portail." },
      { name: "niamoto.export",     body: "Sort du HTML, JSON, GeoJSON, shapefiles statiques — selon ce que le terrain demande." },
      { name: "niamoto.taxonomy",   body: "Réconcilie les noms entre les sources IRD, Kew, GBIF en une seule passe." },
      { name: "niamoto.plot",       body: "Construit les résumés par parcelle — biodiversité, surface terrière, histogrammes DBH." },
      { name: "niamoto.tree",       body: "Narratifs par arbre. Signaux de rareté. Badges d'endémisme." },
      { name: "niamoto.viewer",     body: "Carte statique + navigateur de taxons. Utilisable hors-ligne. Aucune clé API." },
      { name: "niamoto.theme",      body: "Change le système de design. Mêmes données, autre habillage." },
      { name: "niamoto.watch",      body: "Détecte les dérives de schéma entre campagnes de terrain." },
    ],
  },
  stage5: {
    quote: "Un outil. Une installation. Une licence. La forêt fait le reste.",
    terminal: "pip install niamoto",
    ctaPrimary: { label: "Cloner le dépôt", href: "https://github.com/niamoto/niamoto" },
  },
  progress: [
    "CANOPÉE",
    "SOUS-BOIS",
    "ARBUSTIVE",
    "HERBACÉE",
    "SOL",
  ],
} as const;
```

- [ ] **Step 2.3: Typecheck + commit**
```bash
pnpm typecheck
git add src/i18n/alt/canopee.en.ts src/i18n/alt/canopee.fr.ts
git commit -m "feat(alt/canopee): i18n EN/FR — 5 stages copy"
```

---

## Task 3: `ForestPinController.tsx` — GSAP client island

- [ ] **Step 3.1: Créer le controller**
```tsx
// Client island : installs all ScrollTriggers for the 5 forest stages.
// Runs once after hydration. Reads `data-canopy-stage` attributes on sibling <section>s.
// Kills all triggers on unmount (React StrictMode double-mount safe).

import { useEffect, useRef, useState } from "react";

interface Props {
  /** Labels shown in the progress rail (5 entries). */
  progressLabels: readonly string[];
}

export default function ForestPinController({ progressLabels }: Props) {
  const installedRef = useRef(false);
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    // Guard : desktop wide enough + no reduced-motion preference.
    const mq = window.matchMedia("(min-width: 900px) and (prefers-reduced-motion: no-preference)");
    if (!mq.matches) return;

    let gsap: any, ScrollTrigger: any;
    let triggers: any[] = [];
    let cancelled = false;

    (async () => {
      const gsapMod = await import("gsap");
      const stMod = await import("gsap/ScrollTrigger");
      if (cancelled) return;

      gsap = gsapMod.default ?? gsapMod;
      ScrollTrigger = stMod.ScrollTrigger ?? stMod.default ?? stMod;
      gsap.registerPlugin(ScrollTrigger);

      if (installedRef.current) return;
      installedRef.current = true;

      // --- Stage 1: canopy zoom ---
      const stage1 = document.querySelector<HTMLElement>('[data-canopy-stage="1"]');
      if (stage1) {
        triggers.push(ScrollTrigger.create({
          trigger: stage1,
          start: "top top",
          end: "+=600vh",
          pin: true,
          scrub: 0.6,
          onUpdate: (self: any) => setActiveStage(0),
          animation: gsap.timeline()
            .to(stage1.querySelectorAll(".canopy-layer--far"), { scale: 1.4, opacity: 0 }, 0)
            .to(stage1.querySelectorAll(".canopy-layer--mid"), { scale: 1.7, opacity: 0 }, 0)
            .to(stage1.querySelectorAll(".canopy-layer--near"), { scale: 2.1, opacity: 0 }, 0)
            .to(stage1.querySelector(".canopy-stage__title"), { y: -40, opacity: 0 }, 0.3),
        }));
      }

      // --- Stage 2: understory plateaux stack ---
      const stage2 = document.querySelector<HTMLElement>('[data-canopy-stage="2"]');
      if (stage2) {
        const plateaux = stage2.querySelectorAll<HTMLElement>(".canopy-plateau");
        triggers.push(ScrollTrigger.create({
          trigger: stage2,
          start: "top top",
          end: `+=${plateaux.length * 50}vh`,
          pin: true,
          scrub: 0.6,
          onEnter: () => setActiveStage(1),
          onEnterBack: () => setActiveStage(1),
          animation: gsap.timeline().from(plateaux, {
            yPercent: 60,
            opacity: 0,
            stagger: 0.35,
            ease: "power2.out",
          }),
        }));
      }

      // --- Stage 3: data-viz stroke-dasharray ---
      const stage3 = document.querySelector<HTMLElement>('[data-canopy-stage="3"]');
      if (stage3) {
        const lines = stage3.querySelectorAll<SVGPathElement>(".canopy-viz__line");
        triggers.push(ScrollTrigger.create({
          trigger: stage3,
          start: "top top",
          end: "+=400vh",
          pin: true,
          scrub: 0.6,
          onEnter: () => setActiveStage(2),
          onEnterBack: () => setActiveStage(2),
          animation: gsap.timeline().to(lines, {
            strokeDashoffset: 0,
            stagger: 0.15,
            ease: "power1.out",
          }),
        }));
      }

      // --- Stage 4: plugins sequential reveal ---
      const stage4 = document.querySelector<HTMLElement>('[data-canopy-stage="4"]');
      if (stage4) {
        const plugins = stage4.querySelectorAll<HTMLElement>(".canopy-plugin");
        triggers.push(ScrollTrigger.create({
          trigger: stage4,
          start: "top top",
          end: `+=${plugins.length * 25}vh`,
          pin: true,
          scrub: 0.6,
          onEnter: () => setActiveStage(3),
          onEnterBack: () => setActiveStage(3),
          animation: gsap.timeline().to(plugins, {
            opacity: 1,
            y: 0,
            stagger: 0.2,
            ease: "power2.out",
          }),
        }));
      }

      // --- Stage 5: soil terminal typewriter ---
      const stage5 = document.querySelector<HTMLElement>('[data-canopy-stage="5"]');
      if (stage5) {
        const terminal = stage5.querySelector<HTMLElement>(".canopy-terminal__text");
        triggers.push(ScrollTrigger.create({
          trigger: stage5,
          start: "top 70%",
          onEnter: () => {
            setActiveStage(4);
            if (terminal) {
              const fullText = terminal.dataset.fullText ?? terminal.textContent ?? "";
              terminal.textContent = "";
              let i = 0;
              const iv = setInterval(() => {
                terminal.textContent = fullText.slice(0, ++i);
                if (i >= fullText.length) clearInterval(iv);
              }, 55);
            }
          },
          onEnterBack: () => setActiveStage(4),
        }));
      }

      // Force-refresh after inserting pins.
      ScrollTrigger.refresh();
    })();

    return () => {
      cancelled = true;
      triggers.forEach((t) => { try { t.kill(); } catch {} });
      triggers = [];
      installedRef.current = false;
    };
  }, []);

  return (
    <nav class="canopy-progress" aria-label="Forest strata progress">
      {progressLabels.map((label, i) => (
        <span key={i} class={`canopy-progress__item${i === activeStage ? " canopy-progress__item--active" : ""}`}>
          {String(i + 1).padStart(2, "0")} · {label}
        </span>
      ))}
    </nav>
  );
}
```

**Note React/Preact/Astro** : Astro React renderer utilise JSX, donc `class` s'écrit `className` dans les composants React typiques. Si Astro est configuré en preact ou standard, ajuster `class` → `className`.

- [ ] **Step 3.2: Corriger `class` → `className` si nécessaire**

Astro utilise `@astrojs/react` (confirmé dans `package.json`). En React, les attributs JSX utilisent `className`, pas `class`. Rectifier le JSX ci-dessus :

```tsx
<nav className="canopy-progress" aria-label="Forest strata progress">
  {progressLabels.map((label, i) => (
    <span key={i} className={`canopy-progress__item${i === activeStage ? " canopy-progress__item--active" : ""}`}>
      {String(i + 1).padStart(2, "0")} · {label}
    </span>
  ))}
</nav>
```

- [ ] **Step 3.3: Typecheck + commit**
```bash
pnpm typecheck
git add src/components/alt/canopee/ForestPinController.tsx
git commit -m "feat(alt/canopee): ForestPinController GSAP island for 5-phase scroll-jack"
```

---

## Task 4: Stage components

- [ ] **Step 4.1: `Stage1Canopy.astro`**
```astro
---
interface Props { title: string; titleEmphasis: string; caption: string }
const { title, titleEmphasis, caption } = Astro.props;

// SVG "leaves" layered canvas: 3 layers (far, mid, near) with staggered rotations.
// Each layer is a different scale of the same bunch-of-leaves shape.
const leafPaths = [
  "M 80 40 Q 50 60, 45 90 Q 55 115, 80 110 Q 105 115, 115 90 Q 110 60, 80 40 Z",
  "M 140 80 Q 110 100, 105 130 Q 115 155, 140 150 Q 165 155, 175 130 Q 170 100, 140 80 Z",
  "M 220 60 Q 190 80, 185 110 Q 195 135, 220 130 Q 245 135, 255 110 Q 250 80, 220 60 Z",
];
---

<section class="canopy-stage canopy-stage--1" data-canopy-stage="1" aria-labelledby="canopy-stage-1-title">
  <div class="canopy-layers" aria-hidden="true">
    {["far", "mid", "near"].map((depth, i) => (
      <div class={`canopy-layer canopy-layer--${depth}`} data-layer-depth={depth}>
        <svg viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice">
          {[0, 1, 2, 3, 4].map((col) => (
            <g transform={`translate(${col * 120 - 60} 0)`}>
              {leafPaths.map((d, li) => (
                <path d={d} fill="currentColor" fill-opacity={0.4 + 0.15 * i} />
              ))}
            </g>
          ))}
        </svg>
      </div>
    ))}
  </div>
  <div style="position: relative; z-index: 2; max-width: 1200px; margin: 0 auto; padding: 20vh 0;">
    <p style="font-family: var(--f-mono); font-size: 0.7rem; letter-spacing: 0.2em; color: var(--c-muted); margin: 0 0 2rem;">{caption}</p>
    <h1 id="canopy-stage-1-title" class="canopy-stage__title">
      {title} <em>{titleEmphasis}</em>
    </h1>
  </div>
</section>
```

- [ ] **Step 4.2: `Stage2Understory.astro`**
```astro
---
interface Plateau { title: string; body: string }
interface Props { eyebrow: string; plateaux: readonly Plateau[] }
const { eyebrow, plateaux } = Astro.props;
---

<section class="canopy-stage canopy-stage--2" data-canopy-stage="2" aria-label={eyebrow}>
  <div style="max-width: 1200px; margin: 0 auto;">
    <p style="font-family: var(--f-mono); font-size: 0.7rem; letter-spacing: 0.2em; color: var(--c-accent-alt); margin: 4rem 0 2rem;">{eyebrow}</p>
    {plateaux.map((p, i) => (
      <article class="canopy-plateau">
        <div>
          <h2 class="canopy-plateau__title">{p.title}</h2>
          <p class="canopy-plateau__body">{p.body}</p>
        </div>
        <div class="canopy-plateau__figure" aria-hidden="true">
          <svg viewBox="0 0 120 90" fill="none" stroke="currentColor" stroke-width="1">
            <path d="M 10 80 C 30 40, 60 30, 110 60 M 20 75 L 100 55 M 30 68 L 90 55" />
          </svg>
        </div>
      </article>
    ))}
  </div>
</section>
```

- [ ] **Step 4.3: `Stage3Shrub.astro`**
```astro
---
interface LegendItem { label: string; value: string }
interface Props { eyebrow: string; heading: string; body: string; legend: readonly LegendItem[] }
const { eyebrow, heading, body, legend } = Astro.props;
---

<section class="canopy-stage canopy-stage--3" data-canopy-stage="3" aria-label={eyebrow}>
  <div style="max-width: 1280px; margin: 0 auto; padding: 6rem 0;">
    <p style="font-family: var(--f-mono); font-size: 0.7rem; letter-spacing: 0.2em; color: var(--c-accent-alt); margin-bottom: 2rem;">{eyebrow}</p>
    <div class="canopy-viz">
      <div>
        <h2 style="font-family: var(--f-display); font-variation-settings: 'opsz' 144, 'wght' 500; font-size: clamp(2rem, 4vw, 3rem); color: var(--c-ink); margin: 0 0 1.5rem;">{heading}</h2>
        <p style="color: var(--c-muted); line-height: 1.6; max-width: 40ch;">{body}</p>
        <ul style="list-style: none; padding: 0; margin: 2rem 0 0; display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          {legend.map((li) => (
            <li style="padding-top: 0.75rem; border-top: 1px solid var(--c-hairline);">
              <p style="font-family: var(--f-mono); font-variant-numeric: tabular-nums; font-size: 1.6rem; color: var(--c-accent-alt); margin: 0 0 0.25rem;">{li.value}</p>
              <p style="font-family: var(--f-mono); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.14em; color: var(--c-muted); margin: 0;">{li.label}</p>
            </li>
          ))}
        </ul>
      </div>
      <svg class="canopy-viz__svg" viewBox="0 0 600 360" aria-hidden="true">
        {/* Two decorative curves that build in via stroke-dasharray. */}
        <path class="canopy-viz__line" d="M 30 300 C 120 260, 200 220, 300 200 S 450 160, 570 140" />
        <path class="canopy-viz__line canopy-viz__line--secondary" d="M 30 320 C 140 290, 220 270, 320 240 S 460 200, 570 180" />
        <path class="canopy-viz__line" d="M 30 340 C 150 320, 240 300, 340 280 S 480 240, 570 220" />
      </svg>
    </div>
  </div>
</section>
```

- [ ] **Step 4.4: `Stage4Herb.astro`**
```astro
---
interface Plugin { name: string; body: string }
interface Props { eyebrow: string; heading: string; plugins: readonly Plugin[] }
const { eyebrow, heading, plugins } = Astro.props;
---

<section class="canopy-stage canopy-stage--4" data-canopy-stage="4" aria-label={eyebrow}>
  <div style="max-width: 1280px; margin: 0 auto; padding: 6rem 0;">
    <p style="font-family: var(--f-mono); font-size: 0.7rem; letter-spacing: 0.2em; color: var(--c-accent-alt); margin-bottom: 2rem;">{eyebrow}</p>
    <h2 style="font-family: var(--f-display); font-variation-settings: 'opsz' 144, 'wght' 500; font-size: clamp(2rem, 4vw, 3rem); color: var(--c-ink); margin: 0 0 2.5rem; max-width: 22ch;">{heading}</h2>
    <div class="canopy-plugins">
      {plugins.map((p) => (
        <article class="canopy-plugin">
          <p class="canopy-plugin__name">{p.name}</p>
          <p class="canopy-plugin__body">{p.body}</p>
        </article>
      ))}
    </div>
  </div>
</section>
```

- [ ] **Step 4.5: `Stage5Soil.astro`**
```astro
---
interface Props {
  quote: string;
  terminal: string;
  ctaPrimary: { label: string; href: string };
}
const { quote, terminal, ctaPrimary } = Astro.props;
---

<section class="canopy-stage canopy-stage--5" data-canopy-stage="5" aria-label="Soil">
  <p class="canopy-closing__quote">&ldquo;{quote}&rdquo;</p>
  <p class="canopy-terminal">
    <span class="canopy-terminal__text" data-full-text={terminal}>{terminal}</span>
    <span class="canopy-terminal__cursor" aria-hidden="true"></span>
  </p>
  <p style="margin-top: 2rem;">
    <a href={ctaPrimary.href} style="font-family: var(--f-body); font-size: 1rem; color: var(--c-accent-alt); text-decoration: underline;">
      {ctaPrimary.label} →
    </a>
  </p>
</section>
```

- [ ] **Step 4.6: Typecheck + commit**
```bash
pnpm typecheck
git add src/components/alt/canopee/
git commit -m "feat(alt/canopee): 5 stage components (canopy, understory, shrub, herb, soil)"
```

---

## Task 5: `CanopeePage.astro` + routes

- [ ] **Step 5.1: `CanopeePage.astro`**
```astro
---
import AltLayout from "@/layouts/AltLayout.astro";
import IslandNav from "@/components/alt/shared/IslandNav.astro";
import ForestPinController from "./ForestPinController.tsx";
import Stage1Canopy from "./Stage1Canopy.astro";
import Stage2Understory from "./Stage2Understory.astro";
import Stage3Shrub from "./Stage3Shrub.astro";
import Stage4Herb from "./Stage4Herb.astro";
import Stage5Soil from "./Stage5Soil.astro";
import type { Locale } from "@/i18n/config";
import enCopy from "@/i18n/alt/canopee.en";
import frCopy from "@/i18n/alt/canopee.fr";

interface Props { locale: Locale }
const { locale } = Astro.props;
const t = locale === "fr" ? frCopy : enCopy;
---

<AltLayout
  theme="canopee"
  locale={locale}
  title={t.meta.title}
  description={t.meta.description}
  slug="canopee"
>
  <a href="#main" class="skip-link">Skip to content</a>
  <IslandNav locale={locale} slug="canopee" />

  <ForestPinController client:idle progressLabels={t.progress} />

  <main id="main">
    <Stage1Canopy
      title={t.stage1.title}
      titleEmphasis={t.stage1.titleEmphasis}
      caption={t.stage1.caption}
    />
    <Stage2Understory eyebrow={t.stage2.eyebrow} plateaux={t.stage2.plateaux} />
    <Stage3Shrub
      eyebrow={t.stage3.eyebrow}
      heading={t.stage3.heading}
      body={t.stage3.body}
      legend={t.stage3.legend}
    />
    <Stage4Herb eyebrow={t.stage4.eyebrow} heading={t.stage4.heading} plugins={t.stage4.plugins} />
    <Stage5Soil
      quote={t.stage5.quote}
      terminal={t.stage5.terminal}
      ctaPrimary={t.stage5.ctaPrimary}
    />
  </main>
</AltLayout>
```

- [ ] **Step 5.2: Routes**

`src/pages/alt/canopee.astro` :
```astro
---
import CanopeePage from "@/components/alt/canopee/CanopeePage.astro";
---
<CanopeePage locale="en" />
```

`src/pages/fr/alt/canopee.astro` :
```astro
---
import CanopeePage from "@/components/alt/canopee/CanopeePage.astro";
---
<CanopeePage locale="fr" />
```

- [ ] **Step 5.3: Build**
```bash
pnpm build
```

Expected: 2 pages additionnelles. Aucune erreur.

- [ ] **Step 5.4: Commit**
```bash
git add src/components/alt/canopee/CanopeePage.astro src/pages/alt/canopee.astro src/pages/fr/alt/canopee.astro
git commit -m "feat(alt/canopee): wrapper + EN/FR routes + pin controller wiring"
```

---

## Task 6: Browser QA — the big test

- [ ] **Step 6.1: Preview `/alt/canopee` desktop**

Vérifier :
1. **Stage 1** : feuillage 3-layer visible dès le load. Scroll → les 3 layers zoomaient (far scale 1.4, near scale 2.1), titre fade-out. Pin tient 600vh de scroll.
2. **Stage 2** : pin, plateaux entrent un par un en scrub (yPercent 60 → 0). Pin tient 150vh.
3. **Stage 3** : pin, 3 lignes SVG se dessinent (stroke-dashoffset 1200 → 0) en scrub. Pin tient 400vh.
4. **Stage 4** : pin, 8 plugins apparaissent séquentiellement (opacity + yPx).
5. **Stage 5** : pas de pin, à l'entrée, terminal "pip install niamoto" se typewrite.
6. **Progress rail** droite : 5 items `01 · CANOPY` etc., celui actif en bronze.
7. **Mobile (<900px)** : tous les stages deviennent un scroll vertical normal, pas de pin. Rail masqué. Plugins et lines visibles directement.

- [ ] **Step 6.2: Preview `/fr/alt/canopee`**

Accents : *forêt*, *canopée*, *subvention*, *taxonomies*, *décennie*, *générative* (non, n'y est pas), *herbacée*, *arbustive*. OK.

- [ ] **Step 6.3: Reduced-motion**

DevTools → `prefers-reduced-motion: reduce`. Rafraîchir. Le controller détecte la préférence et skip l'init GSAP. Le CSS fallback prend le relais : `.canopy-plugin { opacity: 1; transform: none }` etc. La page reste utilisable en scroll classique.

- [ ] **Step 6.4: Perf**

Ouvrir DevTools Performance, scroll de haut en bas. Vérifier :
- 60fps sur les scrub (pas de layout thrashing).
- `will-change: transform, opacity` sur les layers.
- GSAP bundle chargé sur `/alt/canopee` seulement, pas sur `/alt/manifeste`.

- [ ] **Step 6.5: REVIEW.md + commit**
```md
### V12 Canopée (gpt-taste × anti-slop) · /lab/

Scroll-jack cinématique complet, GSAP ScrollTrigger, 5 phases pinnées (canopée → sol). Caméra zoom avant sur feuillage SVG, 3 plateaux de sous-bois stacking, 3 lignes stroke-dasharray, 8 plugins sequential, terminal typewriter au sol. Progress rail droite.

**Strengths**: la plus cinéma des 13 variantes. Le scroll-jack donne un rythme narratif que le scroll normal ne permet pas. Palette night sans gradient AI (anti-slop respecté).

**Weaknesses**: scroll-jack peut dérouter — certains visiteurs tenteront d'accélérer au molette et sentiront la friction. À accepter pour le registre /lab/. Le rail de progression est décoratif, pas cliquable (pourrait être interactif dans un v2).

**Perf**: GSAP + ScrollTrigger = ~80kb gzip chargés dynamically. Impact nul sur les autres pages.
```

```bash
git add docs/alt/REVIEW.md
git commit -m "docs(alt/canopee): add variant audit entry"
```

---

## Risks & gotchas

1. **GSAP plugin registration race** — `gsap.registerPlugin(ScrollTrigger)` doit être appelé AVANT de créer le premier ScrollTrigger. Le controller dynamic-import ordonne bien (await les deux imports puis register). Vérifier.
2. **Scope CSS React island** — le controller rend un `<nav class="canopy-progress">` côté React. Pour que les règles CSS matchent, le CSS est scoped via `[data-theme="canopee"]` dans `canopee.css` (global scope), pas en `<style>` Astro scoped. OK.
3. **React `class` vs `className`** — attention au copy-paste depuis Astro vers TSX. Step 3.2 rappelle le fix.
4. **StrictMode double-mount** — React 19 StrictMode monte 2× en dev. Le `installedRef.current` garde anti-double-install, et la cleanup `triggers.forEach(kill)` gère la démontage. Doit fonctionner.
5. **ScrollTrigger pin spacer** — GSAP insère des "pin-spacers" dans le DOM. Vérifier que le AltLayout `body { overflow-x: hidden }` ne les masque pas. Si tout le contenu après stage 5 est invisible, c'est un overflow clipping — retirer le `overflow-x: hidden` sur cette page ou ajuster.
6. **iOS Safari momentum scroll** — le scrub peut "brouter" sur iOS Safari avec momentum scrolling. C'est un problème connu GSAP. Si UX critique, basculer `scrub: 0.6` → `scrub: true` (sans smoothing) sur iOS. À tester.
7. **Fontsource Fraunces** — déjà installé. Si la page n'affiche pas Fraunces au premier paint, vérifier `--f-display: "Fraunces Variable"` dans `canopee.css` et que `@import "@fontsource-variable/fraunces"` apparaît bien dans `fonts.css` (wave 1 l'a déjà fait).

---

## Execution handoff

Si c'est le dernier plan exécuté : extraire les entrées REVIEW.md + audit final, valider les 13 entrées du dispatcher toutes cliquables, et créer une PR (si demandé par le user) ou merger sur `main`.

Propositions de suivi :
- `docs/plans/2026-04-17-alt-wave2-finalization-plan.md` (audit final, Lighthouse batch, CLAUDE.md update).
- Un commit de nettoyage final après la vague (supprimer les stubs CSS commentés si inutiles).
