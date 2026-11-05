"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";

/** Halos violets animés en arrière-plan (transform uniquement, figés si mouvement réduit). */
export function HeroHalo() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -right-32 -top-32 size-[28rem] rounded-full bg-primary/20 blur-3xl"
        animate={{ x: [0, -40, 20, 0], y: [0, 30, -10, 0], scale: [1, 1.15, 0.95, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-40 -left-24 size-[22rem] rounded-full bg-primary/10 blur-3xl"
        animate={{ x: [0, 40, -10, 0], y: [0, -30, 10, 0], scale: [1, 0.9, 1.1, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

/** Entrée du logo : léger zoom (le logo reste visible dès le rendu serveur). */
export function HeroZoom({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 90, damping: 16, delay: 0.15 }}
    >
      {children}
    </motion.div>
  );
}

/** Effet magnétique : le bouton suit légèrement le pointeur (souris uniquement). */
export function Magnetic({ children, className }: { children: React.ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 220, damping: 18, mass: 0.4 });
  const y = useSpring(my, { stiffness: 220, damping: 18, mass: 0.4 });

  return (
    <motion.div
      className={className}
      style={{ x, y, display: "inline-block" }}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - (r.left + r.width / 2)) * 0.25);
        my.set((e.clientY - (r.top + r.height / 2)) * 0.35);
      }}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}
