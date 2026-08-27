/**
 * Le lien interne du site — un `<Link>` de React Router qui passe par
 * `avecPassage`, donc par `document.startViewTransition`.
 *
 * C'est le SEUL point de branchement des transitions de page : les 40 liens
 * internes passent par ici, aucun appel à `startViewTransition` n'est dispersé
 * dans les pages. Voir `src/lib/passage.ts` pour la raison pour laquelle la
 * prop `viewTransition` de React Router 7 ne pouvait pas servir.
 *
 * Ce composant ne réimplémente pas `<Link>`, il en reprend les garde-fous de
 * clic, qui sont la seule partie subtile : un clic milieu, un clic avec
 * modificateur ou une cible explicite ne sont PAS des navigations internes, et
 * les intercepter casserait « ouvrir dans un nouvel onglet ». Les props
 * réellement employées sur le site sont `to`, `className` et un `onClick` —
 * relevé avant d'écrire ce fichier.
 */

import { forwardRef, type AnchorHTMLAttributes, type MouseEvent } from 'react';
import { useHref, useNavigate, type To } from 'react-router-dom';

import { avecPassage } from '@/lib/passage';

type ProprietesLien = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  to: To;
  replace?: boolean;
  state?: unknown;
};

export const Lien = forwardRef<HTMLAnchorElement, ProprietesLien>(function Lien(
  { to, replace, state, target, onClick, ...reste },
  ref,
) {
  const href = useHref(to);
  const naviguer = useNavigate();

  function auClic(evenement: MouseEvent<HTMLAnchorElement>) {
    onClick?.(evenement);
    if (evenement.defaultPrevented) return;

    // Laisser le navigateur faire son travail : clic milieu ou droit, nouvel
    // onglet, nouvelle fenêtre, cible explicite. Intercepter ces gestes serait
    // une régression fonctionnelle, pas un agrément visuel.
    const modifie =
      evenement.metaKey || evenement.altKey || evenement.ctrlKey || evenement.shiftKey;
    if (evenement.button !== 0 || modifie || (target && target !== '_self')) return;

    evenement.preventDefault();
    avecPassage(() => naviguer(to, { replace, state }));
  }

  return <a ref={ref} href={href} target={target} onClick={auClic} {...reste} />;
});
