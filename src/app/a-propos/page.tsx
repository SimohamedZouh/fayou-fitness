import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Breadcrumb from "@/components/Breadcrumb";
import Section from "@/components/Section";
import CtaBanner from "@/components/CtaBanner";
import Icon from "@/components/Icon";
import { site } from "@/data/site";
import { getAnneeCourante } from "@/lib/annee";

export const metadata: Metadata = {
  title: "À propos : FAYOU Fitness depuis 2006",
  description:
    "FAYOU Fitness équipe les salles de sport depuis 2006 à Casablanca et Marrakech. Qualité, Performance, Confiance.",
  alternates: { canonical: "/a-propos" },
};

const valeurs = [
  {
    titre: "Qualité",
    texte: "Du matériel neuf ou d'occasion contrôlé et garanti, une installation soignée.",
    icone: "BadgeCheck",
  },
  {
    titre: "Performance",
    texte: "Des machines choisies pour durer et pour répondre à l'usage réel de votre salle.",
    icone: "Gauge",
  },
  {
    titre: "Confiance",
    texte: "Un devis clair, un interlocuteur unique et un suivi dans la durée.",
    icone: "Handshake",
  },
] as const;

export default async function AProposPage() {
  const annee = await getAnneeCourante();
  return (
    <>
      <PageHeader
        titre="À propos de FAYOU Fitness"
        intro={`${site.signature} Depuis ${site.anneeFondation}.`}
      >
        <Breadcrumb items={[{ label: "Accueil", href: "/" }, { label: "À propos" }]} />
      </PageHeader>

      <section className="mx-auto w-full max-w-4xl space-y-5 px-4 py-14 text-lg sm:px-6">
        <h2 className="font-display text-3xl font-extrabold uppercase italic sm:text-4xl">
          Notre histoire
        </h2>
        <p>
          FAYOU Fitness a été fondée en {site.anneeFondation}. Depuis {annee - site.anneeFondation} ans,
          nous équipons des salles de sport au Maroc, depuis {site.villes.join(" et ")}.
        </p>
        <p className="text-text-muted">
          Notre métier : la vente de matériel neuf et d&apos;occasion, l&apos;installation, la
          maintenance et l&apos;aménagement de salles de sport. Nous accompagnons les particuliers
          (home gym, villas, riads), les hôtels et les porteurs de projets avant construction.
        </p>
        <p className="text-text-muted">{site.zoneIntervention}.</p>
      </section>

      <Section alt title="Nos valeurs" intro={site.signature}>
        <ul className="grid gap-6 md:grid-cols-3">
          {valeurs.map((v) => (
            <li key={v.titre} className="space-y-3 rounded-2xl border border-border bg-card p-6">
              <span className="inline-flex size-12 items-center justify-center rounded-xl bg-primary text-white">
                <Icon name={v.icone} className="size-6" />
              </span>
              <h3 className="font-display text-2xl font-extrabold uppercase italic">{v.titre}</h3>
              <p className="text-text-muted">{v.texte}</p>
            </li>
          ))}
        </ul>
      </Section>
      <CtaBanner />
    </>
  );
}
