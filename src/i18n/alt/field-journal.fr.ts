// V2 Field Journal - copie française.

export default {
  meta: {
    title: "Niamoto - Le carnet de l'écologue de terrain",
    description:
      "Niamoto : la plateforme ouverte issue d'une décennie d'observation sur le terrain en Nouvelle-Calédonie. Le carnet, partageable.",
  },
  hero: {
    intro: "En paici, naa moto signifie",
    titleLine1: "la forêt",
    titleLine2: "que l'on consigne.",
    sub: "Niamoto est le cadre ouvert né d'une décennie d'inventaires dans la forêt humide néo-calédonienne. Le carnet d'une communauté d'écologues, rendu partageable.",
    kickerLeft: "Espèces suivies",
    kickerLeftValue: "2 713",
    kickerRight: "Surface forestière",
    kickerRightValue: "5 400 km²",
  },
  plates: [
    {
      genus: "Amborella",
      species: "trichopoda",
      family: "Amborellaceae",
      collection: "NC-0847-AM",
      note: "Seule survivante de la plus ancienne lignée des plantes à fleurs. Endémique de la Grande Terre.",
      tone: "moss",
    },
    {
      genus: "Parasitaxus",
      species: "usta",
      family: "Podocarpaceae",
      collection: "NC-1123-PU",
      note: "Unique conifère parasite connu au monde. Vit sur les racines de Falcatifolium taxoides.",
      tone: "terra",
    },
    {
      genus: "Zygogynum",
      species: "mackeei",
      family: "Winteraceae",
      collection: "NC-2018-ZM",
      note: "Arbuste aromatique au bois primitif sans vaisseaux. Pollinisé par les méliphages.",
      tone: "ink",
    },
  ],
  fieldNotes: {
    heading: "Notes de terrain",
    items: [
      {
        date: "2023-08-14 - Forêt du Pic d'Aoupinié",
        body: "509 parcelles et plus. Chacune une unité permanente, revisitée annuellement. La carte n'est pas abstraite : chaque point a une coordonnée, une date et un nom.",
      },
      {
        date: "2024-02-09 - Mont Mou",
        body: "Reproductibilité avant performance. Le portail doit se construire à l'identique sur le laptop d'un chercheur comme sur le serveur de production. Chaque transformation est déclarative.",
      },
      {
        date: "2024-11-03 - Province Sud",
        body: "Niamoto génère un portail en 8 minutes à partir d'un jeu de données propre. Le premier portail a demandé huit mois de conception. Le framework porte désormais cet effort.",
      },
    ],
  },
  closing: {
    title: "Un cadre ouvert pour la connaissance écologique.",
    body: "Sous licence GPL v3. Dix ans de terrain. Une communauté grandissante d'écologues, forestiers et développeurs.",
    ctaPrimary: "Installer Niamoto",
    ctaSecondary: "Lire la doc",
  },
  funders: {
    heading: "Construit avec la communauté scientifique",
  },
} as const;
