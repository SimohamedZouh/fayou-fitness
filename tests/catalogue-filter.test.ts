import { describe, expect, it } from "vitest";
import { getCategories, getMachines } from "@/data/catalogue";
import { filtrerMachines, normaliser, parseFiltres } from "@/lib/catalogue-filter";

const slugs = getCategories().map((c) => c.slug);
const tous = getMachines();
const filtrer = (params: Record<string, string>) =>
  filtrerMachines(tous, parseFiltres(params, slugs), slugs);

describe("parseFiltres", () => {
  it("ignore les valeurs inconnues", () => {
    expect(parseFiltres({ cat: "x", etat: "y", usage: "z", tri: "w" }, slugs)).toEqual({
      q: "",
      cat: "",
      etat: "",
      usage: "",
      tri: "nom",
    });
  });

  it("garde les valeurs valides et tronque la recherche à 80 caractères", () => {
    const f = parseFiltres(
      { cat: "cardio", etat: "occasion", usage: "hotel", tri: "categorie", q: "a".repeat(200) },
      slugs,
    );
    expect(f).toMatchObject({ cat: "cardio", etat: "occasion", usage: "hotel", tri: "categorie" });
    expect(f.q).toHaveLength(80);
  });

  it("accepte un paramètre répété (premier utilisé)", () => {
    expect(parseFiltres({ cat: ["cardio", "charges-libres"] }, slugs).cat).toBe("cardio");
  });
});

describe("filtrerMachines", () => {
  it("sans filtre : les 74 machines", () => {
    expect(filtrer({})).toHaveLength(74);
  });

  it("filtre par catégorie", () => {
    const r = filtrer({ cat: "cardio" });
    expect(r.length).toBeGreaterThan(0);
    expect(r.every((m) => m.categorie === "cardio")).toBe(true);
  });

  it("filtre par état et par usage", () => {
    expect(filtrer({ etat: "neuf" }).every((m) => m.etat.includes("neuf"))).toBe(true);
    expect(filtrer({ usage: "hotel" }).every((m) => m.usages.includes("hotel"))).toBe(true);
  });

  it("recherche insensible à la casse et aux accents", () => {
    expect(normaliser("  Vélo  ")).toBe("velo");
    const a = filtrer({ q: "VELO" });
    expect(a.length).toBeGreaterThan(0);
    expect(a.map((m) => m.slug)).toEqual(filtrer({ q: "vélo" }).map((m) => m.slug));
  });

  it("recherche par début de mot : « vélo » ne remonte pas « développé »", () => {
    const r = filtrer({ q: "vélo" });
    expect(r.length).toBeGreaterThan(0);
    const noms = r.map((m) => m.nom);
    expect(noms).not.toContain("Banc plat");
    expect(noms).not.toContain("GHD");
    // le nom prime : les machines dont le nom commence un mot par « velo » viennent en premier
    expect(normaliser(r[0].nom)).toContain("velo");
  });

  it("non-régression : mots complets, espaces et début de mot", () => {
    const noms = (q: string) => filtrer({ q }).map((m) => m.nom);
    expect(noms("banc plat")).toContain("Banc plat");
    expect(noms("tapis de course")).toContain("Tapis de course");
    expect(noms("squat").length).toBeGreaterThan(0);
    expect(noms("presse")).not.toContain("Vélo droit");
    expect(noms("presse").length).toBeGreaterThan(0);
    expect(noms("vélo")).not.toContain("Banc plat");
    expect(noms("vélo")).not.toContain("GHD");
    expect(noms("   banc   plat  ")).toContain("Banc plat");
  });

  it("une seule lettre : seulement les mots qui commencent par cette lettre", () => {
    const r = filtrer({ q: "s" });
    expect(r.length).toBeLessThan(tous.length);
    expect(r.length).toBeGreaterThan(0);
  });

  it("aucun résultat pour une recherche absurde", () => {
    expect(filtrer({ q: "zzzzqqqq" })).toEqual([]);
  });

  it("tris : nom croissant, décroissant et par catégorie", () => {
    const asc = filtrer({ tri: "nom" }).map((m) => m.nom);
    const desc = filtrer({ tri: "nom-desc" }).map((m) => m.nom);
    expect(desc).toEqual([...asc].reverse());
    const cats = filtrer({ tri: "categorie" }).map((m) => slugs.indexOf(m.categorie));
    expect(cats).toEqual([...cats].sort((a, b) => a - b));
  });

  it("ne modifie pas la liste d'origine", () => {
    const avant = tous.map((m) => m.slug).join();
    filtrer({ tri: "nom-desc" });
    expect(tous.map((m) => m.slug).join()).toBe(avant);
  });
});
