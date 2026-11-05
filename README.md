# FAYOU Fitness : site web

Site vitrine et générateur de demandes de devis pour **FAYOU Fitness** (depuis 2006) : vente, installation, maintenance et aménagement de salles de sport, neuf et occasion, à Casablanca, Marrakech et partout au Maroc.

Next.js 16 (App Router, `cacheComponents`), React 19, TypeScript, Tailwind CSS 4, `motion`, `zustand`, `zod`. Charte : violet `#7f00fb` et blanc, mode clair et sombre, français.

## Prérequis

- **Node.js 22.11 ou plus récent**, avec npm.
- **Tailwind CSS est épinglé en `4.1.18`** (et `@tailwindcss/postcss` aussi) dans `package.json`. Les versions 4.3 et suivantes exigent une version de Node plus récente que 22.11. Ne montez pas Tailwind sans avoir monté Node (local et Vercel).

## Installation et commandes

```bash
npm install
cp .env.example .env.local   # puis renseigner les valeurs (voir plus bas)
```

| Commande | Rôle |
|---|---|
| `npm run dev` | Serveur de développement (http://localhost:3000) |
| `npm run build` | Build de production |
| `npm start` | Sert le build de production (`next start`) |
| `npm run lint` | ESLint |
| `npm test` | Tests Vitest (panier de devis, `/api/lead`, SEO, filtres, URL du site) |
| `npm run logos` | Régénère `logo-light.webp` et `logo-dark.webp` depuis `public/brand/logo-original.png` |

## Structure du projet

```
src/app/            pages (/, /machines, /machines/[categorie], /machines/[categorie]/[slug],
                    /services, /projets, /a-propos, /contact), api/lead, sitemap, robots, manifest
src/components/     Header, Footer, Hero, Logo, ProductCard, QuoteDrawer, LeadForm, Faq, etc.
src/data/           site.ts (coordonnées, chiffres), catalogue.ts, services.ts, projects.ts, faq.ts
src/lib/            panier de devis, schémas zod, canaux de /api/lead, SEO, limitation de fréquence
public/brand/       logos (source + versions claire et sombre)
public/products/    visuels provisoires des catégories
docs/               google-apps-script.gs (script Google Sheets), PROGRESS.md
scripts/            make-logos.mjs
tests/              tests Vitest
```

## Variables d'environnement

En local : `.env.local` (jamais committé). Sur Vercel : Project Settings > Environment Variables. Les variables `NEXT_PUBLIC_*` sont intégrées au build : après modification, il faut **redéployer**.

| Variable | Rôle | Statut |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL publique du site (sitemap, canonical, Open Graph, JSON-LD), ex. `https://www.votre-domaine.ma` | **Obligatoire en production** |
| `NEXT_PUBLIC_WHATSAPP` | Numéro WhatsApp, format international sans `+` (ex. `212600000000`) : bouton flottant et lien de secours `wa.me` | Recommandée (sans elle, le bouton WhatsApp est masqué) |
| `NEXT_PUBLIC_PHONE` | Téléphone affiché et bouton « Appeler » (ex. `+212600000000`) | Recommandée |
| `GOOGLE_SCRIPT_URL` | URL de l'application web Apps Script (canal Google Sheets) | Optionnelle |
| `RESEND_API_KEY` | Clé API Resend (canal email) | Optionnelle |
| `LEAD_TO_EMAIL` | Email qui reçoit les demandes (plusieurs adresses séparées par des virgules) | Optionnelle (requise avec Resend) |
| `LEAD_FROM_EMAIL` | Expéditeur, sur un domaine vérifié dans Resend, ex. `FAYOU Fitness <devis@votre-domaine.ma>` | Optionnelle (requise avec Resend) |
| `WHATSAPP_TOKEN` | Jeton d'accès WhatsApp Cloud API | Optionnelle |
| `WHATSAPP_PHONE_ID` | Identifiant du numéro émetteur WhatsApp Cloud API | Optionnelle |
| `WHATSAPP_TO` | Numéro qui reçoit la notification (chiffres uniquement, format international) | Optionnelle (requise pour les deux modes WhatsApp) |
| `CALLMEBOT_APIKEY` | Clé CallMeBot (alternative simple à la Cloud API) | Optionnelle |
| `NEXT_PUBLIC_GA_ID` | Identifiant Google Analytics 4 (`G-XXXXXXXXXX`). Vide : aucune analytics. | Optionnelle |
| `NEXT_PUBLIC_SMOOTH_SCROLL` | Mettre `off` pour désactiver le défilement fluide (Lenis) | Optionnelle |

Les clés (Google, Resend, WhatsApp, CallMeBot) ne sont lues que côté serveur, dans `/api/lead`. Aucune n'apparaît dans le code client.

### Garde-fou sur `NEXT_PUBLIC_SITE_URL`

Si la variable est vide, le site cherche dans l'ordre `VERCEL_PROJECT_PRODUCTION_URL`, puis `VERCEL_URL` (fournies par Vercel), puis `http://localhost:3000`. En build de production, un repli sur l'une de ces valeurs affiche un avertissement `[site] NEXT_PUBLIC_SITE_URL est vide ...` dans les logs. Le repli Vercel donne une URL en `*.vercel.app` : correct pour tester, pas pour le domaine définitif. Renseignez toujours la variable avec le vrai domaine.

## Canaux de `/api/lead`

Le formulaire envoie la demande à `/api/lead`, qui lance **en parallèle** les canaux configurés (délai maximal de 8 s chacun). La réponse est un succès si au moins un canal a réussi. Chaque échec est journalisé côté serveur (sans clé). Un canal dont les variables sont absentes est ignoré. Si aucun n'est configuré, le formulaire propose le lien de secours `wa.me`.

### 1. Google Sheets (Apps Script)

1. Créez un Google Sheet et copiez son identifiant (la partie de l'URL entre `/d/` et `/edit`).
2. Dans le Sheet : Extensions > Apps Script. Collez le contenu de `docs/google-apps-script.gs`.
3. Renseignez `SHEET_ID` en haut du script. Si vous voulez **uniquement** l'enregistrement dans le Sheet, laissez de côté l'email et CallMeBot (voir « Doublons » ci-dessous).
4. Déployer > Nouveau déploiement > type **Application Web** ; exécuter en tant que **vous** ; accès : **Tout le monde**. Autorisez les droits demandés.
5. Copiez l'URL (`https://script.google.com/macros/s/.../exec`) dans `GOOGLE_SCRIPT_URL`.
6. Après toute modification du script : Déployer > Gérer les déploiements > nouvelle version.

Le site envoie `nom`, `tel`, `projet`, `ville`, `machines`, `details` (les valeurs commençant par `=`, `+`, `-` ou `@` sont préfixées d'une apostrophe pour éviter l'interprétation en formule dans le Sheet ; cette apostrophe peut donc apparaître dans l'email du script).

Remarque : le script reste dans `docs/` comme modèle. Ne committez pas de vrais identifiants dans ce fichier : gardez-les dans votre déploiement Apps Script.

### 2. Email (Resend)

1. Créez un compte sur resend.com et **vérifiez votre domaine** (enregistrements DNS).
2. Créez une clé API : `RESEND_API_KEY`.
3. `LEAD_FROM_EMAIL` doit appartenir au domaine vérifié ; `LEAD_TO_EMAIL` est la boîte qui reçoit les demandes.

Les trois variables sont nécessaires ; sinon le canal est ignoré.

### 3. WhatsApp (au choix)

**Option A, WhatsApp Cloud API (Meta)** : `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_ID`, `WHATSAPP_TO`. Le site envoie un **message texte libre**, que WhatsApp ne livre que **dans la fenêtre de 24 h** qui suit le dernier message du destinataire vers votre numéro professionnel. En dehors de cette fenêtre, il faut un **message modèle (template)** approuvé par Meta, que le site n'envoie pas aujourd'hui. Pour une notification fiable, le destinataire doit donc écrire régulièrement au numéro émetteur, ou le code doit être adapté pour utiliser un template.

**Option B, CallMeBot** : `CALLMEBOT_APIKEY` et `WHATSAPP_TO`. Le destinataire active d'abord CallMeBot en suivant les instructions du service (message d'activation, puis réception de la clé). Plus simple, mais service tiers non officiel.

Si `WHATSAPP_TOKEN` et `WHATSAPP_PHONE_ID` sont renseignés, la Cloud API est utilisée ; sinon CallMeBot.

### Doublons : choisir une seule source

Le script Apps Script fourni envoie **lui aussi** un email (`MailApp`) et une notification CallMeBot. Si le site envoie déjà ces notifications (Resend, CallMeBot) **et** que `GOOGLE_SCRIPT_URL` est renseignée, vous recevrez chaque demande **en double**. Recommandation : une seule source par type de notification. Par exemple, Sheets via le script (en retirant dans le script les blocs email et CallMeBot), email via Resend, WhatsApp via le site. Les blocs à retirer sont les deux `try { ... }` après la construction du texte dans `doPost`. (Le fichier du dépôt n'a pas été modifié : faites cette retouche dans votre copie du script.)

### Secours `wa.me`

Quand `/api/lead` répond qu'aucun canal n'est disponible (503) ou que tous ont échoué (502), le formulaire affiche un lien `https://wa.me/<NEXT_PUBLIC_WHATSAPP>?text=...` avec la demande pré-remplie, que le visiteur envoie lui-même. Ce secours exige `NEXT_PUBLIC_WHATSAPP`.

Protections de l'API : validation `zod`, champ piège anti-spam (honeypot), limite de fréquence par IP (en mémoire, par instance : suffisante comme garde-fou, pas comme protection forte), taille maximale du corps.

## Déploiement sur Vercel

1. Poussez le dépôt sur GitHub/GitLab et importez-le dans Vercel (framework Next.js détecté ; Node 22.x dans Settings > General).
2. Recopiez les variables du tableau ci-dessus (Production, et Preview si besoin). `NEXT_PUBLIC_SITE_URL` avec le domaine définitif.
3. Domaine : Settings > Domains, ajoutez le domaine et configurez le DNS indiqué, puis redéployez pour que `NEXT_PUBLIC_SITE_URL` soit pris en compte.
4. Contrôlez après déploiement : `/sitemap.xml`, `/robots.txt`, une fiche machine, et un envoi réel du formulaire.

## Contenu à remplacer

- **Visuels** : les images de `public/products/` (`placeholder-*.svg`, un par catégorie) sont provisoires. Déposez les vraies photos dans ce dossier et mettez à jour le champ `image` des catégories dans `src/data/catalogue.ts` (les fiches machines utilisent l'image de leur catégorie ; des photos par machine demanderaient d'ajouter ce champ).
- **Catalogue** : `src/data/catalogue.ts` (catégories, machines, état, usages, descriptions). Aucun prix ni marque n'y figure : ajoutez-les seulement quand FAYOU les fournit.
- **Services, projets, FAQ** : `src/data/services.ts`, `src/data/projects.ts`, `src/data/faq.ts`.
- **Coordonnées et chiffres** : `src/data/site.ts`.

## Analytics et défilement

- `NEXT_PUBLIC_GA_ID` : charge Google Analytics 4 si renseignée ; désactivé sinon. Aucun bandeau de consentement n'est fourni : à ajouter si la réglementation applicable l'exige.
- `NEXT_PUBLIC_SMOOTH_SCROLL=off` : désactive Lenis. Le défilement fluide est de toute façon coupé si le visiteur demande `prefers-reduced-motion`.

## Choix à valider par le client

- **6 catégories** au lieu des 5 de la présentation (Cardio, Musculation guidée, Racks et bancs, Charges libres, Training fonctionnel, Aménagement).
- **Regroupement en familles** des 74 fiches (plusieurs éléments du cahier des charges sont regroupés sous une même fiche).
- **État neuf / occasion et usages** (home gym, hôtel, pro) : valeurs **estimées**, à confirmer machine par machine.
- **Page /contact** : la carte interactive est remplacée par des liens (aucune adresse n'est connue ; évite aussi un iframe tiers).
- **JSON-LD `Product` sans offre** : ni prix ni marque (rien n'est fourni). Google n'affichera donc pas d'extraits produit enrichis avec prix.
- **Chiffres clés** : seuls « 20 ans d'expérience » (calculé depuis 2006) est affiché ; les tuiles « projets réalisés » et « équipements installés » sont masquées tant que les chiffres ne sont pas fournis.
- **Textes du catalogue** : à relire et valider.

## Performance

Les scores Lighthouse mesurés pendant le développement (38 à 55 en performance) l'ont été sur une machine lente et en mode développement/local : ils ne sont pas représentatifs. **À remesurer sur PageSpeed Insights après déploiement** (objectif : 95+). Les logos sont préchargés plusieurs fois (header et hero, versions claire et sombre) : point d'optimisation possible si le LCP le justifie.

## Informations à fournir par FAYOU

| Information | Où la changer |
|---|---|
| Numéro WhatsApp (format international sans `+`) | variable `NEXT_PUBLIC_WHATSAPP` |
| Numéro de téléphone | variable `NEXT_PUBLIC_PHONE` |
| Email de réception des demandes | variable `LEAD_TO_EMAIL` (et `EMAIL` dans le script Apps Script) ; email public affiché : `email` dans `src/data/site.ts` (actuellement `null`) |
| Email expéditeur Resend + domaine vérifié | variable `LEAD_FROM_EMAIL` (+ DNS du domaine chez Resend) |
| Chiffres réels : projets réalisés, équipements installés | `src/data/site.ts`, fonction `getChiffresCles` (valeurs `null` à remplacer) |
| Adresse (showroom, bureaux), si affichée | `adresse` dans `src/data/site.ts` (actuellement `null`) |
| Photos des machines et des réalisations | `public/products/` + champ `image` des catégories dans `src/data/catalogue.ts` ; les pages Projets n'affichent pas encore de photos de réalisations (à ajouter) |
| Marques éventuelles (et prix si souhaité) | `src/data/catalogue.ts` (champs à ajouter : aucune marque ni prix n'est affiché aujourd'hui) |
| Clé / URL Google Apps Script | variable `GOOGLE_SCRIPT_URL` |
| Clé Resend | variable `RESEND_API_KEY` |
| Jeton, identifiant de numéro et destinataire WhatsApp Cloud API, ou clé CallMeBot | `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_ID`, `WHATSAPP_TO` ou `CALLMEBOT_APIKEY` |
| Nom de domaine | variable `NEXT_PUBLIC_SITE_URL` + Vercel > Domains |
| Identifiant Google Analytics 4 (si souhaité) | variable `NEXT_PUBLIC_GA_ID` |
| Validation des textes du catalogue, services, projets, FAQ | `src/data/*.ts` |

Rien de tout cela n'est inventé dans le code : les valeurs manquantes sont masquées ou marquées `// À CONFIRMER` dans `src/data/site.ts`.
