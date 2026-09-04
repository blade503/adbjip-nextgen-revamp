#!/usr/bin/env node
/**
 * Génère public/sitemap.xml et public/robots.txt depuis les routes réellement
 * déclarées dans src/App.tsx.
 *
 * Le sitemap précédent avait dérivé : il annonçait une page supprimée, en
 * oubliait deux autres, et pointait vers un domaine qui n'existe pas. Le lire
 * depuis le routeur évite que ça recommence — une route ajoutée sans sitemap
 * mis à jour n'est plus possible.
 *
 * Lancé automatiquement avant chaque build (script `prebuild`).
 */

import { execFile } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

import { routesReelles } from './routes.mjs';

const executer = promisify(execFile);

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://www.adbjip.fr';

/** Pages volontairement absentes du sitemap. */
const EXCLUES = new Set(['*', '/mentions-legales']);

/** Priorité et fréquence par section, du plus commercial au plus statique. */
function metadonnees(route) {
  if (route === '/') return { priority: '1.0', changefreq: 'weekly' };
  if (route === '/biens') return { priority: '0.9', changefreq: 'daily' };
  // Une fiche bien vit le temps de l'annonce : quotidienne, sous la liste.
  if (route.startsWith('/biens/')) return { priority: '0.7', changefreq: 'daily' };
  if (route.startsWith('/services/')) return { priority: '0.8', changefreq: 'monthly' };
  if (route === '/contact') return { priority: '0.7', changefreq: 'monthly' };
  return { priority: '0.5', changefreq: 'yearly' };
}

/** Les routes réelles (`:slug` résolu par `scripts/routes.mjs`), moins les exclues. */
const routesDuSitemap = async () => (await routesReelles()).filter((route) => !EXCLUES.has(route));

/**
 * Fichier source de chaque route, pour en tirer une date de modification qui
 * corresponde au contenu.
 *
 * Une route absente de cette table retombe sur la date du build : c'est le
 * comportement d'avant, gardé comme repli et non comme règle.
 */
const SOURCES = {
  '/': 'src/pages/Index.tsx',
  '/biens': 'src/pages/Biens.tsx',
  '/services/gestion-locative': 'src/pages/services/GestionLocative.tsx',
  '/services/gestion-copropriete': 'src/pages/services/GestionCopropriete.tsx',
  '/services/vendre-estimer': 'src/pages/services/VendreEstimer.tsx',
  '/agence': 'src/pages/About.tsx',
  '/contact': 'src/pages/Contact.tsx',
};

/**
 * Date du dernier commit touchant un fichier, en AAAA-MM-JJ.
 *
 * POURQUOI PAS LA DATE DU JOUR. `lastmod` annonce la dernière modification du
 * CONTENU. En la remplissant avec la date du build, chaque déploiement
 * déclarait les neuf pages modifiées le jour même, y compris celles que
 * personne n'avait touchées depuis des mois. Un sitemap qui crie « tout est
 * neuf » à chaque passage finit par être ignoré, et c'est documenté par Google.
 *
 * `%cs` est la date de commit courte, déjà au format ISO — pas de conversion,
 * donc pas de piège de fuseau horaire.
 *
 * PIÈGE EN INTÉGRATION CONTINUE : `actions/checkout` clone en profondeur 1 par
 * défaut. Un fichier non touché par l'unique commit récupéré ne renvoie alors
 * aucune date, et la fonction retombe silencieusement sur le jour du build. Le
 * décompte est journalisé pour que ce cas se voie dans la sortie du build au
 * lieu de passer inaperçu.
 */
async function dateDuDernierCommit(fichier) {
  try {
    const { stdout } = await executer('git', ['log', '-1', '--format=%cs', '--', fichier], {
      cwd: ROOT,
    });
    const date = stdout.trim();
    return /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : null;
  } catch {
    // Pas de git, ou pas un dépôt : le repli suffit.
    return null;
  }
}

async function main() {
  const routes = await routesDuSitemap();
  if (!routes.length) throw new Error('aucune route trouvée dans src/App.tsx');

  // Les annonces changent chaque nuit : leur date vient des données, pas du jour
  // du build, pour ne pas annoncer une fraîcheur qui n'existe pas.
  let dateBiens = new Date().toISOString().slice(0, 10);
  try {
    const data = JSON.parse(await readFile(path.join(ROOT, 'data', 'biens.json'), 'utf8'));
    dateBiens = data.generatedAt.slice(0, 10);
  } catch {
    // data/biens.json absent : on garde la date du jour.
  }
  const aujourdhui = new Date().toISOString().slice(0, 10);

  let sansDate = 0;
  const lignes = [];
  for (const route of routes) {
    const { priority, changefreq } = metadonnees(route);
    // /biens et les fiches tiennent leur date des données, pas du code : leur
    // contenu change chaque nuit sans qu'un fichier source bouge.
    let lastmod = dateBiens;
    if (route !== '/biens' && !route.startsWith('/biens/')) {
      const source = SOURCES[route];
      lastmod = (source && (await dateDuDernierCommit(source))) || aujourdhui;
      if (!source || lastmod === aujourdhui) sansDate += 1;
    }
    lignes.push(`  <url>
    <loc>${SITE}${route === '/' ? '/' : route}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`);
  }
  const urls = lignes.join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  const robots = `User-agent: *
Allow: /

Sitemap: ${SITE}/sitemap.xml

# Aspirateurs de contenu commercial, sans intérêt pour l'agence
User-agent: AhrefsBot
Disallow: /

User-agent: MJ12bot
Disallow: /

User-agent: DotBot
Disallow: /
`;

  await writeFile(path.join(ROOT, 'public', 'sitemap.xml'), sitemap);
  await writeFile(path.join(ROOT, 'public', 'robots.txt'), robots);
  console.log(`[sitemap] ${routes.length} URL : ${routes.join(', ')}`);
  if (sansDate) {
    console.log(
      `[sitemap] ⚠ ${sansDate} page(s) sans date de commit — repli sur la date du build. ` +
        `En intégration continue, augmenter fetch-depth d'actions/checkout.`,
    );
  }
}

main().catch((error) => {
  console.error(`[sitemap] ÉCHEC : ${error.message}`);
  process.exit(1);
});
