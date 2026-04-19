// V4 Herbarium - English copy.

export default {
  meta: {
    title: "Niamoto - A living herbarium, open",
    description:
      "Niamoto is the open framework for ecological portals. A digital herbarium of the New Caledonian forest, built by the scientific community.",
  },
  hero: {
    eyebrow: "OPEN HERBARIUM - GPL V3",
    titleLine1: "A living",
    titleLine2: "herbarium,",
    titleLine3: "open.",
    sub: "Niamoto carries a decade of New Caledonian forest inventory into a portal that anyone can read, query, and rebuild.",
    cta: "Install Niamoto",
    ctaSecondary: "View specimens",
    specimenName: "Amborella trichopoda",
    specimenFamily: "AMBORELLACEAE - NC",
    specimenCollection: "NC-0847-AM-1923",
  },
  series: {
    heading: "Specimen series",
    intro: "Selected entries from the catalog. The full portal carries 1,208 tree taxa from the Grande Terre.",
    items: [
      { genus: "Parasitaxus", species: "usta", family: "Podocarpaceae", note: "World's only known parasitic conifer.", collection: "NC-1123-PU" },
      { genus: "Zygogynum", species: "mackeei", family: "Winteraceae", note: "Aromatic shrub, vesselless wood.", collection: "NC-2018-ZM" },
      { genus: "Cryptocarya", species: "barrabea", family: "Lauraceae", note: "Endemic, found above 800 m on ultramafic soils.", collection: "NC-3041-CB" },
      { genus: "Stenocarpus", species: "trinervis", family: "Proteaceae", note: "Pollinated by honeybirds; fruits sought by pigeons.", collection: "NC-4002-ST" },
    ],
  },
  scope: {
    heading: "What the herbarium holds",
    items: [
      { kicker: "TAXA", value: "1,208", body: "tree taxa indexed in the Nouvelle-Caledonie portal" },
      { kicker: "ENDEMIC", value: "75.3%", body: "of the vascular flora is endemic to the Grande Terre" },
      { kicker: "FOREST", value: "5,400 km²", body: "of forest mapped, divided into 509 inventory plots" },
    ],
  },
  closing: {
    title: "An open framework for the forests we inherit.",
    body: "GPL v3. Maintained by Arsis. Pull requests welcome from ecologists, foresters and developers alike.",
    ctaPrimary: "Star on GitHub",
    ctaSecondary: "Read the docs",
  },
  funders: { heading: "Built with the scientific community" },
} as const;
