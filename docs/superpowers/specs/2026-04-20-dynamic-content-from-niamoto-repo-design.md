# Dynamic Content From Niamoto Repo — Design

**Date:** 2026-04-20
**Scope:** niamoto-site (Astro 5 marketing site) + niamoto (Python monorepo)
**Status:** Spec — pending implementation plan

## Goal

Make `niamoto.org/documentation`, `/plugins`, `/roadmap` and `/changelog`
render content sourced from the `niamoto/niamoto` GitHub repository. Each
push to `main` that touches a tracked source auto-rebuilds the marketing
site. No manual sync, no editorial duplication.

## Why

Today the marketing site hard-codes fake plugin entries, fake recipe
cards, and has no roadmap/changelog pages. The real source of truth
(plugin registry, docs sections, roadmap, changelog) lives in the niamoto
repo. Keeping two places in sync manually is brittle and already drifts
(the current `/plugins` page lists 12 fictional plugins; the real
registry has 67 registered classes).

## Non-goals

- Real-time / client-side fetching (the site stays statically generated).
- Server-side rendering (Caddy serves static HTML, no Node runtime).
- Mirroring the full Sphinx documentation into Astro (docs stay on
  `docs.niamoto.org` — the marketing page only lists entry points).
- Automatic sync of `usedBy` counters, plugin icons, or editorial
  descriptions not expressible in a Python docstring.

## Architecture overview

```
┌──────────────────────────────────────────────────────────────┐
│ niamoto repo (source of truth)                               │
│                                                              │
│  ROADMAP.md                      ─┐                          │
│  CHANGELOG.md                     │  raw.githubusercontent   │
│  docs/0[1-9]-*/README.md          ├─ fetched at build time   │
│  .marketing/plugins.json          │  by niamoto-site         │
│                                   │                          │
│  src/niamoto/core/plugins/**.py  ─┤  AST-parsed locally      │
│  scripts/generate-plugin-manifest.py  to produce JSON        │
│                                                              │
│  .github/workflows/marketing-sync.yml                        │
│     on push to tracked paths:                                │
│       1. run extractor → regenerate .marketing/plugins.json  │
│       2. commit if changed (with [skip ci])                  │
│       3. POST Coolify deploy webhook                         │
└──────────────────────────────────────────────────────────────┘
                           │
                           │ trigger rebuild
                           ▼
┌──────────────────────────────────────────────────────────────┐
│ niamoto-site (consumer, Astro 5)                             │
│                                                              │
│  src/content.config.ts — 4 collections with custom loaders:  │
│    • plugins             → .marketing/plugins.json           │
│    • docsSections        → docs/0[1-9]-*/README.md           │
│    • roadmap             → ROADMAP.md                        │
│    • changelog           → CHANGELOG.md                      │
│                                                              │
│  src/pages/                                                  │
│    documentation/index.astro  → refactored, uses docsSections│
│    plugins/index.astro        → refactored, uses plugins     │
│    roadmap.astro              → NEW                          │
│    changelog.astro            → NEW                          │
│                                                              │
│  Astro build fetches once, generates static HTML.            │
└──────────────────────────────────────────────────────────────┘
```

## Source layout — niamoto repo

### New files

```
niamoto/
├── .marketing/
│   └── plugins.json                    # generated artifact, committed
├── scripts/
│   └── generate-plugin-manifest.py     # ~60 LOC, AST-based
└── .github/workflows/
    └── marketing-sync.yml              # ~40 LOC
```

### `scripts/generate-plugin-manifest.py`

Walks `src/niamoto/core/plugins/**/*.py`, parses each file with Python's
stdlib `ast` module (no code execution). For every class decorated with
`@register("name", PluginType.TYPE)`:

- Extract the plugin `name` (decorator first arg, `ast.Constant.value`).
- Extract `type` (decorator second arg, `ast.Attribute.attr` lowercased;
  fallback on the class's `type =` attribute assignment).
- Extract the class docstring's first paragraph via
  `ast.get_docstring(cls_node)`, split on `\n\n`, stripped.

Reads `pyproject.toml` once for the package version (single value shared
by all plugins — plugins do not version independently).

Output shape:

```json
[
  {
    "name": "bar_plot",
    "type": "widget",
    "body": "Widget to display a bar plot using Plotly.",
    "version": "0.15.4"
  },
  …
]
```

Sorted by `type`, then `name`. Idempotent: running twice with no source
change yields byte-identical output.

Exit codes: `0` on success, `1` on parse error (CI fails loudly).

### `.github/workflows/marketing-sync.yml`

```yaml
name: Institutional site sync

on:
  push:
    branches: [main]
    paths:
      - "src/niamoto/core/plugins/**"
      - "docs/0*/README.md"
      - "ROADMAP.md"
      - "CHANGELOG.md"
      - "pyproject.toml"
      - ".marketing/**"
      - "scripts/generate-plugin-manifest.py"
      - ".github/workflows/marketing-sync.yml"

jobs:
  sync:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-python@v6
        with:
          python-version: "3.12"

      - name: Regenerate plugin manifest
        run: python scripts/generate-plugin-manifest.py

      - name: Commit manifest if changed
        run: |
          if ! git diff --quiet .marketing/plugins.json; then
            git config user.name "niamoto-bot"
            git config user.email "bot@niamoto.org"
            git add .marketing/plugins.json
            git commit -m "chore: regenerate .marketing/plugins.json [skip ci]"
            git push
          fi

      - name: Trigger niamoto-site rebuild
        run: |
          curl -f -X GET "${{ secrets.COOLIFY_WEBHOOK }}" \
            -H "Authorization: Bearer ${{ secrets.COOLIFY_TOKEN }}"
```

**Secrets required in niamoto repo** (GitHub → Settings → Secrets):

- `COOLIFY_WEBHOOK` — deploy webhook URL for the niamoto-site app
  (copied from Coolify app settings).
- `COOLIFY_TOKEN` — Coolify API token with "Deploy" right.

The `[skip ci]` tag on the auto-commit prevents an infinite loop where
the manifest commit itself triggers the workflow.

## Consumer layout — niamoto-site

### `src/content.config.ts`

Four collections, each with a custom loader (~30 LOC). No external
dependency on `astro-github-file-loader` — it is under-maintained and
the logic we need is trivial.

```ts
import { defineCollection, z } from "astro:content";
import {
  pluginsLoader,
  docsSectionsLoader,
  markdownFileLoader,
} from "@/content-loaders/niamoto";

export const collections = {
  plugins: defineCollection({
    loader: pluginsLoader({ ref: "main" }),
    schema: z.object({
      name: z.string(),
      type: z.enum(["transformer", "widget", "loader", "exporter", "deployer"]),
      body: z.string(),
      version: z.string(),
    }),
  }),
  docsSections: defineCollection({
    loader: docsSectionsLoader({ ref: "main" }),
    schema: z.object({
      slug: z.string(),      // e.g. "01-getting-started"
      title: z.string(),     // H1
      audience: z.string().optional(),
      purpose: z.string(),
      href: z.string().url(),
    }),
  }),
  roadmap: defineCollection({
    loader: markdownFileLoader({ path: "ROADMAP.md", ref: "main" }),
    schema: z.object({
      body: z.string(),
    }),
  }),
  changelog: defineCollection({
    loader: markdownFileLoader({ path: "CHANGELOG.md", ref: "main" }),
    schema: z.object({
      body: z.string(),
    }),
  }),
};
```

### Loader implementation sketch

`src/content-loaders/niamoto.ts`:

```ts
const REPO = "niamoto/niamoto";
const RAW = (ref: string, path: string) =>
  `https://raw.githubusercontent.com/${REPO}/${ref}/${path}`;

export function pluginsLoader({ ref = "main" } = {}) {
  return {
    name: "niamoto-plugins",
    load: async ({ store, parseData, generateDigest }) => {
      const json = await fetch(RAW(ref, ".marketing/plugins.json"))
        .then((r) => r.json());
      for (const entry of json) {
        const data = await parseData({ id: entry.name, data: entry });
        store.set({
          id: entry.name,
          data,
          digest: generateDigest(entry),
        });
      }
    },
  };
}

export function docsSectionsLoader({ ref = "main" } = {}) {
  return {
    name: "niamoto-docs-sections",
    load: async ({ store, parseData, generateDigest }) => {
      // Hard-coded list of section slugs (stable, rarely changes).
      const sections = [
        "01-getting-started", "02-user-guide", "03-cli-automation",
        "04-plugin-development", "05-ml-detection", "06-reference",
        "07-architecture", "09-troubleshooting",
        // 08-roadmaps intentionally excluded (thin placeholder)
      ];
      for (const slug of sections) {
        const md = await fetch(RAW(ref, `docs/${slug}/README.md`))
          .then((r) => r.text());
        const parsed = parseSectionReadme(md); // extract H1, purpose, audience
        const data = await parseData({
          id: slug,
          data: {
            slug,
            title: parsed.title,
            audience: parsed.audience,
            purpose: parsed.purpose,
            href: `https://docs.niamoto.org/${slug}/README.html`,
          },
        });
        store.set({ id: slug, data, digest: generateDigest(data) });
      }
    },
  };
}

export function markdownFileLoader({ path, ref = "main" }) {
  return {
    name: `niamoto-file-${path}`,
    load: async ({ store, parseData, generateDigest }) => {
      const body = await fetch(RAW(ref, path)).then((r) => r.text());
      const data = await parseData({ id: "content", data: { body } });
      store.set({ id: "content", data, digest: generateDigest(body) });
    },
  };
}
```

`parseSectionReadme(md)` is a small helper that:

1. Grabs the first `# …` line as `title`.
2. Looks for `> Audience: …` blockquote line → `audience`.
3. Looks for `> Purpose: …` blockquote line OR the first paragraph of
   regular text after the heading → `purpose`.

All four loaders gracefully handle network errors by throwing (build
fails fast, Coolify retains previous successful build).

### Page changes

**`src/pages/plugins/index.astro`**

- Remove hard-coded `plugins` array (lines 18–37).
- Remove hard-coded `filters` array (lines 39–45) — replaced by counts
  computed from the collection.
- `await getCollection("plugins")` at the top.
- Render cards with the same Frond design as today: type chip (leaf /
  steel / violet depending on type), mono plugin name, `body`,
  `v{version}` on the right. Drop `Used by N projects` entirely.
- Filter pills show real counts.
- Add `"deployer"` type chip (new: violet or second-steel — design
  system says violet is fine for secondary pipeline types).

**`src/pages/documentation/index.astro`**

- Remove `recipes` array (lines 6–43) and its grid.
- Remove `navSections` array (lines 45–71) and the sidebar (left
  column).
- Layout becomes single-column max-w-[960px] centered.
- Hero unchanged (title + description + search bar shell — the search
  bar becomes a link to `docs.niamoto.org/search.html`).
- Below hero: `await getCollection("docsSections")` → 8 cards in a
  2-col grid (sm:grid-cols-2), one per section, each linking out to
  `docs.niamoto.org`.
- Community callout block preserved as-is.
- Every section wrapped in `FadeUpOnView` with staggered delays, same
  pattern as `/plugins`.

**`src/pages/roadmap.astro` (new)**

- One Astro collection entry: `changelog` → renders `ROADMAP.md`.
- Layout: `<AltLayout>` + `FrondHeader` + `FrondFooter`, centered
  `max-w-[760px]`, `.prose` typography.
- Hero: "Roadmap" title + subtitle "What's shipping, what's next, what's
  on the horizon." + last-updated date.
- Body: markdown rendered via `marked`. Relative-link rewrite pass
  transforms `docs/plans/foo.md` → GitHub blob URL; `docs/superpowers/…`
  idem. External `https://…` links kept.
- Outbound-link indicator (small arrow SVG) on rewritten links.

**`src/pages/changelog.astro` (new)**

- Two-column layout on md+, single column on mobile:
  - Sticky left nav (max-w-[200px]) — version list, scrolls to anchor.
  - Right pane — version by version, H2 per version, release date,
    "Features / Bug Fixes / Other" rendered from the markdown.
- Parser: split `CHANGELOG.md` on `^## \[` regex, group into version
  blocks. Each block rendered through `marked`.
- Anchor IDs = version strings (`v0-15-4` from `v0.15.4`).
- No mobile dropdown — flat scroll with sticky top version indicator
  on mobile.

### Header + footer updates

**Header (`FrondHeader.astro`)** — 5 items flat:

```
Documentation · Plugins · Showcase · Changelog · GitHub
```

**Footer (`FrondFooter.astro`)** — "Project" column gains `Roadmap`:

```
Project:
  Documentation
  Plugins
  Roadmap              ← new
  Changelog            ← new (also in header)
  Showcase
```

i18n strings added to `shared.en.ts` / `shared.fr.ts`:

- `changelog: "Changelog"` / `"Changelog"` (same in French)
- `roadmap: "Roadmap"` / `"Feuille de route"`

The `/roadmap` and `/changelog` pages render source content in English
only (the niamoto repo is English-first). UI chrome (header, footer,
page titles "Roadmap", "Changelog" heading on page) is localized.

## Data flow, request by request

**Scenario A — Developer pushes a new plugin class:**

1. Developer adds `@register("great_plugin", PluginType.TRANSFORMER)` +
   docstring, commits, pushes `main`.
2. `marketing-sync.yml` triggers (path `src/niamoto/core/plugins/**`).
3. Workflow runs `generate-plugin-manifest.py`, diff shows new entry.
4. Workflow commits `.marketing/plugins.json` with `[skip ci]`.
5. Workflow POSTs Coolify webhook.
6. Coolify pulls niamoto-site `main`, runs `pnpm build`.
7. Astro content-layer calls `pluginsLoader` → fetches fresh
   `plugins.json` from raw.githubusercontent.com → builds HTML.
8. Coolify deploys, Caddy serves. Total elapsed: ~2 minutes.

**Scenario B — Editor updates `docs/02-user-guide/README.md`:**

1. Commit touches tracked path.
2. `marketing-sync.yml` triggers.
3. Workflow runs the extractor (noop for plugins), no commit.
4. Workflow POSTs Coolify webhook.
5. Astro rebuilds, fetches the updated README, re-renders the card.

**Scenario C — Editor updates `ROADMAP.md`:**

Identical to B.

## Failure modes

| Failure | Impact | Mitigation |
|---|---|---|
| GitHub raw CDN outage | Build fails | Coolify keeps previous deploy live; retry by re-triggering webhook |
| AST parser cannot parse a plugin file | Workflow exits 1 | Workflow fails loudly; site stays on last green deploy |
| Docstring missing on a plugin class | Empty `body` string | `parseData` still succeeds; card renders with empty description |
| Coolify webhook returns non-2xx | Workflow step fails | GH notification; manual re-run |
| Docs section renamed (e.g., `02-user-guide` → `02-desktop-guide`) | 404 on fetch | Build fails; developer updates `sections` list in loader |

The loader hard-codes the 8 section slugs. This is deliberate: section
renames in the niamoto docs happen rarely (~once per year from git
history) and warrant a matching config bump in niamoto-site. Dynamic
directory listing would require a GitHub API token and rate-limit
handling for a negligible benefit.

## Estimated work

Four loose phases that can be tackled sequentially or interleaved:

- **Phase 1 — niamoto repo infra** (~2 h)
  - `generate-plugin-manifest.py` + unit test against current registry.
  - `marketing-sync.yml` workflow.
  - Secrets wiring (manual, one-time).
  - First commit of `.marketing/plugins.json`.

- **Phase 2 — niamoto-site infra** (~2 h)
  - `src/content-loaders/niamoto.ts` (4 loaders + section parser).
  - `src/content.config.ts` (4 collection definitions with schemas).
  - Smoke test: `pnpm build` fetches real data, prints counts.

- **Phase 3 — Refactor existing pages** (~2 h)
  - `/plugins` → uses collection, drops `usedBy`.
  - `/documentation` → uses collection, single-column layout, drops
    recipes + sidebar.

- **Phase 4 — New pages + header/footer** (~3 h)
  - `/roadmap` page (with relative-link rewrite).
  - `/changelog` page (with version nav).
  - Header: add Changelog.
  - Footer: add Roadmap + Changelog columns.
  - i18n keys.

Total: ~9 h of implementation, not counting review loops.

## Open questions / deferred

- **Localized content**: ROADMAP.md and CHANGELOG.md are English-only
  in the niamoto repo. If French localization is eventually required,
  either add sibling files (`ROADMAP.fr.md`) or accept EN-only for
  these pages. Not blocking.
- **Search**: `/documentation`'s search bar currently does nothing. A
  future iteration could use Pagefind indexed against the Sphinx
  output, but out of scope here.
- **Plugin deep-link**: plugin cards do not currently link anywhere.
  Future iteration: each card links to
  `docs.niamoto.org/04-plugin-development/<name>.html` if such pages
  exist.
