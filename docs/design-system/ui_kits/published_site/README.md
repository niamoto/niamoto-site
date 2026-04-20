# Published Site — UI Kit

Recreation of the static site Niamoto generates into `exports/web/`. Built from Jinja2 templates + Tailwind + `niamoto.css` + Font Awesome 6.

## Components
- `Nav.jsx` — sticky green nav bar with Arial Black title, emboss on logo tile, white hover wash; `Footer` with WFO partner logo.
- `Widgets.jsx` — `Widget` (12px radius, animated gradient header, hover lift -2px), plus three chart primitives: `BarChart`, `DonutChart`, `MiniMap`. Every Nth widget rotates through gradient variations.
- `HomePage.jsx` — hero + search + 4 stat widgets + occurrence map + conservation donut + featured taxa grid.
- `TaxonPage.jsx` — breadcrumb, latin-italic title, classification, distribution map, DBH + phenology bars (DBH uses the beige/brown forestry palette), co-occurrence bars, ecology notes.

## Conventions
- Primary green: `#228b22` (matches Tailwind's `nav-bg` in the repo).
- Title uses **Arial Black** uppercase, `0.125em` tracking, heavy text-shadow — this is load-bearing for brand feel.
- Cards here are widgets: 12px radius, animated gradient header, hover lift; NOT the shadcn 7px card from the GUI.
- Font Awesome 6 via CDN; no hand-drawn iconography.
- All latin names wrap in `<i>` / `font-style: italic`.
