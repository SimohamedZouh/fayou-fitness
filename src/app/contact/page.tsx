import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Breadcrumb from "@/components/Breadcrumb";
import Section from "@/components/Section";
import Faq from "@/components/Faq";
import ButtonLink from "@/components/ButtonLink";
import { faq } from "@/data/faq";
import { site } from "@/data/site";
import { telLink, whatsappLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contact et devis gratuit",
  description:
    "Contactez FAYOU Fitness pour un devis gratuit : Casablanca, Marrakech, intervention dans tout le Maroc.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const wa = whatsappLink(
    site.whatsapp,
    "Bonjour FAYOU Fitness, je souhaite un devis pour une salle de sport.",
  );
  const tel = telLink(site.telephone);

  return (
    <>
      <PageHeader
        titre="Contact et devis gratuit"
        intro="Décrivez-nous votre projet : nous revenons vers vous avec un devis gratuit et sans engagement."
      >
        <Breadcrumb items={[{ label: "Accueil", href: "/" }, { label: "Contact" }]} />
      </PageHeader>

      <section className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2">
        <div className="space-y-6">
          <h2 className="font-display text-3xl font-extrabold uppercase italic">Nous écrire</h2>
          {/* Emplacement du formulaire LeadForm (étape 5). */}
          <div
            id="formulaire"
            className="space-y-4 rounded-2xl border border-dashed border-border bg-bg-alt p-6"
          >
            <p className="font-semibold">Le formulaire de devis arrive bientôt.</p>
            <p className="text-sm text-text-muted">
              En attendant, contactez-nous directement par WhatsApp ou par téléphone.
            </p>
            {wa && (
              <ButtonLink href={wa} external>
                <MessageCircle className="size-5" aria-hidden="true" />
                Écrire sur WhatsApp
              </ButtonLink>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="font-display text-3xl font-extrabold uppercase italic">Coordonnées</h2>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <MapPin className="mt-1 size-5 shrink-0 text-primary-text" aria-hidden="true" />
              <span>
                {site.villes.join(" · ")}
                <br />
                <span className="text-sm text-text-muted">{site.zoneIntervention}.</span>
                {/* À CONFIRMER : adresse précise */}
                {site.adresse && (
                  <>
                    <br />
                    {site.adresse}
                  </>
                )}
              </span>
            </li>
            {tel && site.telephone && (
              <li className="flex items-center gap-3">
                <Phone className="size-5 shrink-0 text-primary-text" aria-hidden="true" />
                <a href={tel} className="hover:underline">
                  {site.telephone}
                </a>
              </li>
            )}
            {wa && (
              <li className="flex items-center gap-3">
                <MessageCircle className="size-5 shrink-0 text-primary-text" aria-hidden="true" />
                <a href={wa} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  WhatsApp
                </a>
              </li>
            )}
            {site.email && (
              <li className="flex items-center gap-3">
                <Mail className="size-5 shrink-0 text-primary-text" aria-hidden="true" />
                <a href={`mailto:${site.email}`} className="hover:underline">
                  {site.email}
                </a>
              </li>
            )}
            {!tel && !wa && !site.email && (
              <li className="text-sm text-text-muted">
                Numéro de téléphone, WhatsApp et email : à confirmer.
              </li>
            )}
          </ul>

          <div className="overflow-hidden rounded-2xl border border-border">
            <iframe
              title="Carte de Casablanca (zone indicative)"
              src="https://www.openstreetmap.org/export/embed.html?bbox=-7.75%2C33.50%2C-7.45%2C33.66&layer=mapnik"
              loading="lazy"
              referrerPolicy="no-referrer"
              className="h-72 w-full"
            />
            <p className="bg-bg-alt px-4 py-2 text-xs text-text-muted">
              Carte indicative de Casablanca. L&apos;adresse précise sera communiquée prochainement.
            </p>
          </div>
        </div>
      </section>

      <Section alt title="Questions fréquentes">
        <Faq items={faq} />
      </Section>
    </>
  );
}
