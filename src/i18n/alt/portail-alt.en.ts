export default {
  meta: {
    title: "Niamoto · Portail Alt — A portal you can read",
    description:
      "An editorial variant of the Niamoto portal story: less KPI, more proof. Screens, method, taxon sheets, and the publishing chain behind them.",
  },
  hero: {
    eyebrow: "PUBLISHED ECOLOGY",
    titleLines: [
      "Your field data,",
      { italic: true, text: "a shareable portal." },
    ],
    sub:
      "This variant treats the portal as a published ecological object: maps, taxon sheets, method notes, and durable pages arranged so the deployment remains understandable long after the field mission ends.",
    ctaPrimary: { label: "Open the NC portal", href: "https://niamoto.github.io/niamoto-nouvelle-caledonie-2025/" },
    ctaSecondary: { label: "See how it reads", href: "#reading" },
    proof: [
      "Static output, deployable anywhere.",
      "Methodology visible beside the results.",
      "One publishing logic, many regional portals.",
    ],
    frames: {
      primaryCaption: "A landing page is not a teaser here. It is an entry point into a living ecological publication.",
      indexCaption: "A taxon list reads like an index, not a database table detached from context.",
      sheetCaption: "A species sheet gathers map, distribution, and method cues into one consultable page.",
    },
  },
  reading: {
    kicker: "READING A PORTAL",
    heading: "Three surfaces, one publishing grammar.",
    sub:
      "The aim is not to showcase one deployment's numbers. The aim is to show how the same publishing logic turns field material into pages people can actually consult.",
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
      {
        number: "01",
        title: "Collect",
        body: "Occurrences, plots, taxonomies, and territorial files are gathered in their raw form, with all the irregularities of real field work.",
      },
      {
        number: "02",
        title: "Structure",
        body: "YAML pipelines define the logic that turns files into indexes, summaries, widgets, and page-ready content.",
      },
      {
        number: "03",
        title: "Publish",
        body: "The result is a static portal: clear URLs, shareable pages, and no hidden runtime dependency on a hosted backend.",
      },
      {
        number: "04",
        title: "Consult",
        body: "Researchers, institutions, and field teams read the same material through pages designed for long-term consultation.",
      },
    ],
  },
  principles: {
    kicker: "WHY THIS VARIANT",
    heading: "Less dashboard, more publication.",
    lead:
      "A portal is not interesting because one deployment reached a certain figure. It is interesting because the publishing system stays legible when the project scales, changes region, or outlives its initial funding cycle.",
    items: [
      {
        title: "Evidence over scoreboard",
        body: "Screens, taxon sheets, and method notes communicate more than a hero KPI ever will.",
      },
      {
        title: "Method stays visible",
        body: "The publishing chain remains part of the narrative, so readers understand what produced the page they are consulting.",
      },
      {
        title: "Same grammar, many territories",
        body: "Nouvelle-Caledonie is an example, not the whole story. The page frames it as one deployment among others.",
      },
      {
        title: "Static as a feature",
        body: "A shareable ecological portal should remain deployable, archivable, and readable without platform dependence.",
      },
    ],
  },
  closing: {
    eyebrow: "OPEN FRAMEWORK",
    title: "The portal is the publication layer of the toolkit.",
    body:
      "What matters is not one showcase deployment. What matters is a repeatable publishing grammar that turns ecological work into pages that can be read, cited, and maintained over time.",
    ctaPrimary: { label: "Star on GitHub", href: "https://github.com/niamoto/niamoto" },
    ctaSecondary: { label: "Read the docs", href: "/documentation" },
  },
  funders: {
    heading: "Built with",
  },
} as const;
