export interface FaqItem {
  question: string;
  reponse: string;
}

export const faq: FaqItem[] = [
  {
    question: "Le matériel d'occasion est-il contrôlé ?",
    reponse:
      "Oui. Le matériel d'occasion proposé par FAYOU Fitness est contrôlé et garanti avant la vente. Les conditions précises de garantie vous sont communiquées avec votre devis.",
  },
  {
    question: "Vous occupez-vous de l'installation ?",
    reponse:
      "Oui. Nos équipes gèrent la livraison, le montage, le réglage, la mise en service et la prise en main de vos machines.",
  },
  {
    question: "Proposez-vous la maintenance ?",
    reponse:
      "Oui : contrats d'entretien, dépannage, pièces détachées et contrôles réguliers pour garder votre matériel performant et sûr.",
  },
  {
    question: "Où intervenez-vous ?",
    reponse:
      "Nous sommes basés à Casablanca et Marrakech et nous intervenons dans tout le Maroc : home gyms, villas, riads, hôtels et projets avant construction.",
  },
  {
    question: "Le devis est-il gratuit ?",
    reponse:
      "Oui, le devis est gratuit et sans engagement. Les machines sont proposées sur devis : décrivez-nous votre projet et nous revenons vers vous.",
  },
];
