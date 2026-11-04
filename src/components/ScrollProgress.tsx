"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";

/** Barre de progression de scroll violette, en haut de page. */
export default function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 24, mass: 0.2 });

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-primary"
      style={{ scaleX: reduce ? scrollYProgress : smooth }}
    />
  );
}
