"use client";

import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";

/** Vitesse de base : 50 % de la largeur (une liste) en 40 s. */
const BASE_SPEED = 50 / 40_000;
const HOVER_FACTOR = 0.2;

/**
 * Piste du bandeau défilant : défile à vitesse constante et ralentit (sans s'arrêter net)
 * au survol. Contient deux listes identiques ; la seconde est masquée si mouvement réduit.
 */
export default function MarqueeTrack({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const progress = useMotionValue(0);
  const x = useTransform(progress, (v) => `-${v}%`);
  const factor = useRef(1);
  const target = useRef(1);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    factor.current += (target.current - factor.current) * 0.08;
    progress.set((progress.get() + BASE_SPEED * factor.current * delta) % 50);
  });

  return (
    <div
      className="overflow-hidden"
      onPointerEnter={() => (target.current = HOVER_FACTOR)}
      onPointerLeave={() => (target.current = 1)}
    >
      <motion.div
        style={{ x }}
        className="flex w-max motion-reduce:w-full motion-reduce:justify-center"
      >
        {children}
      </motion.div>
    </div>
  );
}
