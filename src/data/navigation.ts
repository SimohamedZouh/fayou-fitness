export interface NavLink {
  href: string;
  label: string;
}

/** Navigation principale (header, menu mobile, footer). */
export const navLinks: NavLink[] = [
  { href: "/", label: "Accueil" },
  { href: "/machines", label: "Machines" },
  { href: "/services", label: "Services" },
  { href: "/projets", label: "Projets" },
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" },
];

export const devisHref = "/contact#devis";
