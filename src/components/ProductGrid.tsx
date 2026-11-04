import ProductCard from "@/components/ProductCard";
import type { Machine } from "@/types";

export default function ProductGrid({ machines }: { machines: Machine[] }) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {machines.map((m) => (
        <li key={`${m.categorie}/${m.slug}`} className="flex">
          <ProductCard machine={m} />
        </li>
      ))}
    </ul>
  );
}
