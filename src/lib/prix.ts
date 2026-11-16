import type { Machine } from "@/types";

/** « 17 000 DH » : espaces insécables (pas de retour à la ligne au milieu du prix). */
export function formatPrix(prix: Machine["prix"]): string {
  if (typeof prix !== "number") return prix;
  const n = String(Math.round(prix)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${n} DH`;
}
