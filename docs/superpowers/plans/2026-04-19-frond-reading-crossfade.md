# Reading cards auto-crossfade Implementation Plan

> **For Claude:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Reading cards 2 (INDEX) and 3 (SHEET) auto-crossfade between a taxons capture and a plots capture, so the visual matches the already-neutralised "groups" copy.

**Architecture:** Capture one new full-page screenshot (`plots-index-{locale}.png`), refactor `FrondReading.astro` to accept an `images: readonly string[]` array with a 5-key lookup (home / taxons-index / plots-index / taxon-detail / plot-detail), add a CSS `@keyframes frond-crossfade` with 10s cycle + `prefers-reduced-motion` fallback, and update `frond.{en,fr}.ts` cards to use the new array shape. `frond-live.{en,fr}.ts` inherit automatically via import.

**Tech Stack:** Astro 5.x, TypeScript strict, pnpm, agent-browser (headless Chrome via CDP), sips, CSS animations.

**Spec:** `docs/superpowers/specs/2026-04-19-frond-reading-crossfade-design.md`

---

## Chunk 1: Capture + component refactor + i18n + CSS

### Task 1: Capture the plots index full-page (EN + FR)

**Files:**
- Create: `public/showcase/portail-alt/plots-index-en.png`
- Create: `public/showcase/portail-alt/plots-index-fr.png`

- [ ] **Step 1: Verify the preview server is up**

```bash
curl -s -o /dev/null -w "%{http_code}\n" "http://127.0.0.1:5173/api/site/preview-exported/fr/plots/index.html"
curl -s -o /dev/null -w "%{http_code}\n" "http://127.0.0.1:5173/api/site/preview-exported/en/plots/index.html"
```

Expected: two `200` responses. If 502 or connection refused, ask the user to restart the Niamoto preview server (the Tauri app running at `127.0.0.1:5173`).

- [ ] **Step 2: Capture EN + FR full-page at viewport 1280×800**

```bash
mkdir -p /tmp/niamoto-plots-index-capture
agent-browser set viewport 1280 800
agent-browser open "http://127.0.0.1:5173/api/site/preview-exported/en/plots/index.html"
agent-browser wait 2500
agent-browser screenshot --full /tmp/niamoto-plots-index-capture/plots-index-en.png

agent-browser open "http://127.0.0.1:5173/api/site/preview-exported/fr/plots/index.html"
agent-browser wait 2500
agent-browser screenshot --full /tmp/niamoto-plots-index-capture/plots-index-fr.png

ls -lh /tmp/niamoto-plots-index-capture/
file /tmp/niamoto-plots-index-capture/*.png
```

Expected: two PNG files. Width ~1265-1280 px. Height > 600 (full-page scroll). Sizes likely 300 KB – 2 MB each depending on content density.

- [ ] **Step 3: Install + resize to 800 px wide**

```bash
DEST=/Users/julienbarbe/Dev/clients/niamoto-site/public/showcase/portail-alt
cp /tmp/niamoto-plots-index-capture/plots-index-en.png "$DEST/plots-index-en.png"
cp /tmp/niamoto-plots-index-capture/plots-index-fr.png "$DEST/plots-index-fr.png"
cd "$DEST"
sips --resampleWidth 800 plots-index-en.png --out plots-index-en.png >/dev/null
sips --resampleWidth 800 plots-index-fr.png --out plots-index-fr.png >/dev/null
file plots-index-en.png plots-index-fr.png
```

Expected: both files now 800 × (proportional height). Smaller file size than pre-resize.

- [ ] **Step 4: Commit**

```bash
git add public/showcase/portail-alt/plots-index-en.png public/showcase/portail-alt/plots-index-fr.png
git commit -m "feat(reading): add plots index full-page captures (EN + FR)"
```

---

### Task 2: Add crossfade CSS + prefers-reduced-motion fallback

**Files:**
- Modify: `src/styles/alt/frond.css` — add 2 new rules and 1 keyframe inside the existing reading-card section

- [ ] **Step 1: Locate the reading-card image rule**

Open `src/styles/alt/frond.css`. Find the existing `.frond-reading-card__image` rule (should look like):

```css
[data-theme="frond"] .frond-reading-card__image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  object-position: top center;
}
```

- [ ] **Step 2: Replace the single image rule with paired `--a` / `--b` rules + keyframe**

Replace the block above with:

```css
[data-theme="frond"] .frond-reading-card__image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  object-position: top center;
}

/* Crossfade layers — activated only when a card has 2 images */
[data-theme="frond"] .frond-reading-card__image--a,
[data-theme="frond"] .frond-reading-card__image--b {
  animation: frond-crossfade 10s infinite ease-in-out;
}

[data-theme="frond"] .frond-reading-card__image--b {
  animation-delay: -5s;
}

@keyframes frond-crossfade {
  0%, 45%  { opacity: 1; }
  50%, 95% { opacity: 0; }
  100%     { opacity: 1; }
}

@media (prefers-reduced-motion: reduce) {
  [data-theme="frond"] .frond-reading-card__image--a,
  [data-theme="frond"] .frond-reading-card__image--b {
    animation: none;
  }
  [data-theme="frond"] .frond-reading-card__image--b {
    display: none;
  }
}
```

Rationale: `.frond-reading-card__image` keeps baseline layout (absolute, fill). The `--a` / `--b` modifiers only add animation. When a card renders a single image (`--a` only), the animation plays but since `opacity: 1` is both the start and end state with a dip to 0 in the middle, **it would flash invisible once per cycle**. To avoid this, the component MUST only apply `--a` / `--b` classes when the array has 2 items. When the array has 1 item, apply plain `.frond-reading-card__image`.

- [ ] **Step 3: Run typecheck**

```bash
cd /Users/julienbarbe/Dev/clients/niamoto-site && pnpm typecheck 2>&1 | tail -5
```

Expected: `0 errors`.

- [ ] **Step 4: Commit**

```bash
git add src/styles/alt/frond.css
git commit -m "style(reading): add crossfade keyframes + reduced-motion fallback"
```

---

### Task 3: Refactor `FrondReading.astro` to support `images: string[]`

**Files:**
- Modify: `src/components/alt/frond/FrondReading.astro`

- [ ] **Step 1: Read the current frontmatter + template**

Open `src/components/alt/frond/FrondReading.astro`. Note current state:
- `interface Card` has `image: "home" | "index" | "sheet"`
- `imgFor(kind)` and `altFor(kind)` switch on the 3 kinds
- Template renders a single `<img class="frond-reading-card__image" ... />`

- [ ] **Step 2: Replace frontmatter and functions**

Replace the entire frontmatter (between the top `---` and the bottom `---`) with:

```astro
---
import EyebrowTag from "@/components/alt/shared/EyebrowTag.astro";
import FadeUpOnView from "@/components/alt/motion/FadeUpOnView.tsx";
import type { Locale } from "@/i18n/config";

type ImageKey =
  | "home"
  | "taxons-index"
  | "plots-index"
  | "taxon-detail"
  | "plot-detail";

type CardKind = "home" | "index" | "sheet";

interface Note {
  key: string;
  body: string;
}

interface Card {
  label: string;
  meta: string;
  title: string;
  body: string;
  images: readonly ImageKey[];
  notes: readonly Note[];
}

interface Props {
  locale: Locale;
  kicker: string;
  heading: string;
  sub: string;
  cards: readonly Card[];
}

const { locale, kicker, heading, sub, cards } = Astro.props;
const imageLocale = locale === "fr" ? "French" : "English";

const FILE_MAP: Record<ImageKey, (loc: Locale) => string> = {
  "home":         (loc) => `/showcase/portail-alt/home-${loc}.png`,
  "taxons-index": (loc) => `/showcase/portail-alt/preview-taxons-${loc}.png`,
  "plots-index":  (loc) => `/showcase/portail-alt/plots-index-${loc}.png`,
  "taxon-detail": (loc) => `/showcase/portail-alt/species-${loc}.png`,
  "plot-detail":  (loc) => `/showcase/portail-alt/plot-${loc}.png`,
};

const ALT_MAP: Record<ImageKey, string> = {
  "home":         "preview of the Niamoto portal home page",
  "taxons-index": "preview of the Niamoto taxons index",
  "plots-index":  "preview of the Niamoto plots index",
  "taxon-detail": "preview of a Niamoto taxon detail page",
  "plot-detail":  "preview of a Niamoto plot detail page",
};

// CSS grid layout modifier — derived from the FIRST image of the card.
// Keeps the existing `.frond-reading-card--{home,index,sheet}` CSS hooks alive.
const KIND_MAP: Record<ImageKey, CardKind> = {
  "home":         "home",
  "taxons-index": "index",
  "plots-index":  "index",
  "taxon-detail": "sheet",
  "plot-detail":  "sheet",
};

function kindOf(images: readonly ImageKey[]): CardKind {
  return KIND_MAP[images[0]];
}

function imgClass(idx: number, total: number): string {
  if (total < 2) return "frond-reading-card__image";
  return `frond-reading-card__image frond-reading-card__image--${idx === 0 ? "a" : "b"}`;
}
---
```

- [ ] **Step 3a: Update the FadeUpOnView className to derive the card kind from images[0]**

The current template (line 52) has:

```astro
      <FadeUpOnView client:visible delay={0.05 + index * 0.08} className={`frond-reading-card frond-reading-card--${card.image}`}>
```

This drives critical grid-layout CSS (`--home` spans 7 cols, `--index` spans 5, `--sheet` spans 12 — plus sheet-specific inner grid and index-specific stacked notes). The refactor MUST preserve this class.

Replace the line above with:

```astro
      <FadeUpOnView client:visible delay={0.05 + index * 0.08} className={`frond-reading-card frond-reading-card--${kindOf(card.images)}`}>
```

- [ ] **Step 3b: Replace the card image rendering in the template**

Find the `<img class="frond-reading-card__image" ... />` element (it's inside the `.frond-reading-card__media` div). Replace it with:

```astro
            {card.images.map((key, i) => (
              <img
                class={imgClass(i, card.images.length)}
                src={FILE_MAP[key](locale)}
                alt={`${imageLocale} ${ALT_MAP[key]}`}
                loading="lazy"
                decoding="async"
              />
            ))}
```

The surrounding template (media wrapper, topline, body with title/copy/notes) stays unchanged apart from the two changes above.

- [ ] **Step 4: Run typecheck**

```bash
cd /Users/julienbarbe/Dev/clients/niamoto-site && pnpm typecheck 2>&1 | tail -5
```

Expected: `0 errors` — **but** typecheck will fail until Task 4 updates the i18n to match (new `images` field, no longer `image`). That's okay for now; verify the error mentions the i18n file, not FrondReading. If the only error is the i18n mismatch, continue; Task 4 will resolve it.

If the error is specifically about FrondReading's own types, fix it before moving on.

- [ ] **Step 5: Commit**

Do NOT commit yet — commit together with the i18n update in Task 4 so the branch stays buildable at each commit.

---

### Task 4: Update i18n to `images: readonly ImageKey[]`

**Files:**
- Modify: `src/i18n/alt/frond.en.ts`
- Modify: `src/i18n/alt/frond.fr.ts`

- [ ] **Step 1: Update `frond.en.ts` Card 1 (HOME)**

Find (inside `reading.cards[0]`):
```ts
        image: "home" as const,
```

Replace with:
```ts
        images: ["home"] as const,
```

- [ ] **Step 2: Update `frond.en.ts` Card 2 (INDEX)**

Find (inside `reading.cards[1]`):
```ts
        image: "index" as const,
```

Replace with:
```ts
        images: ["taxons-index", "plots-index"] as const,
```

- [ ] **Step 3: Update `frond.en.ts` Card 3 (SHEET)**

Find (inside `reading.cards[2]`):
```ts
        image: "sheet" as const,
```

Replace with:
```ts
        images: ["taxon-detail", "plot-detail"] as const,
```

- [ ] **Step 4: Apply the identical 3 changes to `frond.fr.ts`**

The key names (`home`, `taxons-index`, etc.) are structural; they are NOT translated. The FR file was confirmed to use the same literal strings at matching lines (86/99/112) via:

```bash
grep -n "image:" src/i18n/alt/frond.fr.ts | head -3
```

Apply the same three replacements verbatim at those lines.

- [ ] **Step 5: Run typecheck**

```bash
cd /Users/julienbarbe/Dev/clients/niamoto-site && pnpm typecheck 2>&1 | tail -5
```

Expected: `0 errors`. Now that i18n matches the refactored component, everything should type-check.

- [ ] **Step 6: Regression guard — confirm the card kind modifier class is still generated**

```bash
grep -nE "frond-reading-card--" src/components/alt/frond/FrondReading.astro
```

Expected: at least one match referencing `kindOf(card.images)` (or the literal modifier template). This ensures the grid-layout CSS hooks (`--home` span 7, `--index` span 5, `--sheet` span 12) still apply at runtime.

- [ ] **Step 7: Build check — catches any grid-layout breakage static type-check missed**

```bash
cd /Users/julienbarbe/Dev/clients/niamoto-site && pnpm build 2>&1 | tail -5
```

Expected: `Complete!` with no errors.

- [ ] **Step 8: Commit Tasks 3 + 4 together**

```bash
git add src/components/alt/frond/FrondReading.astro src/i18n/alt/frond.en.ts src/i18n/alt/frond.fr.ts
git commit -m "feat(reading): render 1..N images per card with crossfade on multi"
```

---

### Task 5: Final build + verification

**Files:** None modified.

- [ ] **Step 1: Full build**

```bash
cd /Users/julienbarbe/Dev/clients/niamoto-site && pnpm build 2>&1 | tail -10
```

Expected: `Complete!` with 0 errors. All `/alt/frond`, `/fr/alt/frond`, `/alt/frond-live`, `/fr/alt/frond-live` pages built.

- [ ] **Step 2: Verify no residual `image:` (singular) references**

```bash
grep -nE '^\s*image:\s+"' src/i18n/alt/frond.en.ts src/i18n/alt/frond.fr.ts
```

Expected: no matches. All 3 cards × 2 locales should now use `images:` plural.

- [ ] **Step 3: Verify crossfade CSS is present**

```bash
grep -nE "frond-crossfade|frond-reading-card__image--" src/styles/alt/frond.css
```

Expected: at least 4 matches covering: keyframe definition, `--a` selector, `--b` selector, `--b` display:none under reduced-motion.

- [ ] **Step 4: Verify the new PNG assets exist**

```bash
ls -lh public/showcase/portail-alt/plots-index-*.png
```

Expected: 2 files (en + fr), dimensions 800 × (proportional).

- [ ] **Step 5: Manual visual check**

With the dev server running (`pnpm dev`, port 4321):

- Open `http://localhost:4321/alt/frond`
  - Reading card 2 (INDEX) should alternate between the taxons index and the plots index every ~5 seconds with a 500 ms crossfade
  - Reading card 3 (SHEET) should alternate between the Araucariaceae taxon page and plot 2 detail
  - Reading card 1 (HOME) should show the home page only — no animation flicker
- Open `http://localhost:4321/fr/alt/frond` and confirm the same behaviour with FR captures
- Open `http://localhost:4321/alt/frond-live` and confirm inheritance (same alternation, frond-live uses the same reading content via import)
- Simulate `prefers-reduced-motion: reduce` (Chrome DevTools → Rendering panel → Emulate CSS media feature: prefers-reduced-motion: reduce). Only the first image of each card should be visible; no animation.

If any step fails, report the discrepancy before declaring complete.
