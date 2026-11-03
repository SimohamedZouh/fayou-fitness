import Image from "next/image";
import clsx from "clsx";

type LogoProps = {
  className?: string;
  priority?: boolean;
};

const ALT = "FAYOU Fitness : matériel de sport neuf et d'occasion";

/**
 * Deux versions du logo, affichées selon le thème (classe .dark sur <html>).
 * La version sombre a les lettres noires passées en blanc.
 */
export default function Logo({ className, priority = false }: LogoProps) {
  const common = {
    width: 1672,
    height: 941,
    priority,
    sizes: "(max-width: 768px) 70vw, 420px",
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
        alt=""
        aria-hidden="true"
        className={clsx("hidden h-auto w-full dark:block", className)}
      />
    </>
  );
}
