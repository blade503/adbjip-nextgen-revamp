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

Colle-moi la sortie des trois. `lint` est à **zéro** depuis le 04/09/2026 : toute erreur ou
tout avertissement est une régression de la tâche en cours. Si `tsc` ou `build` échoue, corrige
avant de me répondre. Ne dis jamais « c'est fait » sans ces sorties.

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

### Le repère de vérification (relevé le 04/09/2026)

Les trois commandes ci-dessous sont le seul contrôle du projet. Leurs compteurs à l'état sain :

| Commande             | Attendu                                                              |
|----------------------|----------------------------------------------------------------------|
| `npm run typecheck`  | **0 erreur**. Toute erreur est bloquante.                            |
| `npm run lint`       | **0 problème** depuis le 04/09/2026 (les 19 `any` du service de marché et le `require` de Tailwind ont été corrigés). Toute erreur est une régression. |
| `npm run test`       | **53 cas verts**, ~200 ms. Logique pure de `src/lib/` seulement. |
| `npm run build`      | **1 722 modules**, ~1,7 s, `[sitemap] 12 URL`, `[prerender] 13/13 + la page 404`. |

Poids de sortie au repère (relevé le 04/09/2026, direction « La Plaque ») : morceau d'entrée
**JS 272,4 Ko → 88,8 Ko gzip**, **CSS 45,9 Ko → 10,0 Ko gzip**. Le CSS n'est pas découpé par
route — chantier ouvert, sans urgence à ce poids.

`[prerender] 13/13` = les **8 routes fixes** de `src/App.tsx` + **une fiche par annonce** du
portefeuille (`/biens/:slug`, résolu par `scripts/routes.mjs` depuis `data/biens.json` ; cinq
annonces le 04/09/2026). Le catch-all `*` est exclu. `[sitemap] 12 URL` en compte une de
moins : `/mentions-legales` en est volontairement absente. **Les deux nombres suivent le
portefeuille** : une annonce de plus, c'est une page et une URL de plus.

Deux fichiers de tests, tous deux dans `src/lib/` : `biens.test.ts` (43 cas) et
`formulaire.test.ts` (10 cas, ajouté le 28/08/2026 — la validation côté client et le repli
`mailto`).

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
3. `npm run test` — 53 cas verts ;
4. `npm run build` — termine, et prérend les 8 pages fixes + une par annonce ;
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

`src/pages/services/VendreEstimer.tsx` (fusion Estimation + Achats/ventes, 04/09/2026)
orchestre `QuickCalculator` — la carte blanche de l'ouverture — et `InteractiveMap`. Toute la
logique vit dans **`MarketDataService`** (singleton, caches 24 h, typé : `DonneesMarche`) :
géocodage via `api-adresse.data.gouv.fr`, puis cascade DVF officielle → table par code postal →
estimation géographique, chacune renvoyant `{ basePricePerM2, confidence, sampleSize, source }`.
Passer par ce service plutôt que refaire un `fetch` : `InteractiveMap` a longtemps dupliqué le
géocodage. N'afficher que les champs réellement renvoyés — pas de délai de vente ni d'évolution
annuelle, qui ne sont pas calculés.

### Design system — « La Plaque » (04/09/2026)

Direction artistique choisie par le client sur une planche Claude Design (direction 1a « La
Plaque », déclinée en 2a–2i ; la planche n'est pas dans le dépôt), documentée en tête de `src/index.css`.
Elle succède à « Le hall » (coquille de nuit, 27/08/2026), dont le système de mouvement est
conservé et la coquille sombre retirée. **Le site est clair partout** : une feuille crème, des
titres en romain, le marine réservé aux blocs appuyés (rendez-vous, mandat Dynamique, accès en
ligne) et aux boutons.

**Six matières** (`src/index.css`), ratios calculés par `node scripts/contraste.mjs` (37 couples,
aucun échec inattendu le 04/09/2026) :

| jeton               | valeur          | rôle                                   |
|---------------------|-----------------|----------------------------------------|
| `--pierre`          | `40 31% 94%`    | le crème, fond de page                 |
| `--lin`             | `41 29% 89%`    | la bande alternée, un ton dessous      |
| `--ivoire`          | `0 0% 100%`     | la carte blanche posée sur le crème    |
| `--marine` = `--nuit` | `217 45% 16%` | l'émail : blocs appuyés, boutons       |
| `--encre` / `--ardoise` / `--zinc` | 11 % / 28 % / 40 % | titres · paragraphes · texte second |
| `--laiton`          | `38 88% 55%`    | l'enseigne — **texte sur marine seulement** (7,6:1) |

**La règle de la couleur est inchangée et calculée** : le laiton fait 1,81:1 sur le crème. Sur
fond clair l'accent s'écrit foncé — `--primary-ink` (28 %, 5,46:1) pour les étiquettes et cotes,
`--primary-display` (36 %, 3,63:1) pour le mot en couleur d'un titre ≥ 24 px (`<em>` dans un
`h1`/`h2`). Le jaune vif n'est légitime que sur le marine, où il devient le bouton d'appel.

**`.nuit` reste le mécanisme de portée** : la classe rebascule tous les jetons pour son
sous-arbre (fond marine, texte pierre, bouton laiton). Toute surface de marine doit la porter.

**Typographie : quatre familles, quatre rôles** (`index.html`, `tailwind.config.ts`).
Instrument Serif pour les titres (un seul poids, jamais en gras, `text-wrap: pretty`) ; Figtree
pour le texte, les étiquettes (`.gravure`, `.etiquette-champ`) et les boutons ; IBM Plex Mono
pour les cotes (`.cote` : « Mandat I », « Réf. V027 », « 01 ») ; Archivo 600 pour les
**chiffres qui comptent** — prix et téléphone (`font-display`, `registre="chiffre"` du bouton).
Archivo a perdu son axe de largeur (88 Ko à lui seul). **Poids relevé le 04/09/2026, sous-ensemble
latin : 122,3 Ko pour huit fichiers** (Figtree 3 × 19,7 · Instrument Serif 14,7 + 15,3 · Archivo
13,5 · Plex Mono 2 × 9,8), contre 159,3 Ko avant. Trois polices de repli locales aux métriques
ajustées (`src/index.css`, en tête) évitent le décalage à la substitution.

**Géométrie : angle vif partout** (`--radius: 0`). Le liseré gravé en retrait de la direction
précédente n'existe plus ; `.cadre` ne dessine plus rien, `.panneau` est la carte blanche cernée
d'un filet d'encre à 14 %. **Ne pas réintroduire** de rayon, d'ombre portée par défaut, de verre
dépoli (`backdrop-filter`), de dégradé, de pastille d'icône.

**Composants de la direction** (`src/components/systeme/`) : `EnTetePage` (ouverture d'une page
intérieure : surtitre, h1, chapeau, actions, image 4/3 à droite) · `EnTeteSection` (surtitre —
trait — titre) · `Aiguillage` (les trois profils : bailleur, conseil syndical, vendeur ; ses
`cle` sont les valeurs de `?service=`) · `BandeauContact` (la clôture de chaque page, marine ou
lin) · `BoutonTelephone` · `BarreAppel` (téléphone fixé au bas de l'écran sous `lg`, avec un
espaceur : jamais sur la page contact, qui a déjà le numéro) · `PlaqueDeRue` (trois tailles).
Une seule fiche d'annonce, `components/CarteBien.tsx`, pour le portefeuille, l'accueil et la
fiche bien.

**Photographie.** Le duotone (`.photo-editoriale`) ne s'applique plus qu'aux quatre images de
banque des ouvertures de pages métier. La travée, le bureau, les portraits et les photos
d'annonces se montrent en couleurs vraies.

**Arborescence (planche 2a).** Huit routes fixes : `/`, `/biens`, `/biens/:slug` (**nouvelle
fiche bien**, une page par annonce), `/services/gestion-locative`,
`/services/gestion-copropriete`, `/services/vendre-estimer` (**fusion** d'Estimation et
d'Achats/ventes), `/agence` (**fusion** avec l'ancienne page Équipe), `/contact`,
`/mentions-legales`. Les trois anciennes URL redirigent en 301 depuis `public/.htaccess` — pas
de `<Navigate>` dans le routeur, qui prérendrait des doublons. Le lien « Espace client » (extranet
Gercop, URL relevée sur le site en production) vient de `ESPACE_CLIENT` dans `config/legal.ts`.

**Ce que la planche montrait et qui n'a PAS été fait, parce que la donnée n'existe pas** : le
« syndic de cet immeuble, c'est nous » et ses charges / lots / travaux votés sur la fiche bien
(la source ne dit pas quels immeubles l'agence administre — seuls lots et charges annuelles de
`data/biens.json` sont affichés) ; le formulaire de contact à quatre champs avec « téléphone ou
courriel » en un seul (`contact.php` exige un courriel valide : cinq champs, courriel
obligatoire, téléphone facultatif) ; le calculateur à cinq champs (code postal et ville sont
requis par le géocodage : sept champs) ; les libellés abrégés des mandats (ceux de l'agence sont
gardés mot pour mot).

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
- **CLS 0,006496 · LCP ~1 500 ms sur l'ouverture « La Plaque »** — relevé le 04/09/2026,
  390 × 844, cache désactivé, 1,6 Mb/s + 150 ms, quatre chargements identiques à la sixième
  décimale ; l'élément LCP est l'image de la travée (vérifié par `PerformanceObserver`, 1 468
  à 1 536 ms contre 1 657 avant). **Avant les polices de repli ajustées, le CLS était de
  0,038786** : 0,031815 dans le bloc du titre à ~1 060 ms, à la substitution d'Instrument Serif
  (21 % plus étroite que Times). Trois `@font-face` locaux aux métriques de la vraie fonte
  (`size-adjust`, `ascent-override`, `descent-override`, en tête de `src/index.css`) l'ont
  divisé par six. **Piège vérifié : Chrome multiplie les surcharges par `size-adjust`**, les
  pourcentages sont donc divisés par lui. Le résidu (0,006453 à ~1 150 ms) tient à IBM Plex
  Mono et aux liens `inline-flex`, sans repli ajusté : à traiter si l'on veut descendre encore.
  **Débordement horizontal : 0 px** sur les onze pages à 375, 390, 430, 440 et 768 px, menu
  ouvert compris (`scrollWidth − innerWidth`, sonde du 04/09/2026).
- **CLS : 0,001914 à froid, et le chiffre de 0 était faux** (version précédente). Les premières
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
  écrit deux choses sur `<html>` : `--descente` (plus lue par personne depuis le retrait de
  l'ouverture éclairée, mais conservée) et `data-defile`, qui souligne le filet de l'en-tête
  (`.entete`). Tout le reste en découle en CSS. Ne pas en ajouter un second.
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
- **`will-change` jamais globale.** Un seul emplacement, borné au survol :
  `.rasante:hover .calage` en CSS.
- **Aucun défilement virtualisé.** Ni Lenis, ni Locomotive, ni équivalent. Le
  défilement du navigateur est le seul qui reste accessible au clavier, à la
  barre de défilement et aux outils d'assistance.
- **`prefers-reduced-motion` ne retire jamais une information.** Les apparitions
  se jouent instantanément (jamais `animation: none`, qui laisserait
  `opacity: 0`), et les deux indicateurs d'attente continuent de tourner —
  ralentis à 2400 ms via `*:not(.attente)`. Un bloc gris immobile se lit encore
  comme un chargement ; un bloc gris immobile *sans* animation ne se lit plus.
- **Une seule boucle infinie**, `@keyframes attente`. La chorégraphie du héros et les fondus
  de lumière de l'ouverture (exceptions de « Le hall ») ont disparu avec elle : l'ouverture
  « La Plaque » entre par la classe `.voile` avec des `animation-delay` en ligne, sur les six
  durées du système.

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
  Depuis « La Plaque » (04/09/2026), le site est clair partout et la règle tient en trois
  points, tous mesurés (`node scripts/contraste.mjs`) : sur le crème, le lin ou le blanc,
  employer `--primary-ink` (5,46:1 sur crème, 4,93:1 sur lin, 6,14:1 sur blanc) pour les
  étiquettes et `--primary-display` (3,63:1 / 3,28:1 / 4,08:1) pour le mot en couleur d'un
  titre ≥ 24 px ; sur aplat de laiton, le premier plan est l'**encre** (8,6:1), **jamais du
  blanc** (2,04:1) ; le laiton vif est légitime dès qu'il est sur le marine (7,6:1).
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
- **Le menu mobile bloque le défilement, et il a fallu deux essais.** Avant correction :
  menu ouvert, la page glissait de 598 px derrière lui, et l'on lisait le menu par-dessus une
  tout autre section. Deux erreurs à connaître pour ne pas les refaire. **`overflow: hidden` va
  sur `<html>`, pas sur `<body>`** — c'est la racine qui défile en mode standard, et bloquer le
  corps ne changeait rien. **Le voile va DEHORS de l'en-tête** : posé dedans, il tombait sous
  `enteteRef.contains(cible)` et l'écouteur de clic à côté le prenait pour un clic intérieur, si
  bien que le voile ne refermait plus. La barre de défilement est compensée en rembourrage :
  sans cela, tout le contenu sauterait de 15 px à l'ouverture sur un navigateur de bureau réduit
  sous 1024 px. `overflow: hidden` bloque le GESTE mais pas `scrollTo()` : une sonde qui teste
  avec `scrollTo` conclut à tort que rien n'est bloqué.
- **La validation du formulaire est côté client AVANT le réseau.** Le formulaire porte
  `noValidate` — la validation native est désactivée — et rien ne la remplaçait : les erreurs
  venaient uniquement de la réponse de `contact.php`. Toute faute de saisie coûtait donc un
  aller-retour, et « Prénom * » était annoncé obligatoire alors que le serveur ne voit qu'un
  champ « nom » où prénom et nom sont concaténés : l'astérisque promettait une contrainte
  inexistante, et `contact.php` ne se réécrit pas. `champsInvalides` dans `src/lib/formulaire.ts`
  applique les règles, `focaliserChamp` emmène au premier champ fautif — avant, le focus restait
  sur `<body>` et le message était hors écran sur téléphone. Relevé après : 0 requête réseau sur
  un envoi incomplet. Le repli `mailto` ne s'affiche plus que sur un échec de TRANSPORT (réponse
  sans `champs`) : il apparaissait aussi sur une erreur de saisie, ce qui laissait croire que le
  site était en panne.
- **La carte de contact ne se charge que si on la demande** (`components/CarteLocalisation.tsx`).
  L'iframe Google était chargé d'emblée avec deux plaques posées PAR-DESSUS, qui masquaient le
  bouton « Ouvrir dans Maps » et la mention « Données cartographiques · Conditions
  d'utilisation » — que les conditions de Google interdisent précisément de masquer. Les plaques
  sont passées en légende SOUS le cadre. On ne peut pas recolorer la carte (restyler l'imagerie
  d'un embed est interdit par ces mêmes conditions) : on peut seulement ne pas l'imposer. Gain
  annexe et non négligeable en France : plus de connexion à Google avant un geste du visiteur —
  vérifié, 0 iframe et aucun domaine Google contacté hors polices tant qu'on n'a pas cliqué — et
  les quatre tabulations de l'iframe n'existent qu'à partir de là.
- **L'ouverture éclairée à cinq plans n'existe plus** (retirée le 04/09/2026 avec la direction
  « La Plaque »). Les points de vigilance qui la concernaient — cadre du héros borné sur
  téléphone, débordement de `.rai`, `contain: paint` sur `.travee`, CLS des polices dans la
  plaque de rue — sont dans l'historique git (commit précédant la refonte) si l'on y revient.
  La sonde de débordement horizontal a été refaite le 04/09/2026 sur la nouvelle ouverture :
  0 px sur les onze pages à 375, 390, 430, 440 et 768 px, menu mobile ouvert compris.
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
  qu'un commentaire orphelin dans l'ancienne `EstimationBiens.tsx`, retiré. Aucun compteur du site ne
  fabrique plus de valeur — recherche de `++`, `+= 1` et `Date.now()` divisé : zéro résultat.
  Les trois repères de l'ouverture « Vendre & estimer » sont statiques (DVF, Gratuit, « 24 h » — ce
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
