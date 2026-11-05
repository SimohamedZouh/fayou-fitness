import type { Etat, Machine, Usage } from "@/types";

export const USAGE_LABELS: Record<Usage, string> = {
  home: "Home gym",
  hotel: "Hôtel",
  pro: "Pro",
};

export const ETAT_LABELS: Record<Etat, string> = {
  neuf: "Neuf",
  occasion: "Occasion",
};

export const TRIS = [
  { value: "nom", label: "Nom (A à Z)" },
  { value: "nom-desc", label: "Nom (Z à A)" },
  { value: "categorie", label: "Catégorie" },
] as const;

export type Tri = (typeof TRIS)[number]["value"];

export interface FiltresCatalogue {
  q: string;
  cat: string;
  etat: "" | Etat;
  usage: "" | Usage;
  tri: Tri;
}

type RawParams = Record<string, string | string[] | undefined>;

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

/** Lit et valide les paramètres d'URL (valeurs inconnues ignorées). */
export function parseFiltres(params: RawParams, categoriesSlugs: string[]): FiltresCatalogue {
  const etat = first(params.etat);
  const usage = first(params.usage);
  const cat = first(params.cat);
  const tri = first(params.tri);
  return {
    q: first(params.q).slice(0, 80),
    cat: categoriesSlugs.includes(cat) ? cat : "",
    etat: etat === "neuf" || etat === "occasion" ? etat : "",
    usage: usage === "home" || usage === "hotel" || usage === "pro" ? usage : "",
    tri: TRIS.some((t) => t.value === tri) ? (tri as Tri) : "nom",
  };
}

export const normaliser = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

/** Mots d'un texte normalisé (la recherche porte sur le début des mots, pas sur des fragments). */
const debutsDeMots = (texte: string) => texte.split(/[^a-z0-9]+/).filter(Boolean);

const texteMachine = (m: Machine) =>
  normaliser(
    [m.nom, m.description, m.benefice, m.sousCategorie, ...(m.muscles ?? []), ...(m.variantes ?? [])].join(" "),
  );

export function filtrerMachines(
  machines: Machine[],
  f: FiltresCatalogue,
  ordreCategories: string[],
): Machine[] {
  const q = normaliser(f.q);
  const motsRecherche = q ? q.split(/\s+/).filter(Boolean) : [];
  const res = machines.filter((m) => {
    if (f.cat && m.categorie !== f.cat) return false;
    if (f.etat && !m.etat.includes(f.etat)) return false;
    if (f.usage && !m.usages.includes(f.usage)) return false;
    if (q && !motsRecherche.every((mot) => debutsDeMots(texteMachine(m)).some((w) => w.startsWith(mot))))
      return false;
    return true;
  });
  // Recherche : le nom prime (correspondance dans le nom avant les autres champs).
  const score = (m: Machine) =>
    motsRecherche.length &&
    motsRecherche.every((mot) => debutsDeMots(normaliser(m.nom)).some((w) => w.startsWith(mot)))
      ? 0
      : 1;
  const parNom = (a: Machine, b: Machine) => a.nom.localeCompare(b.nom, "fr");
  if (f.tri === "nom-desc") return res.sort((a, b) => parNom(b, a));
  if (f.tri === "categorie")
    return res.sort(
      (a, b) =>
        ordreCategories.indexOf(a.categorie) - ordreCategories.indexOf(b.categorie) || parNom(a, b),
    );
  return res.sort((x, y) => score(x) - score(y) || parNom(x, y));
}
