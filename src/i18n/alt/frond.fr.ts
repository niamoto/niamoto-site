// Frond — système de design Niamoto canonique appliqué en variante /alt/.
// Contenu : hybride page principale + portail-alt.

export default {
  meta: {
    title: "Niamoto · Frond — Des données de terrain aux portails publiables",
    description:
      "Le système de design Niamoto appliqué tel quel en variante de landing. Importer, structurer, publier des données écologiques sous forme de portails statiques durables.",
  },
  hero: {
    signage: "NIAMOTO · PUBLICATION ÉCOLOGIQUE LIBRE",
    eyebrow: "OPEN SOURCE · APACHE 2.0",
    titleLines: [
      "Des données de terrain, des portails ",
      { italic: true, text: "publiables" },
      ".",
    ],
    sub:
      "Niamoto transforme occurrences, inventaires taxonomiques et parcelles en portails statiques partageables. Open source, orienté plugins, conçu pour les écologues.",
    ctaPrimary: { label: "Installer Niamoto", href: "#download" },
    ctaSecondary: { label: "Voir un portail en ligne", href: "https://niamoto.github.io/niamoto-nouvelle-caledonie-2025/" },
    install: {
      label: "Terminal",
      snippet: "pip install niamoto",
      copyAria: "Copier la commande",
    },
    slides: [
      { src: "/showcase/app/dashboard.png",   alt: "Tableau de bord Niamoto — vue projet",        badge: "app",    label: "Tableau de bord" },
      { src: "/showcase/app/import.png",       alt: "Import des sources de données dans Niamoto",  badge: "app",    label: "Import"          },
      { src: "/showcase/app/widgets.png",      alt: "Catalogue de widgets pour les collections",   badge: "app",    label: "Widgets"         },
      { src: "/showcase/app/site-builder.png", alt: "Site builder — configuration des pages",      badge: "app",    label: "Site builder"    },
      { src: "/showcase/portail-alt/home-fr.png",           alt: "Page d'accueil du portail",      badge: "portal", label: "Portail"         },
      { src: "/showcase/portail-alt/preview-taxons-fr.png", alt: "Navigateur de taxons",           badge: "portal", label: "Taxons"          },
      { src: "/showcase/portail-alt/species-fr.png",        alt: "Fiche espèce",                   badge: "portal", label: "Espèce"          },
    ],
  },
  widgetBand: {
    eyebrow: "TAGLINE DU TOOLKIT",
    verbs: ["Importer.", "Structurer.", "Publier."],
    caption:
      "Une CLI, une GUI, une chaîne de publication — quatre étapes transforment des fichiers écologiques hétérogènes en pages web structurées.",
  },
  pillars: {
    kicker: "TROIS ÉTAPES DU PIPELINE",
    heading: "Le toolkit en trois verbes.",
    sub: "Chaque étape est un module. Chaque module est un plugin. Pas de boîte noire.",
    items: [
      {
        stage: "01 · DONNÉES",
        color: "steel",
        title: "Importer n'importe quelles données écologiques.",
        body:
          "CSV, GeoPackage, GeoJSON, raster. L'auto-configuration détecte les types de fichiers et mappe les champs. Compatible Darwin Core.",
        snippet: "sources:\n  occurrences:\n    type: csv\n    path: occurrences.csv",
      },
      {
        stage: "02 · TRANSFORMATIONS",
        color: "leaf",
        title: "Transformer avec des plugins.",
        body:
          "Des transformations YAML déclaratives changent les données brutes en index, statistiques, distributions et widgets. Étendez ce qui manque.",
        snippet: "transforms:\n  - plugin: taxonomy_tree\n  - plugin: plot_summary",
      },
      {
        stage: "03 · SITE",
        color: "forest",
        title: "Publier un portail statique.",
        body:
          "Site auto-généré avec cartes, graphiques et pages taxons. Déployez partout — GitHub Pages, Netlify, votre propre serveur.",
        snippet: "niamoto export\n# → exports/web/ prêt à servir",
      },
    ],
  },
  reading: {
    kicker: "LIRE UN PORTAIL",
    heading: "Trois surfaces, une seule grammaire de publication.",
    sub:
      "Le but n'est pas de mettre en scène les chiffres d'un déploiement. C'est de montrer comment une même logique éditoriale transforme la matière de terrain en pages consultables.",
    cards: [
      {
        label: "01 · ACCUEIL",
        meta: "SURFACE D'ENTRÉE",
        title: "Le portail s'ouvre par l'orientation, pas par le bruit.",
        body:
          "Cartes, ajouts récents et sections du portail sont présentés comme des repères de lecture. La page introduit à la fois un territoire et l'organisation des données.",
        image: "home" as const,
        notes: [
          { key: "Contexte", body: "Le territoire est nommé et situé avant que toute statistique ne prenne sens." },
          { key: "Accès", body: "La navigation donne une entrée directe vers taxons, parcelles, méthodes et mises à jour." },
          { key: "Tonalité", body: "L'interface se lit comme une publication, pas comme un tableau de bord." },
        ],
      },
      {
        label: "02 · INDEX",
        meta: "SURFACE DE PARCOURS",
        title: "Une liste devient une manière de lire le corpus.",
        body:
          "Les taxons ne sont pas seulement stockés. Ils sont exposés dans un index lisible, que l'on peut parcourir, filtrer et revisiter selon différents usages.",
        image: "index" as const,
        notes: [
          { key: "Corpus", body: "La liste donne l'échelle sans obliger la page à prouver sa valeur par un chiffre héroïque." },
          { key: "Filtres", body: "Le parcours reste attaché à des catégories écologiques, pas seulement à des champs techniques." },
          { key: "Continuité", body: "Depuis cet index, chaque fiche espèce conserve le même langage visuel et narratif." },
        ],
      },
      {
        label: "03 · FICHE",
        meta: "SURFACE DE RÉFÉRENCE",
        title: "La fiche espèce est l'endroit où carte, preuve et méthode se rencontrent.",
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
    heading: "De l'inventaire à la lecture publique.",
    sub:
      "Le portail n'est que la dernière couche visible. Ce qui compte, c'est la continuité entre la matière de terrain, les transformations structurées et les pages finales.",
    items: [
      { number: "01", title: "Collecter", body: "Occurrences, parcelles, taxonomies et fichiers territoriaux sont rassemblés dans leur état brut, avec toute l'irrégularité du terrain réel." },
      { number: "02", title: "Structurer", body: "Des pipelines YAML définissent la logique qui transforme les fichiers en index, résumés, widgets et contenus prêts à publier." },
      { number: "03", title: "Publier", body: "Le résultat est un portail statique : URLs claires, pages partageables, et aucune dépendance cachée à un backend hébergé." },
      { number: "04", title: "Consulter", body: "Chercheurs, institutions et équipes de terrain lisent la même matière dans des pages conçues pour durer." },
    ],
  },
  showcase: {
    kicker: "DÉPLOYÉ SUR PLUSIEURS ÉCOSYSTÈMES",
    heading: "Portails en ligne construits avec Niamoto.",
    sub: "La même grammaire, trois territoires, une seule sortie statique.",
    regions: [
      {
        name: "Nouvelle-Calédonie",
        sub: "Pacifique Sud",
        status: "active",
        statusLabel: "Actif",
        title: "Portail de la forêt",
        partners: "Province Nord, Province Sud, IRD, IAC",
        href: "https://niamoto.github.io/niamoto-nouvelle-caledonie-2025/",
        image: "/showcase/portail-alt/home-fr.png",
      },
      {
        name: "Gabon – Cameroun",
        sub: "Afrique centrale",
        status: "upcoming",
        statusLabel: "À venir 2026",
        title: "Portail des forêts du Bassin du Congo",
        partners: "Partenaires à annoncer",
        href: null,
        image: null,
      },
      {
        name: "Guyane",
        sub: "Amérique du Sud",
        status: "upcoming",
        statusLabel: "À venir 2026",
        title: "Portail de la flore amazonienne",
        partners: "Partenaires à annoncer",
        href: null,
        image: null,
      },
    ],
  },
  twoWays: {
    kicker: "DEUX FAÇONS DE L'UTILISER",
    heading: "Une app de bureau et une CLI, même moteur.",
    gui: {
      label: "Niamoto Desktop",
      title: "Pour les scientifiques et équipes de terrain.",
      body: "Glissez-déposez vos données, configurez les collections visuellement, publiez en un clic. Disponible sur macOS, Windows et Linux.",
      cta: { label: "Télécharger l'app", href: "https://github.com/niamoto/niamoto/releases/latest" },
      meta: "v0.8 · macOS · Windows · Linux",
    },
    cli: {
      label: "Niamoto CLI",
      title: "Pour les développeurs et l'automatisation.",
      body: "Python-first, orienté plugins. Scriptable pour des pipelines reproductibles et des workflows CI.",
      snippet: "pip install niamoto\nniamoto init mon-projet\nniamoto run --all",
      cta: { label: "Lire la documentation", href: "/fr/documentation" },
    },
  },
  principles: {
    kicker: "PRINCIPES DE DESIGN",
    heading: "Calme, déclaratif, écologue de terrain.",
    lead:
      "Un portail n'est pas intéressant parce qu'un déploiement atteint tel chiffre, mais parce que son système de publication reste lisible quand le projet change d'échelle, de territoire, ou survit à son financement initial.",
    items: [
      { title: "La preuve avant le score", body: "Écrans, fiches taxons et notes de méthode disent plus qu'un KPI placé en hero." },
      { title: "La méthode reste visible", body: "La chaîne éditoriale reste dans le récit, pour qu'on comprenne ce qui a produit la page consultée." },
      { title: "Même grammaire, plusieurs territoires", body: "La Nouvelle-Calédonie est un exemple, pas tout le récit. La page la cadre comme un déploiement parmi d'autres." },
      { title: "Le statique comme qualité", body: "Un portail écologique partageable doit rester déployable, archivable et lisible sans dépendance à une plateforme." },
    ],
  },
  closing: {
    eyebrow: "FRAMEWORK OUVERT",
    title: "Construit au grand jour, pour la communauté scientifique.",
    body:
      "Licence Apache 2.0. Maintenu par Arsis. Pull requests bienvenues — et une grammaire de publication reproductible qui transforme le travail écologique en pages lisibles, citables et maintenables dans le temps.",
    ctaPrimary: { label: "Étoiler sur GitHub", href: "https://github.com/niamoto/niamoto" },
    ctaSecondary: { label: "Lire le changelog", href: "https://github.com/niamoto/niamoto/releases" },
    license: "Apache 2.0 · Maintenu par Arsis",
  },
  funders: {
    heading: "Construit avec",
  },
} as const;
