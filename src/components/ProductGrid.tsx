import AnimatedGrid from "@/components/AnimatedGrid";
import ProductCard from "@/components/ProductCard";
import type { Machine } from "@/types";

export default function ProductGrid({ machines }: { machines: Machine[] }) {
  return (
    <AnimatedGrid
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      items={machines.map((m) => ({
        key: `${m.categorie}/${m.slug}`,
        node: <ProductCard machine={m} />,
      }))}
    />
  );
}
