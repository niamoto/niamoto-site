import { memo, useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

interface Props {
  children: ReactNode;
  href?: string;
  /** Max pull distance in px. */
  intensity?: number;
  className?: string;
  ariaLabel?: string;
  rel?: string;
  target?: string;
}

function MagneticButtonInner({
  children,
  href,
  intensity = 6,
  className,
  ariaLabel,
  rel,
  target,
}: Props) {
  const prefersReduced = useReducedMotion();
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement>(null);

  // CRITICAL: useMotionValue + useTransform (NOT useState) per design-taste-frontend §4.
  // useState would re-render on every mouse move, killing perf on mobile.
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 220, damping: 22, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 220, damping: 22, mass: 0.5 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (prefersReduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / rect.width;
    const dy = (e.clientY - cy) / rect.height;
    x.set(dx * intensity);
    y.set(dy * intensity);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Disable on touch devices via CSS @media hover.
  // Also early-return wrapped element if reduced motion.
  if (prefersReduced) {
    if (href) {
      return <a href={href} className={className} aria-label={ariaLabel} rel={rel} target={target}>{children}</a>;
    }
    return <button type="button" className={className} aria-label={ariaLabel}>{children}</button>;
  }

  if (href) {
    return (
      <motion.a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        className={className}
        aria-label={ariaLabel}
        rel={rel}
        target={target}
        style={{ x: springX, y: springY }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type="button"
      className={className}
      aria-label={ariaLabel}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.button>
  );
}

const MagneticButton = memo(MagneticButtonInner);
export default MagneticButton;
