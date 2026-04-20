---
title: /alt/ — Wave 2, Skills Combos Testing
date: 2026-04-17
branch: feat/landing-alternatives
status: brainstorm (ready for planning)
supersedes: —
extends: docs/brainstorms/2026-04-15-niamoto-landing-alternatives-brainstorm.md
---

# Wave 2 — Six Variantes pour Tester les Skills Frontend-Design

## Contexte

Sept variantes `/alt/*` déjà shippées en wave 1 (voir `docs/alt/REVIEW.md`, commits `9b80006 → 54fa8a6`) :
Atlas, Field Journal, Méthode, Herbarium, Observatory, Portail, Strate — registres *Editorial Luxury* (V1-V4), *Ethereal Glass* (V5), *Soft Structuralism* (V6-V7). Architecture d'isolation validée (`AltLayout` scopé, pas d'import `BaseLayout`/`global.css`, token scoping via `[data-theme]`). Build vert à 20 pages, 1.39 s.

L'environnement Claude Code propose une vingtaine de skills frontend-design distincts (frontend-design, minimalist-ui, gpt-taste, high-end-visual-design, design-taste-frontend, landing-page-design, kpi-dashboard-design, algorithmic-art, canvas-design, stitch-design, shadcn-ui, superdesign, redesign-existing-projects, tailwind-design-system, anti-slop, ui-ux-pro-max, etc.). La wave 1 a majoritairement sollicité `frontend-design` + `high-end-visual-design`. Les autres skills sont sous-testés.

## Objectif

Produire une deuxième vague de **six variantes hybrides** (V8-V13), chacune combinant **deux à trois skills** comme ingrédients principaux, pour :

1. Tester visiblement ce que chaque skill produit (démo par la pratique).
2. Maximiser la variance entre variantes existantes et nouvelles — registres, palettes, typographies, compositions, motion, contenu tous distincts.
3. Ouvrir un second bac `/lab/*` pour les variantes qui dévient volontairement de la golden rule Niamoto (*scientific, calm, data-forward, no emojis, no gradients, no "revolutionary" language*), sans polluer `/alt/`.

## Cadrage (décisions prises)

| Décision | Choix |
|---|---|
| Divergence golden rule | **Deux bacs séparés** — `/alt/` Niamoto-compatible, `/lab/` Niamoto-déliré (hors règle assumé). |
| Stratégie de couverture | **Combos hybrides** — chaque variante = 2-3 skills, pas "1 skill = 1 variante". |
| Volume | **6 variantes** (3 `/alt/` + 3 `/lab/`). |
| Contenu `/lab/` | **Niamoto déliré** — même base de texte/sujet que `/alt/`, mais ton et traitement hors règle. |
| Structure de roster | **Approche C** — chaque variante a un skill dominant clairement identifiable + compagnons. |

## Roster V8-V13

| # | Nom | Bac | Skills dominants | Pitch |
|---|---|---|---|---|
| V8 | Manifeste | `/alt/` | landing-page-design × high-end-visual-design | CRO éditorial Niamoto : hero + proofs + urgency, joué en registre publication scientifique. |
| V9 | Cockpit | `/alt/` | kpi-dashboard-design × shadcn-ui | "Niamoto, live." La page EST un dashboard. 12 KPI tiles, sparklines, status rail, Cmd+K install. |
| V11 | Silex | `/alt/` | minimalist-ui × stitch-design-taste | Zéro fioritures radical. 3 couleurs. Geist Mono Light body. 1 phrase, 1 chiffre géant, 1 CTA texte. |
| V10 | Sporée | `/lab/` | algorithmic-art × frontend-design | p5.js fullscreen flow field, seed déterministe (date + locale). "Every run draws a new world." |
| V12 | Canopée | `/lab/` | gpt-taste × anti-slop | Scroll-jack GSAP cinématique, 5 pinning par strate de forêt, caméra qui descend canopée → sol. |
| V13 | Planche | `/lab/` | canvas-design × algorithmic-art | Scroll horizontal desktop = planche d'herbier A3. 9 spécimens plugins. `@media print` PDF-ready. |

### V8 Manifeste — `/alt/`

- **Palette** : parchment `#F5F1E8`, forest deep `#1F3A29`, copper `#B07636`, ink `#0F1111`.
- **Typo** : Fraunces opsz 144 wght 500 WONK 1 (display) / Geist Variable (body) / JetBrains Mono (stats).
- **Hero asymétrique** : épigraphe manuscrite gauche + titre clamp(4rem, 9vw, 9rem) droite, sub 2 lignes, double-CTA copper + ghost.
- **Sections** : 4 citations de directeurs d'herbier (sans logos, traitement strip scholarly) ; 3 piliers numérotés chiffres romains I/II/III façon sommaire de monographie ; bande d'urgence scientifique "13 plots added this week" ; closing manifesto 3-phrases.
- **Copy hook** : *"A manifesto for open ecological data."*
- **Signature move** : hover sur CTA trace un micro-scribble SVG `stroke-dasharray`. Shadows `color-mix(in srgb, #1F3A29 12%, transparent)`.
- **Composants** : `ManifestoHero`, `ScholarCitations`, `MonographPillars`, `WeeklyPulseBand`, `ClosingManifesto`.

### V9 Cockpit — `/alt/`

- **Palette** : slate `#0B1220`, ivory `#F2F2ED`, emerald `#4BAF50`, amber `#E9A53A` — seul /alt/ dark.
- **Typo** : Geist Variable + JetBrains Mono. `font-variant-numeric: tabular-nums` partout.
- **Layout** : zéro hero narratif. Bento 4+4+4 KPI tiles direct. 2 wide = sparklines (commits GitHub 12 mois + ajouts taxons). Chiffres monumentaux.
- **KPI set** : 1208 taxons, 509 plots, 2713 endémiques, 70k+ arbres, 42 plugins, 3 portails, latency ops, uptime.
- **Rail** : sticky à droite "Status ops" — 3 dots verts (portail NC / Gabon / Guyane).
- **CTA** : `Cmd+K` modal shadcn inline (faux command palette) pour `install niamoto`. Pas de "Sign up".
- **Copy hook** : *"Niamoto, live."* / sub : *"Real numbers from three forest portals."*
- **Signature move** : counters tabular monospace animés, chaque tile un status dot top-right.
- **Composants** : `CockpitGrid`, `KPITile`, `SparkCard`, `StatusRail`, `CommandPaletteInstall`.

### V11 Silex — `/alt/`

- **Palette** : stone `#F7F5F0`, flint `#3A3835`, moss `#5C7051` — **3 couleurs TOTAL**.
- **Typo** : Geist Mono Light body ! + fallback Fraunces light opsz 144 pour display 180px. Anti-Atlas.
- **Hero** : 1 phrase sur 2 lignes clamp(3rem, 6vw, 7rem) gris 40%. Un seul chiffre géant **2713** (mono 300px). CTA texte underline `Start →` — pas de bouton.
- **Scroll** : 4 paliers identiques en structure — 1 mot (type 60vh), 1 phrase, 1 nombre. Mots = *Observe / Collect / Publish / Share*.
- **Coda** : *"Since 2016. With IRD, CIRAD, AMAP."* — pas de FunderGrid.
- **Copy hook** : *"Fewer things, better said."*
- **Signature move** : densité visuelle diminue à chaque section. Hover verbes : tracking serré → lâche (80 ms).
- **Composants** : `SilexHero`, `SingleNumber`, `VerbStrate` (×4), `SilexCoda`.

### V10 Sporée — `/lab/`

- **Palette** : bone `#F3EEE2`, rust `#A34B28`, spore-violet `#4A3A6B`, ink `#1A1612`.
- **Typo** : Migra Extrabold Italic (display) + Söhne Kräftig (body) + Berkeley Mono (code).
- **Hero** : p5.js canvas fullscreen fixe, `pointer-events: none` — flow field de spores qui flottent. Texte HTML superposé semi-opaque.
- **Seed déterministe** : `hash(date + navigator.language)` — 2 visiteurs différents voient 2 compositions différentes, déterministe donc pas de layout jumpy.
- **Section 2** : canvas redraw sur scroll-y (density param mappé à progress). Section 3 : grid 6 captures screenshots preuve multi-compositions.
- **Install card** : Berkeley Mono sur carte craft-paper (texture).
- **Copy hook** : *"Niamoto is a seed. Every run draws a new world."*
- **Signature move** : badge seed du jour en haut droite — `#SEED 4C3A1F·2026-04-17` Berkeley Mono.
- **Composants** : `SporeCanvas` (react-p5 ou vanilla), `SeedBadge`, `FlowGallery`, `BerkeleyInstallCard`.
- **Reduced-motion** : fallback image PNG statique (capture précalculée du jour).

### V12 Canopée — `/lab/`

- **Palette** : night `#0A0E0B`, canopy `#5E8255`, understory `#C9A86A`, mist `#D4E0D0`.
- **Typo** : Fraunces opsz 144 wght 700 tracking -0.05em (display XL) + Geist Mono (body).
- **Concept** : scroll-jack cinématique complet GSAP ScrollTrigger, **5 phases pin/scrub** :
  1. Canopée — hero zoom avant sur feuillage SVG layered
  2. Sous-bois — 3 plateaux stacking (texte scroll sur image fixe)
  3. Strate arbustive — data-viz construction (SVG `stroke-dasharray` 0 → 100)
  4. Strate herbacée — grid plugins déploiement séquentiel
  5. Sol — closing quote + terminal typewriter final
- **Scroll total** : ~3000vh (cinéma). Parallaxe SVG strate-par-strate.
- **Copy hook** : *"A forest, from canopy to soil."* — 5 actes scénarisés.
- **Signature move** : ce n'est pas une parallax — une caméra descend réellement dans la forêt. Anti-slop respecté (pas de purple gradient, backdrops tintés).
- **Composants** : `CanopyStage` (×5), `ForestPinController`, `SvgStrateLayers`.
- **Nouvelle dep** : `gsap` ≥ 3.12.
- **Perf/a11y** : scroll-jack désactivé `(max-width: 900px)` + `prefers-reduced-motion: reduce` → fallback scroll natif vertical, contenu intact.

### V13 Planche — `/lab/`

- **Palette** : paper `#EDE4D0`, sepia `#3F2A18`, indigo `#232F58`, madder red `#A03223`.
- **Typo** : IM Fell Double Pica SC (serif grainée XIXe) + Caslon Italic (captions). Sans-serif uniquement en micro-footers.
- **Concept** : scroll **HORIZONTAL** desktop (2400px wide) = planche d'herbier A3 dépliée. Fallback vertical mobile.
- **Composition** :
  - Gauche : titre *"PLANCHE Nº VIII — Niamoto Specimens"*, numérotation romaine, date.
  - Milieu : 9 "spécimens" botaniques SVG en quinconce — chaque spécimen = un plugin (transform → palmier, export → algue, cli → fougère). Hover révèle nom + commande install.
  - Droite : *"NOTES DE TERRAIN"* colonne serrée, 4 paragraphes numérotés, notes de bas de page.
- **Texture** : grain papier via `feTurbulence` SVG filter sur `<body>`.
- **Print** : `@media print` rend la page en A3 paysage imprimable tel quel (PDF-like).
- **Copy hook** : *"Planche VIII — specimens for the data herbarium of tomorrow."*
- **Signature move** : CTA final `window.print()` ("Print this page"). Génératif : numéro planche = date romaine (2026-04-17 → "VIII·IV·MMXXVI").
- **Composants** : `PlanchePage` (scroll horizontal), `Specimen` (×9 SVG), `FieldNotesColumn`, `PrintStylesheet`, util `romanize()`.

## Fondations techniques

Héritées de la wave 1 (`REVIEW.md §Architecture decisions in practice`). Aucune régression introduite.

### Isolation & scoping

- `src/layouts/AltLayout.astro` **continue** de ne pas importer `BaseLayout` ni `src/styles/global.css`.
- Chaque variante W2 déclare une nouvelle `theme` key : `manifeste`, `cockpit`, `silex`, `sporee`, `canopee`, `planche`.
- CSS scopé `[data-theme="<slug>"]` dans un fichier `src/styles/alt/<slug>.css` importé conditionnellement par le thème AltLayout.

### Tailwind v4 conformité

- Pas de `@utility` block sur CSS complexe (retour de la règle wave 1). Classes custom déclarées après `@import "tailwindcss"`.
- `@source` explicites : `base.css` déjà déclare `src/components/alt/**`, `src/layouts/AltLayout.astro`, `src/pages/alt/**`, `src/pages/fr/alt/**`. Aucune modification nécessaire si on reste dans ces dossiers (V8-V13 y sont).
- ASCII-only dans les commentaires CSS (pas de `─`, `┌`, `│`).

### Fonts

- Fraunces variable (`@fontsource-variable/fraunces`) déjà installé.
- Geist Variable (`@fontsource-variable/geist`) déjà installé.
- JetBrains Mono Variable (`@fontsource-variable/jetbrains-mono`) déjà installé.
- **Nouvelles fontes à évaluer** : Migra Italic (Pangram Pangram — licence requise ; fallback : Fraunces italic), Berkeley Mono (Berkeley Graphics — licence ; fallback : JetBrains Mono), IM Fell (SIL OFL, Google Fonts, free), Söhne (Klim — licence ; fallback : Geist Variable).
- **Décision par défaut** : privilégier les fontes sous licence libre (Fraunces, Geist, JetBrains Mono, IM Fell). Les fontes licence fallback sur les fontes déjà installées. Pas d'import Fontshare CDN nouveau (suit les reco de la wave 1 sur self-host).

### Motion

- Primitives existantes (`FadeUpOnView`, `StaggeredReveal`) réutilisées telles quelles (post-fix `whileInView` → `initial + animate`).
- V12 introduit **GSAP** (`gsap` + `@gsap/react`) pour ScrollTrigger pinning. Nouvelle dep ajoutée à `package.json`.
- V10 introduit **p5.js** ou `react-p5` pour le flow field. Nouvelle dep.
- V13 pur SVG + CSS, pas de dep nouvelle.
- **Reduced-motion** : V10 (fallback image), V12 (fallback scroll natif), V13 (pas de motion, OK). V8/V9/V11 utilisent les primitives existantes qui respectent déjà.

### i18n

Pattern `src/i18n/alt/<slug>.{en,fr}.ts` réutilisé. Clés exportées par chaque fichier :

- `hero`, `sections`, `pillars`/`kpis`/`spores`/`strates`/`specimens` selon la variante.
- `cta.primary`, `cta.secondary`, `cta.tertiary` quand applicable.

`src/i18n/alt/shared.{en,fr}.ts` étendu : ajouter `variantNames.manifeste`, `variantTaglines.manifeste`, etc. × 6. Tous les fichiers du roster s'attendent à ces clés (`DispatcherPage.astro` itère sur elles).

### Pages

- `src/pages/alt/<slug>.astro` × 6 (EN).
- `src/pages/fr/alt/<slug>.astro` × 6 (FR).
- Chacune est un fichier court qui importe le `<Slug>Page.astro` approprié avec `locale="en"` ou `locale="fr"`.

### Dispatcher — mise à jour de `DispatcherPage.astro`

Deux options proposées, à trancher en phase plan :

**Option dispatcher-A** : une seule grille adaptative 13 entrées.

- Grille desktop : 4 colonnes (13 → 3+3+3+4 ou 4+3+3+3). Break à 3-col vers 1024px, 2-col vers 900px, 1-col vers 640px.
- Swatches identifient la variante — pas de séparation visuelle /alt/-/lab/.
- Simple à maintenir.

**Option dispatcher-B** : deux grilles séparées avec en-têtes.

- Section "Wave 1 — Niamoto-compatible" : 7 cards (les originales + V8/V9/V11).
- Section "Wave 2 — Laboratoire" : 3 cards (V10/V12/V13).
- En-têtes typographiques avec eyebrow (`EDITORIAL` vs `LABORATOIRE`).
- Plus lisible, plus honnête sur la différence de registre.

**Recommandation** : **B**. Signale la rupture éditoriale au visiteur, meilleure navigation, matche le cadrage 3+3 + wave 1.

## Critères de réussite

1. **Build green** — `pnpm build` passe `astro check` sur les 26 nouvelles pages (13 EN + 13 FR), aucune régression sur l'index principal ni sur V1-V7.
2. **Distinction visuelle** — les swatches du dispatcher suffisent à identifier les variantes en 1 seconde.
3. **Skill signature visible** — chaque variante rend évident son skill dominant :
   - V8 = landing CRO (on reconnaît le pattern hero + proofs + urgency).
   - V9 = KPI dashboard (la page EST un dashboard, pas une landing).
   - V11 = minimalism radical (densité visuelle contre-intuitivement basse).
   - V10 = algorithmic art (p5.js visible en fullscreen dès le hero).
   - V12 = GSAP scroll-jack (5 phases pinnées, descente cinéma).
   - V13 = canvas-design print (scroll horizontal + `@media print`).
4. **Token isolation** — aucune pollution du site principal ni de V1-V7. Vérifié via DevTools sur 3 cas.
5. **Bilingue FR/EN** — textes complets, hreflang alternates, accents français propres.
6. **Reduced-motion** — V10/V12 vérifiés avec `prefers-reduced-motion: reduce`. V13 sans motion.
7. **Lighthouse desktop ≥ 85** sur toutes ; ≥ 75 toléré pour V12 (GSAP scroll-jack lourd par nature). Mobile non-bloquant mais mesuré.
8. **A11y de base** : skip-to-content, `:focus-visible` rings, sémantique HTML (`<main>`, `<section>`, `<article>`), alts SVG, KBD navigable (Cmd+K shortcut V9 aussi au tab).

## Anti-slop check (à appliquer en implémentation)

Les règles wave 1 (`REVIEW.md §Anti-AI-slop checklist`) restent valides, y compris pour `/lab/` :

- Pas d'`Inter`.
- Pas de `h-screen` pour full-height.
- Pas de `#000000` pur (Canopée = `#0A0E0B`).
- Pas de 3-equal-card row (V8 piliers = dividers, V13 specimens = 3×3 en quinconce).
- Pas de AI purple/blue gradient — les palettes V8-V13 sont terriennes/rouille/verte/papier/sépia.
- Shadows `color-mix` tintés, pas de black 20%.
- Transitions `cubic-bezier(0.32, 0.72, 0, 1)` par défaut. V12 autorise custom easing GSAP.
- Pas de chiffres ronds bidons — utiliser les vrais : 1208 / 509 / 2713 / 70k+ / 42 plugins / 3 portails.
- Pas d'emojis, icônes SVG stroke 1.5 Phosphor.
- Pas de "John Doe" — si citations V8, utiliser noms plausibles de directeurs d'herbier réels (AMAP, IRD) ou clairement fictionnels avec disclaimer.

## Open questions (résoudre en phase plan)

1. **Licences fontes** — Migra / Berkeley Mono / Söhne ont-elles été acquises, ou on force les fallbacks libres ? Décider au moment du plan par variante.
2. **GSAP license** — GSAP v3 est gratuit pour usage non-commercial depuis 2024 (rachat Webflow). Niamoto = OSS, licence OK. Confirmer ligne docs officielle.
3. **p5.js bundle size** — `react-p5` ajoute ~700kb. Alternative `vanilla p5.js` côté client via `<script>` ou `import()` dynamique pour V10. À trancher : `client:visible` + dynamic import vs bundle direct.
4. **Niamoto hash/seed pour V10 et V13** — définir la fonction de hash (exemple : `fnv1a(date + locale)`, déterministe, stable). Pas de dépendance externe.
5. **Content V8 citations** — passer par des citations réelles documentées (AMAP / IRD / Nouméa), ou assumer le traitement fictif façon "exergue éditorial" ? Valider avec le contact Niamoto (Philippe Birnbaum ?).
6. **V9 sparklines** — data hardcodée en JSON statique, ou fetch au build (`astro build --mode static` + script qui fetch GitHub API au moment du build) ? Par défaut : statique JSON, mise à jour manuelle.
7. **V13 print stylesheet** — tester en conditions réelles d'imprimante + PDF via Chrome "Print to PDF". Vérifier que la grille 2400px rend proprement en A3 paysage (297×420mm).
8. **Dispatcher** — A (grille unique) ou B (deux sections). Voir recommandation ci-dessus.
9. **Branch strategy** — rester sur `feat/landing-alternatives` (commits additifs) ou ouvrir `feat/alt-wave2-skills` (rebase final sur la branche wave 1) ? Simple : rester sur la branche existante, un commit par variante.

## Livrables attendus

- **6 variantes** (V8-V13) accessibles :
  - EN : `/alt/manifeste`, `/alt/cockpit`, `/alt/silex`, `/alt/sporee`, `/alt/canopee`, `/alt/planche`
  - FR : `/fr/alt/manifeste`, `/fr/alt/cockpit`, `/fr/alt/silex`, `/fr/alt/sporee`, `/fr/alt/canopee`, `/fr/alt/planche`
- **Dispatcher mis à jour** (`DispatcherPage.astro`) à 13 entrées avec option recommandée (B).
- **`docs/alt/REVIEW.md` étendu** — nouvelle section "Wave 2 — 2026-04-17 pass" avec audit par variante (comme pour V5-V7).
- **`package.json` updated** — `gsap`, `@gsap/react`, `p5` (ou `react-p5`) ajoutés.
- **Aucun changement** sur `src/pages/index.astro`, `src/components/*` hors `/alt/`, `src/styles/global.css`.
- **Commits atomiques** : 1 commit par variante + 1 pour dispatcher + 1 pour REVIEW + 1 pour CLAUDE.md si changement.

## Next step

Lancer `/workflows:plan` avec ce document pour produire le plan d'implémentation (étapes ordonnées, dépendances, décisions par variante, checkpoints).
