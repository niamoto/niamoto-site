// V5 Observatoire - copie francaise.

export default {
  meta: {
    title: "Niamoto - L'observatoire ecologique ouvert",
    description:
      "Niamoto est le framework ouvert qui transforme le travail de terrain ecologique en observatoires vivants et partageables. Chrome scientifique, pour la science.",
  },
  hero: {
    eyebrow: "ECOLOGIE OUVERTE - ACTIF DEPUIS 2012",
    titleLines: ["Un observatoire", "ecologique", "ouvert."],
    sub: "Du placette au portail. Niamoto transforme inventaires, occurrences et forets en un atlas reproductible que chacun peut lire, citer et prolonger.",
    cta: "Installer",
    ctaSecondary: "Voir les portails",
  },
  telemetry: {
    heading: "En direct de la foret",
    sub: "Un apercu de ce que suit le deploiement Nouvelle-Caledonie en ce moment.",
    pulse: {
      kicker: "PULSE LIVE",
      lines: [
        { dot: true, label: "Amborella trichopoda",   sub: "taxon consulte / NC", time: "a l'instant" },
        { dot: true, label: "Placette NC-0421 ingeree", sub: "Province Nord",     time: "il y a 2 min" },
        { dot: false, label: "Fiche taxon reconstruite", sub: "Parasitaxus",       time: "il y a 14 min" },
        { dot: false, label: "Site statique deploye",   sub: "build #2413",       time: "il y a 1 h" },
        { dot: false, label: "Sync Endemia",            sub: "3 nouvelles especes", time: "il y a 6 h" },
      ],
    },
    stats: {
      kicker: "DEPLOIEMENT / NC",
      items: [
        { value: 1208,  label: "taxons d'arbres",     suffix: "" },
        { value: 5400,  label: "km² de foret",        suffix: "" },
        { value: 509,   label: "placettes",           suffix: "" },
        { value: 70000, label: "arbres mesures",      suffix: "+" },
      ],
    },
    map: {
      kicker: "EMPRISE",
      line1: "Pacifique Sud",
      line2: "Nouvelle-Caledonie",
      secondary: "Gabon - Cameroun, Guyane a venir 2026",
    },
    terminal: {
      kicker: "INSTALLER",
      lines: [
        "pip install niamoto",
        "niamoto init observatoire",
        "niamoto run --all",
        "niamoto deploy",
      ],
    },
  },
  pillars: {
    heading: "Comment l'observatoire se construit",
    items: [
      {
        kicker: "01 / INGERER",
        title: "N'importe quelle source tabulaire ou geospatiale",
        body: "CSV, GeoPackage, GeoJSON, raster, PostGIS. Detection automatique des types et mapping de champs. Pas besoin d'equipe ETL.",
      },
      {
        kicker: "02 / TRANSFORMER",
        title: "Pipelines YAML declaratifs",
        body: "Composer statistiques, distributions et widgets avec un systeme de plugins type. Etendre en quelques lignes Python.",
      },
      {
        kicker: "03 / PUBLIER",
        title: "Portail statique, deployable partout",
        body: "Cartes, graphiques, fiches taxon et placettes auto-generes. GitHub Pages, Netlify, votre serveur. Aucun runtime.",
      },
    ],
  },
  closing: {
    eyebrow: "OPEN SOURCE",
    title: "Construit a l'air libre, pour la communaute scientifique.",
    body: "GPL v3. Maintenu par Arsis. Pull requests, contributions de plugins et retours de terrain bienvenus.",
    ctaPrimary: "Etoiler sur GitHub",
    ctaSecondary: "Lire la doc",
  },
  funders: { heading: "Construit avec" },
} as const;
