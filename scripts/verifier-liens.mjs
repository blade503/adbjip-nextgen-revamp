#!/usr/bin/env node
/**
 * Contrôle des liens d'un site déployé.
 *
 *   node scripts/verifier-liens.mjs https://preprod.adbjip.fr
 *
 * Le repli monopage renvoie 200 pour n'importe quelle URL : un simple contrôle
 * de code HTTP ne prouve donc rien. On compare les liens aux routes réellement
 * déclarées dans src/App.tsx, et on lit la page servie pour y repérer le 404 de
 * l'application.
 *
 * Signale aussi les liens qui ne mènent nulle part par construction — href="#",
 * href vide — et les ancres dont la cible n'existe pas dans la page.
 */

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const base = (process.argv[2] || 'https://preprod.adbjip.fr').replace(/\/$/, '');

const rouge = (t) => `\x1b[31m${t}\x1b[0m`;
const jaune = (t) => `\x1b[33m${t}\x1b[0m`;
const vert = (t) => `\x1b[32m${t}\x1b[0m`;
const gris = (t) => `\x1b[90m${t}\x1b[0m`;

const app = await readFile(path.join(ROOT, 'src', 'App.tsx'), 'utf8');
const routes = new Set(
  [...app.matchAll(/<Route\s+path="([^"]+)"/g)].map((m) => m[1]).filter((r) => r !== '*'),
);

const pages = [...routes];
const morts = [];
const externes = new Map();

const texteDuLien = (html, index) => {
  const fin = html.indexOf('</a>', index);
  return html
    .slice(index, fin === -1 ? index + 120 : fin)
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 48);
};

console.log(`\nContrôle des liens de ${base}\n`);

for (const page of pages) {
  const reponse = await fetch(`${base}${page}`);
  const html = await reponse.text();
  const problemes = [];

  const liens = [...html.matchAll(/<a\b[^>]*href="([^"]*)"[^>]*>/g)];

  for (const lien of liens) {
    const href = lien[1];
    const libelle = texteDuLien(html, lien.index) || gris('(sans texte)');

    if (href === '#' || href === '') {
      problemes.push({ href: href || '(vide)', libelle, raison: 'ne mène nulle part' });
      continue;
    }
    if (/^(mailto:|tel:|javascript:)/.test(href)) continue;

    if (href.startsWith('#')) {
      const id = href.slice(1);
      if (!html.includes(`id="${id}"`)) {
        problemes.push({ href, libelle, raison: 'ancre absente de la page' });
      }
      continue;
    }

    if (/^https?:\/\//.test(href)) {
      if (!href.startsWith(base)) {
        externes.set(href, (externes.get(href) || 0) + 1);
        continue;
      }
    }

    const [avantAncre, ancre] = href.replace(base, '').split('#');
    const chemin = avantAncre.split('?')[0].replace(/\/$/, '') || '/';

    if (routes.has(chemin)) {
      // Une ancre vers une autre page ne se voit pas à l'œil : la cible est
      // rendue ailleurs. C'est pourtant le cas le plus traître, le lien
      // « fonctionne » sans rien faire à l'écran.
      if (ancre) {
        const cible = await fetch(`${base}${chemin}`);
        const corpsCible = await cible.text();
        if (!corpsCible.includes(`id="${ancre}"`)) {
          problemes.push({ href, libelle, raison: `ancre #${ancre} absente de ${chemin}` });
        }
      }
      continue;
    }

    // Pas une route déclarée : la page servie est-elle le 404 de l'application ?
    const cible = await fetch(`${base}${chemin}`);
    const corps = await cible.text();
    const estQuatreCentQuatre = corps.includes('Page not found') || corps.includes('>404<');
    problemes.push({
      href,
      libelle,
      raison: estQuatreCentQuatre
        ? 'route inexistante, affiche la page 404'
        : `HTTP ${cible.status}, hors routes déclarées`,
    });
  }

  if (problemes.length) {
    console.log(`${rouge('✗')} ${page}`);
    for (const p of problemes) {
      console.log(`    ${jaune(p.href.padEnd(34))} ${p.raison}  ${gris(`« ${p.libelle} »`)}`);
      morts.push({ page, ...p });
    }
  } else {
    console.log(`${vert('✓')} ${page} ${gris(`${liens.length} liens`)}`);
  }
}

if (externes.size) {
  console.log(`\n${gris('Liens externes (non testés) :')}`);
  for (const [url, n] of externes) console.log(gris(`    ${url}${n > 1 ? ` ×${n}` : ''}`));
}

console.log(
  morts.length === 0
    ? `\n${vert('Aucun lien mort.')}\n`
    : `\n${rouge(`${morts.length} lien(s) à corriger.`)}\n`,
);
process.exit(morts.length === 0 ? 0 : 1);
