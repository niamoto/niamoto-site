// Frond-live — variante éditoriale de Frond.
// Contenu long identique à frond.fr ; les slides app sont des composants
// éditoriaux (non des captures d'écran). Seul hero.slides diffère.

import frondBase from "./frond.fr";

const { slides: _oldSlides, ...heroBase } = frondBase.hero;

export default {
  ...frondBase,
  meta: {
    ...frondBase.meta,
    title: "Niamoto · Frond Live — Slides app éditoriales, même grammaire de publication",
  },
  hero: {
    ...heroBase,
    slides: {
      app: {
        dashboard: "Tableau de bord",
        import: "Import",
        widgets: "Widgets",
        publish: "Publier",
      },
      portal: [
        { src: "/showcase/portail-alt/home-fr.png",           alt: "Page d'accueil du portail", label: "Portail" },
        { src: "/showcase/portail-alt/preview-taxons-fr.png", alt: "Navigateur de taxons",      label: "Taxons"  },
        { src: "/showcase/portail-alt/species-fr.png",        alt: "Fiche espèce",              label: "Espèce"  },
      ],
    },
  },
} as const;
