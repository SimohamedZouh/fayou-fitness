"use client";

import { AnimatePresence, motion } from "motion/react";
import { staggerDelay } from "@/lib/stagger";

export interface GridItem {
  key: string;
  /** Contenu déjà rendu côté serveur (carte). */
  node: React.ReactNode;
}

/**
 * Grille animée : révélation au scroll avec décalage progressif, et transition fluide
 * quand la liste change (filtres) grâce à AnimatePresence + layout (transform/opacity).
 */
export default function AnimatedGrid({ items, className }: { items: GridItem[]; className: string }) {
  return (
    <ul className={`relative ${className}`}>
      <AnimatePresence mode="popLayout">
        {items.map((it, i) => (
          <motion.li
            key={it.key}
            layout="position"
            data-reveal=""
            className="flex"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2, delay: 0 } }}
            transition={{ duration: 0.45, ease: "easeOut", delay: staggerDelay(i) }}
          >
            {it.node}
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}
