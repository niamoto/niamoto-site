# /alt/ Wave 2 — V11 Silex Implementation Plan

> **For Claude:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Livrer `/alt/silex` et `/fr/alt/silex` — variante *minimalism radical × stitch-design-taste*. 3 couleurs TOTAL (stone/flint/moss), Geist Mono Light en body (anti-Atlas), 1 phrase de hero, 1 chiffre géant (2713), 1 CTA texte souligné. Scroll = 4 paliers identiques (un mot, une phrase, un chiffre) — *Observe / Collect / Publish / Share*. Densité visuelle décroissante à chaque section.

**Architecture:** Même pattern que Manifeste (plan V8). 4 composants Astro + wrapper + i18n + CSS scoped. Zéro dépendance nouvelle, aucun Motion island (Fade* optionnel pour micro-transitions uniquement).

**Tech Stack:** Astro 5.6, Tailwind v4, Geist Variable, Fraunces Variable (pour le gros chiffre), JetBrains Mono Variable. Aucune dep ajoutée.

---

## Préalable

Foundations plan appliqué. Vérif :
```bash
grep -q '"silex"' src/layouts/AltLayout.astro
grep -q 'silex:' src/i18n/alt/shared.en.ts
test -f src/styles/alt/silex.css
```

## File Structure

| Action | Path | Responsibility |
|---|---|---|
| Modify | `src/styles/alt/silex.css` | Tokens + classes scoped `[data-theme="silex"]`. |
| Create | `src/i18n/alt/silex.en.ts` | Copy EN minimaliste. |
| Create | `src/i18n/alt/silex.fr.ts` | Copy FR équivalente avec accents. |
| Create | `src/components/alt/silex/SilexHero.astro` | 1 phrase + 1 chiffre géant + CTA texte. |
| Create | `src/components/alt/silex/VerbStrate.astro` | 1 palier (mot + phrase + nombre). Réutilisé ×4. |
| Create | `src/components/alt/silex/SilexCoda.astro` | Coda line + institutions plain text. |
| Create | `src/components/alt/silex/SilexPage.astro` | Wrapper. |
| Create | `src/pages/alt/silex.astro`, `src/pages/fr/alt/silex.astro` | Routes. |

---

## Task 1: CSS scoped

- [ ] **Step 1.1: Remplacer le stub `silex.css`**

```css
/* V11 Silex — minimalism radical × stitch-design-taste.
 * 3 couleurs TOTAL. Geist Mono Light body (anti-Atlas), Fraunces light for single giant number.
 * Palette :
 *   --c-canvas  #F7F5F0   stone warm
 *   --c-ink     #3A3835   flint
 *   --c-muted   #3A383566 flint 40% opacity (computed via color-mix)
 *   --c-accent  #5C7051   moss green (hover only, not used by default)
 */

[data-theme="silex"] {
  color-scheme: light;

  --c-canvas: #F7F5F0;
  --c-ink: #3A3835;
  --c-muted: color-mix(in srgb, #3A3835 55%, transparent);
  --c-accent: #5C7051;
  --c-accent-alt: #5C7051;
  --c-surface: transparent;
  --c-hairline: color-mix(in srgb, #3A3835 12%, transparent);
  --c-grain-opacity: 0.025;

  --f-display: "Fraunces Variable", "Iowan Old Style", Georgia, serif;
  --f-body: "Geist Variable", system-ui, -apple-system, sans-serif;
  --f-mono: "Geist Variable", ui-monospace, SFMono-Regular, Menlo, monospace;

  /* Fraunces light opsz 144 for the giant number only. */
  --fvs-display: "opsz" 144, "wght" 300, "SOFT" 50, "WONK" 0;
  /* Body is Geist LIGHT (weight 300) — anti-Atlas. */
  --fvs-body: "wght" 300;

  --ls-display: -0.04em;
  --ls-body: 0.005em;
  --lh-display: 0.98;
  --lh-body: 1.55;
}

/* Hero — single sentence + single number + text CTA. */
[data-theme="silex"] .silex-hero {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 6rem 2rem 4rem;
  max-width: 1200px;
  margin: 0 auto;
  gap: 4rem;
}
[data-theme="silex"] .silex-hero__phrase {
  font-family: var(--f-body);
  font-variation-settings: "wght" 300;
  font-size: clamp(3rem, 6vw, 7rem);
  line-height: 1.02;
  color: var(--c-muted);
  max-width: 22ch;
  margin: 0;
}
[data-theme="silex"] .silex-hero__number {
  font-family: var(--f-display);
  font-variation-settings: "opsz" 144, "wght" 200, "SOFT" 50;
  font-size: clamp(8rem, 22vw, 18rem);
  line-height: 0.85;
  color: var(--c-ink);
  letter-spacing: -0.06em;
  margin: 0;
  font-variant-numeric: tabular-nums;
}
[data-theme="silex"] .silex-hero__caption {
  font-family: var(--f-mono);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--c-muted);
  margin-top: 0.5rem;
}

/* Text-only CTA underline. */
[data-theme="silex"] .silex-cta-text {
  font-family: var(--f-body);
  font-size: 1rem;
  color: var(--c-ink);
  text-decoration: underline;
  text-underline-offset: 0.25em;
  text-decoration-thickness: 1px;
  transition: color 220ms, text-decoration-color 220ms;
}
[data-theme="silex"] .silex-cta-text:hover {
  color: var(--c-accent);
}
[data-theme="silex"] .silex-cta-text__arrow {
  display: inline-block;
  margin-left: 0.35em;
  transition: transform 260ms cubic-bezier(0.32, 0.72, 0, 1);
}
[data-theme="silex"] .silex-cta-text:hover .silex-cta-text__arrow {
  transform: translateX(6px);
}

/* Verb strate — 4 paliers identical in structure, densité decreasing. */
[data-theme="silex"] .silex-strate {
  padding: 10rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}
[data-theme="silex"] .silex-strate__word {
  font-family: var(--f-body);
  font-variation-settings: "wght" 250;
  font-size: clamp(5rem, 18vw, 14rem);
  line-height: 0.9;
  color: var(--c-ink);
  letter-spacing: -0.06em;
  margin: 0;
  transition: font-variation-settings 280ms ease-out;
}
[data-theme="silex"] .silex-strate__word:hover {
  font-variation-settings: "wght" 400;
}
[data-theme="silex"] .silex-strate__phrase {
  font-family: var(--f-body);
  font-size: 1.1rem;
  line-height: 1.55;
  color: var(--c-ink);
  opacity: 0.75;
  max-width: 42ch;
  margin: 0;
}
[data-theme="silex"] .silex-strate__number {
  font-family: var(--f-mono);
  font-size: 1rem;
  color: var(--c-muted);
  letter-spacing: 0.04em;
  font-variant-numeric: tabular-nums;
}
/* Densité decreases per strate. Each successive gets more whitespace via extra padding-top. */
[data-theme="silex"] .silex-strate:nth-child(2) { padding-top: 14rem; }
[data-theme="silex"] .silex-strate:nth-child(3) { padding-top: 18rem; }
[data-theme="silex"] .silex-strate:nth-child(4) { padding-top: 22rem; }

/* Coda — plain text, flint, single line, institutions inline. */
[data-theme="silex"] .silex-coda {
  padding: 12rem 2rem 10rem;
  max-width: 1200px;
  margin: 0 auto;
  text-align: left;
}
[data-theme="silex"] .silex-coda__line {
  font-family: var(--f-body);
  font-size: 1rem;
  color: var(--c-muted);
  margin: 0;
}
[data-theme="silex"] .silex-coda__line strong {
  color: var(--c-ink);
  font-weight: 400;
}
```

- [ ] **Step 1.2: Build**
```bash
pnpm typecheck && pnpm build
```
Expected: 0 erreur.

- [ ] **Step 1.3: Commit**
```bash
git add src/styles/alt/silex.css
git commit -m "feat(alt/silex): CSS tokens + scoped classes (minimalism 3-color)"
```

---

## Task 2: i18n EN + FR

- [ ] **Step 2.1: `silex.en.ts`**
```ts
export default {
  meta: {
    title: "Niamoto · Silex — Fewer things, better said",
    description:
      "Niamoto, reduced. One toolkit. One purpose: turn ecological field data into public portals that outlive the grant.",
  },
  hero: {
    phrase: "We build portals that outlive the grant.",
    number: "2713",
    caption: "Endemic species catalogued",
    cta: "Start",
    ctaHref: "https://github.com/niamoto/niamoto",
  },
  strates: [
    {
      word: "Observe",
      phrase: "Field inventories, plot by plot. No telemetry.",
      number: "509 plots · 70,000+ trees",
    },
    {
      word: "Collect",
      phrase: "Your data stays yours. Versioned, portable, exportable.",
      number: "42 plugins · Apache 2",
    },
    {
      word: "Publish",
      phrase: "Static HTML portals. No login. No database.",
      number: "3 portals live · NC · Gabon · Guyane",
    },
    {
      word: "Share",
      phrase: "From field notes to open atlas, in a single command.",
      number: "pip install niamoto",
    },
  ],
  coda: {
    line: "Since 2016. With IRD, CIRAD, AMAP, ANPN, Province Nord, Province Sud, IAC.",
  },
} as const;
```

- [ ] **Step 2.2: `silex.fr.ts`**
```ts
export default {
  meta: {
    title: "Niamoto · Silex — Moins de choses, mieux dites",
    description:
      "Niamoto, réduit. Un outil. Un objectif : transformer les données écologiques de terrain en portails publics qui survivent à la subvention.",
  },
  hero: {
    phrase: "Nous construisons des portails qui survivent aux subventions.",
    number: "2713",
    caption: "Espèces endémiques cataloguées",
    cta: "Commencer",
    ctaHref: "https://github.com/niamoto/niamoto",
  },
  strates: [
    {
      word: "Observer",
      phrase: "Inventaires de terrain, parcelle après parcelle. Aucune télémétrie.",
      number: "509 parcelles · 70 000+ arbres",
    },
    {
      word: "Collecter",
      phrase: "Vos données restent à vous. Versionnées, portables, exportables.",
      number: "42 plugins · Apache 2",
    },
    {
      word: "Publier",
      phrase: "Portails HTML statiques. Aucune connexion. Aucune base de données.",
      number: "3 portails en ligne · NC · Gabon · Guyane",
    },
    {
      word: "Partager",
      phrase: "Des notes de terrain à l'atlas ouvert, en une seule commande.",
      number: "pip install niamoto",
    },
  ],
  coda: {
    line: "Depuis 2016. Avec IRD, CIRAD, AMAP, ANPN, Province Nord, Province Sud, IAC.",
  },
} as const;
```

- [ ] **Step 2.3: Typecheck + commit**
```bash
pnpm typecheck
git add src/i18n/alt/silex.en.ts src/i18n/alt/silex.fr.ts
git commit -m "feat(alt/silex): i18n EN/FR — minimal verb structure"
```

---

## Task 3: Composants

- [ ] **Step 3.1: `SilexHero.astro`**
```astro
---
interface Props {
  phrase: string;
  number: string;
  caption: string;
  cta: string;
  ctaHref: string;
}
const { phrase, number, caption, cta, ctaHref } = Astro.props;
---

<section class="silex-hero" aria-label="Silex hero">
  <p class="silex-hero__phrase">{phrase}</p>
  <div>
    <p class="silex-hero__number">{number}</p>
    <p class="silex-hero__caption">{caption}</p>
  </div>
  <p>
    <a class="silex-cta-text" href={ctaHref}>
      {cta}<span class="silex-cta-text__arrow" aria-hidden="true">&rarr;</span>
    </a>
  </p>
</section>
```

- [ ] **Step 3.2: `VerbStrate.astro`**
```astro
---
interface Props { word: string; phrase: string; number: string }
const { word, phrase, number } = Astro.props;
---

<section class="silex-strate" aria-label={word}>
  <h2 class="silex-strate__word display">{word}</h2>
  <p class="silex-strate__phrase">{phrase}</p>
  <p class="silex-strate__number">{number}</p>
</section>
```

- [ ] **Step 3.3: `SilexCoda.astro`**
```astro
---
interface Props { line: string }
const { line } = Astro.props;
---

<section class="silex-coda" aria-label="Coda">
  <p class="silex-coda__line">{line}</p>
</section>
```

- [ ] **Step 3.4: Typecheck + commit**
```bash
pnpm typecheck
git add src/components/alt/silex/
git commit -m "feat(alt/silex): 3 section components (hero, strate, coda)"
```

---

## Task 4: Wrapper + routes

- [ ] **Step 4.1: `SilexPage.astro`**
```astro
---
import AltLayout from "@/layouts/AltLayout.astro";
import IslandNav from "@/components/alt/shared/IslandNav.astro";
import SilexHero from "./SilexHero.astro";
import VerbStrate from "./VerbStrate.astro";
import SilexCoda from "./SilexCoda.astro";
import type { Locale } from "@/i18n/config";
import enCopy from "@/i18n/alt/silex.en";
import frCopy from "@/i18n/alt/silex.fr";

interface Props { locale: Locale }
const { locale } = Astro.props;
const t = locale === "fr" ? frCopy : enCopy;
---

<AltLayout
  theme="silex"
  locale={locale}
  title={t.meta.title}
  description={t.meta.description}
  slug="silex"
>
  <a href="#main" class="skip-link">Skip to content</a>
  <IslandNav locale={locale} slug="silex" />

  <main id="main">
    <SilexHero {...t.hero} />
    {t.strates.map((s) => (
      <VerbStrate word={s.word} phrase={s.phrase} number={s.number} />
    ))}
    <SilexCoda line={t.coda.line} />
  </main>
</AltLayout>
```

- [ ] **Step 4.2: Routes**

`src/pages/alt/silex.astro`:
```astro
---
import SilexPage from "@/components/alt/silex/SilexPage.astro";
---
<SilexPage locale="en" />
```

`src/pages/fr/alt/silex.astro`:
```astro
---
import SilexPage from "@/components/alt/silex/SilexPage.astro";
---
<SilexPage locale="fr" />
```

- [ ] **Step 4.3: Build**
```bash
pnpm build
```
Expected: 2 pages additionnelles générées.

- [ ] **Step 4.4: Commit**
```bash
git add src/components/alt/silex/SilexPage.astro src/pages/alt/silex.astro src/pages/fr/alt/silex.astro
git commit -m "feat(alt/silex): wrapper + EN/FR routes"
```

---

## Task 5: Browser QA

- [ ] **Step 5.1: Preview + visual check EN**

Ouvrir `http://localhost:4321/alt/silex`.

Vérifier :
1. **Hero** pleine hauteur. Phrase en gris flint 40%, chiffre `2713` géant en flint 100%, caption mono uppercase, CTA "Start →".
2. **4 strates** — espacement vertical qui augmente à chaque strate (14rem → 22rem padding-top). Mots géants, phrases courtes, nombres mono.
3. **Hover sur les mots** — tracking s'ouvre (wght 250 → 400).
4. **Coda** — une seule ligne "Since 2016. With…" en gris flint 40%.
5. **Background** stone warm `#F7F5F0`, jamais pur blanc.
6. **Aucun gradient, aucune box-shadow, aucune box border autre que hairline**.

- [ ] **Step 5.2: Visual check FR**

Ouvrir `http://localhost:4321/fr/alt/silex`.

Vérifier accents français : *écologiques*, *subventions*, *télémétrie*, *données*, *versionnées*, *portables*, *exportables*, *après*, *commencer*. Pas de caractères manquants.

- [ ] **Step 5.3: Responsive**

Resize viewport à 375px. Le hero doit rester lisible, le chiffre ne doit pas déborder. Les mots des strates doivent rester sur 1 ligne si possible (sinon clip mince sur les côtés).

- [ ] **Step 5.4: Isolation tokens**

Inspecter `body` sur `/alt/silex` : `data-theme="silex"`, `--c-canvas: #F7F5F0`, `--c-ink: #3A3835`, `--c-accent: #5C7051`. Confirmer 3 couleurs seulement.

- [ ] **Step 5.5: Mettre à jour REVIEW.md**

Ajouter entrée "V11 Silex" à `docs/alt/REVIEW.md` :

```md
### V11 Silex (Minimalism radical)

3 couleurs TOTAL. Geist Mono Light en body (anti-Atlas). Un seul chiffre géant (2713), 4 paliers verbes (Observe/Collect/Publish/Share), densité décroissante.

**Strengths**: la plus austère des 13 variantes. Fonctionne comme anti-cheat vs l'empilement de features.

**Weaknesses**: le visiteur qui cherche "install" doit scroller 5 sections pour trouver la commande. OK si on assume le registre manifesto, pas OK pour un visiteur cold.
```

- [ ] **Step 5.6: Commit REVIEW**
```bash
git add docs/alt/REVIEW.md
git commit -m "docs(alt/silex): add variant audit entry"
```

---

## Risks & gotchas

1. **Geist Mono Light body** — `font-family: var(--f-body)` avec `wght 300` est lisible sur desktop mais peut faire très mince sur mobile HiDPI. Si le contraste est insuffisant, monter à `wght 350`.
2. **Chiffre géant responsive** — `clamp(8rem, 22vw, 18rem)` : à 2rem de padding latéral sur un viewport de 375px, le chiffre fait ~77px. `2713` à cette taille tient en largeur. Tester.
3. **`color-mix` fallback** — IE n'est pas supporté (c'est Astro 5), mais Safari ≤ 16.3 peut avoir des problèmes avec `color-mix` dans les custom properties. Si besoin, fallback en valeur plate `#3A38358C` (55% alpha).
4. **Hover tracking animation** — `transition: font-variation-settings` peut être cher si beaucoup de texte. Ici c'est sur 4 mots, OK.

---

## Execution handoff

Plan suivant recommandé : V9 Cockpit (dashboard) ou V13 Planche (scroll horizontal + print).
