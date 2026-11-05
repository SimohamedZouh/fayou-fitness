import type { Metadata } from "next";
import { site } from "@/data/site";
import type { FaqItem } from "@/data/faq";
import type { Categorie, Machine } from "@/types";

/** URL absolue à partir d'un chemin du site. */
export function absoluteUrl(path = "/"): string {
  return new URL(path, site.url).toString();
}

/**
 * Sérialise un objet JSON-LD pour une balise <script>. Le caractère `<` est échappé
 * (et U+2028 / U+2029) pour qu'aucune donnée ne puisse fermer la balise.
 */
const BACKSLASH = String.fromCharCode(92);
const SEPARATEURS = [0x2028, 0x2029].map((c) => String.fromCharCode(c));

export function serializeJsonLd(data: unknown): string {
  let json = JSON.stringify(data).split("<").join(BACKSLASH + "u003c");
  for (const sep of SEPARATEURS) {
    json = json.split(sep).join(BACKSLASH + "u" + sep.charCodeAt(0).toString(16));
  }
  return json;
}

interface PageMeta {
  title: string;
  description: string;
  path: string;
  /** Titre sans le suffixe « | FAYOU Fitness » (page d'accueil). */
  absolute?: boolean;
}

/** Metadata d'une page : titre, description, canonical, Open Graph et Twitter. */
export function pageMetadata({ title, description, path, absolute = false }: PageMeta): Metadata {
  return {
    title: absolute ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "fr_MA",
      siteName: site.nom,
      title: absolute ? title : `${title} | ${site.nom}`,
      description,
      url: path,
    },
    twitter: { card: "summary_large_image" },
  };
}

/** LocalBusiness : téléphone, email et adresse uniquement s'ils sont renseignés. */
export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": absoluteUrl("/#entreprise"),
    name: site.nom,
    slogan: site.signature,
    description: site.baseline,
    url: absoluteUrl("/"),
    logo: absoluteUrl("/brand/logo-light.webp"),
    image: absoluteUrl("/opengraph-image.png"),
    foundingDate: String(site.anneeFondation),
    areaServed: { "@type": "Country", name: "Maroc" },
    location: site.villes.map((ville) => ({
      "@type": "Place",
      name: `${site.nom} ${ville}`,
      address: { "@type": "PostalAddress", addressLocality: ville, addressCountry: "MA" },
    })),
    ...(site.telephone ? { telephone: site.telephone } : {}),
    ...(site.email ? { email: site.email } : {}),
    ...(site.adresse
      ? { address: { "@type": "PostalAddress", streetAddress: site.adresse, addressCountry: "MA" } }
      : {}),
  };
}

/** Product sans prix, sans offre et sans marque (aucune donnée fournie par FAYOU). */
export function productJsonLd(machine: Machine, categorie: Categorie) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: machine.nom,
    description: machine.description,
    category: categorie.nom,
    url: absoluteUrl(`/machines/${machine.categorie}/${machine.slug}`),
  };
}

export function faqJsonLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.question,
      acceptedAnswer: { "@type": "Answer", text: it.reponse },
    })),
  };
}

export function breadcrumbJsonLd(items: { label: string; href?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.label,
      ...(it.href ? { item: absoluteUrl(it.href) } : {}),
    })),
  };
}
