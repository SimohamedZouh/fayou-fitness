# Suivi du projet FAYOU Fitness

| Étape | Nom | Statut | Verdict vérificateur | Date |
|---|---|---|---|---|
| 1 | Projet, thème, polices, logo | validée (essai 1) | PASS | 2026-11-03 |
| 2 | Données (catalogue, services, projets, site) | validée (essai 2) | PASS (essai 1 FAIL : regex téléphone) | 2026-11-03 |
| 3 | Layout, header, footer, WhatsApp, thème | validée (essai 1) | PASS | 2026-11-04 |
| 4 | Pages (accueil, catalogue, catégories, fiches, services, projets, à propos, contact) | validée (essai 1, reprise) | PASS | 2026-11-04 |
| 5 | Panier de devis, formulaire, /api/lead | validée (essai 1) | PASS | 2026-11-04 |
| 6 | Animations, SEO, accessibilité, tests | validée (essai 3) | PASS (essai 1 FAIL : logo LCP en lazy ; essai 2 FAIL : recherche cassée split(/s+/)) | 2026-11-05 |
| 7 | Build final, README, livraison | validée (essai 1) | PASS | 2026-11-05 |

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
- 2026-11-04 : vérificateur, étape 5 (panier, formulaire, /api/lead) : PASS. tsc/lint/build OK, 15/15 tests ; aucune clé dans le bundle client ; 3 canaux en parallèle (allSettled + timeout 8 s) ; 400/413/429/503/502 et honeypot testés ; panier persistant sans erreur d'hydratation, tiroir accessible, formulaire pré-rempli, secours wa.me. Mineurs : doublons possibles email/CallMeBot si le script Apps Script et le site sont tous deux configurés (à documenter au README), apostrophe anti-formule visible dans l'email du script, catégorie sans accents dans le tiroir, message téléphone en double dans la réponse 400, corps lu avant le contrôle de taille, focus non déplacé après succès.
- 2026-11-05 : vérificateur, étape 6 (animations, SEO, accessibilité, tests) : PASS (essai 3). tsc/lint/build OK, 39/39 tests ; 404 réelle dès la 1re requête (ensureStatic) ; sitemap 86 URL, robots, manifest ; JSON-LD valide sans donnée inventée ; contrastes AA et axe sans violation ; reduced motion OK ; contenu visible sans JS ; logo hero/header en eager (lcp-lazy-loaded réussi) ; recherche vérifiée dans le navigateur. Mineurs pour l'étape 7 : NEXT_PUBLIC_SITE_URL obligatoire en production, carte /contact remplacée par des liens (à valider), perf Lighthouse à remesurer après déploiement (38-55 sur machine lente), 4 préchargements de logo, Product JSON-LD sans offers (voulu).
- 2026-11-05 : vérificateur, étape 7 (build final, README, livraison) : PASS. tsc/lint OK, 42/42 tests, build OK (97 pages) ; routes 200, 404 dès la 1re requête, API 400 sur corps invalide ; avec NEXT_PUBLIC_SITE_URL, sitemap/robots/canonical/JSON-LD sur le domaine ; README exact par rapport au code et au script committé, liste « Informations à fournir » complète ; aucun secret ni donnée personnelle dans le dépôt ni l'historique. Mineurs restants : NEXT_PUBLIC_SITE_URL lue à l'exécution (à définir au build ET au runtime), avertissements de préchargement du logo, précisions README (perf mesurée sur build local, constantes EMAIL/WA_PHONE/WA_APIKEY du script, accord « seul »).
- 2026-11-05 : vérificateur, corrections finales (SITE_URL inlinée au build, précisions README) : PASS. tsc/lint OK, 42/42 tests ; build avec NEXT_PUBLIC_SITE_URL puis start sans : 0 localhost:3000 sur 13 URL. Mineurs cosmétiques restants : double renvoi « Doublons » dans le README, cas `default` de `lire` dans site.ts.
- 2026-11-05 : vérificateur, correctif canal Sheets (page de connexion Google prise pour un succès) : PASS. tsc/lint/build OK, 46/46 tests ; faux script local : 302 puis {"ok":true} → 200, HTML de connexion → 502 + secours wa.me dans le navigateur, {"ok":false} → 502 ; aucune URL du script dans les journaux. Mineurs : préciser au README que le script doit renvoyer { ok: true } et qu'un échec du Sheet seul (autre canal OK) n'apparaît que dans les logs Vercel.
