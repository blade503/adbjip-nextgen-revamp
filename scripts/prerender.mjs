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

  const app = await readFile(path.join(ROOT, 'src', 'App.tsx'), 'utf8');
  const routes = [...app.matchAll(/<Route\s+path="([^"]+)"/g)]
    .map((m) => m[1])
    .filter((route) => route !== '*');

  const serveur = await servirDist();
  let rendues = 0;

  for (const route of routes) {
    try {
      const html = await rendre(chrome, `http://localhost:${PORT}${BASE}${route}`);
      // Un rendu vide signale un échec silencieux : mieux vaut garder le
      // index.html d'origine que d'écrire une page blanche.
      if (!html.includes('</body>') || html.length < 2000) {
        log(`⚠ ${route} : rendu trop court (${html.length} o), page ignorée`);
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

  serveur.close();
  log(`${rendues}/${routes.length} page(s) prérendue(s)`);
}

main().catch((error) => {
  log(`ÉCHEC : ${error.message}`);
  process.exit(0);
});
