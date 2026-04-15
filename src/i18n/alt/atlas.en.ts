// V1 Atlas - English copy.

export default {
  meta: {
    title: "Niamoto - Open ecological atlas, since 2012",
    description:
      "Niamoto is an open framework for publishing reproducible ecological portals. From field data to a shareable atlas of taxa, plots and forests.",
  },
  hero: {
    eyebrow: "OPEN ECOLOGY - SINCE 2012",
    title: ["From the field", "to the forest", "we can share."],
    titleItalicWord: "share",
    sub: "An open framework for publishing reproducible ecological portals. Built with the scientific community of Nouvelle-Caledonie.",
    cta: "Install",
    ctaSecondary: "View portals",
  },
  regions: {
    heading: "Deployed across ecosystems",
    intro: "Three portals across three forests, on three continents.",
    items: [
      {
        number: "01",
        name: "Nouvelle-Caledonie",
        sub: "South Pacific - Active since 2024",
        body: "1,208 tree taxa, 509 inventoried plots, 70,000+ measured trees across 5,400 km² of mapped forest.",
        partners: "Province Nord, Province Sud, IRD, IAC, AMAP, OFB, Endemia",
        status: "active",
        stat: { value: "1,208", label: "tree taxa" },
      },
      {
        number: "02",
        name: "Gabon - Cameroun",
        sub: "Central Africa - Upcoming 2026",
        body: "Tropical rainforest inventories of the Congo Basin, two countries, one shared portal.",
        partners: "Partners to be announced",
        status: "upcoming",
        stat: { value: "soon", label: "Congo Basin" },
      },
      {
        number: "03",
        name: "Guyane",
        sub: "Northern South America - Upcoming 2026",
        body: "Amazonian flora catalog, focused on the lesser-documented French Guianese tree communities.",
        partners: "Partners to be announced",
        status: "upcoming",
        stat: { value: "soon", label: "Amazonian flora" },
      },
    ],
  },
  pillars: {
    heading: "How Niamoto works",
    items: [
      {
        kicker: "01",
        title: "Import any ecological data",
        body: "CSV, GeoPackage, GeoJSON, raster. Auto-configuration detects your file types and maps fields.",
        snippet: "sources:\n  occurrences:\n    type: csv\n    path: occurrences.csv",
      },
      {
        kicker: "02",
        title: "Transform with plugins",
        body: "Declarative YAML transforms turn raw data into statistics, distributions and widgets. Plugin-based, extend what is missing.",
        snippet: null,
      },
      {
        kicker: "03",
        title: "Publish a static portal",
        body: "Auto-generated site with maps, charts, taxon pages. Deploy anywhere - GitHub Pages, Netlify, your own server.",
        snippet: null,
      },
    ],
  },
  closing: {
    eyebrow: "OPEN SOURCE",
    title: "Built in the open, for the scientific community",
    body: "Apache 2.0 licensed. Maintained by Arsis. Pull requests welcome.",
    ctaPrimary: "Star on GitHub",
    ctaSecondary: "Read the docs",
    discussions: "Join Discussions",
    changelog: "Read the changelog",
  },
  funders: {
    heading: "Built with",
  },
} as const;
