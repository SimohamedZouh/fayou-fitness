import type { ChiffreCle, SiteConfig } from "@/types";

const ANNEE_FONDATION = 2006;

/** Convertit une variable d'environnement vide en null. */
const env = (v: string | undefined) => (v && v.trim() ? v.trim() : null);

export const site: SiteConfig = {
  nom: "FAYOU Fitness",
  signature: "Qualité. Performance. Confiance.",
  baseline: "Matériel de sport neuf & d'occasion",
  anneeFondation: ANNEE_FONDATION,
  villes: ["Casablanca", "Marrakech"],
  zoneIntervention: "Intervention dans tout le Maroc",
  // À CONFIRMER : numéro fourni par FAYOU via NEXT_PUBLIC_WHATSAPP
  whatsapp: env(process.env.NEXT_PUBLIC_WHATSAPP),
  // À CONFIRMER : numéro fourni par FAYOU via NEXT_PUBLIC_PHONE
  telephone: env(process.env.NEXT_PUBLIC_PHONE),
  // À CONFIRMER : email de contact
  email: null,
  // À CONFIRMER : adresse précise des showrooms / bureaux
  adresse: null,
  url: env(process.env.NEXT_PUBLIC_SITE_URL) ?? "http://localhost:3000",
};

/** Années d'expérience depuis 2006. L'appelant fournit l'année courante. */
export function getAnneesExperience(anneeCourante: number): number {
  return Math.max(0, anneeCourante - ANNEE_FONDATION);
}

/**
 * Chiffres clés. Une valeur null signifie « à confirmer » : masquer la tuile.
 * `anneesExperience` est calculée depuis 2006 (20 en 2026).
 */
export function getChiffresCles(anneeCourante: number): ChiffreCle[] {
  return [
    {
      cle: "anneesExperience",
      libelle: "ans d'expérience",
      valeur: getAnneesExperience(anneeCourante),
    },
    {
      cle: "projetsRealises",
      libelle: "projets réalisés",
      valeur: null, // À CONFIRMER
      suffixe: "+",
    },
    {
      cle: "equipementsInstalles",
      libelle: "équipements installés",
      valeur: null, // À CONFIRMER
      suffixe: "+",
    },
  ];
}
