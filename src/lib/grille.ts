/**
 * Classes de grille adaptées au nombre d'éléments.
 *
 * Une grille à trois colonnes qui ne reçoit qu'un élément l'affiche coincé à
 * gauche, avec deux tiers de vide à droite — l'écran a l'air cassé. Le contenu
 * de ce site varie : le portefeuille peut tomber à une annonce, les avis
 * clients arrivent au compte-gouttes. La grille doit suivre, pas l'inverse.
 *
 * En dessous de trois éléments, on réduit le nombre de colonnes *et* on borne
 * la largeur : deux cartes étirées sur toute la page paraissent aussi bancales
 * qu'une seule.
 */

export interface OptionsGrille {
  /** Colonnes au maximum, quand les éléments sont assez nombreux. */
  max?: 2 | 3;
}

export function classesGrille(nombre: number, { max = 3 }: OptionsGrille = {}): string {
  if (nombre <= 1) return 'mx-auto max-w-md';
  if (nombre === 2) return 'mx-auto max-w-4xl sm:grid-cols-2';
  return max === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3';
}
