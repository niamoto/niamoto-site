export default {
  meta: {
    title: "Niamoto · Cockpit — Live numbers from three forest portals",
    description:
      "Live operational view. 12 KPIs across three Niamoto portals — Nouvelle-Calédonie, Gabon, Guyane. Real numbers, no marketing padding.",
  },
  head: {
    title: "Niamoto, live.",
    sub: "Real numbers from three forest portals. Refreshed at build time.",
    meta: "LIVE · 2026 · W16",
  },
  kpis: [
    { label: "Taxa indexed",       value: "1,208",    delta: "+12 this week",    status: "ok" as const },
    { label: "Plots covered",      value: "509",      delta: "+3 this month",    status: "ok" as const },
    { label: "Endemic species",    value: "2,713",    delta: "stable",           status: "muted" as const },
    { label: "Trees measured",     value: "70,412",   delta: "+187 this week",   status: "ok" as const },
    { label: "Active plugins",     value: "42",       delta: "+2 pending PR",    status: "amber" as const },
    { label: "Live portals",       value: "3",        delta: "NC · GA · GF",     status: "ok" as const },
    { label: "Avg build time",     value: "47.2s",    delta: "-5.3s vs prior",   status: "ok" as const },
    { label: "Contributors (12m)", value: "28",       delta: "+6 last quarter",  status: "ok" as const },
    { label: "Languages covered",  value: "2",        delta: "EN · FR",          status: "muted" as const },
    { label: "License",            value: "Apache 2", delta: "OSS · no SaaS",    status: "muted" as const },
  ],
  sparks: [
    {
      label: "GitHub commits · 12m",
      value: "412 commits",
      delta: "+24 this month",
      values: [18, 22, 19, 27, 31, 25, 34, 29, 38, 44, 39, 42],
      tone: "emerald" as const,
    },
    {
      label: "Taxa additions · 12m",
      value: "118 new taxa",
      delta: "+7 this week",
      values: [6, 9, 7, 12, 11, 14, 10, 13, 15, 18, 14, 16],
      tone: "amber" as const,
    },
  ],
  rail: {
    heading: "STATUS · PORTALS",
    rows: [
      { name: "portail NC",     latency: "118 ms", status: "ok" as const },
      { name: "portail Gabon",  latency: "202 ms", status: "ok" as const },
      { name: "portail Guyane", latency: "—",      status: "muted" as const },
    ],
  },
  cmdk: {
    placeholder: "install niamoto…",
    kbd: "⌘K",
    groupInstall: "INSTALL",
    groupDocs: "DOCS",
    items: [
      { label: "pip install niamoto",      hint: "macOS · Linux · Win", href: "https://github.com/niamoto/niamoto", code: "pip" },
      { label: "brew install niamoto/cli", hint: "macOS",               href: "https://github.com/niamoto/niamoto", code: "brew" },
      { label: "docker run niamoto/cli",   hint: "any",                 href: "https://hub.docker.com/u/niamoto",   code: "docker" },
      { label: "Read the docs",            hint: "getting started",     href: "/documentation",                     code: "docs" },
    ],
  },
} as const;
