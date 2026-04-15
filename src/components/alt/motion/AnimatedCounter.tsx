import { memo, useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

interface Props {
  /** Final number to count up to. */
  value: number;
  /** Optional suffix (e.g., "+", " km²", "%"). */
  suffix?: string;
  /** Optional prefix. */
  prefix?: string;
  /** Animation duration in ms. */
  durationMs?: number;
  /** Decimal places. */
  decimals?: number;
  /** Locale used for number formatting (defaults to "fr-FR" for French thousand separators). */
  locale?: string;
  className?: string;
}

function AnimatedCounterInner({
  value,
  suffix = "",
  prefix = "",
  durationMs = 1400,
  decimals = 0,
  locale = "fr-FR",
  className,
}: Props) {
  const prefersReduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px -15% 0px" });
  const [display, setDisplay] = useState(prefersReduced || !inView ? value : 0);

  useEffect(() => {
    if (!inView) return;
    if (prefersReduced) {
      setDisplay(value);
      return;
    }

    let raf: number;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / durationMs, 1);
      // ease-out-cubic
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(value * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setDisplay(value);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, durationMs, prefersReduced]);

  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(display);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

const AnimatedCounter = memo(AnimatedCounterInner);
export default AnimatedCounter;
