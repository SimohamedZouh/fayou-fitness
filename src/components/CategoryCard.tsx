import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Icon from "@/components/Icon";
import type { Categorie } from "@/types";

export default function CategoryCard({ categorie, count }: { categorie: Categorie; count?: number }) {
  return (
    <Link
      href={`/machines/${categorie.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-1 hover:border-primary motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-bg-alt">
        <Image
          src={categorie.image}
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
        />
        <span className="absolute left-4 top-4 inline-flex size-11 items-center justify-center rounded-full bg-white text-[#7f00fb] shadow">
          <Icon name={categorie.icone} className="size-5" />
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="font-display text-2xl font-extrabold uppercase italic leading-tight">
          {categorie.nom}
        </h3>
        <p className="flex-1 text-sm text-text-muted">{categorie.description}</p>
        <p className="flex items-center gap-2 pt-2 text-sm font-bold text-primary-text">
          {count !== undefined ? `${count} machines` : "Découvrir"}
          <ArrowRight
            className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
            aria-hidden="true"
          />
        </p>
      </div>
    </Link>
  );
}
