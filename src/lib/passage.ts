/**
 * Transitions de page — geste 11 du système de mouvement.
 *
 * `document.startViewTransition` autour de la navigation. Le fondu croisé dure
 * `--d4` (500 ms, réglé dans `index.css`), et la plaque de l'en-tête porte un
 * `view-transition-name` : elle n'est donc pas recréée d'une page à l'autre,
 * elle PERSISTE. C'est le fil narratif de la charte étendu au routage.
 *
 * POURQUOI CE FICHIER EXISTE, alors que React Router 7 a une prop
 * `viewTransition` sur `<Link>` : cette prop n'est lue que par le routeur de
 * données (`createBrowserRouter` + `RouterProvider`). `App.tsx` utilise
 * `BrowserRouter`, où `navigate()` la reçoit et ne l'utilise jamais — vérifié
 * dans la source du paquet, `viewTransitionOpts` n'apparaît que dans
 * `createRouter` et dans l'abonné de `RouterProvider`. Posée ici, la prop
 * n'aurait rien fait, en silence. Si le site passe un jour au routeur de
 * données, ce fichier et `components/systeme/Lien.tsx` disparaissent au profit
 * de la prop native.
 *
 * LE REPLI EST L'ABSENCE. Sans l'API, la navigation est instantanée. Une
 * transition de page n'est pas une fonctionnalité : c'est un agrément, et son
 * absence vaut toujours mieux que sa simulation en JavaScript — laquelle
 * demanderait de retenir l'ancienne page en mémoire, donc de retarder la
 * nouvelle. Aucune simulation, donc, et aucune bibliothèque.
 *
 * PRÉALABLE, et il n'est pas négociable : le correctif de focus de
 * `ScrollManager` doit être en place. Une transition visuelle sans annonce
 * aggraverait le silence pour qui n'a pas d'écran — on ajouterait du confort
 * pour les uns en creusant l'écart pour les autres. Il l'est (focus sur
 * `#contenu` et région `aria-live`), sinon ce fichier n'aurait pas lieu d'être.
 */

import { flushSync } from 'react-dom';

import { sansMouvement } from '@/lib/mouvement';

type Navigation = () => void;

interface AvecTransition {
  startViewTransition?: (rappel: () => void) => { finished: Promise<void> };
}

/**
 * Exécute la navigation dans une transition de vue si le navigateur en a une,
 * et directement sinon.
 *
 * `flushSync` n'est pas décoratif. `startViewTransition` photographie l'état
 * ancien, appelle le rappel, puis photographie le nouveau à la frame suivante.
 * React 18 commit ses mises à jour dans une microtâche : sans forçage, la
 * seconde photo peut tomber sur un DOM encore inchangé, et la transition
 * fondrait la page sur elle-même. C'est exactement ce que fait le routeur de
 * données en interne. L'appel est légitime ici : on est dans un gestionnaire
 * d'événement, jamais pendant un rendu.
 *
 * Le mouvement réduit court-circuite : une transition de page est du mouvement
 * décoratif, elle ne porte aucune information, donc elle se supprime
 * entièrement — contrairement à l'indication d'attente, qui elle en porte une.
 */
export function avecPassage(navigation: Navigation) {
  const doc = document as Document & AvecTransition;

  // `sansMouvement()` couvre les deux cas : réglage système ET `?mouvement=0`.
  if (typeof doc.startViewTransition !== 'function' || sansMouvement()) {
    navigation();
    return;
  }

  doc.startViewTransition(() => {
    flushSync(navigation);
  });
}
