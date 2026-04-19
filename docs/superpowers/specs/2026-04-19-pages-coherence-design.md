# Design : Site coherence uplift — pages share landing's shell + tokens

**Date :** 2026-04-19
**Scope :** `/documentation`, `/plugins`, `/showcase/nouvelle-caledonie` — migrate to `AltLayout + FrondHeader + FrondFooter` with frond design tokens. Add `FrondFooter` to the landing.
**Statut :** approuvé — niveau N2 (shell + tokens, copy inchangée, FR hors scope)

---

## Contexte

Depuis la refonte de la landing (frond-live promu à `/`), trois pages legacy ont gardé leur ancien shell : BaseLayout + Header + Footer. Cliquer "Docs" depuis la landing casse l'expérience — autre typographie, autres couleurs, autre header. Ce spec harmonise les 3 pages avec l'écosystème frond-live, sans toucher à la copy éditoriale ni créer les versions FR.

---

## Architecture

### Composant à créer

**`src/components/alt/shared/FrondFooter.astro`** — footer site complet, utilisé sur les 4 pages (landing + 3 legacy).

Structure identique à l'ancien `Footer.astro` mais restylée avec tokens frond :

```
<footer class="frond-footer">
  <div class="frond-footer__inner">
    <div class="frond-footer__brand">
      <NiamotoLogo size="md" color="light" locale={locale} />
      <p class="frond-footer__tagline">Ecological data, from field to web.</p>
      <p class="frond-footer__license">GPL v3</p>
    </div>

    <div class="frond-footer__cols">
      <FooterCol title="Project">…</FooterCol>
      <FooterCol title="Community">…</FooterCol>
      <FooterCol title="Made by">…</FooterCol>
    </div>
  </div>

  <div class="frond-footer__legal">
    <span>© 2026 Niamoto contributors</span>
  </div>
</footer>
```

**Props** : `locale: Locale` (propagé à `NiamotoLogo` pour que le brand clique renvoie sur la bonne racine).

**Contenu des colonnes** (extrait de l'ancien Footer, adapté) :

```ts
Project:
  - Documentation → /documentation (ou /fr/documentation)
  - Plugins → /plugins
  - Showcase → /showcase/nouvelle-caledonie
  - Changelog → https://github.com/niamoto/niamoto/releases

Community:
  - GitHub → https://github.com/niamoto/niamoto
  - Discussions → https://github.com/niamoto/niamoto/discussions
  - Contributing → https://github.com/niamoto/niamoto/blob/main/CONTRIBUTING.md
  - Code of Conduct → https://github.com/niamoto/niamoto/blob/main/CODE_OF_CONDUCT.md

Made by:
  - Arsis · Independent dev studio → https://arsis.dev
  - Montpellier, France (pas de lien)
```

**Style** :
- Fond : `var(--c-charcoal)` (#1E1E22) — cohérent avec l'ancien, contraste fort
- Texte : blanc semi-transparent pour links/tagline, blanc franc pour titles
- `max-width: 1320px` (aligné `.frond-shell`)
- Typographie : Plus Jakarta Sans pour le contenu, JetBrains Mono pour `GPL v3` et copyright
- Logo : `NiamotoLogo color="light"` (version blanche)
- Séparateur `frond-footer__legal` : bordure haute `rgba(255,255,255,0.1)`

---

### Règles de migration par page

Chaque page legacy suit cette règle de migration :

**Structure** :
1. `import BaseLayout` → `import AltLayout`
2. `import Header` → `import FrondHeader`
3. `import Footer` → `import FrondFooter`
4. `<BaseLayout title={…} description={…}>` → `<AltLayout theme="frond" locale="en" title={…} description={…}>`
5. `<Header active="…" />` → `<FrondHeader locale="en" />`
6. `<Footer />` → `<FrondFooter locale="en" />`

**Tokens / classes** (search-replace par page) :

| Main-site (avant) | Frond (après) |
|-------------------|---------------|
| `bg-canvas` | supprimer (body déjà `var(--c-canvas)` via AltLayout) |
| `bg-white` | `.bg-surface` (déjà dans alt/base.css) |
| `border-border` | inline `border-color: var(--c-hairline)` ou classe dédiée `.frond-hairline` à créer |
| `border-border-strong` | `border-color: var(--c-hairline-strong)` |
| `text-ink` | (identique — déjà `.text-ink` défini dans alt/base.css) |
| `text-stone` | `.text-muted` |
| `text-stone-light` | `.text-muted` (on perd la nuance, acceptable pour un hover-state inactif) |
| `text-forest-green` | `.text-accent` |
| `shadow-[0_4px_12px_rgba(15,23,42,0.06)]` | inline `box-shadow: var(--shadow-widget)` |
| `shadow-[0_8px_20px_rgba(15,23,42,0.08)]` | `var(--shadow-widget-hover)` |
| `shadow-[0_1px_2px_rgba(15,23,42,0.04)]` | `var(--shadow-sm)` |
| `font-mono` | (identique — `.font-mono` déjà utilisable via Tailwind, mais préférer `.alt-mono` défini dans alt/base.css qui pointe sur `var(--f-mono)`) |
| `rounded-[8px]` | garder tel quel (utilitaire Tailwind) |
| `rounded-[12px]` | idem |
| `rounded-[999px]` | idem |
| `max-w-[1200px]` | garder tel quel (pattern Tailwind, ou utiliser `.frond-shell` pour `max-w: 1320px`) |

**Composants legacy à inliner ou remplacer** :

- **`Button variant="primary"`** → `<a>` stylé en frond, exemple :
  ```astro
  <a href={…} class="frond-btn frond-btn--primary">Label →</a>
  ```
  CSS léger ajouté à `frond.css` (ou inline), reprise du pattern ButtonInButton existant mais simplifié.

- **`Button variant="outline"`** → `<a class="frond-btn frond-btn--outline">`

- **`Pill variant="leaf"`** → `<span class="frond-status-chip frond-status-chip--leaf">…</span>` (déjà défini dans frond.css)

- **`DownloadButton`** → simple `<a href="https://github.com/niamoto/niamoto/releases/latest">` stylé comme primary button

- **`RegionCard`** → n'est plus utilisé (showcase a sa propre mise en page intégrée)

- **`FunderStrip`** → `FunderGrid` frond déjà existant dans `src/components/alt/shared/FunderGrid.astro` — à utiliser sur la page showcase

**Nouveau utilitaire CSS nécessaire** : `.frond-btn` + variants primary/outline dans `frond.css`. Design minimal :

```css
[data-theme="frond"] .frond-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.6rem 1.1rem;
  border-radius: 7px;
  font-family: var(--f-body);
  font-weight: 600;
  font-size: 0.9rem;
  text-decoration: none;
  transition: background var(--motion-base) var(--ease-frond),
              border-color var(--motion-base) var(--ease-frond);
}
[data-theme="frond"] .frond-btn--primary {
  background: var(--c-accent);
  color: var(--c-canvas);
}
[data-theme="frond"] .frond-btn--primary:hover {
  background: var(--c-fern);
}
[data-theme="frond"] .frond-btn--outline {
  background: transparent;
  border: 1px solid var(--c-hairline-strong);
  color: var(--c-ink);
}
[data-theme="frond"] .frond-btn--outline:hover {
  background: var(--c-surface-muted);
}
```

---

### Per-page specifics

#### `/documentation/index.astro`

- Shell swap (BaseLayout → AltLayout theme="frond", Header → FrondHeader, Footer → FrondFooter)
- Hero section : background `var(--c-surface-muted)` (remplace `bg-canvas`), garder search input avec styles frond
- Grille de 6 recipe cards : `.frond-widget` pour chaque card (bordure, shadow, radius 12px)
- Sidebar navigation : garder la logique, stylé avec frond tokens
- Community callout : `.frond-widget` avec CTAs stylés comme outline buttons

#### `/plugins/index.astro`

- Shell swap
- Hero avec 4 type badges → `.frond-status-chip` variants. Mapping :
  - Transformers (leaf/vert) → `frond-status-chip--leaf`
  - Widgets (steel/bleu) → `frond-status-chip--steel`
  - Loaders (amber/orange) → ajouter une variante `frond-status-chip--amber` à frond.css
  - Exporters (violet) → ajouter `frond-status-chip--violet`
- Filter bar sticky : `var(--c-surface)` bg + `var(--c-hairline)` border
- Grid de plugin cards : chaque card en `.frond-widget`, badge type en haut, nom en mono, version en bas
- Plugin `typeStyle` inline-style → remplacer par les classes `frond-status-chip--*`

#### `/showcase/nouvelle-caledonie.astro`

- Shell swap
- Breadcrumb : simple ligne texte avec `.text-muted` → `.text-ink` hover
- Hero 50/50 : maintenir le split, `Pill variant="leaf"` → `.frond-status-chip--leaf`, `Button` → `.frond-btn`
- Capture avec chrome macOS : adapter les couleurs du chrome (`#2A2D38` bg, traffic lights) — garder intactes (détails iconographiques macOS, pas de raison de changer)
- Stats band : 4 stats en grille, valeurs en mono + `var(--c-accent)`, labels en `.text-muted`
- "Inside the portal" section : grille d'images avec captions
- Tech stack liste : simple typo avec `.alt-mono`
- Les fonts du main-site (Geist) remplacées par Plus Jakarta Sans (via `[data-theme="frond"]` body)

---

### Landing : ajouter FrondFooter

`FrondLivePage.astro` ajoute `<FrondFooter locale={locale} />` juste avant la fermeture du `<AltLayout>`, après le `FrondClosing`.

```astro
<FrondClosing …/>
</main>
<FrondFooter locale={locale} />
</AltLayout>
```

`FrondClosing` reste (c'est une clôture éditoriale : "Built in the open, for the scientific community" + CTAs). Le `FrondFooter` qui suit fournit la navigation/legal standard.

---

## Fichiers modifiés / créés

| Fichier | Action |
|---------|--------|
| `src/components/alt/shared/FrondFooter.astro` | **Créer** |
| `src/styles/alt/frond.css` | Ajout `.frond-footer*`, `.frond-btn*`, `frond-status-chip--amber/violet` |
| `src/pages/documentation/index.astro` | Shell swap + class migration |
| `src/pages/plugins/index.astro` | Shell swap + class migration + badges |
| `src/pages/showcase/nouvelle-caledonie.astro` | Shell swap + class migration + Button/Pill remplacés |
| `src/components/alt/frond-live/FrondLivePage.astro` | Ajouter `<FrondFooter locale={locale} />` après `</main>` |
| `src/styles/alt/base.css` | Ajouter `@source` pour les 3 pages pour que Tailwind génère leurs utilitaires |

**Pas touché** :
- `src/components/Header.astro` — peut être supprimé en parallèle (plus référencé)
- `src/components/Footer.astro` — idem, plus référencé
- `src/components/Button.astro`, `Pill.astro`, `DownloadButton.astro`, `RegionCard.astro`, `FunderStrip.astro` — vestiges legacy potentiellement orphelins après migration, à nettoyer en fin de scope

---

## Hors scope

- Versions FR des 3 pages (BS ultérieur)
- Réécriture éditoriale de la copy (registre "group detail page") — le ton peut rester direct sur les pages docs/plugins/showcase
- Ajout de contenu (nouveaux guides docs, nouveaux plugins, nouveaux showcases)
- Harmonisation typo fine (weight, letter-spacing) — on accepte que les pages soient "en Plus Jakarta Sans + frond tokens" sans pixel-perfect match au landing
