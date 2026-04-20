# Design : FrondHeader — real sticky header for the landing

**Date :** 2026-04-19
**Scope :** `src/components/alt/frond-live/FrondHeader.astro` (new), replaces `IslandNav` usage on `/` and `/fr/`
**Statut :** approuvé

---

## Contexte

La landing `/` (et `/fr/`) utilise actuellement un **IslandNav** — un petit pill flottant, centré, minimaliste. L'index original du site utilisait un vrai **header sticky** (barre full-width, bordure en bas, logo à gauche, menu au milieu, CTAs à droite), toujours en usage sur `/documentation`, `/plugins`, `/showcase`.

L'utilisateur préfère le vrai header : plus ancré, plus "site" que "micro-pill". On crée un nouveau composant `FrondHeader` qui reprend la structure classique mais reste compatible avec l'AltLayout + tokens frond (contrainte : AltLayout n'importe pas `global.css` ni les utilitaires Tailwind du main-site).

Le `Header.astro` legacy reste intact sur les pages legacy — une harmonisation complète est un BS ultérieur.

---

## Architecture

### Nouveau composant

**`src/components/alt/frond-live/FrondHeader.astro`** — remplace `IslandNav` sur la landing frond-live uniquement.

### Structure

```
<header class="frond-header">
  <div class="frond-header__inner">  <!-- max-width container, padded -->
    <NiamotoLogo size="sm" locale={locale} />  <!-- left: logo + wordmark -->

    <nav class="frond-header__nav">  <!-- center: links -->
      <a href="/documentation">Docs</a>
      <a href="/plugins">Plugins</a>
      <a href="/showcase/nouvelle-caledonie">Showcase</a>
      <a href="github.com/niamoto/niamoto" target="_blank">GitHub</a>
    </nav>

    <div class="frond-header__actions">  <!-- right: lang -->
      <LanguageSwitch locale={locale} />
    </div>
  </div>
</header>
```

Pas de bouton Download dans le header — le hero a déjà un CTA "Install Niamoto" proéminent. Réintégrable si on sent manquer plus tard.

### Comportement

- `position: sticky; top: 0; z-index: 40`
- Fond **opaque au scroll** (`background: var(--c-canvas)` avec léger backdrop-blur pour le contenu en dessous)
- Bordure basse en `var(--c-hairline)`
- Full-width container, contenu contraint à `max-width: 1320px` (même que `.frond-shell`)
- Mobile (≤ 640px) : cache les liens du menu, garde logo + LanguageSwitch

### Tokens utilisés (frond)

| Élément | Token |
|---------|-------|
| Fond | `var(--c-canvas)` + backdrop-blur(14px) |
| Bordure bas | `1px solid var(--c-hairline)` |
| Wordmark | Déjà stylé par `NiamotoLogo` (Plus Jakarta Sans, `text-ink`) |
| Liens | Couleur `var(--c-muted)` → `var(--c-ink)` au hover |
| Transition hover | 200ms `var(--ease-frond)` |

### NiamotoLogo — locale-aware

Update `src/components/NiamotoLogo.astro` pour accepter une prop `locale?: "en" | "fr"` :

```ts
interface Props {
  size?: "sm" | "md" | "lg";
  color?: "dark" | "light";
  locale?: "en" | "fr";
}
const { size = "md", color = "dark", locale = "en" } = Astro.props;
const homeHref = locale === "fr" ? "/fr/" : "/";
```

`<a href={homeHref}>` remplace `<a href="/">`. Default "en" préserve le comportement actuel sur Header legacy.

### Tailwind source pour NiamotoLogo

`NiamotoLogo.astro` utilise les utilitaires Tailwind `inline-flex items-center gap-2` et les classes `.text-ink` / `.text-white`. Dans le contexte AltLayout (qui importe `alt/base.css`), ajouter au début de `base.css` :

```css
@source "../../components/NiamotoLogo.astro";
```

`.text-ink` est déjà définie dans alt/base.css (ligne 60). Les utilitaires `inline-flex`, `items-center`, `gap-2` seront générés grâce à l'@source.

---

## i18n

`src/i18n/alt/shared.{en,fr}.ts` — ajouter 2 labels manquants :

**EN :**
```ts
nav: {
  documentation: "Docs",
  plugins: "Plugins",
  showcase: "Showcase",
  github: "GitHub",
  languageSwitchLabel: "Switch language",
},
```

**FR :**
```ts
nav: {
  documentation: "Doc",
  plugins: "Plugins",
  showcase: "Showcase",
  github: "GitHub",
  languageSwitchLabel: "Changer de langue",
},
```

"Showcase" reste en anglais en FR (anglicisme standard).

---

## Intégration

### `FrondLivePage.astro`

Remplacer :
```astro
import IslandNav from "@/components/alt/shared/IslandNav.astro";
// ...
<IslandNav locale={locale} />
```

Par :
```astro
import FrondHeader from "./FrondHeader.astro";
// ...
<FrondHeader locale={locale} />
```

### Adjustement spacing

Le pill IslandNav était flottant (ne poussait pas le contenu). Le nouveau FrondHeader sera sticky-top (prend sa place dans le flow). Ajuster `.frond-hero` pour que son `padding-top: 7rem` devienne peut-être `3rem` ou similaire — la marge que l'IslandNav laissait était absorbée par le hero top-padding.

À tester au build visuel, ajuster si l'espace au-dessus du hero semble mauvais.

### IslandNav.astro

Reste en place **pour l'instant** (pas supprimé). Il n'est plus référencé par FrondLivePage mais le fichier existe. Si on est sûr de ne plus l'utiliser ailleurs, suppression possible → la refait dans le même plan.

---

## Fichiers modifiés/créés

| Fichier | Action |
|---------|--------|
| `src/components/alt/frond-live/FrondHeader.astro` | **Créer** |
| `src/components/NiamotoLogo.astro` | Modifier (prop `locale`) |
| `src/components/alt/frond-live/FrondLivePage.astro` | Modifier (import + usage) |
| `src/i18n/alt/shared.en.ts` | Ajouter `nav.plugins` + `nav.showcase` |
| `src/i18n/alt/shared.fr.ts` | Idem |
| `src/styles/alt/base.css` | Ajouter `@source "../../components/NiamotoLogo.astro"` |
| `src/components/alt/shared/IslandNav.astro` | **Supprimer** (plus référencé) |
| `src/components/alt/shared/LanguageSwitch.astro` | Conserver (utilisé par FrondHeader) |
| `src/styles/alt/frond.css` | Ajout CSS `.frond-header`, `.frond-header__inner`, `.frond-header__nav`, `.frond-header__actions` + éventuellement ajustement `.frond-hero` padding-top |

---

## Hors scope

- Harmonisation `Header.astro` legacy sur `/documentation`, `/plugins`, `/showcase` (BS ultérieur)
- Hamburger mobile — le menu cache simplement ses items ≤640px comme aujourd'hui
- Bouton Download dans le header (ajoutable plus tard si besoin)
- Stratégie docs (sujet BS2)
- Refonte contenu des pages docs/plugins/showcase (sujet BS3)
