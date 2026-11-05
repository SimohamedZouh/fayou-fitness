import type { ChiffreCle, SiteConfig } from "@/types";

const ANNEE_FONDATION = 2006;

/** Convertit une variable d'environnement vide en null. */
const env = (v: string | undefined) => (v && v.trim() ? v.trim() : null);

const URL_LOCALE = "http://localhost:3000";

/** Ajoute https:// à un nom d'hôte Vercel (fourni sans schéma). */
const avecSchema = (h: string) => (/^https?:\/\//.test(h) ? h : `https://${h}`);

/**
 * URL publique du site (sitemap, canonical, Open Graph, JSON-LD).
 * Ordre : NEXT_PUBLIC_SITE_URL, puis (sur Vercel) VERCEL_PROJECT_PRODUCTION_URL,
 * puis VERCEL_URL, enfin localhost. Un repli sur Vercel ou localhost en production
 * déclenche un avertissement côté serveur.
 */
export function resolveSiteUrl(e?: Record<string, string | undefined>): string {
  // Accès directs à process.env.X : Next les inline au build (NEXT_PUBLIC_*).
  // Le paramètre `e` sert uniquement aux tests.
  const lire = (k: string): string | undefined => {
    if (e) return e[k];
    switch (k) {
      case "NEXT_PUBLIC_SITE_URL":
        return process.env.NEXT_PUBLIC_SITE_URL;
      case "VERCEL_PROJECT_PRODUCTION_URL":
        return process.env.VERCEL_PROJECT_PRODUCTION_URL;
      case "VERCEL_URL":
        return process.env.VERCEL_URL;
      default:
        return process.env.NODE_ENV;
    }
  };
  const explicite = env(lire("NEXT_PUBLIC_SITE_URL"));
  if (explicite) return explicite.replace(/\/+$/, "");

  const vercel = env(lire("VERCEL_PROJECT_PRODUCTION_URL")) ?? env(lire("VERCEL_URL"));
  const enProduction = lire("NODE_ENV") === "production";
  const surServeur = typeof window === "undefined";
  if (vercel) {
    if (enProduction && surServeur) {
      console.warn(
        `[site] NEXT_PUBLIC_SITE_URL est vide : repli sur ${avecSchema(vercel)}. Renseignez-la avec le domaine définitif.`,
      );
    }
    return avecSchema(vercel).replace(/\/+$/, "");
  }
  if (enProduction && surServeur) {
    console.warn(
      `[site] NEXT_PUBLIC_SITE_URL est vide : le sitemap, les canonical et le JSON-LD pointeront vers ${URL_LOCALE}. Renseignez-la avant la mise en production.`,
    );
  }
  return URL_LOCALE;
}

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
  url: resolveSiteUrl(),
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
