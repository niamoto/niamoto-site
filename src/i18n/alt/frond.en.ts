// Frond — canonical Niamoto design system applied as an /alt/ variant.
// Content blends the main landing page with the portail-alt narrative.

export default {
  meta: {
    title: "Niamoto · Frond — From field data to publishable ecological portals",
    description:
      "The canonical Niamoto design system applied as a landing variant. Import, structure, and publish ecological data into durable static portals.",
  },
  hero: {
    signage: "NIAMOTO · OPEN ECOLOGICAL PUBLISHING",
    eyebrow: "OPEN SOURCE · GPL V3",
    titleLines: [
      "From field data to ",
      { italic: true, text: "publishable" },
      " ecological portals.",
    ],
    sub:
      "Niamoto turns occurrence records, taxa inventories, and plot data into shareable static portals. Open source, plugin-based, built for ecologists.",
    ctaPrimary: { label: "Install Niamoto", href: "#download" },
    ctaSecondary: { label: "See a live portal", href: "https://niamoto.github.io/niamoto-nouvelle-caledonie-2025/" },
    install: {
      label: "Terminal",
      snippet: "pip install niamoto",
      copyAria: "Copy install command",
    },
    slides: [
      { src: "/showcase/app/dashboard.png",   alt: "Niamoto dashboard — project overview",     badge: "app",    label: "Dashboard"    },
      { src: "/showcase/app/import.png",       alt: "Import data sources into Niamoto",         badge: "app",    label: "Import"       },
      { src: "/showcase/app/widgets.png",      alt: "Widget catalog for collection pages",      badge: "app",    label: "Widgets"      },
      { src: "/showcase/app/site-builder.png", alt: "Site builder — configure portal pages",    badge: "app",    label: "Site builder" },
      { src: "/showcase/portail-alt/home-en.png",           alt: "Published portal home page",  badge: "portal", label: "Portal"       },
      { src: "/showcase/portail-alt/preview-taxons-en.png", alt: "Taxons browser page",         badge: "portal", label: "Taxons"       },
      { src: "/showcase/portail-alt/species-en.png",        alt: "Species detail page",         badge: "portal", label: "Species"      },
    ],
  },
  widgetBand: {
    eyebrow: "TOOLKIT TAGLINE",
    verbs: ["Import.", "Structure.", "Publish."],
    caption:
      "One CLI, one GUI, one publishing chain — four steps turn heterogeneous ecological files into clear, structured web pages.",
  },
  pillars: {
    kicker: "THREE PIPELINE STAGES",
    heading: "The toolkit in three verbs.",
    sub: "Each stage is a module. Each module is a plugin. No black boxes.",
    items: [
      {
        stage: "01 · DATA",
        color: "steel",
        title: "Import any ecological data.",
        body:
          "CSV, GeoPackage, GeoJSON, raster. Auto-configuration detects file types and maps fields. Darwin Core friendly.",
        snippet: "datasets:\n  occurrences:\n    connector:\n      type: file\n      format: csv\n      path: imports/occurrences.csv",
      },
      {
        stage: "02 · TRANSFORM",
        color: "leaf",
        title: "Transform with plugins.",
        body:
          "Declarative YAML transforms turn raw data into indexes, statistics, distributions, and widgets. Extend what is missing.",
        snippet: "- group_by: taxons\n  widgets_data:\n    top_species:\n      plugin: top_ranking\n    distribution_map:\n      plugin: geospatial_extractor",
      },
      {
        stage: "03 · SITE",
        color: "forest",
        title: "Publish a static portal.",
        body:
          "Auto-generated site with maps, charts, and taxon pages. Deploy anywhere — GitHub Pages, Netlify, your own server.",
        snippet: "niamoto run\n# → exports/web/ ready to deploy",
      },
    ],
  },
  reading: {
    kicker: "READING A PORTAL",
    heading: "Three surfaces, one publishing grammar.",
    sub:
      "The aim is not to showcase one deployment's numbers. It is to show how the same publishing logic turns field material into pages people can actually consult.",
    cards: [
      {
        label: "01 · HOME",
        meta: "ENTRY SURFACE",
        title: "The portal opens with orientation, not noise.",
        body:
          "Maps, recent additions, and portal sections are presented as reading landmarks. The page introduces a territory and its data structure at the same time.",
        image: "home" as const,
        notes: [
          { key: "Context", body: "The territory is named and situated before any stat becomes meaningful." },
          { key: "Access", body: "Navigation gives direct entry to taxons, plots, methods, and updates." },
          { key: "Tone", body: "The interface reads like a publication front page rather than a dashboard." },
        ],
      },
      {
        label: "02 · INDEX",
        meta: "BROWSING SURFACE",
        title: "A list becomes a way of reading the corpus.",
        body:
          "Taxons are not just stored. They are exposed through a legible index that can be scanned, filtered, and revisited by botanists, managers, or contributors.",
        image: "index" as const,
        notes: [
          { key: "Corpus", body: "The list establishes scale without forcing the page to perform through a hero metric." },
          { key: "Filters", body: "Sorting and browsing remain attached to ecological categories, not only technical fields." },
          { key: "Continuity", body: "From this index, every species sheet keeps the same visual and narrative language." },
        ],
      },
      {
        label: "03 · SHEET",
        meta: "REFERENCE SURFACE",
        title: "A species page is where map, evidence, and method meet.",
        body:
          "The species sheet is the strongest proof of output: a single page that assembles occurrences, territorial context, and reading cues into a durable reference.",
        image: "sheet" as const,
        notes: [
          { key: "Map", body: "Occurrences are visible as a territorial pattern, not a hidden attribute." },
          { key: "Method", body: "Charts and summaries remain tied to the way the data was structured upstream." },
          { key: "Durability", body: "The page can be cited, shared, archived, or read offline as a static document." },
        ],
      },
    ],
  },
  sequence: {
    kicker: "PUBLISHING CHAIN",
    heading: "From inventory to public reading.",
    sub:
      "The portal is only the last visible layer. What matters is the continuity between survey material, structured transformations, and the final pages.",
    items: [
      { number: "01", title: "Collect", body: "Occurrences, plots, taxonomies, and territorial files are gathered in their raw form, with all the irregularities of real field work." },
      { number: "02", title: "Structure", body: "YAML pipelines define the logic that turns files into indexes, summaries, widgets, and page-ready content." },
      { number: "03", title: "Publish", body: "The result is a static portal: clear URLs, shareable pages, and no hidden runtime dependency on a hosted backend." },
      { number: "04", title: "Consult", body: "Researchers, institutions, and field teams read the same material through pages designed for long-term consultation." },
    ],
  },
  showcase: {
    kicker: "DEPLOYED ACROSS ECOSYSTEMS",
    heading: "Live portals built with Niamoto.",
    sub: "The same grammar, three territories, one static output.",
    regions: [
      {
        name: "Nouvelle-Calédonie",
        sub: "South Pacific",
        status: "active",
        statusLabel: "Active",
        title: "Portail de la forêt",
        partners: "Province Nord, Province Sud, IRD, IAC",
        href: "https://niamoto.github.io/niamoto-nouvelle-caledonie-2025/",
        image: "/showcase/portail-alt/home-en.png",
      },
      {
        name: "Gabon – Cameroun",
        sub: "Central Africa",
        status: "upcoming",
        statusLabel: "Upcoming 2026",
        title: "Portail des forêts du Bassin du Congo",
        partners: "Partners to be announced",
        href: null,
        image: null,
      },
      {
        name: "Guyane",
        sub: "Northern South America",
        status: "upcoming",
        statusLabel: "Upcoming 2026",
        title: "Portail de la flore amazonienne",
        partners: "Partners to be announced",
        href: null,
        image: null,
      },
    ],
  },
  twoWays: {
    kicker: "TWO WAYS TO USE",
    heading: "A desktop app and a CLI, same engine.",
    gui: {
      label: "Niamoto Desktop",
      title: "For scientists and field teams.",
      body: "Drag-and-drop your data, configure collections visually, publish in one click. Available for macOS, Windows, and Linux.",
      cta: { label: "Download the app", href: "https://github.com/niamoto/niamoto/releases/latest" },
      meta: "v0.8 · macOS · Windows · Linux",
    },
    cli: {
      label: "Niamoto CLI",
      title: "For developers and automation.",
      body: "Python-first, plugin-based. Scriptable for reproducible pipelines and CI workflows.",
      snippet: "pip install niamoto\nniamoto init my-project\nniamoto run",
      cta: { label: "Read the docs", href: "/documentation" },
    },
  },
  principles: {
    kicker: "DESIGN PRINCIPLES",
    heading: "Calm, declarative, field-scientist.",
    lead:
      "A portal is interesting not because one deployment reached a figure, but because the publishing system stays legible when the project scales, changes region, or outlives its initial funding.",
    items: [
      { title: "Evidence over scoreboard", body: "Screens, taxon sheets, and method notes communicate more than a hero KPI ever will." },
      { title: "Method stays visible", body: "The publishing chain remains part of the narrative, so readers understand what produced the page they are consulting." },
      { title: "Same grammar, many territories", body: "Nouvelle-Calédonie is an example, not the whole story. The page frames it as one deployment among others." },
      { title: "Static as a feature", body: "A shareable ecological portal should remain deployable, archivable, and readable without platform dependence." },
    ],
  },
  closing: {
    eyebrow: "OPEN FRAMEWORK",
    title: "Built in the open, for the scientific community.",
    body:
      "GPL v3 licensed. Maintained by Arsis. Pull requests welcome — and a repeatable publishing grammar that turns ecological work into pages that can be read, cited, and maintained over time.",
    ctaPrimary: { label: "Star on GitHub", href: "https://github.com/niamoto/niamoto" },
    ctaSecondary: { label: "Read the changelog", href: "https://github.com/niamoto/niamoto/releases" },
    license: "GPL v3 · Maintained by Arsis",
  },
  funders: {
    heading: "Built with",
  },
} as const;
