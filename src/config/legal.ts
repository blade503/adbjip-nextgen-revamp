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
 * Horaires d'ouverture — source unique, repris de la fiche Google de l'agence
 * le 14/08/2026 : 9h-13h et 14h-17h, du lundi au vendredi.
 *
 * Le site en affichait deux versions contradictoires, toutes deux fausses :
 * 9h-19h en pied de page, 9h-18h sur la page contact. Aucune ne mentionnait la
 * fermeture du midi — un visiteur qui se présente à 13h30 trouvait porte close.
 *
 * La fiche Google fait foi ici : c'est elle que les clients consultent en
 * premier, et c'est l'agence qui la tient à jour.
 */
export const HORAIRES = {
  semaine: 'Lun-Ven 9h-13h / 14h-17h',
  detail: '9h - 13h · 14h - 17h',
  jours: 'Lundi au vendredi',
  /** Rien le samedi : l'agence n'ouvre que du lundi au vendredi. */
  samedi: null as string | null,
  /** Format schema.org, pour les données structurées et la fiche Google. */
  schemaOrg: ['Mo-Fr 09:00-13:00', 'Mo-Fr 14:00-17:00'],
};

export const ADRESSE = {
  rue: '27, rue de Lisbonne',
  codePostal: '75008',
  ville: 'Paris',
  telephone: '01 42 25 78 24',
  email: 'j.immo.p@orange.fr',
  /** Repris de la section de conversion : la ligne 3 dessert les deux stations. */
  metro: 'Métro Villiers ou Europe, ligne 3',
};

/**
 * L'extranet Gercop — « Espace client » dans l'en-tête et sur la page syndic.
 *
 * L'URL est relevée sur le site en production (www.adbjip.fr, 04/09/2026), où
 * elle est liée sous le libellé « Moi et JIP » dans le menu et six fois dans
 * les pages. Si elle passe à `null`, le lien disparaît partout d'un coup : un
 * « Espace client » qui mènerait à une adresse inventée ferait perdre confiance
 * au copropriétaire qui clique.
 */
export const ESPACE_CLIENT = {
  libelle: 'Espace client',
  url: 'https://jobardimmobilier.gercop-extranet.com/' as string | null,
};

/**
 * Les deux interlocuteurs de l'agence — repris de l'ancienne page « Équipe »
 * (fusionnée dans « L'agence » le 04/09/2026), mot pour mot : noms, lignes
 * directes, courriels, descriptions — et recoupés avec la page contact du site
 * en production (www.adbjip.fr/about, 04/09/2026), qui donne les mêmes numéros
 * et les deux boîtes de service `gerance@` et `copro@adbjip.fr`. Le
 * rattachement à une société et le rôle légal viennent de `ENTITES` (registre
 * national), pas d'ici.
 *
 * Deux autres profils avaient été inventés puis retirés en 2026 : la liste ne
 * contient que les personnes réellement présentes. À compléter par l'agence,
 * pas par le code.
 */
export const EQUIPE = [
  {
    nom: 'Francis Jobard',
    metier: 'Gérance & syndic',
    telephone: ADRESSE.telephone,
    email: 'copro@adbjip.fr',
    description:
      'Suit personnellement les copropriétés : assemblées générales, travaux, comptes.',
    /** Index dans `ENTITES` : J.I.P. — Jobard Immobilier Paris. */
    entite: 0,
  },
  {
    nom: 'Florent Jobard',
    metier: 'Transaction & estimation',
    telephone: '06 62 91 73 35',
    email: ADRESSE.email,
    description: "Porte la transaction, l'achat-vente et l'estimation.",
    /** Index dans `ENTITES` : Jobard Immobilier Patrimoine. */
    entite: 1,
  },
];

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
