"use client";

import { MotionConfig } from "motion/react";

/** Respecte prefers-reduced-motion pour toutes les animations motion du site. */
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
