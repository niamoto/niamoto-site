# /alt/ Wave 2 — Foundations Implementation Plan

> **For Claude:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Préparer les fondations partagées pour les 6 nouvelles variantes `/alt/` wave 2 (V8 Manifeste, V9 Cockpit, V10 Sporée, V11 Silex, V12 Canopée, V13 Planche) — dépendances, i18n `shared.*`, `AltLayout` étendu, `base.css` imports, et `DispatcherPage` refactoré en 2 sections (Wave 1 / Wave 2).

**Architecture:** Les fondations ne créent AUCUNE page visible supplémentaire — elles outillent le projet pour accueillir les 6 futures variantes sans avoir à rééditer les fichiers communs 6 fois. Le dispatcher passe de 7 à 13 entrées, scindé en deux grilles titrées (`Wave 1 — Niamoto-compatible` + `Wave 2 — Laboratoire`). `AltLayout` voit son type union `Theme` étendu de 7 à 13 valeurs. Les nouvelles clés i18n sont ajoutées aux deux fichiers `shared.{en,fr}.ts`. Les dépendances `gsap`, `@gsap/react` et `p5` sont ajoutées à `package.json` dès maintenant pour que les plans variantes qui les consomment n'aient plus à le faire.

**Tech Stack:** Astro 5.6, TypeScript strict, Tailwind CSS v4 (via `@tailwindcss/vite`), pnpm, `@fontsource-variable/*`. Nouvelle deps : `gsap` ≥ 3.12, `@gsap/react` ≥ 2.1, `p5` ≥ 1.10, `@types/p5` (dev).

---

## Brainstorm source

`docs/brainstorms/2026-04-17-alt-wave2-skills-combos-brainstorm.md` — commit `97227ae`.

## File Structure

| Action | Path | Responsibility |
|---|---|---|
| Modify | `package.json` | Ajouter deps `gsap`, `@gsap/react`, `p5`, `@types/p5` (dev). |
| Modify | `pnpm-lock.yaml` | Mise à jour lockfile après `pnpm install`. |
| Modify | `src/layouts/AltLayout.astro` | Étendre le type `Theme` (7 → 13) + `themeColorMap` (7 entries → 13) + `darkThemes` (ajouter `cockpit`). |
| Modify | `src/i18n/alt/shared.en.ts` | Ajouter les 6 nouvelles `variantNames` et `variantTaglines` + clés section `waveLabels`. |
| Modify | `src/i18n/alt/shared.fr.ts` | Idem FR. Utiliser des accents français propres pour les nouvelles clés. |
| Modify | `src/styles/alt/base.css` | Ajouter `@import "./manifeste.css";` et 5 autres pour les variantes W2. Les fichiers cibles sont créés vides par ce plan (ils recevront leur contenu dans les plans variantes). |
| Create | `src/styles/alt/manifeste.css` | Stub commenté. Contenu final : plan V8. |
| Create | `src/styles/alt/cockpit.css` | Stub commenté. Contenu final : plan V9. |
| Create | `src/styles/alt/sporee.css` | Stub commenté. Contenu final : plan V10. |
| Create | `src/styles/alt/silex.css` | Stub commenté. Contenu final : plan V11. |
| Create | `src/styles/alt/canopee.css` | Stub commenté. Contenu final : plan V12. |
| Create | `src/styles/alt/planche.css` | Stub commenté. Contenu final : plan V13. |
| Modify | `src/components/alt/shared/DispatcherPage.astro` | Passer la liste `variants` à 13 entrées. Séparer en deux sections visuelles `wave1` et `wave2`. |

**Décision clé** : tous les fichiers CSS stubs sont créés en même temps, avec l'`@import` correspondant dans `base.css`. Les plans variantes remplissent les stubs sans re-toucher `base.css`. Cela évite des conflits de merge entre worktrees.

**Décision clé** : les pages `src/pages/{alt,fr/alt}/<slug>.astro` NE sont PAS créées par ce plan. Chaque plan variante les crée quand il crée aussi les composants. Cela empêche que le dispatcher pointe vers des pages 404 après foundations si on interrompt la phase d'implémentation entre foundations et les variantes.

**Wait** — si le `DispatcherPage` liste 13 cards avec des URLs `/alt/manifeste`, `/alt/cockpit`, etc. mais que les pages n'existent pas, cliquer dessus donne 404 en dev. Acceptable pour un état intermédiaire ; le build Astro ne valide pas ces `href` (ce sont juste des strings). Le plan `verify` ci-dessous couvre ce risque.

---

## Task 1: Dépendances — gsap, p5, types

**Files:**
- Modify: `package.json`
- Modify: `pnpm-lock.yaml` (auto-généré)

- [ ] **Step 1.1: Ajouter les dépendances**

Run:
```bash
pnpm add gsap@^3.12.5 @gsap/react@^2.1.1 p5@^1.10.0
pnpm add -D @types/p5@^1.7.6
```

Expected: `package.json` mis à jour avec 3 nouvelles deps + 1 devDep. `pnpm-lock.yaml` mis à jour. Aucun warning bloquant.

- [ ] **Step 1.2: Vérifier que le projet compile toujours**

Run:
```bash
pnpm typecheck
```

Expected: `Result (27 files): 0 errors, 0 warnings, 0 hints` (ou équivalent — pas de nouvelle erreur introduite).

- [ ] **Step 1.3: Commit**

Run:
```bash
git add package.json pnpm-lock.yaml
git commit -m "feat(alt): add gsap, p5.js deps for wave 2 variants"
```

---

## Task 2: Étendre `AltLayout.astro` — Theme type union + themeColorMap

**Files:**
- Modify: `src/layouts/AltLayout.astro:15-22` (type `Theme`)
- Modify: `src/layouts/AltLayout.astro:37` (array `darkThemes`)
- Modify: `src/layouts/AltLayout.astro:40-48` (map `themeColorMap`)

- [ ] **Step 2.1: Étendre le type union `Theme`**

Edit `src/layouts/AltLayout.astro`, remplacer le type `Theme` :

```ts
type Theme =
  | "atlas"
  | "field-journal"
  | "methode"
  | "herbarium"
  | "observatory"
  | "portail"
  | "strate"
  | "manifeste"
  | "cockpit"
  | "silex"
  | "sporee"
  | "canopee"
  | "planche";
```

- [ ] **Step 2.2: Ajouter `cockpit` à `darkThemes`**

Remplacer :
```ts
const darkThemes: ReadonlyArray<Theme> = ["methode", "herbarium", "observatory"];
```
par :
```ts
const darkThemes: ReadonlyArray<Theme> = [
  "methode",
  "herbarium",
  "observatory",
  "cockpit",
];
```

Raison : V9 Cockpit est la seule nouvelle variante à registre dark (slate `#0B1220`).

- [ ] **Step 2.3: Étendre `themeColorMap`**

Ajouter les 6 nouvelles entrées (valeurs = `--c-canvas` de chaque variante, cf. brainstorm doc) :

```ts
const themeColorMap: Record<Theme, string> = {
  atlas: "#FDFBF7",
  "field-journal": "#F5EEE0",
  methode: "#1E2822",
  herbarium: "#1A1410",
  observatory: "#070908",
  portail: "#F7F4EE",
  strate: "#EFEBE2",
  manifeste: "#F5F1E8",
  cockpit: "#0B1220",
  silex: "#F7F5F0",
  sporee: "#F3EEE2",
  canopee: "#0A0E0B",
  planche: "#EDE4D0",
};
```

- [ ] **Step 2.4: Vérifier typecheck**

Run:
```bash
pnpm typecheck
```

Expected: pas d'erreur. `Theme` étendu, maps exhaustifs, TypeScript content.

- [ ] **Step 2.5: Commit**

Run:
```bash
git add src/layouts/AltLayout.astro
git commit -m "feat(alt): extend AltLayout Theme union + themeColorMap for wave 2 variants"
```

---

## Task 3: Étendre `shared.en.ts` — nouvelles clés i18n anglaises

**Files:**
- Modify: `src/i18n/alt/shared.en.ts:31-48` (variantNames + variantTaglines)
- Modify: `src/i18n/alt/shared.en.ts` (ajouter `waveLabels` section)

- [ ] **Step 3.1: Étendre `variantNames`**

Dans `shared.en.ts`, étendre `variantNames` :

```ts
variantNames: {
  atlas: "Atlas",
  "field-journal": "Field Journal",
  methode: "Methode",
  herbarium: "Herbarium",
  observatory: "Observatory",
  portail: "Portail",
  strate: "Strate",
  manifeste: "Manifeste",
  cockpit: "Cockpit",
  silex: "Silex",
  sporee: "Sporée",
  canopee: "Canopée",
  planche: "Planche",
},
```

- [ ] **Step 3.2: Étendre `variantTaglines`**

Ajouter les 6 taglines :

```ts
variantTaglines: {
  atlas: "Cream and sage. A scientific atlas read.",
  "field-journal": "A field ecologist's notebook.",
  methode: "Devtool calm, science depth.",
  herbarium: "Espresso gravity. A living herbarium.",
  observatory: "Deep OLED. A live ecological observatory.",
  portail: "From field to portal, proof of output.",
  strate: "Longform editorial, layer by layer.",
  manifeste: "A manifesto for open ecological data.",
  cockpit: "Niamoto, live. Real numbers, three portals.",
  silex: "Fewer things, better said.",
  sporee: "Niamoto is a seed. Every run draws a new world.",
  canopee: "A forest, from canopy to soil.",
  planche: "Specimens for the data herbarium of tomorrow.",
},
```

- [ ] **Step 3.3: Ajouter la section `waveLabels`**

Ajouter, avant le `} as const;` final :

```ts
  waveLabels: {
    wave1Eyebrow: "WAVE I — NIAMOTO-COMPATIBLE",
    wave1Heading: "Editorial register, seven reads of the same idea.",
    wave2Eyebrow: "WAVE II — LABORATORY",
    wave2Heading: "Off-grid experiments. Same subject, looser rules.",
  },
```

- [ ] **Step 3.4: Typecheck**

Run: `pnpm typecheck`

Expected: 0 erreurs. Les 13 clés `variantNames` et `variantTaglines` sont ajoutées.

- [ ] **Step 3.5: Commit**

```bash
git add src/i18n/alt/shared.en.ts
git commit -m "feat(alt): add wave 2 variant names, taglines, wave labels (EN)"
```

---

## Task 4: Étendre `shared.fr.ts` — équivalent français avec accents

**Files:**
- Modify: `src/i18n/alt/shared.fr.ts`

- [ ] **Step 4.1: Étendre `variantNames` FR**

```ts
variantNames: {
  atlas: "Atlas",
  "field-journal": "Carnet de terrain",
  methode: "Methode",
  herbarium: "Herbier",
  observatory: "Observatoire",
  portail: "Portail",
  strate: "Strate",
  manifeste: "Manifeste",
  cockpit: "Cockpit",
  silex: "Silex",
  sporee: "Sporée",
  canopee: "Canopée",
  planche: "Planche",
},
```

Note : les clés V1-V7 restent sans accents pour cohérence avec l'existant. Les clés V8-V13 utilisent les accents français (conforme au CLAUDE.md projet).

- [ ] **Step 4.2: Étendre `variantTaglines` FR**

```ts
variantTaglines: {
  atlas: "Creme et sauge. Un atlas scientifique.",
  "field-journal": "Le carnet d'un ecologue de terrain.",
  methode: "Calme devtool, profondeur scientifique.",
  herbarium: "Gravite espresso. Un herbier vivant.",
  observatory: "OLED profond. Un observatoire ecologique vivant.",
  portail: "Du terrain au portail, la preuve en sortie.",
  strate: "Longform editorial, strate par strate.",
  manifeste: "Un manifeste pour une écologie en libre lecture.",
  cockpit: "Niamoto en direct. Chiffres réels de trois portails.",
  silex: "Moins de choses, mieux dites.",
  sporee: "Niamoto est une graine. Chaque instance dessine un monde.",
  canopee: "Une forêt, de la canopée au sol.",
  planche: "Spécimens pour l'herbier de données à venir.",
},
```

- [ ] **Step 4.3: Ajouter la section `waveLabels` FR**

```ts
  waveLabels: {
    wave1Eyebrow: "VAGUE I — COMPATIBLE NIAMOTO",
    wave1Heading: "Registre éditorial, sept lectures d'une même idée.",
    wave2Eyebrow: "VAGUE II — LABORATOIRE",
    wave2Heading: "Expériences hors-grille. Même sujet, règles plus lâches.",
  },
```

- [ ] **Step 4.4: Typecheck**

Run: `pnpm typecheck`

Expected: 0 erreurs. `SharedStrings` type (exporté par `src/i18n/alt/index.ts`) reflète automatiquement les nouvelles clés.

- [ ] **Step 4.5: Commit**

```bash
git add src/i18n/alt/shared.fr.ts
git commit -m "feat(alt): add wave 2 variant names, taglines, wave labels (FR)"
```

---

## Task 5: Stubs CSS + extension de `base.css`

**Files:**
- Create: `src/styles/alt/manifeste.css`, `cockpit.css`, `silex.css`, `sporee.css`, `canopee.css`, `planche.css`
- Modify: `src/styles/alt/base.css:14-23` (imports section)

- [ ] **Step 5.1: Créer les 6 stubs CSS**

Chaque fichier contient juste un commentaire placeholder qui sera remplacé par son plan variante.

`src/styles/alt/manifeste.css`:
```css
/* V8 Manifeste — populated by docs/plans/2026-04-17-alt-wave2-v8-manifeste-plan.md. */
[data-theme="manifeste"] {
  /* tokens TBD */
}
```

Répéter pour `cockpit.css`, `silex.css`, `sporee.css`, `canopee.css`, `planche.css` en remplaçant le nom et le chemin du plan.

- [ ] **Step 5.2: Étendre `base.css` avec les 6 imports**

Modifier la section imports de `src/styles/alt/base.css` :

```css
/* Fonts and per-variant token scopes. */
@import "./fonts.css";
@import "./atlas.css";
@import "./field-journal.css";
@import "./methode.css";
@import "./herbarium.css";
@import "./observatory.css";
@import "./portail.css";
@import "./strate.css";
@import "./manifeste.css";
@import "./cockpit.css";
@import "./silex.css";
@import "./sporee.css";
@import "./canopee.css";
@import "./planche.css";
```

- [ ] **Step 5.3: Build → vérifier compilation**

Run:
```bash
pnpm build
```

Expected: `pnpm run astro check` et `astro build` passent tous les deux. La sortie doit lister toutes les pages actuelles (20 — car on n'a pas encore créé les nouvelles pages variantes). Aucune erreur Tailwind sur les imports.

**Si erreur Tailwind** : vérifier que les stubs CSS sont ASCII-only (pas de caractères Unicode dans les commentaires) — gotcha documenté dans `REVIEW.md`.

- [ ] **Step 5.4: Commit**

```bash
git add src/styles/alt/{manifeste,cockpit,silex,sporee,canopee,planche}.css src/styles/alt/base.css
git commit -m "feat(alt): wire wave 2 CSS theme stubs into base.css"
```

---

## Task 6: Refactor `DispatcherPage.astro` — 13 entrées en 2 grilles

**Files:**
- Modify: `src/components/alt/shared/DispatcherPage.astro:35-92` (variants array)
- Modify: `src/components/alt/shared/DispatcherPage.astro:95-170` (template)
- Modify: `src/components/alt/shared/DispatcherPage.astro:171-333` (style is:global)

- [ ] **Step 6.1: Étendre le tableau `variants`**

Remplacer le tableau `variants` (7 entries) par 13 entrées + une colonne `wave: "alt" | "lab"` :

```ts
interface VariantCard {
  slug: string;
  theme:
    | "atlas" | "field-journal" | "methode" | "herbarium"
    | "observatory" | "portail" | "strate"
    | "manifeste" | "cockpit" | "silex"
    | "sporee" | "canopee" | "planche";
  wave: "alt" | "lab";
  swatches: string[];
  font: string;
  layout: { en: string; fr: string };
  url: string;
}

const variants: VariantCard[] = [
  // ---- Wave 1 (existing, keep unchanged) ----
  { slug: "atlas", theme: "atlas", wave: "alt",
    swatches: ["#FDFBF7", "#516B5A", "#A66B3B", "#121212"],
    font: "Fraunces (light, italic accent) + Geist",
    layout: { en: "Editorial Split", fr: "Editorial Split" },
    url: `${altRoot}/atlas` },
  { slug: "field-journal", theme: "field-journal", wave: "alt",
    swatches: ["#F5EEE0", "#3E5F45", "#B8633C", "#0F0F0F"],
    font: "Fraunces (semibold, wonk) + Plus Jakarta Sans",
    layout: { en: "Z-Axis Cascade", fr: "Z-Axis Cascade" },
    url: `${altRoot}/field-journal` },
  { slug: "methode", theme: "methode", wave: "alt",
    swatches: ["#1E2822", "#E8E2D0", "#C08A3E", "#7CA0A8"],
    font: "Cabinet Grotesk + Satoshi",
    layout: { en: "Asymmetrical Bento", fr: "Bento asymetrique" },
    url: `${altRoot}/methode` },
  { slug: "herbarium", theme: "herbarium", wave: "alt",
    swatches: ["#1A1410", "#E8DCC8", "#B87C4F", "#7A8B6F"],
    font: "Fraunces (black, opsz 144) + Geist",
    layout: { en: "Editorial Split + Z-Axis", fr: "Editorial Split + Z-Axis" },
    url: `${altRoot}/herbarium` },
  { slug: "observatory", theme: "observatory", wave: "alt",
    swatches: ["#070908", "#E6EBE7", "#6BD99B", "#7FA7C4"],
    font: "Geist Variable + JetBrains Mono",
    layout: { en: "Ethereal Glass Bento", fr: "Bento verre ethere" },
    url: `${altRoot}/observatory` },
  { slug: "portail", theme: "portail", wave: "alt",
    swatches: ["#F7F4EE", "#3A4F42", "#AE6A3B", "#121414"],
    font: "Clash Display + Geist",
    layout: { en: "Soft Structuralism Split", fr: "Editorial doux + rail portail" },
    url: `${altRoot}/portail` },
  { slug: "strate", theme: "strate", wave: "alt",
    swatches: ["#EFEBE2", "#4B6150", "#8A6D3D", "#1A1815"],
    font: "Fraunces (display) + Geist",
    layout: { en: "Longform Editorial", fr: "Longform editorial" },
    url: `${altRoot}/strate` },

  // ---- Wave 2 Alt (Niamoto-compatible) ----
  { slug: "manifeste", theme: "manifeste", wave: "alt",
    swatches: ["#F5F1E8", "#1F3A29", "#B07636", "#0F1111"],
    font: "Fraunces (WONK 1) + Geist + JetBrains Mono",
    layout: { en: "CRO Editorial", fr: "CRO editorial" },
    url: `${altRoot}/manifeste` },
  { slug: "cockpit", theme: "cockpit", wave: "alt",
    swatches: ["#0B1220", "#F2F2ED", "#4BAF50", "#E9A53A"],
    font: "Geist Variable + JetBrains Mono",
    layout: { en: "Live Dashboard Bento", fr: "Bento dashboard vivant" },
    url: `${altRoot}/cockpit` },
  { slug: "silex", theme: "silex", wave: "alt",
    swatches: ["#F7F5F0", "#3A3835", "#5C7051", "#5C7051"],
    font: "Geist Mono (light) + Fraunces (light)",
    layout: { en: "Radical Minimal", fr: "Minimal radical" },
    url: `${altRoot}/silex` },

  // ---- Wave 2 Lab (off-rule) ----
  { slug: "sporee", theme: "sporee", wave: "lab",
    swatches: ["#F3EEE2", "#A34B28", "#4A3A6B", "#1A1612"],
    font: "Migra Italic (fallback Fraunces) + Berkeley Mono",
    layout: { en: "Generative p5.js", fr: "Generatif p5.js" },
    url: `${altRoot}/sporee` },
  { slug: "canopee", theme: "canopee", wave: "lab",
    swatches: ["#0A0E0B", "#5E8255", "#C9A86A", "#D4E0D0"],
    font: "Fraunces (display) + Geist Mono",
    layout: { en: "GSAP 5-phase Scroll", fr: "Scroll GSAP 5 phases" },
    url: `${altRoot}/canopee` },
  { slug: "planche", theme: "planche", wave: "lab",
    swatches: ["#EDE4D0", "#3F2A18", "#232F58", "#A03223"],
    font: "IM Fell + Caslon Italic",
    layout: { en: "Horizontal Plate", fr: "Planche horizontale" },
    url: `${altRoot}/planche` },
];
```

- [ ] **Step 6.2: Créer helper local pour filtrer par wave**

Juste avant le `---` de fermeture du frontmatter :

```ts
const wave1 = variants.filter((v) => v.wave === "alt" && [
  "atlas", "field-journal", "methode", "herbarium",
  "observatory", "portail", "strate",
].includes(v.slug));

const wave2Alt = variants.filter((v) => v.wave === "alt" && [
  "manifeste", "cockpit", "silex",
].includes(v.slug));

const wave2Lab = variants.filter((v) => v.wave === "lab");

const titleText = isFr
  ? "Treize directions de design pour niamoto.org"
  : "Thirteen design directions for niamoto.org";

const introText = isFr
  ? "Vague I : sept variantes compatibles avec l'identité Niamoto. Vague II : six explorations plus libres, dont trois en laboratoire hors-règle. Les deux vagues partagent le même contenu ; chacune applique une grammaire visuelle différente."
  : "Wave I: seven variants compatible with Niamoto's identity. Wave II: six looser explorations, three of which break the editorial rule. Both waves share the same subject; each applies a different visual grammar.";
```

Supprimer l'ancien `titleText` et `introText` calculés avec "Sept / Seven".

- [ ] **Step 6.3: Refactor template — trois `StaggeredReveal` grids**

Dans `<main id="main" class="dispatcher">`, remplacer la section unique `dispatcher__grid` par trois sections :

```astro
<section class="dispatcher__section" aria-labelledby="wave1-heading">
  <div class="dispatcher__section-head">
    <EyebrowTag variant="outlined">{t.waveLabels.wave1Eyebrow}</EyebrowTag>
    <p id="wave1-heading" class="dispatcher__section-heading">{t.waveLabels.wave1Heading}</p>
  </div>
  <StaggeredReveal client:visible stagger={0.08} y={16} as="ul" className="dispatcher__grid">
    {wave1.map((v) => (
      {/* same card template as before */}
    ))}
  </StaggeredReveal>
</section>

<section class="dispatcher__section" aria-labelledby="wave2alt-heading">
  <div class="dispatcher__section-head">
    <EyebrowTag variant="outlined">{t.waveLabels.wave1Eyebrow.replace(/I\b/, "I · bis")}</EyebrowTag>
    <p id="wave2alt-heading" class="dispatcher__section-heading">{isFr ? "Vague II — compatible" : "Wave II — compatible"}</p>
  </div>
  <StaggeredReveal client:visible stagger={0.08} y={16} as="ul" className="dispatcher__grid">
    {wave2Alt.map((v) => (
      {/* same card template */}
    ))}
  </StaggeredReveal>
</section>

<section class="dispatcher__section" aria-labelledby="wave2lab-heading">
  <div class="dispatcher__section-head">
    <EyebrowTag variant="outlined">{t.waveLabels.wave2Eyebrow}</EyebrowTag>
    <p id="wave2lab-heading" class="dispatcher__section-heading">{t.waveLabels.wave2Heading}</p>
  </div>
  <StaggeredReveal client:visible stagger={0.08} y={16} as="ul" className="dispatcher__grid">
    {wave2Lab.map((v) => (
      {/* same card template */}
    ))}
  </StaggeredReveal>
</section>
```

Factoriser le template de `<li class="dispatcher-card …">` en un composant Astro local si ça devient trop long (mais garder simple : un `.map` répété est OK pour 13 cards).

**Simplification** : au lieu de `.replace(/I\b/, "I · bis")`, ajouter une clé dédiée `wave2AltEyebrow` dans `shared.{en,fr}.ts` si c'est plus clair.

**Décision** : ajouter `wave2AltEyebrow` et `wave2AltHeading` aux shared pour rester propre :

```ts
// shared.en.ts
waveLabels: {
  wave1Eyebrow: "WAVE I — NIAMOTO-COMPATIBLE",
  wave1Heading: "Editorial register, seven reads of the same idea.",
  wave2AltEyebrow: "WAVE II — EDITORIAL ANNEX",
  wave2AltHeading: "Three further reads, still Niamoto-compatible.",
  wave2Eyebrow: "WAVE II — LABORATORY",
  wave2Heading: "Off-grid experiments. Same subject, looser rules.",
},

// shared.fr.ts
waveLabels: {
  wave1Eyebrow: "VAGUE I — COMPATIBLE NIAMOTO",
  wave1Heading: "Registre éditorial, sept lectures d'une même idée.",
  wave2AltEyebrow: "VAGUE II — ANNEXE ÉDITORIALE",
  wave2AltHeading: "Trois lectures complémentaires, toujours compatibles Niamoto.",
  wave2Eyebrow: "VAGUE II — LABORATOIRE",
  wave2Heading: "Expériences hors-grille. Même sujet, règles plus lâches.",
},
```

Revenir à Task 3.3 et 4.3 pour amender les ajouts (ou faire une correction ultérieure dans Task 6).

**Décision pratique** : créer ce plan en ordre — si le dev exécute task par task, il peut inclure `wave2Alt*` dès Task 3.3 et 4.3 (pré-ajout). Je renomme en conséquence ci-dessous.

- [ ] **Step 6.4: Styles — espacer les 3 sections**

Dans le `<style is:global>` du dispatcher, AJOUTER (ne pas remplacer les règles existantes) :

```css
.dispatcher__section {
  margin-top: 5rem;
}
.dispatcher__section:first-of-type {
  margin-top: 0;
}
.dispatcher__section-head {
  margin-bottom: 2rem;
}
.dispatcher__section-heading {
  font-family: var(--f-display);
  font-variation-settings: var(--fvs-display);
  font-size: clamp(1.4rem, 2.4vw, 1.9rem);
  letter-spacing: -0.01em;
  color: var(--c-ink);
  max-width: 48ch;
  margin-top: 1rem;
}
```

- [ ] **Step 6.5: Ajuster la grille pour 7 cards (Wave 1) vs 3 cards (Wave 2)**

Pour que la grille 3-col ait une dernière ligne équilibrée :

- Wave 1 : 7 cards en 3-col → 3+3+1 dernière ligne (laisser tel quel, OK éditorialement).
- Wave 2 Alt : 3 cards en 3-col → 1 ligne complète.
- Wave 2 Lab : 3 cards en 3-col → 1 ligne complète.

Aucune règle CSS supplémentaire nécessaire pour `grid-template-columns`. Les responsive breaks existants (`1100px` → 2-col, `640px` → 1-col) s'appliquent à chaque section.

- [ ] **Step 6.6: Build + preview**

Run:
```bash
pnpm build && pnpm preview
```

Expected: build vert, preview local sert `http://localhost:4321/alt/` avec 13 cards en 3 sections. Les cards W2 pointent vers `/alt/manifeste` etc. qui vont 404 (attendu tant que les plans variantes ne sont pas exécutés).

- [ ] **Step 6.7: Visual QA (browser)**

Ouvrir `http://localhost:4321/alt/` et `http://localhost:4321/fr/alt/` dans le browser.

Vérifier :
- Titre "Treize directions…" / "Thirteen design directions…" affiché.
- 3 sections visibles avec en-têtes distincts.
- Swatches lisibles pour toutes les 13 cards.
- Responsive : resize à 900px, 640px — grille s'adapte (2-col → 1-col).
- Hover sur chaque card : border darkens, lift subtle.
- Tab-navigation : focus ring visible sur chaque card-link.
- Pas de console error Astro/React.

- [ ] **Step 6.8: Commit**

```bash
git add src/components/alt/shared/DispatcherPage.astro src/i18n/alt/shared.en.ts src/i18n/alt/shared.fr.ts
git commit -m "feat(alt): refactor DispatcherPage to 13 variants in 3 sections (wave 1, wave 2 alt, wave 2 lab)"
```

(Note : les i18n ont peut-être déjà été committées en Task 3/4. Si oui, ce commit ne stagera que le dispatcher.)

---

## Task 7: Sanity check global

**Files:** aucun. Vérifications uniquement.

- [ ] **Step 7.1: Typecheck**

Run: `pnpm typecheck`

Expected: 0 erreurs.

- [ ] **Step 7.2: Full build**

Run: `pnpm build`

Expected: 20 pages statiques générées (les 14 existantes + dispatcher FR/EN updates). Aucune nouvelle page variante créée (c'est normal). Aucune erreur Tailwind ni Astro.

- [ ] **Step 7.3: Inspecter le DOM du dispatcher**

Run: `pnpm preview` puis `curl -s http://localhost:4321/alt/ | grep -c 'dispatcher-card'`

Expected: 13 occurrences (une par card).

- [ ] **Step 7.4: Marquer le plan terminé**

Pas de commit. Le plan foundations est achevé si toutes les cases sont cochées et que :

- Les 13 variants sont listés dans le dispatcher.
- Les 6 stubs CSS existent et sont importés dans `base.css`.
- `AltLayout.Theme` supporte les 13 noms.
- Les deps `gsap`, `@gsap/react`, `p5`, `@types/p5` sont installées.

---

## Risks & gotchas

1. **Tailwind v4 Unicode dans commentaires CSS** — les stubs CSS doivent rester ASCII-only dans les commentaires (pas d'accents, pas de caractères box-drawing). Voir `REVIEW.md §Architecture`.
2. **Scoped CSS vs React-rendered roots** — les nouvelles sections du dispatcher utilisent `StaggeredReveal` (React island). Les styles visant `.dispatcher__section`, `.dispatcher__grid`, etc. doivent être `is:global` (comme le reste du dispatcher) — sinon les `data-astro-cid-*` ne propagent pas et les règles ne s'appliquent pas. Voir `REVIEW.md §Astro scoped CSS`.
3. **TypeScript sur `SharedStrings`** — `src/i18n/alt/index.ts` exporte `type SharedStrings = typeof sharedEn`. Si `shared.en.ts` et `shared.fr.ts` divergent structurellement (une clé manquante d'un côté), TypeScript remontera l'erreur au premier `getShared()` en contexte strict. Les deux fichiers DOIVENT avoir les mêmes clés, dans le même ordre idéalement.
4. **Pages 404** — entre foundations et les plans variantes, `/alt/manifeste` etc. donnent 404. Acceptable mais signale au dev que l'ordre d'exécution des plans compte : foundations d'abord, puis variantes dans n'importe quel ordre.
5. **GSAP licence** — GSAP v3 est gratuit pour usage commercial depuis le rachat Webflow (fin 2024). Niamoto est OSS (Apache 2.0), pas de frein. Pour les plugins premium (SplitText, DrawSVGPlugin), licence séparée nécessaire — le plan V12 n'utilise que les plugins core (ScrollTrigger inclus gratuit).
6. **p5 bundle** — `p5@^1.10` pèse ~800kb minifié. Le plan V10 l'importe en dynamic import (`import()`), donc il n'impacte QUE `/alt/sporee` et `/fr/alt/sporee`. Aucun effet sur les autres pages.

---

## Execution handoff

Une fois les 7 tasks cochées, enchaîner sur les plans variantes :

- `docs/plans/2026-04-17-alt-wave2-v8-manifeste-plan.md`
- `docs/plans/2026-04-17-alt-wave2-v9-cockpit-plan.md`
- `docs/plans/2026-04-17-alt-wave2-v11-silex-plan.md`
- `docs/plans/2026-04-17-alt-wave2-v10-sporee-plan.md`
- `docs/plans/2026-04-17-alt-wave2-v12-canopee-plan.md`
- `docs/plans/2026-04-17-alt-wave2-v13-planche-plan.md`

Ordre suggéré : V11 Silex en premier (le plus simple, bon test du pattern), puis V8, V9, V10, V13, V12 (le plus complexe). Ou en parallèle en worktrees séparés — les plans ne se chevauchent plus une fois foundations commité.
