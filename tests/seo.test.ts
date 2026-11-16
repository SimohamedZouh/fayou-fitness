import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import robots from "@/app/robots";
import manifest from "@/app/manifest";
import { getCategories, getMachines } from "@/data/catalogue";
import { faq } from "@/data/faq";
import { site } from "@/data/site";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  localBusinessJsonLd,
  productJsonLd,
  serializeJsonLd,
} from "@/lib/seo";

describe("sitemap / robots / manifest", () => {
  const urls = sitemap().map((e) => e.url);

  it("contient les 6 pages, les 6 catégories et toutes les fiches (83)", () => {
    expect(getMachines()).toHaveLength(83);
    expect(getCategories()).toHaveLength(6);
    expect(urls.filter((u) => /\/machines\/[^/]+\/[^/]+$/.test(u))).toHaveLength(83);
    expect(urls.filter((u) => /\/machines\/[^/]+$/.test(u))).toHaveLength(6);
    for (const p of ["/services", "/projets", "/a-propos", "/contact", "/machines"]) {
      expect(urls.some((u) => u.endsWith(p))).toBe(true);
    }
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("robots pointe vers le sitemap et bloque /api/", () => {
    const r = robots();
    expect(String(r.sitemap)).toMatch(/\/sitemap\.xml$/);
    expect(JSON.stringify(r.rules)).toContain("/api/");
  });

  it("manifest en français avec le violet de la charte", () => {
    const m = manifest();
    expect(m.lang).toBe("fr");
    expect(m.theme_color).toBe("#7f00fb");
  });
});

describe("JSON-LD", () => {
  it("Product : fiches « Sur devis » sans prix, offre ni marque", () => {
    for (const m of getMachines().filter((x) => x.prix === "Sur devis")) {
      const cat = getCategories().find((c) => c.slug === m.categorie)!;
      const json = JSON.stringify(productJsonLd(m, cat)).toLowerCase();
      expect(json).toContain('"@type":"product"');
      for (const interdit of ["offers", "price", "brand", "itemcondition"]) expect(json).not.toContain(interdit);
    }
  });

  it("Product : machines du catalogue V5 avec marque, modèle, état et offre en MAD", () => {
    const stock = getMachines().filter((x) => typeof x.prix === "number");
    expect(stock).toHaveLength(9);
    for (const m of stock) {
      const cat = getCategories().find((c) => c.slug === m.categorie)!;
      const ld = productJsonLd(m, cat) as { brand: { name: string }; model: string; itemCondition: string; offers: object };
      expect(ld.brand.name).toBe(m.marque);
      expect(ld.model).toBe(m.modele);
      expect(ld.itemCondition).toBe("https://schema.org/RefurbishedCondition");
      expect(ld.offers).toMatchObject({
        price: m.prix,
        priceCurrency: "MAD",
        availability: "https://schema.org/InStock",
      });
      expect("image" in (ld as object)).toBe(Boolean(m.images?.length));
    }
  });

  it("LocalBusiness : foundingDate 2006, Maroc, coordonnées seulement si renseignées", () => {
    const lb = localBusinessJsonLd() as Record<string, unknown>;
    expect(lb.foundingDate).toBe("2006");
    expect(JSON.stringify(lb.areaServed)).toContain("Maroc");
    expect("telephone" in lb).toBe(site.telephone !== null);
    expect("email" in lb).toBe(site.email !== null);
    expect("address" in lb).toBe(site.adresse !== null);
  });

  it("FAQPage et BreadcrumbList", () => {
    const f = faqJsonLd(faq) as { mainEntity: unknown[] };
    expect(f.mainEntity).toHaveLength(faq.length);
    const b = breadcrumbJsonLd([{ label: "Accueil", href: "/" }, { label: "Machines" }]) as {
      itemListElement: { position: number; item?: string }[];
    };
    expect(b.itemListElement.map((i) => i.position)).toEqual([1, 2]);
    expect(b.itemListElement[1].item).toBeUndefined();
  });

  it("la sérialisation échappe le caractère « < » (aucune fermeture de balise possible)", () => {
    const out = serializeJsonLd({ a: "</script><script>alert(1)</script>" });
    expect(out).not.toContain("<");
    expect(JSON.parse(out).a).toBe("</script><script>alert(1)</script>");
  });
});
