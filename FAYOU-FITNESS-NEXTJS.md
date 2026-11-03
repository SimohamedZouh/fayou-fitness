# FAYOU Fitness : site web Next.js (cahier des charges pour Claude Code)

Tu es Claude Code. Construis le site complet de **FAYOU Fitness** avec **la dernière version stable de Next.js** (App Router, TypeScript, React dernière version stable). Démarre avec `npx create-next-app@latest fayou-fitness --ts --tailwind --eslint --app --src-dir --import-alias "@/*"`, puis vérifie les versions installées (`npm ls next react`) et utilise les API de cette version (lis le guide de migration si nécessaire). Ne fige aucune ancienne version.

## 1. Marque

- **Nom** : FAYOU Fitness. **Depuis 2006** (20 ans d'expérience).
- **Signature** : « Qualité. Performance. Confiance. »
- **Baseline logo** : « Matériel de sport neuf & d'occasion ».
- **Activité** : vente, installation, maintenance et aménagement de salles de sport (neuf et occasion) pour home gym, villas, riads, hôtels et projets avant construction.
- **Villes** : Casablanca, Marrakech. Intervention dans tout le Maroc.
- **Langue** : français (par défaut). Structure prête pour l'arabe (RTL) via `next-intl`, mais ne traduis que si demandé.

### Logo

Le fichier source est `public/brand/logo-original.png` (PNG transparent 1672×941, lettres noires + violet #7f00fb). À partir de lui, génère avec un script (`scripts/make-logos.mjs`, librairie `sharp`) :

- `public/brand/logo-light.webp` : logo d'origine (mode clair).
- `public/brand/logo-dark.webp` : mêmes pixels, mais **tout pixel neutre sombre (saturation faible, luminosité basse) passe en blanc** ; le violet reste inchangé.

Composant `<Logo />` : affiche l'un ou l'autre selon le thème (deux `<Image>` avec classes `dark:hidden` / `hidden dark:block`, `priority` dans le header et le hero). Ajoute aussi `favicon`, `apple-icon` et `opengraph-image` générés depuis le logo.

### Couleurs : 2 couleurs seulement (violet + blanc)

| Rôle | Clair | Sombre |
|---|---|---|
| Fond | `#ffffff` | `#0b0914` |
| Fond alterné | `#f5f0ff` | `#13101f` |
| Carte | `#ffffff` | `#1a1629` |
| Texte | `#0d0d12` | `#ffffff` |
| Texte secondaire | `#5b5870` | `#b9b4cc` |
| Violet principal | `#7f00fb` | `#7f00fb` |
| Violet pour texte | `#7f00fb` | `#a35cff` |
| Bordure | `#e4dbf5` | `#2c2745` |

Définis ces valeurs en variables CSS dans `globals.css` (Tailwind v4 `@theme` ou config selon la version installée). Mode sombre : `next-themes` (`attribute="class"`, `defaultTheme="system"`, bouton de bascule ◐ dans le header). Aucun vert, aucun autre accent.

Typographie : `next/font` (une police display sportive en italique gras pour les titres, par exemple Barlow Condensed ou Saira, et Inter pour le texte).

## 2. Architecture

```
src/
  app/
    layout.tsx            # thème, polices, header, footer, bouton WhatsApp flottant, panier devis
    page.tsx              # Accueil
    machines/page.tsx     # Catalogue (filtres)
    machines/[categorie]/page.tsx   # Page par catégorie (SSG)
    machines/[categorie]/[slug]/page.tsx  # Fiche machine (SSG)
    services/page.tsx
    projets/page.tsx
    a-propos/page.tsx
    contact/page.tsx
    api/lead/route.ts     # POST : reçoit le formulaire (voir §6)
    sitemap.ts  robots.ts  manifest.ts  not-found.tsx  loading.tsx
  components/             # Logo, Header, Footer, Hero, Counter, CategoryCard, ProductCard, ProductGrid, Filters, QuoteDrawer, LeadForm, Faq, ServiceCard, ProjectCard, WhatsAppFab, ThemeToggle, Reveal, Marquee
  data/
    catalogue.ts          # catégories + machines (voir §4)
    services.ts           # services (voir §5)
    projects.ts           # types de projets (voir §5)
    site.ts               # nom, téléphone, WhatsApp, email, villes, chiffres clés
  lib/
    quote-store.ts        # panier de devis (zustand + persist localStorage)
    schema.ts             # schémas zod
    whatsapp.ts           # génération du lien wa.me
public/brand/  public/products/
```

Packages : `motion` (anciennement framer-motion), `lenis` (défilement fluide, désactivé si `prefers-reduced-motion`), `zustand`, `zod`, `react-hook-form` + `@hookform/resolvers`, `next-themes`, `lucide-react`, `sharp`, `clsx`.

Tout contenu statique est en Server Components ; les composants client (`"use client"`) sont limités aux animations, filtres, panier, formulaire et thème. Utilise `generateStaticParams` pour les pages catégories et fiches machines, et `generateMetadata` pour chaque page.

## 3. Pages et contenu

**Accueil** : hero plein écran (badge « DEPUIS 2006 », logo, titre « Votre salle de sport clé en main, chez vous ou dans votre hôtel », 2 boutons : « Voir les machines » et « Devis gratuit »), bandeau défilant (marquee) des catégories, chiffres clés animés, grille des 5 catégories, services, types de projets, méthode en 4 étapes (Étude → Conception → Installation → Suivi), arguments « Pourquoi FAYOU », FAQ courte, bandeau d'appel à l'action violet.

**Chiffres clés** : « 20 ans d'expérience » est le seul chiffre certain (2006). Pour les autres (projets réalisés, équipements installés), utilise des **valeurs à confirmer par le client** stockées dans `data/site.ts` avec le commentaire `// À CONFIRMER`, et n'affiche pas de faux chiffres en production : si la valeur est `null`, masque la tuile.

**Machines** : catalogue complet (voir §4) avec filtres (catégorie, neuf / occasion, usage : home gym / hôtel / pro), recherche instantanée, tri, bouton « Ajouter au devis » sur chaque carte, compteur dans le header.

**Services**, **Projets**, **À propos** (histoire depuis 2006, valeurs Qualité / Performance / Confiance), **Contact** (formulaire + FAQ + coordonnées + carte).

**FAQ** (balisage `FAQPage` JSON-LD) : matériel d'occasion contrôlé, installation, maintenance, zones d'intervention (hôtels, riads, villas), devis gratuit.

## 4. Catalogue exact par catégorie

Chaque machine a : `slug`, `nom`, `categorie`, `sousCategorie`, `etat` (`["neuf","occasion"]`), `usages` (`home | hotel | pro`), `description` (1 à 2 phrases), `muscles` ou `bénéfice`, `image` (placeholder), `specs` optionnelles. **Ne mets aucun prix ni marque inventés** : prix « Sur devis », marques absentes tant que le client ne les fournit pas.

### Cardio
- Tapis de course (home / commercial)
- Vélo elliptique
- Vélo de spinning (indoor cycling)
- Vélo droit
- Vélo semi-allongé (recumbent)
- Rameur (eau / air / magnétique)
- Stepper
- Escalier (stair climber)
- Air bike (vélo à air)
- Ski erg

### Musculation : machines guidées
- Presse pectorale (chest press)
- Presse épaules (shoulder press)
- Pec deck / oiseau (papillon et rear delt)
- Tirage vertical (lat pulldown)
- Rowing assis (seated row) et tirage horizontal
- Presse à cuisses 45°
- Leg extension
- Leg curl (assis et couché)
- Hack squat
- Hip thrust (machine)
- Abducteurs / adducteurs
- Mollets (debout et assis)
- Curl biceps (machine)
- Extension triceps / dips (machine)
- Abdominaux (crunch machine)
- Lombaires (back extension)
- Tractions / dips assistés
- Smith machine
- Poulie double (cable crossover)
- Functional trainer (poulie réglable)
- Multi-station (home gym 4 / 6 postes)

### Racks, bancs et structures
- Power rack (cage à squat)
- Rack à squat / demi-rack
- Banc plat
- Banc réglable (incliné / décliné)
- Banc Scott (pupitre biceps)
- Banc à abdominaux
- Chaise romaine / banc à lombaires
- GHD (glute-ham developer)
- Supports barres et supports disques
- Rangements haltères (rack à haltères)

### Charges libres
- Haltères hexagonaux (caoutchouc), paires fixes
- Haltères réglables
- Barres olympiques (20 kg), barre droite
- Barre EZ (curl)
- Barre hexagonale (trap bar)
- Disques olympiques : fonte, caoutchouc, bumper
- Colliers de serrage
- Kettlebells
- Medicine balls et slam balls
- Gilet lesté et sac de sable

### Training fonctionnel et studio
- Rig de tractions (pull-up rig / structure murale)
- Box de saut (plyo box)
- Cordes ondulatoires (battle ropes)
- Sangles de suspension
- Élastiques et bandes de résistance
- Traîneau (sled) et lanières
- Landmine
- Corde à sauter
- Roue abdominale
- Échelle de coordination et plots
- Tapis de yoga et de sol
- Rouleau de massage (foam roller)
- Bosu et Swiss ball
- Pilates (reformer / accessoires)

### Aménagement et accessoires de salle
- Sol en caoutchouc (dalles / rouleaux)
- Plateformes de soulevé
- Miroirs de salle
- Éclairage
- Ventilation et climatisation
- Écrans TV et système audio
- Casiers et vestiaires
- Distributeurs d'eau et de serviettes
- Signalétique et décoration murale (habillage, logo)

Chaque sous-catégorie a sa propre icône Lucide. Regroupe visuellement par `categorie` avec onglets et ancres.

## 5. Services et projets

**Services** (`data/services.ts`), chacun avec icône, résumé et liste à puces :
1. **Vente** : matériel neuf et d'occasion contrôlé et garanti ; conseil selon espace et budget ; reprise de matériel.
2. **Installation** : livraison, montage, réglage, mise en service, prise en main.
3. **Maintenance** : contrats d'entretien, dépannage, pièces détachées, contrôles réguliers.
4. **Aménagement** : plan et conception 3D, sol, miroirs, éclairage, ventilation, ambiance et habillage.
5. **Étude de projet** : visite, relevé des mesures, plan d'implantation des machines, budget (inclus les projets avant construction : dimensions, charges au sol, ventilation, réseaux, accès).

**Projets** (`data/projects.ts`) : Home gym, Villas, Riads, Hôtels, Projets avant construction, avec bénéfices spécifiques (petits espaces et matériel compact ; garage / sous-sol / jardin ; respect de l'architecture ; usage intensif et maintenance suivie ; intégration dès les plans).

## 6. Fonctionnalités

1. **Panier de devis** : bouton « Ajouter au devis » sur chaque machine, tiroir latéral `QuoteDrawer` (liste, suppression, quantité), persistant (`localStorage`), compteur animé dans le header. Bouton « Envoyer ma demande » qui ouvre le formulaire pré-rempli avec les machines choisies.
2. **Formulaire de contact / devis** : champs nom, téléphone, projet (liste), ville, machines (rempli automatiquement), détails. Validation `zod` côté client et serveur, état de chargement, message de succès, gestion d'erreur, champ piège anti-spam (honeypot) et limitation simple de fréquence par IP.
3. **API `/api/lead` (route handler)** envoie la demande **aux 3 destinations** :
   - **Google Sheets** : POST vers l'URL d'une application web Google Apps Script (`GOOGLE_SCRIPT_URL`). Fournis aussi `docs/google-apps-script.gs` (le script doit enregistrer une ligne dans le Sheet).
   - **Email** : Resend (`RESEND_API_KEY`, `LEAD_TO_EMAIL`, `LEAD_FROM_EMAIL`) ou, à défaut, Nodemailer SMTP.
   - **WhatsApp** : notification via WhatsApp Cloud API (`WHATSAPP_TOKEN`, `WHATSAPP_PHONE_ID`, `WHATSAPP_TO`) ou CallMeBot (`CALLMEBOT_APIKEY`, `WHATSAPP_TO`).
   Les trois envois sont lancés en parallèle (`Promise.allSettled`) ; la réponse est un succès si au moins un canal a réussi, et chaque échec est journalisé côté serveur. Si aucun canal n'est configuré, le formulaire propose en secours un lien `wa.me` pré-rempli. Aucune clé n'apparaît côté client.
4. **Bouton WhatsApp flottant** et bouton « Appeler ».
5. **Thème clair / sombre** avec le logo qui s'adapte.
6. **Recherche et filtres** du catalogue, état de filtre dans l'URL (`searchParams`) pour pouvoir partager un lien.
7. **SEO** : metadata par page, Open Graph, `sitemap.ts`, `robots.ts`, JSON-LD (`LocalBusiness` avec `foundingDate: 2006`, `Product` pour chaque machine sans prix, `FAQPage`, `BreadcrumbList`).
8. **Analytics** : prévois un composant désactivé par défaut (Vercel Analytics ou GA4 via variable d'environnement).

## 7. Animations modernes (avec `motion`)

Garde un style sportif, énergique mais fluide. **Tout est désactivé ou réduit si `prefers-reduced-motion`.**

- **Révélation au scroll** (`Reveal`) : fondu + remontée de 24 px, décalage progressif (stagger) dans les grilles.
- **Hero** : titre mot par mot (masque + glissement), logo qui entre avec un léger zoom, halo violet animé en arrière-plan, bouton principal avec effet magnétique.
- **Chiffres clés** : compteurs animés au passage dans la vue (`useInView` + `animate`).
- **Marquee** infini des catégories (bandeau défilant) qui ralentit au survol.
- **Cartes machines** : léger relèvement, bordure violette lumineuse au survol, image en zoom doux ; transition de liste fluide au changement de filtre (`AnimatePresence` + `layout`).
- **Ajout au devis** : la carte envoie une petite animation « vers le panier », le compteur rebondit, le tiroir glisse depuis la droite.
- **Navigation** : header qui se réduit et prend un flou au scroll, soulignement animé du lien actif (`layoutId`), menu mobile en plein écran avec stagger.
- **Transitions entre pages** : fondu court (`template.tsx` ou View Transitions API de la version installée si disponible).
- **Barre de progression de scroll** violette en haut de page.
- **Défilement fluide** avec Lenis (optionnel, désactivable).
- **Micro-interactions** : bascule de thème avec rotation, accordéons FAQ animés en hauteur, champs de formulaire avec label flottant, confettis légers à l'envoi réussi.

Performances : animer uniquement `transform` et `opacity`, pas de librairie lourde pour 3D, `next/image` partout, lazy loading sous la ligne de flottaison.

## 8. Qualité

- Mobile d'abord, puis tablette et bureau. Gouttière 16 px, aucun scroll horizontal, respect des zones sûres iOS (`env(safe-area-inset-*)`).
- Accessibilité : contrastes AA, focus visibles, navigation clavier, `aria-label` sur les boutons-icônes, tiroir avec piège de focus, `alt` sur les images, HTML sémantique.
- Lighthouse visé : 95+ en performance, accessibilité, bonnes pratiques et SEO.
- `npm run lint` et `npm run build` doivent passer sans erreur. Ajoute des tests simples (Vitest ou Playwright) pour le panier de devis et l'API `/api/lead`.
- Fournis `.env.example`, un `README.md` (installation, variables, déploiement Vercel) et `docs/google-apps-script.gs`.

## 9. Variables d'environnement (`.env.example`)

```
NEXT_PUBLIC_SITE_URL=https://www.exemple.ma
NEXT_PUBLIC_WHATSAPP=212600000000        # À REMPLACER par le vrai numéro
NEXT_PUBLIC_PHONE=+212600000000          # À REMPLACER
GOOGLE_SCRIPT_URL=
RESEND_API_KEY=
LEAD_TO_EMAIL=
LEAD_FROM_EMAIL=
WHATSAPP_TOKEN=
WHATSAPP_PHONE_ID=
WHATSAPP_TO=
CALLMEBOT_APIKEY=
```

## 10. Ce qu'il ne faut pas inventer

Aucun prix, marque, témoignage, certification, adresse précise, numéro de téléphone ni chiffre de réalisations sans confirmation du client. Utilise des placeholders visibles dans `data/site.ts` (`// À CONFIRMER`) et liste-les à la fin dans le README (« Informations à fournir par FAYOU »). Les photos réelles des machines et des réalisations remplaceront les visuels provisoires dans `public/products/`.

## 11. Ordre de travail conseillé

1. Initialiser le projet, thème, polices, variables de couleur, `Logo` (génération des deux versions).
2. `data/` (catalogue, services, projets, site) et types TypeScript.
3. Layout, header, footer, bouton WhatsApp, thème.
4. Accueil, puis catalogue (filtres, pages catégorie et fiche), puis services, projets, à propos, contact.
5. Panier de devis et formulaire, puis `/api/lead` avec les trois canaux.
6. Animations, SEO, accessibilité, tests.
7. `npm run build`, corrections, puis résumé final avec la liste des informations à fournir.
