# Suivi du projet FAYOU Fitness

| Étape | Nom | Statut | Verdict vérificateur | Date |
|---|---|---|---|---|
| 1 | Projet, thème, polices, logo | validée (essai 1) | PASS | 2026-11-03 |
| 2 | Données (catalogue, services, projets, site) | validée (essai 2) | PASS (essai 1 FAIL : regex téléphone) | 2026-11-03 |
| 3 | Layout, header, footer, WhatsApp, thème | en cours (essai 1) | | 2026-11-03 |
| 4 | Pages (accueil, catalogue, catégories, fiches, services, projets, à propos, contact) | à faire | | |
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
