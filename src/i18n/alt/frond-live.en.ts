// Frond-live — editorial variant of Frond.
// Same long-form content as frond.en; app slides are editorial mockup
// components (not screenshots). Only hero.slides differs.

import frondBase from "./frond.en";

const { slides: _oldSlides, ...heroBase } = frondBase.hero;

export default {
  ...frondBase,
  meta: {
    ...frondBase.meta,
    title: "Niamoto · Frond Live — Editorial app slides, same publishing grammar",
  },
  hero: {
    ...heroBase,
    slides: {
      app: {
        dashboard: "Dashboard",
        import: "Import",
        widgets: "Widgets",
        publish: "Publish",
      },
      portal: [
        { src: "/showcase/portail-alt/home-wide-en.png",    alt: "Published portal home page", label: "Portal" },
        { src: "/showcase/portail-alt/taxons-wide-en.png",  alt: "Taxons browser page",        label: "Taxons" },
        { src: "/showcase/portail-alt/species-wide-en.png", alt: "Taxon detail page",          label: "Taxon"  },
      ],
    },
  },
} as const;
