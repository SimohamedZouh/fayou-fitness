import { serializeJsonLd } from "@/lib/seo";

/** Données structurées JSON-LD, sérialisées de façon sûre (`<` échappé). */
export default function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
