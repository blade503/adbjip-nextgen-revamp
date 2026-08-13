#!/usr/bin/env node
/**
 * Récupère le portefeuille d'annonces, le normalise vers data/biens.json et
 * rapatrie les photos en trois variantes dans public/biens/.
 *
 * Deux sources derrière la même sortie :
 *   SOURCE=bienici (défaut) — endpoint public, sans clé
 *   SOURCE=gedeon           — API officielle, nécessite GEDEON_KEY
 *
 * En cas d'échec réseau, le jeu de données précédent est conservé et le script
 * sort en 0 : la page /biens ne se vide jamais.
 *
 * Variables d'environnement :
 *   SOURCE      bienici | gedeon        (défaut: bienici)
 *   GEDEON_KEY  clé API Gédéon          (requis si SOURCE=gedeon)
 *   FORCE=1     retélécharge les photos déjà présentes
 */

import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA_FILE = path.join(ROOT, 'data', 'biens.json');
const PHOTO_DIR = path.join(ROOT, 'public', 'biens');

const SOURCE = process.env.SOURCE || 'bienici';
const FORCE = process.env.FORCE === '1';

const AGENCY_ID = 'gedeon-JOBARD-PARIS-75008';
const USER_AGENT = 'adbjip-sync/1.0 (+https://www.adbjip.fr)';

/** Les trois variantes générées pour chaque photo. `w` seul = pas de recadrage. */
const VARIANTS = [
  { key: 'small', w: 400, h: 300 },
  { key: 'medium', w: 800, h: 600 },
  { key: 'large', w: 1200, h: null },
];

// ---------------------------------------------------------------- utilitaires

const log = (...args) => console.log('[fetch-biens]', ...args);

async function fetchWithRetry(url, { tries = 3, json = true } = {}) {
  let lastError;
  for (let attempt = 1; attempt <= tries; attempt += 1) {
    try {
      const res = await fetch(url, { headers: { 'user-agent': USER_AGENT } });
      if (!res.ok) throw new Error(`HTTP ${res.status} sur ${url}`);
      return json ? await res.json() : Buffer.from(await res.arrayBuffer());
    } catch (error) {
      lastError = error;
      if (attempt < tries) {
        await new Promise((r) => setTimeout(r, 500 * attempt));
      }
    }
  }
  throw lastError;
}

function slugify(value) {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Nom de fichier sûr : les références client contiennent parfois des espaces. */
const refSlug = (reference) => slugify(reference) || 'sans-ref';

/**
 * Bien'ici renvoie « 1970-01-01T00:00:00.000Z » quand la date de publication
 * est absente — au 13/08/2026, sur 4 annonces du portefeuille sur 5. Propagée
 * telle quelle, cette date d'époque fausserait tri et ancienneté : on la
 * traite comme ce qu'elle est, une valeur manquante.
 */
function isoDate(value) {
  if (!value) return null;
  const time = new Date(value).getTime();
  if (Number.isNaN(time)) return null;
  return time <= new Date('1971-01-01').getTime() ? null : new Date(time).toISOString();
}

// ------------------------------------------------------------- normalisation

const PROPERTY_LABELS = {
  flat: 'Appartement',
  house: 'Maison',
  parking: 'Parking',
  loft: 'Loft',
  townhouse: 'Hôtel particulier',
  castle: 'Château',
  building: 'Immeuble',
  terrain: 'Terrain',
  shop: 'Local commercial',
  premises: 'Local',
  office: 'Bureau',
  annexe: 'Annexe',
  others: 'Bien',
};

const FEES_CHARGED_TO = {
  purchaser: 'acquéreur',
  seller: 'vendeur',
  both: 'acquéreur et vendeur',
};

/**
 * Titre de secours : une partie du portefeuille remonte avec un titre vide
 * (réf. 012 au 13/08/2026). On ne publie jamais une annonce sans intitulé.
 */
function fallbackTitle(ad) {
  const type = PROPERTY_LABELS[ad.propertyType] || 'Bien';
  const rooms = ad.roomsQuantity ? ` ${ad.roomsQuantity} pièces` : '';
  return `${type}${rooms} — ${ad.city || 'Paris'}`;
}

function normalizeBienici(ad) {
  const transaction = ad.adType === 'rent' ? 'location' : 'vente';
  const title = (ad.title || '').trim() || fallbackTitle(ad);

  return {
    id: ad.id,
    reference: ad.reference || ad.id,
    slug: `${refSlug(ad.reference || ad.id)}-${slugify(title)}`.slice(0, 80),
    transaction,
    propertyType: ad.propertyType,
    propertyLabel: PROPERTY_LABELS[ad.propertyType] || 'Bien',
    title,
    /** Titre absent à la source : à signaler au client, pas à masquer. */
    titleIsFallback: !(ad.title || '').trim(),
    description: (ad.description || '').trim(),

    city: ad.city || '',
    postalCode: ad.postalCode || '',
    district: ad.district?.libelle || '',
    departmentCode: ad.departmentCode || '',

    price: ad.price ?? null,
    priceWithoutFees: ad.priceWithoutFees ?? null,
    pricePerSquareMeter: ad.pricePerSquareMeter ? Math.round(ad.pricePerSquareMeter) : null,
    feePercentage: ad.agencyFeePercentage ?? null,
    feesChargedTo: FEES_CHARGED_TO[ad.feesChargedTo] || null,
    charges: ad.charges ?? null,
    safetyDeposit: ad.safetyDeposit ?? null,
    agencyRentalFee: ad.agencyRentalFee ?? null,
    annualCondominiumFees: ad.annualCondominiumFees ?? null,

    surface: ad.surfaceArea ?? null,
    rooms: ad.roomsQuantity ?? null,
    bedrooms: ad.bedroomsQuantity ?? null,
    floor: ad.floor ?? null,
    floorQuantity: ad.floorQuantity ?? null,
    exposition: ad.exposition || null,
    heating: ad.heating || null,

    features: {
      elevator: !!ad.hasElevator,
      cellar: !!ad.hasCellar,
      balcony: !!ad.hasBalcony,
      terrace: !!ad.hasTerrace,
      fireplace: !!ad.hasFirePlace,
      caretaker: !!ad.hasCaretaker,
      separateToilet: !!ad.hasSeparateToilet,
      inCondominium: !!ad.isInCondominium,
      parkingPlaces: ad.parkingPlacesQuantity ?? 0,
    },

    // Mentions copropriété obligatoires (art. 54 loi ALUR) : nombre de lots et
    // montant annuel des charges. Absents de la source pour une partie du
    // portefeuille — l'affichage s'adapte plutôt que d'inventer une valeur.
    condominiumParts: ad.condominiumPartsQuantity ?? null,

    dpe: {
      energyValue: ad.energyValue ?? null,
      energyClass: ad.energyClassification || null,
      gesValue: ad.greenhouseGazValue ?? null,
      gesClass: ad.greenhouseGazClassification || null,
      date: ad.energyPerformanceDiagnosticDate || null,
      minEnergyConsumption: ad.minEnergyConsumption ?? null,
      maxEnergyConsumption: ad.maxEnergyConsumption ?? null,
      isJuly2021: !!ad.useJuly2021EnergyPerformanceDiagnostic,
    },

    photos: (ad.photos || [])
      // url_photo (Studio-Net) accepte les paramètres de redimensionnement,
      // url (CDN Bien'ici) les ignore et sert l'original.
      .map((photo) => photo.url_photo)
      .filter(Boolean),

    publicationDate: isoDate(ad.publicationDate),
    modificationDate: isoDate(ad.modificationDate),
  };
}

/**
 * Gédéon renvoie un schéma différent de Bien'ici. Branche NON TESTÉE : pas de
 * clé API à ce jour. Le mapping suit la doc https://api.gedeon.im/doc et doit
 * être revalidé contre une réponse réelle avant mise en production.
 */
function normalizeGedeon(ad) {
  const transaction = ad.transaction === 'rent' ? 'location' : 'vente';
  const title = (ad.title || '').trim() || fallbackTitle({
    propertyType: ad.type,
    roomsQuantity: ad.rooms,
    city: ad.city,
  });

  return {
    id: `gedeon-${ad.id}`,
    reference: ad.reference || String(ad.id),
    slug: `${refSlug(ad.reference || ad.id)}-${slugify(title)}`.slice(0, 80),
    transaction,
    propertyType: ad.type || null,
    propertyLabel: PROPERTY_LABELS[ad.type] || 'Bien',
    title,
    titleIsFallback: !(ad.title || '').trim(),
    description: (ad.description || '').trim(),

    city: ad.city || '',
    postalCode: ad.zipcode || '',
    district: ad.district || '',
    departmentCode: String(ad.zipcode || '').slice(0, 2),

    price: ad.price ?? null,
    priceWithoutFees: ad.price_without_fees ?? null,
    pricePerSquareMeter: null,
    feePercentage: ad.fees_percentage ?? null,
    feesChargedTo: FEES_CHARGED_TO[ad.fees_charged_to] || null,
    charges: ad.charges ?? null,
    safetyDeposit: ad.deposit ?? null,
    agencyRentalFee: ad.rental_fees ?? null,
    annualCondominiumFees: ad.condominium_fees ?? null,

    surface: ad.surface ?? null,
    rooms: ad.rooms ?? null,
    bedrooms: ad.bedrooms ?? null,
    floor: ad.floor ?? null,
    floorQuantity: null,
    exposition: null,
    heating: ad.heating || null,

    features: {
      elevator: !!ad.elevator,
      cellar: !!ad.cellar,
      balcony: !!ad.balcony,
      terrace: !!ad.terrace,
      fireplace: !!ad.fireplace,
      caretaker: !!ad.caretaker,
      separateToilet: false,
      inCondominium: !!ad.condominium,
      parkingPlaces: ad.parking ?? 0,
    },

    dpe: {
      energyValue: ad.dpe_value ?? null,
      energyClass: ad.dpe ?? null,
      gesValue: ad.ges_value ?? null,
      gesClass: ad.ges ?? null,
      date: ad.dpe_date || null,
      minEnergyConsumption: null,
      maxEnergyConsumption: null,
    },

    photos: (ad.photos || []).map((p) => p.url || p.url_photo).filter(Boolean),

    publicationDate: isoDate(ad.created_at),
    modificationDate: isoDate(ad.updated_at),
  };
}

// ------------------------------------------------------------------- sources

async function fetchFromBienici() {
  const filters = {
    author: AGENCY_ID,
    onTheMarket: [true],
    size: 100,
    sortBy: 'publicationDate',
    sortOrder: 'desc',
  };
  const url = `https://www.bienici.com/realEstateAds-agencyads.json?filters=${encodeURIComponent(
    JSON.stringify(filters),
  )}`;

  const payload = await fetchWithRetry(url);
  const ads = payload.realEstateAds || [];
  log(`Bien'ici : ${ads.length} annonce(s) sur ${payload.total ?? ads.length} annoncée(s)`);
  return ads.map(normalizeBienici);
}

async function fetchFromGedeon() {
  const key = process.env.GEDEON_KEY;
  if (!key) throw new Error('SOURCE=gedeon mais GEDEON_KEY est absent');

  const all = [];
  const limit = 100;
  let offset = 0;
  let total = Infinity;

  // Pagination obligatoire côté Gédéon, 100 résultats maximum par page.
  while (offset < total) {
    const url =
      `https://api.gedeon.im/ads?key=${encodeURIComponent(key)}` +
      `&limit=${limit}&offset=${offset}&lang=fr_FR&transaction=sell,rent`;
    const page = await fetchWithRetry(url);
    const ads = page.results || page.ads || [];
    total = page.total_results ?? ads.length;
    all.push(...ads);
    if (!ads.length) break;
    offset += limit;
  }

  log(`Gédéon : ${all.length} annonce(s)`);
  return all.map(normalizeGedeon);
}

// -------------------------------------------------------------------- photos

/**
 * Le portefeuille contient des PNG malgré la doc. Redimensionner un PNG le fait
 * grossir (572 Ko → 1 Mo) ; format=jpg ramène la même image à ~116 Ko.
 * quality et format ne sont pas documentés mais sont indispensables.
 */
function photoUrl(base, variant) {
  const params = new URLSearchParams({ width: String(variant.w) });
  if (variant.h) {
    params.set('height', String(variant.h));
    // width + height sans func=cover : redimensionnement proportionnel, les
    // photos portrait cassent la grille. Avec cover, sortie au ratio exact.
    params.set('func', 'cover');
  }
  params.set('format', 'jpg');
  params.set('quality', '75');
  return `${base}?${params.toString()}`;
}

async function downloadPhotos(biens) {
  await mkdir(PHOTO_DIR, { recursive: true });
  const expected = new Set();
  let downloaded = 0;
  let skipped = 0;

  for (const bien of biens) {
    const sources = bien.photos;
    const photos = [];

    for (const [index, base] of sources.entries()) {
      const entry = { alt: `${bien.title} — photo ${index + 1}` };

      for (const variant of VARIANTS) {
        const name = `${refSlug(bien.reference)}-${index + 1}-${variant.key}.jpg`;
        const dest = path.join(PHOTO_DIR, name);
        expected.add(name);
        entry[variant.key] = `/biens/${name}`;

        if (!FORCE && existsSync(dest)) {
          skipped += 1;
          continue;
        }
        const buffer = await fetchWithRetry(photoUrl(base, variant), { json: false });
        await writeFile(dest, buffer);
        downloaded += 1;
      }
      photos.push(entry);
    }

    bien.photos = photos;
    Object.assign(bien, await downloadDpeBadges(bien, expected));
  }

  await pruneOrphans(expected);
  log(`Photos : ${downloaded} téléchargée(s), ${skipped} déjà à jour`);
}

/**
 * Les badges attendent les valeurs chiffrées (energyValue / greenhouseGazValue),
 * pas les lettres A–G, sinon 422. `date` est obligatoire.
 */
async function downloadDpeBadges(bien, expected) {
  const { energyValue, gesValue, date } = bien.dpe;
  if (energyValue == null || gesValue == null || !date) return {};

  const query = `dpe=${energyValue}&ges=${gesValue}&date=${date}`;
  const badges = {};

  for (const kind of ['dpe', 'ges']) {
    const name = `${refSlug(bien.reference)}-${kind}.svg`;
    const dest = path.join(PHOTO_DIR, name);
    expected.add(name);
    if (FORCE || !existsSync(dest)) {
      try {
        const svg = await fetchWithRetry(`https://dpe.gedeon.im/badge/${kind}?${query}`, {
          json: false,
        });
        await writeFile(dest, svg);
      } catch (error) {
        log(`badge ${kind} indisponible pour ${bien.reference} : ${error.message}`);
        continue;
      }
    }
    badges[`${kind}Badge`] = `/biens/${name}`;
  }

  return { badges };
}

/** Retire les fichiers des annonces sorties du portefeuille. */
async function pruneOrphans(expected) {
  if (!existsSync(PHOTO_DIR)) return;
  const files = await readdir(PHOTO_DIR);
  let removed = 0;
  for (const file of files) {
    if (expected.has(file)) continue;
    if (!/\.(jpg|svg)$/i.test(file)) continue;
    await rm(path.join(PHOTO_DIR, file));
    removed += 1;
  }
  if (removed) log(`${removed} fichier(s) orphelin(s) supprimé(s)`);
}

// ------------------------------------------------------------------ contrôles

/**
 * Le taux d'honoraires est réglementé et se calcule sur le prix hors
 * honoraires. Un écart entre le taux déclaré et le taux réel est signalé, pas
 * corrigé en silence : la source doit être rectifiée côté agence.
 */
function auditFees(biens) {
  for (const bien of biens) {
    if (bien.transaction !== 'vente') continue;
    if (!bien.price || !bien.priceWithoutFees || bien.feePercentage == null) continue;

    const actual = ((bien.price - bien.priceWithoutFees) / bien.priceWithoutFees) * 100;
    if (Math.abs(actual - bien.feePercentage) > 0.1) {
      log(
        `⚠ réf. ${bien.reference} : honoraires déclarés ${bien.feePercentage.toFixed(2)} %, ` +
          `calculés ${actual.toFixed(2)} % — à faire corriger côté agence`,
      );
    }
    if (bien.titleIsFallback) {
      log(`⚠ réf. ${bien.reference} : titre vide à la source, titre de secours utilisé`);
    }
  }
}

// ---------------------------------------------------------------------- diff

async function readPrevious() {
  if (!existsSync(DATA_FILE)) return null;
  try {
    return JSON.parse(await readFile(DATA_FILE, 'utf8'));
  } catch (error) {
    log(`data/biens.json illisible (${error.message}) — comparaison ignorée`);
    return null;
  }
}

/**
 * Compare le portefeuille au jeu précédent pour dater l'entrée de chaque
 * annonce et repérer les changements de prix.
 *
 * `firstSeenAt` retombe sur la date de publication de la source au premier
 * passage : sans cela, un dépôt fraîchement initialisé afficherait « Nouveau »
 * sur la totalité du portefeuille. Le tag lui-même se calcule à l'affichage
 * (src/lib/biens.ts), pas ici — une date reste vraie, un booléen périme.
 */
function diffAgainstPrevious(biens, previous) {
  const before = new Map((previous?.biens ?? []).map((bien) => [bien.id, bien]));
  const now = new Date().toISOString();
  const added = [];
  const priceChanges = [];

  for (const bien of biens) {
    const old = before.get(bien.id);

    if (!old) {
      // Sans date de publication exploitable et sans jeu précédent, l'ancienneté
      // est inconnue : on laisse firstSeenAt vide plutôt que de dater l'annonce
      // d'aujourd'hui, ce qui la ferait passer pour nouvelle à tort. Une annonce
      // qui apparaît alors qu'un historique existe, elle, est bien nouvelle.
      bien.firstSeenAt = bien.publicationDate ?? (previous ? now : undefined);
      if (previous) added.push(bien.reference);
    } else {
      bien.firstSeenAt = old.firstSeenAt ?? bien.publicationDate ?? undefined;
    }

    if (old && old.price != null && bien.price != null && old.price !== bien.price) {
      bien.previousPrice = old.price;
      bien.priceChangedAt = now;
      priceChanges.push(
        `${bien.reference} ${old.price.toLocaleString('fr-FR')} € → ` +
          `${bien.price.toLocaleString('fr-FR')} €`,
      );
    } else if (old?.previousPrice != null && old.price === bien.price) {
      // Prix stable depuis la dernière variation : on garde l'historique.
      bien.previousPrice = old.previousPrice;
      bien.priceChangedAt = old.priceChangedAt;
    }

    before.delete(bien.id);
  }

  const removed = [...before.values()].map((bien) => bien.reference);

  const undated = biens.filter((bien) => !bien.publicationDate).map((bien) => bien.reference);
  if (undated.length) {
    log(`⚠ date de publication absente à la source : ${undated.join(', ')}`);
  }

  if (added.length) log(`+ ${added.length} annonce(s) : ${added.join(', ')}`);
  if (removed.length) log(`- ${removed.length} annonce(s) retirée(s) : ${removed.join(', ')}`);
  for (const change of priceChanges) log(`~ prix ${change}`);
  if (previous && !added.length && !removed.length && !priceChanges.length) {
    log('portefeuille inchangé depuis la dernière synchro');
  }
}

/** Clé de tri : entrée au portefeuille, sinon publication, sinon modification. */
const sortKey = (bien) =>
  bien.firstSeenAt || bien.publicationDate || bien.modificationDate || '';

// --------------------------------------------------------------------- entrée

async function main() {
  const fetchers = { bienici: fetchFromBienici, gedeon: fetchFromGedeon };
  const fetcher = fetchers[SOURCE];
  if (!fetcher) throw new Error(`SOURCE inconnue : ${SOURCE}`);

  log(`source : ${SOURCE}`);
  const previous = await readPrevious();
  const biens = await fetcher();
  if (!biens.length) throw new Error('0 annonce retournée — jeu précédent conservé');

  diffAgainstPrevious(biens, previous);
  await downloadPhotos(biens);
  auditFees(biens);

  const payload = {
    source: SOURCE,
    generatedAt: new Date().toISOString(),
    count: biens.length,
    // Les plus récentes d'abord. La source ne datant pas toujours la
    // publication, on retombe sur la dernière modification.
    biens: biens.sort((a, b) => sortKey(b).localeCompare(sortKey(a))),
  };

  await mkdir(path.dirname(DATA_FILE), { recursive: true });
  await writeFile(DATA_FILE, `${JSON.stringify(payload, null, 2)}\n`);
  log(`data/biens.json écrit — ${biens.length} annonce(s)`);
}

main().catch(async (error) => {
  log(`ÉCHEC : ${error.message}`);
  if (existsSync(DATA_FILE)) {
    const previous = JSON.parse(await readFile(DATA_FILE, 'utf8'));
    log(`jeu précédent conservé (${previous.count} annonce(s), ${previous.generatedAt})`);
    process.exit(0);
  }
  log('aucun jeu précédent sur disque — sortie en erreur');
  process.exit(1);
});
