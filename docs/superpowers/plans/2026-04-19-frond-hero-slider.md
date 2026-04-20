# FrondSlider — Hero carousel app + portal Implementation Plan

> **For Claude:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the single static screenshot in the `/alt/frond` hero with a 7-slide auto-advancing carousel mixing app GUI screenshots and portal output screenshots.

**Architecture:** New standalone Astro component `FrondSlider.astro` with inline vanilla JS (no framework island). Slides are locale-aware data defined in i18n files. CSS cross-fade transitions, auto-advance every 4s paused on hover/focus, manual navigation via arrows and dots.

**Tech Stack:** Astro 5.x, TypeScript strict, vanilla JS (inline `<script>`), CSS custom properties from the existing `frond` design system tokens.

**Spec:** `docs/superpowers/specs/2026-04-19-frond-hero-slider-design.md`

---

## Chunk 1: Assets, i18n, static component, CSS, wiring

### Task 1: Copy app screenshots into public/

**Files:**
- Create: `public/showcase/app/dashboard.png`
- Create: `public/showcase/app/import.png`
- Create: `public/showcase/app/widgets.png`
- Create: `public/showcase/app/site-builder.png`

- [ ] **Step 1: Create the destination directory**

```bash
mkdir -p /Users/julienbarbe/Dev/clients/niamoto-site/public/showcase/app
```

- [ ] **Step 2: Copy the 4 app screenshots with clean names**

```bash
cp "/Users/julienbarbe/Dev/clients/niamoto/docs/assets/screenshots/desktop/06.dashboard-get-started.png" \
   /Users/julienbarbe/Dev/clients/niamoto-site/public/showcase/app/dashboard.png

cp "/Users/julienbarbe/Dev/clients/niamoto/docs/assets/screenshots/desktop/08.import-sources-review.png" \
   /Users/julienbarbe/Dev/clients/niamoto-site/public/showcase/app/import.png

cp "/Users/julienbarbe/Dev/clients/niamoto/docs/assets/screenshots/desktop/17.collections-widget-catalog.png" \
   /Users/julienbarbe/Dev/clients/niamoto-site/public/showcase/app/widgets.png

cp "/Users/julienbarbe/Dev/clients/niamoto/docs/assets/screenshots/desktop/21.site-builder-home-page.png" \
   /Users/julienbarbe/Dev/clients/niamoto-site/public/showcase/app/site-builder.png
```

- [ ] **Step 3: Verify the 4 files are present**

```bash
ls -lh /Users/julienbarbe/Dev/clients/niamoto-site/public/showcase/app/
```

Expected: 4 `.png` files, each > 100 KB.

- [ ] **Step 4: Commit**

```bash
git add public/showcase/app/
git commit -m "feat: add app screenshots to public/showcase/app"
```

---

### Task 2: Add `slides` to i18n files

**Files:**
- Modify: `src/i18n/alt/frond.en.ts`
- Modify: `src/i18n/alt/frond.fr.ts`

- [ ] **Step 1: Add slides array to `frond.en.ts`**

In `src/i18n/alt/frond.en.ts`, after the `install` block inside `hero`, add:

```ts
    slides: [
      { src: "/showcase/app/dashboard.png",   alt: "Niamoto dashboard — project overview",     badge: "app",    label: "Dashboard"    },
      { src: "/showcase/app/import.png",       alt: "Import data sources into Niamoto",         badge: "app",    label: "Import"       },
      { src: "/showcase/app/widgets.png",      alt: "Widget catalog for collection pages",      badge: "app",    label: "Widgets"      },
      { src: "/showcase/app/site-builder.png", alt: "Site builder — configure portal pages",    badge: "app",    label: "Site builder" },
      { src: "/showcase/portail-alt/home-en.png",           alt: "Published portal home page",  badge: "portal", label: "Portal"       },
      { src: "/showcase/portail-alt/preview-taxons-en.png", alt: "Taxons browser page",         badge: "portal", label: "Taxons"       },
      { src: "/showcase/portail-alt/species-en.png",        alt: "Species detail page",         badge: "portal", label: "Species"      },
    ],
```

- [ ] **Step 2: Add slides array to `frond.fr.ts`**

In `src/i18n/alt/frond.fr.ts`, after the `install` block inside `hero`, add:

```ts
    slides: [
      { src: "/showcase/app/dashboard.png",   alt: "Tableau de bord Niamoto — vue projet",        badge: "app",    label: "Tableau de bord" },
      { src: "/showcase/app/import.png",       alt: "Import des sources de données dans Niamoto",  badge: "app",    label: "Import"          },
      { src: "/showcase/app/widgets.png",      alt: "Catalogue de widgets pour les collections",   badge: "app",    label: "Widgets"         },
      { src: "/showcase/app/site-builder.png", alt: "Site builder — configuration des pages",      badge: "app",    label: "Site builder"    },
      { src: "/showcase/portail-alt/home-fr.png",           alt: "Page d'accueil du portail",      badge: "portal", label: "Portail"         },
      { src: "/showcase/portail-alt/preview-taxons-fr.png", alt: "Navigateur de taxons",           badge: "portal", label: "Taxons"          },
      { src: "/showcase/portail-alt/species-fr.png",        alt: "Fiche espèce",                   badge: "portal", label: "Espèce"          },
    ],
```

- [ ] **Step 3: Run typecheck — expect 0 errors**

```bash
cd /Users/julienbarbe/Dev/clients/niamoto-site && pnpm typecheck 2>&1 | tail -5
```

Expected output ends with: `0 errors`

- [ ] **Step 4: Commit**

```bash
git add src/i18n/alt/frond.en.ts src/i18n/alt/frond.fr.ts
git commit -m "feat: add slides data to frond hero i18n"
```

---

### Task 3: Create `FrondSlider.astro` — static structure (no JS yet)

**Files:**
- Create: `src/components/alt/frond/FrondSlider.astro`

- [ ] **Step 1: Create the component**

Create `src/components/alt/frond/FrondSlider.astro` with this content:

```astro
---
interface Slide {
  src: string;
  alt: string;
  badge: "app" | "portal";
  label: string;
}

interface Props {
  slides: readonly Slide[];
}

const { slides } = Astro.props;
const total = slides.length;
---

<div class="frond-slider" data-slider aria-label="Niamoto screenshots" role="region">
  <div class="frond-slider__track" aria-live="polite" aria-atomic="false">
    {slides.map((slide, i) => (
      <div
        class={`frond-slider__slide${i === 0 ? " frond-slider__slide--active" : ""}`}
        role="group"
        aria-roledescription="slide"
        aria-label={`${i + 1} of ${total}`}
        aria-hidden={i !== 0 ? "true" : undefined}
      >
        <img
          src={slide.src}
          alt={slide.alt}
          loading={i === 0 ? "eager" : "lazy"}
          decoding="async"
        />
        <div class="frond-slider__caption">
          <span class={`frond-status-chip frond-status-chip--${slide.badge === "app" ? "steel" : "leaf"}`}>
            <span class="frond-status-chip__dot" aria-hidden="true"></span>
            {slide.badge === "app" ? "App" : "Portal"}
          </span>
          <span class="frond-slider__caption-label">{slide.label}</span>
        </div>
      </div>
    ))}
  </div>

  <button class="frond-slider__arrow frond-slider__arrow--prev" aria-label="Previous slide" type="button">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
  </button>
  <button class="frond-slider__arrow frond-slider__arrow--next" aria-label="Next slide" type="button">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  </button>

  <div class="frond-slider__dots" role="tablist" aria-label="Slides">
    {slides.map((_, i) => (
      <button
        class={`frond-slider__dot${i === 0 ? " frond-slider__dot--active" : ""}`}
        role="tab"
        aria-selected={i === 0 ? "true" : "false"}
        aria-label={`Slide ${i + 1}`}
        type="button"
        data-index={i}
      ></button>
    ))}
  </div>
</div>
```

- [ ] **Step 2: Run typecheck — expect 0 errors**

```bash
cd /Users/julienbarbe/Dev/clients/niamoto-site && pnpm typecheck 2>&1 | tail -5
```

Expected: `0 errors`

- [ ] **Step 3: Commit**

```bash
git add src/components/alt/frond/FrondSlider.astro
git commit -m "feat: add FrondSlider static component structure"
```

---

### Task 4: Add CSS for `frond-slider` in `frond.css`

**Files:**
- Modify: `src/styles/alt/frond.css`

- [ ] **Step 1: Remove `frond-hero__shot` blocks and update the stage comment**

In `src/styles/alt/frond.css`:

**a)** Update the comment just above `.frond-hero__stage` from:
```css
/* Hero stage — the "GUI card" side with status + screenshot */
```
to:
```css
/* Hero stage — the slider side */
```

**b)** Delete the two `frond-hero__shot` blocks (they appear after the `.frond-status-chip*` blocks, do NOT delete those):

```css
[data-theme="frond"] .frond-hero__shot {
  overflow: hidden;
  border-radius: 12px;
  border: 1px solid var(--c-hairline);
  box-shadow: var(--shadow-card-stack);
  background: var(--c-surface);
}

[data-theme="frond"] .frond-hero__shot img {
  display: block;
  width: 100%;
  height: auto;
  object-fit: cover;
}
```

- [ ] **Step 2: Add slider CSS in place of the removed `frond-hero__shot` blocks**

Insert the new slider CSS **at the same location** where the two `frond-hero__shot` blocks just were (after `.frond-status-chip__dot` closing brace, before `.frond-hero__shot` if it had not been deleted). In other words, add it right after the last `.frond-status-chip*` block closing brace:

```css
/* -------------------------------------------------------------------------
 * HERO SLIDER
 * ------------------------------------------------------------------------- */
[data-theme="frond"] .frond-slider {
  position: relative;
  border-radius: 12px;
  border: 1px solid var(--c-hairline);
  box-shadow: var(--shadow-card-stack);
  background: var(--c-surface);
  overflow: hidden;
}

[data-theme="frond"] .frond-slider__track {
  position: relative;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  border-radius: 10px 10px 0 0;
  background: #0f172a;
}

[data-theme="frond"] .frond-slider__slide {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.5s ease;
  pointer-events: none;
}

[data-theme="frond"] .frond-slider__slide--active {
  opacity: 1;
  pointer-events: auto;
}

[data-theme="frond"] .frond-slider__slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

[data-theme="frond"] .frond-slider__caption {
  position: absolute;
  bottom: 0.7rem;
  left: 0.7rem;
  display: flex;
  align-items: center;
  gap: 0.45rem;
}

[data-theme="frond"] .frond-slider__caption-label {
  font-size: 0.72rem;
  font-weight: 600;
  color: #fff;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
  letter-spacing: 0.02em;
}

[data-theme="frond"] .frond-slider__arrow {
  position: absolute;
  top: calc(50% - 1.5rem);    /* vertically centred on track, not dots */
  transform: translateY(-50%);
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: 1px solid var(--c-hairline);
  background: var(--c-surface);
  color: var(--c-ink);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s ease, background 0.15s ease;
  z-index: 2;
}

[data-theme="frond"] .frond-slider:hover .frond-slider__arrow,
[data-theme="frond"] .frond-slider:focus-within .frond-slider__arrow {
  opacity: 1;
}

[data-theme="frond"] .frond-slider__arrow:hover {
  background: var(--c-canvas);
}

[data-theme="frond"] .frond-slider__arrow--prev {
  left: 0.5rem;
}

[data-theme="frond"] .frond-slider__arrow--next {
  right: 0.5rem;
}

[data-theme="frond"] .frond-slider__dots {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.6rem 0.8rem;
  background: var(--c-surface);
}

[data-theme="frond"] .frond-slider__dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--c-hairline);
  border: none;
  padding: 0;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;
}

[data-theme="frond"] .frond-slider__dot--active {
  background: var(--color-forest-green, #2e7d32);
  transform: scale(1.25);
}

[data-theme="frond"] .frond-slider__dot:hover:not(.frond-slider__dot--active) {
  background: var(--c-stone);
}
```

- [ ] **Step 3: Verify dev server renders without layout breakage**

```bash
# Dev server should already be running (pnpm dev on port 4321)
# Open http://localhost:4321/alt/frond in browser
```

Expected (static — JS not yet added, navigation non-functional):
- Slider container visible in the hero right column with border + shadow
- First slide (dashboard.png) visible — subsequent slides hidden (opacity: 0)
- Dots row visible below the track (7 dots, first dot active/green)
- Arrows visible on hover (but clicking them does nothing yet)
- No console errors

- [ ] **Step 4: Commit**

```bash
git add src/styles/alt/frond.css
git commit -m "style: add frond-slider CSS, remove frond-hero__shot"
```

---

### Task 5: Wire `FrondSlider` into `FrondHero.astro`

**Files:**
- Modify: `src/components/alt/frond/FrondHero.astro`

- [ ] **Step 1: Update the Props interface**

In `src/components/alt/frond/FrondHero.astro`, add the `Slide` type and `slides` prop.

Replace the existing interface section:

```astro
---
import EyebrowTag from "@/components/alt/shared/EyebrowTag.astro";
import ButtonInButton from "@/components/alt/shared/ButtonInButton.astro";
import FadeUpOnView from "@/components/alt/motion/FadeUpOnView.tsx";
import type { Locale } from "@/i18n/config";

type TitleLine = string | { italic: true; text: string };

interface Cta {
  label: string;
  href: string;
}

interface Props {
  locale: Locale;
  signage: string;
  eyebrow: string;
  titleLines: readonly TitleLine[];
  sub: string;
  ctaPrimary: Cta;
  ctaSecondary: Cta;
  install: {
    label: string;
    snippet: string;
    copyAria: string;
  };
}

const { locale, signage, eyebrow, titleLines, sub, ctaPrimary, ctaSecondary, install } = Astro.props;
const homeImage = `/showcase/portail-alt/home-${locale}.png`;
const imageLocale = locale === "fr" ? "French" : "English";
---
```

With:

```astro
---
import EyebrowTag from "@/components/alt/shared/EyebrowTag.astro";
import ButtonInButton from "@/components/alt/shared/ButtonInButton.astro";
import FadeUpOnView from "@/components/alt/motion/FadeUpOnView.tsx";
import FrondSlider from "./FrondSlider.astro";
import type { Locale } from "@/i18n/config";

type TitleLine = string | { italic: true; text: string };

interface Cta {
  label: string;
  href: string;
}

interface Slide {
  src: string;
  alt: string;
  badge: "app" | "portal";
  label: string;
}

interface Props {
  locale: Locale;
  signage: string;
  eyebrow: string;
  titleLines: readonly TitleLine[];
  sub: string;
  ctaPrimary: Cta;
  ctaSecondary: Cta;
  install: {
    label: string;
    snippet: string;
    copyAria: string;
  };
  slides: readonly Slide[];
}

const { locale, signage, eyebrow, titleLines, sub, ctaPrimary, ctaSecondary, install, slides } = Astro.props;
---
```

- [ ] **Step 2: Replace the shot div with FrondSlider in the template**

In the template, replace:

```astro
  <FadeUpOnView client:visible delay={0.12} className="frond-hero__stage">
    <div class="frond-hero__shot">
      <img
        src={homeImage}
        alt={`${imageLocale} preview of the Niamoto portal home page`}
        loading="eager"
        decoding="async"
      />
    </div>
  </FadeUpOnView>
```

With:

```astro
  <FadeUpOnView client:visible delay={0.12} className="frond-hero__stage">
    <FrondSlider slides={slides} />
  </FadeUpOnView>
```

- [ ] **Step 3: Run typecheck — expect 0 errors**

```bash
cd /Users/julienbarbe/Dev/clients/niamoto-site && pnpm typecheck 2>&1 | tail -5
```

Expected: `0 errors`

- [ ] **Step 4: Visual check in browser**

Open `http://localhost:4321/alt/frond` and `http://localhost:4321/fr/alt/frond`.

Expected:
- Hero right column shows first app screenshot (dashboard)
- Dots row visible below the image
- Arrows visible on hover
- No console errors
- FR page shows same app screenshots, locale is irrelevant for first 4 slides

- [ ] **Step 5: Commit**

```bash
git add src/components/alt/frond/FrondHero.astro
git commit -m "feat: wire FrondSlider into FrondHero, remove static shot"
```

---

## Chunk 2: JS behavior, polish, final verification

### Task 6: Add inline JS for auto-advance, arrows, dots

**Files:**
- Modify: `src/components/alt/frond/FrondSlider.astro`

- [ ] **Step 1: Add the `<script>` block at the end of `FrondSlider.astro`**

Append after the closing `</div>` of the component:

```astro
<script>
  document.querySelectorAll<HTMLElement>("[data-slider]").forEach((slider) => {
    const slides = Array.from(slider.querySelectorAll<HTMLElement>(".frond-slider__slide"));
    const dots = Array.from(slider.querySelectorAll<HTMLButtonElement>(".frond-slider__dot"));
    const prevBtn = slider.querySelector<HTMLButtonElement>(".frond-slider__arrow--prev");
    const nextBtn = slider.querySelector<HTMLButtonElement>(".frond-slider__arrow--next");
    const total = slides.length;
    let current = 0;
    let timer: ReturnType<typeof setInterval> | null = null;

    function goTo(index: number) {
      slides[current].classList.remove("frond-slider__slide--active");
      slides[current].setAttribute("aria-hidden", "true");
      dots[current].classList.remove("frond-slider__dot--active");
      dots[current].setAttribute("aria-selected", "false");

      current = (index + total) % total;

      slides[current].classList.add("frond-slider__slide--active");
      slides[current].removeAttribute("aria-hidden");
      dots[current].classList.add("frond-slider__dot--active");
      dots[current].setAttribute("aria-selected", "true");
    }

    function startTimer() {
      timer = setInterval(() => goTo(current + 1), 4000);
    }

    function stopTimer() {
      if (timer !== null) {
        clearInterval(timer);
        timer = null;
      }
    }

    function resetTimer() {
      stopTimer();
      startTimer();
    }

    // Arrow buttons
    prevBtn?.addEventListener("click", () => { goTo(current - 1); resetTimer(); });
    nextBtn?.addEventListener("click", () => { goTo(current + 1); resetTimer(); });

    // Dot buttons
    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => { goTo(i); resetTimer(); });
    });

    // Pause on hover / focus
    slider.addEventListener("mouseenter", stopTimer);
    slider.addEventListener("mouseleave", startTimer);
    slider.addEventListener("focusin", stopTimer);
    slider.addEventListener("focusout", startTimer);

    startTimer();
  });
</script>
```

- [ ] **Step 2: Visual check — auto-advance**

Open `http://localhost:4321/alt/frond`. Wait 4 seconds.

Expected:
- Slide transitions automatically to slide 2 (import.png)
- Active dot updates
- Hovering the slider pauses the transition

- [ ] **Step 3: Visual check — manual navigation**

Click the next arrow several times, click dots, click prev arrow.

Expected:
- Slides change on each click
- Active dot follows correctly
- Wrap-around works (last slide → first slide)
- Timer resets after each manual interaction

- [ ] **Step 4: Check FR locale**

Open `http://localhost:4321/fr/alt/frond`.

Expected:
- Same auto-advance behaviour
- Portal slides (slides 5-7) show FR portal screenshots (`home-fr.png`, `preview-taxons-fr.png`, `species-fr.png`)
- Labels in French ("Tableau de bord", "Portail", "Espèce", etc.)

- [ ] **Step 5: Run final typecheck**

```bash
cd /Users/julienbarbe/Dev/clients/niamoto-site && pnpm typecheck 2>&1 | tail -5
```

Expected: `0 errors`

- [ ] **Step 6: Commit**

```bash
git add src/components/alt/frond/FrondSlider.astro
git commit -m "feat: add auto-advance JS behavior to FrondSlider"
```

---

### Task 7: Final verification and build check

**Files:** None modified — verification only.

- [ ] **Step 1: Full build**

```bash
cd /Users/julienbarbe/Dev/clients/niamoto-site && pnpm build 2>&1 | tail -20
```

Expected: build completes with 0 errors. `dist/` generated.

- [ ] **Step 2: Check no stale `frond-hero__shot` references remain**

```bash
grep -r "frond-hero__shot" /Users/julienbarbe/Dev/clients/niamoto-site/src/
```

Expected: no output (class fully removed).

- [ ] **Step 3: Check no `homeImage` or `imageLocale` remnants**

```bash
grep -r "homeImage\|imageLocale" /Users/julienbarbe/Dev/clients/niamoto-site/src/
```

Expected: no output.

- [ ] **Step 4: Verify `.superpowers/` is gitignored**

```bash
grep -q "\.superpowers" /Users/julienbarbe/Dev/clients/niamoto-site/.gitignore && echo "OK" || echo "ADD IT"
```

If output is `ADD IT`, add `.superpowers/` to `.gitignore`:
```bash
echo ".superpowers/" >> /Users/julienbarbe/Dev/clients/niamoto-site/.gitignore
git add .gitignore && git commit -m "chore: gitignore .superpowers brainstorm dir"
```

- [ ] **Step 5: Final commit if any cleanup done**

```bash
git status
# Only commit if there are actual changes
```
