#!/usr/bin/env node
/**
 * Prépare une image pour le site : recadrage au ratio voulu, redimensionnement
 * et conversion en WebP.
 *
 *   node scripts/optimiser-image.mjs ~/Downloads/photo.jpeg hero-building 3:1 2400
 *   node scripts/optimiser-image.mjs ~/Downloads/photo.jpeg GestionLocative 3:2 1200
 *
 * Le recadrage est centré : c'est ce qui convient à la quasi-totalité des
 * images reçues, où le sujet est au milieu. Sinon, recadrer avant.
 *
 * Pourquoi ce script existe : le site est passé de 11 Mo à 1,2 Mo en
 * convertissant les illustrations. Une seule image ajoutée à la main en PNG ou
 * en JPEG de 4 Mo annule ce travail sans que personne ne s'en aperçoive.
 *
 * Nécessite cwebp (`brew install webp`).
 */

import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DESTINATION = path.join(ROOT, 'src', 'assets');

const [source, nom, ratio = '3:2', largeur = '1600'] = process.argv.slice(2);

if (!source || !nom) {
  console.error('usage : node scripts/optimiser-image.mjs <source> <nom> [ratio] [largeur]');
  process.exit(1);
}
if (!existsSync(source)) {
  console.error(`introuvable : ${source}`);
  process.exit(1);
}

const dimensions = (fichier) => {
  const sortie = execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', fichier], {
    encoding: 'utf8',
  });
  return {
    largeur: Number(sortie.match(/pixelWidth: (\d+)/)[1]),
    hauteur: Number(sortie.match(/pixelHeight: (\d+)/)[1]),
  };
};

const ko = (fichier) => `${Math.round(statSync(fichier).size / 1024)} Ko`;

const [rl, rh] = ratio.split(':').map(Number);
const src = dimensions(source);
const ratioVoulu = rl / rh;
const ratioSource = src.largeur / src.hauteur;

// Recadrage centré vers le ratio demandé : on rogne la dimension en excès.
const crop =
  ratioSource > ratioVoulu
    ? { l: Math.round(src.hauteur * ratioVoulu), h: src.hauteur }
    : { l: src.largeur, h: Math.round(src.largeur / ratioVoulu) };

const cible = path.join(DESTINATION, `${nom}.webp`);

execFileSync('cwebp', [
  '-q', '82',
  '-crop', String(Math.round((src.largeur - crop.l) / 2)), String(Math.round((src.hauteur - crop.h) / 2)), String(crop.l), String(crop.h),
  '-resize', String(largeur), '0',
  '-quiet',
  source,
  '-o', cible,
]);

console.log(
  `${path.basename(source)} (${src.largeur}×${src.hauteur}, ${ko(source)})\n` +
    `  → src/assets/${nom}.webp (${largeur}px, ratio ${ratio}, ${ko(cible)})`,
);
