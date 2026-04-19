// V7 Strate - copie francaise. Longform editorial.

export default {
  meta: {
    title: "Niamoto - Une lecture par strates, en donnees ecologiques ouvertes",
    description:
      "Une lecture au long cours de Niamoto : le framework ecologique ouvert qui transforme les inventaires forestiers en portails reproductibles et partageables.",
  },
  hero: {
    eyebrow: "LECTURE LONGUE - AVRIL 2026",
    titleLines: [
      "Un atlas",
      { italic: true, text: "ecologique," },
      "une strate",
      "apres l'autre.",
    ],
    sub: "Niamoto est le framework ouvert que nous construisons depuis 2012 pour rendre les donnees ecologiques publiables. Pas comme un slide deck, pas comme une annexe de these. Comme un portail vivant que chacun peut lire, citer et prolonger.",
    cta: "Installer",
    ctaSecondary: "Lire l'article complet",
    byline: "Par l'equipe Niamoto - 12 min de lecture",
  },
  chapters: [
    {
      num: "01",
      label: "Strate au sol",
      title: "Pourquoi un autre framework",
      body: "Chaque inventaire forestier meurt deux fois. D'abord le jour ou le terrain se termine. Puis a nouveau quand la these qui l'a analyse est soutenue. La donnee finit sur un disque, dans un tableur, dans une annexe PDF que personne n'ouvre.",
      pull: "Le travail de terrain merite mieux qu'une annexe PDF.",
    },
    {
      num: "02",
      label: "Sous-bois",
      title: "La forme du probleme",
      body: "Le terrain n'a pas besoin d'un nieme dashboard JavaScript. Il a besoin d'un pipeline reproductible : inventaire brut a l'entree, portail partageable en sortie. A plugins, pour que chaque discipline ajoute son widget. Statique, pour survivre a la these et a la facture cloud.",
      stat: { value: 1208, label: "taxons d'arbres dans le portail NC actuel" },
    },
    {
      num: "03",
      label: "Canopee",
      title: "Un vrai deploiement",
      body: "Le deploiement Nouvelle-Caledonie est en ligne depuis 2024. Huit institutions, 509 placettes inventoriees, 70 000+ arbres mesures, 5 400 km² de foret cartographiee. Chaque page -- accueil, index taxons, fiche d'espece -- est generee depuis une unique configuration YAML.",
      figureCaption: {
        intro: "Figure 01.",
        body: "Une des 1 208 fiches taxon generees automatiquement. La page agrege occurrences, distribution de surface terriere, representation par placettes et statut endemique.",
      },
    },
    {
      num: "04",
      label: "Strate emergente",
      title: "Ce qui arrive ensuite",
      body: "Deux portails se mettent en place pour 2026 : le deploiement Gabon - Cameroun de l'inventaire du bassin du Congo, et un portail Guyane pour les communautes d'arbres moins documentees du nord de l'Amerique du Sud. Un quatrieme deploiement est a l'etude.",
    },
    {
      num: "05",
      label: "Sous-etage",
      title: "Comment commencer",
      body: "pip install niamoto, niamoto init, niamoto run. La doc vous guide sur un vrai inventaire -- ingestion, transformation, publication -- en une vingtaine de minutes.",
      snippet: "$ pip install niamoto\n$ niamoto init mon-portail\n$ niamoto run --all",
    },
    {
      num: "06",
      label: "Sol",
      title: "Construit a l'air libre",
      body: "GPL v3. Plugins bienvenus. Niamoto est maintenu par Arsis avec la communaute scientifique de Nouvelle-Caledonie. Pull requests et retours de terrain font avancer le projet.",
    },
  ],
  closing: {
    title: "Lisez l'open source. Citez la donnee.",
    body: "Le projet est sur GitHub, la doc a niamoto.org/documentation, et le portail NC est une reference publique ouverte.",
    ctaPrimary: "Etoiler sur GitHub",
    ctaSecondary: "Lire la doc",
  },
  funders: { heading: "Construit avec" },
} as const;
