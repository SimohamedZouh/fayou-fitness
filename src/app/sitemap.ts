import type { MetadataRoute } from "next";
import { getCategories, getMachines } from "@/data/catalogue";
import { absoluteUrl } from "@/lib/seo";

const pages = ["/", "/machines", "/services", "/projets", "/a-propos", "/contact"];

/** Toutes les pages : 6 pages, les catégories et les fiches machines. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...pages.map((p) => ({ url: absoluteUrl(p), priority: p === "/" ? 1 : 0.8 })),
    ...getCategories().map((c) => ({ url: absoluteUrl(`/machines/${c.slug}`), priority: 0.7 })),
    ...getMachines().map((m) => ({
      url: absoluteUrl(`/machines/${m.categorie}/${m.slug}`),
      priority: 0.6,
    })),
  ];
}
