# Niamoto Desktop — UI Kit

Recreation of the Niamoto desktop GUI (Tauri + React + Vite + shadcn + Tailwind).

## Components
- `Sidebar.jsx` — dark collapsible nav, Dashboard / Data / Collections / Site / Publish / Plugins
- `TopBar.jsx` — project header + ⌘K search + Recalculate + Publish + avatar
- `Cards.jsx` — `StatusChip`, `StageCard` (sanctioned 3px colored left border), generic `Card`
- `Dashboard.jsx` — pipeline overview: 4 StageCards + queue + recent activity
- `DataScreen.jsx` — source table + field mapping + CLI equivalent
- `CollectionsScreen.jsx` — 4 collections (Taxon / Plot / Shape / Indicators)
- `PublishScreen.jsx` — target picker + ready-to-push file list + deploy history
- `Icons.jsx` — inline Lucide-equivalent SVGs

## Conventions
- Plus Jakarta Sans throughout; tight tracking on headings (`-0.02em`).
- Primary `#2E7D32` (forest green). Sidebar is dark charcoal `#15171B`; active row is `rgba(34,139,34,0.14)`.
- Cards: `border-radius: 7px`, 1px cool-grey border, `--shadow-sm`, hover lifts 1px with `--shadow-md`.
- StageCards are the *only* sanctioned "colored 3px left-border" pattern — the color encodes pipeline stage (Data blue / Collections amber / Site emerald / Publish orange).
- Status chips are always pills with a dot + short word; never sentences.
