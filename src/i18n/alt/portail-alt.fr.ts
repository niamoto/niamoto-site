export default {
  meta: {
    title: "Niamoto · Portail Alt — Un portail qui se lit",
    description:
      "Une variante plus éditoriale du récit portail Niamoto : moins de KPI, plus de preuves. Écrans, méthode, fiches taxons et chaîne de publication.",
  },
  hero: {
    eyebrow: "ÉCOLOGIE PUBLIÉE",
    titleLines: [
      "Vos donnees terrain,",
      { italic: true, text: "un portail partage." },
    ],
    sub:
      "Cette variante traite le portail comme un objet éditorial écologique : cartes, fiches taxons, notes de méthode et pages durables agencées pour que le déploiement reste compréhensible longtemps après la mission de terrain.",
    ctaPrimary: { label: "Ouvrir le portail NC", href: "https://niamoto.github.io/niamoto-nouvelle-caledonie-2025/" },
    ctaSecondary: { label: "Voir comment il se lit", href: "#reading" },
    proof: [
      "Sortie statique, déployable partout.",
      "La méthodologie reste visible à côté des résultats.",
      "Une même logique de publication pour plusieurs territoires.",
    ],
    frames: {
      primaryCaption: "Ici, la page d’accueil n’est pas un teaser. C’est l’entrée dans une publication écologique vivante.",
      indexCaption: "La liste des taxons se lit comme un index, pas comme un tableau décontextualisé.",
      sheetCaption: "Une fiche espèce rassemble carte, distribution et repères de lecture dans une page consultable.",
    },
  },
  reading: {
    kicker: "LIRE UN PORTAIL",
    heading: "Trois surfaces, une seule grammaire de publication.",
    sub:
      "Le but n’est pas de mettre en scène les chiffres d’un déploiement. Le but est de montrer comment une même logique éditoriale transforme la matière de terrain en pages réellement consultables.",
    cards: [
      {
        label: "01 · ACCUEIL",
        meta: "SURFACE D’ENTRÉE",
        title: "Le portail s’ouvre par l’orientation, pas par le bruit.",
        body:
          "Cartes, ajouts récents et sections du portail sont présentés comme des repères de lecture. La page introduit à la fois un territoire et l’organisation des données.",
        image: "home" as const,
        notes: [
          { key: "Contexte", body: "Le territoire est nommé et situé avant que toute statistique ne prenne sens." },
          { key: "Accès", body: "La navigation donne une entrée directe vers taxons, parcelles, méthodes et mises à jour." },
          { key: "Tonalité", body: "L’interface se lit comme une publication, pas comme un tableau de bord." },
        ],
      },
      {
        label: "02 · INDEX",
        meta: "SURFACE DE PARCOURS",
        title: "Une liste devient une manière de lire le corpus.",
        body:
          "Les taxons ne sont pas seulement stockés. Ils sont exposés dans un index lisible, que l’on peut parcourir, filtrer et revisiter selon différents usages.",
        image: "index" as const,
        notes: [
          { key: "Corpus", body: "La liste donne l’échelle sans obliger la page à prouver sa valeur par un chiffre héroïque." },
          { key: "Filtres", body: "Le parcours reste attaché à des catégories écologiques, pas seulement à des champs techniques." },
          { key: "Continuité", body: "Depuis cet index, chaque fiche espèce conserve le même langage visuel et narratif." },
        ],
      },
      {
        label: "03 · FICHE",
        meta: "SURFACE DE RÉFÉRENCE",
        title: "La fiche espèce est l’endroit où carte, preuve et méthode se rencontrent.",
        body:
          "La fiche espèce est la preuve la plus forte du résultat : une page unique qui assemble occurrences, contexte territorial et repères de lecture dans un format durable.",
        image: "sheet" as const,
        notes: [
          { key: "Carte", body: "Les occurrences deviennent une forme territoriale visible, pas un attribut caché." },
          { key: "Méthode", body: "Graphiques et résumés restent liés à la manière dont les données ont été structurées." },
          { key: "Durabilité", body: "La page peut être citée, partagée, archivée ou lue hors ligne comme un document statique." },
        ],
      },
    ],
  },
  sequence: {
    kicker: "CHAÎNE DE PUBLICATION",
    heading: "De l’inventaire à la lecture publique.",
    sub:
      "Le portail n’est que la dernière couche visible. Ce qui compte, c’est la continuité entre la matière de terrain, les transformations structurées et les pages finales.",
    items: [
      {
        number: "01",
        title: "Collecter",
        body: "Occurrences, parcelles, taxonomies et fichiers territoriaux sont rassemblés dans leur état brut, avec toute l’irrégularité du terrain réel.",
      },
      {
        number: "02",
        title: "Structurer",
        body: "Des pipelines YAML définissent la logique qui transforme les fichiers en index, résumés, widgets et contenus prêts à publier.",
      },
      {
        number: "03",
        title: "Publier",
        body: "Le résultat est un portail statique : URLs claires, pages partageables, et aucune dépendance cachée à un backend hébergé.",
      },
      {
        number: "04",
        title: "Consulter",
        body: "Chercheurs, institutions et équipes de terrain lisent la même matière dans des pages conçues pour durer.",
      },
    ],
  },
  principles: {
    kicker: "POURQUOI CETTE VARIANTE",
    heading: "Moins dashboard, plus publication.",
    lead:
      "Un portail n’est pas intéressant parce qu’un déploiement atteint tel ou tel chiffre. Il l’est parce que le système de publication reste lisible quand le projet change d’échelle, de territoire, ou survit à son financement initial.",
    items: [
      {
        title: "La preuve avant le score",
        body: "Écrans, fiches taxons et notes de méthode disent plus qu’un KPI placé en hero.",
      },
      {
        title: "La méthode reste visible",
        body: "La chaîne éditoriale reste dans le récit, pour qu’on comprenne ce qui a produit la page consultée.",
      },
      {
        title: "Même grammaire, plusieurs territoires",
        body: "La Nouvelle-Calédonie est un exemple, pas tout le récit. La page la cadre comme un déploiement parmi d’autres.",
      },
      {
        title: "Le statique comme qualité",
        body: "Un portail écologique partageable doit rester déployable, archivable et lisible sans dépendance à une plateforme.",
      },
    ],
  },
  closing: {
    eyebrow: "FRAMEWORK OUVERT",
    title: "Le portail est la couche de publication du toolkit.",
    body:
      "Ce qui compte n’est pas un déploiement vitrine. Ce qui compte est une grammaire de publication reproductible, capable de transformer le travail écologique en pages lisibles, citables et maintenables dans le temps.",
    ctaPrimary: { label: "Star sur GitHub", href: "https://github.com/niamoto/niamoto" },
    ctaSecondary: { label: "Lire la documentation", href: "/fr/documentation" },
  },
  funders: {
    heading: "Construit avec",
  },
} as const;
