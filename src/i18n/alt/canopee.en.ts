export default {
  meta: {
    title: "Niamoto · Canopée — A forest, from canopy to soil",
    description:
      "A vertical scroll through a forest, canopy to soil, with Niamoto as the lens. Five strata, one toolkit, one open licence.",
  },
  stage1: {
    title: "A forest,",
    titleEmphasis: "canopy to soil.",
    caption: "CANOPY · STRATA I",
  },
  stage2: {
    eyebrow: "UNDERSTORY · STRATA II",
    plateaux: [
      {
        title: "A toolkit, not a platform.",
        body: "Niamoto is installed on your laptop, runs against your data, publishes to your server. No account to create. No signup page. No uptime to worry about.",
      },
      {
        title: "Every portal, a static site.",
        body: "What ships is plain HTML. It outlives the grant that funded the project. It reads without JavaScript. It survives three hosting migrations.",
      },
      {
        title: "The pipeline is yours.",
        body: "Transforms, exports, taxonomies, plugins — all versioned in your repo. The moment the project ends, the portal keeps serving.",
      },
    ],
  },
  stage3: {
    eyebrow: "SHRUB · STRATA III",
    heading: "Counted, plotted, shared.",
    body: "Three forests in, over a decade of measurements. The data doesn't live in a silo — every plot, every tree, every taxon, accessible offline.",
    legend: [
      { label: "Taxa indexed",   value: "1,208"  },
      { label: "Plots covered",  value: "509"    },
      { label: "Trees measured", value: "70,412" },
    ],
  },
  stage4: {
    eyebrow: "HERB · STRATA IV",
    heading: "Forty-two plugins, one runtime.",
    plugins: [
      { name: "niamoto.transform", body: "Move columns between raw field notes and the portal schema." },
      { name: "niamoto.export",    body: "Emit HTML, JSON, GeoJSON, static shapefiles — whatever the field wants." },
      { name: "niamoto.taxonomy",  body: "Reconcile names across IRD, Kew, GBIF sources in a single pass." },
      { name: "niamoto.plot",      body: "Build plot-level summaries — biodiversity, basal area, DBH histograms." },
      { name: "niamoto.tree",      body: "Per-tree narratives. Rarity flags. Endemism badges." },
      { name: "niamoto.viewer",    body: "Static map + taxon browser. Offline-friendly. No API keys." },
      { name: "niamoto.theme",     body: "Swap the design system. Same data, different skin." },
      { name: "niamoto.watch",     body: "Detect schema drift between field campaigns." },
    ],
  },
  stage5: {
    quote: "One toolkit. One install. One licence. The forest does the rest.",
    terminal: "pip install niamoto",
    ctaPrimary: { label: "Clone the repo", href: "https://github.com/niamoto/niamoto" },
  },
  progress: [
    "CANOPY",
    "UNDERSTORY",
    "SHRUB",
    "HERB",
    "SOIL",
  ],
} as const;
