import { z } from "zod";
import { projets } from "@/data/projects";

/** Slugs de src/data/projects.ts, plus « autre ». */
export const TYPES_PROJET = [...projets.map((p) => p.slug), "autre"] as unknown as [string, ...string[]];

const nbChiffres = (v: string) => v.replace(/\D/g, "").length;

export const leadSchema = z.object({
  nom: z.string().trim().min(2, "Veuillez indiquer votre nom.").max(100),
  telephone: z
    .string()
    .trim()
    .min(1, "Veuillez indiquer votre numéro de téléphone.")
    .max(20, "Numéro de téléphone trop long.")
    // Un seul contrôle (format + nombre de chiffres) : un seul message d’erreur.
    .refine(
      (v) => /^\+?[\d\s().-]+$/.test(v) && nbChiffres(v) >= 8 && nbChiffres(v) <= 15,
      "Numéro de téléphone invalide.",
    ),
  projet: z.enum(TYPES_PROJET, { error: "Veuillez choisir un type de projet." }),
  ville: z.string().trim().min(2, "Veuillez indiquer votre ville.").max(80),
  machines: z.array(z.string().max(120)).max(100).default([]),
  details: z.string().trim().max(2000).default(""),
  /** Champ piège anti-spam : doit rester vide. */
  honeypot: z.string().max(0).default(""),
});

export type LeadInput = z.input<typeof leadSchema>;
export type Lead = z.output<typeof leadSchema>;
