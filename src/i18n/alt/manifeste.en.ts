// V8 Manifeste -- English copy
// Register: editorial scientific CRO. No marketing language ("revolutionary",
// "unleash", "game-changing"). Calm manifesto tone, firm convictions.

export default {
  meta: {
    title: "Niamoto · A Manifesto — Open Ecological Data",
    description:
      "A manifesto for open ecological data. Niamoto turns field inventories into shared portals, from Nouvelle-Calédonie to Gabon.",
  },
  hero: {
    epigraphText:
      "We the undersigned — foresters, botanists, coders, land-managers — propose that ecological data belongs in the open, read by all, built by many.",
    epigraphAttribution: "Drafted 2026 · Nouméa, Libreville, Cayenne",
    titleLines: [
      "A manifesto",
      "for open",
      "ecological",
    ],
    titleEmphasis: "data.", // rendered in italic copper
    sub:
      "Niamoto is a toolkit that turns field inventories into public portals. No login walls, no paywalls, no vendor lock. Three forests already in. Yours next.",
    ctaPrimary: { label: "Sign the manifesto", href: "https://github.com/niamoto/niamoto" },
    ctaSecondary: { label: "Read the doc", href: "/docs" },
  },
  citations: {
    heading: "Endorsements",
    items: [
      {
        text:
          "Open biodiversity data is the only scalable path. The alternative is each region re-inventing a silo that outlives its funding by three years.",
        who: "Directrice",
        role: "Herbier IRD · Nouméa",
      },
      {
        text:
          "We needed a portal that survives the project that commissioned it. Niamoto's generators are versioned. That's the deal-breaker.",
        who: "Program lead",
        role: "CIRAD · Montpellier",
      },
      {
        text:
          "The plugins model is the correct abstraction. It lets ecologists own their pipeline without maintaining a monorepo.",
        who: "Data scientist",
        role: "AMAP UMR · Montpellier",
      },
      {
        text:
          "We reviewed four stacks before adopting Niamoto for the Gabon canopy project. It's the one that didn't try to sell us anything.",
        who: "Forest engineer",
        role: "ANPN · Libreville",
      },
    ],
  },
  pillars: {
    eyebrow: "THE THREE COMMITMENTS",
    items: [
      {
        numeral: "I",
        title: "Open by default",
        body:
          "Every Niamoto portal publishes as static HTML. No login walls. No API gating. If it's not public by default, it's not a portal — it's a dashboard.",
      },
      {
        numeral: "II",
        title: "Owned by the scientists",
        body:
          "Transforms, exports, taxonomies, plugins — all versioned next to the data. The people who collected the field notes keep the keys.",
      },
      {
        numeral: "III",
        title: "Outlives the grant",
        body:
          "GPL-3.0 licence. No SaaS tier. The portal keeps serving long after the funding window closes. That's the durability test.",
      },
    ],
  },
  pulse: {
    body: "This week: 13 plots were added, 2 new taxa described, 1 plugin merged.",
    meta: "LIVE · WEEK 16 · 2026",
  },
  closing: {
    lines: [
      "Download the toolkit.",
      "Read the manual.", // italic copper
      "Ship your portal.",
    ],
    ctaPrimary: { label: "Install Niamoto", href: "https://github.com/niamoto/niamoto" },
    ctaSecondary: { label: "See the portals", href: "/showcase/nouvelle-caledonie" },
  },
} as const;
