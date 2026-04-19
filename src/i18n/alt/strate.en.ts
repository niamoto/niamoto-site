// V7 Strate - English copy. Longform editorial.

export default {
  meta: {
    title: "Niamoto - A layered read, on open ecological data",
    description:
      "A long-form reading of Niamoto: the open ecological framework that turns forest inventories into shareable, reproducible portals.",
  },
  hero: {
    eyebrow: "A LONG READ - APRIL 2026",
    titleLines: [
      "An ecological",
      { italic: true, text: "atlas," },
      "one strata",
      "at a time.",
    ],
    sub: "Niamoto is the open framework we have been building since 2012 to make ecological data publishable. Not as a slide deck, not as a paper appendix. As a living portal that anyone can read, cite and extend.",
    cta: "Install",
    ctaSecondary: "Read the full piece",
    byline: "By the Niamoto team - 12 min read",
  },
  chapters: [
    {
      num: "01",
      label: "Ground layer",
      title: "Why another framework",
      body: "Every forest inventory dies twice. First on the day fieldwork ends. Then again when the PhD that analysed it is defended. The data lives on a laptop, in a spreadsheet, in a PDF appendix that nobody reads.",
      pull: "Fieldwork deserves better than a PDF appendix.",
    },
    {
      num: "02",
      label: "Understory",
      title: "The shape of the problem",
      body: "The field doesn't need another JavaScript dashboard. It needs a reproducible pipeline: raw inventory in, shareable portal out. Plugin-based, so each discipline can add its own widget. Static, so it outlives the PhD and the cloud bill.",
      stat: { value: 1208, label: "tree taxa in the current NC portal" },
    },
    {
      num: "03",
      label: "Canopy",
      title: "A real deployment",
      body: "The Nouvelle-Caledonie deployment went online in 2024. Eight institutions, 509 inventoried plots, 70,000+ measured trees, 5,400 km² of mapped forest. Every page - home, taxon index, species sheet - is generated from a single YAML configuration.",
      figureCaption: {
        intro: "Figure 01.",
        body: "One of 1,208 automatically generated taxon sheets. The page aggregates occurrences, basal area distribution, plot representation and endemicity status.",
      },
    },
    {
      num: "04",
      label: "Emergent layer",
      title: "What comes next",
      body: "Two portals are being set up for 2026: the Gabon - Cameroun deployment of the Congo Basin inventory, and a Guyane portal for the lesser-documented French Guianese tree communities. A fourth deployment is under evaluation.",
    },
    {
      num: "05",
      label: "Undergrowth",
      title: "How to start",
      body: "pip install niamoto, niamoto init, niamoto run. The docs walk through a real inventory - ingestion, transformation, publication - in about twenty minutes.",
      snippet: "$ pip install niamoto\n$ niamoto init my-portal\n$ niamoto run --all",
    },
    {
      num: "06",
      label: "Soil",
      title: "Built in the open",
      body: "GPL v3. Plugins welcome. Niamoto is maintained by Arsis with the scientific community of Nouvelle-Caledonie. Pull requests and field reports move the project forward.",
    },
  ],
  closing: {
    title: "Read the open source. Cite the data.",
    body: "The project is on GitHub, the docs are at niamoto.org/documentation, and the NC portal ships as a public reference.",
    ctaPrimary: "Star on GitHub",
    ctaSecondary: "Read the docs",
  },
  funders: { heading: "Built with" },
} as const;
