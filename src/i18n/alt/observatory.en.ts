// V5 Observatory - English copy.

export default {
  meta: {
    title: "Niamoto - The open ecological observatory",
    description:
      "Niamoto is the open framework that turns ecological fieldwork into live, shareable observatories. OLED-grade chrome, built for scientists.",
  },
  hero: {
    eyebrow: "OPEN ECOLOGY - ACTIVE SINCE 2012",
    titleLines: ["An open", "ecological", "observatory."],
    sub: "From field plots to a live portal. Niamoto turns inventories, occurrences and forests into a reproducible atlas that anyone can read, cite and extend.",
    cta: "Install",
    ctaSecondary: "Explore portals",
  },
  telemetry: {
    heading: "Live from the forest",
    sub: "A snapshot of what the Nouvelle-Caledonie deployment is tracking right now.",
    pulse: {
      kicker: "LIVE PULSE",
      lines: [
        { dot: true, label: "Amborella trichopoda", sub: "taxon viewed / NC", time: "just now" },
        { dot: true, label: "Plot NC-0421 ingested", sub: "Province Nord",   time: "2 min ago" },
        { dot: false, label: "Taxon sheet rebuilt",   sub: "Parasitaxus",    time: "14 min ago" },
        { dot: false, label: "Static site deployed",  sub: "build #2413",    time: "1 h ago" },
        { dot: false, label: "Endemia sync",          sub: "3 new species",  time: "6 h ago" },
      ],
    },
    stats: {
      kicker: "DEPLOYMENT / NC",
      items: [
        { value: 1208,  label: "tree taxa",        suffix: "" },
        { value: 5400,  label: "km² forest",       suffix: "" },
        { value: 509,   label: "plots",            suffix: "" },
        { value: 70000, label: "trees measured",   suffix: "+" },
      ],
    },
    map: {
      kicker: "RANGE",
      line1: "South Pacific",
      line2: "Nouvelle-Caledonie",
      secondary: "Gabon - Cameroun, Guyane coming 2026",
    },
    terminal: {
      kicker: "INSTALL",
      lines: [
        "pip install niamoto",
        "niamoto init observatory",
        "niamoto run --all",
        "niamoto deploy",
      ],
    },
  },
  pillars: {
    heading: "How the observatory is built",
    items: [
      {
        kicker: "01 / INGEST",
        title: "Any tabular or geospatial source",
        body: "CSV, GeoPackage, GeoJSON, raster, PostGIS. Auto-detection of file types and field mapping. No ETL team required.",
      },
      {
        kicker: "02 / TRANSFORM",
        title: "Declarative YAML pipelines",
        body: "Compose statistics, distributions and widgets with a typed plugin system. Extend what is missing in a few Python lines.",
      },
      {
        kicker: "03 / PUBLISH",
        title: "Static portal, deploy anywhere",
        body: "Auto-generated maps, charts, taxon and plot pages. GitHub Pages, Netlify, your own server. No runtime required.",
      },
    ],
  },
  closing: {
    eyebrow: "OPEN SOURCE",
    title: "Built in the open, for the scientific community.",
    body: "Apache 2.0. Maintained by Arsis. Pull requests, plugin contributions and field reports welcome.",
    ctaPrimary: "Star on GitHub",
    ctaSecondary: "Read the docs",
  },
  funders: { heading: "Built with" },
} as const;
