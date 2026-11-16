import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import AddToQuoteButton from "@/components/AddToQuoteButton";
import JsonLd from "@/components/JsonLd";
import ButtonLink from "@/components/ButtonLink";
import ProductGrid from "@/components/ProductGrid";
import { EtatBadges, ProductVisual } from "@/components/ProductCard";
import ProductGallery from "@/components/ProductGallery";
import { SectionTitle } from "@/components/Section";
import { getCategorieBySlug, getMachine, getMachineParams, getMachinesSimilaires } from "@/data/catalogue";
import { devisHref } from "@/data/navigation";
import { site } from "@/data/site";
import { etatLibelle, USAGE_LABELS } from "@/lib/catalogue-filter";
import { formatPrix } from "@/lib/prix";
import { breadcrumbJsonLd, pageMetadata, productJsonLd } from "@/lib/seo";
import { whatsappLink } from "@/lib/whatsapp";

/** Slug inconnu : HTTP 404 dès la première requête (pas de soft 404). */
export const ensureStatic = "navigation";

/** « Matrix T5x (console LED) » devient « Matrix T5x ». */
const nomCourt = (nom: string) => nom.replace(/\s*\([^)]*\)\s*$/, "");

export function generateStaticParams() {
  return getMachineParams();
}

export async function generateMetadata({
  params,
}: PageProps<"/machines/[categorie]/[slug]">): Promise<Metadata> {
  const { categorie, slug } = await params;
  const machine = getMachine(categorie, slug);
  if (!machine) return { title: "Machine introuvable" };
  if (typeof machine.prix === "number") {
    // Machine du catalogue V5 : titre avec état et prix, description avec 2 à 3 specs clés.
    const specsCles = Object.entries(machine.specs ?? {})
      .slice(0, 3)
      .map(([k, v]) => `${k} : ${v.replace(/\s*\([^)]*\)/g, "")}`)
      .join(" · ");
    return pageMetadata({
      title: `${nomCourt(machine.nom)} d'occasion révisée – ${formatPrix(machine.prix)}`,
      description: `${specsCles}. Garantie ${machine.garantie ?? "12 mois"}, livraison gratuite à Casablanca. FAYOU Fitness.`,
      path: `/machines/${machine.categorie}/${machine.slug}`,
    });
  }
  return pageMetadata({
    title: `${machine.nom} : neuf et occasion`,
    description: `${machine.description} Sur devis, installation et maintenance par FAYOU Fitness.`,
    path: `/machines/${machine.categorie}/${machine.slug}`,
  });
}

export default async function MachinePage({ params }: PageProps<"/machines/[categorie]/[slug]">) {
  const { categorie, slug } = await params;
  const machine = getMachine(categorie, slug);
  const cat = getCategorieBySlug(categorie);
  if (!machine || !cat) notFound();

  const fil = [
    { label: "Accueil", href: "/" },
    { label: "Machines", href: "/machines" },
    { label: cat.nom, href: `/machines/${cat.slug}` },
    { label: machine.nom, href: `/machines/${machine.categorie}/${machine.slug}` },
  ];
  const similaires = getMachinesSimilaires(machine, 4);
  const specs = machine.specs ? Object.entries(machine.specs) : [];
  const enStock = typeof machine.prix === "number";
  const detail = [machine.marque, machine.modele].filter(Boolean).join(" ");
  const wa = whatsappLink(
    site.whatsapp,
    `Bonjour FAYOU Fitness, je souhaite un devis pour : ${machine.nom}${
      detail ? ` (${detail})` : ""
    }${enStock ? `, prix affiché : ${formatPrix(machine.prix)}` : ""}.`,
  );
  const identite: [string, string][] = [
    ...(machine.marque ? ([["Marque", machine.marque]] as [string, string][]) : []),
    ...(machine.modele ? ([["Modèle", machine.modele]] as [string, string][]) : []),
    ...(enStock ? ([["État", machine.etat.map((e) => etatLibelle(machine, e)).join(" · ")]] as [string, string][]) : []),
    ...(machine.garantie ? ([["Garantie", machine.garantie]] as [string, string][]) : []),
  ];

  return (
    <>
      <div className="border-b border-border bg-bg-alt">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          <Breadcrumb items={[...fil.slice(0, 3), { label: machine.nom }]} />
          <JsonLd data={[productJsonLd(machine, cat), breadcrumbJsonLd(fil)]} />
        </div>
      </div>

      <article className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2">
        <ProductGallery
          nom={machine.nom}
          images={machine.images}
          fallback={
            <ProductVisual machine={machine} className="aspect-[4/3] rounded-2xl border border-border" />
          }
        />

        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-sm font-bold uppercase tracking-wide text-primary-text">
              {cat.nom} · {machine.sousCategorie}
            </p>
            <SectionTitle as="h1" className="text-4xl sm:text-5xl">
              {machine.nom}
            </SectionTitle>
            <div className="flex flex-wrap gap-2">
              <EtatBadges machine={machine} />
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

          {identite.length > 0 && (
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border text-sm">
              {identite.map(([k, v]) => (
                <div key={k} className="bg-card px-4 py-2">
                  <dt className="text-text-muted">{k}</dt>
                  <dd className="font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
          )}

          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-sm text-text-muted">Prix</p>
            <p className="font-display text-3xl font-extrabold uppercase italic">{formatPrix(machine.prix)}</p>
            <p className="mt-1 text-sm text-text-muted">
              {enStock
                ? `Livraison gratuite à Casablanca · garantie ${machine.garantie ?? "12 mois"} · installation possible. Autres villes sur demande.`
                : "Devis gratuit et sans engagement, installation et maintenance possibles."}
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

      {specs.length > 0 && (
        <section aria-labelledby="fiche-technique" className="mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6">
          <h2 id="fiche-technique" className="mb-4 font-display text-3xl font-extrabold uppercase italic">
            Fiche technique
          </h2>
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <dl className="-mb-px grid text-sm md:grid-cols-2">
              {specs.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 border-b border-border px-4 py-3 md:odd:border-r">
                  <dt className="text-text-muted">{k}</dt>
                  <dd className="text-right font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

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
