// Shared English strings used across /alt/ variants.

export default {
  nav: {
    variantsIndex: "Variants",
    documentation: "Docs",
    github: "GitHub",
    languageSwitchLabel: "Switch language",
  },
  install: {
    label: "Install",
    snippet: "pip install niamoto",
    copyAria: "Copy install command",
    copied: "Copied",
  },
  cta: {
    primary: "Install Niamoto",
    secondary: "View portals",
    docs: "Read the docs",
    github: "Star on GitHub",
    explore: "Explore",
  },
  legal: {
    license: "Apache 2.0",
    maintainer: "Maintained by Arsis",
    builtWith: "Built with the scientific community",
  },
  footer: {
    otherDirections: "Other directions",
  },
  variantNames: {
    atlas: "Atlas",
    "field-journal": "Field Journal",
    methode: "Methode",
    herbarium: "Herbarium",
  },
  variantTaglines: {
    atlas: "Cream and sage. A scientific atlas read.",
    "field-journal": "A field ecologist's notebook.",
    methode: "Devtool calm, science depth.",
    herbarium: "Espresso gravity. A living herbarium.",
  },
  stats: {
    taxa: "tree taxa",
    forestArea: "of forest mapped",
    plots: "plots inventoried",
    trees: "trees measured",
    endemics: "endemic species",
    portalsActive: "active portals",
    institutions: "partner institutions",
    sinceYear: "since 2012",
  },
  regions: {
    nc: {
      name: "Nouvelle-Caledonie",
      sub: "South Pacific",
      partners: "Province Nord, Province Sud, IRD, IAC",
    },
    gabon: {
      name: "Gabon - Cameroun",
      sub: "Central Africa",
      partners: "Partners to be announced",
    },
    guyane: {
      name: "Guyane",
      sub: "Northern South America",
      partners: "Partners to be announced",
    },
  },
} as const;
