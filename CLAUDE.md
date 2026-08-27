# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Site vitrine de **JIP — Jobard Immobilier Paris** (27 rue de Lisbonne, 75008), agence de
gestion locative et de syndic. Refonte destinée à remplacer le Symfony 3.3 de 2017 encore en
production sur www.adbjip.fr. Le contenu, les commentaires et les messages de commit sont en
français.

## Règles de travail (valables pour toute session)

**Avant d'écrire.** Lis les fichiers que tu vas modifier, en entier, et les fichiers qui les
importent. Ne propose pas de plan avant. Si un fichier fait plus de 300 lignes, dis-moi ce
qu'il fait avant de le toucher — c'est ma vérification que tu l'as lu.

**Rien d'inventé.** Aucun chiffre, nom, avis, taux d'honoraires, horaire, numéro de carte
professionnelle ou statistique ne s'écrit sans source. Une donnée manquante reste `null` et
s'affiche « à compléter ». Si tu as besoin d'une valeur que je ne t'ai pas donnée, demande-la
— ne la déduis pas, ne la rends pas plausible.

**Préserver.** Ne supprime ni ne réécris un fichier qui marche pour le rendre « plus propre ».
Si tu penses qu'une réécriture est nécessaire, explique ce qui casse aujourd'hui, et attends.
Les commentaires existants expliquent souvent une décision : ne les enlève pas, mets-les à
jour.

**Vérifier, à chaque fin de tâche, sans exception :**

```bash
npm run typecheck
npm run lint
npm run build
```

Colle-moi la sortie des trois. `lint` sort avec un nombre d'erreurs préexistant : compare au
repère (**19 erreurs, 4 avertissements**, cf. § Commandes), ne cherche pas zéro. Si `tsc` ou
`build` échoue, corrige avant de me répondre. Ne dis jamais « c'est fait » sans ces sorties.

**Voir avant d'affirmer.** Pour tout changement visuel, prends une capture d'écran et
regarde-la. Sers le HTML avec un `<!doctype html>` : sans lui Chrome rend en mode quirks, où
les tableaux n'héritent pas de la couleur, et le corps d'un tableau devient invisible sur fond
clair. Cette page-là a déjà coûté une heure.

**Portée.** Fais ce qui est demandé, pas ce qui serait bien aussi. Si tu vois un autre
problème, signale-le en une phrase à la fin et n'y touche pas.

**Langue.** Contenu, commentaires et messages de commit en français. Les commentaires
expliquent *pourquoi*, jamais *quoi*.

**Accessibilité, non négociable.** Contrastes calculés et non estimés ; focus visible ;
navigable au clavier ; `prefers-reduced-motion` respecté sans jamais laisser un contenu
invisible. Une régression d'accessibilité annule la tâche.

## Commandes

```bash
npm run dev                              # Vite sur le port 8080 (fixé dans vite.config.ts)
npm run build                            # production → dist/
npm run build:dev                        # build non minifié, utile pour déboguer un bundle
npm run lint                             # ESLint 9 (flat config)
npm run typecheck                        # tsc --noEmit — `npm run build` NE type-vérifie PAS
npm run test                             # Vitest — logique pure de src/lib/ UNIQUEMENT
npm run biens:fetch                      # rapatrie les annonces + photos (voir plus bas)
```

### Le repère de vérification (relevé le 27/08/2026)

Les trois commandes ci-dessous sont le seul contrôle du projet. Leurs compteurs à l'état sain :

| Commande             | Attendu                                                              |
|----------------------|----------------------------------------------------------------------|
| `npm run typecheck`  | **0 erreur**. Toute erreur est bloquante.                            |
| `npm run lint`       | **23 problèmes — 19 erreurs, 4 avertissements.** Comparer, pas viser zéro. |
| `npm run test`       | **39 cas verts**, ~200 ms. Logique pure de `src/lib/` seulement. |
| `npm run build`      | **1 727 modules**, ~1,7 à 2,7 s, `[sitemap] 9 URL`, `[prerender] 10/10 + la page 404`. |

Poids de sortie au repère (relevé le 27/08/2026, après découpage des routes et retrait des
deux dépendances mortes) : morceau d'entrée **JS 273,0 Ko → 88,2 Ko gzip**, **CSS 55,8 Ko →
12,2 Ko gzip**, **474,7 Ko** pour l'ensemble de `dist/assets/`. Le CSS n'est pas découpé par
route — chantier ouvert, sans urgence à ce poids.

Les 19 erreurs de lint sont préexistantes, surtout `no-explicit-any` dans
`MarketDataService.tsx` et un `no-require-imports` dans `tailwind.config.ts`. Un total
supérieur à 23 signale une régression introduite par la tâche en cours.

`[prerender] 10/10` correspond aux dix routes réelles de `src/App.tsx` (le catch-all `*` est
exclu). `[sitemap] 9 URL` en compte une de moins : `/mentions-legales` en est volontairement
absente. Ces deux nombres ne sont pas censés être égaux.

**Les tests couvrent la logique pure de `src/lib/`, et rien d'autre** (Vitest, ajouté le
27/08/2026, `vitest.config.ts` distinct de `vite.config.ts`). Périmètre volontairement
étroit : `src/lib/biens.test.ts`, 31 cas sur le formatage des prix, la fenêtre de nouveauté,
la baisse de prix, les mentions d'honoraires et le portefeuille réduit ou vide. **Pas de tests
de composants** — ce qui se voit se vérifie par capture d'écran regardée, ce qui se calcule se
vérifie ici. Deux tests portent sur `data/biens.json` réel : ils tombent si l'agence publie un
prix sans sa mention d'honoraires.

Dans ce projet, « tester » veut donc dire :

1. `npm run typecheck` — 0 erreur ;
2. `npm run lint` — au repère ;
3. `npm run test` — 31 cas verts ;
4. `npm run build` — termine, et prérend les 10 pages ;
5. le **prérendu** vérifié (pas de page sous 2 000 octets, sinon échec silencieux) ;
6. une **capture d'écran prise ET regardée** pour tout changement visuel.

Les six, ou la tâche n'est pas terminée.
Les 41 composants shadcn jamais utilisés ont été supprimés le 19/08/2026 : il en reste **sept**
(accordion, badge, button, card, dialog, input, textarea) et les dépendances ont été ramenées de
49 à **11**. Ne pas réinstaller l'échafaudage complet « au cas où ».

Le 27/08/2026, deuxième passe : `tooltip` retiré (une seule info-bulle affichée sur tout le site :
aucune), et avec lui `@radix-ui/react-tooltip` ; `@tanstack/react-query` retiré aussi, il n'était
plus qu'un `QueryClientProvider` vide autour du routeur — pas un `useQuery` dans le dépôt.
**Mesuré : morceau d'entrée 110,3 → 88,2 Ko gzip, soit −22,1 Ko sur chaque première visite**, et
1 783 → 1 727 modules. `src/App.tsx` porte le commentaire qui explique pourquoi il n'y a plus de
fournisseur autour du `BrowserRouter`.

Dans le même geste, les **14 exports jamais consommés** ont disparu : les cinq sous-composants de
`card` (88 → 34 lignes, seul `Card` subsiste), et six de `dialog` (120 → 90 lignes ; l'API publique
se réduit à `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, ce que les trois appelants
emploient réellement). **`DialogPortal` et `DialogOverlay` gardent leur définition** — ils sont
consommés en interne par `DialogContent` — mais ne sont plus exportés.

## Prérequis avant le premier `npm run dev`

`npm run biens:fetch` **est obligatoire sur un clone neuf** : `src/lib/biens.ts` importe
`data/biens.json` à la compilation, et les photos vivent dans `public/biens/` qui est en
`.gitignore` (5,4 Mo régénérables — 9,6 Mo avant le passage au WebP). Sans cette commande, le build casse ou la page `/biens`
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
  en 3 variantes **et les convertit en WebP**, rapatrie les badges DPE/GES, purge les orphelins,
  `FORCE=1` retélécharge, `SANS_WEBP=1` écrit les JPEG tels quels.
  **La conversion est locale parce que le service d'images de l'agence ignore `format`** :
  `format=webp` et `format=avif` renvoient tous deux du JPEG — vérifié sur les trois largeurs
  par la signature du fichier, pas par l'en-tête. Réglage retenu : `quality: 78, effort: 6`.
  Mesuré sur les 102 fichiers réels : **9,37 Mo → 5,19 Mo, −44,6 %**, 7,9 s d'encodage. (q72
  descendrait à 4,65 Mo, −50,3 %, mais la source est déjà un JPEG de qualité 75 : la conversion
  est une seconde passe avec perte, et ces photos servent à acheter un appartement. Comparaison
  de pixels faite sur du feuillage, le cas le plus dur : indistinguables, q78 laisse la marge.)
  L'encodeur est **`sharp`, en devDependency** : jamais dans le bundle du navigateur, et
  l'hébergement n'en a pas besoin — LWS ne reçoit que `dist/` par FTP. Les trois workflows font
  `npm ci` sans `--omit=dev`, **aucun n'est à modifier**. L'`import` est optionnel : sans sharp,
  les JPEG sont écrits tels quels avec un avertissement, parce que la première règle du script
  est de ne jamais vider la page `/biens`.
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

### Design system — « Le hall » (27/08/2026)

Direction artistique complète, documentée en tête de `src/index.css`. Le principe
tient en une phrase : **le public voit la façade, le syndic connaît le hall.** Une
agence de gérance et de syndic ne vend pas un appartement ensoleillé, elle détient
les clés, le registre et les comptes d'un immeuble sur vingt ans. Le site est donc
posé dans le hall d'un immeuble haussmannien.

**Le site est sombre par défaut sur sa coquille, et c'est une décision mesurée**,
pas une humeur. Le jaune de l'enseigne plafonne à **1,81:1** sur un fond clair —
inutilisable en texte, d'où les deux déclinaisons sombres qu'il avait fallu
inventer pour pouvoir l'écrire quelque part. Sur le fond de nuit il atteint
**8,91:1**. Inverser était la seule manière de rendre à l'agence sa couleur.

Six matières, nommées par la matière et non par la fonction (`src/index.css`) :

| jeton      | valeur         | rôle                          | ratios mesurés |
|------------|----------------|-------------------------------|----------------|
| `--nuit`   | `212 34% 9%`   | fond sombre, la boiserie      | pierre 16,08:1 · laiton 8,91:1 · zinc 7,41:1 |
| `--marine` | `217 40% 15%`  | champ des plaques             | laiton 7,79:1 · pierre 14,05:1 |
| `--pierre` | `40 26% 94%`   | fond clair, pierre de taille  | encre 15,02:1 |
| `--ivoire` | `40 30% 97%`   | surface claire surélevée      | encre 15,98:1 |
| `--encre`  | `214 34% 12%`  | texte sur pierre              | — |
| `--zinc`   | `213 16% 66%`  | texte second sur la nuit      | — |
| `--laiton` | `38 88% 55%`   | accent, et l'enseigne         | **1,81:1 sur pierre — interdit en texte** |

**`.nuit` est le mécanisme central.** La classe rebascule tous les jetons pour son
sous-arbre : `<section className="nuit bg-nuit">` et toute la bibliothèque de
composants suit sans savoir qu'elle a changé de fond. **Toute section sombre doit
la porter** — les quatre ouvertures de pages services étaient sombres sans elle,
et affichaient de l'encre sur du marine. `.dark` reçoit la même définition, pour
qu'il n'y ait pas deux palettes sombres divergentes dans le fichier.

**L'unité du système est la plaque.** Dans un hall parisien, tout est plaqué : la
plaque de rue, celle du syndic à côté de la porte, les boîtes aux lettres gravées,
les numéros de lot. La plaque n'est donc pas un ornement au-dessus des titres,
c'est la géométrie de tout ce qui est encadré : champ d'émail, **liseré gravé en
retrait de 4 px** (`.cadre`, un `::after` et non une bordure — c'est ce qui
distingue une plaque d'un rectangle cerné), capitales espacées. Boutons, badges,
champs, images, panneaux : même cadre. Rayon de 2 px partout.
`src/components/systeme/PlaqueDeRue.tsx` en est la version à l'échelle d'un objet,
et c'est l'ouverture du site — le titre de la page d'accueil est une adresse.

**Typographie : deux linéales, et le contraste est de LARGEUR.** Archivo pour les
titres et les plaques (axe `wdth` 100..125, composée à 104–120), Inter pour le
texte, la donnée et l'interface. Pas d'opposition serif / sans — trop attendue, et
un romain à empattements s'opposait à la plaque, qui est de la signalétique. Les
capitales élargies sont la proportion exacte d'une plaque émaillée.
Coût mesuré : Archivo 87,9 Ko + Inter 71,3 Ko = **159,2 Ko contre 201,9 Ko avant**,
parce que l'axe italique d'Inter était demandé (133,7 Ko) sans qu'une seule ligne
du site soit en italique. Ajouter une famille a allégé la page.
À savoir : borner les plages d'axes dans l'URL Google Fonts ne réduit pas le
fichier — vérifié, `wght@400..700` et `wght@500..600` pèsent identique.

**Mouvement : « ouverture »** (`src/components/systeme/Ouverture.tsx`). Trois
gestes, une seule courbe (`--sortie`, sortie exponentielle sans dépassement) :
le **trait** se tire de la gauche, le **voile** dévoile le contenu sous un
`clip-path`, le **calage** pose l'image depuis 1,05 une seule fois. Le survol ne
déplace RIEN : un lavis entre par la gauche, le liseré se réveille, l'image se
cale de 3 % (`.rasante`).
Le masquage est décidé en JavaScript et **seulement sous le pli** : `build` prérend
dix pages en HTML statique, et un `[data-voile] { opacity: 0 }` en CSS pur aurait
expédié ce HTML avec un contenu invisible. Rien de ce qui est déjà peint n'est
jamais masqué.

**Photographie.** Toute image d'atmosphère passe au duotone (`.photo-editoriale`,
ombres vers le marine, lumières vers la pierre) pour que le site n'ait qu'un
climat. **Jamais sur une photo d'annonce** : un acheteur a droit à la couleur
réelle du bien. Ce qui unifie les annonces à la charte, c'est le cadre gravé, pas
la colorimétrie.

**Anciennes classes réaffectées, pas supprimées.** Onze pages s'en servaient ;
les redéfinir a corrigé une centaine d'usages sans rouvrir onze fichiers :
`glass` / `glass-strong` → `.panneau` (plus de `backdrop-filter`) ·
`hover-lift` / `hover-glow` → `.rasante` (rien ne décolle) ·
`gradient-text` → aplat · `bg-gradient-subtle` → aplat ·
`animate-slide-up` → le voile · `shadow-elegant|card|float` → ombres d'encre ·
`--radius*` et `rounded-2xl|3xl` → géométrie de plaque.
**Ne pas réintroduire** le verre dépoli, les titres en dégradé, les cartes qui
décollent, les halos jaunes, les pastilles d'icônes colorées, les gélules.

### Le contrat de mouvement

Le système « Ouverture » (3 courbes, 6 durées, 4 déplacements) est dans
`src/index.css`. Ce qui suit n'est pas un style, c'est un contrat : le violer
casse des choses mesurées.

- **`transition: all` / `transition-all` est interdit.** Il y en avait 17, il en
  reste 0. Une liste explicite de propriétés, toujours.
- **Propriétés animables** : `opacity`, `transform`, `filter`, `box-shadow`,
  `background-color`, `color`, `clip-path`, `mask-image`. **Jamais** `width`,
  `height`, `top`, `left`, `margin`, `padding`. La seule exception est
  `grid-template-rows` pour un dépliage — c'est ainsi que la ligne d'adresse de
  l'en-tête se replie.
- **CLS : 0,001914 à froid, et le chiffre de 0 était faux.** Les premières
  mesures (0 / 0,000242 / 0) avaient été prises avec les polices en cache : le
  remplacement n'avait alors jamais lieu. Relevé le 27/08/2026, cache désactivé,
  390 × 844, réseau bridé à 1,6 Mb/s et 150 ms, **reproductible à la sixième
  décimale sur quatre chargements** : `0,001914`. Deux décalages, à 2 700 ms
  (Archivo) et 2 880 ms (Inter), tous deux dans la plaque de rue du héros, qui
  repousse le titre, le filet et les boutons. Le seuil des Core Web Vitals est
  0,1 : on est cinquante fois en dessous.
  **Ne pas précharger les woff2 pour corriger cela — c'est mesuré perdant.**
  Deux `<link rel="preload" as="font">` ramènent le CLS à 0,000555 (−71 %) mais
  font passer le **LCP de 1 657 à 2 440 ms (+783)**. Chronologie relevée : les
  polices (72 + 88 Ko) partent à 308 ms, l'image du héros (78 Ko,
  `fetchPriority="high"`) à 309 ms ; sur un lien bridé elles se partagent la
  bande passante et l'image — qui **est** l'élément LCP, vérifié par
  `PerformanceObserver` — finit à 2 409 ms. On échangeait 0,00136 de CLS sur un
  seuil de 0,1 contre 783 ms de LCP sur un seuil de 2 500. L'essai est documenté
  en commentaire dans `index.html`, à l'endroit exact où la tentation revient.
  La vraie correction du résidu serait une **police de repli aux métriques
  ajustées** (`size-adjust`, `ascent-override`) : coût réseau nul. Non faite.
  Le défilement, lui, ne décale **rien** — l'en-tête garde 68 px constants, le logo
  se réduit par `transform` et l'adresse par `grid-template-rows`.
- **Un seul écouteur de défilement**, passif, dans `src/lib/defilement.ts`. Il
  écrit deux choses sur `<html>` : `--descente` et `data-defile`. Tout le reste
  en découle en CSS. Ne pas en ajouter un second.
- **Un seul `IntersectionObserver`**, partagé, dans `components/systeme/Ouverture.tsx`.
  **Point de déclenchement des apparitions : `rootMargin: '0px 0px -7% 0px'`, `threshold: 0`.**
  Réglé le 27/08/2026 sur la mesure, l'apparition arrivant trop tard. Sonde :
  `MutationObserver` sur `data-visible` pendant un défilement par pas de 24 px avec attente de
  deux trames — le rappel de l'observateur est cadencé sur la trame, et un pas plus large
  attribuait à l'élément une position relevée un ou deux pas APRÈS son déclenchement réel (des
  maxima à 500 px qui n'étaient qu'un artefact). Médiane de la distance entre le haut de
  l'élément et le bas de l'écran au déclenchement, trois pages, 390 × 844 :
  **−12 % / seuil 0,04 → 103 · 93 · 104 px** (l'ancien réglage) · **−7 % / seuil 0 → 49 · 43 ·
  55 px** (retenu) · −2 % / seuil 0 → 1 · 1 · 8 px, trop tôt : les 800 ms sont consommées avant
  que l'élément soit visible et le geste est perdu.
  **Le passage du seuil de 0,04 à 0 est la moitié du gain.** Un seuil est une FRACTION DE LA
  SURFACE : 4 % d'un bloc de 1 200 px, c'est 48 px à faire entrer en plus de la marge. Les blocs
  hauts attendaient donc bien plus longtemps que les petits — deux sections voisines
  n'apparaissaient pas au même endroit de l'écran. À 0, le déclenchement ne dépend plus que de la
  géométrie de l'écran, la même pour tous : relevé après correction, min 39 et max 122 px sur
  cinq pages, contre un étalement de 87 à 621 avant.
  Contrôlé dans les quatre modes — normal, mouvement réduit, `?mouvement=0`, sans JavaScript :
  **aucun contenu ne reste invisible**, et rien n'est masqué en deçà du seuil de 90 % de la
  hauteur d'écran posé au montage.
- **`will-change` jamais globale.** Deux emplacements, tous deux bornés au
  survol : `.rasante:hover .calage` en CSS, et les copies masquées du héros
  posées sur `pointerenter` / retirées sur `pointerleave`.
- **Aucun défilement virtualisé.** Ni Lenis, ni Locomotive, ni équivalent. Le
  défilement du navigateur est le seul qui reste accessible au clavier, à la
  barre de défilement et aux outils d'assistance.
- **`prefers-reduced-motion` ne retire jamais une information.** Les apparitions
  se jouent instantanément (jamais `animation: none`, qui laisserait
  `opacity: 0`), et les deux indicateurs d'attente continuent de tourner —
  ralentis à 2400 ms via `*:not(.attente)`. Un bloc gris immobile se lit encore
  comme un chargement ; un bloc gris immobile *sans* animation ne se lit plus.
- **Deux boucles infinies au total**, les deux `@keyframes attente`.
- **Exceptions documentées, à ne pas « normaliser »** : la chorégraphie du héros
  (`.sequence`, un dépouillement calibré sur un plafond de lisibilité de 1,2 s
  mesuré) et les deux fondus de lumière de l'ouverture (1,4 s et 1,6 s).

### Les transitions de page

`src/lib/passage.ts` + `src/components/systeme/Lien.tsx`. Les 40 liens internes
passent par `<Lien>`, qui appelle `document.startViewTransition`. Trois pièges,
tous vérifiés dans le navigateur :

1. **La prop `viewTransition` de React Router 7 ne fonctionne pas ici.** Elle
   n'est lue que par le routeur de données (`createBrowserRouter` +
   `RouterProvider`) ; `App.tsx` utilise `BrowserRouter`, où `navigate()` la
   reçoit et l'ignore, sans avertissement. Si le site passe un jour au routeur
   de données, `passage.ts` et `Lien.tsx` disparaissent au profit de la prop.
2. **`flushSync` est obligatoire.** `startViewTransition` photographie l'état
   neuf à la frame suivante ; React 18 commit en microtâche. Sans forçage, la
   transition peut fondre la page sur elle-même.
3. **Le `view-transition-name` est sur le `<header>`, pas sur le logo** — la
   plaque, c'est l'en-tête entier. Nommer le seul logo laissait la barre
   clignoter autour de lui. Ce nom doit rester unique dans le document.

Repli si l'API manque, ou en mouvement réduit : **aucune transition**. Ne pas
écrire de simulation en JavaScript — elle imposerait de retenir l'ancienne page
en mémoire, donc de retarder la nouvelle.

## Points de vigilance connus

- **Le jaune ne peut pas servir de couleur de texte sur fond clair.** `--laiton`
  fait **1,81:1** sur `--pierre`, là où il en faut 4,5 (3 pour les grands titres).
  C'est le constat qui a fait basculer la coquille du site sur la nuit, où il
  atteint 8,91:1 et devient enfin du texte. Trois règles, toutes mesurées :
  sur la pierre, employer `--primary-ink` (5,44:1, et 5,13:1 sur le voile teinté
  des étiquettes — à 30 % de clarté il retombait à 4,61:1) ou `--primary-display`
  pour les titres ≥ 24 px (3,62:1) ; sur aplat de laiton, le premier plan est
  `--primary-foreground`, c'est-à-dire le marine (7,79:1), **jamais du blanc**
  (1,88:1) ; le laiton vif est légitime dès qu'il est sur la nuit ou le marine.
  Les ratios sont calculés, pas estimés — le script est reproductible.
- **Texte sur photo : mesurer, pas estimer, et mesurer DANS LES DEUX SENS.** Les voiles ont
  été recalculés sur les pixels rendus. Un voile horizontal (`to-r`) suppose un texte aligné à
  gauche ; sous un contenu centré il ne couvre rien. Voir § 11 de `REPRISE.md`.
  **Le trop est aussi une faute.** En corrigeant le bug d'échelle d'opacité Tailwind, les
  quatre bandeaux services sont passés d'un voile directionnel à 80 % à un voile vertical à
  **96 %** : le contraste était acquis, mais la photographie n'existait plus. Le plancher est
  calculé sur le 99e percentile clair de chaque image (relevé : 0,48 à 0,57 selon la photo) et
  sur la couleur de premier plan la plus faible, qui est le **laiton-display**, pas la pierre —
  c'est lui qui fixe la limite. Valeur retenue : **0,86** (laiton-display 3,20:1 pour un seuil
  de 3 ; zinc 5,34:1 ; pierre 11,60:1). À 0,84 le laiton tombait à 3,02, trop juste.
- **Le cadre du héros sur téléphone est borné, et c'est une mesure.** En
  `aspect-[4/5]`, la travée prenait 469 px sur un écran de 375 (**70 % du pli**) et 488 sur un
  390 (58 %) : sur un iPhone SE le `h1` passait **entièrement sous le pli**, et l'on arrivait
  sur un immeuble sans un mot. Corrigé en `aspect-[7/5]` + `max-h-[42svh]` (la tablette, où le
  seul ratio redonnait une bannière de 548 px), les deux remis à zéro en `lg:`. Relevé après :
  268 px / 40 % sur un 375, 279 px / 33 % sur un 390, titre au-dessus du pli dans les deux cas.
  Deux corrections l'accompagnent, sans lesquelles le recadrage ne sert à rien : `.plan-fer`
  avait une **hauteur fixe de 6,5 rem** et avalait 39 % d'un cadre raccourci en couvrant
  exactement la porte cochère — devenue `clamp(3.25rem, 26%, 6.5rem)`, soit 70 px sur téléphone
  et **104 px inchangés sur bureau** ; et les arrêts de `.raccord` passent de 22/55 % à 14/40 %,
  le fondu éteignait le bas de l'image.
- **`.rai` déborde de son cadre par construction, et deux verrous l'en empêchent.**
  Elle est posée en `inset: -20%` : sur un cadre de 440 px elle fait **616 px** et dépasse de
  88 px de chaque côté. Elle ne tenait que par l'`overflow: hidden` de `.travee`.
  Signalé depuis Chrome, mode appareil, iPhone 16 Pro Max (440 × 956) : le bouton du menu
  passait hors écran et le chapô du héros était coupé en plein mot. **Reproduction du
  mécanisme** : en neutralisant le découpage de `.travee`, `scrollWidth` passe de 440 à
  **exactement 528** (440 + 88), le chiffre déduit de la capture.
  **La cause première n'est PAS établie, et il faut le dire.** Le défaut n'est reproductible
  ni sous Chrome sur le build, ni sur le serveur de dev, ni sur la préversion, à 375, 390, 430,
  440 ni 768 px. L'hypothèse la plus probable est une feuille de style servie **incomplète** par
  le serveur de dev pendant une réécriture de `src/index.css` (une écriture qui tronque puis
  réécrit laisse une fenêtre de quelques millisecondes) : transitoire, donc invisible ensuite.
  Ce qui est fait ne dépend pas de l'hypothèse : `contain: paint` sur `.travee` garantit le
  découpage par une autre voie que le débordement, et `overflow-x: clip` sur `#ouverture` sert
  de second filet — `clip` et non `hidden`, qui créerait un conteneur de défilement et
  casserait tout `position: sticky` à l'intérieur. Contrôle automatisé : `scrollWidth` comparé à
  `innerWidth` sur les dix pages, à 375, 390, 430, 440 et 768 px.
- **`fetchpriority` s'écrit en MINUSCULES.** `fetchPriority` en camelCase n'est reconnu qu'à
  partir de React 19 : sur 18.3.1 il déclenche « React does not recognize the `fetchPriority`
  prop » à chaque chargement, avec la consigne explicite de le mettre en bas de casse.
  L'attribut finissait bien dans le HTML livré — React sert les props inconnues telles quelles,
  en minuscules — donc la priorité était appliquée, mais au prix d'une erreur de console
  permanente. Corrigé dans les quatre fichiers concernés le 27/08/2026. Console du serveur de
  dev : propre.
- **`prefers-reduced-motion`** est traité globalement dans `src/index.css`. Les animations
  d'apparition partent d'`opacity: 0` : les jouer instantanément, ne jamais les couper avec
  `animation: none`, sinon le contenu reste invisible.
- **Chiffres inventés** : deux `aggregateRating` fabriqués (4,9/500 et 4,8/127) ont été retirés
  — Google interdit à une entreprise de baliser ses propres avis. La seule note publiable est
  celle de la fiche Google (`src/config/avis.ts`). **Le compteur d'estimations qui
  s'incrémentait à chaque chargement n'existe plus** : vérifié le 27/08/2026, il ne subsistait
  qu'un commentaire orphelin dans `EstimationBiens.tsx`, retiré. Aucun compteur du site ne
  fabrique plus de valeur — recherche de `++`, `+= 1` et `Date.now()` divisé : zéro résultat.
  Les quatre repères d'`EstimationStats` sont statiques (2011, DVF, Gratuit, « 24 h » — ce
  dernier reste en attente d'arbitrage comme partout ailleurs).
- **~11 Mo de PNG dans `src/assets/`** : ce sont les **masters en 1536 × 1024**, dont les
  `.webp` (700 × 467) sont des réductions. Ils ne partent **pas** dans `dist/` — Vite ne copie
  que l'importé, et `dist/assets/` ne contient aucun PNG. Ne pas les supprimer : les bandeaux
  des pages services consomment des variantes `-large.webp` régénérées depuis eux. À sortir du
  dépôt vers un stockage dédié si le poids gêne, pas à détruire.
- **Les exposants Unicode tombent hors police.** `ᵉ` (U+1D49) et `ᵗ` n'appartiennent
  pas au sous-ensemble latin de Google Fonts : ils basculaient dans une police
  système au milieu du mot, et « Paris 8ᵉ » s'affichait « Paris 8° ». Écrire
  `8<sup>e</sup>`. Le caractère reste acceptable dans les métadonnées, qui ne sont
  pas rendues dans la fonte du site — il en subsiste dans `config/seo.ts` et les
  balises de `pages/`.
- **Mode sombre** : `.dark` partage désormais la définition de `.nuit`, dont les
  contrastes sont mesurés. Aucun sélecteur ne l'active toujours ; une bascule
  serait maintenant crédible, mais reste à vérifier page par page.
- **Le repli monopage a été RETIRÉ du `.htaccess` le 27/08/2026, et c'est un arbitrage à
  connaître.** Il servait `index.html` pour tout : une URL inconnue répondait **200** avec la
  coquille et React y affichait « Page introuvable » — une « soft 404 », que Google indexe.
  Désormais les dix routes sont servies depuis leur prérendu (`<route>/index.html`) et tout le
  reste tombe sur `ErrorDocument 404 /404.html`, une **onzième page prérendue** écrite à la
  racine par `scripts/prerender.mjs` depuis un chemin inexistant.
  **Contrepartie : sans repli, un prérendu raté ne dégrade plus le site, il le casse** — aucune
  route n'aurait de fichier et toutes répondraient 404. Le garde-fou est l'étape « Vérifier la
  mise en ligne » ajoutée à `deploy.yml`, qui lance `npm run verifier` après l'envoi FTP et fait
  échouer le run. **Si cette étape disparaît, remettre les trois lignes du repli** : la consigne
  est écrite à l'endroit exact dans `public/.htaccess`.
  Éprouvé sous **Apache 2.4.66 local** avec les modules de LWS et le `dist/` réel :
  `/`, `/biens`, `/services/gestion-locative` → 200 avec la bonne page ; `/inexistant` et
  `/biens/truc` → **404** avec la page de marque ; `/biens` sans barre finale → 200 et
  **zéro redirection** ; HTML en `no-cache` gzippé (71 505 → 14 360 octets), actifs empreintés
  en `immutable` un an, sitemap à 1 h.
- **`<FilesMatch>` filtre par extension, jamais par chemin — et ça a mis les photos
  d'annonces en cache immuable pendant un an.** Relevé le 27/08/2026 sur la préversion :
  `0125-1-medium.webp` recevait `public, max-age=31536000, immutable`, le même en-tête que
  `/assets/index-a1b2c3.js`. Or le nom d'une photo d'annonce est **stable** —
  `<référence>-<index>-<variante>.webp` — et `fetch-biens.mjs` l'écrase sous le même nom quand
  l'agence remplace la photo d'un bien déjà publié. Tout visiteur l'ayant déjà vue gardait
  l'ancienne photo un an, **sans jamais revalider**. Sur un site dont les annonces sont la seule
  donnée dynamique, une baisse de prix pouvait s'afficher avec la photo d'avant. Même piège pour
  les badges DPE, régénérés sous le même nom, et pour `og-image.jpg` et les favicons.
  Corrigé par `SetEnvIf Request_URI "^/assets/"`, qui filtre par chemin : `immutable` un an sous
  `/assets/`, et **un jour puis revalidation** partout ailleurs — la cadence de la synchronisation
  nocturne. Éprouvé sous Apache 2.4.66 local : `/assets/*` immuable, `/biens/*.webp` et `*.svg`,
  `og-image.jpg`, `favicon.ico` à 86 400 s avec `must-revalidate`, HTML en `no-cache`, et
  `If-None-Match` renvoie bien **304 avec 0 octet de corps**.
- **LWS place un cache de périphérie devant Apache, et il ignore le `no-cache`.**
  Relevé le 27/08/2026 : `/agence`, route créée par le déploiement, répondait **404 à `fetch` et
  200 à `curl` au même instant** — `x-cache-status: HIT`, `edge-cache-engine-mode: ACTIVE`, et un
  `last-modified` antérieur au déploiement. La clé inclut `Accept-Encoding`, d'où deux réponses
  pour une seule URL. Ni `Cache-Control: no-cache` ni `Pragma: no-cache` en requête n'y changent
  quoi que ce soit, testés ; le `Cache-Control` de réponse du `.htaccess` non plus, ni un
  `last-modified` plus récent. Seul un paramètre de requête unique change la clé.
  **Le cache stocke aussi les EN-TÊTES.** Constaté en corrigeant le `Cache-Control` des photos :
  le serveur renvoyait la bonne valeur, l'URL nue servait encore l'ancienne. Un visiteur servi
  pendant cette fenêtre met le fichier dans le cache de SON navigateur pour la durée annoncée —
  un mauvais `Cache-Control` servi dix minutes empoisonne des caches pour un an, et aucun
  déploiement ultérieur n'y change rien.
  **Vider le cache dans le panneau LWS fait partie de la bascule** — voir REPRISE.md § 13,
  étape 8b. `npm run verifier` distingue désormais « déploiement raté » de « cache périmé » : il
  interroge les URL nues et, en cas d'échec, redemande hors cache pour nommer la cause.
- **Le CSS n'a rien à découper par route, mesuré.** `cssCodeSplit` est déjà à sa valeur par
  défaut (`true`) et n'émet qu'un fichier : tout le CSS vient d'un unique `import './index.css'`
  dans l'entrée, et les onze morceaux de route n'importent aucun style propre. Couverture réelle
  relevée par `CSS.startRuleUsageTracking` sur les dix pages : chaque page emploie **31 % en
  moyenne** des 56,0 Ko (de 26 % pour `/mentions-legales` à 42 % pour l'accueil), soit ~38 Ko
  non employés — **8,5 Ko gzip**. Le gain ne vaut que pour la PREMIÈRE visite, le fichier étant
  ensuite mis en cache un an en `immutable`. En face : découper obligerait à fragmenter
  `src/index.css`, qui porte la direction artistique, et ajouterait un CSS bloquant à chaque
  navigation interne — visible pendant les transitions de page. **Non fait.**

## REPRISE.md

`REPRISE.md` à la racine est la note de passation : état du site en production, redirections
301 à écrire, formulaires PHP à recâbler, accès et clés à obtenir, pièges des sources de
données et de GitHub Actions. À lire avant toute décision d'architecture ou de mise en ligne,
et à tenir à jour.

## Origine Lovable

Projet généré par Lovable (`lovable-tagger` actif en mode développement uniquement). Des
modifications faites depuis Lovable peuvent atterrir directement sur `main`. Vérifier l'état du
dépôt distant avant de commencer.
