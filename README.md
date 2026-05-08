# niamoto-site

Institutional site for **Niamoto** — open-source ecological data platform.

- **Landing** : presentation, partners, deployed regions, features, showcase
- **Documentation** : guides and recipes
- **Plugins** : plugin catalogue
- **Showcase** : detailed portal pages (Nouvelle-Calédonie, future Gabon-Cameroun + Guyane)

Deployed at **[niamoto.org](https://niamoto.org)**.

## Stack

- **Astro 5.x** — static site generator
- **Tailwind CSS v4** — design tokens via `@theme`
- **TypeScript strict**
- Design system : `Niamoto Ecological` (voir `docs/DESIGN_SYSTEM.md` du repo parent)

## Development

```bash
pnpm install
pnpm dev        # http://localhost:4321
pnpm build      # generates dist/
pnpm preview    # serves dist/
pnpm typecheck  # astro check
```

## Design system tokens

Défini dans `src/styles/global.css` via `@theme` (Tailwind v4). Tokens principaux :

- `--color-forest-green: #2E7D32`
- `--color-leaf-green: #4BAF50`
- `--color-steel-blue: #5B86B0`
- `--color-canvas: #F5F6F8`
- Fonts : Plus Jakarta Sans (display + body) + JetBrains Mono (code)

## Structure

```
src/
  layouts/     # BaseLayout with SEO meta
  components/  # Header, Footer, Button, Pill, Card, FunderStrip, RegionCard
  pages/
    index.astro                      # landing
    documentation/index.astro        # docs home
    plugins/index.astro              # plugins catalogue
    showcase/nouvelle-caledonie.astro
  styles/
    global.css   # Tailwind + design tokens
public/
  niamoto_logo.png
  funders/       # 9 partner logos + manifest.yaml
  showcase/      # portal screenshots (nc-home.png, nc-taxons.png)
```

## Deploy

`Dockerfile` → Caddy static server. Deployed via Coolify on the Arsis server. Domain `niamoto.org` points to the container.

```bash
docker build -t niamoto-site .
docker run -p 8080:80 niamoto-site
```
