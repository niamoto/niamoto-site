// Shared French strings used across /alt/ variants.

export default {
  nav: {
    variantsIndex: "Variantes",
    documentation: "Doc",
    github: "GitHub",
    languageSwitchLabel: "Changer de langue",
  },
  install: {
    label: "Installer",
    snippet: "pip install niamoto",
    copyAria: "Copier la commande",
    copied: "Copie",
  },
  cta: {
    primary: "Installer Niamoto",
    secondary: "Voir les portails",
    docs: "Lire la doc",
    github: "Etoiler sur GitHub",
    explore: "Explorer",
  },
  legal: {
    license: "Apache 2.0",
    maintainer: "Maintenu par Arsis",
    builtWith: "Construit avec la communaute scientifique",
  },
  footer: {
    otherDirections: "Autres directions",
  },
  variantNames: {
    atlas: "Atlas",
    "field-journal": "Carnet de terrain",
    methode: "Methode",
    herbarium: "Herbier",
  },
  variantTaglines: {
    atlas: "Creme et sauge. Un atlas scientifique.",
    "field-journal": "Le carnet d'un ecologue de terrain.",
    methode: "Calme devtool, profondeur scientifique.",
    herbarium: "Gravite espresso. Un herbier vivant.",
  },
  stats: {
    taxa: "taxons d'arbres",
    forestArea: "de foret cartographiee",
    plots: "parcelles inventoriees",
    trees: "arbres mesures",
    endemics: "especes endemiques",
    portalsActive: "portails actifs",
    institutions: "institutions partenaires",
    sinceYear: "depuis 2012",
  },
  regions: {
    nc: {
      name: "Nouvelle-Caledonie",
      sub: "Pacifique Sud",
      partners: "Province Nord, Province Sud, IRD, IAC",
    },
    gabon: {
      name: "Gabon - Cameroun",
      sub: "Afrique centrale",
      partners: "Partenaires a annoncer",
    },
    guyane: {
      name: "Guyane",
      sub: "Amerique du Sud",
      partners: "Partenaires a annoncer",
    },
  },
} as const;
