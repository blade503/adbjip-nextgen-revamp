/**
 * L'INTERRUPTEUR DE MOUVEMENT.
 *
 * `?mouvement=0` neutralise tout le système d'animation, et le choix est
 * mémorisé pour la session : on peut donc naviguer d'une page à l'autre sans
 * réécrire le paramètre. `?mouvement=1` le rétablit.
 *
 * À QUOI ÇA SERT, concrètement : déboguer un rendu chez un client sans
 * redéployer, et trancher une discussion sur une animation en montrant la page
 * avec et sans, côte à côte, dans deux onglets.
 *
 * DIFFÉRENCE AVEC `prefers-reduced-motion`, et elle est importante :
 *
 *  - le réglage système est un besoin d'accessibilité. Il RALENTIT les
 *    indicateurs d'attente au lieu de les couper, parce qu'un bloc gris
 *    immobile sans animation ne se lit plus comme un chargement.
 *  - cet interrupteur est un outil de mise au point. Il coupe TOUT, indicateurs
 *    compris, parce qu'on veut voir la page telle qu'elle est peinte.
 *
 * Les deux ont en commun la règle non négociable : ne jamais retirer une
 * information. Les apparitions partent d'`opacity: 0` ; les neutraliser veut
 * dire les forcer à `opacity: 1`, jamais poser `animation: none`.
 *
 * L'attribut est posé sur `<html>` par un script synchrone dans `index.html`,
 * donc AVANT la première peinture — sinon la page s'animerait le temps que le
 * bundle arrive, ce qui est exactement ce qu'on cherche à supprimer.
 */

const CLE = 'jip:mouvement';

/** Vrai si l'interrupteur a été mis à l'arrêt. Lit l'attribut, pas l'URL. */
export function mouvementCoupe(): boolean {
  if (typeof document === 'undefined') return false;
  return document.documentElement.dataset.mouvement === '0';
}

/**
 * Vrai s'il faut renoncer à animer : interrupteur à l'arrêt OU réglage système.
 * C'est le test que doivent employer les modules, plutôt que d'interroger
 * `matchMedia` chacun de leur côté.
 */
export function sansMouvement(): boolean {
  if (mouvementCoupe()) return true;
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Rétablit ou coupe le mouvement et mémorise le choix pour la session. */
export function reglerMouvement(actif: boolean) {
  const racine = document.documentElement;
  if (actif) delete racine.dataset.mouvement;
  else racine.dataset.mouvement = '0';
  try {
    sessionStorage.setItem(CLE, actif ? '1' : '0');
  } catch {
    // Navigation privée ou stockage refusé : le paramètre d'URL suffit.
  }
}
