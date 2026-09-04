/**
 * L'agence est-elle ouverte à cet instant ?
 *
 * Horaires réels : du lundi au vendredi, 9 h – 13 h et 14 h – 17 h — ceux de
 * `HORAIRES` dans `src/config/legal.ts`, repris de la fiche Google. C'est ce
 * calcul qui décide de la couleur du point à côté du numéro dans l'en-tête.
 *
 * Fonction pure : elle prend une date et rend un état, pour être testable et
 * ne dépendre ni du DOM ni de l'horloge.
 */
export function etatAgence(d: Date) {
  const jour = d.getDay();
  const minutes = d.getHours() * 60 + d.getMinutes();
  const semaine = jour >= 1 && jour <= 5;
  const ouvert = semaine && ((minutes >= 540 && minutes < 780) || (minutes >= 840 && minutes < 1020));

  if (ouvert) return { ouvert: true, texte: 'Ouvert — appelez' };
  if (semaine && minutes < 540) return { ouvert: false, texte: 'Ouvre à 9 h' };
  if (semaine && minutes >= 780 && minutes < 840) return { ouvert: false, texte: 'Ouvre à 14 h' };
  if (jour >= 1 && jour <= 4) return { ouvert: false, texte: 'Ouvre demain à 9 h' };
  return { ouvert: false, texte: 'Ouvre lundi à 9 h' };
}
