/** Décalage progressif (secondes) pour l'élément `index` d'une grille (4 colonnes max). */
export const staggerDelay = (index: number) => (index % 4) * 0.08;
