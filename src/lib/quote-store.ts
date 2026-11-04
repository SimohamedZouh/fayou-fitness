import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface QuoteItem {
  slug: string;
  categorie: string;
  nom: string;
  quantite: number;
}

interface QuoteState {
  items: QuoteItem[];
  /** Ouverture du tiroir (non persistée). */
  drawerOpen: boolean;
  /** Vrai une fois le localStorage relu côté client. */
  hydrated: boolean;
  add: (item: Omit<QuoteItem, "quantite">) => void;
  remove: (slug: string) => void;
  setQuantite: (slug: string, quantite: number) => void;
  clear: () => void;
  /** Nombre total de machines (somme des quantités). */
  count: () => number;
  openDrawer: () => void;
  closeDrawer: () => void;
}

export const QUANTITE_MAX = 99;

const clamp = (n: number) => Math.min(QUANTITE_MAX, Math.max(1, Math.floor(n) || 1));

export const useQuoteStore = create<QuoteState>()(
  persist(
    (set, get) => ({
      items: [],
      drawerOpen: false,
      hydrated: false,
      add: ({ slug, categorie, nom }) =>
        set((s) => {
          const existing = s.items.find((i) => i.slug === slug);
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.slug === slug ? { ...i, quantite: clamp(i.quantite + 1) } : i,
              ),
            };
          }
          return { items: [...s.items, { slug, categorie, nom, quantite: 1 }] };
        }),
      remove: (slug) => set((s) => ({ items: s.items.filter((i) => i.slug !== slug) })),
      setQuantite: (slug, quantite) =>
        set((s) => ({
          items: s.items.map((i) => (i.slug === slug ? { ...i, quantite: clamp(quantite) } : i)),
        })),
      clear: () => set({ items: [] }),
      count: () => get().items.reduce((total, i) => total + i.quantite, 0),
      openDrawer: () => set({ drawerOpen: true }),
      closeDrawer: () => set({ drawerOpen: false }),
    }),
    {
      name: "fayou-devis",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ items: s.items }),
      // Hydratation manuelle côté client (évite l'écart serveur/client).
      skipHydration: true,
    },
  ),
);

/** Format texte d'une ligne de machines pour le formulaire. */
export function itemsToLines(items: QuoteItem[]): string[] {
  return items.map((i) => (i.quantite > 1 ? `${i.nom} x${i.quantite}` : i.nom));
}

/** Relit le localStorage (à appeler une fois, côté client, après l'hydratation React). */
export async function hydrateQuoteStore() {
  await useQuoteStore.persist.rehydrate();
  useQuoteStore.setState({ hydrated: true });
}
