// V4 Herbarium - copie française.

export default {
  meta: {
    title: "Niamoto - Un herbier vivant, ouvert",
    description:
      "Niamoto est l'outil libre pour les portails écologiques. Un herbier numérique de la forêt néo-calédonienne, construit par la communauté scientifique.",
  },
  hero: {
    eyebrow: "HERBIER OUVERT - GPL V3",
    titleLine1: "Un herbier",
    titleLine2: "vivant,",
    titleLine3: "ouvert.",
    sub: "Niamoto porte une décennie d'inventaire de la forêt néo-calédonienne dans un portail que chacun peut consulter, interroger, et reconstruire.",
    cta: "Installer Niamoto",
    ctaSecondary: "Voir les spécimens",
    specimenName: "Amborella trichopoda",
    specimenFamily: "AMBORELLACEAE - NC",
    specimenCollection: "NC-0847-AM-1923",
  },
  series: {
    heading: "Série de spécimens",
    intro: "Quelques entrées du catalogue. Le portail complet contient 1 208 taxons d'arbres de la Grande Terre.",
    items: [
      { genus: "Parasitaxus", species: "usta", family: "Podocarpaceae", note: "Unique conifère parasite connu au monde.", collection: "NC-1123-PU" },
      { genus: "Zygogynum", species: "mackeei", family: "Winteraceae", note: "Arbuste aromatique, bois sans vaisseaux.", collection: "NC-2018-ZM" },
      { genus: "Cryptocarya", species: "barrabea", family: "Lauraceae", note: "Endémique, présent au-dessus de 800 m sur sols ultramafiques.", collection: "NC-3041-CB" },
      { genus: "Stenocarpus", species: "trinervis", family: "Proteaceae", note: "Pollinisé par les méliphages ; fruits recherchés par les pigeons.", collection: "NC-4002-ST" },
    ],
  },
  scope: {
    heading: "Ce que contient l'herbier",
    items: [
      { kicker: "TAXONS", value: "1 208", body: "taxons d'arbres indexés dans le portail Nouvelle-Calédonie" },
      { kicker: "ENDÉMIQUE", value: "75,3%", body: "de la flore vasculaire est endémique de la Grande Terre" },
      { kicker: "FORÊT", value: "5 400 km²", body: "de forêt cartographiée, répartie en 509 parcelles d'inventaire" },
    ],
  },
  closing: {
    title: "Un cadre ouvert pour les forêts dont nous héritons.",
    body: "GPL v3. Maintenu par Arsis. Pull requests bienvenues, écologues, forestiers et développeurs ensemble.",
    ctaPrimary: "Étoile sur GitHub",
    ctaSecondary: "Lire la doc",
  },
  funders: { heading: "Construit avec la communauté scientifique" },
} as const;
