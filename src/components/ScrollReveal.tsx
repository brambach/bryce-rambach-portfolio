import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { useRef, useState, useEffect, type ReactNode } from "react";

/* ── Touch detection (shared, evaluated once) ─────────────────── */

const isTouchDevice =
  typeof window !== "undefined" &&
  (window.matchMedia("(pointer: coarse)").matches || navigator.maxTouchPoints > 0);

/* ── Hook: one-shot IntersectionObserver reveal for mobile ────── */

function useInViewOnce(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect(); // one-shot — stop observing after reveal
        }
      },
      { threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}

/* ── ScrollReveal ─────────────────────────────────────────────── */

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  /** Offset from left (-1) or right (1) for card stagger effect */
  slideFrom?: -1 | 0 | 1;
  delay?: number;
}

export function ScrollReveal({
  children,
  className = "",
  slideFrom = 0,
  delay = 0,
}: ScrollRevealProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  // Mobile: IntersectionObserver → one-shot triggered animation
  if (isTouchDevice) {
    return (
      <MobileReveal className={className} slideFrom={slideFrom} delay={delay}>
        {children}
      </MobileReveal>
    );
  }

  // Desktop: continuous scroll-linked animation
  return (
    <DesktopReveal className={className} slideFrom={slideFrom} delay={delay}>
      {children}
    </DesktopReveal>
  );
}

function MobileReveal({
  children,
  className,
  slideFrom,
  delay,
}: ScrollRevealProps) {
  const { ref, visible } = useInViewOnce(0.1);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, x: (slideFrom ?? 0) * 50 }}
      animate={visible ? { opacity: 1, y: 0, x: 0 } : undefined}
      transition={{
        duration: 0.5,
        delay: delay ?? 0,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function DesktopReveal({
  children,
  className,
  slideFrom,
  delay,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.95", "start 0.55"],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [60, 0]);
  const x = useTransform(scrollYProgress, [0, 1], [(slideFrom ?? 0) * 80, 0]);

  return (
    <motion.div
      ref={ref}
      style={{ opacity, y, x }}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Parallax ─────────────────────────────────────────────────── */

interface ParallaxProps {
  children: ReactNode;
  className?: string;
  /** How much to shift on scroll, in px (negative = moves up faster) */
  offset?: number;
}

export function Parallax({ children, className = "", offset = -40 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, offset]);

  // On mobile or reduced motion, skip parallax entirely
  if (reducedMotion || isTouchDevice) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}
