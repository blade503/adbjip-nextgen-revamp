/**
 * `fetchpriority` EN MINUSCULES, DÉCLARÉ ICI PARCE QUE LES DEUX CAMPS ONT TORT.
 *
 * `@types/react` 18.3.23 déclare `fetchPriority` en camelCase — mais le runtime
 * de `react-dom` 18.3.1 ne le reconnaît PAS : il émet
 *
 *     Warning: React does not recognize the `fetchPriority` prop on a DOM
 *     element. […] spell it as lowercase `fetchpriority` instead.
 *
 * à chaque chargement de page, pour chaque image concernée. Les types ont
 * devancé l'implémentation.
 *
 * Écrire l'attribut en minuscules supprime l'avertissement et l'attribut arrive
 * bien dans le HTML (vérifié : `fetchpriority="high"` est présent dans les dix
 * pages prérendues) — mais TypeScript le refuse alors, puisque seule la forme
 * camelCase est déclarée. D'où cette augmentation.
 *
 * À SUPPRIMER le jour du passage à React 19, où `fetchPriority` devient une
 * vraie prop reconnue des deux côtés. Le contrôle est simple : retirer ce
 * fichier, relancer `npm run typecheck`, et lire la console du serveur de dev.
 */
declare module 'react' {
  interface ImgHTMLAttributes<T> {
    fetchpriority?: 'high' | 'low' | 'auto';
  }
}

export {};
