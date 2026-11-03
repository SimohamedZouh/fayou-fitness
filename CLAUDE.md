# FAYOU Fitness : règles de travail du projet

Le cahier des charges complet est dans `FAYOU-FITNESS-NEXTJS.md`. Lis-le avant toute action.

## Organisation : un orchestrateur et deux agents

La session principale (toi) est l'**orchestrateur**. Tu ne codes pas toi-même les étapes du plan : tu les confies à deux sous-agents, définis dans `.claude/agents/` :

- **`coder`** : écrit le code d'une seule étape.
- **`verifier`** : contrôle et teste l'étape, puis rend un verdict `PASS` ou `FAIL`. Il ne modifie pas le code.

Les sous-agents ne peuvent pas s'appeler entre eux : c'est donc toi qui fais circuler le travail.

## Boucle obligatoire pour chaque étape

Les étapes sont celles de `FAYOU-FITNESS-NEXTJS.md` §11 (1 à 7). Pour chaque étape :

1. Crée ou mets à jour `docs/PROGRESS.md` (étape en cours, statut).
2. Appelle le sous-agent **`coder`** avec : le numéro de l'étape, son contenu exact, et, en cas de reprise, le rapport `FAIL` du vérificateur.
3. Quand le développeur a rendu son rapport, appelle le sous-agent **`verifier`** avec : le numéro de l'étape et le rapport du développeur.
4. Lis le verdict :
   - **`PASS`** : note l'étape comme validée dans `docs/PROGRESS.md`, fais un commit (`git commit -m "étape N : <nom>"`), puis passe à l'étape suivante.
   - **`FAIL`** : renvoie la liste des problèmes au **`coder`** pour correction, puis relance le **`verifier`**. Répète.
5. **Maximum 3 allers-retours** par étape. Au-delà, arrête-toi, résume le blocage et demande à l'utilisateur.

## Interdits

- Passer à l'étape N+1 tant que l'étape N n'a pas reçu un `PASS` du vérificateur.
- Valider une étape sans avoir lu le verdict du vérificateur.
- Demander au `coder` de valider son propre travail à la place du `verifier`.
- Inventer prix, marques, témoignages, numéros ou chiffres (voir §10 du cahier des charges).
- Committer des secrets (`.env.local`).

## Fin de projet

Quand l'étape 7 est validée, fais un résumé court : ce qui est livré, les commandes pour lancer le site, et la liste des informations à fournir par FAYOU (numéro WhatsApp, chiffres, photos, clés d'API).

## Messages à l'utilisateur

Réponds en français, de façon courte : à chaque étape, une phrase sur le résultat (`PASS` ou `FAIL`) et la suite.
