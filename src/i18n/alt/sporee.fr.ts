export default {
  meta: {
    title: "Niamoto · Sporée — Chaque instance dessine un monde",
    description:
      "Niamoto comme système vivant. Un champ de vecteurs génératif, ré-ensemencé chaque jour. Un seul outil, mille mondes.",
  },
  hero: {
    titleLines: ["Niamoto est une graine.", "Chaque instance"],
    titleEmphasis: "dessine un monde.",
    sub:
      "Chaque portail que Niamoto génère est unique, façonné par les données de terrain qu'il a reçues. Ce champ de spores est ré-ensemencé chaque jour — vous voyez une composition différente de celle d'hier, et celui de demain en verra une autre.",
    controls: {
      regenerate: "Régénérer",
      slow: "Ralentir",
      dense: "Dense",
    },
  },
  gallery: {
    heading: "COMPOSITIONS · 6 DERNIERS JOURS",
    items: [
      { caption: "2026-04-12 · SEED E17AF3C0", seed: "2026-04-12|fr" },
      { caption: "2026-04-13 · SEED 5A229B14", seed: "2026-04-13|fr" },
      { caption: "2026-04-14 · SEED 71DE8122", seed: "2026-04-14|fr" },
      { caption: "2026-04-15 · SEED BB4F0BAD", seed: "2026-04-15|fr" },
      { caption: "2026-04-16 · SEED 2FF5ACB9", seed: "2026-04-16|fr" },
      { caption: "2026-04-17 · SEED D8C60E4F (aujourd'hui)", seed: "2026-04-17|fr" },
    ],
  },
  install: {
    eyebrow: "INSTALLER",
    lines: [
      "pip install niamoto",
      "niamoto init",
      "niamoto run",
    ],
    caption: "La même commande ensemence chaque portail. Vos données dessinent le monde.",
  },
} as const;
