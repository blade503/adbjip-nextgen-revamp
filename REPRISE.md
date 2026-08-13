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
| `/about` | **`/contact`** — piège : `/about` existe dans le revamp mais avec un autre contenu |

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

## 8. Déploiement LWS

`.htaccess` à mettre dans `public/` (Vite recopie `public/` dans `dist/` — à
vérifier, les dotfiles sont parfois capricieux) :

```apache
RewriteEngine On

RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Fallback SPA — inutile une fois en HTML/PHP multi-pages
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [L]

<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript image/svg+xml
</IfModule>

<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType text/html "access plus 0 seconds"
</IfModule>
```

Secrets GitHub à créer : `LWS_FTP_HOST`, `LWS_FTP_USER`, `LWS_FTP_PASSWORD`
(+ `GEDEON_API_KEY` le jour venu). `server-dir` = `/www/` sur du mutualisé LWS,
parfois `/htdocs/` — à confirmer par une connexion FTP manuelle.

Si c'est un vrai VPS et pas du mutualisé : remplacer le FTP par du `rsync` over
SSH, plus rapide et plus sûr.

---

## 9. Bloquants

1. ~~Accès macOS à `~/Documents`~~ — **levé**, lecture/écriture OK.
2. **Accès LWS perdus** — à retrouver. Bloque uniquement la mise en ligne.
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
