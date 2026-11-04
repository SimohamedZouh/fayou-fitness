import { MessageCircle } from "lucide-react";
import CallButton from "@/components/CallButton";
import { site } from "@/data/site";
import { telLink, whatsappLink } from "@/lib/whatsapp";

/** Boutons flottants WhatsApp + Appeler (zones sûres iOS respectées). */
export default function WhatsAppFab() {
  const wa = whatsappLink(
    site.whatsapp,
    "Bonjour FAYOU Fitness, je souhaite un devis pour une salle de sport.",
  );
  if (!wa && !telLink(site.telephone)) return null;

  return (
    <div className="pointer-events-none fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-[calc(1rem+env(safe-area-inset-right))] z-30 flex flex-col items-end gap-3">
      <CallButton />
      {wa && (
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Discuter sur WhatsApp (nouvel onglet)"
          className="pointer-events-auto inline-flex size-14 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100"
        >
          <MessageCircle className="size-7" aria-hidden="true" />
        </a>
      )}
    </div>
  );
}
