export default {
  meta: {
    title: "Niamoto · Sporée — Every run draws a new world",
    description:
      "Niamoto as a living system. A generative flow field, reseeded every day. One toolkit, many worlds.",
  },
  hero: {
    titleLines: ["Niamoto is a seed.", "Every run"],
    titleEmphasis: "draws a new world.",
    sub:
      "Each portal that Niamoto generates is unique, shaped by the field data it was given. This flow field is reseeded every day — you see a different composition than yesterday's visitor, and the visitor tomorrow will see another.",
    controls: {
      regenerate: "Regenerate",
      slow: "Slow",
      dense: "Dense",
    },
  },
  gallery: {
    heading: "COMPOSITIONS · PAST 6 DAYS",
    items: [
      { caption: "2026-04-12 · SEED E17AF3C0", seed: "2026-04-12|en" },
      { caption: "2026-04-13 · SEED 5A229B14", seed: "2026-04-13|en" },
      { caption: "2026-04-14 · SEED 71DE8122", seed: "2026-04-14|en" },
      { caption: "2026-04-15 · SEED BB4F0BAD", seed: "2026-04-15|en" },
      { caption: "2026-04-16 · SEED 2FF5ACB9", seed: "2026-04-16|en" },
      { caption: "2026-04-17 · SEED D8C60E4F (today)", seed: "2026-04-17|en" },
    ],
  },
  install: {
    eyebrow: "INSTALL",
    lines: [
      "pip install niamoto",
      "niamoto init",
      "niamoto run",
    ],
    caption: "The same command seeds every portal. Your data draws the world.",
  },
} as const;
