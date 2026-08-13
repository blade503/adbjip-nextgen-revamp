/**
 * Accès au portefeuille d'annonces.
 *
 * `data/biens.json` est produit par `scripts/fetch-biens.mjs` depuis la source
 * de l'agence (Bien'ici aujourd'hui, Gédéon à terme) et rafraîchi chaque nuit
 * par le workflow `sync-biens`. Les photos correspondantes vivent dans
 * `public/biens/`, donc servies à la racine du site.
 *
 * Rien n'est saisi à la main ici : toute correction de contenu se fait dans le
 * logiciel de gestion de l'agence, pas dans le code.
 */

import portfolio from '@data/biens.json';

export interface BienPhoto {
  small: string;
  medium: string;
  large: string;
  alt: string;
}

export interface Bien {
  id: string;
  reference: string;
  slug: string;
  transaction: 'vente' | 'location';
  propertyType: string;
  propertyLabel: string;
  title: string;
  /** Titre absent à la source, remplacé par un intitulé de secours. */
  titleIsFallback: boolean;
  description: string;
  city: string;
  postalCode: string;
  district: string;
  price: number | null;
  priceWithoutFees: number | null;
  pricePerSquareMeter: number | null;
  feePercentage: number | null;
  feesChargedTo: string | null;
  charges: number | null;
  safetyDeposit: number | null;
  agencyRentalFee: number | null;
  annualCondominiumFees: number | null;
  condominiumParts: number | null;
  surface: number | null;
  rooms: number | null;
  bedrooms: number | null;
  floor: number | null;
  features: {
    elevator: boolean;
    cellar: boolean;
    balcony: boolean;
    terrace: boolean;
    fireplace: boolean;
    caretaker: boolean;
    separateToilet: boolean;
    inCondominium: boolean;
    parkingPlaces: number;
  };
  dpe: {
    energyValue: number | null;
    energyClass: string | null;
    gesValue: number | null;
    gesClass: string | null;
    date: string | null;
    minEnergyConsumption: number | null;
    maxEnergyConsumption: number | null;
  };
  photos: BienPhoto[];
  badges?: { dpeBadge?: string; gesBadge?: string };
  publicationDate: string | null;
  modificationDate: string | null;
  /** Date d'entrée au portefeuille, calculée par diff dans fetch-biens.mjs. */
  firstSeenAt?: string;
  /** Dernier prix connu avant la variation en cours, si elle a eu lieu. */
  previousPrice?: number;
  priceChangedAt?: string;
}

/**
 * Les chemins stockés dans data/biens.json sont absolus (« /biens/… ») car
 * écrits par un script Node, hors du bundler. Vite ne réécrit que les URL qu'il
 * voit passer : il faut donc leur appliquer le chemin de base à la main, sinon
 * les photos pointent à la racine du domaine — ce qui casse dès que le site
 * n'est pas servi à la racine, comme sur la préversion GitHub Pages.
 */
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
const asset = (chemin: string) => `${BASE}${chemin}`;

export const biens = (portfolio.biens as unknown as Bien[]).map((bien) => ({
  ...bien,
  photos: bien.photos.map((photo) => ({
    ...photo,
    small: asset(photo.small),
    medium: asset(photo.medium),
    large: asset(photo.large),
  })),
  badges: bien.badges && {
    dpeBadge: bien.badges.dpeBadge && asset(bien.badges.dpeBadge),
    gesBadge: bien.badges.gesBadge && asset(bien.badges.gesBadge),
  },
}));
export const generatedAt = portfolio.generatedAt as string;

export const ventes = biens.filter((bien) => bien.transaction === 'vente');
export const locations = biens.filter((bien) => bien.transaction === 'location');

export const cities = [...new Set(biens.map((bien) => bien.city).filter(Boolean))];

// ------------------------------------------------------------- fraîcheur

/** Durée pendant laquelle une annonce porte le tag « Nouveau ». */
export const NEW_WINDOW_DAYS = 21;

const DAY = 24 * 60 * 60 * 1000;

/**
 * Le tag se calcule à l'affichage et non à la synchro : une date reste vraie,
 * un booléen figé au build resterait « Nouveau » tant que personne ne
 * redéploie.
 */
export function isNew(bien: Bien, now = Date.now()): boolean {
  const since = bien.firstSeenAt ?? bien.publicationDate;
  if (!since) return false;
  const age = now - new Date(since).getTime();
  return age >= 0 && age < NEW_WINDOW_DAYS * DAY;
}

/** Baisse de prix constatée entre deux synchros, sinon null. */
export function priceDrop(bien: Bien): { amount: number; percent: number } | null {
  if (bien.previousPrice == null || bien.price == null) return null;
  if (bien.price >= bien.previousPrice) return null;
  const amount = bien.previousPrice - bien.price;
  return { amount, percent: (amount / bien.previousPrice) * 100 };
}

// ------------------------------------------------------------------ formatage

export const eur = (value: number) =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value);

/** Taux d'honoraires : 12 et non 12,00 — mais 5,41 reste 5,41. */
export const percent = (value: number) =>
  new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 }).format(value);

const num = (value: number) => new Intl.NumberFormat('fr-FR').format(value);

const plural = (count: number, word: string) => `${count} ${word}${count > 1 ? 's' : ''}`;

/** Sur les petites communes, la source répète la ville en guise de quartier. */
export const locationLabel = (bien: Bien) =>
  [...new Set([bien.city, bien.district].filter(Boolean).map((part) => part.trim()))].join(' · ');

/**
 * La source répète souvent le titre en première ligne de la description : on ne
 * la retire que si c'est effectivement le cas.
 */
export function descriptionLines(bien: Bien): string[] {
  const lines = bien.description
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines[0] && lines[0].toLowerCase() === bien.title.trim().toLowerCase()) lines.shift();
  return lines;
}

// -------------------------------------------------------------- mentions légales

/**
 * Mention courte affichée sous le prix. Le taux d'honoraires doit accompagner
 * le prix partout où celui-ci apparaît, pas seulement dans le détail.
 */
export function feeNote(bien: Bien): string {
  if (bien.transaction === 'location') {
    return bien.charges != null ? `+ ${eur(bien.charges)} de charges par mois` : '';
  }
  if (bien.feePercentage == null || !bien.feesChargedTo) return '';
  return `Honoraires ${percent(bien.feePercentage)} % TTC à la charge de l'${bien.feesChargedTo}`;
}

/**
 * Mentions réglementaires complètes (arrêté du 10 janvier 2017 pour la vente,
 * loi ALUR pour la location). Le taux affiché est celui de la source : rien
 * n'est recalculé en silence, les écarts sont signalés par fetch-biens.mjs.
 */
export function legalLines(bien: Bien): string[] {
  const lines: string[] = [];

  if (bien.transaction === 'location') {
    if (bien.price != null) {
      lines.push(`Loyer mensuel : ${eur(bien.price)}${bien.charges != null ? ' hors charges' : ''}.`);
    }
    if (bien.charges != null) {
      lines.push(`Provision mensuelle sur charges : ${eur(bien.charges)}, régularisation annuelle.`);
    }
    if (bien.safetyDeposit != null) lines.push(`Dépôt de garantie : ${eur(bien.safetyDeposit)}.`);
    if (bien.agencyRentalFee != null) {
      lines.push(
        `Honoraires de location à la charge du locataire : ${eur(bien.agencyRentalFee)} TTC, état des lieux inclus.`,
      );
    }
  } else {
    if (bien.price != null) lines.push(`Prix de vente : ${eur(bien.price)} honoraires inclus.`);
    if (bien.priceWithoutFees != null) {
      lines.push(`Prix hors honoraires : ${eur(bien.priceWithoutFees)}.`);
    }
    if (bien.feePercentage != null && bien.feesChargedTo) {
      lines.push(
        `Honoraires de ${percent(bien.feePercentage)} % TTC à la charge de l'${bien.feesChargedTo}, inclus dans le prix affiché.`,
      );
    }
    if (bien.features.inCondominium || bien.annualCondominiumFees != null) {
      const parts = ['Bien soumis au statut de la copropriété'];
      if (bien.condominiumParts != null) parts.push(plural(bien.condominiumParts, 'lot'));
      if (bien.annualCondominiumFees != null) {
        parts.push(`charges annuelles prévisionnelles ${eur(bien.annualCondominiumFees)}`);
      }
      lines.push(`${parts.join(', ')}.`);
    }
  }

  const { minEnergyConsumption: min, maxEnergyConsumption: max, date } = bien.dpe;
  if (min != null && max != null) {
    lines.push(
      `Montant estimé des dépenses annuelles d'énergie pour un usage standard : entre ${num(min)} € et ${num(max)} € par an` +
        (date ? ` (DPE réalisé le ${new Date(date).toLocaleDateString('fr-FR')})` : '') +
        '.',
    );
  }

  return lines;
}
