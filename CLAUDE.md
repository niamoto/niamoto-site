# Niamoto Site Development

Institutional site for **Niamoto** — the open-source ecological data platform. Deployed at [niamoto.org](https://niamoto.org).

**Golden rule**: scientific, calm, data-forward. No emojis. No gradient text. No "revolutionary" language.

## Stack

- **Astro 5.x** (static site generator) — `pnpm dev` on port 4321
- **Tailwind CSS v4** via `@tailwindcss/vite` — tokens defined in `src/styles/global.css` with `@theme`
- **TypeScript strict** — `pnpm typecheck` (alias `astro check`)
- **pnpm** as package manager
- **Node 22+** (via fnm locally, Node 22-alpine in Docker)

Deployed via Coolify on the Arsis server, static build served by Caddy.

## Commands

```bash
pnpm install
pnpm dev        # http://localhost:4321 with HMR
pnpm build      # astro check + astro build → dist/
pnpm preview    # serves dist/ locally
pnpm typecheck  # no build, just type check
```

## Critical Rules

### Tailwind v4 — `@source` with explicit subdirs

Tailwind v4's content scanning in `global.css` **requires explicit subdirectory globs**. The shorthand `@source "../**/*.astro"` is unreliable — fails silently and produces a CSS with only a handful of utility classes.

**Use**:
```css
@source "../components/**/*.astro";
@source "../pages/**/*.astro";
@source "../layouts/**/*.astro";
```

**Don't use**:
```css
@source "../**/*.astro";     /* silently scans nothing */
@source "../";                /* partial scan only */
```

When adding a new top-level directory under `src/`, add a matching `@source` line.

### Design system

All tokens live in `src/styles/global.css` under `@theme`. The full design reference is in the parent repo at `/Users/julienbarbe/Dev/clients/niamoto/docs/DESIGN_SYSTEM.md` — same palette, same typography. Both surfaces (site + GUI app) use the "Niamoto Ecological" system.

Key tokens:
- `--color-forest-green: #2E7D32` — primary CTA
- `--color-leaf-green: #4BAF50` — success, active states
- `--color-steel-blue: #5B86B0` — links, upcoming badges
- `--color-canvas: #F5F6F8` — page background
- `--color-ink: #111827` — body text, headings
- `--color-stone: #667085` — muted text
- `--font-display: "Plus Jakarta Sans"` (display + body)
- `--font-mono: "JetBrains Mono"` (code only)

Tailwind utility shape: `bg-forest-green`, `text-ink`, `bg-canvas`, etc. — auto-generated from `@theme` tokens.

### Content conventions

- **English everywhere** except the NC portal title "Portail de la forêt de Nouvelle-Calédonie" (keep the actual portal name intact)
- **No emojis** in UI content (icons are SVG, 1.5pt stroke)
- **Mono font** for: install commands, plugin names, file paths, keyboard hints (`⌘K`), URLs
- **Numbers in stats**: mono font for hero stats and tables, Plus Jakarta Sans for narrative numbers

### Components

- All interactive elements live in `src/components/` — small, prop-driven, Astro-native
- `Button.astro` and `DownloadButton.astro` are the two CTA primitives — prefer `DownloadButton` for the "download Niamoto" CTA (it detects OS)
- `FunderStrip` renders the 9 partner logos from `public/funders/` — order is intentional, don't shuffle
- `RegionCard` is for the "Deployed across ecosystems" section — silhouette SVGs are abstract on purpose (not cartographic)
- `Pill` variants: `leaf` (active), `steel` (upcoming), `neutral` (generic)

### Assets

- `public/niamoto_logo.png` — official logo (also used as favicon)
- `public/funders/*.png` — 9 partner logos, order defined in `FunderStrip.astro` AND in `manifest.yaml`
- `public/showcase/nc-home.png`, `nc-taxons.png` — portal Nouvelle-Calédonie screenshots
- `public/showcase/` — add `nc-plots.png`, `nc-methodology.png`, and mockups for Gabon/Guyane when available

### Download links

`DownloadButton.astro` currently points all 3 OS links to `github.com/niamoto/niamoto/releases/latest`. When per-OS release assets exist (`.dmg`, `.AppImage`, `.exe`), update the `data-os-macos`, `data-os-linux`, `data-os-windows` attributes in that component.

## Git & commits

- **English commits** (conventional commits: `feat:`, `fix:`, `refactor:`, `docs:`, `style:`)
- **No `Co-Authored-By` trailer** (global user rule)
- **No "Generated with Claude Code" footer**
- Branch from `main`, small focused commits preferred
- Accents français dans les docs et commentaires de code (pas dans les commits)

## Structure

```
src/
  layouts/     BaseLayout.astro (head, meta, OG tags)
  components/  Shared UI (Header, Footer, Button, DownloadButton, Pill, FunderStrip, RegionCard, NiamotoLogo)
  pages/
    index.astro                       landing
    documentation/index.astro         docs home
    plugins/index.astro               plugins catalogue
    showcase/nouvelle-caledonie.astro showcase detail
  styles/
    global.css    Tailwind + @theme tokens + font imports
public/
  niamoto_logo.png
  funders/      9 partner logos + manifest.yaml
  showcase/     portal screenshots
Dockerfile + Caddyfile + .dockerignore
```

## Deploy

`Dockerfile` is multi-stage: Node 22-alpine builder → Caddy 2-alpine runtime. `Caddyfile` handles:
- Immutable cache headers for `/_astro/*`, `/funders/*`, `/showcase/*`
- Short revalidation for HTML
- Security headers (X-Frame-Options DENY, etc.)
- 404 → `404.html`

Local test:
```bash
docker build -t niamoto-site .
docker run -p 8080:80 niamoto-site
```

Production: Coolify deploys from the git repo. Domain `niamoto.org` points to the Arsis Coolify. SSL via Traefik/Let's Encrypt automatic.

## References

- Design system source: `../niamoto/docs/DESIGN_SYSTEM.md`
- Institutional site plan: `../niamoto/docs/plans/2026-04-14-feat-niamoto-marketing-site-plan.md`
- Partner manifest: `public/funders/manifest.yaml` (mirror of `../niamoto/docs/assets/funders/manifest.yaml`)
- Stitch project (design source): Stitch Labs project `3994834925262801582` "Niamoto"
