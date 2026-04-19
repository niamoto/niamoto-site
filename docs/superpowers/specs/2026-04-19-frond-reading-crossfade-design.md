# Design : Auto-crossfade taxons / plots on Reading cards 2 & 3

**Date :** 2026-04-19
**Scope :** `/alt/frond` + `/alt/frond-live` — Reading section cards 2 (INDEX) and 3 (SHEET)
**Statut :** approuvé

---

## Contexte

Les modifs de copy précédentes ont neutralisé le vocabulaire ("group detail page" / "Each group is presented..."). La copy dit explicitement "taxons here, plots and shapes in another tab". Les illustrations actuelles ne montrent qu'un seul groupe par carte (taxons index + plot detail). Faire alterner **deux captures** par carte matérialise visuellement ce que le texte annonce.

---

## Architecture

**Pas de nouveau composant.** Refactor léger de `FrondReading.astro` + CSS keyframes.

### Interface i18n

La prop `image` passe de `string` à `readonly string[]`. Tableau de 1 ou 2 entrées :
- 1 entrée → comportement actuel (une seule image, pas d'animation)
- 2 entrées → auto-crossfade CSS entre les 2 images

**Valeurs possibles :** `"home" | "taxons-index" | "plots-index" | "taxon-detail" | "plot-detail"`.

### Capture à produire

| Locale | URL | Fichier cible |
|--------|-----|---------------|
| EN | `/en/plots/index.html` | `public/showcase/portail-alt/plots-index-en.png` |
| FR | `/fr/plots/index.html` | `public/showcase/portail-alt/plots-index-fr.png` |

Full-page via `agent-browser`, viewport 1280×800, resize 800px wide via `sips`.

### Renommage vs nouveaux fichiers

**Aucun renommage.** Pour limiter les refs à casser, on mappe les nouvelles clés aux fichiers existants :

| Clé i18n | Fichier |
|----------|---------|
| `home` | `home-{locale}.png` |
| `taxons-index` | `preview-taxons-{locale}.png` (existant) |
| `plots-index` | `plots-index-{locale}.png` (nouveau) |
| `taxon-detail` | `species-{locale}.png` (existant) |
| `plot-detail` | `plot-{locale}.png` (existant) |

---

## Attribution par carte

```
Card 1 HOME    → images: ["home"]                         (pas d'alternance)
Card 2 INDEX   → images: ["taxons-index", "plots-index"]  (crossfade)
Card 3 SHEET   → images: ["taxon-detail", "plot-detail"]  (crossfade)
```

---

## CSS crossfade

```css
[data-theme="frond"] .frond-reading-card__image--a,
[data-theme="frond"] .frond-reading-card__image--b {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
  display: block;
  animation: frond-crossfade 10s infinite ease-in-out;
}

[data-theme="frond"] .frond-reading-card__image--b {
  animation-delay: -5s;
}

@keyframes frond-crossfade {
  0%, 45% { opacity: 1; }
  50%, 95% { opacity: 0; }
  100% { opacity: 1; }
}
```

- Cycle total : **10 s**
- Durée visible par image : ~4.5 s
- Crossfade : ~500 ms
- `ease-in-out` pour adoucir

Si un seul élément img est rendu (tableau de 1), pas d'animation déclenchée (la classe `--b` ne s'applique jamais).

**Accessibility :** ajouter `@media (prefers-reduced-motion: reduce)` pour désactiver l'animation :

```css
@media (prefers-reduced-motion: reduce) {
  [data-theme="frond"] .frond-reading-card__image--a,
  [data-theme="frond"] .frond-reading-card__image--b {
    animation: none;
  }
  [data-theme="frond"] .frond-reading-card__image--b {
    display: none;  /* show only the first image */
  }
}
```

---

## FrondReading.astro

Remplacer la fonction `imgFor` par un mapping plus riche + render de 1 ou 2 `<img>` :

```astro
const FILE_MAP = {
  "home":          (loc: Locale) => `/showcase/portail-alt/home-${loc}.png`,
  "taxons-index":  (loc: Locale) => `/showcase/portail-alt/preview-taxons-${loc}.png`,
  "plots-index":   (loc: Locale) => `/showcase/portail-alt/plots-index-${loc}.png`,
  "taxon-detail":  (loc: Locale) => `/showcase/portail-alt/species-${loc}.png`,
  "plot-detail":   (loc: Locale) => `/showcase/portail-alt/plot-${loc}.png`,
} as const;

const ALT_MAP = {
  "home":          "preview of the Niamoto portal home page",
  "taxons-index":  "preview of the Niamoto taxons index",
  "plots-index":   "preview of the Niamoto plots index",
  "taxon-detail":  "preview of a Niamoto taxon detail page",
  "plot-detail":   "preview of a Niamoto plot detail page",
} as const;
```

Template :

```astro
{card.images.map((key, i) => (
  <img
    class={`frond-reading-card__image frond-reading-card__image--${i === 0 ? "a" : "b"}`}
    src={FILE_MAP[key](locale)}
    alt={`${imageLocale} ${ALT_MAP[key]}`}
    loading="lazy"
    decoding="async"
  />
))}
```

---

## i18n changes

### EN

Card 1 :
```ts
image: "home" as const,
// → images: ["home"] as const,
```

Card 2 :
```ts
image: "index" as const,
// → images: ["taxons-index", "plots-index"] as const,
```

Card 3 :
```ts
image: "sheet" as const,
// → images: ["taxon-detail", "plot-detail"] as const,
```

### FR

Identique (les clés i18n ne sont pas localisées, seuls les fichiers png le sont via `{locale}`).

---

## Fichiers modifiés

| Fichier | Action |
|---------|--------|
| `public/showcase/portail-alt/plots-index-{en,fr}.png` | Créer |
| `src/components/alt/frond/FrondReading.astro` | Refactor (Card interface + template) |
| `src/styles/alt/frond.css` | Ajouter `@keyframes frond-crossfade` + règles image--a/--b + media prefers-reduced-motion |
| `src/i18n/alt/frond.en.ts` | Renommer `image` → `images` (array) sur les 3 cartes |
| `src/i18n/alt/frond.fr.ts` | Idem |

`frond-live.{en,fr}.ts` importent `frond.{en,fr}.ts` et propagent automatiquement.

---

## Hors scope

- Micro-label "Group: taxons / plots" synchronisé avec le crossfade (ajoutable plus tard)
- Pause au hover (décidé pour laisser le cycle continu, cohérent avec auto-advance du slider hero)
- Crossfade sur Card 1 (HOME) — une seule image par nature, pas d'alternance pertinente
