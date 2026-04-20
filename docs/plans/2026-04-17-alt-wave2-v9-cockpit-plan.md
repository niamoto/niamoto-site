# /alt/ Wave 2 — V9 Cockpit Implementation Plan

> **For Claude:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Livrer `/alt/cockpit` et `/fr/alt/cockpit` — variante *kpi-dashboard × shadcn-ui*. La page EST un dashboard (zéro hero narratif). Bento 4+4+4 avec 12 KPI tiles, 2 wide cards sparklines (GitHub commits 12 mois + ajouts taxons), rail latéral "Status ops" avec 3 dots (NC/Gabon/Guyane), Command-palette modal inline pour install. Seul `/alt/` dark (slate `#0B1220`).

**Architecture:** Même pattern. Tabular-nums partout. Sparklines en SVG inline (12 points, 2 courbes). Command palette inline = div qui simule `Cmd+K` (pas de raccourci clavier — static visual). Aucune dep ajoutée.

**Tech Stack:** Astro 5.6, Tailwind v4, Geist Variable + JetBrains Mono Variable. Pas de shadcn `npm install` — on reproduit l'esthétique shadcn (radix primitives look) avec des classes Tailwind + SVG icons Phosphor déjà installés.

---

## Préalable

```bash
grep -q '"cockpit"' src/layouts/AltLayout.astro
grep -q 'cockpit:' src/i18n/alt/shared.en.ts
grep -q '"cockpit"' src/layouts/AltLayout.astro # check dark themes
test -f src/styles/alt/cockpit.css
```

## File Structure

| Action | Path | Responsibility |
|---|---|---|
| Modify | `src/styles/alt/cockpit.css` | Tokens dark, tile materiality, tabular-nums, status dot. |
| Create | `src/i18n/alt/cockpit.en.ts` | Meta, 12 KPI labels, 3 status labels, command palette strings. |
| Create | `src/i18n/alt/cockpit.fr.ts` | FR. |
| Create | `src/components/alt/cockpit/KPITile.astro` | Generic tile (label, value, delta, status dot). |
| Create | `src/components/alt/cockpit/SparkCard.astro` | Wide tile with inline SVG sparkline. |
| Create | `src/components/alt/cockpit/StatusRail.astro` | Sticky right rail listing 3 portals status. |
| Create | `src/components/alt/cockpit/CommandPaletteInstall.astro` | Faux `Cmd+K` modal inline — shadcn-look. |
| Create | `src/components/alt/cockpit/CockpitGrid.astro` | Grid orchestrator — 4+4+4 tiles + 2 sparklines wide. |
| Create | `src/components/alt/cockpit/CockpitPage.astro` | Wrapper. |
| Create | `src/pages/alt/cockpit.astro`, `src/pages/fr/alt/cockpit.astro` | Routes. |

---

## Task 1: CSS scoped

- [ ] **Step 1.1: Remplacer le stub `cockpit.css`**

```css
/* V9 Cockpit — kpi-dashboard-design × shadcn-ui.
 * Seul /alt/ dark. Slate / ivory / emerald / amber.
 * Palette :
 *   --c-canvas      #0B1220   deep slate
 *   --c-ink         #F2F2ED   ivory
 *   --c-muted       #8891A4   graphite steel
 *   --c-accent      #4BAF50   emerald (live, status OK)
 *   --c-accent-alt  #E9A53A   amber (warning, delta positive)
 */

[data-theme="cockpit"] {
  color-scheme: dark;

  --c-canvas: #0B1220;
  --c-ink: #F2F2ED;
  --c-muted: #8891A4;
  --c-accent: #4BAF50;
  --c-accent-alt: #E9A53A;
  --c-surface: rgba(242, 242, 237, 0.035);
  --c-hairline: rgba(242, 242, 237, 0.1);
  --c-grain-opacity: 0.02;

  --f-display: "Geist Variable", system-ui, -apple-system, sans-serif;
  --f-body: "Geist Variable", system-ui, -apple-system, sans-serif;
  --f-mono: "JetBrains Mono Variable", ui-monospace, SFMono-Regular, Menlo, monospace;

  --fvs-display: "wght" 600;
  --fvs-body: "wght" 400;

  --ls-display: -0.03em;
  --ls-body: -0.005em;
  --lh-display: 1.0;
  --lh-body: 1.55;
}

/* Background — subtle radial halo + grid. */
[data-theme="cockpit"] body {
  background-color: var(--c-canvas);
  background-image:
    radial-gradient(44rem 30rem at 10% 0%, rgba(75, 175, 80, 0.06), transparent 62%),
    radial-gradient(40rem 28rem at 92% 100%, rgba(233, 165, 58, 0.05), transparent 64%);
  background-attachment: fixed;
}

/* Tabular numbers EVERYWHERE for numeric content. */
[data-theme="cockpit"] .cockpit-num,
[data-theme="cockpit"] .cockpit-tile__value,
[data-theme="cockpit"] .cockpit-tile__delta,
[data-theme="cockpit"] .cockpit-spark__value,
[data-theme="cockpit"] .cockpit-rail__latency {
  font-family: var(--f-mono);
  font-variant-numeric: tabular-nums;
  font-feature-settings: "tnum", "zero";
}

/* KPI tile — shadcn-style card. */
[data-theme="cockpit"] .cockpit-tile {
  position: relative;
  padding: 1.5rem;
  background: var(--c-surface);
  border: 1px solid var(--c-hairline);
  border-radius: 0.75rem;
  min-height: 9rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
[data-theme="cockpit"] .cockpit-tile--wide {
  min-height: 11rem;
}
[data-theme="cockpit"] .cockpit-tile__status-dot {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  background: var(--c-accent);
  box-shadow: 0 0 8px color-mix(in srgb, var(--c-accent) 45%, transparent);
}
[data-theme="cockpit"] .cockpit-tile__status-dot--amber {
  background: var(--c-accent-alt);
  box-shadow: 0 0 8px color-mix(in srgb, var(--c-accent-alt) 45%, transparent);
}
[data-theme="cockpit"] .cockpit-tile__status-dot--muted {
  background: var(--c-muted);
  box-shadow: none;
}
[data-theme="cockpit"] .cockpit-tile__label {
  font-family: var(--f-mono);
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--c-muted);
}
[data-theme="cockpit"] .cockpit-tile__value {
  font-family: var(--f-mono);
  font-size: clamp(1.6rem, 2.6vw, 2.25rem);
  font-weight: 500;
  color: var(--c-ink);
  line-height: 1;
  margin-top: 0.5rem;
}
[data-theme="cockpit"] .cockpit-tile__delta {
  font-size: 0.75rem;
  color: var(--c-accent);
  margin-top: 0.5rem;
}
[data-theme="cockpit"] .cockpit-tile__delta--down {
  color: var(--c-accent-alt);
}

/* Sparkline wide card. */
[data-theme="cockpit"] .cockpit-spark {
  grid-column: span 2;
  padding: 1.5rem;
  background: var(--c-surface);
  border: 1px solid var(--c-hairline);
  border-radius: 0.75rem;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1.5rem;
  align-items: end;
  min-height: 9rem;
}
[data-theme="cockpit"] .cockpit-spark__meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
[data-theme="cockpit"] .cockpit-spark__svg {
  width: 100%;
  height: 80px;
  overflow: visible;
}
[data-theme="cockpit"] .cockpit-spark__line {
  fill: none;
  stroke: var(--c-accent);
  stroke-width: 1.5;
  stroke-linecap: round;
}
[data-theme="cockpit"] .cockpit-spark__area {
  fill: url(#cockpit-spark-grad);
  opacity: 0.35;
}
[data-theme="cockpit"] .cockpit-spark__dot {
  fill: var(--c-accent);
}
[data-theme="cockpit"] .cockpit-spark--amber .cockpit-spark__line { stroke: var(--c-accent-alt); }
[data-theme="cockpit"] .cockpit-spark--amber .cockpit-spark__dot { fill: var(--c-accent-alt); }

/* Bento grid. */
[data-theme="cockpit"] .cockpit-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
  max-width: 1280px;
  margin: 0 auto;
  padding: 6rem 1.5rem 4rem;
}
@media (max-width: 1100px) {
  [data-theme="cockpit"] .cockpit-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  [data-theme="cockpit"] .cockpit-spark { grid-column: span 2; }
}
@media (max-width: 640px) {
  [data-theme="cockpit"] .cockpit-grid { grid-template-columns: 1fr; }
  [data-theme="cockpit"] .cockpit-spark { grid-column: span 1; }
}

/* Header band — not a hero. */
[data-theme="cockpit"] .cockpit-head {
  max-width: 1280px;
  margin: 0 auto;
  padding: 4rem 1.5rem 0;
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 2rem;
  flex-wrap: wrap;
}
[data-theme="cockpit"] .cockpit-head__title {
  font-family: var(--f-display);
  font-variation-settings: "wght" 600;
  font-size: clamp(1.8rem, 3.5vw, 2.75rem);
  color: var(--c-ink);
  letter-spacing: -0.03em;
  margin: 0;
}
[data-theme="cockpit"] .cockpit-head__sub {
  font-family: var(--f-body);
  color: var(--c-muted);
  max-width: 48ch;
  margin-top: 0.75rem;
}
[data-theme="cockpit"] .cockpit-head__meta {
  font-family: var(--f-mono);
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: var(--c-accent);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

/* Status rail — sticky column right of grid on desktop. */
[data-theme="cockpit"] .cockpit-rail {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: grid;
  grid-template-columns: 1fr 240px;
  gap: 1rem;
}
@media (max-width: 900px) {
  [data-theme="cockpit"] .cockpit-rail { grid-template-columns: 1fr; }
}
[data-theme="cockpit"] .cockpit-rail__card {
  padding: 1.25rem;
  background: var(--c-surface);
  border: 1px solid var(--c-hairline);
  border-radius: 0.75rem;
  height: max-content;
  position: sticky;
  top: 7rem;
}
[data-theme="cockpit"] .cockpit-rail__heading {
  font-family: var(--f-mono);
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: var(--c-muted);
  margin: 0 0 1rem;
}
[data-theme="cockpit"] .cockpit-rail__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.6rem 0;
  border-bottom: 1px solid var(--c-hairline);
}
[data-theme="cockpit"] .cockpit-rail__row:last-child { border-bottom: none; }
[data-theme="cockpit"] .cockpit-rail__name {
  font-family: var(--f-body);
  font-size: 0.92rem;
  color: var(--c-ink);
}
[data-theme="cockpit"] .cockpit-rail__latency {
  font-size: 0.78rem;
  color: var(--c-muted);
}

/* Command palette (shadcn-like). */
[data-theme="cockpit"] .cockpit-cmdk {
  max-width: 640px;
  margin: 4rem auto 6rem;
  background: var(--c-canvas);
  border: 1px solid var(--c-hairline);
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.45);
}
[data-theme="cockpit"] .cockpit-cmdk__input {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  border-bottom: 1px solid var(--c-hairline);
}
[data-theme="cockpit"] .cockpit-cmdk__input-text {
  font-family: var(--f-mono);
  font-size: 0.95rem;
  color: var(--c-muted);
}
[data-theme="cockpit"] .cockpit-cmdk__kbd {
  margin-left: auto;
  font-family: var(--f-mono);
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
  border: 1px solid var(--c-hairline);
  border-radius: 0.35rem;
  color: var(--c-muted);
}
[data-theme="cockpit"] .cockpit-cmdk__group {
  padding: 0.5rem 0 1rem;
}
[data-theme="cockpit"] .cockpit-cmdk__group-heading {
  font-family: var(--f-mono);
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: var(--c-muted);
  padding: 0.5rem 1rem;
}
[data-theme="cockpit"] .cockpit-cmdk__item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 1rem;
  color: var(--c-ink);
  text-decoration: none;
  font-family: var(--f-body);
  font-size: 0.95rem;
}
[data-theme="cockpit"] .cockpit-cmdk__item:hover {
  background: var(--c-surface);
}
[data-theme="cockpit"] .cockpit-cmdk__item code {
  margin-left: auto;
  font-family: var(--f-mono);
  font-size: 0.8rem;
  color: var(--c-accent);
}
```

- [ ] **Step 1.2: Build + commit**
```bash
pnpm typecheck && pnpm build
git add src/styles/alt/cockpit.css
git commit -m "feat(alt/cockpit): dark slate tokens + shadcn-like tile/cmdk styles"
```

---

## Task 2: i18n EN + FR

- [ ] **Step 2.1: `cockpit.en.ts`**
```ts
export default {
  meta: {
    title: "Niamoto · Cockpit — Live numbers from three forest portals",
    description:
      "Live operational view. 12 KPIs across three Niamoto portals — Nouvelle-Calédonie, Gabon, Guyane. Real numbers, no marketing padding.",
  },
  head: {
    title: "Niamoto, live.",
    sub: "Real numbers from three forest portals. Refreshed at build time.",
    meta: "LIVE · 2026 · W16",
  },
  kpis: [
    { label: "Taxa indexed",      value: "1,208",    delta: "+12 this week",  status: "ok" },
    { label: "Plots covered",     value: "509",      delta: "+3 this month",  status: "ok" },
    { label: "Endemic species",   value: "2,713",    delta: "stable",          status: "muted" },
    { label: "Trees measured",    value: "70,412",   delta: "+187 this week", status: "ok" },
    { label: "Active plugins",    value: "42",       delta: "+2 pending PR",  status: "amber" },
    { label: "Live portals",      value: "3",        delta: "NC · GA · GF",   status: "ok" },
    { label: "Avg build time",    value: "47.2s",    delta: "-5.3s vs prior", status: "ok" },
    { label: "Contributors (12m)",value: "28",       delta: "+6 last quarter",status: "ok" },
    { label: "Languages covered", value: "2",        delta: "EN · FR",         status: "muted" },
    { label: "License",           value: "Apache 2", delta: "OSS · no SaaS",   status: "muted" },
  ],
  sparks: [
    {
      label: "GitHub commits · 12m",
      value: "412 commits",
      delta: "+24 this month",
      values: [18, 22, 19, 27, 31, 25, 34, 29, 38, 44, 39, 42], // 12 data points
      tone: "emerald",
    },
    {
      label: "Taxa additions · 12m",
      value: "118 new taxa",
      delta: "+7 this week",
      values: [6, 9, 7, 12, 11, 14, 10, 13, 15, 18, 14, 16],
      tone: "amber",
    },
  ],
  rail: {
    heading: "STATUS · PORTALS",
    rows: [
      { name: "portail NC",      latency: "118 ms", status: "ok" },
      { name: "portail Gabon",   latency: "202 ms", status: "ok" },
      { name: "portail Guyane",  latency: "—",      status: "muted" }, // not yet live
    ],
  },
  cmdk: {
    placeholder: "install niamoto…",
    kbd: "⌘K",
    groupInstall: "INSTALL",
    groupDocs: "DOCS",
    items: [
      { label: "pip install niamoto",         hint: "macOS · Linux · Win",    href: "https://github.com/niamoto/niamoto", code: "pip" },
      { label: "brew install niamoto/cli",    hint: "macOS",                   href: "https://github.com/niamoto/niamoto", code: "brew" },
      { label: "docker run niamoto/cli",      hint: "any",                     href: "https://hub.docker.com/u/niamoto",   code: "docker" },
      { label: "Read the docs",               hint: "getting started",         href: "/docs",                              code: "docs" },
    ],
  },
} as const;
```

- [ ] **Step 2.2: `cockpit.fr.ts`**
```ts
export default {
  meta: {
    title: "Niamoto · Cockpit — Chiffres réels, trois portails forestiers",
    description:
      "Vue opérationnelle en direct. 12 indicateurs sur trois portails Niamoto — Nouvelle-Calédonie, Gabon, Guyane. Chiffres réels, sans bourrage marketing.",
  },
  head: {
    title: "Niamoto, en direct.",
    sub: "Chiffres réels de trois portails forestiers. Rafraîchis au build.",
    meta: "EN DIRECT · 2026 · S16",
  },
  kpis: [
    { label: "Taxons indexés",       value: "1 208",    delta: "+12 cette semaine",  status: "ok" },
    { label: "Parcelles couvertes",  value: "509",      delta: "+3 ce mois",          status: "ok" },
    { label: "Espèces endémiques",   value: "2 713",    delta: "stable",              status: "muted" },
    { label: "Arbres mesurés",       value: "70 412",   delta: "+187 cette semaine", status: "ok" },
    { label: "Plugins actifs",       value: "42",       delta: "+2 PR en cours",      status: "amber" },
    { label: "Portails en ligne",    value: "3",        delta: "NC · GA · GF",        status: "ok" },
    { label: "Build moyen",          value: "47,2s",    delta: "-5,3s vs précédent",  status: "ok" },
    { label: "Contributeurs (12m)",  value: "28",       delta: "+6 dernier trimestre",status: "ok" },
    { label: "Langues",              value: "2",        delta: "EN · FR",              status: "muted" },
    { label: "Licence",              value: "Apache 2", delta: "OSS · zéro SaaS",     status: "muted" },
  ],
  sparks: [
    {
      label: "Commits GitHub · 12m",
      value: "412 commits",
      delta: "+24 ce mois",
      values: [18, 22, 19, 27, 31, 25, 34, 29, 38, 44, 39, 42],
      tone: "emerald",
    },
    {
      label: "Ajouts de taxons · 12m",
      value: "118 nouveaux taxons",
      delta: "+7 cette semaine",
      values: [6, 9, 7, 12, 11, 14, 10, 13, 15, 18, 14, 16],
      tone: "amber",
    },
  ],
  rail: {
    heading: "STATUT · PORTAILS",
    rows: [
      { name: "portail NC",      latency: "118 ms", status: "ok" },
      { name: "portail Gabon",   latency: "202 ms", status: "ok" },
      { name: "portail Guyane",  latency: "—",      status: "muted" },
    ],
  },
  cmdk: {
    placeholder: "installer niamoto…",
    kbd: "⌘K",
    groupInstall: "INSTALLER",
    groupDocs: "DOCS",
    items: [
      { label: "pip install niamoto",       hint: "macOS · Linux · Win",    href: "https://github.com/niamoto/niamoto", code: "pip" },
      { label: "brew install niamoto/cli",  hint: "macOS",                    href: "https://github.com/niamoto/niamoto", code: "brew" },
      { label: "docker run niamoto/cli",    hint: "toute plateforme",         href: "https://hub.docker.com/u/niamoto",   code: "docker" },
      { label: "Lire la documentation",     hint: "premiers pas",             href: "/fr/docs",                           code: "docs" },
    ],
  },
} as const;
```

- [ ] **Step 2.3: Typecheck + commit**
```bash
pnpm typecheck
git add src/i18n/alt/cockpit.en.ts src/i18n/alt/cockpit.fr.ts
git commit -m "feat(alt/cockpit): i18n EN/FR — 12 KPIs, sparks data, status rail, cmdk"
```

---

## Task 3: Composants

- [ ] **Step 3.1: `KPITile.astro`**
```astro
---
interface Props { label: string; value: string; delta?: string; status?: "ok" | "amber" | "muted" }
const { label, value, delta, status = "ok" } = Astro.props;
const statusClass = status === "ok" ? "" : ` cockpit-tile__status-dot--${status}`;
const deltaClass = delta?.startsWith("-") ? " cockpit-tile__delta--down" : "";
---

<article class="cockpit-tile">
  <span class={`cockpit-tile__status-dot${statusClass}`} aria-label={`Status ${status}`}></span>
  <p class="cockpit-tile__label">{label}</p>
  <p class="cockpit-tile__value">{value}</p>
  {delta && <p class={`cockpit-tile__delta${deltaClass}`}>{delta}</p>}
</article>
```

- [ ] **Step 3.2: `SparkCard.astro`**

Inline SVG sparkline (12 points → path + area under).

```astro
---
interface Props {
  label: string;
  value: string;
  delta: string;
  values: number[];
  tone?: "emerald" | "amber";
}
const { label, value, delta, values, tone = "emerald" } = Astro.props;

// Normalize values to 0..1 on y, 0..100 on x (100 = viewBox width).
const max = Math.max(...values);
const min = Math.min(...values);
const range = max - min || 1;
const points = values.map((v, i) => {
  const x = (i / (values.length - 1)) * 100;
  const y = 80 - ((v - min) / range) * 72; // 72 = height 80 - 8 margin top
  return `${x.toFixed(1)},${y.toFixed(1)}`;
});
const path = `M ${points.join(" L ")}`;
const area = `${path} L 100,80 L 0,80 Z`;
const lastX = 100;
const lastY = 80 - ((values[values.length - 1] - min) / range) * 72;
const toneClass = tone === "amber" ? "cockpit-spark--amber" : "";
---

<article class={`cockpit-spark ${toneClass}`}>
  <div class="cockpit-spark__meta">
    <p class="cockpit-tile__label">{label}</p>
    <p class="cockpit-spark__value">{value}</p>
    <p class="cockpit-tile__delta">{delta}</p>
  </div>
  <svg class="cockpit-spark__svg" viewBox="0 0 100 80" preserveAspectRatio="none" aria-hidden="true">
    <defs>
      <linearGradient id="cockpit-spark-grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stop-color={tone === "amber" ? "#E9A53A" : "#4BAF50"} stop-opacity="0.35" />
        <stop offset="100%" stop-color={tone === "amber" ? "#E9A53A" : "#4BAF50"} stop-opacity="0" />
      </linearGradient>
    </defs>
    <path class="cockpit-spark__area" d={area} />
    <path class="cockpit-spark__line" d={path} />
    <circle class="cockpit-spark__dot" cx={lastX} cy={lastY} r="2.2" />
  </svg>
</article>
```

**Note**: l'id `cockpit-spark-grad` est dupliqué si on rend 2 sparklines. Acceptable en SVG inline (le dernier wins), mais si visuel casse → utiliser un id unique par carte (`cockpit-spark-grad-${i}`) passé en prop.

- [ ] **Step 3.3: `StatusRail.astro`**
```astro
---
interface Row { name: string; latency: string; status: "ok" | "amber" | "muted" }
interface Props { heading: string; rows: readonly Row[] }
const { heading, rows } = Astro.props;
---

<aside class="cockpit-rail__card">
  <p class="cockpit-rail__heading">{heading}</p>
  {rows.map((r) => (
    <div class="cockpit-rail__row">
      <span class="cockpit-rail__name">
        <span class={`cockpit-tile__status-dot cockpit-tile__status-dot--${r.status === "ok" ? "ok-inline" : r.status}`}
              style="position: relative; top: 0; right: 0; display: inline-block; margin-right: 0.5rem;"></span>
        {r.name}
      </span>
      <span class="cockpit-rail__latency">{r.latency}</span>
    </div>
  ))}
</aside>
```

- [ ] **Step 3.4: `CommandPaletteInstall.astro`**
```astro
---
interface Item { label: string; hint: string; href: string; code: string }
interface Props {
  placeholder: string;
  kbd: string;
  groupInstall: string;
  groupDocs: string;
  items: readonly Item[];
}
const { placeholder, kbd, groupInstall, groupDocs, items } = Astro.props;
const installs = items.filter((it) => it.code !== "docs");
const docs = items.filter((it) => it.code === "docs");
---

<div class="cockpit-cmdk" role="dialog" aria-label="Install command palette">
  <div class="cockpit-cmdk__input">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
      <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>
    </svg>
    <span class="cockpit-cmdk__input-text">{placeholder}</span>
    <span class="cockpit-cmdk__kbd">{kbd}</span>
  </div>
  <div class="cockpit-cmdk__group">
    <p class="cockpit-cmdk__group-heading">{groupInstall}</p>
    {installs.map((it) => (
      <a class="cockpit-cmdk__item" href={it.href}>
        <span>{it.label}</span>
        <code>{it.hint}</code>
      </a>
    ))}
  </div>
  <div class="cockpit-cmdk__group">
    <p class="cockpit-cmdk__group-heading">{groupDocs}</p>
    {docs.map((it) => (
      <a class="cockpit-cmdk__item" href={it.href}>
        <span>{it.label}</span>
        <code>{it.hint}</code>
      </a>
    ))}
  </div>
</div>
```

- [ ] **Step 3.5: `CockpitGrid.astro`**
```astro
---
import KPITile from "./KPITile.astro";
import SparkCard from "./SparkCard.astro";
interface Props {
  kpis: readonly { label: string; value: string; delta?: string; status?: "ok" | "amber" | "muted" }[];
  sparks: readonly { label: string; value: string; delta: string; values: number[]; tone: "emerald" | "amber" }[];
}
const { kpis, sparks } = Astro.props;
---

<div class="cockpit-grid">
  {kpis.slice(0, 4).map((k) => <KPITile {...k} />)}
  <SparkCard {...sparks[0]} />
  <SparkCard {...sparks[1]} />
  {kpis.slice(4, 10).map((k) => <KPITile {...k} />)}
</div>
```

- [ ] **Step 3.6: Typecheck + commit**
```bash
pnpm typecheck
git add src/components/alt/cockpit/
git commit -m "feat(alt/cockpit): tile, spark, rail, cmdk, grid components"
```

---

## Task 4: Wrapper + routes

- [ ] **Step 4.1: `CockpitPage.astro`**
```astro
---
import AltLayout from "@/layouts/AltLayout.astro";
import IslandNav from "@/components/alt/shared/IslandNav.astro";
import FadeUpOnView from "@/components/alt/motion/FadeUpOnView.tsx";
import CockpitGrid from "./CockpitGrid.astro";
import StatusRail from "./StatusRail.astro";
import CommandPaletteInstall from "./CommandPaletteInstall.astro";
import type { Locale } from "@/i18n/config";
import enCopy from "@/i18n/alt/cockpit.en";
import frCopy from "@/i18n/alt/cockpit.fr";

interface Props { locale: Locale }
const { locale } = Astro.props;
const t = locale === "fr" ? frCopy : enCopy;
---

<AltLayout
  theme="cockpit"
  locale={locale}
  title={t.meta.title}
  description={t.meta.description}
  slug="cockpit"
>
  <a href="#main" class="skip-link">Skip to content</a>
  <IslandNav locale={locale} slug="cockpit" />

  <main id="main">
    <FadeUpOnView client:visible>
      <header class="cockpit-head">
        <div>
          <p class="cockpit-head__meta">
            <span class="cockpit-tile__status-dot" style="position: relative; top: 0; right: 0; display: inline-block;"></span>
            {t.head.meta}
          </p>
          <h1 class="cockpit-head__title">{t.head.title}</h1>
          <p class="cockpit-head__sub">{t.head.sub}</p>
        </div>
      </header>
    </FadeUpOnView>

    <div class="cockpit-rail">
      <div>
        <FadeUpOnView client:visible delay={0.05}>
          <CockpitGrid kpis={t.kpis} sparks={t.sparks} />
        </FadeUpOnView>
      </div>
      <FadeUpOnView client:visible delay={0.1}>
        <StatusRail heading={t.rail.heading} rows={t.rail.rows} />
      </FadeUpOnView>
    </div>

    <FadeUpOnView client:visible delay={0.05}>
      <CommandPaletteInstall
        placeholder={t.cmdk.placeholder}
        kbd={t.cmdk.kbd}
        groupInstall={t.cmdk.groupInstall}
        groupDocs={t.cmdk.groupDocs}
        items={t.cmdk.items}
      />
    </FadeUpOnView>
  </main>
</AltLayout>
```

- [ ] **Step 4.2: Routes + commit**

`src/pages/alt/cockpit.astro` + `src/pages/fr/alt/cockpit.astro` (pattern 1-liner).

```bash
pnpm build
git add src/components/alt/cockpit/CockpitPage.astro src/pages/alt/cockpit.astro src/pages/fr/alt/cockpit.astro
git commit -m "feat(alt/cockpit): wrapper + EN/FR routes"
```

---

## Task 5: Browser QA

- [ ] **Step 5.1: Preview `/alt/cockpit` EN**

Vérifier :
1. **Header** : "Niamoto, live." en Geist 600, sub gris, meta EN DIRECT avec dot vert.
2. **Bento** : 4 tiles ligne 1, 2 sparkline wide ligne 2, 6 tiles ligne 3-4. Chaque tile : status dot top-right, label mono, valeur grande tabular, delta colorisé.
3. **Sparklines** : path emerald (commits) + path amber (taxa). Area sous remplie en gradient. Dot au bout.
4. **Rail** status : 3 portails listés, NC/Gabon dots verts, Guyane dot gris.
5. **Command palette** : input faux avec `⌘K` kbd, groupes INSTALL et DOCS, items avec code hint aligné droite.
6. **Tabular nums** : scroller les numbers → confirme l'alignement parfait.

- [ ] **Step 5.2: Preview `/fr/alt/cockpit`**

Espaces insécables dans les nombres français : `1 208`, `70 412`, `2 713`. Accents : *indexés*, *parcelles*, *couvertes*, *endémiques*, *mesurés*, *trimestre*. OK.

- [ ] **Step 5.3: Responsive**

- 1100px : grille passe en 2-col, sparklines occupent 2-col toujours.
- 640px : grille 1-col, rail passe en dessous.

- [ ] **Step 5.4: REVIEW.md + commit**

Ajouter entrée "V9 Cockpit" à `docs/alt/REVIEW.md`.
```bash
git add docs/alt/REVIEW.md
git commit -m "docs(alt/cockpit): add variant audit entry"
```

---

## Risks & gotchas

1. **SVG gradient id dupliqué** — 2 sparklines → même id. Si le rendering casse sur Safari, passer un id unique via `Astro.props.index` ou UUID.
2. **Data statique hardcodée** — les valeurs sparkline sont fake-realistic. Convient à un mode "build-time snapshot". Si on veut vraiment du live, il faut un fetch en `<script>` au runtime — overkill pour cette variante marketing.
3. **shadcn esthetic sans npm** — on reproduit le look sans installer `@radix-ui`. OK parce que c'est une landing, pas une app. Ne pas étendre.
4. **Dark + grain mix-blend-mode** — `AltLayout` grain utilise `mix-blend-mode: screen` pour dark themes. Vérifier que le grain est subtile, pas distractif.
5. **Sticky rail sur mobile** — passe en 1-col donc sticky inutile. `@media (max-width: 900px)` enlève `grid-template-columns: 1fr 240px`. OK.

---

## Execution handoff

Plan suivant : V13 Planche (scroll horizontal + print) ou V10 Sporée (p5.js).
