/**
 * Avis clients affichés sur le site.
 *
 * RÈGLE ABSOLUE : uniquement des avis réels, recopiés **mot pour mot** depuis la
 * fiche Google de l'agence, avec le prénom et la date d'origine. Rien d'écrit
 * ici à la main, rien de reformulé, rien d'embelli — les faux témoignages
 * précédents (Marie Dubois, Pierre Martin, Sophie Laurent) ont justement été
 * supprimés du site le 14/08/2026.
 *
 * La liste est vide tant que les textes n'ont pas été récupérés : la section ne
 * s'affiche pas du tout dans ce cas. Les avis ne sont pas lisibles sans compte
 * Google connecté — les récupérer depuis la fiche Google Business de l'agence,
 * ou depuis maps.google.com en étant connecté.
 *
 * Point de vigilance : n'afficher qu'une sélection d'avis favorables sans donner
 * accès aux autres est la pratique que la DGCCRF sanctionne. D'où le lien vers
 * la fiche, affiché avec la sélection — il mène à l'ensemble des avis, négatifs
 * compris.
 */

export interface AvisClient {
  /** Nom tel qu'affiché sur Google, sans retouche. */
  auteur: string;
  /**
   * Note attribuée, de 1 à 5, relevée sur la fiche. Facultative : les étoiles
   * ne s'affichent que si le chiffre est connu, plutôt que d'être supposé.
   */
  note?: number;
  /** Texte intégral de l'avis, sans coupe ni retouche. */
  texte: string;
  /** Mois et année de publication, ex. « mars 2026 ». */
  date: string;
}

export const AVIS: AvisClient[] = [
  {
    auteur: 'georgi',
    note: 5,
    texte:
      "J'ai eu des difficultés avec ma locataire qui avait dégradé mon appartement. " +
      "M. Jobard a su gérer mon appartement et être un très bon conciliateur dans la " +
      "gestion de ce conflit. Il a aussi su me récupérer un logement décent ! " +
      'Service de gérance au Top !',
    date: 'janvier 2026',
  },
  {
    auteur: 'Mathieu Brovillé',
    note: 5,
    texte:
      "Syndic de mon immeuble depuis des années. A l'écoute, facilement joignable, " +
      "réactif et connaissant les dossiers de l'immeuble sur le bout des doigts. " +
      'Je conseille totalement Monsieur Jobard et son équipe.',
    date: 'novembre 2025',
  },
  {
    auteur: 'Magali Barthonet',
    note: 5,
    texte:
      'Une gestion locative irréprochable, des conseils avisés, un personnel à ' +
      "l'écoute et réactif. Merci au cabinet J.I.P, je vous le recommande!",
    date: 'novembre 2025',
  },
];

/**
 * Fiche Google de l'agence.
 *
 * `valeur` est conservée à titre de repère mais **n'est pas affichée** : à 3,1,
 * la moyenne dessert plus qu'elle ne rassure. Décision de l'agence, à revoir le
 * jour où elle repasse au-dessus de 4 — ce que quelques avis sollicités auprès
 * de clients satisfaits suffiraient à obtenir, vu le faible volume total.
 */
export const NOTE_GOOGLE = {
  valeur: 3.1,
  /** Nombre d'avis : non lisible sans être connecté, à relever côté agence. */
  nombre: null as number | null,
  releveeLe: '14/08/2026',
  url: 'https://www.google.com/maps/place/J.I.P+Jobard+Immobilier+Paris',
};
