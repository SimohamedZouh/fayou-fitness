import ButtonLink from "@/components/ButtonLink";
import { devisHref } from "@/data/navigation";
import { site } from "@/data/site";
import { whatsappLink } from "@/lib/whatsapp";

export default function CtaBanner() {
  const wa = whatsappLink(
    site.whatsapp,
    "Bonjour FAYOU Fitness, je souhaite un devis pour une salle de sport.",
  );
  return (
    <section className="on-primary bg-primary text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 py-14 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl space-y-2">
          <h2 className="font-display text-3xl font-extrabold uppercase italic leading-tight sm:text-4xl">
            Parlons de votre projet de salle de sport
          </h2>
          <p className="text-white/90">Devis gratuit et sans engagement. {site.zoneIntervention}.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href={devisHref} variant="white">
            Devis gratuit
          </ButtonLink>
          {wa && (
            <ButtonLink href={wa} external variant="ghost-white">
              WhatsApp
            </ButtonLink>
          )}
        </div>
      </div>
    </section>
  );
}
