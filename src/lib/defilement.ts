/**
 * L'UNIQUE écouteur de défilement du site.
 *
 * Il y en avait deux — un dans `Header.tsx` pour le seuil de resserrement, un
 * dans `Hero.tsx` pour `--descente`. Chacun était correct pris seul, mais deux
 * écouteurs veulent dire deux lots de calculs de position par événement de
 * molette, et le contrat du système de mouvement en demande un.
 *
 * Il écrit DEUX choses sur `<html>`, et pas une de plus :
 *   --descente    de 0 à 1 sur la hauteur de l'ouverture — lue par les plans,
 *                 la lumière et la couture du seuil ;
 *   data-defile   « 1 » au-delà de 24 px — lu par l'en-tête, EN CSS.
 *
 * Le seuil de l'en-tête passe par un attribut et non par un état React : au ras
 * du zéro, chaque franchissement provoquait un rendu, et le composant n'a rien
 * à recalculer pour ça. Une classe CSS suffit, et le rendu n'a jamais lieu.
 *
 * Un seul `requestAnimationFrame` par trame au plus : l'événement de défilement
 * arrive plus souvent que les trames, on ne lit la position qu'une fois.
 */

/** Hauteur de référence pour `--descente`. Posée par l'ouverture au montage. */
let hauteurOuverture = 0;

/**
 * Seuil du resserrement : 24 px et non 0. Au ras du zéro, le moindre rebond de
 * défilement faisait battre la hauteur de l'en-tête.
 */
const SEUIL_ENTETE = 24;

let attache = false;
let attend = false;

function lire() {
  attend = false;
  const racine = document.documentElement;
  const y = window.scrollY;

  if (hauteurOuverture > 0) {
    const p = Math.min(1, Math.max(0, y / hauteurOuverture));
    racine.style.setProperty('--descente', p.toFixed(4));
  }

  const resserre = y > SEUIL_ENTETE ? '1' : '0';
  if (racine.dataset.defile !== resserre) racine.dataset.defile = resserre;
}

function surDefilement() {
  if (attend) return;
  attend = true;
  requestAnimationFrame(lire);
}

/**
 * Branche l'écouteur. Idempotent : appelé par l'ouverture et par l'en-tête, il
 * n'attache qu'une fois.
 */
export function brancherDefilement() {
  if (attache) return;
  attache = true;
  window.addEventListener('scroll', surDefilement, { passive: true });
  lire();
}

/** L'ouverture déclare sa hauteur ; sans elle, `--descente` n'est pas écrite. */
export function declarerHauteurOuverture(h: number) {
  hauteurOuverture = h;
  lire();
}
