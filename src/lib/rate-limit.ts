/**
 * Limitation de fréquence simple, en mémoire (par instance serveur).
 * Suffisante contre le spam basique ; sur Vercel chaque instance a son compteur.
 */
const hits = new Map<string, number[]>();

export const RATE_LIMIT_MAX = 5;
export const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

/** Retourne true si la requête est autorisée (et la comptabilise). */
export function checkRateLimit(key: string, now = Date.now()): boolean {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= RATE_LIMIT_MAX) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);

  // Nettoyage occasionnel pour ne pas faire grossir la Map.
  if (hits.size > 1000) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= RATE_LIMIT_WINDOW_MS)) hits.delete(k);
    }
  }
  return true;
}

export function resetRateLimit() {
  hits.clear();
}
