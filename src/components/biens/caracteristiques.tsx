import type { ReactNode } from 'react';

import type { Bien } from '@/lib/biens';

/**
 * Les caractéristiques d'une annonce, sans celles que la source ne donne pas.
 *
 * Dans son propre fichier parce qu'il rend du JSX (l'exposant de l'étage :
 * `ᵉ` est hors police, on écrit `<sup>e</sup>`) sans être un composant — un
 * fichier qui exporte à la fois des composants et des fonctions casse le
 * rafraîchissement à chaud de Vite.
 */
export const caracteristiques = (bien: Bien) =>
  [
    bien.surface ? { cle: 'surface', libelle: 'surface', rendu: <>{bien.surface} m²</> } : null,
    bien.rooms
      ? { cle: 'pieces', libelle: bien.rooms > 1 ? 'pièces' : 'pièce', rendu: <>{bien.rooms}</> }
      : null,
    bien.bedrooms
      ? { cle: 'chambres', libelle: bien.bedrooms > 1 ? 'chambres' : 'chambre', rendu: <>{bien.bedrooms}</> }
      : null,
    bien.floor
      ? {
          cle: 'etage',
          libelle: bien.features.elevator ? 'étage · ascenseur' : 'étage',
          rendu: (
            <>
              {bien.floor}
              <sup>e</sup>
            </>
          ),
        }
      : null,
  ].filter(Boolean) as { cle: string; libelle: string; rendu: ReactNode }[];
