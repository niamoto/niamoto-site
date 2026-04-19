# Design : IslandNav refresh — real logo + wider menu

**Date :** 2026-04-19
**Scope :** `src/components/alt/shared/IslandNav.astro`, `NiamotoLogo.astro`, `shared.{en,fr}.ts`
**Statut :** approuvé

---

## Contexte

L'IslandNav actuel (pill flottant en haut du landing `/` et `/fr/`) affiche un SVG abstrait (cercle + arc) + le mot "niamoto" en bas de casse, et 2 items de menu (Docs, GitHub) + LanguageSwitch. Il manque :
- Le vrai logo Niamoto (`/niamoto_logo.png`) et la graphie "Niamoto" (majuscule)
- Les pages `Plugins` et `Showcase` qui existent dans `src/pages/` mais ne sont pas atteignables depuis le landing

L'ancien `Header.astro` (toujours utilisé par `/documentation`, `/plugins`, `/showcase`) a ce menu complet — on importe cette information dans l'IslandNav pour que la nav soit cohérente sur toutes les pages.

---

## Changements

### 1. `NiamotoLogo.astro` — rendre locale-aware

Actuel :
```astro
<a href="/" class={`inline-flex items-center gap-2 ${textColor}`}>
  <img src="/niamoto_logo.png" ... />
  <span ...>Niamoto</span>
</a>
```

Le `href="/"` est hardcodé → casse la FR si cliqué depuis `/fr/`. Ajout d'une prop optionnelle `locale?: "en" | "fr"` :

```astro
interface Props {
  size?: "sm" | "md" | "lg";
  color?: "dark" | "light";
  locale?: "en" | "fr";
}

const { size = "md", color = "dark", locale = "en" } = Astro.props;
const homeHref = locale === "fr" ? "/fr/" : "/";
```

Le `<a href={homeHref}>` remplace le `<a href="/">`. Les autres usages (Header.astro) continuent de marcher (locale par défaut "en" → `/` comme avant).

### 2. `IslandNav.astro` — brand + menu élargi

**Brand** : remplacer le `<svg>` inline par `<NiamotoLogo size="sm" locale={locale} />`. Le composant rend logo + wordmark "Niamoto" avec son propre `<a>` wrapper. Supprimer l'ancien `<a class="alt-brand">` + SVG.

**Menu** : passer de 2 à 4 items + lang :

```astro
<ul class="alt-nav-links">
  <li><a href={locale === "fr" ? "/fr/documentation" : "/documentation"}>{t.nav.documentation}</a></li>
  <li><a href={locale === "fr" ? "/fr/plugins" : "/plugins"}>{t.nav.plugins}</a></li>
  <li><a href={locale === "fr" ? "/fr/showcase/nouvelle-caledonie" : "/showcase/nouvelle-caledonie"}>{t.nav.showcase}</a></li>
  <li><a href="https://github.com/niamoto/niamoto" target="_blank" rel="noopener">{t.nav.github}</a></li>
  <li class="alt-nav-lang"><LanguageSwitch locale={locale} /></li>
</ul>
```

**CSS** : l'actuel `.alt-nav-links { gap: 1rem }` risque de rendre le pill ~640-680px, encore raisonnable sur desktop ≥1024px. Si trop serré, réduire `gap` à `0.85rem`. À tester en visual, ajuster si besoin.

**Mobile (`max-width: 640px`)** : règle existante `.alt-nav-links li:not(.alt-nav-lang) { display: none }` continue de fonctionner — seul brand + lang visibles. Les liens perdus sont récupérables via Header legacy sur les autres pages, ou via un hamburger ultérieur (hors scope).

**Remplacer** aussi l'ancien wrapper `.alt-brand` (qui devient inutile puisque `NiamotoLogo` wrappe déjà avec son `<a>`). Vérifier que le style CSS `.alt-brand { font-family, font-size, gap }` n'est plus nécessaire — `NiamotoLogo` gère sa propre typo via inline style (`font-size`, `font-weight`, `letter-spacing`). Les classes Tailwind `.text-ink` seront appliquées via `color="dark"`.

### 3. `shared.{en,fr}.ts` — 2 clés i18n en plus

**EN (`src/i18n/alt/shared.en.ts`)** :

```ts
nav: {
  documentation: "Docs",
  plugins: "Plugins",
  showcase: "Showcase",
  github: "GitHub",
  languageSwitchLabel: "Switch language",
},
```

**FR (`src/i18n/alt/shared.fr.ts`)** :

```ts
nav: {
  documentation: "Doc",
  plugins: "Plugins",
  showcase: "Showcase",
  github: "GitHub",
  languageSwitchLabel: "Changer de langue",
},
```

"Showcase" reste anglais en FR (anglicisme standard, plus court que "Vitrine" qui sonne marketing).

---

## Fichiers modifiés

| Fichier | Action |
|---------|--------|
| `src/components/NiamotoLogo.astro` | Ajout prop `locale` + `href` dynamique |
| `src/components/alt/shared/IslandNav.astro` | Import `NiamotoLogo`, remplacement du SVG brand, ajout 2 items menu, suppression éventuelle du CSS `.alt-brand` si devenu mort |
| `src/i18n/alt/shared.en.ts` | Ajout `nav.plugins`, `nav.showcase` |
| `src/i18n/alt/shared.fr.ts` | Idem |
| `src/styles/alt/base.css` | Ajouter `@source "../../components/NiamotoLogo.astro"` pour que Tailwind génère les utilitaires (`inline-flex`, `items-center`, `gap-2`) utilisés par ce composant hors de `src/components/alt/` |

Aucun impact sur Header.astro (utilisé par `/documentation`, `/plugins`, `/showcase`) — continue de fonctionner avec son propre menu.

---

## Hors scope

- Hamburger mobile (les liens restent cachés sur mobile, comme aujourd'hui)
- Unification Header.astro (legacy) + IslandNav (nouveau) — les deux coexistent, une nav par contexte
- Stratégie doc (page `/documentation` vs doc Sphinx de l'app) — sujet BS2 séparé
- Refonte contenu des pages `/plugins`, `/showcase`, `/documentation` — sujet BS3 séparé
