import { cacheLife } from "next/cache";

/** Année courante, mise en cache (compatible cacheComponents), rafraîchie chaque jour. */
export async function getAnneeCourante(): Promise<number> {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}
