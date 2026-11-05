"use client";

import { motion } from "motion/react";

const tags = {
  div: motion.div,
  li: motion.li,
  section: motion.section,
  p: motion.p,
} as const;

interface RevealProps {
  as?: keyof typeof tags;
  /** Décalage en secondes (stagger dans les grilles). */
  delay?: number;
  className?: string;
  children: React.ReactNode;
}

/**
 * Révélation au scroll : fondu + remontée de 24 px (transform + opacity uniquement).
 * Avec prefers-reduced-motion, le contenu est affiché tel quel (voir globals.css).
 */
export default function Reveal({ as = "div", delay = 0, className, children }: RevealProps) {
  const Tag = tags[as];
  return (
    <Tag
      data-reveal=""
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -40px 0px" }}
      transition={{ duration: 0.55, ease: "easeOut", delay }}
    >
      {children}
    </Tag>
  );
}

