import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Breadcrumb from "@/components/Breadcrumb";
import Section from "@/components/Section";
import Faq from "@/components/Faq";
import JsonLd from "@/components/JsonLd";
import LeadForm from "@/components/LeadForm";
import { faq } from "@/data/faq";
import { site } from "@/data/site";
import { telLink, whatsappLink } from "@/lib/whatsapp";
import { faqJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact et devis gratuit",
  description:
    "Contactez FAYOU Fitness pour un devis gratuit : Casablanca, Marrakech, intervention dans tout le Maroc.",
  path: "/contact",
});

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
          <div id="devis" className="scroll-mt-28">
            <LeadForm />
          </div>
          {wa && (
            <p className="text-sm text-text-muted">
              Vous préférez nous écrire directement ?{" "}
              <a href={wa} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary-text underline">
                Écrire sur WhatsApp
              </a>
            </p>
          )}
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

          <div className="space-y-3 rounded-2xl border border-border bg-bg-alt p-5">
            <p className="font-semibold">Où nous trouver</p>
            <p className="text-sm text-text-muted">
              Basés à {site.villes.join(" et ")}. L&apos;adresse précise sera communiquée prochainement.
            </p>
            <ul className="flex flex-wrap gap-2">
              {site.villes.map((ville) => (
                <li key={ville}>
                  <a
                    href={`https://www.openstreetmap.org/search?query=${encodeURIComponent(`${ville}, Maroc`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-primary px-4 text-sm font-bold text-primary-text hover:bg-primary hover:text-white"
                  >
                    <MapPin className="size-4" aria-hidden="true" />
                    Voir {ville} sur la carte
                    <span className="sr-only"> (nouvel onglet)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <Section alt title="Questions fréquentes">
        <Faq items={faq} />
        <JsonLd data={faqJsonLd(faq)} />
      </Section>
    </>
  );
}
