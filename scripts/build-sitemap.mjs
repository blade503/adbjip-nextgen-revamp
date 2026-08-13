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

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://www.adbjip.fr';

/** Pages volontairement absentes du sitemap. */
const EXCLUES = new Set(['*', '/mentions-legales']);

/** Priorité et fréquence par section, du plus commercial au plus statique. */
function metadonnees(route) {
  if (route === '/') return { priority: '1.0', changefreq: 'weekly' };
  if (route === '/biens') return { priority: '0.9', changefreq: 'daily' };
  if (route.startsWith('/services/')) return { priority: '0.8', changefreq: 'monthly' };
  if (route === '/contact') return { priority: '0.7', changefreq: 'monthly' };
  return { priority: '0.5', changefreq: 'yearly' };
}

const routesDepuisRouteur = (source) =>
  [...source.matchAll(/<Route\s+path="([^"]+)"/g)]
    .map((m) => m[1])
    .filter((route) => !EXCLUES.has(route));

async function main() {
  const app = await readFile(path.join(ROOT, 'src', 'App.tsx'), 'utf8');
  const routes = routesDepuisRouteur(app);
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

  const urls = routes
    .map((route) => {
      const { priority, changefreq } = metadonnees(route);
      const lastmod = route === '/biens' ? dateBiens : aujourdhui;
      return `  <url>
    <loc>${SITE}${route === '/' ? '/' : route}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
    })
    .join('\n');

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
}

main().catch((error) => {
  console.error(`[sitemap] ÉCHEC : ${error.message}`);
  process.exit(1);
});
