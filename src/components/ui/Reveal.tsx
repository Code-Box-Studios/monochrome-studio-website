"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

interface RevealProps {
  children?: ReactNode;
  /** Stagger in ms, applied as a transition delay. */
  delay?: number;
  /** `rule` animates a horizontal wipe instead of a rise — for section rules. */
  variant?: "rise" | "rule";
  as?: ElementType;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Scroll-reveal wrapper.
 *
 * Renders fully visible on the server and only hides itself once JS has run
 * *and* the element is still below the fold — so above-the-fold content never
 * flashes, and with JS off or reduced motion on, nothing is ever hidden.
 */
export function Reveal({
  children,
  delay = 0,
  variant = "rise",
  as: Tag = "div",
  className,
  style,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const attr = variant === "rule" ? "data-reveal-rule" : "data-reveal";

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Already on screen at hydration — leave it alone rather than fade it in.
    if (el.getBoundingClientRect().top <= window.innerHeight * 0.92) return;

    el.setAttribute(attr, "pending");
    if (delay && variant === "rise") el.style.transitionDelay = `${delay}ms`;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          el.setAttribute(attr, "in");
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [attr, delay, variant]);

  return (
    <Tag ref={ref} className={className} style={style}>
      {children}
    </Tag>
  );
}
