import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import PageHeader from "@/components/PageHeader";
import ProductGrid from "@/components/ProductGrid";
import CtaBanner from "@/components/CtaBanner";
import Icon from "@/components/Icon";
import {
  getCategorieBySlug,
  getCategorieParams,
  getCategories,
  getMachinesByCategorie,
  getMachinesBySousCategorie,
} from "@/data/catalogue";

export function generateStaticParams() {
  return getCategorieParams();
}

export async function generateMetadata({ params }: PageProps<"/machines/[categorie]">): Promise<Metadata> {
  const { categorie } = await params;
  const cat = getCategorieBySlug(categorie);
  if (!cat) return { title: "Catégorie introuvable" };
  return {
    title: `${cat.nom} : matériel neuf et d'occasion`,
    description: `${cat.description} Neuf et occasion, sur devis, avec FAYOU Fitness.`,
    alternates: { canonical: `/machines/${cat.slug}` },
  };
}

export default async function CategoriePage({ params }: PageProps<"/machines/[categorie]">) {
  const { categorie } = await params;
  const cat = getCategorieBySlug(categorie);
  if (!cat) notFound();

  const total = getMachinesByCategorie(cat.slug).length;
  const autres = getCategories().filter((c) => c.slug !== cat.slug);

  return (
    <>
      <PageHeader titre={cat.nom} intro={`${cat.description} ${total} machines, toutes sur devis.`}>
        <Breadcrumb
          items={[
            { label: "Accueil", href: "/" },
            { label: "Machines", href: "/machines" },
            { label: cat.nom },
          ]}
        />
      </PageHeader>

      <div className="sticky top-16 z-10 border-b border-border bg-bg/90 backdrop-blur">
        <nav aria-label={`Familles de ${cat.nom}`} className="mx-auto max-w-7xl overflow-x-auto px-4 sm:px-6">
          <ul className="flex gap-2 py-3">
            {cat.sousCategories.map((s) => (
              <li key={s.slug} className="shrink-0">
                <Link
                  href={`#${s.slug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold hover:border-primary hover:text-primary-text"
                >
                  <Icon name={s.icone} className="size-4" />
                  {s.nom}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="mx-auto w-full max-w-7xl space-y-14 px-4 py-12 sm:px-6">
        {cat.sousCategories.map((s) => {
          const liste = getMachinesBySousCategorie(cat.slug, s.slug);
          if (liste.length === 0) return null;
          return (
            <section key={s.slug} id={s.slug} className="scroll-mt-40">
              <h2 className="mb-6 flex items-center gap-3 font-display text-3xl font-extrabold uppercase italic">
                <Icon name={s.icone} className="size-7 text-primary-text" />
                {s.nom}
              </h2>
              <ProductGrid machines={liste} />
            </section>
          );
        })}
      </div>

      <section className="bg-bg-alt py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="mb-4 font-bold">Autres catégories</h2>
          <ul className="flex flex-wrap gap-2">
            {autres.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/machines/${c.slug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold hover:border-primary hover:text-primary-text"
                >
                  <Icon name={c.icone} className="size-4" />
                  {c.nom}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <CtaBanner />
    </>
  );
}
