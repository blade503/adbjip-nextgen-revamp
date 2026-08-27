/**
 * Décalage d'entrée entre éléments frères, en millisecondes.
 *
 * 70 ms, plafonnés à six éléments. Sans plafond, une grille de douze annonces
 * fait attendre la dernière presque une seconde après la première — le visiteur
 * voit alors la page se remplir au lieu de la voir arriver. Au-delà du sixième,
 * tout entre ensemble.
 *
 * La fonction vit ici et non dans `components/systeme/Ouverture.tsx` : un
 * fichier qui exporte à la fois des composants et des utilitaires casse le
 * rafraîchissement à chaud de Vite.
 */
export const echelonner = (index: number) => Math.min(index, 5) * 70;
