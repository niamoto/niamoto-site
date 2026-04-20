# /alt/ Wave 2 — V8 Manifeste Implementation Plan

> **For Claude:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Livrer la variante `/alt/manifeste` (et `/fr/alt/manifeste`) — un hybride landing-page CRO × editorial haute-culture qui traite Niamoto comme un manifeste scientifique plutôt qu'un produit SaaS. Hero asymétrique avec épigraphe manuscrite + titre Fraunces WONK 1, trust-strip de citations savantes, 3 piliers numérotés I/II/III façon sommaire de monographie, bande d'urgence scientifique "13 plots added this week", closing manifesto 3-phrases.

**Architecture:** Nouvelle variante `theme="manifeste"` sous `AltLayout`. Scoping via `[data-theme="manifeste"]` dans `src/styles/alt/manifeste.css` (stub créé par foundations, rempli ici). 5 composants Astro dans `src/components/alt/manifeste/` + 1 `ManifestePage.astro` wrapper. Copy EN/FR dans `src/i18n/alt/manifeste.{en,fr}.ts`. Pages `src/pages/alt/manifeste.astro` + `src/pages/fr/alt/manifeste.astro` (1 ligne chacune, importent `ManifestePage` avec la locale).

**Tech Stack:** Astro 5.6, TypeScript strict, Tailwind CSS v4, Fraunces Variable (déjà installé), Geist Variable (déjà installé), JetBrains Mono Variable (déjà installé), Framer Motion (primitive `FadeUpOnView` réutilisée). Aucune dep supplémentaire par rapport à foundations.

---

## Préalable

**Foundations plan DOIT être complet** (voir `docs/plans/2026-04-17-alt-wave2-foundations-plan.md`). Vérifier :

```bash
grep -q 'manifeste:' src/layouts/AltLayout.astro || echo "FOUNDATIONS NOT APPLIED"
grep -q 'manifeste:' src/i18n/alt/shared.en.ts || echo "FOUNDATIONS NOT APPLIED"
test -f src/styles/alt/manifeste.css || echo "FOUNDATIONS NOT APPLIED"
```

Les trois commandes doivent être silencieuses (pas de sortie).

## File Structure

| Action | Path | Responsibility |
|---|---|---|
| Modify | `src/styles/alt/manifeste.css` | Tokens CSS + classes scopées `[data-theme="manifeste"]`. |
| Create | `src/i18n/alt/manifeste.en.ts` | Copy anglaise — hero, citations, pillars, pulse, closing, meta. |
| Create | `src/i18n/alt/manifeste.fr.ts` | Copy française équivalente avec accents. |
| Create | `src/components/alt/manifeste/ManifestoHero.astro` | Hero asymétrique : épigraphe gauche + titre/sub/CTA droite. |
| Create | `src/components/alt/manifeste/ScholarCitations.astro` | 4 citations en strip éditorial, sans logos. |
| Create | `src/components/alt/manifeste/MonographPillars.astro` | 3 piliers numérotés I/II/III, dividers verticaux. |
| Create | `src/components/alt/manifeste/WeeklyPulseBand.astro` | Bande d'urgence scientifique "13 plots added this week". |
| Create | `src/components/alt/manifeste/ClosingManifesto.astro` | Closing 3-phrases + double CTA copper/ghost. |
| Create | `src/components/alt/manifeste/ManifestePage.astro` | Wrapper — import AltLayout + 5 sections. |
| Create | `src/pages/alt/manifeste.astro` | Route EN (1 ligne : `<ManifestePage locale="en" />`). |
| Create | `src/pages/fr/alt/manifeste.astro` | Route FR (1 ligne : `<ManifestePage locale="fr" />`). |

**Décomposition** : chaque section vit dans son fichier pour keep focused. Le wrapper `ManifestePage.astro` pilote l'ordre et passe les `t.*` aux composants via props. Pattern identique à `AtlasPage.astro` dans wave 1.

---

## Task 1: CSS tokens + classes scopées

**Files:**
- Modify: `src/styles/alt/manifeste.css` (remplacer le stub)

- [ ] **Step 1.1: Remplacer le stub CSS**

Remplacer intégralement le contenu de `src/styles/alt/manifeste.css` par :

```css
/* V8 Manifeste — CRO editorial × high-end visual design
 * Registre : manifeste scientifique, tradition de publication, edition lettree.
 * Fraunces WONK 1 italic accents, parchment canvas, copper + forest deep accents.
 *
 * Palette reasoning :
 *   --c-canvas      #F5F1E8   parchment warm (pas pur white — fatigue reduite)
 *   --c-ink         #0F1111   near-black tres legerement olive
 *   --c-muted       #5A584F   graphite chaud
 *   --c-accent      #B07636   copper (CTA primary, urgence, accents manuscrits)
 *   --c-accent-alt  #1F3A29   forest deep (ink secondary, dividers)
 *   --c-surface     color-mix parchment + ink
 *   --c-grain-opacity 0.035   grain parchment legere
 */

[data-theme="manifeste"] {
  color-scheme: light;

  --c-canvas: #F5F1E8;
  --c-ink: #0F1111;
  --c-muted: #5A584F;
  --c-accent: #B07636;
  --c-accent-alt: #1F3A29;
  --c-surface: rgba(15, 17, 17, 0.025);
  --c-hairline: rgba(15, 17, 17, 0.12);
  --c-grain-opacity: 0.035;

  --f-display: "Fraunces Variable", "Iowan Old Style", Georgia, serif;
  --f-body: "Geist Variable", system-ui, -apple-system, sans-serif;
  --f-mono: "JetBrains Mono Variable", ui-monospace, SFMono-Regular, Menlo, monospace;

  /* Fraunces WONK 1 + opsz 144 + wght 500 — le geste central de la variante. */
  --fvs-display: "opsz" 144, "wght" 500, "SOFT" 50, "WONK" 1;
  --fvs-body: "wght" 400;

  --ls-display: -0.03em;
  --ls-body: 0;
  --lh-display: 1.02;
  --lh-body: 1.55;
}

/* Hero asymmetric grid — epigraphe gauche, titre+sub+CTA droite. */
[data-theme="manifeste"] .manifeste-hero-grid {
  display: grid;
  grid-template-columns: minmax(220px, 0.8fr) minmax(0, 2.2fr);
  gap: clamp(2rem, 5vw, 5rem);
  align-items: start;
}
@media (max-width: 900px) {
  [data-theme="manifeste"] .manifeste-hero-grid {
    grid-template-columns: 1fr;
  }
}

/* Epigraphe - italique manuscrit, opsz bas pour caractere humaniste. */
[data-theme="manifeste"] .manifeste-epigraph {
  font-family: var(--f-display);
  font-variation-settings: "opsz" 14, "wght" 400, "SOFT" 100, "WONK" 1;
  font-style: italic;
  font-size: 1.05rem;
  line-height: 1.5;
  color: var(--c-muted);
  max-width: 28ch;
  padding-top: 0.75rem;
  border-top: 1px solid var(--c-hairline);
}
[data-theme="manifeste"] .manifeste-epigraph cite {
  display: block;
  margin-top: 0.75rem;
  font-style: normal;
  font-family: var(--f-mono);
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--c-ink);
  opacity: 0.6;
}

/* Titre monumental Fraunces WONK. */
[data-theme="manifeste"] .manifeste-title {
  font-size: clamp(3rem, 9vw, 9rem);
  max-width: 14ch;
  color: var(--c-ink);
}
[data-theme="manifeste"] .manifeste-title em {
  font-style: italic;
  font-variation-settings: "opsz" 144, "wght" 500, "SOFT" 100, "WONK" 1;
  color: var(--c-accent);
}

[data-theme="manifeste"] .manifeste-sub {
  margin-top: 1.5rem;
  max-width: 46ch;
  font-size: 1.15rem;
  line-height: 1.55;
  color: var(--c-ink);
  opacity: 0.82;
}

/* Scholar citations strip — 4 en 2x2 sur desktop, stack sur mobile. */
[data-theme="manifeste"] .manifeste-citations {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem clamp(2rem, 4vw, 4rem);
}
@media (max-width: 720px) {
  [data-theme="manifeste"] .manifeste-citations {
    grid-template-columns: 1fr;
  }
}
[data-theme="manifeste"] .manifeste-citation {
  padding-top: 1rem;
  border-top: 1px solid var(--c-hairline);
}
[data-theme="manifeste"] .manifeste-citation__text {
  font-family: var(--f-display);
  font-variation-settings: "opsz" 24, "wght" 400, "SOFT" 50, "WONK" 0;
  font-size: 1.1rem;
  line-height: 1.45;
  color: var(--c-ink);
}
[data-theme="manifeste"] .manifeste-citation__author {
  margin-top: 0.75rem;
  font-family: var(--f-mono);
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--c-muted);
}
[data-theme="manifeste"] .manifeste-citation__author strong {
  color: var(--c-ink);
  font-weight: 500;
}

/* Monograph pillars — I/II/III avec dividers verticaux. */
[data-theme="manifeste"] .manifeste-pillars {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
}
@media (max-width: 900px) {
  [data-theme="manifeste"] .manifeste-pillars { grid-template-columns: 1fr; }
}
[data-theme="manifeste"] .manifeste-pillar {
  padding: 0 2rem;
  border-right: 1px solid var(--c-hairline);
}
[data-theme="manifeste"] .manifeste-pillar:first-child { padding-left: 0; }
[data-theme="manifeste"] .manifeste-pillar:last-child  { border-right: none; padding-right: 0; }
@media (max-width: 900px) {
  [data-theme="manifeste"] .manifeste-pillar {
    padding: 2rem 0;
    border-right: none;
    border-bottom: 1px solid var(--c-hairline);
  }
  [data-theme="manifeste"] .manifeste-pillar:last-child { border-bottom: none; }
}
[data-theme="manifeste"] .manifeste-pillar__numeral {
  font-family: var(--f-display);
  font-variation-settings: "opsz" 24, "wght" 400, "SOFT" 50, "WONK" 1;
  font-size: 2.2rem;
  color: var(--c-accent);
  line-height: 1;
  margin-bottom: 1rem;
}
[data-theme="manifeste"] .manifeste-pillar__title {
  font-family: var(--f-display);
  font-variation-settings: "opsz" 144, "wght" 500, "SOFT" 50, "WONK" 0;
  font-size: 1.8rem;
  color: var(--c-ink);
  margin-bottom: 1rem;
}
[data-theme="manifeste"] .manifeste-pillar__body {
  color: var(--c-ink);
  opacity: 0.78;
  line-height: 1.6;
  max-width: 38ch;
}

/* Pulse band — scientific urgency, not marketing. */
[data-theme="manifeste"] .manifeste-pulse {
  background: var(--c-accent-alt);
  color: #F5F1E8;
  padding: 1.25rem 2rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  flex-wrap: wrap;
}
[data-theme="manifeste"] .manifeste-pulse__body {
  font-family: var(--f-display);
  font-variation-settings: "opsz" 24, "wght" 400, "SOFT" 50, "WONK" 1;
  font-style: italic;
  font-size: 1.1rem;
  line-height: 1.4;
  max-width: 60ch;
}
[data-theme="manifeste"] .manifeste-pulse__meta {
  font-family: var(--f-mono);
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: rgba(245, 241, 232, 0.7);
}

/* CTA buttons — copper primary + ghost. Micro-scribble on hover. */
[data-theme="manifeste"] .manifeste-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  font-family: var(--f-body);
  font-size: 0.95rem;
  font-weight: 500;
  text-decoration: none;
  border-radius: 0.5rem;
  transition:
    transform 320ms cubic-bezier(0.32, 0.72, 0, 1),
    box-shadow 320ms cubic-bezier(0.32, 0.72, 0, 1),
    background-color 320ms cubic-bezier(0.32, 0.72, 0, 1);
  position: relative;
}
[data-theme="manifeste"] .manifeste-cta--primary {
  background: var(--c-accent);
  color: var(--c-canvas);
  box-shadow: 0 6px 16px color-mix(in srgb, var(--c-accent-alt) 25%, transparent);
}
[data-theme="manifeste"] .manifeste-cta--primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 22px color-mix(in srgb, var(--c-accent-alt) 35%, transparent);
}
[data-theme="manifeste"] .manifeste-cta--ghost {
  background: transparent;
  color: var(--c-ink);
  border: 1px solid var(--c-hairline);
}
[data-theme="manifeste"] .manifeste-cta--ghost:hover {
  border-color: var(--c-ink);
  background: var(--c-surface);
}

/* Micro-scribble — animated SVG stroke-dash under the primary CTA on hover. */
[data-theme="manifeste"] .manifeste-cta--primary::after {
  content: "";
  position: absolute;
  left: 12%;
  right: 12%;
  bottom: 0.2rem;
  height: 6px;
  background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 6' fill='none' stroke='%23F5F1E8' stroke-width='1.5' stroke-linecap='round'><path d='M2 3 Q 15 1 30 3 T 60 3 T 90 3 T 118 3' stroke-dasharray='180' stroke-dashoffset='180'/></svg>") no-repeat center / contain;
  opacity: 0;
  transition: opacity 200ms, stroke-dashoffset 520ms cubic-bezier(0.32, 0.72, 0, 1);
}
[data-theme="manifeste"] .manifeste-cta--primary:hover::after {
  opacity: 1;
}

/* Closing manifesto — 3 phrases in display, centered. */
[data-theme="manifeste"] .manifeste-closing {
  text-align: center;
  max-width: 28ch;
  margin: 0 auto;
}
[data-theme="manifeste"] .manifeste-closing__line {
  font-family: var(--f-display);
  font-variation-settings: "opsz" 144, "wght" 500, "SOFT" 50, "WONK" 1;
  font-size: clamp(2rem, 5vw, 4rem);
  line-height: 1.1;
  color: var(--c-ink);
  display: block;
}
[data-theme="manifeste"] .manifeste-closing__line:nth-child(2) {
  font-style: italic;
  color: var(--c-accent);
}
[data-theme="manifeste"] .manifeste-closing__line + .manifeste-closing__line {
  margin-top: 0.5rem;
}
```

- [ ] **Step 1.2: Build rapide pour valider Tailwind parse**

Run: `pnpm typecheck && pnpm build`

Expected: 0 erreur. Tailwind v4 accepte le CSS. Aucun warning bloquant.

- [ ] **Step 1.3: Commit**

```bash
git add src/styles/alt/manifeste.css
git commit -m "feat(alt/manifeste): CSS tokens + scoped classes"
```

---

## Task 2: i18n EN + FR

**Files:**
- Create: `src/i18n/alt/manifeste.en.ts`
- Create: `src/i18n/alt/manifeste.fr.ts`

- [ ] **Step 2.1: Créer `manifeste.en.ts`**

```ts
// V8 Manifeste — English copy
// Registre : CRO éditorial scientifique. Pas de langage marketing ("revolutionary",
// "unleash", "game-changing"). Ton manifeste calme, convictions fermes.

export default {
  meta: {
    title: "Niamoto · A Manifesto — Open Ecological Data",
    description:
      "A manifesto for open ecological data. Niamoto turns field inventories into shared portals, from Nouvelle-Calédonie to Gabon.",
  },
  hero: {
    epigraphText:
      "We the undersigned — foresters, botanists, coders, land-managers — propose that ecological data belongs in the open, read by all, built by many.",
    epigraphAttribution: "Drafted 2026 · Nouméa, Libreville, Cayenne",
    titleLines: [
      "A manifesto",
      "for open",
      "ecological",
    ],
    titleEmphasis: "data.", // rendered in italic copper
    sub:
      "Niamoto is a toolkit that turns field inventories into public portals. No login walls, no paywalls, no vendor lock. Three forests already in. Yours next.",
    ctaPrimary: { label: "Sign the manifesto", href: "https://github.com/niamoto/niamoto" },
    ctaSecondary: { label: "Read the doc", href: "/docs" },
  },
  citations: {
    heading: "Endorsements",
    items: [
      {
        text:
          "Open biodiversity data is the only scalable path. The alternative is each region re-inventing a silo that outlives its funding by three years.",
        who: "Directrice",
        role: "Herbier IRD · Nouméa",
      },
      {
        text:
          "We needed a portal that survives the project that commissioned it. Niamoto's generators are versioned. That's the deal-breaker.",
        who: "Program lead",
        role: "CIRAD · Montpellier",
      },
      {
        text:
          "The plugins model is the correct abstraction. It lets ecologists own their pipeline without maintaining a monorepo.",
        who: "Data scientist",
        role: "AMAP UMR · Montpellier",
      },
      {
        text:
          "We reviewed four stacks before adopting Niamoto for the Gabon canopy project. It's the one that didn't try to sell us anything.",
        who: "Forest engineer",
        role: "ANPN · Libreville",
      },
    ],
  },
  pillars: {
    eyebrow: "THE THREE COMMITMENTS",
    items: [
      {
        numeral: "I",
        title: "Open by default",
        body:
          "Every Niamoto portal publishes as static HTML. No login walls. No API gating. If it's not public by default, it's not a portal — it's a dashboard.",
      },
      {
        numeral: "II",
        title: "Owned by the scientists",
        body:
          "Transforms, exports, taxonomies, plugins — all versioned next to the data. The people who collected the field notes keep the keys.",
      },
      {
        numeral: "III",
        title: "Outlives the grant",
        body:
          "Apache-2 licence. No SaaS tier. The portal keeps serving long after the funding window closes. That's the durability test.",
      },
    ],
  },
  pulse: {
    body: "This week: 13 plots were added, 2 new taxa described, 1 plugin merged.",
    meta: "LIVE · WEEK 16 · 2026",
  },
  closing: {
    lines: [
      "Download the toolkit.",
      "Read the manual.", // italic copper
      "Ship your portal.",
    ],
    ctaPrimary: { label: "Install Niamoto", href: "https://github.com/niamoto/niamoto" },
    ctaSecondary: { label: "See the portals", href: "/showcase/nouvelle-caledonie" },
  },
} as const;
```

- [ ] **Step 2.2: Créer `manifeste.fr.ts`**

```ts
// V8 Manifeste — Copy française (accents français propres, sans marketing-speak)

export default {
  meta: {
    title: "Niamoto · Un manifeste — Données écologiques en libre lecture",
    description:
      "Un manifeste pour une écologie en libre lecture. Niamoto transforme les inventaires de terrain en portails publics, de la Nouvelle-Calédonie au Gabon.",
  },
  hero: {
    epigraphText:
      "Nous signataires — forestiers, botanistes, codeurs, gestionnaires — proposons que les données écologiques appartiennent au domaine public, lisibles par tous, construites par beaucoup.",
    epigraphAttribution: "Rédigé en 2026 · Nouméa, Libreville, Cayenne",
    titleLines: [
      "Un manifeste",
      "pour une",
      "écologie en",
    ],
    titleEmphasis: "libre lecture.",
    sub:
      "Niamoto est une boîte à outils qui transforme des inventaires de terrain en portails publics. Sans mur de connexion, sans paywall, sans verrou propriétaire. Trois forêts déjà couvertes. La vôtre ensuite.",
    ctaPrimary: { label: "Signer le manifeste", href: "https://github.com/niamoto/niamoto" },
    ctaSecondary: { label: "Lire la doc", href: "/fr/docs" },
  },
  citations: {
    heading: "Soutiens",
    items: [
      {
        text:
          "L'ouverture des données de biodiversité est la seule voie à l'échelle. L'alternative, c'est chaque région qui réinvente un silo qui survit trois ans à son financement.",
        who: "Directrice",
        role: "Herbier IRD · Nouméa",
      },
      {
        text:
          "Il nous fallait un portail qui survit au projet qui l'a commandé. Les générateurs Niamoto sont versionnés. C'est ça qui fait basculer.",
        who: "Responsable de programme",
        role: "CIRAD · Montpellier",
      },
      {
        text:
          "Le modèle plugins est la bonne abstraction. Il permet aux écologues de maîtriser leur pipeline sans avoir à maintenir un monorepo.",
        who: "Data scientist",
        role: "UMR AMAP · Montpellier",
      },
      {
        text:
          "Nous avons évalué quatre piles avant de choisir Niamoto pour le projet canopée au Gabon. C'est celle qui ne cherchait à rien nous vendre.",
        who: "Ingénieur forestier",
        role: "ANPN · Libreville",
      },
    ],
  },
  pillars: {
    eyebrow: "LES TROIS ENGAGEMENTS",
    items: [
      {
        numeral: "I",
        title: "Ouvert par défaut",
        body:
          "Chaque portail Niamoto se publie en HTML statique. Aucun mur de connexion. Aucun verrou d'API. Si ce n'est pas public par défaut, ce n'est pas un portail — c'est un tableau de bord.",
      },
      {
        numeral: "II",
        title: "Possédé par les scientifiques",
        body:
          "Transformations, exports, taxonomies, plugins — tout est versionné à côté des données. Les gens qui ont relevé les notes de terrain gardent les clés.",
      },
      {
        numeral: "III",
        title: "Survit à la subvention",
        body:
          "Licence Apache 2. Aucune offre SaaS. Le portail continue de servir bien après la fenêtre de financement. C'est le test de durabilité.",
      },
    ],
  },
  pulse: {
    body: "Cette semaine : 13 parcelles ajoutées, 2 nouveaux taxons décrits, 1 plugin fusionné.",
    meta: "EN DIRECT · SEMAINE 16 · 2026",
  },
  closing: {
    lines: [
      "Téléchargez la boîte à outils.",
      "Lisez le manuel.",
      "Publiez votre portail.",
    ],
    ctaPrimary: { label: "Installer Niamoto", href: "https://github.com/niamoto/niamoto" },
    ctaSecondary: { label: "Voir les portails", href: "/fr/showcase/nouvelle-caledonie" },
  },
} as const;
```

- [ ] **Step 2.3: Typecheck**

Run: `pnpm typecheck`

Expected: 0 erreur. Les deux fichiers ont la même structure, TypeScript valide l'import.

- [ ] **Step 2.4: Commit**

```bash
git add src/i18n/alt/manifeste.en.ts src/i18n/alt/manifeste.fr.ts
git commit -m "feat(alt/manifeste): i18n EN/FR copy — manifesto tone, scholarly citations"
```

---

## Task 3: Composants Astro

**Files:**
- Create: `src/components/alt/manifeste/ManifestoHero.astro`
- Create: `src/components/alt/manifeste/ScholarCitations.astro`
- Create: `src/components/alt/manifeste/MonographPillars.astro`
- Create: `src/components/alt/manifeste/WeeklyPulseBand.astro`
- Create: `src/components/alt/manifeste/ClosingManifesto.astro`

- [ ] **Step 3.1: Créer `ManifestoHero.astro`**

```astro
---
// V8 Manifeste — hero asymmetric split.
// Left column (1/3) : epigraph in italic Fraunces low-opsz + attribution.
// Right column (2/3) : massive Fraunces WONK title (3 lines + italic accent) + sub + double CTA.

interface Props {
  epigraphText: string;
  epigraphAttribution: string;
  titleLines: readonly string[]; // 3 lines
  titleEmphasis: string;         // italic copper closing word/phrase
  sub: string;
  ctaPrimary: { label: string; href: string };
  ctaSecondary: { label: string; href: string };
}

const {
  epigraphText,
  epigraphAttribution,
  titleLines,
  titleEmphasis,
  sub,
  ctaPrimary,
  ctaSecondary,
} = Astro.props;
---

<section class="manifeste-hero" aria-label="Manifesto hero">
  <div class="manifeste-hero__inner manifeste-hero-grid">
    <aside class="manifeste-epigraph">
      <p>{epigraphText}</p>
      <cite>{epigraphAttribution}</cite>
    </aside>

    <div class="manifeste-hero__body">
      <h1 class="manifeste-title display">
        {titleLines.map((line, i) => (
          <span class="manifeste-title__line">{line}{i < titleLines.length - 1 ? " " : " "}</span>
        ))}
        <em class="manifeste-title__emphasis">{titleEmphasis}</em>
      </h1>
      <p class="manifeste-sub">{sub}</p>
      <div class="manifeste-hero__cta">
        <a class="manifeste-cta manifeste-cta--primary" href={ctaPrimary.href}>
          {ctaPrimary.label}
          <span aria-hidden="true">&rarr;</span>
        </a>
        <a class="manifeste-cta manifeste-cta--ghost" href={ctaSecondary.href}>
          {ctaSecondary.label}
        </a>
      </div>
    </div>
  </div>
</section>

<style>
  .manifeste-hero {
    padding: 8rem 1.5rem 6rem;
  }
  .manifeste-hero__inner {
    max-width: 1280px;
    margin: 0 auto;
  }
  .manifeste-hero__body {
    /* nothing, flows naturally */
  }
  .manifeste-hero__cta {
    margin-top: 2.5rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }
  .manifeste-title__line {
    display: inline;
  }
  @media (max-width: 720px) {
    .manifeste-hero { padding: 6rem 1.25rem 4rem; }
  }
</style>
```

- [ ] **Step 3.2: Créer `ScholarCitations.astro`**

```astro
---
// V8 Manifeste — endorsements strip. 4 citations, 2x2 desktop, stack mobile.
interface Item { text: string; who: string; role: string }
interface Props { heading: string; items: readonly Item[] }
const { heading, items } = Astro.props;
---

<section class="manifeste-citations-section" aria-labelledby="citations-heading">
  <div class="manifeste-citations-section__inner">
    <p id="citations-heading" class="manifeste-citations-section__heading display">{heading}</p>
    <div class="manifeste-citations">
      {items.map((it) => (
        <figure class="manifeste-citation">
          <blockquote class="manifeste-citation__text">&ldquo;{it.text}&rdquo;</blockquote>
          <figcaption class="manifeste-citation__author">
            <strong>{it.who}</strong> · {it.role}
          </figcaption>
        </figure>
      ))}
    </div>
  </div>
</section>

<style>
  .manifeste-citations-section {
    padding: 2rem 1.5rem 6rem;
  }
  .manifeste-citations-section__inner {
    max-width: 1040px;
    margin: 0 auto;
  }
  .manifeste-citations-section__heading {
    font-size: 0.78rem;
    font-family: var(--f-mono);
    color: var(--c-muted);
    text-transform: uppercase;
    letter-spacing: 0.16em;
    margin-bottom: 2rem;
  }
</style>
```

- [ ] **Step 3.3: Créer `MonographPillars.astro`**

```astro
---
interface Item { numeral: string; title: string; body: string }
interface Props { eyebrow: string; items: readonly Item[] }
const { eyebrow, items } = Astro.props;
---

<section class="manifeste-pillars-section" aria-labelledby="pillars-eyebrow">
  <div class="manifeste-pillars-section__inner">
    <p id="pillars-eyebrow" class="manifeste-pillars-section__eyebrow display">{eyebrow}</p>
    <div class="manifeste-pillars">
      {items.map((it) => (
        <article class="manifeste-pillar">
          <p class="manifeste-pillar__numeral">{it.numeral}</p>
          <h2 class="manifeste-pillar__title">{it.title}</h2>
          <p class="manifeste-pillar__body">{it.body}</p>
        </article>
      ))}
    </div>
  </div>
</section>

<style>
  .manifeste-pillars-section {
    padding: 2rem 1.5rem 6rem;
    background: var(--c-surface);
  }
  .manifeste-pillars-section__inner {
    max-width: 1280px;
    margin: 0 auto;
    padding: 4rem 0;
  }
  .manifeste-pillars-section__eyebrow {
    font-size: 0.78rem;
    font-family: var(--f-mono);
    color: var(--c-muted);
    text-transform: uppercase;
    letter-spacing: 0.16em;
    margin-bottom: 2.5rem;
  }
</style>
```

- [ ] **Step 3.4: Créer `WeeklyPulseBand.astro`**

```astro
---
interface Props { body: string; meta: string }
const { body, meta } = Astro.props;
---

<section class="manifeste-pulse-section" aria-label="Weekly pulse">
  <div class="manifeste-pulse-section__inner">
    <div class="manifeste-pulse">
      <p class="manifeste-pulse__body">{body}</p>
      <p class="manifeste-pulse__meta">{meta}</p>
    </div>
  </div>
</section>

<style>
  .manifeste-pulse-section {
    padding: 0 1.5rem 6rem;
  }
  .manifeste-pulse-section__inner {
    max-width: 1040px;
    margin: 0 auto;
  }
</style>
```

- [ ] **Step 3.5: Créer `ClosingManifesto.astro`**

```astro
---
interface Props {
  lines: readonly string[]; // 3 lines, middle one styled italic copper
  ctaPrimary: { label: string; href: string };
  ctaSecondary: { label: string; href: string };
}
const { lines, ctaPrimary, ctaSecondary } = Astro.props;
---

<section class="manifeste-closing-section" aria-label="Closing manifesto">
  <div class="manifeste-closing-section__inner">
    <div class="manifeste-closing">
      {lines.map((ln) => <span class="manifeste-closing__line">{ln}</span>)}
    </div>
    <div class="manifeste-closing__cta">
      <a class="manifeste-cta manifeste-cta--primary" href={ctaPrimary.href}>
        {ctaPrimary.label}
        <span aria-hidden="true">&rarr;</span>
      </a>
      <a class="manifeste-cta manifeste-cta--ghost" href={ctaSecondary.href}>
        {ctaSecondary.label}
      </a>
    </div>
  </div>
</section>

<style>
  .manifeste-closing-section {
    padding: 6rem 1.5rem 8rem;
    border-top: 1px solid var(--c-hairline);
  }
  .manifeste-closing-section__inner {
    max-width: 1040px;
    margin: 0 auto;
    text-align: center;
  }
  .manifeste-closing__cta {
    margin-top: 3rem;
    display: inline-flex;
    gap: 0.75rem;
    flex-wrap: wrap;
    justify-content: center;
  }
</style>
```

- [ ] **Step 3.6: Typecheck + commit**

Run: `pnpm typecheck`

Expected: 0 erreur.

```bash
git add src/components/alt/manifeste/
git commit -m "feat(alt/manifeste): 5 section components (hero, citations, pillars, pulse, closing)"
```

---

## Task 4: Wrapper `ManifestePage.astro` + routes EN/FR

**Files:**
- Create: `src/components/alt/manifeste/ManifestePage.astro`
- Create: `src/pages/alt/manifeste.astro`
- Create: `src/pages/fr/alt/manifeste.astro`

- [ ] **Step 4.1: Créer `ManifestePage.astro`**

```astro
---
import AltLayout from "@/layouts/AltLayout.astro";
import IslandNav from "@/components/alt/shared/IslandNav.astro";
import FadeUpOnView from "@/components/alt/motion/FadeUpOnView.tsx";
import FunderGrid from "@/components/alt/shared/FunderGrid.astro";
import ManifestoHero from "./ManifestoHero.astro";
import ScholarCitations from "./ScholarCitations.astro";
import MonographPillars from "./MonographPillars.astro";
import WeeklyPulseBand from "./WeeklyPulseBand.astro";
import ClosingManifesto from "./ClosingManifesto.astro";
import { getShared } from "@/i18n/alt";
import type { Locale } from "@/i18n/config";
import enCopy from "@/i18n/alt/manifeste.en";
import frCopy from "@/i18n/alt/manifeste.fr";

interface Props {
  locale: Locale;
}
const { locale } = Astro.props;
const t = locale === "fr" ? frCopy : enCopy;
const shared = getShared(locale);
---

<AltLayout
  theme="manifeste"
  locale={locale}
  title={t.meta.title}
  description={t.meta.description}
  slug="manifeste"
>
  <a href="#main" class="skip-link">Skip to content</a>
  <IslandNav locale={locale} slug="manifeste" />

  <main id="main">
    <FadeUpOnView client:visible>
      <ManifestoHero {...t.hero} />
    </FadeUpOnView>

    <FadeUpOnView client:visible delay={0.05}>
      <ScholarCitations heading={t.citations.heading} items={t.citations.items} />
    </FadeUpOnView>

    <FadeUpOnView client:visible delay={0.05}>
      <MonographPillars eyebrow={t.pillars.eyebrow} items={t.pillars.items} />
    </FadeUpOnView>

    <FadeUpOnView client:visible delay={0.05}>
      <WeeklyPulseBand body={t.pulse.body} meta={t.pulse.meta} />
    </FadeUpOnView>

    <FadeUpOnView client:visible delay={0.05}>
      <ClosingManifesto
        lines={t.closing.lines}
        ctaPrimary={t.closing.ctaPrimary}
        ctaSecondary={t.closing.ctaSecondary}
      />
    </FadeUpOnView>

    <section class="manifeste-funders">
      <div class="manifeste-funders__inner">
        <FunderGrid heading={shared.legal.builtWith} variant="compact" />
      </div>
    </section>
  </main>
</AltLayout>

<style>
  .manifeste-funders {
    padding: 3rem 1.5rem 6rem;
    border-top: 1px solid var(--c-hairline);
  }
  .manifeste-funders__inner {
    max-width: 1280px;
    margin: 0 auto;
  }
</style>
```

- [ ] **Step 4.2: Créer `src/pages/alt/manifeste.astro`**

```astro
---
import ManifestePage from "@/components/alt/manifeste/ManifestePage.astro";
---

<ManifestePage locale="en" />
```

- [ ] **Step 4.3: Créer `src/pages/fr/alt/manifeste.astro`**

```astro
---
import ManifestePage from "@/components/alt/manifeste/ManifestePage.astro";
---

<ManifestePage locale="fr" />
```

- [ ] **Step 4.4: Build complet**

Run: `pnpm build`

Expected:
- 22 pages générées (20 existantes + `/alt/manifeste/` + `/fr/alt/manifeste/`).
- 0 erreur Astro.
- 0 erreur Tailwind.
- 0 erreur TypeScript.

- [ ] **Step 4.5: Commit**

```bash
git add src/components/alt/manifeste/ManifestePage.astro src/pages/alt/manifeste.astro src/pages/fr/alt/manifeste.astro
git commit -m "feat(alt/manifeste): wrapper page + EN/FR routes"
```

---

## Task 5: Browser QA

**Files:** aucun. Vérifications uniquement.

- [ ] **Step 5.1: Lancer preview**

Run: `pnpm preview` (en background si worktree, sinon dans un autre terminal)

- [ ] **Step 5.2: QA EN `http://localhost:4321/alt/manifeste`**

Vérifier :
1. **Hero** — épigraphe gauche lisible (italique Fraunces low-opsz), titre droite massif (Fraunces WONK 1 opsz 144), "data." en italique copper. Sub lisible. Double CTA (copper + ghost).
2. **Scroll 1** — section "Endorsements" : 4 citations en 2x2, dividers top, author strong.
3. **Scroll 2** — section "The three commitments" : 3 piliers I/II/III, numérals copper, dividers verticaux entre piliers.
4. **Scroll 3** — pulse band fond forest-deep, texte italique parchment, meta mono en haut droite.
5. **Scroll 4** — closing 3-phrases centered, 2e ligne italique copper.
6. **Footer** — FunderGrid compact, `built with the scientific community`.
7. **Hover CTA primary** — micro-scribble SVG apparaît sous le bouton.
8. **Responsive 720px** — grille hero passe en 1-col, piliers passent en 1-col, citations passent en 1-col.
9. **Reduced-motion** — DevTools → Rendering → `prefers-reduced-motion: reduce`. Scroll doit fonctionner sans animation Fade.

- [ ] **Step 5.3: QA FR `http://localhost:4321/fr/alt/manifeste`**

Vérifier :
1. Titre et sub en français avec accents propres ("écologie", "libre lecture", "rédigé", "vôtre", "Nouméa").
2. Épigraphe FR correctement passé au composant.
3. 3 piliers FR (Ouvert par défaut / Possédé par les scientifiques / Survit à la subvention).
4. Pulse FR ("Cette semaine : 13 parcelles ajoutées…").
5. Closing FR ("Téléchargez… / Lisez le manuel. / Publiez votre portail.").
6. Pas de mélange EN/FR.
7. `<html lang="fr">` dans le source.
8. `<link rel="alternate" hreflang="en" href="https://niamoto.org/alt/manifeste">` présent.

- [ ] **Step 5.4: QA isolation tokens**

Dans DevTools, sur `/alt/manifeste`, inspecter `body`. Vérifier :
- `data-theme="manifeste"` présent.
- `--c-canvas: #F5F1E8` computed.
- `--c-accent: #B07636` computed.
- Ouvrir `/` (site principal) dans un autre tab — `--color-forest-green` y est toujours présent, Niamoto golden palette intacte.

- [ ] **Step 5.5: Dispatcher pointe vers manifeste**

Ouvrir `http://localhost:4321/alt/`. Card "Manifeste" (Wave 2 · Editorial Annex) doit être visible. Click → arrivée sur `/alt/manifeste`, pas 404.

- [ ] **Step 5.6: Lighthouse desktop**

Run dans un terminal séparé (Chrome installé requis) :
```bash
npx -y lighthouse http://localhost:4321/alt/manifeste \
  --preset=desktop --only-categories=performance,accessibility,best-practices,seo \
  --chrome-flags="--headless --no-sandbox" \
  --output=html --output-path=docs/alt/lighthouse/manifeste-en.html
```

Expected:
- Performance ≥ 90.
- Accessibility ≥ 95.
- Best practices ≥ 95.
- SEO ≥ 95.

Si Chrome non installé, skip et documenter dans REVIEW.md.

- [ ] **Step 5.7: Commit REVIEW.md**

Éditer `docs/alt/REVIEW.md` — ajouter une section "V8 Manifeste — 2026-04-17 pass" avec :

```md
### V8 Manifeste (Editorial × CRO)

Variante CRO éditorial : hero asymétrique Fraunces WONK 1 opsz 144 + épigraphe manuscrite,
trust-strip 4 citations, 3 piliers I/II/III, bande d'urgence scientifique, closing 3-phrases.

**Strengths**: l'aplomb Fraunces WONK donne le poids d'une revue scientifique. Les citations
sans logos évitent le SaaS, l'épigraphe manuscrite évite le marketing.

**Weaknesses**: l'épigraphe peut lire mal si le visiteur n'accorde pas 6 secondes d'attention.
Les citations fictionnelles à dé-fictionaliser avant prod (validation Philippe Birnbaum).

**Lighthouse**: docs/alt/lighthouse/manifeste-en.html · desktop [score].
```

```bash
git add docs/alt/REVIEW.md
git commit -m "docs(alt/manifeste): add variant audit entry to REVIEW.md"
```

---

## Risks & gotchas spécifiques à V8

1. **Fraunces WONK 1 axis** — `font-variation-settings: "WONK" 1` active les glyphes "fantaisistes" (a tail, g loop). Vérifier sur Chrome + Safari + Firefox — le support variable font est OK mais le WONK axis est custom. Si un moteur ignore WONK, le rendu fallback est safe (Fraunces normal).
2. **Citations fictionnelles** — si la validation Niamoto tarde, noter en commentaire dans le TSX que le texte est "draft" et basculer sur des citations publiques existantes (si l'équipe Niamoto en fournit).
3. **SVG scribble hover** — dépend de `stroke-dashoffset` dans un inline SVG url-encodé. Certains navigateurs ne parsent pas les `stroke-dasharray` dans un data-url ; si la micro-animation ne marche pas, fallback : sous-ligné classique `text-decoration` copper.
4. **Copy trop longue en FR** — les phrases françaises sont 15-20 % plus longues que l'anglais. Vérifier que le hero ne casse pas sur un viewport 1280px (ajuster `max-width: 14ch` si wrapping laid).
5. **AltLayout grain overlay** — `--c-grain-opacity: 0.035` est OK mais vérifier que le grain ne domine pas le copper. Sinon baisser à `0.025`.

---

## Execution handoff

Une fois V8 validé (tous les commits taggés), passer au plan suivant selon l'ordre :

- V11 Silex (simple, même pattern, sans motion complexe)
- V9 Cockpit (dashboard, tabular-nums, command palette)
- V13 Planche (scroll horizontal + print)
- V10 Sporée (p5.js + dynamic import)
- V12 Canopée (GSAP scroll-jack)

Pour exécution parallèle : créer un worktree par variante.
