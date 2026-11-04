# Suivi du projet FAYOU Fitness

| Étape | Nom | Statut | Verdict vérificateur | Date |
|---|---|---|---|---|
| 1 | Projet, thème, polices, logo | validée (essai 1) | PASS | 2026-11-03 |
| 2 | Données (catalogue, services, projets, site) | validée (essai 2) | PASS (essai 1 FAIL : regex téléphone) | 2026-11-03 |
| 3 | Layout, header, footer, WhatsApp, thème | validée (essai 1) | PASS | 2026-11-04 |
| 4 | Pages (accueil, catalogue, catégories, fiches, services, projets, à propos, contact) | validée (essai 1, reprise) | PASS | 2026-11-04 |
| 5 | Panier de devis, formulaire, /api/lead | à faire | | |
| 6 | Animations, SEO, accessibilité, tests | à faire | | |
| 7 | Build final, README, livraison | à faire | | |

## Informations à fournir par FAYOU
- [ ] Numéro WhatsApp et téléphone
- [ ] Email de réception des demandes
- [ ] Chiffres réels (projets réalisés, équipements installés)
- [ ] Photos des machines et des réalisations
- [ ] Clés d'API (Google Script, Resend, WhatsApp)
- [ ] Nom de domaine

- 2026-11-03 : vérificateur, étape 1 (projet, thème, polices, logo) : PASS. lint/tsc/build OK ; logo sombre vérifié au pixel (noir -> blanc 99,9 %, violet conservé, alpha identique) ; thème système + localStorage OK sans flash. Mineurs : nom accessible du logo absent en mode sombre, variable --font-display auto-référencée dans @theme, double préchargement des logos.
- 2026-11-04 : vérificateur, étape 3 (layout, header, footer, WhatsApp, thème) : PASS. lint/tsc/build OK ; liens nav conformes au §2 (/, /machines, /services, /projets, /a-propos, /contact + 6 catégories) ; lien actif (aria-current + soulignement) ; menu mobile avec piège de focus, Échap, verrou de scroll ; wa.me généré depuis NEXT_PUBLIC_WHATSAPP ; aucun débordement horizontal à 375/768/1280 (clair et sombre) ; thème système sans flash, bascule persistée ; 404 personnalisée. Mineurs : FAB masqué si NEXT_PUBLIC_WHATSAPP absent, FAB recouvre le bas du footer sur mobile, compteur devis figé à 0 (étape 5), 404 de prefetch vers les pages de l'étape 4.
- 2026-11-04 : vérificateur, étape 4 (pages) : PASS. lint/tsc/build OK (99 pages, 6 catégories + 74 fiches SSG) ; 0 erreur console sur 15 pages en clair/sombre ; filtres dans l'URL OK ; pas de scroll horizontal à 375 px ; 86 liens internes sans 4xx. Mineurs à reprendre : soft 404 (HTTP 200 à la 1re visite d'un slug inconnu), #7f00fb en dur dans ButtonLink/CategoryCard, hero pas plein écran, aria-label figé du bouton « Ajouter au devis », /machines non regroupé par catégorie, double préchargement des logos, titre /a-propos redondant, iframe OSM tierce.
