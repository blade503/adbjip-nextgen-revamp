#!/usr/bin/env node
/**
 * Prérendu des pages après le build.
 *
 * L'application est une SPA : le HTML servi ne contient qu'une div vide, et les
 * moteurs de recherche comme les aperçus de partage n'y voient rien. Ce script
 * ouvre chaque route dans Chrome, récupère le DOM une fois React monté, et
 * l'écrit dans dist/<route>/index.html. Le visiteur reçoit alors du contenu
 * immédiatement ; React reprend la main au chargement du bundle.
 *
 * Aucune dépendance ajoutée : on pilote le Chrome déjà installé via son option
 * --dump-dom. Si aucun binaire n'est trouvé, le script le signale et sort en 0
 * — un prérendu manquant ne doit jamais casser un déploiement.
 *
 * CHROME_PATH permet de forcer le binaire (utile en intégration continue).
 */

import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { routesReelles } from './routes.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const PORT = 8799;
/** Doit correspondre au base de Vite : les URL d'assets en dépendent. */
const BASE = (process.env.VITE_BASE || '/').replace(/\/$/, '');

const CANDIDATS_CHROME = [
  process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
].filter(Boolean);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
};

const log = (...args) => console.log('[prerender]', ...args);

/** Serveur statique avec repli SPA, à l'image de ce que fera Apache. */
function servirDist() {
  const serveur = createServer(async (req, res) => {
    let url = decodeURIComponent((req.url || '/').split('?')[0]);
    if (BASE && url.startsWith(BASE)) url = url.slice(BASE.length) || '/';
    const candidat = path.join(DIST, url);
    const fichier = existsSync(candidat) && path.extname(candidat) ? candidat : path.join(DIST, 'index.html');
    try {
      const contenu = await readFile(fichier);
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(fichier)] || 'application/octet-stream' });
      res.end(contenu);
    } catch {
      res.writeHead(404).end('introuvable');
    }
  });
  return new Promise((resolve) => serveur.listen(PORT, () => resolve(serveur)));
}

function rendre(chrome, url) {
  return new Promise((resolve, reject) => {
    const args = [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      '--virtual-time-budget=8000',
      '--dump-dom',
      url,
    ];
    const processus = spawn(chrome, args, { stdio: ['ignore', 'pipe', 'ignore'] });
    let sortie = '';
    processus.stdout.on('data', (morceau) => (sortie += morceau));
    processus.on('error', reject);
    processus.on('close', (code) =>
      code === 0 ? resolve(sortie) : reject(new Error(`Chrome a rendu le code ${code}`)),
    );
  });
}

async function main() {
  const chrome = CANDIDATS_CHROME.find((chemin) => existsSync(chemin));
  if (!chrome) {
    log('aucun Chrome trouvé — prérendu ignoré, le site reste fonctionnel mais non indexable');
    log('définir CHROME_PATH pour activer le prérendu (en intégration continue notamment)');
    return;
  }

  /**
   * Les routes réelles, `:slug` compris : `scripts/routes.mjs` remplace le
   * paramètre de la fiche bien par les slugs du portefeuille. Une fiche par
   * annonce est donc écrite dans `dist/biens/<slug>/index.html`, là où le
   * `.htaccess` la trouve.
   */
  const routes = await routesReelles();

  const serveur = await servirDist();
  let rendues = 0;

  for (const route of routes) {
    try {
      const html = await rendre(chrome, `http://localhost:${PORT}${BASE}${route}`);

      /**
       * TROIS CONTRÔLES, ET LE TROISIÈME EST LE PLUS UTILE.
       *
       * Le seuil de 2 000 octets attrape le rendu tronqué ou vide. Mais il ne
       * voit PAS le cas où React n'a jamais monté : le HTML de départ contient
       * déjà le <head> complet, les balises Open Graph et le JSON-LD, ce qui
       * dépasse largement le seuil. La page part alors avec un `#root` vide,
       * donc sans un mot de contenu, et rien ne le signale. Ce trou était
       * documenté dans `src/config/seo.ts` : le voici fermé.
       *
       * On garde l'original plutôt que d'écrire une page creuse. Pour `/`, cela
       * signifie conserver le `dist/index.html` de Vite ; pour une sous-route,
       * aucun fichier n'est écrit et le repli SPA (.htaccess) sert la coquille,
       * que le navigateur hydrate. Dans les deux cas le visiteur voit le site —
       * ce qui est perdu, c'est l'indexabilité, pas la page.
       */
      if (!html.includes('</body>') || html.length < 2000) {
        log(`⚠ ${route} : rendu trop court (${html.length} o), page ignorée`);
        continue;
      }
      if (/<div id="root">\s*<\/div>/.test(html)) {
        log(`⚠ ${route} : #root vide — React n'a pas monté, page ignorée`);
        continue;
      }
      /**
       * QUATRIÈME CONTRÔLE, ajouté avec le découpage des routes.
       *
       * Depuis que les pages sont en `React.lazy`, un prérendu trop court écrit
       * le REPLI de `<Suspense>` au lieu de la page. Ce HTML-là passe les trois
       * contrôles précédents : il fait 60 ko, il a un `</body>`, et son `#root`
       * n'est pas vide. Il ne contient simplement aucun contenu utile.
       *
       * Le marqueur est le texte du repli. S'il apparaît, augmenter
       * `--virtual-time-budget` dans `rendre()` — 8 000 ms suffisent aujourd'hui
       * pour les dix routes, vérifié.
       */
      if (html.includes('Chargement de la page')) {
        log(`⚠ ${route} : repli de Suspense capturé au lieu de la page, ignorée`);
        log(`  → augmenter --virtual-time-budget dans scripts/prerender.mjs`);
        continue;
      }
      const destination =
        route === '/' ? path.join(DIST, 'index.html') : path.join(DIST, route, 'index.html');
      await mkdir(path.dirname(destination), { recursive: true });
      await writeFile(destination, html);
      rendues += 1;
      log(`${route} → ${(html.length / 1024).toFixed(0)} ko`);
    } catch (error) {
      log(`⚠ ${route} : ${error.message}`);
    }
  }

  /**
   * LA PAGE 404, PRÉRENDUE À PART — ajoutée le 27/08/2026 avec le retrait du
   * repli SPA du `.htaccess`.
   *
   * Le catch-all `*` est exclu de la liste des routes : le prérendre sous son
   * propre chemin produirait un onzième dossier dans `dist/` et ferait mentir le
   * repère. Il est donc rendu depuis un chemin qui n'existe pas — n'importe
   * lequel atteint le catch-all — et écrit à la RACINE sous `404.html`, où
   * `ErrorDocument 404` d'Apache va le chercher.
   *
   * Elle est comptée séparément : le repère est « N/N routes », plus la 404,
   * N étant 8 pages fixes + une fiche par annonce du portefeuille.
   */
  let quatreCentQuatre = false;
  try {
    // Construit comme les autres routes — avec sa barre oblique. Sans elle et
    // `BASE` vide, l'URL devenait `localhost:8799__inexistant` : Chrome l'a
    // traitée comme une recherche et a rendu sa page de nouvel onglet, écrite
    // en 87 ko de HTML qui passait les trois contrôles.
    const html = await rendre(chrome, `http://localhost:${PORT}${BASE}/__inexistant`);
    // Le marqueur est le TITRE de la page, pas sa taille : la page de nouvel
    // onglet de Chrome faisait 87 ko et passait les contrôles génériques.
    if (
      html.length >= 2000 &&
      html.includes('</body>') &&
      !html.includes('Chargement de la page') &&
      html.includes('Page introuvable')
    ) {
      await writeFile(path.join(DIST, '404.html'), html);
      quatreCentQuatre = true;
      log(`404 → ${(html.length / 1024).toFixed(0)} ko`);
    } else {
      log('⚠ page 404 : rendu inutilisable, non écrite');
    }
  } catch (error) {
    log(`⚠ page 404 : ${error.message}`);
  }

  serveur.close();
  log(`${rendues}/${routes.length} page(s) prérendue(s)${quatreCentQuatre ? ' + la page 404' : ''}`);

  /**
   * SANS LA PAGE 404, LE SITE N'A PLUS DE FILET. Le repli SPA a été retiré du
   * `.htaccess` pour que les URL inconnues répondent un vrai 404 : c'est
   * `404.html` qui rend cette réponse lisible. Absente, Apache sert sa page
   * d'erreur par défaut — fonctionnelle, mais sans la charte ni le lien vers
   * l'accueil.
   */
  if (!quatreCentQuatre) {
    log('⚠ 404.html absente : les URL inconnues afficheront la page d\'erreur brute d\'Apache.');
  }

  /**
   * Le compte est le seul indicateur de santé du prérendu, et il passait
   * inaperçu : un build qui tombe de 10/10 à 0/10 sortait quand même en 0, avec
   * la même allure de succès. On ne change pas ce comportement — un prérendu
   * manquant ne doit toujours pas casser un déploiement — mais on le rend
   * impossible à manquer dans les journaux d'intégration continue.
   */
  if (rendues < routes.length) {
    log(
      `⚠ ${routes.length - rendues} page(s) NON prérendue(s) : ` +
        `elles seront servies par le repli SPA et resteront non indexables. ` +
        `Le repère sain de ce projet est ${routes.length}/${routes.length}.`,
    );
  }
}

main().catch((error) => {
  log(`ÉCHEC : ${error.message}`);
  process.exit(0);
});
