import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Ce qui se passe au changement de page : défilement, FOCUS et ANNONCE.
 *
 * Remonter en haut à chaque navigation, sauf si l'URL porte une ancre : dans ce
 * cas on rejoint la section visée. React Router ne gère pas les ancres lui-même
 * — sans ce composant, un lien vers /#services ou vers
 * /services/estimation-biens#calculateur-rapide ne produit strictement rien à
 * l'écran, ce qui donne l'impression d'un bouton mort.
 *
 * LE FOCUS ET L'ANNONCE SONT LA PARTIE QUI MANQUAIT, et c'était un défaut
 * d'accessibilité, pas un manque de confort. Ce site est une application à page
 * unique : la navigation ne recharge rien. La page défilait donc bien en haut,
 * mais le focus restait sur un lien qui venait d'être démonté — il retombait
 * sur `<body>`. Conséquences pour qui n'a pas d'écran :
 *
 *  - aucune annonce : rien n'indique qu'on a changé de page ;
 *  - le curseur virtuel repart du haut du document, donc on retraverse le lien
 *    d'évitement, l'en-tête et les cinq entrées du menu à chaque navigation ;
 *  - la touche Tab reprend au début, alors qu'on venait d'activer un lien à
 *    mi-page.
 *
 * D'où les deux ajouts :
 *  1. le focus va sur `#contenu`, qui porte déjà `tabIndex={-1}` sur les onze
 *    pages, avec `preventScroll` — sans quoi le navigateur ferait défiler la
 *    cible sous l'en-tête collant et masquerait celui-ci ;
 *  2. le nom de la page est écrit dans une région `aria-live="polite"`, lue
 *    juste après.
 *
 * Le nom vient du `<h1>` et non de `document.title` : `SEOHead` pose le titre
 * dans son propre effet, et comme ScrollManager est un frère déclaré AVANT
 * `<Routes>`, son effet passe le premier — `document.title` porte encore celui
 * de la page précédente à cet instant. Le DOM, lui, est déjà commité : le
 * `<h1>` de la nouvelle page est là. `document.title` reste en repli.
 *
 * Rien au premier rendu : arriver sur une page n'est pas y naviguer. Voler le
 * focus au chargement ferait sauter le lien d'évitement et déplacerait un
 * curseur que le visiteur n'a pas encore posé.
 */
const ScrollManager = () => {
  const { pathname, hash } = useLocation();
  const [annonce, setAnnonce] = useState('');
  const premierRendu = useRef(true);

  useEffect(() => {
    const premier = premierRendu.current;
    premierRendu.current = false;

    /** Le nom de la page, pour la région vocale. Voir l'en-tête du fichier. */
    const nomDePage = () =>
      document.querySelector('main h1')?.textContent?.trim() || document.title;

    if (!hash) {
      window.scrollTo(0, 0);
      if (premier) return;

      document.getElementById('contenu')?.focus({ preventScroll: true });
      setAnnonce(`${nomDePage()} — page chargée`);
      return;
    }

    // La section visée peut ne pas être encore montée au moment de la
    // navigation : on retente sur les frames suivantes avant d'abandonner.
    let restant = 10;
    let frame = 0;

    const rejoindre = () => {
      const cible = document.getElementById(hash.slice(1));
      if (cible) {
        cible.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Le défilement seul laissait le même trou que pour les pages : on voit
        // la section arriver, mais le focus n'a pas bougé. On le pose sur la
        // cible, en lui donnant un `tabindex` négatif si elle n'en a pas —
        // négatif, donc la cible reste hors du parcours de tabulation.
        if (!premier) {
          if (!cible.hasAttribute('tabindex')) cible.setAttribute('tabindex', '-1');
          cible.focus({ preventScroll: true });
        }
        return;
      }
      if (restant-- > 0) frame = requestAnimationFrame(rejoindre);
      else window.scrollTo(0, 0);
    };

    frame = requestAnimationFrame(rejoindre);

    // Une ancre à l'intérieur de la même page ne change pas de page : on
    // n'annonce que si le chemin a bougé.
    if (!premier) setAnnonce(`${nomDePage()} — page chargée`);

    return () => cancelAnimationFrame(frame);
  }, [pathname, hash]);

  /**
   * La région doit être présente dans le DOM AVANT d'être remplie : une région
   * vocale créée en même temps que son contenu n'est pas annoncée de façon
   * fiable. Elle est donc rendue en permanence, vide au chargement.
   */
  return (
    <p aria-live="polite" aria-atomic="true" className="sr-only">
      {annonce}
    </p>
  );
};

export default ScrollManager;
