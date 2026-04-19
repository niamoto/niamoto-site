// V2 Field Journal - English copy.

export default {
  meta: {
    title: "Niamoto - A field ecologist's notebook",
    description:
      "Niamoto: an open data platform built from a decade of field observation in New Caledonia. Notes from the canopy, made shareable.",
  },
  hero: {
    intro: "In paici, naa moto means",
    titleLine1: "the forest",
    titleLine2: "we record.",
    sub: "Niamoto is the open framework born from a decade of inventories in the New Caledonian rainforest. The notebook of a community of ecologists, made shareable.",
    kickerLeft: "Tracked species",
    kickerLeftValue: "2,713",
    kickerRight: "Forest area",
    kickerRightValue: "5,400 km²",
  },
  plates: [
    {
      genus: "Amborella",
      species: "trichopoda",
      family: "Amborellaceae",
      collection: "NC-0847-AM",
      note: "Sole surviving member of the most ancient lineage of flowering plants. Endemic to Grande Terre.",
      tone: "moss",
    },
    {
      genus: "Parasitaxus",
      species: "usta",
      family: "Podocarpaceae",
      collection: "NC-1123-PU",
      note: "The world's only known parasitic conifer. Lives on the roots of Falcatifolium taxoides.",
      tone: "terra",
    },
    {
      genus: "Zygogynum",
      species: "mackeei",
      family: "Winteraceae",
      collection: "NC-2018-ZM",
      note: "Aromatic shrub with primitive vesselless wood. Essential to honeybird pollination.",
      tone: "ink",
    },
  ],
  fieldNotes: {
    heading: "Notes from the field",
    items: [
      {
        date: "2023-08-14 - Foret de Pic d'Aoupinie",
        body: "509 plots and counting. Each one a permanent unit, revisited annually. The map is not abstract; every dot has a coordinate, a date, and a name.",
      },
      {
        date: "2024-02-09 - Mont Mou",
        body: "Reproductibilite over performance. The portal must build identically on a researcher's laptop and on the production server. Every transformation is declarative.",
      },
      {
        date: "2024-11-03 - Province Sud",
        body: "Niamoto generates a portal in 8 minutes from a clean dataset. The first portal took eight months to design. The framework now carries that effort forward.",
      },
    ],
  },
  closing: {
    title: "An open framework for ecological knowledge.",
    body: "GPL v3 licensed. Ten years of fieldwork. A growing community of ecologists, foresters and developers.",
    ctaPrimary: "Install Niamoto",
    ctaSecondary: "Read the docs",
  },
  funders: {
    heading: "Built with the scientific community",
  },
} as const;
