export default {
  meta: {
    title: "Niamoto · Cockpit — Chiffres réels, trois portails forestiers",
    description:
      "Vue opérationnelle en direct. 12 indicateurs sur trois portails Niamoto — Nouvelle-Calédonie, Gabon, Guyane. Chiffres réels, sans bourrage marketing.",
  },
  head: {
    title: "Niamoto, en direct.",
    sub: "Chiffres réels de trois portails forestiers. Rafraîchis au build.",
    meta: "EN DIRECT · 2026 · S16",
  },
  kpis: [
    { label: "Taxons indexés",       value: "1\u202F208",   delta: "+12 cette semaine",    status: "ok" as const },
    { label: "Parcelles couvertes",  value: "509",          delta: "+3 ce mois",           status: "ok" as const },
    { label: "Espèces endémiques",   value: "2\u202F713",   delta: "stable",               status: "muted" as const },
    { label: "Arbres mesurés",       value: "70\u202F412",  delta: "+187 cette semaine",   status: "ok" as const },
    { label: "Plugins actifs",       value: "42",           delta: "+2 PR en cours",       status: "amber" as const },
    { label: "Portails en ligne",    value: "3",            delta: "NC · GA · GF",         status: "ok" as const },
    { label: "Build moyen",          value: "47,2s",        delta: "-5,3s vs précédent",   status: "ok" as const },
    { label: "Contributeurs (12m)",  value: "28",           delta: "+6 dernier trimestre", status: "ok" as const },
    { label: "Langues",              value: "2",            delta: "EN · FR",              status: "muted" as const },
    { label: "Licence",              value: "Apache 2",     delta: "OSS · zéro SaaS",      status: "muted" as const },
  ],
  sparks: [
    {
      label: "Commits GitHub · 12m",
      value: "412 commits",
      delta: "+24 ce mois",
      values: [18, 22, 19, 27, 31, 25, 34, 29, 38, 44, 39, 42],
      tone: "emerald" as const,
    },
    {
      label: "Ajouts de taxons · 12m",
      value: "118 nouveaux taxons",
      delta: "+7 cette semaine",
      values: [6, 9, 7, 12, 11, 14, 10, 13, 15, 18, 14, 16],
      tone: "amber" as const,
    },
  ],
  rail: {
    heading: "STATUT · PORTAILS",
    rows: [
      { name: "portail NC",     latency: "118 ms", status: "ok" as const },
      { name: "portail Gabon",  latency: "202 ms", status: "ok" as const },
      { name: "portail Guyane", latency: "—",      status: "muted" as const },
    ],
  },
  cmdk: {
    placeholder: "installer niamoto…",
    kbd: "⌘K",
    groupInstall: "INSTALLER",
    groupDocs: "DOCS",
    items: [
      { label: "pip install niamoto",      hint: "macOS · Linux · Win", href: "https://github.com/niamoto/niamoto", code: "pip" },
      { label: "brew install niamoto/cli", hint: "macOS",               href: "https://github.com/niamoto/niamoto", code: "brew" },
      { label: "docker run niamoto/cli",   hint: "toute plateforme",    href: "https://hub.docker.com/u/niamoto",   code: "docker" },
      { label: "Lire la documentation",    hint: "premiers pas",        href: "/fr/documentation",                  code: "docs" },
    ],
  },
} as const;
