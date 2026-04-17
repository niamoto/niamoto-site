// V8 Manifeste -- Copie française (accents français propres, sans marketing-speak)

export default {
  meta: {
    title: "Niamoto · Un manifeste — Données écologiques en libre lecture",
    description:
      "Un manifeste pour une écologie en libre lecture. Niamoto transforme les inventaires de terrain en portails publics, de la Nouvelle-Calédonie au Gabon.",
  },
  hero: {
    epigraphText:
      "Nous signataires — forestiers, botanistes, codeurs, gestionnaires — proposons que les données écologiques appartiennent au domaine public, lisibles par tous, construites par beaucoup.",
    epigraphAttribution: "Rédigé en 2026 · Nouméa, Libreville, Cayenne",
    titleLines: [
      "Un manifeste",
      "pour une",
      "écologie en",
    ],
    titleEmphasis: "libre lecture.",
    sub:
      "Niamoto est une boîte à outils qui transforme des inventaires de terrain en portails publics. Sans mur de connexion, sans paywall, sans verrou propriétaire. Trois forêts déjà couvertes. La vôtre ensuite.",
    ctaPrimary: { label: "Signer le manifeste", href: "https://github.com/niamoto/niamoto" },
    ctaSecondary: { label: "Lire la doc", href: "/fr/docs" },
  },
  citations: {
    heading: "Soutiens",
    items: [
      {
        text:
          "L'ouverture des données de biodiversité est la seule voie à l'échelle. L'alternative, c'est chaque région qui réinvente un silo qui survit trois ans à son financement.",
        who: "Directrice",
        role: "Herbier IRD · Nouméa",
      },
      {
        text:
          "Il nous fallait un portail qui survit au projet qui l'a commandé. Les générateurs Niamoto sont versionnés. C'est ça qui fait basculer.",
        who: "Responsable de programme",
        role: "CIRAD · Montpellier",
      },
      {
        text:
          "Le modèle plugins est la bonne abstraction. Il permet aux écologues de maîtriser leur pipeline sans avoir à maintenir un monorepo.",
        who: "Data scientist",
        role: "UMR AMAP · Montpellier",
      },
      {
        text:
          "Nous avons évalué quatre piles avant de choisir Niamoto pour le projet canopée au Gabon. C'est celle qui ne cherchait à rien nous vendre.",
        who: "Ingénieur forestier",
        role: "ANPN · Libreville",
      },
    ],
  },
  pillars: {
    eyebrow: "LES TROIS ENGAGEMENTS",
    items: [
      {
        numeral: "I",
        title: "Ouvert par défaut",
        body:
          "Chaque portail Niamoto se publie en HTML statique. Aucun mur de connexion. Aucun verrou d'API. Si ce n'est pas public par défaut, ce n'est pas un portail — c'est un tableau de bord.",
      },
      {
        numeral: "II",
        title: "Possédé par les scientifiques",
        body:
          "Transformations, exports, taxonomies, plugins — tout est versionné à côté des données. Les gens qui ont relevé les notes de terrain gardent les clés.",
      },
      {
        numeral: "III",
        title: "Survit à la subvention",
        body:
          "Licence Apache 2. Aucune offre SaaS. Le portail continue de servir bien après la fenêtre de financement. C'est le test de durabilité.",
      },
    ],
  },
  pulse: {
    body: "Cette semaine : 13 parcelles ajoutées, 2 nouveaux taxons décrits, 1 plugin fusionné.",
    meta: "EN DIRECT · SEMAINE 16 · 2026",
  },
  closing: {
    lines: [
      "Téléchargez la boîte à outils.",
      "Lisez le manuel.",
      "Publiez votre portail.",
    ],
    ctaPrimary: { label: "Installer Niamoto", href: "https://github.com/niamoto/niamoto" },
    ctaSecondary: { label: "Voir les portails", href: "/fr/showcase/nouvelle-caledonie" },
  },
} as const;
