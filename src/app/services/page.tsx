import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Breadcrumb from "@/components/Breadcrumb";
import ServiceCard from "@/components/ServiceCard";
import CtaBanner from "@/components/CtaBanner";
import { getServices } from "@/data/services";

export const metadata: Metadata = {
  title: "Services : vente, installation, maintenance, aménagement",
  description:
    "Vente, installation, maintenance, aménagement et étude de projet : FAYOU Fitness vous accompagne de l'étude au suivi de votre salle de sport.",
  alternates: { canonical: "/services" },
};

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
          {getServices().map((s) => (
            <li key={s.slug}>
              <ServiceCard service={s} detail />
            </li>
          ))}
        </ul>
      </section>
      <CtaBanner />
    </>
  );
}
