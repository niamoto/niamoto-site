// V6 Portail - English copy.

export default {
  meta: {
    title: "Niamoto - From field data to a shareable portal",
    description:
      "Niamoto turns your field data into a reproducible web portal. See the Nouvelle-Caledonie deployment, from the home page to a single taxon sheet.",
  },
  hero: {
    eyebrow: "FROM FIELD TO PORTAL",
    titleLines: [
      "Your field data,",
      { italic: true, text: "a shareable portal." },
    ],
    sub: "Niamoto is an open framework that turns inventories and occurrences into a static, reproducible ecological portal. Configured in YAML, deployed anywhere.",
    cta: "Install",
    ctaSecondary: "Explore the NC portal",
  },
  rail: {
    kicker: "LIVE EXAMPLE",
    heading: "Three pages of the Nouvelle-Caledonie portal",
    sub: "Home. A 1,208-taxon index. A single species sheet. All generated from the same YAML pipeline.",
    cards: [
      {
        code: "01 / HOME",
        name: "nouvelle-caledonie",
        role: "Landing",
        body: "Overview of the 5,400 km² deployment: maps, endemic statistics, recent updates.",
        image: "/showcase/nc-home.png",
        alt: "Home page of the Nouvelle-Caledonie Niamoto portal",
        href: "https://niamoto.github.io/niamoto-nouvelle-caledonie-2025/",
      },
      {
        code: "02 / INDEX",
        name: "/taxons",
        role: "1,208 taxa",
        body: "Filterable list of every tree taxon in the deployment. Sortable by family, rank, endemicity.",
        image: "/showcase/nc-taxons.png",
        alt: "Taxon index page listing 1208 tree taxa",
        href: "https://niamoto.github.io/niamoto-nouvelle-caledonie-2025/taxons/",
      },
      {
        code: "03 / SHEET",
        name: "Amborella trichopoda",
        role: "Single taxon",
        body: "Occurrences map, plot distribution, basal area, endemic status. One page per species.",
        // SVG mockup — rendered inline in PortalPreviewCard.
        image: null,
        alt: "Single species sheet for Amborella trichopoda",
        href: "https://niamoto.github.io/niamoto-nouvelle-caledonie-2025/taxons/",
      },
    ],
  },
  process: {
    kicker: "HOW",
    heading: "Three steps. No magic.",
    items: [
      {
        number: "01",
        title: "Ingest",
        body: "CSV, GeoPackage, raster. Auto-detection of your file types, fields mapped by convention.",
      },
      {
        number: "02",
        title: "Transform",
        body: "Declarative YAML pipelines turn raw data into statistics, distributions, widgets.",
      },
      {
        number: "03",
        title: "Publish",
        body: "A static portal. Deploy to GitHub Pages, Netlify or your own server in seconds.",
      },
    ],
  },
  closing: {
    eyebrow: "OPEN SOURCE",
    title: "GPL v3. Maintained by Arsis.",
    body: "Pull requests and field reports welcome. The NC portal ships as a public reference deployment.",
    ctaPrimary: "Star on GitHub",
    ctaSecondary: "Read the docs",
  },
  funders: { heading: "Built with" },
} as const;
