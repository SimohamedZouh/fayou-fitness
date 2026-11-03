import type { Projet } from "@/types";

export const projets: Projet[] = [
  {
    slug: "home-gym",
    nom: "Home gym",
    icone: "House",
    resume: "Votre salle à la maison, adaptée à votre espace.",
    benefices: ["Petits espaces", "Matériel compact"],
  },
  {
    slug: "villas",
    nom: "Villas",
    icone: "Building",
    resume: "Une salle complète dans votre villa.",
    benefices: ["Garage, sous-sol ou jardin"],
  },
  {
    slug: "riads",
    nom: "Riads",
    icone: "Landmark",
    resume: "Du sport dans le respect du caractère des lieux.",
    benefices: ["Respect de l'architecture"],
  },
  {
    slug: "hotels",
    nom: "Hôtels",
    icone: "Hotel",
    resume: "Un espace fitness fiable pour vos clients.",
    benefices: ["Usage intensif", "Maintenance suivie"],
  },
  {
    slug: "avant-construction",
    nom: "Projets avant construction",
    icone: "Construction",
    resume: "La salle de sport prévue dès les plans.",
    benefices: ["Intégration dès les plans"],
  },
];

export const getProjets = () => projets;
export const getProjet = (slug: string) => projets.find((p) => p.slug === slug);
