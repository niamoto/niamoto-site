// V3 Methode - copie française.

export default {
  meta: {
    title: "Niamoto - Données écologiques, portails publiables",
    description:
      "Niamoto est l'outil libre qui transforme les données de terrain en portails web reproductibles. Pour scientifiques, forestiers et développeurs.",
  },
  hero: {
    eyebrow: "OUTIL ÉCOLOGIQUE OUVERT",
    title: ["Données écologiques.", "Portails publiables."],
    sub: "Un outil libre qui transforme inventaires, occurrences et parcelles en portail statique reproductible. Configuré en YAML. Construit en minutes.",
    cta: "Installer",
    ctaSecondary: "Voir la documentation",
  },
  bento: {
    terminal: {
      kicker: "INSTALLATION",
      lines: [
        "pip install niamoto",
        "niamoto init mon-portail",
        "niamoto run --all",
        "niamoto deploy --static",
      ],
    },
    stats: {
      kicker: "DÉPLOIEMENTS",
      items: [
        { value: 1208, label: "taxons d'arbres", suffix: "" },
        { value: 5400, label: "km² de forêt", suffix: "" },
        { value: 509, label: "parcelles inventoriées", suffix: "" },
        { value: 70000, label: "arbres mesurés", suffix: "+" },
      ],
    },
    portals: {
      kicker: "PORTAILS",
      items: [
        { code: "NC", name: "Nouvelle-Calédonie", status: "active" },
        { code: "GAB", name: "Gabon - Cameroun", status: "upcoming" },
        { code: "GUY", name: "Guyane", status: "upcoming" },
      ],
    },
  },
  pillars: {
    heading: "Trois étapes. Sans magie.",
    items: [
      {
        kicker: "01 - INGESTION",
        title: "Toute source tabulaire ou géospatiale",
        body: "CSV, GeoPackage, GeoJSON, raster, PostGIS. Auto-détection des types de fichiers et mapping des champs.",
      },
      {
        kicker: "02 - TRANSFORMATION",
        title: "Pipelines YAML déclaratifs",
        body: "Composer statistiques, distributions et widgets via un système de plugins typés. Étendre ce qui manque.",
      },
      {
        kicker: "03 - PUBLICATION",
        title: "Portail statique, déployable partout",
        body: "Cartes, graphiques, fiches taxons et parcelles auto-générés. GitHub Pages, Netlify, votre serveur.",
      },
    ],
  },
  closing: {
    title: "Open source. GPL v3.",
    body: "Maintenu par Arsis. Pull requests, contributions de plugins et retours de terrain bienvenus.",
    ctaPrimary: "Étoile sur GitHub",
    ctaSecondary: "Lire la doc",
  },
  funders: { heading: "Construit avec" },
} as const;
