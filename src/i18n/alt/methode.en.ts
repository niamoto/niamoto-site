// V3 Methode - English copy.

export default {
  meta: {
    title: "Niamoto - Ecological data, publishable portals",
    description:
      "Niamoto is the open framework that turns field data into reproducible web portals. Built for scientists, foresters and developers.",
  },
  hero: {
    eyebrow: "OPEN ECOLOGY FRAMEWORK",
    title: ["Ecological data.", "Publishable portals."],
    sub: "An open framework that turns inventories, occurrences and plots into a static, reproducible portal. Configured in YAML. Built in minutes.",
    cta: "Install",
    ctaSecondary: "View documentation",
  },
  bento: {
    terminal: {
      kicker: "INSTALL",
      lines: [
        "pip install niamoto",
        "niamoto init my-portal",
        "niamoto run --all",
        "niamoto deploy --static",
      ],
    },
    stats: {
      kicker: "DEPLOYMENTS",
      items: [
        { value: 1208, label: "tree taxa", suffix: "" },
        { value: 5400, label: "km² of forest", suffix: "" },
        { value: 509, label: "plots inventoried", suffix: "" },
        { value: 70000, label: "trees measured", suffix: "+" },
      ],
    },
    portals: {
      kicker: "PORTALS",
      items: [
        { code: "NC", name: "Nouvelle-Caledonie", status: "active" },
        { code: "GAB", name: "Gabon - Cameroun", status: "upcoming" },
        { code: "GUY", name: "Guyane", status: "upcoming" },
      ],
    },
  },
  pillars: {
    heading: "Three steps. No magic.",
    items: [
      {
        kicker: "01 - INGEST",
        title: "Any tabular or geospatial source",
        body: "CSV, GeoPackage, GeoJSON, raster, PostGIS. Auto-detection of file types and field mapping.",
      },
      {
        kicker: "02 - TRANSFORM",
        title: "Declarative YAML pipelines",
        body: "Compose statistics, distributions and widgets through a typed plugin system. Extend what is missing.",
      },
      {
        kicker: "03 - PUBLISH",
        title: "Static portal, deploy anywhere",
        body: "Auto-generated maps, charts, taxon and plot pages. GitHub Pages, Netlify, your own server.",
      },
    ],
  },
  closing: {
    title: "Open source. Apache 2.0.",
    body: "Maintained by Arsis. Pull requests, plugin contributions and field reports welcome.",
    ctaPrimary: "Star on GitHub",
    ctaSecondary: "Read the docs",
  },
  funders: { heading: "Built with" },
} as const;
