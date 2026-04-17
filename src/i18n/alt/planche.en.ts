export default {
  meta: {
    title: "Niamoto · Planche — Specimens of open ecology",
    description:
      "A single horizontal plate, 2400 pixels wide. Nine Niamoto plugins as botanical specimens. Print to A3, pin on the wall.",
  },
  header: {
    eyebrow: "CATALOGUE OPEN ECOLOGY",
    titleMain: "Niamoto",
    titleItalic: "Specimens for an open data herbarium.",
    plateNumber: "VIII",
    metaLine1: "Drawn",
    metaLine2: "for the Niamoto collective.",
    metaInstitutions: "IRD · CIRAD · AMAP · ANPN",
  },
  specimens: [
    { slug: "transform", label: "niamoto.transform",  hint: "PIPELINE · PALM",     shape: "palm",     x: 120,  y: 40 },
    { slug: "export",    label: "niamoto.export",     hint: "OUTPUT · ALGA",       shape: "alga",     x: 360,  y: 120 },
    { slug: "cli",       label: "niamoto.cli",        hint: "COMMAND · FERN",      shape: "fern",     x: 200,  y: 280 },
    { slug: "taxonomy",  label: "niamoto.taxonomy",   hint: "TAXA · CANOPY",       shape: "canopy",   x: 520,  y: 260 },
    { slug: "plot",      label: "niamoto.plot",       hint: "FIELD · SAPLING",     shape: "sapling",  x: 700,  y: 40 },
    { slug: "tree",      label: "niamoto.tree",       hint: "MEASURE · BRANCH",    shape: "branch",   x: 860,  y: 180 },
    { slug: "viewer",    label: "niamoto.viewer",     hint: "PORTAL · LEAF",       shape: "leaf",     x: 1040, y: 60 },
    { slug: "theme",     label: "niamoto.theme",      hint: "STYLE · COMPOUND",    shape: "compound", x: 1200, y: 260 },
    { slug: "watch",     label: "niamoto.watch",      hint: "MONITOR · LICHEN",    shape: "lichen",   x: 960,  y: 340 },
  ],
  notes: {
    heading: "FIELD NOTES",
    items: [
      { num: "Nº 1",  body: "All specimens on this plate are Apache-2 licensed. None of them were grown in a silo." },
      { num: "Nº 2",  body: "Installation: pip install niamoto. Each specimen docks into the same runtime, which is not a SaaS." },
      { num: "Nº 3",  body: "This plate is generated from real data. Click any specimen to see its command invocation on GitHub." },
      { num: "Nº 4",  body: "Print this page (A3 landscape) and pin it to the wall of your forest research lab. Offline-ready." },
    ],
    footnote:
      "Plate Nº VIII · drawn by the Niamoto collective, 2026. Reproduction authorised under CC-BY-SA 4.0.",
  },
  printCta: "Print this page",
  pinTiltsDeg: [-2, 1.5, -1.2, 2, -0.8, 1, -1.4, 2.2, -1.8],
} as const;
