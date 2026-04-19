export default {
  meta: {
    title: "Niamoto · Planche — Spécimens d'écologie ouverte",
    description:
      "Une planche horizontale de 2400 pixels. Neuf plugins Niamoto en spécimens botaniques. À imprimer en A3, à épingler au mur.",
  },
  header: {
    eyebrow: "CATALOGUE ÉCOLOGIE OUVERTE",
    titleMain: "Niamoto",
    titleItalic: "Spécimens pour un herbier de données ouvertes.",
    plateNumber: "VIII",
    metaLine1: "Dressée",
    metaLine2: "pour le collectif Niamoto.",
    metaInstitutions: "IRD · CIRAD · AMAP · ANPN",
  },
  specimens: [
    { slug: "transform", label: "niamoto.transform", hint: "PIPELINE · PALMIER",   shape: "palm",     x: 120,  y: 40 },
    { slug: "export",    label: "niamoto.export",    hint: "SORTIE · ALGUE",       shape: "alga",     x: 360,  y: 120 },
    { slug: "cli",       label: "niamoto.cli",       hint: "COMMANDE · FOUGÈRE",   shape: "fern",     x: 200,  y: 280 },
    { slug: "taxonomy",  label: "niamoto.taxonomy",  hint: "TAXA · CANOPÉE",       shape: "canopy",   x: 520,  y: 260 },
    { slug: "plot",      label: "niamoto.plot",      hint: "TERRAIN · POUSSE",     shape: "sapling",  x: 700,  y: 40 },
    { slug: "tree",      label: "niamoto.tree",      hint: "MESURE · RAMEAU",      shape: "branch",   x: 860,  y: 180 },
    { slug: "viewer",    label: "niamoto.viewer",    hint: "PORTAIL · FEUILLE",    shape: "leaf",     x: 1040, y: 60 },
    { slug: "theme",     label: "niamoto.theme",     hint: "STYLE · COMPOSÉE",     shape: "compound", x: 1200, y: 260 },
    { slug: "watch",     label: "niamoto.watch",     hint: "SURVEILLE · LICHEN",   shape: "lichen",   x: 960,  y: 340 },
  ],
  notes: {
    heading: "NOTES DE TERRAIN",
    items: [
      { num: "Nº 1",  body: "Tous les spécimens de cette planche sont sous licence GPL v3. Aucun n'a poussé dans un silo." },
      { num: "Nº 2",  body: "Installation : pip install niamoto. Chaque spécimen s'accroche au même runtime, qui n'est pas un SaaS." },
      { num: "Nº 3",  body: "Cette planche est générée à partir de données réelles. Cliquez sur un spécimen pour voir sa commande sur GitHub." },
      { num: "Nº 4",  body: "Imprimez cette page (A3 paysage) et épinglez-la au mur de votre laboratoire de terrain. Lisible hors-ligne." },
    ],
    footnote:
      "Planche Nº VIII · dressée par le collectif Niamoto, 2026. Reproduction autorisée sous licence CC-BY-SA 4.0.",
  },
  printCta: "Imprimer cette page",
  pinTiltsDeg: [-2, 1.5, -1.2, 2, -0.8, 1, -1.4, 2.2, -1.8],
} as const;
