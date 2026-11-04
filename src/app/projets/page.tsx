import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Breadcrumb from "@/components/Breadcrumb";
import ProjectCard from "@/components/ProjectCard";
import CtaBanner from "@/components/CtaBanner";
import { getProjets } from "@/data/projects";

export const metadata: Metadata = {
  title: "Projets : home gym, villas, riads, hôtels",
  description:
    "Home gym, villas, riads, hôtels et projets avant construction : FAYOU Fitness conçoit et installe la salle de sport adaptée à votre lieu.",
  alternates: { canonical: "/projets" },
};

export default function ProjetsPage() {
  return (
    <>
      <PageHeader
        titre="Nos types de projets"
        intro="Chaque lieu a ses contraintes. Nous concevons une salle adaptée à votre espace et à votre usage."
      >
        <Breadcrumb items={[{ label: "Accueil", href: "/" }, { label: "Projets" }]} />
      </PageHeader>
      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6">
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {getProjets().map((p) => (
            <li key={p.slug}>
              <ProjectCard projet={p} detail />
            </li>
          ))}
        </ul>
        <p className="mt-10 max-w-2xl rounded-2xl border border-dashed border-border p-5 text-sm text-text-muted">
          Les photos de nos réalisations seront ajoutées prochainement.
        </p>
      </section>
      <CtaBanner />
    </>
  );
}
