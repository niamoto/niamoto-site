// Client island : flow field de spores guidé par une seed déterministe.
// - p5.js chargé via dynamic import -> non bundlé sur les autres pages.
// - Seed passée en prop (calculée côté serveur pour éviter les mismatches d'hydratation).
// - Le composant respecte prefers-reduced-motion via CSS (la parent section masque le canvas).

import { useEffect, useRef } from "react";

interface Props {
  seed: number;
  density?: number; // 0.3..1.2 -- multiplicateur du nombre de spores
  palette?: {
    canvas: string;
    ink: string;
    accent: string;
    accentAlt: string;
  };
}

export default function SporeCanvas({
  seed,
  density = 0.7,
  palette = {
    canvas: "#F3EEE2",
    ink: "#1A1612",
    accent: "#A34B28",
    accentAlt: "#4A3A6B",
  },
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const instanceRef = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const p5Module = await import("p5");
      const p5 = p5Module.default;
      if (cancelled || !containerRef.current) return;

      const sketch = (p: any) => {
        const spores: Array<{
          x: number;
          y: number;
          vx: number;
          vy: number;
          life: number;
          max: number;
          size: number;
          hueShift: number;
        }> = [];
        const count = Math.floor(180 * density);
        const flowScale = 0.0035;

        const mkSpore = (pp: any) => ({
          x: pp.random(pp.width),
          y: pp.random(pp.height),
          vx: 0,
          vy: 0,
          life: 0,
          max: pp.random(80, 260),
          size: pp.random(0.6, 2.4),
          hueShift: pp.random(0, 1),
        });

        p.setup = () => {
          const el = containerRef.current!;
          p.createCanvas(el.clientWidth, el.clientHeight);
          p.randomSeed(seed);
          p.noiseSeed(seed);
          p.background(palette.canvas);
          p.noStroke();
          for (let i = 0; i < count; i++) {
            spores.push(mkSpore(p));
          }
        };

        p.windowResized = () => {
          const el = containerRef.current!;
          if (!el) return;
          p.resizeCanvas(el.clientWidth, el.clientHeight);
          p.background(palette.canvas);
        };

        p.draw = () => {
          // Legere trainee de la couleur de fond -- les traces s'estompent avec le temps.
          p.fill(palette.canvas + "14"); // 0x14 = ~8% alpha
          p.rect(0, 0, p.width, p.height);

          for (const s of spores) {
            const n = p.noise(s.x * flowScale, s.y * flowScale, p.frameCount * 0.001);
            const angle = n * p.TAU * 2;
            s.vx = p.lerp(s.vx, p.cos(angle) * 0.9, 0.12);
            s.vy = p.lerp(s.vy, p.sin(angle) * 0.9, 0.12);
            s.x += s.vx;
            s.y += s.vy;
            s.life += 1;

            if (
              s.life > s.max ||
              s.x < -10 ||
              s.x > p.width + 10 ||
              s.y < -10 ||
              s.y > p.height + 10
            ) {
              Object.assign(s, mkSpore(p));
            }

            const alpha = p.map(
              Math.min(s.life, s.max - s.life),
              0,
              s.max / 2,
              0,
              120
            );
            const col =
              s.hueShift > 0.55
                ? palette.accent
                : s.hueShift > 0.28
                  ? palette.accentAlt
                  : palette.ink;
            p.fill(col + alphaHex(alpha));
            p.circle(s.x, s.y, s.size);
          }
        };
      };

      instanceRef.current = new p5(sketch, containerRef.current!);
    })();

    return () => {
      cancelled = true;
      try {
        instanceRef.current?.remove?.();
      } catch {
        // ignore cleanup errors
      }
      instanceRef.current = null;
    };
  }, [seed, density, palette.canvas, palette.ink, palette.accent, palette.accentAlt]);

  return (
    <div
      ref={containerRef}
      className="sporee-hero__canvas"
      aria-hidden="true"
    />
  );
}

function alphaHex(a: number) {
  const v = Math.max(0, Math.min(255, Math.round(a)));
  return v.toString(16).padStart(2, "0");
}
