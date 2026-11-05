"use client";

import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";

/**
 * Chiffre clé animé : compte de 0 à la valeur quand il entre dans la vue.
 * Le HTML serveur contient déjà la valeur finale (SEO, sans JavaScript).
 */
export default function Counter({
  valeur,
  suffixe = "",
  libelle,
}: {
  valeur: number;
  suffixe?: string;
  libelle: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const count = useMotionValue(valeur);
  const arrondi = useTransform(count, (v) => Math.round(v));

  useEffect(() => {
    if (!inView || reduce) return;
    count.set(0);
    const controls = animate(count, valeur, { duration: 1.8, ease: "easeOut" });
    return () => controls.stop();
  }, [inView, reduce, valeur, count]);

  return (
    <div className="text-center">
      <p ref={ref} className="font-display text-6xl font-extrabold italic text-primary-text">
        <span className="sr-only">
          {valeur}
          {suffixe}
        </span>
        <span aria-hidden="true">
          <motion.span>{arrondi}</motion.span>
          {suffixe}
        </span>
      </p>
      <p className="text-sm font-semibold uppercase tracking-wide text-text-muted">{libelle}</p>
    </div>
  );
}
