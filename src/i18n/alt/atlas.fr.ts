// V1 Atlas - copie française.

export default {
  meta: {
    title: "Niamoto - Atlas écologique ouvert, depuis 2012",
    description:
      "Niamoto est un outil libre pour publier des portails écologiques reproductibles. Des données de terrain à un atlas partagé de taxons, parcelles et forêts.",
  },
  hero: {
    eyebrow: "ÉCOLOGIE OUVERTE - DEPUIS 2012",
    title: ["Des données de terrain", "au portail", "partagé."],
    titleItalicWord: "partagé",
    sub: "Un outil libre pour publier des portails écologiques reproductibles. Construit avec la communauté scientifique de Nouvelle-Calédonie.",
    cta: "Installer",
    ctaSecondary: "Voir les portails",
  },
  regions: {
    heading: "Déployé sur trois écosystèmes",
    intro: "Trois portails, trois forêts, trois continents.",
    items: [
      {
        number: "01",
        name: "Nouvelle-Calédonie",
        sub: "Pacifique Sud - Actif depuis 2024",
        body: "1 208 taxons d'arbres, 509 parcelles inventoriées, 70 000+ arbres mesurés sur 5 400 km² de forêt cartographiée.",
        partners: "Province Nord, Province Sud, IRD, IAC, AMAP, OFB, Endemia",
        status: "active",
        stat: { value: "1 208", label: "taxons d'arbres" },
      },
      {
        number: "02",
        name: "Gabon - Cameroun",
        sub: "Afrique centrale - À venir 2026",
        body: "Inventaires des forêts tropicales du bassin du Congo. Deux pays, un portail commun.",
        partners: "Partenaires à annoncer",
        status: "upcoming",
        stat: { value: "à venir", label: "Bassin du Congo" },
      },
      {
        number: "03",
        name: "Guyane",
        sub: "Amérique du Sud - À venir 2026",
        body: "Catalogue de la flore amazonienne, centré sur les peuplements forestiers guyanais.",
        partners: "Partenaires à annoncer",
        status: "upcoming",
        stat: { value: "à venir", label: "flore amazonienne" },
      },
    ],
  },
  pillars: {
    heading: "Comment fonctionne Niamoto",
    items: [
      {
        kicker: "01",
        title: "Importer toute donnée écologique",
        body: "CSV, GeoPackage, GeoJSON, raster. L'auto-configuration détecte les types de fichiers et mappe les champs.",
        snippet: "sources:\n  occurrences:\n    type: csv\n    path: occurrences.csv",
      },
      {
        kicker: "02",
        title: "Transformer via des plugins",
        body: "Des transformations YAML déclaratives convertissent les données brutes en statistiques, distributions et widgets. Extensible par plugin.",
        snippet: null,
      },
      {
        kicker: "03",
        title: "Publier un portail statique",
        body: "Site auto-généré avec cartes, graphiques, fiches taxons. Déployable partout - GitHub Pages, Netlify, votre propre serveur.",
        snippet: null,
      },
    ],
  },
  closing: {
    eyebrow: "OPEN SOURCE",
    title: "Développé dans l'ouvert, pour la communauté scientifique",
    body: "Sous licence GPL v3. Maintenu par Arsis. Pull requests bienvenues.",
    ctaPrimary: "Étoile sur GitHub",
    ctaSecondary: "Lire la doc",
    discussions: "Rejoindre les discussions",
    changelog: "Voir le changelog",
  },
  funders: {
    heading: "Construit avec",
  },
} as const;
