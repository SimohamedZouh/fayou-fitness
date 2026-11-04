"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { ETAT_LABELS, TRIS, USAGE_LABELS } from "@/lib/catalogue-filter";

interface Props {
  categories: { slug: string; nom: string }[];
  total: number;
}

const fieldClass =
  "h-11 w-full rounded-xl border border-border bg-card px-3 text-sm text-text focus-visible:outline-2";

/** Filtres du catalogue : l'état est stocké dans l'URL (lien partageable). */
export default function Filters({ categories, total }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [q, setQ] = useState(params.get("q") ?? "");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Resynchronise le champ si l'URL change (ex. bouton Précédent).
  const urlQ = params.get("q") ?? "";
  const [prevUrlQ, setPrevUrlQ] = useState(urlQ);
  if (urlQ !== prevUrlQ) {
    setPrevUrlQ(urlQ);
    setQ(urlQ);
  }

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    const qs = next.toString();
    startTransition(() => {
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    });
  }

  function onSearch(value: string) {
    setQ(value);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => update("q", value.trim()), 250);
  }

  const actif = ["q", "cat", "etat", "usage", "tri"].some((k) => params.get(k));

  return (
    <form
      role="search"
      aria-label="Filtrer les machines"
      onSubmit={(e) => {
        e.preventDefault();
        if (timer.current) clearTimeout(timer.current);
        update("q", q.trim());
      }}
      className="space-y-4 rounded-2xl border border-border bg-card p-4 sm:p-5"
    >
      <div className="relative">
        <label htmlFor="f-q" className="sr-only">
          Rechercher une machine
        </label>
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-text-muted"
          aria-hidden="true"
        />
        <input
          id="f-q"
          type="search"
          value={q}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Rechercher une machine (ex. tapis, rameur, banc)"
          autoComplete="off"
          className={`${fieldClass} pl-10`}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label htmlFor="f-cat" className="mb-1 block text-xs font-bold uppercase tracking-wide text-text-muted">
            Catégorie
          </label>
          <select id="f-cat" className={fieldClass} value={params.get("cat") ?? ""} onChange={(e) => update("cat", e.target.value)}>
            <option value="">Toutes</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.nom}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="f-etat" className="mb-1 block text-xs font-bold uppercase tracking-wide text-text-muted">
            État
          </label>
          <select id="f-etat" className={fieldClass} value={params.get("etat") ?? ""} onChange={(e) => update("etat", e.target.value)}>
            <option value="">Neuf et occasion</option>
            {Object.entries(ETAT_LABELS).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="f-usage" className="mb-1 block text-xs font-bold uppercase tracking-wide text-text-muted">
            Usage
          </label>
          <select id="f-usage" className={fieldClass} value={params.get("usage") ?? ""} onChange={(e) => update("usage", e.target.value)}>
            <option value="">Tous les usages</option>
            {Object.entries(USAGE_LABELS).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="f-tri" className="mb-1 block text-xs font-bold uppercase tracking-wide text-text-muted">
            Trier par
          </label>
          <select id="f-tri" className={fieldClass} value={params.get("tri") ?? "nom"} onChange={(e) => update("tri", e.target.value === "nom" ? "" : e.target.value)}>
            {TRIS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 text-sm">
        <p role="status" aria-live="polite" className="text-text-muted">
          {pending ? "Mise à jour…" : `${total} machine${total > 1 ? "s" : ""}`}
        </p>
        {actif && (
          <button
            type="button"
            onClick={() => {
              setQ("");
              startTransition(() => router.replace(pathname, { scroll: false }));
            }}
            className="inline-flex items-center gap-1 font-bold text-primary-text hover:underline"
          >
            <X className="size-4" aria-hidden="true" />
            Réinitialiser
          </button>
        )}
      </div>
    </form>
  );
}
