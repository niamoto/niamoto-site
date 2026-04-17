// Client island : installs all ScrollTriggers for the 5 forest stages.
// Runs once after hydration. Reads `data-canopy-stage` attributes on sibling <section>s.
// Kills all triggers on unmount (React StrictMode double-mount safe).

import { useEffect, useRef, useState } from "react";

interface Props {
  /** Labels shown in the progress rail (5 entries). */
  progressLabels: readonly string[];
}

export default function ForestPinController({ progressLabels }: Props) {
  const installedRef = useRef(false);
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    // Guard : desktop wide enough + no reduced-motion preference.
    const mq = window.matchMedia("(min-width: 900px) and (prefers-reduced-motion: no-preference)");
    if (!mq.matches) return;

    let triggers: any[] = [];
    let cancelled = false;

    (async () => {
      const gsapMod = await import("gsap");
      const stMod = await import("gsap/ScrollTrigger");
      if (cancelled) return;

      const gsap: any = gsapMod.default ?? gsapMod;
      const ScrollTrigger: any = stMod.ScrollTrigger ?? stMod.default ?? stMod;
      gsap.registerPlugin(ScrollTrigger);

      if (installedRef.current) return;
      installedRef.current = true;

      // --- Stage 1: canopy zoom ---
      const stage1 = document.querySelector<HTMLElement>('[data-canopy-stage="1"]');
      if (stage1) {
        triggers.push(ScrollTrigger.create({
          trigger: stage1,
          start: "top top",
          end: "+=600vh",
          pin: true,
          scrub: 0.6,
          onUpdate: () => setActiveStage(0),
          animation: gsap.timeline()
            .to(stage1.querySelectorAll(".canopy-layer--far"),  { scale: 1.4, opacity: 0 }, 0)
            .to(stage1.querySelectorAll(".canopy-layer--mid"),  { scale: 1.7, opacity: 0 }, 0)
            .to(stage1.querySelectorAll(".canopy-layer--near"), { scale: 2.1, opacity: 0 }, 0)
            .to(stage1.querySelector(".canopy-stage__title"),   { y: -40,    opacity: 0 }, 0.3),
        }));
      }

      // --- Stage 2: understory plateaux stack ---
      const stage2 = document.querySelector<HTMLElement>('[data-canopy-stage="2"]');
      if (stage2) {
        const plateaux = stage2.querySelectorAll<HTMLElement>(".canopy-plateau");
        triggers.push(ScrollTrigger.create({
          trigger: stage2,
          start: "top top",
          end: `+=${plateaux.length * 50}vh`,
          pin: true,
          scrub: 0.6,
          onEnter:     () => setActiveStage(1),
          onEnterBack: () => setActiveStage(1),
          animation: gsap.timeline().from(plateaux, {
            yPercent: 60,
            opacity: 0,
            stagger: 0.35,
            ease: "power2.out",
          }),
        }));
      }

      // --- Stage 3: data-viz stroke-dasharray ---
      const stage3 = document.querySelector<HTMLElement>('[data-canopy-stage="3"]');
      if (stage3) {
        const lines = stage3.querySelectorAll<SVGPathElement>(".canopy-viz__line");
        triggers.push(ScrollTrigger.create({
          trigger: stage3,
          start: "top top",
          end: "+=400vh",
          pin: true,
          scrub: 0.6,
          onEnter:     () => setActiveStage(2),
          onEnterBack: () => setActiveStage(2),
          animation: gsap.timeline().to(lines, {
            strokeDashoffset: 0,
            stagger: 0.15,
            ease: "power1.out",
          }),
        }));
      }

      // --- Stage 4: plugins sequential reveal ---
      const stage4 = document.querySelector<HTMLElement>('[data-canopy-stage="4"]');
      if (stage4) {
        const plugins = stage4.querySelectorAll<HTMLElement>(".canopy-plugin");
        triggers.push(ScrollTrigger.create({
          trigger: stage4,
          start: "top top",
          end: `+=${plugins.length * 25}vh`,
          pin: true,
          scrub: 0.6,
          onEnter:     () => setActiveStage(3),
          onEnterBack: () => setActiveStage(3),
          animation: gsap.timeline().to(plugins, {
            opacity: 1,
            y: 0,
            stagger: 0.2,
            ease: "power2.out",
          }),
        }));
      }

      // --- Stage 5: soil terminal typewriter ---
      const stage5 = document.querySelector<HTMLElement>('[data-canopy-stage="5"]');
      if (stage5) {
        const terminal = stage5.querySelector<HTMLElement>(".canopy-terminal__text");
        triggers.push(ScrollTrigger.create({
          trigger: stage5,
          start: "top 70%",
          onEnter: () => {
            setActiveStage(4);
            if (terminal) {
              const fullText = terminal.dataset.fullText ?? terminal.textContent ?? "";
              terminal.textContent = "";
              let i = 0;
              const iv = setInterval(() => {
                terminal.textContent = fullText.slice(0, ++i);
                if (i >= fullText.length) clearInterval(iv);
              }, 55);
            }
          },
          onEnterBack: () => setActiveStage(4),
        }));
      }

      // Force-refresh after inserting pins so pin-spacers calc correct dimensions.
      ScrollTrigger.refresh();
    })();

    return () => {
      cancelled = true;
      triggers.forEach((t) => { try { t.kill(); } catch {} });
      triggers = [];
      installedRef.current = false;
    };
  }, []);

  return (
    <nav className="canopy-progress" aria-label="Forest strata progress">
      {progressLabels.map((label, i) => (
        <span
          key={i}
          className={`canopy-progress__item${i === activeStage ? " canopy-progress__item--active" : ""}`}
        >
          {String(i + 1).padStart(2, "0")} · {label}
        </span>
      ))}
    </nav>
  );
}
