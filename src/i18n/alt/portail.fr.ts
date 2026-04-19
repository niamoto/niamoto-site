// V6 Portail - copie francaise.

export default {
  meta: {
    title: "Niamoto - Des donnees de terrain a un portail partage",
    description:
      "Niamoto transforme vos donnees de terrain en un portail web reproductible. Voyez le deploiement Nouvelle-Caledonie, de la page d'accueil a la fiche d'une espece.",
  },
  hero: {
    eyebrow: "DU TERRAIN AU PORTAIL",
    titleLines: [
      "Vos donnees terrain,",
      { italic: true, text: "un portail partage." },
    ],
    sub: "Niamoto est un framework ouvert qui transforme inventaires et occurrences en portail ecologique statique et reproductible. Configure en YAML, deploye ou vous voulez.",
    cta: "Installer",
    ctaSecondary: "Explorer le portail NC",
  },
  rail: {
    kicker: "EXEMPLE EN LIGNE",
    heading: "Trois pages du portail Nouvelle-Caledonie",
    sub: "La home. Un index de 1 208 taxons. Une fiche d'espece. Toutes issues du meme pipeline YAML.",
    cards: [
      {
        code: "01 / HOME",
        name: "nouvelle-caledonie",
        role: "Accueil",
        body: "Vue d'ensemble du deploiement de 5 400 km² : cartes, statistiques d'endemisme, derniers ajouts.",
        image: "/showcase/nc-home.png",
        alt: "Page d'accueil du portail Niamoto Nouvelle-Caledonie",
        href: "https://niamoto.github.io/niamoto-nouvelle-caledonie-2025/",
      },
      {
        code: "02 / INDEX",
        name: "/taxons",
        role: "1 208 taxons",
        body: "Liste filtrable de tous les taxons d'arbres du deploiement. Tri par famille, rang, endemisme.",
        image: "/showcase/nc-taxons.png",
        alt: "Index des taxons listant 1208 arbres",
        href: "https://niamoto.github.io/niamoto-nouvelle-caledonie-2025/taxons/",
      },
      {
        code: "03 / FICHE",
        name: "Amborella trichopoda",
        role: "Un taxon",
        body: "Carte d'occurrences, repartition en placettes, surface terriere, statut endemique. Une page par espece.",
        image: null,
        alt: "Fiche espece pour Amborella trichopoda",
        href: "https://niamoto.github.io/niamoto-nouvelle-caledonie-2025/taxons/",
      },
    ],
  },
  process: {
    kicker: "COMMENT",
    heading: "Trois etapes. Zero magie.",
    items: [
      {
        number: "01",
        title: "Ingerer",
        body: "CSV, GeoPackage, raster. Detection automatique des types, mapping de champs par convention.",
      },
      {
        number: "02",
        title: "Transformer",
        body: "Des pipelines YAML declaratifs transforment la donnee brute en statistiques, distributions, widgets.",
      },
      {
        number: "03",
        title: "Publier",
        body: "Un portail statique. Deploye sur GitHub Pages, Netlify ou votre serveur en quelques secondes.",
      },
    ],
  },
  closing: {
    eyebrow: "OPEN SOURCE",
    title: "Apache 2.0. Maintenu par Arsis.",
    body: "Pull requests et retours de terrain bienvenus. Le portail NC est une reference publique ouverte.",
    ctaPrimary: "Etoiler sur GitHub",
    ctaSecondary: "Lire la doc",
  },
  funders: { heading: "Construit avec" },
} as const;
