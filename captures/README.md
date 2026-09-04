# Captures du site

Site vitrine de JIP — Jobard Immobilier Paris, branche `refonte/direction-artistique-hall`.
Captures prises depuis le build de production (`npm run build` + `vite preview`), avec
`?mouvement=0` pour figer l'état final des apparitions. Deux écrans par page, pleine hauteur :
`*-bureau.png` à 1440 px, `*-telephone.png` à 390 px en échelle 2 (fichiers de 780 px).

## `JIP Redesign.dc.html`

La planche Claude Design du 04/09/2026 : trois directions pour l'accueil (1a, 1b, 1c), puis la
direction **1a « La Plaque »** déclinée sur l'arborescence (2a) et sept pages (2b–2i). C'est
elle qui a été mise en place.

## Racine : état AVANT la refonte (direction « Le hall », 04/09/2026 au matin)

Onze pages de l'ancienne arborescence, dont trois n'existent plus (`05-estimation-biens`,
`06-achats-ventes`, `08-equipe` — fusionnées). Conservées pour comparaison.

## `apres/` : état APRÈS la refonte « La Plaque » (04/09/2026)

| Fichier | Route |
|---|---|
| 01-accueil | `/` |
| 02-biens | `/biens` |
| 03-gestion-locative | `/services/gestion-locative` |
| 04-gestion-copropriete | `/services/gestion-copropriete` |
| 05-vendre-estimer | `/services/vendre-estimer` (fusion Estimation + Achats/ventes) |
| 06-fiche-bien | `/biens/v027-3-pieces-immeuble-renove` (nouvelle page, une par annonce) |
| 07-agence | `/agence` (fusion Agence + Équipe) |
| 08-contact | `/contact` |
| 09-mentions-legales | `/mentions-legales` |
| 10-page-404 | toute URL inconnue |
| 12-menu-mobile-ouvert-telephone | `/`, menu ouvert |

Sur les captures téléphone pleine hauteur, la barre d'appel fixe apparaît au milieu de l'image :
c'est un artefact de la capture (l'élément est fixé au bas de l'écran, voir la capture du menu).

Non capturé : survol, focus, formulaire en erreur, résultat d'estimation, carte Google chargée,
galerie de photos ouverte.
