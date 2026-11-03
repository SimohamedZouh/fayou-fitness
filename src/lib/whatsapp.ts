/** Nettoie un numéro : ne garde que les chiffres (format wa.me, sans « + »). */
export function normaliserNumero(numero: string | null | undefined): string | null {
  if (!numero) return null;
  const chiffres = numero.replace(/\D/g, "");
  return chiffres.length >= 8 ? chiffres : null;
}

/**
 * Génère un lien wa.me avec message pré-rempli.
 * Retourne null si aucun numéro valide n'est configuré.
 */
export function whatsappLink(
  numero: string | null | undefined,
  message?: string,
): string | null {
  const n = normaliserNumero(numero);
  if (!n) return null;
  const base = `https://wa.me/${n}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Lien tel: (ou null si numéro absent). */
export function telLink(numero: string | null | undefined): string | null {
  if (!numero) return null;
  const chiffres = numero.replace(/\D/g, "");
  if (chiffres.length < 8) return null;
  return `tel:${numero.trim().startsWith("+") ? "+" : ""}${chiffres}`;
}
