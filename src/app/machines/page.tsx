import { Suspense } from "react";
import type { Metadata } from "next";
import Filters from "@/components/Filters";
import PageHeader from "@/components/PageHeader";
import Breadcrumb from "@/components/Breadcrumb";
import ProductGrid from "@/components/ProductGrid";
import CategoryCard from "@/components/CategoryCard";
import CtaBanner from "@/components/CtaBanner";
import ButtonLink from "@/components/ButtonLink";
import Icon from "@/components/Icon";
import { getCategories, getMachines, getMachinesByCategorie } from "@/data/catalogue";
import { filtrerMachines, parseFiltres } from "@/lib/catalogue-filter";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Machines de sport neuves et d'occasion",
  description:
    "Catalogue FAYOU Fitness : cardio, musculation, racks et bancs, charges libres, training fonctionnel et aménagement. Neuf et occasion, sur devis.",
  path: "/machines",
});

const categories = getCategories();

async function Resultats({ searchParams }: { searchParams: PageProps<"/machines">["searchParams"] }) {
  const params = await searchParams;
  const slugs = categories.map((c) => c.slug);
  const filtres = parseFiltres(params, slugs);
  const machines = filtrerMachines(getMachines(), filtres, slugs);

  // Regroupement par catégorie (onglets + ancres) tant qu’aucun filtre ni tri inversé n’est actif.
  const groupe =
    !filtres.q && !filtres.cat && !filtres.etat && !filtres.usage && filtres.tri !== "nom-desc";
  const groupes = categories
    .map((c) => ({ categorie: c, liste: machines.filter((m) => m.categorie === c.slug) }))
    .filter((g) => g.liste.length > 0);

  return (
    <>
      <Filters categories={categories.map((c) => ({ slug: c.slug, nom: c.nom }))} total={machines.length} />
      <div className="mt-8">
        {machines.length > 0 && groupe ? (
          <>
            <nav
              aria-label="Catégories du catalogue"
              className="sticky top-16 z-10 -mx-4 mb-8 border-b border-border bg-bg/90 px-4 backdrop-blur sm:-mx-6 sm:px-6"
            >
              <ul className="flex gap-2 overflow-x-auto py-3">
                {groupes.map(({ categorie: c, liste }) => (
                  <li key={c.slug} className="shrink-0">
                    <a
                      href={`#${c.slug}`}
                      className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-semibold hover:border-primary hover:text-primary-text"
                    >
                      <Icon name={c.icone} className="size-4" />
                      {c.nom}
                      <span className="text-text-muted">({liste.length})</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="space-y-14">
              {groupes.map(({ categorie: c, liste }) => (
                <section
                  key={c.slug}
                  id={c.slug}
                  aria-labelledby={`titre-${c.slug}`}
                  className="scroll-mt-40"
                >
                  <h2
                    id={`titre-${c.slug}`}
                    className="mb-6 flex items-center gap-3 font-display text-3xl font-extrabold uppercase italic"
                  >
                    <Icon name={c.icone} className="size-7 text-primary-text" />
                    {c.nom}
                  </h2>
                  <ProductGrid machines={liste} />
                </section>
              ))}
            </div>
          </>
        ) : machines.length > 0 ? (
          <>
            <h2 className="sr-only">Résultats</h2>
            <ProductGrid machines={machines} />
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center">
            <p className="font-bold">Aucune machine ne correspond à votre recherche.</p>
            <p className="mt-2 text-text-muted">
              Modifiez les filtres ou décrivez-nous votre besoin : nous trouvons la bonne machine.
            </p>
            <div className="mt-5 flex justify-center">
              <ButtonLink href="/contact">Demander un devis</ButtonLink>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default function MachinesPage({ searchParams }: PageProps<"/machines">) {
  return (
    <>
      <PageHeader
        titre="Machines"
        intro="Neuf ou occasion, pour votre maison, votre hôtel ou votre salle professionnelle. Toutes les machines sont proposées sur devis."
      >
        <Breadcrumb items={[{ label: "Accueil", href: "/" }, { label: "Machines" }]} />
      </PageHeader>

      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
        <Suspense
          fallback={<p className="py-10 text-center text-text-muted">Chargement du catalogue…</p>}
        >
          <Resultats searchParams={searchParams} />
        </Suspense>
      </section>

      <section className="bg-bg-alt py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="mb-8 font-display text-3xl font-extrabold uppercase italic sm:text-4xl">
            Parcourir par catégorie
          </h2>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => (
              <li key={c.slug}>
                <CategoryCard categorie={c} count={getMachinesByCategorie(c.slug).length} />
              </li>
            ))}
          </ul>
        </div>
      </section>
      <CtaBanner />
    </>
  );
}
