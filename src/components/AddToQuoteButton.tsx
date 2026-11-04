"use client";

import { useState } from "react";
import { Check, Plus } from "lucide-react";

interface Props {
  slug: string;
  categorie: string;
  nom: string;
  className?: string;
}

/**
 * Bouton « Ajouter au devis ». Le panier est branché à l'étape 5 :
 * en attendant, il émet l'évènement `fayou:add-to-quote` (écoutable plus tard).
 */
export default function AddToQuoteButton({ slug, categorie, nom, className = "" }: Props) {
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        window.dispatchEvent(
          new CustomEvent("fayou:add-to-quote", { detail: { slug, categorie, nom } }),
        );
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
      }}
      aria-label={`Ajouter au devis : ${nom}`}
      className={`relative z-10 inline-flex min-h-11 items-center justify-center gap-2 rounded-full border-2 border-primary px-4 text-sm font-bold text-primary-text transition hover:bg-primary hover:text-white ${className}`}
    >
      {added ? <Check className="size-4" aria-hidden="true" /> : <Plus className="size-4" aria-hidden="true" />}
      {added ? "Ajouté" : "Ajouter au devis"}
    </button>
  );
}
