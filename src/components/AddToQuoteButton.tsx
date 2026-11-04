"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Plus } from "lucide-react";
import { useQuoteStore } from "@/lib/quote-store";

interface Props {
  slug: string;
  categorie: string;
  nom: string;
  className?: string;
}

/** Bouton « Ajouter au devis » branché sur le panier (zustand). */
export default function AddToQuoteButton({ slug, categorie, nom, className = "" }: Props) {
  const add = useQuoteStore((s) => s.add);
  const [added, setAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          add({ slug, categorie, nom });
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
    </>
  );
}
