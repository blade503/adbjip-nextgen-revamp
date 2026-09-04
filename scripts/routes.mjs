/**
 * Les routes du site, telles que les scripts de build les voient.
 *
 * Trois scripts lisaient chacun `src/App.tsx` avec la même expression
 * régulière (`prerender`, `build-sitemap`, `verifier-liens`). Depuis la fiche
 * bien (`/biens/:slug`, 04/09/2026), une route peut porter un paramètre, et
 * une expression régulière seule produirait une page littérale
 * `dist/biens/:slug/index.html`. La résolution vit donc à un seul endroit.
 *
 * Le paramètre `:slug` se remplit depuis `data/biens.json` — la même donnée
 * que la page lit à la compilation. Les slugs y sont écrits par
 * `scripts/fetch-biens.mjs` : ils ne contiennent que des caractères sûrs pour
 * un nom de dossier.
 */

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** Les routes déclarées dans le routeur, paramètres non résolus, sans le `*`. */
export async function routesDeclarees() {
  const app = await readFile(path.join(ROOT, 'src', 'App.tsx'), 'utf8');
  return [...app.matchAll(/<Route\s+path="([^"]+)"/g)]
    .map((m) => m[1])
    .filter((route) => route !== '*');
}

/** Les slugs du portefeuille, ou une liste vide si les données manquent. */
export async function slugsDesBiens() {
  try {
    const data = JSON.parse(await readFile(path.join(ROOT, 'data', 'biens.json'), 'utf8'));
    return (data.biens || []).map((bien) => bien.slug).filter(Boolean);
  } catch {
    return [];
  }
}

/**
 * Les routes RÉELLES : chaque `:slug` remplacé par les slugs du portefeuille.
 * Une route paramétrée sans donnée disparaît de la liste plutôt que d'être
 * rendue littéralement.
 */
export async function routesReelles() {
  const declarees = await routesDeclarees();
  const slugs = await slugsDesBiens();
  const reelles = [];
  for (const route of declarees) {
    if (!route.includes(':slug')) {
      reelles.push(route);
      continue;
    }
    for (const slug of slugs) reelles.push(route.replace(':slug', slug));
  }
  return reelles;
}
