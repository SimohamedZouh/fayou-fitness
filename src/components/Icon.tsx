import { icons } from "lucide-react";
import type { IconName } from "@/types";

/** Icône Lucide par nom (Server Component : aucun surcoût côté client). */
export default function Icon({ name, className }: { name: IconName; className?: string }) {
  const Cmp = icons[name];
  return <Cmp className={className} aria-hidden="true" />;
}
