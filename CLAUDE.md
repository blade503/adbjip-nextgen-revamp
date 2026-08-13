# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Site vitrine de **JIP — Jobard Immobilier Paris** (27 rue de Lisbonne, 75008), agence de
gestion locative et de syndic. Refonte destinée à remplacer le Symfony 3.3 de 2017 encore en
production sur www.adbjip.fr. Le contenu, les commentaires et les messages de commit sont en
français.

## Commandes

```bash
npm run dev                              # Vite sur le port 8080 (fixé dans vite.config.ts)
npm run build                            # production → dist/
npm run build:dev                        # build non minifié, utile pour déboguer un bundle
npm run lint                             # ESLint 9 (flat config)
npx tsc --noEmit -p tsconfig.app.json    # typecheck — `npm run build` NE type-vérifie PAS
npm run biens:fetch                      # rapatrie les annonces + photos (voir plus bas)
```

Aucun test n'est configuré : ni runner, ni fichier de test. Ne pas inventer `npm test`.

`npm run lint` sort avec ~22 erreurs et 11 avertissements préexistants (surtout
`no-explicit-any` dans `MarketDataService.tsx` et `react-refresh/only-export-components` dans
`components/ui/`). Comparer avant/après plutôt que viser zéro.

## Prérequis avant le premier `npm run dev`

`npm run biens:fetch` **est obligatoire sur un clone neuf** : `src/lib/biens.ts` importe
`data/biens.json` à la compilation, et les photos vivent dans `public/biens/` qui est en
`.gitignore` (9,6 Mo régénérables). Sans cette commande, le build casse ou la page `/biens`
s'affiche sans images.

## Architecture

### Coquille de page

`src/App.tsx` déclare toutes les routes explicitement (`BrowserRouter`, `ScrollToTop`,
catch-all `*` en dernier). Chaque page suit la même structure :

```tsx
<SEOHead title=… description=… canonicalUrl=… structuredData={…} />
<Header /> <main role="main"> … </main> <Footer />
```

`SEOHead` injecte les balises et le JSON-LD ; `src/config/seo.ts` centralise des gabarits de
métadonnées. **Piège** : ce fichier contient encore une identité de démonstration (« ABDJIP »,
`abdjip.fr`, « 123 Rue de Rivoli 75001 ») qui ne correspond pas à l'agence réelle. Vérifier
avant de s'en servir.

### Chaîne des annonces — la seule donnée dynamique du site

```
API agence  →  scripts/fetch-biens.mjs  →  data/biens.json + public/biens/*.jpg|svg
                                              ↓ (alias @data)
                                        src/lib/biens.ts  →  src/pages/Biens.tsx
```

- **`scripts/fetch-biens.mjs`** : `SOURCE=bienici` (défaut, endpoint public sans clé) ou
  `SOURCE=gedeon` (+ `GEDEON_KEY`, branche **non testée**). Normalise, télécharge chaque photo
  en 3 variantes, rapatrie les badges DPE/GES, purge les orphelins, `FORCE=1` retélécharge.
  En cas d'échec il **conserve le jeu précédent et sort en 0** : ne pas « corriger » ce
  comportement, c'est ce qui empêche la page de se vider en production.
- **`src/lib/biens.ts`** : types, formatage et surtout les **mentions réglementaires**
  (arrêté du 10 janvier 2017 pour la vente, loi ALUR pour la location). Tout affichage de prix
  doit s'accompagner du taux d'honoraires et de la partie qui les supporte.
- Les données ne se corrigent **jamais** dans le code : la source est le logiciel de gestion de
  l'agence. `fetch-biens.mjs` se contente de signaler les incohérences (`⚠ réf. …` — taux
  d'honoraires déclaré ≠ calculé, titre vide, date de publication absente) sans les réécrire.
- **Diff entre deux synchros** : le script compare au `data/biens.json` précédent et stocke des
  *dates* (`firstSeenAt`, `previousPrice` + `priceChangedAt`), jamais un booléen. Les tags
  « Nouveau » et « Baisse de prix » se calculent à l'affichage (`isNew`, `priceDrop` dans
  `src/lib/biens.ts`, fenêtre `NEW_WINDOW_DAYS`) : un booléen figé au build resterait vrai
  jusqu'au prochain déploiement. Quand l'ancienneté est inconnue — source sans date et aucun
  historique local — `firstSeenAt` reste absent et l'annonce n'est pas dite nouvelle.
- **`.github/workflows/sync-biens.yml`** : cron quotidien 04:00 UTC → fetch, commit de
  `data/biens.json` si le portefeuille a bougé, `npm run build`, envoi FTP de `dist/` chez LWS.
  L'alias `@data` est déclaré dans `vite.config.ts` **et** dans les deux `tsconfig`.

### Estimation immobilière

`src/pages/services/EstimationBiens.tsx` orchestre `QuickCalculator`, `InteractiveMap` et
`EstimationStats`. Toute la logique vit dans **`MarketDataService`** (singleton, caches 24 h) :
géocodage via `api-adresse.data.gouv.fr`, puis cascade DVF officielle → table par code postal →
estimation géographique, chacune renvoyant `{ basePricePerM2, confidence, sampleSize, source }`.
Passer par ce service plutôt que refaire un `fetch` : `InteractiveMap` a longtemps dupliqué le
géocodage. N'afficher que les champs réellement renvoyés — pas de délai de vente ni d'évolution
annuelle, qui ne sont pas calculés.

### Design system

Les tokens sont des variables CSS HSL dans `src/index.css` (`--primary` jaune, `--secondary`
marine, gradients, ombres), exposées à Tailwind par `tailwind.config.ts`. Utiliser les classes
de tokens (`bg-primary`, `text-muted-foreground`, `shadow-card`) et non des couleurs brutes.
Utilitaires maison dans la couche `components` : `glass`, `glass-strong`, `gradient-text`,
`hover-lift`, `hover-glow`, `animate-slide-up`.

## Points de vigilance connus

- **Contraste** : `--primary-foreground` est blanc sur le jaune `--primary`, soit **1,96:1**
  (il en faut 4,5). Le marine donnerait 6,10:1. Ne pas aggraver en ajoutant du blanc sur jaune.
- **`Header.tsx` rend un `<h1>`** pour le logo : chaque page en a donc deux.
- **Chiffres inventés** dans plusieurs pages (« 500+ clients », « 98 % de satisfaction »,
  témoignages fictifs, compteur d'estimations qui s'incrémente à chaque chargement). Signalé au
  client, pas encore arbitré — ne pas en ajouter.
- **~10 Mo de PNG** dans `src/assets/` partent tels quels dans `dist/`.
- Déploiement statique : un fallback SPA (`.htaccess`) est **indispensable** chez LWS, sinon
  `/biens` en accès direct renvoie un 404 Apache. Il n'est pas encore dans le dépôt.

## REPRISE.md

`REPRISE.md` à la racine est la note de passation : état du site en production, redirections
301 à écrire, formulaires PHP à recâbler, accès et clés à obtenir, pièges des sources de
données et de GitHub Actions. À lire avant toute décision d'architecture ou de mise en ligne,
et à tenir à jour.

## Origine Lovable

Projet généré par Lovable (`lovable-tagger` actif en mode développement uniquement). Des
modifications faites depuis Lovable peuvent atterrir directement sur `main`. Vérifier l'état du
dépôt distant avant de commencer.
