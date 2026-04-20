# Design : FrondSlider — carrousel hero mixte app + portail

**Date :** 2026-04-19
**Scope :** `src/components/alt/frond/FrondHero.astro` + nouveau composant `FrondSlider.astro`
**Statut :** approuvé

---

## Contexte

Le hero de la page `/alt/frond` affiche actuellement un unique screenshot du portail statique (`home-{locale}.png`). L'image est trop petite et ne raconte pas la chaîne complète : l'outil GUI qui produit le portail.

Ce design remplace ce screenshot statique par un carrousel narratif de 7 slides : 4 captures de l'app GUI suivies de 3 vues du portail produit.

---

## Architecture

### Nouveau composant

**`src/components/alt/frond/FrondSlider.astro`** — composant Astro autonome, sans island framework (pattern cohérent avec le `<script>` inline de `FrondHero.astro`).

### Intégration

Dans `FrondHero.astro` :
- Suppression de `<div class="frond-hero__shot">` et son `<img>` unique
- Suppression de la prop `homeImage` (variable locale calculée)
- Ajout de `import FrondSlider from "./FrondSlider.astro"`
- Ajout de la prop `slides: readonly Slide[]` à l'interface `Props`
- Remplacement par `<FrondSlider slides={slides} />`

---

## Interface

```ts
// Dans FrondSlider.astro
interface Slide {
  src: string;    // chemin depuis public/ (ex: /showcase/app/dashboard.png)
  alt: string;    // texte alternatif accessible
  badge: "app" | "portal";
  label: string;  // libellé affiché dans la caption overlay
}

interface Props {
  slides: readonly Slide[];
}
```

---

## Template HTML

```
<div class="frond-slider" role="region" aria-label="Niamoto screenshots">
  <div class="frond-slider__track">
    <!-- N slides, une seule visible à la fois -->
    <div class="frond-slider__slide [--active]"
         role="group"
         aria-roledescription="slide"
         aria-label="{n} of {total}"
         aria-hidden="{!active}">
      <img src="{slide.src}" alt="{slide.alt}" loading="lazy" decoding="async" />
      <div class="frond-slider__caption">
        <span class="frond-status-chip frond-status-chip--{badge === 'app' ? 'steel' : 'leaf'}">
          <span class="frond-status-chip__dot" aria-hidden="true"></span>
          {badge === "app" ? "App" : "Portal"}
        </span>
        <span class="frond-slider__caption-label">{label}</span>
      </div>
    </div>
  </div>

  <!-- Flèches -->
  <button class="frond-slider__arrow frond-slider__arrow--prev" aria-label="Previous slide">‹</button>
  <button class="frond-slider__arrow frond-slider__arrow--next" aria-label="Next slide">›</button>

  <!-- Dots -->
  <div class="frond-slider__dots" role="tablist" aria-label="Slides">
    <button class="frond-slider__dot [--active]"
            role="tab"
            aria-selected="{active}"
            aria-label="Slide {n}"></button>
    <!-- × N -->
  </div>
</div>
```

La première slide (index 0) est rendue avec la classe `--active` côté serveur. Les autres ont `aria-hidden="true"` et `opacity: 0`.

---

## Comportement JavaScript

Script inline `<script>` dans `FrondSlider.astro`. Sélection par `data-slider` attribute pour éviter les conflits si le composant est instancié plusieurs fois.

### Auto-advance
- `setInterval` toutes les **4 000 ms**
- Avance au slide suivant en boucle (index `(current + 1) % total`)
- Suspendu sur `mouseenter` / `focusin` du conteneur
- Repris sur `mouseleave` / `focusout`

### Navigation manuelle
- Flèche prev : `(current - 1 + total) % total`
- Flèche next : `(current + 1) % total`
- Dot click : jump direct à l'index cible
- Toute interaction manuelle **repart le timer à zéro** (clearInterval + nouveau setInterval)

### Transition
- Slide sortante : `opacity` 1 → 0, `aria-hidden="true"`
- Slide entrante : `opacity` 0 → 1, `aria-hidden="false"` (ou supprimé), classe `--active` ajoutée
- Durée : 500 ms, `ease`
- `aria-live="polite"` sur le track : announce le label de la slide courante

---

## CSS (`src/styles/alt/frond.css`)

### Suppression
Bloc `frond-hero__shot` et `frond-hero__shot img` (remplacés par les classes du slider).

### Ajout

```css
/* Conteneur global — reprend les styles de l'ancien frond-hero__shot */
[data-theme="frond"] .frond-slider { ... }

/* Track — ratio fixe, overflow caché */
[data-theme="frond"] .frond-slider__track {
  position: relative;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  border-radius: 10px; /* légèrement inférieur au conteneur */
}

/* Slides — superposées, cross-fade */
[data-theme="frond"] .frond-slider__slide {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.5s ease;
  pointer-events: none;
}
[data-theme="frond"] .frond-slider__slide--active {
  opacity: 1;
  pointer-events: auto;
}
[data-theme="frond"] .frond-slider__slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Caption overlay */
[data-theme="frond"] .frond-slider__caption { ... }
[data-theme="frond"] .frond-slider__caption-label { ... }

/* Flèches */
[data-theme="frond"] .frond-slider__arrow { ... }

/* Dots */
[data-theme="frond"] .frond-slider__dots { ... }
[data-theme="frond"] .frond-slider__dot { ... }
[data-theme="frond"] .frond-slider__dot--active { ... }
```

Les classes `frond-status-chip` existantes sont **réutilisées** pour les badges. Mapping badge → variante de chip :
- `badge: "app"` → `frond-status-chip--steel` (bleu, neutre)
- `badge: "portal"` → `frond-status-chip--leaf` (vert, résultat)

Aucune nouvelle classe chip à créer.

---

## Assets

### 4 screenshots app à copier

| Source (`niamoto/docs/assets/screenshots/desktop/`) | Destination (`public/showcase/app/`) |
|------------------------------------------------------|--------------------------------------|
| `06.dashboard-get-started.png` | `dashboard.png` |
| `08.import-sources-review.png` | `import.png` |
| `17.collections-widget-catalog.png` | `widgets.png` |
| `21.site-builder-home-page.png` | `site-builder.png` |

### 3 screenshots portail (déjà présents)
- `public/showcase/portail-alt/home-{locale}.png`
- `public/showcase/portail-alt/preview-taxons-{locale}.png`
- `public/showcase/portail-alt/species-{locale}.png`

---

## Données i18n

Ajout d'un tableau `slides` dans `hero` de `frond.en.ts` et `frond.fr.ts`.

### `frond.en.ts`
```ts
hero: {
  // ...props existantes...
  slides: [
    { src: "/showcase/app/dashboard.png",   alt: "Niamoto dashboard",          badge: "app",    label: "Dashboard"    },
    { src: "/showcase/app/import.png",       alt: "Import data sources",        badge: "app",    label: "Import"       },
    { src: "/showcase/app/widgets.png",      alt: "Widget catalog",             badge: "app",    label: "Widgets"      },
    { src: "/showcase/app/site-builder.png", alt: "Site builder",               badge: "app",    label: "Site builder" },
    { src: "/showcase/portail-alt/home-en.png",             alt: "Portal home page",   badge: "portal", label: "Portal"       },
    { src: "/showcase/portail-alt/preview-taxons-en.png",   alt: "Taxons page",        badge: "portal", label: "Taxons"       },
    { src: "/showcase/portail-alt/species-en.png",          alt: "Species detail",     badge: "portal", label: "Species"      },
  ],
}
```

### `frond.fr.ts`
Identique pour les slides app, slides portail avec variantes FR :
- `home-fr.png`, `preview-taxons-fr.png`, `species-fr.png`
- Labels en français : "Tableau de bord", "Import", "Widgets", "Site builder", "Portail", "Taxons", "Espèce"

---

## Fichiers modifiés / créés

| Fichier | Action |
|---------|--------|
| `src/components/alt/frond/FrondSlider.astro` | Créer |
| `src/components/alt/frond/FrondHero.astro` | Modifier (prop slides, import, template) |
| `src/i18n/alt/frond.en.ts` | Modifier (ajout hero.slides) |
| `src/i18n/alt/frond.fr.ts` | Modifier (ajout hero.slides) |
| `src/styles/alt/frond.css` | Modifier (suppr. shot, ajout slider CSS) |
| `public/showcase/app/*.png` | Créer (copie depuis niamoto/docs) |

---

## Hors scope

- Swipe tactile (peut être ajouté plus tard)
- Lazy loading des images hors-viewport (toutes chargées dès le montage — acceptable pour 7 images de taille raisonnable)
- Slider sur d'autres sections ou pages
