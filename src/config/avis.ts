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
 * Point de vigilance : n'afficher qu'une sélection d'avis favorables sans
 * indiquer la note globale est précisément la pratique que la DGCCRF sanctionne.
 * D'où `NOTE_GOOGLE` et le lien vers la fiche, affichés avec les avis.
 */

export interface AvisClient {
  /** Prénom et initiale tels qu'affichés sur Google. */
  auteur: string;
  /** Note attribuée, de 1 à 5. */
  note: number;
  /** Texte intégral de l'avis, sans coupe ni retouche. */
  texte: string;
  /** Mois et année de publication, ex. « mars 2026 ». */
  date: string;
}

export const AVIS: AvisClient[] = [
  // Exemple de la forme attendue — à remplacer par les avis réels :
  // { auteur: 'Claire M.', note: 5, texte: '…', date: 'mars 2026' },
];

/** Note globale relevée sur la fiche Google le 14/08/2026. À réactualiser. */
export const NOTE_GOOGLE = {
  valeur: 3.1,
  /** Nombre d'avis : non lisible sans être connecté, à relever côté agence. */
  nombre: null as number | null,
  releveeLe: '14/08/2026',
  url: 'https://www.google.com/maps/place/J.I.P+Jobard+Immobilier+Paris',
};
