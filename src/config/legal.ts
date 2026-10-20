/**
 * Identité légale, source unique pour les mentions obligatoires.
 *
 * UNE SEULE SOCIÉTÉ depuis le 20/10/2026 : Jobard Immobilier Patrimoine
 * (SIREN 812 198 547, APE 68.31Z, agence immobilière) porte tous les métiers
 * du site — gérance, syndic, transaction et estimation — et l'édite. J.I.P. —
 * Jobard Immobilier Paris (SIREN 529 339 665) est « amenée à disparaître »
 * (décision du client) : elle a quitté le site, et Francis Jobard avec elle.
 * Les mentions Hoguet restent portées par entité (`ENTITES`) : si une seconde
 * société revenait, il suffirait de la rajouter au tableau.
 *
 * La marque affichée est « Jobard Immobilier », sans « Paris » ni
 * « Patrimoine » — un flou voulu par le client. La raison sociale complète
 * n'apparaît qu'aux endroits légaux : mentions, pied de page, page agence.
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
 * carte professionnelle inexact est plus grave que son absence. La carte est
 * renseignée depuis le 20/10/2026, relevée sur la carte elle-même (photos du
 * client) : elle porte bien les trois activités — transaction, gestion,
 * syndic. Garant et assureur suivent le même jour, relevés sur la fiche de la
 * carte au registre de la CCI (PDF transmis par le client : le registre refuse
 * les requêtes automatiques). Le capital (10 000 €) est donné par le client le
 * même jour, la TVA aussi. Restent le numéro du contrat d'assurance — non
 * obligatoire, sa ligne ne s'affiche que renseignée — et le médiateur, section
 * retirée à la demande du client alors qu'il est obligatoire (voir
 * `MentionsLegales.tsx`).
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
    /** Date de délivrance, au verso de la carte. */
    delivreeLe: string | null;
    /** Fin de validité, au recto : la carte se renouvelle tous les trois ans. */
    valableJusquAu: string | null;
    /** Mentions portées sur la carte. */
    mentions: string[];
  };
  /**
   * Le garant, et UN MONTANT PAR ACTIVITÉ : la loi Hoguet garantit chaque
   * activité séparément, et la fiche de la CCI les donne ainsi.
   */
  garantieFinanciere: {
    organisme: string | null;
    adresse: string | null;
    montants: { activite: string; montant: string; precision?: string }[];
  };
  assuranceRcp: {
    assureur: string | null;
    adresse: string | null;
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
  // Typographie française : espace insécable avant l'unité, tiret demi-cadratin.
  detail: '9\u00a0h – 13\u00a0h · 14\u00a0h – 17\u00a0h',
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
  /* Espaces insécables : 258 occurrences du numéro dans le HTML livré pouvaient
     se couper en fin de ligne (relevé le 08/09/2026, vu sur l'écran de secours à
     390 px). Les `tel:` retirent tout ce qui n'est pas un chiffre, le JSON-LD
     aussi : seul l'affichage change. */
  telephone: '01\u00a042\u00a025\u00a078\u00a024',
  /* adbjip@gmail.com depuis le 15/10/2026 : « j.immo.p@orange.fr » barré par le
     client sur ses retours papier, la nouvelle adresse confirmée par écrit. */
  email: 'adbjip@gmail.com',
  /** Repris de la section de conversion : la ligne 3 dessert les deux stations.
      Miromesnil ajoutée par le client sur ses retours du 12/10/2026 ; ses
      lignes (9 et 13) sont celles du plan RATP. */
  metro: 'Métro Villiers ou Europe, ligne 3 · Miromesnil, lignes 9 et 13',
};

/**
 * L'extranet Gercop — « Espace client » dans l'en-tête et sur les pages syndic
 * et gérance (ouvert aux propriétaires aussi, client, 20/10/2026).
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
 * Les interlocuteurs de l'agence — repris de l'ancienne page « Équipe »
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
  /* Francis Jobard retiré le 20/10/2026 avec J.I.P., qu'il préside : « on peut
     l'enlever du site pour le moment » (client). Sa fiche portait la ligne de
     l'agence et copro@adbjip.fr ; son portrait reste dans `src/assets/`. */
  {
    nom: 'Florent Jobard',
    /* Les quatre métiers depuis le 20/10/2026 : Patrimoine « fait tout »,
       gérance et syndic compris (client). */
    metier: 'Gérance, syndic & transaction',
    /* Ligne directe et courriel barrés par le client le 12/10/2026 : la fiche
       n'affiche plus de coordonnée propre. */
    telephone: null,
    email: null,
    description:
      "Porte la gérance locative, le syndic de copropriété, la transaction et l'estimation.",
    /** Index dans `ENTITES` : Jobard Immobilier Patrimoine. */
    entite: 0,
  },
];

export const ENTITES: Entite[] = [
  {
    raisonSociale: 'Jobard Immobilier Patrimoine',
    role: 'Gérance locative, syndic de copropriété, transaction et estimation — éditeur du site',
    formeJuridique: 'Société par actions simplifiée (SAS)',
    // Donné par le client le 20/10/2026.
    capital: '10\u00a0000\u00a0€',
    siren: '812 198 547',
    siret: '812 198 547 00026',
    rcs: 'RCS Paris 812 198 547',
    codeApe: '68.31Z',
    activite: 'Agences immobilières',
    dateCreation: '17 juin 2015',
    president: 'Florent Jobard',
    // Donné par le client le 20/10/2026 ; la clé (79) est bien celle que
    // donne le SIREN : (12 + 3 × (812198547 mod 97)) mod 97.
    tva: 'FR79812198547',
    /* Relevée sur la carte elle-même le 20/10/2026 (photos recto et verso
       transmises par le client) : titulaire « SAS - Jobard immobilier
       patrimoine, 27 rue de Lisbonne », numéro unique d'identification
       812 198 547 — le SIREN, recoupé —, représentant légal Florent Jobard.
       Les trois activités sont recopiées dans l'ordre et les termes de la
       carte. À METTRE À JOUR À SON RENOUVELLEMENT, avant le 14 mai 2028. */
    carteProfessionnelle: {
      numero: 'CPI 7501 2015 000 001 369',
      delivreePar: 'CCI Paris Île-de-France',
      delivreeLe: '15 mai 2025',
      valableJusquAu: '14 mai 2028',
      mentions: [
        'Transactions sur immeubles et fonds de commerce',
        'Gestion immobilière',
        'Syndic de copropriété',
      ],
    },
    /* Garantie et assurance relevées le 20/10/2026 sur la fiche publique de la
       carte au registre de la CCI (professionnels-immobilier.cci.fr, PDF
       « Carte N° CPI75012015000001369 » transmis par le client) : un même
       organisme pour les trois activités, trois montants. « Non détention de
       fonds » est la mention de la fiche pour la transaction — recopiée telle
       quelle. Le numéro du contrat d'assurance n'y figure pas. */
    garantieFinanciere: {
      organisme: 'GALIAN-SMABTP',
      adresse: '89, rue La Boétie, 75008 Paris',
      montants: [
        { activite: 'Syndic de copropriété', montant: '1\u00a0000\u00a0000\u00a0€' },
        { activite: 'Gestion immobilière', montant: '160\u00a0000\u00a0€' },
        {
          activite: 'Transactions sur immeubles et fonds de commerce',
          montant: '120\u00a0000\u00a0€',
          precision: 'non-détention de fonds',
        },
      ],
    },
    assuranceRcp: {
      assureur: 'GALIAN-SMABTP',
      adresse: '89, rue La Boétie, 75008 Paris',
      contrat: null,
      couvertureGeographique: 'France',
    },
  },
];

/** L'éditeur au sens de la LCEN : la société qui publie le site. */
export const EDITEUR = ENTITES[0];

export const DIRECTEUR_PUBLICATION = 'Florent Jobard, président';

export const HEBERGEUR = {
  nom: 'LWS — Ligne Web Services',
  adresse: '10 rue Penthièvre, 75008 Paris',
  site: 'https://www.lws.fr',
};

/**
 * Médiateur de la consommation, à désigner s'il ne l'est pas encore. Plus
 * affiché depuis le 20/10/2026 (section retirée à la demande du client, voir
 * `MentionsLegales.tsx`) ni compté dans `legalIsIncomplete` : une mention
 * absente de la page ne peut pas la garder hors index. Gardé ici pour la remettre.
 */
export const MEDIATEUR = {
  nom: null as string | null,
  site: null as string | null,
  adresse: null as string | null,
};

/** Vrai tant que des mentions obligatoires manquent — la page le signale. */
export const legalIsIncomplete = ENTITES.some(
  (entite) =>
    !entite.capital ||
    !entite.carteProfessionnelle.numero ||
    !entite.carteProfessionnelle.delivreePar ||
    !entite.garantieFinanciere.organisme ||
    entite.garantieFinanciere.montants.length === 0 ||
    !entite.assuranceRcp.assureur,
);
