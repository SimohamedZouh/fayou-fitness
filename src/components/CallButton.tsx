import { Phone } from "lucide-react";
import { site } from "@/data/site";
import { telLink } from "@/lib/whatsapp";

/** Bouton « Appeler » : masqué si aucun numéro n'est configuré. */
export default function CallButton() {
  const href = telLink(site.telephone);
  if (!href) return null;
  return (
    <a
      href={href}
      aria-label="Appeler FAYOU Fitness"
      className="pointer-events-auto inline-flex size-12 items-center justify-center rounded-full border border-border bg-card text-primary-text shadow-lg transition-transform hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100"
    >
      <Phone className="size-5" aria-hidden="true" />
    </a>
  );
}
