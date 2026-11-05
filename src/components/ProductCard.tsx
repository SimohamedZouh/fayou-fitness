import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Icon from "@/components/Icon";
import CardGlow from "@/components/CardGlow";
import AddToQuoteButton from "@/components/AddToQuoteButton";
import { ETAT_LABELS } from "@/lib/catalogue-filter";
import type { Machine } from "@/types";

export function EtatBadges({ etat }: { etat: Machine["etat"] }) {
  return (
    <>
      {etat.map((e) => (
        <span
          key={e}
          className="rounded-full border border-border bg-bg-alt px-2.5 py-0.5 text-xs font-semibold text-primary-text"
        >
          {ETAT_LABELS[e]}
        </span>
      ))}
    </>
  );
}

/** Visuel provisoire neutre : icône Lucide de la sous-catégorie (pas de photo inventée). */
export function ProductVisual({ machine, className = "" }: { machine: Machine; className?: string }) {
  return (
    <div
      className={`flex items-center justify-center bg-gradient-to-br from-bg-alt to-card ${className}`}
      role="img"
      aria-label={`Visuel provisoire : ${machine.nom}`}
    >
      <Icon
        name={machine.icone}
        className="size-16 text-primary-text opacity-80 transition-transform duration-500 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
      />
    </div>
  );
}

export default function ProductCard({ machine }: { machine: Machine }) {
  return (
    <div className="group relative flex w-full transition-transform duration-300 hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <CardGlow />
      <article className="relative flex w-full flex-col overflow-hidden rounded-2xl border border-border bg-card">
        <ProductVisual machine={machine} className="aspect-[4/3]" />
        <div className="flex flex-1 flex-col gap-3 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
            {machine.sousCategorie}
          </p>
          <h3 className="text-lg font-bold leading-snug">
            <Link
              href={`/machines/${machine.categorie}/${machine.slug}`}
              className="after:absolute after:inset-0"
            >
              {machine.nom}
            </Link>
          </h3>
          <p className="line-clamp-2 flex-1 text-sm text-text-muted">{machine.description}</p>
          <div className="flex flex-wrap gap-2">
            <EtatBadges etat={machine.etat} />
          </div>
          <div className="flex items-center justify-between border-t border-border pt-3 text-sm">
            <span className="font-bold">{machine.prix}</span>
            <span className="flex items-center gap-1 font-bold text-primary-text">
              Voir la fiche
              <ArrowRight className="size-4" aria-hidden="true" />
            </span>
          </div>
          <AddToQuoteButton slug={machine.slug} categorie={machine.categorie} nom={machine.nom} />
        </div>
      </article>
    </div>
  );
}
