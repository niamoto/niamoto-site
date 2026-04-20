# Design : Neutralise frond copy beyond taxonomy — featuring plots

**Date :** 2026-04-19
**Scope :** `/alt/frond` + `/alt/frond-live` — reading section, pillars snippet, hero/access copy
**Statut :** approuvé

---

## Contexte

La copy actuelle du Frond landing sous-entend que Niamoto est un outil de publication **taxonomique**. La réalité : Niamoto structure n'importe quelle donnée écologique via des *groupes* (`group_by:` dans `transform.yml`). Dans le déploiement Nouvelle-Calédonie, les 3 groupes sont `taxons`, `plots`, `shapes`. Pour d'autres projets, ce seraient d'autres références. La notion de **parcelle** (plot) est aussi essentielle que la taxonomie.

Ce design réaligne la copy pour que l'architecture générique (groups) soit explicite, tout en illustrant avec des cas concrets (taxons ET plots) du déploiement NC.

---

## Architecture du changement

**Aucun composant nouveau.** Trois types de modifications :

1. **Swap d'une capture** : carte 3 Reading passe de la fiche taxon Araucariaceae à une fiche plot NC.
2. **Copy neutralisée** : vocabulaire "group sheet / per-group pages" remplace "taxon sheet / taxon pages" là où ça lock inutilement.
3. **Snippet Transform étoffé** : pillar 02 montre 2 `group_by:` (taxons + plots) pour rendre la généricité visible dans le code.

---

## Capture à produire

| Locale | URL à capturer | Fichier cible | Dimensions |
|--------|----------------|---------------|------------|
| EN | `http://127.0.0.1:5173/api/site/preview-exported/en/plots/<ID>.html` | `public/showcase/portail-alt/plot-en.png` | 800×~3000 (full page) |
| FR | `http://127.0.0.1:5173/api/site/preview-exported/fr/plots/<ID>.html` | `public/showcase/portail-alt/plot-fr.png` | 800×~3000 |

**ID à déterminer** à l'implémentation (serveur preview doit être up). Choisir un plot avec du contenu riche (widgets occupés : carte, stats, inventaire espèces, structure).

Méthode : `agent-browser` viewport 1280×800, `--full`, resize via `sips --resampleWidth 800`.

Les anciennes captures `species-{en,fr}.png` (Araucariaceae) **sont conservées** dans `public/` — elles peuvent resservir ailleurs et restent référencées par `frond-live` pour le slide "Taxon".

---

## Changements de copy

### Reading section

**Card 2 · Index** — body
```
AVANT : Taxons are not just stored. They are presented as a legible index that can be scanned, filtered, and revisited by botanists, managers, or contributors.
APRÈS : Each group is presented as a legible index that can be scanned, filtered, and revisited by botanists, managers, or contributors — 1 667 taxons here, plots and shapes in another tab.
```

**Card 2 · Corpus note**
```
AVANT : The list shows the scale of the corpus — every taxon accessible and individually readable.
APRÈS : The list shows the scale of the group — every entry accessible and individually readable.
```

**Card 2 · Continuity note**
```
AVANT : From this index, every taxon sheet keeps the same visual and narrative language.
APRÈS : From this index, every detail page keeps the same visual and narrative language.
```

**Card 3 · Sheet** (images swap + copy)
- `image: "sheet"` → désormais résolu via `plot-{locale}.png`
- Label : `03 · SHEET` inchangé
- Meta : `REFERENCE SURFACE` inchangé

```
TITLE AVANT : A taxon page is where map, evidence, and method meet.
TITLE APRÈS : A group detail page is where map, evidence, and method meet.

BODY AVANT : The taxon sheet is the clearest output: a single page that assembles occurrences, territorial context, and reading cues into a durable reference.
BODY APRÈS : The detail page for any Niamoto group — taxon, plot, shape, or another reference — is the clearest output: a single page that assembles occurrences, territorial context, and reading cues into a durable reference.
```

Notes (Map / Method / Durability) restent inchangées (déjà génériques).

### Pillars

**Pillar 02 · Transform snippet**
```
AVANT :
- group_by: taxons
  widgets_data:
    top_species:
      plugin: top_ranking
    distribution_map:
      plugin: geospatial_extractor

APRÈS :
- group_by: taxons
  widgets_data:
    distribution_map:
      plugin: geospatial_extractor
- group_by: plots
  widgets_data:
    species_list:
      plugin: top_ranking
```
Les plugins (`geospatial_extractor`, `top_ranking`) restent réels ; l'ajout d'une 2e entrée `group_by: plots` démontre visuellement la généricité.

**Pillar 03 · Site body**
```
AVANT : Auto-generated site with maps, charts, and taxon pages. Deploy anywhere — GitHub Pages, Netlify, your own server.
APRÈS : Auto-generated site with maps, charts, and per-group pages. Deploy anywhere — GitHub Pages, Netlify, your own server.
```

### Locale FR

Symétrie stricte : "fiche taxon" → "fiche de groupe", "pages taxons" → "pages par groupe", "corpus" → "groupe" (note Corpus), "index de taxons" → "index de chaque groupe".

---

## FrondReading component

`imgFor("sheet")` pointe maintenant sur `plot-${locale}.png` au lieu de `species-${locale}.png`.

`altFor("sheet")` passe de "preview of a Niamoto taxon page" → "preview of a Niamoto plot detail page".

Aucune prop / typage changé.

---

## Fichiers modifiés

| Fichier | Action |
|---------|--------|
| `public/showcase/portail-alt/plot-{en,fr}.png` | Créer (captures via agent-browser) |
| `src/components/alt/frond/FrondReading.astro` | Modifier `imgFor`/`altFor` pour `sheet` |
| `src/i18n/alt/frond.en.ts` | Modifier Card 2 body/notes, Card 3 title/body, Pillar 02 snippet, Pillar 03 body |
| `src/i18n/alt/frond.fr.ts` | Idem versions FR |

`frond-live.{en,fr}.ts` importent `frond.{en,fr}.ts` et n'override que `hero.slides` — les changements propagent automatiquement au frond-live.

---

## Hors scope

- Refonte du slide **Widgets** éditorial (déjà centré sur taxons — pourrait illustrer plots dans un autre passage)
- Ajout d'une **4e carte** Reading pour plot index
- Recapture des autres pages portail (home/taxons) : déjà bonnes
