import { beforeEach, describe, expect, it, vi } from "vitest";

// localStorage en mémoire (environnement node), installé avant l'import du store.
vi.hoisted(() => {
  const data = new Map<string, string>();
  (globalThis as { localStorage?: unknown }).localStorage = {
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => void data.set(k, v),
    removeItem: (k: string) => void data.delete(k),
  };
});

import { QUANTITE_MAX, useQuoteStore } from "@/lib/quote-store";

const tapis = { slug: "tapis", categorie: "cardio", nom: "Tapis de course" };
const rameur = { slug: "rameur", categorie: "cardio", nom: "Rameur" };

describe("quote-store", () => {
  beforeEach(() => useQuoteStore.getState().clear());

  it("ajoute une machine avec quantité 1", () => {
    useQuoteStore.getState().add(tapis);
    expect(useQuoteStore.getState().items).toEqual([{ ...tapis, quantite: 1 }]);
  });

  it("incrémente si la machine est déjà présente", () => {
    const { add } = useQuoteStore.getState();
    add(tapis);
    add(tapis);
    expect(useQuoteStore.getState().items).toHaveLength(1);
    expect(useQuoteStore.getState().items[0].quantite).toBe(2);
  });

  it("retire une machine", () => {
    const s = useQuoteStore.getState();
    s.add(tapis);
    s.add(rameur);
    s.remove("tapis");
    expect(useQuoteStore.getState().items.map((i) => i.slug)).toEqual(["rameur"]);
  });

  it("modifie la quantité en la bornant entre 1 et le maximum", () => {
    const s = useQuoteStore.getState();
    s.add(tapis);
    s.setQuantite("tapis", 5);
    expect(useQuoteStore.getState().items[0].quantite).toBe(5);
    s.setQuantite("tapis", 0);
    expect(useQuoteStore.getState().items[0].quantite).toBe(1);
    s.setQuantite("tapis", 1000);
    expect(useQuoteStore.getState().items[0].quantite).toBe(QUANTITE_MAX);
  });

  it("compte le total des quantités", () => {
    const s = useQuoteStore.getState();
    s.add(tapis);
    s.add(rameur);
    s.setQuantite("rameur", 3);
    expect(useQuoteStore.getState().count()).toBe(4);
  });

  it("vide le panier", () => {
    const s = useQuoteStore.getState();
    s.add(tapis);
    s.clear();
    expect(useQuoteStore.getState().items).toEqual([]);
    expect(useQuoteStore.getState().count()).toBe(0);
  });

  it("persiste les articles (et uniquement eux) dans localStorage", () => {
    useQuoteStore.getState().add(tapis);
    const saved = JSON.parse(localStorage.getItem("fayou-devis") as string);
    expect(saved.state.items).toHaveLength(1);
    expect(saved.state.drawerOpen).toBeUndefined();
  });
});
