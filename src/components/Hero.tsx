import Logo from "@/components/Logo";
import ButtonLink from "@/components/ButtonLink";
import { devisHref } from "@/data/navigation";
import { site } from "@/data/site";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-bg-alt">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-32 size-[28rem] rounded-full bg-primary/20 blur-3xl"
      />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:min-h-[80svh] lg:grid-cols-2 lg:py-24">
        <div className="space-y-6">
          <p className="inline-block rounded-full bg-primary px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white">
            Depuis {site.anneeFondation}
          </p>
          <h1 className="font-display text-5xl font-extrabold uppercase italic leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
            Votre salle de sport clé en main, chez vous ou dans votre hôtel
          </h1>
          <p className="max-w-xl text-lg text-text-muted">
            Vente, installation, maintenance et aménagement de salles de sport, neuf et occasion.{" "}
            {site.signature}
          </p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/machines">Voir les machines</ButtonLink>
            <ButtonLink href={devisHref} variant="outline">
              Devis gratuit
            </ButtonLink>
          </div>
        </div>
        <div className="mx-auto w-full max-w-md lg:max-w-lg">
          <Logo priority sizes="(max-width: 1024px) 90vw, 512px" />
        </div>
      </div>
    </section>
  );
}
