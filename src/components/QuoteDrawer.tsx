"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { QUANTITE_MAX, hydrateQuoteStore, useQuoteStore } from "@/lib/quote-store";

const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

/** Tiroir latéral du panier de devis. Monté une fois dans le layout. */
/** `categories` : nom d’affichage de chaque catégorie (slug -> nom), fourni par le layout. */
export default function QuoteDrawer({ categories }: { categories: Record<string, string> }) {
  const open = useQuoteStore((s) => s.drawerOpen);
  const items = useQuoteStore((s) => s.items);
  const hydrated = useQuoteStore((s) => s.hydrated);
  const close = useQuoteStore((s) => s.closeDrawer);
  const remove = useQuoteStore((s) => s.remove);
  const setQuantite = useQuoteStore((s) => s.setQuantite);
  const panelRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  // Relecture du localStorage après l'hydratation React.
  useEffect(() => {
    void hydrateQuoteStore();
  }, []);

  useEffect(() => {
    if (!open) return;
    returnFocus.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const raf = requestAnimationFrame(() => {
      panelRef.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const nodes = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const current = document.activeElement;
      if (!panelRef.current.contains(current)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && current === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && current === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      returnFocus.current?.focus();
    };
  }, [open, close]);

  const liste = hydrated ? items : [];

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[60]">
            <motion.div
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={close}
              className="absolute inset-0 bg-text/50"
            />
            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="quote-drawer-title"
              data-lenis-prevent=""
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", ease: "easeOut", duration: 0.28 }}
              className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-border bg-bg pb-[env(safe-area-inset-bottom)] pr-[env(safe-area-inset-right)] shadow-2xl"
            >
              <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
                <h2
                  id="quote-drawer-title"
                  className="font-display text-2xl font-extrabold uppercase italic"
                >
                  Ma demande de devis
                </h2>
                <button
                  type="button"
                  data-autofocus
                  onClick={close}
                  aria-label="Fermer le panier de devis"
                  className="inline-flex size-11 items-center justify-center rounded-full border border-border bg-card text-text hover:border-primary-text hover:text-primary-text"
                >
                  <X className="size-5" aria-hidden="true" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-4">
                {liste.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center gap-4 py-10 text-center">
                    <ShoppingBag className="size-10 text-primary-text" aria-hidden="true" />
                    <p className="font-semibold">Votre demande est vide.</p>
                    <p className="text-sm text-text-muted">
                      Ajoutez des machines depuis le catalogue pour les inclure dans votre devis.
                    </p>
                    <Link
                      href="/machines"
                      onClick={close}
                      className="inline-flex h-11 items-center rounded-full border-2 border-primary px-5 text-sm font-bold text-primary-text hover:bg-primary hover:text-white"
                    >
                      Voir les machines
                    </Link>
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {liste.map((i) => (
                      <li
                        key={i.slug}
                        className="rounded-2xl border border-border bg-card p-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold leading-snug">{i.nom}</p>
                            <p className="text-xs text-text-muted">
                              {categories[i.categorie] ?? i.categorie}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => remove(i.slug)}
                            aria-label={`Retirer ${i.nom} du devis`}
                            className="inline-flex size-11 shrink-0 items-center justify-center rounded-full text-text-muted hover:text-primary-text"
                          >
                            <Trash2 className="size-5" aria-hidden="true" />
                          </button>
                        </div>
                        <div
                          role="group"
                          aria-label={`Quantité : ${i.nom}`}
                          className="mt-2 inline-flex items-center gap-1 rounded-full border border-border"
                        >
                          <button
                            type="button"
                            onClick={() => setQuantite(i.slug, i.quantite - 1)}
                            disabled={i.quantite <= 1}
                            aria-label={`Diminuer la quantité de ${i.nom}`}
                            className="inline-flex size-11 items-center justify-center rounded-full hover:text-primary-text disabled:opacity-40"
                          >
                            <Minus className="size-4" aria-hidden="true" />
                          </button>
                          <span aria-live="polite" className="min-w-8 text-center font-bold">
                            {i.quantite}
                          </span>
                          <button
                            type="button"
                            onClick={() => setQuantite(i.slug, i.quantite + 1)}
                            disabled={i.quantite >= QUANTITE_MAX}
                            aria-label={`Augmenter la quantité de ${i.nom}`}
                            className="inline-flex size-11 items-center justify-center rounded-full hover:text-primary-text disabled:opacity-40"
                          >
                            <Plus className="size-4" aria-hidden="true" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="border-t border-border p-5">
                {liste.length > 0 ? (
                  <Link
                    href="/contact#devis"
                    onClick={close}
                    className="flex h-12 items-center justify-center rounded-full bg-primary text-base font-bold text-white"
                  >
                    Envoyer ma demande
                  </Link>
                ) : (
                  <Link
                    href="/contact#devis"
                    onClick={close}
                    className="flex h-12 items-center justify-center rounded-full border-2 border-primary text-base font-bold text-primary-text"
                  >
                    Demander un devis sans machine
                  </Link>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
