"use client";

import { useState, type KeyboardEvent, type ReactNode } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  nom: string;
  images?: string[];
  /** Affiché quand il n'y a aucune image (visuel provisoire, aucune photo inventée). */
  fallback: ReactNode;
}

/** Galerie : grande image, vignettes cliquables, flèches clavier ←/→ et compteur. */
export default function ProductGallery({ nom, images = [], fallback }: Props) {
  const [index, setIndex] = useState(0);
  if (images.length === 0) return <>{fallback}</>;

  const total = images.length;
  const aller = (i: number) => setIndex((i + total) % total);

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      aller(index + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      aller(index - 1);
    }
  }

  return (
    <div
      role="group"
      aria-roledescription="galerie"
      aria-label={`Photos : ${nom}`}
      tabIndex={0}
      onKeyDown={onKeyDown}
      className="space-y-3 rounded-2xl focus-visible:outline-2"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-bg-alt">
        <Image
          key={images[index]}
          src={images[index]}
          alt={`${nom} – photo ${index + 1}`}
          fill
          priority={index === 0}
          sizes="(min-width: 1024px) 560px, 100vw"
          className="object-contain"
        />
        {total > 1 && (
          <>
            <button
              type="button"
              onClick={() => aller(index - 1)}
              aria-label="Photo précédente"
              className="absolute left-2 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-bg/90 text-text hover:border-primary"
            >
              <ChevronLeft className="size-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => aller(index + 1)}
              aria-label="Photo suivante"
              className="absolute right-2 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-bg/90 text-text hover:border-primary"
            >
              <ChevronRight className="size-5" aria-hidden="true" />
            </button>
          </>
        )}
        <p
          aria-live="polite"
          className="absolute bottom-2 right-2 rounded-full bg-bg/90 px-3 py-1 text-xs font-semibold text-text"
        >
          {index + 1} / {total}
        </p>
      </div>

      {total > 1 && (
        <ul className="grid grid-cols-4 gap-2 sm:grid-cols-5">
          {images.map((src, i) => (
            <li key={src}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Afficher la photo ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
                className={`relative block aspect-[4/3] w-full overflow-hidden rounded-lg border-2 bg-bg-alt ${
                  i === index ? "border-primary" : "border-border hover:border-primary/60"
                }`}
              >
                <Image
                  src={src}
                  alt={`${nom} – photo ${i + 1}`}
                  fill
                  sizes="(min-width: 1024px) 110px, 22vw"
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
