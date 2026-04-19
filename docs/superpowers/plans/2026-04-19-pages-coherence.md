# Pages Coherence Implementation Plan

> **For Claude:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port `/documentation`, `/plugins`, `/showcase/nouvelle-caledonie` onto the frond design system (AltLayout + FrondHeader + new FrondFooter + frond tokens), and add the same FrondFooter to the landing.

**Architecture:** Create FrondFooter.astro (shared), add a handful of CSS blocks to frond.css (`.frond-btn`, `.frond-footer*`, new status chip variants `--amber` and `--violet`), then migrate each page's shell (`BaseLayout`/`Header`/`Footer` → `AltLayout`/`FrondHeader`/`FrondFooter`) and replace legacy utilities (`bg-white`, `border-border`, `text-stone`, `text-forest-green`, custom shadows) with frond-scoped equivalents already available in `alt/base.css` (`.bg-surface`, `.border-hairline`, `.text-muted`, `.text-accent`, `var(--shadow-widget)`). Drop legacy components (`Button`, `Pill`, `DownloadButton`, `RegionCard`, `FunderStrip`, `Header`, `Footer`) at the end once nothing references them.

**Tech Stack:** Astro 5.x, TypeScript strict, pnpm, frond design tokens scoped via `[data-theme="frond"]`.

**Spec:** `docs/superpowers/specs/2026-04-19-pages-coherence-design.md`

---

## Chunk 1: Foundation — CSS + FrondFooter + landing integration

### Task 1: Add frond-btn, new chip variants, and frond-footer CSS

**Files:**
- Modify: `src/styles/alt/frond.css`

- [ ] **Step 1: Find the existing `.frond-status-chip` block**

Open `src/styles/alt/frond.css`. Search for `.frond-status-chip--leaf` (around line 380). Confirm these exist:
```css
[data-theme="frond"] .frond-status-chip--leaf { background: #dcfce7; color: #166534; }
[data-theme="frond"] .frond-status-chip--steel { background: #dbeafe; color: #1e40af; }
```

- [ ] **Step 2: Add `--violet` chip variant right after**

After the `--steel` line, insert:

```css
[data-theme="frond"] .frond-status-chip--violet {
  background: #ede9fe;
  color: #5b21b6;
}
```

Why only `--violet` and not `--amber`: the real `plugins/index.astro` has four type colors — transformer (forest green `#2E7D32`), widget (steel `#5B86B0`), loader (purple `#9333EA`), exporter (forest green `#2E7D32` with slightly different opacity). Transformer and exporter already share the green hue — mapping both to `--leaf` preserves the original intent. Only `loader` needs a new variant (`--violet`).

- [ ] **Step 3: Add `.frond-btn` + variants at the end of the HERO section or in a new CTA section**

Before the `/* Responsive */` block at the bottom, add:

```css
/* -------------------------------------------------------------------------
 * Buttons — inline anchor/button pattern for docs/plugins/showcase pages
 * ------------------------------------------------------------------------- */
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
              border-color var(--motion-base) var(--ease-frond),
              color var(--motion-base) var(--ease-frond);
  cursor: pointer;
}

[data-theme="frond"] .frond-btn--primary {
  background: var(--c-accent);
  color: var(--c-canvas);
  border: 1px solid var(--c-accent);
}
[data-theme="frond"] .frond-btn--primary:hover,
[data-theme="frond"] .frond-btn--primary:focus-visible {
  background: var(--c-fern);
  border-color: var(--c-fern);
}

[data-theme="frond"] .frond-btn--outline {
  background: transparent;
  border: 1px solid var(--c-hairline-strong);
  color: var(--c-ink);
}
[data-theme="frond"] .frond-btn--outline:hover,
[data-theme="frond"] .frond-btn--outline:focus-visible {
  background: var(--c-surface-muted);
}
```

- [ ] **Step 4: Add `.frond-footer*` CSS block**

Right after `.frond-btn` variants:

```css
/* -------------------------------------------------------------------------
 * Footer — dark band with brand + nav columns, used on all pages
 * ------------------------------------------------------------------------- */
[data-theme="frond"] .frond-footer {
  margin-top: 6rem;
  background: var(--c-charcoal);
  color: #ffffff;
}

[data-theme="frond"] .frond-footer__inner {
  max-width: 1320px;
  margin: 0 auto;
  padding: 4rem 1.5rem 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 2.4fr);
  gap: 3rem;
}

[data-theme="frond"] .frond-footer__brand {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 18rem;
}

[data-theme="frond"] .frond-footer__tagline {
  font-size: 0.88rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
}

[data-theme="frond"] .frond-footer__license {
  font-family: var(--f-mono);
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 0.06em;
}

[data-theme="frond"] .frond-footer__cols {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 2.5rem;
}

[data-theme="frond"] .frond-footer__col-title {
  font-family: var(--f-display);
  font-weight: 600;
  font-size: 0.85rem;
  color: #ffffff;
  letter-spacing: 0.02em;
  margin-bottom: 1rem;
}

[data-theme="frond"] .frond-footer__col ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

[data-theme="frond"] .frond-footer__col a,
[data-theme="frond"] .frond-footer__col span {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.65);
  text-decoration: none;
  transition: color var(--motion-base) var(--ease-frond);
}

[data-theme="frond"] .frond-footer__col a:hover,
[data-theme="frond"] .frond-footer__col a:focus-visible {
  color: #ffffff;
}

[data-theme="frond"] .frond-footer__legal {
  max-width: 1320px;
  margin: 0 auto;
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 4rem;
  text-align: center;
  font-family: var(--f-mono);
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.5);
}

@media (max-width: 820px) {
  [data-theme="frond"] .frond-footer__inner {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  [data-theme="frond"] .frond-footer__cols {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1.5rem;
  }
}
```

- [ ] **Step 5: Typecheck + commit**

```bash
cd /Users/julienbarbe/Dev/clients/niamoto-site && pnpm typecheck 2>&1 | tail -3
```

Expected: `0 errors`.

```bash
git add src/styles/alt/frond.css
git commit -m "style(frond): add btn variants, violet chip, footer CSS"
```

---

### Task 2: Create `FrondFooter.astro`

**Files:**
- Create: `src/components/alt/shared/FrondFooter.astro`

- [ ] **Step 1: Create the file**

Content:

```astro
---
import NiamotoLogo from "@/components/NiamotoLogo.astro";
import type { Locale } from "@/i18n/config";

interface Props {
  locale: Locale;
}

const { locale } = Astro.props;
const prefix = locale === "fr" ? "/fr" : "";

const cols = [
  {
    title: "Project",
    links: [
      { label: "Documentation", href: `${prefix}/documentation` },
      { label: "Plugins", href: `${prefix}/plugins` },
      { label: "Showcase", href: `${prefix}/showcase/nouvelle-caledonie` },
      { label: "Changelog", href: "https://github.com/niamoto/niamoto/releases" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "GitHub", href: "https://github.com/niamoto/niamoto" },
      { label: "Discussions", href: "https://github.com/niamoto/niamoto/discussions" },
      { label: "Contributing", href: "https://github.com/niamoto/niamoto/blob/main/CONTRIBUTING.md" },
      { label: "Code of Conduct", href: "https://github.com/niamoto/niamoto/blob/main/CODE_OF_CONDUCT.md" },
    ],
  },
  {
    title: "Made by",
    links: [
      { label: "Arsis · Independent dev studio", href: "https://arsis.dev" },
      { label: "Montpellier, France", href: null },
    ],
  },
] as const;
---

<footer class="frond-footer">
  <div class="frond-footer__inner">
    <div class="frond-footer__brand">
      <NiamotoLogo size="md" color="light" locale={locale} />
      <p class="frond-footer__tagline">Ecological data, from field to web.</p>
      <p class="frond-footer__license">GPL v3</p>
    </div>

    <div class="frond-footer__cols">
      {cols.map((col) => (
        <div class="frond-footer__col">
          <h4 class="frond-footer__col-title">{col.title}</h4>
          <ul>
            {col.links.map((link) => (
              <li>
                {link.href ? (
                  <a href={link.href} {...(link.href.startsWith("http") ? { target: "_blank", rel: "noopener" } : {})}>{link.label}</a>
                ) : (
                  <span>{link.label}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </div>

  <div class="frond-footer__legal">
    © 2026 Niamoto contributors
  </div>
</footer>
```

- [ ] **Step 2: Typecheck**

```bash
cd /Users/julienbarbe/Dev/clients/niamoto-site && pnpm typecheck 2>&1 | tail -3
```

Expected: `0 errors`.

- [ ] **Step 3: Commit**

```bash
git add src/components/alt/shared/FrondFooter.astro
git commit -m "feat: add FrondFooter component (brand + 3 nav cols + legal)"
```

---

### Task 3: Add FrondFooter to the landing

**Files:**
- Modify: `src/components/alt/frond-live/FrondLivePage.astro`

- [ ] **Step 1: Import FrondFooter**

After the `import FrondClosing from "../frond/FrondClosing.astro";` line, add:

```astro
import FrondFooter from "@/components/alt/shared/FrondFooter.astro";
```

- [ ] **Step 2: Add `<FrondFooter locale={locale} />` after `</main>`**

Current:
```astro
    <FrondClosing … />
  </main>
</AltLayout>
```

New:
```astro
    <FrondClosing … />
  </main>
  <FrondFooter locale={locale} />
</AltLayout>
```

- [ ] **Step 3: Typecheck + build**

```bash
cd /Users/julienbarbe/Dev/clients/niamoto-site && pnpm typecheck 2>&1 | tail -3 && pnpm build 2>&1 | tail -3
```

Expected: both pass with 0 errors. Landing is now `hero → … → closing → footer`.

- [ ] **Step 4: Commit**

```bash
git add src/components/alt/frond-live/FrondLivePage.astro
git commit -m "feat(landing): add FrondFooter after FrondClosing"
```

---

## Chunk 2: Page migrations

### Shared migration rules (apply to Tasks 4, 5, 6)

**Class → class replacements** (Tailwind arbitrary-value + frond utility classes in `alt/base.css`) :

| Legacy | Frond replacement | Notes |
|--------|-------------------|-------|
| `bg-canvas` | remove | body already `var(--c-canvas)` via AltLayout |
| `bg-white` | `bg-surface` | defined line 43 of `alt/base.css` |
| `bg-surface-low` | inline `style="background: var(--c-surface-muted)"` | no utility; `--c-surface-muted` is the closest match |
| `border-border` | `border-hairline` | defined line 50 of `alt/base.css` |
| `border-border-strong` | inline `style="border-color: var(--c-hairline-strong)"` | no utility |
| `text-ink` | keep as-is | defined line 46 of `alt/base.css` |
| `text-stone` / `text-stone-light` | `text-muted` | accept slight nuance loss |
| `text-forest-green` | `text-accent` | defined line 48 of `alt/base.css` |
| `font-mono` | `alt-mono` | defined line 59 of `alt/base.css` |
| `shadow-[0_1px_2px_rgba(15,23,42,0.04)]` | `shadow-[var(--shadow-sm)]` | Tailwind arbitrary-value form |
| `shadow-[0_4px_12px_rgba(15,23,42,0.06)]` | `shadow-[var(--shadow-widget)]` | |
| `shadow-[0_8px_20px_rgba(15,23,42,0.08)]` | `shadow-[var(--shadow-widget-hover)]` | used in hover state |

**Alpha modifier (`text-ink/80`, `bg-surface/95`, etc.)** : Tailwind's `/N` alpha modifier does not apply to plain CSS classes (`.text-ink`, `.bg-surface` are declared as `{ color: var(--c-ink); }` / `{ background-color: var(--c-surface); }`, not Tailwind `@utility`). Prescribed replacement: inline `style` using `color-mix`. Exhaustive list of occurrences to patch:

| File:line | Legacy | Replacement |
|-----------|--------|-------------|
| `src/pages/documentation/index.astro:149` | `text-ink/85` | inline `style="color: color-mix(in srgb, var(--c-ink) 85%, transparent)"` |
| `src/pages/documentation/index.astro:220` | `text-ink/80` | inline `style="color: color-mix(in srgb, var(--c-ink) 80%, transparent)"` |
| `src/pages/plugins/index.astro:148` | `text-ink/80` | inline `style="color: color-mix(in srgb, var(--c-ink) 80%, transparent)"` |
| `src/pages/plugins/index.astro:99` (filter bar sticky) | `bg-white/95` | inline `style="background: color-mix(in srgb, var(--c-surface) 95%, transparent)"` + class `bg-surface` removed |
| `src/pages/showcase/nouvelle-caledonie.astro:194` | `text-ink/85` | 85% color-mix on `var(--c-ink)` |
| `src/pages/showcase/nouvelle-caledonie.astro:211` | `text-ink/85` | 85% color-mix on `var(--c-ink)` |

**No Tailwind `/N` alpha modifier on `.bg-surface`, `.bg-canvas`, `.text-ink`, `.text-muted`, `.text-accent`** anywhere in the migrated code — always inline `color-mix`.

**Shell swap boilerplate** (EN-only — no FR versions of these 3 pages) :

```astro
// IMPORTS
- import BaseLayout from "@/layouts/BaseLayout.astro";
- import Header from "@/components/Header.astro";
- import Footer from "@/components/Footer.astro";
+ import AltLayout from "@/layouts/AltLayout.astro";
+ import FrondHeader from "@/components/alt/frond-live/FrondHeader.astro";
+ import FrondFooter from "@/components/alt/shared/FrondFooter.astro";

// WRAPPER OPEN
- <BaseLayout title="…" description="…">
-   <Header active="…" />
+ <AltLayout theme="frond" locale="en" title="…" description="…">
+   <FrondHeader locale="en" />

// WRAPPER CLOSE
-   <Footer />
- </BaseLayout>
+   <FrondFooter locale="en" />
+ </AltLayout>
```

**FrondHeader height for sticky children**: FrondHeader measures ~48 px (padding `0.85rem` top+bottom = 27.2 px + `NiamotoLogo size="sm"` ~20 px content + 1 px border). Any sticky element below it uses `top-[48px]`.

---

### Task 4: Port `/documentation/index.astro` to AltLayout + frond

**Files:**
- Modify: `src/pages/documentation/index.astro`
- Modify: `src/styles/alt/base.css` (one-line `@source` addition)

- [ ] **Step 1: Add `@source` so Tailwind picks up docs page utilities**

In `src/styles/alt/base.css`, the block starting `/* Tailwind v4 in this project requires explicit @source per subdirectory. */` already has several `@source` lines. Add (keeping others):

```css
@source "../../pages/documentation/**/*.astro";
@source "../../pages/plugins/**/*.astro";
@source "../../pages/showcase/**/*.astro";
```

- [ ] **Step 2: Replace the frontmatter imports**

In `src/pages/documentation/index.astro`, change the top 3 imports:

FROM:
```astro
import BaseLayout from "@/layouts/BaseLayout.astro";
import Header from "@/components/Header.astro";
import Footer from "@/components/Footer.astro";
```

TO:
```astro
import AltLayout from "@/layouts/AltLayout.astro";
import FrondHeader from "@/components/alt/frond-live/FrondHeader.astro";
import FrondFooter from "@/components/alt/shared/FrondFooter.astro";
```

- [ ] **Step 3: Update the layout wrapper + header + footer**

FROM:
```astro
<BaseLayout
  title="Documentation — Niamoto"
  description="Guides, concepts, and recipes to run Niamoto from data import to published portal."
>
  <Header active="docs" />
```

TO:
```astro
<AltLayout
  theme="frond"
  locale="en"
  title="Documentation — Niamoto"
  description="Guides, concepts, and recipes to run Niamoto from data import to published portal."
>
  <FrondHeader locale="en" />
```

At the end of the file, replace:
```astro
  <Footer />
</BaseLayout>
```

with:
```astro
  <FrondFooter locale="en" />
</AltLayout>
```

- [ ] **Step 4: Migrate the Hero section classes**

Replace the `<!-- Hero -->` section (lines ~80-108) — specifically swap these class occurrences:

- `bg-canvas` → remove (body bg already applied)
- `text-ink` → keep (same class, works under `[data-theme="frond"]`)
- `text-stone` → `text-muted`
- `border-border` → `border-hairline`
- `bg-white` → `bg-surface`
- `border-border-strong` → inline `style="border-color: var(--c-hairline-strong)"` (no utility for this variant)
- `bg-surface-low` → inline `style="background: var(--c-surface-muted)"` (no utility — surface-muted is the closest match)
- `text-stone-light` → `text-muted` (lose nuance, acceptable for placeholder text)

Exact replacement for the hero search input block (`<div class="mx-auto mt-8 flex max-w-[500px] …">`):

```astro
      <div
        class="mx-auto mt-8 flex max-w-[500px] items-center gap-2 rounded-[10px] border border-hairline bg-surface px-4 py-3"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--c-muted)" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.3-4.3"></path>
        </svg>
        <input
          type="search"
          placeholder="Search the docs..."
          class="flex-1 bg-transparent alt-mono text-sm text-ink placeholder:text-muted focus:outline-none"
        />
        <kbd
          class="rounded-[4px] border alt-mono text-xs text-muted"
          style="border-color: var(--c-hairline-strong); background: var(--c-surface-muted); padding: 0.125rem 0.375rem;"
          >⌘K</kbd
        >
      </div>
```

For the hero container `<section class="border-b border-border bg-canvas py-16">`:
```astro
  <section class="border-b border-hairline py-16" style="background: var(--c-surface-muted)">
```

For the `<h1>` and `<p>` — keep `text-ink`, change `text-stone` → `text-muted`:
```astro
      <h1 class="text-5xl font-bold tracking-[-0.02em] text-ink">Documentation</h1>
      <p class="mx-auto mt-3 max-w-[640px] text-lg text-muted">…</p>
```

- [ ] **Step 5: Migrate the sidebar section**

For `<h3 class="font-mono text-[11px] font-semibold uppercase tracking-wider text-stone">`:
```astro
<h3 class="alt-mono text-[11px] font-semibold uppercase tracking-wider text-muted">
```

For the active/inactive heading class list:
```astro
  class:list={[
    "mb-2 text-sm font-semibold",
    section.active ? "text-accent" : "text-ink",
  ]}
```
(`text-forest-green` → `text-accent`)

For the link `class="text-[13px] text-stone hover:text-ink"` keep structure but:
```astro
class="text-[13px] text-muted hover:text-ink"
```

- [ ] **Step 6: Migrate the recipe cards grid**

For each recipe `<a>` — replace:
```astro
class="block rounded-[12px] bg-white p-6 shadow-[0_4px_12px_rgba(15,23,42,0.06)] transition-shadow hover:shadow-[0_8px_20px_rgba(15,23,42,0.08)]"
```
with (Tailwind arbitrary-value form using frond CSS vars):
```astro
class="block rounded-[12px] bg-surface p-6 shadow-[var(--shadow-widget)] transition-shadow hover:shadow-[var(--shadow-widget-hover)]"
```

For the icon square background `bg-[rgba(46,125,50,0.08)]`:
```astro
class="mb-3 flex h-10 w-10 items-center justify-center rounded-[8px]"
style="background: color-mix(in srgb, var(--c-accent) 10%, transparent)"
```

And its SVG stroke `stroke="#2E7D32"`:
```astro
stroke="var(--c-accent)"
```

For the `h3` and `p`:
```astro
<h3 class="text-lg font-semibold text-ink">{r.title}</h3>
<p class="mt-1 line-clamp-2 text-sm leading-relaxed text-muted">{r.body}</p>
<div class="mt-3 alt-mono text-xs text-muted">⏱ {r.minutes} min read</div>
```
(`font-mono` → `alt-mono`, `text-stone` → `text-muted`)

- [ ] **Step 7: Migrate the community callout**

```astro
<div class="mt-16 rounded-[12px] bg-surface p-8 shadow-[var(--shadow-widget)]">
  <h3 class="text-xl font-semibold text-ink">Need help?</h3>
  <p class="mt-2 text-sm" style="color: color-mix(in srgb, var(--c-ink) 80%, transparent)">…</p>
  <div class="mt-5 flex flex-wrap gap-3 text-sm">
    <a href="…" class="frond-btn frond-btn--outline">GitHub Discussions</a>
    <a href="…" class="frond-btn frond-btn--outline">File an issue</a>
    <a href="…" class="frond-btn frond-btn--outline">Contribute a plugin</a>
  </div>
</div>
```

Per the shared-rules alpha prescription: `text-ink/80` → inline `color-mix(... 80% ...)`.

- [ ] **Step 8: Typecheck + build + commit**

```bash
cd /Users/julienbarbe/Dev/clients/niamoto-site && pnpm typecheck 2>&1 | tail -3 && pnpm build 2>&1 | tail -5
```

Expected: typecheck `0 errors`; build generates `/documentation/index.html`.

```bash
git add src/pages/documentation/index.astro src/styles/alt/base.css
git commit -m "refactor(docs): port /documentation to AltLayout + FrondHeader/Footer + frond tokens"
```

---

### Task 5: Port `/plugins/index.astro`

**Files:**
- Modify: `src/pages/plugins/index.astro`

- [ ] **Step 1: Imports**

FROM:
```astro
import BaseLayout from "@/layouts/BaseLayout.astro";
import Header from "@/components/Header.astro";
import Footer from "@/components/Footer.astro";
import Button from "@/components/Button.astro";
```

TO:
```astro
import AltLayout from "@/layouts/AltLayout.astro";
import FrondHeader from "@/components/alt/frond-live/FrondHeader.astro";
import FrondFooter from "@/components/alt/shared/FrondFooter.astro";
```

`Button` is dropped; `/plugins/index.astro` only uses `Button` as a stub — a search inspection in Step 2 will confirm.

- [ ] **Step 2: Confirm `Button` is unused in the file body**

```bash
grep -nE '<Button' /Users/julienbarbe/Dev/clients/niamoto-site/src/pages/plugins/index.astro
```

Expected: no matches (the import was unused) — **or** matches. If matches, replace each `<Button …>` with an `<a>` styled as `frond-btn` (primary or outline depending on context).

- [ ] **Step 3: Replace `typeStyle` records with chip classes**

The real `typeStyle` dict (lines 9-33 of `src/pages/plugins/index.astro`) is:
```ts
transformer: { label: "TRANSFORMER", bg: "rgba(75, 175, 80, 0.12)",  color: "#2E7D32" },  // green
widget:      { label: "WIDGET",      bg: "rgba(91, 134, 176, 0.12)", color: "#5B86B0" },  // blue
loader:      { label: "LOADER",      bg: "rgba(147, 51, 234, 0.12)", color: "#9333EA" },  // violet
exporter:    { label: "EXPORTER",    bg: "rgba(46, 125, 50, 0.14)",  color: "#2E7D32" },  // green (same hue as transformer)
```

Replace with a map to chip variants (note: transformer and exporter both map to `leaf` — mirrors the original shared green hue):

```ts
const typeChip: Record<PluginType, { label: string; variant: string }> = {
  transformer: { label: "TRANSFORMER", variant: "leaf" },
  widget:      { label: "WIDGET",      variant: "steel" },
  loader:      { label: "LOADER",      variant: "violet" },
  exporter:    { label: "EXPORTER",    variant: "leaf" },
};
```

And in the plugin card template, change:
```astro
<span
  class="self-start rounded-[999px] px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider"
  style={`background:${style.bg}; color:${style.color}`}
>
  {style.label}
</span>
```
to:
```astro
<span class={`frond-status-chip frond-status-chip--${typeChip[p.type].variant} self-start`}>
  {typeChip[p.type].label}
</span>
```

Note: `frond-status-chip` already exists with its own padding/radius/font. Inline adjustments may be needed if the visual doesn't match the old badge exactly — leave as-is, adjust only if visually bad.

- [ ] **Step 4: Shell swap (BaseLayout → AltLayout, Header → FrondHeader, Footer → FrondFooter)**

Same pattern as Task 4 Step 3. Props:
```astro
<AltLayout theme="frond" locale="en" title="Plugins — Niamoto" description="…">
  <FrondHeader locale="en" />
```

End:
```astro
  <FrondFooter locale="en" />
</AltLayout>
```

- [ ] **Step 5: Migrate page-level classes**

Same mapping rules as Task 4 Step 4-7:
- `bg-canvas` → remove
- `bg-white` → `bg-surface`
- `border-border` → `border-hairline`
- `text-ink` → keep
- `text-stone` → `text-muted`
- `text-stone-light` → `text-muted`
- `text-forest-green` → `text-accent`
- `font-mono` → `alt-mono`
- `shadow-[0_1px_2px_rgba(15,23,42,0.04)]` → `shadow-[var(--shadow-sm)]`
- `shadow-[0_4px_12px_rgba(15,23,42,0.06)]` → `shadow-[var(--shadow-widget)]`

The filter-bar sticky section `sticky top-[73px]` keeps the sticky behavior; the `top` value references the header height. `FrondHeader` measures ~48px (see shared rules above). Also note: `bg-white/95` alpha modifier on the filter bar needs the inline `color-mix` treatment per shared rules:

```astro
<div
  class="sticky top-[48px] z-40 border-b border-hairline backdrop-blur-md"
  style="background: color-mix(in srgb, var(--c-surface) 95%, transparent)"
>
```

- [ ] **Step 6: Typecheck + build + commit**

```bash
cd /Users/julienbarbe/Dev/clients/niamoto-site && pnpm typecheck 2>&1 | tail -3 && pnpm build 2>&1 | tail -5
```

Expected: both clean. `/plugins/index.html` generated.

```bash
git add src/pages/plugins/index.astro
git commit -m "refactor(plugins): port /plugins to AltLayout + FrondHeader/Footer + frond tokens"
```

---

### Task 6: Port `/showcase/nouvelle-caledonie.astro`

**Files:**
- Modify: `src/pages/showcase/nouvelle-caledonie.astro`

- [ ] **Step 1: Imports**

FROM:
```astro
import BaseLayout from "@/layouts/BaseLayout.astro";
import Header from "@/components/Header.astro";
import Footer from "@/components/Footer.astro";
import Button from "@/components/Button.astro";
import Pill from "@/components/Pill.astro";
```

TO:
```astro
import AltLayout from "@/layouts/AltLayout.astro";
import FrondHeader from "@/components/alt/frond-live/FrondHeader.astro";
import FrondFooter from "@/components/alt/shared/FrondFooter.astro";
```

- [ ] **Step 2: Replace `<Pill variant="leaf">…</Pill>` with frond-status-chip**

FROM:
```astro
<Pill variant="leaf" class="self-start">● Active since 2024</Pill>
```
TO:
```astro
<span class="frond-status-chip frond-status-chip--leaf self-start">
  <span class="frond-status-chip__dot" aria-hidden="true"></span>
  Active since 2024
</span>
```

- [ ] **Step 3: Replace `<Button>` elements with `<a class="frond-btn …">`**

For each `<Button variant="primary" href="…" size="md">Label →</Button>` → `<a href="…" class="frond-btn frond-btn--primary">Label →</a>`.
For each `<Button variant="outline" …>` → `class="frond-btn frond-btn--outline"`.

- [ ] **Step 4: Shell swap (layout + header + footer)**

Same pattern as Tasks 4/5. Note: the title includes accents — keep as-is:
```astro
<AltLayout
  theme="frond"
  locale="en"
  title="Portail de la forêt de Nouvelle-Calédonie — Niamoto Showcase"
  description="A reference ecological portal for New Caledonia's forests — built on Niamoto, maintained by Province Nord, Province Sud, IRD, and IAC."
>
  <FrondHeader locale="en" />
```

- [ ] **Step 5: Migrate page-level classes** (same mapping rules)

Special attention to:
- **Stats band** — the `<div class="font-mono text-5xl font-bold text-forest-green">` becomes `alt-mono text-5xl font-bold text-accent`.
- **Breadcrumb** — `bg-canvas` removed (body bg applied); `text-stone hover:text-ink` → `text-muted hover:text-ink`.
- **macOS chrome** colors `#1B1F2A`, `#2A2D38`, `#FF5F57`, `#FEBC2E`, `#28C840` stay — those are literal macOS UI emulation, no reason to retheme.
- **Tech stack** `font-mono` → `alt-mono`.

- [ ] **Step 6: Typecheck + build + commit**

```bash
cd /Users/julienbarbe/Dev/clients/niamoto-site && pnpm typecheck 2>&1 | tail -3 && pnpm build 2>&1 | tail -5
```

```bash
git add src/pages/showcase/nouvelle-caledonie.astro
git commit -m "refactor(showcase): port /showcase/nouvelle-caledonie to AltLayout + FrondHeader/Footer + frond tokens"
```

---

## Chunk 3: Cleanup + final verification

### Task 7: Delete orphan legacy components + BaseLayout

**Files:**
- Delete: `src/components/Header.astro`
- Delete: `src/components/Footer.astro`
- Delete: `src/components/Button.astro`
- Delete: `src/components/Pill.astro`
- Delete: `src/components/DownloadButton.astro`
- Delete: `src/components/RegionCard.astro`
- Delete: `src/components/FunderStrip.astro`
- Delete: `src/layouts/BaseLayout.astro` (no longer referenced — all pages migrated to AltLayout)

**Note on `src/styles/global.css`**: BaseLayout was its only importer; after deletion it becomes orphan. Keep it for now (minor dead weight, safe to delete in a separate cleanup if needed).

- [ ] **Step 1: Confirm each legacy module is now unreferenced**

```bash
for mod in "components/Header" "components/Footer" "components/Button" "components/Pill" "components/DownloadButton" "components/RegionCard" "components/FunderStrip" "layouts/BaseLayout"; do
  echo "=== $mod ==="
  grep -rnE "@/$mod\b|['\"]\\./$(basename $mod)\\.astro['\"]|['\"]\\.\\./$(basename $mod)\\.astro['\"]" /Users/julienbarbe/Dev/clients/niamoto-site/src/ 2>/dev/null | head -3
done
```

Expected: no matches for any. If matches appear, **stop** — something wasn't migrated. Investigate before deleting.

- [ ] **Step 2: Delete the files**

```bash
cd /Users/julienbarbe/Dev/clients/niamoto-site
rm src/components/Header.astro
rm src/components/Footer.astro
rm src/components/Button.astro
rm src/components/Pill.astro
rm src/components/DownloadButton.astro
rm src/components/RegionCard.astro
rm src/components/FunderStrip.astro
rm src/layouts/BaseLayout.astro
ls src/components/ src/layouts/
```

Expected in `src/components/`: `alt/` dir + `NiamotoLogo.astro` only.
Expected in `src/layouts/`: `AltLayout.astro` only.

- [ ] **Step 3: Typecheck + build**

```bash
pnpm typecheck 2>&1 | tail -3 && pnpm build 2>&1 | tail -5
```

Expected: both pass.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "refactor: drop legacy Header/Footer/Button/Pill/DownloadButton/RegionCard/FunderStrip (orphans after migration)"
```

---

### Task 8: Final verification

**Files:** None modified.

- [ ] **Step 1: Full build**

```bash
cd /Users/julienbarbe/Dev/clients/niamoto-site && pnpm build 2>&1 | tail -10
```

Expected: 5 pages built (`/`, `/fr/`, `/documentation/`, `/plugins/`, `/showcase/nouvelle-caledonie/`), `Complete!`.

- [ ] **Step 2: Grep for stale legacy class names**

```bash
grep -rnE "text-stone\b|text-stone-light\b|text-forest-green\b|border-border\b|bg-canvas\b|bg-surface-low\b|shadow-\[0_4px_12px_rgba|shadow-\[0_8px_20px_rgba|shadow-\[0_1px_2px_rgba" src/pages/ | head -10
```

Expected: no matches. Any matches = incomplete migration.

- [ ] **Step 3: Grep for stale imports**

```bash
grep -rnE "@/components/(Header|Footer|Button|Pill|DownloadButton|RegionCard|FunderStrip)\b" src/ | head -5
```

Expected: no matches.

- [ ] **Step 4: Manual visual check**

Start the dev server if not already running:

```bash
cd /Users/julienbarbe/Dev/clients/niamoto-site && pnpm dev
```

(Dev server listens on port 4321.) Navigate in browser to:
- `http://localhost:4321/` — landing, sticky FrondHeader + all sections + FrondClosing + FrondFooter at the very bottom
- `http://localhost:4321/fr/` — same in French
- `http://localhost:4321/documentation/` — sticky FrondHeader, hero with search input + sidebar + recipe cards grid + community callout + FrondFooter
- `http://localhost:4321/plugins/` — sticky FrondHeader, hero + filter bar sticky + plugin cards grid with chip badges + FrondFooter
- `http://localhost:4321/showcase/nouvelle-caledonie/` — sticky FrondHeader, breadcrumb + hero 50/50 with mac chrome + stats band + portal sections + FrondFooter

**Expected visual consistency across all pages:**
- Same sticky top header (logo + menu + lang switch)
- Same dark charcoal footer with 3 columns
- Same typography (Plus Jakarta Sans body, JetBrains Mono for code/meta)
- Same color palette (forest-green accent, cool neutrals)

If any page looks visually off vs. the landing, note specifics — follow-up tweak, not a blocker.
