export default {
  meta: {
    title: "Niamoto · Canopée — Une forêt, de la canopée au sol",
    description:
      "Un scroll vertical à travers une forêt, de la canopée au sol, avec Niamoto comme lentille. Cinq strates, un outil, une licence ouverte.",
  },
  stage1: {
    title: "Une forêt,",
    titleEmphasis: "de la canopée au sol.",
    caption: "CANOPÉE · STRATE I",
  },
  stage2: {
    eyebrow: "SOUS-BOIS · STRATE II",
    plateaux: [
      {
        title: "Un outil, pas une plateforme.",
        body: "Niamoto s'installe sur votre laptop, tourne sur vos données, publie sur votre serveur. Pas de compte à créer. Pas de page d'inscription. Pas d'uptime à surveiller.",
      },
      {
        title: "Chaque portail, un site statique.",
        body: "Ce qui sort, c'est du HTML ordinaire. Il survit à la subvention qui a financé le projet. Il se lit sans JavaScript. Il passe trois migrations d'hébergement.",
      },
      {
        title: "Le pipeline vous appartient.",
        body: "Transformations, exports, taxonomies, plugins — tout est versionné dans votre dépôt. Le projet termine, le portail continue de servir.",
      },
    ],
  },
  stage3: {
    eyebrow: "STRATE ARBUSTIVE · STRATE III",
    heading: "Comptés, cartographiés, partagés.",
    body: "Trois forêts couvertes, plus d'une décennie de mesures. Les données ne vivent pas dans un silo — chaque parcelle, chaque arbre, chaque taxon, accessible hors-ligne.",
    legend: [
      { label: "Taxons indexés",      value: "1\u202F208"  },
      { label: "Parcelles couvertes", value: "509"          },
      { label: "Arbres mesurés",      value: "70\u202F412"  },
    ],
  },
  stage4: {
    eyebrow: "STRATE HERBACÉE · STRATE IV",
    heading: "Quarante-deux plugins, un seul runtime.",
    plugins: [
      { name: "niamoto.transform", body: "Déplace les colonnes entre les notes de terrain brutes et le schéma du portail." },
      { name: "niamoto.export",    body: "Sort du HTML, JSON, GeoJSON, shapefiles statiques — selon ce que le terrain demande." },
      { name: "niamoto.taxonomy",  body: "Réconcilie les noms entre les sources IRD, Kew, GBIF en une seule passe." },
      { name: "niamoto.plot",      body: "Construit les résumés par parcelle — biodiversité, surface terrière, histogrammes DBH." },
      { name: "niamoto.tree",      body: "Narratifs par arbre. Signaux de rareté. Badges d'endémisme." },
      { name: "niamoto.viewer",    body: "Carte statique + navigateur de taxons. Utilisable hors-ligne. Aucune clé API." },
      { name: "niamoto.theme",     body: "Change le système de design. Mêmes données, autre habillage." },
      { name: "niamoto.watch",     body: "Détecte les dérives de schéma entre campagnes de terrain." },
    ],
  },
  stage5: {
    quote: "Un outil. Une installation. Une licence. La forêt fait le reste.",
    terminal: "pip install niamoto",
    ctaPrimary: { label: "Cloner le dépôt", href: "https://github.com/niamoto/niamoto" },
  },
  progress: [
    "CANOPÉE",
    "SOUS-BOIS",
    "ARBUSTIVE",
    "HERBACÉE",
    "SOL",
  ],
} as const;
