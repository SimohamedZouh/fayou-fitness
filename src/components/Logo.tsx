import Image from "next/image";
import clsx from "clsx";

type LogoProps = {
  className?: string;
  /** Priorité réseau de la version affichée (le hero). */
  fetchPriority?: "high" | "low" | "auto";
  /** Chargement immédiat (header et hero : logo au-dessus de la ligne de flottaison, LCP). */
  eager?: boolean;
  sizes?: string;
};

const ALT = "FAYOU Fitness : matériel de sport neuf et d'occasion";

/**
 * Deux versions du logo, affichées selon le thème (classe .dark sur <html>).
 * La version sombre a les lettres noires passées en blanc.
 *
 * `eager` (header, hero) : chargement immédiat, jamais en lazy (LCP). Le navigateur peut aussi
 * télécharger la variante masquée par le thème ; ailleurs (footer) le chargement reste différé.
 */
export default function Logo({
  className,
  fetchPriority,
  eager = false,
  sizes = "(max-width: 768px) 70vw, 420px",
}: LogoProps) {
  const common = {
    width: 1672,
    height: 941,
    sizes,
    loading: eager ? ("eager" as const) : ("lazy" as const),
    fetchPriority,
  };
  return (
    <>
      <Image
        {...common}
        src="/brand/logo-light.webp"
        alt={ALT}
        className={clsx("h-auto w-full dark:hidden", className)}
      />
      <Image
        {...common}
        src="/brand/logo-dark.webp"
        alt={ALT}
        className={clsx("hidden h-auto w-full dark:block", className)}
      />
    </>
  );
}
