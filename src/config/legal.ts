/**
 * Identité légale, source unique pour les mentions obligatoires.
 *
 * Deux sociétés distinctes cohabitent à la même adresse, et se partagent les
 * métiers présentés sur le site — c'est pour cela que les mentions Hoguet sont
 * portées par entité et non par le site :
 *
 *  - J.I.P. — Jobard Immobilier Paris (SIREN 529 339 665, APE 68.32A,
 *    administration d'immeubles) : gestion locative et syndic. Éditeur du site.
 *  - Jobard Immobilier Patrimoine (SIREN 812 198 547, APE 68.31Z, agence
 *    immobilière) : transaction, achat-vente et estimation.
 *
 * Deux régimes se superposent :
 *  - LCEN (art. 6 III) pour tout site professionnel : éditeur, directeur de
 *    publication, hébergeur ;
 *  - loi Hoguet (loi 70-9 du 2 janvier 1970, décret 72-678) pour l'activité
 *    immobilière : carte professionnelle, garantie financière, RCP — plus le
 *    médiateur de la consommation (art. L612-1 du code de la consommation).
 *
 * Les champs à `null` sont **manquants et obligatoires** : ils s'affichent en
 * « à compléter » sur la page. Ne jamais les remplir au jugé — un numéro de
 * carte professionnelle inexact est plus grave que son absence. Chaque société
 * a sa propre carte : mention Gestion immobilière pour J.I.P., mention
 * Transaction pour Patrimoine ; leurs garants et assureurs peuvent différer.
 *
 * Ce qui est renseigné provient du registre national des entreprises
 * (recherche-entreprises.api.gouv.fr) — donc vérifiable.
 */

export interface Entite {
  raisonSociale: string;
  role: string;
  formeJuridique: string;
  /** Capital social. Figure sur les statuts. */
  capital: string | null;
  siren: string;
  siret: string;
  rcs: string;
  codeApe: string;
  activite: string;
  dateCreation: string;
  president: string;
  /** Numéro de TVA intracommunautaire, sur l'avis de situation SIRENE. */
  tva: string | null;
  carteProfessionnelle: {
    /** Numéro complet, ex. CPI 7501 2018 000 000 000. */
    numero: string | null;
    /** Chambre de commerce et d'industrie émettrice. */
    delivreePar: string | null;
    /** Mentions portées sur la carte. */
    mentions: string[];
  };
  garantieFinanciere: {
    organisme: string | null;
    adresse: string | null;
    montant: string | null;
  };
  assuranceRcp: {
    assureur: string | null;
    contrat: string | null;
    couvertureGeographique: string;
  };
}

/**
 * Horaires d'ouverture — source unique.
 *
 * Le site en affichait trois versions différentes au 14/08/2026 : 9h-19h en
 * pied de page, 9h-18h sur la page contact, 9h-17h sur la fiche Google. La
 * valeur retenue ici est celle que l'agence publie elle-même sur Google, la
 * plus prudente des trois : annoncer une fermeture plus tôt fait au pire venir
 * un client à l'heure, l'inverse lui fait trouver porte close.
 *
 * À FAIRE CONFIRMER par l'agence, puis aligner la fiche Google.
 */
export const HORAIRES = {
  semaine: 'Lun-Ven 9h-17h',
  detail: '9h - 17h',
  jours: 'Lundi au vendredi',
  samedi: 'Sur rendez-vous',
};

export const ADRESSE = {
  rue: '27, rue de Lisbonne',
  codePostal: '75008',
  ville: 'Paris',
  telephone: '01 42 25 78 24',
  email: 'j.immo.p@orange.fr',
};

export const ENTITES: Entite[] = [
  {
    raisonSociale: 'J.I.P. — Jobard Immobilier Paris',
    role: 'Gestion locative et syndic de copropriété — éditeur du site',
    formeJuridique: 'Société par actions simplifiée (SAS)',
    capital: null,
    siren: '529 339 665',
    siret: '529 339 665 00018',
    rcs: 'RCS Paris 529 339 665',
    codeApe: '68.32A',
    activite: 'Administration d’immeubles et autres biens immobiliers',
    dateCreation: '1er janvier 2011',
    president: 'Francis Jobard',
    tva: null,
    carteProfessionnelle: {
      numero: null,
      delivreePar: null,
      mentions: ['Gestion immobilière'],
    },
    garantieFinanciere: { organisme: null, adresse: null, montant: null },
    assuranceRcp: { assureur: null, contrat: null, couvertureGeographique: 'France' },
  },
  {
    raisonSociale: 'Jobard Immobilier Patrimoine',
    role: 'Transaction, achat-vente et estimation',
    formeJuridique: 'Société par actions simplifiée (SAS)',
    capital: null,
    siren: '812 198 547',
    siret: '812 198 547 00026',
    rcs: 'RCS Paris 812 198 547',
    codeApe: '68.31Z',
    activite: 'Agences immobilières',
    dateCreation: '17 juin 2015',
    president: 'Florent Jobard',
    tva: null,
    carteProfessionnelle: {
      numero: null,
      delivreePar: null,
      mentions: ['Transaction sur immeubles et fonds de commerce'],
    },
    garantieFinanciere: { organisme: null, adresse: null, montant: null },
    assuranceRcp: { assureur: null, contrat: null, couvertureGeographique: 'France' },
  },
];

/** L'éditeur au sens de la LCEN : la société qui publie le site. */
export const EDITEUR = ENTITES[0];

export const DIRECTEUR_PUBLICATION = 'Francis Jobard, président';

export const HEBERGEUR = {
  nom: 'LWS — Ligne Web Services',
  adresse: '10 rue Penthièvre, 75008 Paris',
  site: 'https://www.lws.fr',
};

/** Médiateur commun aux deux sociétés, à désigner s'il ne l'est pas encore. */
export const MEDIATEUR = {
  nom: null as string | null,
  site: null as string | null,
  adresse: null as string | null,
};

/** Vrai tant que des mentions obligatoires manquent — la page le signale. */
export const legalIsIncomplete =
  ENTITES.some(
    (entite) =>
      !entite.capital ||
      !entite.carteProfessionnelle.numero ||
      !entite.carteProfessionnelle.delivreePar ||
      !entite.garantieFinanciere.organisme ||
      !entite.garantieFinanciere.montant ||
      !entite.assuranceRcp.assureur,
  ) || !MEDIATEUR.nom;
