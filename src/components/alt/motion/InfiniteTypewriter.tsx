import { memo, useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

interface Props {
  /** Lines to cycle through; one is typed, paused, deleted, then next. */
  lines: string[];
  /** Typing speed in ms per character. */
  typeMs?: number;
  /** Hold time at full line in ms. */
  holdMs?: number;
  /** Delete speed in ms per character. */
  deleteMs?: number;
  /** Optional prefix prompt (e.g., "$ ") that stays. */
  prompt?: string;
  className?: string;
}

function InfiniteTypewriterInner({
  lines,
  typeMs = 55,
  holdMs = 1800,
  deleteMs = 28,
  prompt = "$ ",
  className,
}: Props) {
  const prefersReduced = useReducedMotion();
  const [lineIndex, setLineIndex] = useState(0);
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<"typing" | "holding" | "deleting">("typing");

  useEffect(() => {
    if (prefersReduced) {
      setText(lines[0] ?? "");
      return;
    }
    if (lines.length === 0) return;

    let timer: ReturnType<typeof setTimeout>;
    const current = lines[lineIndex] ?? "";

    if (phase === "typing") {
      if (text.length < current.length) {
        timer = setTimeout(() => setText(current.slice(0, text.length + 1)), typeMs);
      } else {
        timer = setTimeout(() => setPhase("holding"), 0);
      }
    } else if (phase === "holding") {
      timer = setTimeout(() => setPhase("deleting"), holdMs);
    } else {
      // deleting
      if (text.length > 0) {
        timer = setTimeout(() => setText(text.slice(0, -1)), deleteMs);
      } else {
        setLineIndex((i) => (i + 1) % lines.length);
        setPhase("typing");
      }
    }

    return () => clearTimeout(timer);
  }, [text, phase, lineIndex, lines, typeMs, holdMs, deleteMs, prefersReduced]);

  // Pause when document is hidden — prevents background CPU.
  useEffect(() => {
    if (prefersReduced) return;
    const onVisibility = () => {
      // No-op: the effect timers will continue, but we could pause here if needed.
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [prefersReduced]);

  return (
    <pre className={className}>
      <code>
        <span style={{ opacity: 0.55 }}>{prompt}</span>
        {text}
        <span className="alt-caret" aria-hidden="true">|</span>
      </code>
      <style>{`
        .alt-caret {
          display: inline-block;
          margin-left: 1px;
          color: var(--c-accent, #C08A3E);
          animation: altCaretBlink 1s steps(2, end) infinite;
        }
        @keyframes altCaretBlink {
          to { opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .alt-caret { animation: none; opacity: 0.6; }
        }
      `}</style>
    </pre>
  );
}

const InfiniteTypewriter = memo(InfiniteTypewriterInner);
export default InfiniteTypewriter;
