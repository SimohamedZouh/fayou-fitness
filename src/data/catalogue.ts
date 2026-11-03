import type { Categorie, IconName, Machine, Usage } from "@/types";

/* ------------------------------------------------------------------ */
/* Catégories (cahier des charges §4 : 6 catégories)                   */
/* ------------------------------------------------------------------ */

export const categories: Categorie[] = [
  {
    slug: "cardio",
    nom: "Cardio",
    description: "Endurance, souffle et dépense calorique : tapis, vélos, rameurs.",
    icone: "HeartPulse",
    image: "/products/placeholder-cardio.svg",
    sousCategories: [
      { slug: "course-marche", nom: "Course et marche", icone: "Footprints" },
      { slug: "velos", nom: "Vélos", icone: "Bike" },
      { slug: "rameurs-ski", nom: "Rameurs et ski erg", icone: "AudioWaveform" },
    ],
  },
  {
    slug: "musculation-machines-guidees",
    nom: "Musculation : machines guidées",
    description: "Machines à trajectoire guidée pour travailler chaque groupe musculaire.",
    icone: "Dumbbell",
    image: "/products/placeholder-musculation.svg",
    sousCategories: [
      { slug: "haut-du-corps", nom: "Haut du corps", icone: "ArrowUpFromLine" },
      { slug: "bas-du-corps", nom: "Bas du corps", icone: "ArrowDownToLine" },
      { slug: "tronc", nom: "Tronc", icone: "Target" },
      { slug: "stations", nom: "Stations polyvalentes", icone: "Boxes" },
    ],
  },
  {
    slug: "racks-bancs-structures",
    nom: "Racks, bancs et structures",
    description: "Cages, bancs et supports pour les mouvements de force.",
    icone: "Construction",
    image: "/products/placeholder-racks.svg",
    sousCategories: [
      { slug: "racks", nom: "Racks et cages", icone: "Warehouse" },
      { slug: "bancs", nom: "Bancs et assises", icone: "Armchair" },
      { slug: "supports", nom: "Supports et rangements", icone: "Library" },
    ],
  },
  {
    slug: "charges-libres",
    nom: "Charges libres",
    description: "Haltères, barres, disques et kettlebells pour un travail complet.",
    icone: "Weight",
    image: "/products/placeholder-charges.svg",
    sousCategories: [
      { slug: "halteres", nom: "Haltères", icone: "Dumbbell" },
      { slug: "barres", nom: "Barres", icone: "Ruler" },
      { slug: "disques-colliers", nom: "Disques et colliers", icone: "Disc3" },
      { slug: "autres-charges", nom: "Autres charges", icone: "Package" },
    ],
  },
  {
    slug: "training-fonctionnel-studio",
    nom: "Training fonctionnel et studio",
    description: "Accessoires de training fonctionnel, de yoga et de pilates.",
    icone: "Flame",
    image: "/products/placeholder-training.svg",
    sousCategories: [
      { slug: "structures-sauts", nom: "Structures et sauts", icone: "Zap" },
      { slug: "resistance", nom: "Résistance et traction", icone: "Repeat" },
      { slug: "sol-recuperation", nom: "Sol et récupération", icone: "PersonStanding" },
    ],
  },
  {
    slug: "amenagement-accessoires",
    nom: "Aménagement et accessoires de salle",
    description: "Sol, miroirs, éclairage, ventilation et équipements de la salle.",
    icone: "PanelTop",
    image: "/products/placeholder-amenagement.svg",
    sousCategories: [
      { slug: "sol-plateformes", nom: "Sol et plateformes", icone: "Grid3x3" },
      { slug: "ambiance", nom: "Ambiance et décoration", icone: "Sparkles" },
      { slug: "equipements", nom: "Équipements de salle", icone: "Fan" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Machines : une entrée par ligne de la liste du §4                   */
/* ------------------------------------------------------------------ */

const TOUS: Usage[] = ["home", "hotel", "pro"];
const HOME_PRO: Usage[] = ["home", "pro"];
const HOTEL_PRO: Usage[] = ["hotel", "pro"];
const HOME: Usage[] = ["home"];

type Ligne = {
  slug: string;
  nom: string;
  famille: string;
  icone: IconName;
  description: string;
  benefice: string;
  usages: Usage[];
  muscles?: string[];
  variantes?: string[];
};

function construire(categorieSlug: string, lignes: Ligne[]): Machine[] {
  const cat = categories.find((c) => c.slug === categorieSlug);
  if (!cat) throw new Error(`Catégorie inconnue : ${categorieSlug}`);
  return lignes.map((l) => {
    const sc = cat.sousCategories.find((s) => s.slug === l.famille);
    if (!sc) throw new Error(`Sous-catégorie inconnue : ${l.famille}`);
    return {
      slug: l.slug,
      nom: l.nom,
      categorie: cat.slug,
      sousCategorie: sc.nom,
      sousCategorieSlug: sc.slug,
      icone: l.icone,
      // À CONFIRMER : disponibilité neuf / occasion de chaque référence
      etat: ["neuf", "occasion"],
      usages: l.usages,
      description: l.description,
      benefice: l.benefice,
      muscles: l.muscles,
      variantes: l.variantes,
      image: cat.image,
      prix: "Sur devis",
    };
  });
}

const cardio = construire("cardio", [
  { slug: "tapis-de-course", nom: "Tapis de course", famille: "course-marche", icone: "Activity", description: "Marche, jogging et course à votre rythme, à la maison comme en salle.", benefice: "Endurance et dépense calorique", usages: TOUS, variantes: ["Home", "Commercial"] },
  { slug: "velo-elliptique", nom: "Vélo elliptique", famille: "velos", icone: "Orbit", description: "Mouvement fluide qui sollicite tout le corps avec peu d'impact sur les articulations.", benefice: "Cardio doux pour les articulations", usages: TOUS },
  { slug: "velo-de-spinning", nom: "Vélo de spinning", famille: "velos", icone: "Bike", description: "Vélo d'indoor cycling pour des séances intenses et rythmées.", benefice: "Endurance et travail des jambes", usages: TOUS, muscles: ["Jambes", "Fessiers"], variantes: ["Indoor cycling"] },
  { slug: "velo-droit", nom: "Vélo droit", famille: "velos", icone: "Gauge", description: "Vélo d'appartement en position classique, simple à prendre en main.", benefice: "Cardio accessible à tous", usages: TOUS },
  { slug: "velo-semi-allonge", nom: "Vélo semi-allongé", famille: "velos", icone: "Armchair", description: "Position assise avec dossier pour un pédalage confortable.", benefice: "Confort et soutien du dos", usages: TOUS, variantes: ["Recumbent"] },
  { slug: "rameur", nom: "Rameur", famille: "rameurs-ski", icone: "AudioWaveform", description: "Exercice complet qui sollicite le haut et le bas du corps.", benefice: "Cardio et renforcement global", usages: TOUS, muscles: ["Dos", "Jambes", "Bras"], variantes: ["Eau", "Air", "Magnétique"] },
  { slug: "stepper", nom: "Stepper", famille: "course-marche", icone: "Footprints", description: "Montée de marches compacte pour un travail ciblé des jambes.", benefice: "Cardio compact", usages: TOUS, muscles: ["Jambes", "Fessiers"] },
  { slug: "escalier-stair-climber", nom: "Escalier", famille: "course-marche", icone: "TrendingUp", description: "Escalier motorisé pour des séances de montée soutenues.", benefice: "Cardio intense", usages: HOTEL_PRO, muscles: ["Jambes", "Fessiers"], variantes: ["Stair climber"] },
  { slug: "air-bike", nom: "Air bike", famille: "velos", icone: "Wind", description: "Vélo à air avec résistance progressive, idéal pour les efforts intenses.", benefice: "Intensité et conditionnement", usages: TOUS, variantes: ["Vélo à air"] },
  { slug: "ski-erg", nom: "Ski erg", famille: "rameurs-ski", icone: "Snowflake", description: "Mouvement de tirage de ski pour un travail cardio du haut du corps.", benefice: "Cardio haut du corps et gainage", usages: TOUS, muscles: ["Dos", "Épaules", "Abdominaux"] },
]);

const musculation = construire("musculation-machines-guidees", [
  { slug: "presse-pectorale", nom: "Presse pectorale", famille: "haut-du-corps", icone: "Dumbbell", description: "Poussée guidée pour développer les pectoraux en sécurité.", benefice: "Développement des pectoraux", usages: TOUS, muscles: ["Pectoraux", "Triceps", "Épaules"], variantes: ["Chest press"] },
  { slug: "presse-epaules", nom: "Presse épaules", famille: "haut-du-corps", icone: "ArrowUpFromLine", description: "Poussée verticale guidée pour renforcer les épaules.", benefice: "Épaules plus fortes", usages: TOUS, muscles: ["Épaules", "Triceps"], variantes: ["Shoulder press"] },
  { slug: "pec-deck-oiseau", nom: "Pec deck / oiseau", famille: "haut-du-corps", icone: "Move", description: "Machine à double fonction : papillon pour les pectoraux, oiseau pour l'arrière des épaules.", benefice: "Isolation pectoraux et deltoïdes arrière", usages: TOUS, muscles: ["Pectoraux", "Deltoïdes postérieurs"], variantes: ["Papillon", "Rear delt"] },
  { slug: "tirage-vertical", nom: "Tirage vertical", famille: "haut-du-corps", icone: "ArrowDownToLine", description: "Tirage à la poulie haute pour élargir et renforcer le dos.", benefice: "Dos large et puissant", usages: TOUS, muscles: ["Grand dorsal", "Biceps"], variantes: ["Lat pulldown"] },
  { slug: "rowing-assis-tirage-horizontal", nom: "Rowing assis et tirage horizontal", famille: "haut-du-corps", icone: "Rows3", description: "Tirage horizontal assis pour travailler l'épaisseur du dos.", benefice: "Dos épais et posture", usages: TOUS, muscles: ["Dos", "Biceps"], variantes: ["Seated row"] },
  { slug: "presse-a-cuisses-45", nom: "Presse à cuisses 45°", famille: "bas-du-corps", icone: "Mountain", description: "Poussée des jambes sur plan incliné pour charger les cuisses en sécurité.", benefice: "Force et volume des jambes", usages: TOUS, muscles: ["Quadriceps", "Fessiers"] },
  { slug: "leg-extension", nom: "Leg extension", famille: "bas-du-corps", icone: "Move3d", description: "Extension des jambes assis pour isoler les quadriceps.", benefice: "Isolation des quadriceps", usages: TOUS, muscles: ["Quadriceps"] },
  { slug: "leg-curl", nom: "Leg curl", famille: "bas-du-corps", icone: "RefreshCw", description: "Flexion des jambes, assis ou couché, pour cibler les ischio-jambiers.", benefice: "Renforcement des ischio-jambiers", usages: TOUS, muscles: ["Ischio-jambiers"], variantes: ["Assis", "Couché"] },
  { slug: "hack-squat", nom: "Hack squat", famille: "bas-du-corps", icone: "ChevronsUp", description: "Squat guidé sur plan incliné, dos soutenu.", benefice: "Force des cuisses", usages: HOTEL_PRO, muscles: ["Quadriceps", "Fessiers"] },
  { slug: "hip-thrust-machine", nom: "Hip thrust", famille: "bas-du-corps", icone: "TrendingUp", description: "Poussée de hanches guidée pour cibler les fessiers.", benefice: "Fessiers renforcés", usages: TOUS, muscles: ["Fessiers", "Ischio-jambiers"], variantes: ["Machine"] },
  { slug: "abducteurs-adducteurs", nom: "Abducteurs / adducteurs", famille: "bas-du-corps", icone: "Merge", description: "Travail de l'intérieur et de l'extérieur des cuisses.", benefice: "Stabilité du bassin", usages: TOUS, muscles: ["Abducteurs", "Adducteurs"] },
  { slug: "mollets", nom: "Mollets", famille: "bas-du-corps", icone: "Footprints", description: "Extension des chevilles, debout ou assis, pour les mollets.", benefice: "Mollets plus forts", usages: TOUS, muscles: ["Mollets"], variantes: ["Debout", "Assis"] },
  { slug: "curl-biceps-machine", nom: "Curl biceps", famille: "haut-du-corps", icone: "Hand", description: "Flexion des bras guidée pour isoler les biceps.", benefice: "Isolation des biceps", usages: TOUS, muscles: ["Biceps"], variantes: ["Machine"] },
  { slug: "extension-triceps-dips-machine", nom: "Extension triceps / dips", famille: "haut-du-corps", icone: "ArrowDownToLine", description: "Extension des bras guidée pour renforcer les triceps.", benefice: "Isolation des triceps", usages: TOUS, muscles: ["Triceps"], variantes: ["Machine"] },
  { slug: "abdominaux-crunch-machine", nom: "Abdominaux", famille: "tronc", icone: "Target", description: "Flexion du tronc guidée pour charger la sangle abdominale.", benefice: "Sangle abdominale renforcée", usages: TOUS, muscles: ["Abdominaux"], variantes: ["Crunch machine"] },
  { slug: "lombaires-back-extension", nom: "Lombaires", famille: "tronc", icone: "Spline", description: "Extension du tronc pour renforcer le bas du dos.", benefice: "Dos stable et protégé", usages: TOUS, muscles: ["Lombaires"], variantes: ["Back extension"] },
  { slug: "tractions-dips-assistes", nom: "Tractions / dips assistés", famille: "stations", icone: "ChevronsUp", description: "Tractions et dips avec assistance réglable pour progresser pas à pas.", benefice: "Progression vers les tractions", usages: TOUS, muscles: ["Dos", "Biceps", "Triceps", "Pectoraux"] },
  { slug: "smith-machine", nom: "Smith machine", famille: "stations", icone: "Anchor", description: "Barre guidée sur rails pour s'entraîner avec un maximum de sécurité.", benefice: "Sécurité et polyvalence", usages: TOUS },
  { slug: "poulie-double-cable-crossover", nom: "Poulie double", famille: "stations", icone: "Cable", description: "Deux poulies pour de multiples exercices de tirage et d'isolation.", benefice: "Polyvalence des exercices", usages: TOUS, variantes: ["Cable crossover"] },
  { slug: "functional-trainer", nom: "Functional trainer", famille: "stations", icone: "Settings", description: "Poulies réglables en hauteur pour des mouvements fonctionnels variés.", benefice: "Entraînement fonctionnel complet", usages: TOUS, variantes: ["Poulie réglable"] },
  { slug: "multi-station", nom: "Multi-station", famille: "stations", icone: "Boxes", description: "Station tout-en-un pour travailler tout le corps sur une seule emprise.", benefice: "Gain de place pour un home gym", usages: HOME_PRO, variantes: ["Home gym 4 postes", "Home gym 6 postes"] },
]);

const racks = construire("racks-bancs-structures", [
  { slug: "power-rack", nom: "Power rack", famille: "racks", icone: "Warehouse", description: "Cage à squat robuste pour s'entraîner à la barre en sécurité.", benefice: "Sécurité sous charge lourde", usages: TOUS, variantes: ["Cage à squat"] },
  { slug: "rack-a-squat-demi-rack", nom: "Rack à squat / demi-rack", famille: "racks", icone: "Construction", description: "Structure plus compacte pour le squat et le développé.", benefice: "Encombrement réduit", usages: TOUS },
  { slug: "banc-plat", nom: "Banc plat", famille: "bancs", icone: "Minus", description: "Banc stable pour le développé couché et de nombreux exercices.", benefice: "Base de l'entraînement libre", usages: TOUS },
  { slug: "banc-reglable", nom: "Banc réglable", famille: "bancs", icone: "Armchair", description: "Dossier réglable pour travailler en position inclinée ou déclinée.", benefice: "Polyvalence des angles de travail", usages: TOUS, variantes: ["Incliné", "Décliné"] },
  { slug: "banc-scott", nom: "Banc Scott", famille: "bancs", icone: "Hand", description: "Pupitre pour isoler les biceps pendant le curl.", benefice: "Isolation des biceps", usages: TOUS, muscles: ["Biceps"], variantes: ["Pupitre biceps"] },
  { slug: "banc-a-abdominaux", nom: "Banc à abdominaux", famille: "bancs", icone: "Target", description: "Banc incliné pour des séries d'abdominaux plus efficaces.", benefice: "Sangle abdominale renforcée", usages: TOUS, muscles: ["Abdominaux"] },
  { slug: "chaise-romaine-banc-lombaires", nom: "Chaise romaine / banc à lombaires", famille: "bancs", icone: "Spline", description: "Support pour les extensions du tronc et le renforcement du dos.", benefice: "Dos et chaîne postérieure", usages: TOUS, muscles: ["Lombaires", "Fessiers"] },
  { slug: "ghd", nom: "GHD", famille: "bancs", icone: "Repeat", description: "Appareil de travail du dos, des fessiers et des ischio-jambiers.", benefice: "Chaîne postérieure et gainage", usages: TOUS, muscles: ["Ischio-jambiers", "Fessiers", "Lombaires"], variantes: ["Glute-ham developer"] },
  { slug: "supports-barres-disques", nom: "Supports barres et supports disques", famille: "supports", icone: "Layers", description: "Supports pour ranger les barres et les disques en toute sécurité.", benefice: "Salle rangée et sûre", usages: TOUS },
  { slug: "rangements-halteres", nom: "Rangements haltères", famille: "supports", icone: "Library", description: "Racks pour ranger les haltères de façon ordonnée.", benefice: "Gain de place", usages: TOUS, variantes: ["Rack à haltères"] },
]);

const charges = construire("charges-libres", [
  { slug: "halteres-hexagonaux", nom: "Haltères hexagonaux", famille: "halteres", icone: "Dumbbell", description: "Haltères hexagonaux en caoutchouc, vendus en paires fixes.", benefice: "Stabilité au sol et durabilité", usages: TOUS, variantes: ["Caoutchouc", "Paires fixes"] },
  { slug: "halteres-reglables", nom: "Haltères réglables", famille: "halteres", icone: "Settings", description: "Une seule paire pour plusieurs charges, idéale quand la place manque.", benefice: "Gain de place", usages: HOME, },
  { slug: "barres-olympiques", nom: "Barres olympiques", famille: "barres", icone: "Ruler", description: "Barres olympiques de 20 kg et barres droites pour les mouvements de force.", benefice: "Polyvalence et robustesse", usages: TOUS, variantes: ["20 kg", "Barre droite"] },
  { slug: "barre-ez", nom: "Barre EZ", famille: "barres", icone: "Spline", description: "Barre coudée pour le curl et les extensions, plus confortable pour les poignets.", benefice: "Confort des poignets", usages: TOUS, muscles: ["Biceps", "Triceps"], variantes: ["Curl"] },
  { slug: "barre-hexagonale", nom: "Barre hexagonale", famille: "barres", icone: "Hexagon", description: "Barre à cadre hexagonal pour le soulevé de terre et les shrugs.", benefice: "Soulevé de terre plus accessible", usages: TOUS, variantes: ["Trap bar"] },
  { slug: "disques-olympiques", nom: "Disques olympiques", famille: "disques-colliers", icone: "Disc3", description: "Disques olympiques pour charger les barres, en fonte, caoutchouc ou bumper.", benefice: "Progression de charge", usages: TOUS, variantes: ["Fonte", "Caoutchouc", "Bumper"] },
  { slug: "colliers-de-serrage", nom: "Colliers de serrage", famille: "disques-colliers", icone: "Link", description: "Colliers pour maintenir les disques en place sur la barre.", benefice: "Sécurité des charges", usages: TOUS },
  { slug: "kettlebells", nom: "Kettlebells", famille: "autres-charges", icone: "Weight", description: "Poids à anse pour les mouvements balistiques et fonctionnels.", benefice: "Force et cardio combinés", usages: TOUS },
  { slug: "medicine-balls-slam-balls", nom: "Medicine balls et slam balls", famille: "autres-charges", icone: "Circle", description: "Balles lestées pour les lancers, les rebonds et le travail d'explosivité.", benefice: "Explosivité et conditionnement", usages: TOUS },
  { slug: "gilet-leste-sac-de-sable", nom: "Gilet lesté et sac de sable", famille: "autres-charges", icone: "Backpack", description: "Charges portées pour intensifier le poids du corps et le training fonctionnel.", benefice: "Intensité sans machine", usages: TOUS },
]);

const training = construire("training-fonctionnel-studio", [
  { slug: "rig-de-tractions", nom: "Rig de tractions", famille: "structures-sauts", icone: "Columns3", description: "Structure murale ou autoportée pour tractions et exercices suspendus.", benefice: "Base du training fonctionnel", usages: TOUS, variantes: ["Pull-up rig", "Structure murale"] },
  { slug: "box-de-saut", nom: "Box de saut", famille: "structures-sauts", icone: "Box", description: "Box pour sauts pliométriques et montées d'explosivité.", benefice: "Explosivité", usages: TOUS, variantes: ["Plyo box"] },
  { slug: "cordes-ondulatoires", nom: "Cordes ondulatoires", famille: "resistance", icone: "AudioWaveform", description: "Grosses cordes pour des séries intenses de cardio et de force.", benefice: "Cardio et épaules", usages: TOUS, variantes: ["Battle ropes"] },
  { slug: "sangles-de-suspension", nom: "Sangles de suspension", famille: "resistance", icone: "Link2", description: "Sangles réglables pour s'entraîner avec le poids du corps.", benefice: "Gainage et mobilité", usages: TOUS },
  { slug: "elastiques-bandes-de-resistance", nom: "Élastiques et bandes de résistance", famille: "resistance", icone: "Spline", description: "Bandes élastiques pour la résistance, l'échauffement et la rééducation.", benefice: "Résistance légère et portable", usages: TOUS },
  { slug: "traineau-sled", nom: "Traîneau et lanières", famille: "resistance", icone: "Truck", description: "Traîneau à pousser ou à tirer, avec lanières, pour le conditionnement.", benefice: "Puissance et cardio", usages: HOTEL_PRO, variantes: ["Sled"] },
  { slug: "landmine", nom: "Landmine", famille: "resistance", icone: "Crosshair", description: "Support pivotant pour barre, pour de nombreux mouvements de tirage et de poussée.", benefice: "Mouvements fonctionnels variés", usages: TOUS },
  { slug: "corde-a-sauter", nom: "Corde à sauter", famille: "structures-sauts", icone: "Zap", description: "Accessoire simple et efficace pour le cardio et la coordination.", benefice: "Cardio et coordination", usages: TOUS },
  { slug: "roue-abdominale", nom: "Roue abdominale", famille: "sol-recuperation", icone: "Disc", description: "Roue pour un gainage exigeant de la sangle abdominale.", benefice: "Gainage abdominal", usages: TOUS, muscles: ["Abdominaux"] },
  { slug: "echelle-de-coordination-plots", nom: "Échelle de coordination et plots", famille: "structures-sauts", icone: "Tally4", description: "Échelle au sol et plots pour l'agilité et les déplacements.", benefice: "Agilité et vitesse de pied", usages: TOUS },
  { slug: "tapis-de-yoga-et-de-sol", nom: "Tapis de yoga et de sol", famille: "sol-recuperation", icone: "Square", description: "Tapis pour les exercices au sol, le yoga et les étirements.", benefice: "Confort au sol", usages: TOUS },
  { slug: "rouleau-de-massage-foam-roller", nom: "Rouleau de massage", famille: "sol-recuperation", icone: "Cylinder", description: "Rouleau pour l'auto-massage et la récupération musculaire.", benefice: "Récupération", usages: TOUS, variantes: ["Foam roller"] },
  { slug: "bosu-et-swiss-ball", nom: "Bosu et Swiss ball", famille: "sol-recuperation", icone: "CircleDot", description: "Surfaces instables pour travailler l'équilibre et le gainage.", benefice: "Équilibre et gainage", usages: TOUS },
  { slug: "pilates", nom: "Pilates", famille: "sol-recuperation", icone: "Sparkle", description: "Reformer et accessoires pour un travail en douceur de la posture et du tonus.", benefice: "Posture et tonus profond", usages: TOUS, variantes: ["Reformer", "Accessoires"] },
]);

const amenagement = construire("amenagement-accessoires", [
  { slug: "sol-en-caoutchouc", nom: "Sol en caoutchouc", famille: "sol-plateformes", icone: "Grid3x3", description: "Dalles ou rouleaux en caoutchouc pour protéger le sol et amortir les chocs.", benefice: "Protection du sol et confort", usages: TOUS, variantes: ["Dalles", "Rouleaux"] },
  { slug: "plateformes-de-souleve", nom: "Plateformes de soulevé", famille: "sol-plateformes", icone: "Layers", description: "Plateformes dédiées au soulevé de terre et à l'haltérophilie.", benefice: "Sol protégé sous charges lourdes", usages: TOUS },
  { slug: "miroirs-de-salle", nom: "Miroirs de salle", famille: "ambiance", icone: "Frame", description: "Miroirs pour contrôler ses mouvements et agrandir l'espace.", benefice: "Technique et sensation d'espace", usages: TOUS },
  { slug: "eclairage", nom: "Éclairage", famille: "ambiance", icone: "Lightbulb", description: "Éclairage adapté à la salle et à l'ambiance souhaitée.", benefice: "Confort visuel et ambiance", usages: TOUS },
  { slug: "ventilation-climatisation", nom: "Ventilation et climatisation", famille: "equipements", icone: "Snowflake", description: "Solutions pour garder la salle fraîche et bien aérée.", benefice: "Confort pendant l'effort", usages: TOUS },
  { slug: "ecrans-tv-systeme-audio", nom: "Écrans TV et système audio", famille: "equipements", icone: "Tv", description: "Écrans et sonorisation pour une salle motivante.", benefice: "Motivation et ambiance", usages: TOUS },
  { slug: "casiers-vestiaires", nom: "Casiers et vestiaires", famille: "equipements", icone: "Lock", description: "Casiers et mobilier de vestiaire pour ranger ses affaires.", benefice: "Sécurité et rangement", usages: HOTEL_PRO },
  { slug: "distributeurs-eau-serviettes", nom: "Distributeurs d'eau et de serviettes", famille: "equipements", icone: "Droplets", description: "Équipements d'accueil pour l'hydratation et le confort des membres.", benefice: "Confort des utilisateurs", usages: HOTEL_PRO },
  { slug: "signaletique-decoration-murale", nom: "Signalétique et décoration murale", famille: "ambiance", icone: "Palette", description: "Habillage mural, logo et signalétique pour une salle à votre image.", benefice: "Identité visuelle de la salle", usages: TOUS, variantes: ["Habillage", "Logo"] },
]);

export const machines: Machine[] = [
  ...cardio,
  ...musculation,
  ...racks,
  ...charges,
  ...training,
  ...amenagement,
];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

export const getCategories = (): Categorie[] => categories;

export const getCategorieBySlug = (slug: string): Categorie | undefined =>
  categories.find((c) => c.slug === slug);

export const getMachines = (): Machine[] => machines;

export const getMachinesByCategorie = (categorieSlug: string): Machine[] =>
  machines.filter((m) => m.categorie === categorieSlug);

export const getMachinesBySousCategorie = (
  categorieSlug: string,
  sousCategorieSlug: string,
): Machine[] =>
  machines.filter(
    (m) => m.categorie === categorieSlug && m.sousCategorieSlug === sousCategorieSlug,
  );

export const getMachine = (categorieSlug: string, slug: string): Machine | undefined =>
  machines.find((m) => m.categorie === categorieSlug && m.slug === slug);

export const getMachineBySlug = (slug: string): Machine | undefined =>
  machines.find((m) => m.slug === slug);

/** Machines de la même catégorie, hors la machine donnée. */
export const getMachinesSimilaires = (machine: Machine, limite = 4): Machine[] =>
  machines
    .filter((m) => m.categorie === machine.categorie && m.slug !== machine.slug)
    .slice(0, limite);

/** Paramètres pour generateStaticParams des pages catégories. */
export const getCategorieParams = () => categories.map((c) => ({ categorie: c.slug }));

/** Paramètres pour generateStaticParams des fiches machines. */
export const getMachineParams = () =>
  machines.map((m) => ({ categorie: m.categorie, slug: m.slug }));
