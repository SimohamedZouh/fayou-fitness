# Photos des machines

Un dossier par machine : `public/machines/<slug>/` (le slug est celui de `src/data/catalogue.ts`).

- Nommage : `1.webp`, `2.webp`, `3.webp`... (la première image est celle des cartes produit et de la fiche).
- Largeur conseillée : 1600 px, format WebP.
- Ensuite, lister les chemins dans le champ `images` de la machine, dans `src/data/catalogue.ts`
  (ex. `images: ["/machines/matrix-t5x/1.webp", "/machines/matrix-t5x/2.webp"]`).
- Tant que `images` est vide, le site affiche le visuel provisoire (aucune photo inventée).
