# Démarrage rapide

1. Installer Claude Code, puis ouvrir un terminal dans ce dossier.
2. Lancer `claude`.
3. Taper `/agents` : vérifier que `coder` et `verifier` apparaissent.
4. Coller le message de départ ci-dessous.

## Message de départ

Lis CLAUDE.md et FAYOU-FITNESS-NEXTJS.md. Tu es l'orchestrateur : pour chaque étape du plan (1 à 7), appelle l'agent `coder`, puis l'agent `verifier`. Ne passe à l'étape suivante que si le vérificateur répond PASS. Maximum 3 allers-retours par étape, sinon arrête-toi et demande-moi. Le projet Next.js doit être créé dans ce dossier (le logo est dans public/brand/logo-original.png). Commence par l'étape 1 et mets à jour docs/PROGRESS.md.

## Après la création du site
- Copier `.env.example` en `.env.local` et remplir les valeurs.
- Configurer le Google Sheet et le script : voir `docs/google-apps-script.gs`.
- Tester avec `npm run dev`, puis déployer sur Vercel (variables d'environnement à recopier).
