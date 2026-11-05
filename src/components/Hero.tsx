import Logo from "@/components/Logo";
import ButtonLink from "@/components/ButtonLink";
import { HeroHalo, HeroZoom, Magnetic } from "@/components/HeroMotion";
import { devisHref } from "@/data/navigation";
import { site } from "@/data/site";

const TITRE = "Votre salle de sport clé en main, chez vous ou dans votre hôtel";

/**
 * Titre mot par mot (masque + glissement) en CSS : le texte est présent dans le HTML serveur
 * et s'anime dès le premier rendu, sans attendre l'hydratation (LCP préservé).
 */
function TitreAnime({ texte }: { texte: string }) {
  return (
    <>
      {texte.split(" ").map((mot, i, mots) => (
        <span key={`${mot}-${i}`}>
          <span className="hero-word-mask">
            <span className="hero-word" style={{ animationDelay: `${0.05 * i}s` }}>
              {mot}
            </span>
          </span>
          {i < mots.length - 1 ? " " : null}
        </span>
      ))}
    </>
  );
}

export default function Hero() {
  return (
    <section className="relative flex min-h-[calc(100svh-5rem)] flex-col justify-center overflow-hidden bg-bg-alt sm:min-h-[calc(100svh-6rem)]">
      <HeroHalo />
      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:py-20">
        <div className="space-y-6">
          <p className="inline-block rounded-full bg-primary px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white">
            Depuis {site.anneeFondation}
          </p>
          <h1 className="font-display text-5xl font-extrabold uppercase italic leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
            <TitreAnime texte={TITRE} />
          </h1>
          <p className="max-w-xl text-lg text-text-muted">
            Vente, installation, maintenance et aménagement de salles de sport, neuf et occasion.{" "}
            {site.signature}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Magnetic>
              <ButtonLink href="/machines">Voir les machines</ButtonLink>
            </Magnetic>
            <ButtonLink href={devisHref} variant="outline">
              Devis gratuit
            </ButtonLink>
          </div>
        </div>
        <HeroZoom className="mx-auto w-full max-w-md lg:max-w-lg">
          <Logo eager fetchPriority="high" sizes="(max-width: 1024px) 90vw, 512px" />
        </HeroZoom>
      </div>
    </section>
  );
}
