import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Section from "@/components/Section";
import CategoryCard from "@/components/CategoryCard";
import ServiceCard from "@/components/ServiceCard";
import ProjectCard from "@/components/ProjectCard";
import Faq from "@/components/Faq";
import CtaBanner from "@/components/CtaBanner";
import Icon from "@/components/Icon";
import { getCategories, getMachinesByCategorie } from "@/data/catalogue";
import { faq } from "@/data/faq";
import { getProjets } from "@/data/projects";
import { getServices } from "@/data/services";
import { getChiffresCles, site } from "@/data/site";
import { getAnneeCourante } from "@/lib/annee";

export const metadata: Metadata = {
  title: { absolute: "FAYOU Fitness : salles de sport clé en main, neuf et occasion" },
  description:
    "Vente, installation, maintenance et aménagement de salles de sport au Maroc, pour home gym, villas, riads et hôtels. Depuis 2006. Qualité. Performance. Confiance.",
  alternates: { canonical: "/" },
};

const methode = [
  { titre: "Étude", texte: "Visite, relevé des mesures et analyse de vos besoins.", icone: "ClipboardList" },
  { titre: "Conception", texte: "Plan d'implantation et choix des machines selon votre espace.", icone: "Ruler" },
  { titre: "Installation", texte: "Livraison, montage, réglage et mise en service.", icone: "Truck" },
  { titre: "Suivi", texte: "Prise en main, maintenance et accompagnement dans la durée.", icone: "Wrench" },
] as const;

export default async function Home() {
  const annee = await getAnneeCourante();
  const categories = getCategories();
  const chiffres = getChiffresCles(annee).filter((c) => c.valeur !== null);

  const pourquoi = [
    {
      titre: `${annee - site.anneeFondation} ans d'expérience`,
      texte: `Une équipe spécialisée dans les salles de sport depuis ${site.anneeFondation}.`,
      icone: "Award",
    },
    {
      titre: "Neuf et occasion",
      texte: "Du matériel neuf ou d'occasion contrôlé et garanti, selon votre budget.",
      icone: "BadgeCheck",
    },
    {
      titre: "Clé en main",
      texte: "Étude, vente, installation et maintenance : un seul interlocuteur.",
      icone: "KeyRound",
    },
    {
      titre: "Partout au Maroc",
      texte: `Basés à ${site.villes.join(" et ")}. ${site.zoneIntervention}.`,
      icone: "MapPin",
    },
  ] as const;

  return (
    <>
      <Hero />
      <Marquee items={categories.map((c) => ({ label: c.nom, icone: c.icone }))} />

      {chiffres.length > 0 && (
        <section aria-label="Chiffres clés" className="border-b border-border">
          <ul className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
            {chiffres.map((c) => (
              <li key={c.cle} className="text-center">
                <p className="font-display text-6xl font-extrabold italic text-primary-text">
                  {c.valeur}
                  {c.suffixe}
                </p>
                <p className="text-sm font-semibold uppercase tracking-wide text-text-muted">
                  {c.libelle}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <Section
        title="Nos catégories"
        intro="Tout le matériel pour équiper une salle complète, du cardio à l'aménagement."
      >
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <li key={c.slug}>
              <CategoryCard categorie={c} count={getMachinesByCategorie(c.slug).length} />
            </li>
          ))}
        </ul>
      </Section>

      <Section
        alt
        title="Nos services"
        intro="De l'étude à la maintenance, nous accompagnons chaque étape de votre projet."
      >
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {getServices().map((s) => (
            <li key={s.slug}>
              <ServiceCard service={s} />
            </li>
          ))}
        </ul>
        <Link
          href="/services"
          className="mt-8 inline-flex items-center gap-2 font-bold text-primary-text hover:underline"
        >
          Tous les détails <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </Section>

      <Section title="Pour quels projets ?" intro="Chaque lieu a ses contraintes : nous adaptons la salle à votre espace.">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {getProjets().map((p) => (
            <li key={p.slug}>
              <ProjectCard projet={p} />
            </li>
          ))}
        </ul>
      </Section>

      <Section alt title="Notre méthode" intro="Quatre étapes simples, de la première visite au suivi.">
        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {methode.map((m, i) => (
            <li key={m.titre} className="relative rounded-2xl border border-border bg-card p-6">
              <span className="font-display text-5xl font-extrabold italic text-primary-text/30">
                {i + 1}
              </span>
              <div className="mt-2 flex items-center gap-3">
                <Icon name={m.icone} className="size-6 text-primary-text" />
                <h3 className="font-display text-2xl font-extrabold uppercase italic">{m.titre}</h3>
              </div>
              <p className="mt-2 text-sm text-text-muted">{m.texte}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="Pourquoi FAYOU" intro={site.signature}>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pourquoi.map((p) => (
            <li key={p.titre} className="space-y-3">
              <span className="inline-flex size-12 items-center justify-center rounded-xl bg-primary text-white">
                <Icon name={p.icone} className="size-6" />
              </span>
              <h3 className="text-lg font-bold">{p.titre}</h3>
              <p className="text-sm text-text-muted">{p.texte}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section alt title="Questions fréquentes">
        <Faq items={faq} />
      </Section>

      <CtaBanner />
    </>
  );
}
