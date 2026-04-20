# Frond copy group-neutral Implementation Plan

> **For Claude:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Neutralise the `/alt/frond` and `/alt/frond-live` copy so it no longer reads as taxonomy-only, and swap the Reading card 3 illustration to a plot detail page from the NC instance.

**Architecture:** Text-only edits to `src/i18n/alt/frond.{en,fr}.ts` (Card 2 index notes, Card 3 sheet title/body, Pillar 02 transform snippet, Pillar 03 site body), a single-line change in `src/components/alt/frond/FrondReading.astro` to point the sheet image to `plot-{locale}.png`, and two new full-page captures saved to `public/showcase/portail-alt/`. `frond-live.{en,fr}.ts` inherit automatically since they import `frond.{en,fr}.ts`.

**Tech Stack:** Astro 5.x, TypeScript strict, pnpm, agent-browser CLI (CDP headless Chrome), sips for PNG resize.

**Spec:** `docs/superpowers/specs/2026-04-19-frond-copy-group-neutral-design.md`

---

## Chunk 1: Captures + component wiring + copy

### Task 1: Capture the plot detail page (EN + FR)

**Files:**
- Create: `public/showcase/portail-alt/plot-en.png`
- Create: `public/showcase/portail-alt/plot-fr.png`

- [ ] **Step 1: Verify the preview server is up**

```bash
curl -s -o /dev/null -w "%{http_code}\n" "http://127.0.0.1:5173/api/site/preview-exported/fr/index.html"
```

Expected: `200`. If 502 or connection refused, ask the user to restart the Niamoto preview server and retry.

- [ ] **Step 2: Discover an existing plot ID**

```bash
curl -s "http://127.0.0.1:5173/api/site/preview-exported/fr/plots/index.html" | grep -oE 'data-id="[0-9]+"' | head -3
```

If that returns nothing (list is JS-rendered), probe a small range:

```bash
for id in 1 2 3 5 10 50 100; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:5173/api/site/preview-exported/fr/plots/$id.html")
  echo "$code  plots/$id.html"
done
```

Expected: at least one `200`. Pick the lowest-numbered valid ID — probably `2` based on earlier user input. Note the chosen ID for Step 3.

- [ ] **Step 3: Capture EN + FR full-page at viewport 1280×800**

Replace `<ID>` with the ID from Step 2.

```bash
mkdir -p /tmp/niamoto-plot-capture
agent-browser set viewport 1280 800
agent-browser open "http://127.0.0.1:5173/api/site/preview-exported/en/plots/<ID>.html"
agent-browser wait 2500
agent-browser screenshot --full /tmp/niamoto-plot-capture/plot-en.png

agent-browser open "http://127.0.0.1:5173/api/site/preview-exported/fr/plots/<ID>.html"
agent-browser wait 2500
agent-browser screenshot --full /tmp/niamoto-plot-capture/plot-fr.png

ls -lh /tmp/niamoto-plot-capture/
```

Expected: two PNG files, each at least 200 KB. Run `file` on each to confirm width 1265 (or 1280) and height > 1000 (full-page).

- [ ] **Step 4: Install + resize to 800px wide**

```bash
DEST=/Users/julienbarbe/Dev/clients/niamoto-site/public/showcase/portail-alt
cp /tmp/niamoto-plot-capture/plot-en.png "$DEST/plot-en.png"
cp /tmp/niamoto-plot-capture/plot-fr.png "$DEST/plot-fr.png"
cd "$DEST"
sips --resampleWidth 800 plot-en.png --out plot-en.png >/dev/null
sips --resampleWidth 800 plot-fr.png --out plot-fr.png >/dev/null
file plot-en.png plot-fr.png
```

Expected: both files now 800 × (proportional height). Sizes likely 400-900 KB each.

- [ ] **Step 5: Commit**

```bash
git add public/showcase/portail-alt/plot-en.png public/showcase/portail-alt/plot-fr.png
git commit -m "feat(reading): add plot detail full-page captures (EN + FR)"
```

---

### Task 2: Point Reading card 3 to the plot capture

**Files:**
- Modify: `src/components/alt/frond/FrondReading.astro` (lines 31-40)

- [ ] **Step 1: Update `imgFor` sheet branch**

In `src/components/alt/frond/FrondReading.astro`, change the `sheet` return in `imgFor`:

```astro
function imgFor(kind: "home" | "index" | "sheet") {
  if (kind === "home")  return `/showcase/portail-alt/home-${locale}.png`;
  if (kind === "index") return `/showcase/portail-alt/preview-taxons-${locale}.png`;
  return `/showcase/portail-alt/plot-${locale}.png`;
}
```

- [ ] **Step 2: Update `altFor` sheet branch**

In the same file, change the sheet `altFor` fallback:

```astro
function altFor(kind: "home" | "index" | "sheet") {
  if (kind === "home")  return `${imageLocale} preview of the Niamoto portal home page`;
  if (kind === "index") return `${imageLocale} preview of the Niamoto taxon index`;
  return `${imageLocale} preview of a Niamoto plot detail page`;
}
```

- [ ] **Step 3: Run typecheck**

```bash
cd /Users/julienbarbe/Dev/clients/niamoto-site && pnpm typecheck 2>&1 | tail -5
```

Expected: `0 errors`.

- [ ] **Step 4: Commit**

```bash
git add src/components/alt/frond/FrondReading.astro
git commit -m "feat(reading): swap sheet image from taxon to plot detail"
```

---

### Task 3: Update EN copy (Card 2 + Card 3 + pillars)

**Files:**
- Modify: `src/i18n/alt/frond.en.ts`

- [ ] **Step 1: Update Card 2 (Index) body**

Find the line (around line 98):
```ts
          "Taxons are not just stored. They are presented as a legible index that can be scanned, filtered, and revisited by botanists, managers, or contributors.",
```

Replace with:
```ts
          "Each group is presented as a legible index that can be scanned, filtered, and revisited by botanists, managers, or contributors — 1 667 taxons here, plots and shapes in another tab.",
```

- [ ] **Step 2: Update Card 2 Corpus + Continuity notes**

Find the notes block (around lines 100-104):
```ts
          { key: "Corpus", body: "The list shows the scale of the corpus — every taxon accessible and individually readable." },
          { key: "Filters", body: "Sorting and browsing remain attached to ecological categories, not only technical fields." },
          { key: "Continuity", body: "From this index, every taxon sheet keeps the same visual and narrative language." },
```

Replace with:
```ts
          { key: "Corpus", body: "The list shows the scale of the group — every entry accessible and individually readable." },
          { key: "Filters", body: "Sorting and browsing remain attached to ecological categories, not only technical fields." },
          { key: "Continuity", body: "From this index, every detail page keeps the same visual and narrative language." },
```

- [ ] **Step 3: Update Card 3 (Sheet) title + body**

Find lines 109-111:
```ts
        title: "A taxon page is where map, evidence, and method meet.",
        body:
          "The taxon sheet is the clearest output: a single page that assembles occurrences, territorial context, and reading cues into a durable reference.",
```

Replace with:
```ts
        title: "A group detail page is where map, evidence, and method meet.",
        body:
          "The detail page for any Niamoto group — taxon, plot, shape, or another reference — is the clearest output: a single page that assembles occurrences, territorial context, and reading cues into a durable reference.",
```

- [ ] **Step 4: Update Pillar 02 Transform snippet**

Find the line (around line 62):
```ts
        snippet: "- group_by: taxons\n  widgets_data:\n    top_species:\n      plugin: top_ranking\n    distribution_map:\n      plugin: geospatial_extractor",
```

Replace with:
```ts
        snippet: "- group_by: taxons\n  widgets_data:\n    distribution_map:\n      plugin: geospatial_extractor\n- group_by: plots\n  widgets_data:\n    species_list:\n      plugin: top_ranking",
```

- [ ] **Step 5: Update Pillar 03 Site body**

Find the line (around line 69):
```ts
          "Auto-generated site with maps, charts, and taxon pages. Deploy anywhere — GitHub Pages, Netlify, your own server.",
```

Replace with:
```ts
          "Auto-generated site with maps, charts, and per-group pages. Deploy anywhere — GitHub Pages, Netlify, your own server.",
```

- [ ] **Step 6: Run typecheck**

```bash
cd /Users/julienbarbe/Dev/clients/niamoto-site && pnpm typecheck 2>&1 | tail -5
```

Expected: `0 errors`.

- [ ] **Step 7: Commit**

```bash
git add src/i18n/alt/frond.en.ts
git commit -m "docs(frond): neutralise EN copy beyond taxonomy (Reading + pillars)"
```

---

### Task 4: Update FR copy (symmetric to EN)

**Files:**
- Modify: `src/i18n/alt/frond.fr.ts`

- [ ] **Step 1: Update Card 2 (Index) body**

Find the line (around line 98):
```ts
          "Les taxons ne sont pas seulement stockés. Ils sont présentés dans un index lisible, que l'on peut parcourir, filtrer et revisiter selon différents usages.",
```

Replace with:
```ts
          "Chaque groupe est présenté dans un index lisible, que l'on peut parcourir, filtrer et revisiter — 1 667 taxons ici, parcelles et shapes dans un autre onglet.",
```

- [ ] **Step 2: Update Card 2 Corpus + Continuity notes**

Find the notes block (around lines 100-104):
```ts
          { key: "Corpus", body: "La liste donne l'échelle du corpus : chaque taxon y reste accessible et lisible individuellement." },
          { key: "Filtres", body: "Le parcours reste attaché à des catégories écologiques, pas seulement à des champs techniques." },
          { key: "Continuité", body: "Depuis cet index, chaque fiche taxon conserve le même langage visuel et narratif." },
```

Replace with:
```ts
          { key: "Corpus", body: "La liste donne l'échelle du groupe : chaque entrée y reste accessible et lisible individuellement." },
          { key: "Filtres", body: "Le parcours reste attaché à des catégories écologiques, pas seulement à des champs techniques." },
          { key: "Continuité", body: "Depuis cet index, chaque fiche de détail conserve le même langage visuel et narratif." },
```

- [ ] **Step 3: Update Card 3 (Sheet) title + body**

Find lines 109-111:
```ts
        title: "La fiche taxon est l'endroit où carte, preuve et méthode se rencontrent.",
        body:
          "La fiche taxon est le résultat le plus abouti : une page unique qui assemble occurrences, contexte territorial et repères de lecture dans un format durable.",
```

Replace with:
```ts
        title: "La fiche de groupe est l'endroit où carte, preuve et méthode se rencontrent.",
        body:
          "La fiche de détail de n'importe quel groupe Niamoto — taxon, parcelle, shape ou autre référence — est le résultat le plus abouti : une page unique qui assemble occurrences, contexte territorial et repères de lecture dans un format durable.",
```

- [ ] **Step 4: Update Pillar 02 Transform snippet**

Find the line (around line 62):
```ts
        snippet: "- group_by: taxons\n  widgets_data:\n    top_species:\n      plugin: top_ranking\n    distribution_map:\n      plugin: geospatial_extractor",
```

Replace with (identical to EN — YAML isn't localised):
```ts
        snippet: "- group_by: taxons\n  widgets_data:\n    distribution_map:\n      plugin: geospatial_extractor\n- group_by: plots\n  widgets_data:\n    species_list:\n      plugin: top_ranking",
```

- [ ] **Step 5: Update Pillar 03 Site body**

Find the line (around line 69):
```ts
          "Site auto-généré avec cartes, graphiques et pages taxons. Déployez partout — GitHub Pages, Netlify, votre propre serveur.",
```

Replace with:
```ts
          "Site auto-généré avec cartes, graphiques et pages par groupe. Déployez partout — GitHub Pages, Netlify, votre propre serveur.",
```

- [ ] **Step 6: Run typecheck**

```bash
cd /Users/julienbarbe/Dev/clients/niamoto-site && pnpm typecheck 2>&1 | tail -5
```

Expected: `0 errors`.

- [ ] **Step 7: Commit**

```bash
git add src/i18n/alt/frond.fr.ts
git commit -m "docs(frond): neutralise FR copy beyond taxonomy (Reading + pillars)"
```

---

### Task 5: Final verification

**Files:** None modified — verification only.

- [ ] **Step 1: Full build**

```bash
cd /Users/julienbarbe/Dev/clients/niamoto-site && pnpm build 2>&1 | tail -10
```

Expected: build completes with 0 errors. Both `/alt/frond/` and `/fr/alt/frond/` pages generated (check `dist/alt/frond/` and `dist/fr/alt/frond/`).

- [ ] **Step 2: Grep for residual taxon-only phrasing in the updated strings**

```bash
grep -nE "taxon sheet|taxon page|taxon pages|fiche taxon|pages taxons" src/i18n/alt/frond.*.ts
```

Expected: no matches (all have been neutralised).

- [ ] **Step 3: Grep for plot mention presence**

```bash
grep -niE "plot|parcelle" src/i18n/alt/frond.*.ts | head
```

Expected: at least one match per locale, referencing plots in the neutralised passages.

- [ ] **Step 4: Visual check (manual)**

Open in browser:
- `http://localhost:4321/alt/frond` → Reading section card 3 should show the plot page capture (not Araucariaceae), with updated EN copy
- `http://localhost:4321/fr/alt/frond` → same, with FR copy
- `http://localhost:4321/alt/frond-live` → confirm the taxonomy-neutral copy also applies (inheritance via frond.en.ts)

Expected: plot image visible, no remaining "taxon page / fiche taxon" phrasing in the reading section.
