import type { icons } from "lucide-react";

/** Nom d'une icône Lucide existante (vérifié par le compilateur). */
export type IconName = keyof typeof icons;

export type Etat = "neuf" | "occasion";
export type Usage = "home" | "hotel" | "pro";

export interface SousCategorie {
  slug: string;
  nom: string;
  icone: IconName;
}

export interface Categorie {
  slug: string;
  nom: string;
  description: string;
  icone: IconName;
  /** Visuel provisoire de la catégorie (à remplacer par une vraie photo). */
  image: string;
  sousCategories: SousCategorie[];
}

export interface Machine {
  slug: string;
  nom: string;
  /** Slug de la catégorie. */
  categorie: string;
  /** Nom de la sous-catégorie (famille) dans la catégorie. */
  sousCategorie: string;
  /** Slug de la sous-catégorie. */
  sousCategorieSlug: string;
  icone: IconName;
  etat: Etat[];
  usages: Usage[];
  /** 1 à 2 phrases. */
  description: string;
  /** Bénéfice principal (texte court). */
  benefice: string;
  /** Muscles sollicités, si pertinent. */
  muscles?: string[];
  /** Précisions citées dans le cahier des charges (ex. « eau / air / magnétique »). */
  variantes?: string[];
  /** Visuel provisoire. */
  image: string;
  /** Caractéristiques techniques : absentes tant que FAYOU ne les fournit pas. */
  specs?: Record<string, string>;
  /** Toujours « Sur devis » : aucun prix publié. */
  prix: "Sur devis";
}

export interface Service {
  slug: string;
  nom: string;
  icone: IconName;
  resume: string;
  points: string[];
}

export interface Projet {
  slug: string;
  nom: string;
  icone: IconName;
  resume: string;
  benefices: string[];
}

export interface ChiffreCle {
  cle: "anneesExperience" | "projetsRealises" | "equipementsInstalles";
  libelle: string;
  /** null = à confirmer par le client : la tuile doit être masquée. */
  valeur: number | null;
  suffixe?: string;
}

export interface SiteConfig {
  nom: string;
  signature: string;
  baseline: string;
  anneeFondation: number;
  villes: string[];
  zoneIntervention: string;
  /** Numéro WhatsApp au format international sans « + » (ex. 212XXXXXXXXX), ou null. */
  whatsapp: string | null;
  /** Numéro de téléphone (format +212…), ou null. */
  telephone: string | null;
  email: string | null;
  /** Adresse précise : non fournie. */
  adresse: string | null;
  url: string;
}
