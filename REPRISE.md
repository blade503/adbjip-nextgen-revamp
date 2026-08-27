# ADBJIP — état des lieux et reprise

Note de passation, à la racine du repo pour qu'une session terminal reparte avec
le contexte.

Dernière mise à jour : 13 août 2026 (fin de session « scripts annonces »).

---

## 1. Les trois repos

| Dossier (`~/Documents/PERSO/`) | Quoi | État |
|---|---|---|
| `JIPV4` | Ancien site Symfony 3.3 / PHP ≥5.5 | **En prod aujourd'hui.** Dernier commit nov. 2017 — périmé par rapport à la prod |
| `adbjip-nextgen-revamp` | Refonte Vite + React + shadcn (projet Lovable) | Branche `main` à jour avec origin ; `index.html` modifié non commité |
| `adbjip-nextjs` | Scaffold Create Next App | 1 commit, aucun remote, abandonné |

Client : **JIP / Jobard Immobilier**, 27 rue de Lisbonne, 75008 Paris.
01 42 25 78 24 · j.immo.p@orange.fr · gerance@adbjip.fr · copro@adbjip.fr
Interlocuteurs cités sur le site : Florent Jobard (143 rue Saint-Denis, 75002,
06 62 91 73 35), Francis Jobard (27 rue de Lisbonne).

---

## 2. Le site en prod — www.adbjip.fr

Six pages (le repo de 2017 n'en déclare qu'une, la prod a évolué depuis) :

| URL | Contenu | Formulaire |
|---|---|---|
| `/` | Hero, 4 prestations, partenaires, contacts | — |
| `/about` | **C'est la page contact** | `JIPBundle_Question` |
| `/gerer-bien` | Mandat Sérénité / Mandat Dynamique | — |
| `/gerer-copropriete` | Rôle du syndic, observatoire UNIS/FNAIM, Gercop | — |
| `/biens` | Annonces (toutes périmées) | — |
| `/estimation` | Méthode d'estimation | `JIPBundle_Contact` |

Stack front : Bootstrap + jQuery + Font Awesome + animate.css + WOW.js +
prettyPhoto + isotope. Thème ThemeForest ~2015. Footer « © 2016 ».
Pas de `meta description`. Sitemap généré par xml-sitemaps.com, en `http://`.

Entités Doctrine : `Annonce` (title, description, **link** sortant, image),
`Contact`, `Quotation`. Back-office `/admin/annonce`.

**Sécurité :** PHP 5.5 (EOL 2016) et Symfony 3.3 (EOL janv. 2018) exposés depuis
8 ans. À éteindre dès que la refonte est en ligne.

---

## 3. Écarts prod ↔ revamp

### Redirections 301 à écrire

| Ancien | Nouveau |
|---|---|
| `/` | `/` (inchangé) |
| `/biens` | `/biens` (inchangé) |
| `/gerer-bien` | `/services/gestion-locative` |
| `/gerer-copropriete` | `/services/gestion-copropriete` |
| `/estimation` | `/services/estimation-biens` |
| `/about` | **`/contact`** — l'ancienne page contact. La collision est réglée : voir ci-dessous |

**Le piège `/about` a été supprimé à la source le 27/08/2026.** Cette URL était à la
fois la redirection héritée ci-dessus ET la page « L'agence » de la refonte —
prérendue, déclarée au sitemap, canonique sur `/about`, et cible du lien
« L'agence » de l'en-tête et du pied de page. **Relevé sur la préversion réelle,
pas déduit** : la redirection masquait la page. En navigation interne React Router
l'affichait, mais au rechargement, en accès direct, depuis un moteur ou par un lien
partagé, on atterrissait sur `/contact` — et Google recevait une URL de sitemap qui
redirige, donc une page jamais indexée. `npm run verifier` ne le voyait pas : il
**validait** la redirection, une attente devenue fausse.

La page a été déplacée sur **`/agence`**, qui est aussi le seul chemin du site qui
n'était pas en français. La redirection héritée reste inchangée, l'URL de 2017 garde
son intention, et un contrôle « /agence sert la page de l'agence » a été ajouté au
vérificateur pour qu'une collision réintroduite ne passe plus inaperçue.
**Ne pas recréer de route `/about`.**

### Régressions à corriger avant mise en ligne

1. **Les deux formulaires ont disparu.** Ils tournent en prod et alimentent
   `contact` / `quotation`. LWS fournit PHP + MySQL → un `contact.php` d'une
   trentaine de lignes suffit, sans framework.
2. ~~Les annonces du revamp sont inventées~~ → **réglé** : `src/pages/Biens.tsx`
   affiche le portefeuille réel, les données en dur ont été supprimées.
3. **Contenu métier à ne pas perdre :** Mandat Sérénité / Dynamique, les 7
   missions du syndic, l'observatoire UNIS/FNAIM, l'extranet Gercop.
4. Le bloc SEO en `display:none` ajouté dans `index.html` est à supprimer —
   contre-productif, et sans objet une fois en HTML rendu serveur. **Décision
   encore en attente** (modification non commitée sur `index.html`).

---

## 4. Direction technique retenue

**On reste sur l'app React (Vite + shadcn), déployée en statique chez LWS.**

Une note de passation antérieure proposait de tout réécrire en HTML + `include`
PHP. **Écartée le 13/08/2026** : le site est React, il le reste.

- `npm run build` produit `dist/` — du statique pur, aucun Node à héberger.
  LWS mutualisé suffit, PHP n'est nécessaire que pour les formulaires (§ 3).
- Vite recopie `public/` dans `dist/` : les photos rapatriées par
  `scripts/fetch-biens.mjs` partent avec le build, sans étape supplémentaire.
- `tailwind.config.ts` ne scanne que `src/` (le glob `public/**` ajouté pour la
  piste HTML a été retiré avec elle).
- Reste vrai : le fallback SPA `.htaccess` (§ 8) est **indispensable**, sinon
  `/biens` en accès direct renvoie un 404 Apache.
- Point non résolu : une SPA n'est pas indexable sans rendu serveur. Si le SEO
  redevient prioritaire, la réponse côté React est le **prérendu au build**
  (`vite-plugin-ssr`, `react-snap` ou équivalent), pas un retour au HTML manuel.

---

## 5. Sources de données annonces

### Bien'ici — utilisable tout de suite, sans clé

```bash
curl -s 'https://www.bienici.com/realEstateAds-agencyads.json?filters={"author":"gedeon-JOBARD-PARIS-75008","onTheMarket":[true],"size":100,"sortBy":"publicationDate","sortOrder":"desc"}'
```

Répond en curl nu, sans auth ni cookie. ~24 Ko, une requête pour tout.
Vérifié à nouveau le 13/08/2026 : 200, 5 annonces.

### Gédéon — la source officielle, à demander

Les annonces sont **poussées** vers Bien'ici par Gédéon (`autoImported: true`,
ids préfixés `gedeon-`, photos sur `media.studio-net.fr`). Bien'ici est en bout
de chaîne.

**Gédéon by StudioNet** — https://gedeon.im · API : `https://api.gedeon.im`
· doc : https://api.gedeon.im/doc

- Clé à demander à **`api@gedeon.im`** (accès lié à l'abonnement — à confirmer)
- Clé passée en paramètre `key` sur chaque requête
- `GET /ads` (liste) et `GET /ads/{id}` (détail)
- Pagination **obligatoire**, 100 max : `limit` / `offset` / `total_results`
- `transaction=sell,rent,holidays,sold,viager,program` — `sold` permet
  d'afficher « Vendu » plutôt que de retirer l'annonce
- `lang=fr_FR|en_US|de_DE`

Références à donner dans le mail : agence **JOBARD IMMOBILIER PARIS**, 27 rue de
Lisbonne 75008 · diffuseur `gedeon-JOBARD-PARIS-75008` · `customerId`
`jobard27-1710424934946`.

Demander aussi les **procédures d'export** (gedeon.im/export-procedure) : un
XML suffit pour un build quotidien si l'API traîne côté contrat.

**La clé passe en paramètre d'URL** → jamais d'appel navigateur. Secrets GitHub,
appel au build uniquement.

### Portefeuille réel (au 13/08/2026) — 5 biens

| Réf | Type | Bien | Lieu | Prix | Photos |
|---|---|---|---|---|---|
| V029 | vente | Boutique + logement | Paris 16e | 390 000 € | 13 |
| v027 | vente | 3 pièces rénové | Paris 20e | 580 000 € | 11 |
| 012 | vente | Maison 8 pièces | L'Houmeau (17) | 1 136 000 € | 4 |
| 0125 | vente | Parking Planchat | Paris 20e | 14 000 € | 3 |
| G60 | **location** | Parking Planchat | Paris 20e | 85 €/mois | 3 |

4 ventes / 1 location. **Zéro recoupement avec le `/biens` en ligne**, qui
n'affiche que d'anciennes locations.

### Deux anomalies à signaler au client

- **Réf. 012** : titre vide à la source (le bien le plus cher du portefeuille).
  `fetch-biens.mjs` le signale et fabrique « Maison 8 pièces — L'Houmeau ».
- **Réf. 012** : honoraires déclarés **3 %**, alors que 36 000 € sur un prix
  hors honoraires de 1 100 000 € font **3,27 %**. L'affichage des honoraires est
  réglementé. Les trois autres ventes sont cohérentes. Le contrôle tourne à
  chaque synchro (`⚠ réf. 012 …` dans les logs) mais **ne corrige rien** :
  c'est la source qui doit être rectifiée côté agence.

---

## 6. Manipulation des photos (media.studio-net.fr)

Paramètres à coller en query string sur l'URL `url_photo` :

| Paramètre | Effet |
|---|---|
| `width=X` / `height=Y` | dimensions ; avec les deux + `func=cover` → recadrage au ratio exact |
| `func=` | `cover` \| `fit` \| `bound` \| `crop` |
| `gravity=` | `nord`/`sud`/`est`/`ouest`/`automatique`/`X,Y` |
| `format=jpg` | **non documenté**, indispensable |
| `quality=75` | **non documenté** (`q=75` marche aussi ; `quality=80` est ignoré) |

**Pièges rencontrés :**

- Utiliser `url_photo` (Studio-Net), **pas** `url` (CDN Bien'ici) : ce dernier
  ignore les paramètres et sert l'original.
- Une partie du portefeuille est en **PNG** malgré ce qu'affirme la doc.
  Redimensionner un PNG le fait **grossir** (572 Ko → 1 Mo). D'où `format=jpg`,
  qui ramène la même image à 116 Ko.
- Sans `height`, le redimensionnement est proportionnel → les photos portrait
  cassent la grille. Avec `width` + `height` + `func=cover`, sortie au ratio
  exact.

Résultat mesuré : **25 Mo → 9,6 Mo** pour 34 photos en 3 variantes
(400×300, 800×600, 1200 de large).

### Badges DPE / GES

```
https://dpe.gedeon.im/badge/dpe?dpe={valeur}&ges={valeur}&date={AAAA-MM-JJ}
https://dpe.gedeon.im/badge/ges?dpe={valeur}&ges={valeur}&date={AAAA-MM-JJ}
```

Renvoie du SVG (~740 o). **Attend les valeurs chiffrées** (`energyValue`,
`greenhouseGazValue`), pas les lettres A–G — sinon 422. `date` est obligatoire.
Rapatriés en local par `fetch-biens.mjs` (`public/biens/<ref>-dpe.svg`) : pas
d'appel tiers depuis le navigateur du visiteur.

---

## 7. Ce qui est dans le repo (session du 13/08/2026)

| Fichier | Rôle |
|---|---|
| `scripts/fetch-biens.mjs` | source → `data/biens.json` + photos dans `public/biens/` |
| `src/lib/biens.ts` | accès typé au portefeuille + formatage et mentions légales |
| `src/pages/Biens.tsx` | page `/biens`, alimentée par les vraies annonces |
| `.github/workflows/sync-biens.yml` | synchro quotidienne, build Vite, déploiement FTP |

Raccourci : `npm run biens:fetch`. Ensuite `npm run dev` suffit — la page lit
`data/biens.json` via l'alias `@data` (déclaré dans `vite.config.ts` et les
`tsconfig`).

**`fetch-biens.mjs`** — `SOURCE=bienici` (défaut) ou `SOURCE=gedeon`
(+ `GEDEON_KEY`). Testé contre l'API réelle : 5 annonces, 102 fichiers photo,
relance idempotente (2ᵉ passage : 0 téléchargement), purge des orphelins. En cas
d'échec, **conserve le jeu précédent** et sort en 0 — la page ne se vide jamais.
`FORCE=1` retélécharge tout. La branche `gedeon` reste **non testée** faute de
clé : le mapping suit la doc et devra être revalidé sur une réponse réelle.

**`src/lib/biens.ts`** — types, tri vente/location, formatage euros et taux, et
surtout les **mentions réglementaires** (arrêté du 10 janvier 2017 pour la
vente, loi ALUR pour la location) : prix hors honoraires, taux et charge des
honoraires, copropriété, loyer/charges/dépôt de garantie, dépenses annuelles
d'énergie. Le taux affiché est celui de la source, jamais recalculé en douce.

**`Biens.tsx`** — filtre vente/location, cartes avec photo en `srcSet`
(400/800/1200), badges DPE/GES servis en local, fiche détail en `Dialog` avec
la galerie complète et les mentions. Les 4 biens inventés (« Champs-Élysées,
850 000 € ») et le JSON-LD « Paris 8ème » ont disparu au passage.

**`sync-biens.yml`** — cron `0 4 * * *` + `workflow_dispatch` (choix de la
source, déploiement optionnel), commit de `data/biens.json` si le portefeuille a
bougé, `npm run build`, envoi FTP de `dist/`.

### Pièges GitHub Actions

- Le cron est **en UTC**, pas de fuseau.
- Les runs planifiés sont **souvent en retard** (5–30 min), parfois sautés.
- **GitHub désactive un workflow planifié après 60 jours sans activité sur le
  repo.** Scénario probable ici. Si les annonces cessent de se mettre à jour
  dans quelques mois, regarder là en premier.

### Aperçu local

```bash
npm run biens:fetch   # rafraîchit data/biens.json et public/biens/
npm run dev           # http://localhost:8080/biens
```

`public/biens/` est en `.gitignore` (9,6 Mo régénérables). `data/biens.json`
reste versionné : c'est le filet de sécurité si la source tombe, et le
déclencheur de la détection de changement dans le workflow.

---

## 8. Hébergement LWS — relevé du 14/08/2026

Accès au panneau retrouvé. Ce qui suit vient de l'écran, pas d'une supposition.

| | |
|---|---|
| Formule | Starter, service Standard, expire le 26/11/2029 |
| Espace | 200 Go, dont 0,85 Go utilisés |
| Registrar du domaine | LWS, DNS `ns1`/`ns2.lws-hosting.biz` |
| Bases MySQL | **2 sur 10** — celle du Symfony contient huit ans de leads |
| Comptes e-mail | 4 sur 25 |
| PHP installés | 5.6 et 7.2 ; **5.6 par défaut** (le Symfony l'exige) |
| PHP de `preprod` | **8.3**, réglé par site sans toucher au défaut |

### Arborescence

Un compte FTP atterrit **directement dans `htdocs`** — LWS refuse d'ailleurs
`htdocs/` dans le champ « Répertoire », c'est déjà la racine. Le gestionnaire de
fichiers, lui, affiche un niveau au-dessus (`home/`, `htdocs/`, `tmp/`).

```
htdocs/                             ← racine FTP et racine web
├── JIPV3/                          ← Symfony en production, 11 663 fichiers, 1,72 Go
├── vendor/                         ← ses dépendances Composer, 8 096 fichiers
├── preprod.adbjip.fr/              ← sous-domaine de préversion
├── index.php                       ← point d'entrée de l'ancien site
├── googlea5ff7faf806fdf23.html     ← vérification Google Search Console
├── .htaccess
└── sitemap.xml, robots, default_index.html
```

**`googlea5ff7faf806fdf23.html` ne doit pas disparaître** : le perdre fait perdre
la propriété du domaine dans Search Console, donc l'historique de recherche et la
soumission du sitemap. Il est repris dans `public/` et repart avec chaque build.

### Déploiement

`.github/workflows/deploy.yml`, deux cibles :

- **preprod** — automatique à chaque push et après une synchro qui a modifié le
  portefeuille. Le compte FTP est **enfermé dans `preprod.adbjip.fr`** : il ne
  peut pas atteindre la production, même en cas d'erreur de configuration ;
- **production** — déclenchement manuel uniquement. `JIPV3/`, `vendor/` et
  `.quarantaine/` sont exclus des envois.

Secrets : `LWS_FTP_HOST`, `LWS_FTP_USER`, `LWS_FTP_PASSWORD` (+ `GEDEON_API_KEY`
le jour venu). Le compte de production se créera **sans rien** dans le champ
« Répertoire », pour arriver dans `htdocs`.

Après chaque envoi : `node scripts/verifier-deploiement.mjs https://preprod.adbjip.fr`.
Il contrôle ce qui casse en silence — `.htaccess` non transféré, PHP non exécuté,
`leads.jsonl` lisible, prérendu absent, HTTPS non forcé.

### Le jour de la bascule

1. Exporter la base MySQL du Symfony (**à faire en premier, c'est irremplaçable**).
2. Passer le site principal en PHP 8.3.
3. Créer le compte FTP de production, déployer avec `cible: production`.
4. Vérifier le fichier Search Console et les redirections 301.
5. Éteindre `JIPV3/` — PHP 5.6 et Symfony 3.3 sans correctif depuis huit ans.

---

## 9. Bloquants

1. ~~Accès macOS à `~/Documents`~~ — **levé**, lecture/écriture OK.
2. ~~Accès LWS perdus~~ — **retrouvés le 14/08/2026**, voir § 8.
3. **Clé Gédéon** — pas encore demandée. Non bloquant, Bien'ici dépanne.

## 10. Prochaines étapes

1. Trancher le sort de l'`index.html` modifié (bloc SEO `display:none`).
2. Écrire à `api@gedeon.im`.
3. Récupérer les leads de la base MySQL (8 ans de `contact` / `quotation`).
4. Recâbler les deux formulaires (un `contact.php` d'une trentaine de lignes
   côté LWS, appelé en `fetch` depuis les composants React).
5. Décider du prérendu SEO (§ 4) — la SPA n'est pas indexable en l'état.
6. Écrire les redirections 301.
7. Retrouver les accès LWS, câbler le FTP, basculer, **éteindre le Symfony**.

## 11. Passe accessibilité et design (19/08/2026)

Audit mené avec les skills `ui-ux-pro-max` et `frontend-design`, mesures prises
au protocole DevTools (contrastes calculés sur le fond réellement composité, et
sur les pixels rendus quand le texte est posé sur une photo).

### Corrigé

- **Jaune de marque employé comme couleur de texte** — 50 occurrences à 1,83–1,96:1
  pour un seuil de 4,5. Basculées sur `--primary-ink`, dont la luminosité passe
  de 28 % à 26 % pour tenir aussi sur le `bg-primary/10` des badges (5,02:1 au
  lieu de 4,45). Le jaune vif reste sur les aplats marine, où il vaut 5,35:1.
- **13 pictogrammes blancs sur pastille jaune** (1,96:1) → marine.
- **Texte marine sur fond marine** sur `/services/gestion-copropriete` : le
  paragraphe de la bannière « Suivi Complet & Transparent » et trois des quatre
  lignes de notifications étaient **absents de l'écran**, contraste 1:1.
- **Bandeaux des quatre pages services** : voile horizontal (`to-r`, conçu pour
  un texte aligné à gauche) sous un contenu centré, qui tombait donc dans la
  partie transparente. Mesuré : sous-titre blanc à 2,70:1, titre jaune à 1,11:1.
  Voile vertical soutenu à la place → blanc 9,3–9,6:1, jaune 4,7–4,9:1.
- **Hero d'accueil** : le jaune du h1 était à 2,47:1 sur la façade claire, voile
  renforcé → 3,81:1 (bureau) et 3,53:1 (mobile).
- **`prefers-reduced-motion`** n'était respecté nulle part (`float`, `pulse`,
  `ping`, `bounce` en boucle infinie, défilement doux). Bloc ajouté à
  `index.css`, qui joue les apparitions instantanément au lieu de les couper —
  elles partent d'`opacity: 0` et une coupure nette laisserait la page blanche.
- **Anneau de focus** : `--ring` valait le jaune, soit 1,96:1 sur blanc pour un
  indicateur qui en demande 3. Doublé jaune + halo marine, visible sur les deux
  fonds du site. Vérifié par appuis Tab réels — `:focus-visible` ne se déclenche
  pas sur un `.focus()` programmatique.
- **Lien d'évitement** « Aller au contenu » + ancre `#contenu` sur les 11 pages.
- **Menu mobile** : fermeture par Échap (avec retour du focus au bouton) et par
  clic extérieur, `aria-controls`. Il ne se fermait qu'en retrouvant le bouton.
- **Téléphone absent en mobile** : la barre haute qui le portait est masquée sous
  `md`, et le menu ne proposait aucun appel. Bouton d'appel ajouté dans l'en-tête
  mobile ; coordonnées du pied de page et de la barre haute rendues cliquables.
- **Cibles tactiles** : 24 éléments sous 24×24 (WCAG 2.2 « Target Size »), dont
  le burger à 36×36. Tous à 24 px minimum, le burger à 44×44. Les deux liens
  restés à 17 px sont en pleine phrase — l'exception 2.5.8 les couvre.
- **Faux avis agrégés, deux fois** : `aggregateRating` 4,9/500 dans
  `index.html` et 4,8/127 dans `seo.ts` + `EstimationBiens.tsx`. Inventés, et
  interdits par Google (avis auto-déclarés). Retirés. La note publiable est
  celle de la fiche Google, vers laquelle renvoie `src/config/avis.ts`.
- **`og:image` par défaut cassé** : `SEOHead` avait `ogImage = "ar contr"`, donc
  aucun aperçu au partage sur toutes les pages sauf une.
- **Identité de démonstration restante** : « ABDJIP » dans `SEOHead`, `useSEO`
  et le titre de `EstimationBiens` ; `@abdjip` annoncé comme compte X (retiré,
  l'agence n'en a pas) ; `telephone: "+33 1 XX XX XX XX"`, `foundingDate: 2009`
  (contre 2011 partout ailleurs), `streetAddress: "Paris 8ème"`, « 15 ans
  d'expérience », `logo.png` inexistant → `apple-touch-icon.png`.
- **Émojis en guise de pictogrammes** (🔧 🚰 🔐 📅 📋 📊 ✨) → Lucide.
- **`to-secondary/600`** : opacité inexistante, la classe était ignorée et le
  dégradé n'avait pas de couleur d'arrivée.
- **Copie non vérifiable** : « équipe jeune et dynamique », « professionnels
  passionnés », « approche moderne », « expertise reconnue », « Notre équipe
  passionnée s'occupe de tout pendant que vous profitez de la vie ! ». Remplacée
  par ce que le site peut démontrer. « Excellence & Professionnalisme » sous le
  logo devient « Gestion locative & syndic — Paris 8ᵉ ».
- **Discipline visuelle** : le mot en jaune revenait sur les cinq h2 de la page
  d'accueil ; il n'en reste qu'un, sur l'appel à l'action final. La section Avis
  passe sur le marine de la charte — elle donne le seul point d'ancrage sombre
  d'une page qui enchaînait cinq fonds quasi blancs, et le jaune y devient
  lisible (5,35:1 contre 1,83 avant). Témoignages sortis de l'italique grise.
  Cinq cercles flous animés en boucle supprimés (accueil), quatre autres sur les
  pages services : imperceptibles, mesures faites.
- **Vitrine d'accueil** : elle ouvrait sur une vue satellite d'une maison à
  L'Houmeau (17137). Le filtre excluait les parkings mais pas ça. Remplacé par
  un **classement** — Île-de-France d'abord, parkings en dernier, récence à
  égalité — sans rien retirer : `/biens` montre toujours tout.

### Reste à faire

1. **Photos des quatre bandeaux services trop claires.** Le voile est à 85–95 %
   pour rendre le texte lisible : à cette densité la photo n'est plus qu'une
   texture. Des prises de vue plus sombres permettraient de rouvrir le voile.
2. **`/services/gestion-copropriete` est surchargée** — 20 `animate-pulse`, des
   `animate-ping` et `animate-bounce`, et 26 couleurs brutes hors charte
   (`teal-500`, `orange-500`, `pink-500`, `red-500`). Le mouvement réduit les
   neutralise désormais, mais la page mérite une cure. Idem `text-orange-600`
   sur les puces de `QuickCalculator`.
3. **Les puces `✓`** de `QuickCalculator` (12 occurrences) restent des glyphes
   typographiques et non des pictogrammes Lucide.
4. **`SEOHead` n'est posé que sur 4 pages sur 11.** Les autres héritent du
   `<head>` de `index.html` — désormais assaini, donc plus faux, mais générique.
   `SEOHead` ne nettoie rien au démontage : en navigation client, le JSON-LD de
   la page précédente survit sur une page qui n'en pose pas.
5. **`src/hooks/useSEO.ts` n'est utilisé nulle part** — doublon mort de
   `SEOHead`, à supprimer.
6. **Casse des h1** : « Gestion de Copropriété », « Achats & Ventes », « Estimation
   de Biens » gardent des capitales internes. Les pastilles et les cartes de
   services sont passées en casse de phrase, pas les titres de page.
7. **Le mode sombre est déclaré et injoignable** : les tokens `.dark` existent,
   aucun sélecteur ne les active. Soit on câble un bouton, soit on les retire.

### Seconde passe — ce que la première sonde avait manqué

La sonde de contraste initiale abandonnait dès qu'un fond était un dégradé et
classait ces éléments « non mesurables » : 20 sur `/contact`, 63 sur
`/services/gestion-copropriete`. C'est là que se cachait le pire. Sonde reprise
pour résoudre les arrêts de couleur des dégradés, et pour ne plus compter comme
échec le texte peint par `bg-clip-text` (dont `color` ne dit rien de ce qui est
affiché — `gradient-text`, mesuré aux pixels, tient 3,68 à 4,92:1, donc réservé
aux tailles ≥ 24 px).

Trouvé et corrigé ensuite :

- **`/contact` : la pastille « Contactez-nous » était invisible** — `bg-white/30`
  et `text-white` posés sur `bg-gradient-subtle`, qui part du blanc. Plus les
  quatre pictogrammes de contact en blanc sur pastille jaune (la couleur arrivait
  par interpolation, la passe automatique ne pouvait pas la voir), un
  `id="contact-form"` porté deux fois (HTML invalide, l'ancre du bouton visait
  l'un des deux au hasard) et trois cercles flous qui, sur ce fond clair, se
  voyaient — comme des salissures jaunes.
- **`/services/achats-ventes` : libellé de bouton invisible.** `bg-secondary` en
  surcharge sur la variante par défaut, dont le premier plan reste marine.
  Remplacé par `variant="secondary"`, qui apparie les deux.
- **`/services/gestion-copropriete`, la grille des six atouts.** Trois cartes
  avaient un fond marine (`from-secondary` au lieu de `secondary-soft`) sous un
  contenu écrit pour une carte claire : titres, intitulés et paragraphes entre
  1:1 et 1,3:1. Les trois autres introduisaient orange, turquoise et rose. Et la
  sixième était sortie de la grille par une balise mal fermée. Réécrite en
  boucle : une surface claire, les deux accents de la charte en alternance.
- **Le faux tableau de bord.** Deux sections disaient la même chose — « Gercop
  Copropriété » et « Informations internet ». La seconde mettait en scène une
  interface qui n'existe pas : bandeau « LIVE UPDATES » à points rouges
  clignotants, fil de notifications factice, et un compteur « Cette semaine :
  8 notifications / 3 interventions » entièrement inventé. Même famille de
  problème que la note d'avis fabriquée. Les deux sections fusionnées en une,
  qui garde les trois niveaux d'accès réels et leur contenu. La page passe de
  761 à ~490 lignes, de 26 couleurs hors charte à 0, et de plus de 20 animations
  perpétuelles à 0.
- **Hiérarchie des titres.** Le pied de page ouvrait ses colonnes en `h4` après
  un `h2`, sur les onze pages. `/equipe` et `/contact` sautaient de `h1` à `h3`.
- **En-tête entre 768 et 1023 px** : le bouton d'appel ajouté en mobile doublait
  le numéro de la barre haute, qui réapparaît à `md`. Recalé sur `md`, le burger
  restant sur `lg`.
- **Bouton à pictogramme seul** de `QuickCalculator` : écrasé à 18 × 32 px par le
  flex voisin, et nommé par un `title` seul — qui n'existe ni au doigt ni au
  clavier. 44 × 44 et `aria-label`.
- **Casse** : « Nos Services », « Liens Utiles », « Pourquoi Nous Choisir ? »,
  « Nos Types d'Estimation »… passés en casse de phrase. Les noms d'offre
  (« Mandat Sérénité », « Mandat Dynamique ») gardent leur capitale.
- **Image du bandeau de `/achats-ventes`** : ni dimensions ni `loading`, donc
  place non réservée et décalage à l'affichage.

### État vérifié au 19/08/2026

Sur les dix pages, à 390 / 768 / 1440 px : aucun échec de contraste, aucune
cible sous 24 × 24 hors exception « lien dans une phrase », aucun débordement
horizontal, aucune animation perpétuelle sous `prefers-reduced-motion`,
hiérarchie de titres conforme. Le texte des cinq bandeaux photo, que la sonde
DOM ne peut pas mesurer, a été contrôlé au décodage des pixels : blanc de 7,5 à
9,6:1, jaune de 3,5 à 4,9:1.

Non vérifié, à faire un jour : envoi réel des formulaires (le `contact.php` reste
à recâbler, § 10), parcours du calculateur d'estimation et des filtres de
`/biens`, rendu Safari et Firefox (tout a été mesuré sous Chrome), performance
et poids réel des pages, et lecture au lecteur d'écran.

### Troisième passe — identité visuelle (19/08/2026)

- **Couple typographique.** Spectral (titres) + Inter (texte). Spectral est
  dessinée par Production Type, fonderie parisienne, et pensée pour l'écran :
  basse en contraste, serifs francs, excellente en français. Ni Playfair ni
  Cinzel, les deux réflexes du secteur immobilier. Le partage suit la nature du
  contenu, il n'est pas décoratif : Spectral porte le discours, Inter porte tout
  ce qui se lit comme une donnée — prix, honoraires, surfaces, DPE, horaires,
  mentions Hoguet. Un taux d'honoraires se lit en linéale. Utilitaire
  `.tabulaire` pour les colonnes de chiffres.
- **La plaque, signature du site.** Les repères de section existaient en quatre
  variantes concurrentes (pastille de verre à texte jaune, pastille marine
  translucide, pastille dégradée à points clignotants, et rien du tout sur la
  section de contact). Remplacées par un seul objet : `.plaque`, dessinée
  d'après les plaques de rue de Paris — émail bleu nuit, liseré clair en retrait,
  capitales espacées. Elle vient de l'univers de l'agence, dont elle porte déjà
  les couleurs, plutôt que d'un catalogue de composants. Version inversée sur les
  fonds marine. C'est le seul geste appuyé du site ; tout le reste reste sobre.
- **Les quatre illustrations de service** venaient de quatre prises de vue sans
  rapport : une chaude à faible profondeur de champ, un hall froid et dégradé, un
  bureau sombre, un appartement clair. Léger désaturé commun et voile marine (au
  lieu de noir) : elles se lisent enfin comme une série. Les photos des
  **annonces** ne sont pas retouchées — un acquéreur doit voir le bien tel qu'il
  est.
- **La photo du bureau est légendée.** C'est la seule image vraiment distinctive
  du site — vrais dossiers, vraie fenêtre sur la rue. Sans légende elle restait
  un décor ; avec, elle atteste ce que le paragraphe affirme.
- **Filler retiré** : « Fait avec passion à Paris » et son cœur en pied de page
  (registre faux : on choisit un syndic pour sa rigueur), remplacé par un lien
  vers les cartes professionnelles — la vraie garantie. Doublon de la première
  colonne resserré. Casse de « Mentions Légales » alignée.
- **Coupe du titre du hero** : avec Spectral, « est » restait orphelin en fin de
  première ligne. Coupe forcée après « professionnalisme » à partir de `md`.
- **`hero-building.webp` fait 1800 × 600**, le code déclarait 1920 × 1080 : le
  rapport annoncé étant faux, la place réservée ne correspondait pas à l'image.

### Nettoyage de la même passe

- **Les deux `Toaster` étaient montés sans qu'aucun composant n'appelle jamais
  `toast()`** — le formulaire affiche son retour lui-même dans un `role="status"`,
  ce qui vaut mieux. Conséquence : deux régions `aria-live` vides annoncées
  « Notifications » sur chaque page, et `next-themes` tiré pour rien (thème
  « system » faute de fournisseur, donc toast sombre possible sur site clair).
  Montages retirés → **le HTML prérendu est divisé par deux** (`/equipe` 58 → 28 ko).
- `src/hooks/useSEO.ts` supprimé : doublon mort de `SEOHead`, jamais importé.
- **`SEOHead` posé sur les 11 pages** (il n'était sur que 4). Les sept autres
  héritaient du `<head>` de `index.html` : même titre, même description, même
  canonique — de la cannibalisation entre ses propres pages. Option `noindex`
  ajoutée, appliquée à la 404, qui se déclarait indexable.
- **La 404 reçoit en-tête et pied de page**, et trois destinations au lieu d'un
  lien. Les redirections 301 depuis l'ancien Symfony n'étant pas écrites (§ 3),
  elle va recevoir du trafic réel. Son `<a href="/">` rechargeait toute
  l'application au lieu de naviguer côté client.
- `og:image` de `/services/estimation-biens` pointait vers
  `/assets/EstimationBien.png` : chemin inexistant en production (Vite renomme
  avec une empreinte, et ce PNG n'est même pas importé).
- `logo.png` référencé dans `seo.ts` n'existe pas dans `public/`.
- **Zéro couleur brute** hors `components/ui/` (26 avant : orange, turquoise,
  rose, rouge). **Zéro émoji.** **Zéro animation perpétuelle.**

### Quatrième passe — nettoyage (19/08/2026)

Analyse d'atteignabilité par graphe d'imports depuis `src/main.tsx`, plutôt que
par grep : un composant importé uniquement par un autre composant mort compte
sinon comme utilisé.

- **44 fichiers morts supprimés, 137 ko.** 41 composants de l'échafaudage shadcn
  jamais atteints (`table`, `chart`, `carousel`, `calendar`, `sidebar`,
  `command`, `form`…), `SEOStructuredData.tsx` (doublon du JSON-LD que `SEOHead`
  injecte déjà), `hooks/use-toast.ts` et `hooks/use-mobile.tsx`. Il reste huit
  composants `ui/` : accordion, badge, button, card, dialog, input, textarea,
  tooltip. `src/hooks/` a disparu, vide.
  **`src/vite-env.d.ts` est conservé** : jamais importé, mais TypeScript en a
  besoin pour typer `import.meta.env`. Le supprimer casse le typecheck — piège
  classique de ce genre d'analyse.
- **36 dépendances retirées sur 49.** Seuls treize paquets sont effectivement
  importés. Vérifié par `npm install` (qui élague `node_modules`) suivi d'un
  build complet, et non en se fiant à un `node_modules` déjà peuplé.
  `node_modules` : 272 → 202 Mo. `lovable-tagger` est **conservé** :
  `vite.config.ts` l'appelle en développement et le projet peut encore recevoir
  des modifications depuis Lovable. `@tailwindcss/typography` retiré, aucune
  classe `prose` dans le projet.
- **`npm audit fix`** : 16 → 5 vulnérabilités, build intact. Les cinq restantes
  exigent des ruptures et **n'ont pas été appliquées** : `react-router` 6 → 7
  (API de routage, cœur du site) et un Vite majeur pour `esbuild` (serveur de
  développement uniquement). À traiter à froid.
- **`bun.lockb` supprimé.** Les deux workflows utilisent `npm ci`, et ce fichier
  était en désaccord avec `package.json` après les retraits — deux lockfiles qui
  divergent est un piège.
- **Correction d'une affirmation antérieure : « zéro couleur brute » était faux.**
  Mon motif de recherche ne couvrait pas `gray`. Il en restait 26, presque toutes
  dans `QuickCalculator.tsx` : rouges d'erreur, ambre d'avertissement, gris de
  squelettes, et deux dégradés `from-secondary to-indigo-50`. Toutes ramenées aux
  tokens (`destructive`, `destructive-ink`, `primary-soft`, `muted`). Vérifié
  cette fois avec la liste complète des palettes Tailwind.
- **Deux cartes marine sous du texte sombre dans le panneau de résultat du
  calculateur.** Invisibles, et jamais vues par la sonde : ce panneau n'existe
  qu'**après** un calcul. Corrigées, puis vérifiées en pilotant réellement le
  calculateur (remplissage via les setters React, clic, mesure) — 0 échec.
- **Les 18 champs des deux formulaires de `/services/estimation-biens` n'avaient
  aucun nom accessible** : libellés purement visuels, sans `htmlFor`, devant des
  champs sans `id`. Un lecteur d'écran n'annonçait que le placeholder, qui
  disparaît à la saisie, et le remplissage automatique ne proposait rien. Reliés,
  avec `autoComplete` là où c'est pertinent. `FormulaireContact` était déjà
  correct (1 champ sur 7).
- **Les bandeaux affichaient un fichier de 700 × 467 en pleine largeur**
  (déclarée 1920 px), soit un agrandissement de 2,7× — d'où leur mollesse. Les
  PNG de `src/assets/` sont en fait les **masters en 1536 × 1024**, pas du poids
  mort comme je l'avais d'abord écrit : variantes `-large.webp` générées à cette
  résolution pour les quatre bandeaux, dimensions déclarées corrigées. Les cartes
  de la page d'accueil gardent le 700 px, suffisant pour un emplacement de 336 px
  même en densité doublée.
- **Les cinq derniers cercles flous animés** de la page copropriété (commentaire
  différent, mon nettoyage précédent les avait manqués) et deux points
  clignotants décoratifs. Les `animate-pulse` restants sont des squelettes de
  chargement : c'est leur raison d'être, et le mouvement réduit les neutralise.

**Bilan** : lint 19 erreurs / 4 avertissements (22 / 11 au départ), 13
dépendances au lieu de 49, `node_modules` −70 Mo, HTML prérendu divisé par deux,
0 couleur brute hors `components/ui`, 0 émoji, 0 animation décorative
perpétuelle, 18 champs de formulaire nommés, et 10 pages sans aucun échec de
contraste ni de cible tactile à 375, 768 et 1440 px.

**Les PNG masters restent dans `src/assets/`** : ce sont les sources
haute résolution, pas des orphelins. Ils gonflent le dépôt de 11 Mo sans partir
dans `dist` — à sortir vers un stockage dédié plutôt qu'à détruire.

### Cinquième passe — vulnérabilités (20/08/2026)

**0 vulnérabilité** (16 au départ, dont 13 hautes).

- `npm audit fix` sans rupture : 16 → 5.
- Les 5 restantes exigeaient des majeurs, appliqués et vérifiés :
  - **`react-router-dom` 6.30 → 7.18.** Correctif de l'XSS par redirection ouverte
    de `@remix-run/router`. Le site n'emploie que l'API déclarative
    (`BrowserRouter`, `Routes`, `Route`, `Link`, `useLocation`, `basename`),
    stable en v7 : aucun changement de code nécessaire.
  - **`vite` 5.4 → 6.4.3** (esbuild ^0.25, corrigé) et **`lovable-tagger`
    1.1.9 → 1.3.3**, qui accepte `vite >=5 <9` là où 1.1.9 exigeait `^5`. C'est
    lovable-tagger qui bloquait la montée, pas Vite.
  - **Vite 7 écarté volontairement** : il exige Node ≥ 20.19, le poste est en
    20.11. Vite 6 demande `^18 || ^20 || >=22`, compatible avec le poste comme
    avec la CI (Node 22 dans les trois workflows).

Vérification du majeur de routeur, au-delà du build :
- les **11 routes** rendent (h1 présent, en-tête et pied présents, contenu non
  vide, aucune erreur React), catch-all 404 compris ;
- la **navigation côté client** ne recharge pas la page — un marqueur posé sur
  `window` survit aux trois navigations enchaînées ;
- `ScrollManager` remet bien le défilement à zéro à chaque route ;
- le **retour arrière** du navigateur fonctionne ;
- le **prérendu** produit toujours 10/10 pages. Il pilote un vrai Chrome via
  `--dump-dom` et n'importe pas le routeur : il ne pouvait pas casser de
  lui-même, mais un routage cassé aurait produit des pages vides.

### Sixième passe — retour à Inter (20/08/2026)

Spectral écartée à la demande du client. **Une seule famille sur tout le site.**

Le vrai reproche à faire à Spectral n'était pas son dessin mais son accord : un
romain à empattements s'opposait à la plaque, qui est de la signalétique. Une
linéale parle la même langue. Les cinq candidates ont été comparées dans le vrai
bandeau du site (marine, jaune, corps et interlettrage réels) avant l'arbitrage.

La hiérarchie ne vient donc plus d'un second caractère mais du réglage :
- `font-optical-sizing: auto` déclaré explicitement — la variable d'Inter porte
  un axe `opsz` (14..32) déjà chargé, qui fournit une coupe d'affichage aux
  grands corps et une coupe de texte au corps courant. C'est ce qui fait tenir
  Inter en grand titre plutôt que de ressembler à du texte agrandi ;
- interlettrage resserré par niveau : **h1 −0,028em**, **h2 −0,022em**,
  **h3/h4 −0,011em**. Ce qui convient à 16 px écarte trop à 72 px ;
- interligne 1,05 / 1,07 / 1,25 ;
- `text-wrap: balance` sur les titres, qui répartit les lignes au lieu de laisser
  un mot seul en fin de ligne.

Aucune requête de police en plus : Inter était déjà chargée. Vérifié après
bascule — 10 pages sans échec de contraste ni de cible à 375 et 1440 px, voile du
hero inchangé (blanc 7,48:1, jaune 3,81:1), build 10/10.

**La plaque reste la signature du site** : c'est le seul geste appuyé, et il
s'accorde désormais avec la typographie au lieu de la contredire.

### Vérification des images (20/08/2026)

Contrôle après les changements d'imports : **les 25 images des 10 pages chargent**
(`complete && naturalWidth > 0`, mesuré après défilement complet de chaque page
pour déclencher le chargement différé). Une première mesure sans défiler
signalait `agence-bureau.webp` en 0 × 0 : c'était la sonde, pas l'image — un
`loading="lazy"` sous la ligne de flottaison n'est pas encore chargé. `/about`,
`/contact` et `/mentions-legales` n'ont aucune image, et n'en ont jamais eu.

**Piège créé puis désamorcé.** Les quatre `-large.webp` générés pour les bandeaux
n'étaient pas suivis par git. Vérifié en les déplaçant puis en relançant le
build : celui-ci **échoue** (`Could not load … ENOENT`), donc `npm ci &&
npm run build` en CI aurait cassé au premier push. Les quatre fichiers sont
désormais à l'index. À retenir pour toute génération d'asset : un fichier produit
localement dont le code dépend doit être ajouté au dépôt dans le même geste.

`EstimationBien-large.webp` ramené de 246 à 138 ko (qualité 68 au lieu de 82) :
il pesait plus du double des trois autres, et l'image est de toute façon
recouverte d'un voile à 85–95 %. Contraste revérifié après recompression —
blanc 10,67:1, jaune 5,44:1. `dist/assets` : 1,5 Mo.

---

## 12. Direction artistique « Le hall » (27/08/2026)

Branche `refonte/direction-artistique-hall`. **Rien n'est poussé.**

Refonte de la direction artistique, pas seulement de la charte. Le site
précédent était juste, accessible et honnête — et visuellement indistinguable
d'un gabarit : verre dépoli, titres en dégradé, quatre cartes égales qui
décollent au survol, pastilles d'icônes colorées, gélules, tout centré.

### Le concept

**Le public voit la façade, le syndic connaît le hall.** Une agence de gérance
et de syndic ne vend pas un appartement ensoleillé : elle détient les clés, le
registre et les comptes d'un immeuble, sur vingt ans. Le site est posé dans le
hall — boiseries marine, pierre, laiton, une seule lampe — et non sur la façade
côté rue. C'est le registre juste pour la clientèle réelle (propriétaires
bailleurs, conseils syndicaux) et il évite le fantasme du loft, qui n'est pas
le métier de la maison.

L'unité du système est **la plaque** : dans un hall parisien, tout est plaqué.
Elle cesse d'être un ornement au-dessus des titres pour devenir la géométrie de
tout ce qui est encadré. Le titre de la page d'accueil est **une adresse** —
« Deux métiers, une seule adresse » — et l'objet d'ouverture est la plaque de
rue à l'échelle d'un objet.

### La décision structurante, et elle est mesurée

Le jaune de l'enseigne fait **1,81:1 sur un fond clair** et **8,91:1 sur le
fond de nuit**. C'était le problème documenté au § 11 : il avait fallu inventer
deux déclinaisons sombres du jaune pour pouvoir l'écrire quelque part, et une
passe entière avait consisté à retirer les `text-primary` des fonds clairs.
Inverser la coquille du site est la seule manière de rendre à l'agence sa
couleur. Ce n'est pas un choix de goût, c'est la conséquence d'une mesure.

Tous les ratios de la nouvelle palette ont été **calculés** (WCAG 2.1, sRGB),
pas estimés. Le tableau est dans `CLAUDE.md` et les commentaires de
`src/index.css`.

### Ce qui a été fait

- **Système** : `src/index.css` réécrit (six matières, `.nuit` comme portée de
  jetons, la plaque, le trait, le lavis, le duotone, le champ réglé, le voile),
  `tailwind.config.ts` réécrit (deux familles, géométrie de plaque, ombres
  d'encre, `rounded-2xl|3xl` redéfinis).
- **Typographie** : Archivo (axe de largeur `wdth`) pour les titres et les
  plaques, Inter conservée pour le texte et la donnée. **Le total des fontes
  baisse de 201,9 à 159,2 Ko** : l'axe italique d'Inter était demandé sans
  qu'une ligne du site soit en italique.
- **Primitives** : `src/components/systeme/` — `Ouverture.tsx` (un seul
  `IntersectionObserver` pour la page, trois gestes), `EnTeteSection.tsx`
  (plaque + trait + aparté), `PlaqueDeRue.tsx`.
- **Page d'accueil recomposée** : ouverture, registre des quatre métiers (la
  grille de quatre cartes est remplacée par des lignes pleine largeur),
  portefeuille, agence (registre des dirigeants tiré de `config/legal.ts`),
  avis, **section de conversion**.
- **Coquille** : en-tête de nuit qui se resserre au défilement, la barre haute
  des coordonnées absorbée, pied de page.
- **Formulaire** : champs réglés, et le **pré-triage** de l'accueil arrive
  présélectionné via `?service=`.
- **Images** : `facade-lisbonne-{800,1280,1920}.webp` dérivées de
  `hero-building.jpg` (lumière rasante, bien meilleure que le panorama à plat
  qui servait d'ouverture).
- **Rétrofit des onze pages** : huit classes et cinq jetons redéfinis plutôt
  que supprimés — une centaine d'usages corrigés sans rouvrir les fichiers.
  Plus, en balayage ciblé : 17 gélules redevenues des plaques, 6 taches
  floutées décoratives retirées, `.nuit` ajoutée aux quatre ouvertures de pages
  services.

### Bogues trouvés et corrigés en route

1. **Les quatre ouvertures de pages services étaient sombres sans portée de
   jetons** : `--foreground` restait l'encre, donc le bouton du numéro
   s'affichait en encre sur marine et les accents `gradient-text` en ocre foncé
   sur marine. Deux textes illisibles. `.nuit` sur la section corrige les deux.
2. **Le prérendu aurait expédié un contenu invisible** : un
   `[data-voile] { opacity: 0 }` en CSS pur s'applique aussi aux dix pages
   HTML statiques. Le masquage est passé en JavaScript, et **seulement sous le
   pli** — rien de ce qui est déjà peint n'est jamais masqué.
3. **Le trait de section ne se voyait pas** : posé en `absolute … -z-10`, un
   z-index négatif l'envoyait derrière le fond peint de la section. Devenu un
   vrai élément de rangée flex, ce qui supprime en outre le rapiéçage de fond
   qu'il fallait derrière l'aparté.
4. **La plaque du numéro débordait de 44 px entre 1024 et 1280 px**, mesuré à
   la sonde : à `lg` les cinq entrées du menu apparaissent et le bouton menu
   s'en va. Elle passe à `xl`.
5. **`ᵉ` (U+1D49) tombait hors police** : hors du sous-ensemble latin de Google
   Fonts, il basculait dans une police système et « Paris 8ᵉ » s'affichait
   « Paris 8° ». Balisé `8<sup>e</sup>`.
6. **Le duotone n'était en pratique qu'un noir et blanc froid** : à 13 % et
   88 % de clarté, `lighten` et `multiply` ne mordaient que sur les extrêmes de
   l'histogramme. Relevé à 21 % et 91 %.
7. **Le chevron de la liste déroulante** : quatre utilitaires `bg-[…]` empilés
   se contredisaient, Chrome rendait un carré noir. Classe dédiée
   `.champ-liste`, chevron SVG.

### Objectif de conversion

**Un entretien de mandat** — un propriétaire qui confie un lot en gérance, un
conseil syndical qui change de syndic. C'est le revenu récurrent de la maison,
donc le seul indicateur qui compte. Deux portes à l'ouverture (« Confier un
bien », « Changer de syndic ») et pas de troisième : l'estimation relève d'une
autre société du groupe et d'un autre métier.

Le **téléphone est traité comme l'objet principal** de la section de
conversion, composé à l'échelle d'un titre : la clientèle d'une gérance
parisienne appelle. Le formulaire n'est proposé qu'après un **pré-triage en un
clic** (propriétaire bailleur / conseil syndical / vendeur ou acquéreur), qui
présélectionne le service.

À instrumenter côté mesure, dans cet ordre : appuis sur `tel:`, demandes
qualifiées par profil, taux `/biens` → contact.

### Reste à faire

- **Recomposer les pages internes.** Elles héritent des jetons, des boutons,
  des champs et des cadres, et elles sont désormais correctes — mais leur
  composition reste celle du gabarit : tout centré, pastilles d'icônes
  colorées en aplat de laiton, blocs de statistiques. Par ordre de visibilité :
  `services/GestionLocative`, `services/GestionCopropriete`,
  `services/EstimationBiens`, `services/AchatsVentes`, puis `Contact`, `Team`,
  `Biens`, `About`.
- **Le duotone sur les ouvertures de pages services** : la structure actuelle
  (image + voile en frères) empêche l'empilement des deux fusions. À reprendre
  avec `Calage` + `.photo-editoriale` comme sur l'accueil.
- **Vérifier sous 485 px.** Chrome sans interface refuse une fenêtre plus
  étroite ; les captures dites « 420 » étaient en réalité recadrées. Les points
  de rupture du site étant à 640, le comportement est identique de 375 à 639,
  mais cela reste à confirmer sur un vrai téléphone.
- **Illustrations des métiers** : les quatre `.webp` restent des images de
  banque. Le duotone les unifie ; il ne les rend pas vraies. Des photographies
  du 27 rue de Lisbonne — le hall, l'escalier, la porte cochère, les boîtes aux
  lettres, le bureau — serviraient directement le concept, et c'est la demande
  la plus rentable à faire au client.
- **Mesurer les voiles des pages services sur les pixels rendus**, comme cela
  avait été fait au § 11. Ils ont été approfondis (`nuit/96 → 91 → 97`) par
  jugement visuel après capture, sans relevé.

---

## 13. Mise en ligne — état au 27/08/2026

Cette section remplace ce que les § 8 à 10 disaient de la bascule : plusieurs de
leurs points sont réglés, et deux défauts mesurés s'y ajoutent.

### Ce qui est réglé depuis la rédaction des § 8–10

| Point annoncé bloquant | État |
|---|---|
| `.htaccess` absent du dépôt | **Présent** (`public/.htaccess`), recopié dans `dist/` par Vite |
| Redirections 301 non écrites | **Écrites et vérifiées une par une**, y compris sur LWS |
| Les deux formulaires disparus | **`public/contact.php`** (179 lignes) ; testé sur preprod : 422 + JSON + champs nommés |
| Fichier Search Console perdu au build | **Repris dans `public/`**, servi en 200 sur preprod |
| SPA non indexable | **Prérendu au build** : `scripts/prerender.mjs`, 10 pages, quatre garde-fous |

**Les 14 contrôles de `npm run verifier` passent sur `https://preprod.adbjip.fr`.**
La chaîne d'hébergement est donc prouvée : HTTPS forcé, `.htaccess` transféré,
PHP exécuté, `leads.jsonl` refusé, prérendu livré. Ce qui manque, c'est un envoi
de la version courante.

### Deux défauts de `.htaccess`, mesurés sur LWS et corrigés

Relevés le 27/08/2026 sur `preprod.adbjip.fr`, pas déduits :

1. **Toutes les routes prérendues répondaient 301 vers la forme avec barre
   oblique finale.** `/biens` → `/biens/`, `/contact` → `/contact/`, `/equipe` →
   `/equipe/`. mod_dir voyait un dossier. Or la balise canonique et le sitemap
   déclarent la forme SANS barre : Google recevait une contradiction, et chaque
   visite directe payait un aller-retour de plus. Corrigé par `DirectorySlash Off`
   plus une règle qui sert `<route>/index.html` directement.
2. **Le bundle JavaScript partait non compressé et sans aucun en-tête de cache** :
   554 022 octets à chaque visite. Cause : Apache 2.4 sert les `.js` en
   `text/javascript`, et les listes `AddOutputFilterByType` / `ExpiresByType` ne
   citaient que `application/javascript`. Même piège pour le sitemap
   (`application/xml` contre `text/xml`). Corrigé en déclarant les deux
   orthographes. Après correction, mesuré en local : **348 953 → 113 195 octets**,
   plus `Cache-Control: public, max-age=31536000, immutable`.

Toutes les règles du `.htaccess` ont été **éprouvées sous Apache 2.4.66 en local**
avec les modules de LWS et le `dist/` réel. Pour reproduire : monter un `httpd.conf`
minimal qui charge `rewrite`, `alias`, `deflate`, `expires`, `headers`, `dir`,
pointer `DocumentRoot` sur une copie de `dist/` **hors de `~/Documents`** (Apache
tourne en `_www` et n'a pas le droit d'y lire), et neutraliser le bloc HTTPS le
temps du test.

### Ce qui reste à faire avant de basculer

1. **Exporter la base MySQL du Symfony.** Huit ans de `contact` et `quotation`.
   Irremplaçable, et à faire AVANT tout le reste.
2. **La branche de déclenchement de `deploy.yml` ne correspond plus** : le
   workflow écoute `refonte/mise-en-conformite`, le travail est sur
   `refonte/direction-artistique-hall`. Tant que ce n'est pas aligné, aucun push
   ne déploie la préversion, et **la préversion en ligne date du 15/08** —
   douze jours avant la direction artistique, dont elle ne porte aucun marqueur.
3. **Le prérendu manquant ne fait pas échouer la CI.** Vérifié : sans Chrome,
   `prerender.mjs` écrit deux lignes de journal et sort en **0**. Le déploiement
   continue et le site part non indexable, sans alerte. `CHROME_PATH` est bien
   posé dans `deploy.yml` et `preview.yml`, et la liste de candidats couvre les
   chemins d'un runner Ubuntu — mais rien ne garantit le résultat.
   *Correctif proposé, non appliqué (le workflow ne doit pas être réécrit) :*
   ajouter une étape après `npm run build` —
   `grep -q 'data-voile\|<h1' dist/biens/index.html || exit 1`, ou appeler
   `npm run verifier` sur la préversion après l'envoi.
4. **Créer le compte FTP de production**, sans rien dans le champ « Répertoire ».
5. **Passer le site principal en PHP 8.3** (il est en 5.6 pour le Symfony).
6. **Clé Gédéon** — non bloquant, Bien'ici dépanne.

### Le cache de périphérie de LWS — piège majeur, relevé le 27/08/2026

**LWS place un cache devant Apache, et il ne respecte pas le `no-cache`.**
En-têtes relevés en clair sur `preprod.adbjip.fr` :

```
x-cache-status: HIT
edge-cache-engine-mode: ACTIVE
last-modified: (antérieur au déploiement)
```

Le cas exact, reproduit six fois de suite : `/agence`, créé par le déploiement,
répondait **404 à `fetch` et 200 à `curl`, au même instant**. La clé du cache
inclut `Accept-Encoding` — undici demande `gzip, deflate` et tombait sur
l'entrée périmée, curl demandait autre chose et passait à travers. Deux
visiteurs, deux réponses, pour la même URL.

Ce qui NE marche pas, testé un par un :

| Tentative | Résultat |
|---|---|
| `Cache-Control: no-cache` en requête | ignoré, HIT servi |
| `Pragma: no-cache` en requête | ignoré, HIT servi |
| `Cache-Control: no-cache, must-revalidate` en réponse (déjà dans `.htaccess`) | ignoré |
| `last-modified` du fichier plus récent que l'entrée | ne déclenche aucune revalidation |
| `Accept-Encoding: identity` ou `br` | MISS, réponse fraîche — mais c'est un contournement, pas une purge |
| paramètre de requête unique | MISS, réponse fraîche |

**Conséquences pour la bascule en production, à ne pas découvrir le jour J :**

1. Après un envoi FTP, une route **nouvellement créée** peut répondre 404 à une
   partie des visiteurs pendant la durée de vie de l'entrée en cache.
2. Symétriquement, l'ancien contenu peut continuer d'être servi après la
   bascule. C'est le risque le plus grave : le Symfony éteint pourrait rester
   visible pour certains clients.
3. **Vider le cache dans le panneau LWS fait partie de la bascule**, juste après
   l'envoi et avant toute vérification. À ajouter entre les étapes 8 et 9.

**Le cache stocke aussi les EN-TÊTES, et c'est ce qui rend la purge
indispensable.** Constaté le 27/08/2026 en corrigeant le `Cache-Control` des
photos d'annonces : le serveur renvoyait bien la nouvelle valeur
(`max-age=86400, must-revalidate`, vérifié avec un paramètre de requête), mais
l'URL nue continuait de servir l'ancienne (`immutable`, un an) depuis le cache.

Conséquence : tout visiteur servi pendant cette fenêtre reçoit l'ancien en-tête
et met le fichier dans le cache de SON navigateur pour la durée qu'il annonce.
Un mauvais `Cache-Control` servi dix minutes empoisonne donc des caches pour un
an, et aucun déploiement ultérieur n'y change rien. **La purge n'est pas une
finition, c'est une étape de la bascule.**

`npm run verifier` sait maintenant faire la différence : il interroge les URL
**nues**, celles que les visiteurs demandent, et quand l'une échoue il redemande
la même en contournant le cache. Si elle réussit alors, le message le dit —
« le déploiement est bon : vider le cache LWS » — au lieu de laisser croire à un
déploiement raté. Un contrôle non essentiel balaie en plus les dix routes pour
signaler toute réponse périmée.

### Liste de contrôle de bascule

À faire dans cet ordre. Chaque ligne indique **comment revenir en arrière**.

| # | Geste | Vérification | Retour en arrière |
|---|---|---|---|
| 1 | Exporter la base MySQL du Symfony (phpMyAdmin → Exporter → SQL) | Le fichier s'ouvre et contient les tables `contact` et `quotation` | Sans objet : c'est une lecture. **Ne pas continuer sans ce fichier.** |
| 2 | Copier `htdocs/.htaccess`, `index.php`, `sitemap.xml`, `robots.txt`, `default_index.html` dans `htdocs/.quarantaine/` | Les cinq fichiers sont dans `.quarantaine/` | Les recopier à la racine |
| 3 | Aligner la branche de `deploy.yml` sur la branche de travail, pousser | L'onglet Actions montre un run « Déploiement LWS » vert | Annuler le commit de workflow |
| 4 | Déployer sur **preprod** (`cible: preprod`) | `npm run verifier https://preprod.adbjip.fr` → 14/14 | La préversion n'est pas la production : aucun impact |
| 5 | Regarder la préversion sur un vrai téléphone, page par page | Les dix pages, le formulaire envoyé pour de vrai | idem |
| 6 | Passer le site principal en PHP 8.3 (panneau LWS) | `htdocs/` répond encore ; l'ancien Symfony va casser, c'est attendu | Repasser en 5.6 : le Symfony revient |
| 7 | Créer le compte FTP de production (« Répertoire » vide) et renseigner les trois secrets | Un run `cible: production` en mode « dry run » si disponible, sinon vérifier les identifiants au client FTP | Supprimer le compte FTP |
| 8 | Déployer sur **production** (`workflow_dispatch`, `cible: production`) | `npm run verifier https://www.adbjip.fr` → 14/14 | **Le point de non-retour du contenu.** Restaurer `.quarantaine/` par FTP ; `JIPV3/` et `vendor/` n'ont pas été touchés, l'ancien site redevient servable |
| 8b | **Vider le cache de périphérie dans le panneau LWS** | `npm run verifier` ne signale plus de route périmée | Sans objet : c'est une purge |
| 9 | Vérifier les quatre 301 une par une sur le domaine réel | Les quatre contrôles `301 …` du vérificateur | Corriger `.htaccess` et renvoyer le seul fichier |
| 10 | Vérifier `https://www.adbjip.fr/googlea5ff7faf806fdf23.html` | HTTP 200 | Le renvoyer par FTP depuis `public/` |
| 11 | Search Console : soumettre `https://www.adbjip.fr/sitemap.xml`, demander l'indexation des six anciennes URL | Le sitemap est accepté, 9 URL lues | Sans objet |
| 12 | Surveiller 72 h : Search Console (couverture, 404), `leads.jsonl`, les journaux LWS | Aucune 404 sur les six anciennes URL, les demandes arrivent | Revenir à l'étape 8 |
| 13 | **Éteindre le Symfony** : renommer `JIPV3/` en `JIPV3.eteint/` | Le site répond toujours ; PHP 5.6/Symfony 3.3 ne sont plus exposés | Renommer en sens inverse |
| 14 | Après un mois sans incident, supprimer `JIPV3.eteint/` et `vendor/` (1,72 Go + 8 096 fichiers) | Espace disque libéré | **Irréversible.** Ne le faire qu'avec l'export de l'étape 1 en main. |

Deux pièges à garder en tête pendant l'opération :

- **`SamKirkland/FTP-Deploy-Action` synchronise** : il supprime à distance ce qui
  n'est pas dans `dist/`. Les exclusions couvrent `JIPV3/`, `vendor/`,
  `.quarantaine/` et `leads.jsonl` — mais **pas** `index.php` ni
  `default_index.html`, qui seront donc supprimés au premier envoi en production.
  C'est voulu, et c'est pourquoi l'étape 2 les met à l'abri d'abord.
- **GitHub désactive un workflow planifié après 60 jours sans activité.** Si les
  annonces cessent de se rafraîchir, regarder là avant tout le reste.
