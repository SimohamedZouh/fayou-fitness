import Link from "next/link";
import { cacheLife } from "next/cache";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import Logo from "@/components/Logo";
import { getCategories } from "@/data/catalogue";
import { navLinks } from "@/data/navigation";
import { site } from "@/data/site";
import { telLink, whatsappLink } from "@/lib/whatsapp";

/** Année courante : mise en cache (compatible cacheComponents), rafraîchie chaque jour. */
async function AnneeCourante() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

const linkClass = "text-text-muted transition-colors hover:text-primary-text";

export default function Footer() {
  const wa = whatsappLink(site.whatsapp);
  const tel = telLink(site.telephone);

  return (
    <footer className="mt-auto border-t border-border bg-bg-alt pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <div className="w-32">
            <Logo sizes="128px" />
          </div>
          <p className="font-display text-xl font-extrabold uppercase italic text-primary-text">
            {site.signature}
          </p>
          <p className="text-sm text-text-muted">{site.baseline}</p>
          <p className="text-sm text-text-muted">
            Depuis {site.anneeFondation} · {site.villes.join(", ")}. {site.zoneIntervention}.
          </p>
        </div>

        <nav aria-label="Pied de page : navigation">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-text">
            Navigation
          </h2>
          <ul className="space-y-2 text-sm">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={linkClass}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Pied de page : catégories">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-text">
            Catalogue
          </h2>
          <ul className="space-y-2 text-sm">
            {getCategories().map((c) => (
              <li key={c.slug}>
                <Link href={`/machines/${c.slug}`} className={linkClass}>
                  {c.nom}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-text">
            Contact
          </h2>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2 text-text-muted">
              <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span>{site.adresse ?? site.villes.join(" · ")}</span>
            </li>
            {tel && site.telephone && (
              <li className="flex items-center gap-2">
                <Phone className="size-4 shrink-0 text-text-muted" aria-hidden="true" />
                <a href={tel} className={linkClass}>
                  {site.telephone}
                </a>
              </li>
            )}
            {wa && (
              <li className="flex items-center gap-2">
                <MessageCircle className="size-4 shrink-0 text-text-muted" aria-hidden="true" />
                <a href={wa} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  WhatsApp
                </a>
              </li>
            )}
            {site.email && (
              <li className="flex items-center gap-2">
                <Mail className="size-4 shrink-0 text-text-muted" aria-hidden="true" />
                <a href={`mailto:${site.email}`} className={linkClass}>
                  {site.email}
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <p className="mx-auto max-w-7xl px-4 py-5 text-xs text-text-muted sm:px-6">
          © <AnneeCourante /> {site.nom}. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
