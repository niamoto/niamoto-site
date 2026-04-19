import { memo, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface Props {
  children: ReactNode;
  /** Stagger delay between children, in seconds. */
  stagger?: number;
  /** Initial Y offset for each child. */
  y?: number;
  /** Initial scale (1 = none). */
  scale?: number;
  /** As HTML wrapper element. */
  as?: "div" | "ul" | "section" | "ol";
  className?: string;
}

/**
 * Staggered reveal for a list of children.
 *
 * Fires on mount (`initial` -> `animate`). Paired with Astro's `client:visible`
 * directive on the island, this triggers when the container enters the viewport
 * -- same UX as whileInView but without its stall on elements that were already
 * in view at hydration time.
 */
function StaggeredRevealInner({
  children,
  stagger = 0.08,
  y = 16,
  scale = 1,
  as = "div",
  className,
}: Props) {
  const prefersReduced = useReducedMotion();
  const Container = (motion as never)[as] as typeof motion.div;

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  const containerVariants = {
    hidden: { opacity: 1 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y, scale },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 110,
        damping: 22,
        mass: 0.9,
      },
    },
  };

  const childArray = Array.isArray(children) ? children : [children];

  return (
    <Container
      className={className}
      initial="hidden"
      animate="show"
      variants={containerVariants}
    >
      {childArray.map((child, i) => (
        <motion.div key={i} variants={itemVariants} style={{ display: "contents" }}>
          {child}
        </motion.div>
      ))}
    </Container>
  );
}

const StaggeredReveal = memo(StaggeredRevealInner);
export default StaggeredReveal;
