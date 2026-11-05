import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Breadcrumb from "@/components/Breadcrumb";
import ServiceCard from "@/components/ServiceCard";
import CtaBanner from "@/components/CtaBanner";
import Reveal from "@/components/Reveal";
import { staggerDelay } from "@/lib/stagger";
import { getServices } from "@/data/services";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Services : vente, installation, maintenance, aménagement",
  description:
    "Vente, installation, maintenance, aménagement et étude de projet : FAYOU Fitness vous accompagne de l'étude au suivi de votre salle de sport.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        titre="Nos services"
        intro="Un accompagnement complet pour votre salle de sport, de l'étude à la maintenance."
      >
        <Breadcrumb items={[{ label: "Accueil", href: "/" }, { label: "Services" }]} />
      </PageHeader>
      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6">
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {getServices().map((s, i) => (
            <Reveal as="li" key={s.slug} delay={staggerDelay(i)}>
              <ServiceCard service={s} detail />
            </Reveal>
          ))}
        </ul>
      </section>
      <CtaBanner />
    </>
  );
}
