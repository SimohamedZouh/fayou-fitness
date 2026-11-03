import type { Service } from "@/types";

export const services: Service[] = [
  {
    slug: "vente",
    nom: "Vente",
    icone: "ShoppingBag",
    resume: "Matériel de sport neuf et d'occasion, contrôlé et garanti.",
    points: [
      "Matériel neuf et d'occasion contrôlé et garanti",
      "Conseil selon votre espace et votre budget",
      "Reprise de matériel",
    ],
  },
  {
    slug: "installation",
    nom: "Installation",
    icone: "Truck",
    resume: "De la livraison à la prise en main, tout est géré par nos équipes.",
    points: ["Livraison", "Montage", "Réglage", "Mise en service", "Prise en main"],
  },
  {
    slug: "maintenance",
    nom: "Maintenance",
    icone: "Wrench",
    resume: "Un suivi régulier pour garder vos machines performantes et sûres.",
    points: [
      "Contrats d'entretien",
      "Dépannage",
      "Pièces détachées",
      "Contrôles réguliers",
    ],
  },
  {
    slug: "amenagement",
    nom: "Aménagement",
    icone: "Ruler",
    resume: "Une salle pensée dans le détail, de la conception à l'ambiance.",
    points: [
      "Plan et conception 3D",
      "Sol",
      "Miroirs",
      "Éclairage",
      "Ventilation",
      "Ambiance et habillage",
    ],
  },
  {
    slug: "etude-de-projet",
    nom: "Étude de projet",
    icone: "ClipboardList",
    resume:
      "Visite, relevé et plan d'implantation pour un projet maîtrisé, y compris avant construction.",
    points: [
      "Visite",
      "Relevé des mesures",
      "Plan d'implantation des machines",
      "Budget",
      "Projets avant construction : dimensions, charges au sol, ventilation, réseaux, accès",
    ],
  },
];

export const getServices = () => services;
export const getService = (slug: string) => services.find((s) => s.slug === slug);
