import { memo, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface Props {
  children: ReactNode;
  delay?: number;
  /** Translate-y starting offset in px. */
  y?: number;
  /** Blur radius in px (resolves to 0). */
  blur?: number;
  /** As HTML element. */
  as?: "div" | "section" | "header" | "article" | "p" | "h1" | "h2" | "h3";
  className?: string;
}

/**
 * Fades in + lifts up its children.
 *
 * Implementation note: uses `initial` + `animate` (fires on mount), NOT
 * `whileInView`. The enclosing Astro island uses `client:visible`, so
 * hydration only happens when the element enters the viewport -- which gives
 * us the same "reveal on scroll" effect without relying on framer-motion's
 * IntersectionObserver, whose `whileInView` can stall on elements that are
 * already in the viewport at the moment hydration completes.
 */
function FadeUpOnViewInner({
  children,
  delay = 0,
  y = 24,
  blur = 8,
  as = "div",
  className,
}: Props) {
  const prefersReduced = useReducedMotion();
  const Component = (motion as never)[as] as typeof motion.div;

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <Component
      initial={{ opacity: 0, y, filter: `blur(${blur}px)` }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.32, 0.72, 0, 1],
      }}
      className={className}
    >
      {children}
    </Component>
  );
}

const FadeUpOnView = memo(FadeUpOnViewInner);
export default FadeUpOnView;
