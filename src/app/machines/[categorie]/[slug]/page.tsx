import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import AddToQuoteButton from "@/components/AddToQuoteButton";
import ButtonLink from "@/components/ButtonLink";
import ProductGrid from "@/components/ProductGrid";
import { EtatBadges, ProductVisual } from "@/components/ProductCard";
import { SectionTitle } from "@/components/Section";
import { getCategorieBySlug, getMachine, getMachineParams, getMachinesSimilaires } from "@/data/catalogue";
import { devisHref } from "@/data/navigation";
import { site } from "@/data/site";
import { USAGE_LABELS } from "@/lib/catalogue-filter";
import { whatsappLink } from "@/lib/whatsapp";

export function generateStaticParams() {
  return getMachineParams();
}

export async function generateMetadata({
  params,
}: PageProps<"/machines/[categorie]/[slug]">): Promise<Metadata> {
  const { categorie, slug } = await params;
  const machine = getMachine(categorie, slug);
  if (!machine) return { title: "Machine introuvable" };
  return {
    title: `${machine.nom} : neuf et occasion`,
    description: `${machine.description} Sur devis, installation et maintenance par FAYOU Fitness.`,
    alternates: { canonical: `/machines/${machine.categorie}/${machine.slug}` },
  };
}

export default async function MachinePage({ params }: PageProps<"/machines/[categorie]/[slug]">) {
  const { categorie, slug } = await params;
  const machine = getMachine(categorie, slug);
  const cat = getCategorieBySlug(categorie);
  if (!machine || !cat) notFound();

  const similaires = getMachinesSimilaires(machine, 4);
  const specs = machine.specs ? Object.entries(machine.specs) : [];
  const wa = whatsappLink(
    site.whatsapp,
    `Bonjour FAYOU Fitness, je souhaite un devis pour : ${machine.nom}.`,
  );

  return (
    <>
      <div className="border-b border-border bg-bg-alt">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          <Breadcrumb
            items={[
              { label: "Accueil", href: "/" },
              { label: "Machines", href: "/machines" },
              { label: cat.nom, href: `/machines/${cat.slug}` },
              { label: machine.nom },
            ]}
          />
        </div>
      </div>

      <article className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2">
        <ProductVisual machine={machine} className="aspect-[4/3] rounded-2xl border border-border" />

        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-sm font-bold uppercase tracking-wide text-primary-text">
              {cat.nom} · {machine.sousCategorie}
            </p>
            <SectionTitle as="h1" className="text-4xl sm:text-5xl">
              {machine.nom}
            </SectionTitle>
            <div className="flex flex-wrap gap-2">
              <EtatBadges etat={machine.etat} />
              {machine.usages.map((u) => (
                <span key={u} className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-white">
                  {USAGE_LABELS[u]}
                </span>
              ))}
            </div>
          </div>

          <p className="text-lg text-text-muted">{machine.description}</p>
          <p className="flex gap-2 font-semibold">
            <Check className="mt-1 size-5 shrink-0 text-primary-text" aria-hidden="true" />
            {machine.benefice}
          </p>

          {machine.variantes && (
            <div>
              <h2 className="mb-2 font-bold">Variantes</h2>
              <ul className="flex flex-wrap gap-2">
                {machine.variantes.map((v) => (
                  <li key={v} className="rounded-full border border-border px-3 py-1 text-sm">
                    {v}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {machine.muscles && (
            <div>
              <h2 className="mb-2 font-bold">Muscles sollicités</h2>
              <ul className="flex flex-wrap gap-2">
                {machine.muscles.map((m) => (
                  <li key={m} className="rounded-full border border-border px-3 py-1 text-sm">
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {specs.length > 0 && (
            <div>
              <h2 className="mb-2 font-bold">Caractéristiques</h2>
              <dl className="divide-y divide-border rounded-xl border border-border text-sm">
                {specs.map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 px-4 py-2">
                    <dt className="text-text-muted">{k}</dt>
                    <dd className="font-semibold">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-sm text-text-muted">Prix</p>
            <p className="font-display text-3xl font-extrabold uppercase italic">{machine.prix}</p>
            <p className="mt-1 text-sm text-text-muted">
              Devis gratuit et sans engagement, installation et maintenance possibles.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <AddToQuoteButton slug={machine.slug} categorie={machine.categorie} nom={machine.nom} />
              <ButtonLink href={devisHref}>Demander un devis</ButtonLink>
              {wa && (
                <ButtonLink href={wa} external variant="outline">
                  WhatsApp
                </ButtonLink>
              )}
            </div>
          </div>
        </div>
      </article>

      {similaires.length > 0 && (
        <section className="bg-bg-alt py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <h2 className="mb-8 font-display text-3xl font-extrabold uppercase italic">
              Dans la même catégorie
            </h2>
            <ProductGrid machines={similaires} />
          </div>
        </section>
      )}
    </>
  );
}
