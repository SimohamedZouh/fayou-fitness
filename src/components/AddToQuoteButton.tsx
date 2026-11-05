"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, useReducedMotion } from "motion/react";
import { Check, Plus } from "lucide-react";
import { useQuoteStore } from "@/lib/quote-store";

interface Props {
  slug: string;
  categorie: string;
  nom: string;
  className?: string;
}

interface Vol {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
}

/** Petite pastille violette qui « vole » du bouton vers le panier du header. */
function Pastille({ vol, onEnd }: { vol: Vol; onEnd: () => void }) {
  return (
    <motion.span
      aria-hidden="true"
      className="pointer-events-none fixed z-[80] size-4 rounded-full bg-primary shadow-lg"
      style={{ left: vol.x - 8, top: vol.y - 8 }}
      initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
      animate={{ x: vol.dx, y: vol.dy, scale: 0.4, opacity: 0.3 }}
      transition={{ duration: 0.65, ease: [0.5, 0, 0.75, 0] }}
      onAnimationComplete={onEnd}
    />
  );
}

/** Bouton « Ajouter au devis » branché sur le panier (zustand). */
export default function AddToQuoteButton({ slug, categorie, nom, className = "" }: Props) {
  const add = useQuoteStore((s) => s.add);
  const reduce = useReducedMotion();
  const [added, setAdded] = useState(false);
  const [vol, setVol] = useState<Vol | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const compteur = useRef(0);

  useEffect(() => () => clearTimeout(timer.current), []);

  function lancerVol(bouton: HTMLElement) {
    const cible = document.getElementById("quote-cart-button");
    if (!cible || reduce) return;
    const a = bouton.getBoundingClientRect();
    const b = cible.getBoundingClientRect();
    const x = a.left + a.width / 2;
    const y = a.top + a.height / 2;
    setVol({
      id: ++compteur.current,
      x,
      y,
      dx: b.left + b.width / 2 - x,
      dy: b.top + b.height / 2 - y,
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          add({ slug, categorie, nom });
          lancerVol(e.currentTarget);
          setAdded(true);
          clearTimeout(timer.current);
          timer.current = setTimeout(() => setAdded(false), 2000);
        }}
        aria-label={added ? `${nom} ajouté au devis` : `Ajouter au devis : ${nom}`}
        className={`relative z-10 inline-flex min-h-11 items-center justify-center gap-2 rounded-full border-2 border-primary px-4 text-sm font-bold text-primary-text transition hover:bg-primary hover:text-white ${className}`}
      >
        {added ? (
          <Check className="size-4" aria-hidden="true" />
        ) : (
          <Plus className="size-4" aria-hidden="true" />
        )}
        {added ? "Ajouté" : "Ajouter au devis"}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {added ? `${nom} ajouté au devis.` : ""}
      </span>
      {vol &&
        createPortal(
          <Pastille key={vol.id} vol={vol} onEnd={() => setVol(null)} />,
          document.body,
        )}
    </>
  );
}
