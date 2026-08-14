import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Position du défilement à chaque navigation.
 *
 * Remonter en haut à chaque changement de page, sauf si l'URL porte une ancre :
 * dans ce cas on rejoint la section visée. React Router ne gère pas les ancres
 * lui-même — sans ce composant, un lien vers /#services ou vers
 * /services/estimation-biens#calculateur-rapide ne produit strictement rien à
 * l'écran, ce qui donne l'impression d'un bouton mort.
 */
const ScrollManager = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
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
        return;
      }
      if (restant-- > 0) frame = requestAnimationFrame(rejoindre);
      else window.scrollTo(0, 0);
    };

    frame = requestAnimationFrame(rejoindre);
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash]);

  return null;
};

export default ScrollManager;
